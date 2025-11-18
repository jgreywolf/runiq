import { describe, it, expect } from 'vitest';
import {
  generateLinearProcess,
  generateCycleProcess,
  generateHierarchy,
  generateAlternatingProcess,
  generateCompositeNode,
} from './generators';

describe('Generator Utilities', () => {
  describe('generateLinearProcess', () => {
    it('should generate linear process with default options', () => {
      const items = ['Start', 'Process', 'End'];
      const result = generateLinearProcess(items);

      expect(result.direction).toBe('LR');
      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);

      expect(result.nodes[0].id).toBe('step1');
      expect(result.nodes[0].label).toBe('Start');
      expect(result.nodes[0].shape).toBe('rect');

      expect(result.edges[0].from).toBe('step1');
      expect(result.edges[0].to).toBe('step2');
    });

    it('should use custom shape and theme', () => {
      const items = ['A', 'B'];
      const result = generateLinearProcess(items, {
        shape: 'rounded',
        theme: 'monochrome',
      });

      expect(result.nodes[0].shape).toBe('rounded');
      expect(result.nodes[0].data?.color).toBeDefined();
    });

    it('should use custom direction', () => {
      const items = ['A', 'B'];
      const result = generateLinearProcess(items, { direction: 'TB' });

      expect(result.direction).toBe('TB');
    });

    it('should use custom idPrefix', () => {
      const items = ['A', 'B', 'C'];
      const result = generateLinearProcess(items, { idPrefix: 'phase' });

      expect(result.nodes[0].id).toBe('phase1');
      expect(result.nodes[1].id).toBe('phase2');
      expect(result.edges[0].from).toBe('phase1');
      expect(result.edges[0].to).toBe('phase2');
    });

    it('should handle single item', () => {
      const items = ['Only One'];
      const result = generateLinearProcess(items);

      expect(result.nodes).toHaveLength(1);
      expect(result.edges).toHaveLength(0);
    });

    it('should apply edge style', () => {
      const items = ['A', 'B'];
      const result = generateLinearProcess(items, { edgeStyle: 'dashed' });

      expect(result.edges[0].style).toBe('dashed');
    });
  });

  describe('generateCycleProcess', () => {
    it('should generate cycle with back edge', () => {
      const items = ['Plan', 'Do', 'Check', 'Act'];
      const result = generateCycleProcess(items);

      expect(result.nodes).toHaveLength(4);
      expect(result.edges).toHaveLength(4); // 3 forward + 1 back

      // Verify cycle-back edge
      const lastEdge = result.edges[3];
      expect(lastEdge.from).toBe('step4');
      expect(lastEdge.to).toBe('step1');
    });

    it('should use custom options', () => {
      const items = ['A', 'B', 'C'];
      const result = generateCycleProcess(items, {
        shape: 'circle',
        idPrefix: 'stage',
        direction: 'TB',
      });

      expect(result.nodes[0].shape).toBe('circle');
      expect(result.nodes[0].id).toBe('stage1');
      expect(result.direction).toBe('TB');
    });

    it('should handle two items', () => {
      const items = ['A', 'B'];
      const result = generateCycleProcess(items);

      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(2); // 1 forward + 1 back
    });

    it('should handle single item without edges', () => {
      const items = ['Only'];
      const result = generateCycleProcess(items);

      expect(result.nodes).toHaveLength(1);
      expect(result.edges).toHaveLength(0);
    });
  });

  describe('generateHierarchy', () => {
    it('should generate hierarchy with default options', () => {
      const levels = ['Top', 'Middle', 'Bottom'];
      const result = generateHierarchy(levels);

      expect(result.direction).toBe('TB');
      expect(result.nodes).toHaveLength(3);
      expect(result.edges).toHaveLength(2);

      expect(result.nodes[0].id).toBe('level1');
      expect(result.edges[0].from).toBe('level1');
      expect(result.edges[0].to).toBe('level2');
    });

    it('should use custom options', () => {
      const levels = ['A', 'B'];
      const result = generateHierarchy(levels, {
        shape: 'triangle',
        idPrefix: 'tier',
        direction: 'LR',
      });

      expect(result.nodes[0].shape).toBe('triangle');
      expect(result.nodes[0].id).toBe('tier1');
      expect(result.direction).toBe('LR');
    });
  });

  describe('generateAlternatingProcess', () => {
    it('should generate alternating positions', () => {
      const items = ['A', 'B', 'C', 'D'];
      const result = generateAlternatingProcess(items);

      expect(result.nodes).toHaveLength(4);
      expect(result.nodes[0].data?.position).toBe('left');
      expect(result.nodes[1].data?.position).toBe('right');
      expect(result.nodes[2].data?.position).toBe('left');
      expect(result.nodes[3].data?.position).toBe('right');
    });

    it('should create sequential edges', () => {
      const items = ['A', 'B', 'C'];
      const result = generateAlternatingProcess(items);

      expect(result.edges).toHaveLength(2);
      expect(result.edges[0].from).toBe('step1');
      expect(result.edges[0].to).toBe('step2');
    });

    it('should use custom options', () => {
      const items = ['A', 'B'];
      const result = generateAlternatingProcess(items, {
        shape: 'diamond',
        direction: 'TB',
        idPrefix: 'item',
      });

      expect(result.nodes[0].shape).toBe('diamond');
      expect(result.direction).toBe('TB');
      expect(result.nodes[0].id).toBe('item1');
    });
  });

  describe('generateCompositeNode', () => {
    it('should generate single composite node', () => {
      const result = generateCompositeNode('matrix-1', {
        shape: 'matrix3x3',
        data: { quadrants: ['A', 'B', 'C'] },
        label: 'Matrix',
      });

      expect(result.nodes).toHaveLength(1);
      expect(result.edges).toHaveLength(0);
      expect(result.nodes[0].id).toBe('matrix-1');
      expect(result.nodes[0].shape).toBe('matrix3x3');
      expect(result.nodes[0].label).toBe('Matrix');
      expect(result.nodes[0].data?.quadrants).toEqual(['A', 'B', 'C']);
    });

    it('should work without label', () => {
      const result = generateCompositeNode('chart-1', {
        shape: 'barChart',
        data: { values: [1, 2, 3] },
      });

      expect(result.nodes[0].label).toBe('');
      expect(result.nodes[0].data?.values).toEqual([1, 2, 3]);
    });
  });
});
