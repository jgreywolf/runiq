import type {
  ContainerStyle,
  DiagramAst,
  LaidOutDiagram,
  PositionedContainer,
} from '@runiq/core';
import { createTextMeasurer, LineStyle, shapeRegistry } from '@runiq/core';
import { resolveContainerStyle } from './style-resolver.js';
import { escapeXml } from './utils.js';

export function renderContainer(
  container: PositionedContainer,
  diagram: DiagramAst,
  strict: boolean,
  layout?: LaidOutDiagram
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
        collapsed: containerAst.collapsed === true,
        hasChildren:
          containerAst.children.length > 0 ||
          (containerAst.containers?.length ?? 0) > 0,
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

  if (layout && (containerAst?.shape === 'fileTree' || containerAst?.shape === 'folder')) {
    markup += renderFileTreeGuides(container, containerAst, layout);
  }

  if (
    layout &&
    (containerAst?.shape === 'wbs' || containerAst?.shape === 'wbsDeliverable')
  ) {
    markup += renderWbsGuides(container, containerAst, layout);
  }

  // Recursively render nested containers
  if (container.containers) {
    for (const nested of container.containers) {
      markup += renderContainer(nested, diagram, strict, layout);
    }
  }

  markup += '</g>';

  return markup;
}

function renderFileTreeGuides(
  container: PositionedContainer,
  containerAst: import('@runiq/core').ContainerDeclaration,
  layout: LaidOutDiagram
): string {
  if (containerAst.collapsed) {
    return '';
  }

  const orderedItems = (
    containerAst.contentOrder && containerAst.contentOrder.length > 0
      ? containerAst.contentOrder
      : [
          ...containerAst.children.map((id) => ({ kind: 'node' as const, id })),
          ...((containerAst.containers ?? []).map((nested) => ({
            kind: 'container' as const,
            id: nested.id || '',
          })) ?? []),
        ]
  ).slice();

  orderedItems.sort((left, right) => {
    if (left.kind === right.kind) {
      return 0;
    }

    return left.kind === 'container' ? -1 : 1;
  });

  const nestedById = new Map(
    (container.containers ?? []).map((nested) => [nested.id, nested])
  );
  const nodeById = new Map(layout.nodes.map((node) => [node.id, node]));
  const isRoot = containerAst.shape === 'fileTree';
  const guideX = container.x + (isRoot ? 18 : 22);
  const startY = container.y + (isRoot ? 22 : 14);
  const rows = orderedItems
    .map((item) => {
      if (item.kind === 'node') {
        const node = nodeById.get(item.id);
        if (!node) return null;
        return {
          x: node.x,
          y: node.y + Math.min(13, node.height / 2),
        };
      }

      const nested = nestedById.get(item.id);
      if (!nested) return null;
      return {
        x: nested.x,
        y: nested.y + 13,
      };
    })
    .filter((row): row is { x: number; y: number } => row !== null)
    .sort((left, right) => left.y - right.y);

  if (rows.length === 0) {
    return '';
  }

  const endY = rows[rows.length - 1].y;
  let guides = `
    <g class="file-tree-guides">
      <line x1="${guideX}" y1="${startY}" x2="${guideX}" y2="${endY}" stroke="#cbd5e1" stroke-width="1" />
  `;

  for (const row of rows) {
    const branchEndX = Math.max(guideX + 12, row.x - 8);
    guides += `
      <line x1="${guideX}" y1="${row.y}" x2="${branchEndX}" y2="${row.y}" stroke="#cbd5e1" stroke-width="1" />
    `;
  }

  guides += '</g>';
  return guides;
}

function renderWbsGuides(
  container: PositionedContainer,
  containerAst: import('@runiq/core').ContainerDeclaration,
  layout: LaidOutDiagram
): string {
  if (containerAst.collapsed) {
    return '';
  }

  const nestedById = new Map(
    (container.containers ?? []).map((nested) => [nested.id, nested])
  );
  const nodeById = new Map(layout.nodes.map((node) => [node.id, node]));
  const childTargets = [
    ...(containerAst.containers ?? [])
      .map((nested) => nestedById.get(nested.id || ''))
      .filter(
        (nested): nested is PositionedContainer => nested !== undefined
      )
      .map((nested) => ({
        x: nested.x + nested.width / 2,
        y: nested.y,
      })),
    ...containerAst.children
      .map((id) => nodeById.get(id))
      .filter((node): node is (typeof layout.nodes)[number] => node !== undefined)
      .map((node) => ({
        x: node.x + node.width / 2,
        y: node.y,
      })),
  ];

  if (childTargets.length === 0) {
    return '';
  }

  const parentX = container.x + container.width / 2;
  const parentY =
    containerAst.shape === 'wbs' ? container.y + 32 : container.y + 28;
  const minX = Math.min(...childTargets.map((target) => target.x));
  const maxX = Math.max(...childTargets.map((target) => target.x));
  const minY = Math.min(...childTargets.map((target) => target.y));
  const maxY = Math.max(...childTargets.map((target) => target.y));
  const horizontalLayout = maxX - minX > maxY - minY;

  let guides = `<g class="wbs-guides">`;

  if (horizontalLayout) {
    const busY = Math.max(parentY + 12, minY - 16);
    guides += `
      <line x1="${parentX}" y1="${parentY}" x2="${parentX}" y2="${busY}" stroke="#cbd5e1" stroke-width="1.4" />
      <line x1="${minX}" y1="${busY}" x2="${maxX}" y2="${busY}" stroke="#cbd5e1" stroke-width="1.4" />
    `;

    for (const target of childTargets) {
      guides += `
        <line x1="${target.x}" y1="${busY}" x2="${target.x}" y2="${target.y}" stroke="#cbd5e1" stroke-width="1.4" />
      `;
    }
  } else {
    const busX = parentX;
    guides += `
      <line x1="${busX}" y1="${parentY}" x2="${busX}" y2="${maxY}" stroke="#cbd5e1" stroke-width="1.4" />
    `;

    for (const target of childTargets) {
      guides += `
        <line x1="${busX}" y1="${target.y}" x2="${target.x}" y2="${target.y}" stroke="#cbd5e1" stroke-width="1.4" />
      `;
    }
  }

  guides += '</g>';
  return guides;
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
  return `<text x="${labelX}" y="${labelY}" text-anchor="start" dominant-baseline="hanging" class="runiq-container-label">${escapeXml(label)}</text>`;
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
