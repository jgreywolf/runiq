import type { DiagramAst, PositionedContainer } from '@runiq/core';
import { shapeRegistry, createTextMeasurer } from '@runiq/core';
import { escapeXml } from './utils.js';

export function renderContainer(
  container: PositionedContainer,
  diagram: DiagramAst,
  strict: boolean
): string {
  const { x, y, width, height, label, id } = container;

  // Find container declaration in AST for styling
  const containerAst = findContainerInAst(diagram.containers, id);
  const style = (containerAst as any)?.containerStyle || {};

  const groupAttrs = strict ? '' : ` data-runiq-container="${id}"`;

  let markup = `<g${groupAttrs}>`;

  // Check if container references a shape type (as @shapeName)
  if ((containerAst as any)?.shape) {
    const shapeDefinition = shapeRegistry.get(
      (containerAst as any).shape as string
    );
    if (shapeDefinition) {
      // Use the shape's render function for the container background
      const measureText = createTextMeasurer();
      const shapeStyle = {
        // Only set fill if explicitly provided, otherwise let shape use its default
        ...((style as any).backgroundColor && {
          fill: (style as any).backgroundColor,
        }),
        stroke: (style as any).borderColor || '#ddd',
        strokeWidth: (style as any).borderWidth || 2,
        padding: (style as any).padding || 20,
        font: 'sans-serif',
        fontSize: 14,
        ...(style as any),
      } as any;

      // Merge layout dimensions with any existing data
      const shapeData = {
        ...(((containerAst as any)?.data as any) || {}),
        width,
        height,
      };

      const ctx = {
        node: {
          id,
          label: label || id,
          shape: (containerAst as any).shape,
          data: shapeData,
        } as any,
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
  style: any
): string {
  const fill = (style as any).backgroundColor || '#f9f9f9';
  const stroke = (style as any).borderColor || '#ddd';
  const strokeWidth = (style as any).borderWidth || 2;
  const rx = (style as any).rx || 8;

  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" 
    fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="${rx}" />`;
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
  containers: any[] | undefined,
  id: string
): any | undefined {
  if (!containers) return undefined;

  for (const container of containers) {
    if ((container as any).id === id) return container;
    if ((container as any).containers) {
      const found = findContainerInAst((container as any).containers, id);
      if (found) return found;
    }
  }
  return undefined;
}
