export type Direction = 'LR' | 'RL' | 'TB' | 'BT';

export interface DiagramAst {
  astVersion: string;
  title?: string;
  direction?: Direction;
  styles?: Record<string, Style>;
  nodes: NodeAst[];
  edges: EdgeAst[];
  groups?: GroupAst[];
  containers?: ContainerDeclaration[];
}

export interface NodeAst {
  id: string;
  shape: string;
  label?: string;
  style?: string;
  icon?: IconRef;
  link?: LinkRef;
  tooltip?: string;
  data?: Record<string, unknown>;
}

export interface EdgeAst {
  from: string;
  to: string;
  label?: string;
  when?: string;
  style?: string;
  link?: LinkRef;
  tooltip?: string;
  data?: Record<string, unknown>;
}

export interface GroupAst {
  id?: string;
  label?: string;
  children: string[];
  style?: string;
}

/**
 * Hierarchical container for grouping nodes and nested containers
 * Supports C4 diagrams, BPMN processes, architecture boundaries
 */
export interface ContainerDeclaration {
  type: 'container';
  id?: string; // Optional - can be auto-generated from label
  label?: string;
  style?: string; // Reference to named style in DiagramAst.styles
  containerStyle?: ContainerStyle;
  children: string[]; // Node IDs that belong to this container
  containers?: ContainerDeclaration[]; // Nested containers
  layoutOptions?: ContainerLayoutOptions;
}

/**
 * Visual styling specific to containers
 */
export interface ContainerStyle {
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
  opacity?: number;
  padding?: number;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Layout options that can be specified per container
 */
export interface ContainerLayoutOptions {
  algorithm?: 'layered' | 'force' | 'radial' | 'stress';
  direction?: Direction;
  spacing?: number;
}

export interface Style {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  font?: string;
  fontSize?: number;
  rx?: number;
  ry?: number;
  padding?: number;
  [k: string]: unknown;
}

export interface IconRef {
  provider: string; // e.g., "fontawesome"
  name: string; // e.g., "user"
}

export interface LinkRef {
  href: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

export interface ShapeRenderContext {
  node: NodeAst;
  style: Style;
  measureText: (
    text: string,
    style: Style
  ) => { width: number; height: number };
}

export interface ShapeDefinition {
  id: string;
  bounds(ctx: ShapeRenderContext): { width: number; height: number };
  anchors?(ctx: ShapeRenderContext): { x: number; y: number; name?: string }[];
  render(ctx: ShapeRenderContext, position: { x: number; y: number }): string; // returns SVG <g> inner markup
}

export interface IconProvider {
  id: string; // "fontawesome"
  getPath(name: string): { d: string; viewBox: string } | undefined;
}

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
