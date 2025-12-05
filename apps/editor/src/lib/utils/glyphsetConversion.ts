/**
 * Glyphset conversion utilities
 * Handles keyword mapping and compatibility checking when switching between glyphset types
 */

import type { ConversionResult } from './glyphsetConversion/types';
import {
	parseGlyphsetDeclaration,
	replaceGlyphsetType,
	createParseError
} from './glyphsetConversion/parsing';
import { expandToGroupedProcess, flattenGroupedProcess } from './glyphsetConversion/groupedProcess';
import {
	expandToSegmentedPyramid,
	flattenSegmentedPyramid
} from './glyphsetConversion/segmentedPyramid';
import {
	expandToCircleHierarchy,
	flattenCircleHierarchy
} from './glyphsetConversion/circleHierarchy';
import { expandToMatrix, flattenMatrix } from './glyphsetConversion/matrix';
import { flattenLabeledHierarchy, flattenTableHierarchy } from './glyphsetConversion/hierarchy';

// Re-export types from new modules
export type { ConversionResult, ParsedGlyphset } from './glyphsetConversion/types';

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
 * Get compatible alternative glyphsets for conversion
 */
export function getCompatibleAlternatives(fromType: string, toType: string): string[] {
	const alternatives: string[] = [];

	// If trying to convert FROM groupedProcess, suggest flat process types
	if (fromType === 'groupedProcess') {
		alternatives.push('basicProcess', 'stepProcess', 'verticalProcess', 'basicList');
	}

	// If trying to convert TO groupedProcess, suggest other grouped/parallel types
	if (toType === 'groupedProcess') {
		alternatives.push('basicProcess', 'stepProcess', 'columnList', 'nestedList');
	}

	// If trying to convert FROM segmentedPyramid, suggest other hierarchy types
	if (fromType === 'segmentedPyramid') {
		alternatives.push('pyramid', 'invertedPyramid', 'pyramidList', 'orgChart', 'basicList');
	}

	// If trying to convert TO segmentedPyramid, suggest other segmented types
	if (toType === 'segmentedPyramid') {
		alternatives.push('pyramid', 'pyramidList', 'labeledHierarchy');
	}

	// If trying to convert FROM matrix types, suggest comparison types
	if (['segmentedMatrix', 'titledMatrix', 'matrix2x2', 'matrix3x3'].includes(fromType)) {
		alternatives.push('matrix', 'venn', 'basicList', 'grid');
	}

	// If trying to convert TO matrix types, suggest comparison types
	if (['segmentedMatrix', 'titledMatrix', 'matrix2x2', 'matrix3x3'].includes(toType)) {
		alternatives.push('matrix', 'venn', 'grid');
	}

	// If trying to convert FROM equation, suggest comparison types
	if (fromType === 'equation') {
		alternatives.push('balance', 'opposing', 'basicList');
	}

	// If trying to convert FROM hub, suggest radial/network types
	if (fromType === 'hub') {
		alternatives.push('target', 'interconnected', 'cluster', 'basicList');
	}

	// If trying to convert TO hub, suggest network types
	if (toType === 'hub') {
		alternatives.push('interconnected', 'cluster', 'target');
	}

	// If trying to convert FROM labeledHierarchy, suggest hierarchy types
	if (fromType === 'labeledHierarchy') {
		alternatives.push('orgChart', 'hierarchyTree', 'basicList', 'tableHierarchy');
	}

	// If trying to convert FROM tableHierarchy, suggest hierarchy types
	if (fromType === 'tableHierarchy') {
		alternatives.push('labeledHierarchy', 'pyramid', 'basicList');
	}

	// Remove duplicates and the target type
	return [...new Set(alternatives)].filter((alt) => alt !== toType);
}

/**
 * Flatten a hub glyphset by extracting center and spoke items
 * Converts center + spokes structure into a flat list
 */
