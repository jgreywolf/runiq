/**
 * Common SVG rendering utilities for schematic symbols
 *
 * This module provides reusable rendering functions to eliminate duplication
 * across electrical, hydraulic, and pneumatic symbol definitions.
 */

// ============================================================================
// Standard Attributes & Styling
// ============================================================================

export interface SymbolStyle {
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
}

export const DEFAULT_STYLE: Required<SymbolStyle> = {
  strokeColor: 'currentColor',
  strokeWidth: 2.5,
  fillColor: 'white',
};

/**
 * Generate style attributes string from options
 */
export function styleAttrs(style: SymbolStyle = {}): string {
  const s = { ...DEFAULT_STYLE, ...style };
  return `stroke="${s.strokeColor}" stroke-width="${s.strokeWidth}" fill="${s.fillColor}"`;
}

// ============================================================================
// Basic Geometric Shapes
// ============================================================================

/**
 * Render a circle body (commonly used in motors, pumps, valves)
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param radius Circle radius
 * @param style Optional styling overrides
 */
export function renderCircleBody(
  cx: number,
  cy: number,
  radius: number,
  style: SymbolStyle = {}
): string {
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" ${styleAttrs(style)}/>`;
}

/**
 * Render a rectangle body (commonly used in valves, components)
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param width Rectangle width
 * @param height Rectangle height
 * @param style Optional styling overrides
 */
export function renderRectangleBody(
  cx: number,
  cy: number,
  width: number,
  height: number,
  style: SymbolStyle = {}
): string {
  const x = cx - width / 2;
  const y = cy - height / 2;
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" ${styleAttrs(style)}/>`;
}

// ============================================================================
// Connection Lines
// ============================================================================

/**
 * Render horizontal connection lines extending from a circular body
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param radius Circle radius
 * @param extension How far the lines extend beyond the circle
 * @param style Optional styling overrides
 */
export function renderHorizontalConnectionLines(
  cx: number,
  cy: number,
  radius: number,
  extension: number = 7,
  style: SymbolStyle = {}
): string {
  const sw = style.strokeWidth ?? DEFAULT_STYLE.strokeWidth;
  const sc = style.strokeColor ?? DEFAULT_STYLE.strokeColor;

  return `
    <!-- Left connection line -->
    <line x1="${cx - radius - extension}" y1="${cy}" x2="${cx - radius}" y2="${cy}"
      stroke="${sc}" stroke-width="${sw}"/>
    <!-- Right connection line -->
    <line x1="${cx + radius}" y1="${cy}" x2="${cx + radius + extension}" y2="${cy}"
      stroke="${sc}" stroke-width="${sw}"/>
  `;
}

/**
 * Render vertical connection lines extending from a circular body
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param radius Circle radius
 * @param extension How far the lines extend beyond the circle
 * @param style Optional styling overrides
 */
export function renderVerticalConnectionLines(
  cx: number,
  cy: number,
  radius: number,
  extension: number = 7,
  style: SymbolStyle = {}
): string {
  const sw = style.strokeWidth ?? DEFAULT_STYLE.strokeWidth;
  const sc = style.strokeColor ?? DEFAULT_STYLE.strokeColor;

  return `
    <!-- Top connection line -->
    <line x1="${cx}" y1="${cy - radius - extension}" x2="${cx}" y2="${cy - radius}"
      stroke="${sc}" stroke-width="${sw}"/>
    <!-- Bottom connection line -->
    <line x1="${cx}" y1="${cy + radius}" x2="${cx}" y2="${cy + radius + extension}"
      stroke="${sc}" stroke-width="${sw}"/>
  `;
}

/**
 * Render a single connection line from a point
 * @param x1 Start X coordinate
 * @param y1 Start Y coordinate
 * @param x2 End X coordinate
 * @param y2 End Y coordinate
 * @param style Optional styling overrides
 */
export function renderConnectionLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  style: SymbolStyle = {}
): string {
  const sw = style.strokeWidth ?? DEFAULT_STYLE.strokeWidth;
  const sc = style.strokeColor ?? DEFAULT_STYLE.strokeColor;

  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sc}" stroke-width="${sw}"/>`;
}

