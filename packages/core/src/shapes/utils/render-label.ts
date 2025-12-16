import type { ShapeRenderContext } from '../../types/index.js';
import { escapeXml } from '../../types/shape-types.js';

/**
 * Helper function to render labels consistently across all shapes.
 * Uses ctx.renderLabel if available (supports inline icons like "fa:fa-star Label"),
 * otherwise falls back to plain text rendering with multiline support.
 *
 * @param ctx - Shape render context
 * @param label - Label text to render (may contain inline icon syntax or \n for line breaks)
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

  // Check if label contains newlines for multiline rendering
  const lines = label.split('\n');
  const lineHeight = fontSize * 1.2;

  // Build base attributes
  const baseAttrs = `text-anchor="${textAnchor}" font-family="${fontFamily}" font-size="${fontSize}"`;
  const styleAttrs = [
    fontWeight ? `font-weight="${fontWeight}"` : '',
    fontStyle ? `font-style="${fontStyle}"` : '',
    textDecoration ? `text-decoration="${textDecoration}"` : '',
  ]
    .filter((a) => a)
    .join(' ');
  const allAttrs = [baseAttrs, styleAttrs, `fill="${textColor}"`]
    .filter((a) => a)
    .join(' ');

  // Single line - simple text element
  if (lines.length === 1) {
    return `<text x="${x}" y="${y}" dominant-baseline="${dominantBaseline}" ${allAttrs}>${escapeXml(label)}</text>`;
  }

  // Multiple lines - use tspan elements
  let startY = y;
  if (dominantBaseline === 'middle') {
    // Center the block of text vertically
    startY = y - ((lines.length - 1) * lineHeight) / 2;
  }

  let textElement = `<text ${allAttrs}>`;
  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight;
    textElement += `<tspan x="${x}" y="${lineY}">${escapeXml(line)}</tspan>`;
  });
  textElement += `</text>`;

  return textElement;
}
