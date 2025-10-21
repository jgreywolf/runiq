import { describe, it, expect } from 'vitest';
import { classShape } from '../class.js';
import type { NodeAst } from '../../../types.js';

describe('Class Shape Visual Enhancements', () => {
  const mockMeasureText = (text: string) => ({
    width: text.length * 8,
    height: 16,
  });

  const createMockContext = (node: NodeAst) => ({
    node,
    style: {},
    measureText: mockMeasureText,
  });

  describe('Static Members (Underline)', () => {
    it('should underline static attributes', () => {
      const node: NodeAst = {
        id: 'MathUtils',
        shape: 'class',
        label: 'MathUtils',
        data: {
          attributes: [
            {
              name: 'PI',
              type: 'double',
              visibility: 'public',
              isStatic: true,
            },
            { name: 'E', type: 'double', visibility: 'public', isStatic: true },
            { name: 'version', type: 'string', visibility: 'private' }, // Not static
          ],
        },
      };

      const ctx = createMockContext(node);
      const svg = classShape.render(ctx, { x: 0, y: 0 });

      // Check for underline on static attributes
      expect(svg).toContain('text-decoration="underline"');

      // Should have underline on PI and E
      const underlineMatches = svg.match(/text-decoration="underline"/g);
      expect(underlineMatches?.length).toBeGreaterThanOrEqual(2);

      // Verify PI is rendered with underline
      expect(svg).toMatch(/text-decoration="underline"[^>]*>\+ PI: double/);
    });

    it('should underline static methods', () => {
      const node: NodeAst = {
        id: 'MathUtils',
        shape: 'class',
        label: 'MathUtils',
        data: {
          methods: [
            {
              name: 'max',
              params: [
                { name: 'a', type: 'int' },
                { name: 'b', type: 'int' },
              ],
              returnType: 'int',
              visibility: 'public',
              isStatic: true,
            },
            {
              name: 'min',
              params: [
                { name: 'a', type: 'int' },
                { name: 'b', type: 'int' },
              ],
              returnType: 'int',
              visibility: 'public',
              isStatic: true,
            },
            { name: 'toString', returnType: 'string', visibility: 'public' }, // Not static
          ],
        },
      };

      const ctx = createMockContext(node);
      const svg = classShape.render(ctx, { x: 0, y: 0 });

      // Check for underline on static methods
      expect(svg).toContain('text-decoration="underline"');

      // Verify max is rendered with underline
      expect(svg).toMatch(
        /text-decoration="underline"[^>]*>\+ max\(a: int, b: int\): int/
      );
    });
  });

  describe('Abstract Methods (Italics)', () => {
    it('should italicize abstract methods', () => {
      const node: NodeAst = {
        id: 'Shape',
        shape: 'class',
        label: 'Shape',
        data: {
          stereotype: 'abstract',
          methods: [
            {
              name: 'area',
              returnType: 'double',
              visibility: 'public',
              isAbstract: true,
            },
            {
              name: 'perimeter',
              returnType: 'double',
              visibility: 'public',
              isAbstract: true,
            },
            { name: 'toString', returnType: 'string', visibility: 'public' }, // Not abstract (concrete implementation)
          ],
        },
      };

      const ctx = createMockContext(node);
      const svg = classShape.render(ctx, { x: 0, y: 0 });

      // Check for italics on abstract methods
      expect(svg).toContain('font-style="italic"');

      // Should have italics on area and perimeter
      const italicMatches = svg.match(/font-style="italic"/g);
      expect(italicMatches?.length).toBeGreaterThanOrEqual(2);

      // Verify area is rendered with italics
      expect(svg).toMatch(/font-style="italic"[^>]*>\+ area\(\): double/);
    });

    it('should combine static and abstract styles', () => {
      // Note: This is an unusual case (static abstract doesn't make sense in most languages)
      // but we test the rendering capability
      const node: NodeAst = {
        id: 'Test',
        shape: 'class',
        label: 'Test',
        data: {
          methods: [
            {
              name: 'staticAbstract',
              returnType: 'void',
              visibility: 'public',
              isStatic: true,
              isAbstract: true,
            },
          ],
        },
      };

      const ctx = createMockContext(node);
      const svg = classShape.render(ctx, { x: 0, y: 0 });

      // Should have both underline and italics
      expect(svg).toContain('text-decoration="underline"');
      expect(svg).toContain('font-style="italic"');
    });
  });

  describe('Derived Attributes (/ prefix)', () => {
    it('should prefix derived attributes with /', () => {
      const node: NodeAst = {
        id: 'Person',
        shape: 'class',
        label: 'Person',
        data: {
          attributes: [
            { name: 'birthdate', type: 'Date', visibility: 'private' },
            { name: 'age', type: 'int', visibility: 'public', isDerived: true }, // Calculated from birthdate
            { name: 'name', type: 'string', visibility: 'private' },
            {
              name: 'fullName',
              type: 'string',
              visibility: 'public',
              isDerived: true,
            }, // Calculated from firstName + lastName
          ],
        },
      };

      const ctx = createMockContext(node);
      const svg = classShape.render(ctx, { x: 0, y: 0 });

      // Check for / prefix on derived attributes
      expect(svg).toContain('+ /age: int');
      expect(svg).toContain('+ /fullName: string');

      // Non-derived attributes should not have /
      expect(svg).toContain('- birthdate: Date');
      expect(svg).not.toContain('- /birthdate');
    });

    it('should handle derived static attributes', () => {
      const node: NodeAst = {
        id: 'Counter',
        shape: 'class',
        label: 'Counter',
        data: {
          attributes: [
            {
              name: 'count',
              type: 'int',
              visibility: 'private',
              isStatic: true,
            },
            {
              name: 'total',
              type: 'int',
              visibility: 'public',
              isStatic: true,
              isDerived: true,
            }, // Derived from count
          ],
        },
      };

      const ctx = createMockContext(node);
      const svg = classShape.render(ctx, { x: 0, y: 0 });

      // Should have both underline (static) and / prefix (derived)
      expect(svg).toContain('text-decoration="underline"');
      expect(svg).toMatch(/text-decoration="underline"[^>]*>\+ \/total: int/);
    });
  });

  describe('Complex Visual Combinations', () => {
    it('should render class with all visual enhancements', () => {
      const node: NodeAst = {
        id: 'CompleteClass',
        shape: 'class',
        label: 'CompleteClass',
        data: {
          stereotype: 'abstract',
          attributes: [
            {
              name: 'instance',
              type: 'CompleteClass',
              visibility: 'private',
              isStatic: true,
            },
            {
              name: 'count',
              type: 'int',
              visibility: 'public',
              isStatic: true,
              isDerived: true,
            },
            { name: 'name', type: 'string', visibility: 'private' },
            {
              name: 'displayName',
              type: 'string',
              visibility: 'public',
              isDerived: true,
            },
          ],
          methods: [
            {
              name: 'getInstance',
              returnType: 'CompleteClass',
              visibility: 'public',
              isStatic: true,
            },
            {
              name: 'abstract',
              returnType: 'void',
              visibility: 'public',
              isAbstract: true,
            },
            { name: 'concrete', returnType: 'void', visibility: 'public' },
          ],
        },
      };

      const ctx = createMockContext(node);
      const svg = classShape.render(ctx, { x: 0, y: 0 });

      // Verify all visual enhancements are present
      expect(svg).toContain('text-decoration="underline"'); // Static members
      expect(svg).toContain('font-style="italic"'); // Abstract methods
      expect(svg).toContain('+ /count'); // Derived attribute
      expect(svg).toContain('+ /displayName'); // Derived attribute

      // Verify combinations work
      expect(svg).toMatch(
        /text-decoration="underline"[^>]*>- instance: CompleteClass/
      ); // Static attribute
      expect(svg).toMatch(/text-decoration="underline"[^>]*>\+ \/count: int/); // Static + derived
      expect(svg).toMatch(/font-style="italic"[^>]*>\+ abstract\(\): void/); // Abstract method
    });
  });
});
