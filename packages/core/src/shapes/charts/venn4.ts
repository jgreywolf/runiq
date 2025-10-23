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
    const circleRadius = 65;
    const spacing = 55; // Distance between circle centers

    // Width and height: accommodate 2 circles with spacing
    const width = circleRadius * 2 + spacing + 30; // Extra padding
    const height = circleRadius * 2 + spacing + 30;

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

  render(ctx, position) {
    const bounds = this.bounds({} as any);
    const circleRadius = 65;
    const spacing = 55;

    // Extract data with defaults
    // Data can be at ctx.node.data directly or in ctx.node.data.values[0]
    const rawData = (ctx.node.data as any) || {};
    const data = rawData.values && Array.isArray(rawData.values) && rawData.values.length > 0
      ? rawData.values[0]
      : rawData;
    
    const labelA = data.labelA || 'Set A';
    const labelB = data.labelB || 'Set B';
    const labelC = data.labelC || 'Set C';
    const labelD = data.labelD || 'Set D';
    const colors = Array.isArray(data.colors) ? data.colors : DEFAULT_COLORS;

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

    let svg = `<g transform="translate(${position.x},${position.y})">`;

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

    // Labels inside circles (positioned in non-overlapping regions)
    
    // Label A (top-left circle, pushed to top-left corner)
    svg += `<text x="${circleAX - 30}" y="${circleAY - 20}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" font-weight="bold" `;
    svg += `fill="${stroke}">${labelA}</text>`;

    // Label B (top-right circle, pushed to top-right corner)
    svg += `<text x="${circleBX + 30}" y="${circleBY - 20}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" font-weight="bold" `;
    svg += `fill="${stroke}">${labelB}</text>`;

    // Label C (bottom-left circle, pushed to bottom-left corner)
    svg += `<text x="${circleCX - 30}" y="${circleCY + 20}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" font-weight="bold" `;
    svg += `fill="${stroke}">${labelC}</text>`;

    // Label D (bottom-right circle, pushed to bottom-right corner)
    svg += `<text x="${circleDX + 30}" y="${circleDY + 20}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize - 1}" font-weight="bold" `;
    svg += `fill="${stroke}">${labelD}</text>`;

    svg += `</g>`;

    return svg;
  },
};
