import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { getDataProperty } from '../../types/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

/**
 * BPMN Event shape - represents something that happens during a process.
 * Can be start (single circle), intermediate (double circle), or end (thick circle).
 */
export const bpmnEventShape: ShapeDefinition = {
  id: 'bpmnEvent',

  bounds() {
    // Events are circular with fixed size
    const size = 40;
    return { width: size, height: size };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    const radius = bounds.width / 2;

    return [
      { x: radius, y: 0, name: 'top' },
      { x: bounds.width, y: radius, name: 'right' },
      { x: radius, y: bounds.height, name: 'bottom' },
      { x: 0, y: radius, name: 'left' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const radius = bounds.width / 2;
    const cx = x + radius;
    const cy = y + radius;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';

    // Get event type from data (handles parser's { values: [...] } format)
    const eventType =
      getDataProperty<string>(ctx.node.data, 'eventType', 'start') || 'start';

    let svg = '';
    let icon = ''; // Icon to render inside the circle

    // Determine circle style based on event type category
    const isEndEvent = eventType === 'end' || eventType.startsWith('end-');
    const isIntermediateEvent =
      eventType === 'intermediate' || eventType.startsWith('intermediate-');

    if (isEndEvent) {
      // End event: single thick circle (5px stroke)
      svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 2.5}" fill="${fill}" stroke="${stroke}" stroke-width="5"/>`;
    } else if (isIntermediateEvent) {
      // Intermediate event: double circles
      svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 1}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
      svg += `<circle cx="${cx}" cy="${cy}" r="${radius - 5}" fill="none" stroke="${stroke}" stroke-width="1.5"/>`;
    } else {
      // Start event: single thin circle (1px stroke)
      svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 1}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
    }

    // Extract the base event type (remove start-/intermediate-/end- prefix)
    const baseEventType = eventType
      .replace(/^start-/, '')
      .replace(/^intermediate-/, '')
      .replace(/^end-/, '');

    // Add icons for specific event types (BPMN 2.0 standard icons)
    const iconSize = 12; // Icon dimensions

    switch (baseEventType) {
      case 'timer':
        // Timer: Clock icon (circle with clock hands)
        icon = `
          <circle cx="${cx}" cy="${cy}" r="${iconSize / 2}" fill="none" stroke="${stroke}" stroke-width="1"/>
          <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - iconSize / 3}" stroke="${stroke}" stroke-width="1"/>
          <line x1="${cx}" y1="${cy}" x2="${cx + iconSize / 4}" y2="${cy - iconSize / 5}" stroke="${stroke}" stroke-width="1"/>`;
        break;

      case 'message':
        // Message: Envelope icon
        icon = `
          <rect x="${cx - iconSize / 2}" y="${cy - iconSize / 3}" width="${iconSize}" height="${iconSize * 0.66}" fill="none" stroke="${stroke}" stroke-width="1"/>
          <path d="M ${cx - iconSize / 2} ${cy - iconSize / 3} L ${cx} ${cy} L ${cx + iconSize / 2} ${cy - iconSize / 3}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
        break;

      case 'error':
        // Error: Lightning bolt icon
        icon = `
          <path d="M ${cx - 2} ${cy - iconSize / 2} L ${cx - 5} ${cy} L ${cx + 2} ${cy} L ${cx - 1} ${cy + iconSize / 2} L ${cx + 5} ${cy - 2} L ${cx - 2} ${cy - 2} Z"
                fill="${stroke}" stroke="none"/>`;
        break;

      case 'conditional':
        // Conditional: Document/list icon (horizontal lines)
        icon = `
          <line x1="${cx - iconSize / 2}" y1="${cy - iconSize / 3}" x2="${cx + iconSize / 2}" y2="${cy - iconSize / 3}" stroke="${stroke}" stroke-width="1"/>
          <line x1="${cx - iconSize / 2}" y1="${cy}" x2="${cx + iconSize / 2}" y2="${cy}" stroke="${stroke}" stroke-width="1"/>
          <line x1="${cx - iconSize / 2}" y1="${cy + iconSize / 3}" x2="${cx + iconSize / 2}" y2="${cy + iconSize / 3}" stroke="${stroke}" stroke-width="1"/>`;
        break;

      case 'signal':
        // Signal: Triangle pointing up
        icon = `
          <path d="M ${cx} ${cy - iconSize / 2} L ${cx + iconSize / 2} ${cy + iconSize / 2} L ${cx - iconSize / 2} ${cy + iconSize / 2} Z"
                fill="none" stroke="${stroke}" stroke-width="1"/>`;
        break;

      case 'escalation':
        // Escalation: Upward pointing arrow/chevron
        icon = `
          <path d="M ${cx} ${cy - iconSize / 2} L ${cx + iconSize / 2} ${cy + iconSize / 3} L ${cx + iconSize / 4} ${cy + iconSize / 3} L ${cx} ${cy - iconSize / 4} L ${cx - iconSize / 4} ${cy + iconSize / 3} L ${cx - iconSize / 2} ${cy + iconSize / 3} Z"
                fill="none" stroke="${stroke}" stroke-width="1"/>`;
        break;

      case 'compensation':
        // Compensation: Double triangles pointing left
        icon = `
          <path d="M ${cx} ${cy - iconSize / 2} L ${cx - iconSize / 3} ${cy} L ${cx} ${cy + iconSize / 2} Z" fill="none" stroke="${stroke}" stroke-width="1"/>
          <path d="M ${cx + iconSize / 3} ${cy - iconSize / 2} L ${cx} ${cy} L ${cx + iconSize / 3} ${cy + iconSize / 2} Z" fill="none" stroke="${stroke}" stroke-width="1"/>`;
        break;

      case 'cancel':
        // Cancel: X icon
        icon = `
          <line x1="${cx - iconSize / 2}" y1="${cy - iconSize / 2}" x2="${cx + iconSize / 2}" y2="${cy + iconSize / 2}" stroke="${stroke}" stroke-width="1.5"/>
          <line x1="${cx + iconSize / 2}" y1="${cy - iconSize / 2}" x2="${cx - iconSize / 2}" y2="${cy + iconSize / 2}" stroke="${stroke}" stroke-width="1.5"/>`;
        break;

      case 'link':
        // Link: Arrow icon
        icon = `
          <line x1="${cx - iconSize / 2}" y1="${cy}" x2="${cx + iconSize / 3}" y2="${cy}" stroke="${stroke}" stroke-width="1.5"/>
          <path d="M ${cx + iconSize / 3} ${cy} L ${cx} ${cy - iconSize / 3} M ${cx + iconSize / 3} ${cy} L ${cx} ${cy + iconSize / 3}" stroke="${stroke}" stroke-width="1.5" fill="none"/>`;
        break;

      case 'terminate':
        // Terminate: Filled circle
        icon = `<circle cx="${cx}" cy="${cy}" r="${iconSize / 2}" fill="${stroke}"/>`;
        break;
    }

    svg += icon;

    // Optional label below the event
    if (ctx.node.label) {
      const textY = y + bounds.height + 16;
      const labelStyle = {
        ...ctx.style,
        fontSize: (ctx.style.fontSize || 14) * 0.85,
      };
      svg += renderShapeLabel(
        { ...ctx, style: labelStyle },
        ctx.node.label,
        cx,
        textY
      );
    }

    return svg;
  },
};
