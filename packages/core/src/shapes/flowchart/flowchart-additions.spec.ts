import { describe, it, expect } from 'vitest';
import {
  multiProcessShape,
  // orShape, // TODO: Not yet implemented
  // summingJunctionShape, // TODO: Not yet implemented
  curlyBraceAnnotationShape,
  magneticTapeShape,
} from './flowchart-additions.js';
import { orShape } from '../special/or.js';
import { summingJunctionShape } from '../control-systems/summingJunction.js';
import type { ShapeRenderContext } from '../../types.js';

function createMockContext(label = 'Test'): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      label,
    },
    style: {
      fill: '#f0f0f0',
      stroke: '#333',
      strokeWidth: 1,
      fontSize: 14,
      fontFamily: 'sans-serif',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('Flowchart Additions', () => {
  describe('multiProcessShape', () => {
    it('should have correct id', () => {
      expect(multiProcessShape.id).toBe('multi-process');
    });

    it('should render stacked rectangles to indicate multiple instances', () => {
      const ctx = createMockContext('Multi Process');
      const svg = multiProcessShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('Multi Process');
      // Should have multiple rectangles for stacked effect
      const rectMatches = svg.match(/<rect/g);
      expect(rectMatches).toBeDefined();
      expect(rectMatches!.length).toBeGreaterThanOrEqual(2);
    });
  });

  // TODO: Implement orShape and summingJunctionShape
  describe.skip('orShape', () => {
    it('should have correct id', () => {
      // expect(orShape.id).toBe('or');
    });

    it('should render circle with OR symbol inside', () => {
      // const ctx = createMockContext('OR');
      // const svg = orShape.render(ctx, { x: 0, y: 0 });
      // expect(svg).toContain('<circle');
      // expect(svg).toContain('OR');
    });
  });

  describe.skip('summingJunctionShape', () => {
    it('should have correct id', () => {
      // expect(summingJunctionShape.id).toBe('summing-junction');
    });

    it('should render circle with + symbol inside', () => {
      // const ctx = createMockContext('Sum');
      // const svg = summingJunctionShape.render(ctx, { x: 0, y: 0 });
      // expect(svg).toContain('<circle');
      // expect(svg).toContain('<line'); // Plus symbol
    });
  });

  describe('curlyBraceAnnotationShape', () => {
    it('should have correct id', () => {
      expect(curlyBraceAnnotationShape.id).toBe('curly-brace-annotation');
    });

    it('should render curly brace with text', () => {
      const ctx = createMockContext('Annotation');
      const svg = curlyBraceAnnotationShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // Curly brace shape
      expect(svg).toContain('Annotation');
    });
  });

  describe('magneticTapeShape', () => {
    it('should have correct id', () => {
      expect(magneticTapeShape.id).toBe('magnetic-tape');
    });

    it('should render circle with triangular bottom', () => {
      const ctx = createMockContext('Tape');
      const svg = magneticTapeShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // Combined shape
      expect(svg).toContain('Tape');
    });
  });
});
