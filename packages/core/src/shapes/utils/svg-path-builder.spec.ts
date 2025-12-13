import { describe, expect, it } from 'vitest';
import { SvgPathBuilder } from './svg-path-builder.js';

describe('SvgPathBuilder', () => {
  describe('moveTo/moveBy', () => {
    it('should create absolute moveTo command', () => {
      const path = new SvgPathBuilder().moveTo(10, 20).toString();
      expect(path).toBe('M 10,20');
    });

    it('should create relative moveBy command', () => {
      const path = new SvgPathBuilder().moveBy(5, 10).toString();
      expect(path).toBe('m 5,10');
    });

    it('should chain multiple move commands', () => {
      const path = new SvgPathBuilder().moveTo(0, 0).moveBy(10, 10).toString();
      expect(path).toBe('M 0,0 m 10,10');
    });
  });

  describe('lineTo/lineBy', () => {
    it('should create absolute lineTo command', () => {
      const path = new SvgPathBuilder().lineTo(30, 40).toString();
      expect(path).toBe('L 30,40');
    });

    it('should create relative lineBy command', () => {
      const path = new SvgPathBuilder().lineBy(15, 25).toString();
      expect(path).toBe('l 15,25');
    });

    it('should create a simple line path', () => {
      const path = new SvgPathBuilder()
        .moveTo(0, 0)
        .lineTo(100, 0)
        .lineTo(100, 100)
        .lineTo(0, 100)
        .close()
        .toString();
      expect(path).toBe('M 0,0 L 100,0 L 100,100 L 0,100 Z');
    });
  });

  describe('horizontalTo/horizontalBy', () => {
    it('should create absolute horizontal line', () => {
      const path = new SvgPathBuilder().horizontalTo(50).toString();
      expect(path).toBe('H 50');
    });

    it('should create relative horizontal line', () => {
      const path = new SvgPathBuilder().horizontalBy(25).toString();
      expect(path).toBe('h 25');
    });
  });

  describe('verticalTo/verticalBy', () => {
    it('should create absolute vertical line', () => {
      const path = new SvgPathBuilder().verticalTo(80).toString();
      expect(path).toBe('V 80');
    });

    it('should create relative vertical line', () => {
      const path = new SvgPathBuilder().verticalBy(30).toString();
      expect(path).toBe('v 30');
    });
  });

  describe('quadratic curves', () => {
    it('should create absolute quadratic curve', () => {
      const path = new SvgPathBuilder().quadraticTo(50, 10, 100, 50).toString();
      expect(path).toBe('Q 50,10 100,50');
    });

    it('should create relative quadratic curve', () => {
      const path = new SvgPathBuilder().quadraticBy(20, 5, 40, 20).toString();
      expect(path).toBe('q 20,5 40,20');
    });
  });

  describe('cubic curves', () => {
    it('should create absolute cubic curve', () => {
      const path = new SvgPathBuilder()
        .cubicTo(10, 20, 30, 40, 50, 60)
        .toString();
      expect(path).toBe('C 10,20 30,40 50,60');
    });

    it('should create relative cubic curve', () => {
      const path = new SvgPathBuilder()
        .cubicBy(5, 10, 15, 20, 25, 30)
        .toString();
      expect(path).toBe('c 5,10 15,20 25,30');
    });
  });

  describe('smooth cubic curves', () => {
    it('should create absolute smooth cubic curve', () => {
      const path = new SvgPathBuilder()
        .smoothCubicTo(30, 40, 50, 60)
        .toString();
      expect(path).toBe('S 30,40 50,60');
    });

    it('should create relative smooth cubic curve', () => {
      const path = new SvgPathBuilder()
        .smoothCubicBy(15, 20, 25, 30)
        .toString();
      expect(path).toBe('s 15,20 25,30');
    });
  });

  describe('arcs', () => {
    it('should create absolute arc', () => {
      const path = new SvgPathBuilder()
        .arcTo(25, 25, 0, 0, 1, 50, 50)
        .toString();
      expect(path).toBe('A 25,25 0 0 1 50,50');
    });

    it('should create relative arc', () => {
      const path = new SvgPathBuilder()
        .arcBy(15, 15, 45, 1, 0, 30, 30)
        .toString();
      expect(path).toBe('a 15,15 45 1 0 30,30');
    });

    it('should handle large arc flag', () => {
      const path = new SvgPathBuilder()
        .arcTo(50, 50, 0, 1, 1, 100, 100)
        .toString();
      expect(path).toContain('1 1');
    });
  });

  describe('close', () => {
    it('should add close path command', () => {
      const path = new SvgPathBuilder()
        .moveTo(0, 0)
        .lineTo(100, 0)
        .lineTo(100, 100)
        .close()
        .toString();
      expect(path).toContain('Z');
    });
  });

  describe('complex paths', () => {
    it('should create a rectangle', () => {
      const path = new SvgPathBuilder()
        .moveTo(10, 10)
        .horizontalTo(90)
        .verticalTo(90)
        .horizontalTo(10)
        .close()
        .toString();
      expect(path).toBe('M 10,10 H 90 V 90 H 10 Z');
    });

    it('should create a rounded rectangle with arcs', () => {
      const path = new SvgPathBuilder()
        .moveTo(10, 5)
        .horizontalTo(90)
        .arcTo(5, 5, 0, 0, 1, 95, 10)
        .verticalTo(90)
        .arcTo(5, 5, 0, 0, 1, 90, 95)
        .horizontalTo(10)
        .arcTo(5, 5, 0, 0, 1, 5, 90)
        .verticalTo(10)
        .arcTo(5, 5, 0, 0, 1, 10, 5)
        .close()
        .toString();

      expect(path).toContain('M 10,5');
      expect(path).toContain('A 5,5');
      expect(path).toContain('Z');
    });

    it('should create a smooth curve', () => {
      const path = new SvgPathBuilder()
        .moveTo(0, 0)
        .cubicTo(10, 20, 30, 40, 50, 50)
        .smoothCubicTo(70, 80, 100, 100)
        .toString();

      expect(path).toBe('M 0,0 C 10,20 30,40 50,50 S 70,80 100,100');
    });

    it('should support method chaining for complex shapes', () => {
      const path = new SvgPathBuilder()
        .moveTo(0, 0)
        .lineBy(50, 0)
        .lineBy(0, 50)
        .lineBy(-50, 0)
        .close();

      expect(path.toString()).toBe('M 0,0 l 50,0 l 0,50 l -50,0 Z');
    });
  });

  describe('toString', () => {
    it('should return empty string for empty path', () => {
      const path = new SvgPathBuilder().toString();
      expect(path).toBe('');
    });

    it('should join commands with spaces', () => {
      const path = new SvgPathBuilder().moveTo(0, 0).lineTo(10, 10).toString();
      expect(path).toBe('M 0,0 L 10,10');
    });

    it('should handle multiple commands correctly', () => {
      const path = new SvgPathBuilder()
        .moveTo(0, 0)
        .horizontalBy(10)
        .verticalBy(10)
        .horizontalBy(-10)
        .close()
        .toString();

      expect(path).toBe('M 0,0 h 10 v 10 h -10 Z');
    });
  });

  describe('practical examples', () => {
    it('should create a diamond shape', () => {
      const path = new SvgPathBuilder()
        .moveTo(50, 0)
        .lineTo(100, 50)
        .lineTo(50, 100)
        .lineTo(0, 50)
        .close()
        .toString();

      expect(path).toBe('M 50,0 L 100,50 L 50,100 L 0,50 Z');
    });

    it('should create a triangle', () => {
      const path = new SvgPathBuilder()
        .moveTo(50, 0)
        .lineTo(100, 100)
        .lineTo(0, 100)
        .close()
        .toString();

      expect(path).toBe('M 50,0 L 100,100 L 0,100 Z');
    });

    it('should create a hexagon', () => {
      const path = new SvgPathBuilder()
        .moveTo(25, 0)
        .lineTo(75, 0)
        .lineTo(100, 43)
        .lineTo(75, 87)
        .lineTo(25, 87)
        .lineTo(0, 43)
        .close()
        .toString();

      expect(path).toContain('M 25,0');
      expect(path).toContain('L 75,0');
      expect(path).toContain('Z');
    });
  });
});
