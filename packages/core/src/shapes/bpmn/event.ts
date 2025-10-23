import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

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

    const eventType = (ctx.node.data?.eventType as string) || 'start';
    let svg = '';

    if (eventType === 'start') {
      // Start event: filled circle (solid black/dark fill)
      const startFill =
        ctx.style.fill === '#ffffff' ? '#90EE90' : ctx.style.fill; // Light green if white
      svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 1}" fill="${startFill}" stroke="${stroke}" stroke-width="1"/>`;
    } else if (eventType === 'end') {
      // End event: single thick circle
      svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 2}" fill="${fill}" stroke="${stroke}" stroke-width="4"/>`;
    } else if (eventType === 'intermediate') {
      // Intermediate event: double circle
      svg = `<circle cx="${cx}" cy="${cy}" r="${radius - 1}" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;
      svg += `<circle cx="${cx}" cy="${cy}" r="${radius - 4}" fill="none" stroke="${stroke}" stroke-width="1"/>`;
    }

    // Optional label below the event
    if (ctx.node.label) {
      const textY = y + bounds.height + 16;
      svg += `<text x="${cx}" y="${textY}" text-anchor="middle" font-family="${ctx.style.fontFamily || 'Arial'}" font-size="${(ctx.style.fontSize || 14) * 0.85}" fill="#000000">${ctx.node.label}</text>`;
    }

    return svg;
  },
};
