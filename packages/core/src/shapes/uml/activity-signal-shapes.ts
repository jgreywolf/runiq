import { ShapeDefaults } from '../../constants.js';
import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * UML Send Signal Action shape
 * Convex pentagon pointing right (signal being sent out)
 * UML 2.5: Represents sending an asynchronous signal
 */
export const sendSignalShape: ShapeDefinition = {
  id: 'sendSignal',

  bounds(ctx) {
    const padding = ctx.style.padding ?? ShapeDefaults.PADDING;
    const labelSize = ctx.measureText(ctx.node.label || 'Send', ctx.style);

    const width = labelSize.width + padding * 3;
    const height = labelSize.height + padding * 2;

    return { width: Math.max(width, 100), height: Math.max(height, 50) };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const notchDepth = w * 0.2;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w - notchDepth / 2, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Convex pentagon (pointing right like an arrow)
    const notchDepth = w * 0.2; // How far the right side protrudes

    let svg = `<g class="send-signal-shape">`;

    // Pentagon path: top-left, top-right, point, bottom-right, bottom-left
    svg += `<path d="`;
    svg += `M ${x} ${y} `; // Top-left
    svg += `L ${x + w - notchDepth} ${y} `; // Top-right
    svg += `L ${x + w} ${y + h / 2} `; // Right point (convex)
    svg += `L ${x + w - notchDepth} ${y + h} `; // Bottom-right
    svg += `L ${x} ${y + h} `; // Bottom-left
    svg += `Z" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label (centered)
    const labelStyle = { ...ctx.style, color: stroke };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || 'Send',
      x + (w - notchDepth) / 2,
      y + h / 2 + (ctx.style.fontSize || 14) / 3
    );

    svg += `</g>`;
    return svg;
  },
};

/**
 * UML Receive Signal Action shape (Accept Event Action for signals)
 * Concave pentagon pointing left (signal being received)
 * UML 2.5: Represents receiving an asynchronous signal
 */
export const receiveSignalShape: ShapeDefinition = {
  id: 'receiveSignal',

  bounds(ctx) {
    const padding = ctx.style.padding ?? ShapeDefaults.PADDING;
    const labelSize = ctx.measureText(ctx.node.label || 'Receive', ctx.style);

    const width = labelSize.width + padding * 3;
    const height = labelSize.height + padding * 2;

    return { width: Math.max(width, 100), height: Math.max(height, 50) };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const notchDepth = w * 0.2;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: notchDepth / 2, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Concave pentagon (indented on the left like a notch)
    const notchDepth = w * 0.2; // How far the left side is indented

    let svg = `<g class="receive-signal-shape">`;

    // Pentagon path: top-left, top-right, bottom-right, bottom-left, left point
    svg += `<path d="`;
    svg += `M ${x + notchDepth} ${y} `; // Top-left
    svg += `L ${x + w} ${y} `; // Top-right
    svg += `L ${x + w} ${y + h} `; // Bottom-right
    svg += `L ${x + notchDepth} ${y + h} `; // Bottom-left
    svg += `L ${x} ${y + h / 2} `; // Left point (concave)
    svg += `Z" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label (centered)
    const labelStyle = { ...ctx.style, color: stroke };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || 'Receive',
      x + (w + notchDepth) / 2,
      y + h / 2 + (ctx.style.fontSize || 14) / 3
    );

    svg += `</g>`;
    return svg;
  },
};

/**
 * UML Accept Event Action shape
 * Concave pentagon (same as receive signal but more generic)
 * UML 2.5: Represents waiting for any event (not just signals)
 */
export const acceptEventShape: ShapeDefinition = {
  id: 'acceptEvent',

  bounds(ctx) {
    const padding = ctx.style.padding ?? ShapeDefaults.PADDING;
    const labelSize = ctx.measureText(ctx.node.label || 'Wait', ctx.style);

    const width = labelSize.width + padding * 3;
    const height = labelSize.height + padding * 2;

    return { width: Math.max(width, 100), height: Math.max(height, 50) };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;
    const notchDepth = w * 0.2;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: notchDepth / 2, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    // Concave pentagon (same as receive signal)
    const notchDepth = w * 0.2;

    let svg = `<g class="accept-event-shape">`;

    // Pentagon path
    svg += `<path d="`;
    svg += `M ${x + notchDepth} ${y} `;
    svg += `L ${x + w} ${y} `;
    svg += `L ${x + w} ${y + h} `;
    svg += `L ${x + notchDepth} ${y + h} `;
    svg += `L ${x} ${y + h / 2} `;
    svg += `Z" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label (centered)
    const labelStyle = { ...ctx.style, color: stroke };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || 'Wait',
      x + (w + notchDepth) / 2,
      y + h / 2 + (ctx.style.fontSize || 14) / 3
    );

    svg += `</g>`;
    return svg;
  },
};
