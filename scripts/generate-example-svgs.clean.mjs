#!/usr/bin/env node
/**
 * Generate SVG outputs for all example .runiq files
 * This helps visualize examples in documentation
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Import from built packages using relative paths
import { ElkLayoutEngine } from '../packages/layout-base/dist/index.js';
import { parse } from '../packages/parser-dsl/dist/index.js';
import {
  renderPID,
  renderSchematic,
} from '../packages/renderer-schematic/dist/index.js';
import { renderSvg } from '../packages/renderer-svg/dist/index.js';
import { routeProfileToRenderer } from './route-profile.mjs';
// Ensure core shapes and registries are registered
import { registerDefaultShapes } from '../packages/core/dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXAMPLES_DIR = join(__dirname, '..', 'examples');
const SKIP_DIRS = ['output', 'electrical', 'digital', 'verilog-output']; // Skip circuit examples (they have their own renderers)

function findRuniqFiles(dir, files = []) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      const dirName = basename(fullPath);
      if (!SKIP_DIRS.includes(dirName)) {
        findRuniqFiles(fullPath, files);
      }
    } else if (entry.endsWith('.runiq')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function generateSVG(runiqPath) {
  try {
    console.log(`\nProcessing: ${runiqPath}`);

    // Read the .runiq file and strip Markdown code fences if present
    let dslContent = readFileSync(runiqPath, 'utf-8');
    // If file is wrapped in a ``` code block, extract the inner contents
    if (dslContent.trimStart().startsWith('```')) {
      const parts = dslContent.split(/\r?\n/);
      // find first fence and last fence
      const start = parts.findIndex((l) => l.trim().startsWith('```'));
      const end = parts
        .map((l) => l.trim().startsWith('```'))
        .lastIndexOf(true);
      if (start >= 0 && end > start) {
        dslContent = parts.slice(start + 1, end).join('\n');
      }
    }

    // Parse DSL
    const parseResult = await parse(dslContent);

    if (!parseResult.success) {
      console.error(`  ❌ Parse failed`);
      if (parseResult.errors && parseResult.errors.length > 0) {
        parseResult.errors.forEach((err) => {
          const msg = err?.message || err?.toString() || 'Unknown error';
          console.error(`     ${msg}`);
        });
      }
      return false;
    }

    if (!parseResult.document && !parseResult.diagram) {
      console.error(`  ❌ No diagram generated`);
      return false;
    }

    // Choose DiagramAst for layout: prefer legacy `diagram` if present, otherwise use first profile
    const diagramForLayout =
      parseResult.diagram ||
      (parseResult.document.profiles && parseResult.document.profiles[0]);
    if (!diagramForLayout) {
      console.error(`  ❌ No diagram profile available`);
      return false;
    }

    // Ensure shapes are registered before layout/render
    registerDefaultShapes();

    // Coerce to plain objects to avoid prototype/CST artifacts
    const plainDiagram = JSON.parse(JSON.stringify(diagramForLayout));
    console.log('  Detected profile type:', plainDiagram && plainDiagram.type);

    // Try routing to a specialized renderer first (sequence/timeline/wardley)
    let svg;
    const routed = routeProfileToRenderer(
      plainDiagram && plainDiagram.type,
      plainDiagram,
      {}
    );
    if (routed && routed.handled) {
      svg = (routed.result && routed.result.svg) || '';
    } else {
      // If this is a schematic-style profile (electrical / pneumatic / hydraulic)
      // use the schematic renderer which expects `parts` / `nets` etc.
      const schematicTypes = new Set(['hydraulic', 'pneumatic', 'electrical']);
      if (
        plainDiagram &&
        plainDiagram.type &&
        schematicTypes.has(plainDiagram.type)
      ) {
        const schemResult = renderSchematic(plainDiagram, {
          showNetLabels: true,
          showValues: true,
        });
        svg = schemResult.svg;
      } else if (plainDiagram && plainDiagram.type === 'pid') {
        const pidResult = renderPID(plainDiagram, {});
        svg = pidResult && pidResult.svg;
      } else {
        // Layout
        const layoutEngine = new ElkLayoutEngine();
        const laidOut = await layoutEngine.layout(plainDiagram, {
          direction: plainDiagram.direction || 'TB',
          spacing: 80,
        });

        // Render SVG
        const result = renderSvg(plainDiagram, laidOut, {
          title: parseResult.document.title || 'Diagram',
        });
        svg = result.svg;
      }
    }

    // Write SVG file
    const svgPath = runiqPath.replace('.runiq', '.svg');
    writeFileSync(svgPath, svg, 'utf-8');

    console.log(`  ✅ Generated: ${basename(svgPath)}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🎨 Generating SVG outputs for all examples...\n');
  console.log(`📁 Examples directory: ${EXAMPLES_DIR}`);
  console.log(`🚫 Skipping directories: ${SKIP_DIRS.join(', ')}\n`);

  // Find all .runiq files
  const runiqFiles = findRuniqFiles(EXAMPLES_DIR);
  console.log(`📄 Found ${runiqFiles.length} .runiq files\n`);

  let success = 0;
  let failed = 0;

  // Generate SVG for each
  for (const file of runiqFiles) {
    const result = await generateSVG(file);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${runiqFiles.length}`);
  console.log(`${'='.repeat(50)}\n`);
}

main().catch(console.error);
