import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';

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
    const lineHeight = 18;
    const minWidth = 100;

    // Extract class data
    const data = ctx.node.data || {};
    const attributes = (data.attributes as ClassAttribute[]) || [];
    const methods = (data.methods as ClassMethod[]) || [];
    const genericTypes = (data.genericTypes as string[]) || [];
    const stereotype = data.stereotype as string | undefined;

    // Calculate class name width (with generics)
    const className = ctx.node.label || ctx.node.id;
    let nameText = className;
    if (genericTypes.length > 0) {
      nameText += `<${genericTypes.join(', ')}>`;
    }
    const nameSize = ctx.measureText(nameText, ctx.style);

    // Calculate stereotype width if present
    let stereotypeWidth = 0;
    if (stereotype) {
      const stereotypeSize = ctx.measureText(`«${stereotype}»`, ctx.style);
      stereotypeWidth = stereotypeSize.width;
    }

    // Calculate attributes compartment height and width
    let attributesHeight = 0;
    let attributesWidth = 0;
    if (attributes.length > 0) {
      attributesHeight = attributes.length * lineHeight + padding * 2;
      attributes.forEach((attr) => {
        const attrText = formatAttribute(attr);
        const attrSize = ctx.measureText(attrText, ctx.style);
        attributesWidth = Math.max(attributesWidth, attrSize.width);
      });
    }

    // Calculate methods compartment height and width
    let methodsHeight = 0;
    let methodsWidth = 0;
    if (methods.length > 0) {
      methodsHeight = methods.length * lineHeight + padding * 2;
      methods.forEach((method) => {
        const methodText = formatMethod(method);
        const methodSize = ctx.measureText(methodText, ctx.style);
        methodsWidth = Math.max(methodsWidth, methodSize.width);
      });
    }

    // Calculate name compartment height
    let nameHeight = lineHeight + padding * 2;
    if (stereotype) {
      nameHeight += lineHeight; // Extra line for stereotype
    }

    // Calculate total dimensions
    const width = Math.max(
      minWidth,
      nameSize.width + padding * 2,
      stereotypeWidth + padding * 2,
      attributesWidth + padding * 2,
      methodsWidth + padding * 2
    );

    const height = nameHeight + attributesHeight + methodsHeight;

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
    const lineHeight = 18;

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
    const lineHeight = 18;

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
      svg += `<text x="${x + bounds.width / 2}" y="${currentY + lineHeight / 2}" `;
      svg += `text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${ctx.style.font || 'sans-serif'}" `;
      svg += `font-size="${(ctx.style.fontSize || 14) * 0.9}" `;
      svg += `font-style="italic" fill="${ctx.style.textColor || '#000000'}">`;
      svg += escapeXml(stereotypeText);
      svg += '</text>';
      currentY += lineHeight;
    }

    // Class name (with optional generics)
    svg += `<text x="${x + bounds.width / 2}" y="${currentY + lineHeight / 2}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${ctx.style.font || 'sans-serif'}" `;
    svg += `font-size="${ctx.style.fontSize || 14}" `;
    svg += `font-weight="bold" fill="${ctx.style.textColor || '#000000'}">`;
    svg += escapeXml(nameText);
    svg += '</text>';

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
        svg += `<text x="${x + padding}" y="${currentY + lineHeight / 2}" `;
        svg += `text-anchor="start" dominant-baseline="middle" `;
        svg += `font-family="${ctx.style.font || 'sans-serif'}" `;
        svg += `font-size="${ctx.style.fontSize || 14}" `;
        svg += `fill="${ctx.style.textColor || '#000000'}">`;

        // Wrap in tspan if static (for underline)
        if (attr.isStatic) {
          svg += `<tspan text-decoration="underline">`;
        }
        svg += escapeXml(attrText);
        if (attr.isStatic) {
          svg += `</tspan>`;
        }

        svg += '</text>';
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
        svg += `<text x="${x + padding}" y="${currentY + lineHeight / 2}" `;
        svg += `text-anchor="start" dominant-baseline="middle" `;
        svg += `font-family="${ctx.style.font || 'sans-serif'}" `;
        svg += `font-size="${ctx.style.fontSize || 14}" `;
        svg += `fill="${ctx.style.textColor || '#000000'}">`;

        // Wrap in tspan for styling (underline for static, italics for abstract)
        if (method.isStatic || method.isAbstract) {
          svg += `<tspan`;
          if (method.isStatic) {
            svg += ` text-decoration="underline"`;
          }
          if (method.isAbstract) {
            svg += ` font-style="italic"`;
          }
          svg += `>`;
        }
        svg += escapeXml(methodText);
        if (method.isStatic || method.isAbstract) {
          svg += `</tspan>`;
        }

        svg += '</text>';
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
