import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../types.js';
import {
  pedigreeMaleShape,
  pedigreeFemaleShape,
  pedigreeUnknownShape,
} from '../shapes/pedigree.js';

function createMockContext(
  label: string,
  options?: {
    affected?: boolean;
    carrier?: boolean;
    deceased?: boolean;
    fill?: string;
    stroke?: string;
  }
): ShapeRenderContext {
  return {
    node: {
      id: label.toLowerCase().replace(/\s+/g, '-'),
      shape: 'pedigree-male',
      label,
    },
    style: {
      fill: options?.fill || '#ffffff',
      stroke: options?.stroke || '#000000',
      strokeWidth: 2,
      fontSize: 12,
      affected: options?.affected,
      carrier: options?.carrier,
      deceased: options?.deceased,
    },
    measureText: (text: string) => ({
      width: text.length * 7,
      height: 12,
    }),
  };
}

describe('Pedigree Chart Shapes (TDD)', () => {
  describe('Male Individual (Square)', () => {
    it('should have id pedigree-male', () => {
      expect(pedigreeMaleShape.id).toBe('pedigree-male');
    });

    it('should calculate fixed 40x40 bounds', () => {
      const ctx = createMockContext('John');
      const bounds = pedigreeMaleShape.bounds(ctx);

      expect(bounds.width).toBe(40);
      expect(bounds.height).toBe(40);
    });

    it('should provide 4 anchor points (top, right, bottom, left)', () => {
      const ctx = createMockContext('John');
      const anchors = pedigreeMaleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0]).toEqual({ x: 20, y: 0, name: 'top' });
      expect(anchors[1]).toEqual({ x: 40, y: 20, name: 'right' });
      expect(anchors[2]).toEqual({ x: 20, y: 40, name: 'bottom' });
      expect(anchors[3]).toEqual({ x: 0, y: 20, name: 'left' });
    });

    it('should render a square with default white fill', () => {
      const ctx = createMockContext('John');
      const svg = pedigreeMaleShape.render(ctx, { x: 10, y: 20 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('x="10"');
      expect(svg).toContain('y="20"');
      expect(svg).toContain('width="40"');
      expect(svg).toContain('height="40"');
      expect(svg).toContain('fill="#ffffff"');
    });

    it('should render black fill when affected=true', () => {
      const ctx = createMockContext('John', { affected: true });
      const svg = pedigreeMaleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="#000"');
    });

    it('should render half-fill pattern when carrier=true', () => {
      const ctx = createMockContext('John', { carrier: true });
      const svg = pedigreeMaleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="url(#pedigree-half-fill)"');
    });

    it('should render diagonal line when deceased=true', () => {
      const ctx = createMockContext('John', { deceased: true });
      const svg = pedigreeMaleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<line');
      expect(svg).toContain('x1="0"');
      expect(svg).toContain('y1="0"');
      expect(svg).toContain('x2="40"');
      expect(svg).toContain('y2="40"');
    });

    it('should render label below the square', () => {
      const ctx = createMockContext('John');
      const svg = pedigreeMaleShape.render(ctx, { x: 10, y: 20 });

      expect(svg).toContain('<text');
      expect(svg).toContain('x="30"'); // x + 40/2 = 10 + 20
      expect(svg).toContain('y="75"'); // y + 40 + 15 = 20 + 40 + 15
      expect(svg).toContain('text-anchor="middle"');
      expect(svg).toContain('>John</text>');
    });

    it('should combine affected and deceased styles', () => {
      const ctx = createMockContext('John', { affected: true, deceased: true });
      const svg = pedigreeMaleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="#000"');
      expect(svg).toContain('<line');
    });
  });

  describe('Female Individual (Circle)', () => {
    it('should have id pedigree-female', () => {
      expect(pedigreeFemaleShape.id).toBe('pedigree-female');
    });

    it('should calculate fixed 40x40 bounds', () => {
      const ctx = createMockContext('Jane');
      const bounds = pedigreeFemaleShape.bounds(ctx);

      expect(bounds.width).toBe(40);
      expect(bounds.height).toBe(40);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Jane');
      const anchors = pedigreeFemaleShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0]).toEqual({ x: 20, y: 0, name: 'top' });
      expect(anchors[1]).toEqual({ x: 40, y: 20, name: 'right' });
      expect(anchors[2]).toEqual({ x: 20, y: 40, name: 'bottom' });
      expect(anchors[3]).toEqual({ x: 0, y: 20, name: 'left' });
    });

    it('should render a circle with default white fill', () => {
      const ctx = createMockContext('Jane');
      const svg = pedigreeFemaleShape.render(ctx, { x: 10, y: 20 });

      expect(svg).toContain('<circle');
      expect(svg).toContain('cx="30"'); // x + 40/2
      expect(svg).toContain('cy="40"'); // y + 40/2
      expect(svg).toContain('r="19"'); // (40/2) - strokeWidth/2
      expect(svg).toContain('fill="#ffffff"');
    });

    it('should render black fill when affected=true', () => {
      const ctx = createMockContext('Jane', { affected: true });
      const svg = pedigreeFemaleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="#000"');
    });

    it('should render half-fill pattern when carrier=true', () => {
      const ctx = createMockContext('Jane', { carrier: true });
      const svg = pedigreeFemaleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="url(#pedigree-half-fill)"');
    });

    it('should render diagonal line when deceased=true', () => {
      const ctx = createMockContext('Jane', { deceased: true });
      const svg = pedigreeFemaleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<line');
      expect(svg).toContain('x1="0"');
      expect(svg).toContain('y1="0"');
      expect(svg).toContain('x2="40"');
      expect(svg).toContain('y2="40"');
    });

    it('should render label below the circle', () => {
      const ctx = createMockContext('Jane');
      const svg = pedigreeFemaleShape.render(ctx, { x: 10, y: 20 });

      expect(svg).toContain('<text');
      expect(svg).toContain('x="30"'); // cx = x + 40/2
      expect(svg).toContain('y="75"'); // y + 40 + 15
      expect(svg).toContain('>Jane</text>');
    });

    it('should combine carrier and deceased styles', () => {
      const ctx = createMockContext('Jane', { carrier: true, deceased: true });
      const svg = pedigreeFemaleShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="url(#pedigree-half-fill)"');
      expect(svg).toContain('<line');
    });
  });

  describe('Unknown Sex Individual (Diamond)', () => {
    it('should have id pedigree-unknown', () => {
      expect(pedigreeUnknownShape.id).toBe('pedigree-unknown');
    });

    it('should calculate fixed 40x40 bounds', () => {
      const ctx = createMockContext('Pat');
      const bounds = pedigreeUnknownShape.bounds(ctx);

      expect(bounds.width).toBe(40);
      expect(bounds.height).toBe(40);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Pat');
      const anchors = pedigreeUnknownShape.anchors!(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0]).toEqual({ x: 20, y: 0, name: 'top' });
      expect(anchors[1]).toEqual({ x: 40, y: 20, name: 'right' });
      expect(anchors[2]).toEqual({ x: 20, y: 40, name: 'bottom' });
      expect(anchors[3]).toEqual({ x: 0, y: 20, name: 'left' });
    });

    it('should render a diamond (rotated square) with default white fill', () => {
      const ctx = createMockContext('Pat');
      const svg = pedigreeUnknownShape.render(ctx, { x: 10, y: 20 });

      expect(svg).toContain('<polygon');
      expect(svg).toContain('points="30,20 50,40 30,60 10,40"'); // diamond coordinates
      expect(svg).toContain('fill="#ffffff"');
    });

    it('should render black fill when affected=true', () => {
      const ctx = createMockContext('Pat', { affected: true });
      const svg = pedigreeUnknownShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="#000"');
    });

    it('should render half-fill pattern when carrier=true', () => {
      const ctx = createMockContext('Pat', { carrier: true });
      const svg = pedigreeUnknownShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="url(#pedigree-half-fill)"');
    });

    it('should render horizontal line when deceased=true', () => {
      const ctx = createMockContext('Pat', { deceased: true });
      const svg = pedigreeUnknownShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<line');
      expect(svg).toContain('x1="0"');
      expect(svg).toContain('y1="20"'); // y + SIZE/2
      expect(svg).toContain('x2="40"');
      expect(svg).toContain('y2="20"');
    });

    it('should render label below the diamond', () => {
      const ctx = createMockContext('Pat');
      const svg = pedigreeUnknownShape.render(ctx, { x: 10, y: 20 });

      expect(svg).toContain('<text');
      expect(svg).toContain('x="30"'); // x + 40/2
      expect(svg).toContain('y="75"'); // y + 40 + 15
      expect(svg).toContain('>Pat</text>');
    });

    it('should combine affected and deceased styles', () => {
      const ctx = createMockContext('Pat', { affected: true, deceased: true });
      const svg = pedigreeUnknownShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="#000"');
      expect(svg).toContain('<line');
    });
  });

  describe('Style Consistency', () => {
    it('should respect custom stroke color across all shapes', () => {
      const ctxMale = createMockContext('M', { stroke: '#ff0000' });
      const ctxFemale = createMockContext('F', { stroke: '#ff0000' });
      const ctxUnknown = createMockContext('U', { stroke: '#ff0000' });

      const svgMale = pedigreeMaleShape.render(ctxMale, { x: 0, y: 0 });
      const svgFemale = pedigreeFemaleShape.render(ctxFemale, { x: 0, y: 0 });
      const svgUnknown = pedigreeUnknownShape.render(ctxUnknown, { x: 0, y: 0 });

      expect(svgMale).toContain('stroke="#ff0000"');
      expect(svgFemale).toContain('stroke="#ff0000"');
      expect(svgUnknown).toContain('stroke="#ff0000"');
    });

    it('should respect custom fill color when not affected/carrier', () => {
      const ctxMale = createMockContext('M', { fill: '#e0e0e0' });
      const svgMale = pedigreeMaleShape.render(ctxMale, { x: 0, y: 0 });

      expect(svgMale).toContain('fill="#e0e0e0"');
    });

    it('should prioritize affected over carrier (affected wins)', () => {
      const ctx = createMockContext('Test', { affected: true, carrier: true });
      const svg = pedigreeMaleShape.render(ctx, { x: 0, y: 0 });

      // Affected should take precedence
      expect(svg).toContain('fill="#000"');
      expect(svg).not.toContain('url(#pedigree-half-fill)');
    });
  });

  describe('Label Rendering', () => {
    it('should use node.id when label is not provided', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'individual-123',
          shape: 'pedigree-male',
        },
        style: { fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
        measureText: () => ({ width: 0, height: 0 }),
      };

      const svg = pedigreeMaleShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('>individual-123</text>');
    });

    it('should prefer node.label over node.id', () => {
      const ctx: ShapeRenderContext = {
        node: {
          id: 'individual-123',
          label: 'John Doe',
          shape: 'pedigree-male',
        },
        style: { fill: '#ffffff', stroke: '#000000', strokeWidth: 2 },
        measureText: () => ({ width: 0, height: 0 }),
      };

      const svg = pedigreeMaleShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('>John Doe</text>');
      expect(svg).not.toContain('>individual-123</text>');
    });
  });
});
