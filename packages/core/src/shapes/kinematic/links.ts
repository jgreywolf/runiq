import type { ShapeDefinition } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

const DEFAULT_LINK_WIDTH = 140;
const DEFAULT_LINK_HEIGHT = 50;

function linkBounds(
  ctx: Parameters<ShapeDefinition['bounds']>[0],
  minWidth = DEFAULT_LINK_WIDTH,
  minHeight = DEFAULT_LINK_HEIGHT
) {
  const label = ctx.node.label || ctx.node.id;
  const textSize = ctx.measureText(label, ctx.style);
  const padding = ctx.style.padding || 12;
  const width = Math.max(minWidth, textSize.width + padding * 2);
  const height = Math.max(minHeight, textSize.height + padding * 2);

  return { width, height };
}

function renderLinkLabel(
  ctx: Parameters<ShapeDefinition['render']>[0],
  x: number,
  y: number,
  width: number,
  height: number
) {
  const label = ctx.node.label || ctx.node.id;
  return renderShapeLabel(ctx, label, x + width / 2, y + height / 2);
}

export const binaryLinkShape: ShapeDefinition = {
  id: 'binaryLink',
  bounds(ctx) {
    return linkBounds(ctx);
  },
  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#f8fafc',
    });
    const radius = bounds.height * 0.3;
    const leftCx = x + radius + bounds.height * 0.1;
    const rightCx = x + bounds.width - radius - bounds.height * 0.1;
    const cy = y + bounds.height / 2;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
        rx="${bounds.height * 0.25}" ry="${bounds.height * 0.25}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <circle cx="${leftCx}" cy="${cy}" r="${radius}"
        fill="#fff" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      <circle cx="${rightCx}" cy="${cy}" r="${radius}"
        fill="#fff" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      ${renderLinkLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const ternaryLinkShape: ShapeDefinition = {
  id: 'ternaryLink',
  bounds(ctx) {
    return linkBounds(ctx, 120, 90);
  },
  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#f8fafc',
    });
    const cx = x + bounds.width / 2;
    const topY = y + bounds.height * 0.15;
    const leftX = x + bounds.width * 0.18;
    const rightX = x + bounds.width * 0.82;
    const bottomY = y + bounds.height * 0.85;
    const holeRadius = bounds.height * 0.12;

    return `
      <polygon points="${cx},${topY} ${rightX},${bottomY} ${leftX},${bottomY}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <circle cx="${cx}" cy="${topY + holeRadius * 1.2}" r="${holeRadius}"
        fill="#fff" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      <circle cx="${leftX + holeRadius}" cy="${bottomY - holeRadius * 1.2}" r="${holeRadius}"
        fill="#fff" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      <circle cx="${rightX - holeRadius}" cy="${bottomY - holeRadius * 1.2}" r="${holeRadius}"
        fill="#fff" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />
      ${renderLinkLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const quaternaryLinkShape: ShapeDefinition = {
  id: 'quaternaryLink',
  bounds(ctx) {
    return linkBounds(ctx, 140, 90);
  },
  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },
  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#f8fafc',
    });
    const insetX = bounds.width * 0.15;
    const insetY = bounds.height * 0.2;
    const holeRadius = bounds.height * 0.1;

    const holes = [
      { cx: x + insetX, cy: y + insetY },
      { cx: x + bounds.width - insetX, cy: y + insetY },
      { cx: x + insetX, cy: y + bounds.height - insetY },
      { cx: x + bounds.width - insetX, cy: y + bounds.height - insetY },
    ];

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
        rx="${bounds.height * 0.2}" ry="${bounds.height * 0.2}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      ${holes
        .map(
          (hole) => `
        <circle cx="${hole.cx}" cy="${hole.cy}" r="${holeRadius}"
          fill="#fff" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />`
        )
        .join('\n')}
      ${renderLinkLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};

export const groundLinkShape: ShapeDefinition = {
  id: 'groundLink',
  bounds(ctx) {
    return linkBounds(ctx, 140, 60);
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
    const hatchY = y + bounds.height * 0.7;
    const hatchSpacing = bounds.width / 6;
    const hatchLines = Array.from({ length: 5 }).map((_, index) => {
      const hx = x + hatchSpacing * (index + 1);
      return `<line x1="${hx}" y1="${hatchY}" x2="${hx - hatchSpacing * 0.4}" y2="${
        hatchY + bounds.height * 0.2
      }" stroke="${stroke}" stroke-width="${Math.max(1, strokeWidth)}" />`;
    });

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
        fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      ${hatchLines.join('\n')}
      ${renderLinkLabel(ctx, x, y, bounds.width, bounds.height)}
    `;
  },
};
