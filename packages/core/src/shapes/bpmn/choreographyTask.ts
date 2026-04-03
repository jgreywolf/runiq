import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { getDataProperty } from '../../types/index.js';
import { calculateRectangularAnchors, extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

export const bpmnChoreographyTaskShape: ShapeDefinition = {
  id: 'bpmnChoreographyTask',

  bounds(ctx: ShapeRenderContext) {
    const padding = ctx.style.padding || 12;
    const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

    return {
      width: Math.max(140, labelMetrics.width + padding * 2),
      height: Math.max(84, labelMetrics.height + padding * 2 + 20),
    };
  },

  anchors(ctx: ShapeRenderContext) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const initiatingParticipant =
      getDataProperty<string>(ctx.node.data, 'initiatingParticipant', 'Initiator') ||
      'Initiator';
    const receivingParticipant =
      getDataProperty<string>(ctx.node.data, 'receivingParticipant', 'Participant') ||
      'Participant';
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
      defaultStroke: '#000000',
      defaultStrokeWidth: 2,
    });

    const bandHeight = 16;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="8" ry="8"/>
      <rect x="${x + 10}" y="${y - bandHeight / 2}" width="${bounds.width - 20}" height="${bandHeight}" fill="#f8fafc" stroke="${stroke}" stroke-width="1" rx="6" ry="6"/>
      <rect x="${x + 10}" y="${y + bounds.height - bandHeight / 2}" width="${bounds.width - 20}" height="${bandHeight}" fill="#f8fafc" stroke="${stroke}" stroke-width="1" rx="6" ry="6"/>
      ${renderShapeLabel(
        { ...ctx, style: { ...ctx.style, fontSize: Math.max(10, (ctx.style.fontSize || 14) - 3) } },
        initiatingParticipant,
        x + bounds.width / 2,
        y + 1
      )}
      ${renderShapeLabel(
        { ...ctx, style: { ...ctx.style, fontSize: Math.max(10, (ctx.style.fontSize || 14) - 3) } },
        receivingParticipant,
        x + bounds.width / 2,
        y + bounds.height + 1
      )}
      ${renderShapeLabel(ctx, ctx.node.label || ctx.node.id, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};
