/**
 * Common parsing utilities for glyphset conversion
 * Eliminates 390 lines of duplicated boilerplate across 13 functions
 */

import type { ConversionResult, ParsedGlyphset } from './types';

/**
 * Parse glyphset declaration and extract metadata
 *
 * @param code - The glyphset code to parse
 * @returns Parsed glyphset metadata or null if no glyphset found
 */
export function parseGlyphsetDeclaration(code: string): ParsedGlyphset | null {
	const lines = code.split('\n');
	const glyphsetLineIndex = lines.findIndex((line) => line.trim().startsWith('glyphset '));

	if (glyphsetLineIndex === -1) {
		return null;
	}

	const glyphsetLine = lines[glyphsetLineIndex];

	// Extract type and optional name
	const withNameMatch = glyphsetLine.match(/glyphset\s+(\w+)\s+"([^"]+)"/);
	const withoutNameMatch = glyphsetLine.match(/glyphset\s+(\w+)/);

	let glyphsetType: string;
	let glyphsetName: string | undefined;

	if (withNameMatch) {
		glyphsetType = withNameMatch[1];
		glyphsetName = withNameMatch[2];
	} else if (withoutNameMatch) {
		glyphsetType = withoutNameMatch[1];
	} else {
		return null;
	}

	return {
		glyphsetLineIndex,
		glyphsetType,
		glyphsetName,
		lines
	};
}

/**
 * Replace glyphset type while preserving name and structure
 *
 * @param lines - Array of code lines
 * @param glyphsetLineIndex - Index of the glyphset declaration line
 * @param newType - New glyphset type to use
 * @returns Array of lines with replaced glyphset type
 */
export function replaceGlyphsetType(
	lines: string[],
	glyphsetLineIndex: number,
	newType: string
): string[] {
	const newLines: string[] = [];
	const glyphsetLine = lines[glyphsetLineIndex];

	const withNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s+"[^"]+"\s*\{.*)$/);
	const withoutNameMatch = glyphsetLine.match(/^(\s*glyphset\s+)\w+(\s*\{.*)$/);

	if (withNameMatch) {
		newLines.push(`${withNameMatch[1]}${newType}${withNameMatch[2]}`);
	} else if (withoutNameMatch) {
		newLines.push(`${withoutNameMatch[1]}${newType}${withoutNameMatch[2]}`);
	} else {
		newLines.push(glyphsetLine);
	}

	return newLines;
}

/**
 * Create standardized error result for missing glyphset declaration
 *
 * @param code - Original code
 * @returns ConversionResult with error
 */
export function createParseError(code: string): ConversionResult {
	return {
		success: false,
		newCode: code,
		warnings: [],
		errors: ['No glyphset declaration found']
	};
}
