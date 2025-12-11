/**
 * Core type definitions for Runiq diagrams
 * Shared across all packages
 */

import type {
  ArrowType,
  Direction,
  EdgeRouting,
  LayoutAlgorithm,
  LineStyle,
} from './constants.js';

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

/**
 * Data source interface for loading external data
 * Implemented by @runiq/data-loader package
 */
export interface DataSource {
  load(source: string): Promise<DataObject[]>;
  validate(data: unknown): ValidationResult;
  readonly format: string;
}

export type DataObject = Record<string, unknown>;

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
  value?: unknown;
}

/**
 * Identifier for a registered data source in dataSourceRegistry
 */
export type DataSourceKey = string;

/**
 * Reference to a data source and where to load from.
 * - key: registry key (e.g., 'json', 'csv', 'http')
 * - source: either a file path or an inline payload string depending on the loader
 */
export interface DataSourceRef {
  key: DataSourceKey;
  source: string;
  // Optional loader-specific options (kept generic to avoid coupling)
  options?: Record<string, unknown>;
}

/**
 * Declarative data binding description used by higher layers (DSL, templates).
 * This does not execute anything by itself; it describes how to obtain and map data.
 */
export interface DataBinding {
  /** Data source reference to load from */
  source: DataSourceRef;
  /** Optional field mapping: targetProperty -> dataFieldPath (dot notation supported later) */
  fields?: Record<string, string>;
  /** Optional filter expression (reserved for future DSL integration) */
  filter?: string;
  /** Optional maximum number of rows to consume */
  limit?: number;
}

export interface DiagramAst {
  astVersion: string;
  title?: string;
  direction?: Direction;
  routing?: EdgeRouting;
  theme?: string; // Color theme (professional, ocean, forest, etc.)
  styles?: Record<string, Style>;
  nodes: NodeAst[];
  edges: EdgeAst[];
  groups?: GroupAst[];
  containers?: ContainerDeclaration[];
  // Phase 5: Templates & Presets
  templates?: ContainerTemplate[]; // Container template definitions
  presets?: ContainerPreset[]; // Style preset definitions
}

export interface NodeAst {
  id: string;
  shape: string;
  label?: string;
  style?: string;
  icon?: IconRef;
  link?: LinkRef;
  tooltip?: string;
  position?: { x: number; y: number }; // Manual position (overrides layout engine)
  // UML State Machine properties
  entry?: string; // Entry action (e.g., "startTimer()")
  exit?: string; // Exit action (e.g., "stopTimer()")
  doActivity?: string; // Continuous activity (e.g., "playMusic()")
  // UML Activity Diagram properties
  inputPins?: string[]; // Input pins for action nodes (e.g., ["order", "payment"])
  outputPins?: string[]; // Output pins for action nodes (e.g., ["receipt", "confirmation"])
  // UML Sequence Diagram properties
  stateInvariant?: string; // Constraint that must be true at this point (e.g., "balance >= 0")
  // UML Use Case Diagram properties
  extensionPoints?: string[]; // Extension points for use cases (e.g., ["Payment Failed", "Insufficient Funds"])
  // Data used by data-driven shapes (charts etc.)
  // Known common fields are typed to improve DX while still allowing arbitrary extras
  data?:
    | {
        value?: number;
        values?: DataArray;
        points?: DataPoint[];
        labels?: string[];
        colors?: string[];
        [k: string]: unknown;
      }
    | Record<string, unknown>;
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
  routing?: EdgeRouting; // Per-edge routing override
  // UML enhancements for use case diagrams and other notations
  stereotype?: string | string[]; // e.g., 'include', 'extend', 'uses' (rendered as <<stereotype>>). Supports single or multiple stereotypes
  lineStyle?: LineStyle; // Line appearance
  arrowType?: ArrowType; // Arrow head style
  bidirectional?: boolean; // Whether to show arrows on both ends (from <-> syntax)
  strokeColor?: string; // Line color (e.g., '#2196f3', 'rgb(33, 150, 243)')
  strokeWidth?: number; // Line thickness in pixels
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
  // UML State Machine transition properties
  event?: string; // Triggering event (e.g., "doorClosed")
  guard?: string; // Guard condition (e.g., "[doorLocked]")
  effect?: string; // Effect/action (e.g., "/ turnOnLight()")
  // UML Activity Diagram flow properties
  flowType?: 'control' | 'object'; // Type of flow: control flow (default) or object flow (data transfer)
  // Graph theory properties
  weight?: number; // Edge weight for weighted graphs (cost, distance, capacity, etc.)
  // Edge anchor/port properties - control which side of node the edge connects to
  anchorFrom?: 'north' | 'south' | 'east' | 'west'; // Exit side from source node (top, bottom, right, left)
  anchorTo?: 'north' | 'south' | 'east' | 'west'; // Entry side to target node (top, bottom, right, left)
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
  header?: string; // Phase 1: Explicit header text (can differ from label)
  icon?: string; // Phase 1: Icon reference (e.g., 'server', 'database')
  badge?: string; // Phase 1: Badge text (e.g., version, status)
  collapsible?: boolean; // Phase 1: Can this container be collapsed?
  collapsed?: boolean; // Phase 1/2: Is this container currently collapsed?

