#!/usr/bin/env node

import {
  iconRegistry,
  layoutRegistry,
  listDiagramTypes,
  ProfileType,
  registerDefaultShapes,
  validateDiagramType,
  type DiagramAst,
  type DiagramProfile,
  type DiagramType,
  type WardleyProfile,
} from '@runiq/core';
import { fontAwesome } from '@runiq/icons-fontawesome';
import { astToJson, jsonToAst } from '@runiq/io-json';
import { ElkLayoutEngine } from '@runiq/layout-base';
import { parse, type ParseResult } from '@runiq/parser-dsl';
import {
  renderGitGraph,
  renderKanban,
  renderRailroadDiagram,
  renderSequenceDiagram,
  renderSvg,
  renderTimeline,
  renderTreemap,
  renderWardleyMap,
} from '@runiq/renderer-svg';
import { renderDigital, renderSchematic } from '@runiq/renderer-schematic';
import { Command } from 'commander';
import { promises as fs } from 'fs';
import path from 'path';

// Register default providers
registerDefaultShapes();
layoutRegistry.register(new ElkLayoutEngine());
iconRegistry.register(fontAwesome);

/**
 * Helper function to extract DiagramProfile from ParseResult
 * For backward compatibility with single-diagram DSL files
 */
function extractDiagramFromParseResult(result: ParseResult): DiagramAst | null {
  if (!result.success || !result.document) {
    return null;
  }

  const doc = result.document;

  // Find the first diagram profile
  const diagramProfile = doc.profiles.find(
    (p): p is DiagramProfile => p.type === ProfileType.DIAGRAM
  );

  if (!diagramProfile) {
    return null;
  }

  // Convert DiagramProfile to DiagramAst for backward compatibility
  const ast: DiagramAst = {
    astVersion: doc.astVersion,
    title: diagramProfile.name,
    direction: diagramProfile.direction,
    styles: diagramProfile.styles,
    nodes: diagramProfile.nodes,
    edges: diagramProfile.edges,
    groups: diagramProfile.groups,
    containers: diagramProfile.containers,
  };

  return ast;
}

function normalizeDataSourceOptions(
  options?: Array<{ name: string; value: string | number | boolean }>
): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  if (!options) return normalized;
  for (const option of options) {
    normalized[option.name] = option.value;
  }
  return normalized;
}

function parseCsvRows(content: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      row.push(current.trim());
      current = '';
      continue;
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      row.push(current.trim());
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      current = '';
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.some((cell) => cell.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
}

function parseCsvToObjects(
  content: string,
  options: Record<string, unknown>
): Array<Record<string, unknown>> {
  const delimiter =
    (typeof options.sep === 'string' && options.sep) ||
    (typeof options.delimiter === 'string' && options.delimiter) ||
    ',';
  const hasHeader =
    (options.hasHeader === undefined ? options.header : options.hasHeader) ??
    true;

  const rows = parseCsvRows(content, delimiter);
  if (rows.length === 0) {
    return [];
  }

  if (hasHeader) {
    const headers = rows[0].map((h) => h.trim());
    return rows.slice(1).map((row) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        const value = row[index] ?? '';
        const numberValue = Number(value);
        obj[header] = Number.isNaN(numberValue) ? value : numberValue;
      });
      return obj;
    });
  }

  return rows.map((row, index) => ({
    index: index + 1,
    values: row,
  }));
}

function extractChartValues(
  data: unknown
): { values: unknown[]; labels?: string[] } | null {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return { values: [] };
    }

    if (typeof data[0] === 'object' && data[0] !== null) {
      const firstObj = data[0] as Record<string, unknown>;
      const keys = Object.keys(firstObj);
      const numericKey = keys.find((k) => typeof firstObj[k] === 'number');
      const labelKey = keys.find((k) => typeof firstObj[k] === 'string');

      if (numericKey) {
        const values = data.map((item: any) => item[numericKey]);
        const labels =
          labelKey !== undefined
            ? data.map((item: any) => item[labelKey])
            : undefined;
        return { values, labels };
      }
    }

    return { values: data };
  }

  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.values)) {
      return {
        values: obj.values,
        labels: Array.isArray(obj.labels) ? obj.labels : undefined,
      };
    }
    const firstKey = Object.keys(obj)[0];
    if (firstKey && Array.isArray(obj[firstKey])) {
      return extractChartValues(obj[firstKey]);
    }
  }

  return null;
}

