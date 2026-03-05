/**
 * Layout engine type definitions
 * LayoutEngine, LaidOutDiagram, PositionedNode, RoutedEdge, and related types
 */

import type { Direction } from '../constants.js';
import type { DiagramAst } from './diagram-types.js';

export interface LayoutOptions {
  direction?: Direction;
  spacing?: number;
}

export interface PositionedNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoutedEdge {
  from: string;
  to: string;
  points: { x: number; y: number }[];
  edgeIndex?: number; // Index in diagram.edges array to handle multiple edges between same nodes
}

export interface PositionedContainer {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  containers?: PositionedContainer[]; // Nested containers
}

export interface LaidOutDiagram {
  nodes: PositionedNode[];
  edges: RoutedEdge[];
  size: { width: number; height: number };
  containers?: PositionedContainer[];
}

export interface LayoutEngine {
  id: string;
  supportsManualPositions?: boolean; // future: respect node.data.position if provided
  layout(diagram: DiagramAst, opts?: LayoutOptions): Promise<LaidOutDiagram>;
}
