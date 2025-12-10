import { type GlyphsetId } from '@runiq/parser-dsl';
import { parameterRegEx, standardKeywordRegex } from './constants';
import { convertLine } from './lineConversions';

/**
 * Flatten a level based structure glyphset by removing blocks
 * Converts nested structure into a flat list of items
 */
export function flattenNestedStructure(
	lines: string[],
	oldGlyphsetId: GlyphsetId,
	newGlyphsetId: GlyphsetId
): string[] {
	let insideLevel = false;
	let depth = 0;
	let itemCount = 0;

	const newLines: string[] = [];

	// Process remaining lines
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmedLine = line.trim();

		// Skip empty lines
		if (!line) {
			continue;
		}

		// Keep comments, theme and other parameters at the top level
		if (!line || line.trim().startsWith('//') || line.trim().match(parameterRegEx)) {
			newLines.push(line);
			continue;
		}

		// Skip group declarations
		if (trimmedLine.match(/^level\s+"[^"]+"\s*\{/)) {
			insideLevel = true;
			depth++;
			continue;
		}

		// // Skip mergePoint
		// if (trimmedLine.match(/^mergePoint\s+"[^"]+"/)) {
		// 	continue;
		// }

		// Handle closing braces
		if (trimmedLine === '}') {
			if (insideLevel && depth > 0) {
				depth--;
				if (depth === 0) {
					insideLevel = false;
				}
				continue;
			} else {
				// Final closing brace
				newLines.push(line);
				continue;
			}
		}

		newLines.push(convertLine(line, oldGlyphsetId, newGlyphsetId, itemCount, i));
		itemCount++;
	}

	return newLines;
}

/**
 * Expand a flat list a nested list by wrapping items in a level
 * Converts flat structure into nested grouped structure
 */
export function expandToNestedStructure(
	lines: string[],
	oldGlyphsetId: GlyphsetId,
	newGlyphsetId: GlyphsetId
): string[] {
	let insideMainBlock = false;
	const newLines: string[] = [];
	const itemLines: string[] = [];
	let itemCount = 0;

	let hasItems = false;

	// Process remaining lines to collect items
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmedLine = line.trim();

		// Skip empty lines at the start
		if (!line && !insideMainBlock) {
			continue;
		}

		if (!insideMainBlock) {
			insideMainBlock = true;
		}

		// Keep theme and other parameters at the top level
		if (trimmedLine.startsWith('//') || trimmedLine.match(parameterRegEx)) {
			newLines.push(line);
			continue;
		}

		const isItem = line.match(standardKeywordRegex);
		if (isItem) {
			hasItems = true;
			itemLines.push(convertLine(line, oldGlyphsetId, newGlyphsetId, itemCount, i));
			itemCount++;
			continue;
		}

		// Final closing brace
		if (line === '}') {
			// Add the level wrappers if we found items (create at least 3 levels)
			if (hasItems) {
				const thirds = Math.ceil(itemLines.length / 3);
				const firstSet = itemLines.slice(0, thirds);
				const secondSet = itemLines.slice(thirds, thirds * 2);
				const thirdSet = itemLines.slice(thirds * 2);
				//First group with first half of items
				newLines.push(`  level "Level 1" {`);
				newLines.push(...firstSet);
				newLines.push(`  }`);
				//Second group with second half of items
				newLines.push(`  level "Level 2" {`);
				newLines.push(...secondSet);
				newLines.push(`  }`);
				//Second group with second half of items
				newLines.push(`  level "Level 3" {`);
				newLines.push(...thirdSet);
				newLines.push(`  }`);
			}
			newLines.push(line);

			break;
		}

		// Keep any other lines that don't match the patterns above
		// (preserves unknown keywords or future additions)
		newLines.push(line);
	}

	return newLines;
}
