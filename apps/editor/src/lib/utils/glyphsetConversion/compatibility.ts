/**
 * Compatibility checking functions for glyphset conversions
 */

import { getGlyphsetStructureType, GlyphsetIds, type GlyphsetId } from '@runiq/parser-dsl';
import { getGlyphsetKeywords } from '../glyphsetConversion';

const FLAT_TO_NESTED_SUPPORTED_TARGETS = new Set<GlyphsetId>([
	GlyphsetIds.groupedProcess,
	GlyphsetIds.pyramidList,
	GlyphsetIds.nestedList,
	GlyphsetIds.segmentedPyramid,
	GlyphsetIds.tableHierarchy,
	GlyphsetIds.labeledHierarchy,
	GlyphsetIds.circleHierarchy
]);

const NESTED_TO_FLAT_SUPPORTED_SOURCES = new Set<GlyphsetId>([
	GlyphsetIds.groupedProcess,
	GlyphsetIds.pyramidList,
	GlyphsetIds.nestedList,
	GlyphsetIds.segmentedPyramid,
	GlyphsetIds.tableHierarchy,
	GlyphsetIds.labeledHierarchy,
	GlyphsetIds.circleHierarchy
]);

const PROCESS_FAMILY_GLYPHSETS = new Set<GlyphsetId>([
	GlyphsetIds.basicProcess,
	GlyphsetIds.cycle,
	GlyphsetIds.blockCycle,
	GlyphsetIds.orbitCycle,
	GlyphsetIds.stepProcess,
	GlyphsetIds.detailedProcess,
	GlyphsetIds.alternatingProcess,
	GlyphsetIds.continuousBlockProcess,
	GlyphsetIds.verticalProcess,
	GlyphsetIds.upwardArrowProcess,
	GlyphsetIds.bendingProcess,
	GlyphsetIds.equationProcess,
	GlyphsetIds.repeatingCycle,
	GlyphsetIds.continuousCycle,
	GlyphsetIds.segmentedCycle,
	GlyphsetIds.gearCycle,
	GlyphsetIds.pictureProcess,
	GlyphsetIds.phasedProcess,
	GlyphsetIds.radialCycle,
	GlyphsetIds.spiralCycle
]);

function hasComplexKeywords(glyphsetId: GlyphsetId): boolean {
	return getGlyphsetKeywords(glyphsetId).length > 1;
}

function isProcessFamily(glyphsetId: GlyphsetId): boolean {
	return PROCESS_FAMILY_GLYPHSETS.has(glyphsetId);
}

/**
 * Check if two glyphset types are compatible for conversion
 */
export function areGlyphsetsCompatible(
	oldGlyphsetId: GlyphsetId,
	newGlyphsetId: GlyphsetId
): {
	compatible: boolean;
	reason?: string;
} {
	if (oldGlyphsetId === newGlyphsetId) {
		return { compatible: true };
	}

	const oldStructure = getGlyphsetStructureType(oldGlyphsetId);
	const newStructure = getGlyphsetStructureType(newGlyphsetId);

	if (oldStructure === newStructure) {
		if (isProcessFamily(oldGlyphsetId) && isProcessFamily(newGlyphsetId)) {
			return { compatible: true };
		}

		if (oldStructure === 'nested') {
			return {
				compatible: false,
				reason:
					'Nested-to-nested conversion is currently disabled unless source and target are the same type.'
			};
		}

		// Flat glyphsets with multi-key syntax (e.g. center/item, source/item, image/callout)
		// are not safe for generic line conversion.
		if (hasComplexKeywords(oldGlyphsetId) || hasComplexKeywords(newGlyphsetId)) {
			return {
				compatible: false,
				reason:
					'This glyphset pair uses multi-key syntax and cannot be safely auto-converted yet.'
			};
		}

		return { compatible: true };
	}

	if (oldStructure === 'flat' && newStructure === 'nested') {
		if (FLAT_TO_NESTED_SUPPORTED_TARGETS.has(newGlyphsetId)) {
			return { compatible: true };
		}

		return {
			compatible: false,
			reason: `${newGlyphsetId} requires nested blocks that are not supported by auto-conversion yet.`
		};
	}

	if (oldStructure === 'nested' && newStructure === 'flat') {
		if (NESTED_TO_FLAT_SUPPORTED_SOURCES.has(oldGlyphsetId)) {
			return { compatible: true };
		}

		return {
			compatible: false,
			reason: `${oldGlyphsetId} uses nested blocks that cannot be safely flattened for this target yet.`
		};
	}

	return { compatible: false, reason: 'This glyphset conversion path is not currently supported.' };
}
