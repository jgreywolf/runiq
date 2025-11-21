/**
 * Utility functions for creating schematic symbols
 */

export interface SymbolDefinition {
  id: string;
  width: number;
  height: number;
  terminals: { x: number; y: number; name: string }[]; // Connection points
  render: (x: number, y: number) => string; // SVG markup
}

/**
 * Create centered symbol at position with proper terminals
 */
export function createSymbol(
  id: string,
  width: number,
  height: number,
  terminals: { x: number; y: number; name: string }[],
  render: (cx: number, cy: number) => string
): SymbolDefinition {
  return {
    id,
    width,
    height,
    terminals,
    render: (x: number, y: number) => {
      const cx = x + width / 2;
      const cy = y + height / 2;
      return render(cx, cy);
    },
  };
}

/**
 * Get electrical wire path (orthogonal routing)
 */
export function getWirePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  routing: 'straight' | 'orthogonal' = 'orthogonal'
): string {
  if (routing === 'straight') {
    return `M ${x1},${y1} L ${x2},${y2}`;
  }

  // Orthogonal routing (Manhattan routing)
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Horizontal then vertical
  if (Math.abs(dx) > Math.abs(dy)) {
    return `M ${x1},${y1} L ${x2},${y1} L ${x2},${y2}`;
  }
  // Vertical then horizontal
  return `M ${x1},${y1} L ${x1},${y2} L ${x2},${y2}`;
}