// ============================================================================
// Arrows & Direction Indicators
// ============================================================================

/**
 * Render a clockwise arrow (used in hydraulic/pneumatic motors and pumps)
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param size Arrow size (default: 18)
 * @param style Optional styling overrides
 */
export function renderClockwiseArrow(
  cx: number,
  cy: number,
  size: number = 18,
  style: SymbolStyle = {}
): string {
  const sw = style.strokeWidth ?? 1.5;
  const sc = style.strokeColor ?? DEFAULT_STYLE.strokeColor;

  const scale = size / 18; // Scale relative to default size
  const w = 8 * scale;
  const h1 = 5 * scale;
  const h2 = 10 * scale;

  return `<path d="M ${cx - w},${cy - h1} L ${cx + w - 5},${cy - h1} L ${cx + w - 5},${cy - h2} L ${cx + h2},${cy} L ${cx + w - 5},${cy + h2} L ${cx + w - 5},${cy + h1} L ${cx - w},${cy + h1}"
    stroke="${sc}" stroke-width="${sw}" fill="none"/>`;
}

/**
 * Render a counter-clockwise arrow
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param size Arrow size (default: 18)
 * @param style Optional styling overrides
 */
export function renderCounterClockwiseArrow(
  cx: number,
  cy: number,
  size: number = 18,
  style: SymbolStyle = {}
): string {
  const sw = style.strokeWidth ?? 1.5;
  const sc = style.strokeColor ?? DEFAULT_STYLE.strokeColor;

  const scale = size / 18;
  const w = 8 * scale;
  const h1 = 5 * scale;
  const h2 = 10 * scale;

  return `<path d="M ${cx + w},${cy - h1} L ${cx - w + 5},${cy - h1} L ${cx - w + 5},${cy - h2} L ${cx - h2},${cy} L ${cx - w + 5},${cy + h2} L ${cx - w + 5},${cy + h1} L ${cx + w},${cy + h1}"
    stroke="${sc}" stroke-width="${sw}" fill="none"/>`;
}

/**
 * Render a simple arrowhead pointing in a direction
 * @param x Arrow tip X coordinate
 * @param y Arrow tip Y coordinate
 * @param direction Arrow direction: 'up' | 'down' | 'left' | 'right'
 * @param size Arrow size (default: 8)
 * @param style Optional styling overrides
 */
export function renderArrowHead(
  x: number,
  y: number,
  direction: 'up' | 'down' | 'left' | 'right',
  size: number = 8,
  style: SymbolStyle = {}
): string {
  const sc = style.strokeColor ?? DEFAULT_STYLE.strokeColor;

  let path: string;
  switch (direction) {
    case 'up':
      path = `M ${x},${y} L ${x - size / 2},${y + size} L ${x + size / 2},${y + size} Z`;
      break;
    case 'down':
      path = `M ${x},${y} L ${x - size / 2},${y - size} L ${x + size / 2},${y - size} Z`;
      break;
    case 'left':
      path = `M ${x},${y} L ${x + size},${y - size / 2} L ${x + size},${y + size / 2} Z`;
      break;
    case 'right':
      path = `M ${x},${y} L ${x - size},${y - size / 2} L ${x - size},${y + size / 2} Z`;
      break;
  }

  return `<path d="${path}" fill="${sc}"/>`;
}

// ============================================================================
// Shaft & Mechanical Indicators
// ============================================================================

/**
 * Render a shaft line extending from a motor/pump (typically vertical)
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param radius Body radius
 * @param extension How far the shaft extends (default: 7)
 * @param style Optional styling overrides
 */
export function renderShaftLine(
  cx: number,
  cy: number,
  radius: number,
  extension: number = 7,
  style: SymbolStyle = {}
): string {
  const sw = style.strokeWidth ?? 3;
  const sc = style.strokeColor ?? DEFAULT_STYLE.strokeColor;

  return `<line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy - radius - extension}"
    stroke="${sc}" stroke-width="${sw}"/>`;
}

