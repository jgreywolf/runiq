import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * BPMN Pool/Lane shape - represents a participant or sub-partition in a process.
 * Rendered as a horizontal container with a label area on the left.
 */
export const bpmnPoolShape: ShapeDefinition = {
  id: 'bpmnPool',

  bounds(ctx: ShapeRenderContext) {
    // For containers, layout engine provides the actual dimensions in data
    const data = ctx.node.data as any;
    if (data?.width && data?.height) {
      return { width: data.width, height: data.height };
    }

    // Fallback for standalone usage (non-container)
    const width = (ctx.node.data?.width as number) || 600;
    const height = (ctx.node.data?.height as number) || 150;

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    const halfWidth = bounds.width / 2;
    const halfHeight = bounds.height / 2;

    return [
      { x: halfWidth, y: 0, name: 'top' },
      { x: bounds.width, y: halfHeight, name: 'right' },
      { x: halfWidth, y: bounds.height, name: 'bottom' },
      { x: 0, y: halfHeight, name: 'left' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const { fill, stroke, strokeWidth, strokeDasharray } = extractBasicStyles(
      ctx,
      {
        defaultFill: '#f5f5f5',
        defaultStroke: '#000000',
        defaultStrokeWidth: 2,
      }
    );

    const labelAreaWidth = 30; // Width of the vertical label area

    // Build stroke-dasharray attribute if present
    const dasharrayAttr = strokeDasharray
      ? ` stroke-dasharray="${strokeDasharray}"`
      : '';

    // Main pool/lane rectangle
    let svg = `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dasharrayAttr}/>`;

    // Vertical separator for label area
    svg += `<line x1="${x + labelAreaWidth}" y1="${y}" x2="${x + labelAreaWidth}" y2="${y + bounds.height}" stroke="${stroke}" stroke-width="${strokeWidth}"${dasharrayAttr}/>`;

    // Label (rotated vertical text in the label area)
    if (ctx.node.label) {
      const textX = x + labelAreaWidth / 2;
      const textY = y + bounds.height / 2;
      const labelSvg = renderShapeLabel(ctx, ctx.node.label, textX, textY);
      svg += `<g transform="rotate(-90 ${textX} ${textY})">${labelSvg}</g>`;
    }

    return svg;
  },
};
