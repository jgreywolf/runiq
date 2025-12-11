import type { ShapeDefinition } from '../../types/index.js';
import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';

interface OrbitCycleData {
  items: string[];
  centerLabel?: string;
  theme?: string;
}

/**
 * OrbitCycle Shape
 * Planetary orbit style with central core and orbiting items
 * Shows items revolving around or dependent on central concept
 */
export const orbitCycleShape: ShapeDefinition = {
  id: 'orbitCycle',

  bounds(ctx) {
    const data = ctx.node.data as OrbitCycleData | undefined;
    if (!data || !data.items || data.items.length === 0) {
      return { width: 500, height: 500 };
    }

    // Fixed size for orbital diagram (larger to accommodate bigger circles)
    return { width: 550, height: 550 };
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
    const centerLabel = (ctx.node.data?.centerLabel as string) || 'Core';

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

    const stroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 12;
    const font = ctx.style.font || 'sans-serif';

    // Core (sun) parameters
    const coreRadius = 60;
    const coreFill = theme.colors[1] || '#FFC000'; // Second theme color for core

    // Orbit parameters - multiple orbits for multiple items
    const maxOrbits = 3;
    const orbitRadii = [110, 170, 230];
    const itemsPerOrbit = Math.ceil(itemCount / maxOrbits);

    // Orbital item (planet) parameters
    const planetRadius = 45;

    let svg = '';

    // Draw central core (sun)
    svg += `
      <circle cx="${centerX}" cy="${centerY}" r="${coreRadius}"
              fill="${coreFill}" stroke="${stroke}" stroke-width="${strokeWidth + 1}" />
      
      <text x="${centerX}" y="${centerY}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize + 2}" 
            font-weight="bold" fill="#FFFFFF">
        ${centerLabel}
      </text>
    `;

    // Draw orbits and items
    let itemIndex = 0;
    for (
      let orbitIndex = 0;
      orbitIndex < maxOrbits && itemIndex < itemCount;
      orbitIndex++
    ) {
      const orbitRadius = orbitRadii[orbitIndex];
      const orbitColor = getThemeColor(theme, orbitIndex);

      // Draw orbit path (ellipse)
      svg += `
        <circle cx="${centerX}" cy="${centerY}" r="${orbitRadius}"
                fill="none" stroke="#D0D0D0" stroke-width="1" stroke-dasharray="5,5" />
      `;

      // Calculate items on this orbit
      const itemsOnThisOrbit = Math.min(itemsPerOrbit, itemCount - itemIndex);

      // Draw items on this orbit - all at same vertical level (centerY)
      for (
        let i = 0;
        i < itemsOnThisOrbit && itemIndex < itemCount;
        i++, itemIndex++
      ) {
        // Position items evenly around the horizontal plane
        const angle = (i * 2 * Math.PI) / itemsOnThisOrbit;
        const itemX = centerX + Math.cos(angle) * orbitRadius;
        const itemY = centerY; // Keep all items at center vertical level

        // Draw orbital item (planet)
        svg += `
          <circle cx="${itemX}" cy="${itemY}" r="${planetRadius}"
                  fill="${orbitColor}" stroke="${stroke}" stroke-width="${strokeWidth}" />
          
          <text x="${itemX}" y="${itemY}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize}" 
                font-weight="bold" fill="#FFFFFF">
            ${items[itemIndex]}
          </text>
        `;

        // Draw motion arrow indicating orbit direction - positioned to the side to avoid text overlap
        if (i === 0) {
          // Position arrow at the top of the orbit (90 degrees offset)
          const arrowCenterAngle = -Math.PI / 2; // Top of orbit
          const arrowStartAngle = arrowCenterAngle - Math.PI / 8;
          const arrowEndAngle = arrowCenterAngle + Math.PI / 8;

          const arrowStartX = centerX + Math.cos(arrowStartAngle) * orbitRadius;
          const arrowStartY = centerY + Math.sin(arrowStartAngle) * orbitRadius;
          const arrowEndX = centerX + Math.cos(arrowEndAngle) * orbitRadius;
          const arrowEndY = centerY + Math.sin(arrowEndAngle) * orbitRadius;

          // Arc for curved arrow at top of orbit (away from text)
          svg += `
            <defs>
              <marker id="orbit-arrow-${orbitIndex}" markerWidth="10" markerHeight="10" 
                      refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="${stroke}" />
              </marker>
            </defs>
            <path d="M ${arrowStartX} ${arrowStartY} A ${orbitRadius} ${orbitRadius} 0 0 1 ${arrowEndX} ${arrowEndY}"
                  fill="none" stroke="${stroke}" stroke-width="2" 
                  marker-end="url(#orbit-arrow-${orbitIndex})" 
                  opacity="0.6" />
          `;
        }
      }
    }

    return svg;
  },
};
