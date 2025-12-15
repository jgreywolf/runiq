import { describe, expect, it } from 'vitest';
import { createSymbol, getWirePath, type SymbolDefinition } from './symbol.js';

describe('symbol', () => {
  describe('createSymbol', () => {
    it('should create symbol with correct properties', () => {
      const symbol = createSymbol(
        'test-symbol',
        60,
        40,
        [
          { x: 0, y: 20, name: 'left' },
          { x: 60, y: 20, name: 'right' },
        ],
        (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="10"/>`
      );

      expect(symbol.id).toBe('test-symbol');
      expect(symbol.width).toBe(60);
      expect(symbol.height).toBe(40);
      expect(symbol.terminals).toHaveLength(2);
      expect(symbol.terminals[0]).toEqual({ x: 0, y: 20, name: 'left' });
      expect(symbol.terminals[1]).toEqual({ x: 60, y: 20, name: 'right' });
    });

    it('should render symbol centered at position', () => {
      const symbol = createSymbol(
        'centered-symbol',
        60,
        40,
        [],
        (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="10"/>`
      );

      // Position (0, 0) should center at (30, 20)
      const svg = symbol.render(0, 0);
      expect(svg).toContain('cx="30"'); // 0 + 60/2
      expect(svg).toContain('cy="20"'); // 0 + 40/2
    });

    it('should render symbol at custom position', () => {
      const symbol = createSymbol(
        'positioned-symbol',
        60,
        40,
        [],
        (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="10"/>`
      );

      // Position (100, 200) should center at (130, 220)
      const svg = symbol.render(100, 200);
      expect(svg).toContain('cx="130"'); // 100 + 60/2
      expect(svg).toContain('cy="220"'); // 200 + 40/2
    });

    it('should handle symbols with no terminals', () => {
      const symbol = createSymbol(
        'no-terminals',
        50,
        50,
        [],
        (cx, cy) =>
          `<rect x="${cx - 25}" y="${cy - 25}" width="50" height="50"/>`
      );

      expect(symbol.terminals).toHaveLength(0);
      expect(symbol.terminals).toEqual([]);
    });

    it('should handle symbols with multiple terminals', () => {
      const symbol = createSymbol(
        'multi-terminal',
        80,
        60,
        [
          { x: 0, y: 30, name: 'left' },
          { x: 80, y: 30, name: 'right' },
          { x: 40, y: 0, name: 'top' },
          { x: 40, y: 60, name: 'bottom' },
        ],
        (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="15"/>`
      );

      expect(symbol.terminals).toHaveLength(4);
      expect(symbol.terminals[0].name).toBe('left');
      expect(symbol.terminals[1].name).toBe('right');
      expect(symbol.terminals[2].name).toBe('top');
      expect(symbol.terminals[3].name).toBe('bottom');
    });

    it('should pass center coordinates correctly to render function', () => {
      let capturedCx = 0;
      let capturedCy = 0;

      const symbol = createSymbol('capture-coords', 100, 80, [], (cx, cy) => {
        capturedCx = cx;
        capturedCy = cy;
        return `<circle cx="${cx}" cy="${cy}" r="5"/>`;
      });

      symbol.render(50, 60);
      expect(capturedCx).toBe(100); // 50 + 100/2
      expect(capturedCy).toBe(100); // 60 + 80/2
    });

    it('should handle zero width and height', () => {
      const symbol = createSymbol(
        'zero-size',
        0,
        0,
        [],
        (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="5"/>`
      );

      expect(symbol.width).toBe(0);
      expect(symbol.height).toBe(0);

      const svg = symbol.render(10, 20);
      expect(svg).toContain('cx="10"'); // 10 + 0/2
      expect(svg).toContain('cy="20"'); // 20 + 0/2
    });

    it('should create valid SymbolDefinition type', () => {
      const symbol: SymbolDefinition = createSymbol(
        'typed-symbol',
        60,
        40,
        [{ x: 0, y: 20, name: 'terminal' }],
        (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="10"/>`
      );

      expect(symbol).toBeDefined();
      expect(typeof symbol.render).toBe('function');
    });
  });

  describe('getWirePath', () => {
    describe('straight routing', () => {
      it('should generate straight path from point to point', () => {
        const path = getWirePath(10, 20, 100, 80, 'straight');
        expect(path).toBe('M 10,20 L 100,80');
      });

      it('should handle horizontal straight path', () => {
        const path = getWirePath(0, 50, 100, 50, 'straight');
        expect(path).toBe('M 0,50 L 100,50');
      });

      it('should handle vertical straight path', () => {
        const path = getWirePath(50, 0, 50, 100, 'straight');
        expect(path).toBe('M 50,0 L 50,100');
      });

      it('should handle diagonal straight path', () => {
        const path = getWirePath(0, 0, 100, 100, 'straight');
        expect(path).toBe('M 0,0 L 100,100');
      });

      it('should handle negative coordinates', () => {
        const path = getWirePath(-10, -20, -50, -60, 'straight');
        expect(path).toBe('M -10,-20 L -50,-60');
      });
    });

    describe('orthogonal routing (default)', () => {
      it('should default to orthogonal routing when no routing specified', () => {
        const path = getWirePath(0, 0, 100, 50);
        // Horizontal distance (100) > vertical distance (50), so horizontal first
        expect(path).toBe('M 0,0 L 100,0 L 100,50');
      });

      it('should route horizontal-first when dx > dy', () => {
        const path = getWirePath(0, 0, 100, 30, 'orthogonal');
        expect(path).toBe('M 0,0 L 100,0 L 100,30');
      });

      it('should route vertical-first when dy > dx', () => {
        const path = getWirePath(0, 0, 30, 100, 'orthogonal');
        expect(path).toBe('M 0,0 L 0,100 L 30,100');
      });

      it('should route vertical-first when dx equals dy', () => {
        const path = getWirePath(0, 0, 50, 50, 'orthogonal');
        // When equal, abs(dx) is not > abs(dy), so vertical first
        expect(path).toBe('M 0,0 L 0,50 L 50,50');
      });

      it('should handle negative deltas correctly', () => {
        const path = getWirePath(100, 100, 0, 50, 'orthogonal');
        // dx = -100, dy = -50, abs(dx) > abs(dy), so horizontal first
        expect(path).toBe('M 100,100 L 0,100 L 0,50');
      });

      it('should handle vertical-first with negative deltas', () => {
        const path = getWirePath(100, 100, 70, 0, 'orthogonal');
        // dx = -30, dy = -100, abs(dy) > abs(dx), so vertical first
        expect(path).toBe('M 100,100 L 100,0 L 70,0');
      });

      it('should create Manhattan routing pattern', () => {
        const path = getWirePath(0, 0, 80, 40, 'orthogonal');
        // Should have 3 points: start, intermediate, end
        expect(path).toContain('M 0,0');
        expect(path).toContain('L 80,0');
        expect(path).toContain('L 80,40');
      });

      it('should handle zero distance (same point)', () => {
        const path = getWirePath(50, 50, 50, 50, 'orthogonal');
        // When both deltas are zero, horizontal first
        expect(path).toBe('M 50,50 L 50,50 L 50,50');
      });
    });

    describe('routing comparison', () => {
      it('should produce different paths for straight vs orthogonal', () => {
        const straight = getWirePath(0, 0, 100, 100, 'straight');
        const orthogonal = getWirePath(0, 0, 100, 100, 'orthogonal');
        expect(straight).not.toBe(orthogonal);
        expect(straight).toBe('M 0,0 L 100,100');
        expect(orthogonal).toBe('M 0,0 L 0,100 L 100,100');
      });
    });

    describe('edge cases', () => {
      it('should handle decimal coordinates', () => {
        const path = getWirePath(10.5, 20.75, 50.25, 60.5, 'straight');
        expect(path).toBe('M 10.5,20.75 L 50.25,60.5');
      });

      it('should handle large coordinate values', () => {
        const path = getWirePath(0, 0, 10000, 5000, 'orthogonal');
        expect(path).toBe('M 0,0 L 10000,0 L 10000,5000');
      });

      it('should handle very small deltas', () => {
        const path = getWirePath(100, 100, 100.1, 100.05, 'orthogonal');
        // dx = 0.1, dy = 0.05, abs(dx) > abs(dy), so horizontal first
        expect(path).toBe('M 100,100 L 100.1,100 L 100.1,100.05');
      });
    });
  });
});
