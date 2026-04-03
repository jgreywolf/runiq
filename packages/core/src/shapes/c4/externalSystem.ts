import type { ShapeDefinition } from '../../types/index.js';
import { c4System } from './system.js';

export const c4ExternalSystem: ShapeDefinition = {
  ...c4System,
  id: 'c4ExternalSystem',
  render(ctx, position) {
    return c4System.render(
      {
        ...ctx,
        style: {
          ...ctx.style,
          fill: ctx.style.fill || ctx.style.fillColor || '#999999',
          stroke: ctx.style.stroke || ctx.style.strokeColor || '#707070',
          textColor: ctx.style.textColor || '#ffffff',
        },
      },
      position
    );
  },
};