  // Phase 2: Collapse/Expand functionality
  collapseMode?: 'full' | 'partial'; // full: hide all, partial: show first level
  collapseRedirectEdges?: boolean; // Redirect edges to collapsed container
  collapseTransitionState?: 'stable' | 'collapsing' | 'expanding'; // Animation state
  collapseAnimationDuration?: number; // Animation duration in milliseconds
  collapseAnimationEasing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'; // Easing function
  collapseSummary?: string; // Summary text shown when collapsed
  collapseShowCount?: boolean; // Show child count badge when collapsed
  collapseIcon?: string; // Icon for collapse indicator
  collapsePersistState?: boolean; // Save collapse state to storage
  collapseStateKey?: string; // Unique key for state persistence
  collapseKeyboardShortcut?: string; // Keyboard shortcut to toggle

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
  // Basic styles (existing)
  borderStyle?: LineStyle;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  opacity?: number;
  padding?: number;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';

  // Phase 1: Shadow and depth
  shadow?: boolean; // Enable drop shadow effect
  depth?: number; // Visual depth level (0-3+, higher = more prominent)

  // Phase 1: Header styling
  headerPosition?: 'top' | 'bottom' | 'left' | 'right';
  headerBackgroundColor?: string;

  // Phase 1: Icon styling
  iconSize?: number; // Icon size in pixels
  iconColor?: string; // Icon color

  // Phase 3: Size constraints
  minWidth?: number; // Minimum container width in pixels
  maxWidth?: number; // Maximum container width in pixels
  minHeight?: number; // Minimum container height in pixels
  maxHeight?: number; // Maximum container height in pixels

  // Phase 3: Auto-resize behavior
  autoResize?: boolean | 'fit-content' | 'fill-available'; // How container resizes to content

  // Phase 3: Individual padding controls
  paddingTop?: number; // Top padding in pixels
  paddingRight?: number; // Right padding in pixels
  paddingBottom?: number; // Bottom padding in pixels
  paddingLeft?: number; // Left padding in pixels

  // Phase 3: Margin controls
  margin?: number; // Uniform margin in pixels
  marginTop?: number; // Top margin in pixels
  marginRight?: number; // Right margin in pixels
  marginBottom?: number; // Bottom margin in pixels
  marginLeft?: number; // Left margin in pixels

  // Phase 3: Content alignment
  alignContent?: 'left' | 'center' | 'right'; // Horizontal alignment of children
  verticalAlign?: 'top' | 'middle' | 'bottom'; // Vertical alignment of children

