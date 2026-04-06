import { describe, expect, it } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { fileShape, fileTreeShape, folderShape } from './fileTree.js';

const ctx = (label: string, data?: Record<string, unknown>): ShapeRenderContext =>
  ({
    node: {
      id: label.toLowerCase().replace(/\s+/g, '-'),
      type: 'shape',
      label,
      data,
    },
    styles: {},
    style: {},
    measureText: (text, style) => ({
      width: text.length * ((style?.fontSize as number) || 14) * 0.6,
      height: ((style?.fontSize as number) || 14) * 1.2,
    }),
  }) as unknown as ShapeRenderContext;

describe('file tree shapes', () => {
  it('should render file tree root with folder glyph and divider', () => {
    const svg = fileTreeShape.render(ctx('runiq', { width: 420, height: 260 }), {
      x: 0,
      y: 0,
    });

    expect(svg).toContain('file-tree-root');
    expect(svg).toContain('runiq');
    expect(svg).toContain('<rect');
    expect(svg).toContain('<path');
  });

  it('should render folder label and icon', () => {
    const svg = folderShape.render(ctx('packages'), { x: 0, y: 0 });

    expect(svg).toContain('file-tree-folder');
    expect(svg).toContain('packages');
    expect(svg).toContain('<path');
  });

  it('should render file label and folded-corner glyph', () => {
    const svg = fileShape.render(ctx('README.md'), { x: 0, y: 0 });

    expect(svg).toContain('file-tree-file');
    expect(svg).toContain('README.md');
    expect(svg).toContain('<line');
  });
});
