import { type GlyphsetId } from '@runiq/parser-dsl';
import { parameterRegEx, standardKeywordRegex } from './constants';
import { convertLine } from './lineConversions';

/**
 * Flatten a groupedProcess glyphset by removing group blocks and mergePoint
 * Converts nested structure into a flat list of items
 */
export function flattenGroupedProcess(
	lines: string[],
	oldGlyphsetId: GlyphsetId,
	newGlyphsetId: GlyphsetId
): string[] {
	let insideGroup = false;
	let groupDepth = 0;
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
		if (trimmedLine.match(/^group\s+"[^"]+"\s*\{/)) {
			insideGroup = true;
			groupDepth++;
			continue;
		}

		// Skip mergePoint
		if (trimmedLine.match(/^mergePoint\s+"[^"]+"/)) {
			continue;
		}

		// Handle closing braces
		if (trimmedLine === '}') {
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

		console.log('Converting line:', line);

		newLines.push(convertLine(line, oldGlyphsetId, newGlyphsetId, itemCount, i));
		itemCount++;
	}

	return newLines;
}

/**
 * Expand a flat list glyphset to groupedProcess by wrapping items in a group
 * Converts flat structure into nested grouped structure
 */
export function expandToGroupedProcess(
	lines: string[],
	oldGlyphsetId: GlyphsetId,
	newGlyphsetId: GlyphsetId
): string[] {
	let insideMainBlock = false;
	let itemCount = 0;

	const newLines: string[] = [];
	const itemLines: string[] = [];
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
			// Add the group wrappers if we found items (create at least 2 groups)
			if (hasItems) {
				const midpoint = Math.ceil(itemLines.length / 2);
				const firstSet = itemLines.slice(0, midpoint);
				const secondSet = itemLines.slice(midpoint);
				//First group with first half of items
				newLines.push(`  group "Group 1" {`);
				newLines.push(...firstSet);
				newLines.push(`  }`);
				//Second group with second half of items
				newLines.push(`  group "Group 2" {`);
				newLines.push(...secondSet);
				newLines.push(`  }`);
				newLines.push('  mergePoint "Result"');
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
