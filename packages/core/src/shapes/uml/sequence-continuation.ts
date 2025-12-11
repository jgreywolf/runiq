import type { ShapeDefinition } from '../../types/index.js';

/**
 * UML Continuation shape
 * Represents a goto-like flow control mechanism in sequence diagrams
 * UML 2.5: Continuations define connection points for continuing interaction flows
 * Shape: Hexagon with label inside
 */
export const continuationShape: ShapeDefinition = {
  id: 'continuation',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const textSize = ctx.measureText(ctx.node.label || 'ref', ctx.style);

    // Hexagon needs extra width for angled sides
    const width = textSize.width + padding * 3;
    const height = textSize.height + padding * 2;

    return {
      width: Math.max(width, 80),
      height: Math.max(height, 40),
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1.5;
    const fontSize = ctx.style.fontSize || 14;
    const fontFamily = ctx.style.font || 'Arial';

    // Hexagon path - horizontal orientation
    // Indent on left and right sides
    const indent = w * 0.15;

    const path = `M ${x + indent} ${y}
                  L ${x + w - indent} ${y}
                  L ${x + w} ${y + h / 2}
                  L ${x + w - indent} ${y + h}
                  L ${x + indent} ${y + h}
                  L ${x} ${y + h / 2}
                  Z`;

    let svg = `<g class="continuation-shape">`;

    // Hexagon shape
    svg += `<path d="${path}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label (centered)
    svg += `<text x="${x + w / 2}" y="${y + h / 2 + fontSize / 3}" `;
    svg += `text-anchor="middle" font-size="${fontSize}" `;
    svg += `font-family="${fontFamily}" fill="${stroke}">`;
    svg += `${ctx.node.label || 'ref'}</text>`;

    svg += `</g>`;
    return svg;
  },
};
