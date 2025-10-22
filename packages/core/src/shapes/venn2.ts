import type { ShapeDefinition } from '../types.js';

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
    const circleRadius = 60;
    const overlapDistance = 40; // Distance between circle centers

    // Width: left circle + overlap + right circle
    const width = circleRadius * 2 + overlapDistance;

    // Height: single circle diameter + padding for labels
    const height = circleRadius * 2 + 40; // Extra space for labels above/below

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
    const bounds = this.bounds(ctx);
    const circleRadius = 60;
    const overlapDistance = 40;

    // Extract data with defaults
    const data = (ctx.node.data as any) || {};
    const setA = typeof data.setA === 'number' ? data.setA : 0;
    const setB = typeof data.setB === 'number' ? data.setB : 0;
    const intersection =
      typeof data.intersection === 'number' ? data.intersection : 0;
    const labelA = data.labelA || 'Set A';
    const labelB = data.labelB || 'Set B';
    const colors = Array.isArray(data.colors) ? data.colors : DEFAULT_COLORS;

    // Calculate only-A and only-B values
    const onlyA = Math.max(0, setA - intersection);
    const onlyB = Math.max(0, setB - intersection);

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

    let svg = '';

    // Circle A (left)
    svg += `<circle cx="${circleAX}" cy="${centerY}" r="${circleRadius}" `;
    svg += `fill="${colorA}" fill-opacity="${opacity}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Circle B (right)
    svg += `<circle cx="${circleBX}" cy="${centerY}" r="${circleRadius}" `;
    svg += `fill="${colorB}" fill-opacity="${opacity}" `;
    svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Label A (above left circle)
    const labelAX = circleAX;
    const labelAY = 15;
    svg += `<text x="${labelAX}" y="${labelAY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">`;
    svg += `${labelA}`;
    svg += `</text>`;

    // Label B (above right circle)
    const labelBX = circleBX;
    const labelBY = 15;
    svg += `<text x="${labelBX}" y="${labelBY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" `;
    svg += `fill="${stroke}">`;
    svg += `${labelB}`;
    svg += `</text>`;

    // Value: Only A (left circle, non-overlapping region)
    const valueAX = circleAX - 20;
    const valueAY = centerY;
    svg += `<text x="${valueAX}" y="${valueAY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize + 2}" font-weight="bold" `;
    svg += `fill="${stroke}">`;
    svg += `${onlyA}`;
    svg += `</text>`;

    // Value: Intersection (center, overlapping region)
    const valueIntersectionX = (circleAX + circleBX) / 2;
    const valueIntersectionY = centerY;
    svg += `<text x="${valueIntersectionX}" y="${valueIntersectionY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize + 2}" font-weight="bold" `;
    svg += `fill="${stroke}">`;
    svg += `${intersection}`;
    svg += `</text>`;

    // Value: Only B (right circle, non-overlapping region)
    const valueBX = circleBX + 20;
    const valueBY = centerY;
    svg += `<text x="${valueBX}" y="${valueBY}" `;
    svg += `text-anchor="middle" dominant-baseline="middle" `;
    svg += `font-family="${fontFamily}" font-size="${fontSize + 2}" font-weight="bold" `;
    svg += `fill="${stroke}">`;
    svg += `${onlyB}`;
    svg += `</text>`;

    return svg;
  },
};
