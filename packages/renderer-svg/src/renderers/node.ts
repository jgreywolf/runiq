import type { DiagramAst, PositionedNode } from '@runiq/core';
import { shapeRegistry, createTextMeasurer } from '@runiq/core';
import { escapeXml } from './utils.js';
import { renderIcon } from './icons.js';

export function renderNode(
  positioned: PositionedNode,
  diagram: DiagramAst,
  strict: boolean,
  warnings: string[]
): string {
  const nodeAst = diagram.nodes.find((n) => n.id === positioned.id);
  if (!nodeAst) {
    warnings.push(`Node ${positioned.id} not found in diagram AST`);
    return '';
  }

  const measureText = createTextMeasurer();
  const shapeImpl = shapeRegistry.get(nodeAst.shape);
  if (!shapeImpl) {
    warnings.push(`Unknown shape: ${nodeAst.shape}`);
    return renderFallbackNode(positioned, nodeAst);
  }

  const style: any = nodeAst.style ? (diagram.styles?.[nodeAst.style] || {}) : {};

  // Merge inline pedigree properties from node.data into style
  if (nodeAst.data) {
    if ((nodeAst.data as any).affected !== undefined) {
      (style as any).affected = (nodeAst.data as any).affected;
    }
    if ((nodeAst.data as any).carrier !== undefined) {
      (style as any).carrier = (nodeAst.data as any).carrier;
    }
    if ((nodeAst.data as any).deceased !== undefined) {
      (style as any).deceased = (nodeAst.data as any).deceased;
    }
  }

  let nodeMarkup = shapeImpl.render(
    { node: nodeAst as any, style, measureText },
    { x: positioned.x, y: positioned.y }
  );

  // Add icon if present
  if ((nodeAst as any).icon) {
    const iconMarkup = renderIcon((nodeAst as any).icon, positioned, warnings);
    if (iconMarkup) {
      nodeMarkup += iconMarkup;
    }
  }

  // Wrap in group with optional link
  const groupAttrs = strict ? '' : ` data-runiq-node="${nodeAst.id}"`;

  if ((nodeAst as any).link && !strict) {
    return `<a xlink:href="${escapeXml((nodeAst as any).link.href)}"${(nodeAst as any).link.target ? ` target="${(nodeAst as any).link.target}"` : ''}>
      <g${groupAttrs}>${nodeMarkup}${(nodeAst as any).tooltip ? `<title>${escapeXml((nodeAst as any).tooltip)}</title>` : ''}</g>
    </a>`;
  }

  return `<g${groupAttrs}>${nodeMarkup}${(nodeAst as any).tooltip ? `<title>${escapeXml((nodeAst as any).tooltip)}</title>` : ''}</g>`;
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
