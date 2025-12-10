/**
 * Compatibility checking functions for glyphset conversions
 */

import { getGlyphsetStructureType, type GlyphsetId } from '@runiq/parser-dsl';

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

	// If in the same group, generally compatible
	if (oldStructure === newStructure && oldStructure !== null) {
		return { compatible: true };
	}

	// Check for special incompatibilities
	if (oldStructure === 'flat' && newStructure === 'nested') {
		return {
			compatible: false,
			reason: `${newGlyphsetId} glyphset requires complex nested level blocks. Simple item lists cannot be automatically structured.`
		};
	}

	if (oldStructure === 'nested' && newStructure === 'flat') {
		return {
			compatible: false,
			reason: `${oldGlyphsetId} glyphsets use complex nested level blocks. Flattening to a simple item list cannot be automatically structured (currently).`
		};
	}

	// Generic conversion possible but with warnings
	return {
		compatible: true,
		reason: 'Converting between different glyphset categories may not preserve intended structure.'
	};
}
