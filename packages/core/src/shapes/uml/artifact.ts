import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * UML Artifact shape - represents a physical piece of information (file, database, etc.).
 * Rendered as a rectangle with a dog-eared (folded) corner and «artifact» stereotype.
 */
export const artifactShape: ShapeDefinition = {
  id: 'artifact',

  bounds(ctx: ShapeRenderContext) {
    const padding = ctx.style.padding || 12;
    const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);
    const stereotypeMetrics = ctx.measureText('«artifact»', ctx.style);

    const minWidth = 100;
    const minHeight = 70;

    const width = Math.max(
      minWidth,
      labelMetrics.width + padding * 2,
      stereotypeMetrics.width + padding * 2
    );
    const height = Math.max(
      minHeight,
      labelMetrics.height + stereotypeMetrics.height + padding * 3
    );

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    const halfWidth = bounds.width / 2;
    const halfHeight = bounds.height / 2;

    return [
      { id: 'top', x: halfWidth, y: 0 },
      { id: 'right', x: bounds.width, y: halfHeight },
      { id: 'bottom', x: halfWidth, y: bounds.height },
      { id: 'left', x: 0, y: halfHeight },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const fillColor = (ctx.node.data?.fillColor as string) || '#ffffcc';
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#666666';
    const strokeWidth = (ctx.node.data?.strokeWidth as number) || 2;

    const foldSize = 12; // Size of the dog-eared corner

    // Create path for rectangle with dog-eared corner
    const path = `
			M ${x},${y}
			L ${x + bounds.width - foldSize},${y}
			L ${x + bounds.width},${y + foldSize}
			L ${x + bounds.width},${y + bounds.height}
			L ${x},${y + bounds.height}
			Z
		`.trim();

    // Fold line (diagonal line for the dog-ear)
    const foldLine = `M ${x + bounds.width - foldSize},${y} L ${x + bounds.width},${y + foldSize}`;

    const shape = `<path d="${path}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
    const fold = `<path d="${foldLine}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;

    // Stereotype text (top)
    const fontSize = ctx.style.fontSize || 14;
    const stereotypeX = x + bounds.width / 2;
    const stereotypeY = y + fontSize + 8;
    const stereotype = `<text x="${stereotypeX}" y="${stereotypeY}" text-anchor="middle" font-family="${ctx.style.fontFamily}" font-size="${fontSize - 2}" fill="#666666">«artifact»</text>`;

    // Label text (center)
    const label = ctx.node.label || '';
    const textX = x + bounds.width / 2;
    const textY = y + bounds.height / 2 + fontSize / 3 + 6;

    return `${shape}${fold}${stereotype}${renderShapeLabel(ctx, label, textX, textY)}`;
  },
};
