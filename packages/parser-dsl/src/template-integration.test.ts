/**
 * Integration Tests - Template Processor + Dynamic Shape Generator
 * Phase 3.3: Template Processor Integration
 */

import { describe, it, expect } from 'vitest';
import {
  processTemplateWithGeneration,
  generateDiagramFromRelationalData,
  type DataTemplate,
  type DataObject,
} from './template-processor';

describe('Template Processor + Dynamic Shape Generator Integration', () => {
  describe('processTemplateWithGeneration', () => {
    it('combines template processing with node generation', () => {
      const template: DataTemplate = {
        id: 'test',
        dataKey: 'users',
        statements: [],
      };

      const data: DataObject[] = [
        { id: 'u1', name: 'Alice', status: 'active' },
        { id: 'u2', name: 'Bob', status: 'inactive' },
        { id: 'u3', name: 'Charlie', status: 'active' },
      ];

      const result = processTemplateWithGeneration(template, data, {
        nodeConfig: {
          shape: 'rect',
          idField: 'id',
          fieldMappings: {
            label: 'name',
          },
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
        },
      });

      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0].id).toBe('u1');
      expect(result.nodes[0].properties.label).toBe('Alice');
      expect(result.nodes[0].properties.fill).toBe('green');
      expect(result.nodes[1].properties.fill).toBe('gray');
      expect(result.nodes[2].properties.fill).toBe('green');
    });

    it('combines template processing with edge generation', () => {
      const template: DataTemplate = {
        id: 'test',
        dataKey: 'connections',
        statements: [],
      };

      const data: DataObject[] = [
        { from: 'n1', to: 'n2', weight: 10 },
        { from: 'n2', to: 'n3', weight: 5 },
      ];

      const result = processTemplateWithGeneration(template, data, {
        edgeConfig: {
          fromField: 'from',
          toField: 'to',
          fieldMappings: {
            label: 'weight',
          },
        },
      });

      expect(result.edges).toHaveLength(2);
      expect(result.edges[0].from).toBe('n1');
      expect(result.edges[0].to).toBe('n2');
      expect(result.edges[0].properties.label).toBe(10);
    });

    it('generates both nodes and edges with style mappings', () => {
      const template: DataTemplate = {
        id: 'test',
        dataKey: 'servers',
        statements: [],
      };

      const nodeData: DataObject[] = [
        { id: 'server1', type: 'web', load: 80 },
        { id: 'server2', type: 'api', load: 40 },
      ];

      const result = processTemplateWithGeneration(template, nodeData, {
        nodeConfig: {
          idField: 'id',
          shape: 'rect',
          fieldMappings: { label: 'id' },
          styleMappings: [
            {
              property: 'fill',
              field: 'type',
              type: 'category',
              categories: {
                web: 'blue',
                api: 'green',
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
        },
      });

      expect(result.nodes).toHaveLength(2);
      expect(result.nodes[0].properties.fill).toBe('blue');
      expect(result.nodes[1].properties.fill).toBe('green');
      // Opacity calculated from load: 0.3 + (load/100 * 0.7)
      expect(result.nodes[0].properties.opacity).toBeCloseTo(0.86, 1); // load=80 → 0.86
      expect(result.nodes[1].properties.opacity).toBeCloseTo(0.58, 1); // load=40 → 0.58
    });
  });

  describe('generateDiagramFromRelationalData', () => {
    it('generates network diagram from relationship data', () => {
      const data: DataObject[] = [
        { from: 'Alice', to: 'Bob' },
        { from: 'Bob', to: 'Charlie' },
        { from: 'Charlie', to: 'Alice' },
      ];

      const result = generateDiagramFromRelationalData(data, {
        nodeConfig: {
          shape: 'circle',
        },
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

    it('applies style mappings to generated diagram', () => {
      const data: DataObject[] = [
        { from: 'n1', to: 'n2', type: 'strong', weight: 10 },
        { from: 'n2', to: 'n3', type: 'weak', weight: 3 },
      ];

      const result = generateDiagramFromRelationalData(data, {
        nodeConfig: {
          shape: 'rect',
        },
        edgeConfig: {
          fromField: 'from',
          toField: 'to',
          fieldMappings: {
            label: 'weight',
          },
          styleMappings: [
            {
              property: 'stroke',
              field: 'type',
              type: 'category',
              categories: {
                strong: 'bold',
                weak: 'thin',
              },
            },
          ],
        },
      });

      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);
      expect(result.edges[0].properties.stroke).toBe('bold');
      expect(result.edges[1].properties.stroke).toBe('thin');
    });

    it('generates complex network with multiple style dimensions', () => {
      const data: DataObject[] = [
        { source: 'A', target: 'B', bandwidth: 100, latency: 10 },
        { source: 'B', target: 'C', bandwidth: 50, latency: 20 },
        { source: 'C', target: 'D', bandwidth: 75, latency: 15 },
      ];

      const result = generateDiagramFromRelationalData(data, {
        nodeConfig: {
          shape: 'circle',
        },
        edgeConfig: {
          fromField: 'source',
          toField: 'target',
          styleMappings: [
            {
              property: 'strokeWidth',
              field: 'bandwidth',
              type: 'scale',
              scale: {
                domain: [0, 100],
                range: ['1', '5'] as [string, string],
              },
            },
            {
              property: 'stroke',
              field: 'latency',
              type: 'threshold',
              thresholds: [
                { value: 15, style: 'red' },
                { value: 0, style: 'green' },
              ],
            },
          ],
        },
      });

      expect(result.nodes).toHaveLength(4);
      expect(result.edges).toHaveLength(3);
      expect(result.edges[0].properties.strokeWidth).toBe(5); // 100 bandwidth
      expect(result.edges[1].properties.strokeWidth).toBe(3); // 50 bandwidth
      expect(result.edges[0].properties.stroke).toBe('green'); // 10 latency
      expect(result.edges[1].properties.stroke).toBe('red'); // 20 latency
    });
  });

  describe('Real-world scenarios', () => {
    it('generates organizational chart with hierarchy', () => {
      const data: DataObject[] = [
        { id: 'ceo', name: 'Alice', level: 1 },
        { id: 'cto', name: 'Bob', level: 2, reportsTo: 'ceo' },
        { id: 'dev1', name: 'Charlie', level: 3, reportsTo: 'cto' },
        { id: 'dev2', name: 'David', level: 3, reportsTo: 'cto' },
      ];

      // Generate nodes with level-based styling
      const template: DataTemplate = {
        id: 'org-chart',
        dataKey: 'employees',
        statements: [],
      };

      const result = processTemplateWithGeneration(template, data, {
        nodeConfig: {
          idField: 'id',
          shape: 'rect',
          fieldMappings: {
            label: 'name',
          },
          styleMappings: [
            {
              property: 'fill',
              field: 'level',
              type: 'category',
              categories: {
                '1': '#FFD700',
                '2': '#C0C0C0',
                '3': '#CD7F32',
              },
            },
          ],
        },
      });

      expect(result.nodes).toHaveLength(4);
      expect(result.nodes[0].properties.fill).toBe('#FFD700'); // CEO gold
      expect(result.nodes[1].properties.fill).toBe('#C0C0C0'); // CTO silver
      expect(result.nodes[2].properties.fill).toBe('#CD7F32'); // Dev bronze
    });

    it('generates service dependency graph', () => {
      const services = [
        { name: 'api', status: 'healthy', cpu: 45 },
        { name: 'db', status: 'healthy', cpu: 80 },
        { name: 'cache', status: 'warning', cpu: 60 },
      ];

      // Dependencies could be processed in a separate pass
      // const dependencies = [
      //   { from: 'api', to: 'db', calls: 1000 },
      //   { from: 'api', to: 'cache', calls: 5000 },
      // ];

      const template: DataTemplate = {
        id: 'services',
        dataKey: 'services',
        statements: [],
      };

      const result = processTemplateWithGeneration(template, services, {
        nodeConfig: {
          idField: 'name',
          shape: 'rounded',
          fieldMappings: {
            label: 'name',
          },
          styleMappings: [
            {
              property: 'fill',
              field: 'status',
              type: 'category',
              categories: {
                healthy: 'green',
                warning: 'yellow',
                error: 'red',
              },
            },
            {
              property: 'opacity',
              field: 'cpu',
              type: 'scale',
              scale: {
                domain: [0, 100],
                range: ['0.5', '1.0'] as [string, string],
              },
            },
          ],
        },
      });

      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0].properties.fill).toBe('green');
      expect(result.nodes[2].properties.fill).toBe('yellow');
    });
  });
});
