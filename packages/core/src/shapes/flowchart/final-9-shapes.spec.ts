import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import {
  predefinedProcessShape,
  decisionManualShape,
  preparationAltShape,
  sequentialStorageShape,
  directStorageShape,
  cardShape,
  offPageConnectorShape,
  summingJunctionShape,
  orShape,
} from '../index.js';

function createMockContext(label: string): ShapeRenderContext {
  return {
    node: {
      id: label.toLowerCase(),
      shape: 'test',
      label,
    },
    style: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 2,
      fontSize: 14,
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Final 9 Shapes (TDD)', () => {
  describe('Predefined Process', () => {
    it('should have id predef-proc', () => {
      expect(predefinedProcessShape.id).toBe('predefinedProcess');
    });

    it('should calculate bounds with frame space', () => {
      const ctx = createMockContext('Subroutine');
      const bounds = predefinedProcessShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Call');
      const anchors = predefinedProcessShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render rectangle with side lines', () => {
      const ctx = createMockContext('Proc');
      const svg = predefinedProcessShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('<line'); // Frame lines
    });

    it('should have vertical lines on both sides', () => {
      const ctx = createMockContext('Sub');
      const svg = predefinedProcessShape.render(ctx, { x: 0, y: 0 });

      const lineCount = (svg.match(/<line/g) || []).length;
      expect(lineCount).toBe(2); // Left and right frame lines
    });
  });

  describe('Decision Manual', () => {
    it('should have id decision-manual', () => {
      expect(decisionManualShape.id).toBe('decisionManual');
    });

    it('should calculate diamond bounds', () => {
      const ctx = createMockContext('Yes?');
      const bounds = decisionManualShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Manual');
      const anchors = decisionManualShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render diamond with wavy bottom', () => {
      const ctx = createMockContext('Check');
      const svg = decisionManualShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
      expect(svg).toContain('Q'); // Curves for wavy bottom
    });

    it('should have diamond shape with curved edge', () => {
      const ctx = createMockContext('?');
      const svg = decisionManualShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('d="M'); // Path for diamond
    });
  });

  describe('Preparation Alt (Elongated Hexagon)', () => {
    it('should have id prep-alt', () => {
      expect(preparationAltShape.id).toBe('preparation');
    });

    it('should calculate elongated hexagon bounds', () => {
      const ctx = createMockContext('Initialize');
      const bounds = preparationAltShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(bounds.height); // Wider than tall
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Setup');
      const anchors = preparationAltShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render elongated hexagon', () => {
      const ctx = createMockContext('Prep');
      const svg = preparationAltShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      expect(svg).toContain('points=');
    });

    it('should have 6 points forming hexagon', () => {
      const ctx = createMockContext('Init');
      const svg = preparationAltShape.render(ctx, { x: 0, y: 0 });

      const pointsMatch = svg.match(/points="([^"]+)"/);
      expect(pointsMatch).toBeTruthy();
      if (pointsMatch) {
        const coords = pointsMatch[1].split(' ');
        expect(coords).toHaveLength(6); // 6 points for hexagon
      }
    });
  });

  describe('Sequential Access Storage', () => {
    it('should have id seq-storage', () => {
      expect(sequentialStorageShape.id).toBe('sequentialStorage');
    });

    it('should calculate bounds for tape storage', () => {
      const ctx = createMockContext('Tape');
      const bounds = sequentialStorageShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Seq');
      const anchors = sequentialStorageShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render half-stadium shape', () => {
      const ctx = createMockContext('Sequential');
      const svg = sequentialStorageShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
    });

    it('should have rounded left side', () => {
      const ctx = createMockContext('Tape');
      const svg = sequentialStorageShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('A'); // Arc command for curve
    });
  });

  describe('Direct Access Storage', () => {
    it('should have id direct-storage', () => {
      expect(directStorageShape.id).toBe('directStorage');
    });

    it('should calculate bounds for direct access', () => {
      const ctx = createMockContext('DASD');
      const bounds = directStorageShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Direct');
      const anchors = directStorageShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render cylinder-like shape', () => {
      const ctx = createMockContext('DASD');
      const svg = directStorageShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path');
    });

    it('should have curved edges', () => {
      const ctx = createMockContext('Disk');
      const svg = directStorageShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Q'); // Quadratic curves
    });
  });

  describe('Card (Punched Card)', () => {
    it('should have id card', () => {
      expect(cardShape.id).toBe('card');
    });

    it('should calculate bounds with corner cut', () => {
      const ctx = createMockContext('Card');
      const bounds = cardShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(80);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Input');
      const anchors = cardShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render polygon with cut corner', () => {
      const ctx = createMockContext('Punch');
      const svg = cardShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      expect(svg).toContain('points=');
    });

    it('should have 5 points for cut corner', () => {
      const ctx = createMockContext('Card');
      const svg = cardShape.render(ctx, { x: 0, y: 0 });

      const pointsMatch = svg.match(/points="([^"]+)"/);
      expect(pointsMatch).toBeTruthy();
      if (pointsMatch) {
        const coords = pointsMatch[1].split(' ');
        expect(coords).toHaveLength(5); // 5 points for cut corner rectangle
      }
    });
  });

  describe('Off-Page Connector', () => {
    it('should have id off-page', () => {
      expect(offPageConnectorShape.id).toBe('offPageConnector');
    });

    it('should calculate pentagon bounds', () => {
      const ctx = createMockContext('Page 2');
      const bounds = offPageConnectorShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(60);
      expect(bounds.height).toBeGreaterThanOrEqual(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Next');
      const anchors = offPageConnectorShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render home plate pentagon', () => {
      const ctx = createMockContext('Goto');
      const svg = offPageConnectorShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<polygon');
      expect(svg).toContain('points=');
    });

    it('should have 5 points pointing down', () => {
      const ctx = createMockContext('Off');
      const svg = offPageConnectorShape.render(ctx, { x: 0, y: 0 });

      const pointsMatch = svg.match(/points="([^"]+)"/);
      expect(pointsMatch).toBeTruthy();
      if (pointsMatch) {
        const coords = pointsMatch[1].split(' ');
        expect(coords).toHaveLength(5); // 5 points for home plate
      }
    });
  });

  describe('Summing Junction (Plus Circle)', () => {
    it('should have id junction', () => {
      expect(summingJunctionShape.id).toBe('summingJunction');
    });

    it('should calculate circle bounds', () => {
      const ctx = createMockContext('+');
      const bounds = summingJunctionShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(50);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Sum');
      const anchors = summingJunctionShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render circle with plus sign', () => {
      const ctx = createMockContext('Junction');
      const svg = summingJunctionShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('<line'); // Plus sign lines
    });

    it('should have two perpendicular lines forming plus', () => {
      const ctx = createMockContext('+');
      const svg = summingJunctionShape.render(ctx, { x: 0, y: 0 });

      const lineCount = (svg.match(/<line/g) || []).length;
      expect(lineCount).toBe(2); // Horizontal and vertical lines
    });
  });

  describe('Or (Logical OR)', () => {
    it('should have id or', () => {
      expect(orShape.id).toBe('or');
    });

    it('should calculate circle bounds with space for OR arc', () => {
      const ctx = createMockContext('OR');
      const bounds = orShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThanOrEqual(50);
      expect(bounds.height).toBeGreaterThanOrEqual(50);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('OR');
      const anchors = orShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render circle with OR arc', () => {
      const ctx = createMockContext('|');
      const svg = orShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('<path'); // OR arc lines
    });

    it('should have curved OR lines', () => {
      const ctx = createMockContext('OR');
      const svg = orShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Q'); // Quadratic curves for OR
    });
  });
});
