import type { ShapeDefinition, ShapeRenderContext } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
} from '../utils/index.js';
import { renderShapeLabel } from '../utils/render-label.js';

// Maximum width for note shapes to prevent layout issues
const MAX_WIDTH = 500;
const MIN_WIDTH = 100;

/**
 * Wrap text to fit within a maximum width by breaking into multiple lines.
 * Uses greedy algorithm to fit as many words as possible per line.
 */
function wrapText(
  ctx: ShapeRenderContext,
  text: string,
  maxWidth: number,
  padding: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  const availableWidth = maxWidth - padding * 2;

  for (const word of words) {
    const wordSize = ctx.measureText(word, ctx.style);
    if (wordSize.width > availableWidth) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }

      let chunk = '';
      for (const char of word) {
        const testChunk = chunk + char;
        const testSize = ctx.measureText(testChunk, ctx.style);
        if (testSize.width <= availableWidth || chunk === '') {
          chunk = testChunk;
        } else {
          lines.push(chunk);
          chunk = char;
        }
      }

      if (chunk) {
        lines.push(chunk);
      }
      continue;
    }

    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testSize = ctx.measureText(testLine, ctx.style);

    if (testSize.width <= availableWidth) {
      currentLine = testLine;
    } else {
      // Word doesn't fit, start new line
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Single word exceeds width, add it anyway (prevent infinite loop)
        lines.push(word);
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [''];
}

/**
 * UML Note shape
 * Displays a note/comment with a dog-eared corner
 * Used in all UML diagrams to add annotations and comments
 */
export const noteShape: ShapeDefinition = {
  id: 'note',

  bounds(ctx) {
    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;

    // Get label text
    const labelText = ctx.node.label || '';

    const maxAllowedWidth =
      typeof ctx.node.data?.maxWidth === 'number'
        ? ctx.node.data.maxWidth
        : MAX_WIDTH;

    // Respect provided lines but still wrap any line that exceeds max width.
    const rawLines =
      (ctx.node.data?.lines as string[] | undefined) ??
      (labelText ? [labelText] : ['']);
    const lines: string[] = [];
    let didWrap = false;

    for (const line of rawLines) {
      if (!line) {
        lines.push('');
        continue;
      }

      const lineSize = ctx.measureText(line, ctx.style);
      const naturalWidth = lineSize.width + padding * 2;

      if (naturalWidth > maxAllowedWidth) {
        const wrapped = wrapText(ctx, line, maxAllowedWidth, padding);
        lines.push(...wrapped);
        if (wrapped.length > 1 || wrapped[0] !== line) {
          didWrap = true;
        }
      } else {
        lines.push(line);
      }
    }

    if (didWrap) {
      if (!ctx.node.data) {
        (ctx.node as any).data = {};
      }
      (ctx.node.data as any).wrappedLines = lines;
    }

    // Calculate width based on longest line
    let maxLineWidth = 0;
    lines.forEach((line) => {
      const lineSize = ctx.measureText(line, ctx.style);
      maxLineWidth = Math.max(maxLineWidth, lineSize.width);
    });

    const width = maxLineWidth + padding * 2;
    const height = padding * 2 + lines.length * lineHeight;

    // Apply constraints
    const constrainedWidth = Math.max(
      MIN_WIDTH,
      Math.min(width, maxAllowedWidth)
    );

    return { width: constrainedWidth, height: Math.max(height, 60) };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const w = bounds.width;
    const h = bounds.height;

    const padding = ctx.style.padding || 12;
    const lineHeight = (ctx.style.fontSize || 14) + 4;
    const dogEarSize = 12; // Size of the folded corner

    // Notes typically have a light yellow background
    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#ffffcc',
      defaultStroke: '#000000',
    });

    let svg = `<g class="note-shape">`;

    // Note shape with dog-eared corner (top-right)
    svg += `<path d="`;
    svg += `M ${x} ${y} `;
    svg += `L ${x + w - dogEarSize} ${y} `;
    svg += `L ${x + w} ${y + dogEarSize} `;
    svg += `L ${x + w} ${y + h} `;
    svg += `L ${x} ${y + h} `;
    svg += `Z" `;
    svg += `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Dog-ear fold line
    svg += `<path d="`;
    svg += `M ${x + w - dogEarSize} ${y} `;
    svg += `L ${x + w - dogEarSize} ${y + dogEarSize} `;
    svg += `L ${x + w} ${y + dogEarSize}" `;
    svg += `fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" />`;

    // Text content - use wrappedLines if available, otherwise fall back to lines or label
    const lines = (ctx.node.data?.wrappedLines as string[]) ||
      (ctx.node.data?.lines as string[]) || [ctx.node.label || ''];

    // Render multiline text using \n (renderShapeLabel handles this)
    const multilineText = lines.join('\n');
    const textY = y + h / 2;

    const textStyle = { ...ctx.style, color: stroke };
    svg += renderShapeLabel(
      { ...ctx, style: textStyle },
      multilineText,
      x + padding,
      textY,
      'start',
      'middle'
    );

    svg += `</g>`;
    return svg;
  },
};
