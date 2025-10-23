import type { ShapeDefinition } from '../../types.js';

/**
 * Default color palette for Venn diagram sets
 */
const DEFAULT_COLORS = ['#4299e1', '#48bb78', '#ed8936'];

/**
 * Two-circle Venn diagram - for showing overlap between two sets
 * Data format: { setA, setB, intersection, labelA, labelB, colors? }
 */
export const venn2Shape: ShapeDefinition = {
  id: 'venn2',

  bounds() {
    // Fixed size for consistent layout
    // Two circles side-by-side with overlap
    const circleRadius = 80;
    const overlapDistance = 60; // Distance between circle centers

    // Width: left circle + overlap + right circle
    const width = circleRadius * 2 + overlapDistance;

    // Height: single circle diameter (no extra padding for labels)
    const height = circleRadius * 2;

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
    const bounds = this.bounds(ctx);
    const circleRadius = 80;
    const overlapDistance = 60;

    // Extract data with defaults
    // Data can be at ctx.node.data directly or in ctx.node.data.values[0]
    const rawData = (ctx.node.data as any) || {};
    const data = rawData.values && Array.isArray(rawData.values) && rawData.values.length > 0
      ? rawData.values[0]
      : rawData;
    
    const labelA = data.labelA || 'Set A';
    const labelB = data.labelB || 'Set B';
    const colors = Array.isArray(data.colors) ? data.colors : DEFAULT_COLORS;

    // Circle positions (centered vertically, overlapping horizontally)
    const centerY = bounds.height / 2;
    const circleAX = circleRadius; // Left circle
    const circleBX = circleRadius + overlapDistance; // Right circle (overlaps)

    // SVG style from context
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const fontFamily = ctx.style.fontFamily || 'Arial';

    // Color with transparency for overlap visibility
    const colorA = colors[0] || DEFAULT_COLORS[0];
    const colorB = colors[1] || DEFAULT_COLORS[1];
    const opacity = 0.5; // Semi-transparent circles

    let svg = `<g transform="translate(${position.x},${position.y})">`;

    // Circle A (left)
    svg += `<circle cx="${circleAX}" cy="${centerY}" r="${circleRadius}" `;
    svg += `fill="${colorA}" fill-opacity="${opacity}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Circle B (right)
    svg += `<circle cx="${circleBX}" cy="${centerY}" r="${circleRadius}" `;
    svg += `fill="${colorB}" fill-opacity="${opacity}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label A (inside left circle, non-overlapping region)
    const labelAX = circleAX - 30;
    const labelAY = centerY;
    svg += `<text x="${labelAX}" y="${labelAY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">`;
    svg += `${labelA}`;
    svg += `</text>`;

    // Label B (inside right circle, non-overlapping region)
    const labelBX = circleBX + 30;
    const labelBY = centerY;
    svg += `<text x="${labelBX}" y="${labelBY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">`;
    svg += `${labelB}`;
    svg += `</text>`;

    svg += `</g>`;

    return svg;
  },
};
