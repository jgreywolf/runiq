import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

interface GearCycleData {
  items: string[];
  theme?: string;
}

/**
 * GearCycle Shape
 * Interlocking gears showing interconnected processes
 * Each gear represents a process step that depends on others
 */
export const gearCycleShape: ShapeDefinition = {
  id: 'gearCycle',

  bounds(ctx) {
    const data = ctx.node.data as GearCycleData | undefined;
    if (!data || !data.items || data.items.length === 0) {
      return { width: 400, height: 400 };
    }

    const items = data.items;
    const itemCount = items.length;

    // Size based on number of gears (all in horizontal line)
    const gearRadius = 60;
    const spacing = gearRadius * 1.85;
    const totalWidth = (itemCount - 1) * spacing + gearRadius * 2;
    const totalHeight = gearRadius * 2.5;

    return { width: totalWidth, height: totalHeight };
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

    // Get theme colors
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const fill = ctx.style.fill || theme.colors[0];
    const stroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 12;
    const font = ctx.style.font || 'sans-serif';

    const gearRadius = 60;
    const teethCount = 12;
    const toothDepth = 8;

    let svg = '';

    /**
     * Generate gear path with teeth
     * rotationOffset allows gears to mesh by offsetting the starting angle
     */
    const generateGearPath = (
      cx: number,
      cy: number,
      radius: number,
      rotationOffset = 0
    ): string => {
      const innerRadius = radius - toothDepth;
      const angleStep = (2 * Math.PI) / teethCount;

      let path = '';
      for (let i = 0; i < teethCount; i++) {
        const angle1 = i * angleStep + rotationOffset;
        const angle2 = angle1 + angleStep * 0.4;
        const angle3 = angle1 + angleStep * 0.6;

        const outerX1 = cx + Math.cos(angle1) * radius;
        const outerY1 = cy + Math.sin(angle1) * radius;
        const outerX2 = cx + Math.cos(angle2) * radius;
        const outerY2 = cy + Math.sin(angle2) * radius;
        const innerX1 = cx + Math.cos(angle2) * innerRadius;
        const innerY1 = cy + Math.sin(angle2) * innerRadius;
        const innerX2 = cx + Math.cos(angle3) * innerRadius;
        const innerY2 = cy + Math.sin(angle3) * innerRadius;
        const outerX3 = cx + Math.cos(angle3) * radius;
        const outerY3 = cy + Math.sin(angle3) * radius;

        if (i === 0) {
          path += `M ${outerX1} ${outerY1} `;
        }
        path += `L ${outerX2} ${outerY2} L ${innerX1} ${innerY1} L ${innerX2} ${innerY2} L ${outerX3} ${outerY3} `;
      }
      path += 'Z';
      return path;
    };

    // Arrange gears based on count
    const itemCount = items.length;
    const centerX = x + bounds.width / 2;
    const centerY = y + bounds.height / 2;

    // All gears in horizontal line with alternating heights (like -_-_)
    const spacing = gearRadius * 1.85;
    const totalWidth = (itemCount - 1) * spacing;
    const startX = centerX - totalWidth / 2;
    const toothAngle = (2 * Math.PI) / teethCount;
    const verticalOffset = gearRadius * 0.4; // Height difference for alternating gears

    // Draw gears and flow arrows
    for (let i = 0; i < itemCount; i++) {
      const gearX = startX + i * spacing;
      // Alternate heights: even gears lower, odd gears higher
      const gearY =
        i % 2 === 0 ? centerY + verticalOffset : centerY - verticalOffset;
      // Alternate rotation to mesh: even gears aligned, odd gears offset
      const rotation = i % 2 === 0 ? 0 : toothAngle / 2;
      const gearFill = getThemeColor(theme, i);

      // Draw gear
      svg += `
        <g>
          <path d="${generateGearPath(gearX, gearY, gearRadius, rotation)}"
                fill="${gearFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
          
          <circle cx="${gearX}" cy="${gearY}" r="${gearRadius * 0.3}"
                  fill="#FFFFFF" stroke="${stroke}" stroke-width="${strokeWidth}" />
          
          <text x="${gearX}" y="${gearY}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize}" 
                fill="#333">
            ${items[i]}
          </text>
        </g>
      `;

      // Draw rotation arrow on gear (except last one)
      if (i < itemCount - 1) {
        // Arrow shows rotation direction: even gears rotate clockwise, odd counter-clockwise
        const isClockwise = i % 2 === 0;
        const arrowRadius = gearRadius * 0.65;
        const arrowStartAngle = isClockwise ? -Math.PI / 4 : Math.PI / 4;
        const arrowEndAngle = isClockwise ? Math.PI / 4 : -Math.PI / 4;

        const arrowStartX = gearX + Math.cos(arrowStartAngle) * arrowRadius;
        const arrowStartY = gearY + Math.sin(arrowStartAngle) * arrowRadius;
        const arrowEndX = gearX + Math.cos(arrowEndAngle) * arrowRadius;
        const arrowEndY = gearY + Math.sin(arrowEndAngle) * arrowRadius;

        // Curved arrow path
        const sweepFlag = isClockwise ? 1 : 0;
        svg += `
          <defs>
            <marker id="gear-arrow-${i}" markerWidth="8" markerHeight="8" 
                    refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L8,3 z" fill="#333" />
            </marker>
          </defs>
          <path d="M ${arrowStartX} ${arrowStartY} A ${arrowRadius} ${arrowRadius} 0 0 ${sweepFlag} ${arrowEndX} ${arrowEndY}"
                fill="none" stroke="#333" stroke-width="2" 
                marker-end="url(#gear-arrow-${i})" 
                opacity="0.6" />
        `;
      }
    }

    return svg;
  },
};
