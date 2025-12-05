/**
 * Compatibility checking functions for glyphset conversions
 */

import { GLYPHSET_KEYWORDS, COMPATIBILITY_GROUPS, type GlyphsetType } from './constants';

/**
 * Get the primary keyword for a glyphset type
 */
export function getPrimaryKeyword(glyphsetType: string): string {
	const keywords = GLYPHSET_KEYWORDS[glyphsetType as GlyphsetType];
	return keywords?.[0] || 'item';
}

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
