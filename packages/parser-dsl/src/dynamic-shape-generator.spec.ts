/**
 * Tests for Dynamic Shape Generator
 * Phase 3: Dynamic Shape Generation
 */

import { describe, it, expect } from 'vitest';
import {
  generateNodes,
  generateEdges,
  generateNodesAndEdges,
  type NodeGenerationConfig,
  type EdgeGenerationConfig,
  type DataObject,
} from './dynamic-shape-generator';

describe('Dynamic Shape Generator', () => {
  describe('generateNodes', () => {
    it('generates nodes with auto-assigned IDs', () => {
      const data: DataObject[] = [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' },
      ];

      const nodes = generateNodes(data);

      expect(nodes).toHaveLength(3);
      expect(nodes[0].id).toBe('node_0');
      expect(nodes[1].id).toBe('node_1');
      expect(nodes[2].id).toBe('node_2');
    });

    it('uses ID field from data when specified', () => {
      const data: DataObject[] = [
        { userId: 'u1', name: 'Alice' },
        { userId: 'u2', name: 'Bob' },
      ];

      const config: NodeGenerationConfig = {
        idField: 'userId',
      };

      const nodes = generateNodes(data, config);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].id).toBe('u1');
      expect(nodes[1].id).toBe('u2');
    });

    it('uses custom ID prefix', () => {
      const data: DataObject[] = [{ name: 'Alice' }, { name: 'Bob' }];

      const config: NodeGenerationConfig = {
        idPrefix: 'user_',
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].id).toBe('user_0');
      expect(nodes[1].id).toBe('user_1');
    });

    it('maps data fields to node properties', () => {
      const data: DataObject[] = [
        { name: 'Alice', age: 30, email: 'alice@example.com' },
      ];

      const config: NodeGenerationConfig = {
        fieldMappings: {
          label: 'name',
          subtitle: 'email',
        },
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.label).toBe('Alice');
      expect(nodes[0].properties.subtitle).toBe('alice@example.com');
      expect(nodes[0].properties.age).toBeUndefined(); // Not mapped
    });

    it('sets custom shape type', () => {
      const data: DataObject[] = [{ name: 'Alice' }];

      const config: NodeGenerationConfig = {
        shape: 'circle',
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].shape).toBe('circle');
    });

    it('handles empty data array', () => {
      const nodes = generateNodes([]);
      expect(nodes).toHaveLength(0);
    });

    it('handles missing mapped fields gracefully', () => {
      const data: DataObject[] = [{ name: 'Alice' }];

      const config: NodeGenerationConfig = {
        fieldMappings: {
          label: 'name',
          subtitle: 'email', // Does not exist
        },
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.label).toBe('Alice');
      expect(nodes[0].properties.subtitle).toBeUndefined();
    });
  });

  describe('generateEdges', () => {
    it('generates edges from relationship data', () => {
      const data: DataObject[] = [
        { source: 'n1', target: 'n2' },
        { source: 'n2', target: 'n3' },
      ];

      const config: EdgeGenerationConfig = {
        fromField: 'source',
        toField: 'target',
      };

      const edges = generateEdges(data, config);

      expect(edges).toHaveLength(2);
      expect(edges[0].from).toBe('n1');
      expect(edges[0].to).toBe('n2');
      expect(edges[1].from).toBe('n2');
      expect(edges[1].to).toBe('n3');
    });

    it('maps data fields to edge properties', () => {
      const data: DataObject[] = [
        { source: 'n1', target: 'n2', weight: 10, type: 'friend' },
      ];

      const config: EdgeGenerationConfig = {
        fromField: 'source',
        toField: 'target',
        fieldMappings: {
          label: 'type',
          thickness: 'weight',
        },
      };

      const edges = generateEdges(data, config);

      expect(edges[0].properties.label).toBe('friend');
      expect(edges[0].properties.thickness).toBe(10);
    });

    it('sets edge type', () => {
      const data: DataObject[] = [{ source: 'n1', target: 'n2' }];

      const config: EdgeGenerationConfig = {
        fromField: 'source',
        toField: 'target',
        edgeType: 'dependency',
      };

      const edges = generateEdges(data, config);

      expect(edges[0].type).toBe('dependency');
    });

    it('skips edges with missing from/to fields', () => {
      const data: DataObject[] = [
        { source: 'n1', target: 'n2' },
        { source: null, target: 'n3' },
        { source: 'n4', target: undefined },
        { source: 'n5', target: 'n6' },
      ];

      const config: EdgeGenerationConfig = {
        fromField: 'source',
        toField: 'target',
      };

      const edges = generateEdges(data, config);

      expect(edges).toHaveLength(2); // Only n1->n2 and n5->n6
    });

    it('handles empty data array', () => {
      const config: EdgeGenerationConfig = {
        fromField: 'source',
        toField: 'target',
      };

      const edges = generateEdges([], config);
      expect(edges).toHaveLength(0);
    });
  });

  describe('Style Mapping - Category', () => {
    it('applies category-based color mapping', () => {
      const data: DataObject[] = [
        { name: 'Alice', status: 'active' },
        { name: 'Bob', status: 'inactive' },
        { name: 'Charlie', status: 'active' },
      ];

      const config: NodeGenerationConfig = {
        fieldMappings: { label: 'name' },
        styleMappings: [
          {
            property: 'fill',
            field: 'status',
            type: 'category',
            categories: {
              active: 'green',
              inactive: 'gray',
            },
          },
        ],
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.fill).toBe('green');
      expect(nodes[1].properties.fill).toBe('gray');
      expect(nodes[2].properties.fill).toBe('green');
    });

    it('handles undefined category values', () => {
      const data: DataObject[] = [{ name: 'Alice', status: 'unknown' }];

      const config: NodeGenerationConfig = {
        styleMappings: [
          {
            property: 'fill',
            field: 'status',
            type: 'category',
            categories: {
              active: 'green',
              inactive: 'gray',
            },
          },
        ],
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.fill).toBeUndefined();
    });

    it('applies multiple category mappings', () => {
      const data: DataObject[] = [
        { name: 'Alice', status: 'active', priority: 'high' },
      ];

      const config: NodeGenerationConfig = {
        styleMappings: [
          {
            property: 'fill',
            field: 'status',
            type: 'category',
            categories: { active: 'green', inactive: 'gray' },
          },
          {
            property: 'stroke',
            field: 'priority',
            type: 'category',
            categories: { high: 'red', low: 'blue' },
          },
        ],
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.fill).toBe('green');
      expect(nodes[0].properties.stroke).toBe('red');
    });
  });

  describe('Style Mapping - Scale', () => {
    it('applies numeric scale mapping', () => {
      const data: DataObject[] = [
        { name: 'A', score: 0 },
        { name: 'B', score: 50 },
        { name: 'C', score: 100 },
      ];

      const config: NodeGenerationConfig = {
        styleMappings: [
          {
            property: 'opacity',
            field: 'score',
            type: 'scale',
            scale: {
              domain: [0, 100],
              range: ['0.2', '1.0'] as [string, string],
            },
          },
        ],
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.opacity).toBe(0.2);
      expect(nodes[1].properties.opacity).toBeCloseTo(0.6, 5); // Use toBeCloseTo for floating point
      expect(nodes[2].properties.opacity).toBe(1.0);
    });

    it('applies color scale mapping', () => {
      const data: DataObject[] = [
        { name: 'A', value: 0 },
        { name: 'B', value: 50 },
        { name: 'C', value: 100 },
      ];

      const config: NodeGenerationConfig = {
        styleMappings: [
          {
            property: 'fill',
            field: 'value',
            type: 'scale',
            scale: {
              domain: [0, 100],
              range: ['#ff0000', '#00ff00'],
            },
          },
        ],
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.fill).toBe('#ff0000'); // Red
      expect(nodes[1].properties.fill).toMatch(/^#[0-9a-f]{6}$/); // Mid-color (check format)
      expect(nodes[2].properties.fill).toBe('#00ff00'); // Green
    });

    it('clamps values outside domain', () => {
      const data: DataObject[] = [
        { name: 'A', value: -10 },
        { name: 'B', value: 110 },
      ];

      const config: NodeGenerationConfig = {
        styleMappings: [
          {
            property: 'size',
            field: 'value',
            type: 'scale',
            scale: {
              domain: [0, 100],
              range: ['10', '50'] as [string, string],
            },
          },
        ],
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.size).toBe(10); // Clamped to min
      expect(nodes[1].properties.size).toBe(50); // Clamped to max
    });

    it('handles non-numeric values in scale', () => {
      const data: DataObject[] = [{ name: 'A', value: 'not a number' }];

      const config: NodeGenerationConfig = {
        styleMappings: [
          {
            property: 'opacity',
            field: 'value',
            type: 'scale',
            scale: {
              domain: [0, 100],
              range: ['0', '1'] as [string, string],
            },
          },
        ],
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.opacity).toBeUndefined();
    });
  });

  describe('Style Mapping - Threshold', () => {
    it('applies threshold-based styling', () => {
      const data: DataObject[] = [
        { name: 'A', score: 90 },
        { name: 'B', score: 70 },
        { name: 'C', score: 50 },
      ];

      const config: NodeGenerationConfig = {
        styleMappings: [
          {
            property: 'fill',
            field: 'score',
            type: 'threshold',
            thresholds: [
              { value: 80, style: 'green' },
              { value: 60, style: 'yellow' },
              { value: 0, style: 'red' },
            ],
          },
        ],
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.fill).toBe('green'); // 90 >= 80
      expect(nodes[1].properties.fill).toBe('yellow'); // 70 >= 60
      expect(nodes[2].properties.fill).toBe('red'); // 50 < 60, use lowest
    });

    it('handles values below all thresholds', () => {
      const data: DataObject[] = [{ name: 'A', score: 5 }];

      const config: NodeGenerationConfig = {
        styleMappings: [
          {
            property: 'fill',
            field: 'score',
            type: 'threshold',
            thresholds: [
              { value: 80, style: 'green' },
              { value: 50, style: 'yellow' },
              { value: 20, style: 'red' },
            ],
          },
        ],
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.fill).toBe('red'); // Use lowest threshold style
    });

    it('handles exact threshold match', () => {
      const data: DataObject[] = [{ name: 'A', score: 60 }];

      const config: NodeGenerationConfig = {
        styleMappings: [
          {
            property: 'fill',
            field: 'score',
            type: 'threshold',
            thresholds: [
              { value: 60, style: 'yellow' },
              { value: 0, style: 'red' },
            ],
          },
        ],
      };

      const nodes = generateNodes(data, config);

      expect(nodes[0].properties.fill).toBe('yellow');
    });
  });

  describe('generateNodesAndEdges', () => {
    it('generates nodes and edges from relational data', () => {
      const data: DataObject[] = [
        { from: 'Alice', to: 'Bob' },
        { from: 'Bob', to: 'Charlie' },
        { from: 'Charlie', to: 'Alice' },
      ];

      const result = generateNodesAndEdges(data, {
        edgeConfig: {
          fromField: 'from',
          toField: 'to',
        },
      });

      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(3);

      const nodeIds = result.nodes.map((n) => n.id).sort();
      expect(nodeIds).toEqual(['Alice', 'Bob', 'Charlie']);
    });

    it('applies node configuration', () => {
      const data: DataObject[] = [{ from: 'u1', to: 'u2' }];

      const result = generateNodesAndEdges(data, {
        nodeConfig: {
          shape: 'circle',
          fieldMappings: { label: 'id' },
        },
        edgeConfig: {
          fromField: 'from',
          toField: 'to',
        },
      });

      expect(result.nodes[0].shape).toBe('circle');
    });

    it('applies edge configuration', () => {
      const data: DataObject[] = [{ from: 'n1', to: 'n2', type: 'friend' }];

      const result = generateNodesAndEdges(data, {
        edgeConfig: {
          fromField: 'from',
          toField: 'to',
          edgeType: 'relationship',
          fieldMappings: { label: 'type' },
        },
      });

      expect(result.edges[0].type).toBe('relationship');
      expect(result.edges[0].properties.label).toBe('friend');
    });

    it('handles duplicate nodes', () => {
      const data: DataObject[] = [
        { from: 'A', to: 'B' },
        { from: 'A', to: 'C' },
        { from: 'B', to: 'C' },
      ];

      const result = generateNodesAndEdges(data, {
        edgeConfig: {
          fromField: 'from',
          toField: 'to',
        },
      });

      expect(result.nodes).toHaveLength(3); // A, B, C (no duplicates)
      expect(result.edges).toHaveLength(3);
    });
  });

  describe('Edge style mapping', () => {
    it('applies style mappings to edges', () => {
      const data: DataObject[] = [
        { from: 'n1', to: 'n2', weight: 10 },
        { from: 'n2', to: 'n3', weight: 5 },
      ];

      const config: EdgeGenerationConfig = {
        fromField: 'from',
        toField: 'to',
        styleMappings: [
          {
            property: 'stroke',
            field: 'weight',
            type: 'threshold',
            thresholds: [
              { value: 8, style: 'thick' },
              { value: 0, style: 'thin' },
            ],
          },
        ],
      };

      const edges = generateEdges(data, config);

      expect(edges[0].properties.stroke).toBe('thick');
      expect(edges[1].properties.stroke).toBe('thin');
    });
  });

  describe('Complex scenarios', () => {
    it('generates network diagram with styled nodes and edges', () => {
      const nodeData: DataObject[] = [
        { id: 'server1', type: 'server', load: 80 },
        { id: 'server2', type: 'server', load: 40 },
        { id: 'db1', type: 'database', load: 60 },
      ];

      const edgeData: DataObject[] = [
        { from: 'server1', to: 'db1', bandwidth: 100 },
        { from: 'server2', to: 'db1', bandwidth: 50 },
      ];

      const nodes = generateNodes(nodeData, {
        idField: 'id',
        fieldMappings: { label: 'id' },
        styleMappings: [
          {
            property: 'fill',
            field: 'type',
            type: 'category',
            categories: {
              server: 'blue',
              database: 'green',
            },
          },
          {
            property: 'opacity',
            field: 'load',
            type: 'scale',
            scale: {
              domain: [0, 100],
              range: ['0.3', '1.0'] as [string, string],
            },
          },
        ],
      });

      const edges = generateEdges(edgeData, {
        fromField: 'from',
        toField: 'to',
        fieldMappings: { label: 'bandwidth' },
      });

      expect(nodes).toHaveLength(3);
      expect(nodes[0].properties.fill).toBe('blue');
      expect(nodes[2].properties.fill).toBe('green');
      expect(edges).toHaveLength(2);
    });
  });
});
