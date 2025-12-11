import type { ShapeDefinition } from '../../types/index.js';
import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';

interface BlockCycleData {
  items: string[];
  theme?: string;
}

/**
 * BlockCycle Shape
 * Rectangular blocks arranged in a circle
 * Shows cyclical process with clear sequential steps
 */
export const blockCycleShape: ShapeDefinition = {
  id: 'blockCycle',

  bounds(ctx) {
    const data = ctx.node.data as BlockCycleData | undefined;
    if (!data || !data.items || data.items.length === 0) {
      return { width: 400, height: 400 };
    }

    const items = data.items;
    const itemCount = items.length;

    // Size based on number of blocks
    const blockWidth = 100;
    const blockHeight = 60;
    const radius = (itemCount * blockWidth) / (2 * Math.PI) + 50;
    const size = radius * 2 + blockHeight * 2;

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
    const blockWidth = 100;
    const blockHeight = 60;
    const itemCount = items.length;
    const radius = (itemCount * blockWidth) / (2 * Math.PI) + 50;

    // Get theme colors
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const fill = ctx.style.fill || theme.colors[0];
    const stroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 13;
    const font = ctx.style.font || 'sans-serif';

    let svg = '';

    // Draw circular guideline (optional, subtle)
    svg += `
      <circle cx="${centerX}" cy="${centerY}" r="${radius}"
              fill="none" stroke="#E0E0E0" stroke-width="1" stroke-dasharray="5,3" />
    `;

    // Draw blocks around the circle
    for (let i = 0; i < itemCount; i++) {
      const angle = (i * 2 * Math.PI) / itemCount - Math.PI / 2;
      const nextAngle = ((i + 1) * 2 * Math.PI) / itemCount - Math.PI / 2;

      // Block position
      const blockX = centerX + Math.cos(angle) * radius - blockWidth / 2;
      const blockY = centerY + Math.sin(angle) * radius - blockHeight / 2;
      const blockCenterX = blockX + blockWidth / 2;
      const blockCenterY = blockY + blockHeight / 2;

      // Next block position for arrow
      const nextBlockCenterX = centerX + Math.cos(nextAngle) * radius;
      const nextBlockCenterY = centerY + Math.sin(nextAngle) * radius;

      const blockColor = getThemeColor(theme, i);

      // Draw block
      svg += `
        <rect x="${blockX}" y="${blockY}" 
              width="${blockWidth}" height="${blockHeight}"
              rx="6" ry="6"
              fill="${blockColor}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <text x="${blockCenterX}" y="${blockCenterY}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize}" 
              font-weight="bold" fill="#FFFFFF">
          ${items[i]}
        </text>
      `;

      // Draw arrow to next block (curved along circle)
      const arrowStartX = blockCenterX + Math.cos(angle) * (blockWidth / 2);
      const arrowStartY = blockCenterY + Math.sin(angle) * (blockHeight / 2);
      const arrowEndX =
        nextBlockCenterX - Math.cos(nextAngle) * (blockWidth / 2);
      const arrowEndY =
        nextBlockCenterY - Math.sin(nextAngle) * (blockHeight / 2);

      // Control point for curved arrow (on circle)
      const midAngle = (angle + nextAngle) / 2;
      const controlX = centerX + Math.cos(midAngle) * (radius + 20);
      const controlY = centerY + Math.sin(midAngle) * (radius + 20);

      svg += `
        <path d="M ${arrowStartX} ${arrowStartY} Q ${controlX} ${controlY} ${arrowEndX} ${arrowEndY}"
              fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" 
              marker-end="url(#arrowhead-${i})" />
        
        <defs>
          <marker id="arrowhead-${i}" markerWidth="10" markerHeight="10" 
                  refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="${stroke}" />
          </marker>
        </defs>
      `;
    }

    return svg;
  },
};
