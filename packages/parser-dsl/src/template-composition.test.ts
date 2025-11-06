/**
 * Tests for Template Composition
 * Phase 2.4: Template Composition and Reuse
 */

import { describe, it, expect } from 'vitest';
import {
  processTemplateWithComposition,
  processTemplates,
  type DataTemplate,
  type TemplateNodeStatement,
  type TemplateEdgeStatement,
  type TemplateCallStatement,
  type DataObject,
  type TemplateRegistry,
} from './template-processor';

describe('Template Composition', () => {
  describe('Template calls', () => {
    it('calls another template from within a template', () => {
      const nodeTemplate: DataTemplate = {
        id: 'create-node',
        dataKey: 'unused',
        statements: [
          {
            type: 'node',
            id: '${nodeId}',
            shape: '${nodeShape}',
            properties: {
              label: '${nodeLabel}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const mainTemplate: DataTemplate = {
        id: 'main',
        dataKey: 'userData',
        statements: [
          {
            type: 'template-call',
            templateId: 'create-node',
            parameters: {
              nodeId: '${item.id}',
              nodeShape: 'rect',
              nodeLabel: '${item.name}',
            },
          } as TemplateCallStatement,
        ],
      };

      const registry: TemplateRegistry = new Map([
        ['create-node', nodeTemplate],
        ['main', mainTemplate],
      ]);

      const data: DataObject[] = [
        { id: 'u1', name: 'Alice' },
        { id: 'u2', name: 'Bob' },
      ];

      const result = processTemplateWithComposition(mainTemplate, data, { templateRegistry: registry });

      expect(result.nodes).toHaveLength(2);
      expect(result.nodes[0].id).toBe('u1');
      expect(result.nodes[0].shape).toBe('rect');
      expect(result.nodes[0].properties.label).toBe('Alice');
    });

    it('passes parameters from template call', () => {
      const styledNode: DataTemplate = {
        id: 'styled-node',
        dataKey: 'unused',
        statements: [
          {
            type: 'node',
            id: '${id}',
            shape: '${shape}',
            properties: {
              label: '${label}',
              fill: '${color}',
              stroke: '${borderColor}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const mainTemplate: DataTemplate = {
        id: 'main',
        dataKey: 'userData',
        statements: [
          {
            type: 'template-call',
            templateId: 'styled-node',
            parameters: {
              id: '${item.id}',
              shape: 'circle',
              label: 'User: ${item.name}',
              color: '${item.favoriteColor}',
              borderColor: 'black',
            },
          } as TemplateCallStatement,
        ],
      };

      const registry: TemplateRegistry = new Map([
        ['styled-node', styledNode],
        ['main', mainTemplate],
      ]);

      const data: DataObject[] = [
        { id: 'u1', name: 'Alice', favoriteColor: 'blue' },
      ];

      const result = processTemplateWithComposition(mainTemplate, data, { templateRegistry: registry });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].properties.fill).toBe('blue');
      expect(result.nodes[0].properties.stroke).toBe('black');
      expect(result.nodes[0].properties.label).toBe('User: Alice');
    });

    it('handles template calls within loops', () => {
      const memberNode: DataTemplate = {
        id: 'member-node',
        dataKey: 'unused',
        statements: [
          {
            type: 'node',
            id: '${memberId}',
            shape: 'circle',
            properties: {
              label: '${memberName}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const teamTemplate: DataTemplate = {
        id: 'team',
        dataKey: 'teamData',
        statements: [
          {
            type: 'loop',
            variable: 'member',
            collection: '${item.members}',
            statements: [
              {
                type: 'template-call',
                templateId: 'member-node',
                parameters: {
                  memberId: '${member.id}',
                  memberName: '${member.name}',
                },
              } as TemplateCallStatement,
            ],
          },
        ],
      };

      const registry: TemplateRegistry = new Map([
        ['member-node', memberNode],
        ['team', teamTemplate],
      ]);

      const data: DataObject[] = [
        {
          teamId: 't1',
          members: [
            { id: 'm1', name: 'Alice' },
            { id: 'm2', name: 'Bob' },
          ],
        },
      ];

      const result = processTemplateWithComposition(teamTemplate, data, { templateRegistry: registry });

      expect(result.nodes).toHaveLength(2);
      expect(result.nodes[0].id).toBe('m1');
      expect(result.nodes[1].id).toBe('m2');
    });

    it('handles template calls within conditionals', () => {
      const activeNode: DataTemplate = {
        id: 'active-node',
        dataKey: 'unused',
        statements: [
          {
            type: 'node',
            id: '${id}',
            shape: 'star',
            properties: {
              label: 'Active: ${name}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const inactiveNode: DataTemplate = {
        id: 'inactive-node',
        dataKey: 'unused',
        statements: [
          {
            type: 'node',
            id: '${id}',
            shape: 'rect',
            properties: {
              label: 'Inactive: ${name}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const mainTemplate: DataTemplate = {
        id: 'main',
        dataKey: 'userData',
        statements: [
          {
            type: 'conditional',
            condition: '${item.active}',
            statements: [
              {
                type: 'template-call',
                templateId: 'active-node',
                parameters: {
                  id: '${item.id}',
                  name: '${item.name}',
                },
              } as TemplateCallStatement,
            ],
            elseStatements: [
              {
                type: 'template-call',
                templateId: 'inactive-node',
                parameters: {
                  id: '${item.id}',
                  name: '${item.name}',
                },
              } as TemplateCallStatement,
            ],
          },
        ],
      };

      const registry: TemplateRegistry = new Map([
        ['active-node', activeNode],
        ['inactive-node', inactiveNode],
        ['main', mainTemplate],
      ]);

      const data: DataObject[] = [
        { id: 'u1', name: 'Alice', active: true },
        { id: 'u2', name: 'Bob', active: false },
      ];

      const result = processTemplateWithComposition(mainTemplate, data, { templateRegistry: registry });

      expect(result.nodes).toHaveLength(2);
      expect(result.nodes[0].shape).toBe('star');
      expect(result.nodes[0].properties.label).toBe('Active: Alice');
      expect(result.nodes[1].shape).toBe('rect');
      expect(result.nodes[1].properties.label).toBe('Inactive: Bob');
    });

    it('handles missing template gracefully', () => {
      const mainTemplate: DataTemplate = {
        id: 'main',
        dataKey: 'userData',
        statements: [
          {
            type: 'template-call',
            templateId: 'non-existent',
            parameters: {},
          } as TemplateCallStatement,
        ],
      };

      const registry: TemplateRegistry = new Map([
        ['main', mainTemplate],
      ]);

      const data: DataObject[] = [
        { id: 'u1' },
      ];

      const result = processTemplateWithComposition(mainTemplate, data, { templateRegistry: registry });

      expect(result.nodes).toHaveLength(0); // No errors, just no nodes
    });

    it('handles template call without registry', () => {
      const mainTemplate: DataTemplate = {
        id: 'main',
        dataKey: 'userData',
        statements: [
          {
            type: 'template-call',
            templateId: 'other',
            parameters: {},
          } as TemplateCallStatement,
        ],
      };

      const data: DataObject[] = [
        { id: 'u1' },
      ];

      const result = processTemplateWithComposition(mainTemplate, data); // No registry

      expect(result.nodes).toHaveLength(0);
    });
  });

  describe('Template nesting', () => {
    it('supports nested template calls', () => {
      const innermost: DataTemplate = {
        id: 'innermost',
        dataKey: 'unused',
        statements: [
          {
            type: 'node',
            id: '${id}',
            shape: 'circle',
            properties: {
              label: '${text}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const middle: DataTemplate = {
        id: 'middle',
        dataKey: 'unused',
        statements: [
          {
            type: 'template-call',
            templateId: 'innermost',
            parameters: {
              id: '${nodeId}',
              text: 'Middle: ${value}',
            },
          } as TemplateCallStatement,
        ],
      };

      const outer: DataTemplate = {
        id: 'outer',
        dataKey: 'userData',
        statements: [
          {
            type: 'template-call',
            templateId: 'middle',
            parameters: {
              nodeId: '${item.id}',
              value: '${item.name}',
            },
          } as TemplateCallStatement,
        ],
      };

      const registry: TemplateRegistry = new Map([
        ['innermost', innermost],
        ['middle', middle],
        ['outer', outer],
      ]);

      const data: DataObject[] = [
        { id: 'u1', name: 'Alice' },
      ];

      const result = processTemplateWithComposition(outer, data, { templateRegistry: registry });

      expect(result.nodes).toHaveLength(1);
      expect(result.nodes[0].id).toBe('u1');
      expect(result.nodes[0].properties.label).toBe('Middle: Alice');
    });

    it('handles multiple template calls in sequence', () => {
      const nodeTemplate: DataTemplate = {
        id: 'node-template',
        dataKey: 'unused',
        statements: [
          {
            type: 'node',
            id: '${id}',
            shape: 'rect',
            properties: {},
          } as TemplateNodeStatement,
        ],
      };

      const edgeTemplate: DataTemplate = {
        id: 'edge-template',
        dataKey: 'unused',
        statements: [
          {
            type: 'edge',
            from: '${from}',
            to: '${to}',
            properties: {},
          } as TemplateEdgeStatement,
        ],
      };

      const mainTemplate: DataTemplate = {
        id: 'main',
        dataKey: 'graphData',
        statements: [
          {
            type: 'template-call',
            templateId: 'node-template',
            parameters: {
              id: '${item.source}',
            },
          } as TemplateCallStatement,
          {
            type: 'template-call',
            templateId: 'node-template',
            parameters: {
              id: '${item.target}',
            },
          } as TemplateCallStatement,
          {
            type: 'template-call',
            templateId: 'edge-template',
            parameters: {
              from: '${item.source}',
              to: '${item.target}',
            },
          } as TemplateCallStatement,
        ],
      };

      const registry: TemplateRegistry = new Map([
        ['node-template', nodeTemplate],
        ['edge-template', edgeTemplate],
        ['main', mainTemplate],
      ]);

      const data: DataObject[] = [
        { source: 'n1', target: 'n2' },
      ];

      const result = processTemplateWithComposition(mainTemplate, data, { templateRegistry: registry });

      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
      expect(result.nodes[0].id).toBe('n1');
      expect(result.nodes[1].id).toBe('n2');
      expect(result.edges[0].from).toBe('n1');
      expect(result.edges[0].to).toBe('n2');
    });
  });

  describe('Template reuse with processTemplates', () => {
    it('reuses templates across multiple data sources', () => {
      const nodeTemplate: DataTemplate = {
        id: 'node-template',
        dataKey: 'unused',
        statements: [
          {
            type: 'node',
            id: '${id}',
            shape: 'rect',
            properties: {
              label: '${label}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const usersTemplate: DataTemplate = {
        id: 'users',
        dataKey: 'userData',
        statements: [
          {
            type: 'template-call',
            templateId: 'node-template',
            parameters: {
              id: '${item.id}',
              label: 'User: ${item.name}',
            },
          } as TemplateCallStatement,
        ],
      };

      const groupsTemplate: DataTemplate = {
        id: 'groups',
        dataKey: 'groupData',
        statements: [
          {
            type: 'template-call',
            templateId: 'node-template',
            parameters: {
              id: '${item.id}',
              label: 'Group: ${item.name}',
            },
          } as TemplateCallStatement,
        ],
      };

      const templates = [nodeTemplate, usersTemplate, groupsTemplate];
      const dataMap = {
        userData: [
          { id: 'u1', name: 'Alice' },
          { id: 'u2', name: 'Bob' },
        ],
        groupData: [
          { id: 'g1', name: 'Team A' },
        ],
      };

      const result = processTemplates(templates, dataMap);

      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0].properties.label).toBe('User: Alice');
      expect(result.nodes[1].properties.label).toBe('User: Bob');
      expect(result.nodes[2].properties.label).toBe('Group: Team A');
    });

    it('processes templates with shared subtemplates', () => {
      const iconNode: DataTemplate = {
        id: 'icon-node',
        dataKey: 'unused',
        statements: [
          {
            type: 'node',
            id: '${id}',
            shape: '${icon}',
            properties: {
              label: '${label}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const serverTemplate: DataTemplate = {
        id: 'servers',
        dataKey: 'serverData',
        statements: [
          {
            type: 'template-call',
            templateId: 'icon-node',
            parameters: {
              id: '${item.id}',
              icon: 'server',
              label: '${item.hostname}',
            },
          } as TemplateCallStatement,
        ],
      };

      const databaseTemplate: DataTemplate = {
        id: 'databases',
        dataKey: 'dbData',
        statements: [
          {
            type: 'template-call',
            templateId: 'icon-node',
            parameters: {
              id: '${item.id}',
              icon: 'database',
              label: '${item.name}',
            },
          } as TemplateCallStatement,
        ],
      };

      const templates = [iconNode, serverTemplate, databaseTemplate];
      const dataMap = {
        serverData: [{ id: 's1', hostname: 'web01' }],
        dbData: [{ id: 'd1', name: 'postgres' }],
      };

      const result = processTemplates(templates, dataMap);

      expect(result.nodes).toHaveLength(2);
      expect(result.nodes[0].shape).toBe('server');
      expect(result.nodes[1].shape).toBe('database');
    });
  });

  describe('Complex composition scenarios', () => {
    it('combines loops, conditionals, and template calls', () => {
      const statusNode: DataTemplate = {
        id: 'status-node',
        dataKey: 'unused',
        statements: [
          {
            type: 'node',
            id: '${id}',
            shape: '${shape}',
            properties: {
              label: '${label}',
              fill: '${color}',
            },
          } as TemplateNodeStatement,
        ],
      };

      const projectTemplate: DataTemplate = {
        id: 'projects',
        dataKey: 'projectData',
        statements: [
          {
            type: 'loop',
            variable: 'task',
            collection: '${item.tasks}',
            statements: [
              {
                type: 'conditional',
                condition: '${task.completed}',
                statements: [
                  {
                    type: 'template-call',
                    templateId: 'status-node',
                    parameters: {
                      id: '${task.id}',
                      shape: 'check',
                      label: '${task.title}',
                      color: 'green',
                    },
                  } as TemplateCallStatement,
                ],
                elseStatements: [
                  {
                    type: 'template-call',
                    templateId: 'status-node',
                    parameters: {
                      id: '${task.id}',
                      shape: 'rect',
                      label: '${task.title}',
                      color: 'yellow',
                    },
                  } as TemplateCallStatement,
                ],
              },
            ],
          },
        ],
      };

      const registry: TemplateRegistry = new Map([
        ['status-node', statusNode],
        ['projects', projectTemplate],
      ]);

      const data: DataObject[] = [
        {
          projectId: 'p1',
          tasks: [
            { id: 't1', title: 'Design', completed: true },
            { id: 't2', title: 'Build', completed: false },
            { id: 't3', title: 'Test', completed: true },
          ],
        },
      ];

      const result = processTemplateWithComposition(projectTemplate, data, { templateRegistry: registry });

      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0].shape).toBe('check');
      expect(result.nodes[0].properties.fill).toBe('green');
      expect(result.nodes[1].shape).toBe('rect');
      expect(result.nodes[1].properties.fill).toBe('yellow');
      expect(result.nodes[2].shape).toBe('check');
    });
  });
});
