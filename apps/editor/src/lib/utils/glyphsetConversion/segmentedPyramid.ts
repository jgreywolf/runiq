import { getPrimaryKeyword } from '../glyphsetConversion';
import { createParseError, parseGlyphsetDeclaration, replaceGlyphsetType } from './parsing';
import type { ConversionResult } from './types';

/**
 * Flatten a segmentedPyramid glyphset by removing level blocks and extracting items
 * Converts nested level { item ... } structure into a flat list
 */
export function flattenSegmentedPyramid(
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
	let imageCounter = 11; // For pictureProcess conversions

	let insideLevel = false;
	let levelDepth = 0;

	// Process remaining lines
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Skip empty lines
		if (!trimmed) {
			continue;
		}

		// Skip level declarations
		if (trimmed.match(/^level\s+"[^"]+"\s*\{/)) {
			insideLevel = true;
			levelDepth++;
			continue;
		}

		// Handle closing braces
		if (trimmed === '}') {
			if (insideLevel && levelDepth > 0) {
				levelDepth--;
				if (levelDepth === 0) {
					insideLevel = false;
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
 * Expand a flat list glyphset to segmentedPyramid by wrapping items in level blocks
 * Converts flat structure into nested level structure
 */
export function expandToSegmentedPyramid(code: string): ConversionResult {
	// Use shared parsing utilities
	const parsed = parseGlyphsetDeclaration(code);
	if (!parsed) {
		return createParseError(code);
	}

	const { glyphsetLineIndex, lines } = parsed;
	const newLines = replaceGlyphsetType(lines, glyphsetLineIndex, 'segmentedPyramid');
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

		// Handle pictureProcess format: image "url" label "text"
		if (trimmed.match(/^image\s+"[^"]+"\s+label\s+"[^"]+"/)) {
			hasItems = true;
			const labelMatch = line.match(/^\s*image\s+"[^"]+"\s+label\s+"([^"]+)"/);
			if (labelMatch) {
				itemLines.push(`    item "${labelMatch[1]}"`);
			}
			continue;
		}

		// Collect items to wrap in levels
		if (
			trimmed.match(
				/^(item|step|level|stage|person|node|side|input|output|circle|quadrant|spoke|center|event|callout)\s+"[^"]+"/
			)
		) {
			hasItems = true;
			// Convert keyword to 'item' and adjust indentation
			const match = line.match(
				/^(\s*)(item|step|level|stage|person|node|side|input|output|circle|quadrant|spoke|center|event|callout)(\s+"[^"]+")/
			);
			if (match) {
				itemLines.push(`    item${match[3]}`);
			}
			continue;
		}

		// Final closing brace
		if (trimmed === '}') {
			// Add the level wrappers if we found items (distribute across 3-4 levels)
			if (hasItems) {
				const totalItems = itemLines.length;
				// Create a pyramid structure: fewer items at top, more at bottom
				// Example distribution for 10 items: 1, 2, 3, 4
				const levelCounts = [];
				if (totalItems <= 4) {
					// Just one item per level
					for (let j = 0; j < totalItems; j++) {
						levelCounts.push(1);
					}
				} else {
					// Distribute items in a pyramid pattern
					const levels = Math.min(4, Math.ceil(totalItems / 2));
					let remaining = totalItems;
					for (let j = 0; j < levels; j++) {
						const itemsInLevel = Math.ceil(remaining / (levels - j));
						levelCounts.push(Math.min(itemsInLevel, remaining));
						remaining -= itemsInLevel;
					}
				}

				let itemIndex = 0;
				levelCounts.forEach((count, levelIdx) => {
					const levelName =
						['Top', 'Middle', 'Base', 'Foundation'][levelIdx] || `Level ${levelIdx + 1}`;
					newLines.push(`  level "${levelName}" {`);
					for (let j = 0; j < count && itemIndex < itemLines.length; j++) {
						newLines.push(itemLines[itemIndex]);
						itemIndex++;
					}
					newLines.push('  }');
				});
			}
			newLines.push(line);
			break;
		}

		// Keep any other lines that don't match the patterns above
		newLines.push(line);
	}

	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}
