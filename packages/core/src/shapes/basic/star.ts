import type { ShapeDefinition } from '../../types.js';

/**
 * Star - 5-pointed star (unfilled)
 * Used for ratings, favorites, highlights
 */
export const starShape: ShapeDefinition = {
  id: 'star',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    // Star needs room for points - make it wider/taller than text
    const size = Math.max(
      textSize.width + padding * 2,
      textSize.height + padding * 2,
      60
    );

    return {
      width: size,
      height: size,
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
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const outerRadius = Math.min(bounds.width, bounds.height) / 2;
    const innerRadius = outerRadius * 0.4; // Inner points at 40% of outer

    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    // Generate 5-pointed star path
    const points = [];
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const innerAngle = ((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;

      points.push(
        cx + outerRadius * Math.cos(outerAngle),
        cy + outerRadius * Math.sin(outerAngle)
      );

      points.push(
        cx + innerRadius * Math.cos(innerAngle),
        cy + innerRadius * Math.sin(innerAngle)
      );
    }

    const pathData =
      `M ${points[0]} ${points[1]} ` +
      points
        .slice(2)
        .map((p, i) => (i % 2 === 0 ? `L ${p}` : p))
        .join(' ') +
      ' Z';

    return `
      <path d="${pathData}"
            fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};

/**
 * Star Filled - 5-pointed star (filled)
 * Used for ratings, favorites, highlights
 */
export const starFilledShape: ShapeDefinition = {
  id: 'star-filled',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    // Star needs room for points - make it wider/taller than text
    const size = Math.max(
      textSize.width + padding * 2,
      textSize.height + padding * 2,
      60
    );

    return {
      width: size,
      height: size,
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
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const outerRadius = Math.min(bounds.width, bounds.height) / 2;
    const innerRadius = outerRadius * 0.4;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Generate 5-pointed star path
    const points = [];
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const innerAngle = ((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;

      points.push(
        cx + outerRadius * Math.cos(outerAngle),
        cy + outerRadius * Math.sin(outerAngle)
      );

      points.push(
        cx + innerRadius * Math.cos(innerAngle),
        cy + innerRadius * Math.sin(innerAngle)
      );
    }

    const pathData =
      `M ${points[0]} ${points[1]} ` +
      points
        .slice(2)
        .map((p, i) => (i % 2 === 0 ? `L ${p}` : p))
        .join(' ') +
      ' Z';

    return `
      <path d="${pathData}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};

/**
 * Octagon - 8-sided polygon
 * Used for stop signs, alerts, special processes
 */
export const octagonShape: ShapeDefinition = {
  id: 'octagon',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    const size = Math.max(
      textSize.width + padding * 2,
      textSize.height + padding * 2,
      60
    );

    return {
      width: size,
      height: size,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) / 2;

    // 8 anchor points, one per octagon side
    const anchors = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 - Math.PI / 2; // Start at top
      const names = [
        'top',
        'top-right',
        'right',
        'bottom-right',
        'bottom',
        'bottom-left',
        'left',
        'top-left',
      ];
      anchors.push({
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        name: names[i],
      });
    }

    return anchors;
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const radius = Math.min(bounds.width, bounds.height) / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Generate octagon points
    const points = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      points.push(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }

    const pathData =
      `M ${points[0]} ${points[1]} ` +
      points
        .slice(2)
        .map((p, i) => (i % 2 === 0 ? `L ${p}` : p))
        .join(' ') +
      ' Z';

    return `
      <path d="${pathData}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};

/**
 * Plus - Block-style plus/cross symbol
 * Used for addition, medical symbols, Swiss cross
 */
export const plusShape: ShapeDefinition = {
  id: 'plus',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    const size = Math.max(
      textSize.width + padding * 2,
      textSize.height + padding * 2,
      60
    );

    return {
      width: size,
      height: size,
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
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const size = Math.min(bounds.width, bounds.height);
    const armWidth = size * 0.3; // Width of plus arms
    const armLength = size / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Create plus shape using 12-point path (block cross)
    const hw = armWidth / 2; // half width
    const pathData = `
      M ${cx - hw} ${cy - armLength}
      L ${cx + hw} ${cy - armLength}
      L ${cx + hw} ${cy - hw}
      L ${cx + armLength} ${cy - hw}
      L ${cx + armLength} ${cy + hw}
      L ${cx + hw} ${cy + hw}
      L ${cx + hw} ${cy + armLength}
      L ${cx - hw} ${cy + armLength}
      L ${cx - hw} ${cy + hw}
      L ${cx - armLength} ${cy + hw}
      L ${cx - armLength} ${cy - hw}
      L ${cx - hw} ${cy - hw}
      Z
    `;

    return `
      <path d="${pathData}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <text x="${cx}" y="${cy}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${ctx.style.font || 'sans-serif'}" font-size="${ctx.style.fontSize || 14}">
        ${ctx.node.label || ctx.node.id}
      </text>
    `;
  },
};
