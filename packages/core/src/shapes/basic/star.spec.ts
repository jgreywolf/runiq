import { describe, it, expect } from 'vitest';
import { starShape, starFilledShape, octagonShape, plusShape } from './star.js';
import type { ShapeRenderContext } from '../../types.js';

// Mock text measurement
const mockMeasureText = (text: string) => ({
  width: text.length * 8,
  height: 16,
});

const createContext = (
  overrides?: Partial<ShapeRenderContext>
): ShapeRenderContext => ({
  node: { id: 'test', shape: '@star', label: 'Test' },
  style: { padding: 12, fill: '#fff', stroke: '#000', strokeWidth: 1 },
  measureText: mockMeasureText,
  ...overrides,
});

describe('Star Shape (unfilled)', () => {
  it('should have correct id', () => {
    expect(starShape.id).toBe('star');
  });

  it('should calculate bounds based on text size', () => {
    const ctx = createContext();
    const bounds = starShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points', () => {
    const ctx = createContext();
    const anchors = starShape.anchors?.(ctx) || [];

    expect(anchors).toHaveLength(4);
    expect(anchors[0].name).toBe('top');
    expect(anchors[1].name).toBe('right');
    expect(anchors[2].name).toBe('bottom');
    expect(anchors[3].name).toBe('left');
  });

  it('should render SVG with 5-pointed star path (unfilled)', () => {
    const ctx = createContext();
    const svg = starShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('d="M'); // Star path
    expect(svg).toContain('fill="none"'); // Unfilled
    expect(svg).toContain('<text'); // Label
  });
});

describe('Star Filled Shape', () => {
  it('should have correct id', () => {
    expect(starFilledShape.id).toBe('star-filled');
  });

  it('should render SVG with filled star', () => {
    const ctx = createContext();
    const svg = starFilledShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('fill="#fff"'); // Filled with style color
    expect(svg).not.toContain('fill="none"');
  });
});

describe('Octagon Shape', () => {
  it('should have correct id', () => {
    expect(octagonShape.id).toBe('octagon');
  });

  it('should calculate bounds based on text size', () => {
    const ctx = createContext();
    const bounds = octagonShape.bounds(ctx);

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 8 anchor points (one per side)', () => {
    const ctx = createContext();
    const anchors = octagonShape.anchors?.(ctx) || [];

    expect(anchors).toHaveLength(8);
    expect(anchors.map((a) => a.name)).toEqual([
      'top',
      'top-right',
      'right',
      'bottom-right',
      'bottom',
      'bottom-left',
      'left',
      'top-left',
    ]);
  });

  it('should render SVG with 8-sided polygon', () => {
    const ctx = createContext();
    const svg = octagonShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toContain('d="M'); // Octagon path
    expect(svg).toContain('<text');
  });
});

describe('Plus Shape (block style)', () => {
  it('should have correct id', () => {
    expect(plusShape.id).toBe('plus');
  });

  it('should calculate square bounds', () => {
    const ctx = createContext();
    const bounds = plusShape.bounds(ctx);

    // Plus shape should be roughly square
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should have 4 anchor points at extremities', () => {
    const ctx = createContext();
    const anchors = plusShape.anchors?.(ctx) || [];

    expect(anchors).toHaveLength(4);
    expect(anchors[0].name).toBe('top');
    expect(anchors[1].name).toBe('right');
    expect(anchors[2].name).toBe('bottom');
    expect(anchors[3].name).toBe('left');
  });

  it('should render SVG with block plus/cross path', () => {
    const ctx = createContext();
    const svg = plusShape.render(ctx, { x: 0, y: 0 });

    expect(svg).toContain('<path');
    expect(svg).toMatch(/d="[\s\n]*M/); // Plus cross path (with possible whitespace)
    expect(svg).toContain('<text');
  });
});
