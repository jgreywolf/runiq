import type { ShapeRenderContext } from '../../types/index.js';
import { escapeXml } from '../../types/shape-types.js';

/**
 * Helper function to render labels consistently across all shapes.
 * Uses ctx.renderLabel if available (supports inline icons like "fa:fa-star Label"),
 * otherwise falls back to plain text rendering.
 *
 * @param ctx - Shape render context
 * @param label - Label text to render (may contain inline icon syntax)
 * @param x - X coordinate for label
 * @param y - Y coordinate for label
 * @param textAnchor - Text alignment ('start' | 'middle' | 'end')
 * @param dominantBaseline - Vertical alignment
 * @returns SVG markup for the label
 */
export function renderShapeLabel(
  ctx: ShapeRenderContext,
  label: string,
  x: number,
  y: number,
  textAnchor: 'start' | 'middle' | 'end' = 'middle',
  dominantBaseline: string = 'middle'
): string {
  const textColor =
    (typeof ctx.style.color === 'string' ? ctx.style.color : undefined) ||
    '#000';
  const fontSize = ctx.style.fontSize || 14;
  const fontFamily = ctx.style.font || 'sans-serif';
  const fontWeight = ctx.style.fontWeight;
  const fontStyle = ctx.style.fontStyle;
  const textDecoration = ctx.style.textDecoration;

  // Use renderLabel if available (supports inline icons), otherwise plain text
  if (ctx.renderLabel) {
    return ctx.renderLabel(label, x, y, {
      fontSize,
      fontFamily,
      fill: textColor,
      textAnchor,
      dominantBaseline,
      fontWeight,
      fontStyle,
      textDecoration,
    });
  }

  // Fallback to plain text with additional style attributes
  let textElement = `<text x="${x}" y="${y}" 
      text-anchor="${textAnchor}" dominant-baseline="${dominantBaseline}"
      font-family="${fontFamily}" font-size="${fontSize}"`;

  if (fontWeight) {
    textElement += ` font-weight="${fontWeight}"`;
  }
  if (fontStyle) {
    textElement += ` font-style="${fontStyle}"`;
  }
  if (textDecoration) {
    textElement += ` text-decoration="${textDecoration}"`;
  }

  textElement += ` fill="${textColor}">${escapeXml(label)}</text>`;
  return textElement;
}
