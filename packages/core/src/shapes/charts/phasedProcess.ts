import type { ShapeDefinition } from '../../types.js';

interface PhasedProcessData {
  items: string[];
  direction?: 'LR' | 'TB';
}

/**
 * PhasedProcess Shape
 * Displays process phases with milestone markers between them
 * Each phase is a box, with diamond milestone markers in between
 */
export const phasedProcessShape: ShapeDefinition = {
  id: 'phasedProcess',

  bounds(ctx) {
    const data = ctx.node.data as PhasedProcessData | undefined;
    if (!data || !data.items || data.items.length === 0) {
      return { width: 400, height: 300 };
    }

    const items = data.items;
    const direction = data.direction || 'LR';

    const phaseWidth = 120;
    const phaseHeight = 80;
    const milestoneSize = 30; // Diamond size
    const spacing = 40;

    if (direction === 'LR') {
      // Horizontal layout: phase - milestone - phase - milestone - phase
      const totalWidth =
        items.length * phaseWidth +
        (items.length - 1) * (milestoneSize + spacing * 2);
      const totalHeight = phaseHeight;
      return { width: totalWidth, height: totalHeight };
    } else {
      // Vertical layout
      const totalWidth = phaseWidth;
      const totalHeight =
        items.length * phaseHeight +
        (items.length - 1) * (milestoneSize + spacing * 2);
      return { width: totalWidth, height: totalHeight };
    }
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
    const direction = (ctx.node.data?.direction as string) || 'LR';

    if (items.length === 0) {
      return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" 
                    fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
              <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
                    text-anchor="middle" dominant-baseline="middle" 
                    fill="#999" font-family="sans-serif" font-size="14">
                No items
              </text>`;
    }

    const phaseWidth = 120;
    const phaseHeight = 80;
    const milestoneSize = 30;
    const spacing = 40;

    const fill = ctx.style.fill || '#5B9BD5';
    const stroke = ctx.style.stroke || '#2E5AAC';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';
    const milestoneFill = '#FFC000'; // Gold/yellow for milestones

    let svg = '';

    if (direction === 'LR') {
      // Horizontal layout
      let currentX = x;
      const phaseY = y;

      for (let i = 0; i < items.length; i++) {
        // Draw phase box
        svg += `
          <rect x="${currentX}" y="${phaseY}" 
                width="${phaseWidth}" height="${phaseHeight}"
                rx="6" ry="6"
                fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
          
          <text x="${currentX + phaseWidth / 2}" y="${phaseY + phaseHeight / 2}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize}" 
                font-weight="600" fill="#FFFFFF">
            ${items[i]}
          </text>
        `;

        // Draw milestone diamond between phases (if not last)
        if (i < items.length - 1) {
          const milestoneX = currentX + phaseWidth + spacing;
          const milestoneY = phaseY + phaseHeight / 2;

          // Diamond shape: top, right, bottom, left
          const diamondPath = `
            M ${milestoneX} ${milestoneY - milestoneSize / 2}
            L ${milestoneX + milestoneSize / 2} ${milestoneY}
            L ${milestoneX} ${milestoneY + milestoneSize / 2}
            L ${milestoneX - milestoneSize / 2} ${milestoneY}
            Z
          `;

          svg += `
            <path d="${diamondPath}" 
                  fill="${milestoneFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
            
            <text x="${milestoneX}" y="${milestoneY}" 
                  text-anchor="middle" dominant-baseline="middle"
                  font-family="${font}" font-size="${fontSize - 2}" 
                  font-weight="bold" fill="#333">
              ${i + 1}
            </text>
          `;

          currentX = milestoneX + milestoneSize / 2 + spacing;
        }
      }
    } else {
      // Vertical layout (TB)
      let currentY = y;
      const phaseX = x;

      for (let i = 0; i < items.length; i++) {
        // Draw phase box
        svg += `
          <rect x="${phaseX}" y="${currentY}" 
                width="${phaseWidth}" height="${phaseHeight}"
                rx="6" ry="6"
                fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
          
          <text x="${phaseX + phaseWidth / 2}" y="${currentY + phaseHeight / 2}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize}" 
                font-weight="600" fill="#FFFFFF">
            ${items[i]}
          </text>
        `;

        // Draw milestone diamond between phases (if not last)
        if (i < items.length - 1) {
          const milestoneX = phaseX + phaseWidth / 2;
          const milestoneY = currentY + phaseHeight + spacing;

          // Diamond shape
          const diamondPath = `
            M ${milestoneX} ${milestoneY - milestoneSize / 2}
            L ${milestoneX + milestoneSize / 2} ${milestoneY}
            L ${milestoneX} ${milestoneY + milestoneSize / 2}
            L ${milestoneX - milestoneSize / 2} ${milestoneY}
            Z
          `;

          svg += `
            <path d="${diamondPath}" 
                  fill="${milestoneFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
            
            <text x="${milestoneX}" y="${milestoneY}" 
                  text-anchor="middle" dominant-baseline="middle"
                  font-family="${font}" font-size="${fontSize - 2}" 
                  font-weight="bold" fill="#333">
              ${i + 1}
            </text>
          `;

          currentY = milestoneY + milestoneSize / 2 + spacing;
        }
      }
    }

    return svg;
  },
};
