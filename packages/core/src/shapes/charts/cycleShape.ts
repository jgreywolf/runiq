import type { ShapeDefinition } from '../../types.js';
import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';

/**
 * Cycle Shape - Circular arrangement of process steps
 *
 * Renders multiple steps arranged in a circle with arrows showing flow.
 * Perfect for PDCA cycles, iterative processes, etc.
 *
 * Data format: { steps: ["Plan", "Do", "Check", "Act"] }
 */
export const cycleShape: ShapeDefinition = {
  id: 'cycle',

  bounds(ctx) {
    const data = ctx.node.data as { steps?: string[] } | undefined;
    const steps = data?.steps || [];
    const numSteps = Math.max(steps.length, 3);

    // Size based on number of steps
    const radius = 80 + numSteps * 10;
    const diameter = radius * 2;
    const padding = 80; // For labels outside circle

    return {
      width: diameter + padding,
      height: diameter + padding,
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
    const data = ctx.node.data as
      | { steps?: string[]; theme?: string }
      | undefined;
    const steps = data?.steps || ['Step 1', 'Step 2', 'Step 3'];

    const bounds = this.bounds(ctx);
    const centerX = position.x + bounds.width / 2;
    const centerY = position.y + bounds.height / 2;
    const radius = (bounds.width - 80) / 2;

    // Theme support
    const themeId = (data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const stroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const fontSize = ctx.style.fontSize || 13;
    const fontFamily =
      typeof ctx.style.font === 'string' ? ctx.style.font : 'Arial, sans-serif';

    const boxWidth = 100;
    const boxHeight = 50;
    const cornerRadius = 4;

    let svg = '';

    // Calculate positions for each step around the circle
    const angleStep = (2 * Math.PI) / steps.length;
    const startAngle = -Math.PI / 2; // Start at top

    const positions: Array<{ x: number; y: number; angle: number }> = [];

    for (let i = 0; i < steps.length; i++) {
      const angle = startAngle + i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.push({ x, y, angle });
    }

    // Draw circular arrow path
    svg += `<defs>`;
    svg += `<marker id="cycle-arrow-${ctx.node.id}" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">`;
    svg += `<path d="M0,0 L0,6 L9,3 z" fill="${stroke}" />`;
    svg += `</marker>`;
    svg += `</defs>`;

    // Draw connecting arcs
    for (let i = 0; i < steps.length; i++) {
      const nextI = (i + 1) % steps.length;
      const p1 = positions[i];
      const p2 = positions[nextI];

      // Arc from p1 to p2
      const midAngle = startAngle + (i + 0.5) * angleStep;
      const arcRadius = radius * 0.95;

      svg += `<path d="M ${p1.x} ${p1.y} A ${arcRadius} ${arcRadius} 0 0 1 ${p2.x} ${p2.y}" `;
      svg += `stroke="${stroke}" stroke-width="2" fill="none" `;
      svg += `marker-end="url(#cycle-arrow-${ctx.node.id})" />`;
    }

    // Draw step boxes
    steps.forEach((label, i) => {
      const pos = positions[i];
      const x = pos.x - boxWidth / 2;
      const y = pos.y - boxHeight / 2;

      // Use theme color for each step
      const stepFill = ctx.style.fill || getThemeColor(theme, i);

      // Shadow
      svg += `<rect x="${x + 2}" y="${y + 2}" width="${boxWidth}" height="${boxHeight}" `;
      svg += `rx="${cornerRadius}" fill="#000000" fill-opacity="0.15" />`;

      // Gradient
      svg += `<linearGradient id="cycleGrad-${ctx.node.id}-${i}" x1="0%" y1="0%" x2="0%" y2="100%">`;
      svg += `<stop offset="0%" style="stop-color:${stepFill};stop-opacity:1" />`;
      svg += `<stop offset="100%" style="stop-color:${stepFill};stop-opacity:0.8" />`;
      svg += `</linearGradient>`;

      // Box
      svg += `<rect x="${x}" y="${y}" width="${boxWidth}" height="${boxHeight}" `;
      svg += `rx="${cornerRadius}" `;
      svg += `fill="url(#cycleGrad-${ctx.node.id}-${i})" `;
      svg += `stroke="${stroke}" stroke-width="0" />`;

      // Label
      svg += `<text x="${pos.x}" y="${pos.y}" `;
      svg += `text-anchor="middle" dominant-baseline="middle" `;
      svg += `font-family="${fontFamily}" font-size="${fontSize}" font-weight="600" `;
      svg += `fill="#FFFFFF">`;
      svg += `${label}`;
      svg += `</text>`;
    });

    return svg;
  },
};
