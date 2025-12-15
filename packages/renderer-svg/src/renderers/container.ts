import type {
  ContainerStyle,
  DiagramAst,
  PositionedContainer,
} from '@runiq/core';
import { createTextMeasurer, LineStyle, shapeRegistry } from '@runiq/core';
import { resolveContainerStyle } from './style-resolver.js';
import { escapeXml } from './utils.js';

export function renderContainer(
  container: PositionedContainer,
  diagram: DiagramAst,
  strict: boolean
): string {
  const { x, y, width, height, label, id } = container;

  // Find container declaration in AST for styling
  const containerAst = findContainerInAst(diagram.containers, id);

  // Resolve styles with Phase 5 template/preset/extends support
  let style: ContainerStyle = {};
  if (containerAst) {
    // Use Phase 5 style resolution (template → preset → extends → inline)
    style = resolveContainerStyle(containerAst, diagram);
  }

  const groupAttrs = strict
    ? ''
    : ` data-runiq-container="${id}" data-container-id="${id}"`;

  let markup = `<g${groupAttrs}>`;

  // Check if container references a shape type (as @shapeName)
  if (containerAst?.shape) {
    const shapeDefinition = shapeRegistry.get(containerAst.shape);
    if (shapeDefinition) {
      // Use the shape's render function for the container background
      const measureText = createTextMeasurer();

      // Build shape style object compatible with Style interface
      const shapeStyle: Record<string, unknown> = {
        // Only set fill if explicitly provided, otherwise let shape use its default
        ...(style.fillColor && {
          fill: style.fillColor,
        }),
        stroke: style.strokeColor || '#ddd',
        strokeWidth: style.strokeWidth || 2,
        padding: style.padding || 20,
        font: 'sans-serif',
        fontSize: 14,
        ...style,
      };

      // Convert borderStyle to strokeDasharray for shapes
      if (style.borderStyle === LineStyle.DASHED) {
        shapeStyle.strokeDasharray = '5,5';
      } else if (style.borderStyle === LineStyle.DOTTED) {
        shapeStyle.strokeDasharray = '2,2';
      }

      // Merge layout dimensions - containers don't have a data property
      const shapeData: Record<string, unknown> = {
        width,
        height,
      };

      const ctx = {
        node: {
          id,
          label: label || id,
          shape: containerAst.shape,
          data: shapeData,
        },
        style: shapeStyle,
        measureText,
      };

      markup += shapeDefinition.render(ctx, { x, y });
    } else {
      // Shape not found, fall back to default rendering
      markup += renderDefaultContainerBackground(x, y, width, height, style);
      if (label) {
        markup += renderDefaultContainerLabel(x, y, label);
      }
    }
  } else {
    // No shape reference, use default container rendering
    markup += renderDefaultContainerBackground(x, y, width, height, style);
    if (label) {
      markup += renderDefaultContainerLabel(x, y, label);
    }
  }

  // Recursively render nested containers
  if (container.containers) {
    for (const nested of container.containers) {
      markup += renderContainer(nested, diagram, strict);
    }
  }

  markup += '</g>';

  return markup;
}

function renderDefaultContainerBackground(
  x: number,
  y: number,
  width: number,
  height: number,
  style: ContainerStyle
): string {
  const fill = style.fillColor || '#f9f9f9';
  const stroke = style.strokeColor || '#ddd';
  const strokeWidth = style.strokeWidth || 2;
  const rx = 8;

  // Convert borderStyle to stroke-dasharray
  let strokeDasharray = '';
  if (style.borderStyle === LineStyle.DASHED) {
    strokeDasharray = ' stroke-dasharray="5,5"';
  } else if (style.borderStyle === LineStyle.DOTTED) {
    strokeDasharray = ' stroke-dasharray="2,2"';
  }
  // solid or undefined = no stroke-dasharray

  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" 
    fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="${rx}"${strokeDasharray} />`;
}

function renderDefaultContainerLabel(
  x: number,
  y: number,
  label: string
): string {
  const labelX = x + 10;
  const labelY = y + 20;
  return `<text x="${labelX}" y="${labelY}" class="runiq-container-label">${escapeXml(label)}</text>`;
}

function findContainerInAst(
  containers: import('@runiq/core').ContainerDeclaration[] | undefined,
  id: string
): import('@runiq/core').ContainerDeclaration | undefined {
  if (!containers) {
    return undefined;
  }

  for (const container of containers) {
    if (container.id === id) {
      return container;
    }
    if (container.containers) {
      const found = findContainerInAst(container.containers, id);
      if (found) return found;
    }
  }

  return undefined;
}
