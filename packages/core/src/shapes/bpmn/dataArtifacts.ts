import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { calculateRectangularAnchors, extractBasicStyles } from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

function getLabel(ctx: ShapeRenderContext) {
  return ctx.node.label || ctx.node.id;
}

function getDataObjectBounds(ctx: ShapeRenderContext) {
  const padding = ctx.style.padding || 12;
  const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

  return {
    width: Math.max(68, labelMetrics.width + padding * 2),
    height: Math.max(84, labelMetrics.height + padding * 3),
  };
}

function renderFoldedDocument(
  ctx: ShapeRenderContext,
  position: { x: number; y: number },
  artifactType: 'input' | 'output'
) {
  const bounds = getDataObjectBounds(ctx);
  const { x, y } = position;
  const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
    defaultFill: '#ffffff',
    defaultStroke: '#000000',
    defaultStrokeWidth: 1.5,
  });

  const foldSize = 12;
  const arrowY = y + bounds.height / 2;
  const arrowLength = 14;

  const outlinePath = `
    M ${x},${y}
    L ${x + bounds.width - foldSize},${y}
    L ${x + bounds.width},${y + foldSize}
    L ${x + bounds.width},${y + bounds.height}
    L ${x},${y + bounds.height}
    Z
  `.trim();

  const foldLine = `M ${x + bounds.width - foldSize},${y} L ${x + bounds.width},${y + foldSize}`;

  const arrowPath =
    artifactType === 'input'
      ? `M ${x - arrowLength} ${arrowY} L ${x - 4} ${arrowY} M ${x - 10} ${arrowY - 5} L ${x - 4} ${arrowY} L ${x - 10} ${arrowY + 5}`
      : `M ${x + bounds.width + 4} ${arrowY} L ${x + bounds.width + arrowLength} ${arrowY} M ${x + bounds.width + 10} ${arrowY - 5} L ${x + bounds.width + arrowLength} ${arrowY} L ${x + bounds.width + 10} ${arrowY + 5}`;

  let svg = `<path d="${outlinePath}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
  svg += `<path d="${foldLine}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
  svg += `<path d="${arrowPath}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`;
  svg += renderShapeLabel(ctx, getLabel(ctx), x + bounds.width / 2, y + bounds.height / 2 + (ctx.style.fontSize || 14) / 3);

  return svg;
}

export const bpmnDataInputShape: ShapeDefinition = {
  id: 'bpmnDataInput',

  bounds(ctx) {
    const bounds = getDataObjectBounds(ctx);
    return { width: bounds.width + 18, height: bounds.height };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    return renderFoldedDocument(ctx, { x: position.x + 18, y: position.y }, 'input');
  },
};

export const bpmnDataOutputShape: ShapeDefinition = {
  id: 'bpmnDataOutput',

  bounds(ctx) {
    const bounds = getDataObjectBounds(ctx);
    return { width: bounds.width + 18, height: bounds.height };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    return renderFoldedDocument(ctx, position, 'output');
  },
};

export const bpmnDataStoreShape: ShapeDefinition = {
  id: 'bpmnDataStore',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

    return {
      width: Math.max(86, labelMetrics.width + padding * 2),
      height: Math.max(72, labelMetrics.height + padding * 3),
    };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
      defaultStroke: '#000000',
      defaultStrokeWidth: 1.5,
    });

    const rx = bounds.width / 2;
    const topY = y + 10;
    const bottomY = y + bounds.height - 10;
    const leftX = x + 8;
    const rightX = x + bounds.width - 8;

    let svg = `
      <ellipse cx="${x + bounds.width / 2}" cy="${topY}" rx="${rx - 8}" ry="10"
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <path d="M ${leftX} ${topY} L ${leftX} ${bottomY}"
            fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <path d="M ${rightX} ${topY} L ${rightX} ${bottomY}"
            fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <path d="M ${leftX} ${bottomY}
               A ${rx - 8} 10 0 0 0 ${rightX} ${bottomY}
               A ${rx - 8} 10 0 0 0 ${leftX} ${bottomY}"
            fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
    `;

    svg += renderShapeLabel(ctx, getLabel(ctx), x + bounds.width / 2, y + bounds.height / 2 + 4);

    return svg;
  },
};
