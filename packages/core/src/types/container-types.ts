/**
 * Container type definitions for hierarchical grouping
 * Supports C4 diagrams, BPMN processes, architecture boundaries
 */

import type { Direction, LayoutAlgorithm, LineStyle } from '../constants.js';

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
