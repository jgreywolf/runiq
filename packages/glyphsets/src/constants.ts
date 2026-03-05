/**
 * Unique identifiers for all glyphset implementations
 * This is the single source of truth for glyphset type identifiers across the system
 *
 * Moved from @runiq/parser-dsl to centralize glyphset concerns
 */
export const GlyphsetIdList = {
  // Process
  basicProcess: 'basicProcess',
  cycle: 'cycle',
  blockCycle: 'blockCycle',
  orbitCycle: 'orbitCycle',
  stepProcess: 'stepProcess',
  detailedProcess: 'detailedProcess',
  alternatingProcess: 'alternatingProcess',
  continuousBlockProcess: 'continuousBlockProcess',
  verticalProcess: 'verticalProcess',
  upwardArrowProcess: 'upwardArrowProcess',
  bendingProcess: 'bendingProcess',
  equationProcess: 'equationProcess',
  repeatingCycle: 'repeatingCycle',
  continuousCycle: 'continuousCycle',
  segmentedCycle: 'segmentedCycle',
  gearCycle: 'gearCycle',
  pictureProcess: 'pictureProcess',
  phasedProcess: 'phasedProcess',
  radialCycle: 'radialCycle',
  spiralCycle: 'spiralCycle',

  // Hierarchy
  pyramid: 'pyramid',
  invertedPyramid: 'invertedPyramid',
  trapezoidPyramid: 'trapezoidPyramid',
  segmentedPyramid: 'segmentedPyramid',
  pyramidList: 'pyramidList',
  orgChart: 'orgChart',
  labeledHierarchy: 'labeledHierarchy',
  horizontalOrgChart: 'horizontalOrgChart',
  circleHierarchy: 'circleHierarchy',
  titleBlock: 'titleBlock',
  tableHierarchy: 'tableHierarchy',
  teamHierarchy: 'teamHierarchy',
  matrixOrgChart: 'matrixOrgChart',

  // Comparison
  matrix: 'matrix',
  segmentedMatrix: 'segmentedMatrix',
  titledMatrix: 'titledMatrix',
  matrix2x2: 'matrix2x2',
  matrix3x3: 'matrix3x3',
  venn: 'venn',
  linearVenn: 'linearVenn',
  steppedVenn: 'steppedVenn',
  stackedVenn: 'stackedVenn',

  // Relationship
  target: 'target',
  balance: 'balance',
  opposing: 'opposing',
  converging: 'converging',
  diverging: 'diverging',
  cluster: 'cluster',
  puzzle: 'puzzle',
  plusMinus: 'plusMinus',
  counterBalance: 'counterBalance',
  equation: 'equation',
  interconnected: 'interconnected',
  hub: 'hub',

  // Visualization
  funnel: 'funnel',
  pictureGrid: 'pictureGrid',
  pictureCallout: 'pictureCallout',
  events: 'events',

  // List
  basicList: 'basicList',
  horizontalList: 'horizontalList',
  chevronList: 'chevronList',
  numberedChevronList: 'numberedChevronList',
  nestedList: 'nestedList',
  columnList: 'columnList',
  increasingList: 'increasingList',
  alternatingList: 'alternatingList',
  pictureList: 'pictureList',
  pictureBlocks: 'pictureBlocks',
  framedPicture: 'framedPicture',

  // Special
  groupedProcess: 'groupedProcess',
} as const;

/**
 * Type-safe glyphset identifier - derived from GLYPHSET_IDS values
 */
export type GlyphsetId = (typeof GlyphsetIdList)[keyof typeof GlyphsetIdList];

/**
 * Type guard to check if a string is a valid glyphset ID
 */
export function isGlyphsetId(value: string): GlyphsetId | null {
  if (Object.values(GlyphsetIdList).includes(value as GlyphsetId)) {
    return value as GlyphsetId;
  }
  return null;
}

/**
 * Get all glyphset IDs as an array
 */
export function getAllGlyphsetIds(): GlyphsetId[] {
  return Object.values(GlyphsetIdList);
}

export type NestedGlyphsetId = (typeof NestedStructureGlyphsets)[number];
export type PictureGlyphsetId = (typeof PictureGlyphsets)[number];

export function getGlyphsetStructureType(
  glyphsetId: GlyphsetId
): 'flat' | 'nested' {
  if (NestedStructureGlyphsets.includes(glyphsetId as NestedGlyphsetId)) {
    return 'nested';
  }
  return 'flat';
}

export function isNestedGlyphset(glyphsetId: GlyphsetId): boolean {
  return NestedStructureGlyphsets.includes(glyphsetId as NestedGlyphsetId);
}

export function isPictureGlyphset(glyphsetId: GlyphsetId): boolean {
  return PictureGlyphsets.includes(glyphsetId as PictureGlyphsetId);
}

export const PictureGlyphsets = [
  GlyphsetIdList.pictureProcess,
  GlyphsetIdList.pictureList,
  GlyphsetIdList.pictureBlocks,
  GlyphsetIdList.framedPicture,
  GlyphsetIdList.pictureGrid,
  GlyphsetIdList.pictureCallout,
] as const;

export const NestedStructureGlyphsets = [
  GlyphsetIdList.orgChart, // person -> person
  GlyphsetIdList.horizontalOrgChart, // person -> person
  GlyphsetIdList.tableHierarchy, // person -> person
  GlyphsetIdList.matrixOrgChart, // person -> person
  GlyphsetIdList.labeledHierarchy, // root -> child, child -> child
  GlyphsetIdList.segmentedPyramid, // level -> item
  GlyphsetIdList.nestedList, // level -> item
  GlyphsetIdList.pyramidList, // level -> item
  GlyphsetIdList.groupedProcess,
] as const;

// GlyphsetIds.titleBlock,
// GlyphsetIds.hub,
