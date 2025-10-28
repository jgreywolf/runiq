export type Direction = 'LR' | 'RL' | 'TB' | 'BT';

/**
 * Data value types for data-driven rendering (charts, graphs)
 */
export type DataValue = number | { label: string; value: number };
export type DataArray = DataValue[];

export interface DataPoint {
  x: number;
  y: number;
  label?: string;
  value?: number;
}

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
  // UML enhancements for use case diagrams and other notations
  stereotype?: string; // e.g., 'include', 'extend', 'uses' (rendered as <<stereotype>>)
  lineStyle?: 'solid' | 'dashed' | 'dotted' | 'double'; // Line appearance (double for consanguineous marriages)
  arrowType?: 'standard' | 'hollow' | 'open' | 'none'; // Arrow head style
  // UML Class Diagram relationship properties (Phase 1)
  edgeType?:
    | 'association'
    | 'aggregation'
    | 'composition'
    | 'dependency'
    | 'generalization'
    | 'realization'; // Relationship type
  multiplicitySource?: string; // Source multiplicity (e.g., '1', '0..1', '1..*', '0..*', '*')
  multiplicityTarget?: string; // Target multiplicity
  roleSource?: string; // Role name at source end
  roleTarget?: string; // Role name at target end
  // UML Class Diagram Phase 3 properties
  navigability?: 'source' | 'target' | 'bidirectional' | 'none'; // Direction of navigation
  constraints?: string[]; // Constraints like 'ordered', 'unique', etc.
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
  shape?: string; // Optional - reference to shape type (e.g., 'umlPackage', 'awsVpc')
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
 * ELK layout algorithms supported by Runiq
 * - layered: Hierarchical layout (default, good for flowcharts)
 * - force: Force-directed layout (good for network graphs)
 * - stress: Stress-minimization layout (minimize edge lengths)
 * - radial: Radial tree layout (good for org charts, mind maps)
 * - mrtree: Multi-rooted tree layout (good for forests)
 */
export type LayoutAlgorithm =
  | 'layered'
  | 'force'
  | 'stress'
  | 'radial'
  | 'mrtree';

/**
 * Layout options that can be specified per container
 */
export interface ContainerLayoutOptions {
  algorithm?: LayoutAlgorithm;
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

/**
 * Helper function to extract a property from node data.
 * Handles the parser's format: { values: [{ property: value }] }
 * Also supports direct format and array format.
 */
export function getDataProperty<T = any>(
  data: Record<string, unknown> | undefined,
  property: string,
  defaultValue?: T
): T | undefined {
  if (!data) return defaultValue;

  const d = data as any;

  // Format from parser: { values: [{ property: value }] }
  if (d.values && Array.isArray(d.values) && d.values[0]) {
    return d.values[0][property] ?? defaultValue;
  }

  // Direct format: { property: value }
  if (d[property] !== undefined) {
    return d[property] ?? defaultValue;
  }

  // Array format: [{ property: value }]
  if (Array.isArray(d) && d[0]) {
    return d[0][property] ?? defaultValue;
  }

  return defaultValue;
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

// ============================================================================
// Profile-Based System for Multi-Domain Support
// ============================================================================

/**
 * Top-level Runiq document containing one or more profiles
 * Each profile represents a different domain (visual diagrams, electrical, digital, etc.)
 */
export interface RuniqDocument {
  astVersion: string;
  profiles: Profile[];
}

/**
 * Union type for all supported profile types
 * Each profile has completely separate grammar and semantics
 */
export type Profile =
  | DiagramProfile
  | ElectricalProfile
  | SchematicProfile
  | DigitalProfile
  | BlockDiagramProfile;

/**
 * Visual diagram profile (existing Runiq diagrams)
 * Supports flowcharts, architecture diagrams, etc.
 */
export interface DiagramProfile {
  type: 'diagram';
  name: string;
  direction?: Direction;
  styles?: Record<string, Style>;
  nodes: NodeAst[];
  edges: EdgeAst[];
  groups?: GroupAst[];
  containers?: ContainerDeclaration[];
}

/**
 * Electrical/Analog circuit profile
 * Exports to SPICE, EDIF
 */
export interface ElectricalProfile {
  type: 'electrical';
  name: string;
  nets: NetAst[];
  parts: PartAst[];
  analyses?: AnalysisAst[];
}

/**
 * Schematic circuit profile (renamed from ElectricalProfile)
 * Backward compatible with ElectricalProfile; identical fields.
 */
export interface SchematicProfile {
  type: 'schematic';
  name: string;
  nets: NetAst[];
  parts: PartAst[];
  analyses?: AnalysisAst[];
}

/**
 * Digital circuit profile
 * Exports to Verilog, EDIF
 */
export interface DigitalProfile {
  type: 'digital';
  name: string;
  modules?: ModuleAst[];
  instances: InstanceAst[];
  nets: NetAst[];
}

/**
 * Block diagram profile
 * For control systems, signal processing, system modeling
 * Exports to Simulink, LaTeX (TikZ)
 */
export interface BlockDiagramProfile {
  type: 'block-diagram';
  name: string;
  nets: NetAst[]; // Signal paths
  parts: PartAst[]; // Transfer functions, gain blocks, operations
  feedbackLoops?: boolean; // Enable feedback loop routing
}

// ============================================================================
// Electrical Profile Types
// ============================================================================

/**
 * Net (electrical connection/wire)
 * Examples: "IN", "OUT", "GND", "VCC"
 */
export interface NetAst {
  name: string;
  width?: number; // For digital buses (e.g., 8 for data[7:0])
}

/**
 * Analog device/component
 * Examples: Resistor, Capacitor, Voltage source
 */
export interface PartAst {
  ref: string; // Component reference (e.g., "R1", "C1", "V1")
  type: string; // Component type (e.g., "R", "C", "L", "V", "I")
  params?: Record<string, string | number>; // Component parameters (e.g., {value: "10k"})
  pins: string[]; // Connected nets (positional, e.g., ["IN", "OUT"])
  doc?: string; // Optional documentation comment
}

/**
 * SPICE analysis directive
 * Examples: .tran, .ac, .dc, .op
 */
export interface AnalysisAst {
  kind: 'tran' | 'ac' | 'dc' | 'op' | 'noise' | 'custom';
  args?: string; // Unparsed arguments (e.g., "0 5m" for transient)
}

// ============================================================================
// Digital Profile Types
// ============================================================================

/**
 * Digital module declaration (similar to Verilog module)
 */
export interface ModuleAst {
  name: string; // Module name (e.g., "Counter")
  ports: PortAst[]; // Port declarations
  params?: Record<string, string | number>; // Module parameters
}

/**
 * Port declaration for digital modules
 */
export interface PortAst {
  name: string; // Port name (e.g., "clk", "reset")
  dir: 'input' | 'output' | 'inout'; // Direction
  width?: number; // Bus width (e.g., 8 for count[7:0])
}

/**
 * Module instance (instantiation of a module)
 */
export interface InstanceAst {
  ref: string; // Instance reference (e.g., "U1")
  of: string; // Module name being instantiated
  paramMap?: Record<string, string | number>; // Parameter overrides
  portMap: Record<string, string>; // Port connections (port -> net)
  doc?: string; // Optional documentation
}
