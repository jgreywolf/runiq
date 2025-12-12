import type { ShapeDefinition } from '../../types/index.js';
import { calculateRectangularAnchors } from '../utils/index.js';
import {
  calculateCompartmentBounds,
  renderMultiCompartmentShape,
} from '../utils/render-compartments.js';

/**
 * UML Enumeration shape
 * Displays enum with «enumeration» stereotype, name, and values
 * Used in class diagrams to show enumeration types
 */
export const enumShape: ShapeDefinition = {
  id: 'enum',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;
    const values = (ctx.node.data?.values as string[]) || [];

    return calculateCompartmentBounds(ctx, {
      padding,
      lineHeight,
      header: {
        items: ['«enumeration»', ctx.node.label || ''],
      },
      compartments: [{ items: values }],
    });
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;
    const values = (ctx.node.data?.values as string[]) || [];

    return `<g class="enum-shape">${renderMultiCompartmentShape({
      ctx,
      position,
      bounds,
      lineHeight,
      padding,
      header: {
        items: ['«enumeration»', ctx.node.label || ''],
        style: { fontWeight: 'bold' },
      },
      compartments: [
        {
          items: values,
          align: 'start',
        },
      ],
    })}</g>`;
  },
};
