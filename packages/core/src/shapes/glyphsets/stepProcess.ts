import type { ShapeDefinition } from '../../types/index.js';
import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';

/**
 * Step Process Shape - Staircase pattern
 * Steps arranged diagonally showing upward or downward progression.
 */
export const stepProcessShape: ShapeDefinition = {
  id: 'stepProcess',

  bounds(ctx) {
    const items = (ctx.node.data?.items as string[]) || [];

    if (items.length === 0) {
      return { width: 400, height: 300 };
    }

    const stepWidth = 140;
    const stepHeight = 60;
    const horizontalOffset = 100; // Increased for better separation
    const verticalOffset = 70; // Vertical spacing between steps

    const totalWidth = stepWidth + horizontalOffset * (items.length - 1);
    const totalHeight = stepHeight + verticalOffset * (items.length - 1);

    return {
      width: totalWidth,
      height: totalHeight,
    };
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
    const direction = (ctx.node.data?.direction as string) || 'up';

    if (items.length === 0) {
      return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" 
                    fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
              <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
                    text-anchor="middle" dominant-baseline="middle" 
                    fill="#999" font-family="sans-serif" font-size="14">
                No items
              </text>`;
    }

    const stepWidth = 140;
    const stepHeight = 60;
    const horizontalOffset = 100; // Match bounds
    const verticalOffset = 70; // Match bounds

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const stroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';

    let svg = '';

    // Render each step
    for (let i = 0; i < items.length; i++) {
      // Calculate step position based on direction
      const stepX = x + i * horizontalOffset;
      const stepY =
        direction === 'up'
          ? y + bounds.height - stepHeight - i * verticalOffset
          : y + i * verticalOffset;

      // Use theme color for each step
      const stepFill = ctx.style.fill || getThemeColor(theme, i);

      // Create gradient effect for depth
      const opacity = 0.7 + (i / items.length) * 0.3; // Darker as you progress

      svg += `
        <rect x="${stepX}" y="${stepY}" 
              width="${stepWidth}" height="${stepHeight}"
              rx="6" ry="6"
              fill="${stepFill}" fill-opacity="${opacity}"
              stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <text x="${stepX + stepWidth / 2}" y="${stepY + stepHeight / 2}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize}" 
              font-weight="600" fill="#FFFFFF">
          ${items[i]}
        </text>
      `;

      // Draw connecting arrow to next step (if not last)
      if (i < items.length - 1) {
        const nextStepX = stepX + horizontalOffset;
        const nextStepY =
          direction === 'up' ? stepY - verticalOffset : stepY + verticalOffset;

        // Right-angle arrows with elbow connectors
        if (direction === 'up') {
          // Arrow: top-center -> straight up to next box midpoint -> right angle to left side
          const startX = stepX + stepWidth / 2; // Top center
          const startY = stepY; // Top edge
          const endX = nextStepX; // Left edge of next box
          const endY = nextStepY + stepHeight / 2; // Middle of left edge

          // Go straight up until we reach the midpoint height of the next box
          const cornerY = endY; // Align with midpoint of next box
          const cornerX = startX; // Stay vertically aligned with start

          svg += `
            <defs>
              <marker id="arrowhead-step-${i}" markerWidth="10" markerHeight="10" 
                      refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="${stroke}" />
              </marker>
            </defs>
            
            <path d="M ${startX} ${startY} L ${cornerX} ${cornerY} L ${endX} ${endY}"
                  stroke="${stroke}" stroke-width="${strokeWidth}" fill="none"
                  marker-end="url(#arrowhead-step-${i})" />
          `;
        } else {
          // Down direction: bottom-center -> straight down to next box midpoint -> right angle to left side
          const startX = stepX + stepWidth / 2;
          const startY = stepY + stepHeight; // Bottom edge
          const endX = nextStepX;
          const endY = nextStepY + stepHeight / 2;

          // Go straight down until we reach the midpoint height of the next box
          const cornerY = endY; // Align with midpoint of next box
          const cornerX = startX; // Stay vertically aligned with start

          svg += `
            <defs>
              <marker id="arrowhead-step-${i}" markerWidth="10" markerHeight="10" 
                      refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="${stroke}" />
              </marker>
            </defs>
            
            <path d="M ${startX} ${startY} L ${cornerX} ${cornerY} L ${endX} ${endY}"
                  stroke="${stroke}" stroke-width="${strokeWidth}" fill="none"
                  marker-end="url(#arrowhead-step-${i})" />
          `;
        }
      }
    }

    return svg;
  },
};
