import { describe, it, expect } from 'vitest';
import { c4Person, c4System, c4Container, c4Component } from '../shapes/c4/index.js';
import { createTextMeasurer } from '../text-measurement.js';

describe('C4 Model Shapes', () => {
  const measureText = createTextMeasurer();

  describe('c4-person', () => {
    it('should have correct id', () => {
      expect(c4Person.id).toBe('c4-person');
    });

    it('should calculate bounds with person icon space', () => {
      const bounds = c4Person.bounds({
        node: { id: 'user', shape: 'c4-person', label: 'Customer' },
        style: {},
        measureText,
      });

      expect(bounds.width).toBeGreaterThanOrEqual(120); // minWidth
      expect(bounds.height).toBeGreaterThan(40); // Has icon space (30px) + text
    });

    it('should render SVG with person icon and label', () => {
      const svg = c4Person.render(
        {
          node: { id: 'user', shape: 'c4-person', label: 'Customer' },
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
          node: { id: 'user', shape: 'c4-person', label: 'Admin' },
          style: { fill: '#ff0000' },
          measureText,
        },
        { x: 0, y: 0 }
      );

      expect(svg).toContain('#ff0000');
    });
  });

  describe('c4-system', () => {
    it('should have correct id', () => {
      expect(c4System.id).toBe('c4-system');
    });

    it('should calculate bounds with minimum size', () => {
      const bounds = c4System.bounds({
        node: { id: 'sys', shape: 'c4-system', label: 'Banking System' },
        style: {},
        measureText,
      });

      expect(bounds.width).toBeGreaterThanOrEqual(160); // minWidth
      expect(bounds.height).toBeGreaterThanOrEqual(100); // minHeight
    });

    it('should render SVG with system styling', () => {
      const svg = c4System.render(
        {
          node: { id: 'sys', shape: 'c4-system', label: 'Banking System' },
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
  });

  describe('c4-container', () => {
    it('should have correct id', () => {
      expect(c4Container.id).toBe('c4-container');
    });

    it('should calculate bounds with technology label space', () => {
      const bounds = c4Container.bounds({
        node: {
          id: 'web',
          shape: 'c4-container',
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
            shape: 'c4-container',
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
            shape: 'c4-container',
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
  });

  describe('c4-component', () => {
    it('should have correct id', () => {
      expect(c4Component.id).toBe('c4-component');
    });

    it('should calculate bounds with minimum size', () => {
      const bounds = c4Component.bounds({
        node: {
          id: 'controller',
          shape: 'c4-component',
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
            shape: 'c4-component',
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
  });

  describe('C4 Shape Registry', () => {
    it('should export all C4 shapes', () => {
      expect(c4Person).toBeDefined();
      expect(c4System).toBeDefined();
      expect(c4Container).toBeDefined();
      expect(c4Component).toBeDefined();
    });

    it('should have unique IDs', () => {
      const ids = [c4Person.id, c4System.id, c4Container.id, c4Component.id];
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(4);
    });
  });
});
