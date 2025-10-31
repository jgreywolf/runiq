import type { ShapeDefinition } from '../../types.js';

/**
 * UML Activity shape
 * Rounded rectangle representing an activity/action in an activity diagram
 * Similar to state but used in activity diagrams
 */
export const activityShape: ShapeDefinition = {
  id: 'activity',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const fontSize = ctx.style.fontSize || 14;
    const nameSize = ctx.measureText(ctx.node.label || '', ctx.style);

    // Calculate pin label sizes if present
    const inputPins = ctx.node.inputPins || [];
    const outputPins = ctx.node.outputPins || [];
    
    let maxPinWidth = 0;
    let pinHeight = 0;
    
    if (inputPins.length > 0 || outputPins.length > 0) {
      pinHeight = fontSize - 2; // Smaller font for pins
      const allPins = [...inputPins, ...outputPins];
      for (const pin of allPins) {
        const pinSize = ctx.measureText(pin, { ...ctx.style, fontSize: pinHeight });
        maxPinWidth = Math.max(maxPinWidth, pinSize.width);
      }
    }

    const width = Math.max(nameSize.width + padding * 2, maxPinWidth + padding * 2);
    const height = nameSize.height + padding * 2;

    return { width: Math.max(width, 100), height: Math.max(height, 50) };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const w = bounds.width;
    const h = bounds.height;

    return [
      { x: w / 2, y: 0, name: 'top' },
      { x: w, y: h / 2, name: 'right' },
      { x: w / 2, y: h, name: 'bottom' },
      { x: 0, y: h / 2, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const fontSize = ctx.style.fontSize || 14;
    const fontFamily = ctx.style.font || 'Arial';
    const cornerRadius = 10;

    const inputPins = ctx.node.inputPins || [];
    const outputPins = ctx.node.outputPins || [];
    const pinSize = 10; // Small square for pin
    const pinFontSize = fontSize - 2;

    let svg = `<g class="activity-shape">`;

    // Rounded rectangle (main shape)
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `rx="${cornerRadius}" ry="${cornerRadius}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Input pins (left side, small squares)
    const inputSpacing = h / (inputPins.length + 1);
    inputPins.forEach((pin, i) => {
      const pinY = y + inputSpacing * (i + 1) - pinSize / 2;
      const pinX = x - pinSize / 2;
      
      // Pin square
      svg += `<rect x="${pinX}" y="${pinY}" width="${pinSize}" height="${pinSize}" `;
      svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      
      // Pin label (left of the pin)
      svg += `<text x="${pinX - 4}" y="${pinY + pinSize / 2 + 3}" `;
      svg += `text-anchor="end" font-size="${pinFontSize}" `;
      svg += `font-family="${fontFamily}" fill="${stroke}">`;
      svg += `${pin}</text>`;
    });

    // Output pins (right side, small squares)
    const outputSpacing = h / (outputPins.length + 1);
    outputPins.forEach((pin, i) => {
      const pinY = y + outputSpacing * (i + 1) - pinSize / 2;
      const pinX = x + w - pinSize / 2;
      
      // Pin square
      svg += `<rect x="${pinX}" y="${pinY}" width="${pinSize}" height="${pinSize}" `;
      svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
      
      // Pin label (right of the pin)
      svg += `<text x="${pinX + pinSize + 4}" y="${pinY + pinSize / 2 + 3}" `;
      svg += `text-anchor="start" font-size="${pinFontSize}" `;
      svg += `font-family="${fontFamily}" fill="${stroke}">`;
      svg += `${pin}</text>`;
    });

    // Activity name (centered)
    svg += `<text x="${x + w / 2}" y="${y + h / 2 + 5}" `;
    svg += `text-anchor="middle" font-size="${fontSize}" `;
    svg += `font-family="${fontFamily}" fill="${stroke}">`;
    svg += `${ctx.node.label || ''}</text>`;

    svg += `</g>`;
    return svg;
  },
};
