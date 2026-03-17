import type { ShapeDefinition } from '../../types/index.js';
import {
  calculateRectangularAnchors,
  extractBasicStyles,
  renderShapeLabel,
} from '../utils/index.js';
import { getDataProperty } from '../../types/shape-types.js';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180"%3E%3Crect width="100%25" height="100%25" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="18" fill="%236b7280" text-anchor="middle" dominant-baseline="middle"%3ENo image src%3C/text%3E%3C/svg%3E';

function getImageSource(raw: unknown): string {
  if (typeof raw !== 'string') return PLACEHOLDER_IMAGE;
  const src = raw.trim();
  if (!src) return PLACEHOLDER_IMAGE;

  // Keep image loading constrained to safe URL families.
  if (
    src.startsWith('https://') ||
    src.startsWith('http://') ||
    src.startsWith('data:image/')
  ) {
    return src;
  }

  return PLACEHOLDER_IMAGE;
}

export const imageShape: ShapeDefinition = {
  id: 'image',

  bounds(ctx) {
    const width = Number(getDataProperty(ctx.node.data, 'width', 220)) || 220;
    const height = Number(getDataProperty(ctx.node.data, 'height', 140)) || 140;
    return { width, height };
  },

  anchors(ctx) {
    return calculateRectangularAnchors(ctx, this.bounds(ctx));
  },

  render(ctx, position) {
    const bounds = this.bounds(ctx);
    const { x, y } = position;
    const src = getImageSource(getDataProperty(ctx.node.data, 'src'));
    const preserveAspectRatio =
      String(getDataProperty(ctx.node.data, 'preserveAspectRatio', 'xMidYMid slice')) ||
      'xMidYMid slice';

    const { fill, stroke, strokeWidth } = extractBasicStyles(ctx, {
      defaultFill: '#f8fafc',
      defaultStroke: '#94a3b8',
    });

    const clipId = `img-clip-${ctx.node.id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const label = ctx.node.label || '';
    const labelY = y + bounds.height - 12;
    const labelCtx = { ...ctx, style: { ...ctx.style, color: '#fff' } };

    return `
      <defs>
        <clipPath id="${clipId}">
          <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}" rx="8" />
        </clipPath>
      </defs>
      <rect x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
            rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />
      <image href="${src}" x="${x}" y="${y}" width="${bounds.width}" height="${bounds.height}"
             clip-path="url(#${clipId})" preserveAspectRatio="${preserveAspectRatio}" />
      ${
        label
          ? renderShapeLabel(labelCtx, label, x + bounds.width / 2, labelY)
          : ''
      }
    `;
  },
};
