import type { ShapeDefinition } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 60;

function actuatorBounds(
  ctx: Parameters<ShapeDefinition['bounds']>[0],
  minWidth = DEFAULT_WIDTH,
  minHeight = DEFAULT_HEIGHT
) {
  const label = ctx.node.label || ctx.node.id;
  const textSize = ctx.measureText(label, ctx.style);
  const padding = ctx.style.padding || 12;
  const width = Math.max(minWidth, textSize.width + padding * 2);
  const height = Math.max(minHeight, textSize.height + padding * 2);

  return { width, height };
}

function renderActuatorLabel(
  ctx: Parameters<ShapeDefinition['render']>[0],
  x: number,
  y: number,
  width: number,
  height: number
) {
  const label = ctx.node.label || ctx.node.id;
  return renderShapeLabel(ctx, label, x + width / 2, y + height / 2);
}

export const rotaryMotorShape: ShapeDefinition = {
  id: 'rotaryMotor',
  bounds(ctx) {
    return actuatorBounds(ctx, 70, 70);
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
    const arrowR = r * 0.6;
    const arrowX = cx + arrowR * 0.7;
    const arrowY = cy - arrowR * 0.2;

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <path d="M ${cx - arrowR} ${cy} A ${arrowR} ${arrowR} 0 1 1 ${arrowX} ${arrowY}"
        fill="none" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      <polygon points="${arrowX},${arrowY} ${arrowX - 6},${arrowY - 2} ${arrowX - 2},${arrowY + 6}"
        fill="${stroke}" />
      ${renderActuatorLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const linearActuatorShape: ShapeDefinition = {
  id: 'linearActuator',
  bounds(ctx) {
    return actuatorBounds(ctx);
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
    const arrowX = x + bounds.width * 0.75;
    const arrowY = y + bounds.height / 2;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
        rx="${bounds.height * 0.2}" ry="${bounds.height * 0.2}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${x + bounds.width * 0.2}" y1="${arrowY}" x2="${arrowX}" y2="${arrowY}"
        stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      <polygon points="${arrowX},${arrowY} ${arrowX - 8},${arrowY - 5} ${arrowX - 8},${arrowY + 5}"
        fill="${stroke}" />
      ${renderActuatorLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const springShape: ShapeDefinition = {
  id: 'spring',
  bounds(ctx) {
    return actuatorBounds(ctx);
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
    const midY = y + bounds.height / 2;
    const startX = x + bounds.width * 0.15;
    const endX = x + bounds.width * 0.85;
    const zigZag = [
      `${startX},${midY}`,
      `${startX + bounds.width * 0.1},${midY - bounds.height * 0.2}`,
      `${startX + bounds.width * 0.2},${midY + bounds.height * 0.2}`,
      `${startX + bounds.width * 0.3},${midY - bounds.height * 0.2}`,
      `${startX + bounds.width * 0.4},${midY + bounds.height * 0.2}`,
      `${startX + bounds.width * 0.5},${midY - bounds.height * 0.2}`,
      `${startX + bounds.width * 0.6},${midY + bounds.height * 0.2}`,
      `${startX + bounds.width * 0.7},${midY - bounds.height * 0.2}`,
      `${endX},${midY}`,
    ].join(' ');

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <polyline points="${zigZag}" fill="none"
        stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      ${renderActuatorLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const damperShape: ShapeDefinition = {
  id: 'damper',
  bounds(ctx) {
    return actuatorBounds(ctx);
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
    const midY = y + bounds.height / 2;
    const startX = x + bounds.width * 0.2;
    const endX = x + bounds.width * 0.8;
    const blockWidth = bounds.width * 0.15;
    const blockHeight = bounds.height * 0.35;
    const blockX = x + bounds.width * 0.45;
    const blockY = midY - blockHeight / 2;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <line x1="${startX}" y1="${midY}" x2="${blockX}" y2="${midY}"
        stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      <rect x="${blockX}" y="${blockY}" width="${blockWidth}" height="${blockHeight}"
        fill="${stroke}" />
      <line x1="${blockX + blockWidth}" y1="${midY}" x2="${endX}" y2="${midY}"
        stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      ${renderActuatorLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const gearShape: ShapeDefinition = {
  id: 'gear',
  bounds(ctx) {
    return actuatorBounds(ctx, 80, 80);
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
    const toothSize = r * 0.18;
    const teeth = [
      { x: cx - toothSize / 2, y: y - toothSize * 0.1, w: toothSize, h: toothSize },
      { x: cx - toothSize / 2, y: y + bounds.height - toothSize * 0.9, w: toothSize, h: toothSize },
      { x: x - toothSize * 0.1, y: cy - toothSize / 2, w: toothSize, h: toothSize },
      { x: x + bounds.width - toothSize * 0.9, y: cy - toothSize / 2, w: toothSize, h: toothSize },
    ];

    return `
      <circle cx="${cx}" cy="${cy}" r="${r}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      ${teeth
        .map(
          (tooth) => `
        <rect x="${tooth.x}" y="${tooth.y}" width="${tooth.w}" height="${tooth.h}"
          fill="${stroke}" />`
        )
        .join('\n')}
      <circle cx="${cx}" cy="${cy}" r="${r * 0.35}"
        fill="none" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      ${renderActuatorLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};
