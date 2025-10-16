import type {
  DiagramAst,
  LaidOutDiagram,
  PositionedNode,
  PositionedContainer,
  RoutedEdge,
  IconRef,
} from '@runiq/core';
import { shapeRegistry, iconRegistry, createTextMeasurer } from '@runiq/core';

export interface RenderOptions {
  strict?: boolean; // strict SVG mode (no enhanced features)
  title?: string;
  description?: string;
}

export interface RenderResult {
  svg: string;
  warnings: string[];
}

export function renderSvg(
  diagram: DiagramAst,
  layout: LaidOutDiagram,
  options: RenderOptions = {}
): RenderResult {
  const warnings: string[] = [];
  const { strict = false } = options;

  const measureText = createTextMeasurer();

  // SVG header
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
    width="${layout.size.width}" height="${layout.size.height}" 
    viewBox="0 0 ${layout.size.width} ${layout.size.height}"
    role="img" aria-labelledby="diagram-title">`;

  // Add title and description for accessibility
  const title = options.title || diagram.title || 'Diagram';
  svg += `<title id="diagram-title">${escapeXml(title)}</title>`;

  if (options.description) {
    svg += `<desc>${escapeXml(options.description)}</desc>`;
  }

  // Add default styles
  svg += '<defs><style type="text/css"><![CDATA[';
  svg += '.runiq-node-text { font-family: sans-serif; font-size: 14px; }';
  svg += '.runiq-edge-text { font-family: sans-serif; font-size: 12px; }';
  svg +=
    '.runiq-container-label { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #666; }';
  svg += ']]></style></defs>';

  // Render containers first (as backgrounds)
  if (layout.containers) {
    for (const container of layout.containers) {
      svg += renderContainer(container, diagram, strict);
    }
  }

  // Render edges (so they appear behind nodes but above containers)
  for (const edge of layout.edges) {
    svg += renderEdge(edge, diagram, strict, warnings);
  }

  // Render nodes (on top of everything)
  for (const node of layout.nodes) {
    svg += renderNode(node, diagram, measureText, strict, warnings);
  }

  svg += '</svg>';

  return { svg, warnings };
}

function renderNode(
  positioned: PositionedNode,
  diagram: DiagramAst,
  measureText: ReturnType<typeof createTextMeasurer>,
  strict: boolean,
  warnings: string[]
): string {
  const nodeAst = diagram.nodes.find((n) => n.id === positioned.id);
  if (!nodeAst) {
    warnings.push(`Node ${positioned.id} not found in diagram AST`);
    return '';
  }

  const shapeImpl = shapeRegistry.get(nodeAst.shape);
  if (!shapeImpl) {
    warnings.push(`Unknown shape: ${nodeAst.shape}`);
    return renderFallbackNode(positioned, nodeAst);
  }

  const style = nodeAst.style ? diagram.styles?.[nodeAst.style] || {} : {};

  let nodeMarkup = shapeImpl.render(
    { node: nodeAst, style, measureText },
    { x: positioned.x, y: positioned.y }
  );

  // Add icon if present
  if (nodeAst.icon) {
    const iconMarkup = renderIcon(nodeAst.icon, positioned, warnings);
    if (iconMarkup) {
      nodeMarkup += iconMarkup;
    }
  }

  // Wrap in group with optional link
  const groupAttrs = strict ? '' : ` data-runiq-node="${nodeAst.id}"`;

  if (nodeAst.link && !strict) {
    return `<a xlink:href="${escapeXml(nodeAst.link.href)}"${nodeAst.link.target ? ` target="${nodeAst.link.target}"` : ''}>
      <g${groupAttrs}>${nodeMarkup}${nodeAst.tooltip ? `<title>${escapeXml(nodeAst.tooltip)}</title>` : ''}</g>
    </a>`;
  }

  return `<g${groupAttrs}>${nodeMarkup}${nodeAst.tooltip ? `<title>${escapeXml(nodeAst.tooltip)}</title>` : ''}</g>`;
}

function renderContainer(
  container: PositionedContainer,
  diagram: DiagramAst,
  strict: boolean
): string {
  const { x, y, width, height, label, id } = container;

  // Find container declaration in AST for styling
  const containerAst = findContainerInAst(diagram.containers, id);
  const style = containerAst?.containerStyle || {};

  // Map ContainerStyle properties to SVG attributes
  const fill = style.backgroundColor || '#f9f9f9';
  const stroke = style.borderColor || '#ddd';
  const strokeWidth = style.borderWidth || 2;
  const rx = style.rx || 8;

  const groupAttrs = strict ? '' : ` data-runiq-container="${id}"`;

  let markup = `<g${groupAttrs}>`;

  // Container background
  markup += `<rect x="${x}" y="${y}" width="${width}" height="${height}" 
    fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="${rx}" />`;

  // Container label (top-left)
  if (label) {
    const labelX = x + 10;
    const labelY = y + 20;
    markup += `<text x="${labelX}" y="${labelY}" class="runiq-container-label">${escapeXml(label)}</text>`;
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

function findContainerInAst(
  containers: any[] | undefined,
  id: string
): any | undefined {
  if (!containers) return undefined;

  for (const container of containers) {
    if (container.id === id) return container;
    if (container.containers) {
      const found = findContainerInAst(container.containers, id);
      if (found) return found;
    }
  }
  return undefined;
}

function renderEdge(
  routed: RoutedEdge,
  diagram: DiagramAst,
  strict: boolean,
  warnings: string[]
): string {
  const edgeAst = diagram.edges.find(
    (e) => e.from === routed.from && e.to === routed.to
  );
  if (!edgeAst) {
    warnings.push(
      `Edge ${routed.from} -> ${routed.to} not found in diagram AST`
    );
    return '';
  }

  const points = routed.points;
  if (points.length < 2) {
    warnings.push(
      `Edge ${routed.from} -> ${routed.to} has insufficient points`
    );
    return '';
  }

  const style = edgeAst.style ? diagram.styles?.[edgeAst.style] || {} : {};
  const stroke = style.stroke || '#333';
  const strokeWidth = style.strokeWidth || 1;

  // Create path
  const start = points[0];

  let pathData = `M ${start.x} ${start.y}`;
  for (let i = 1; i < points.length; i++) {
    pathData += ` L ${points[i].x} ${points[i].y}`;
  }

  const groupAttrs = strict
    ? ''
    : ` data-runiq-edge="${routed.from}-${routed.to}"`;

  let edgeMarkup = `<g${groupAttrs}>`;

  // Edge line
  edgeMarkup += `<path d="${pathData}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Arrowhead
  const arrowId = `arrow-${routed.from}-${routed.to}`;
  edgeMarkup += `
    <defs>
      <marker id="${arrowId}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
        <polygon points="0,0 0,6 9,3" fill="${stroke}" />
      </marker>
    </defs>
  `;
  edgeMarkup += `<path d="${pathData}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" marker-end="url(#${arrowId})" />`;

  // Edge label
  if (edgeAst.label) {
    const midIndex = Math.floor(points.length / 2);
    const midPoint = points[midIndex];
    edgeMarkup += `<text x="${midPoint.x}" y="${midPoint.y - 5}" text-anchor="middle" class="runiq-edge-text">${escapeXml(edgeAst.label)}</text>`;
  }

  // Tooltip
  if (edgeAst.tooltip) {
    edgeMarkup += `<title>${escapeXml(edgeAst.tooltip)}</title>`;
  }

  edgeMarkup += '</g>';

  // Wrap in link if present
  if (edgeAst.link && !strict) {
    return `<a xlink:href="${escapeXml(edgeAst.link.href)}"${edgeAst.link.target ? ` target="${edgeAst.link.target}"` : ''}>${edgeMarkup}</a>`;
  }

  return edgeMarkup;
}

function renderIcon(
  icon: IconRef,
  positioned: PositionedNode,
  warnings: string[]
): string {
  const iconData = iconRegistry.getIcon(icon.provider, icon.name);
  if (!iconData) {
    warnings.push(`Icon ${icon.provider}/${icon.name} not found`);
    return '';
  }

  const iconSize = 16;
  const iconX = positioned.x + positioned.width - iconSize - 5;
  const iconY = positioned.y + 5;

  return `<svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="${iconData.viewBox}">
    <path d="${iconData.d}" fill="currentColor" />
  </svg>`;
}

function renderFallbackNode(positioned: PositionedNode, node: any): string {
  const { x, y, width, height } = positioned;
  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" 
          fill="#f0f0f0" stroke="#333" stroke-width="1" rx="4" />
    <text x="${x + width / 2}" y="${y + height / 2}" 
          text-anchor="middle" dominant-baseline="middle" class="runiq-node-text">
      ${escapeXml(node.label || node.id)}
    </text>
  `;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
