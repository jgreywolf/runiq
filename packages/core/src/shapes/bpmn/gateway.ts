import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import { getDataProperty } from '../../types/index.js';
import { extractBasicStyles } from '../utils/index.js';

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

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffff',
      defaultStroke: '#000000',
      defaultStrokeWidth: 2,
    });

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

    if (gatewayType === 'exclusive' || gatewayType === 'xor') {
      // X marker for exclusive gateway (XOR)
      const offset = markerSize / 2;
      svg += `<path d="M ${centerX - offset},${centerY - offset} L ${centerX + offset},${centerY + offset} M ${centerX + offset},${centerY - offset} L ${centerX - offset},${centerY + offset}" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>`;
    } else if (gatewayType === 'parallel' || gatewayType === 'and') {
      // + marker for parallel gateway (AND)
      const offset = markerSize / 2;
      svg += `<path d="M ${centerX},${centerY - offset} L ${centerX},${centerY + offset} M ${centerX - offset},${centerY} L ${centerX + offset},${centerY}" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round"/>`;
    } else if (gatewayType === 'inclusive' || gatewayType === 'or') {
      // O marker for inclusive gateway (OR)
      svg += `<circle cx="${centerX}" cy="${centerY}" r="${markerSize / 2.5}" fill="none" stroke="${stroke}" stroke-width="2.5"/>`;
    } else if (gatewayType === 'eventBased' || gatewayType === 'event') {
      // Pentagon/double circle for event-based gateway
      // Outer circle
      svg += `<circle cx="${centerX}" cy="${centerY}" r="${markerSize / 2.2}" fill="none" stroke="${stroke}" stroke-width="1.5"/>`;
      // Inner pentagon
      const pentagonRadius = markerSize / 3.5;
      const angles = [0, 72, 144, 216, 288]; // Pentagon angles
      const pentagonPoints = angles
        .map((angle) => {
          const rad = ((angle - 90) * Math.PI) / 180; // Start from top
          return `${centerX + pentagonRadius * Math.cos(rad)},${centerY + pentagonRadius * Math.sin(rad)}`;
        })
        .join(' ');
      svg += `<polygon points="${pentagonPoints}" fill="none" stroke="${stroke}" stroke-width="1.5"/>`;
    } else if (gatewayType === 'complex') {
      // Asterisk (*) marker for complex gateway
      const offset = markerSize / 2;
      const diagonalOffset = offset * 0.707; // cos(45°)
      // Vertical and horizontal lines
      svg += `<path d="M ${centerX},${centerY - offset} L ${centerX},${centerY + offset} M ${centerX - offset},${centerY} L ${centerX + offset},${centerY}" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>`;
      // Diagonal lines
      svg += `<path d="M ${centerX - diagonalOffset},${centerY - diagonalOffset} L ${centerX + diagonalOffset},${centerY + diagonalOffset} M ${centerX + diagonalOffset},${centerY - diagonalOffset} L ${centerX - diagonalOffset},${centerY + diagonalOffset}" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>`;
    }

    return svg;
  },
};
