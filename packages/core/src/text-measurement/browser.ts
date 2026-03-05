/**
 * Browser-based text measurement using Canvas API
 * Provides accurate text measurements for web environments
 */
import type { Style } from '../types/index.js';

let canvas: HTMLCanvasElement | null = null;
let context: CanvasRenderingContext2D | null = null;

function getContext(): CanvasRenderingContext2D {
  if (!context) {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new Error(
        'Browser text measurement requires a browser environment'
      );
    }
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to create canvas context');
    }
  }
  return context;
}

export function measureText(
  text: string,
  style: Style
): { width: number; height: number } {
  const ctx = getContext();

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

export function createTextMeasurer() {
  return measureText;
}
