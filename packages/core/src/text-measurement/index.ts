/**
 * Auto-detecting text measurement
 * Uses browser implementation by default, falls back to Node.js heuristic
 */
import type { Style } from '../types.js';

// Simple heuristic implementation (used as fallback)
function heuristicMeasureText(
  text: string,
  style: Style
): { width: number; height: number } {
  const fontSize = style.fontSize || 14;
  const avgCharWidth = fontSize * 0.6;
  const lineHeight = fontSize * 1.2;

  const lines = text.split('\n');
  const width = Math.max(...lines.map((line) => line.length * avgCharWidth));
  const height = lines.length * lineHeight;

  return { width, height };
}

// Detect browser environment
const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

export function measureText(
  text: string,
  style: Style
): { width: number; height: number } {
  // In browser, use canvas for accurate measurement
  if (isBrowser) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const fontSize = style.fontSize || 14;
        const fontFamily = style.fontFamily || 'Arial, sans-serif';
        const fontWeight = style.fontWeight || 'normal';

        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

        const lines = text.split('\n');
        const lineHeight = fontSize * 1.2;

        let maxWidth = 0;
        for (const line of lines) {
          const metrics = ctx.measureText(line);
          maxWidth = Math.max(maxWidth, metrics.width);
        }

        return {
          width: maxWidth,
          height: lines.length * lineHeight,
        };
      }
    } catch {
      // Fall through to heuristic
    }
  }

  // Node.js or fallback: use heuristic
  return heuristicMeasureText(text, style);
}

export function createTextMeasurer() {
  return measureText;
}
