import type { ShapeDefinition } from '../../types.js';

/**
 * Default color palette for Venn diagram sets
 */
const DEFAULT_COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea'];

/**
 * Four-circle Venn diagram - for showing overlap between four sets
 * Data format: { setA, setB, setC, setD, AB, AC, AD, BC, BD, CD, ABC, ABD, ACD, BCD, ABCD, labelA, labelB, labelC, labelD, colors? }
 *
 * Total regions: 15
 * - 4 exclusive regions (only A, only B, only C, only D)
 * - 6 pairwise intersections (AB, AC, AD, BC, BD, CD)
 * - 4 triple intersections (ABC, ABD, ACD, BCD)
 * - 1 quadruple intersection (ABCD - all four sets)
 *
 * Circles arranged in 2x2 grid pattern for best overlap visualization
 */
export const venn4Shape: ShapeDefinition = {
  id: 'venn4',

  bounds() {
    // Fixed size for consistent layout
    // Four circles in 2x2 grid pattern
    const circleRadius = 55;
    const spacing = 45; // Distance between circle centers

    // Width and height: accommodate 2 circles with spacing
    const width = circleRadius * 2 + spacing + 40; // Extra padding
    const height = circleRadius * 2 + spacing + 60; // Extra for labels

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
    const circleRadius = 55;
    const spacing = 45;

    // Extract data with defaults
    const data = (ctx.node.data as any) || {};
    const setA = typeof data.setA === 'number' ? data.setA : 0;
    const setB = typeof data.setB === 'number' ? data.setB : 0;
    const setC = typeof data.setC === 'number' ? data.setC : 0;
    const setD = typeof data.setD === 'number' ? data.setD : 0;

    // Pairwise intersections
    const AB = typeof data.AB === 'number' ? data.AB : 0;
    const AC = typeof data.AC === 'number' ? data.AC : 0;
    const AD = typeof data.AD === 'number' ? data.AD : 0;
    const BC = typeof data.BC === 'number' ? data.BC : 0;
    const BD = typeof data.BD === 'number' ? data.BD : 0;
    const CD = typeof data.CD === 'number' ? data.CD : 0;

    // Triple intersections
    const ABC = typeof data.ABC === 'number' ? data.ABC : 0;
    const ABD = typeof data.ABD === 'number' ? data.ABD : 0;
    const ACD = typeof data.ACD === 'number' ? data.ACD : 0;
    const BCD = typeof data.BCD === 'number' ? data.BCD : 0;

    // Quadruple intersection
    const ABCD = typeof data.ABCD === 'number' ? data.ABCD : 0;

    const labelA = data.labelA || 'Set A';
    const labelB = data.labelB || 'Set B';
    const labelC = data.labelC || 'Set C';
    const labelD = data.labelD || 'Set D';
    const colors = Array.isArray(data.colors) ? data.colors : DEFAULT_COLORS;

    // Calculate exclusive values for each region using inclusion-exclusion principle
    // Only A = A - (AB + AC + AD) + (ABC + ABD + ACD) - ABCD
    const onlyA = Math.max(0, setA - AB - AC - AD + ABC + ABD + ACD - ABCD);
    const onlyB = Math.max(0, setB - AB - BC - BD + ABC + ABD + BCD - ABCD);
    const onlyC = Math.max(0, setC - AC - BC - CD + ABC + ACD + BCD - ABCD);
    const onlyD = Math.max(0, setD - AD - BD - CD + ABD + ACD + BCD - ABCD);

    // Pairwise only (excluding triples and quad)
    const onlyAB = Math.max(0, AB - ABC - ABD + ABCD);
    const onlyAC = Math.max(0, AC - ABC - ACD + ABCD);
    const onlyAD = Math.max(0, AD - ABD - ACD + ABCD);
    const onlyBC = Math.max(0, BC - ABC - BCD + ABCD);
    const onlyBD = Math.max(0, BD - ABD - BCD + ABCD);
    const onlyCD = Math.max(0, CD - ACD - BCD + ABCD);

    // Triple only (excluding quad)
    const onlyABC = Math.max(0, ABC - ABCD);
    const onlyABD = Math.max(0, ABD - ABCD);
    const onlyACD = Math.max(0, ACD - ABCD);
    const onlyBCD = Math.max(0, BCD - ABCD);

    // Circle positions - 2x2 grid with overlap
    // Top-left (A), Top-right (B), Bottom-left (C), Bottom-right (D)
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    const circleAX = centerX - spacing / 2;
    const circleAY = centerY - spacing / 2 + 10;
    const circleBX = centerX + spacing / 2;
    const circleBY = centerY - spacing / 2 + 10;
    const circleCX = centerX - spacing / 2;
    const circleCY = centerY + spacing / 2 + 10;
    const circleDX = centerX + spacing / 2;
    const circleDY = centerY + spacing / 2 + 10;

    // SVG style from context
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const fontFamily = ctx.style.fontFamily || 'Arial';

    // Colors with transparency for overlap visibility
    const colorA = colors[0] || DEFAULT_COLORS[0];
    const colorB = colors[1] || DEFAULT_COLORS[1];
    const colorC = colors[2] || DEFAULT_COLORS[2];
    const colorD = colors[3] || DEFAULT_COLORS[3];
    const opacity = 0.35; // More transparent for 4 circles

    let svg = '';

    // Render circles
    svg += `<circle cx="${circleAX}" cy="${circleAY}" r="${circleRadius}" `;
    svg += `fill="${colorA}" fill-opacity="${opacity}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    svg += `<circle cx="${circleBX}" cy="${circleBY}" r="${circleRadius}" `;
    svg += `fill="${colorB}" fill-opacity="${opacity}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    svg += `<circle cx="${circleCX}" cy="${circleCY}" r="${circleRadius}" `;
    svg += `fill="${colorC}" fill-opacity="${opacity}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    svg += `<circle cx="${circleDX}" cy="${circleDY}" r="${circleRadius}" `;
    svg += `fill="${colorD}" fill-opacity="${opacity}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Labels for each set (positioned outside circles)
    const labelOffset = circleRadius + 10;

    // Label A (top-left, above circle)
    svg += `<text x="${circleAX}" y="${circleAY - labelOffset}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" font-weight="bold" `;
    svg += `fill="${stroke}">${labelA}</text>`;

    // Label B (top-right, above circle)
    svg += `<text x="${circleBX}" y="${circleBY - labelOffset}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" font-weight="bold" `;
    svg += `fill="${stroke}">${labelB}</text>`;

    // Label C (bottom-left, below circle)
    svg += `<text x="${circleCX}" y="${circleCY + labelOffset + 5}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" font-weight="bold" `;
    svg += `fill="${stroke}">${labelC}</text>`;

    // Label D (bottom-right, below circle)
    svg += `<text x="${circleDX}" y="${circleDY + labelOffset + 5}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" font-weight="bold" `;
    svg += `fill="${stroke}">${labelD}</text>`;

    // Value labels - smaller font for many regions
    const valueFontSize = fontSize - 3;

    // Helper function to add value text
    const addValue = (x: number, y: number, value: number) => {
      svg += `<text x="${x}" y="${y}" `;
      svg += `text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${valueFontSize}" font-weight="bold" `;
      svg += `fill="${stroke}">${value}</text>`;
    };

    // Exclusive regions (corners)
    addValue(circleAX - 20, circleAY - 15, onlyA); // Only A (top-left corner)
    addValue(circleBX + 20, circleBY - 15, onlyB); // Only B (top-right corner)
    addValue(circleCX - 20, circleCY + 15, onlyC); // Only C (bottom-left corner)
    addValue(circleDX + 20, circleDY + 15, onlyD); // Only D (bottom-right corner)

    // Pairwise intersections
    addValue((circleAX + circleBX) / 2, circleAY - 8, onlyAB); // AB (top center)
    addValue(circleAX - 8, (circleAY + circleCY) / 2, onlyAC); // AC (left center)
    addValue((circleAX + circleDX) / 2, (circleAY + circleDY) / 2, onlyAD); // AD (center-left to bottom-right)
    addValue((circleBX + circleCX) / 2, (circleBY + circleCY) / 2, onlyBC); // BC (center-right to bottom-left)
    addValue(circleBX + 8, (circleBY + circleDY) / 2, onlyBD); // BD (right center)
    addValue((circleCX + circleDX) / 2, circleCY + 8, onlyCD); // CD (bottom center)

    // Triple intersections (closer to center)
    const tripleOffset = 8;
    addValue(centerX - tripleOffset, centerY - tripleOffset, onlyABC); // ABC (top-left of center)
    addValue(centerX + tripleOffset, centerY - tripleOffset, onlyABD); // ABD (top-right of center)
    addValue(centerX - tripleOffset, centerY + tripleOffset, onlyACD); // ACD (bottom-left of center)
    addValue(centerX + tripleOffset, centerY + tripleOffset, onlyBCD); // BCD (bottom-right of center)

    // Quadruple intersection (dead center)
    svg += `<text x="${centerX}" y="${centerY + 10}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${valueFontSize + 1}" font-weight="bold" `;
    svg += `fill="${stroke}">${ABCD}</text>`;

    return svg;
  },
};
