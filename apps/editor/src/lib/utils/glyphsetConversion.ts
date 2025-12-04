/**
 * Glyphset conversion utilities
 * Handles keyword mapping and compatibility checking when switching between glyphset types
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
	circleHierarchy: ['node'],
	titleBlock: ['level'],
	tableHierarchy: ['level'],

	// Comparison glyphsets - use 'item' or 'quadrant'
	matrix2x2: ['quadrant', 'item'],
	matrix3x3: ['item'],
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
	'equation', // input + operator = result
	'hub', // center + spokes
	'groupedProcess' // nested groups + mergePoint
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

	// Remove duplicates and the target type
	return [...new Set(alternatives)].filter((alt) => alt !== toType);
}

/**
 * Flatten a groupedProcess glyphset by removing group blocks and mergePoint
 * Converts nested structure into a flat list of items
 */
export function flattenGroupedProcess(code: string, targetGlyphsetType: string): ConversionResult {
	const lines = code.split('\n');
	const warnings: string[] = [];
	const errors: string[] = [];
	const newLines: string[] = [];

	// Find the glyphset line
	const glyphsetLineIndex = lines.findIndex((line) => line.trim().startsWith('glyphset '));

	if (glyphsetLineIndex === -1) {
		return {
			success: false,
			newCode: code,
			warnings,
			errors: ['No glyphset declaration found']
		};
	}

	// Replace glyphset type
	const glyphsetLine = lines[glyphsetLineIndex];
	const withNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s+"[^"]+"\s*\{.*)$/);
	const withoutNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s*\{.*)$/);

	if (withNameMatch) {
		newLines.push(`${withNameMatch[1]}${targetGlyphsetType}${withNameMatch[2]}`);
	} else if (withoutNameMatch) {
		newLines.push(`${withoutNameMatch[1]}${targetGlyphsetType}${withoutNameMatch[2]}`);
	} else {
		newLines.push(glyphsetLine);
	}

	const targetKeyword = getPrimaryKeyword(targetGlyphsetType);
	let insideGroup = false;
	let groupDepth = 0;

	// Process remaining lines
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Skip empty lines
		if (!trimmed) {
			newLines.push(line);
			continue;
		}

		// Skip group declarations
		if (trimmed.match(/^group\s+"[^"]+"\s*\{/)) {
			insideGroup = true;
			groupDepth++;
			continue;
		}

		// Skip mergePoint
		if (trimmed.match(/^mergePoint\s+"[^"]+"/)) {
			continue;
		}

		// Handle closing braces
		if (trimmed === '}') {
			if (insideGroup && groupDepth > 0) {
				groupDepth--;
				if (groupDepth === 0) {
					insideGroup = false;
				}
				continue;
			} else {
				// Final closing brace
				newLines.push(line);
				continue;
			}
		}

		// Keep items but convert keyword if needed
		if (trimmed.match(/^item\s+"[^"]+"/)) {
			const match = line.match(/^(\s*)item(\s+"[^"]+")/);
			if (match) {
				// Use base indentation (not nested)
				newLines.push(`  ${targetKeyword}${match[2]}`);
				continue;
			}
		}

		// Keep theme, direction, and other parameters
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

		// Keep other lines as-is
		newLines.push(line);
	}

	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}

/**
 * Expand a flat list glyphset to groupedProcess by wrapping items in a group
 * Converts flat structure into nested grouped structure
 */
