import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Default color palette for Venn diagram sets
 */
const DEFAULT_COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea'];

/**
 * Unified Venn diagram - automatically determines 2, 3, or 4 circles based on data
 * 
 * Data formats:
 * 1. Simple array with labels: data:[values], labels:["Set A", "Set B", ...]
 * 2. Object format: data:[{label: "Set A", value: 100}, ...]
 * 3. Legacy format: data:{labelA, labelB, labelC, labelD, colors:[...]}
 * 
 * The number of circles is determined by:
 * - Array length (simple array or object array)
 * - Number of label properties (labelA, labelB, etc.)
 * 
 * Supports 2, 3, or 4 circle Venn diagrams
 */

interface VennSet {
  label: string;
  color: string;
}

/**
 * Normalize data from various formats to consistent VennSet array
 */
function normalizeData(data: unknown, customLabels?: string[], customColors?: string[]): VennSet[] {
  // Handle DSL parser wrapping: data may be wrapped in a values array
  let actualData = data;
  if (typeof data === 'object' && data !== null && 'values' in data) {
    const dataObj = data as { values?: unknown };
    if (Array.isArray(dataObj.values)) {
      actualData = dataObj.values;
    }
  }

  // Format 1: Simple array of numbers [30, 20, 50] or [1, 1, 1, 1]
  if (Array.isArray(actualData)) {
    return actualData.map((item: unknown, i: number) => {
      if (typeof item === 'number' || typeof item === 'string') {
        return {
          label: customLabels?.[i] || `Set ${String.fromCharCode(65 + i)}`, // A, B, C, D
          color: customColors?.[i] || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        };
      }
      if (typeof item === 'object' && item !== null && 'label' in item) {
        const objItem = item as { label?: string; value?: unknown };
        return {
          label: objItem.label || customLabels?.[i] || `Set ${String.fromCharCode(65 + i)}`,
          color: customColors?.[i] || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        };
      }
      return {
        label: `Set ${String.fromCharCode(65 + i)}`,
        color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      };
    }).slice(0, 4); // Max 4 sets
  }

  // Format 2: Legacy object with labelA, labelB, etc.
  if (typeof actualData === 'object' && actualData !== null) {
    const dataObj = actualData as Record<string, unknown>;
    const sets: VennSet[] = [];
    const labels = ['labelA', 'labelB', 'labelC', 'labelD'];
    const colors = Array.isArray(dataObj.colors) ? (dataObj.colors as string[]) : customColors || DEFAULT_COLORS;

    for (let i = 0; i < labels.length; i++) {
      const labelKey = labels[i];
      if (labelKey in dataObj && typeof dataObj[labelKey] === 'string') {
        sets.push({
          label: dataObj[labelKey] as string,
          color: colors[i] || DEFAULT_COLORS[i],
        });
      } else if (i === 0) {
        // Always have at least 2 sets for venn diagram
        sets.push({
          label: customLabels?.[i] || `Set ${String.fromCharCode(65 + i)}`,
          color: colors[i] || DEFAULT_COLORS[i],
        });
      } else {
        break; // Stop when we run out of labels
      }
    }

    // Ensure we have at least 2 sets, max 4
    if (sets.length < 2) {
      sets.push({
        label: customLabels?.[1] || 'Set B',
        color: colors[1] || DEFAULT_COLORS[1],
      });
    }

    return sets;
  }

  // Default: 2 sets
  return [
    { label: 'Set A', color: DEFAULT_COLORS[0] },
    { label: 'Set B', color: DEFAULT_COLORS[1] },
  ];
}

/**
 * Render 2-circle Venn diagram
 */
