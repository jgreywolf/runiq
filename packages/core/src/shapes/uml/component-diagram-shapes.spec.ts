import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types';
import { componentShape } from './component';
import { artifactShape } from './artifact';
import { nodeShape } from './node';

function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: '@test',
      label,
      data,
    },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('UML Component Diagram Shapes', () => {
  describe('component', () => {
    it('should have correct shape id', () => {
      expect(componentShape.id).toBe('component');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('UserService');
      const bounds = componentShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('UserService');
      const anchors = componentShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].id).toBe('top');
      expect(anchors[1].id).toBe('right');
      expect(anchors[2].id).toBe('bottom');
      expect(anchors[3].id).toBe('left');
    });

    it('should render rectangle with component symbol', () => {
      const ctx = createMockContext('UserService');
      const svg = componentShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('rx="4"'); // Rounded corners
      expect(svg).toContain('UserService');
      // Should have small rectangles for component symbol
      expect(svg).toContain('width="16"');
      expect(svg).toContain('height="8"');
    });

    it('should handle empty label', () => {
      const ctx = createMockContext('');
      const bounds = componentShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should apply style properties', () => {
      const ctx = createMockContext('Service', {
        backgroundColor: '#e3f2fd',
        borderColor: '#1976d2',
      });
      const svg = componentShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('#e3f2fd');
      expect(svg).toContain('#1976d2');
    });
  });

  describe('artifact', () => {
    it('should have correct shape id', () => {
      expect(artifactShape.id).toBe('artifact');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('config.xml');
      const bounds = artifactShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('config.xml');
      const anchors = artifactShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].id).toBe('top');
      expect(anchors[1].id).toBe('right');
      expect(anchors[2].id).toBe('bottom');
      expect(anchors[3].id).toBe('left');
    });

    it('should render rectangle with dog-eared corner', () => {
      const ctx = createMockContext('config.xml');
      const svg = artifactShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // Dog-eared corner uses path
      expect(svg).toContain('config.xml');
      expect(svg).toContain('«artifact»'); // Stereotype
    });

    it('should handle empty label', () => {
      const ctx = createMockContext('');
      const bounds = artifactShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should include stereotype in rendering', () => {
      const ctx = createMockContext('library.jar');
      const svg = artifactShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('«artifact»');
      expect(svg).toContain('library.jar');
    });

    it('should apply style properties', () => {
      const ctx = createMockContext('file.xml', {
        backgroundColor: '#fff8e1',
        borderColor: '#f57f17',
      });
      const svg = artifactShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('#fff8e1');
      expect(svg).toContain('#f57f17');
    });
  });

  describe('node', () => {
    it('should have correct shape id', () => {
      expect(nodeShape.id).toBe('node');
    });

    it('should calculate bounds with label', () => {
      const ctx = createMockContext('Application Server');
      const bounds = nodeShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Database Server');
      const anchors = nodeShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].id).toBe('top');
      expect(anchors[1].id).toBe('right');
      expect(anchors[2].id).toBe('bottom');
      expect(anchors[3].id).toBe('left');
    });

    it('should render 3D cube shape', () => {
      const ctx = createMockContext('Web Server');
      const svg = artifactShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // 3D cube uses path
      expect(svg).toContain('Web Server');
    });

    it('should handle empty label', () => {
      const ctx = createMockContext('');
      const bounds = nodeShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should include stereotype «device»', () => {
      const ctx = createMockContext('Server');
      const svg = nodeShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('«device»');
      expect(svg).toContain('Server');
    });

    it('should apply style properties', () => {
      const ctx = createMockContext('Node', {
        backgroundColor: '#f3e5f5',
        borderColor: '#7b1fa2',
      });
      const svg = nodeShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('#f3e5f5');
      expect(svg).toContain('#7b1fa2');
    });
  });
});
