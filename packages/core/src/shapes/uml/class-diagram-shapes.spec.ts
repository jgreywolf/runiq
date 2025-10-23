import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../../types.js';
import { interfaceShape } from './interface.js';
import { abstractShape } from './abstract.js';
import { enumShape } from './enum.js';
import { packageShape } from './package.js';
import { noteShape } from './note.js';

// Mock render context helper
function createMockContext(
  label: string = '',
  data: Record<string, unknown> = {}
): ShapeRenderContext {
  return {
    node: {
      id: 'test-node',
      shape: '@test',
      label,
      data,
    },
    style: {
      padding: 12,
      fontSize: 14,
      fontFamily: 'Arial',
    },
    measureText: (text: string) => ({
      width: text.length * 8,
      height: 16,
    }),
  };
}

describe('UML Class Diagram Shapes', () => {
  describe('interfaceShape', () => {
    it('should have correct id', () => {
      expect(interfaceShape.id).toBe('interface');
    });

    it('should calculate bounds with stereotype', () => {
      const ctx = createMockContext('Serializable');
      const bounds = interfaceShape.bounds(ctx);

      // Should have room for «interface» stereotype + interface name + methods
      expect(bounds.width).toBeGreaterThan(100);
      expect(bounds.height).toBeGreaterThan(40);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Repository');
      const anchors = interfaceShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
      expect(anchors[0].name).toBe('top');
      expect(anchors[1].name).toBe('right');
      expect(anchors[2].name).toBe('bottom');
      expect(anchors[3].name).toBe('left');
    });

    it('should render interface with stereotype and methods', () => {
      const ctx = createMockContext('IRepository', {
        methods: ['save()', 'find()', 'delete()'],
      });
      const svg = interfaceShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('«interface»');
      expect(svg).toContain('IRepository');
      expect(svg).toContain('save()');
      expect(svg).toContain('find()');
      expect(svg).toContain('delete()');
    });

    it('should handle interface without methods', () => {
      const ctx = createMockContext('Comparable');
      const svg = interfaceShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('«interface»');
      expect(svg).toContain('Comparable');
    });
  });

  describe('abstractShape', () => {
    it('should have correct id', () => {
      expect(abstractShape.id).toBe('abstract');
    });

    it('should calculate bounds', () => {
      const ctx = createMockContext('AbstractFactory');
      const bounds = abstractShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(80);
      expect(bounds.height).toBeGreaterThan(30);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Vehicle');
      const anchors = abstractShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render abstract class with italicized name', () => {
      const ctx = createMockContext('Vehicle', {
        attributes: ['speed: int'],
        methods: ['move()', 'stop()'],
      });
      const svg = abstractShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('font-style="italic"');
      expect(svg).toContain('Vehicle');
    });

    it('should show {abstract} stereotype when specified', () => {
      const ctx = createMockContext('Shape', {
        showStereotype: true,
        methods: ['draw()'],
      });
      const svg = abstractShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('{abstract}');
      expect(svg).toContain('Shape');
    });
  });

  describe('enumShape', () => {
    it('should have correct id', () => {
      expect(enumShape.id).toBe('enum');
    });

    it('should calculate bounds for enum values', () => {
      const ctx = createMockContext('Color', {
        values: ['RED', 'GREEN', 'BLUE'],
      });
      const bounds = enumShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(80);
      expect(bounds.height).toBeGreaterThan(60);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Status');
      const anchors = enumShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render enumeration with stereotype and values', () => {
      const ctx = createMockContext('Priority', {
        values: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      });
      const svg = enumShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<rect');
      expect(svg).toContain('«enumeration»');
      expect(svg).toContain('Priority');
      expect(svg).toContain('LOW');
      expect(svg).toContain('MEDIUM');
      expect(svg).toContain('HIGH');
      expect(svg).toContain('CRITICAL');
    });

    it('should handle enum without values', () => {
      const ctx = createMockContext('EmptyEnum');
      const svg = enumShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('«enumeration»');
      expect(svg).toContain('EmptyEnum');
    });
  });

  describe('packageShape', () => {
    it('should have correct id', () => {
      expect(packageShape.id).toBe('umlPackage');
    });

    it('should calculate bounds for package', () => {
      const ctx = createMockContext('com.example.models');
      const bounds = packageShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(120);
      expect(bounds.height).toBeGreaterThan(80);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('util');
      const anchors = packageShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render package with tab', () => {
      const ctx = createMockContext('controllers');
      const svg = packageShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // Folder shape with tab
      expect(svg).toContain('controllers');
      // Verify the path draws a folder shape (should have 8 points for the tab + body)
      expect(svg).toMatch(/M \d+ \d+ L \d+ \d+ L \d+ \d+ L \d+ \d+ L \d+ \d+ L \d+ \d+ L \d+ \d+ Z/);
    });

    it('should handle nested package names', () => {
      const ctx = createMockContext('com.example.domain.models');
      const svg = packageShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('com.example.domain.models');
    });
  });

  describe('noteShape', () => {
    it('should have correct id', () => {
      expect(noteShape.id).toBe('note');
    });

    it('should calculate bounds for note text', () => {
      const ctx = createMockContext('This is a note');
      const bounds = noteShape.bounds(ctx);

      expect(bounds.width).toBeGreaterThan(80);
      expect(bounds.height).toBeGreaterThan(30);
    });

    it('should provide 4 anchor points', () => {
      const ctx = createMockContext('Note');
      const anchors = noteShape.anchors(ctx);

      expect(anchors).toHaveLength(4);
    });

    it('should render note with dog-eared corner', () => {
      const ctx = createMockContext('Important: Check constraints');
      const svg = noteShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('<path'); // Dog-eared shape
      expect(svg).toContain('Important: Check constraints');
    });

    it('should handle multi-line notes', () => {
      const ctx = createMockContext('Line 1', {
        lines: ['Line 1', 'Line 2', 'Line 3'],
      });
      const svg = noteShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('Line 1');
      expect(svg).toContain('Line 2');
      expect(svg).toContain('Line 3');
    });

    it('should use light yellow background by default', () => {
      const ctx = createMockContext('Note');
      const svg = noteShape.render(ctx, { x: 0, y: 0 });

      expect(svg).toContain('fill="#ffffcc"') ||
        expect(svg).toContain('fill="#fffacd"');
    });
  });
});
