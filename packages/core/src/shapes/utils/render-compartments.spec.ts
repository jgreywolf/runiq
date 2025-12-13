import { describe, expect, it, vi } from 'vitest';
import type { ShapeRenderContext } from '../../types/index.js';
import { renderMultiCompartmentShape } from './render-compartments.js';

function createMockContext(): ShapeRenderContext {
  return {
    node: { id: 'test', label: 'Test' },
    style: {
      fill: '#ffffff',
      stroke: '#000000',
      strokeWidth: 1,
      fontSize: 14,
      fontFamily: 'Arial',
    },
    measureText: vi.fn(() => ({ width: 100, height: 16 })),
    renderLabel: vi.fn((text: string) => `<text>${text}</text>`),
  } as unknown as ShapeRenderContext;
}

describe('render-compartments', () => {
  describe('renderMultiCompartmentShape', () => {
    it('should render main rectangle', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 0, y: 0 },
        bounds: { width: 200, height: 100 },
        lineHeight: 18,
        padding: 10,
        compartments: [],
      });

      expect(svg).toContain('<rect');
      expect(svg).toContain('x="0"');
      expect(svg).toContain('y="0"');
      expect(svg).toContain('width="200"');
      expect(svg).toContain('height="100"');
    });

    it('should apply fill and stroke styles', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 0, y: 0 },
        bounds: { width: 200, height: 100 },
        lineHeight: 18,
        padding: 10,
        compartments: [],
      });

      expect(svg).toContain('fill="#ffffff"');
      expect(svg).toContain('stroke="#000000"');
      expect(svg).toContain('stroke-width="1"');
    });

    it('should render header compartment without separator', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 0, y: 0 },
        bounds: { width: 200, height: 100 },
        lineHeight: 18,
        padding: 10,
        header: {
          items: ['«interface»', 'IRepository'],
        },
        compartments: [],
      });

      expect(svg).toContain('«interface»');
      expect(svg).toContain('IRepository');
    });

    it('should render compartments with separators', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 0, y: 0 },
        bounds: { width: 200, height: 100 },
        lineHeight: 18,
        padding: 10,
        compartments: [
          { items: ['method1()', 'method2()'] },
          { items: ['field1: string', 'field2: number'] },
        ],
      });

      // Should have 2 separator lines (one before each compartment)
      const lineMatches = svg.match(/<line/g);
      expect(lineMatches).toHaveLength(2);
    });

    it('should skip empty compartments', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 0, y: 0 },
        bounds: { width: 200, height: 100 },
        lineHeight: 18,
        padding: 10,
        compartments: [{ items: [] }, { items: ['method()'] }, { items: [] }],
      });

      // Should only have 1 separator (for the non-empty compartment)
      const lineMatches = svg.match(/<line/g);
      expect(lineMatches).toHaveLength(1);
    });

    it('should support start alignment', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 10, y: 10 },
        bounds: { width: 200, height: 100 },
        lineHeight: 18,
        padding: 10,
        compartments: [
          {
            items: ['+ method()'],
            align: 'start',
          },
        ],
      });

      expect(svg).toContain('+ method()');
    });

    it('should support middle alignment', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 0, y: 0 },
        bounds: { width: 200, height: 100 },
        lineHeight: 18,
        padding: 10,
        compartments: [
          {
            items: ['CenteredText'],
            align: 'middle',
          },
        ],
      });

      expect(svg).toContain('CenteredText');
    });

    it('should apply custom styles to header', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 0, y: 0 },
        bounds: { width: 200, height: 100 },
        lineHeight: 18,
        padding: 10,
        header: {
          items: ['ClassName'],
          style: {
            fontWeight: 'bold',
            fontSize: 16,
          },
        },
        compartments: [],
      });

      expect(svg).toContain('ClassName');
    });

    it('should apply custom styles to compartment items', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 0, y: 0 },
        bounds: { width: 200, height: 100 },
        lineHeight: 18,
        padding: 10,
        compartments: [
          {
            items: ['abstract method()'],
            style: {
              fontStyle: 'italic',
            },
          },
        ],
      });

      expect(svg).toContain('abstract method()');
    });

    it('should use custom renderItem function', () => {
      const ctx = createMockContext();
      const customRenderer = vi.fn((item: string) => `custom-${item}`);

      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 0, y: 0 },
        bounds: { width: 200, height: 100 },
        lineHeight: 18,
        padding: 10,
        compartments: [
          {
            items: ['method1', 'method2'],
            renderItem: customRenderer,
          },
        ],
      });

      expect(customRenderer).toHaveBeenCalledWith('method1', 0);
      expect(customRenderer).toHaveBeenCalledWith('method2', 1);
    });

    it('should handle complex multi-section shape', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 0, y: 0 },
        bounds: { width: 200, height: 150 },
        lineHeight: 18,
        padding: 12,
        header: {
          items: ['«interface»', 'IRepository'],
          style: { fontWeight: 'bold' },
        },
        compartments: [
          {
            items: ['+ save(data): void', '+ load(id): Data'],
            align: 'start',
          },
          {
            items: ['- connection: Connection'],
            align: 'start',
            style: { fontStyle: 'italic' },
          },
        ],
      });

      expect(svg).toContain('<rect');
      expect(svg).toContain('«interface»');
      expect(svg).toContain('IRepository');
      expect(svg).toContain('+ save(data): void');
      expect(svg).toContain('+ load(id): Data');
      expect(svg).toContain('- connection: Connection');

      // Should have 2 separator lines
      const lineMatches = svg.match(/<line/g);
      expect(lineMatches).toHaveLength(2);
    });

    it('should handle UML class diagram structure', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 50, y: 50 },
        bounds: { width: 180, height: 120 },
        lineHeight: 18,
        padding: 10,
        header: {
          items: ['Person'],
          style: { fontWeight: 'bold' },
        },
        compartments: [
          {
            items: ['- name: string', '- age: number'],
            align: 'start',
          },
          {
            items: ['+ getName(): string', '+ getAge(): number'],
            align: 'start',
          },
        ],
      });

      expect(svg).toContain('Person');
      expect(svg).toContain('- name: string');
      expect(svg).toContain('- age: number');
      expect(svg).toContain('+ getName(): string');
      expect(svg).toContain('+ getAge(): number');
    });

    it('should position elements correctly with custom padding', () => {
      const ctx = createMockContext();
      const svg = renderMultiCompartmentShape({
        ctx,
        position: { x: 10, y: 20 },
        bounds: { width: 150, height: 100 },
        lineHeight: 20,
        padding: 15,
        compartments: [{ items: ['test'] }],
      });

      expect(svg).toContain('x="10"');
      expect(svg).toContain('y="20"');
      expect(svg).toContain('width="150"');
      expect(svg).toContain('height="100"');
    });
  });
});
