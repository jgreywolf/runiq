import {
  getGlyphsetTheme,
  getThemeColor,
} from '../../themes/glyphset-themes.js';
import type { ShapeDefinition } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';
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
      const noItemsStyle = { fontSize: 14, color: '#999' };
      return `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" 
                    fill="#f9f9f9" stroke="#ccc" stroke-width="1" rx="4" />
              ${renderShapeLabel({ ...ctx, style: noItemsStyle }, 'No items', x + bounds.width / 2, y + bounds.height / 2)}`;
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
      const inputStyle = { fontSize, fontWeight: '600', color: '#FFFFFF' };
      svg += `
        <rect x="${currentX}" y="${y}" 
              width="${itemWidth}" height="${itemHeight}"
              rx="6" ry="6"
              fill="${inputFill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
        
        ${renderShapeLabel({ ...ctx, style: inputStyle }, inputs[i], currentX + itemWidth / 2, y + itemHeight / 2)}
      `;

      currentX += itemWidth;

      // Draw + operator (if not last input)
      if (i < inputs.length - 1) {
        const operatorStyle = {
          fontSize: fontSize * 1.5,
          fontWeight: '700',
          color: stroke,
        };
        svg += renderShapeLabel(
          { ...ctx, style: operatorStyle },
          '+',
          currentX + operatorWidth / 2,
          y + itemHeight / 2
        );
        currentX += operatorWidth;
      }
    }

    // Draw = operator
    const equalsStyle = {
      fontSize: fontSize * 1.5,
      fontWeight: '700',
      color: stroke,
    };
    svg += renderShapeLabel(
      { ...ctx, style: equalsStyle },
      '=',
      currentX + operatorWidth / 2,
      y + itemHeight / 2
    );
    currentX += operatorWidth;

    // Draw result box (slightly larger and different color)
    const resultStyle = {
      fontSize: fontSize * 1.1,
      fontWeight: '700',
      color: '#FFFFFF',
    };
    svg += `
      <rect x="${currentX}" y="${y}" 
            width="${resultWidth}" height="${itemHeight}"
            rx="6" ry="6"
            fill="${resultFill}" stroke="${stroke}" stroke-width="${strokeWidth + 1}" />
      
      ${renderShapeLabel({ ...ctx, style: resultStyle }, result, currentX + resultWidth / 2, y + itemHeight / 2)}
    `;

    return svg;
  },
};