export function flattenHub(code: string, targetGlyphsetType: string): ConversionResult {
	// Use shared parsing utilities
	const parsed = parseGlyphsetDeclaration(code);
	if (!parsed) {
		return createParseError(code);
	}

	const { glyphsetLineIndex, lines } = parsed;
	const newLines = replaceGlyphsetType(lines, glyphsetLineIndex, targetGlyphsetType);
	const warnings: string[] = [];
	const errors: string[] = [];

	const targetKeyword = getPrimaryKeyword(targetGlyphsetType);
	let imageCounter = 11; // For pictureProcess conversions

	// Process remaining lines
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Skip empty lines
		if (!trimmed) {
			newLines.push(line);
			continue;
		}

		// Handle center and spoke keywords
		if (trimmed.match(/^(center|spoke)\s+"[^"]+"/)) {
			const match = line.match(/^(\s*)(center|spoke)(\s+"[^"]+")/);
			if (match) {
				// Special handling for pictureProcess
				if (targetGlyphsetType === 'pictureProcess') {
					const labelMatch = match[3].match(/\s+"([^"]+)"/);
					if (labelMatch) {
						newLines.push(
							`  image "https://i.pravatar.cc/200?img=${imageCounter}" label "${labelMatch[1]}"`
						);
						imageCounter++;
					}
				} else {
					// Convert to target keyword
					newLines.push(`  ${targetKeyword}${match[3]}`);
				}
				continue;
			}
		}

		// Keep theme, direction, and other parameters
		if (
			trimmed.match(
				/^(theme|direction|columns|shape|showValues|showPercentages|layout|orientation|bidirectional)\s/
			)
		) {
			newLines.push(line);
			continue;
		}

		// Keep comments
		if (trimmed.startsWith('//')) {
			newLines.push(line);
			continue;
		}

		// Keep closing brace
		if (trimmed === '}') {
			newLines.push(line);
			continue;
		}

		// Keep other lines
		newLines.push(line);
	}

	warnings.push('Hub structure (center + spokes) has been flattened into a simple list');

	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}

/**
 * Expand a flat list glyphset to hub by designating first item as center
 * Converts flat structure into center + spoke structure
 */
export function expandToHub(code: string): ConversionResult {
	// Use shared parsing utilities
	const parsed = parseGlyphsetDeclaration(code);
	if (!parsed) {
		return createParseError(code);
	}

	const { glyphsetLineIndex, lines } = parsed;
	const newLines = replaceGlyphsetType(lines, glyphsetLineIndex, 'hub');
	const warnings: string[] = [];
	const errors: string[] = [];

	let hasItems = false;
	let isFirstItem = true;
	const itemLines: string[] = [];

	// Process remaining lines to collect items
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		if (!trimmed) {
			continue;
		}

		// Keep theme and other parameters
		if (
			trimmed.match(
				/^(theme|direction|columns|shape|showValues|showPercentages|layout|orientation)\s/
			)
		) {
			newLines.push(line);
			continue;
		}

		// Keep comments
		if (trimmed.startsWith('//')) {
			newLines.push(line);
			continue;
		}

		// Handle pictureProcess format
		if (trimmed.match(/^image\s+"[^"]+"\s+label\s+"[^"]+"/)) {
			hasItems = true;
			const labelMatch = line.match(/^\s*image\s+"[^"]+"\s+label\s+"([^"]+)"/);
			if (labelMatch) {
				if (isFirstItem) {
					newLines.push(`  center "${labelMatch[1]}"`);
					isFirstItem = false;
				} else {
					itemLines.push(`  spoke "${labelMatch[1]}"`);
				}
			}
			continue;
		}

		// Collect items
		if (
			trimmed.match(
				/^(item|step|level|stage|person|node|side|input|output|circle|quadrant|spoke|center|event|callout)\s+"[^"]+"/
			)
		) {
			hasItems = true;
			const match = line.match(
				/^(\s*)(item|step|level|stage|person|node|side|input|output|circle|quadrant|spoke|center|event|callout)(\s+"[^"]+")/
			);
			if (match) {
				if (isFirstItem) {
					newLines.push(`  center${match[3]}`);
					isFirstItem = false;
				} else {
					itemLines.push(`  spoke${match[3]}`);
				}
			}
			continue;
		}

		// Final closing brace
		if (trimmed === '}') {
			// Add collected spokes
			newLines.push(...itemLines);
			newLines.push(line);
			break;
		}
	}

	if (!hasItems) {
		warnings.push('No items found to convert');
	} else {
		warnings.push('First item designated as center, remaining items converted to spokes');
	}

	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}

/**
 * Keyword mapping for conversion between glyphset types
 */
