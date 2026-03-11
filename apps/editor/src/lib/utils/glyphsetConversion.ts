/**
 * Glyphset conversion utilities
 * Handles keyword mapping and compatibility checking when switching between glyphset types
 */

import {
	getGlyphsetStructureType,
	GlyphsetIds,
	isGlyphsetId,
	type GlyphsetId
} from '@runiq/parser-dsl';
import { parameterRegEx } from './glyphsetConversion/constants';
import { areGlyphsetsCompatible } from './glyphsetConversion/compatibility';
import { expandToGroupedProcess, flattenGroupedProcess } from './glyphsetConversion/groupedProcess';
import {
	expandToLabeledHierarchy,
	flattenLabeledHierarchy,
	flattenTableHierarchy
} from './glyphsetConversion/hierarchy';
import {
	expandToNestedStructure,
	flattenNestedStructure
} from './glyphsetConversion/levelConversions';
import { convertLine } from './glyphsetConversion/lineConversions';
import { createParseError, parseGlyphsetDeclaration } from './glyphsetConversion/parsing';
import type { ConversionResult } from './glyphsetConversion/types';

/**
 * Convert glyphset code from one type to another
 */
export function convertGlyphset(code: string, newType: string): ConversionResult {
	const newGlyphsetId = isGlyphsetId(newType);
	if (!newGlyphsetId) {
		return createParseError(code, 'Invalid target glyphset type');
	}

	const parsed = parseGlyphsetDeclaration(code);
	if (!parsed) {
		return createParseError(code);
	}

	const { oldGlyphsetId, glyphsetLineIndex, glyphsetTitle, lines } = parsed;
	const compatibility = areGlyphsetsCompatible(oldGlyphsetId, newGlyphsetId);
	if (!compatibility.compatible) {
		return {
			success: false,
			newCode: code,
			warnings: [],
			errors: [
				compatibility.reason ||
					`Conversion from ${oldGlyphsetId} to ${newGlyphsetId} is not currently supported.`
			],
			canConvert: false
		};
	}

	const warnings: string[] = [];
	const errors: string[] = [];
	const newLines: string[] = [];
	const oldLines: string[] = [];
	let itemCount = 0;

	lines[glyphsetLineIndex] = `glyphset ${newGlyphsetId} "${glyphsetTitle}" { `;
	newLines.push(...lines.slice(0, glyphsetLineIndex + 1));
	oldLines.push(...lines.slice(glyphsetLineIndex + 1));

	const oldStructure = getGlyphsetStructureType(oldGlyphsetId);
	const newStructure = getGlyphsetStructureType(newGlyphsetId);

	if (oldStructure !== newStructure) {
		const actionType = oldStructure === 'flat' ? 'expanding' : 'flattening';
		let conversionResult: ConversionResult | null = null;

		if (oldStructure === 'flat') {
			// we need to call the "expand" functions
			switch (newGlyphsetId) {
				case GlyphsetIds.groupedProcess:
					conversionResult = {
						success: true,
						newCode: [...newLines, ...expandToGroupedProcess(oldLines, oldGlyphsetId, newGlyphsetId)].join('\n'),
						warnings,
						errors
					};
					break;
				case GlyphsetIds.pyramidList:
				case GlyphsetIds.nestedList:
				case GlyphsetIds.segmentedPyramid:
				case GlyphsetIds.tableHierarchy:
					conversionResult = {
						success: true,
						newCode: [...newLines, ...expandToNestedStructure(oldLines, oldGlyphsetId, newGlyphsetId)].join('\n'),
						warnings,
						errors
					};
					break;
				case GlyphsetIds.labeledHierarchy:
				case GlyphsetIds.circleHierarchy:
					conversionResult = expandToLabeledHierarchy(code, newGlyphsetId);
					break;
				default:
					// other expand functions can go here
					break;
			}
		}
		if (newStructure === 'flat') {
			// we need to call the "flatten" functions
			switch (oldGlyphsetId) {
				case GlyphsetIds.groupedProcess:
					conversionResult = {
						success: true,
						newCode: [...newLines, ...flattenGroupedProcess(oldLines, oldGlyphsetId, newGlyphsetId)].join('\n'),
						warnings,
						errors
					};
					break;
				case GlyphsetIds.pyramidList:
				case GlyphsetIds.nestedList:
				case GlyphsetIds.segmentedPyramid:
					conversionResult = {
						success: true,
						newCode: [...newLines, ...flattenNestedStructure(oldLines, oldGlyphsetId, newGlyphsetId)].join('\n'),
						warnings,
						errors
					};
					break;
				case GlyphsetIds.labeledHierarchy:
				case GlyphsetIds.circleHierarchy:
					conversionResult = flattenLabeledHierarchy(code, newGlyphsetId);
					break;
				case GlyphsetIds.tableHierarchy:
					conversionResult = flattenTableHierarchy(code, newGlyphsetId);
					break;
				default:
					// other expand functions can go here
					break;
			}
		}
		if (!conversionResult || !conversionResult.success) {
			return createParseError(
				code,
				`Unknown error occurred while ${actionType} to ${newGlyphsetId}`
			);
		}
		return conversionResult;
	}

	// Convert to target keyword
	for (let i = 0; i < oldLines.length; i++) {
		const line = oldLines[i].trimEnd();

		// Skip empty lines, comments, closing braces, and parameter lines
		if (
			!line ||
			line.trim().startsWith('//') ||
			line.trim().match(parameterRegEx) ||
			line.trim() === '}'
		) {
			continue;
		}

		oldLines[i] = convertLine(line, oldGlyphsetId, newGlyphsetId, itemCount, i);
		itemCount++;
	}

	newLines.push(...oldLines);
	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}

// Define which keywords each glyphset type uses
export const getGlyphsetKeywords = (glyphsetId: GlyphsetId) => {
	switch (glyphsetId) {
		case GlyphsetIds.pictureGrid:
		case GlyphsetIds.pictureList:
		case GlyphsetIds.pictureProcess:
		case GlyphsetIds.pictureBlocks:
		case GlyphsetIds.framedPicture:
			return ['image']; // Special: uses "image" with URL and "label"
		case GlyphsetIds.pyramid:
		case GlyphsetIds.invertedPyramid:
		case GlyphsetIds.trapezoidPyramid:
		case GlyphsetIds.segmentedPyramid:
		case GlyphsetIds.tableHierarchy:
		case GlyphsetIds.nestedList:
			return ['level'];
		case GlyphsetIds.circleHierarchy:
		case GlyphsetIds.labeledHierarchy:
			return ['root', 'child'];
		// these are nested 'person' types
		case GlyphsetIds.orgChart:
		case GlyphsetIds.horizontalOrgChart:
		case GlyphsetIds.matrixOrgChart:
			return ['person'];
		case GlyphsetIds.teamHierarchy:
			return ['team', 'member', 'leader'];
		case GlyphsetIds.cluster:
			return ['center', 'item'];
		case GlyphsetIds.converging:
			return ['target', 'item'];
		case GlyphsetIds.diverging:
			return ['source', 'item'];
		case GlyphsetIds.pictureCallout:
			return ['image', 'callout'];
		case GlyphsetIds.events:
			return ['event'];
		default:
			return ['item'];
	}

	//titleBlock: ['level'],
	// hub: ['spoke', 'center'],
};
