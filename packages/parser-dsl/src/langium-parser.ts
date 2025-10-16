import type {
  DiagramAst,
  NodeAst,
  EdgeAst,
  GroupAst,
  Style,
  Direction,
  ContainerDeclaration,
  ContainerStyle,
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
      if (statement.labeledArrow) {
        // Extract label from labeledArrow terminal (e.g., "-success->" -> "success")
        const match = statement.labeledArrow.match(/^-(.+)->$/);
        if (match) {
          edge.label = match[1];
        }
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
    } else if (Langium.isContainerBlock(statement)) {
      const container = convertContainer(statement, declaredNodes, diagram);
      if (!diagram.containers) {
        diagram.containers = [];
      }
      diagram.containers.push(container);
    }
  }

  return diagram;
}

function convertContainer(
  block: Langium.ContainerBlock,
  declaredNodes: Set<string>,
  diagram: DiagramAst
): ContainerDeclaration {
  // Generate ID from label if not provided
  const id =
    block.id ||
    block.label
      .replace(/^"|"$/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

  const container: ContainerDeclaration = {
    type: 'container',
    id,
    label: block.label.replace(/^"|"$/g, ''),
    children: [],
  };

  // Process container properties
  let styleRef: string | undefined;
  const containerStyle: ContainerStyle = {};
  const layoutOptions: { algorithm?: string; spacing?: number } = {};

  for (const prop of block.properties) {
    if (Langium.isStyleRefProperty(prop)) {
      styleRef = prop.ref?.$refText;
    } else if (Langium.isContainerStyleProperty(prop)) {
      if (prop.borderStyle) {
        containerStyle.borderStyle = prop.borderStyle;
      } else if (prop.borderColor) {
        containerStyle.borderColor = prop.borderColor.replace(/^"|"$/g, '');
      } else if (prop.borderWidth !== undefined) {
        containerStyle.borderWidth = parseFloat(prop.borderWidth);
      } else if (prop.backgroundColor) {
        containerStyle.backgroundColor = prop.backgroundColor.replace(
          /^"|"$/g,
          ''
        );
      } else if (prop.opacity !== undefined) {
        containerStyle.opacity = parseFloat(prop.opacity);
      } else if (prop.padding !== undefined) {
        containerStyle.padding = parseFloat(prop.padding);
      } else if (prop.labelPosition) {
        containerStyle.labelPosition = prop.labelPosition as
          | 'top'
          | 'bottom'
          | 'left'
          | 'right';
      }
    } else if (Langium.isContainerLayoutProperty(prop)) {
      if (prop.algorithm) {
        layoutOptions.algorithm = prop.algorithm;
      } else if (prop.spacing !== undefined) {
        layoutOptions.spacing = parseFloat(prop.spacing);
      }
    }
  }

  if (styleRef) {
    container.style = styleRef;
  }

  if (Object.keys(containerStyle).length > 0) {
    container.containerStyle = containerStyle;
  }

  if (Object.keys(layoutOptions).length > 0) {
    container.layoutOptions = layoutOptions as any;
  }

  // Process nested statements recursively
  for (const statement of block.statements) {
    if (Langium.isShapeDeclaration(statement)) {
      // Add node to container's children
      container.children.push(statement.id);

      // Add node to main diagram
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
      // Edges in containers just get added to main diagram
      const edge: EdgeAst = {
        from: statement.from,
        to: statement.to,
      };

      if (statement.labeledArrow) {
        // Extract label from labeledArrow terminal (e.g., "-success->" -> "success")
        const match = statement.labeledArrow.match(/^-(.+)->$/);
        if (match) {
          edge.label = match[1];
        }
      }

      diagram.edges.push(edge);

      // Auto-create nodes if needed
      if (!declaredNodes.has(statement.from)) {
        diagram.nodes.push({
          id: statement.from,
          shape: 'rounded',
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
    } else if (Langium.isContainerBlock(statement)) {
      // Recursive nesting - convert nested container
      const nestedContainer = convertContainer(
        statement,
        declaredNodes,
        diagram
      );

      // Add nested container to parent's containers array (not children)
      if (!container.containers) {
        container.containers = [];
      }
      container.containers.push(nestedContainer);
    }
  }

  return container;
}
