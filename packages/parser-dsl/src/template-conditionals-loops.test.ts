/**
 * Tests for Conditionals, Loops, and Filters
 * Phase 2.3: Conditionals & Loops Implementation
 */

import { describe, it, expect } from 'vitest';
import {
  processTemplate,
  type DataTemplate,
  type TemplateNodeStatement,
  type TemplateEdgeStatement,
  type ConditionalStatement,
  type LoopStatement,
  type DataObject,
} from './template-processor';

describe('Template Conditionals and Loops', () => {
  describe('Conditional statements', () => {
    it('processes conditional with true condition', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'conditional',
            condition: '${item.active}',
            statements: [
              {
                type: 'node',
                id: '${item.id}',
                shape: 'rect',
                properties: {
                  label: 'Active: ${item.name}',
                },
              } as TemplateNodeStatement,
            ],
          } as ConditionalStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1', name: 'Alice', active: true },
        { id: 'u2', name: 'Bob', active: false },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(1); // Only Alice (active)
      expect(result.nodes[0].id).toBe('u1');
      expect(result.nodes[0].properties.label).toBe('Active: Alice');
    });

    it('processes conditional with false condition', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'conditional',
            condition: '${item.deleted}',
            statements: [
              {
                type: 'node',
                id: '${item.id}',
                shape: 'rect',
                properties: {},
              } as TemplateNodeStatement,
            ],
          } as ConditionalStatement,
        ],
      };

      const data: DataObject[] = [{ id: 'u1', deleted: false }];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(0); // Condition is false
    });

    it('handles conditional with else branch', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'conditional',
            condition: '${item.premium}',
            statements: [
              {
                type: 'node',
                id: '${item.id}',
                shape: 'star',
                properties: {
                  label: 'Premium: ${item.name}',
                },
              } as TemplateNodeStatement,
            ],
            elseStatements: [
              {
                type: 'node',
                id: '${item.id}',
                shape: 'rect',
                properties: {
                  label: 'Free: ${item.name}',
                },
              } as TemplateNodeStatement,
            ],
          } as ConditionalStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1', name: 'Alice', premium: true },
        { id: 'u2', name: 'Bob', premium: false },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(2);
      expect(result.nodes[0].shape).toBe('star');
      expect(result.nodes[0].properties.label).toBe('Premium: Alice');
      expect(result.nodes[1].shape).toBe('rect');
      expect(result.nodes[1].properties.label).toBe('Free: Bob');
    });

    it('handles conditional with numeric comparison', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'conditional',
            condition: '${item.score}', // Truthy if > 0
            statements: [
              {
                type: 'node',
                id: '${item.id}',
                shape: 'rect',
                properties: {},
              } as TemplateNodeStatement,
            ],
          } as ConditionalStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1', score: 100 }, // Truthy
        { id: 'u2', score: 0 }, // Falsy
        { id: 'u3', score: -5 }, // Truthy (negative numbers are truthy)
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(2); // u1 and u3
      expect(result.nodes[0].id).toBe('u1');
      expect(result.nodes[1].id).toBe('u3');
    });

    it('handles conditional with string value', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'conditional',
            condition: '${item.status}',
            statements: [
              {
                type: 'node',
                id: '${item.id}',
                shape: 'rect',
                properties: {},
              } as TemplateNodeStatement,
            ],
          } as ConditionalStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1', status: 'active' }, // Truthy
        { id: 'u2', status: '' }, // Falsy
        { id: 'u3', status: null }, // Falsy
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(1); // Only u1
      expect(result.nodes[0].id).toBe('u1');
    });

    it('handles nested conditionals', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'conditional',
            condition: '${item.active}',
            statements: [
              {
                type: 'conditional',
                condition: '${item.premium}',
                statements: [
                  {
                    type: 'node',
                    id: '${item.id}',
                    shape: 'star',
                    properties: {
                      label: 'Premium Active',
                    },
                  } as TemplateNodeStatement,
                ],
              } as ConditionalStatement,
            ],
          } as ConditionalStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1', active: true, premium: true }, // Both true
        { id: 'u2', active: true, premium: false }, // Only outer true
        { id: 'u3', active: false, premium: true }, // Only inner true
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(1); // Only u1 passes both conditions
      expect(result.nodes[0].id).toBe('u1');
    });
  });

  describe('Loop statements', () => {
    it('processes simple loop over array', () => {
      const template: DataTemplate = {
        id: 'teams',
        dataKey: 'teamData',
        statements: [
          {
            type: 'loop',
            variable: 'member',
            collection: '${item.members}',
            statements: [
              {
                type: 'node',
                id: '${member.id}',
                shape: 'circle',
                properties: {
                  label: '${member.name}',
                },
              } as TemplateNodeStatement,
            ],
          } as LoopStatement,
        ],
      };

      const data: DataObject[] = [
        {
          id: 'team1',
          members: [
            { id: 'm1', name: 'Alice' },
            { id: 'm2', name: 'Bob' },
            { id: 'm3', name: 'Charlie' },
          ],
        },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0].id).toBe('m1');
      expect(result.nodes[0].properties.label).toBe('Alice');
      expect(result.nodes[1].id).toBe('m2');
      expect(result.nodes[2].id).toBe('m3');
    });

    it('processes loop with index access', () => {
      const template: DataTemplate = {
        id: 'items',
        dataKey: 'itemData',
        statements: [
          {
            type: 'loop',
            variable: 'task',
            collection: '${item.tasks}',
            statements: [
              {
                type: 'node',
                id: '${task.id}',
                shape: 'rect',
                properties: {
                  label: 'Task ${task_index}: ${task.title}',
                },
              } as TemplateNodeStatement,
            ],
          } as LoopStatement,
        ],
      };

      const data: DataObject[] = [
        {
          tasks: [
            { id: 't1', title: 'Setup' },
            { id: 't2', title: 'Build' },
          ],
        },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(2);
      expect(result.nodes[0].properties.label).toBe('Task 0: Setup');
      expect(result.nodes[1].properties.label).toBe('Task 1: Build');
    });

    it('processes loop with first/last indicators', () => {
      const template: DataTemplate = {
        id: 'items',
        dataKey: 'itemData',
        statements: [
          {
            type: 'loop',
            variable: 'step',
            collection: '${item.steps}',
            statements: [
              {
                type: 'conditional',
                condition: '${step_first}',
                statements: [
                  {
                    type: 'node',
                    id: '${step.id}',
                    shape: 'start',
                    properties: {},
                  } as TemplateNodeStatement,
                ],
                elseStatements: [
                  {
                    type: 'conditional',
                    condition: '${step_last}',
                    statements: [
                      {
                        type: 'node',
                        id: '${step.id}',
                        shape: 'end',
                        properties: {},
                      } as TemplateNodeStatement,
                    ],
                    elseStatements: [
                      {
                        type: 'node',
                        id: '${step.id}',
                        shape: 'rect',
                        properties: {},
                      } as TemplateNodeStatement,
                    ],
                  } as ConditionalStatement,
                ],
              } as ConditionalStatement,
            ],
          } as LoopStatement,
        ],
      };

      const data: DataObject[] = [
        {
          steps: [{ id: 's1' }, { id: 's2' }, { id: 's3' }],
        },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0].shape).toBe('start');
      expect(result.nodes[1].shape).toBe('rect');
      expect(result.nodes[2].shape).toBe('end');
    });

    it('processes multiple items with loops', () => {
      const template: DataTemplate = {
        id: 'orgs',
        dataKey: 'orgData',
        statements: [
          {
            type: 'loop',
            variable: 'dept',
            collection: '${item.departments}',
            statements: [
              {
                type: 'node',
                id: '${dept.id}',
                shape: 'rect',
                properties: {
                  label: '${dept.name}',
                },
              } as TemplateNodeStatement,
            ],
          } as LoopStatement,
        ],
      };

      const data: DataObject[] = [
        {
          id: 'org1',
          departments: [
            { id: 'd1', name: 'Engineering' },
            { id: 'd2', name: 'Sales' },
          ],
        },
        {
          id: 'org2',
          departments: [{ id: 'd3', name: 'Marketing' }],
        },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(3); // 2 from org1 + 1 from org2
    });

    it('generates edges in loops', () => {
      const template: DataTemplate = {
        id: 'paths',
        dataKey: 'pathData',
        statements: [
          {
            type: 'loop',
            variable: 'connection',
            collection: '${item.connections}',
            statements: [
              {
                type: 'edge',
                from: '${connection.from}',
                to: '${connection.to}',
                properties: {
                  label: '${connection.type}',
                },
              } as TemplateEdgeStatement,
            ],
          } as LoopStatement,
        ],
      };

      const data: DataObject[] = [
        {
          id: 'graph1',
          connections: [
            { from: 'n1', to: 'n2', type: 'depends' },
            { from: 'n2', to: 'n3', type: 'triggers' },
          ],
        },
      ];

      const result = processTemplate(template, data);

      expect(result.edges).toHaveLength(2);
      expect(result.edges[0].from).toBe('n1');
      expect(result.edges[0].to).toBe('n2');
      expect(result.edges[0].properties.label).toBe('depends');
    });

    it('handles empty collection gracefully', () => {
      const template: DataTemplate = {
        id: 'items',
        dataKey: 'itemData',
        statements: [
          {
            type: 'loop',
            variable: 'item',
            collection: '${item.list}',
            statements: [
              {
                type: 'node',
                id: '${item.id}',
                shape: 'rect',
                properties: {},
              } as TemplateNodeStatement,
            ],
          } as LoopStatement,
        ],
      };

      const data: DataObject[] = [{ id: 'test', list: [] }];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(0);
    });

    it('handles nested loops', () => {
      const template: DataTemplate = {
        id: 'matrix',
        dataKey: 'matrixData',
        statements: [
          {
            type: 'loop',
            variable: 'row',
            collection: '${item.rows}',
            statements: [
              {
                type: 'loop',
                variable: 'cell',
                collection: '${row.cells}',
                statements: [
                  {
                    type: 'node',
                    id: '${cell.id}',
                    shape: 'rect',
                    properties: {
                      label: '${cell.value}',
                    },
                  } as TemplateNodeStatement,
                ],
              } as LoopStatement,
            ],
          } as LoopStatement,
        ],
      };

      const data: DataObject[] = [
        {
          rows: [
            {
              cells: [
                { id: 'c1', value: 'A1' },
                { id: 'c2', value: 'A2' },
              ],
            },
            {
              cells: [{ id: 'c3', value: 'B1' }],
            },
          ],
        },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0].properties.label).toBe('A1');
      expect(result.nodes[1].properties.label).toBe('A2');
      expect(result.nodes[2].properties.label).toBe('B1');
    });
  });

  describe('Filter expressions', () => {
    it('filters data by condition', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        filter: '${item.active}',
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
        { id: 'u1', name: 'Alice', active: true },
        { id: 'u2', name: 'Bob', active: false },
        { id: 'u3', name: 'Charlie', active: true },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(2); // Only Alice and Charlie
      expect(result.nodes[0].id).toBe('u1');
      expect(result.nodes[1].id).toBe('u3');
    });

    it('filters by numeric threshold', () => {
      const template: DataTemplate = {
        id: 'items',
        dataKey: 'itemData',
        filter: '${item.score}', // Truthy if > 0
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
        { id: 'i1', score: 100 },
        { id: 'i2', score: 0 },
        { id: 'i3', score: 50 },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(2); // i1 and i3
    });

    it('combines filter with limit', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        filter: '${item.verified}',
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
        { id: 'u1', verified: true },
        { id: 'u2', verified: true },
        { id: 'u3', verified: true },
        { id: 'u4', verified: true },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(2); // Filtered to 4, limited to 2
    });

    it('provides index and length in filter context', () => {
      const template: DataTemplate = {
        id: 'items',
        dataKey: 'itemData',
        filter: '${index}', // Filter by index (truthy if > 0)
        statements: [
          {
            type: 'node',
            id: '${item.id}',
            shape: 'rect',
            properties: {},
          } as TemplateNodeStatement,
        ],
      };

      const data: DataObject[] = [{ id: 'i0' }, { id: 'i1' }, { id: 'i2' }];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(2); // Skips index 0
      expect(result.nodes[0].id).toBe('i1');
      expect(result.nodes[1].id).toBe('i2');
    });

    it('handles filter with all items failing', () => {
      const template: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        filter: '${item.admin}',
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
        { id: 'u1', admin: false },
        { id: 'u2', admin: false },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(0);
    });
  });

  describe('Complex combinations', () => {
    it('combines conditionals and loops', () => {
      const template: DataTemplate = {
        id: 'teams',
        dataKey: 'teamData',
        statements: [
          {
            type: 'conditional',
            condition: '${item.active}',
            statements: [
              {
                type: 'loop',
                variable: 'member',
                collection: '${item.members}',
                statements: [
                  {
                    type: 'node',
                    id: '${member.id}',
                    shape: 'circle',
                    properties: {
                      label: '${member.name}',
                    },
                  } as TemplateNodeStatement,
                ],
              } as LoopStatement,
            ],
          } as ConditionalStatement,
        ],
      };

      const data: DataObject[] = [
        {
          id: 'team1',
          active: true,
          members: [
            { id: 'm1', name: 'Alice' },
            { id: 'm2', name: 'Bob' },
          ],
        },
        {
          id: 'team2',
          active: false,
          members: [{ id: 'm3', name: 'Charlie' }],
        },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(2); // Only team1 members
    });

    it('uses filter, limit, conditional, and loop together', () => {
      const template: DataTemplate = {
        id: 'projects',
        dataKey: 'projectData',
        filter: '${item.status}',
        limit: 1,
        statements: [
          {
            type: 'conditional',
            condition: '${item.hasIssues}',
            statements: [
              {
                type: 'loop',
                variable: 'issue',
                collection: '${item.issues}',
                statements: [
                  {
                    type: 'node',
                    id: '${issue.id}',
                    shape: 'rect',
                    properties: {
                      label: '${issue.title}',
                    },
                  } as TemplateNodeStatement,
                ],
              } as LoopStatement,
            ],
          } as ConditionalStatement,
        ],
      };

      const data: DataObject[] = [
        {
          id: 'p1',
          status: 'active',
          hasIssues: true,
          issues: [
            { id: 'i1', title: 'Bug 1' },
            { id: 'i2', title: 'Bug 2' },
          ],
        },
        {
          id: 'p2',
          status: 'active',
          hasIssues: true,
          issues: [{ id: 'i3', title: 'Bug 3' }],
        },
      ];

      const result = processTemplate(template, data);

      expect(result.nodes).toHaveLength(2); // Only p1's issues (limit=1)
    });
  });
});
