import { describe, expect, it } from 'vitest';
import type { DiagramAst } from '../types';

describe('Mindmap Diagrams', () => {
  describe('Structure Validation', () => {
    it('should create a basic mindmap with central node', () => {
      const mindmap: DiagramAst = {
        astVersion: '0.1.0',
        title: 'Simple Mindmap',
        direction: 'TB',
        nodes: [
          { id: 'central', shape: 'circ', label: 'Central Idea' },
          { id: 'branch1', shape: 'rounded', label: 'Branch 1' },
          { id: 'branch2', shape: 'rounded', label: 'Branch 2' },
          { id: 'branch3', shape: 'rounded', label: 'Branch 3' },
        ],
        edges: [
          { from: 'central', to: 'branch1' },
          { from: 'central', to: 'branch2' },
          { from: 'central', to: 'branch3' },
        ],
        containers: [
          {
            id: 'mindmap',
            label: 'Mindmap Container',
            layoutOptions: {
              algorithm: 'radial',
            },
            memberNodes: ['central', 'branch1', 'branch2', 'branch3'],
          },
        ],
      };

      expect(mindmap.containers).toHaveLength(1);
      expect(mindmap.containers![0].layoutOptions?.algorithm).toBe('radial');
      expect(mindmap.nodes).toHaveLength(4);
      expect(mindmap.edges).toHaveLength(3);
    });

    it('should support hierarchical mindmap with sub-branches', () => {
      const mindmap: DiagramAst = {
        astVersion: '0.1.0',
        title: 'Hierarchical Mindmap',
        direction: 'TB',
        nodes: [
          { id: 'main', shape: 'circ', label: 'Main Topic' },
          { id: 'topic1', shape: 'rounded', label: 'Topic 1' },
          { id: 'topic2', shape: 'rounded', label: 'Topic 2' },
          { id: 'sub1a', shape: 'rect', label: 'Subtopic 1A' },
          { id: 'sub1b', shape: 'rect', label: 'Subtopic 1B' },
          { id: 'sub2a', shape: 'rect', label: 'Subtopic 2A' },
        ],
        edges: [
          { from: 'main', to: 'topic1' },
          { from: 'main', to: 'topic2' },
          { from: 'topic1', to: 'sub1a' },
          { from: 'topic1', to: 'sub1b' },
          { from: 'topic2', to: 'sub2a' },
        ],
        containers: [
          {
            id: 'mindmap',
            label: 'Mindmap',
            layoutOptions: {
              algorithm: 'radial',
              spacing: 80,
            },
            memberNodes: [
              'main',
              'topic1',
              'topic2',
              'sub1a',
              'sub1b',
              'sub2a',
            ],
          },
        ],
      };

      expect(mindmap.containers).toHaveLength(1);
      expect(mindmap.containers![0].layoutOptions?.algorithm).toBe('radial');
      expect(mindmap.nodes).toHaveLength(6);
      expect(mindmap.edges).toHaveLength(5);
    });

    it('should support mindmap with multiple levels', () => {
      const mindmap: DiagramAst = {
        astVersion: '0.1.0',
        title: 'Multi-Level Mindmap',
        direction: 'TB',
        nodes: [
          { id: 'root', shape: 'circ', label: 'Root' },
          { id: 'l1_1', shape: 'rounded', label: 'Level 1-1' },
          { id: 'l1_2', shape: 'rounded', label: 'Level 1-2' },
          { id: 'l2_1', shape: 'rect', label: 'Level 2-1' },
          { id: 'l2_2', shape: 'rect', label: 'Level 2-2' },
          { id: 'l3_1', shape: 'stadium', label: 'Level 3-1' },
        ],
        edges: [
          { from: 'root', to: 'l1_1' },
          { from: 'root', to: 'l1_2' },
          { from: 'l1_1', to: 'l2_1' },
          { from: 'l1_2', to: 'l2_2' },
          { from: 'l2_1', to: 'l3_1' },
        ],
        containers: [
          {
            id: 'mindmap',
            label: 'Multi-Level Mindmap',
            layoutOptions: {
              algorithm: 'radial',
              spacing: 100,
            },
            memberNodes: ['root', 'l1_1', 'l1_2', 'l2_1', 'l2_2', 'l3_1'],
          },
        ],
      };

      expect(mindmap.containers).toHaveLength(1);
      expect(mindmap.nodes).toHaveLength(6);
      expect(mindmap.edges).toHaveLength(5);

      // Verify hierarchical structure
      const edges = mindmap.edges!;
      const rootEdges = edges.filter((e) => e.from === 'root');
      expect(rootEdges).toHaveLength(2);
    });
  });

  describe('Layout Properties', () => {
    it('should support radial algorithm for mindmaps', () => {
      const mindmap: DiagramAst = {
        astVersion: '0.1.0',
        title: 'Mindmap with Radial Layout',
        nodes: [
          { id: 'center', shape: 'circ', label: 'Center' },
          { id: 'branch1', shape: 'rounded', label: 'Branch 1' },
        ],
        edges: [{ from: 'center', to: 'branch1' }],
        containers: [
          {
            id: 'map',
            label: 'Mindmap',
            layoutOptions: {
              algorithm: 'radial',
            },
            memberNodes: ['center', 'branch1'],
          },
        ],
      };

      const container = mindmap.containers![0];
      expect(container.layoutOptions?.algorithm).toBe('radial');
    });

    it('should support custom spacing for mindmap nodes', () => {
      const mindmap: DiagramAst = {
        astVersion: '0.1.0',
        title: 'Mindmap with Custom Spacing',
        nodes: [{ id: 'root', shape: 'circ', label: 'Root' }],
        containers: [
          {
            id: 'map',
            label: 'Mindmap',
            layoutOptions: {
              algorithm: 'radial',
              spacing: 120,
            },
            memberNodes: ['root'],
          },
        ],
      };

      const container = mindmap.containers![0];
      expect(container.layoutOptions?.spacing).toBe(120);
    });

    it('should allow different shape types in mindmap', () => {
      const mindmap: DiagramAst = {
        astVersion: '0.1.0',
        title: 'Mindmap with Mixed Shapes',
        nodes: [
          { id: 'main', shape: 'circ', label: 'Main Topic' },
          { id: 'idea', shape: 'rounded', label: 'Idea' },
          { id: 'note', shape: 'rect', label: 'Note' },
          { id: 'action', shape: 'hexagon', label: 'Action' },
          { id: 'decision', shape: 'rhombus', label: 'Decision' },
        ],
        edges: [
          { from: 'main', to: 'idea' },
          { from: 'main', to: 'note' },
          { from: 'main', to: 'action' },
          { from: 'main', to: 'decision' },
        ],
        containers: [
          {
            id: 'mindmap',
            label: 'Mixed Shapes Mindmap',
            layoutOptions: {
              algorithm: 'radial',
            },
            memberNodes: ['main', 'idea', 'note', 'action', 'decision'],
          },
        ],
      };

      const shapes = mindmap.nodes!.map((n) => n.shape);
      expect(shapes).toContain('circ');
      expect(shapes).toContain('rounded');
      expect(shapes).toContain('rect');
      expect(shapes).toContain('hexagon');
      expect(shapes).toContain('rhombus');
    });
  });

  describe('Style and Customization', () => {
    it('should support styled mindmap nodes', () => {
      const mindmap: DiagramAst = {
        astVersion: '0.1.0',
        title: 'Styled Mindmap',
        nodes: [
          {
            id: 'center',
            shape: 'circ',
            label: 'Main Idea',
            style: 'highlight',
          },
          { id: 'sub1', shape: 'rounded', label: 'Subtopic', style: 'default' },
        ],
        edges: [{ from: 'center', to: 'sub1' }],
        styles: {
          highlight: {
            fill: '#ffeb3b',
            stroke: '#f57c00',
            strokeWidth: '3',
          },
          default: {
            fill: '#e3f2fd',
            stroke: '#1976d2',
          },
        },
        containers: [
          {
            id: 'mindmap',
            label: 'Styled Mindmap',
            layoutOptions: {
              algorithm: 'radial',
            },
            memberNodes: ['center', 'sub1'],
          },
        ],
      };

      expect(mindmap.styles).toBeDefined();
      expect(mindmap.styles!.highlight).toBeDefined();
      expect(mindmap.styles!.highlight.fill).toBe('#ffeb3b');
    });

    it('should support container styling for mindmap boundary', () => {
      const mindmap: DiagramAst = {
        astVersion: '0.1.0',
        title: 'Mindmap with Styled Container',
        nodes: [{ id: 'root', shape: 'circ', label: 'Root' }],
        containers: [
          {
            id: 'mindmap',
            label: 'My Mindmap',
            layoutOptions: {
              algorithm: 'radial',
            },
            containerStyle: {
              fillColor: '#f5f5f5',
              strokeColor: '#9e9e9e',
              strokeWidth: 2,
            },
            memberNodes: ['root'],
          },
        ],
      };

      const container = mindmap.containers![0];
      expect(container.containerStyle?.fillColor).toBe('#f5f5f5');
      expect(container.containerStyle?.strokeColor).toBe('#9e9e9e');
      expect(container.containerStyle?.strokeWidth).toBe(2);
    });
  });

  describe('Real-World Use Cases', () => {
    it('should create project planning mindmap', () => {
      const mindmap: DiagramAst = {
        astVersion: '0.1.0',
        title: 'Project Planning Mindmap',
        nodes: [
          { id: 'project', shape: 'circ', label: 'Website Redesign' },
          { id: 'research', shape: 'rounded', label: 'Research' },
          { id: 'design', shape: 'rounded', label: 'Design' },
          { id: 'development', shape: 'rounded', label: 'Development' },
          { id: 'testing', shape: 'rounded', label: 'Testing' },
          { id: 'user_surveys', shape: 'rect', label: 'User Surveys' },
          { id: 'competitors', shape: 'rect', label: 'Competitor Analysis' },
          { id: 'wireframes', shape: 'rect', label: 'Wireframes' },
          { id: 'mockups', shape: 'rect', label: 'Mockups' },
        ],
        edges: [
          { from: 'project', to: 'research' },
          { from: 'project', to: 'design' },
          { from: 'project', to: 'development' },
          { from: 'project', to: 'testing' },
          { from: 'research', to: 'user_surveys' },
          { from: 'research', to: 'competitors' },
          { from: 'design', to: 'wireframes' },
          { from: 'design', to: 'mockups' },
        ],
        containers: [
          {
            id: 'mindmap',
            label: 'Project Planning',
            layoutOptions: {
              algorithm: 'radial',
              spacing: 100,
            },
            memberNodes: [
              'project',
              'research',
              'design',
              'development',
              'testing',
              'user_surveys',
              'competitors',
              'wireframes',
              'mockups',
            ],
          },
        ],
      };

      expect(mindmap.nodes).toHaveLength(9);
      expect(mindmap.edges).toHaveLength(8);
    });

    it('should create learning topics mindmap', () => {
      const mindmap: DiagramAst = {
        astVersion: '0.1.0',
        title: 'Learning JavaScript',
        nodes: [
          { id: 'js', shape: 'circ', label: 'JavaScript' },
          { id: 'basics', shape: 'rounded', label: 'Basics' },
          { id: 'advanced', shape: 'rounded', label: 'Advanced' },
          { id: 'frameworks', shape: 'rounded', label: 'Frameworks' },
          { id: 'variables', shape: 'rect', label: 'Variables' },
          { id: 'functions', shape: 'rect', label: 'Functions' },
          { id: 'closures', shape: 'rect', label: 'Closures' },
          { id: 'promises', shape: 'rect', label: 'Promises' },
          { id: 'react', shape: 'rect', label: 'React' },
          { id: 'vue', shape: 'rect', label: 'Vue' },
        ],
        edges: [
          { from: 'js', to: 'basics' },
          { from: 'js', to: 'advanced' },
          { from: 'js', to: 'frameworks' },
          { from: 'basics', to: 'variables' },
          { from: 'basics', to: 'functions' },
          { from: 'advanced', to: 'closures' },
          { from: 'advanced', to: 'promises' },
          { from: 'frameworks', to: 'react' },
          { from: 'frameworks', to: 'vue' },
        ],
        containers: [
          {
            id: 'mindmap',
            label: 'Learning Roadmap',
            layoutOptions: {
              algorithm: 'radial',
              spacing: 90,
            },
            memberNodes: [
              'js',
              'basics',
              'advanced',
              'frameworks',
              'variables',
              'functions',
              'closures',
              'promises',
              'react',
              'vue',
            ],
          },
        ],
      };

      expect(mindmap.nodes).toHaveLength(10);
      expect(mindmap.edges).toHaveLength(9);
    });
  });
});