export function expandToGroupedProcess(code: string): ConversionResult {
	const lines = code.split('\n');
	const warnings: string[] = [];
	const errors: string[] = [];
	const newLines: string[] = [];

	// Find the glyphset line
	const glyphsetLineIndex = lines.findIndex((line) => line.trim().startsWith('glyphset '));

	if (glyphsetLineIndex === -1) {
		return {
			success: false,
			newCode: code,
			warnings,
			errors: ['No glyphset declaration found']
		};
	}

	// Replace glyphset type
	const glyphsetLine = lines[glyphsetLineIndex];
	const withNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s+"[^"]+"\s*\{.*)$/);
	const withoutNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s*\{.*)$/);

	if (withNameMatch) {
		newLines.push(`${withNameMatch[1]}groupedProcess${withNameMatch[2]}`);
	} else if (withoutNameMatch) {
		newLines.push(`${withoutNameMatch[1]}groupedProcess${withoutNameMatch[2]}`);
	} else {
		newLines.push(glyphsetLine);
	}

	let insideMainBlock = false;
	let hasItems = false;
	const itemLines: string[] = [];

	// Process remaining lines to collect items
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Skip empty lines at the start
		if (!trimmed && !insideMainBlock) {
			continue;
		}

		if (!insideMainBlock) {
			insideMainBlock = true;
		}

		// Keep theme and other parameters at the top level
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

		// Collect items to wrap in a group
		if (
			trimmed.match(
				/^(item|step|level|stage|person|node|side|input|output|circle|quadrant)\s+"[^"]+"/
			)
		) {
			hasItems = true;
			// Convert keyword to 'item' and adjust indentation
			const match = line.match(
				/^(\s*)(item|step|level|stage|person|node|side|input|output|circle|quadrant)(\s+"[^"]+")/
			);
			if (match) {
				itemLines.push(`    item${match[3]}`);
			}
			continue;
		}

		// Final closing brace
		if (trimmed === '}') {
			// Add the group wrappers if we found items (create at least 2 groups)
			if (hasItems) {
				const midpoint = Math.ceil(itemLines.length / 2);

				// First group with first half of items
				newLines.push('  group "Group 1" {');
				newLines.push(...itemLines.slice(0, midpoint));
				newLines.push('  }');

				// Second group with second half of items
				newLines.push('  group "Group 2" {');
				newLines.push(...itemLines.slice(midpoint));
				newLines.push('  }');

				newLines.push('  mergePoint "Result"');
			}
			newLines.push(line);
			break;
		}
	}

	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}

/**
 * Flatten a segmentedPyramid glyphset by removing level blocks and extracting items
 * Converts nested level { item ... } structure into a flat list
 */
export function flattenSegmentedPyramid(
	code: string,
	targetGlyphsetType: string
): ConversionResult {
	const lines = code.split('\n');
	const warnings: string[] = [];
	const errors: string[] = [];
	const newLines: string[] = [];

	// Find the glyphset line
	const glyphsetLineIndex = lines.findIndex((line) => line.trim().startsWith('glyphset '));

	if (glyphsetLineIndex === -1) {
		return {
			success: false,
			newCode: code,
			warnings,
			errors: ['No glyphset declaration found']
		};
	}

	// Determine target keyword
	const targetKeyword = getPrimaryKeyword(targetGlyphsetType);

	// Replace glyphset type
	const glyphsetLine = lines[glyphsetLineIndex];
	const withNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s+"[^"]+"\s*\{.*)$/);
	const withoutNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s*\{.*)$/);

	if (withNameMatch) {
		newLines.push(`${withNameMatch[1]}${targetGlyphsetType}${withNameMatch[2]}`);
	} else if (withoutNameMatch) {
		newLines.push(`${withoutNameMatch[1]}${targetGlyphsetType}${withoutNameMatch[2]}`);
	} else {
		newLines.push(glyphsetLine);
	}

	let insideLevel = false;
	let levelDepth = 0;

	// Process remaining lines
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Skip empty lines
		if (!trimmed) {
			continue;
		}

		// Skip level declarations
		if (trimmed.match(/^level\s+"[^"]+"\s*\{/)) {
			insideLevel = true;
			levelDepth++;
			continue;
		}

		// Handle closing braces
		if (trimmed === '}') {
			if (insideLevel && levelDepth > 0) {
				levelDepth--;
				if (levelDepth === 0) {
					insideLevel = false;
				}
				continue;
			} else {
				// Final closing brace
				newLines.push(line);
				continue;
			}
		}

		// Keep items but convert keyword if needed
		if (trimmed.match(/^item\s+"[^"]+"/)) {
			const match = line.match(/^(\s*)item(\s+"[^"]+")/);
			if (match) {
				// Use base indentation (not nested)
				newLines.push(`  ${targetKeyword}${match[2]}`);
				continue;
			}
		}

		// Keep theme, direction, and other parameters
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

		// Keep other lines as-is
		newLines.push(line);
	}

	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}

/**
 * Flatten matrix glyphsets (segmentedMatrix, titledMatrix) by extracting quadrant items
 * These use flat quadrant lists, so just need keyword conversion
 */
