import type { ShapeDefinition } from '../../types.js';

/**
 * Multi-Process - Stacked rectangles to indicate multiple process instances
 */
export const multiProcessShape: ShapeDefinition = {
  id: 'multi-process',
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
 * OR - Circle with OR text/symbol
 */
export const orShape: ShapeDefinition = {
  id: 'or',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || 'OR', ctx.style);
    const padding = ctx.style.padding || 12;
    const diameter = Math.max(textSize.width, textSize.height) + padding * 2;

    return {
      width: diameter,
      height: diameter,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const r = bounds.width / 2;

    return [
      { x: r, y: 0, name: 'top' },
      { x: bounds.width, y: r, name: 'right' },
      { x: r, y: bounds.height, name: 'bottom' },
      { x: 0, y: r, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const r = bounds.width / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.fontFamily || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}" font-weight="bold">
        ${ctx.node.label || 'OR'}
      </text>
    `;
  },
};

/**
 * Summing Junction - Circle with + (plus) symbol
 */
export const summingJunctionShape: ShapeDefinition = {
  id: 'summing-junction',
  bounds() {
    return {
      width: 40,
      height: 40,
    };
  },

  anchors() {
    return [
      { x: 20, y: 0, name: 'top' },
      { x: 40, y: 20, name: 'right' },
      { x: 20, y: 40, name: 'bottom' },
      { x: 0, y: 20, name: 'left' },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const cx = x + 20;
    const cy = y + 20;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    return `
      <circle cx="${cx}" cy="${cy}" r="18"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Plus symbol -->
      <line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy + 10}"
            stroke="${stroke}" stroke-width="2" />
      <line x1="${cx - 10}" y1="${cy}" x2="${cx + 10}" y2="${cy}"
            stroke="${stroke}" stroke-width="2" />
      
      <text x="${cx}" y="${cy + 28}" 
            text-anchor="middle" dominant-baseline="hanging"
            font-family="${ctx.style.fontFamily || 'sans-serif'}" font-size="10">
        ${ctx.node.label || ''}
      </text>
    `;
  },
};

/**
 * Curly Brace Annotation - Left curly brace with text
 */
export const curlyBraceAnnotationShape: ShapeDefinition = {
  id: 'curly-brace-annotation',
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
  id: 'magnetic-tape',
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
