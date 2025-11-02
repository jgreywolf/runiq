export type Direction = 'LR' | 'RL' | 'TB' | 'BT';
export type EdgeRouting = 'orthogonal' | 'polyline' | 'splines' | 'straight';

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
  routing?: EdgeRouting;
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
  lineStyle?: 'solid' | 'dashed' | 'dotted' | 'double'; // Line appearance (double for consanguineous marriages)
  arrowType?: 'standard' | 'hollow' | 'open' | 'none'; // Arrow head style
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
  collapseAnimationEasing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'; // Easing function
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
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderWidth?: number;
  backgroundColor?: string;
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
  | HydraulicProfile;

/**
 * Visual diagram profile (existing Runiq diagrams)
 * Supports flowcharts, architecture diagrams, etc.
 */
export interface DiagramProfile {
  type: 'diagram';
  name: string;
  direction?: Direction;
  routing?: EdgeRouting;
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
 * Combined fragment (loop, alt, opt, etc.)
 */
export interface SequenceFragment {
  type: 'loop' | 'alt' | 'opt' | 'par' | 'critical' | 'break'; // Fragment type
  label?: string; // Condition or description
  startAfterMessage: number; // Message index where fragment starts
  endAfterMessage: number; // Message index where fragment ends
  alternatives?: SequenceFragmentAlternative[]; // For alt fragments
}

/**
 * Alternative path in an alt fragment
 */
export interface SequenceFragmentAlternative {
  label: string; // Condition label (e.g., "[success]", "[error]")
  startAfterMessage: number; // Message index where alternative starts
  endAfterMessage: number; // Message index where alternative ends
}
