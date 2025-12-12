import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Transaction - Rounded rectangle with double border (thick outer, thin inner)
 */
export const transactionShape: ShapeDefinition = {
  id: 'transaction',
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
    const radius = 8;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';

    return `
      <!-- Outer rectangle (thick border) -->
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="${radius}"
            fill="${fill}" stroke="${stroke}" stroke-width="3" />
      
      <!-- Inner rectangle (thin border) -->
      <rect x="${x + 3}" y="${y + 3}" width="${bounds.width - 6}" height="${bounds.height - 6}" rx="${radius}"
            fill="none" stroke="${stroke}" stroke-width="1" />
      
      ${renderShapeLabel(ctx, ctx.node.label || ctx.node.id, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};

/**
 * Event Sub Process - Rounded rectangle with dashed border
 */
export const eventSubProcessShape: ShapeDefinition = {
  id: 'eventSubProcess',
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
    const radius = 8;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="${radius}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="5,3" />
      
      ${renderShapeLabel(ctx, ctx.node.label || ctx.node.id, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};

/**
 * Call Activity - Rounded rectangle with thick border
 */
export const callActivityShape: ShapeDefinition = {
  id: 'callActivity',
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
    const radius = 8;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';

    return `
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="${radius}"
            fill="${fill}" stroke="${stroke}" stroke-width="3" />
      
      ${renderShapeLabel(ctx, ctx.node.label || ctx.node.id, x + bounds.width / 2, y + bounds.height / 2)}
    `;
  },
};

/**
 * Start Non-Interfering - Unfilled circle with dashed stroke
 */
export const startNonInterferingShape: ShapeDefinition = {
  id: 'startNonInterfering',
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
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    return `
      <circle cx="${cx}" cy="${cy}" r="18"
              fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="3,2" />
      
      ${ctx.node.label ? renderShapeLabel({ ...ctx, style: { ...ctx.style, fontSize: 10 } }, ctx.node.label, cx, cy + 28) : ''}
    `;
  },
};

/**
 * Intermediate Non-Interfering - Double unfilled circle with dashed stroke
 */
export const intermediateNonInterferingShape: ShapeDefinition = {
  id: 'intermediateNonInterfering',
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
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    return `
      <!-- Outer circle -->
      <circle cx="${cx}" cy="${cy}" r="18"
              fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="3,2" />
      
      <!-- Inner circle -->
      <circle cx="${cx}" cy="${cy}" r="14"
              fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="3,2" />
      
      ${ctx.node.label ? renderShapeLabel({ ...ctx, style: { ...ctx.style, fontSize: 10 } }, ctx.node.label, cx, cy + 28) : ''}
    `;
  },
};

/**
 * Conversation - Hexagon shape (BPMN conversation)
 */
export const conversationShape: ShapeDefinition = {
  id: 'conversation',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 80),
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
    const w = bounds.width;
    const h = bounds.height;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    // Hexagon (diamond with flat top/bottom)
    const pathData = `M ${x + w / 2} ${y}
                      L ${x + w} ${y + h / 2}
                      L ${x + w / 2} ${y + h}
                      L ${x} ${y + h / 2}
                      Z`;

    return `
      <path d="${pathData}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, ctx.node.label || ctx.node.id, x + w / 2, y + h / 2)}
    `;
  },
};

/**
 * Annotation - Text annotation with left bracket
 */
export const annotationShape: ShapeDefinition = {
  id: 'annotation',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 8;

    return {
      width: textSize.width + padding * 2 + 10, // Extra space for bracket
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
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Left bracket shape
    const bracketPath = `M ${x + 10} ${y}
                        L ${x} ${y}
                        L ${x} ${y + bounds.height}
                        L ${x + 10} ${y + bounds.height}`;

    return `
      <path d="${bracketPath}"
            fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      ${renderShapeLabel(ctx, ctx.node.label || ctx.node.id, x + 15, y + bounds.height / 2)}
    `;
  },
};
