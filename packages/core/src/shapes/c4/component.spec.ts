import { describe, expect, it } from 'vitest';
import { createTextMeasurer } from '../../text-measurement/index.js';
import { c4Component } from './component.js';

describe('C4 Component', () => {
  const measureText = createTextMeasurer();

  it('should have correct id', () => {
    expect(c4Component.id).toBe('c4Component');
  });

  it('should calculate bounds with minimum size', () => {
    const bounds = c4Component.bounds({
      node: {
        id: 'controller',
        shape: 'c4Component',
        label: 'Auth Controller',
      },
      style: {},
      measureText,
    });

    expect(bounds.width).toBeGreaterThanOrEqual(120); // minWidth
    expect(bounds.height).toBeGreaterThanOrEqual(60); // minHeight
  });

  it('should render SVG with lighter styling than container', () => {
    const svg = c4Component.render(
      {
        node: {
          id: 'controller',
          shape: 'c4Component',
          label: 'Auth Controller',
        },
        style: {},
        measureText,
      },
      { x: 5, y: 10 }
    );

    expect(svg).toContain('<rect');
    expect(svg).toContain('Auth Controller');
    expect(svg).toContain('#85BBF0'); // C4 component light blue
    expect(svg).toContain('#000000'); // Dark text for contrast
    expect(svg).toContain('x="5"');
    expect(svg).toContain('y="10"');
  });

  it('should handle empty labels', () => {
    const bounds = c4Component.bounds({
      node: { id: 'comp', shape: 'c4Component', label: '' },
      style: {},
      measureText,
    });

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const svg = c4Component.render(
      {
        node: {
          id: 'controller',
          shape: 'c4Component',
          label: 'Auth & <Controller>',
        },
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
