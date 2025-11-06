/**
 * Tests for Template Processor
 * Phase 2.2: Variable Substitution Implementation
 */

import { describe, it, expect } from 'vitest';
import {
  processTemplate,
  processTemplates,
  type DataTemplate,
  type TemplateNodeStatement,
  type TemplateEdgeStatement,
  type DataObject,
} from './template-processor';

describe('Template Processor', () => {
  describe('processTemplate', () => {
    it('processes template with single node', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'node',
            id: '${item.id}',
            shape: 'rect',
            properties: {
              label: '${item.name}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1', name: 'Alice' },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0]).toEqual({
        id: 'u1',
        shape: 'rect',
        properties: {
          label: 'Alice',
        },
      });
      expect(result.edges).toHaveLength(0);
    });

    it('processes template with multiple nodes', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'node',
            id: '${item.id}',
            shape: 'rect',
            properties: {
              label: '${item.name}',
              fill: '${item.color}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1', name: 'Alice', color: 'blue' },
        { id: 'u2', name: 'Bob', color: 'green' },
        { id: 'u3', name: 'Charlie', color: 'red' },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0].id).toBe('u1');
      expect(result.nodes[0].properties.label).toBe('Alice');
      expect(result.nodes[0].properties.fill).toBe('blue');
      expect(result.nodes[1].id).toBe('u2');
      expect(result.nodes[2].id).toBe('u3');
    });

    it('processes template with nested property access', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'node',
            id: '${item.id}',
            shape: 'rect',
            properties: {
              label: '${item.user.profile.name}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const data: DataObject[] = [
        {
          id: 'u1',
          user: {
            profile: {
              name: 'Alice Smith',
            },
          },
        },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].properties.label).toBe('Alice Smith');
    });

    it('processes template with edges', () => {
      const template: DataTemplate = {
        id: 'connections',
        dataKey: 'edgeData',
        statements: [
          {
            type: 'edge',
            from: '${item.source}',
            to: '${item.target}',
            properties: {
              label: '${item.type}',
            },
          } as TemplateEdgeStatement,
        ],
      };

      const data: DataObject[] = [
        { source: 'u1', target: 'u2', type: 'friend' },
        { source: 'u2', target: 'u3', type: 'colleague' },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(0);
      expect(result.edges).toHaveLength(2);
      expect(result.edges[0]).toEqual({
        from: 'u1',
        to: 'u2',
        type: undefined,
        properties: {
          label: 'friend',
        },
      });
      expect(result.edges[1].from).toBe('u2');
      expect(result.edges[1].to).toBe('u3');
    });

    it('processes template with both nodes and edges', () => {
      const template: DataTemplate = {
        id: 'graph',
        dataKey: 'graphData',
        statements: [
          {
            type: 'node',
            id: '${item.id}',
            shape: 'circle',
            properties: {
              label: '${item.label}',
            },
          } as TemplateNodeStatement,
          {
            type: 'edge',
            from: '${item.id}',
            to: '${item.next}',
            properties: {},
          } as TemplateEdgeStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'n1', label: 'Start', next: 'n2' },
        { id: 'n2', label: 'Middle', next: 'n3' },
        { id: 'n3', label: 'End', next: null },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2); // Only 2 edges because n3.next is null
    });

    it('applies limit when specified', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        limit: 2,
        statements: [
          {
            type: 'node',
            id: '${item.id}',
            shape: 'rect',
            properties: {},
          } as TemplateNodeStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1' },
        { id: 'u2' },
        { id: 'u3' },
        { id: 'u4' },
        { id: 'u5' },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(2);
      expect(result.nodes[0].id).toBe('u1');
      expect(result.nodes[1].id).toBe('u2');
    });

    it('handles empty data array', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'node',
            id: '${item.id}',
            shape: 'rect',
            properties: {},
          } as TemplateNodeStatement,
        ],
      };

      const result = processTemplate(template, []);

      expect(result.nodes).toHaveLength(0);
      expect(result.edges).toHaveLength(0);
    });

    it('handles missing properties gracefully', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'node',
            id: '${item.id}',
            shape: 'rect',
            properties: {
              label: '${item.name}',
              fill: '${item.color}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1', name: 'Alice' }, // missing color
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].properties.label).toBe('Alice');
      expect(result.nodes[0].properties.fill).toBe(''); // Empty string for missing value
    });

    it('uses default shape when not specified', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'node',
            id: '${item.id}',
            properties: {},
          } as TemplateNodeStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1' },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].shape).toBe('rect');
    });

    it('preserves numeric ID types', () => {
      const template: DataTemplate = {
        id: 'nodes',
        dataKey: 'nodeData',
        statements: [
          {
            type: 'node',
            id: '${item.id}',
            shape: 'rect',
            properties: {},
          } as TemplateNodeStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 123 },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].id).toBe('123'); // Converted to string
    });

    it('handles complex expressions in properties', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'node',
            id: '${item.id}',
            shape: 'rect',
            properties: {
              label: 'User: ${item.name} (${item.age})',
            },
          } as TemplateNodeStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1', name: 'Alice', age: 30 },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].properties.label).toBe('User: Alice (30)');
    });
  });

  describe('processTemplates', () => {
    it('processes multiple templates with different data sources', () => {
      const templates: DataTemplate[] = [
        {
          id: 'users',
          dataKey: 'userData',
          statements: [
            {
              type: 'node',
              id: '${item.id}',
              shape: 'rect',
              properties: {
                label: '${item.name}',
              },
            } as TemplateNodeStatement,
          ],
        },
        {
          id: 'connections',
          dataKey: 'edgeData',
          statements: [
            {
              type: 'edge',
              from: '${item.from}',
              to: '${item.to}',
              properties: {},
            } as TemplateEdgeStatement,
          ],
        },
      ];

      const dataMap = {
        userData: [
          { id: 'u1', name: 'Alice' },
          { id: 'u2', name: 'Bob' },
        ],
        edgeData: [
          { from: 'u1', to: 'u2' },
        ],
      };

      const result = processTemplates(templates, dataMap);

      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
    });

    it('handles missing data source gracefully', () => {
      const templates: DataTemplate[] = [
        {
          id: 'users',
          dataKey: 'userData',
          statements: [
            {
              type: 'node',
              id: '${item.id}',
              shape: 'rect',
              properties: {},
            } as TemplateNodeStatement,
          ],
        },
      ];

      const dataMap = {
        wrongKey: [{ id: 'u1' }],
      };

      const result = processTemplates(templates, dataMap);

      expect(result.nodes).toHaveLength(0);
      expect(result.edges).toHaveLength(0);
    });

    it('combines results from all templates', () => {
      const templates: DataTemplate[] = [
        {
          id: 'set1',
          dataKey: 'data1',
          statements: [
            {
              type: 'node',
              id: '${item.id}',
              shape: 'rect',
              properties: {},
            } as TemplateNodeStatement,
          ],
        },
        {
          id: 'set2',
          dataKey: 'data2',
          statements: [
            {
              type: 'node',
              id: '${item.id}',
              shape: 'circle',
              properties: {},
            } as TemplateNodeStatement,
          ],
        },
      ];

      const dataMap = {
        data1: [{ id: 'n1' }, { id: 'n2' }],
        data2: [{ id: 'n3' }, { id: 'n4' }],
      };

      const result = processTemplates(templates, dataMap);

      expect(result.nodes).toHaveLength(4);
      expect(result.nodes[0].shape).toBe('rect');
      expect(result.nodes[2].shape).toBe('circle');
    });
  });
});