function buildSankeyDataFromRows(
  rows: Array<Record<string, unknown>>
): Record<string, unknown> | null {
  if (rows.length === 0) {
    return { nodes: [], links: [] };
  }

  const links: Array<Record<string, unknown>> = [];
  const nodes = new Map<string, { id: string; label?: string; color?: string }>();

  for (const row of rows) {
    const rowLower: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      rowLower[key.toLowerCase()] = value;
    }

    const source = String(rowLower.source ?? rowLower.from ?? '');
    const target = String(rowLower.target ?? rowLower.to ?? '');
    const valueRaw = rowLower.value ?? rowLower.amount ?? rowLower.size;
    const value = Number(valueRaw);

    if (!source || !target || Number.isNaN(value)) {
      return null;
    }

    const link: Record<string, unknown> = {
      source,
      target,
      value,
    };

    if (rowLower.label || rowLower.linklabel) {
      link.label = String(rowLower.label ?? rowLower.linklabel);
    }
    if (rowLower.color || rowLower.linkcolor) {
      link.color = String(rowLower.color ?? rowLower.linkcolor);
    }

    links.push(link);

    const sourceLabel = rowLower.sourcelabel ? String(rowLower.sourcelabel) : undefined;
    const targetLabel = rowLower.targetlabel ? String(rowLower.targetlabel) : undefined;
    const sourceColor = rowLower.sourcecolor ? String(rowLower.sourcecolor) : undefined;
    const targetColor = rowLower.targetcolor ? String(rowLower.targetcolor) : undefined;

    if (!nodes.has(source)) {
      nodes.set(source, { id: source, label: sourceLabel, color: sourceColor });
    }
    if (!nodes.has(target)) {
      nodes.set(target, { id: target, label: targetLabel, color: targetColor });
    }
  }

  return { nodes: Array.from(nodes.values()), links };
}

function normalizeSankeyData(data: unknown): Record<string, unknown> | null {
  if (!data) return null;

  if (Array.isArray(data)) {
    return buildSankeyDataFromRows(data as Array<Record<string, unknown>>);
  }

  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const nodes = obj.nodes;
    const links = obj.links;

    if (Array.isArray(links)) {
      const sanitizedLinks = links
        .map((link: any) => ({
          ...link,
          value: Number(link.value),
        }))
        .filter((link: any) => link.source && link.target && !Number.isNaN(link.value));

      const normalizedNodes = Array.isArray(nodes)
        ? nodes
        : Array.from(
            new Set(
              sanitizedLinks
                .flatMap((link: any) => [link.source, link.target])
                .filter(Boolean)
            )
          ).map((id) => ({ id }));

      return { ...obj, nodes: normalizedNodes, links: sanitizedLinks };
    }
  }

  return null;
}

async function resolveDataSourcesForDiagram(
  profile: any,
  baseDir: string,
  warnings: string[]
): Promise<void> {
  const sources = profile?.dataSources;
  if (!Array.isArray(sources) || !Array.isArray(profile.nodes)) {
    return;
  }

  const chartShapes = new Set([
    'lineChart',
    'radarChart',
    'pieChart',
    'barChart',
    'pyramidShape',
    'venn2Shape',
    'venn3Shape',
    'sankeyChart',
  ]);

  const resolved = new Map<string, unknown>();

  for (const source of sources) {
    const format = source.format;
    const key = source.key;
    const src = source.source;
    const options = normalizeDataSourceOptions(source.options);

    if (!format || !key || !src) continue;

    try {
      if (format === 'json') {
        let content = src;
        if (!src.trim().startsWith('{') && !src.trim().startsWith('[')) {
          const fullPath = path.resolve(baseDir, src);
          content = await fs.readFile(fullPath, 'utf-8');
        }
        resolved.set(key, JSON.parse(content));
      } else if (format === 'csv') {
        let content = src;
        const looksInline =
          src.includes('\n') || src.includes('\r') || src.includes(',');
        if (!looksInline) {
          const fullPath = path.resolve(baseDir, src);
          content = await fs.readFile(fullPath, 'utf-8');
        }
        resolved.set(key, parseCsvToObjects(content, options));
      } else {
        warnings.push(`Datasource "${key}" uses unsupported format "${format}".`);
      }
    } catch (error) {
      warnings.push(
        `Failed to load datasource "${key}": ${
          error instanceof Error ? error.message : 'unknown error'
        }`
      );
    }
  }

  for (const node of profile.nodes) {
    if (!node.dataSource || !chartShapes.has(node.shape)) continue;
    const data = resolved.get(node.dataSource);
    if (!data) {
      warnings.push(`Datasource "${node.dataSource}" not found for shape "${node.id}".`);
      continue;
    }

    if (node.shape === 'sankeyChart') {
      const sankeyData = normalizeSankeyData(data);
      if (!sankeyData) {
        warnings.push(`Datasource "${node.dataSource}" does not match Sankey data format.`);
        continue;
      }
      node.data = { ...(node.data || {}), ...sankeyData };
      continue;
    }

    const chartData = extractChartValues(data);
    if (!chartData) {
      warnings.push(`Datasource "${node.dataSource}" could not map to chart values.`);
      continue;
    }

    node.data = {
      ...(node.data || {}),
      values: chartData.values,
      labels: chartData.labels ?? node.data?.labels,
    };
  }
}

