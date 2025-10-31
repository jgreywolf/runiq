import type { ShapeDefinition } from '../../types.js';

/**
 * UML Object Node shape
 * Rectangle representing a data object in an activity diagram
 * UML 2.5: Object nodes represent data flowing through activities
 */
export const objectNodeShape: ShapeDefinition = {
  id: 'objectNode',

  bounds(ctx) {
    const padding = ctx.style.padding || 10;
    const nameSize = ctx.measureText(ctx.node.label || 'Object', ctx.style);

    const width = nameSize.width + padding * 2;
    const height = nameSize.height + padding * 2;

    return { width: Math.max(width, 80), height: Math.max(height, 40) };
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
    const fontFamily = ctx.style.font || 'Arial';
    svg += `<text x="${x + w / 2}" y="${y + h / 2 + 5}" `;
    svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${fontFamily}" fill="${stroke}">`;
    svg += `${ctx.node.label || 'Object'}</text>`;

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
    const padding = ctx.style.padding || 10;
    const stereotypePadding = 6;
    const nameSize = ctx.measureText(ctx.node.label || 'Buffer', ctx.style);
    const stereotypeSize = ctx.measureText('«centralBuffer»', {
      ...ctx.style,
      fontSize: (ctx.style.fontSize || 14) - 2,
    });

    const width = Math.max(nameSize.width, stereotypeSize.width) + padding * 2;
    const height = nameSize.height + stereotypeSize.height + padding * 2 + stereotypePadding;

    return { width: Math.max(width, 100), height: Math.max(height, 50) };
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
    svg += `<text x="${x + w / 2}" y="${y + fontSize}" `;
    svg += `text-anchor="middle" font-size="${fontSize - 2}" `;
    svg += `font-family="${fontFamily}" fill="${stroke}">`;
    svg += `«centralBuffer»</text>`;

    // Buffer name (below stereotype)
    svg += `<text x="${x + w / 2}" y="${y + fontSize * 2 + 4}" `;
    svg += `text-anchor="middle" font-size="${fontSize}" `;
    svg += `font-family="${fontFamily}" fill="${stroke}">`;
    svg += `${ctx.node.label || 'Buffer'}</text>`;

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
    const padding = ctx.style.padding || 10;
    const stereotypePadding = 6;
    const nameSize = ctx.measureText(ctx.node.label || 'DataStore', ctx.style);
    const stereotypeSize = ctx.measureText('«datastore»', {
      ...ctx.style,
      fontSize: (ctx.style.fontSize || 14) - 2,
    });

    const width = Math.max(nameSize.width, stereotypeSize.width) + padding * 2;
    const height = nameSize.height + stereotypeSize.height + padding * 2 + stereotypePadding;

    return { width: Math.max(width, 100), height: Math.max(height, 50) };
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

    let svg = `<g class="data-store-shape">`;

    // Rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Stereotype (top)
    svg += `<text x="${x + w / 2}" y="${y + fontSize}" `;
    svg += `text-anchor="middle" font-size="${fontSize - 2}" `;
    svg += `font-family="${fontFamily}" fill="${stroke}">`;
    svg += `«datastore»</text>`;

    // Data store name (below stereotype)
    svg += `<text x="${x + w / 2}" y="${y + fontSize * 2 + 4}" `;
    svg += `text-anchor="middle" font-size="${fontSize}" `;
    svg += `font-family="${fontFamily}" fill="${stroke}">`;
    svg += `${ctx.node.label || 'DataStore'}</text>`;

    svg += `</g>`;
    return svg;
  },
};
