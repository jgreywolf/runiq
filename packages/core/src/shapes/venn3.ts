import type { ShapeDefinition } from '../types.js';

/**
 * Default color palette for Venn diagram sets
 */
const DEFAULT_COLORS = ['#4299e1', '#48bb78', '#ed8936'];

/**
 * Three-circle Venn diagram - for showing overlap between three sets
 * Data format: { setA, setB, setC, AB, AC, BC, ABC, labelA, labelB, labelC, colors? }
 * Where: AB = intersection of A and B (excluding C)
 *        AC = intersection of A and C (excluding B)
 *        BC = intersection of B and C (excluding A)
 *        ABC = intersection of all three sets
 */
export const venn3Shape: ShapeDefinition = {
  id: 'venn3',

  bounds() {
    // Fixed size for consistent layout
    // Three circles in triangular arrangement
    const circleRadius = 60;
    const spacing = 50; // Distance between circle centers

    // Width: needs to accommodate two circles side-by-side
    const width = circleRadius * 2 + spacing + 20; // Add padding

    // Height: needs to accommodate vertical arrangement (triangle)
    const height = circleRadius * 2 + spacing + 40; // Extra space for labels

    return { width, height };
  },

  anchors() {
    const bounds = this.bounds({} as any);
    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height / 2, name: 'left' },
    ];
  },

  render(ctx) {
    const bounds = this.bounds({} as any);
    const circleRadius = 60;
    const spacing = 50;

    // Extract data with defaults
    const data = (ctx.node.data as any) || {};
    const setA = typeof data.setA === 'number' ? data.setA : 0;
    const setB = typeof data.setB === 'number' ? data.setB : 0;
    const setC = typeof data.setC === 'number' ? data.setC : 0;
    const AB = typeof data.AB === 'number' ? data.AB : 0;
    const AC = typeof data.AC === 'number' ? data.AC : 0;
    const BC = typeof data.BC === 'number' ? data.BC : 0;
    const ABC = typeof data.ABC === 'number' ? data.ABC : 0;

    const labelA = data.labelA || 'Set A';
    const labelB = data.labelB || 'Set B';
    const labelC = data.labelC || 'Set C';
    const colors = Array.isArray(data.colors) ? data.colors : DEFAULT_COLORS;

    // Calculate exclusive values for each region
    // Only A = A - (AB + AC - ABC) = A - AB - AC + ABC
    const onlyA = Math.max(0, setA - AB - AC + ABC);
    const onlyB = Math.max(0, setB - AB - BC + ABC);
    const onlyC = Math.max(0, setC - AC - BC + ABC);
    const onlyAB = Math.max(0, AB - ABC);
    const onlyAC = Math.max(0, AC - ABC);
    const onlyBC = Math.max(0, BC - ABC);

    // Circle positions - triangular arrangement
    // Top two circles (A and B)
    const circleAX = bounds.width / 2 - spacing / 2;
    const circleAY = circleRadius + 20; // Top
    const circleBX = bounds.width / 2 + spacing / 2;
    const circleBY = circleRadius + 20; // Top
    // Bottom circle (C)
    const circleCX = bounds.width / 2;
    const circleCY = circleRadius + 20 + spacing;

    // SVG style from context
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const fontFamily = ctx.style.fontFamily || 'Arial';

    // Colors with transparency for overlap visibility
    const colorA = colors[0] || DEFAULT_COLORS[0];
    const colorB = colors[1] || DEFAULT_COLORS[1];
    const colorC = colors[2] || DEFAULT_COLORS[2];
    const opacity = 0.4; // More transparent for 3 circles

    let svg = '';

    // Circle A (top left)
    svg += `<circle cx="${circleAX}" cy="${circleAY}" r="${circleRadius}" `;
    svg += `fill="${colorA}" fill-opacity="${opacity}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Circle B (top right)
    svg += `<circle cx="${circleBX}" cy="${circleBY}" r="${circleRadius}" `;
    svg += `fill="${colorB}" fill-opacity="${opacity}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Circle C (bottom center)
    svg += `<circle cx="${circleCX}" cy="${circleCY}" r="${circleRadius}" `;
    svg += `fill="${colorC}" fill-opacity="${opacity}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label A (above top-left circle)
    svg += `<text x="${circleAX}" y="${circleAY - circleRadius - 10}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">`;
    svg += `${labelA}`;
    svg += `</text>`;

    // Label B (above top-right circle)
    svg += `<text x="${circleBX}" y="${circleBY - circleRadius - 10}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">`;
    svg += `${labelB}`;
    svg += `</text>`;

    // Label C (below bottom circle)
    svg += `<text x="${circleCX}" y="${circleCY + circleRadius + 20}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">`;
    svg += `${labelC}`;
    svg += `</text>`;

    // Values in each region
    const valueFontSize = fontSize - 1;

    // Only A (left, in circle A only)
    svg += `<text x="${circleAX - 25}" y="${circleAY - 10}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${valueFontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">${onlyA}</text>`;

    // Only B (right, in circle B only)
    svg += `<text x="${circleBX + 25}" y="${circleBY - 10}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${valueFontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">${onlyB}</text>`;

    // Only C (bottom, in circle C only)
    svg += `<text x="${circleCX}" y="${circleCY + 30}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${valueFontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">${onlyC}</text>`;

    // AB intersection (between A and B, above center)
    const abX = (circleAX + circleBX) / 2;
    const abY = circleAY - 8;
    svg += `<text x="${abX}" y="${abY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${valueFontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">${onlyAB}</text>`;

    // AC intersection (between A and C, lower left)
    const acX = (circleAX + circleCX) / 2 - 15;
    const acY = (circleAY + circleCY) / 2;
    svg += `<text x="${acX}" y="${acY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${valueFontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">${onlyAC}</text>`;

    // BC intersection (between B and C, lower right)
    const bcX = (circleBX + circleCX) / 2 + 15;
    const bcY = (circleBY + circleCY) / 2;
    svg += `<text x="${bcX}" y="${bcY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${valueFontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">${onlyBC}</text>`;

    // ABC intersection (center of all three)
    const abcX = (circleAX + circleBX) / 2;
    const abcY = (circleAY + circleCY) / 2 + 5;
    svg += `<text x="${abcX}" y="${abcY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${valueFontSize + 1}" font-weight="bold" `;
    svg += `fill="${stroke}">${ABC}</text>`;

    return svg;
  },
};
