import type { ShapeDefinition } from '../../types/index.js';
import {
  calculateCompartmentBounds,
  renderMultiCompartmentShape,
} from '../utils/render-compartments.js';

interface AbstractAttribute {
  name: string;
  type?: string;
  visibility?: 'public' | 'private' | 'protected' | 'package';
  defaultValue?: string;
  isStatic?: boolean;
  isDerived?: boolean;
  constraints?: string[];
}

interface MethodParameter {
  name: string;
  type: string;
}

interface AbstractMethod {
  name: string;
  params?: MethodParameter[];
  returnType?: string;
  visibility?: 'public' | 'private' | 'protected' | 'package';
  isAbstract?: boolean;
  isStatic?: boolean;
  constraints?: string[];
}

function formatAttribute(attr: AbstractAttribute): string {
  const visibility = getVisibilitySymbol(attr.visibility);
  const derivedPrefix = attr.isDerived ? '/' : '';
  let text = `${visibility} ${derivedPrefix}${attr.name}`;
  if (attr.type) text += `: ${attr.type}`;
  if (attr.defaultValue) text += ` = ${attr.defaultValue}`;
  return text;
}

function formatMethod(method: AbstractMethod): string {
  const visibility = getVisibilitySymbol(method.visibility);
  const params = (method.params || [])
    .map((p) => `${p.name}: ${p.type}`)
    .join(', ');
  let text = `${visibility} ${method.name}(${params})`;
  if (method.returnType) text += `: ${method.returnType}`;
  return text;
}

function getVisibilitySymbol(
  visibility?: 'public' | 'private' | 'protected' | 'package'
): string {
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
      return '+';
  }
}

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

    const attributes = (ctx.node.data?.attributes as AbstractAttribute[]) || [];
    const methods = (ctx.node.data?.methods as AbstractMethod[]) || [];
    const stereotypeRaw = ctx.node.data?.stereotype as
      | string
      | string[]
      | undefined;
    const showStereotype = ctx.node.data?.showStereotype === true;

    const stereotypes = Array.isArray(stereotypeRaw)
      ? stereotypeRaw
      : stereotypeRaw
        ? [stereotypeRaw]
        : showStereotype
          ? ['abstract']
          : [];
    const stereotypeText =
      stereotypes.length > 0 ? stereotypes.map((s) => `«${s}»`).join(' ') : '';

    const attributeTexts = attributes.map(formatAttribute);
    const methodTexts = methods.map(formatMethod);

    const headerItems = stereotypeText
      ? [stereotypeText, ctx.node.label || '']
      : [ctx.node.label || ''];

    return calculateCompartmentBounds(ctx, {
      padding,
      lineHeight,
      header: { items: headerItems },
      compartments: [{ items: attributeTexts }, { items: methodTexts }],
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

    const attributes = (ctx.node.data?.attributes as AbstractAttribute[]) || [];
    const methods = (ctx.node.data?.methods as AbstractMethod[]) || [];
    const stereotypeRaw = ctx.node.data?.stereotype as
      | string
      | string[]
      | undefined;
    const showStereotype = ctx.node.data?.showStereotype === true;

    const stereotypes = Array.isArray(stereotypeRaw)
      ? stereotypeRaw
      : stereotypeRaw
        ? [stereotypeRaw]
        : showStereotype
          ? ['abstract']
          : [];
    const stereotypeText =
      stereotypes.length > 0 ? stereotypes.map((s) => `«${s}»`).join(' ') : '';

    const attributeTexts = attributes.map(formatAttribute);
    const methodTexts = methods.map(formatMethod);

    const headerItems = stereotypeText
      ? [stereotypeText, ctx.node.label || '']
      : [ctx.node.label || ''];

    return `<g class="abstract-shape">${renderMultiCompartmentShape({
      ctx,
      position,
      bounds,
      lineHeight,
      padding,
      header: {
        items: headerItems,
        style: { fontWeight: 'bold', fontStyle: 'italic' },
      },
      compartments: [
        {
          items: attributeTexts,
          align: 'start',
        },
        {
          items: methodTexts,
          align: 'start',
          style: { fontStyle: 'italic' },
        },
      ],
    })}</g>`;
  },
};
