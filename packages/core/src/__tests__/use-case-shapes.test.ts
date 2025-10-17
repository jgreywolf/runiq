import { describe, it, expect } from 'vitest';
import { ellipseWideShape } from '../shapes/ellipse-wide.js';
import { systemBoundaryShape } from '../shapes/system-boundary.js';
import type { DiagramNode, Style, TextMeasurement } from '../types.js';

describe('Use Case Shapes', () => {
  const mockCtx = {
    node: { id: 'uc1', label: 'Place Order', shape: 'ellipse-wide' } as DiagramNode,
    style: { padding: 12, fontSize: 14 } as Style,
    measureText: (text: string): TextMeasurement => ({
      width: text.length * 8,
      height: 16,
    }),
  };

  describe('ellipse-wide (Use Case Oval)', () => {
    it('should have correct shape id', () => {
      expect(ellipseWideShape.id).toBe('ellipse-wide');
    });

    it('should calculate bounds wider than tall (horizontal oval)', () => {
      const bounds = ellipseWideShape.bounds(mockCtx);
      
      expect(bounds.width).toBeGreaterThan(bounds.height);
      // Use case ovals are typically 1.8-2x wider than tall
      expect(bounds.width / bounds.height).toBeGreaterThanOrEqual(1.5);
    });

    it('should fit text with comfortable padding', () => {
      const bounds = ellipseWideShape.bounds(mockCtx);
      const textSize = mockCtx.measureText('Place Order');
      
      // Ellipse needs extra room since text is rectangular inside oval
      expect(bounds.width).toBeGreaterThan(textSize.width * 1.2);
      expect(bounds.height).toBeGreaterThan(textSize.height * 1.2);
    });

    it('should enforce minimum dimensions', () => {
      const minCtx = {
        ...mockCtx,
        node: { id: 'uc2', label: 'Go', shape: 'ellipse-wide' } as DiagramNode,
      };
      
      const bounds = ellipseWideShape.bounds(minCtx);
      
      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(40);
    });

    it('should provide 4 anchor points on ellipse perimeter', () => {
      const anchors = ellipseWideShape.anchors(mockCtx);
      
      expect(anchors).toHaveLength(4);
      expect(anchors.map(a => a.name)).toEqual(['top', 'right', 'bottom', 'left']);
      
      const bounds = ellipseWideShape.bounds(mockCtx);
      
      // Top and bottom anchors should be centered horizontally
      expect(anchors[0].x).toBe(bounds.width / 2); // top
      expect(anchors[2].x).toBe(bounds.width / 2); // bottom
      
      // Left and right anchors should be centered vertically
      expect(anchors[1].y).toBe(bounds.height / 2); // right
      expect(anchors[3].y).toBe(bounds.height / 2); // left
    });

    it('should render SVG ellipse element', () => {
      const svg = ellipseWideShape.render(mockCtx, { x: 100, y: 50 });
      
      expect(svg).toContain('<ellipse');
      expect(svg).toContain('cx="');
      expect(svg).toContain('cy="');
      expect(svg).toContain('rx="');
      expect(svg).toContain('ry="');
    });

    it('should center text inside ellipse', () => {
      const svg = ellipseWideShape.render(mockCtx, { x: 100, y: 50 });
      
      expect(svg).toContain('text-anchor="middle"');
      expect(svg).toContain('dominant-baseline="middle"');
      expect(svg).toContain('Place Order');
    });

    it('should apply style properties', () => {
      const styledCtx = {
        ...mockCtx,
        style: {
          ...mockCtx.style,
          fill: '#e3f2fd',
          stroke: '#1976d2',
          strokeWidth: 2,
        },
      };
      
      const svg = ellipseWideShape.render(styledCtx, { x: 0, y: 0 });
      
      expect(svg).toContain('fill="#e3f2fd"');
      expect(svg).toContain('stroke="#1976d2"');
      expect(svg).toContain('stroke-width="2"');
    });

    it('should handle long use case names', () => {
      const longCtx = {
        ...mockCtx,
        node: {
          id: 'uc3',
          label: 'Process Customer Payment Transaction',
          shape: 'ellipse-wide',
        } as DiagramNode,
      };
      
      const bounds = ellipseWideShape.bounds(longCtx);
      const textSize = mockCtx.measureText('Process Customer Payment Transaction');
      
      // Should scale to fit longer text
      expect(bounds.width).toBeGreaterThan(textSize.width * 1.2);
      expect(bounds.width / bounds.height).toBeGreaterThanOrEqual(1.5);
    });
  });

  describe('system-boundary (System Container)', () => {
    const boundaryCtx = {
      node: { id: 'sys1', label: 'Banking System', shape: 'system-boundary' } as DiagramNode,
      style: { padding: 20, fontSize: 14 } as Style,
      measureText: (text: string): TextMeasurement => ({
        width: text.length * 8,
        height: 16,
      }),
    };

    it('should have correct shape id', () => {
      expect(systemBoundaryShape.id).toBe('system-boundary');
    });

    it('should calculate bounds with extra space for label at top', () => {
      const bounds = systemBoundaryShape.bounds(boundaryCtx);
      
      // Should be reasonably large to contain use cases
      expect(bounds.width).toBeGreaterThanOrEqual(200);
      expect(bounds.height).toBeGreaterThanOrEqual(150);
    });

    it('should enforce minimum dimensions for container', () => {
      const minCtx = {
        ...boundaryCtx,
        node: { id: 'sys2', label: 'A', shape: 'system-boundary' } as DiagramNode,
      };
      
      const bounds = systemBoundaryShape.bounds(minCtx);
      
      expect(bounds.width).toBeGreaterThanOrEqual(200);
      expect(bounds.height).toBeGreaterThanOrEqual(150);
    });

    it('should provide 4 anchor points on rectangle perimeter', () => {
      const anchors = systemBoundaryShape.anchors(boundaryCtx);
      
      expect(anchors).toHaveLength(4);
      expect(anchors.map(a => a.name)).toEqual(['top', 'right', 'bottom', 'left']);
    });

    it('should render rectangle with dashed stroke', () => {
      const svg = systemBoundaryShape.render(boundaryCtx, { x: 50, y: 50 });
      
      expect(svg).toContain('<rect');
      expect(svg).toContain('stroke-dasharray');
    });

    it('should position label at top-left corner', () => {
      const svg = systemBoundaryShape.render(boundaryCtx, { x: 50, y: 50 });
      
      // Label should be above the rectangle or at top-left inside
      expect(svg).toContain('Banking System');
      expect(svg).toContain('text-anchor="start"'); // left-aligned
    });

    it('should use light fill and dark stroke by default', () => {
      const svg = systemBoundaryShape.render(boundaryCtx, { x: 0, y: 0 });
      
      // System boundaries are typically very light or transparent
      expect(svg).toContain('fill=');
      expect(svg).toContain('stroke=');
    });

    it('should apply custom style properties', () => {
      const styledCtx = {
        ...boundaryCtx,
        style: {
          ...boundaryCtx.style,
          fill: '#ffffff',
          stroke: '#666666',
          strokeWidth: 2,
        },
      };
      
      const svg = systemBoundaryShape.render(styledCtx, { x: 0, y: 0 });
      
      expect(svg).toContain('fill="#ffffff"');
      expect(svg).toContain('stroke="#666666"');
      expect(svg).toContain('stroke-width="2"');
    });

    it('should handle long system names', () => {
      const longCtx = {
        ...boundaryCtx,
        node: {
          id: 'sys3',
          label: 'Enterprise Resource Planning System',
          shape: 'system-boundary',
        } as DiagramNode,
      };
      
      const bounds = systemBoundaryShape.bounds(longCtx);
      const textSize = boundaryCtx.measureText('Enterprise Resource Planning System');
      
      // Should be wide enough for the label
      expect(bounds.width).toBeGreaterThan(textSize.width);
    });
  });
});
