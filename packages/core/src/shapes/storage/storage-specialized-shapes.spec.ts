import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types.js';
import {
  hCylinderShape,
  diskStorageShape,
  storedDataShape,
  internalStorageShape,
} from './index.js';
import { notchedPentagonShape } from '../rect-variants/index.js';
import { forkJoinShape, lightningBoltShape } from '../special/index.js';

// Mock context helper
function createMockContext(label: string): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: 'rect',
      label,
    },
    style: {
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
      font: 'sans-serif',
      fontSize: 14,
      padding: 12,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Storage & Specialized Shapes (TDD)', () => {
  describe('H-Cylinder (Horizontal Database)', () => {
    it('should have id h-cyl', () => {
      expect(hCylinderShape.id).toBe('hCylinder');
    });

    it('should calculate bounds with ellipse space', () => {
      const ctx = createMockContext('DB');
      const bounds = hCylinderShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(100);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Storage');
      const anchors = hCylinderShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render horizontal cylinder', () => {
      const ctx = createMockContext('Data');
      const svg = hCylinderShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<g>');
      expect(svg).toContain('<ellipse');
    });

    it('should have vertical ellipses on left and right', () => {
      const ctx = createMockContext('HDB');
      const svg = hCylinderShape.render(ctx, { x: 0, y: 0 });

      const ellipseCount = (svg.match(/<ellipse/g) || []).length;
      expect(ellipseCount).toBe(2); // Left and right ellipses
    });
  });

  describe('Disk Storage', () => {
    it('should have id disk', () => {
      expect(diskStorageShape.id).toBe('diskStorage');
    });

    it('should calculate bounds for disk shape', () => {
      const ctx = createMockContext('Disk');
      const bounds = diskStorageShape.bounds(ctx);

      expect(bounds.height).toBeLessThanOrEqual(50); // Short
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Storage');
      const anchors = diskStorageShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render flattened cylinder (disk)', () => {
      const ctx = createMockContext('Platter');
      const svg = diskStorageShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<g>');
      expect(svg).toContain('<ellipse'); // Top ellipse
      expect(svg).toContain('<path'); // Bottom curve
    });

    it('should be wider than tall', () => {
      const ctx = createMockContext('Disk');
      const bounds = diskStorageShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(bounds.height);
    });
  });

  describe('Stored Data (Bow-tie)', () => {
    it('should have id bow-tie', () => {
      expect(storedDataShape.id).toBe('storedData');
    });

    it('should calculate bounds for curved sides', () => {
      const ctx = createMockContext('Tape');
      const bounds = storedDataShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Data');
      const anchors = storedDataShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render bow-tie shape with curved sides', () => {
      const ctx = createMockContext('Sequential');
      const svg = storedDataShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
      expect(svg).toContain('Q'); // Quadratic curves
    });

    it('should have inward curves on left and right', () => {
      const ctx = createMockContext('Store');
      const svg = storedDataShape.render(ctx, { x: 0, y: 0 });

      // Should have path with curves
      expect(svg).toContain('d="M');
      expect(svg).toContain('Q'); // Quadratic curve commands
    });
  });

  describe('Internal Storage', () => {
    it('should have id int-storage', () => {
      expect(internalStorageShape.id).toBe('internalStorage');
    });

    it('should calculate standard bounds', () => {
      const ctx = createMockContext('Memory');
      const bounds = internalStorageShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Buffer');
      const anchors = internalStorageShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render rectangle with internal divisions', () => {
      const ctx = createMockContext('RAM');
      const svg = internalStorageShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<line'); // Division lines
    });

    it('should have window-pane pattern', () => {
      const ctx = createMockContext('Int');
      const svg = internalStorageShape.render(ctx, { x: 0, y: 0 });

      const lineCount = (svg.match(/<line/g) || []).length;
      expect(lineCount).toBe(2); // Horizontal and vertical lines
    });
  });

  describe('Notched Pentagon (Loop Limit)', () => {
    it('should have id notch-pent', () => {
      expect(notchedPentagonShape.id).toBe('notchedPentagon');
    });

    it('should calculate bounds for pentagon', () => {
      const ctx = createMockContext('Loop');
      const bounds = notchedPentagonShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Limit');
      const anchors = notchedPentagonShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].y).toBeGreaterThan(0); // Top anchor below notch
    });

    it('should render pentagon with notch', () => {
      const ctx = createMockContext('For');
      const svg = notchedPentagonShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      expect(svg).toContain('points=');
    });

    it('should have 8 points for notched shape', () => {
      const ctx = createMockContext('While');
      const svg = notchedPentagonShape.render(ctx, { x: 0, y: 0 });

      const pointsMatch = svg.match(/points="([^"]+)"/);
      expect(pointsMatch).toBeTruthy();
      if (pointsMatch) {
        const coords = pointsMatch[1].split(' ');
        expect(coords).toHaveLength(8); // 8 points for notched pentagon
      }
    });
  });

  describe('Lightning Bolt', () => {
    it('should have id lightning', () => {
      expect(lightningBoltShape.id).toBe('lightning');
    });

    it('should calculate bounds for zigzag shape', () => {
      const ctx = createMockContext('Zap');
      const bounds = lightningBoltShape.bounds(ctx);

      expect(bounds.height).toBeGreaterThanOrEqual(80); // Tall
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Event');
      const anchors = lightningBoltShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render lightning bolt path', () => {
      const ctx = createMockContext('Power');
      const svg = lightningBoltShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      expect(svg).toContain('points=');
    });

    it('should have zigzag pattern', () => {
      const ctx = createMockContext('Bolt');
      const svg = lightningBoltShape.render(ctx, { x: 0, y: 0 });

      const pointsMatch = svg.match(/points="([^"]+)"/);
      expect(pointsMatch).toBeTruthy();
      if (pointsMatch) {
        const coords = pointsMatch[1].split(' ');
        expect(coords.length).toBeGreaterThanOrEqual(7); // Classic 7-point lightning bolt
      }
    });
  });

  describe('Fork/Join', () => {
    it('should have id fork', () => {
      expect(forkJoinShape.id).toBe('fork');
    });

    it('should calculate bounds for thick line', () => {
      const ctx = createMockContext('Split');
      const bounds = forkJoinShape.bounds(ctx);

      expect(bounds.height).toBeLessThanOrEqual(30); // Very short
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Join');
      const anchors = forkJoinShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render thick horizontal bar', () => {
      const ctx = createMockContext('Parallel');
      const svg = forkJoinShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
    });

    it('should be very wide and short', () => {
      const ctx = createMockContext('Fork');
      const bounds = forkJoinShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(120);
      expect(bounds.height).toBeLessThan(bounds.width / 4); // Much wider than tall
    });
  });
});
