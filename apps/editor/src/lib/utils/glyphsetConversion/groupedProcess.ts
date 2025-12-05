import { getPrimaryKeyword } from '../glyphsetConversion';
import { createParseError, parseGlyphsetDeclaration, replaceGlyphsetType } from './parsing';
import type { ConversionResult } from './types';

/**
 * Flatten a groupedProcess glyphset by removing group blocks and mergePoint
 * Converts nested structure into a flat list of items
 */
export function flattenGroupedProcess(code: string, targetGlyphsetType: string): ConversionResult {
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
	let insideGroup = false;
	let groupDepth = 0;
	let imageCounter = 11; // For pictureProcess conversions

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
				// Special handling for pictureProcess - convert to image + label format
				if (targetGlyphsetType === 'pictureProcess') {
					const labelMatch = match[2].match(/\s+"([^"]+)"/);
					if (labelMatch) {
						newLines.push(
							`  image "https://i.pravatar.cc/200?img=${imageCounter}" label "${labelMatch[1]}"`
						);
						imageCounter++;
					}
				} else {
					// Use base indentation (not nested)
					newLines.push(`  ${targetKeyword}${match[2]}`);
				}
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
	// Use shared parsing utilities
	const parsed = parseGlyphsetDeclaration(code);
	if (!parsed) {
		return createParseError(code);
	}

	const { glyphsetLineIndex, lines } = parsed;
	const newLines = replaceGlyphsetType(lines, glyphsetLineIndex, 'groupedProcess');
	const warnings: string[] = [];
	const errors: string[] = [];

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

		// Keep empty lines inside the block
		if (!trimmed) {
			newLines.push(line);
			continue;
		}

		// Collect items to wrap in a group (including pictureProcess image+label format)
		// Handle pictureProcess format: image "url" label "text"
		if (trimmed.match(/^image\s+"[^"]+"\s+label\s+"[^"]+"/)) {
			hasItems = true;
			// Extract the label text from pictureProcess format
			const labelMatch = line.match(/^\s*image\s+"[^"]+"\s+label\s+"([^"]+)"/);
			if (labelMatch) {
				itemLines.push(`    item "${labelMatch[1]}"`);
			}
			continue;
		}
		// Handle standard keywords
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

		// Keep any other lines that don't match the patterns above
		// (preserves unknown keywords or future additions)
		newLines.push(line);
	}

	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}
