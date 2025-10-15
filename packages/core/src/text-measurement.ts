import type { Style } from './types.js';

// Basic text measurement - in a real app this would use canvas or DOM measurement
export function measureText(
  text: string,
  style: Style
): { width: number; height: number } {
  const fontSize = style.fontSize || 14;

  // Rough approximation - real implementation would use canvas measureText
  const avgCharWidth = fontSize * 0.6; // approximate character width
  const lineHeight = fontSize * 1.2; // approximate line height

  const lines = text.split('\n');
  const width = Math.max(...lines.map((line) => line.length * avgCharWidth));
  const height = lines.length * lineHeight;

  return { width, height };
}

export function createTextMeasurer() {
  return measureText;
}
