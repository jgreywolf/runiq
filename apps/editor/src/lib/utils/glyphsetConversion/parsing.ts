/**
 * Common parsing utilities for glyphset conversion
 * Eliminates 390 lines of duplicated boilerplate across 13 functions
 */

import { isGlyphsetId } from '@runiq/parser-dsl';
import type { ConversionResult, ParsedGlyphset } from './types';

const glyphsetDeclarationRegex = /glyphset\s+(\w+)\s+"([^"]+)"/;

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
	const match = glyphsetLine.match(glyphsetDeclarationRegex);

	if (!match) {
		return null;
	}

	const oldGlyphsetId = isGlyphsetId(match[1]);
	if (!oldGlyphsetId) {
		return null;
	}
	const glyphsetTitle = match[2];

	return {
		glyphsetLineIndex,
		oldGlyphsetId,
		glyphsetTitle,
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
export function createParseError(
	code: string,
	error: string = 'No glyphset declaration found'
): ConversionResult {
	return {
		success: false,
		newCode: code,
		warnings: [],
		errors: [error]
	};
}
