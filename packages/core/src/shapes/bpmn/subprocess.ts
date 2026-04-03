import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { getDataProperty } from '../../types/index.js';
import { calculateRectangularAnchors, extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const bpmnSubProcessShape: ShapeDefinition = {
  id: 'bpmnSubProcess',

  bounds(ctx: ShapeRenderContext) {
    const expanded = getDataProperty<boolean>(ctx.node.data, 'expanded', false);
    const padding = ctx.style.padding || 12;
    const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

    return {
      width: Math.max(expanded ? 180 : 120, labelMetrics.width + padding * 2),
      height: Math.max(expanded ? 96 : 72, labelMetrics.height + padding * 2 + 10),
    };
  },

  anchors(ctx: ShapeRenderContext) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const expanded = getDataProperty<boolean>(ctx.node.data, 'expanded', false);
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
      defaultStroke: '#000000',
      defaultStrokeWidth: 2,
    });

    const plusSize = 12;
    const plusX = x + bounds.width / 2 - plusSize / 2;
    const plusY = y + bounds.height - plusSize - 6;

    const collapseMarker = expanded
      ? ''
      : `
      <rect x="${plusX}" y="${plusY}" width="${plusSize}" height="${plusSize}" fill="none" stroke="${stroke}" stroke-width="1"/>
      <line x1="${plusX + 3}" y1="${plusY + plusSize / 2}" x2="${plusX + plusSize - 3}" y2="${plusY + plusSize / 2}" stroke="${stroke}" stroke-width="1"/>
      <line x1="${plusX + plusSize / 2}" y1="${plusY + 3}" x2="${plusX + plusSize / 2}" y2="${plusY + plusSize - 3}" stroke="${stroke}" stroke-width="1"/>`;
    const expandedGuide = expanded
      ? `<line x1="${x + 12}" y1="${y + 28}" x2="${x + bounds.width - 12}" y2="${y + 28}" stroke="${stroke}" stroke-width="1" stroke-dasharray="4,2"/>`
      : '';

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="8" ry="8"/>
      ${expandedGuide}
      ${collapseMarker}
      ${renderShapeLabel(ctx, ctx.node.label || ctx.node.id, x + bounds.width / 2, expanded ? y + 18 : y + bounds.height / 2 - 4)}
    `;
  },
};
