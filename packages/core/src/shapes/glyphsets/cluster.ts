import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Cluster Shape
 *
 * Renders a central circle with satellite circles arranged radially around it.
 * Used by the cluster glyphset to show hub-and-spoke relationships.
 *
 * Data structure:
 * {
 *   center: { label: string, color: string },
 *   satellites: Array<{ label: string, color: string }>
 * }
 */

const CENTER_RADIUS = 50;
const SATELLITE_RADIUS = 35;
const ORBIT_RADIUS = 150; // Distance from center to satellites
const LABEL_PADDING = 15; // Extra space for labels outside circles

/**
 * Wrap text to fit within a circle
 * For circles, we need shorter lines than rectangles
 */
function wrapText(text: string, maxChars: number = 10): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length === 0) {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxChars) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Render a circle with centered multi-line text
 */
function renderCircle(
  x: number,
  y: number,
  radius: number,
  color: string,
  label: string
): string {
  const lines = wrapText(label, 10);
  const lineHeight = 14;
  const totalTextHeight = lines.length * lineHeight;
  const startY = y - totalTextHeight / 2 + lineHeight / 2;

  // Circle
  let svg = `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" stroke="#333" stroke-width="2"/>`;

  // Text lines
  lines.forEach((line, i) => {
    const textY = startY + i * lineHeight;
    svg += `<text x="${x}" y="${textY}" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-size="12" font-weight="500">${line}</text>`;
  });

  return svg;
}

/**
 * Render a line connecting center to satellite
 */
function renderConnection(
  centerX: number,
  centerY: number,
  satelliteX: number,
  satelliteY: number
): string {
  return `<line x1="${centerX}" y1="${centerY}" x2="${satelliteX}" y2="${satelliteY}" stroke="#999" stroke-width="2"/>`;
}

export const cluster: ShapeDefinition = {
  id: 'cluster',

  bounds(ctx: ShapeRenderContext) {
    const data = ctx.node.data as any;
    const satelliteCount = data?.satellites?.length || 3;

    // Canvas needs to fit:
    // - Center circle (CENTER_RADIUS)
    // - Orbit radius (ORBIT_RADIUS)
    // - Satellite circles (SATELLITE_RADIUS)
    // - Label padding (LABEL_PADDING)
    const totalRadius = ORBIT_RADIUS + SATELLITE_RADIUS + LABEL_PADDING;
    const size = totalRadius * 2;

    return {
      width: size,
      height: size,
    };
  },

  anchors(ctx: ShapeRenderContext) {
    const bounds = this.bounds(ctx);
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    // Return 4 cardinal direction anchors at the outer edge
    return [
      { id: 'top', x: centerX, y: 0 },
      { id: 'right', x: bounds.width, y: centerY },
      { id: 'bottom', x: centerX, y: bounds.height },
      { id: 'left', x: 0, y: centerY },
    ];
  },

  render(ctx: ShapeRenderContext, position: { x: number; y: number }) {
    const data = ctx.node.data as any;

    // Validate data structure
    if (!data || !data.center || !data.satellites) {
      return `<text x="${position.x}" y="${position.y}" fill="red">Invalid cluster data</text>`;
    }

    const centerLabel = data.center.label || 'Center';
    const centerColor = data.center.color || '#4472C4';
    const satellites = data.satellites || [];

    const bounds = this.bounds(ctx);
    const canvasWidth = bounds.width;
    const canvasHeight = bounds.height;

    // Center of canvas
    const centerX = position.x + canvasWidth / 2;
    const centerY = position.y + canvasHeight / 2;

    let svg = '';

    // Calculate positions for satellites in a circle
    const satelliteCount = satellites.length;
    const angleStep = (2 * Math.PI) / satelliteCount;
    const startAngle = -Math.PI / 2; // Start at top

    // First render all connection lines (so they appear behind circles)
    satellites.forEach((satellite: any, index: number) => {
      const angle = startAngle + index * angleStep;
      const satelliteX = centerX + ORBIT_RADIUS * Math.cos(angle);
      const satelliteY = centerY + ORBIT_RADIUS * Math.sin(angle);

      svg += renderConnection(centerX, centerY, satelliteX, satelliteY);
    });

    // Render satellite circles
    satellites.forEach((satellite: any, index: number) => {
      const angle = startAngle + index * angleStep;
      const satelliteX = centerX + ORBIT_RADIUS * Math.cos(angle);
      const satelliteY = centerY + ORBIT_RADIUS * Math.sin(angle);

      svg += renderCircle(
        satelliteX,
        satelliteY,
        SATELLITE_RADIUS,
        satellite.color || '#ED7D31',
        satellite.label || `Item ${index + 1}`
      );
    });

    // Render center circle last (on top)
    svg += renderCircle(
      centerX,
      centerY,
      CENTER_RADIUS,
      centerColor,
      centerLabel
    );

    return svg;
  },
};