  // Phase 3: Child node distribution
  distribution?: 'space-evenly' | 'space-between' | 'space-around' | 'packed'; // How children are distributed
  nodeSpacing?: number; // Custom spacing between nodes in pixels

  // Phase 3: Edge routing optimization
  edgeRouting?: 'container-aware' | 'orthogonal' | 'spline' | 'polyline'; // Edge routing preference
  edgeBundling?: boolean; // Bundle parallel edges together
  crossContainerEdgeOptimization?: boolean; // Optimize edges crossing container boundaries

  // Phase 3: Layout performance hints
  layoutCache?: boolean; // Cache layout results for performance
  incrementalLayout?: boolean; // Enable incremental layout updates
  layoutComplexity?: 'low' | 'medium' | 'high'; // Hint for layout complexity

  // Phase 4: Visual Controls
  // Collapse button controls
  collapseButtonVisible?: boolean; // Show/hide collapse button
  collapseButtonPosition?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'; // Button corner position
  collapseButtonStyle?: 'icon' | 'text' | 'icon-text'; // Button display style
  collapseButtonSize?: number; // Button size in pixels
  collapseButtonColor?: string; // Button color

  // Resize controls
  resizable?: boolean; // Enable manual resize handles
  resizeHandles?: ('n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw')[]; // Which handles to show (n=north, s=south, etc.)
  minResizeWidth?: number; // Minimum width when resizing manually
  minResizeHeight?: number; // Minimum height when resizing manually

  // Interactive feedback
  hoverHighlight?: boolean; // Highlight container on hover
  hoverBorderColor?: string; // Border color on hover
  hoverBorderWidth?: number; // Border width on hover
  selectionHighlight?: boolean; // Highlight when selected
  selectionBorderColor?: string; // Border color when selected
  selectionBorderWidth?: number; // Border width when selected

  // Visual feedback indicators
  showChildCount?: boolean; // Show number of children badge
  childCountPosition?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'; // Badge position
  showDepthIndicator?: boolean; // Show nesting depth visual indicator
  depthIndicatorStyle?: 'bar' | 'indent' | 'color'; // How to show depth

  // Phase 5: Templates & Presets
  templateId?: string; // Reference to a container template
  extends?: string; // Inherit from another container or template
  preset?: string; // Apply a named style preset ('card' | 'panel' | 'group' | 'section' | 'highlighted')
}

/**
 * Container template definition - reusable container patterns with parameters
 * Phase 5: Advanced Features
 */
export interface ContainerTemplate {
  id: string; // Unique template identifier
  label?: string; // Template display name
  description?: string; // Template description
  parameters?: TemplateParameter[]; // Template parameters
  containerStyle?: ContainerStyle; // Default style for template
  children?: string[]; // Placeholder for child nodes
}

/**
 * Template parameter definition
 * Phase 5: Advanced Features
 */
export interface TemplateParameter {
  name: string; // Parameter name
  type: 'string' | 'number' | 'boolean' | 'color'; // Parameter type
  defaultValue?: string | number | boolean; // Default value
  description?: string; // Parameter description
}

/**
 * Container style preset definition
 * Phase 5: Advanced Features
 */
export interface ContainerPreset {
  id: string; // Preset identifier ('card', 'panel', 'group', etc.)
  label?: string; // Display name
  style: Partial<ContainerStyle>; // Style properties to apply
}

// LayoutAlgorithm is imported from constants.js
// See constants.ts for supported layout algorithms:
// layered, force, stress, radial, mrtree, circular

/**
 * Layout options that can be specified per container
 */
