export {
  calculateNestingDepth,
  detectCircularReferences,
  findContainerForNode,
  getAllDescendants,
  getContainerMembership,
  validateContainer,
  validateDiagram as validateContainers,
  validateNestingDepth,
  type ValidationResult,
} from './container-validation.js';

// Export enums and constants (non-conflicting with types.ts string literal types)
export {
  AnchorPoint,
  ArrowType,
  Colors,
  Direction,
  EdgeRouting,
  GlyphSetCategory,
  LayoutAlgorithm,
  LayoutDefaults,
  LineStyle,
  ProfileType,
  RenderDefaults,
  ShapeDefaults,
} from './constants.js';
export * from './registries.js';
export * from './shape-aliases.js';
export * from './shapes/graph-metrics.js';
export * from './shapes/index.js';
export * from './text-measurement/index.js';
export * from './themes/index.js';
export * from './types/index.js';
export * from './validation/schema.js';
export {
  DIAGRAM_TYPE_CONSTRAINTS,
  listDiagramTypes,
  validateDiagramType,
  type DiagramType,
  type DiagramTypeConstraints,
  type DiagramValidationError,
  type DiagramValidationResult,
} from './validation/validation.js';
