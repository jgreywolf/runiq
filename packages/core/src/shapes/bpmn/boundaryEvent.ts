import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { getDataProperty } from '../../types/index.js';
import { getBpmnEventBounds, renderBpmnEventSvg } from './event.js';

export const bpmnBoundaryEventShape: ShapeDefinition = {
  id: 'bpmnBoundaryEvent',

  bounds() {
    return getBpmnEventBounds();
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
    const interrupting = getDataProperty<boolean>(ctx.node.data, 'interrupting', true);

    return renderBpmnEventSvg(ctx, position, {
      forceIntermediate: true,
      dashedBorder: interrupting === false,
    });
  },
};