export interface ContainerLayoutOptions {
  algorithm?: LayoutAlgorithm;
  direction?: Direction;
  spacing?: number;
  // UML Activity Diagrams: Swimlane/partition orientation
  orientation?: 'horizontal' | 'vertical'; // Swimlane orientation (UML 2.5 activity partitions)
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
  /**
   * Optional label renderer that supports inline icons.
   * If not provided, shapes should render plain text labels.
   * Injected by renderer-svg package to enable icon syntax like "fa:fa-star Label"
   */
  renderLabel?: (
    label: string,
    x: number,
    y: number,
    style: {
      fontSize?: number;
      fontFamily?: string;
      fill?: string;
      textAnchor?: 'start' | 'middle' | 'end';
      dominantBaseline?: string;
    }
  ) => string;
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

/**
 * Escape XML special characters to prevent HTML injection
 */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Options for rendering multi-line SVG text
 */
export interface MultilineTextOptions {
  textAnchor?: 'start' | 'middle' | 'end';
  dominantBaseline?: string;
  fontFamily?: string;
  fontSize?: number;
  fill?: string;
  fontWeight?: string;
  fontStyle?: string;
  className?: string;
}

/**
 * Renders multi-line SVG text by splitting on \n and creating tspan elements.
 * Returns SVG markup for a <text> element with proper line breaks.
 *
 * @param text - The text to render (may contain \n for line breaks)
 * @param x - X coordinate
 * @param y - Y coordinate (baseline of first line)
 * @param options - Text styling options
 * @returns SVG <text> element with <tspan> children for each line
 */
export function renderMultilineText(
  text: string,
  x: number,
  y: number,
  options: MultilineTextOptions = {}
): string {
  const lines = text.split('\n');
  const lineHeight = (options.fontSize || 14) * 1.2; // 1.2 is standard line height multiplier

  // If only one line, render simple text element
  if (lines.length === 1) {
    const attrs = [
      `x="${x}"`,
      `y="${y}"`,
      options.textAnchor ? `text-anchor="${options.textAnchor}"` : '',
      options.dominantBaseline
        ? `dominant-baseline="${options.dominantBaseline}"`
        : '',
      options.fontFamily ? `font-family="${options.fontFamily}"` : '',
      options.fontSize ? `font-size="${options.fontSize}"` : '',
      options.fill ? `fill="${options.fill}"` : '',
      options.fontWeight ? `font-weight="${options.fontWeight}"` : '',
      options.fontStyle ? `font-style="${options.fontStyle}"` : '',
      options.className ? `class="${options.className}"` : '',
    ]
      .filter((a) => a)
      .join(' ');

    return `<text ${attrs}>${escapeXml(text)}</text>`;
  }

  // Multiple lines: use tspan elements
  // Adjust y coordinate based on dominant-baseline
  let startY = y;
  if (options.dominantBaseline === 'middle') {
    // Center the block of text vertically
    startY = y - ((lines.length - 1) * lineHeight) / 2;
  }

  const attrs = [
    options.textAnchor ? `text-anchor="${options.textAnchor}"` : '',
    options.fontFamily ? `font-family="${options.fontFamily}"` : '',
    options.fontSize ? `font-size="${options.fontSize}"` : '',
    options.fill ? `fill="${options.fill}"` : '',
    options.fontWeight ? `font-weight="${options.fontWeight}"` : '',
    options.fontStyle ? `font-style="${options.fontStyle}"` : '',
    options.className ? `class="${options.className}"` : '',
  ]
    .filter((a) => a)
    .join(' ');

  let svg = `<text ${attrs}>`;
  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight;
    svg += `<tspan x="${x}" y="${lineY}">${escapeXml(line)}</tspan>`;
  });
  svg += `</text>`;

  return svg;
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
  | DigitalProfile
  | BlockDiagramProfile
  | WardleyProfile
  | SequenceProfile
  | PneumaticProfile
  | HydraulicProfile
  | PIDProfile
  | TimelineProfile;

/**
 * Visual diagram profile (existing Runiq diagrams)
 * Supports flowcharts, architecture diagrams, etc.
 */
