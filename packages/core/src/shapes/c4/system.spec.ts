import { describe, expect, it } from 'vitest';
import { createTextMeasurer } from '../../text-measurement/index.js';
import { c4System } from './system.js';

describe('C4 System', () => {
  const measureText = createTextMeasurer();

  it('should have correct id', () => {
    expect(c4System.id).toBe('c4System');
  });

  it('should calculate bounds with minimum size', () => {
    const bounds = c4System.bounds({
      node: { id: 'sys', shape: 'c4System', label: 'Banking System' },
      style: {},
      measureText,
    });

    expect(bounds.width).toBeGreaterThanOrEqual(160); // minWidth
    expect(bounds.height).toBeGreaterThanOrEqual(100); // minHeight
  });

  it('should render SVG with system styling', () => {
    const svg = c4System.render(
      {
        node: { id: 'sys', shape: 'c4System', label: 'Banking System' },
        style: {},
        measureText,
      },
      { x: 10, y: 20 }
    );

    expect(svg).toContain('<rect');
    expect(svg).toContain('Banking System');
    expect(svg).toContain('#1168BD'); // C4 system blue
    expect(svg).toContain('x="10"'); // Positioned correctly
    expect(svg).toContain('y="20"');
  });

  it('should handle empty labels', () => {
    const bounds = c4System.bounds({
      node: { id: 'sys', shape: 'c4System', label: '' },
      style: {},
      measureText,
    });

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const svg = c4System.render(
      {
        node: { id: 'sys', shape: 'c4System', label: 'System & <Component>' },
        style: {},
        measureText,
      },
      { x: 0, y: 0 }
    );

    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
  });
});
