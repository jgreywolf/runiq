import { getPrimaryKeyword } from '../glyphsetConversion';
import { createParseError, parseGlyphsetDeclaration, replaceGlyphsetType } from './parsing';
import type { ConversionResult } from './types';

/**
 * Flatten labeledHierarchy by removing edge labels
 * Converts root + child with edge labels into flat list
 */
export function flattenLabeledHierarchy(
	code: string,
	targetGlyphsetType: string
): ConversionResult {
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
	let imageCounter = 11;

	// Process remaining lines
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		if (!trimmed) {
			newLines.push(line);
			continue;
		}

		// Handle root and child keywords (with optional edge labels)
		if (trimmed.match(/^(root|child)\s+"[^"]+"/)) {
			const match = line.match(/^(\s*)(root|child)\s+"([^"]+)"(\s+\w+)?/);
			if (match) {
				const labelText = match[3];
				// Special handling for pictureProcess
				if (targetGlyphsetType === 'pictureProcess') {
					newLines.push(
						`  image "https://i.pravatar.cc/200?img=${imageCounter}" label "${labelText}"`
					);
					imageCounter++;
				} else {
					newLines.push(`  ${targetKeyword} "${labelText}"`);
				}
				continue;
			}
		}

		// Keep parameters
		if (trimmed.match(/^(theme|direction|columns|shape|showValues|layout|orientation)\s/)) {
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

		newLines.push(line);
	}

	warnings.push('Edge labels from labeledHierarchy have been removed');

	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}

/**
 * Flatten tableHierarchy by removing category tags
 * Converts level with optional categories into flat list
 */
export function flattenTableHierarchy(code: string, targetGlyphsetType: string): ConversionResult {
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
	let imageCounter = 11;

	// Process remaining lines
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		if (!trimmed) {
			newLines.push(line);
			continue;
		}

		// Handle level keywords (with optional category tags)
		if (trimmed.match(/^level\s+"[^"]+"/)) {
			const match = line.match(/^(\s*)level\s+"([^"]+)"(\s+\w+)?/);
			if (match) {
				const labelText = match[2];
				// Special handling for pictureProcess
				if (targetGlyphsetType === 'pictureProcess') {
					newLines.push(
						`  image "https://i.pravatar.cc/200?img=${imageCounter}" label "${labelText}"`
					);
					imageCounter++;
				} else {
					newLines.push(`  ${targetKeyword} "${labelText}"`);
				}
				continue;
			}
		}

		// Keep parameters
		if (
			trimmed.match(
				/^(theme|direction|columns|shape|showValues|showConnections|layout|orientation)\s/
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

		newLines.push(line);
	}

	warnings.push('Category tags from tableHierarchy have been removed');

	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}
