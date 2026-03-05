import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Attribute definition for UML class diagrams
 */
export interface ClassAttribute {
  name: string;
  type?: string; // Can include generics like "List<String>" or "Map<K, V>"
  visibility?: 'public' | 'private' | 'protected' | 'package';
  defaultValue?: string;
  isStatic?: boolean;
  isDerived?: boolean; // Computed/calculated attribute (shown with / prefix)
  constraints?: string[]; // UML constraints like 'ordered', 'unique', etc.
}

/**
 * Method parameter definition
 */
export interface MethodParameter {
  name: string;
  type: string; // Can include generics
}

/**
 * Method definition for UML class diagrams
 */
export interface ClassMethod {
  name: string;
  params?: MethodParameter[];
  returnType?: string; // Can include generics
  visibility?: 'public' | 'private' | 'protected' | 'package';
  isAbstract?: boolean;
  isStatic?: boolean;
  constraints?: string[]; // UML constraints like 'readonly', etc.
}

/**
 * UML Class Shape Definition
 * Supports 3-compartment class boxes with:
 * - Class name (with optional generic type parameters)
 * - Attributes compartment (hideable if empty)
 * - Methods compartment (hideable if empty)
 * - Member-level anchor points for connecting edges to specific attributes/methods
 */
export const classShape: ShapeDefinition = {
  id: 'class',

  bounds(ctx: ShapeRenderContext) {
    const padding = 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;

    const data = ctx.node.data || {};
    const attributes = (data.attributes as ClassAttribute[]) || [];
    const methods = (data.methods as ClassMethod[]) || [];
    const genericTypes = (data.genericTypes as string[]) || [];
    const stereotype = data.stereotype as string | undefined;

    const className = ctx.node.label || ctx.node.id;
    let nameText = className;
    if (genericTypes.length > 0) {
      nameText += `<${genericTypes.join(', ')}>`;
    }

    const attributeTexts = attributes.map(formatAttribute);
    const methodTexts = methods.map(formatMethod);

    const headerItems = stereotype ? [`«${stereotype}»`, nameText] : [nameText];

    const measureText = (text: string) => {
      if (ctx.measureText) {
        return ctx.measureText(text, ctx.style);
      }

      return { width: text.length * 8, height: lineHeight };
    };

    let maxWidth = 0;
    headerItems.forEach((item) => {
      const size = measureText(item);
      maxWidth = Math.max(maxWidth, size.width);
    });
    attributeTexts.forEach((item) => {
      const size = measureText(item);
      maxWidth = Math.max(maxWidth, size.width);
    });
    methodTexts.forEach((item) => {
      const size = measureText(item);
      maxWidth = Math.max(maxWidth, size.width);
    });

    const minWidth = 100;
    const width = Math.max(minWidth, maxWidth + padding * 2);

    let totalHeight = 0;
    let nameHeight = lineHeight + padding * 2;
    if (stereotype) {
      nameHeight += lineHeight;
    }
    totalHeight += nameHeight;

    if (attributeTexts.length > 0) {
      totalHeight += attributeTexts.length * lineHeight + padding * 2;
    }

    if (methodTexts.length > 0) {
      totalHeight += methodTexts.length * lineHeight + padding * 2;
    }

    const minHeight = 60;
    const height = Math.max(minHeight, totalHeight);

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    const anchors: { x: number; y: number; name?: string }[] = [];

    const data = ctx.node.data || {};
    const attributes = (data.attributes as ClassAttribute[]) || [];
    const methods = (data.methods as ClassMethod[]) || [];
    // const genericTypes = (data.genericTypes as string[]) || [];
    const stereotype = data.stereotype as string | undefined;

    const padding = 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;

    // Calculate compartment heights
    let nameHeight = lineHeight + padding * 2;
    if (stereotype) {
      nameHeight += lineHeight;
    }

    const attributesHeight =
      attributes.length > 0 ? attributes.length * lineHeight + padding * 2 : 0;

    // Standard anchors (top, right, bottom, left of entire class box)
    anchors.push(
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height / 2, name: 'left' }
    );

    // Attribute-level anchors (for connecting to specific attributes)
    let currentY = nameHeight + padding + lineHeight / 2;
    attributes.forEach((attr) => {
      const anchorName = `${ctx.node.id}.${attr.name}`;
      anchors.push({
        x: bounds.width, // Right side of class box
        y: currentY,
        name: anchorName,
      });
      currentY += lineHeight;
    });

    // Method-level anchors (for connecting to specific methods)
    currentY = nameHeight + attributesHeight + padding + lineHeight / 2;
    methods.forEach((method) => {
      const anchorName = `${ctx.node.id}.${method.name}`;
      anchors.push({
        x: bounds.width, // Right side of class box
        y: currentY,
        name: anchorName,
      });
      currentY += lineHeight;
    });

    return anchors;
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const data = ctx.node.data || {};
    const attributes = (data.attributes as ClassAttribute[]) || [];
    const methods = (data.methods as ClassMethod[]) || [];
    const genericTypes = (data.genericTypes as string[]) || [];
    const stereotype = data.stereotype as string | undefined;

    const padding = 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;

    // Calculate compartment heights
    let nameHeight = lineHeight + padding * 2;
    if (stereotype) {
      nameHeight += lineHeight;
    }

    const attributesHeight =
      attributes.length > 0 ? attributes.length * lineHeight + padding * 2 : 0;
    // const methodsHeight =
    //   methods.length > 0 ? methods.length * lineHeight + padding * 2 : 0;

    const className = ctx.node.label || ctx.node.id;
    let nameText = className;
    if (genericTypes.length > 0) {
      nameText += `<${genericTypes.join(', ')}>`;
    }

    let svg = '';

    // Main class rectangle
    svg += `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" `;
    svg += `fill="${ctx.style.fill || '#ffffff'}" stroke="${ctx.style.stroke || '#000000'}" `;
    svg += `stroke-width="${ctx.style.strokeWidth || 1}"/>`;

    // Name compartment
    let currentY = y + padding;

    // Stereotype (if present)
    if (stereotype) {
      const stereotypeText = `«${stereotype}»`;
      const stereotypeStyle = {
        ...ctx.style,
        fontSize: (ctx.style.fontSize || 14) * 0.9,
        fontStyle: 'italic' as const,
        color: ctx.style.textColor || ctx.style.color || '#000000',
      };
      svg += renderShapeLabel(
        { ...ctx, style: stereotypeStyle },
        stereotypeText,
        x + bounds.width / 2,
        currentY + lineHeight / 2
      );
      currentY += lineHeight;
    }

    // Class name (with optional generics)
    const nameStyle = {
      ...ctx.style,
      fontSize: ctx.style.fontSize || 14,
      fontWeight: 'bold',
      color: ctx.style.textColor || ctx.style.color || '#000000',
    };
    svg += renderShapeLabel(
      { ...ctx, style: nameStyle },
      nameText,
      x + bounds.width / 2,
      currentY + lineHeight / 2
    );

    currentY = y + nameHeight;

    // Attributes compartment (if any)
    if (attributes.length > 0) {
      // Separator line
      svg += `<line x1="${x}" y1="${currentY}" x2="${x + bounds.width}" y2="${currentY}" `;
      svg += `stroke="${ctx.style.stroke || '#000000'}" stroke-width="${ctx.style.strokeWidth || 1}"/>`;

      currentY += padding;

      // Render each attribute
      attributes.forEach((attr) => {
        const attrText = formatAttribute(attr);
        const attrStyle = {
          ...ctx.style,
          fontSize: ctx.style.fontSize || 14,
          color: ctx.style.textColor || ctx.style.color || '#000000',
          textDecoration: (attr.isStatic ? 'underline' : undefined) as
            | 'underline'
            | undefined,
        };
        svg += renderShapeLabel(
          { ...ctx, style: attrStyle },
          attrText,
          x + padding,
          currentY + lineHeight / 2,
          'start'
        );
        currentY += lineHeight;
      });

      currentY = y + nameHeight + attributesHeight;
    }

    // Methods compartment (if any)
    if (methods.length > 0) {
      // Separator line
      svg += `<line x1="${x}" y1="${currentY}" x2="${x + bounds.width}" y2="${currentY}" `;
      svg += `stroke="${ctx.style.stroke || '#000000'}" stroke-width="${ctx.style.strokeWidth || 1}"/>`;

      currentY += padding;

      // Render each method
      methods.forEach((method) => {
        const methodText = formatMethod(method);
        const methodStyle = {
          ...ctx.style,
          fontSize: ctx.style.fontSize || 14,
          color: ctx.style.textColor || ctx.style.color || '#000000',
          textDecoration: (method.isStatic ? 'underline' : undefined) as
            | 'underline'
            | undefined,
          fontStyle: (method.isAbstract ? 'italic' : undefined) as
            | 'italic'
            | undefined,
        };
        svg += renderShapeLabel(
          { ...ctx, style: methodStyle },
          methodText,
          x + padding,
          currentY + lineHeight / 2,
          'start'
        );
        currentY += lineHeight;
      });
    }

    return svg;
  },
};

/**
 * Format an attribute for display
 * e.g., "- name: String" or "+ balance: decimal" or "+ /age: int" (derived)
 */
function formatAttribute(attr: ClassAttribute): string {
  const visibility = getVisibilitySymbol(attr.visibility);
  const derivedPrefix = attr.isDerived ? '/' : '';
  let text = `${visibility} ${derivedPrefix}${attr.name}`;

  if (attr.type) {
    text += `: ${attr.type}`;
  }

  if (attr.defaultValue) {
    text += ` = ${attr.defaultValue}`;
  }

  return text;
}

/**
 * Format a method for display
 * e.g., "+ add(a: int, b: int): int" or "- calculateTotal(): decimal"
 */
function formatMethod(method: ClassMethod): string {
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
 * + public
 * - private
 * # protected
 * ~ package/internal
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
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
