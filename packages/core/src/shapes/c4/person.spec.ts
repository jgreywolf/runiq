import { describe, expect, it } from 'vitest';
import { createTextMeasurer } from '../../text-measurement/index.js';
import { c4Person } from './person.js';

describe('C4 Person', () => {
  const measureText = createTextMeasurer();

  it('should have correct id', () => {
    expect(c4Person.id).toBe('c4Person');
  });

  it('should calculate bounds with person icon space', () => {
    const bounds = c4Person.bounds({
      node: { id: 'user', shape: 'c4Person', label: 'Customer' },
      style: {},
      measureText,
    });

    expect(bounds.width).toBeGreaterThanOrEqual(120); // minWidth
    expect(bounds.height).toBeGreaterThan(40); // Has icon space (30px) + text
  });

  it('should render SVG with person icon and label', () => {
    const svg = c4Person.render(
      {
        node: { id: 'user', shape: 'c4Person', label: 'Customer' },
        style: {},
        measureText,
      },
      { x: 0, y: 0 }
    );

    expect(svg).toContain('<rect'); // Container
    expect(svg).toContain('<circle'); // Head
    expect(svg).toContain('<line'); // Body parts
    expect(svg).toContain('Customer'); // Label
    expect(svg).toContain('#08427B'); // C4 person blue
  });

  it('should use custom fill color from style', () => {
    const svg = c4Person.render(
      {
        node: { id: 'user', shape: 'c4Person', label: 'Admin' },
        style: { fill: '#ff0000' },
        measureText,
      },
      { x: 0, y: 0 }
    );

    expect(svg).toContain('#ff0000');
  });

  it('should handle empty labels', () => {
    const bounds = c4Person.bounds({
      node: { id: 'user', shape: 'c4Person', label: '' },
      style: {},
      measureText,
    });

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const svg = c4Person.render(
      {
        node: { id: 'user', shape: 'c4Person', label: 'Admin & <User>' },
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
