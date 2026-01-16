import type { ShapeDefinition } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

const MIN_SIZE = 60;

function jointBounds(
  ctx: Parameters<ShapeDefinition['bounds']>[0],
  minSize = MIN_SIZE
) {
  const label = ctx.node.label || ctx.node.id;
  const textSize = ctx.measureText(label, ctx.style);
  const padding = ctx.style.padding || 12;
  const size = Math.max(
    minSize,
    textSize.width + padding * 2,
    textSize.height + padding * 2
  );

  return { width: size, height: size };
}

function renderJointLabel(
  ctx: Parameters<ShapeDefinition['render']>[0],
  x: number,
  y: number,
  width: number,
  height: number
) {
  const label = ctx.node.label || ctx.node.id;
  return renderShapeLabel(ctx, label, x + width / 2, y + height / 2);
}

export const revoluteJointShape: ShapeDefinition = {
  id: 'revoluteJoint',
  bounds(ctx) {
    return jointBounds(ctx);
  },
  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
    });
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const r = bounds.width / 2;

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <circle cx="${cx}" cy="${cy}" r="${Math.max(3, r * 0.12)}"
        fill="${stroke}" />
      ${renderJointLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const fixedJointShape: ShapeDefinition = {
  id: 'fixedJoint',
  bounds(ctx) {
    return jointBounds(ctx);
  },
  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#e5e7eb',
    });
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const r = bounds.width / 2;

    const crossSize = r * 0.5;
    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx - crossSize}" y1="${cy - crossSize}" x2="${cx + crossSize}" y2="${cy + crossSize}"
        stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      <line x1="${cx - crossSize}" y1="${cy + crossSize}" x2="${cx + crossSize}" y2="${cy - crossSize}"
        stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      ${renderJointLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const prismaticJointShape: ShapeDefinition = {
  id: 'prismaticJoint',
  bounds(ctx) {
    return jointBounds(ctx, 70);
  },
  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
    });
    const slotWidth = bounds.width * 0.6;
    const slotHeight = bounds.height * 0.25;
    const slotX = x + (bounds.width - slotWidth) / 2;
    const slotY = y + (bounds.height - slotHeight) / 2;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
        rx="${bounds.width * 0.12}" ry="${bounds.width * 0.12}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <rect x="${slotX}" y="${slotY}" width="${slotWidth}" height="${slotHeight}"
        rx="${slotHeight / 2}" ry="${slotHeight / 2}"
        fill="none" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      ${renderJointLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const sphericalJointShape: ShapeDefinition = {
  id: 'sphericalJoint',
  bounds(ctx) {
    return jointBounds(ctx);
  },
  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
    });
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const r = bounds.width / 2;
    const crossSize = r * 0.6;

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx - crossSize}" y1="${cy}" x2="${cx + crossSize}" y2="${cy}"
        stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      <line x1="${cx}" y1="${cy - crossSize}" x2="${cx}" y2="${cy + crossSize}"
        stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      ${renderJointLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const universalJointShape: ShapeDefinition = {
  id: 'universalJoint',
  bounds(ctx) {
    return jointBounds(ctx);
  },
  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
    });
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const r = bounds.width / 2;
    const crossSize = r * 0.6;

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${cx - crossSize}" y1="${cy - crossSize}" x2="${cx + crossSize}" y2="${cy + crossSize}"
        stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      <line x1="${cx - crossSize}" y1="${cy + crossSize}" x2="${cx + crossSize}" y2="${cy - crossSize}"
        stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      ${renderJointLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const cylindricalJointShape: ShapeDefinition = {
  id: 'cylindricalJoint',
  bounds(ctx) {
    return jointBounds(ctx, 70);
  },
  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
    });
    const innerW = bounds.width * 0.6;
    const innerH = bounds.height * 0.6;
    const innerX = x + (bounds.width - innerW) / 2;
    const innerY = y + (bounds.height - innerH) / 2;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
        rx="${bounds.width * 0.2}" ry="${bounds.width * 0.2}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <rect x="${innerX}" y="${innerY}" width="${innerW}" height="${innerH}"
        rx="${innerW * 0.25}" ry="${innerW * 0.25}"
        fill="none" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      ${renderJointLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const planarJointShape: ShapeDefinition = {
  id: 'planarJoint',
  bounds(ctx) {
    return jointBounds(ctx, 70);
  },
  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
    });
    const hatchCount = 4;
    const hatchSpacing = bounds.width / (hatchCount + 1);
    const hatchLines = Array.from({ length: hatchCount }).map((_, index) => {
      const hx = x + hatchSpacing * (index + 1);
      return `<line x1="${hx}" y1="${y + bounds.height * 0.2}" x2="${hx}" y2="${y + bounds.height * 0.8}"
        stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />`;
    });

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      ${hatchLines.join('\n')}
      ${renderJointLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};
