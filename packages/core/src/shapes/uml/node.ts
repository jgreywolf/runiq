import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Helper function to darken a color
 */
function darkenColor(color: string, factor: number): string {
  if (color.startsWith('#')) {
    const hex = color.substring(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = Math.floor(r * factor);
    const newG = Math.floor(g * factor);
    const newB = Math.floor(b * factor);

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
  return color;
}

/**
 * UML Node shape - represents a physical device or execution environment.
 * Rendered as a 3D cube with «device» stereotype.
 */
export const nodeShape: ShapeDefinition = {
  id: 'node',

  bounds(ctx: ShapeRenderContext) {
    const padding = ctx.style.padding || 12;
    const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);
    const stereotypeMetrics = ctx.measureText('«device»', ctx.style);

    const minWidth = 100;
    const minHeight = 80;
    const depthOffset = 16; // 3D depth effect

    const width =
      Math.max(
        minWidth,
        labelMetrics.width + padding * 2,
        stereotypeMetrics.width + padding * 2
      ) + depthOffset;
    const height =
      Math.max(
        minHeight,
        labelMetrics.height + stereotypeMetrics.height + padding * 3
      ) + depthOffset;

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    const halfWidth = bounds.width / 2;
    const halfHeight = bounds.height / 2;

    return [
      { id: 'top', x: halfWidth, y: 0 },
      { id: 'right', x: bounds.width, y: halfHeight },
      { id: 'bottom', x: halfWidth, y: bounds.height },
      { id: 'left', x: 0, y: halfHeight },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const backgroundColor =
      (ctx.node.data?.backgroundColor as string) || '#e8f5e9';
    const borderColor = (ctx.node.data?.borderColor as string) || '#388e3c';
    const borderWidth = (ctx.node.data?.borderWidth as number) || 2;

    const depthOffset = 16; // 3D depth
    const mainWidth = bounds.width - depthOffset;
    const mainHeight = bounds.height - depthOffset;

    // Front face (main rectangle)
    const frontPath = `
			M ${x},${y + depthOffset}
			L ${x + mainWidth},${y + depthOffset}
			L ${x + mainWidth},${y + mainHeight + depthOffset}
			L ${x},${y + mainHeight + depthOffset}
			Z
		`.trim();

    // Top face (parallelogram)
    const topPath = `
			M ${x},${y + depthOffset}
			L ${x + depthOffset},${y}
			L ${x + mainWidth + depthOffset},${y}
			L ${x + mainWidth},${y + depthOffset}
			Z
		`.trim();

    // Right face (parallelogram)
    const rightPath = `
			M ${x + mainWidth},${y + depthOffset}
			L ${x + mainWidth + depthOffset},${y}
			L ${x + mainWidth + depthOffset},${y + mainHeight}
			L ${x + mainWidth},${y + mainHeight + depthOffset}
			Z
		`.trim();

    // Calculate darker colors for 3D effect
    const darkerBg = darkenColor(backgroundColor, 0.85);
    const darkestBg = darkenColor(backgroundColor, 0.7);

    const front = `<path d="${frontPath}" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;
    const top = `<path d="${topPath}" fill="${darkerBg}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;
    const right = `<path d="${rightPath}" fill="${darkestBg}" stroke="${borderColor}" stroke-width="${borderWidth}"/>`;

    // Stereotype text (top of front face)
    const fontSize = ctx.style.fontSize || 14;
    const stereotypeX = x + mainWidth / 2;
    const stereotypeY = y + depthOffset + fontSize + 8;
    const stereotype = `<text x="${stereotypeX}" y="${stereotypeY}" text-anchor="middle" font-family="${ctx.style.fontFamily}" font-size="${fontSize - 2}" fill="#666666">«device»</text>`;

    // Label text (center of front face)
    const label = ctx.node.label || '';
    const textX = x + mainWidth / 2;
    const textY = y + depthOffset + mainHeight / 2 + fontSize / 3 + 6;
    const text = `<text x="${textX}" y="${textY}" text-anchor="middle" font-family="${ctx.style.fontFamily}" font-size="${fontSize}" fill="#000000">${label}</text>`;

    return `${top}${right}${front}${stereotype}${text}`;
  },
};