const program = new Command();

program
  .name('runiq')
  .description('Runiq diagram DSL compiler')
  .version('0.1.0');

program
  .command('render')
  .description('Render a diagram to SVG')
  .argument('<input>', 'Input file (.runiq, .md, or .json)')
  .option('-o, --output <file>', 'Output SVG file')
  .option('--strict', 'Use strict SVG mode (no enhanced features)')
  .option('--layout <engine>', 'Layout engine to use', 'elk')
  .option(
    '--type <type>',
    'Diagram type for validation (flowchart, sequence, entity-relationship, state-machine)'
  )
  .action(async (input: string, options: any) => {
    try {
      const content = await fs.readFile(input, 'utf-8');
      let ast;
      let renderProfileType: string | null = null;
      let nonDiagramProfile: any = null;

      // Parse based on file extension or content
      if (input.endsWith('.json')) {
        const result = jsonToAst(content);
        if (!result.success) {
          console.error('JSON parse failed:');
          result.problems.forEach((p: any) => console.error(`  ${p}`));
          process.exit(1);
        }
        ast = result.data!;
      } else {
        // Extract DSL from markdown fenced code block if needed
        const dslContent = input.endsWith('.md')
          ? extractDslFromMarkdown(content)
          : content;
        const result = parse(dslContent);
        if (!result.success) {
          console.error('DSL parse failed:');
          result.errors.forEach((e: string) => console.error(`  ${e}`));
          process.exit(1);
        }

        const profile = result.document?.profiles?.[0];
        renderProfileType = profile?.type ?? null;
        nonDiagramProfile = profile ?? null;

        const dataSourceWarnings: string[] = [];
        if (profile?.type === ProfileType.DIAGRAM) {
          await resolveDataSourcesForDiagram(
            profile,
            path.dirname(input),
            dataSourceWarnings
          );
        }

        if (dataSourceWarnings.length > 0) {
          console.warn('Datasource warnings:');
          dataSourceWarnings.forEach((w) => console.warn(`  ${w}`));
        }

        if (renderProfileType === ProfileType.DIAGRAM) {
          ast = extractDiagramFromParseResult(result);
          if (!ast) {
            console.error('No diagram profile found in document');
            process.exit(1);
          }
        } else if (!nonDiagramProfile) {
          console.error('No profile found in document');
          process.exit(1);
        }
      }

      // Handle non-diagram profiles (no layout needed)
      if (renderProfileType && renderProfileType !== ProfileType.DIAGRAM) {
        let renderResult: { svg: string; warnings: string[] } | null = null;

        if (renderProfileType === ProfileType.WARDLEY) {
          renderResult = renderWardleyMap(nonDiagramProfile as WardleyProfile);
        } else if (renderProfileType === ProfileType.RAILROAD) {
          renderResult = renderRailroadDiagram(nonDiagramProfile as any);
        } else if (renderProfileType === ProfileType.SEQUENCE) {
          renderResult = renderSequenceDiagram(nonDiagramProfile as any);
        } else if (renderProfileType === ProfileType.TIMELINE) {
          renderResult = renderTimeline(nonDiagramProfile as any);
        } else if (renderProfileType === ProfileType.KANBAN) {
          renderResult = renderKanban(nonDiagramProfile as any);
        } else if (renderProfileType === ProfileType.GITGRAPH) {
          renderResult = renderGitGraph(nonDiagramProfile as any);
        } else if (renderProfileType === ProfileType.TREEMAP) {
          renderResult = renderTreemap(nonDiagramProfile as any);
        } else if (
          renderProfileType === ProfileType.ELECTRICAL ||
          renderProfileType === ProfileType.PNEUMATIC ||
          renderProfileType === ProfileType.HYDRAULIC ||
          renderProfileType === ProfileType.HVAC ||
          renderProfileType === ProfileType.CONTROL
        ) {
          renderResult = renderSchematic(nonDiagramProfile as any, {
            gridSize: 50,
            routing: 'orthogonal',
            showNetLabels: true,
            showValues: true,
            showReferences: true,
          });
        } else if (renderProfileType === ProfileType.DIGITAL) {
          renderResult = renderDigital(nonDiagramProfile as any, {
            gridSize: 50,
            routing: 'orthogonal',
            showNetLabels: true,
            showValues: false,
            showReferences: true,
          });
        }

        if (!renderResult) {
          console.error(`Unsupported profile type: ${renderProfileType}`);
          process.exit(1);
        }

        if (renderResult.warnings.length > 0) {
          console.warn('Warnings:');
          renderResult.warnings.forEach((w) => console.warn(`  ${w}`));
        }

        // Output
        if (options.output) {
          await fs.writeFile(options.output, renderResult.svg);
          console.log(`SVG written to ${options.output}`);
        } else {
          console.log(renderResult.svg);
        }
        return;
      }

      // Standard diagram rendering (with layout)
      // Ensure ast is defined
      if (!ast) {
        console.error('No diagram AST available');
        process.exit(1);
      }

      // Validate diagram type if specified
      if (options.type) {
        const validationResult = validateDiagramType(
          ast,
          options.type as DiagramType
        );
        if (!validationResult.valid) {
          console.error(
            `Diagram type validation failed for type "${options.type}":`
          );
          validationResult.errors.forEach((e) =>
            console.error(`  ✗ ${e.message}`)
          );
          if (validationResult.warnings.length > 0) {
            console.warn('Warnings:');
            validationResult.warnings.forEach((w) =>
              console.warn(`  ⚠ ${w.message}`)
            );
          }
          process.exit(1);
        }
        if (validationResult.warnings.length > 0) {
          console.warn('Validation warnings:');
          validationResult.warnings.forEach((w) =>
            console.warn(`  ⚠ ${w.message}`)
          );
        }
      }

      // Layout
      const layoutEngine = layoutRegistry.get(options.layout);
      if (!layoutEngine) {
        console.error(`Unknown layout engine: ${options.layout}`);
        process.exit(1);
      }

      const layout = await layoutEngine.layout(ast);

      // Render
      const renderResult = renderSvg(ast, layout, { strict: options.strict });

      if (renderResult.warnings.length > 0) {
        console.warn('Warnings:');
        renderResult.warnings.forEach((w) => console.warn(`  ${w}`));
      }

      // Output
      if (options.output) {
        await fs.writeFile(options.output, renderResult.svg);
        console.log(`SVG written to ${options.output}`);
      } else {
        console.log(renderResult.svg);
      }
    } catch (error) {
      console.error(
        'Error:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      process.exit(1);
    }
  });

program
  .command('check')
  .description('Validate a diagram file')
  .argument('<input>', 'Input file to validate')
  .option(
    '--type <type>',
    'Diagram type for validation (flowchart, sequence, entity-relationship, state-machine)'
  )
  .action(async (input: string, options: any) => {
    try {
      const content = await fs.readFile(input, 'utf-8');
      let ast;

      if (input.endsWith('.json')) {
        const result = jsonToAst(content);
        if (result.success) {
          console.log('?" Valid JSON diagram syntax');
          ast = result.data;
        } else {
          console.error('?- Invalid JSON diagram:');
          result.problems.forEach((p) => console.error(`  ${p}`));
          process.exit(1);
        }
      } else {
        const dslContent = input.endsWith('.md')
          ? extractDslFromMarkdown(content)
          : content;
        const result = parse(dslContent);
        if (result.success) {
          const profile = result.document?.profiles?.[0];
          if (profile && profile.type !== ProfileType.DIAGRAM) {
            console.log(`?" Valid DSL ${profile.type} syntax`);
            return;
          }

          console.log('?" Valid DSL diagram syntax');
          ast = extractDiagramFromParseResult(result);
          if (!ast) {
            console.error('?- No diagram profile found in document');
            process.exit(1);
          }
        } else {
          console.error('?- Invalid DSL diagram:');
          result.errors.forEach((e: string) => console.error(`  ${e}`));
          process.exit(1);
        }
      }

      // Validate diagram type if specified
      if (options.type && ast) {
        const validationResult = validateDiagramType(
          ast,
          options.type as DiagramType
        );
        if (validationResult.valid) {
          console.log(`✓ Valid ${options.type} diagram`);
          if (validationResult.warnings.length > 0) {
            console.warn('Warnings:');
            validationResult.warnings.forEach((w) =>
              console.warn(`  ⚠ ${w.message}`)
            );
          }
        } else {
          console.error(`✗ Invalid ${options.type} diagram:`);
          validationResult.errors.forEach((e) =>
            console.error(`  ✗ ${e.message}`)
          );
          if (validationResult.warnings.length > 0) {
            console.warn('Warnings:');
            validationResult.warnings.forEach((w) =>
              console.warn(`  ⚠ ${w.message}`)
            );
          }
          process.exit(1);
        }
      }
    } catch (error) {
      console.error(
        'Error:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      process.exit(1);
    }
  });

program
  .command('convert')
  .description('Convert between DSL and JSON formats')
  .argument('<input>', 'Input file')
  .option('-o, --output <file>', 'Output file')
  .action(async (input: string, options: any) => {
    try {
      const content = await fs.readFile(input, 'utf-8');

      if (input.endsWith('.json')) {
        // JSON to DSL (simplified conversion)
        const result = jsonToAst(content);
        if (!result.success) {
          console.error('JSON parse failed:');
          result.problems.forEach((p) => console.error(`  ${p}`));
          process.exit(1);
        }

        // Convert AST back to DSL (basic implementation)
        const dsl = astToDsl(result.data!);

        if (options.output) {
          await fs.writeFile(options.output, dsl);
          console.log(`DSL written to ${options.output}`);
        } else {
          console.log(dsl);
        }
      } else {
        // DSL to JSON
        const dslContent = input.endsWith('.md')
          ? extractDslFromMarkdown(content)
          : content;
        const parseResult = parse(dslContent);
        if (!parseResult.success) {
          console.error('DSL parse failed:');
          parseResult.errors.forEach((e: string) => console.error(`  ${e}`));
          process.exit(1);
        }

        const ast = extractDiagramFromParseResult(parseResult);
        if (!ast) {
          console.error('No diagram profile found in document');
          process.exit(1);
        }

        const jsonResult = astToJson(ast);
        if (!jsonResult.success) {
          console.error('JSON conversion failed:');
          jsonResult.problems.forEach((p) => console.error(`  ${p}`));
          process.exit(1);
        }

        if (options.output) {
          await fs.writeFile(options.output, jsonResult.data!);
          console.log(`JSON written to ${options.output}`);
        } else {
          console.log(jsonResult.data);
        }
      }
    } catch (error) {
      console.error(
        'Error:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      process.exit(1);
    }
  });

function extractDslFromMarkdown(content: string): string {
  const fenceRegex = /```(?:runiq|diagram)\n([\s\S]*?)\n```/g;
  const match = fenceRegex.exec(content);
  return match ? match[1] : content;
}

function astToDsl(ast: any): string {
  // Basic AST to DSL conversion (simplified)
  let dsl = '';

  if (ast.title) {
    dsl += `diagram "${ast.title}"`;
    if (ast.direction) {
      dsl += ` direction ${ast.direction}`;
    }
    dsl += '\n\n';
  }

  // Styles
  if (ast.styles) {
    for (const [name, style] of Object.entries(ast.styles)) {
      dsl += `style ${name}`;
      for (const [key, value] of Object.entries(style as any)) {
        dsl += ` ${key}:${value}`;
      }
      dsl += '\n';
    }
    dsl += '\n';
  }

  // Nodes
  for (const node of ast.nodes) {
    dsl += `shape ${node.id} as @${node.shape}`;
    if (node.label) dsl += ` label:"${node.label}"`;
    if (node.style) dsl += ` style:${node.style}`;
    if (node.icon) dsl += ` icon:${node.icon.provider}/${node.icon.name}`;
    if (node.link) dsl += ` link:"${node.link.href}"`;
    if (node.tooltip) dsl += ` tooltip:"${node.tooltip}"`;
    dsl += '\n';
  }

  if (ast.nodes.length > 0) dsl += '\n';

  // Edges
  for (const edge of ast.edges) {
    dsl += `${edge.from}`;
    if (edge.when) dsl += `[${edge.when}]`;
    dsl += ` -> ${edge.to}`;
    if (edge.label) dsl += ` : ${edge.label}`;
    if (edge.style) dsl += ` style:${edge.style}`;
    if (edge.link) dsl += ` link:"${edge.link.href}"`;
    if (edge.tooltip) dsl += ` tooltip:"${edge.tooltip}"`;
    dsl += '\n';
  }

  return dsl;
}

program
  .command('types')
  .description('List available diagram types and their constraints')
  .action(() => {
    console.log('Available diagram types:\n');
    const types = listDiagramTypes();
    for (const type of types) {
      console.log(`${type.type}:`);
      console.log(`  ${type.description}`);
      if (type.allowedShapes.length > 0) {
        console.log(`  Allowed shapes: ${type.allowedShapes.join(', ')}`);
      } else {
        console.log(`  Allowed shapes: all (no restrictions)`);
      }
      console.log('');
    }
  });

program.parse();
