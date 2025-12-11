import type { ShapeDefinition } from '../../types/index.js';
import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';

interface DetailedProcessStep {
  main: string;
  substeps: string[];
}

interface DetailedProcessData {
  items: DetailedProcessStep[];
  direction?: 'LR' | 'TB';
}

/**
 * DetailedProcess Shape
 * Displays main process steps with substeps beneath each
 * Each main step has multiple substeps shown as smaller boxes below
 */
export const detailedProcessShape: ShapeDefinition = {
  id: 'detailedProcess',

  bounds(ctx) {
    const data = ctx.node.data as DetailedProcessData | undefined;
    if (!data || !data.items || data.items.length === 0) {
      return { width: 400, height: 300 };
    }

    const items = data.items;
    const direction = data.direction || 'LR';

    const mainWidth = 140;
    const mainHeight = 60;
    const substepWidth = 100;
    const substepHeight = 40;
    const horizontalSpacing = 60;
    const verticalSpacing = 20;

    // Find max substeps for any step
    const maxSubsteps = Math.max(...items.map((item) => item.substeps.length));

    if (direction === 'LR') {
      const totalWidth =
        items.length * mainWidth + (items.length - 1) * horizontalSpacing;
      const totalHeight =
        mainHeight + verticalSpacing + maxSubsteps * (substepHeight + 10);
      return { width: totalWidth, height: totalHeight };
    } else {
      const totalWidth =
        mainWidth + horizontalSpacing + substepWidth * Math.max(1, maxSubsteps);
      const totalHeight =
        items.length * mainHeight + (items.length - 1) * verticalSpacing;
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

    const items = (ctx.node.data?.items as DetailedProcessStep[]) || [];
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

    const mainWidth = 140;
    const mainHeight = 60;
    const substepWidth = 100;
    const substepHeight = 40;
    const horizontalSpacing = 60;
    const verticalSpacing = 20;

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const mainStroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const substepFill = theme.colors[4] || '#A5C8ED'; // Use 5th theme color for substeps
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';

    let svg = '';

    if (direction === 'LR') {
      // Horizontal layout
      for (let i = 0; i < items.length; i++) {
        const mainX = x + i * (mainWidth + horizontalSpacing);
        const mainY = y;

        // Use theme color for each main step
        const mainFill = ctx.style.fill || getThemeColor(theme, i);

        // Draw main step box
        svg += `
          <rect x="${mainX}" y="${mainY}" 
                width="${mainWidth}" height="${mainHeight}"
                rx="6" ry="6"
                fill="${mainFill}" stroke="${mainStroke}" stroke-width="${strokeWidth}" />
          
          <text x="${mainX + mainWidth / 2}" y="${mainY + mainHeight / 2}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize}" 
                font-weight="bold" fill="#FFFFFF">
            ${items[i].main}
          </text>
        `;

        // Draw substeps below main step
        const substepStartY = mainY + mainHeight + verticalSpacing;
        for (let j = 0; j < items[i].substeps.length; j++) {
          const substepX = mainX + (mainWidth - substepWidth) / 2; // Center below main step
          const substepY = substepStartY + j * (substepHeight + 10);

          svg += `
            <rect x="${substepX}" y="${substepY}" 
                  width="${substepWidth}" height="${substepHeight}"
                  rx="4" ry="4"
                  fill="${substepFill}" stroke="${mainStroke}" stroke-width="${strokeWidth - 0.5}" />
            
            <text x="${substepX + substepWidth / 2}" y="${substepY + substepHeight / 2}" 
                  text-anchor="middle" dominant-baseline="middle"
                  font-family="${font}" font-size="${fontSize - 2}" 
                  fill="#333">
              ${items[i].substeps[j]}
            </text>
          `;

          // Draw line from main step to first substep
          if (j === 0) {
            const lineStartX = mainX + mainWidth / 2;
            const lineStartY = mainY + mainHeight;
            const lineEndX = substepX + substepWidth / 2;
            const lineEndY = substepY;

            svg += `
              <line x1="${lineStartX}" y1="${lineStartY}" 
                    x2="${lineEndX}" y2="${lineEndY}"
                    stroke="${mainStroke}" stroke-width="${strokeWidth - 0.5}" 
                    stroke-dasharray="4,2" />
            `;
          }
        }

        // Draw arrow to next main step (if not last)
        if (i < items.length - 1) {
          const arrowStartX = mainX + mainWidth;
          const arrowStartY = mainY + mainHeight / 2;
          const arrowEndX = mainX + mainWidth + horizontalSpacing;
          const arrowEndY = mainY + mainHeight / 2;

          svg += `
            <defs>
              <marker id="arrowhead-detailed-${i}" markerWidth="10" markerHeight="10" 
                      refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="${mainStroke}" />
              </marker>
            </defs>
            
            <line x1="${arrowStartX}" y1="${arrowStartY}" 
                  x2="${arrowEndX}" y2="${arrowEndY}"
                  stroke="${mainStroke}" stroke-width="${strokeWidth}"
                  marker-end="url(#arrowhead-detailed-${i})" />
          `;
        }
      }
    } else {
      // Vertical layout (TB)
      for (let i = 0; i < items.length; i++) {
        const mainX = x;
        const mainY = y + i * (mainHeight + verticalSpacing * 3);

        // Use theme color for each main step
        const mainFill = ctx.style.fill || getThemeColor(theme, i);

        // Draw main step box
        svg += `
          <rect x="${mainX}" y="${mainY}" 
                width="${mainWidth}" height="${mainHeight}"
                rx="6" ry="6"
                fill="${mainFill}" stroke="${mainStroke}" stroke-width="${strokeWidth}" />
          
          <text x="${mainX + mainWidth / 2}" y="${mainY + mainHeight / 2}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize}" 
                font-weight="bold" fill="#FFFFFF">
            ${items[i].main}
          </text>
        `;

        // Draw substeps to the right of main step
        const substepStartX = mainX + mainWidth + horizontalSpacing;
        for (let j = 0; j < items[i].substeps.length; j++) {
          const substepX = substepStartX;
          const substepY = mainY + (mainHeight - substepHeight) / 2;

          svg += `
            <rect x="${substepX + j * (substepWidth + 10)}" y="${substepY}" 
                  width="${substepWidth}" height="${substepHeight}"
                  rx="4" ry="4"
                  fill="${substepFill}" stroke="${mainStroke}" stroke-width="${strokeWidth - 0.5}" />
            
            <text x="${substepX + j * (substepWidth + 10) + substepWidth / 2}" y="${substepY + substepHeight / 2}" 
                  text-anchor="middle" dominant-baseline="middle"
                  font-family="${font}" font-size="${fontSize - 2}" 
                  fill="#333">
              ${items[i].substeps[j]}
            </text>
          `;

          // Draw line from main step to first substep
          if (j === 0) {
            const lineStartX = mainX + mainWidth;
            const lineStartY = mainY + mainHeight / 2;
            const lineEndX = substepX;
            const lineEndY = substepY + substepHeight / 2;

            svg += `
              <line x1="${lineStartX}" y1="${lineStartY}" 
                    x2="${lineEndX}" y2="${lineEndY}"
                    stroke="${mainStroke}" stroke-width="${strokeWidth - 0.5}" 
                    stroke-dasharray="4,2" />
            `;
          }
        }

        // Draw arrow to next main step (if not last)
        if (i < items.length - 1) {
          const arrowStartX = mainX + mainWidth / 2;
          const arrowStartY = mainY + mainHeight;
          const arrowEndX = mainX + mainWidth / 2;
          const arrowEndY = mainY + mainHeight + verticalSpacing * 3;

          svg += `
            <defs>
              <marker id="arrowhead-detailed-${i}" markerWidth="10" markerHeight="10" 
                      refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="${mainStroke}" />
              </marker>
            </defs>
            
            <line x1="${arrowStartX}" y1="${arrowStartY}" 
                  x2="${arrowEndX}" y2="${arrowEndY}"
                  stroke="${mainStroke}" stroke-width="${strokeWidth}"
                  marker-end="url(#arrowhead-detailed-${i})" />
          `;
        }
      }
    }

    return svg;
  },
};
