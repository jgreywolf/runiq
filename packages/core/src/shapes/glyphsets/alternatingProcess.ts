import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';
import { createStandardAnchors } from './utils.js';

/**
 * Alternating Process Shape - Zigzag flow pattern
 * Steps alternate left/right creating an S-curve progression.
 */
export const alternatingProcessShape: ShapeDefinition = {
  id: 'alternatingProcess',

  bounds(ctx) {
    const items = (ctx.node.data?.items as string[]) || [];

    if (items.length === 0) {
      return { width: 400, height: 300 };
    }

    const stepWidth = 160;
    const stepHeight = 60;
    const horizontalGap = 100; // Gap between left and right columns
    const verticalSpacing = 40; // Vertical spacing between steps

    const totalWidth = stepWidth * 2 + horizontalGap;
    const totalHeight =
      items.length * stepHeight + (items.length - 1) * verticalSpacing;

    return {
      width: totalWidth,
      height: totalHeight,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors(bounds);
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const items = (ctx.node.data?.items as string[]) || [];

    if (items.length === 0) {
      const noItemsStyle = { fontSize: 14, color: '#999' };
      return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" 
                    fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
              ${renderShapeLabel({ ...ctx, style: noItemsStyle }, 'No items', x + bounds.width / 2, y + bounds.height / 2)}`;
    }

    const stepWidth = 160;
    const stepHeight = 60;
    const horizontalGap = 100;
    const verticalSpacing = 40;

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const stroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';

    let svg = '';
    let currentY = y;

    // Render each step
    for (let i = 0; i < items.length; i++) {
      const isLeft = i % 2 === 0;

      // Calculate step position
      const stepX = isLeft ? x : x + stepWidth + horizontalGap;
      const stepY = currentY;

      // Use theme color for each step
      const stepFill = ctx.style.fill || getThemeColor(theme, i);
      const stepStroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';

      // Draw rounded rectangle for step
      svg += `
        <rect x="${stepX}" y="${stepY}" 
              width="${stepWidth}" height="${stepHeight}"
              rx="8" ry="8"
              fill="${stepFill}" stroke="${stepStroke}" stroke-width="${strokeWidth}" />
      `;

      const stepStyle = { fontSize, fontWeight: '600', color: '#FFFFFF' };
      svg += renderShapeLabel(
        { ...ctx, style: stepStyle },
        items[i],
        stepX + stepWidth / 2,
        stepY + stepHeight / 2
      );

      // Draw connecting arrow to next step (if not last)
      if (i < items.length - 1) {
        const nextIsLeft = (i + 1) % 2 === 0;
        const nextStepX = nextIsLeft ? x : x + stepWidth + horizontalGap;
        const nextStepY = currentY + stepHeight + verticalSpacing;

        // Arrow starts from bottom center of current step
        const startX = stepX + stepWidth / 2;
        const startY = stepY + stepHeight;

        // Arrow ends at top center of next step
        const endX = nextStepX + stepWidth / 2;
        const endY = nextStepY;

        // Draw curved arrow (S-curve)
        const midY = (startY + endY) / 2;

        svg += `
          <defs>
            <marker id="arrowhead-alt-${i}" markerWidth="10" markerHeight="10" 
                    refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="${stroke}" />
            </marker>
          </defs>
          
          <path d="M ${startX} ${startY} 
                   Q ${startX} ${midY}, ${endX} ${midY}
                   Q ${endX} ${midY}, ${endX} ${endY}"
                fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"
                marker-end="url(#arrowhead-alt-${i})" />
        `;
      }

      currentY += stepHeight + verticalSpacing;
    }

    return svg;
  },
};