// ============================================================================
// Hydraulic/Pneumatic Specific Elements
// ============================================================================

/**
 * Render gear teeth indicators around a circle (for gear pumps/motors)
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param radius Circle radius
 * @param teethSize Size of gear teeth (default: 3)
 */
export function renderGearTeeth(
  cx: number,
  cy: number,
  radius: number,
  teethSize: number = 3
): string {
  return `
    <!-- Top tooth -->
    <path d="M ${cx},${cy - radius - teethSize} l 2,${teethSize} l -2,0 l -2,0 l 2,-${teethSize}" fill="currentColor"/>
    <!-- Right tooth -->
    <path d="M ${cx + radius + teethSize},${cy} l -${teethSize},2 l 0,-2 l 0,-2 l ${teethSize},2" fill="currentColor"/>
    <!-- Bottom tooth -->
    <path d="M ${cx},${cy + radius + teethSize} l 2,-${teethSize} l -2,0 l -2,0 l 2,${teethSize}" fill="currentColor"/>
    <!-- Left tooth -->
    <path d="M ${cx - radius - teethSize},${cy} l ${teethSize},2 l 0,-2 l 0,-2 l -${teethSize},2" fill="currentColor"/>
  `;
}

/**
 * Render a fixed displacement indicator (solid triangle)
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param radius Circle radius
 * @param position Position of triangle: 'left' | 'right' (default: 'left')
 */
export function renderFixedDisplacementIndicator(
  cx: number,
  cy: number,
  radius: number,
  position: 'left' | 'right' = 'left'
): string {
  if (position === 'left') {
    return `<polygon points="${cx - radius + 3},${cy - 12} ${cx - radius + 3},${cy + 12} ${cx - radius - 5},${cy}" fill="currentColor"/>`;
  } else {
    return `<polygon points="${cx + radius - 3},${cy - 12} ${cx + radius - 3},${cy + 12} ${cx + radius + 5},${cy}" fill="currentColor"/>`;
  }
}

/**
 * Render a variable displacement indicator (diagonal line)
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param radius Circle radius
 * @param position Position of line: 'left' | 'right' (default: 'left')
 * @param style Optional styling overrides
 */
export function renderVariableDisplacementIndicator(
  cx: number,
  cy: number,
  radius: number,
  position: 'left' | 'right' = 'left',
  style: SymbolStyle = {}
): string {
  const sw = style.strokeWidth ?? DEFAULT_STYLE.strokeWidth;
  const sc = style.strokeColor ?? DEFAULT_STYLE.strokeColor;

  if (position === 'left') {
    return `<line x1="${cx - radius + 3}" y1="${cy + 10}" x2="${cx - radius - 5}" y2="${cy - 10}"
      stroke="${sc}" stroke-width="${sw}"/>`;
  } else {
    return `<line x1="${cx + radius - 3}" y1="${cy + 10}" x2="${cx + radius + 5}" y2="${cy - 10}"
      stroke="${sc}" stroke-width="${sw}"/>`;
  }
}

// ============================================================================
// Text Labels & Annotations
// ============================================================================

/**
 * Render a small text label near a component
 * @param x X coordinate
 * @param y Y coordinate
 * @param text Label text
 * @param fontSize Font size (default: 7)
 */
export function renderLabel(
  x: number,
  y: number,
  text: string,
  fontSize: number = 7
): string {
  return `<text x="${x}" y="${y}" font-size="${fontSize}" fill="currentColor">${text}</text>`;
}

// ============================================================================
// Specialized Component Elements
// ============================================================================

/**
 * Render a spring indicator (zigzag pattern)
 * Commonly used in spring-return cylinders
 * @param x1 Start X coordinate
 * @param y1 Start Y coordinate
 * @param x2 End X coordinate
 * @param y2 End Y coordinate
 * @param coils Number of zigzag coils (default: 3)
 * @param style Optional styling
 */
