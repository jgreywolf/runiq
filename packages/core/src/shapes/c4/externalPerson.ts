import type { ShapeDefinition } from '../../types/index.js';
import { c4Person } from './person.js';

export const c4ExternalPerson: ShapeDefinition = {
  ...c4Person,
  id: 'c4ExternalPerson',
  render(ctx, position) {
    return c4Person.render(
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
