import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';
import { getDataProperty } from '../../types.js';

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
    const eventType = getDataProperty<string>(
      ctx.node.data,
      'eventType',
      'start'
    );

    let svg = '';

    if (eventType === 'start') {
      // Start event: single thin circle (1px stroke)
      svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 1}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
    } else if (eventType === 'end') {
      // End event: single VERY thick circle (5px stroke - very bold and obvious)
      svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 2.5}" fill="${fill}" stroke="${stroke}" stroke-width="5"/>`;
    } else if (eventType === 'intermediate') {
      // Intermediate event: double circles - outer and prominent inner circle
      svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 1}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
      svg += `<circle cx="${cx}" cy="${cy}" r="${radius - 5}" fill="none" stroke="${stroke}" stroke-width="1.5"/>`;
    } else {
      // Default: same as start
      svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 1}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
    }

    // Optional label below the event
    if (ctx.node.label) {
      const textY = y + bounds.height + 16;
      svg += `<text x="${cx}" y="${textY}" text-anchor="middle" font-family="${ctx.style.fontFamily || 'Arial'}" font-size="${(ctx.style.fontSize || 14) * 0.85}" fill="#000000">${ctx.node.label}</text>`;
    }

    return svg;
  },
};
