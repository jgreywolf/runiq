import { describe, expect, it } from 'vitest';
import {
  objectNodeShape,
  centralBufferShape,
  dataStoreShape,
} from './activity-object-nodes.js';
import type { ShapeRenderContext } from '../../types.js';

// Mock shape context for testing
function createMockContext(label: string = 'Test'): ShapeRenderContext {
  return {
    node: {
      id: 'test',
      shape: '@objectNode',
      label,
    },
    style: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
      fontSize: 14,
      font: 'Arial',
      padding: 10,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  } as ShapeRenderContext;
}

describe('Activity Object Node Shapes', () => {
  describe('objectNodeShape', () => {
    it('should have correct shape ID', () => {
      expect(objectNodeShape.id).toBe('objectNode');
    });

    it('should calculate bounds based on label', () => {
      const ctx = createMockContext('User Input');
      const bounds = objectNodeShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(40);
    });

    it('should use minimum dimensions', () => {
      const ctx = createMockContext('X');
      const bounds = objectNodeShape.bounds(ctx);

      expect(bounds.width).toBe(80);
      expect(bounds.height).toBe(40);
    });

    it('should render a rectangle', () => {
      const ctx = createMockContext('Order Data');
      const svg = objectNodeShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<g class="object-node-shape">');
      expect(svg).toContain('<rect');
      expect(svg).toContain('Order Data');
      expect(svg).not.toContain('rx='); // No rounded corners
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = objectNodeShape.anchors?.(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors!.map((a) => a.name)).toEqual(['top', 'right', 'bottom', 'left']);
    });

    it('should use default label when not provided', () => {
      const ctx = createMockContext('');
      const svg = objectNodeShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Object');
    });
  });

  describe('centralBufferShape', () => {
    it('should have correct shape ID', () => {
      expect(centralBufferShape.id).toBe('centralBuffer');
    });

    it('should calculate bounds for stereotype and label', () => {
      const ctx = createMockContext('Order Queue');
      const bounds = centralBufferShape.bounds(ctx);

      // Should be taller to accommodate stereotype + label
      expect(bounds.width).toBeGreaterThanOrEqual(100);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should render stereotype «centralBuffer»', () => {
      const ctx = createMockContext('Buffer1');
      const svg = centralBufferShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<g class="central-buffer-shape">');
      expect(svg).toContain('«centralBuffer»');
      expect(svg).toContain('Buffer1');
    });

    it('should have stereotype text above label', () => {
      const ctx = createMockContext('MyBuffer');
      const svg = centralBufferShape.render(ctx, { x: 0, y: 0 });

      const stereotypeIndex = svg.indexOf('«centralBuffer»');
      const labelIndex = svg.indexOf('MyBuffer');

      expect(stereotypeIndex).toBeLessThan(labelIndex);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = centralBufferShape.anchors?.(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors!.map((a) => a.name)).toEqual(['top', 'right', 'bottom', 'left']);
    });

    it('should use default label when not provided', () => {
      const ctx = createMockContext('');
      const svg = centralBufferShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Buffer');
    });

    it('should render stereotype with smaller font', () => {
      const ctx = createMockContext('Test');
      const svg = centralBufferShape.render(ctx, { x: 0, y: 0 });

      // Stereotype should use fontSize - 2
      expect(svg).toContain('font-size="12"'); // 14 - 2
    });
  });

  describe('dataStoreShape', () => {
    it('should have correct shape ID', () => {
      expect(dataStoreShape.id).toBe('dataStore');
    });

    it('should calculate bounds for stereotype and label', () => {
      const ctx = createMockContext('Customer Database');
      const bounds = dataStoreShape.bounds(ctx);

      // Should be taller to accommodate stereotype + label
      expect(bounds.width).toBeGreaterThanOrEqual(100);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should render stereotype «datastore»', () => {
      const ctx = createMockContext('OrderDB');
      const svg = dataStoreShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<g class="data-store-shape">');
      expect(svg).toContain('«datastore»');
      expect(svg).toContain('OrderDB');
    });

    it('should have stereotype text above label', () => {
      const ctx = createMockContext('ProductDB');
      const svg = dataStoreShape.render(ctx, { x: 0, y: 0 });

      const stereotypeIndex = svg.indexOf('«datastore»');
      const labelIndex = svg.indexOf('ProductDB');

      expect(stereotypeIndex).toBeLessThan(labelIndex);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = dataStoreShape.anchors?.(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors!.map((a) => a.name)).toEqual(['top', 'right', 'bottom', 'left']);
    });

    it('should use default label when not provided', () => {
      const ctx = createMockContext('');
      const svg = dataStoreShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('DataStore');
    });

    it('should render stereotype with smaller font', () => {
      const ctx = createMockContext('Test');
      const svg = dataStoreShape.render(ctx, { x: 0, y: 0 });

      // Stereotype should use fontSize - 2
      expect(svg).toContain('font-size="12"'); // 14 - 2
    });

    it('should apply custom styling', () => {
      const ctx = createMockContext('StyledDB');
      ctx.style.fill = '#e0f7fa';
      ctx.style.stroke = '#0097a7';
      
      const svg = dataStoreShape.render(ctx, { x: 10, y: 20 });

      expect(svg).toContain('fill="#e0f7fa"');
      expect(svg).toContain('stroke="#0097a7"');
    });
  });

  describe('Object Node Shape Differences', () => {
    it('should distinguish object node (plain) from stereotyped nodes', () => {
      const ctx = createMockContext('Data');
      
      const objSvg = objectNodeShape.render(ctx, { x: 0, y: 0 });
      const bufferSvg = centralBufferShape.render(ctx, { x: 0, y: 0 });
      const storeSvg = dataStoreShape.render(ctx, { x: 0, y: 0 });

      // Object node has no stereotype
      expect(objSvg).not.toContain('«');
      
      // Buffer and store have stereotypes
      expect(bufferSvg).toContain('«centralBuffer»');
      expect(storeSvg).toContain('«datastore»');
    });

    it('should have different heights due to stereotypes', () => {
      const ctx = createMockContext('Test');
      
      const objBounds = objectNodeShape.bounds(ctx);
      const bufferBounds = centralBufferShape.bounds(ctx);
      const storeBounds = dataStoreShape.bounds(ctx);

      // Stereotyped shapes should be taller
      expect(bufferBounds.height).toBeGreaterThan(objBounds.height);
      expect(storeBounds.height).toBeGreaterThan(objBounds.height);
    });
  });
});
