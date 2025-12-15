import type { ShapeDefinition } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * UML State shape
 * Rounded rectangle representing a state in a state machine diagram
 * Can contain state name and internal activities (entry/do/exit)
 */
export const stateShape: ShapeDefinition = {
  id: 'state',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;

    // Build activities array from first-class properties or legacy data.activities
    const activities: string[] = [];
    if (ctx.node.entry) {
      activities.push(`entry / ${ctx.node.entry}`);
    }
    if (ctx.node.doActivity) {
      activities.push(`do / ${ctx.node.doActivity}`);
    }
    if (ctx.node.exit) {
      activities.push(`exit / ${ctx.node.exit}`);
    }
    // Fallback to legacy data.activities if present
    if (activities.length === 0 && ctx.node.data?.activities) {
      activities.push(...(ctx.node.data.activities as string[]));
    }

    const nameSize = ctx.measureText(ctx.node.label || '', ctx.style);

    // Calculate width based on longest text
    let maxWidth = nameSize.width;
    activities.forEach((activity) => {
      const activitySize = ctx.measureText(activity, ctx.style);
      maxWidth = Math.max(maxWidth, activitySize.width);
    });

    const width = maxWidth + padding * 2;

    // Height: name + optional separator + activities
    let height = padding + lineHeight + padding; // Name with padding

    if (activities.length > 0) {
      height += 1 + padding * 0.5; // Separator
      height += activities.length * lineHeight;
      height += padding * 0.5;
    }

    return { width: Math.max(width, 80), height: Math.max(height, 50) };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;

    // Build activities array from first-class properties or legacy data.activities
    const activities: string[] = [];
    if (ctx.node.entry) {
      activities.push(`entry / ${ctx.node.entry}`);
    }
    if (ctx.node.doActivity) {
      activities.push(`do / ${ctx.node.doActivity}`);
    }
    if (ctx.node.exit) {
      activities.push(`exit / ${ctx.node.exit}`);
    }
    // Fallback to legacy data.activities if present
    if (activities.length === 0 && ctx.node.data?.activities) {
      activities.push(...(ctx.node.data.activities as string[]));
    }

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
      defaultStroke: '#000000',
    });
    const cornerRadius = 10;

    let svg = `<g class="state-shape">`;

    // Rounded rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" `;
    svg += `rx="${cornerRadius}" ry="${cornerRadius}" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // State name
    let currentY = y + padding + lineHeight * 0.7;
    const nameStyle = {
      ...ctx.style,
      fontWeight: 'bold' as const,
      color: stroke,
    };
    svg += renderShapeLabel(
      { ...ctx, style: nameStyle },
      ctx.node.label || '',
      x + w / 2,
      currentY
    );

    // Optional activities section
    if (activities.length > 0) {
      currentY += lineHeight * 0.3 + padding * 0.3;

      // Separator line
      svg += `<line x1="${x + padding}" y1="${currentY}" `;
      svg += `x2="${x + w - padding}" y2="${currentY}" `;
      svg += `stroke="${stroke}" stroke-width="${strokeWidth}" />`;

      currentY += padding * 0.7;

      // Activity list
      activities.forEach((activity) => {
        currentY += lineHeight * 0.7;
        const activityStyle = {
          ...ctx.style,
          fontSize: (ctx.style.fontSize || 14) * 0.9,
          color: stroke,
        };
        svg += renderShapeLabel(
          { ...ctx, style: activityStyle },
          activity,
          x + padding,
          currentY,
          'start'
        );
        currentY += lineHeight * 0.3;
      });
    }

    svg += `</g>`;
    return svg;
  },
};
