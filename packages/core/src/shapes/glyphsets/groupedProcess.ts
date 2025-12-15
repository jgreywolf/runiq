import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';
import { createStandardAnchors } from './utils.js';

interface GroupedProcessData {
  groups: Array<{ name: string; items: string[] }>;
  mergePoint?: string;
}

/**
 * GroupedProcess Shape
 * Displays parallel process streams that converge to a merge point
 * Multiple groups run in parallel then combine into single output
 */
export const groupedProcessShape: ShapeDefinition = {
  id: 'groupedProcess',

  bounds(ctx) {
    const data = ctx.node.data as GroupedProcessData | undefined;
    if (!data || !data.groups || data.groups.length === 0) {
      return { width: 400, height: 300 };
    }

    const groups = data.groups;
    const itemWidth = 120;
    const itemHeight = 50;
    const horizontalSpacing = 40;
    const groupSpacing = 30;
    const mergeWidth = 140;

    // Find max items in any group
    const maxItems = Math.max(...groups.map((g) => g.items.length));

    const totalWidth =
      maxItems * itemWidth +
      (maxItems - 1) * horizontalSpacing +
      100 +
      mergeWidth;
    const totalHeight =
      groups.length * itemHeight + (groups.length - 1) * groupSpacing + 60;

    return { width: totalWidth, height: totalHeight };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors(bounds);
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const groups =
      (ctx.node.data?.groups as Array<{ name: string; items: string[] }>) || [];
    const mergePoint = (ctx.node.data?.mergePoint as string) || 'Result';

    if (groups.length === 0) {
      const noItemsStyle = { fontSize: 14, color: '#999' };
      return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" 
                    fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
              ${renderShapeLabel({ ...ctx, style: noItemsStyle }, 'No items', x + bounds.width / 2, y + bounds.height / 2)}`;
    }

    const itemWidth = 120;
    const itemHeight = 50;
    const horizontalSpacing = 40;
    const groupSpacing = 30;
    const mergeWidth = 140;
    const mergeHeight = 70;

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const stroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 13;
    const font = ctx.style.font || 'sans-serif';
    const mergeFill = theme.colors[2] || '#70AD47'; // Use 3rd theme color for merge point

    // Find max items to calculate merge point position
    const maxItems = Math.max(...groups.map((g) => g.items.length));
    const mergeX =
      x + maxItems * itemWidth + (maxItems - 1) * horizontalSpacing + 100;
    const mergeY = y + (bounds.height - mergeHeight) / 2;

    let svg = '';

    // Draw each group (parallel streams)
    for (let groupIdx = 0; groupIdx < groups.length; groupIdx++) {
      const group = groups[groupIdx];
      const groupY = y + 30 + groupIdx * (itemHeight + groupSpacing);

      // Use theme color for this group
      const groupFill = ctx.style.fill || getThemeColor(theme, groupIdx);

      // Draw group label
      const groupLabelStyle = { fontSize, fontWeight: 'bold', color: stroke };
      svg += renderShapeLabel(
        { ...ctx, style: groupLabelStyle },
        group.name,
        x,
        groupY - 8,
        'start'
      );

      // Draw items in this group
      for (let itemIdx = 0; itemIdx < group.items.length; itemIdx++) {
        const itemX = x + itemIdx * (itemWidth + horizontalSpacing);

        const itemStyle = { fontSize: fontSize - 1, color: '#FFFFFF' };
        svg += `
          <rect x="${itemX}" y="${groupY}" 
                width="${itemWidth}" height="${itemHeight}"
                rx="4" ry="4"
                fill="${groupFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
          
          ${renderShapeLabel({ ...ctx, style: itemStyle }, group.items[itemIdx], itemX + itemWidth / 2, groupY + itemHeight / 2)}
        `;

        // Draw arrow to next item in group
        if (itemIdx < group.items.length - 1) {
          const arrowStartX = itemX + itemWidth;
          const arrowStartY = groupY + itemHeight / 2;
          const arrowEndX = itemX + itemWidth + horizontalSpacing;
          const arrowEndY = groupY + itemHeight / 2;

          svg += `
            <defs>
              <marker id="arrowhead-group-${groupIdx}-${itemIdx}" markerWidth="8" markerHeight="8" 
                      refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="${stroke}" />
              </marker>
            </defs>
            
            <line x1="${arrowStartX}" y1="${arrowStartY}" 
                  x2="${arrowEndX}" y2="${arrowEndY}"
                  stroke="${stroke}" stroke-width="${strokeWidth - 0.5}"
                  marker-end="url(#arrowhead-group-${groupIdx}-${itemIdx})" />
          `;
        }

        // Draw arrow from last item in group to merge point
        if (itemIdx === group.items.length - 1) {
          const arrowStartX = itemX + itemWidth;
          const arrowStartY = groupY + itemHeight / 2;
          const arrowEndX = mergeX;
          const arrowEndY = mergeY + mergeHeight / 2;

          svg += `
            <defs>
              <marker id="arrowhead-merge-${groupIdx}" markerWidth="8" markerHeight="8" 
                      refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="${stroke}" />
              </marker>
            </defs>
            
            <line x1="${arrowStartX}" y1="${arrowStartY}" 
                  x2="${arrowEndX}" y2="${arrowEndY}"
                  stroke="${stroke}" stroke-width="${strokeWidth}"
                  marker-end="url(#arrowhead-merge-${groupIdx})" />
          `;
        }
      }
    }

    // Draw merge point (converging box)
    const mergeStyle = { fontSize, fontWeight: 'bold', color: '#FFFFFF' };
    svg += `
      <rect x="${mergeX}" y="${mergeY}" 
            width="${mergeWidth}" height="${mergeHeight}"
            rx="6" ry="6"
            fill="${mergeFill}" stroke="${stroke}" stroke-width="${strokeWidth + 0.5}" />
      
      ${renderShapeLabel({ ...ctx, style: mergeStyle }, mergePoint, mergeX + mergeWidth / 2, mergeY + mergeHeight / 2)}
    `;

    return svg;
  },
};
