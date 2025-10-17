import { describe, it, expect } from 'vitest';
import { toSimulink } from '../index.js';
import type { DiagramAst, LaidOutDiagram } from '@runiq/core';

describe('Simulink MDL Exporter', () => {
  describe('Basic Export', () => {
    it('should export empty diagram with Model structure', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [],
        edges: [],
        size: { width: 100, height: 100 },
      };

      const result = toSimulink(diagram, layout);

      expect(result.mdl).toContain('Model {');
      expect(result.mdl).toContain('Name\t\t"untitled"');
      expect(result.mdl).toContain('System {');
      expect(result.mdl).toContain('}');
      expect(result.warnings).toEqual([]);
    });
  });

  describe('Transfer Function Blocks', () => {
    it('should export transfer function block', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'tf1', shape: 'transfer-fn', label: '1/(s+1)' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'tf1', x: 100, y: 50, width: 80, height: 60 }],
        edges: [],
        size: { width: 200, height: 120 },
      };

      const result = toSimulink(diagram, layout);

      expect(result.mdl).toContain('Block {');
      expect(result.mdl).toContain('BlockType\t\t"TransferFcn"');
      expect(result.mdl).toContain('Name\t\t"tf1"');
      expect(result.mdl).toContain('Numerator\t\t"[1]"');
      expect(result.mdl).toContain('Denominator\t\t"[1 1]"');
      expect(result.mdl).toContain('Position\t\t[100, 50, 180, 110]');
    });
  });

  describe('Gain Blocks', () => {
    it('should export gain block', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'g1', shape: 'gain', label: 'K=10' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'g1', x: 50, y: 50, width: 60, height: 40 }],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = toSimulink(diagram, layout);

      expect(result.mdl).toContain('BlockType\t\t"Gain"');
      expect(result.mdl).toContain('Name\t\t"g1"');
      expect(result.mdl).toContain('Gain\t\t"10"');
    });
  });

  describe('Integrator Blocks', () => {
    it('should export integrator block', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'int1', shape: 'integrator' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'int1', x: 0, y: 0, width: 60, height: 40 }],
        edges: [],
        size: { width: 80, height: 60 },
      };

      const result = toSimulink(diagram, layout);

      expect(result.mdl).toContain('BlockType\t\t"Integrator"');
      expect(result.mdl).toContain('Name\t\t"int1"');
    });
  });

  describe('Summing Junctions', () => {
    it('should export sum block with operators', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'sum1', shape: 'compare-junction', label: '+-' }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'sum1', x: 50, y: 50, width: 40, height: 40 }],
        edges: [],
        size: { width: 100, height: 100 },
      };

      const result = toSimulink(diagram, layout);

      expect(result.mdl).toContain('BlockType\t\t"Sum"');
      expect(result.mdl).toContain('Name\t\t"sum1"');
      expect(result.mdl).toContain('Inputs\t\t"+-"');
    });
  });

  describe('Connections', () => {
    it('should export lines (connections)', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'gain', label: 'K1' },
          { id: 'B', shape: 'transfer-fn', label: 'G(s)' },
        ],
        edges: [{ from: 'A', to: 'B' }],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'A', x: 0, y: 50, width: 60, height: 40 },
          { id: 'B', x: 100, y: 50, width: 80, height: 60 },
        ],
        edges: [
          {
            from: 'A',
            to: 'B',
            points: [
              { x: 60, y: 70 },
              { x: 100, y: 80 },
            ],
          },
        ],
        size: { width: 200, height: 150 },
      };

      const result = toSimulink(diagram, layout);

      expect(result.mdl).toContain('Line {');
      expect(result.mdl).toContain('SrcBlock\t\t"A"');
      expect(result.mdl).toContain('DstBlock\t\t"B"');
      expect(result.mdl).toContain('SrcPort\t\t1');
      expect(result.mdl).toContain('DstPort\t\t1');
    });
  });

  describe('Complete Systems', () => {
    it('should export feedback control system', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'sum', shape: 'compare-junction', label: '+-' },
          { id: 'controller', shape: 'transfer-fn', label: 'C(s)' },
          { id: 'plant', shape: 'transfer-fn', label: 'G(s)' },
        ],
        edges: [
          { from: 'sum', to: 'controller' },
          { from: 'controller', to: 'plant' },
        ],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'sum', x: 50, y: 100, width: 40, height: 40 },
          { id: 'controller', x: 120, y: 90, width: 80, height: 60 },
          { id: 'plant', x: 230, y: 90, width: 80, height: 60 },
        ],
        edges: [
          {
            from: 'sum',
            to: 'controller',
            points: [
              { x: 90, y: 120 },
              { x: 120, y: 120 },
            ],
          },
          {
            from: 'controller',
            to: 'plant',
            points: [
              { x: 200, y: 120 },
              { x: 230, y: 120 },
            ],
          },
        ],
        size: { width: 350, height: 200 },
      };

      const result = toSimulink(diagram, layout);

      expect(result.mdl).toContain('BlockType\t\t"TransferFcn"'); // transfer functions
      expect(result.mdl).toContain('BlockType\t\t"Sum"'); // summing junction
      expect(result.warnings.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should warn about unsupported shapes', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [{ id: 'invalid', shape: 'nonexistent-shape' as any }],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [{ id: 'invalid', x: 0, y: 0, width: 60, height: 40 }],
        edges: [],
        size: { width: 80, height: 60 },
      };

      const result = toSimulink(diagram, layout);

      expect(
        result.warnings.some((w: string) => w.includes('Unsupported shape'))
      ).toBe(true);
    });
  });
});
