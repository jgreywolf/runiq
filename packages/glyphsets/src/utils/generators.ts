import type { DiagramAst, NodeAst, EdgeAst } from '@runiq/core';
import { Direction, LineStyle } from '@runiq/core';
import { getThemeColor, type ColorTheme } from '../themes.js';

/**
 * Generator utilities for creating common diagram patterns
 * Reduces code duplication across ~15 process glyphsets
 */

export interface LinearProcessOptions {
  shape?: string;
  theme?: ColorTheme;
  direction?: Direction;
  idPrefix?: string;
  edgeStyle?: 'solid' | 'dashed' | 'dotted';
}

/**
 * Generates a linear process diagram with sequential nodes and edges
 * Perfect for step-by-step workflows, timelines, and processes
 */
export function generateLinearProcess(
  items: string[],
  options: LinearProcessOptions = {}
): DiagramAst {
  const {
    shape = 'rect',
    theme = 'colorful',
    direction = 'LR' as Direction,
    idPrefix = 'step',
    edgeStyle = 'solid',
  } = options;

  const nodes: NodeAst[] = [];
  const edges: EdgeAst[] = [];

  items.forEach((item, i) => {
    nodes.push({
      id: `${idPrefix}${i + 1}`,
      shape,
      label: item,
      data: { fillColor: getThemeColor(theme, i) },
    });

    if (i > 0) {
      edges.push({
        from: `${idPrefix}${i}`,
        to: `${idPrefix}${i + 1}`,
        style: edgeStyle,
      });
    }
  });

  return { astVersion: '1.0', direction, theme, nodes, edges };
}

export interface CycleProcessOptions {
  shape?: string;
  theme?: ColorTheme;
  direction?: Direction;
  idPrefix?: string;
}

/**
 * Generates a cyclic process diagram where the last node connects back to the first
 * Perfect for continuous improvement cycles, recurring processes
 */
export function generateCycleProcess(
  items: string[],
  options: CycleProcessOptions = {}
): DiagramAst {
  const {
    shape = 'rect',
    theme = 'colorful',
    direction = 'LR' as Direction,
    idPrefix = 'step',
  } = options;

  const nodes: NodeAst[] = [];
  const edges: EdgeAst[] = [];

  items.forEach((item, i) => {
    nodes.push({
      id: `${idPrefix}${i + 1}`,
      shape,
      label: item,
      data: { fillColor: getThemeColor(theme, i) },
    });

    // Create edge from previous node
    if (i > 0) {
      edges.push({
        from: `${idPrefix}${i}`,
        to: `${idPrefix}${i + 1}`,
      });
    }
  });

  // Add cycle-back edge from last to first
  if (items.length > 1) {
    edges.push({
      from: `${idPrefix}${items.length}`,
      to: `${idPrefix}1`,
    });
  }

  return { astVersion: '1.0', direction: direction as Direction, theme, nodes, edges };
}

export interface HierarchyOptions {
  shape?: string;
  theme?: ColorTheme;
  direction?: Direction;
  idPrefix?: string;
  levelsPerRow?: number;
}

/**
 * Generates a simple hierarchical structure
 * Perfect for pyramids, organizational levels
 */
export function generateHierarchy(
  levels: string[],
  options: HierarchyOptions = {}
): DiagramAst {
  const {
    shape = 'rect',
    theme = 'colorful',
    direction = 'TB' as Direction,
    idPrefix = 'level',
  } = options;

  const nodes: NodeAst[] = [];
  const edges: EdgeAst[] = [];

  levels.forEach((level, i) => {
    nodes.push({
      id: `${idPrefix}${i + 1}`,
      shape,
      label: level,
      data: { fillColor: getThemeColor(theme, i) },
    });

    // Connect to previous level (parent)
    if (i > 0) {
      edges.push({
        from: `${idPrefix}${i}`,
        to: `${idPrefix}${i + 1}`,
      });
    }
  });

  return { astVersion: '1.0', direction: direction as Direction, theme, nodes, edges };
}

export interface AlternatingProcessOptions {
  shape?: string;
  theme?: ColorTheme;
  direction?: Direction;
  idPrefix?: string;
  alternateDirection?: boolean;
}

/**
 * Generates an alternating process where items alternate between sides
 * Perfect for staggered workflows, comparison processes
 */
export function generateAlternatingProcess(
  items: string[],
  options: AlternatingProcessOptions = {}
): DiagramAst {
  const {
    shape = 'rect',
    theme = 'colorful',
    direction = 'LR' as Direction,
    idPrefix = 'step',
  } = options;

  const nodes: NodeAst[] = [];
  const edges: EdgeAst[] = [];

  items.forEach((item, i) => {
    const isLeft = i % 2 === 0;
    nodes.push({
      id: `${idPrefix}${i + 1}`,
      shape,
      label: item,
      data: {
        fillColor: getThemeColor(theme, i),
        position: isLeft ? 'left' : 'right',
      },
    });

    if (i > 0) {
      edges.push({
        from: `${idPrefix}${i}`,
        to: `${idPrefix}${i + 1}`,
      });
    }
  });

  return { astVersion: '1.0', direction: direction as Direction, theme, nodes, edges };
}

export interface CompositeNodeOptions {
  shape: string;
  data: Record<string, unknown>;
  label?: string;
}

/**
 * Generates a single composite node for charts and matrices
 * The shape itself handles all rendering
 */
export function generateCompositeNode(
  id: string,
  options: CompositeNodeOptions
): DiagramAst {
  const { shape, data, label } = options;

  const node: NodeAst = {
    id,
    shape,
    label: label || '',
    data,
  };

  return {
    astVersion: '1.0',
    direction: 'TB' as Direction,
    nodes: [node],
    edges: [],
  };
}