export function renderSpring(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  coils: number = 3,
  style: SymbolStyle = {}
): string {
  const s = { ...DEFAULT_STYLE, strokeWidth: 1.5, fillColor: 'none', ...style };
  const dx = (x2 - x1) / (coils * 2);
  const dy = (y2 - y1) / (coils * 2);

  let path = `M ${x1},${y1}`;
  for (let i = 0; i < coils; i++) {
    path += ` l ${dx},${-dy} l ${dx},${dy * 2}`;
  }
  path += ` l ${dx},${-dy}`;

  return `<path d="${path}" stroke="${s.strokeColor}" stroke-width="${s.strokeWidth}" fill="${s.fillColor}"/>`;
}

/**
 * Render a valve spool position box
 * @param x X coordinate
 * @param y Y coordinate
 * @param width Box width
 * @param height Box height
 * @param filled Whether box is filled (active position)
 * @param style Optional styling
 */
export function renderSpool(
  x: number,
  y: number,
  width: number,
  height: number,
  filled: boolean = true,
  style: SymbolStyle = {}
): string {
  const s = { ...DEFAULT_STYLE, ...style };
  const fill = filled ? s.fillColor : 'none';
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" stroke="${s.strokeColor}" stroke-width="${s.strokeWidth}" fill="${fill}"/>`;
}

/**
 * Render a pilot line (dashed connection)
 * Used for pilot signals in valves
 * @param x1 Start X coordinate
 * @param y1 Start Y coordinate
 * @param x2 End X coordinate
 * @param y2 End Y coordinate
 * @param style Optional styling
 */
export function renderPilotLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  style: SymbolStyle = {}
): string {
  const s = { ...DEFAULT_STYLE, strokeWidth: 1.5, ...style };
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${s.strokeColor}" stroke-width="${s.strokeWidth}" stroke-dasharray="2,2"/>`;
}

/**
 * Render a filter mesh pattern
 * Used in air filters, vacuum filters, etc.
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param width Pattern width
 * @param height Pattern height
 * @param style Optional styling
 */
export function renderMeshPattern(
  cx: number,
  cy: number,
  width: number,
  height: number,
  style: SymbolStyle = {}
): string {
  const s = { ...DEFAULT_STYLE, strokeWidth: 1.5, fillColor: 'none', ...style };
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return `
    <path d="M ${cx - halfWidth},${cy - halfHeight} L ${cx},${cy - halfHeight * 0.6} L ${cx - halfWidth},${cy - halfHeight * 0.2}
             L ${cx},${cy} L ${cx - halfWidth},${cy + halfHeight * 0.2} L ${cx},${cy + halfHeight * 0.6} L ${cx - halfWidth},${cy + halfHeight}"
      stroke="${s.strokeColor}" stroke-width="${s.strokeWidth}" fill="${s.fillColor}"/>
    <path d="M ${cx + halfWidth},${cy - halfHeight} L ${cx},${cy - halfHeight * 0.6} L ${cx + halfWidth},${cy - halfHeight * 0.2}
             L ${cx},${cy} L ${cx + halfWidth},${cy + halfHeight * 0.2} L ${cx},${cy + halfHeight * 0.6} L ${cx + halfWidth},${cy + halfHeight}"
      stroke="${s.strokeColor}" stroke-width="${s.strokeWidth}" fill="${s.fillColor}"/>
  `;
}

/**
 * Render a valve seat line (blocking line in check valves)
 * @param x1 Start X coordinate
 * @param y1 Start Y coordinate
 * @param x2 End X coordinate
 * @param y2 End Y coordinate
 * @param style Optional styling
 */
export function renderSeatLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  style: SymbolStyle = {}
): string {
  const s = { ...DEFAULT_STYLE, strokeWidth: 1.5, ...style };
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${s.strokeColor}" stroke-width="${s.strokeWidth}"/>`;
}

/**
 * Render a port circle connection
 * Standard 2-unit radius port indicator
 * @param cx Center X coordinate
 * @param cy Center Y coordinate
 * @param radius Port radius (default: 2)
 */
export function renderPortCircle(
  cx: number,
  cy: number,
  radius: number = 2
): string {
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="currentColor"/>`;
}
