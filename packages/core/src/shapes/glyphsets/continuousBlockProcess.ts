import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';
import { createStandardAnchors } from './utils.js';

/**
 * Continuous Block Process Shape - Connected blocks with arrows
 * Solid blocks with prominent connecting arrows showing continuous flow.
 */
export const continuousBlockProcessShape: ShapeDefinition = {
  id: 'continuousBlockProcess',

  bounds(ctx) {
    const items = (ctx.node.data?.items as string[]) || [];
    const direction = (ctx.node.data?.direction as string) || 'LR';

    if (items.length === 0) {
      return { width: 400, height: 100 };
    }

    const blockWidth = 120;
    const blockHeight = 60;
    const arrowLength = 40; // Length of arrow between blocks

    if (direction === 'LR') {
      const totalWidth =
        items.length * blockWidth + (items.length - 1) * arrowLength;
      return {
        width: totalWidth,
        height: blockHeight,
      };
    } else {
      // TB direction
      const totalHeight =
        items.length * blockHeight + (items.length - 1) * arrowLength;
      return {
        width: blockWidth,
        height: totalHeight,
      };
    }
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors(bounds);
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const items = (ctx.node.data?.items as string[]) || [];
    const direction = (ctx.node.data?.direction as string) || 'LR';

    if (items.length === 0) {
      const noItemsStyle = { fontSize: 14, color: '#999' };
      return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" 
                    fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
              ${renderShapeLabel({ ...ctx, style: noItemsStyle }, 'No items', x + bounds.width / 2, y + bounds.height / 2)}`;
    }

    const blockWidth = 120;
    const blockHeight = 60;
    const arrowLength = 40;

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const stroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';

    let svg = '';

    if (direction === 'LR') {
      let currentX = x;

      for (let i = 0; i < items.length; i++) {
        // Use theme color for each block
        const blockFill = ctx.style.fill || getThemeColor(theme, i);

        // Draw block
        svg += `
          <rect x="${currentX}" y="${y}" 
                width="${blockWidth}" height="${blockHeight}"
                rx="4" ry="4"
                fill="${blockFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        `;

        const blockStyle = { fontSize, fontWeight: '600', color: '#FFFFFF' };
        svg += renderShapeLabel(
          { ...ctx, style: blockStyle },
          items[i],
          currentX + blockWidth / 2,
          y + blockHeight / 2
        );

        // Draw arrow to next block (if not last)
        if (i < items.length - 1) {
          const arrowStartX = currentX + blockWidth;
          const arrowEndX = arrowStartX + arrowLength;
          const arrowY = y + blockHeight / 2;

          svg += `
            <defs>
              <marker id="arrowhead-cont-${i}" markerWidth="10" markerHeight="10" 
                      refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="${stroke}" />
              </marker>
            </defs>
            
            <line x1="${arrowStartX}" y1="${arrowY}" 
                  x2="${arrowEndX}" y2="${arrowY}"
                  stroke="${stroke}" stroke-width="${strokeWidth * 1.5}"
                  marker-end="url(#arrowhead-cont-${i})" />
          `;
        }

        currentX += blockWidth + arrowLength;
      }
    } else {
      // TB direction
      let currentY = y;

      for (let i = 0; i < items.length; i++) {
        // Use theme color for each block
        const blockFill = ctx.style.fill || getThemeColor(theme, i);

        // Draw block
        svg += `
          <rect x="${x}" y="${currentY}" 
                width="${blockWidth}" height="${blockHeight}"
                rx="4" ry="4"
                fill="${blockFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        `;

        const blockStyle = { fontSize, fontWeight: '600', color: '#FFFFFF' };
        svg += renderShapeLabel(
          { ...ctx, style: blockStyle },
          items[i],
          x + blockWidth / 2,
          currentY + blockHeight / 2
        );

        // Draw arrow to next block (if not last)
        if (i < items.length - 1) {
          const arrowStartY = currentY + blockHeight;
          const arrowEndY = arrowStartY + arrowLength;
          const arrowX = x + blockWidth / 2;

          svg += `
            <defs>
              <marker id="arrowhead-cont-tb-${i}" markerWidth="10" markerHeight="10" 
                      refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="${stroke}" />
              </marker>
            </defs>
            
            <line x1="${arrowX}" y1="${arrowStartY}" 
                  x2="${arrowX}" y2="${arrowEndY}"
                  stroke="${stroke}" stroke-width="${strokeWidth * 1.5}"
                  marker-end="url(#arrowhead-cont-tb-${i})" />
          `;
        }

        currentY += blockHeight + arrowLength;
      }
    }

    return svg;
  },
};
