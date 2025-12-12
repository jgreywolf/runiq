import { ShapeDefaults } from '../../constants.js';
import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';
import { calculateSimpleBounds } from '../utils/calculate-bounds.js';

/**
 * UML Object Node shape
 * Rectangle representing a data object in an activity diagram
 * UML 2.5: Object nodes represent data flowing through activities
 */
export const objectNodeShape: ShapeDefinition = {
  id: 'objectNode',

  bounds(ctx) {
    return calculateSimpleBounds(ctx, {
      defaultLabel: 'Object',
      minWidth: 80,
      minHeight: 40,
    });
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

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<g class="object-node-shape">`;

    // Rectangle (no rounded corners for object nodes)
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Object name (centered)
    const labelStyle = { ...ctx.style, color: stroke };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || 'Object',
      x + w / 2,
      y + h / 2
    );

    svg += `</g>`;
    return svg;
  },
};

/**
 * UML Central Buffer Node shape
 * Rectangle with «centralBuffer» stereotype
 * UML 2.5: Central buffers store data persistently between activities
 */
export const centralBufferShape: ShapeDefinition = {
  id: 'centralBuffer',

  bounds(ctx) {
    const label = ctx.node.label || 'Buffer';
    const stereotype = '«centralBuffer»';
    return calculateSimpleBounds(ctx, {
      defaultLabel: `${stereotype}\n${label}`,
      minWidth: 100,
      minHeight: 50,
    });
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

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const fontSize = ctx.style.fontSize || 14;
    const fontFamily = ctx.style.font || 'Arial';

    let svg = `<g class="central-buffer-shape">`;

    // Rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Stereotype (top)
    const stereotypeStyle = {
      ...ctx.style,
      fontSize: fontSize - 2,
      color: stroke,
    };
    svg += renderShapeLabel(
      { ...ctx, style: stereotypeStyle },
      '«centralBuffer»',
      x + w / 2,
      y + fontSize
    );

    // Buffer name (below stereotype)
    const labelStyle = { ...ctx.style, color: stroke };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || 'Buffer',
      x + w / 2,
      y + fontSize * 2 + 4
    );

    svg += `</g>`;
    return svg;
  },
};

/**
 * UML Data Store Node shape
 * Rectangle with «datastore» stereotype
 * UML 2.5: Data stores represent persistent storage (databases, files)
 */
export const dataStoreShape: ShapeDefinition = {
  id: 'dataStore',

  bounds(ctx) {
    const label = ctx.node.label || 'DataStore';
    const stereotype = '«datastore»';
    return calculateSimpleBounds(ctx, {
      defaultLabel: `${stereotype}\n${label}`,
      minWidth: 100,
      minHeight: 50,
    });
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

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const fontSize = ctx.style.fontSize || 14;
    const fontFamily = ctx.style.font || 'Arial';

    // Cylinder dimensions
    const ellipseHeight = h * 0.15; // Height of the top/bottom ellipse
    const cylinderHeight = h - ellipseHeight;

    let svg = `<g class="data-store-shape">`;

    // Draw cylinder shape (database icon)
    // Top ellipse
    svg += `<ellipse cx="${x + w / 2}" cy="${y + ellipseHeight / 2}" `;
    svg += `rx="${w / 2}" ry="${ellipseHeight / 2}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Cylinder body (rectangle)
    svg += `<rect x="${x}" y="${y + ellipseHeight / 2}" width="${w}" height="${cylinderHeight}" `;
    svg += `fill="${fill}" stroke="none" />`;

    // Left edge
    svg += `<line x1="${x}" y1="${y + ellipseHeight / 2}" x2="${x}" y2="${y + ellipseHeight / 2 + cylinderHeight}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Right edge
    svg += `<line x1="${x + w}" y1="${y + ellipseHeight / 2}" x2="${x + w}" y2="${y + ellipseHeight / 2 + cylinderHeight}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Bottom ellipse (only the visible arc)
    svg += `<path d="M ${x} ${y + ellipseHeight / 2 + cylinderHeight} `;
    svg += `Q ${x + w / 2} ${y + h + ellipseHeight / 2}, ${x + w} ${y + ellipseHeight / 2 + cylinderHeight}" `;
    svg += `fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Data store name (centered in cylinder)
    const labelStyle = { ...ctx.style, color: stroke };
    svg += renderShapeLabel(
      { ...ctx, style: labelStyle },
      ctx.node.label || 'DataStore',
      x + w / 2,
      y + h / 2
    );

    svg += `</g>`;
    return svg;
  },
};
