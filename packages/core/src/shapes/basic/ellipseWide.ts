import type { ShapeDefinition } from '../../types.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * Ellipse (Wide/Horizontal) - Oval shape for UML use cases
 * Wider than tall, typically used to represent use cases in UML diagrams
 */
export const ellipseWideShape: ShapeDefinition = {
  id: 'ellipseWide',
  bounds(ctx) {
    const textSize = ctx.measureText(ctx.node.label || ctx.node.id, ctx.style);
    const padding = ctx.style.padding || 12;
    const fontSize = ctx.style.fontSize || 14;

    // Use case ovals are typically ~1.8-2x wider than tall
    // Need extra room since text rectangle fits inside ellipse
    let width = Math.max(
      textSize.width * 1.5 + padding * 2,
      80 // minimum width
    );

    let height = Math.max(
      textSize.height * 1.5 + padding * 2,
      40 // minimum height
    );

    // Add space for extension points if present
    if (ctx.node.extensionPoints && ctx.node.extensionPoints.length > 0) {
      // Measure extension points section
      const epTitle = 'extension points';
      const epTitleSize = ctx.measureText(epTitle, {
        ...ctx.style,
        fontSize: fontSize * 0.8,
      });

      // Find longest extension point
      let maxEpWidth = epTitleSize.width;
      for (const ep of ctx.node.extensionPoints) {
        const epSize = ctx.measureText(ep, {
          ...ctx.style,
          fontSize: fontSize * 0.85,
        });
        maxEpWidth = Math.max(maxEpWidth, epSize.width);
      }

      // Ensure width accommodates extension points
      width = Math.max(width, maxEpWidth * 1.4 + padding * 2);

      // Add height for separator line + extension points
      const epSectionHeight =
        fontSize * 0.8 + // title
        2 + // separator line
        ctx.node.extensionPoints.length * fontSize * 1.2 + // extension points
        padding; // extra spacing
      height += epSectionHeight;
    }

    return { width, height };
  },

  anchors(ctx) {
    const bounds = this.bounds(ctx);
    const cx = bounds.width / 2;
    const cy = bounds.height / 2;

    return [
      { x: cx, y: 0, name: 'top' },
      { x: bounds.width, y: cy, name: 'right' },
      { x: cx, y: bounds.height, name: 'bottom' },
      { x: 0, y: cy, name: 'left' },
    ];
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const cx = x + bounds.width / 2;
    const cy = y + bounds.height / 2;
    const rx = bounds.width / 2;
    const ry = bounds.height / 2;

    const fill = ctx.style.fill || '#f0f0f0';
    const stroke = ctx.style.stroke || '#333';
    const strokeWidth = ctx.style.strokeWidth || 1;
    const fontSize = ctx.style.fontSize || 14;
    const font = ctx.style.font || 'sans-serif';
    const label = ctx.node.label || ctx.node.id;

    let svg = `
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"
               fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
    `;

    // Render label and extension points if present
    if (ctx.node.extensionPoints && ctx.node.extensionPoints.length > 0) {
      // Calculate label position (upper portion)
      const textSize = ctx.measureText(label, ctx.style);
      const labelY = cy - textSize.height;

      svg += renderShapeLabel(ctx, label, cx, labelY);

      // Draw horizontal separator line
      const lineY = cy - textSize.height / 2 + fontSize * 0.5;
      const lineMargin = rx * 0.15; // 15% margin from edges
      svg += `
        <line x1="${cx - rx + lineMargin}" y1="${lineY}" 
              x2="${cx + rx - lineMargin}" y2="${lineY}"
              stroke="${stroke}" stroke-width="${strokeWidth * 0.5}" />
      `;

      // Draw "extension points" title
      const epTitleY = lineY + fontSize * 0.9;
      svg += `
        <text x="${cx}" y="${epTitleY}" text-anchor="middle" 
              font-family="${font}" font-size="${fontSize * 0.8}" 
              font-style="italic" fill="${stroke}">
          extension points
        </text>
      `;

      // Draw each extension point
      let epY = epTitleY + fontSize * 1.2;
      for (const ep of ctx.node.extensionPoints) {
        svg += `
          <text x="${cx}" y="${epY}" text-anchor="middle"
                font-family="${font}" font-size="${fontSize * 0.85}">
            ${ep}
          </text>
        `;
        epY += fontSize * 1.2;
      }
    } else {
      // No extension points - center label
      svg += renderShapeLabel(ctx, label, cx, cy);
    }

    return svg;
  },
};
