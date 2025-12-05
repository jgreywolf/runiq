/**
 * Constants and type definitions for glyphset conversion
 */

// Define which keywords each glyphset type uses
export const GLYPHSET_KEYWORDS = {
	// Process glyphsets - use 'item' or 'step'
	basicProcess: ['item', 'step'],
	cycle: ['item', 'step'],
	blockCycle: ['item', 'step'],
	orbitCycle: ['item', 'step'],
	stepProcess: ['item', 'step'],
	detailedProcess: ['item', 'step'],
	alternatingProcess: ['item', 'step'],
	continuousBlockProcess: ['item', 'step'],
	verticalProcess: ['item', 'step'],
	upwardArrowProcess: ['item', 'step'],
	bendingProcess: ['item', 'step'],
	equationProcess: ['item', 'step'],
	repeatingCycle: ['item', 'step'],
	continuousCycle: ['item', 'step'],
	segmentedCycle: ['item', 'step'],
	gearCycle: ['item', 'step'],
	pictureProcess: ['image'], // Special: uses image with label

	// Hierarchy glyphsets - use 'level' or 'person' or 'node'
	pyramid: ['level'],
	invertedPyramid: ['level'],
	trapezoidPyramid: ['level'],
	segmentedPyramid: ['level', 'item'], // Nested structure: level contains items
	orgChart: ['person'],
	hierarchyTree: ['person', 'node'],
	hierarchyCircle: ['node'],
	labeledHierarchy: ['level'],
	horizontalOrgChart: ['person'],
	circleHierarchy: ['root', 'child'], // root + child structure like labeledHierarchy but without edge labels
	titleBlock: ['level'],
	tableHierarchy: ['level'],

	// Comparison glyphsets - use 'item' (quadrant supported for backwards compatibility)
	matrix: ['item', 'quadrant'], // Generic matrix
	segmentedMatrix: ['item', 'quadrant'],
	titledMatrix: ['item', 'quadrant'],
	matrix2x2: ['item', 'quadrant'],
	matrix3x3: ['item', 'quadrant'],
	venn2: ['circle', 'item'],
	venn3: ['circle', 'item'],
	linearVenn: ['circle', 'item'],
	steppedVenn: ['circle', 'step'],
	stackedVenn: ['circle', 'item'],

	// Relationship glyphsets - use specific keywords
	target: ['item'], // concentric rings
	balance: ['side'], // two sides only
	opposing: ['side'], // two sides only
	converging: ['input'], // multiple inputs to one
	diverging: ['output'], // one to multiple outputs
	cluster: ['item', 'group'],
	puzzle: ['item'],
	plusMinus: ['item'],
	counterbalance: ['side'], // two sides
	equation: ['input', 'operator', 'result'], // special structure
	interconnected: ['node'],
	hub: ['spoke', 'center'],

	// Visualization glyphsets
	funnel: ['level', 'stage'],
	pictureGrid: ['image', 'item'],
	pictureCallout: ['image', 'callout'],
	events: ['event'],

	// List glyphsets - use 'item'
	basicList: ['item'],
	horizontalList: ['item'],
	chevronList: ['item', 'step'],
	numberedChevronList: ['item', 'step'],
	nestedList: ['item'],
	columnList: ['item'],
	increasingList: ['item'],
	alternatingList: ['item'],
	pictureList: ['item', 'image'],
	pictureBlocks: ['item', 'image'],
	framedPicture: ['item', 'image'],

	// Special structure glyphsets (not easily convertible)
	groupedProcess: ['group', 'item', 'mergePoint']
	// Note: segmentedPyramid is in hierarchy section above
} as const;

export type GlyphsetType = keyof typeof GLYPHSET_KEYWORDS;

// Define compatibility groups
export const COMPATIBILITY_GROUPS = {
	process: [
		'basicProcess',
		'cycle',
		'blockCycle',
		'orbitCycle',
		'stepProcess',
		'detailedProcess',
		'alternatingProcess',
		'continuousBlockProcess',
		'verticalProcess',
		'upwardArrowProcess',
		'bendingProcess',
		'equationProcess',
		'repeatingCycle',
		'continuousCycle',
		'segmentedCycle',
		'gearCycle'
	],
	hierarchy: [
		'pyramid',
		'invertedPyramid',
		'trapezoidPyramid',
		'orgChart',
		'hierarchyTree',
		'hierarchyCircle',
		'labeledHierarchy',
		'horizontalOrgChart',
		'circleHierarchy',
		'titleBlock',
		'tableHierarchy'
	],
	comparison: [
		'matrix2x2',
		'matrix3x3',
		'venn2',
		'venn3',
		'linearVenn',
		'steppedVenn',
		'stackedVenn'
	],
	list: [
		'basicList',
		'horizontalList',
		'chevronList',
		'numberedChevronList',
		'nestedList',
		'columnList',
		'increasingList',
		'alternatingList',
		'pictureList',
		'pictureBlocks',
		'framedPicture'
	],
	balance: ['balance', 'opposing', 'counterbalance'],
	flow: ['converging', 'diverging', 'hub'],
	network: ['interconnected', 'cluster'],
	target: ['target', 'funnel']
} as const;

/**
 * Glyphsets with special structures that cannot be easily converted
 */
export const STRUCTURAL_GLYPHSETS = [
	'equation', // input + operator = output
	'hub', // center + spokes
	'groupedProcess', // nested groups + mergePoint
	'labeledHierarchy', // root + child with edge labels
	'circleHierarchy', // root + child without edge labels
	'tableHierarchy' // level with optional category tags
] as const;

/**
 * Keyword mapping for conversion between glyphset types
 */
export const KEYWORD_CONVERSIONS: Record<string, string> = {
	// Map to 'item' (most common)
	step: 'item',
	level: 'item',
	stage: 'item',
	person: 'item',
	circle: 'item',
	quadrant: 'item', // Legacy: old matrix types used 'quadrant'
	image: 'item',
	event: 'item',
	spoke: 'item',
	group: 'item',

	// Special cases that need attention
	side: 'item', // Warning: balance needs exactly 2
	input: 'item', // Warning: structural
	output: 'item', // Warning: structural
	center: 'item', // Warning: hub needs center
	node: 'item',
	callout: 'item',
	operator: 'item', // Warning: equation structure
	result: 'item' // Warning: equation structure
};
