import { describe, it, expect } from 'vitest';
import { DiagramAstSchema, validateDiagram } from '../schema.js';
import type { DiagramAst } from '../types.js';

describe('Schema', () => {
  describe('DiagramAstSchema', () => {
    it('should validate a minimal valid diagram', () => {
      const data: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should validate a complete diagram', () => {
      const data: DiagramAst = {
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
            link: {
              href: 'https://example.com',
            },
            tooltip: 'Edge tooltip',
            data: { weight: 5 },
          },
        ],
        groups: [
          {
            id: 'group1',
            label: 'Group 1',
            children: ['node1'],
            style: 'primary',
          },
        ],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject missing astVersion', () => {
      const data = {
        nodes: [],
        edges: [],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing nodes', () => {
      const data = {
        astVersion: '1.0',
        edges: [],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject missing edges', () => {
      const data = {
        astVersion: '1.0',
        nodes: [],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid direction', () => {
      const data: any = {
        astVersion: '1.0',
        direction: 'INVALID',
        nodes: [],
        edges: [],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should validate all direction values', () => {
      const directions = ['LR', 'RL', 'TB', 'BT'] as const;

      directions.forEach((direction) => {
        const data: DiagramAst = {
          astVersion: '1.0',
          direction,
          nodes: [],
          edges: [],
        };

        const result = DiagramAstSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should validate node with all optional properties', () => {
      const data: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          {
            id: 'node1',
            shape: 'rounded',
            label: 'Test Node',
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
            tooltip: 'Test tooltip',
            data: { custom: 'data' },
          },
        ],
        edges: [],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should validate edge with all optional properties', () => {
      const data: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [
          {
            from: 'a',
            to: 'b',
            label: 'edge label',
            when: 'condition',
            style: 'primary',
            link: {
              href: 'https://example.com',
            },
            tooltip: 'Edge tooltip',
            data: { weight: 10 },
          },
        ],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject edge with missing from', () => {
      const data: any = {
        astVersion: '1.0',
        nodes: [],
        edges: [
          {
            to: 'b',
          },
        ],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject edge with missing to', () => {
      const data: any = {
        astVersion: '1.0',
        nodes: [],
        edges: [
          {
            from: 'a',
          },
        ],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject node with missing id', () => {
      const data: any = {
        astVersion: '1.0',
        nodes: [
          {
            shape: 'rounded',
          },
        ],
        edges: [],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject node with missing shape', () => {
      const data: any = {
        astVersion: '1.0',
        nodes: [
          {
            id: 'node1',
          },
        ],
        edges: [],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should validate group with optional properties', () => {
      const data: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
        groups: [
          {
            id: 'group1',
            label: 'Group 1',
            children: ['node1', 'node2'],
            style: 'primary',
          },
        ],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should validate group with minimal properties', () => {
      const data: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
        groups: [
          {
            children: [],
          },
        ],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject group with missing children', () => {
      const data: any = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
        groups: [
          {
            id: 'group1',
            label: 'Group 1',
          },
        ],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should validate link with all target options', () => {
      const targets = ['_blank', '_self', '_parent', '_top'] as const;

      targets.forEach((target) => {
        const data: DiagramAst = {
          astVersion: '1.0',
          nodes: [
            {
              id: 'node1',
              shape: 'rounded',
              link: {
                href: 'https://example.com',
                target,
              },
            },
          ],
          edges: [],
        };

        const result = DiagramAstSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid link target', () => {
      const data: any = {
        astVersion: '1.0',
        nodes: [
          {
            id: 'node1',
            shape: 'rounded',
            link: {
              href: 'https://example.com',
              target: 'invalid',
            },
          },
        ],
        edges: [],
      };

      const result = DiagramAstSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('validateDiagram', () => {
    it('should return success for valid diagram', () => {
      const data: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };

      const result = validateDiagram(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(data);
        expect(result.problems).toEqual([]);
      }
    });

    it('should return error for invalid diagram', () => {
      const data = {
        nodes: [],
        edges: [],
      };

      const result = validateDiagram(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.problems.length).toBeGreaterThan(0);
        expect(result.problems[0]).toContain('astVersion');
      }
    });

    it('should provide detailed error messages', () => {
      const data = {
        astVersion: '1.0',
        // Missing nodes array
        edges: [],
      };

      const result = validateDiagram(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.problems.length).toBeGreaterThan(0);
        expect(result.problems.some((p) => p.includes('nodes'))).toBe(true);
      }
    });

    it('should handle nested validation errors', () => {
      const data: any = {
        astVersion: '1.0',
        nodes: [
          {
            id: 'node1',
            // Missing shape
          },
        ],
        edges: [],
      };

      const result = validateDiagram(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.problems.length).toBeGreaterThan(0);
        expect(result.problems.some((p) => p.includes('shape'))).toBe(true);
      }
    });

    it('should handle multiple validation errors', () => {
      const data: any = {
        astVersion: '1.0',
        direction: 'INVALID',
        nodes: [
          {
            id: 'node1',
            // Missing shape
          },
        ],
        edges: [
          {
            // Missing from and to
          },
        ],
      };

      const result = validateDiagram(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.problems.length).toBeGreaterThan(2);
      }
    });
  });
});