export interface DiagramProfile {
  type: 'diagram';
  name: string;
  direction?: Direction;
  routing?: EdgeRouting;
  theme?: string; // Color theme (professional, ocean, forest, etc.)
  styles?: Record<string, Style>;
  nodes: NodeAst[];
  edges: EdgeAst[];
  groups?: GroupAst[];
  containers?: ContainerDeclaration[];
  // Phase 5: Templates & Presets
  templates?: ContainerTemplate[];
  presets?: ContainerPreset[];
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

/**
 * Pneumatic circuit profile
 * For compressed air systems following ISO 1219-1 standard
 * Supports cylinders, valves, FRL units, gauges
 */
export interface PneumaticProfile {
  type: 'pneumatic';
  name: string;
  nets: NetAst[]; // Pneumatic lines/connections
  parts: PartAst[]; // Components (cylinders, valves, etc.)
  pressure?: PressureSpec; // Operating pressure specification
  flowRate?: FlowRateSpec; // Flow rate specification
}

/**
 * Hydraulic circuit profile
 * For hydraulic power systems following ISO 1219-2 standard
 * Supports pumps, motors, cylinders, valves, reservoirs
 */
export interface HydraulicProfile {
  type: 'hydraulic';
  name: string;
  nets: NetAst[]; // Hydraulic lines/connections
  parts: PartAst[]; // Components (pumps, cylinders, etc.)
  pressure?: PressureSpec; // Operating pressure specification
  flowRate?: FlowRateSpec; // Flow rate specification
  fluid?: FluidSpec; // Hydraulic fluid specification
}

/**
 * P&ID (Piping and Instrumentation Diagram) profile
 * For process engineering following ISA-5.1 standard
 * Supports equipment, instruments, process lines, control loops
 */
export interface PIDProfile {
  type: 'pid';
  name: string;
  equipment: PIDEquipment[]; // Process equipment (tanks, pumps, valves, etc.)
  instruments: PIDInstrument[]; // Measurement and control instruments
  lines: PIDLine[]; // Process, utility, signal, and electrical lines
  loops: PIDLoop[]; // Control loops
  processSpecs?: PIDProcessSpec; // Process specifications (fluid, pressure, temperature, etc.)
}

/**
 * P&ID Equipment (vessels, pumps, valves, heat exchangers, etc.)
 */
export interface PIDEquipment {
  tag: string; // ISA-5.1 tag (e.g., "TK-101", "P-205", "V-301")
  type: string; // Equipment type (e.g., "storageTank", "pumpCentrifugal", "valveGate")
  properties?: Record<string, unknown>; // Equipment-specific properties (volume, flowRate, etc.)
}

/**
 * P&ID Instrument (transmitters, controllers, indicators, etc.)
 */
export interface PIDInstrument {
  tag: string; // ISA-5.1 tag (e.g., "FT-101", "TIC-205", "PI-301")
  type: string; // Instrument type (e.g., "flowTransmitter", "temperatureController")
  properties?: Record<string, unknown>; // Instrument-specific properties (range, location, etc.)
}

/**
 * P&ID Line (process, utility, signal, electrical, etc.)
 */
export interface PIDLine {
  type: string; // Line type (e.g., "process", "utility", "signal", "electrical")
  from: PIDConnectionPoint; // Source connection point
  to: PIDConnectionPoint; // Destination connection point
  properties?: Record<string, unknown>; // Line-specific properties (size, schedule, material, etc.)
}

/**
 * P&ID Connection Point (equipment tag with optional port)
 */
export interface PIDConnectionPoint {
  equipment: string; // Equipment tag (e.g., "TK-101", "FEED-1")
  port?: string; // Optional port name (e.g., "inlet", "outlet", "discharge")
}

/**
 * P&ID Control Loop
 */
export interface PIDLoop {
  id: number; // Loop number (e.g., 101, 205)
  controlledVariable: string; // Variable being controlled (e.g., "flow", "temperature")
  setpoint?: number; // Setpoint value
  unit?: string; // Setpoint unit
  controller?: string; // Controller tag
  mode?: string; // Control mode (e.g., "auto", "manual", "cascade")
}

/**
 * P&ID Process Specifications
 */
export interface PIDProcessSpec {
  fluid?: string; // Process fluid name
  pressure?: number; // Operating pressure
  pressureUnit?: string; // Pressure unit
  temperature?: number; // Operating temperature
  temperatureUnit?: string; // Temperature unit
  flowRate?: number; // Flow rate
  flowRateUnit?: string; // Flow rate unit
}

// ============================================================================
// Pneumatic/Hydraulic Profile Types
// ============================================================================

/**
 * Pressure specification for pneumatic/hydraulic systems
 */
export interface PressureSpec {
  value: number; // Pressure value
  unit: 'bar' | 'psi' | 'kPa' | 'MPa'; // Pressure unit
  type?: 'operating' | 'max' | 'min' | 'rated'; // Pressure type
}

/**
 * Flow rate specification for pneumatic/hydraulic systems
 */
export interface FlowRateSpec {
  value: number; // Flow rate value
  unit: 'L/min' | 'L/s' | 'CFM' | 'GPM' | 'm³/h'; // Flow rate unit (pneumatic uses L/min or CFM, hydraulic uses L/min or GPM)
}

/**
 * Hydraulic fluid specification
 */
export interface FluidSpec {
  type:
    | 'mineral'
    | 'synthetic'
    | 'biodegradable'
    | 'water-glycol'
    | 'phosphate-ester'; // Fluid type
  viscosity?: string; // Viscosity grade (e.g., "ISO VG 46", "10W-30")
  temperature?: TemperatureRange; // Operating temperature range
}

/**
 * Temperature range specification
 */
export interface TemperatureRange {
  min: number; // Minimum temperature
  max: number; // Maximum temperature
  unit: 'C' | 'F' | 'K'; // Temperature unit
}

// ============================================================================
// Schematic Profile Types
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

// ============================================================================
// Wardley Map Profile Types
// ============================================================================

/**
 * Wardley Map profile for strategic mapping
 * Maps components on two axes:
 * - Evolution (x-axis): genesis → custom → product → commodity (0 to 1)
 * - Value Chain (y-axis): visible/user needs → invisible/infrastructure (0 to 1, rendered top to bottom)
 */
export interface WardleyProfile {
  type: 'wardley';
  astVersion: string;
  name: string;
  components: WardleyComponent[];
  dependencies: WardleyDependency[];
  anchors?: WardleyAnchor[];
  evolutions?: WardleyEvolution[];
}

/**
 * Component in a Wardley Map
 * Positioned manually by evolution and value chain coordinates
 */
export interface WardleyComponent {
  name: string; // Component name (e.g., "CRM System", "Customer Data")
  evolution: number; // Evolution stage: 0 (genesis) to 1 (commodity)
  value: number; // Value chain position: 0 (infrastructure) to 1 (user visible)
  label?: string; // Optional label override
  inertia?: boolean; // Whether component has inertia (resistance to change)
}

/**
 * Value chain dependency between components
 */
export interface WardleyDependency {
  from: string; // Source component name
  to: string; // Target component name
}

/**
 * Anchor point (user need) at the top of the value chain
 */
export interface WardleyAnchor {
  name: string; // Anchor name (e.g., "User Need", "Business Goal")
  value: number; // Value chain position (typically 0.9-1.0)
  evolution?: number; // Optional evolution position (defaults to middle)
}

/**
 * Evolution movement indicator
 * Shows future/planned evolution of a component
 */
export interface WardleyEvolution {
  component: string; // Component name
  toEvolution: number; // Target evolution stage
}

// ============================================================================
// Sequence Diagram Profile Types
// ============================================================================

/**
 * Sequence diagram profile for showing interactions over time
 * Depicts message exchanges between participants/actors in chronological order
 */
export interface SequenceProfile {
  type: 'sequence';
  astVersion: string;
  title: string;
  participants: SequenceParticipant[];
  messages: SequenceMessage[];
  notes?: SequenceNote[];
  fragments?: SequenceFragment[];
  durationConstraints?: SequenceDurationConstraint[]; // UML 2.5 duration constraints spanning messages
}

/**
 * Participant in a sequence diagram (actor, system, service)
 */
export interface SequenceParticipant {
  id: string; // Unique identifier (e.g., "user", "api", "db")
  name: string; // Display name (e.g., "User", "API Server", "Database")
  type?:
    | 'actor'
    | 'entity'
    | 'boundary'
    | 'control'
    | 'database'
    | 'continuation'; // Participant type
}

/**
 * Message exchanged between participants
 */
export interface SequenceMessage {
  from: string; // Source participant ID (use 'lost' or 'found' for lost/found messages)
  to: string; // Target participant ID (use 'lost' or 'found' for lost/found messages)
  label: string; // Message description
  type?: 'sync' | 'async' | 'return' | 'create' | 'destroy'; // Message type
  activate?: boolean; // Whether to show activation box on target
  guard?: string; // Guard condition (e.g., "[x > 0]")
  timing?: string; // Timing constraint (e.g., "{t < 5s}")
  stateInvariant?: string; // State invariant - condition that must be true at this point (e.g., "user.isAuthenticated" or "balance >= 0")
}

/**
 * Note/annotation on the diagram
 */
export interface SequenceNote {
  text: string; // Note content
  position: 'left' | 'right' | 'over'; // Position relative to participant(s)
  participants: string[]; // Participant ID(s) the note refers to
}

/**
 * Combined fragment (loop, alt, opt, etc.) or interaction use (ref)
 */
export interface SequenceFragment {
  type: 'loop' | 'alt' | 'opt' | 'par' | 'critical' | 'break' | 'ref'; // Fragment type
  label?: string; // Condition or description
  startAfterMessage: number; // Message index where fragment starts
  endAfterMessage: number; // Message index where fragment ends
  alternatives?: SequenceFragmentAlternative[]; // For alt fragments
  gates?: string[]; // Gate names - connection points at fragment boundaries (UML 2.5)
  reference?: string; // For 'ref' fragments: name of the referenced sequence diagram (UML 2.5 interaction use)
}

/**
 * Alternative path in an alt fragment
 */
export interface SequenceFragmentAlternative {
  label: string; // Condition label (e.g., "[success]", "[error]")
  startAfterMessage: number; // Message index where alternative starts
  endAfterMessage: number; // Message index where alternative ends
}

/**
 * Duration constraint spanning multiple messages (UML 2.5)
 * Specifies timing requirements for a sequence of interactions
 */
export interface SequenceDurationConstraint {
  fromMessage: number; // Starting message index (0-based)
  toMessage: number; // Ending message index (0-based)
  constraint: string; // Constraint expression (e.g., "< 100ms", "{d..2d}")
}

// ============================================================================
// Timeline Profile Types
// ============================================================================

/**
 * Timeline diagram profile for showing events in chronological order
 * Useful for project timelines, historical events, roadmaps, milestones
 */
export interface TimelineProfile {
  type: 'timeline';
  astVersion: string;
  title: string;
  orientation?: 'horizontal' | 'vertical'; // Default: horizontal
  events: TimelineEvent[];
  periods?: TimelinePeriod[]; // Optional time periods/eras
}

/**
 * Event on a timeline
 */
export interface TimelineEvent {
  id: string; // Unique identifier
  date: string; // Date/time (ISO 8601 format or relative like "Q1 2024")
  label: string; // Event title
  description?: string; // Detailed description
  icon?: string; // Optional icon name
  fillColor?: string; // Optional color for event marker
  position?: 'top' | 'bottom' | 'left' | 'right'; // Label position (default: alternating)
}

/**
 * Time period/era on a timeline (background shading)
 */
export interface TimelinePeriod {
  id: string;
  startDate: string;
  endDate: string;
  label: string;
  fillColor?: string; // Background color for period shading
  opacity?: number; // Default: 0.1
}
