import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Escape XML special characters to prevent HTML injection
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Port - Small square representing a connection point on a component
 */
export const portShape: ShapeDefinition = {
  id: 'port',
  bounds() {
    return {
      width: 16,
      height: 16,
    };
  },

  anchors() {
    return [
      { x: 8, y: 0, name: 'top' },
      { x: 16, y: 8, name: 'right' },
      { x: 8, y: 16, name: 'bottom' },
      { x: 0, y: 8, name: 'left' },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const fill = ctx.style.fill || '#fff';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<rect x="${x}" y="${y}" width="16" height="16"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    const labelStyle = {
      ...ctx.style,
      fontSize: 10,
      textAnchor: 'middle' as const,
      dominantBaseline: 'hanging' as const,
    };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || ctx.node.id,
      x + 8,
      y + 24
    );

    return svg;
  },
};

/**
 * Module - Rectangle with «module» stereotype
 */
export const moduleShape: ShapeDefinition = {
  id: 'module',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 100),
      height: textSize.height + padding * 3 + 14, // Extra space for stereotype
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
    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    const stereotypeStyle = { ...ctx.style, fontSize: 11 };
    svg += renderShapeLabel(
      { ...ctx, style: stereotypeStyle },
      '«module»',
      x + bounds.width / 2,
      y + 14
    );

    svg += renderShapeLabel(
      ctx,
      ctx.node.label || ctx.node.id,
      x + bounds.width / 2,
      y + bounds.height / 2 + 7
    );

    return svg;
  },
};

/**
 * Template - Rectangle with dashed corner for template parameter
 */
export const templateShape: ShapeDefinition = {
  id: 'template',
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
    const cornerSize = 20;
    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />

      <!-- Dashed corner for template parameter -->
      <path d="M ${x + bounds.width - cornerSize} ${y}
               L ${x + bounds.width} ${y}
               L ${x + bounds.width} ${y + cornerSize}"
            fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="3,2" />`;

    svg += renderShapeLabel(
      ctx,
      ctx.node.label || ctx.node.id,
      x + bounds.width / 2,
      y + bounds.height / 2
    );

    return svg;
  },
};

/**
 * Send Signal - Pentagon pointing right (convex)
 */
export const sendSignalShape: ShapeDefinition = {
  id: 'sendSignal',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: textSize.width + padding * 3,
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
    const w = bounds.width;
    const h = bounds.height;
    const pointOffset = w * 0.2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    const pathData = `M ${x} ${y + h / 2}
                      L ${x + w - pointOffset} ${y}
                      L ${x + w} ${y + h / 2}
                      L ${x + w - pointOffset} ${y + h}
                      Z`;

    let svg = `<path d="${pathData}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    svg += renderShapeLabel(
      ctx,
      ctx.node.label || ctx.node.id,
      x + w / 2 - pointOffset / 2,
      y + h / 2
    );

    return svg;
  },
};

/**
 * Receive Signal - Concave pentagon pointing left
 */
export const receiveSignalShape: ShapeDefinition = {
  id: 'receiveSignal',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: textSize.width + padding * 3,
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
    const w = bounds.width;
    const h = bounds.height;
    const pointOffset = w * 0.2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    const pathData = `M ${x} ${y + h / 2}
                      L ${x + pointOffset} ${y}
                      L ${x + w} ${y}
                      L ${x + w} ${y + h}
                      L ${x + pointOffset} ${y + h}
                      Z`;

    let svg = `<path d="${pathData}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    svg += renderShapeLabel(
      ctx,
      ctx.node.label || ctx.node.id,
      x + w / 2 + pointOffset / 2,
      y + h / 2
    );

    return svg;
  },
};

/**
 * History - Circle with H inside (shallow history state)
 */
export const historyShape: ShapeDefinition = {
  id: 'history',
  bounds() {
    return {
      width: 30,
      height: 30,
    };
  },

  anchors() {
    return [
      { x: 15, y: 0, name: 'top' },
      { x: 30, y: 15, name: 'right' },
      { x: 15, y: 30, name: 'bottom' },
      { x: 0, y: 15, name: 'left' },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const cx = x + 15;
    const cy = y + 15;
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    let svg = `<circle cx="${cx}" cy="${cy}" r="15"
              fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    const labelStyle = {
      ...ctx.style,
      fontSize: 16,
      fontWeight: 'bold' as const,
    };
    svg += renderShapeLabel({ ...ctx, style: labelStyle }, 'H', cx, cy);

    return svg;
  },
};

