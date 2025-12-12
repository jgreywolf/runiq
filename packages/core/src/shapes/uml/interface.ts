import type { ShapeDefinition } from '../../types/index.js';
import {
  calculateCompartmentBounds,
  renderMultiCompartmentShape,
} from '../utils/render-compartments.js';

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

    const methodTexts = methods.map(formatMethod);

    return calculateCompartmentBounds(ctx, {
      padding,
      lineHeight,
      header: {
        items: [stereotypeText, ctx.node.label || ''],
      },
      compartments: [{ items: methodTexts }],
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

    const methodTexts = methods.map(formatMethod);

    return `<g class="interface-shape">${renderMultiCompartmentShape({
      ctx,
      position,
      bounds,
      lineHeight,
      padding,
      header: {
        items: [stereotypeText, ctx.node.label || ''],
        style: { fontWeight: 'bold' },
      },
      compartments: [
        {
          items: methodTexts,
          align: 'start',
        },
      ],
    })}</g>`;
  },
};
