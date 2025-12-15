import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { calculateAspectRatioBounds } from '../utils/calculate-bounds.js';
import { extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * BPMN Message shape - represents a message being sent or received.
 * Rendered as an envelope.
 */
export const bpmnMessageShape: ShapeDefinition = {
  id: 'bpmnMessage',

  bounds(ctx: ShapeRenderContext) {
    // Envelope has 3:2 aspect ratio (width:height)
    return calculateAspectRatioBounds(ctx, {
      aspectRatio: 3 / 2,
      fitText: true,
      minWidth: 60,
      minHeight: 40,
    });
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

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
      defaultStroke: '#000000',
      defaultStrokeWidth: 1.5,
    });

    // Envelope body (rectangle)
    let svg = `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;

    // Envelope flap (triangle)
    const centerX = x + bounds.width / 2;
    const flapPath = `M ${x},${y} L ${centerX},${y + bounds.height / 2} L ${x + bounds.width},${y}`;
    svg += `<path d="${flapPath}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;

    // Optional label below the envelope
    if (ctx.node.label) {
      const textY = y + bounds.height + 16;
      const labelStyle = {
        ...ctx.style,
        fontSize: (ctx.style.fontSize || 14) * 0.85,
      };
      svg += renderShapeLabel(
        { ...ctx, style: labelStyle },
        ctx.node.label,
        centerX,
        textY
      );
    }

    return svg;
  },
};
