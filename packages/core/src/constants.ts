/**
 * Central constants and enums for Runiq
 * Single source of truth for all magic strings and values
 */

/**
 * Profile type discriminator values
 * Used to identify which profile type is being used
 */
export enum ProfileType {
  DIAGRAM = 'diagram',
  SEQUENCE = 'sequence',
  TIMELINE = 'timeline',
  ELECTRICAL = 'electrical',
  DIGITAL = 'digital',
  BLOCK_DIAGRAM = 'blockDiagram',
  WARDLEY = 'wardley',
  PNEUMATIC = 'pneumatic',
  HYDRAULIC = 'hydraulic',
  PID = 'pid',
  GLYPHSET = 'glyphset',
}

/**
 * Diagram layout direction
 */
export enum Direction {
  LEFT_TO_RIGHT = 'LR',
  RIGHT_TO_LEFT = 'RL',
  TOP_TO_BOTTOM = 'TB',
  BOTTOM_TO_TOP = 'BT',
}

/**
 * Edge routing algorithms
 */
export enum EdgeRouting {
  ORTHOGONAL = 'orthogonal',
  POLYLINE = 'polyline',
  SPLINES = 'splines',
  STRAIGHT = 'straight',
}

/**
 * Layout algorithms supported by ELK
 */
export enum LayoutAlgorithm {
  LAYERED = 'layered',
  FORCE = 'force',
  STRESS = 'stress',
  RADIAL = 'radial',
  MRTREE = 'mrtree',
  CIRCULAR = 'circular',
}

/**
 * Arrow head types for edges
 */
export enum ArrowType {
  STANDARD = 'standard',
  HOLLOW = 'hollow',
  OPEN = 'open',
  NONE = 'none',
}

/**
 * Line styles for edges
 */
export enum LineStyle {
  SOLID = 'solid',
  DASHED = 'dashed',
  DOTTED = 'dotted',
  DOUBLE = 'double',
}

/**
 * Anchor point positions on shapes
 */
export enum AnchorPoint {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west',
  NORTHEAST = 'northeast',
  NORTHWEST = 'northwest',
  SOUTHEAST = 'southeast',
  SOUTHWEST = 'southwest',
}

/**
 * GlyphSet categories
 */
export enum GlyphSetCategory {
  HIERARCHY = 'hierarchy',
  LIST = 'list',
  PROCESS = 'process',
  RELATIONSHIP = 'relationship',
  COMPARISON = 'comparison',
  VISUALIZATION = 'visualization',
}

/**
 * Default values for shape rendering
 */
export const ShapeDefaults = {
  PADDING: 10,
  PADDING_LARGE: 20,
  PADDING_SMALL: 5,
  STROKE_WIDTH: 1.5,
  FONT_SIZE: 14,
  ICON_SIZE: 24,
  LINE_HEIGHT_MULTIPLIER: 1.2,
  MIN_WIDTH: 40,
  MIN_HEIGHT: 30,
} as const;

/**
 * Default values for layout spacing
 */
export const LayoutDefaults = {
  NODE_SPACING: 50,
  EDGE_SPACING: 40,
  CONTAINER_PADDING: 30,
  MIN_NODE_WIDTH: 80,
  MIN_NODE_HEIGHT: 40,
  LAYER_SPACING: 60,
} as const;

/**
 * Default values for rendering
 */
export const RenderDefaults = {
  ARROW_SIZE: 10,
  EDGE_LABEL_PADDING: 5,
  CONTAINER_BORDER_WIDTH: 2,
  SHADOW_OFFSET: 4,
  SHADOW_BLUR: 8,
} as const;

/**
 * Common color values
 */
export const Colors = {
  DEFAULT_FILL: '#e0e0e0',
  DEFAULT_STROKE: '#000000',
  DEFAULT_TEXT: '#000000',
  TRANSPARENT: 'transparent',
} as const;
