import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

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
    const circleRadius = 70;
    const spacing = 60; // Distance between circle centers

    // Width: needs to accommodate two circles side-by-side
    const width = circleRadius * 2 + spacing + 20; // Add padding

    // Height: needs to accommodate vertical arrangement (triangle)
    const height = circleRadius * 2 + spacing + 20;

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
    const circleRadius = 70;
    const spacing = 60;

    // Extract data with defaults
    // Data can be at ctx.node.data directly or in ctx.node.data.values[0]
    const rawData = (ctx.node.data as any) || {};
    const data =
      rawData.values &&
      Array.isArray(rawData.values) &&
      rawData.values.length > 0
        ? rawData.values[0]
        : rawData;

    const labelA = data.labelA || 'Set A';
    const labelB = data.labelB || 'Set B';
    const labelC = data.labelC || 'Set C';
    const colors = Array.isArray(data.colors) ? data.colors : DEFAULT_COLORS;

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

    let svg = `<g transform="translate(${position.x},${position.y})">`;

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

    // Label A (inside top-left circle, pushed left)
    const labelStyleA = { fontSize, fontWeight: 'bold', color: stroke } as any;
    svg += renderShapeLabel(
      { style: labelStyleA } as any,
      labelA,
      circleAX - 35,
      circleAY - 15
    );

    // Label B (inside top-right circle, pushed right)
    const labelStyleB = { fontSize, fontWeight: 'bold', color: stroke } as any;
    svg += renderShapeLabel(
      { style: labelStyleB } as any,
      labelB,
      circleBX + 35,
      circleBY - 15
    );

    // Label C (inside bottom circle, pushed down)
    const labelStyleC = { fontSize, fontWeight: 'bold', color: stroke } as any;
    svg += renderShapeLabel(
      { style: labelStyleC } as any,
      labelC,
      circleCX,
      circleCY + 35
    );

    svg += `</g>`;

    return svg;
  },
};