function render2Circles(
  sets: VennSet[],
  position: { x: number; y: number },
  bounds: { width: number; height: number },
  ctx: ShapeRenderContext
): string {
  const circleRadius = 80;
  const overlapDistance = 60;

  const centerY = bounds.height / 2;
  const circleAX = circleRadius;
  const circleBX = circleRadius + overlapDistance;

  const stroke = ctx.style.stroke || '#000000';
  const strokeWidth = ctx.style.strokeWidth || 2;
  const fontSize = ctx.style.fontSize || 14;
  const fontFamily = typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';
  const opacity = 0.5;

  let svg = `<g transform="translate(${position.x},${position.y})">`;

  // Circle A (left)
  svg += `<circle cx="${circleAX}" cy="${centerY}" r="${circleRadius}" `;
  svg += `fill="${sets[0].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle B (right)
  svg += `<circle cx="${circleBX}" cy="${centerY}" r="${circleRadius}" `;
  svg += `fill="${sets[1].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Label A (left circle, non-overlapping region)
  svg += `<text x="${circleAX - 30}" y="${centerY}" `;
  svg += `text-anchor="middle" dominant-baseline="middle" `;
  svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
  svg += `fill="${stroke}">${sets[0].label}</text>`;

  // Label B (right circle, non-overlapping region)
  svg += `<text x="${circleBX + 30}" y="${centerY}" `;
  svg += `text-anchor="middle" dominant-baseline="middle" `;
  svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
  svg += `fill="${stroke}">${sets[1].label}</text>`;

  svg += `</g>`;
  return svg;
}

/**
 * Render 3-circle Venn diagram
 */
function render3Circles(
  sets: VennSet[],
  position: { x: number; y: number },
  bounds: { width: number; height: number },
  ctx: ShapeRenderContext
): string {
  const circleRadius = 70;
  const spacing = 60;

  // Triangular arrangement
  const circleAX = bounds.width / 2 - spacing / 2;
  const circleAY = circleRadius + 20;
  const circleBX = bounds.width / 2 + spacing / 2;
  const circleBY = circleRadius + 20;
  const circleCX = bounds.width / 2;
  const circleCY = circleRadius + 20 + spacing;

  const stroke = ctx.style.stroke || '#000000';
  const strokeWidth = ctx.style.strokeWidth || 2;
  const fontSize = ctx.style.fontSize || 14;
  const fontFamily = typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';
  const opacity = 0.4;

  let svg = `<g transform="translate(${position.x},${position.y})">`;

  // Circle A (top left)
  svg += `<circle cx="${circleAX}" cy="${circleAY}" r="${circleRadius}" `;
  svg += `fill="${sets[0].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle B (top right)
  svg += `<circle cx="${circleBX}" cy="${circleBY}" r="${circleRadius}" `;
  svg += `fill="${sets[1].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle C (bottom center)
  svg += `<circle cx="${circleCX}" cy="${circleCY}" r="${circleRadius}" `;
  svg += `fill="${sets[2].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Label A (top-left, pushed left)
  svg += `<text x="${circleAX - 35}" y="${circleAY - 15}" `;
  svg += `text-anchor="middle" dominant-baseline="middle" `;
  svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
  svg += `fill="${stroke}">${sets[0].label}</text>`;

  // Label B (top-right, pushed right)
  svg += `<text x="${circleBX + 35}" y="${circleBY - 15}" `;
  svg += `text-anchor="middle" dominant-baseline="middle" `;
  svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
  svg += `fill="${stroke}">${sets[1].label}</text>`;

  // Label C (bottom, pushed down)
  svg += `<text x="${circleCX}" y="${circleCY + 35}" `;
  svg += `text-anchor="middle" dominant-baseline="middle" `;
  svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
  svg += `fill="${stroke}">${sets[2].label}</text>`;

  svg += `</g>`;
  return svg;
}

/**
 * Render 4-circle Venn diagram
 */
function render4Circles(
  sets: VennSet[],
  position: { x: number; y: number },
  bounds: { width: number; height: number },
  ctx: ShapeRenderContext
): string {
  const circleRadius = 65;
  const spacing = 55;

  // 2x2 grid arrangement
  const circleAX = bounds.width / 2 - spacing / 2;
  const circleAY = bounds.height / 2 - spacing / 2;
  const circleBX = bounds.width / 2 + spacing / 2;
  const circleBY = bounds.height / 2 - spacing / 2;
  const circleCX = bounds.width / 2 - spacing / 2;
  const circleCY = bounds.height / 2 + spacing / 2;
  const circleDX = bounds.width / 2 + spacing / 2;
  const circleDY = bounds.height / 2 + spacing / 2;

  const stroke = ctx.style.stroke || '#000000';
  const strokeWidth = ctx.style.strokeWidth || 2;
  const fontSize = ctx.style.fontSize || 13;
  const fontFamily = typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';
  const opacity = 0.35;

  let svg = `<g transform="translate(${position.x},${position.y})">`;

  // Circle A (top-left)
  svg += `<circle cx="${circleAX}" cy="${circleAY}" r="${circleRadius}" `;
  svg += `fill="${sets[0].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle B (top-right)
  svg += `<circle cx="${circleBX}" cy="${circleBY}" r="${circleRadius}" `;
  svg += `fill="${sets[1].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle C (bottom-left)
  svg += `<circle cx="${circleCX}" cy="${circleCY}" r="${circleRadius}" `;
  svg += `fill="${sets[2].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Circle D (bottom-right)
  svg += `<circle cx="${circleDX}" cy="${circleDY}" r="${circleRadius}" `;
  svg += `fill="${sets[3].color}" fill-opacity="${opacity}" `;
  svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

  // Label A (top-left, pushed up-left)
  svg += `<text x="${circleAX - 30}" y="${circleAY - 25}" `;
  svg += `text-anchor="middle" dominant-baseline="middle" `;
  svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
  svg += `fill="${stroke}">${sets[0].label}</text>`;

  // Label B (top-right, pushed up-right)
  svg += `<text x="${circleBX + 30}" y="${circleBY - 25}" `;
  svg += `text-anchor="middle" dominant-baseline="middle" `;
  svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
  svg += `fill="${stroke}">${sets[1].label}</text>`;

  // Label C (bottom-left, pushed down-left)
  svg += `<text x="${circleCX - 30}" y="${circleCY + 25}" `;
  svg += `text-anchor="middle" dominant-baseline="middle" `;
  svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
  svg += `fill="${stroke}">${sets[2].label}</text>`;

  // Label D (bottom-right, pushed down-right)
  svg += `<text x="${circleDX + 30}" y="${circleDY + 25}" `;
  svg += `text-anchor="middle" dominant-baseline="middle" `;
  svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
  svg += `fill="${stroke}">${sets[3].label}</text>`;

  svg += `</g>`;
  return svg;
}