/**
 * Pin - Small square for parameter/pin on activity
 */
export const pinShape: ShapeDefinition = {
  id: 'pin',
  bounds() {
    return {
      width: 12,
      height: 12,
    };
  },

  anchors() {
    return [
      { x: 6, y: 0, name: 'top' },
      { x: 12, y: 6, name: 'right' },
      { x: 6, y: 12, name: 'bottom' },
      { x: 0, y: 6, name: 'left' },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const fill = ctx.style.fill || '#fff';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<rect x="${x}" y="${y}" width="12" height="12"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    const labelStyle = {
      ...ctx.style,
      fontSize: 9,
      textAnchor: 'middle' as const,
      dominantBaseline: 'hanging' as const,
    };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || '',
      x + 6,
      y + 18
    );

    return svg;
  },
};

/**
 * Assembly - Connector/assembly symbol
 */
export const assemblyShape: ShapeDefinition = {
  id: 'assembly',
  bounds() {
    return {
      width: 24,
      height: 24,
    };
  },

  anchors() {
    return [
      { x: 12, y: 0, name: 'top' },
      { x: 24, y: 12, name: 'right' },
      { x: 12, y: 24, name: 'bottom' },
      { x: 0, y: 12, name: 'left' },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const cx = x + 12;
    const cy = y + 12;
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    let svg = `<circle cx="${cx}" cy="${cy}" r="10"
              fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    const labelStyle = {
      ...ctx.style,
      fontSize: 10,
      textAnchor: 'middle' as const,
      dominantBaseline: 'hanging' as const,
    };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || ctx.node.id,
      cx,
      cy + 26
    );

    return svg;
  },
};

/**
 * Provided Interface - Lollipop symbol (circle on stick)
 */
export const providedInterfaceShape: ShapeDefinition = {
  id: 'providedInterface',
  bounds() {
    return {
      width: 30,
      height: 40,
    };
  },

  anchors() {
    return [
      { x: 15, y: 0, name: 'top' },
      { x: 30, y: 20, name: 'right' },
      { x: 15, y: 40, name: 'bottom' },
      { x: 0, y: 20, name: 'left' },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const cx = x + 15;
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    let svg = `<line x1="${cx}" y1="${y + 30}" x2="${cx}" y2="${y + 10}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <circle cx="${cx}" cy="${y + 10}" r="8"
              fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    const labelStyle = {
      ...ctx.style,
      fontSize: 10,
      textAnchor: 'middle' as const,
      dominantBaseline: 'hanging' as const,
    };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || ctx.node.id,
      cx,
      y + 42
    );

    return svg;
  },
};

/**
 * Required Interface - Socket symbol (semicircle)
 */
