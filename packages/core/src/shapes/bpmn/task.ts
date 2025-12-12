import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { getDataProperty } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * BPMN Task shape - represents an atomic activity within a process.
 * Rendered as a rounded rectangle with optional task type markers.
 */
export const bpmnTaskShape: ShapeDefinition = {
  id: 'bpmnTask',

  bounds(ctx: ShapeRenderContext) {
    const padding = ctx.style.padding || 12;
    const labelMetrics = ctx.measureText(ctx.node.label || '', ctx.style);

    const minWidth = 100;
    const minHeight = 60;

    const width = Math.max(minWidth, labelMetrics.width + padding * 2);
    const height = Math.max(minHeight, labelMetrics.height + padding * 2);

    return { width, height };
  },

  anchors(ctx: ShapeRenderContext) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
      defaultStroke: '#000000',
      defaultStrokeWidth: 2,
    });

    // BPMN tasks have rounded corners (8px radius is standard)
    const rect = `<rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="8" ry="8"/>`;

    // Label (centered)
    const label = ctx.node.label || '';
    const textX = x + bounds.width / 2;
    const textY = y + bounds.height / 2 + (ctx.style.fontSize || 14) / 3;

    // Optional task type marker (user, service, manual, etc.)
    let marker = '';
    const taskType = getDataProperty<string>(ctx.node.data, 'taskType');
    if (taskType) {
      const markerSize = 16;
      const markerX = x + 8;
      const markerY = y + 8;

      if (taskType === 'user') {
        // User task icon (simplified person icon)
        marker = `<circle cx="${markerX + markerSize / 2}" cy="${markerY + markerSize / 4}" r="${markerSize / 4}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
        marker += `<path d="M ${markerX},${markerY + markerSize} Q ${markerX + markerSize / 2},${markerY + markerSize / 2} ${markerX + markerSize},${markerY + markerSize}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
      } else if (taskType === 'service') {
        // Service task icon (gear)
        marker = `<circle cx="${markerX + markerSize / 2}" cy="${markerY + markerSize / 2}" r="${markerSize / 3}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
      }
    }

    return `${rect}${marker}${renderShapeLabel(ctx, label, textX, textY)}`;
  },
};
