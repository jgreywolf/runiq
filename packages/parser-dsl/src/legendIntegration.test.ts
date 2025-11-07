/**
 * Tests for Legend Integration with Template Processor
 */

import { describe, it, expect } from 'vitest';
import {
  processTemplateWithGeneration,
  generateDiagramFromRelationalData,
  type DataTemplate,
  type DataObject,
} from './template-processor.js';

describe('Legend Integration', () => {
  describe('processTemplateWithGeneration with legends', () => {
    it('generates legends from node style mappings', () => {
      const template: DataTemplate = {
        id: 'servers',
        dataKey: 'servers',
        statements: [],
      };

      const data: DataObject[] = [
        { id: 's1', name: 'Server 1', status: 'active', load: 80 },
        { id: 's2', name: 'Server 2', status: 'inactive', load: 40 },
      ];

      const result = processTemplateWithGeneration(template, data, {
        nodeConfig: {
          idField: 'id',
          shape: 'rect',
          fieldMappings: { label: 'name' },
          styleMappings: [
            {
              property: 'fill',
              field: 'status',
              type: 'category',
              categories: {
                active: '#22c55e',
                inactive: '#6b7280',
              },
            },
            {
              property: 'opacity',
              field: 'load',
              type: 'scale',
              scale: {
                domain: [0, 100],
                range: ['0.3', '1.0'],
              },
            },
          ],
        },
        generateLegends: true,
      });

      expect(result.legends).toBeDefined();
      expect(result.legends).toHaveLength(2);
      expect(result.legends![0].type).toBe('category');
      expect(result.legends![1].type).toBe('scale');
    });

    it('generates legends from edge style mappings', () => {
      const template: DataTemplate = {
        id: 'connections',
        dataKey: 'connections',
        statements: [],
      };

      const data: DataObject[] = [
        { from: 'a', to: 'b', bandwidth: 100 },
        { from: 'b', to: 'c', bandwidth: 50 },
      ];

      const result = processTemplateWithGeneration(template, data, {
        edgeConfig: {
          fromField: 'from',
          toField: 'to',
          styleMappings: [
            {
              property: 'strokeWidth',
              field: 'bandwidth',
              type: 'scale',
              scale: {
                domain: [0, 100],
                range: ['1', '5'],
              },
            },
          ],
        },
        generateLegends: true,
      });

      expect(result.legends).toBeDefined();
      expect(result.legends).toHaveLength(1);
      expect(result.legends![0].type).toBe('scale');
      expect(result.legends![0].title).toBe('bandwidth (strokeWidth)');
    });

    it('does not generate legends when generateLegends is false', () => {
      const template: DataTemplate = {
        id: 'nodes',
        dataKey: 'nodes',
        statements: [],
      };

      const data: DataObject[] = [{ id: 'n1', status: 'active' }];

      const result = processTemplateWithGeneration(template, data, {
        nodeConfig: {
          idField: 'id',
          styleMappings: [
            {
              property: 'fill',
              field: 'status',
              type: 'category',
              categories: { active: 'green' },
            },
          ],
        },
        generateLegends: false,
      });

      expect(result.legends).toBeUndefined();
    });

    it('applies custom legend config', () => {
      const template: DataTemplate = {
        id: 'items',
        dataKey: 'items',
        statements: [],
      };

      const data: DataObject[] = [{ id: 'i1', priority: 'high' }];

      const result = processTemplateWithGeneration(template, data, {
        nodeConfig: {
          idField: 'id',
          styleMappings: [
            {
              property: 'fill',
              field: 'priority',
              type: 'category',
              categories: { high: 'red' },
            },
          ],
        },
        generateLegends: true,
        legendConfig: {
          position: 'top-left',
          title: 'Custom Title',
        },
      });

      expect(result.legends).toBeDefined();
      expect(result.legends![0].position).toBe('top-left');
      expect(result.legends![0].title).toBe('Custom Title');
    });
  });

  describe('generateDiagramFromRelationalData with legends', () => {
    it('generates legends for network diagrams', () => {
      const data: DataObject[] = [
        { from: 'Alice', to: 'Bob', type: 'friend', strength: 10 },
        { from: 'Bob', to: 'Charlie', type: 'colleague', strength: 5 },
      ];

      const result = generateDiagramFromRelationalData(data, {
        edgeConfig: {
          fromField: 'from',
          toField: 'to',
          styleMappings: [
            {
              property: 'stroke',
              field: 'type',
              type: 'category',
              categories: {
                friend: '#3b82f6',
                colleague: '#eab308',
              },
            },
            {
              property: 'strokeWidth',
              field: 'strength',
              type: 'scale',
              scale: {
                domain: [0, 10],
                range: ['1', '5'],
              },
            },
          ],
        },
        generateLegends: true,
      });

      expect(result.nodes).toHaveLength(3); // Alice, Bob, Charlie
      expect(result.edges).toHaveLength(2);
      expect(result.legends).toBeDefined();
      expect(result.legends).toHaveLength(2);
    });

    it('generates legends with threshold mappings', () => {
      const data: DataObject[] = [
        { from: 'A', to: 'B', latency: 100 },
        { from: 'B', to: 'C', latency: 500 },
      ];

      const result = generateDiagramFromRelationalData(data, {
        edgeConfig: {
          fromField: 'from',
          toField: 'to',
          styleMappings: [
            {
              property: 'stroke',
              field: 'latency',
              type: 'threshold',
              thresholds: [
                { value: 200, style: '#ef4444' }, // High latency = red
                { value: 100, style: '#eab308' }, // Medium = yellow
                { value: 0, style: '#22c55e' }, // Low = green
              ],
            },
          ],
        },
        generateLegends: true,
      });

      expect(result.legends).toBeDefined();
      expect(result.legends).toHaveLength(1);
      expect(result.legends![0].type).toBe('category'); // Threshold displays as category
      expect(result.legends![0].entries).toHaveLength(3);
    });

    it('does not generate legends when not requested', () => {
      const data: DataObject[] = [{ from: 'X', to: 'Y', weight: 5 }];

      const result = generateDiagramFromRelationalData(data, {
        edgeConfig: {
          fromField: 'from',
          toField: 'to',
          fieldMappings: { label: 'weight' },
        },
      });

      expect(result.legends).toBeUndefined();
    });
  });

  describe('Combined node and edge legends', () => {
    it('generates legends from both node and edge mappings', () => {
      const data: DataObject[] = [
        { id: 'n1', status: 'active' },
        { id: 'n2', status: 'inactive' },
      ];

      const result = processTemplateWithGeneration(
        { id: 'test', dataKey: 'items', statements: [] },
        data,
        {
          nodeConfig: {
            idField: 'id',
            styleMappings: [
              {
                property: 'fill',
                field: 'status',
                type: 'category',
                categories: { active: 'green', inactive: 'gray' },
              },
            ],
          },
          edgeConfig: {
            fromField: 'from',
            toField: 'to',
            styleMappings: [
              {
                property: 'strokeWidth',
                field: 'weight',
                type: 'scale',
                scale: {
                  domain: [0, 10],
                  range: ['1', '3'],
                },
              },
            ],
          },
          generateLegends: true,
        }
      );

      expect(result.legends).toBeDefined();
      expect(result.legends).toHaveLength(2);
      // First legend from node mapping
      expect(result.legends![0].type).toBe('category');
      expect(result.legends![0].title).toContain('status');
      // Second legend from edge mapping
      expect(result.legends![1].type).toBe('scale');
      expect(result.legends![1].title).toContain('weight');
    });
  });

  describe('Real-world scenario with legends', () => {
    it('generates comprehensive visualization with legends', () => {
      const services: DataObject[] = [
        { name: 'api', health: 'healthy', cpu: 45, memory: 60 },
        { name: 'db', health: 'healthy', cpu: 80, memory: 75 },
        { name: 'cache', health: 'warning', cpu: 60, memory: 90 },
      ];

      const result = processTemplateWithGeneration(
        { id: 'services', dataKey: 'services', statements: [] },
        services,
        {
          nodeConfig: {
            idField: 'name',
            shape: 'rounded',
            fieldMappings: { label: 'name' },
            styleMappings: [
              {
                property: 'fill',
                field: 'health',
                type: 'category',
                categories: {
                  healthy: '#22c55e',
                  warning: '#eab308',
                  error: '#ef4444',
                },
              },
              {
                property: 'strokeWidth',
                field: 'memory',
                type: 'threshold',
                thresholds: [
                  { value: 80, style: '3' },
                  { value: 60, style: '2' },
                  { value: 0, style: '1' },
                ],
              },
            ],
          },
          generateLegends: true,
          legendConfig: {
            position: 'bottom-right',
          },
        }
      );

      expect(result.nodes).toHaveLength(3);
      expect(result.legends).toBeDefined();
      expect(result.legends).toHaveLength(2);

      // Health status legend (category)
      const healthLegend = result.legends!.find((l) =>
        l.title?.includes('health')
      );
      expect(healthLegend).toBeDefined();
      expect(healthLegend!.type).toBe('category');
      expect(healthLegend!.entries).toHaveLength(3);

      // Memory threshold legend
      const memoryLegend = result.legends!.find((l) =>
        l.title?.includes('memory')
      );
      expect(memoryLegend).toBeDefined();
      expect(memoryLegend!.type).toBe('category'); // Threshold displays as category
      expect(memoryLegend!.entries).toHaveLength(3);
      expect(memoryLegend!.position).toBe('bottom-right');
    });
  });
});
