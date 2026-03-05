import { describe, expect, it } from 'vitest';
import { createTextMeasurer } from '../../text-measurement/index.js';
import { c4Container } from './container-shape.js';

describe('C4 Container', () => {
  const measureText = createTextMeasurer();

  it('should have correct id', () => {
    expect(c4Container.id).toBe('c4Container');
  });

  it('should calculate bounds with technology label space', () => {
    const bounds = c4Container.bounds({
      node: {
        id: 'web',
        shape: 'c4Container',
        label: 'Web Application\\n[React, TypeScript]',
      },
      style: {},
      measureText,
    });

    expect(bounds.width).toBeGreaterThanOrEqual(140); // minWidth
    expect(bounds.height).toBeGreaterThanOrEqual(80); // minHeight with tech label
  });

  it('should render SVG with title and technology label', () => {
    const svg = c4Container.render(
      {
        node: {
          id: 'web',
          shape: 'c4Container',
          label: 'Web Application\\n[React, TypeScript]',
        },
        style: {},
        measureText,
      },
      { x: 0, y: 0 }
    );

    expect(svg).toContain('<rect');
    expect(svg).toContain('Web Application'); // Title
    expect(svg).toContain('[React, TypeScript]'); // Technology
    expect(svg).toContain('#438DD5'); // C4 container blue
    expect(svg).toContain('italic'); // Technology in italics
  });

  it('should render without technology label if not provided', () => {
    const svg = c4Container.render(
      {
        node: {
          id: 'db',
          shape: 'c4Container',
          label: 'Database',
        },
        style: {},
        measureText,
      },
      { x: 0, y: 0 }
    );

    expect(svg).toContain('Database');
    expect(svg).not.toContain('italic'); // No tech label
  });

  it('should handle empty labels', () => {
    const bounds = c4Container.bounds({
      node: { id: 'web', shape: 'c4Container', label: '' },
      style: {},
      measureText,
    });

    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
  });

  it('should escape XML special characters', () => {
    const svg = c4Container.render(
      {
        node: {
          id: 'web',
          shape: 'c4Container',
          label: 'App & <Container>',
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
