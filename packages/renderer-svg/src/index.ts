import type { DiagramAst, LaidOutDiagram, PositionedNode } from '@runiq/core';
import { shapeRegistry, createTextMeasurer } from '@runiq/core';
import { escapeXml } from './renderers/utils.js';
import { renderIcon } from './renderers/icons.js';
import { renderContainer } from './renderers/container.js';
import { renderEdge } from './renderers/edge.js';

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
  svg += ']]></style>';

  // Add pedigree chart pattern for carrier shading
  svg +=
    '<pattern id="pedigree-half-fill" width="40" height="40" patternUnits="userSpaceOnUse">';
  svg += '<rect x="0" y="0" width="20" height="40" fill="#000"/>';
  svg += '<rect x="20" y="0" width="20" height="40" fill="#fff"/>';
  svg += '</pattern>';

  svg += '</defs>';

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

  // Merge inline pedigree properties from node.data into style
  if (nodeAst.data) {
    if (nodeAst.data.affected !== undefined) {
      style.affected = nodeAst.data.affected;
    }
    if (nodeAst.data.carrier !== undefined) {
      style.carrier = nodeAst.data.carrier;
    }
    if (nodeAst.data.deceased !== undefined) {
      style.deceased = nodeAst.data.deceased;
    }
  }

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

// helpers moved into renderers modules

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
