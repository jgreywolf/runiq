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
 * Intersection labels (optional):
 * - Use intersections:[] property to label overlapping regions
 * - For 2 circles: [AB]
 * - For 3 circles: [AB, AC, BC, ABC]
 * - For 4 circles: [AB, AC, AD, BC, BD, CD, ABC, ABD, ACD, BCD, ABCD]
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
  ctx: ShapeRenderContext,
  intersections?: string[]
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

  // Intersection label AB (center of overlap)
  if (intersections && intersections[0]) {
    const overlapCenterX = (circleAX + circleBX) / 2;
    svg += `<text x="${overlapCenterX}" y="${centerY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" `;
    svg += `fill="${stroke}">${intersections[0]}</text>`;
  }

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
  ctx: ShapeRenderContext,
  intersections?: string[]
): string {
  const circleRadius = 70;
  const spacing = 80; // Increased from 60 to spread circles more

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

  // Intersection labels: [AB, AC, BC, ABC]
  // Position them in the lens-shaped regions, offset from the triple intersection
  if (intersections) {
    const centerX = (circleAX + circleBX + circleCX) / 3;
    const centerY = (circleAY + circleBY + circleCY) / 3;
    
    // AB intersection (between top-left and top-right circles)
    // Position above center, in the lens between A and B
    if (intersections[0]) {
      const midX = (circleAX + circleBX) / 2;
      const midY = (circleAY + circleBY) / 2;
      // Move away from center toward the midpoint
      const abX = midX;
      const abY = midY - 20; // Increased from -15 to move further up
      svg += `<text x="${abX}" y="${abY}" `;
      svg += `text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" `;
      svg += `fill="${stroke}">${intersections[0]}</text>`;
    }
    
    // AC intersection (between top-left and bottom center)
    // Position in lower-left lens
    if (intersections[1]) {
      const midX = (circleAX + circleCX) / 2;
      const midY = (circleAY + circleCY) / 2;
      // Move away from center toward the bottom-left
      const acX = midX - 15; // Increased from -10 to shift further left
      const acY = midY + 8; // Increased from +5 to shift further down
      svg += `<text x="${acX}" y="${acY}" `;
      svg += `text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" `;
      svg += `fill="${stroke}">${intersections[1]}</text>`;
    }
    
    // BC intersection (between top-right and bottom center)
    // Position in lower-right lens
    if (intersections[2]) {
      const midX = (circleBX + circleCX) / 2;
      const midY = (circleBY + circleCY) / 2;
      // Move away from center toward the bottom-right
      const bcX = midX + 15; // Increased from +10 to shift further right
      const bcY = midY + 8; // Increased from +5 to shift further down
      svg += `<text x="${bcX}" y="${bcY}" `;
      svg += `text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" `;
      svg += `fill="${stroke}">${intersections[2]}</text>`;
    }
    
    // ABC intersection (center where all three meet)
    if (intersections[3]) {
      svg += `<text x="${centerX}" y="${centerY}" `;
      svg += `text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" `;
      svg += `fill="${stroke}">${intersections[3]}</text>`;
    }
  }

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
  ctx: ShapeRenderContext,
  intersections?: string[]
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

  // Intersection labels: [AB, AC, AD, BC, BD, CD, ABC, ABD, ACD, BCD, ABCD]
  if (intersections) {
    const smallFontSize = fontSize - 2;
    
    // Pairwise intersections (6 total)
    // AB (top-left ∩ top-right)
    if (intersections[0]) {
      const abX = (circleAX + circleBX) / 2;
      const abY = (circleAY + circleBY) / 2;
      svg += `<text x="${abX}" y="${abY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${smallFontSize}" fill="${stroke}">${intersections[0]}</text>`;
    }
    
    // AC (top-left ∩ bottom-left)
    if (intersections[1]) {
      const acX = (circleAX + circleCX) / 2;
      const acY = (circleAY + circleCY) / 2;
      svg += `<text x="${acX}" y="${acY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${smallFontSize}" fill="${stroke}">${intersections[1]}</text>`;
    }
    
    // AD (top-left ∩ bottom-right - diagonal)
    if (intersections[2]) {
      const adX = (circleAX + circleDX) / 2;
      const adY = (circleAY + circleDY) / 2;
      svg += `<text x="${adX}" y="${adY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${smallFontSize}" fill="${stroke}">${intersections[2]}</text>`;
    }
    
    // BC (top-right ∩ bottom-left - diagonal)
    if (intersections[3]) {
      const bcX = (circleBX + circleCX) / 2;
      const bcY = (circleBY + circleCY) / 2;
      svg += `<text x="${bcX}" y="${bcY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${smallFontSize}" fill="${stroke}">${intersections[3]}</text>`;
    }
    
    // BD (top-right ∩ bottom-right)
    if (intersections[4]) {
      const bdX = (circleBX + circleDX) / 2;
      const bdY = (circleBY + circleDY) / 2;
      svg += `<text x="${bdX}" y="${bdY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${smallFontSize}" fill="${stroke}">${intersections[4]}</text>`;
    }
    
    // CD (bottom-left ∩ bottom-right)
    if (intersections[5]) {
      const cdX = (circleCX + circleDX) / 2;
      const cdY = (circleCY + circleDY) / 2;
      svg += `<text x="${cdX}" y="${cdY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${smallFontSize}" fill="${stroke}">${intersections[5]}</text>`;
    }
    
    // Triple intersections (4 total)
    // ABC (top-left ∩ top-right ∩ bottom-left)
    if (intersections[6]) {
      const abcX = (circleAX + circleBX + circleCX) / 3;
      const abcY = (circleAY + circleBY + circleCY) / 3;
      svg += `<text x="${abcX}" y="${abcY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${smallFontSize}" fill="${stroke}">${intersections[6]}</text>`;
    }
    
    // ABD (top-left ∩ top-right ∩ bottom-right)
    if (intersections[7]) {
      const abdX = (circleAX + circleBX + circleDX) / 3;
      const abdY = (circleAY + circleBY + circleDY) / 3;
      svg += `<text x="${abdX}" y="${abdY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${smallFontSize}" fill="${stroke}">${intersections[7]}</text>`;
    }
    
    // ACD (top-left ∩ bottom-left ∩ bottom-right)
    if (intersections[8]) {
      const acdX = (circleAX + circleCX + circleDX) / 3;
      const acdY = (circleAY + circleCY + circleDY) / 3;
      svg += `<text x="${acdX}" y="${acdY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${smallFontSize}" fill="${stroke}">${intersections[8]}</text>`;
    }
    
    // BCD (top-right ∩ bottom-left ∩ bottom-right)
    if (intersections[9]) {
      const bcdX = (circleBX + circleCX + circleDX) / 3;
      const bcdY = (circleBY + circleCY + circleDY) / 3;
      svg += `<text x="${bcdX}" y="${bcdY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${smallFontSize}" fill="${stroke}">${intersections[9]}</text>`;
    }
    
    // Quadruple intersection (1 total)
    // ABCD (all four circles meet)
    if (intersections[10]) {
      const abcdX = (circleAX + circleBX + circleCX + circleDX) / 4;
      const abcdY = (circleAY + circleBY + circleCY + circleDY) / 4;
      svg += `<text x="${abcdX}" y="${abcdY}" text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${smallFontSize}" fill="${stroke}">${intersections[10]}</text>`;
    }
  }

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
      const spacing = 80; // Updated to match render3Circles
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
    
    // Get intersection labels if provided
    const intersections = Array.isArray(ctx.node.data?.intersections)
      ? (ctx.node.data.intersections as string[])
      : undefined;

    const sets = normalizeData(ctx.node.data, customLabels, customColors);
    const numSets = sets.length;
    const bounds = this.bounds(ctx);

    if (numSets === 2) {
      return render2Circles(sets, position, bounds, ctx, intersections);
    } else if (numSets === 3) {
      return render3Circles(sets, position, bounds, ctx, intersections);
    } else {
      // 4 sets (or fallback to 4 if more than 4)
      return render4Circles(sets.slice(0, 4), position, bounds, ctx, intersections);
    }
  },
};
