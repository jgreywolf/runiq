import type {
  DiagramAst,
  NodeAst,
  EdgeAst,
  GroupAst,
  Style,
  Direction,
} from '@runiq/core';
import { EmptyFileSystem } from 'langium';
import { createRuniqServices } from './langium-module.js';
import * as Langium from './generated/ast.js';

/**
 * Parse result type
 */
export interface ParseResult {
  success: boolean;
  diagram?: DiagramAst;
  errors: string[];
}

/**
 * Create parser services (singleton)
 */
const services = createRuniqServices(EmptyFileSystem);
const parser = services.Runiq.parser.LangiumParser;

/**
 * Parse Runiq DSL text into DiagramAst
 * @param text - The Runiq DSL source code
 * @returns ParseResult with diagram or errors
 */
export function parse(text: string): ParseResult {
  // Parse using Langium
  const parseResult = parser.parse(text);

  // Check for parse errors
  if (
    parseResult.lexerErrors.length > 0 ||
    parseResult.parserErrors.length > 0
  ) {
    const errors: string[] = [];

    parseResult.lexerErrors.forEach((err) => {
      errors.push(`Lexer error: ${err.message}`);
    });

    parseResult.parserErrors.forEach((err) => {
      errors.push(`Parser error: ${err.message}`);
    });

    return { success: false, errors };
  }

  // Convert Langium AST to Runiq DiagramAst
  const document = parseResult.value as Langium.Document;
  const diagram = convertToRuniqAst(document);

  return { success: true, diagram, errors: [] };
}

/**
 * Convert Langium Document AST to Runiq DiagramAst
 */
function convertToRuniqAst(document: Langium.Document): DiagramAst {
  const diagram: DiagramAst = {
    astVersion: '1.0',
    direction: 'TB', // Default
    nodes: [],
    edges: [],
    groups: [],
    styles: {},
  };

  // Track which nodes have been explicitly declared
  const declaredNodes = new Set<string>();

  // Process all statements
  for (const statement of document.statements) {
    if (Langium.isDiagramDeclaration(statement)) {
      // Extract diagram title from string (strip quotes)
      diagram.title = statement.type.replace(/^"|"$/g, '');
    } else if (Langium.isDirectionDeclaration(statement)) {
      diagram.direction = statement.value as Direction;
    } else if (Langium.isStyleDeclaration(statement)) {
      const style: Style = {};
      for (const prop of statement.properties) {
        let value = prop.value;
        // Remove quotes from string values
        if (
          typeof value === 'string' &&
          value.startsWith('"') &&
          value.endsWith('"')
        ) {
          value = value.slice(1, -1);
        }
        style[prop.key] = value;
      }
      if (!diagram.styles) {
        diagram.styles = {};
      }
      diagram.styles[statement.name] = style;
    } else if (Langium.isShapeDeclaration(statement)) {
      const node: NodeAst = {
        id: statement.id,
        shape: statement.shape,
      };

      // Process node properties
      for (const prop of statement.properties) {
        if (Langium.isLabelProperty(prop)) {
          node.label = prop.value.replace(/^"|"$/g, '');
        } else if (Langium.isStyleRefProperty(prop)) {
          node.style = prop.ref?.$refText;
        } else if (Langium.isIconProperty(prop)) {
          node.icon = {
            provider: prop.provider,
            name: prop.icon,
          };
        } else if (Langium.isLinkProperty(prop)) {
          node.link = {
            href: prop.url.replace(/^"|"$/g, ''),
          };
        } else if (Langium.isTooltipProperty(prop)) {
          node.tooltip = prop.text.replace(/^"|"$/g, '');
        }
      }

      diagram.nodes.push(node);
      declaredNodes.add(statement.id);
    } else if (Langium.isEdgeDeclaration(statement)) {
      const edge: EdgeAst = {
        from: statement.from,
        to: statement.to,
      };

      // Check if edge has a label (uses -label-> syntax)
      if (statement.label) {
        edge.label = statement.label;
      }

      diagram.edges.push(edge);

      // Auto-create nodes that weren't explicitly declared
      if (!declaredNodes.has(statement.from)) {
        diagram.nodes.push({
          id: statement.from,
          shape: 'rounded', // Default shape for auto-created nodes
        });
        declaredNodes.add(statement.from);
      }

      if (!declaredNodes.has(statement.to)) {
        diagram.nodes.push({
          id: statement.to,
          shape: 'rounded',
        });
        declaredNodes.add(statement.to);
      }
    } else if (Langium.isGroupBlock(statement)) {
      const group: GroupAst = {
        label: statement.label.replace(/^"|"$/g, ''),
        children: [],
      };

      // Collect child node IDs from group statements
      for (const subStatement of statement.statements) {
        if (Langium.isShapeDeclaration(subStatement)) {
          group.children.push(subStatement.id);

          // Also add the node to the main diagram
          const node: NodeAst = {
            id: subStatement.id,
            shape: subStatement.shape,
          };

          // Process properties (simplified - reuse logic from above if needed)
          for (const prop of subStatement.properties) {
            if (Langium.isLabelProperty(prop)) {
              node.label = prop.value.replace(/^"|"$/g, '');
            }
          }

          diagram.nodes.push(node);
          declaredNodes.add(subStatement.id);
        }
      }

      if (!diagram.groups) {
        diagram.groups = [];
      }
      diagram.groups.push(group);
    }
  }

  return diagram;
}
