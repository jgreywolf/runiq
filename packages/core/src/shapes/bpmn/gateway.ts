import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';
import { getDataProperty } from '../../types.js';

/**
 * BPMN Gateway shape - represents a branching or merging point in a process.
 * Rendered as a diamond with optional markers (X for exclusive, + for parallel).
 */
export const bpmnGatewayShape: ShapeDefinition = {
  id: 'bpmnGateway',

  bounds() {
    // Gateways are square (displayed as diamond via rotation)
    const size = 50;
    return { width: size, height: size };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    const halfWidth = bounds.width / 2;
    const halfHeight = bounds.height / 2;

    return [
      { x: halfWidth, y: 0, name: 'top' },
      { x: bounds.width, y: halfHeight, name: 'right' },
      { x: halfWidth, y: bounds.height, name: 'bottom' },
      { x: 0, y: halfHeight, name: 'left' },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const fill = ctx.style.fill || '#ffffff';
    const stroke = ctx.style.stroke || '#000000';
    const strokeWidth = ctx.style.strokeWidth || 2;

    // Diamond shape
    const path = `M ${x + w / 2},${y} L ${x + w},${y + h / 2} L ${x + w / 2},${y + h} L ${x},${y + h / 2} Z`;
    let svg = `<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;

    // Gateway type marker (handles parser's { values: [...] } format)
    const gatewayType = getDataProperty<string>(
      ctx.node.data,
      'gatewayType',
      'exclusive'
    );
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    const markerSize = w * 0.5;

    if (gatewayType === 'exclusive') {
      // X marker for exclusive gateway
      const offset = markerSize / 2;
      svg += `<path d="M ${centerX - offset},${centerY - offset} L ${centerX + offset},${centerY + offset} M ${centerX + offset},${centerY - offset} L ${centerX - offset},${centerY + offset}" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>`;
    } else if (gatewayType === 'parallel') {
      // + marker for parallel gateway
      const offset = markerSize / 2;
      svg += `<path d="M ${centerX},${centerY - offset} L ${centerX},${centerY + offset} M ${centerX - offset},${centerY} L ${centerX + offset},${centerY}" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round"/>`;
    } else if (gatewayType === 'inclusive') {
      // O marker for inclusive gateway
      svg += `<circle cx="${centerX}" cy="${centerY}" r="${markerSize / 2.5}" fill="none" stroke="${stroke}" stroke-width="2.5"/>`;
    }

    return svg;
  },
};
