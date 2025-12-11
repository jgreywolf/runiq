/**
 * Profile-based type definitions for multi-domain support
 * Electrical, Digital, Block Diagram, Wardley, Sequence, Timeline, and other profiles
 */

import type { Direction, EdgeRouting } from '../constants.js';
import type {
  ContainerDeclaration,
  ContainerPreset,
  ContainerTemplate,
} from './container-types.js';
import type { EdgeAst, GroupAst, NodeAst, Style } from './diagram-types.js';

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
 * Visual diagram profile (the default/primary profile)
 * Supports general-purpose diagramming with shapes, edges, groups
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
