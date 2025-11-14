import type { ShapeDefinition } from '../../types.js';

interface SegmentedCycleData {
  items: string[];
  showPercentages?: boolean;
}

/**
 * SegmentedCycle Shape
 * Pie chart segments in circular arrangement
 * Shows how items make up parts of a whole cycle or process
 */
export const segmentedCycleShape: ShapeDefinition = {
  id: 'segmentedCycle',

  bounds(ctx) {
    const data = ctx.node.data as SegmentedCycleData | undefined;
    if (!data || !data.items || data.items.length === 0) {
      return { width: 400, height: 400 };
    }

    // Fixed circular size
    return { width: 450, height: 450 };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return [
      { x: bounds.width / 2, y: 0, name: 'top' },
      { x: bounds.width, y: bounds.height / 2, name: 'right' },
      { x: bounds.width / 2, y: bounds.height, name: 'bottom' },
      { x: 0, y: bounds.height / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const items = (ctx.node.data?.items as string[]) || [];
    const showPercentages = (ctx.node.data?.showPercentages as boolean) ?? true;

    if (items.length === 0) {
      return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" 
                    fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
              <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
                    text-anchor="middle" dominant-baseline="middle" 
                    fill="#999" font-family="sans-serif" font-size="14">
                No items
              </text>`;
    }

    const centerX = x + bounds.width / 2;
    const centerY = y + bounds.height / 2;
    const radius = 150;
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 13;
    const font = ctx.style.font || 'sans-serif';

    // Color palette for segments
    const colors = [
      '#5B9BD5', // Blue
      '#70AD47', // Green
      '#FFC000', // Gold
      '#C55A11', // Orange
      '#7030A0', // Purple
      '#44546A', // Dark blue
    ];

    const itemCount = items.length;
    const anglePerItem = (2 * Math.PI) / itemCount;
    const percentage = 100 / itemCount;

    let svg = '';

    /**
     * Generate SVG path for pie slice
     */
    const createPieSlice = (
      cx: number,
      cy: number,
      r: number,
      startAngle: number,
      endAngle: number
    ): string => {
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

      return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    // Draw segments
    for (let i = 0; i < itemCount; i++) {
      const startAngle = i * anglePerItem - Math.PI / 2;
      const endAngle = (i + 1) * anglePerItem - Math.PI / 2;
      const midAngle = (startAngle + endAngle) / 2;

      const segmentColor = colors[i % colors.length];
      const path = createPieSlice(
        centerX,
        centerY,
        radius,
        startAngle,
        endAngle
      );

      // Draw segment
      svg += `
        <path d="${path}"
              fill="${segmentColor}" 
              stroke="#FFFFFF" 
              stroke-width="${strokeWidth + 1}" />
      `;

      // Calculate label position (on the segment)
      const labelRadius = radius * 0.65;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;

      // Draw label
      svg += `
        <text x="${labelX}" y="${labelY}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize}" 
              font-weight="bold" fill="#FFFFFF">
          ${items[i]}
        </text>
      `;

      // Draw percentage if enabled
      if (showPercentages) {
        svg += `
          <text x="${labelX}" y="${labelY + fontSize + 4}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize - 2}" 
                fill="#FFFFFF">
            ${percentage.toFixed(1)}%
          </text>
        `;
      }
    }

    // Draw center circle (optional, for donut effect)
    const centerCircleRadius = radius * 0.25;
    svg += `
      <circle cx="${centerX}" cy="${centerY}" r="${centerCircleRadius}"
              fill="#FFFFFF" stroke="#CCCCCC" stroke-width="${strokeWidth}" />
    `;

    return svg;
  },
};
