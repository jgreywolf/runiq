import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { createStandardAnchors } from './utils.js';

/**
 * Equation Process Shape - A + B + C = Result
 * Shows inputs combining to produce output in formula style.
 */
export const equationProcessShape: ShapeDefinition = {
  id: 'equationProcess',

  bounds(ctx) {
    const inputs = (ctx.node.data?.inputs as string[]) || [];

    if (inputs.length === 0) {
      return { width: 400, height: 100 };
    }

    const itemWidth = 100;
    const itemHeight = 60;
    const operatorWidth = 40; // Width for + and = symbols
    const resultWidth = 120; // Wider box for result

    // Total width: inputs + operators + result
    const totalWidth =
      inputs.length * itemWidth +
      (inputs.length - 1) * operatorWidth + // + operators between inputs
      operatorWidth + // = operator before result
      resultWidth;

    return {
      width: totalWidth,
      height: itemHeight,
    };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    return createStandardAnchors(bounds);
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const inputs = (ctx.node.data?.inputs as string[]) || [];
    const result = (ctx.node.data?.result as string) || '';

    if (inputs.length === 0) {
      return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" 
                    fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
              <text x="${x + bounds.width / 2}" y="${y + bounds.height / 2}" 
                    text-anchor="middle" dominant-baseline="middle" 
                    fill="#999" font-family="sans-serif" font-size="14">
                No items
              </text>`;
    }

    const itemWidth = 100;
    const itemHeight = 60;
    const operatorWidth = 40;
    const resultWidth = 120;

    // Theme support
    const themeId = (ctx.node.data?.theme as string) || 'professional';
    const theme = getGlyphsetTheme(themeId);

    const resultFill = theme.colors[1] || '#5B9BD5'; // Use second theme color for result
    const stroke = ctx.style.stroke || theme.accentColor || '#2E5AAC';
    const strokeWidth = ctx.style.strokeWidth || 2;
    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';

    let svg = '';
    let currentX = x;

    // Render input items with + operators
    for (let i = 0; i < inputs.length; i++) {
      // Use theme color for each input
      const inputFill = ctx.style.fill || getThemeColor(theme, i);

      // Draw input box
      svg += `
        <rect x="${currentX}" y="${y}" 
              width="${itemWidth}" height="${itemHeight}"
              rx="6" ry="6"
              fill="${inputFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        <text x="${currentX + itemWidth / 2}" y="${y + itemHeight / 2}" 
              text-anchor="middle" dominant-baseline="middle"
              font-family="${font}" font-size="${fontSize}" 
              font-weight="600" fill="#FFFFFF">
          ${inputs[i]}
        </text>
      `;

      currentX += itemWidth;

      // Draw + operator (if not last input)
      if (i < inputs.length - 1) {
        svg += `
          <text x="${currentX + operatorWidth / 2}" y="${y + itemHeight / 2}" 
                text-anchor="middle" dominant-baseline="middle"
                font-family="${font}" font-size="${fontSize * 1.5}" 
                font-weight="700" fill="${stroke}">
            +
          </text>
        `;
        currentX += operatorWidth;
      }
    }

    // Draw = operator
    svg += `
      <text x="${currentX + operatorWidth / 2}" y="${y + itemHeight / 2}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize * 1.5}" 
            font-weight="700" fill="${stroke}">
        =
      </text>
    `;
    currentX += operatorWidth;

    // Draw result box (slightly larger and different color)
    svg += `
      <rect x="${currentX}" y="${y}" 
            width="${resultWidth}" height="${itemHeight}"
            rx="6" ry="6"
            fill="${resultFill}" stroke="${stroke}" stroke-width="${strokeWidth + 1}" />
      
      <text x="${currentX + resultWidth / 2}" y="${y + itemHeight / 2}" 
            text-anchor="middle" dominant-baseline="middle"
            font-family="${font}" font-size="${fontSize * 1.1}" 
            font-weight="700" fill="#FFFFFF">
        ${result}
      </text>
    `;

    return svg;
  },
};
