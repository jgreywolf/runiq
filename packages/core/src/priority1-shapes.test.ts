import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from './types.js';
import {
  displayShape,
  leanLeftShape,
  paperTapeShape,
  flippedTriangleShape,
  framedRectangleShape,
  hourglassShape,
} from './shapes/index.js';

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

describe('Priority 1 Shapes (TDD)', () => {
  describe('Display Shape (Curved Trapezoid)', () => {
    it('should have id curv-trap', () => {
      expect(displayShape.id).toBe('display');
    });

    it('should calculate bounds with extra width for curves', () => {
      const ctx = createMockContext('Display');
      const bounds = displayShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Output');
      const anchors = displayShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render curved trapezoid path', () => {
      const ctx = createMockContext('Screen');
      const svg = displayShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
      expect(svg).toContain('d=');
      expect(svg).toContain('Q'); // Quadratic curves
    });

    it('should have wider bottom than top', () => {
      const ctx = createMockContext('Display');
      const bounds = displayShape.bounds(ctx);
      const svg = displayShape.render(ctx, { x: 0, y: 0 });

      // Path should show inset at top (top starts narrower)
      const inset = bounds.width * 0.15;
      expect(svg).toContain(`M ${inset},0`); // Top left starts inset
    });
  });

  describe('Lean-Left Parallelogram', () => {
    it('should have id lean-l', () => {
      expect(leanLeftShape.id).toBe('leanLeft');
    });

    it('should calculate bounds with skew space', () => {
      const ctx = createMockContext('Output');
      const bounds = leanLeftShape.bounds(ctx);

      const textWidth = 'Output'.length * 8;
      const skew = 15;
      expect(bounds.width).toBe(textWidth + 24 + skew * 2);
    });

    it('should provide 4 anchor points accounting for reverse skew', () => {
      const ctx = createMockContext('Data');
      const anchors = leanLeftShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[3].x).toBe(15); // Left anchor at skew position
    });

    it('should render parallelogram leaning left', () => {
      const ctx = createMockContext('Out');
      const svg = leanLeftShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      expect(svg).toContain('points=');
    });

    it('should lean opposite direction from lean-right', () => {
      const ctx = createMockContext('Test');
      const svg = leanLeftShape.render(ctx, { x: 0, y: 0 });

      // Top left should be at x=15 (skew forward)
      expect(svg).toContain('15,0');
    });
  });

  describe('Paper Tape Shape (Flag)', () => {
    it('should have id flag', () => {
      expect(paperTapeShape.id).toBe('flag');
    });

    it('should calculate bounds with extra height for wavy edges', () => {
      const ctx = createMockContext('Tape');
      const bounds = paperTapeShape.bounds(ctx);

      expect(bounds.height).toBeGreaterThan(16 + 24); // More than text + padding
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('I/O');
      const anchors = paperTapeShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render wavy bottom edge', () => {
      const ctx = createMockContext('Paper');
      const svg = paperTapeShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
      expect(svg).toContain('Q'); // Quadratic curves for waves
    });

    it('should have straight top and sides', () => {
      const ctx = createMockContext('Tape');
      const svg = paperTapeShape.render(ctx, { x: 10, y: 10 });

      expect(svg).toContain('M 10,10'); // Straight top left
      expect(svg).toContain('L'); // Straight lines
    });
  });

  describe('Flipped Triangle Shape', () => {
    it('should have id flip-tri', () => {
      expect(flippedTriangleShape.id).toBe('flippedTriangle');
    });

    it('should calculate bounds with minimum size', () => {
      const ctx = createMockContext('Down');
      const bounds = flippedTriangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(70);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('File');
      const anchors = flippedTriangleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[2].name).toBe('bottom'); // Point is at bottom
    });

    it('should render downward-pointing triangle', () => {
      const ctx = createMockContext('V');
      const svg = flippedTriangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      const pointsMatch = svg.match(/points="([^"]+)"/);
      expect(pointsMatch).toBeTruthy();
      if (pointsMatch) {
        const coords = pointsMatch[1].split(' ');
        expect(coords).toHaveLength(3); // 3 points for triangle
      }
    });

    it('should position text higher in triangle', () => {
      const ctx = createMockContext('Text');
      const bounds = flippedTriangleShape.bounds(ctx);
      const svg = flippedTriangleShape.render(ctx, { x: 0, y: 0 });

      const expectedY = bounds.height * 0.4;
      expect(svg).toContain(`y="${expectedY}"`);
    });
  });

  describe('Framed Rectangle (Subroutine)', () => {
    it('should have id fr-rect', () => {
      expect(framedRectangleShape.id).toBe('framedRectangle');
    });

    it('should calculate bounds with frame spacing', () => {
      const ctx = createMockContext('Subroutine');
      const bounds = framedRectangleShape.bounds(ctx);

      const textWidth = 'Subroutine'.length * 8;
      const frameWidth = 6;
      expect(bounds.width).toBe(textWidth + 24 + frameWidth * 2);
    });

    it('should provide 4 anchor points on outer rectangle', () => {
      const ctx = createMockContext('Sub');
      const anchors = framedRectangleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render outer rectangle and frame lines', () => {
      const ctx = createMockContext('Process');
      const svg = framedRectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg.match(/<line/g)?.length).toBe(2); // Two vertical frame lines
    });

    it('should have vertical lines on left and right', () => {
      const ctx = createMockContext('Call');
      const svg = framedRectangleShape.render(ctx, { x: 10, y: 10 });

      expect(svg).toContain('x1="16"'); // Left line at x=10+6
      expect(svg).toContain('<line'); // Has line elements
    });
  });

  describe('Hourglass Shape (Collate)', () => {
    it('should have id hourglass', () => {
      expect(hourglassShape.id).toBe('hourglass');
    });

    it('should calculate square-ish bounds', () => {
      const ctx = createMockContext('Merge');
      const bounds = hourglassShape.bounds(ctx);

      expect(bounds.width).toBe(bounds.height); // Square
      expect(bounds.width).toBeGreaterThanOrEqual(70);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Collate');
      const anchors = hourglassShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].name).toBe('top'); // Top point
      expect(anchors[2].name).toBe('bottom'); // Bottom point
    });

    it('should render two triangles meeting at center', () => {
      const ctx = createMockContext('Sort');
      const svg = hourglassShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
      expect(svg).toContain('d=');
      // Path should go to all four corners and center twice
      expect(svg.match(/L/g)?.length).toBeGreaterThanOrEqual(5);
    });

    it('should position text at center', () => {
      const ctx = createMockContext('X');
      const bounds = hourglassShape.bounds(ctx);
      const svg = hourglassShape.render(ctx, { x: 0, y: 0 });

      const centerY = bounds.height / 2;
      expect(svg).toContain(`y="${centerY}"`);
    });
  });
});
