import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../types.js';
import {
  rectangleShape,
  stadiumShape,
  circleShape,
  triangleShape,
  parallelogramShape,
  trapezoidShape,
  flippedTrapezoidShape,
  manualInputShape,
  delayShape,
  cylinderShape,
} from '../shapes/index.js';

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
      width: text.length * 8, // Simple approximation
      height: 16,
    }),
  };
}

describe('New Shapes', () => {
  describe('Rectangle Shape', () => {
    it('should have correct id', () => {
      expect(rectangleShape.id).toBe('rect');
    });

    it('should calculate bounds based on text', () => {
      const ctx = createMockContext('Test');
      const bounds = rectangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
      expect(bounds.width).toBe(32 + 24); // text width + padding*2
      expect(bounds.height).toBe(16 + 24); // text height + padding*2
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Test');
      const anchors = rectangleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render valid SVG', () => {
      const ctx = createMockContext('Test');
      const svg = rectangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<text');
      expect(svg).toContain('Test');
    });

    it('should handle long text', () => {
      const ctx = createMockContext('Very Long Label Text');
      const bounds = rectangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(100);
    });
  });

  describe('Stadium Shape', () => {
    it('should have correct id', () => {
      expect(stadiumShape.id).toBe('stadium');
    });

    it('should calculate bounds with extra width for rounded ends', () => {
      const ctx = createMockContext('Start');
      const bounds = stadiumShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(40 + 24); // text + padding*2
      expect(bounds.height).toBe(16 + 24);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Start');
      const anchors = stadiumShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].name).toBe('top');
    });

    it('should render with rounded corners', () => {
      const ctx = createMockContext('Start');
      const svg = stadiumShape.render(ctx, { x: 10, y: 10 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('rx='); // Rounded corners
      expect(svg).toContain('Start');
    });

    it('should use semicircular ends (rx = height/2)', () => {
      const ctx = createMockContext('End');
      const bounds = stadiumShape.bounds(ctx);
      const svg = stadiumShape.render(ctx, { x: 0, y: 0 });

      const expectedRx = bounds.height / 2;
      expect(svg).toContain(`rx="${expectedRx}"`);
    });
  });

  describe('Circle Shape', () => {
    it('should have correct id', () => {
      expect(circleShape.id).toBe('circ');
    });

    it('should calculate square bounds for circular shape', () => {
      const ctx = createMockContext('A');
      const bounds = circleShape.bounds(ctx);

      expect(bounds.width).toBe(bounds.height); // Square bounds
      expect(bounds.width).toBeGreaterThanOrEqual(50); // Minimum size
    });

    it('should account for diagonal text in circle', () => {
      const ctx = createMockContext('Test');
      const bounds = circleShape.bounds(ctx);

      // Circle should be larger than text to fit diagonally
      const textWidth = 32; // 4 chars * 8
      expect(bounds.width).toBeGreaterThan(textWidth);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('State');
      const anchors = circleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render circle SVG element', () => {
      const ctx = createMockContext('X');
      const svg = circleShape.render(ctx, { x: 50, y: 50 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('cx=');
      expect(svg).toContain('cy=');
      expect(svg).toContain('r=');
    });

    it('should enforce minimum circle diameter', () => {
      const ctx = createMockContext('');
      const bounds = circleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(50);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });
  });

  describe('Triangle Shape', () => {
    it('should have correct id', () => {
      expect(triangleShape.id).toBe('tri');
    });

    it('should calculate bounds with minimum size', () => {
      const ctx = createMockContext('Extract');
      const bounds = triangleShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(70);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Merge');
      const anchors = triangleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      // Triangle: top point, bottom right, bottom center, bottom left
      expect(anchors[0].name).toBe('top');
      expect(anchors[2].name).toBe('bottom');
    });

    it('should render polygon with 3 points', () => {
      const ctx = createMockContext('Tri');
      const svg = triangleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      expect(svg).toContain('points=');
      // Should have 3 coordinate pairs
      const pointsMatch = svg.match(/points="([^"]+)"/);
      expect(pointsMatch).toBeTruthy();
      if (pointsMatch) {
        const coords = pointsMatch[1].split(' ');
        expect(coords).toHaveLength(3); // 3 points
      }
    });

    it('should position text lower in triangle', () => {
      const ctx = createMockContext('Text');
      const bounds = triangleShape.bounds(ctx);
      const svg = triangleShape.render(ctx, { x: 0, y: 0 });

      // Text should be at 0.6 of height (60% down)
      const expectedY = bounds.height * 0.6;
      expect(svg).toContain(`y="${expectedY}"`);
    });
  });

  describe('Parallelogram Shape (Data I/O)', () => {
    it('should have correct id', () => {
      expect(parallelogramShape.id).toBe('lean-r');
    });

    it('should calculate bounds with skew space', () => {
      const ctx = createMockContext('Input Data');
      const bounds = parallelogramShape.bounds(ctx);

      const textWidth = 'Input Data'.length * 8;
      const skew = 15;
      expect(bounds.width).toBe(textWidth + 24 + skew * 2);
    });

    it('should provide 4 anchor points accounting for skew', () => {
      const ctx = createMockContext('Data');
      const anchors = parallelogramShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      // Left and right anchors should be offset by skew
      expect(anchors[3].x).toBe(15); // Left anchor at skew position
    });

    it('should render parallelogram polygon', () => {
      const ctx = createMockContext('Input');
      const svg = parallelogramShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      const pointsMatch = svg.match(/points="([^"]+)"/);
      expect(pointsMatch).toBeTruthy();
      if (pointsMatch) {
        const coords = pointsMatch[1].split(' ');
        expect(coords).toHaveLength(4); // 4 points (parallelogram)
      }
    });

    it('should lean to the right', () => {
      const ctx = createMockContext('Right');
      const svg = parallelogramShape.render(ctx, { x: 0, y: 0 });

      // Top left should be shifted right (skew)
      expect(svg).toContain('15,0'); // Top left at x=15
    });
  });

  describe('Trapezoid Shape', () => {
    it('should have correct id for base-down trapezoid', () => {
      expect(trapezoidShape.id).toBe('trap-b');
    });

    it('should calculate bounds with minimum size', () => {
      const ctx = createMockContext('Priority');
      const bounds = trapezoidShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('High');
      const anchors = trapezoidShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render trapezoid with narrower top', () => {
      const ctx = createMockContext('Top Narrow');
      const bounds = trapezoidShape.bounds(ctx);
      const svg = trapezoidShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      // Top should be inset 20% on each side
      const inset = bounds.width * 0.2;
      expect(svg).toContain(`${inset},0`); // Top left
    });
  });

  describe('Flipped Trapezoid Shape', () => {
    it('should have correct id for base-up trapezoid', () => {
      expect(flippedTrapezoidShape.id).toBe('trap-t');
    });

    it('should render trapezoid with narrower bottom', () => {
      const ctx = createMockContext('Manual Op');
      const bounds = flippedTrapezoidShape.bounds(ctx);
      const svg = flippedTrapezoidShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      // Bottom should be inset
      const inset = bounds.width * 0.2;
      const bottomY = bounds.height;
      expect(svg).toContain(`${inset},${bottomY}`); // Bottom left
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Manual');
      const anchors = flippedTrapezoidShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });
  });

  describe('Manual Input Shape', () => {
    it('should have correct id', () => {
      expect(manualInputShape.id).toBe('sl-rect');
    });

    it('should calculate bounds with extra height for slope', () => {
      const ctx = createMockContext('Enter Data');
      const bounds = manualInputShape.bounds(ctx);

      expect(bounds.height).toBeGreaterThan(16 + 24); // More than text + padding
    });

    it('should provide 4 anchor points accounting for slope', () => {
      const ctx = createMockContext('Manual');
      const anchors = manualInputShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      // Top anchor should be offset down due to slope
      const bounds = manualInputShape.bounds(ctx);
      const slope = bounds.height * 0.2;
      expect(anchors[0].y).toBe(slope);
    });

    it('should render sloped top polygon', () => {
      const ctx = createMockContext('Input');
      const svg = manualInputShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      const pointsMatch = svg.match(/points="([^"]+)"/);
      expect(pointsMatch).toBeTruthy();
      if (pointsMatch) {
        const coords = pointsMatch[1].split(' ');
        expect(coords).toHaveLength(4); // 4 points
      }
    });

    it('should have left side lower than right side at top', () => {
      const ctx = createMockContext('Slope');
      const bounds = manualInputShape.bounds(ctx);
      const slope = bounds.height * 0.2;
      const svg = manualInputShape.render(ctx, { x: 0, y: 0 });

      // Top left should be at y=slope, top right at y=0
      expect(svg).toContain(`0,${slope}`); // Top left lower
    });
  });

  describe('Delay Shape', () => {
    it('should have correct id', () => {
      expect(delayShape.id).toBe('delay');
    });

    it('should calculate standard bounds', () => {
      const ctx = createMockContext('Wait');
      const bounds = delayShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Delay');
      const anchors = delayShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render path with curved right side', () => {
      const ctx = createMockContext('Pause');
      const svg = delayShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
      expect(svg).toContain('d=');
      // Should contain quadratic curve commands (Q)
      expect(svg).toContain('Q');
    });

    it('should have straight left side and curved right side', () => {
      const ctx = createMockContext('Time');
      const svg = delayShape.render(ctx, { x: 10, y: 10 });

      // Should start with M (move), have L (lines) and Q (curves)
      expect(svg).toMatch(/M \d+,\d+/); // Move command
      expect(svg).toMatch(/L \d+,\d+/); // Line command
      expect(svg).toMatch(/Q \d+,\d+ \d+,\d+/); // Quadratic curve
    });
  });

  describe('Cylinder Shape (Database)', () => {
    it('should have correct id', () => {
      expect(cylinderShape.id).toBe('cyl');
    });

    it('should calculate bounds with minimum size', () => {
      const ctx = createMockContext('DB');
      const bounds = cylinderShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(60);
      expect(bounds.height).toBeGreaterThanOrEqual(80);
    });

    it('should provide 4 anchor points accounting for ellipse height', () => {
      const ctx = createMockContext('Database');
      const anchors = cylinderShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      const bounds = cylinderShape.bounds(ctx);
      const ellipseH = bounds.height * 0.15;

      // Top anchor should be below the ellipse
      expect(anchors[0].y).toBe(ellipseH);
    });

    it('should render cylinder with ellipse and rectangle', () => {
      const ctx = createMockContext('Users');
      const svg = cylinderShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<g>'); // Group element
      expect(svg).toContain('<ellipse'); // Top ellipse
      expect(svg).toContain('<rect'); // Side
      expect(svg).toContain('<line'); // Side lines
      expect(svg).toContain('<path'); // Bottom arc
    });

    it('should have proper 3D cylinder appearance', () => {
      const ctx = createMockContext('Storage');
      const svg = cylinderShape.render(ctx, { x: 0, y: 0 });

      // Should have top ellipse, side lines, and bottom curve
      expect(svg).toContain('ellipse'); // Top
      expect(svg.match(/<line/g)?.length).toBe(2); // Two side lines
      expect(svg).toContain('path'); // Bottom curve
    });

    it('should calculate ellipse size as 15% of height', () => {
      const ctx = createMockContext('Data');
      const bounds = cylinderShape.bounds(ctx);
      const svg = cylinderShape.render(ctx, { x: 0, y: 0 });

      const ry = bounds.height * 0.15;
      expect(svg).toContain(`ry="${ry}"`);
    });
  });

  describe('Shape Consistency', () => {
    const allShapes = [
      rectangleShape,
      stadiumShape,
      circleShape,
      triangleShape,
      parallelogramShape,
      trapezoidShape,
      flippedTrapezoidShape,
      manualInputShape,
      delayShape,
      cylinderShape,
    ];

    it('all shapes should have unique IDs', () => {
      const ids = allShapes.map((s) => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('all shapes should have bounds method', () => {
      allShapes.forEach((shape) => {
        expect(typeof shape.bounds).toBe('function');
      });
    });

    it('all shapes should have render method', () => {
      allShapes.forEach((shape) => {
        expect(typeof shape.render).toBe('function');
      });
    });

    it('all shapes should have anchors method', () => {
      allShapes.forEach((shape) => {
        expect(typeof shape.anchors).toBe('function');
      });
    });

    it('all shapes should return positive bounds', () => {
      const ctx = createMockContext('Test');
      allShapes.forEach((shape) => {
        const bounds = shape.bounds(ctx);
        expect(bounds.width).toBeGreaterThan(0);
        expect(bounds.height).toBeGreaterThan(0);
      });
    });

    it('all shapes should return exactly 4 anchor points', () => {
      const ctx = createMockContext('Test');
      allShapes.forEach((shape) => {
        const anchors = shape.anchors!(ctx);
        expect(anchors).toHaveLength(4);
      });
    });

    it('all shapes should render non-empty SVG', () => {
      const ctx = createMockContext('Test');
      allShapes.forEach((shape) => {
        const svg = shape.render(ctx, { x: 0, y: 0 });
        expect(svg.length).toBeGreaterThan(0);
        expect(svg).toContain('<');
      });
    });

    it('all shapes should include label text in output', () => {
      const ctx = createMockContext('Label');
      allShapes.forEach((shape) => {
        const svg = shape.render(ctx, { x: 0, y: 0 });
        expect(svg).toContain('Label');
      });
    });

    it('all shapes should apply fill style', () => {
      const ctx = createMockContext('Test');
      ctx.style.fill = '#ff0000';
      allShapes.forEach((shape) => {
        const svg = shape.render(ctx, { x: 0, y: 0 });
        expect(svg).toContain('#ff0000');
      });
    });

    it('all shapes should apply stroke style', () => {
      const ctx = createMockContext('Test');
      ctx.style.stroke = '#00ff00';
      allShapes.forEach((shape) => {
        const svg = shape.render(ctx, { x: 0, y: 0 });
        expect(svg).toContain('#00ff00');
      });
    });
  });
});
