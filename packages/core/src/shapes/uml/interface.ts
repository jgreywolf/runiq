import type { ShapeDefinition } from '../../types/index.js';

/**
 * Method parameter definition
 */
interface MethodParameter {
  name: string;
  type: string;
}

/**
 * Method definition for UML interfaces
 */
interface InterfaceMethod {
  name: string;
  params?: MethodParameter[];
  returnType?: string;
  visibility?: 'public' | 'private' | 'protected' | 'package';
  abstract?: boolean;
}

/**
 * Format a method for display
 */
function formatMethod(method: InterfaceMethod): string {
  const visibility = getVisibilitySymbol(method.visibility);

  // Build parameter list
  const params = (method.params || [])
    .map((p) => `${p.name}: ${p.type}`)
    .join(', ');

  let text = `${visibility} ${method.name}(${params})`;

  if (method.returnType) {
    text += `: ${method.returnType}`;
  }

  return text;
}

/**
 * Get UML visibility symbol
 */
function getVisibilitySymbol(visibility: string | undefined): string {
  switch (visibility) {
    case 'public':
      return '+';
    case 'private':
      return '-';
    case 'protected':
      return '#';
    case 'package':
      return '~';
    default:
      return '+'; // Default to public
  }
}

/**
 * UML Interface shape
 * Displays interface with «interface» stereotype, name, and methods
 * Used in class diagrams to show interface definitions
 */
export const interfaceShape: ShapeDefinition = {
  id: 'interface',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;

    const methods = (ctx.node.data?.methods as InterfaceMethod[]) || [];
    const stereotypeRaw = ctx.node.data?.stereotype as
      | string
      | string[]
      | undefined;
    const stereotypes = Array.isArray(stereotypeRaw)
      ? stereotypeRaw
      : stereotypeRaw
        ? [stereotypeRaw]
        : ['interface'];
    const stereotypeText = stereotypes.map((s) => `«${s}»`).join(' ');

    const nameSize = ctx.measureText(ctx.node.label || '', ctx.style);
    const stereotypeSize = ctx.measureText(stereotypeText, ctx.style);

    // Calculate width based on longest text
    let maxWidth = Math.max(nameSize.width, stereotypeSize.width);
    methods.forEach((method) => {
      const methodText = formatMethod(method);
      const methodSize = ctx.measureText(methodText, ctx.style);
      maxWidth = Math.max(maxWidth, methodSize.width);
    });

    const width = maxWidth + padding * 2;

    // Height: stereotype + name + separator + methods
    const height =
      padding + // top padding
      lineHeight + // stereotype
      lineHeight + // name
      (methods.length > 0 ? 1 : 0) + // separator line
      (methods.length > 0 ? padding : 0) + // separator padding
      methods.length * lineHeight + // methods
      padding; // bottom padding

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
    const methods = (ctx.node.data?.methods as InterfaceMethod[]) || [];
    const stereotypeRaw = ctx.node.data?.stereotype as
      | string
      | string[]
      | undefined;
    const stereotypes = Array.isArray(stereotypeRaw)
      ? stereotypeRaw
      : stereotypeRaw
        ? [stereotypeRaw]
        : ['interface'];
    const stereotypeText = stereotypes.map((s) => `«${s}»`).join(' ');

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const fontFamily =
      typeof ctx.style.fontFamily === 'string' ? ctx.style.fontFamily : 'Arial';

    let svg = `<g class="interface-shape">`;

    // Main rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Stereotype text
    let currentY = y + padding + lineHeight * 0.7;
    svg += `<text x="${x + w / 2}" y="${currentY}" `;
    svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${fontFamily}" fill="${stroke}">`;
    svg += `${stereotypeText}</text>`;

    // Interface name
    currentY += lineHeight;
    svg += `<text x="${x + w / 2}" y="${currentY}" `;
    svg += `text-anchor="middle" font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-family="${fontFamily}" `;
    svg += `font-weight="bold" fill="${stroke}">`;
    svg += `${ctx.node.label || ''}</text>`;

    // Separator line if there are methods
    if (methods.length > 0) {
      currentY += lineHeight * 0.3;
      svg += `<line x1="${x}" y1="${currentY}" x2="${x + w}" y2="${currentY}" `;
      svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      currentY += padding;

      // Method list
      methods.forEach((method) => {
        currentY += lineHeight * 0.7;
        const methodText = formatMethod(method);
        svg += `<text x="${x + padding}" y="${currentY}" `;
        svg += `font-size="${ctx.style.fontSize || 14}" `;
        svg += `font-family="${fontFamily}" fill="${stroke}">`;
        svg += `${methodText}</text>`;
        currentY += lineHeight * 0.3;
      });
    }

    svg += `</g>`;
    return svg;
  },
};
