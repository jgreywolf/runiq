import { describe, it, expect } from 'vitest';
import { astToJson, jsonToAst, roundTrip } from '../index.js';
import type { DiagramAst } from '@runiq/core';

describe('io-json', () => {
  describe('astToJson', () => {
    it('should convert minimal AST to JSON', () => {
      const ast: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };

      const result = astToJson(ast);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.problems).toHaveLength(0);

      if (result.data) {
        const parsed = JSON.parse(result.data);
        expect(parsed.astVersion).toBe('1.0');
        expect(parsed.nodes).toEqual([]);
        expect(parsed.edges).toEqual([]);
      }
    });

    it('should convert complete AST to JSON', () => {
      const ast: DiagramAst = {
        astVersion: '1.0',
        title: 'Test Diagram',
        direction: 'LR',
        styles: {
          primary: {
            fill: '#3b82f6',
            stroke: '#1d4ed8',
          },
        },
        nodes: [
          {
            id: 'node1',
            shape: 'rounded',
            label: 'Node 1',
            style: 'primary',
            icon: {
              provider: 'fa',
              name: 'user',
            },
            link: {
              href: 'https://example.com',
              target: '_blank',
            },
            tooltip: 'This is node 1',
            data: { custom: 'value' },
          },
        ],
        edges: [
          {
            from: 'node1',
            to: 'node2',
            label: 'connects',
            style: 'primary',
            tooltip: 'Edge tooltip',
          },
        ],
        groups: [
          {
            id: 'group1',
            label: 'Group 1',
            children: ['node1'],
          },
        ],
      };

      const result = astToJson(ast);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.problems).toHaveLength(0);

      if (result.data) {
        const parsed = JSON.parse(result.data);
        expect(parsed.title).toBe('Test Diagram');
        expect(parsed.direction).toBe('LR');
        expect(parsed.nodes).toHaveLength(1);
        expect(parsed.edges).toHaveLength(1);
        expect(parsed.groups).toHaveLength(1);
        expect(parsed.styles.primary.fill).toBe('#3b82f6');
      }
    });

    it('should format JSON with indentation', () => {
      const ast: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'A', shape: 'rounded' }],
        edges: [],
      };

      const result = astToJson(ast);

      expect(result.success).toBe(true);
      if (result.data) {
        // Check that JSON is formatted (contains newlines)
        expect(result.data).toContain('\n');
        // Check indentation (2 spaces)
        expect(result.data).toMatch(/  "astVersion"/);
      }
    });

    it('should handle nodes with all optional properties', () => {
      const ast: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          {
            id: 'node1',
            shape: 'rounded',
            label: 'Test',
            style: 'style1',
            icon: { provider: 'fa', name: 'user' },
            link: { href: 'http://test.com' },
            tooltip: 'Tooltip',
            data: { key: 'value' },
          },
        ],
        edges: [],
      };

      const result = astToJson(ast);

      expect(result.success).toBe(true);
      if (result.data) {
        const parsed = JSON.parse(result.data);
        expect(parsed.nodes[0].label).toBe('Test');
        expect(parsed.nodes[0].icon.provider).toBe('fa');
        expect(parsed.nodes[0].link.href).toBe('http://test.com');
        expect(parsed.nodes[0].tooltip).toBe('Tooltip');
        expect(parsed.nodes[0].data.key).toBe('value');
      }
    });

    it('should handle edges with all optional properties', () => {
      const ast: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [
          {
            from: 'A',
            to: 'B',
            label: 'edge label',
            when: 'condition',
            style: 'style1',
            link: { href: 'http://test.com' },
            tooltip: 'Edge tooltip',
            data: { weight: 10 },
          },
        ],
      };

      const result = astToJson(ast);

      expect(result.success).toBe(true);
      if (result.data) {
        const parsed = JSON.parse(result.data);
        expect(parsed.edges[0].label).toBe('edge label');
        expect(parsed.edges[0].when).toBe('condition');
        expect(parsed.edges[0].data.weight).toBe(10);
      }
    });
  });

  describe('jsonToAst', () => {
    it('should parse valid minimal JSON', () => {
      const json = JSON.stringify({
        astVersion: '1.0',
        nodes: [],
        edges: [],
      });

      const result = jsonToAst(json);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.problems).toHaveLength(0);

      if (result.data) {
        expect(result.data.astVersion).toBe('1.0');
        expect(result.data.nodes).toEqual([]);
        expect(result.data.edges).toEqual([]);
      }
    });

    it('should parse valid complete JSON', () => {
      const json = JSON.stringify({
        astVersion: '1.0',
        title: 'Test Diagram',
        direction: 'LR',
        styles: {
          primary: { fill: '#3b82f6' },
        },
        nodes: [
          {
            id: 'node1',
            shape: 'rounded',
            label: 'Node 1',
          },
        ],
        edges: [
          {
            from: 'node1',
            to: 'node2',
          },
        ],
      });

      const result = jsonToAst(json);

      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data.title).toBe('Test Diagram');
        expect(result.data.direction).toBe('LR');
        expect(result.data.nodes).toHaveLength(1);
        expect(result.data.edges).toHaveLength(1);
      }
    });

    it('should reject invalid JSON syntax', () => {
      const json = '{ invalid json }';

      const result = jsonToAst(json);

      expect(result.success).toBe(false);
      expect(result.problems.length).toBeGreaterThan(0);
      expect(result.problems[0]).toContain('JSON parse failed');
    });

    it('should reject JSON missing astVersion', () => {
      const json = JSON.stringify({
        nodes: [],
        edges: [],
      });

      const result = jsonToAst(json);

      expect(result.success).toBe(false);
      expect(result.problems.length).toBeGreaterThan(0);
      expect(result.problems.some((p) => p.includes('astVersion'))).toBe(true);
    });

    it('should reject JSON missing nodes', () => {
      const json = JSON.stringify({
        astVersion: '1.0',
        edges: [],
      });

      const result = jsonToAst(json);

      expect(result.success).toBe(false);
      expect(result.problems.some((p) => p.includes('nodes'))).toBe(true);
    });

    it('should reject JSON missing edges', () => {
      const json = JSON.stringify({
        astVersion: '1.0',
        nodes: [],
      });

      const result = jsonToAst(json);

      expect(result.success).toBe(false);
      expect(result.problems.some((p) => p.includes('edges'))).toBe(true);
    });

    it('should reject invalid direction value', () => {
      const json = JSON.stringify({
        astVersion: '1.0',
        direction: 'INVALID',
        nodes: [],
        edges: [],
      });

      const result = jsonToAst(json);

      expect(result.success).toBe(false);
      expect(result.problems.length).toBeGreaterThan(0);
    });

    it('should reject node with missing id', () => {
      const json = JSON.stringify({
        astVersion: '1.0',
        nodes: [{ shape: 'rounded' }],
        edges: [],
      });

      const result = jsonToAst(json);

      expect(result.success).toBe(false);
      expect(result.problems.some((p) => p.includes('id'))).toBe(true);
    });

    it('should reject node with missing shape', () => {
      const json = JSON.stringify({
        astVersion: '1.0',
        nodes: [{ id: 'node1' }],
        edges: [],
      });

      const result = jsonToAst(json);

      expect(result.success).toBe(false);
      expect(result.problems.some((p) => p.includes('shape'))).toBe(true);
    });

    it('should reject edge with missing from', () => {
      const json = JSON.stringify({
        astVersion: '1.0',
        nodes: [],
        edges: [{ to: 'B' }],
      });

      const result = jsonToAst(json);

      expect(result.success).toBe(false);
      expect(result.problems.some((p) => p.includes('from'))).toBe(true);
    });

    it('should reject edge with missing to', () => {
      const json = JSON.stringify({
        astVersion: '1.0',
        nodes: [],
        edges: [{ from: 'A' }],
      });

      const result = jsonToAst(json);

      expect(result.success).toBe(false);
      expect(result.problems.some((p) => p.includes('to'))).toBe(true);
    });

    it('should handle formatted JSON with whitespace', () => {
      const json = `{
  "astVersion": "1.0",
  "nodes": [
    {
      "id": "A",
      "shape": "rounded"
    }
  ],
  "edges": []
}`;

      const result = jsonToAst(json);

      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data.nodes).toHaveLength(1);
        expect(result.data.nodes[0].id).toBe('A');
      }
    });

    it('should validate all direction values', () => {
      const directions = ['LR', 'RL', 'TB', 'BT'];

      directions.forEach((direction) => {
        const json = JSON.stringify({
          astVersion: '1.0',
          direction,
          nodes: [],
          edges: [],
        });

        const result = jsonToAst(json);

        expect(result.success).toBe(true);
        if (result.data) {
          expect(result.data.direction).toBe(direction);
        }
      });
    });

    it('should validate link target values', () => {
      const targets = ['_blank', '_self', '_parent', '_top'] as const;

      targets.forEach((target) => {
        const json = JSON.stringify({
          astVersion: '1.0',
          nodes: [
            {
              id: 'node1',
              shape: 'rounded',
              link: {
                href: 'http://example.com',
                target,
              },
            },
          ],
          edges: [],
        });

        const result = jsonToAst(json);

        expect(result.success).toBe(true);
      });
    });
  });

  describe('roundTrip', () => {
    it('should preserve minimal AST through round trip', () => {
      const original: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };

      const result = roundTrip(original);

      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data).toEqual(original);
      }
    });

    it('should preserve complete AST through round trip', () => {
      const original: DiagramAst = {
        astVersion: '1.0',
        title: 'Test Diagram',
        direction: 'LR',
        styles: {
          primary: {
            fill: '#3b82f6',
            stroke: '#1d4ed8',
            strokeWidth: 2,
          },
        },
        nodes: [
          {
            id: 'node1',
            shape: 'rounded',
            label: 'Node 1',
            style: 'primary',
            icon: {
              provider: 'fa',
              name: 'user',
            },
            link: {
              href: 'https://example.com',
              target: '_blank',
              rel: 'noopener',
            },
            tooltip: 'Node tooltip',
            data: { custom: 'value' },
          },
        ],
        edges: [
          {
            from: 'node1',
            to: 'node2',
            label: 'connects',
            style: 'primary',
            tooltip: 'Edge tooltip',
            data: { weight: 5 },
          },
        ],
        groups: [
          {
            id: 'group1',
            label: 'Group 1',
            children: ['node1', 'node2'],
            style: 'primary',
          },
        ],
      };

      const result = roundTrip(original);

      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data).toEqual(original);
      }
    });

    it('should preserve all direction options', () => {
      const directions: Array<'LR' | 'RL' | 'TB' | 'BT'> = [
        'LR',
        'RL',
        'TB',
        'BT',
      ];

      directions.forEach((direction) => {
        const original: DiagramAst = {
          astVersion: '1.0',
          direction,
          nodes: [],
          edges: [],
        };

        const result = roundTrip(original);

        expect(result.success).toBe(true);
        if (result.data) {
          expect(result.data.direction).toBe(direction);
        }
      });
    });

    it('should preserve node properties', () => {
      const original: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          {
            id: 'A',
            shape: 'rounded',
            label: 'Test Label',
            style: 'primary',
            icon: { provider: 'fa', name: 'star' },
            link: { href: 'http://test.com', target: '_blank' },
            tooltip: 'Test Tooltip',
            data: { key1: 'value1', key2: 123 },
          },
        ],
        edges: [],
      };

      const result = roundTrip(original);

      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data.nodes[0]).toEqual(original.nodes[0]);
      }
    });

    it('should preserve edge properties', () => {
      const original: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [
          {
            from: 'A',
            to: 'B',
            label: 'Edge Label',
            when: 'condition',
            style: 'primary',
            tooltip: 'Edge Tooltip',
            data: { weight: 10 },
          },
        ],
      };

      const result = roundTrip(original);

      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data.edges[0]).toEqual(original.edges[0]);
      }
    });

    it('should preserve group properties', () => {
      const original: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
        groups: [
          {
            id: 'group1',
            label: 'Group Label',
            children: ['A', 'B', 'C'],
            style: 'primary',
          },
        ],
      };

      const result = roundTrip(original);

      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data.groups).toEqual(original.groups);
      }
    });

    it('should preserve style definitions', () => {
      const original: DiagramAst = {
        astVersion: '1.0',
        styles: {
          primary: {
            fill: '#3b82f6',
            stroke: '#1d4ed8',
            strokeWidth: 2,
            rx: 8,
            padding: 10,
          },
          secondary: {
            fill: '#ef4444',
            stroke: '#b91c1c',
          },
        },
        nodes: [],
        edges: [],
      };

      const result = roundTrip(original);

      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data.styles).toEqual(original.styles);
      }
    });

    it('should handle multiple nodes and edges', () => {
      const original: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'rounded' },
          { id: 'B', shape: 'circle' },
          { id: 'C', shape: 'diamond' },
        ],
        edges: [
          { from: 'A', to: 'B' },
          { from: 'B', to: 'C' },
          { from: 'A', to: 'C' },
        ],
      };

      const result = roundTrip(original);

      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data.nodes).toHaveLength(3);
        expect(result.data.edges).toHaveLength(3);
        expect(result.data).toEqual(original);
      }
    });
  });

  describe('Error Propagation', () => {
    it('should propagate serialization errors in round trip', () => {
      // Create an AST with circular reference (invalid for JSON)
      const ast: any = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };
      ast.circular = ast;

      const result = roundTrip(ast);

      expect(result.success).toBe(false);
      expect(result.problems.length).toBeGreaterThan(0);
    });
  });
});