export const requiredInterfaceShape: ShapeDefinition = {
  id: 'requiredInterface',
  bounds() {
    return {
      width: 30,
      height: 40,
    };
  },

  anchors() {
    return [
      { x: 15, y: 0, name: 'top' },
      { x: 30, y: 20, name: 'right' },
      { x: 15, y: 40, name: 'bottom' },
      { x: 0, y: 20, name: 'left' },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const cx = x + 15;
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 2;

    let svg = `<line x1="${cx}" y1="${y + 30}" x2="${cx}" y2="${y + 10}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Semicircle (socket) -->
      <path d="M ${cx - 8} ${y + 10}
               A 8 8 0 0 1 ${cx + 8} ${y + 10}"
            fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    const labelStyle = {
      ...ctx.style,
      fontSize: 10,
      textAnchor: 'middle' as const,
      dominantBaseline: 'hanging' as const,
    };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || ctx.node.id,
      cx,
      y + 42
    );

    return svg;
  },
};

/**
 * Frame - Large rectangle with name tag (for sequence/interaction diagrams)
 */
export const frameShape: ShapeDefinition = {
  id: 'frame',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 4, 200),
      height: Math.max(textSize.height + padding * 4, 150),
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
    const tagWidth = 80;
    const tagHeight = 25;
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Name tag -->
      <path d="M ${x} ${y}
               L ${x + tagWidth} ${y}
               L ${x + tagWidth} ${y + tagHeight}
               L ${x} ${y + tagHeight}"
            fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    const labelStyle = {
      ...ctx.style,
      fontSize: 11,
      fontWeight: 'bold' as const,
    };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || ctx.node.id,
      x + tagWidth / 2,
      y + tagHeight / 2
    );

    return svg;
  },
};

/**
 * Collaboration - Dashed ellipse
 */
export const collaborationShape: ShapeDefinition = {
  id: 'collaboration',
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
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const rx = bounds.width / 2;
    const ry = bounds.height / 2;

    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"
               fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-dasharray="5,3" />`;

    svg += renderShapeLabel(ctx, ctx.node.label || ctx.node.id, cx, cy);

    return svg;
  },
};

/**
 * Submachine - Rounded rectangle with submachine icon
 */
export const submachineShape: ShapeDefinition = {
  id: 'submachine',
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

    let svg = `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="${radius}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      
      <!-- Submachine icon (small circles in bottom right) -->
      <circle cx="${x + bounds.width - 15}" cy="${y + bounds.height - 10}" r="3"
              fill="none" stroke="${stroke}" stroke-width="1" />
      <circle cx="${x + bounds.width - 8}" cy="${y + bounds.height - 10}" r="3"
              fill="none" stroke="${stroke}" stroke-width="1" />`;

    svg += renderShapeLabel(
      ctx,
      ctx.node.label || ctx.node.id,
      x + bounds.width / 2,
      y + bounds.height / 2
    );

    return svg;
  },
};

/**
 * Loop - Rectangle with "loop" label in corner
 */
export const loopShape: ShapeDefinition = {
  id: 'loop',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;

    return {
      width: Math.max(textSize.width + padding * 2, 100),
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

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Loop label in top left
    const loopLabelStyle = {
      ...ctx.style,
      fontSize: 11,
      fontWeight: 'bold' as const,
      textAnchor: 'start' as const,
    };
    svg += renderShapeLabel(
      { ...ctx, style: loopLabelStyle },
      'loop',
      x + 8,
      y + 14
    );

    // Divider line
    svg += `<line x1="${x}" y1="${y + 20}" x2="${x + bounds.width}" y2="${y + 20}"
            stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Condition/content label
    svg += renderShapeLabel(
      ctx,
      ctx.node.label || '',
      x + bounds.width / 2,
      y + bounds.height / 2 + 10
    );

    return svg;
  },
};

/**
 * Vertical Fork - Vertical thick line for fork/join in activity diagrams
 */
export const verticalForkShape: ShapeDefinition = {
  id: 'verticalFork',
  bounds() {
    return {
      width: 6,
      height: 60,
    };
  },

  anchors() {
    return [
      { x: 3, y: 0, name: 'top' },
      { x: 6, y: 30, name: 'right' },
      { x: 3, y: 60, name: 'bottom' },
      { x: 0, y: 30, name: 'left' },
    ];
  },

  render(ctx, position) {
    const { x, y } = position;
    const fill = ctx.style.fill || '#333';

    return `
      <rect x="${x}" y="${y}" width="6" height="60"
            fill="${fill}" stroke="none" />
    `;
  },
};
