import type { ShapeDefinition } from '../../types.js';

interface RadialCycleData {
  items: string[];
  centerLabel?: string;
}

/**
 * RadialCycle Shape
 * Center hub with spokes radiating outward to items
 * Shows relationship between central concept and related items
 */
export const radialCycleShape: ShapeDefinition = {
  id: 'radialCycle',

  bounds(ctx) {
    const data = ctx.node.data as RadialCycleData | undefined;
    if (!data || !data.items || data.items.length === 0) {
      return { width: 400, height: 400 };
    }

    const items = data.items;
    const itemCount = items.length;

    // Size based on number of items
    const radius = 150 + itemCount * 10;
    const size = radius * 2 + 100; // Extra padding for item boxes

    return { width: size, height: size };
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
    const centerLabel = (ctx.node.data?.centerLabel as string) || 'Center';

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
    const centerRadius = 50;
    const itemRadius = bounds.width / 2 - 80;
    const itemWidth = 100;
    const itemHeight = 60;

    const fill = ctx.style.fill || '#5B9BD5';
    const stroke = ctx.style.stroke || '#2E5AAC';
    const centerFill = '#70AD47'; // Green for center
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 13;
    const font = ctx.style.font || 'sans-serif';

    let svg = '';

    // Draw spokes first (behind items)
    for (let i = 0; i < items.length; i++) {
      const angle = (i * 2 * Math.PI) / items.length - Math.PI / 2;
      const itemX = centerX + Math.cos(angle) * itemRadius;
      const itemY = centerY + Math.sin(angle) * itemRadius;

      // Spoke from center to item
      svg += `
        <line x1="${centerX}" y1="${centerY}" 
              x2="${itemX}" y2="${itemY}"
              stroke="${stroke}" stroke-width="${strokeWidth}" 
              stroke-dasharray="5,3" />
      `;
    }

    // Draw center hub
    svg += `
      <circle cx="${centerX}" cy="${centerY}" r="${centerRadius}"
              fill="${centerFill}" stroke="${stroke}" stroke-width="${strokeWidth + 1}" />
      
      <text x="${centerX}" y="${centerY}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize}" 
            font-weight="bold" fill="#FFFFFF">
        ${centerLabel}
      </text>
    `;

    // Draw items around the circle
    for (let i = 0; i < items.length; i++) {
      const angle = (i * 2 * Math.PI) / items.length - Math.PI / 2;
      const itemX = centerX + Math.cos(angle) * itemRadius - itemWidth / 2;
      const itemY = centerY + Math.sin(angle) * itemRadius - itemHeight / 2;

      svg += `
        <rect x="${itemX}" y="${itemY}" 
              width="${itemWidth}" height="${itemHeight}"
              rx="6" ry="6"
              fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <text x="${itemX + itemWidth / 2}" y="${itemY + itemHeight / 2}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize - 1}" 
              fill="#FFFFFF">
          ${items[i]}
        </text>
      `;
    }

    return svg;
  },
};
