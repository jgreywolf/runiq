/**
 * Node.js text measurement using heuristics
 * Lightweight implementation without canvas dependencies
 *
 * This is a fast approximation suitable for server-side rendering
 * where pixel-perfect accuracy isn't required.
 */
import type { Style } from '../types.js';

/**
 * Character width ratios relative to font size
 * Based on average proportions for common fonts
 */
const CHAR_WIDTH_RATIOS: Record<string, number> = {
  // Narrow characters
  i: 0.3,
  l: 0.3,
  I: 0.3,
  j: 0.3,
  t: 0.4,
  f: 0.4,
  r: 0.4,

  // Wide characters
  W: 0.9,
  M: 0.9,
  m: 0.8,
  w: 0.8,

  // Punctuation and symbols
  ' ': 0.3,
  '.': 0.3,
  ',': 0.3,
  ':': 0.3,
  ';': 0.3,
  '!': 0.3,
  '|': 0.3,

  // Default for other characters
  default: 0.6,
};

function estimateCharWidth(char: string, fontSize: number): number {
  const ratio = CHAR_WIDTH_RATIOS[char] || CHAR_WIDTH_RATIOS['default'];
  return fontSize * ratio;
}

export function measureText(
  text: string,
  style: Style
): { width: number; height: number } {
  const fontSize = style.fontSize || 14;
  const lineHeight = fontSize * 1.2;

  const lines = text.split('\n');
  let maxWidth = 0;

  for (const line of lines) {
    let lineWidth = 0;
    for (const char of line) {
      lineWidth += estimateCharWidth(char, fontSize);
    }
    maxWidth = Math.max(maxWidth, lineWidth);
  }

  return {
    width: maxWidth,
    height: lines.length * lineHeight,
  };
}

export function createTextMeasurer() {
  return measureText;
}