/**
 * Unified Venn diagram shape definition
 */
export const vennShape: ShapeDefinition = {
  id: 'venn',

  bounds(ctx: ShapeRenderContext): { width: number; height: number } {
    // Get custom labels and colors if provided
    const customLabels = Array.isArray(ctx.node.data?.labels)
      ? (ctx.node.data.labels as string[])
      : undefined;
    const customColors = Array.isArray(ctx.node.data?.colors)
      ? (ctx.node.data.colors as string[])
      : undefined;

    const sets = normalizeData(ctx.node.data, customLabels, customColors);
    const numSets = sets.length;

    if (numSets === 2) {
      const circleRadius = 80;
      const overlapDistance = 60;
      return {
        width: circleRadius * 2 + overlapDistance,
        height: circleRadius * 2,
      };
    } else if (numSets === 3) {
      const circleRadius = 70;
      const spacing = 60;
      return {
        width: circleRadius * 2 + spacing + 20,
        height: circleRadius * 2 + spacing + 20,
      };
    } else {
      // 4 sets (or fallback)
      const circleRadius = 65;
      const spacing = 55;
      return {
        width: circleRadius * 2 + spacing + 35,
        height: circleRadius * 2 + spacing + 35,
      };
    }
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height / 2, name: 'left' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string {
    // Get custom labels and colors if provided
    const customLabels = Array.isArray(ctx.node.data?.labels)
      ? (ctx.node.data.labels as string[])
      : undefined;
    const customColors = Array.isArray(ctx.node.data?.colors)
      ? (ctx.node.data.colors as string[])
      : undefined;

    const sets = normalizeData(ctx.node.data, customLabels, customColors);
    const numSets = sets.length;
    const bounds = this.bounds(ctx);

    if (numSets === 2) {
      return render2Circles(sets, position, bounds, ctx);
    } else if (numSets === 3) {
      return render3Circles(sets, position, bounds, ctx);
    } else {
      // 4 sets (or fallback to 4 if more than 4)
      return render4Circles(sets.slice(0, 4), position, bounds, ctx);
    }
  },
};
