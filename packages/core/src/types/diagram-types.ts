/**
 * Core diagram AST type definitions for Runiq diagrams
 * DiagramAst, NodeAst, EdgeAst, GroupAst, and related types
 */

import type {
  ArrowType,
  Direction,
  EdgeRouting,
  LineStyle,
} from '../constants.js';
import type {
  ContainerDeclaration,
  ContainerPreset,
  ContainerTemplate,
} from './container-types.js';

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
        values?: import('./data-types.js').DataArray;
        points?: import('./data-types.js').DataPoint[];
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

export interface Style {
  fill?: string;
  fillColor?: string; // Alias for fill
  stroke?: string;
  strokeColor?: string; // Alias for stroke
  strokeWidth?: number;
  strokeDasharray?: string; // SVG stroke-dasharray for dashed/dotted borders
  font?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign?: string;
  rx?: number;
  ry?: number;
  padding?: number;
  opacity?: number;
  textColor?: string; // Alternative to 'fill' for text-specific color
  color?: string; // Generic color property
  // Domain-specific properties
  affected?: boolean; // Pedigree charts - individual affected by condition
  carrier?: boolean; // Pedigree charts - carrier of genetic trait
  deceased?: boolean; // Pedigree charts - deceased individual
  tagFill?: string; // Tagged shapes - color for tag section
  // Extensions for truly custom properties
  extensions?: Record<string, string | number | boolean>;
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
