import type { ShapeDefinition } from '../../types.js';

/**
 * UML Abstract Class shape
 * Displays abstract class with italicized name and optional {abstract} stereotype
 * Used in class diagrams to show abstract classes
 */
export const abstractShape: ShapeDefinition = {
  id: 'abstract',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;

    const attributes = (ctx.node.data?.attributes as string[]) || [];
    const methods = (ctx.node.data?.methods as string[]) || [];
    const showStereotype = ctx.node.data?.showStereotype === true;

    const nameSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const stereotypeSize = showStereotype
      ? ctx.measureText('{abstract}', ctx.style)
      : { width: 0 };

    // Calculate width based on longest text
    let maxWidth = Math.max(nameSize.width, stereotypeSize.width);

    attributes.forEach((attr) => {
      const attrSize = ctx.measureText(attr, ctx.style);
      maxWidth = Math.max(maxWidth, attrSize.width);
    });

    methods.forEach((method) => {
      const methodSize = ctx.measureText(method, ctx.style);
      maxWidth = Math.max(maxWidth, methodSize.width);
    });

    const width = maxWidth + padding * 2;

    // Height calculation
    let height = padding; // top padding

    if (showStereotype) {
      height += lineHeight; // stereotype
    }

    height += lineHeight; // class name

    if (attributes.length > 0) {
      height += 1 + padding; // separator
      height += attributes.length * lineHeight;
    }

    if (methods.length > 0) {
      height += 1 + padding; // separator
      height += methods.length * lineHeight;
    }

    height += padding; // bottom padding

    return { width: Math.max(width, 100), height: Math.max(height, 60) };
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

    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;
    const attributes = (ctx.node.data?.attributes as string[]) || [];
    const methods = (ctx.node.data?.methods as string[]) || [];
    const showStereotype = ctx.node.data?.showStereotype === true;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;

    let svg = `<g class="abstract-shape">`;

    // Main rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    let currentY = y + padding + lineHeight * 0.7;

    // Optional {abstract} stereotype
    if (showStereotype) {
      svg += `<text x="${x + w / 2}" y="${currentY}" `;
      svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
      svg += `font-family="${ctx.style.fontFamily || 'Arial'}" fill="${stroke}">`;
      svg += `{abstract}</text>`;
      currentY += lineHeight;
    }

    // Class name (italicized for abstract)
    svg += `<text x="${x + w / 2}" y="${currentY}" `;
    svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${ctx.style.fontFamily || 'Arial'}" `;
    svg += `font-style="italic" font-weight="bold" fill="${stroke}">`;
    svg += `${ctx.node.label || ''}</text>`;
    currentY += lineHeight * 0.3;

    // Attributes section
    if (attributes.length > 0) {
      currentY += padding * 0.3;
      svg += `<line x1="${x}" y1="${currentY}" x2="${x + w}" y2="${currentY}" `;
      svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      currentY += padding * 0.7;

      attributes.forEach((attr) => {
        currentY += lineHeight * 0.7;
        svg += `<text x="${x + padding}" y="${currentY}" `;
        svg += `font-size="${ctx.style.fontSize || 14}" `;
        svg += `font-family="${ctx.style.fontFamily || 'Arial'}" fill="${stroke}">`;
        svg += `${attr}</text>`;
        currentY += lineHeight * 0.3;
      });
    }

    // Methods section
    if (methods.length > 0) {
      currentY += padding * 0.3;
      svg += `<line x1="${x}" y1="${currentY}" x2="${x + w}" y2="${currentY}" `;
      svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      currentY += padding * 0.7;

      methods.forEach((method) => {
        currentY += lineHeight * 0.7;
        svg += `<text x="${x + padding}" y="${currentY}" `;
        svg += `font-size="${ctx.style.fontSize || 14}" `;
        svg += `font-family="${ctx.style.fontFamily || 'Arial'}" `;
        svg += `font-style="italic" fill="${stroke}">`;
        svg += `${method}</text>`;
        currentY += lineHeight * 0.3;
      });
    }

    svg += `</g>`;
    return svg;
  },
};
