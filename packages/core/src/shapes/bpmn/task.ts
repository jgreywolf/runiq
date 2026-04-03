import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { getDataProperty } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

function renderTaskMarker(
  taskType: string,
  stroke: string,
  markerX: number,
  markerY: number,
  markerSize: number
): string {
  const centerX = markerX + markerSize / 2;
  const centerY = markerY + markerSize / 2;

  switch (taskType) {
    case 'user':
      return `<circle cx="${centerX}" cy="${markerY + markerSize / 4}" r="${markerSize / 4}" fill="none" stroke="${stroke}" stroke-width="1"/>` +
        `<path d="M ${markerX},${markerY + markerSize} Q ${centerX},${markerY + markerSize / 2} ${markerX + markerSize},${markerY + markerSize}" fill="none" stroke="${stroke}" stroke-width="1"/>`;

    case 'service':
      return `<circle cx="${centerX}" cy="${centerY}" r="${markerSize / 3}" fill="none" stroke="${stroke}" stroke-width="1"/>` +
        `<path d="M ${centerX} ${markerY + 1} L ${centerX} ${markerY + 4} M ${centerX} ${markerY + markerSize - 1} L ${centerX} ${markerY + markerSize - 4}
                 M ${markerX + 1} ${centerY} L ${markerX + 4} ${centerY} M ${markerX + markerSize - 1} ${centerY} L ${markerX + markerSize - 4} ${centerY}
                 M ${markerX + 3} ${markerY + 3} L ${markerX + 5} ${markerY + 5} M ${markerX + markerSize - 3} ${markerY + 3} L ${markerX + markerSize - 5} ${markerY + 5}
                 M ${markerX + 3} ${markerY + markerSize - 3} L ${markerX + 5} ${markerY + markerSize - 5} M ${markerX + markerSize - 3} ${markerY + markerSize - 3} L ${markerX + markerSize - 5} ${markerY + markerSize - 5}"
              fill="none" stroke="${stroke}" stroke-width="1"/>`;

    case 'manual':
      return `<path d="M ${markerX + 2} ${markerY + markerSize - 2}
                       L ${markerX + 4} ${markerY + 6}
                       L ${centerX} ${markerY + 2}
                       L ${markerX + markerSize - 3} ${markerY + 6}
                       L ${markerX + markerSize - 5} ${markerY + markerSize - 2} Z"
                    fill="none" stroke="${stroke}" stroke-width="1"/>`;

    case 'script':
      return `<rect x="${markerX + 2}" y="${markerY + 2}" width="${markerSize - 4}" height="${markerSize - 4}" rx="2" fill="none" stroke="${stroke}" stroke-width="1"/>` +
        `<line x1="${markerX + 5}" y1="${markerY + 6}" x2="${markerX + markerSize - 5}" y2="${markerY + 6}" stroke="${stroke}" stroke-width="1"/>
         <line x1="${markerX + 5}" y1="${markerY + 9}" x2="${markerX + markerSize - 7}" y2="${markerY + 9}" stroke="${stroke}" stroke-width="1"/>
         <line x1="${markerX + 5}" y1="${markerY + 12}" x2="${markerX + markerSize - 6}" y2="${markerY + 12}" stroke="${stroke}" stroke-width="1"/>`;

    case 'receive':
      return `<rect x="${markerX + 2}" y="${markerY + 4}" width="${markerSize - 4}" height="${markerSize - 8}" fill="none" stroke="${stroke}" stroke-width="1"/>` +
        `<path d="M ${markerX + 2} ${markerY + 4} L ${centerX} ${centerY} L ${markerX + markerSize - 2} ${markerY + 4}" fill="none" stroke="${stroke}" stroke-width="1"/>`;

    case 'send':
      return `<rect x="${markerX + 2}" y="${markerY + 4}" width="${markerSize - 4}" height="${markerSize - 8}" fill="${stroke}" stroke="${stroke}" stroke-width="1"/>` +
        `<path d="M ${markerX + 2} ${markerY + 4} L ${centerX} ${centerY} L ${markerX + markerSize - 2} ${markerY + 4}" fill="none" stroke="#ffffff" stroke-width="1"/>`;

    case 'businessRule':
      return `<rect x="${markerX + 2}" y="${markerY + 2}" width="${markerSize - 4}" height="${markerSize - 4}" rx="2" fill="none" stroke="${stroke}" stroke-width="1"/>` +
        `<line x1="${markerX + 2}" y1="${markerY + 6}" x2="${markerX + markerSize - 2}" y2="${markerY + 6}" stroke="${stroke}" stroke-width="1"/>
         <line x1="${markerX + 6}" y1="${markerY + 6}" x2="${markerX + 6}" y2="${markerY + markerSize - 2}" stroke="${stroke}" stroke-width="1"/>
         <line x1="${markerX + 9}" y1="${markerY + 9}" x2="${markerX + markerSize - 4}" y2="${markerY + 9}" stroke="${stroke}" stroke-width="1"/>
         <line x1="${markerX + 9}" y1="${markerY + 12}" x2="${markerX + markerSize - 6}" y2="${markerY + 12}" stroke="${stroke}" stroke-width="1"/>`;

    default:
      return '';
  }
}

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
      marker = renderTaskMarker(taskType, stroke, markerX, markerY, markerSize);
    }

    return `${rect}${marker}${renderShapeLabel(ctx, label, textX, textY)}`;
  },
};
