import { describe, it, expect } from 'vitest';
import { toLatex } from '../index.js';
import type { DiagramAst, LaidOutDiagram } from '@runiq/core';

describe('LaTeX/TikZ Exporter', () => {
  describe('Basic Export', () => {
    it('should export empty diagram with document structure', () => {
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

      const result = toLatex(diagram, layout);
      
      expect(result.latex).toContain('\\documentclass');
      expect(result.latex).toContain('\\usepackage{tikz}');
      expect(result.latex).toContain('\\usetikzlibrary{positioning,shapes.geometric,arrows.meta,calc}');
      expect(result.latex).toContain('\\begin{tikzpicture}');
      expect(result.latex).toContain('\\end{tikzpicture}');
      expect(result.warnings).toEqual([]);
    });
  });

  describe('Transfer Function Blocks', () => {
    it('should export transfer function with proper TikZ syntax', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'tf1', shape: 'transfer-fn', label: 'K/(s+1)' },
        ],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'tf1', x: 100, y: 50, width: 80, height: 60 },
        ],
        edges: [],
        size: { width: 200, height: 120 },
      };

      const result = toLatex(diagram, layout);
      
      expect(result.latex).toContain('\\node[block]');
      expect(result.latex).toContain('(tf1)');
      expect(result.latex).toContain('at (2.54cm,1.27cm)'); // 100px, 50px converted to cm
      expect(result.latex).toContain('\\frac{K}{s+1}'); // Fraction converted
    });
  });

  describe('Gain Blocks', () => {
    it('should export gain block with triangle shape', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'g1', shape: 'gain', label: 'K=10' },
        ],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'g1', x: 50, y: 50, width: 60, height: 40 },
        ],
        edges: [],
        size: { width: 150, height: 100 },
      };

      const result = toLatex(diagram, layout);
      
      expect(result.latex).toContain('\\node[gain]');
      expect(result.latex).toContain('(g1)');
      expect(result.latex).toContain('$K=10$');
    });
  });

  describe('Integration Blocks', () => {
    it('should export integrator block with blue fill', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'int1', shape: 'integrator', label: '1/s' },
        ],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'int1', x: 0, y: 0, width: 60, height: 40 },
        ],
        edges: [],
        size: { width: 80, height: 60 },
      };

      const result = toLatex(diagram, layout);
      
      expect(result.latex).toContain('\\node[block,fill=blue!10]');
      expect(result.latex).toContain('\\frac{1}{s}');
    });
  });

  describe('Summing Junctions', () => {
    it('should export compare junction with operators', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'cmp1', shape: 'compare-junction', label: '+-' },
        ],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'cmp1', x: 50, y: 50, width: 40, height: 40 },
        ],
        edges: [],
        size: { width: 100, height: 100 },
      };

      const result = toLatex(diagram, layout);
      
      expect(result.latex).toContain('\\node[sum]');
      expect(result.latex).toContain('(cmp1)');
    });
  });

  describe('Connections', () => {
    it('should export edges as arrows', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'A', shape: 'gain', label: 'K1' },
          { id: 'B', shape: 'transfer-fn', label: 'G(s)' },
        ],
        edges: [
          { from: 'A', to: 'B', label: 'signal' },
        ],
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

      const result = toLatex(diagram, layout);
      
      expect(result.latex).toContain('\\draw[->,>=Stealth]');
      expect(result.latex).toContain('(A)');
      expect(result.latex).toContain('(B)');
      expect(result.latex).toContain('node[above]');
      expect(result.latex).toContain('{$signal$}');
    });
  });

  describe('Complete Systems', () => {
    it('should export control system diagram', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'sum', shape: 'compare-junction', label: '+-' },
          { id: 'controller', shape: 'transfer-fn', label: 'C(s)' },
          { id: 'plant', shape: 'transfer-fn', label: 'G(s)' },
        ],
        edges: [
          { from: 'sum', to: 'controller', label: 'e(t)' },
          { from: 'controller', to: 'plant', label: 'u(t)' },
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

      const result = toLatex(diagram, layout);
      
      expect(result.latex).toContain('\\node[block]'); // transfer functions
      expect(result.latex).toContain('\\node[sum]'); // junction
      expect(result.warnings.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should warn about unsupported shapes', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'invalid', shape: 'nonexistent-shape' as any },
        ],
        edges: [],
      };

      const layout: LaidOutDiagram = {
        nodes: [
          { id: 'invalid', x: 0, y: 0, width: 60, height: 40 },
        ],
        edges: [],
        size: { width: 80, height: 60 },
      };

      const result = toLatex(diagram, layout);
      
      expect(result.warnings.some((w: string) => w.includes('shape'))).toBe(true);
    });
  });
});
