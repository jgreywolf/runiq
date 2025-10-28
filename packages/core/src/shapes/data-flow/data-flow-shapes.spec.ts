import { describe, it, expect } from 'vitest';
import {
  externalEntityShape,
  externalEntityCornerShape,
  processCircleShape,
  dataStoreLineShape,
  dataStoreLeftShape,
  dataStoreOpenShape,
} from './index.js';
import type { ShapeRenderContext } from '../../types.js';

// Mock render context helper
function createMockContext(
  label: string = 'Test',
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
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Data Flow Shapes', () => {
  describe('externalEntityShape', () => {
    it('should have correct id', () => {
      expect(externalEntityShape.id).toBe('external-entity');
    });

    it('should calculate bounds based on text', () => {
      const ctx = createMockContext('Entity');
      const bounds = externalEntityShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = externalEntityShape.anchors?.(ctx) || [];

      expect(anchors).toHaveLength(4);
      expect(anchors.map(a => a.name)).toEqual(['top', 'right', 'bottom', 'left']);
    });

    it('should render as simple rectangle', () => {
      const ctx = createMockContext('Entity');
      const svg = externalEntityShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<text');
    });
  });

  describe('externalEntityCornerShape', () => {
    it('should have correct id', () => {
      expect(externalEntityCornerShape.id).toBe('external-entity-corner');
    });

    it('should render rectangle with corner overlap effect', () => {
      const ctx = createMockContext('System');
      const svg = externalEntityCornerShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<path'); // Corner overlap
      expect(svg).toContain('<text');
    });
  });

  describe('processCircleShape', () => {
    it('should have correct id', () => {
      expect(processCircleShape.id).toBe('process-circle');
    });

    it('should calculate circular bounds', () => {
      const ctx = createMockContext('Process');
      const bounds = processCircleShape.bounds(ctx);

      // Should be roughly square for a circle
      expect(Math.abs(bounds.width - bounds.height)).toBeLessThan(1);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext();
      const anchors = processCircleShape.anchors?.(ctx) || [];

      expect(anchors).toHaveLength(4);
      expect(anchors.map(a => a.name)).toEqual(['top', 'right', 'bottom', 'left']);
    });

    it('should render as large unfilled circle', () => {
      const ctx = createMockContext('Transform');
      const svg = processCircleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('fill="none"'); // Unfilled
      expect(svg).toContain('<text');
    });
  });

  describe('dataStoreLineShape', () => {
    it('should have correct id', () => {
      expect(dataStoreLineShape.id).toBe('data-store-line');
    });

    it('should calculate bounds', () => {
      const ctx = createMockContext('Database');
      const bounds = dataStoreLineShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should render two horizontal lines', () => {
      const ctx = createMockContext('Data');
      const svg = dataStoreLineShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<line'); // Should have lines
      expect(svg).toContain('<text');
    });
  });

  describe('dataStoreLeftShape', () => {
    it('should have correct id', () => {
      expect(dataStoreLeftShape.id).toBe('data-store-left');
    });

    it('should render rectangle with double line on left', () => {
      const ctx = createMockContext('Store');
      const svg = dataStoreLeftShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<line'); // Double line on left
      expect(svg).toContain('<text');
    });
  });

  describe('dataStoreOpenShape', () => {
    it('should have correct id', () => {
      expect(dataStoreOpenShape.id).toBe('data-store-open');
    });

    it('should render rectangle open on right side', () => {
      const ctx = createMockContext('File');
      const svg = dataStoreOpenShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // U-shape (open on right)
      expect(svg).toContain('<text');
    });
  });
});
