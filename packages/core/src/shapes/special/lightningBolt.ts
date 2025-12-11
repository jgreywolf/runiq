import type { ShapeDefinition } from '../../types/index.js';

/**
 * Lightning bolt - for power, energy, or asynchronous events
 * Zigzag lightning bolt shape
 * Used for interrupts, events, or power-related operations
 */
export const lightningBoltShape: ShapeDefinition = {
  id: 'lightning',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const padding = ctx.style.padding || 12;

    const width = Math.max(textSize.width + padding * 2, 60);
    const height = Math.max(textSize.height + padding * 2, 80); // Taller for lightning

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w * 0.75, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: w * 0.25, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    // Classic lightning bolt shape with improved middle zigzag
    // The zigzag should be more horizontal and pronounced
    const points = [
      `${x + w * 0.5},${y}`, // 1. Top center-left
      `${x + w * 0.2},${y + h * 0.42}`, // 2. Left side upper jag (go left)
      `${x + w * 0.55},${y + h * 0.42}`, // 3. Middle notch (jog RIGHT past center)
      `${x + w * 0.25},${y + h}`, // 4. Bottom sharp point (go left to tip)
      `${x + w * 0.8},${y + h * 0.3}`, // 5. Right side (from tip, go FAR RIGHT)
      `${x + w * 0.55},${y + h * 0.3}`, // 6. Middle indent (jog back LEFT)
      `${x + w * 0.8},${y}`, // 7. Top center-right (back to top)
    ].join(' ');

    const fill = ctx.style.fill || '#fbbf24';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const font = ctx.style.font || 'sans-serif';
    const fontSize = ctx.style.fontSize || 10;

    const textX = x + w / 2;
    const textY = y + h * 0.78; // Lower to avoid bolt shape

    return `
      <polygon points="${points}"
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${textX}" y="${textY}"
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize}">
        ${ctx.node.label || ''}
      </text>
    `;
  },
};
