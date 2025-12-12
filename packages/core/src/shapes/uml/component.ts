import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * UML Component shape - represents a modular part of a system with defined interfaces.
 * Rendered as a rectangle with two small rectangles on the left side (component symbol).
 *
 * Note: Shape ID is 'umlComponent' because 'component' is a reserved keyword
 * in the Langium grammar for Wardley map component statements.
 */
export const componentShape: ShapeDefinition = {
  id: 'umlComponent',

  bounds(ctx: ShapeRenderContext) {
    const padding = ctx.style.padding || 12;
    const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

    const minWidth = 100;
    const minHeight = 60;

    const width = Math.max(minWidth, labelMetrics.width + padding * 3 + 20); // Extra space for component symbol
    const height = Math.max(minHeight, labelMetrics.height + padding * 2);

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

    const backgroundColor = (ctx.node.data?.fillColor as string) || '#ffffff';
    const strokeColor = (ctx.node.data?.strokeColor as string) || '#333333';
    const strokeWidth = (ctx.node.data?.strokeWidth as number) || 2;

    const symbolSize = 16; // Width of component symbol rectangles
    const symbolHeight = 8; // Height of component symbol rectangles
    const symbolSpacing = 4; // Spacing between the two rectangles
    const symbolX = x - 8; // Position symbol slightly outside the main rectangle
    const symbolY = y + 16; // Position from top

    // Component symbol (two small rectangles on the left)
    const symbol1 = `<rect x="${symbolX}" y="${symbolY}" width="${symbolSize}" height="${symbolHeight}" fill="${backgroundColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" rx="1"/>`;
    const symbol2 = `<rect x="${symbolX}" y="${symbolY + symbolHeight + symbolSpacing}" width="${symbolSize}" height="${symbolHeight}" fill="${backgroundColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" rx="1"/>`;

    // Main rectangle with rounded corners
    const rect = `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" fill="${backgroundColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}" rx="4"/>`;

    // Label (centered)
    const textX = x + bounds.width / 2;
    const textY = y + bounds.height / 2 + (ctx.style.fontSize || 14) / 3;
    const label = ctx.node.label || '';
    const text = renderShapeLabel(ctx, label, textX, textY);

    return `${rect}${symbol1}${symbol2}${text}`;
  },
};
