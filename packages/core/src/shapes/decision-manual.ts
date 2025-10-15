import type { ShapeDefinition } from '../types.js';

/**
 * Decision manual - Diamond with wavy bottom edge
 * Manual decision point combining diamond with document-style wave
 */
export const decisionManualShape: ShapeDefinition = {
  id: 'decision-manual',

  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 16;

    const size = Math.max(
      textSize.width * 1.5 + padding * 2,
      textSize.height * 1.5 + padding * 2,
      80
    );

    return {
      width: size,
      height: size,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);

    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    const midX = x + w / 2;
    const midY = y + h / 2;
    const waveHeight = 8;

    // Diamond with wavy bottom edge
    const path = [
      `M ${midX} ${y}`, // Top point
      `L ${x + w} ${midY}`, // Right point
      // Wavy bottom instead of straight line to bottom point
      `Q ${x + w * 0.875} ${y + h - waveHeight} ${x + w * 0.75} ${y + h}`,
      `Q ${x + w * 0.625} ${y + h + waveHeight} ${midX} ${y + h}`,
      `Q ${x + w * 0.375} ${y + h + waveHeight} ${x + w * 0.25} ${y + h}`,
      `Q ${x + w * 0.125} ${y + h - waveHeight} ${x} ${midY}`, // Left point
      `Z`,
    ].join(' ');

    return `
      <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${midX}" y="${midY}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
