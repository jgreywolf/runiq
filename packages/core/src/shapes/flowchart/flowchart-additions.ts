import type { ShapeDefinition } from '../../types/index.js';

/**
 * Multi-Process - Stacked rectangles to indicate multiple process instances
 */
export const multiProcessShape: ShapeDefinition = {
  id: 'multiProcess',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: textSize.width + padding * 2,
      height: textSize.height + padding * 2,
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
    const offset = 4;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    return `
      <!-- Back rectangle (stacked effect) -->
      <rect x="${x + offset * 2}" y="${y - offset * 2}" 
            width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Middle rectangle -->
      <rect x="${x + offset}" y="${y - offset}" 
            width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Front rectangle -->
      <rect x="${x}" y="${y}" 
            width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.fontFamily || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};

/**
 * Curly Brace Annotation - Left curly brace with text
 */
export const curlyBraceAnnotationShape: ShapeDefinition = {
  id: 'curlyBraceAnnotation',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 8;

    return {
      width: textSize.width + padding * 2 + 20, // Extra space for brace
      height: Math.max(textSize.height + padding * 2, 60),
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
    const h = bounds.height;
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    // Curly brace path
    const bracePath = `M ${x + 15} ${y}
                      Q ${x + 5} ${y} ${x + 5} ${y + h * 0.2}
                      L ${x + 5} ${y + h * 0.45}
                      Q ${x + 5} ${y + h * 0.5} ${x} ${y + h * 0.5}
                      Q ${x + 5} ${y + h * 0.5} ${x + 5} ${y + h * 0.55}
                      L ${x + 5} ${y + h * 0.8}
                      Q ${x + 5} ${y + h} ${x + 15} ${y + h}`;

    return `
      <path d="${bracePath}"
            fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${x + 25}" y="${y + h / 2}" 
            text-anchor="start" dominant-baseline="middle"
            font-family="${ctx.style.fontFamily || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};

/**
 * Magnetic Tape - Circle on top with triangular/trapezoidal bottom
 */
export const magneticTapeShape: ShapeDefinition = {
  id: 'magneticTape',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 80),
      height: Math.max(textSize.height + padding * 3, 60),
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
    const circleHeight = h * 0.5;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Combined path: top semicircle + trapezoid bottom
    const pathData = `M ${x} ${y + circleHeight}
                     A ${w / 2} ${circleHeight} 0 0 1 ${x + w} ${y + circleHeight}
                     L ${x + w * 0.8} ${y + h}
                     L ${x + w * 0.2} ${y + h}
                     Z`;

    return `
      <path d="${pathData}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${x + w / 2}" y="${y + h * 0.6}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.fontFamily || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