const KEYWORD_CONVERSIONS: Record<string, string> = {
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

/**
 * Get the primary keyword for a glyphset type
 */
export function getPrimaryKeyword(glyphsetType: string): string {
	const keywords = GLYPHSET_KEYWORDS[glyphsetType as GlyphsetType];
	return keywords?.[0] || 'item';
}

/**
 * Check if two glyphset types are compatible for conversion
 */
export function areGlyphsetsCompatible(
	fromType: string,
	toType: string
): {
	compatible: boolean;
	reason?: string;
} {
	// Same type is always compatible
	if (fromType === toType) {
		return { compatible: true };
	}

	// Find which groups each type belongs to
	let fromGroup: string | null = null;
	let toGroup: string | null = null;

	for (const [groupName, types] of Object.entries(COMPATIBILITY_GROUPS)) {
		if ((types as readonly string[]).includes(fromType)) fromGroup = groupName;
		if ((types as readonly string[]).includes(toType)) toGroup = groupName;
	}

	// If in the same group, generally compatible
	if (fromGroup === toGroup && fromGroup !== null) {
		// Special cases within groups
		if (fromGroup === 'balance') {
			return {
				compatible: true,
				reason: 'Balance glyphsets require exactly 2 sides. Item count may need adjustment.'
			};
		}
		return { compatible: true };
	}

	// Check for special incompatibilities
	if (fromType === 'equation' || toType === 'equation') {
		return {
			compatible: false,
			reason:
				'Equation glyphsets have a special structure (input + operator = result) that cannot be automatically converted.'
		};
	}

	// Block groupedProcess conversions (nested structure)
	if (fromType === 'groupedProcess' || toType === 'groupedProcess') {
		return {
			compatible: false,
			reason:
				fromType === 'groupedProcess'
					? 'Grouped Process uses nested group blocks that cannot be automatically flattened into a simple list.'
					: 'Grouped Process requires nested group blocks. Simple item lists cannot be automatically grouped without context.'
		};
	}

	// Block segmentedPyramid conversions (nested level structure)
	if (fromType === 'segmentedPyramid' || toType === 'segmentedPyramid') {
		return {
			compatible: false,
			reason:
				fromType === 'segmentedPyramid'
					? 'Segmented Pyramid uses nested level blocks with items that need to be flattened.'
					: 'Segmented Pyramid requires nested level blocks. Simple item lists cannot be automatically structured.'
		};
	}

	// Block matrix conversions (special item-based structure)
	if (
		fromType === 'segmentedMatrix' ||
		fromType === 'titledMatrix' ||
		fromType === 'matrix2x2' ||
		fromType === 'matrix3x3' ||
		toType === 'segmentedMatrix' ||
		toType === 'titledMatrix' ||
		toType === 'matrix2x2' ||
		toType === 'matrix3x3'
	) {
		return {
			compatible: false,
			reason:
				'Matrix glyphsets use item-based layouts that require specific item counts and positioning.'
		};
	}

	// Block hub conversions (special center + spoke structure)
	if (fromType === 'hub' || toType === 'hub') {
		return {
			compatible: false,
			reason:
				fromType === 'hub'
					? 'Hub glyphset has a special radial structure (center + spokes) that can be flattened into a simple list.'
					: 'Hub glyphset requires a center item and spoke items. Simple item lists can be converted (first item becomes center).'
		};
	}

	// Block labeledHierarchy conversions (root + child with edge labels)
	if (fromType === 'labeledHierarchy' || toType === 'labeledHierarchy') {
		return {
			compatible: false,
			reason:
				fromType === 'labeledHierarchy'
					? 'Labeled Hierarchy uses root and child elements with edge labels that need to be removed for conversion.'
					: 'Labeled Hierarchy requires root/child structure with edge labels. This structure cannot be automatically inferred.'
		};
	}

	// Block tableHierarchy conversions (level with category tags)
	if (fromType === 'tableHierarchy' || toType === 'tableHierarchy') {
		return {
			compatible: false,
			reason:
				fromType === 'tableHierarchy'
					? 'Table Hierarchy uses levels with category tags (e.g., BusinessLogic, DataAccess) that need to be removed for conversion.'
					: 'Table Hierarchy requires levels with category tags. This structure cannot be automatically inferred.'
		};
	}

	// Block circleHierarchy conversions (root + child structure)
	if (fromType === 'circleHierarchy' || toType === 'circleHierarchy') {
		return {
			compatible: false,
			reason:
				fromType === 'circleHierarchy'
					? 'Circle Hierarchy uses a root and child structure that can be flattened into a simple list.'
					: 'Circle Hierarchy requires a root item and child items. Simple item lists can be converted (first item becomes root).'
		};
	}

	if (
		(fromType === 'balance' || fromType === 'opposing' || fromType === 'counterbalance') &&
		!['balance', 'opposing', 'counterbalance'].includes(toType)
	) {
		return {
			compatible: true,
			reason:
				'Converting from balance (2 sides) may result in unexpected layout. Consider adjusting items.'
		};
	}

	// Generic conversion possible but with warnings
	return {
		compatible: true,
		reason: 'Converting between different glyphset categories may not preserve intended structure.'
	};
}

/**
 * Route to the appropriate specialized conversion function based on source and target types
 * This centralizes the decision logic for all conversion operations
 */
export function routeConversion(
	code: string,
	fromType: string,
	toType: string
): ConversionResult | null {
	const matrixTypes = ['matrix2x2', 'matrix3x3', 'segmentedMatrix', 'titledMatrix'];

	// Expanding TO structural glyphsets requires specialized logic
	if (toType === 'groupedProcess') {
		return expandToGroupedProcess(code);
	}
	if (toType === 'segmentedPyramid') {
		return expandToSegmentedPyramid(code);
	}
	if (toType === 'hub') {
		return expandToHub(code);
	}
	if (toType === 'circleHierarchy') {
		return expandToCircleHierarchy(code);
	}
	if (matrixTypes.includes(toType)) {
		return expandToMatrix(code, toType);
	}

	// Flattening FROM structural glyphsets
	if (fromType === 'groupedProcess') {
		return flattenGroupedProcess(code, toType);
	}
	if (fromType === 'segmentedPyramid') {
		return flattenSegmentedPyramid(code, toType);
	}
	if (fromType === 'hub') {
		return flattenHub(code, toType);
	}
	if (fromType === 'labeledHierarchy') {
		return flattenLabeledHierarchy(code, toType);
	}
	if (fromType === 'tableHierarchy') {
		return flattenTableHierarchy(code, toType);
	}
	if (fromType === 'circleHierarchy') {
		return flattenCircleHierarchy(code, toType);
	}
	if (matrixTypes.includes(fromType)) {
		return flattenMatrix(code, toType);
	}

	// No specialized routing needed - return null to indicate fallback to standard conversion
	return null;
}

/**
 * Convert glyphset code from one type to another
 */
export function convertGlyphset(code: string, newGlyphsetType: string): ConversionResult {
	// Use shared parsing utilities
	const parsed = parseGlyphsetDeclaration(code);
	if (!parsed) {
		return createParseError(code);
	}

	const { glyphsetType: oldType, glyphsetLineIndex, lines } = parsed;
	const warnings: string[] = [];
	const errors: string[] = [];

	// Try specialized routing first
	const routedResult = routeConversion(code, oldType, newGlyphsetType);
	if (routedResult) {
		return routedResult;
	}

	// Check compatibility
	const compatibility = areGlyphsetsCompatible(oldType, newGlyphsetType);
	if (!compatibility.compatible) {
		const alternatives = getCompatibleAlternatives(oldType, newGlyphsetType);
		// Can convert if:
		// - flattening FROM groupedProcess OR expanding TO groupedProcess
		// - flattening FROM segmentedPyramid OR expanding TO segmentedPyramid
		// - flattening FROM/TO matrix types
		// - flattening FROM/TO hub
		// - flattening FROM labeledHierarchy or tableHierarchy or circleHierarchy
		const canConvert =
			oldType === 'groupedProcess' ||
			newGlyphsetType === 'groupedProcess' ||
			oldType === 'segmentedPyramid' ||
			newGlyphsetType === 'segmentedPyramid' ||
			oldType === 'hub' ||
			newGlyphsetType === 'hub' ||
			oldType === 'labeledHierarchy' ||
			oldType === 'tableHierarchy' ||
			oldType === 'circleHierarchy' ||
			newGlyphsetType === 'circleHierarchy' ||
			['segmentedMatrix', 'titledMatrix', 'matrix2x2', 'matrix3x3'].includes(oldType) ||
			['segmentedMatrix', 'titledMatrix', 'matrix2x2', 'matrix3x3'].includes(newGlyphsetType);
		return {
			success: false,
			newCode: code,
			warnings,
			errors: [compatibility.reason || 'Incompatible glyphset types'],
			incompatible: true,
			alternatives,
			canConvert
		};
	}

	if (compatibility.reason) {
		warnings.push(compatibility.reason);
	}

	// Replace the glyphset type (modify lines array in place)
	const glyphsetLine = lines[glyphsetLineIndex];
	const withNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s+"[^"]+"\s*\{.*)$/);
	const withoutNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s*\{.*)$/);

	if (withNameMatch) {
		lines[glyphsetLineIndex] = `${withNameMatch[1]}${newGlyphsetType}${withNameMatch[2]}`;
	} else if (withoutNameMatch) {
		lines[glyphsetLineIndex] = `${withoutNameMatch[1]}${newGlyphsetType}${withoutNameMatch[2]}`;
	} else {
		return {
			success: false,
			newCode: code,
			warnings,
			errors: ['Could not parse glyphset declaration']
		};
	}

	// Get target keyword
	const targetKeyword = getPrimaryKeyword(newGlyphsetType);
	const oldKeywords = GLYPHSET_KEYWORDS[oldType as GlyphsetType] || ['item'];

	// Track image counter for pictureProcess
	let imageCounter = 11;

	// Convert item keywords
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Skip empty lines, comments, closing braces, and parameter lines
		if (!trimmed || trimmed.startsWith('//') || trimmed === '}') continue;

		// Check if this is a parameter line (theme, direction, etc.)
		if (
			trimmed.match(
				/^(theme|direction|columns|shape|showValues|showPercentages|layout|orientation)\s/
			)
		) {
			continue;
		}

		// Special handling for converting TO pictureProcess (do this FIRST before other conversions)
		if (newGlyphsetType === 'pictureProcess') {
			// Skip if already in image format
			if (line.includes('image ') && line.includes('label ')) {
				continue;
			}

			let labelText = '';
			let indent = '';

			// Try to extract label from various keyword formats (expanded list)
			const itemMatch = line.match(
				/^(\s*)(item|step|level|stage|person|node|side|input|output|circle|quadrant|spoke|center|event|callout)\s+"([^"]+)"/
			);

			if (itemMatch) {
				indent = itemMatch[1];
				labelText = itemMatch[3];
				// If coming from detailedProcess, extract just the main step
				if (oldType === 'detailedProcess' && labelText.includes(' | ')) {
					labelText = labelText.split(' | ')[0].trim();
				}
				// Convert to pictureProcess format
				lines[i] =
					`${indent}image "https://i.pravatar.cc/200?img=${imageCounter}" label "${labelText}"`;
				imageCounter++;
				continue;
			}
		}

		// Special handling for converting TO pictureCallout or other picture types
		if (
			['pictureCallout', 'pictureList', 'horizontalPictureList', 'stackedPictureList'].includes(
				newGlyphsetType
			)
		) {
			// If source is pictureProcess, preserve image format but change keyword
			if (line.includes('image ') && line.includes('label ')) {
				// Already in image format, keep as-is since target also uses 'image'
				continue;
			}

			// Convert other keywords to image format
			let labelText = '';
			let indent = '';
			const itemMatch = line.match(
				/^(\s*)(item|step|level|stage|person|node|side|input|output|circle|quadrant|spoke|center|event|callout)\s+"([^"]+)"/
			);
			if (itemMatch) {
				indent = itemMatch[1];
				labelText = itemMatch[3];
				lines[i] =
					`${indent}image "https://i.pravatar.cc/200?img=${imageCounter}" label "${labelText}"`;
				imageCounter++;
				continue;
			}
		}

		// Special handling for converting TO detailedProcess
		if (newGlyphsetType === 'detailedProcess') {
			// Check if line has any item keyword
			if (line.match(/^\s*(item|step|level|stage|person|node|side|input|output)\s+"([^"]+)"/)) {
				const match = line.match(
					/^(\s*)(item|step|level|stage|person|node|side|input|output)\s+"([^"]+)"/
				);
				if (match) {
					const indent = match[1];
					let labelText = match[3];
					// If label doesn't already contain a pipe separator, add one to indicate substeps are possible
					if (!labelText.includes(' | ')) {
						labelText = labelText + ' | ';
					}
					// Convert to detailedProcess format
					lines[i] = `${indent}item "${labelText}"`;
					continue;
				}
			}
		}

		// Special handling for converting FROM detailedProcess (has pipe-delimited substeps)
		if (oldType === 'detailedProcess' && line.includes(' | ')) {
			// Extract the main step (first part before first pipe)
			const match = line.match(/^\s*(item|step)\s+"([^"]+)"/);
			if (match) {
				const indent = line.match(/^(\s*)/)?.[1] || '';
				const fullText = match[2];
				// Take only the first part (main step) and trim trailing pipe/spaces
				const mainStep = fullText.split(' | ')[0].trim();
				// Convert to target keyword format with just the main step
				lines[i] = `${indent}${targetKeyword} "${mainStep}"`;
				continue;
			}
		}

		// Special handling for converting FROM pictureProcess (has image with label)
		if (oldType === 'pictureProcess' && line.includes('image ') && line.includes('label ')) {
			// Extract just the label portion
			const labelMatch = line.match(/^\s*image\s+"[^"]+"\s+label\s+"([^"]+)"/);
			if (labelMatch) {
				const indent = line.match(/^(\s*)/)?.[1] || '';
				let labelText = labelMatch[1];
				// If converting to detailedProcess, add pipe separator
				if (newGlyphsetType === 'detailedProcess' && !labelText.includes(' | ')) {
					labelText = labelText + ' | ';
				}
				// Convert to target keyword format
				lines[i] = `${indent}${targetKeyword} "${labelText}"`;
				continue;
			}
		}

		// Standard keyword conversion
		let converted = false;

		// Check if line starts with any old keyword
		for (const oldKeyword of oldKeywords) {
			const keywordPattern = new RegExp(`^(\\s*)${oldKeyword}(\\s+)`, 'i');
			if (line.match(keywordPattern)) {
				// Replace the keyword
				lines[i] = line.replace(keywordPattern, `$1${targetKeyword}$2`);
				converted = true;

				// Add warning if it's a special keyword
				if (['side', 'input', 'output', 'operator', 'result', 'center'].includes(oldKeyword)) {
					warnings.push(
						`Converted '${oldKeyword}' to '${targetKeyword}' - please verify the result`
					);
				}
				break;
			}
		}

		// Also check for other convertible keywords that might not be in the old type's list
		if (!converted) {
			for (const [fromKeyword] of Object.entries(KEYWORD_CONVERSIONS)) {
				const keywordPattern = new RegExp(`^(\\s*)${fromKeyword}(\\s+)`, 'i');
				if (line.match(keywordPattern) && !line.match(/^(\s*)(theme|direction|columns)/)) {
					lines[i] = line.replace(keywordPattern, `$1${targetKeyword}$2`);
					if (['side', 'input', 'output', 'operator', 'result', 'center'].includes(fromKeyword)) {
						warnings.push(
							`Converted '${fromKeyword}' to '${targetKeyword}' - please verify the result`
						);
					}
					break;
				}
			}
		}
	}

	// Count items for specific warnings
	const itemCount = lines.filter((line) => {
		const trimmed = line.trim();
		return trimmed.startsWith('item ') || trimmed.startsWith(targetKeyword + ' ');
	}).length;

	// Type-specific warnings
	if (
		newGlyphsetType === 'balance' ||
		newGlyphsetType === 'opposing' ||
		newGlyphsetType === 'counterbalance'
	) {
		if (itemCount !== 2) {
			warnings.push(
				`${newGlyphsetType} glyphsets work best with exactly 2 items (currently: ${itemCount})`
			);
		}
	}

	if (newGlyphsetType === 'matrix2x2' && itemCount !== 4) {
		warnings.push(`matrix2x2 expects 4 items (currently: ${itemCount})`);
	}

	if (newGlyphsetType === 'matrix3x3' && itemCount !== 9) {
		warnings.push(`matrix3x3 expects 9 items (currently: ${itemCount})`);
	}

	if (newGlyphsetType === 'hub' && !lines.some((l) => l.trim().startsWith('center '))) {
		warnings.push(`hub glyphsets typically need one 'center' item and multiple 'spoke' items`);
	}

	return {
		success: true,
		newCode: lines.join('\n'),
		warnings,
		errors
	};
}
