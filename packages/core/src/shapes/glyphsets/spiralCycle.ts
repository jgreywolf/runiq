import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';
import { createStandardAnchors } from './utils.js';

interface SpiralCycleData {
  items: string[];
  theme?: string;
}

/**
 * SpiralCycle Shape
 * Spiral progression showing growth, evolution, or iterative improvement
 * Items arranged along an expanding spiral path
 */
export const spiralCycleShape: ShapeDefinition = {
  id: 'spiralCycle',

  bounds(ctx) {
    const data = ctx.node.data as SpiralCycleData | undefined;
    if (!data || !data.items || data.items.length === 0) {
      return { width: 400, height: 400 };
    }

    const items = data.items;
    const itemCount = items.length;

    // Size based on number of items and spiral expansion
    const size = 400 + itemCount * 20;
    return { width: size, height: size };
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
    const itemCount = items.length;

    // Get theme colors
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: theme.colors[0],
      defaultStroke: theme.accentColor || '#2E5AAC',
      defaultStrokeWidth: 2,
    });
    const fontSize = ctx.style.fontSize || 12;
    const font = ctx.style.font || 'sans-serif';

    // Spiral parameters
    const startRadius = 30;
    const radiusIncrement = 40;
    const turnsPerItem = 0.75; // 3/4 turn per item
    const boxWidth = 90;
    const boxHeight = 50;

    let svg = '';

    // Draw spiral path
    let spiralPath = '';
    const pathPoints = 100;
    for (let i = 0; i <= pathPoints; i++) {
      const t = i / pathPoints;
      const angle = t * itemCount * turnsPerItem * 2 * Math.PI;
      const radius = startRadius + t * itemCount * radiusIncrement;
      const px = centerX + Math.cos(angle) * radius;
      const py = centerY + Math.sin(angle) * radius;

      if (i === 0) {
        spiralPath += `M ${px} ${py} `;
      } else {
        spiralPath += `L ${px} ${py} `;
      }
    }

    svg += `
      <path d="${spiralPath}"
            fill="none" stroke="#D0D0D0" stroke-width="2" stroke-dasharray="5,5" />
    `;

    // Draw items along spiral
    for (let i = 0; i < itemCount; i++) {
      const t = i / Math.max(1, itemCount - 1); // Avoid division by zero
      const angle = i * turnsPerItem * 2 * Math.PI; // Each item advances by turnsPerItem
      const radius = startRadius + i * radiusIncrement; // Radius increases linearly

      const itemX = centerX + Math.cos(angle) * radius - boxWidth / 2;
      const itemY = centerY + Math.sin(angle) * radius - boxHeight / 2;

      // Get color from theme (cycles through theme colors)
      const itemColor = getThemeColor(theme, i);

      // Draw box
      svg += `
        <rect x="${itemX}" y="${itemY}" 
              width="${boxWidth}" height="${boxHeight}"
              rx="6" ry="6"
              fill="${itemColor}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <text x="${itemX + boxWidth / 2}" y="${itemY + boxHeight / 2}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize}" 
              font-weight="bold" fill="#FFFFFF">
          ${items[i]}
        </text>
      `;

      // Draw arrow to next item (except last)
      if (i < itemCount - 1) {
        const nextAngle = (i + 1) * turnsPerItem * 2 * Math.PI;
        const nextRadius = startRadius + (i + 1) * radiusIncrement;

        // Build a smooth path following the spiral between items
        let pathD = '';
        const pathSteps = 20; // Number of points along the spiral arc

        for (let step = 0; step <= pathSteps; step++) {
          const t = step / pathSteps;
          const spiralAngle = angle + t * (nextAngle - angle);
          const spiralRadius = radius + t * (nextRadius - radius);
          const px = centerX + Math.cos(spiralAngle) * spiralRadius;
          const py = centerY + Math.sin(spiralAngle) * spiralRadius;

          if (step === 0) {
            pathD = `M ${px} ${py}`;
          } else {
            pathD += ` L ${px} ${py}`;
          }
        }

        svg += `
          <path d="${pathD}"
                fill="none" stroke="${stroke}" stroke-width="2" 
                opacity="0.5"
                marker-end="url(#spiral-arrow-${i})" />
          
          <defs>
            <marker id="spiral-arrow-${i}" markerWidth="10" markerHeight="10" 
                    refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="${stroke}" />
            </marker>
          </defs>
        `;
      }
    }

    // Add center dot to mark spiral origin
    svg += `
      <circle cx="${centerX}" cy="${centerY}" r="5"
              fill="${stroke}" />
    `;

    return svg;
  },
};
