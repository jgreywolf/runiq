import { describe, it, expect } from 'vitest';
import {
  validateContainer,
  detectCircularReferences,
  calculateNestingDepth,
  validateNestingDepth,
  validateDiagram,
  getContainerMembership,
  findContainerForNode,
  getAllDescendants,
} from './container-validation.js';
import type { DiagramAst, ContainerDeclaration } from './types/index.js';

describe('Container Validation', () => {
  describe('validateContainer', () => {
    it('should validate a valid container', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Valid Container',
        children: ['n1', 'n2'],
      };

      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
        ],
        edges: [],
      };

      const result = validateContainer(container, diagram);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should warn about empty containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'empty',
        label: 'Empty Container',
        children: [],
      };

      const result = validateContainer(container);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('is empty');
    });

    it('should detect duplicate child IDs', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        children: ['n1', 'n2', 'n1'], // Duplicate n1
      };

      const result = validateContainer(container);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Duplicate child ID "n1"');
    });

    it('should detect non-existent child nodes', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        children: ['n1', 'n2', 'n3'],
      };

      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
          // n3 is missing
        ],
        edges: [],
      };

      const result = validateContainer(container, diagram);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('does not exist');
    });

    it('should recursively validate nested containers', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'parent',
        label: 'Parent',
        children: ['n1'],
        containers: [
          {
            type: 'container',
            id: 'child',
            label: 'Child',
            children: ['n2', 'n2'], // Duplicate in nested
          },
        ],
      };

      const result = validateContainer(container);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('detectCircularReferences', () => {
    it('should pass for containers without circular references', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container 1',
        children: ['n1'],
        containers: [
          {
            type: 'container',
            id: 'c2',
            label: 'Container 2',
            children: ['n2'],
          },
        ],
      };

      const result = detectCircularReferences(container);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    // Note: Actual circular reference detection requires reference-based structure
    // This tests the mechanism, but true circular refs are hard to create in JSON
    it('should detect when container ID appears multiple times in hierarchy', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        children: [],
        containers: [
          {
            type: 'container',
            id: 'c1', // Same ID as parent
            label: 'Child',
            children: [],
          },
        ],
      };

      const result = detectCircularReferences(container);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Circular reference');
    });
  });

  describe('calculateNestingDepth', () => {
    it('should return 1 for container without nesting', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Flat',
        children: ['n1', 'n2'],
      };

      expect(calculateNestingDepth(container)).toBe(1);
    });

    it('should return 2 for container with one level of nesting', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'parent',
        label: 'Parent',
        children: ['n1'],
        containers: [
          {
            type: 'container',
            id: 'child',
            label: 'Child',
            children: ['n2'],
          },
        ],
      };

      expect(calculateNestingDepth(container)).toBe(2);
    });

    it('should return correct depth for multiple nested levels', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'level1',
        label: 'Level 1',
        children: [],
        containers: [
          {
            type: 'container',
            id: 'level2',
            label: 'Level 2',
            children: [],
            containers: [
              {
                type: 'container',
                id: 'level3',
                label: 'Level 3',
                children: [],
                containers: [
                  {
                    type: 'container',
                    id: 'level4',
                    label: 'Level 4',
                    children: ['n1'],
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(calculateNestingDepth(container)).toBe(4);
    });

    it('should handle multiple branches and return max depth', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'root',
        label: 'Root',
        children: [],
        containers: [
          {
            type: 'container',
            id: 'shallow',
            label: 'Shallow Branch',
            children: ['n1'],
          },
          {
            type: 'container',
            id: 'deep',
            label: 'Deep Branch',
            children: [],
            containers: [
              {
                type: 'container',
                id: 'deeper',
                label: 'Deeper',
                children: [],
                containers: [
                  {
                    type: 'container',
                    id: 'deepest',
                    label: 'Deepest',
                    children: ['n2'],
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(calculateNestingDepth(container)).toBe(4);
    });
  });

  describe('validateNestingDepth', () => {
    it('should pass for shallow nesting', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'shallow',
        label: 'Shallow',
        children: ['n1'],
      };

      const result = validateNestingDepth(container);
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn for deep nesting beyond default limit', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'level1',
        label: 'Level 1',
        children: [],
        containers: [
          {
            type: 'container',
            id: 'level2',
            label: 'Level 2',
            children: [],
            containers: [
              {
                type: 'container',
                id: 'level3',
                label: 'Level 3',
                children: [],
                containers: [
                  {
                    type: 'container',
                    id: 'level4',
                    label: 'Level 4',
                    children: [],
                    containers: [
                      {
                        type: 'container',
                        id: 'level5',
                        label: 'Level 5',
                        children: [],
                        containers: [
                          {
                            type: 'container',
                            id: 'level6',
                            label: 'Level 6',
                            children: ['n1'],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = validateNestingDepth(container, 5);
      expect(result.valid).toBe(true); // Warnings don't invalidate
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('depth of 6');
    });

    it('should allow custom depth limits', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'parent',
        label: 'Parent',
        children: [],
        containers: [
          {
            type: 'container',
            id: 'child',
            label: 'Child',
            children: [],
            containers: [
              {
                type: 'container',
                id: 'grandchild',
                label: 'Grandchild',
                children: ['n1'],
              },
            ],
          },
        ],
      };

      const result = validateNestingDepth(container, 2);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('depth of 3');
    });
  });

  describe('validateDiagram', () => {
    it('should validate diagram with valid containers', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container 1',
            children: ['n1', 'n2'],
          },
        ],
      };

      const result = validateDiagram(diagram);
      expect(result.valid).toBe(true);
    });

    it('should detect duplicate container IDs', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'duplicate',
            label: 'Container 1',
            children: ['n1'],
          },
          {
            type: 'container',
            id: 'duplicate',
            label: 'Container 2',
            children: ['n2'],
          },
        ],
      };

      const result = validateDiagram(diagram);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Duplicate container ID');
    });

    it('should pass for diagram without containers', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'n1', shape: 'rect' }],
        edges: [],
      };

      const result = validateDiagram(diagram);
      expect(result.valid).toBe(true);
    });
  });

  describe('getContainerMembership', () => {
    it('should return empty map for diagram without containers', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'n1', shape: 'rect' }],
        edges: [],
      };

      const membership = getContainerMembership(diagram);
      expect(membership.size).toBe(0);
    });

    it('should map nodes to their containers', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
          { id: 'n3', shape: 'rect' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container 1',
            children: ['n1', 'n2'],
          },
          {
            type: 'container',
            id: 'c2',
            label: 'Container 2',
            children: ['n3'],
          },
        ],
      };

      const membership = getContainerMembership(diagram);
      expect(membership.get('n1')).toBe('c1');
      expect(membership.get('n2')).toBe('c1');
      expect(membership.get('n3')).toBe('c2');
    });

    it('should handle nested containers', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect' },
          { id: 'n2', shape: 'rect' },
        ],
        edges: [],
        containers: [
          {
            type: 'container',
            id: 'outer',
            label: 'Outer',
            children: ['n1'],
            containers: [
              {
                type: 'container',
                id: 'inner',
                label: 'Inner',
                children: ['n2'],
              },
            ],
          },
        ],
      };

      const membership = getContainerMembership(diagram);
      expect(membership.get('n1')).toBe('outer');
      expect(membership.get('n2')).toBe('inner');
    });
  });

  describe('findContainerForNode', () => {
    const containers: ContainerDeclaration[] = [
      {
        type: 'container',
        id: 'c1',
        label: 'Container 1',
        children: ['n1', 'n2'],
      },
      {
        type: 'container',
        id: 'c2',
        label: 'Container 2',
        children: ['n3'],
        containers: [
          {
            type: 'container',
            id: 'c2-nested',
            label: 'Nested',
            children: ['n4'],
          },
        ],
      },
    ];

    it('should find container for top-level node', () => {
      const container = findContainerForNode('n1', containers);
      expect(container?.id).toBe('c1');
    });

    it('should find container for nested node', () => {
      const container = findContainerForNode('n4', containers);
      expect(container?.id).toBe('c2-nested');
    });

    it('should return null for node not in any container', () => {
      const container = findContainerForNode('n999', containers);
      expect(container).toBeNull();
    });
  });

  describe('getAllDescendants', () => {
    it('should return direct children for flat container', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Container',
        children: ['n1', 'n2', 'n3'],
      };

      const descendants = getAllDescendants(container);
      expect(descendants).toEqual(['n1', 'n2', 'n3']);
    });

    it('should return all descendants including nested', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'parent',
        label: 'Parent',
        children: ['n1'],
        containers: [
          {
            type: 'container',
            id: 'child1',
            label: 'Child 1',
            children: ['n2', 'n3'],
          },
          {
            type: 'container',
            id: 'child2',
            label: 'Child 2',
            children: ['n4'],
            containers: [
              {
                type: 'container',
                id: 'grandchild',
                label: 'Grandchild',
                children: ['n5'],
              },
            ],
          },
        ],
      };

      const descendants = getAllDescendants(container);
      expect(descendants).toContain('n1');
      expect(descendants).toContain('n2');
      expect(descendants).toContain('n3');
      expect(descendants).toContain('n4');
      expect(descendants).toContain('n5');
      expect(descendants).toHaveLength(5);
    });

    it('should return empty array for empty container', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'empty',
        label: 'Empty',
        children: [],
      };

      const descendants = getAllDescendants(container);
      expect(descendants).toHaveLength(0);
    });
  });

  describe('Algorithm Validation', () => {
    it('should accept valid layered algorithm', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Layered Container',
        children: ['n1'],
        layoutOptions: {
          algorithm: 'layered',
        },
      };

      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'n1', shape: 'rect' }],
        edges: [],
      };

      const result = validateContainer(container, diagram);
      expect(result.valid).toBe(true);
    });

    it('should accept valid force algorithm', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Force Container',
        children: ['n1'],
        layoutOptions: {
          algorithm: 'force',
        },
      };

      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'n1', shape: 'rect' }],
        edges: [],
      };

      const result = validateContainer(container, diagram);
      expect(result.valid).toBe(true);
    });

    it('should accept valid stress algorithm', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Stress Container',
        children: ['n1'],
        layoutOptions: {
          algorithm: 'stress',
        },
      };

      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'n1', shape: 'rect' }],
        edges: [],
      };

      const result = validateContainer(container, diagram);
      expect(result.valid).toBe(true);
    });

    it('should accept valid radial algorithm', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Radial Container',
        children: ['n1'],
        layoutOptions: {
          algorithm: 'radial',
        },
      };

      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'n1', shape: 'rect' }],
        edges: [],
      };

      const result = validateContainer(container, diagram);
      expect(result.valid).toBe(true);
    });

    it('should accept valid mrtree algorithm', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'MrTree Container',
        children: ['n1'],
        layoutOptions: {
          algorithm: 'mrtree',
        },
      };

      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'n1', shape: 'rect' }],
        edges: [],
      };

      const result = validateContainer(container, diagram);
      expect(result.valid).toBe(true);
    });

    it('should use layered as default algorithm when not specified', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'c1',
        label: 'Default Container',
        children: ['n1'],
      };

      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'n1', shape: 'rect' }],
        edges: [],
      };

      const result = validateContainer(container, diagram);
      expect(result.valid).toBe(true);
      // Default algorithm should be 'layered' (tested in layout engine)
    });
  });
});