export function flattenMatrix(code: string, targetGlyphsetType: string): ConversionResult {
	const lines = code.split('\n');
	const warnings: string[] = [];
	const errors: string[] = [];
	const newLines: string[] = [];

	// Find the glyphset line
	const glyphsetLineIndex = lines.findIndex((line) => line.trim().startsWith('glyphset '));

	if (glyphsetLineIndex === -1) {
		return {
			success: false,
			newCode: code,
			warnings,
			errors: ['No glyphset declaration found']
		};
	}

	// Determine target keyword
	const targetKeyword = getPrimaryKeyword(targetGlyphsetType);

	// Replace glyphset type
	const glyphsetLine = lines[glyphsetLineIndex];
	const withNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s+"[^"]+"\s*\{.*)$/);
	const withoutNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s*\{.*)$/);

	if (withNameMatch) {
		newLines.push(`${withNameMatch[1]}${targetGlyphsetType}${withNameMatch[2]}`);
	} else if (withoutNameMatch) {
		newLines.push(`${withoutNameMatch[1]}${targetGlyphsetType}${withoutNameMatch[2]}`);
	} else {
		newLines.push(glyphsetLine);
	}

	// Process remaining lines - convert quadrant to target keyword
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Convert quadrant to target keyword
		if (trimmed.match(/^quadrant\s+"[^"]+"/)) {
			const match = line.match(/^(\s*)quadrant(\s+"[^"]+")/);
			if (match) {
				newLines.push(`${match[1]}${targetKeyword}${match[2]}`);
				continue;
			}
		}

		// Keep everything else as-is
		newLines.push(line);
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
	quadrant: 'item',
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

export interface ConversionResult {
	success: boolean;
	newCode: string;
	warnings: string[];
	errors: string[];
	incompatible?: boolean; // True if structural incompatibility
	alternatives?: string[]; // Suggested compatible glyphset types
	canConvert?: boolean; // True if can transform and convert (flatten or expand)
}

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

	// Block matrix conversions (special quadrant structure)
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
				'Matrix glyphsets use quadrant-based layouts that require specific item counts and positioning.'
		};
	}

	// Block hub conversions (special center + spoke structure)
	if (fromType === 'hub' || toType === 'hub') {
		return {
			compatible: false,
			reason:
				fromType === 'hub'
					? 'Hub glyphset has a special radial structure (center + spokes) that cannot be converted to sequential layouts.'
					: 'Hub glyphset requires a center item and spoke items. This radial structure cannot be automatically created.'
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
 * Convert glyphset code from one type to another
 */
export function convertGlyphset(code: string, newGlyphsetType: string): ConversionResult {
	const lines = code.split('\n');
	const warnings: string[] = [];
	const errors: string[] = [];

	// Find the glyphset line
	const glyphsetLineIndex = lines.findIndex((line) => line.trim().startsWith('glyphset '));

	if (glyphsetLineIndex === -1) {
		return {
			success: false,
			newCode: code,
			warnings,
			errors: ['No glyphset declaration found']
		};
	}

	const glyphsetLine = lines[glyphsetLineIndex];

	// Extract old type
	const oldTypeMatch = glyphsetLine.match(/glyphset\s+(\w+)/);
	if (!oldTypeMatch) {
		return {
			success: false,
			newCode: code,
			warnings,
			errors: ['Could not parse glyphset type']
		};
	}

	const oldType = oldTypeMatch[1];

	// Check compatibility
	const compatibility = areGlyphsetsCompatible(oldType, newGlyphsetType);
	if (!compatibility.compatible) {
		const alternatives = getCompatibleAlternatives(oldType, newGlyphsetType);
		// Can convert if:
		// - flattening FROM groupedProcess OR expanding TO groupedProcess
		// - flattening FROM segmentedPyramid
		// - flattening FROM/TO matrix types
		const canConvert =
			oldType === 'groupedProcess' ||
			newGlyphsetType === 'groupedProcess' ||
			oldType === 'segmentedPyramid' ||
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

	// Replace the glyphset type
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
			// Check if line has any item keyword
			let labelText = '';
			let indent = '';

			// Try to extract label from various formats
			if (line.match(/^\s*(item|step|level|stage|person|node|side|input|output)\s+"([^"]+)"/)) {
				const match = line.match(
					/^(\s*)(item|step|level|stage|person|node|side|input|output)\s+"([^"]+)"/
				);
				if (match) {
					indent = match[1];
					labelText = match[3];
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
