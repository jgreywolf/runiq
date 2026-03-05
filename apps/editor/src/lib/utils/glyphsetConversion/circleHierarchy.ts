import { getPrimaryKeyword } from '../glyphsetConversion';
import { createParseError, parseGlyphsetDeclaration, replaceGlyphsetType } from './parsing';
import type { ConversionResult } from './types';

/**
 * Flatten circleHierarchy by converting root and child to flat list
 */
export function flattenCircleHierarchy(code: string, targetGlyphsetType: string): ConversionResult {
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

	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		if (!trimmed) {
			newLines.push(line);
			continue;
		}

		if (trimmed.match(/^(root|child)\s+"[^"]+"/)) {
			const match = line.match(/^(\s*)(root|child)\s+"([^"]+)"/);
			if (match) {
				const labelText = match[3];
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

		if (trimmed.match(/^(theme|direction|columns|shape|showValues|layout|orientation)\s/)) {
			newLines.push(line);
			continue;
		}

		if (trimmed.startsWith('//')) {
			newLines.push(line);
			continue;
		}

		if (trimmed === '}') {
			newLines.push(line);
			continue;
		}

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
 * Expand a flat list glyphset to circleHierarchy by designating first item as root
 */
export function expandToCircleHierarchy(code: string): ConversionResult {
	// Use shared parsing utilities
	const parsed = parseGlyphsetDeclaration(code);
	if (!parsed) {
		return createParseError(code);
	}

	const { glyphsetLineIndex, lines } = parsed;
	const newLines = replaceGlyphsetType(lines, glyphsetLineIndex, 'circleHierarchy');
	const warnings: string[] = [];
	const errors: string[] = [];

	let hasItems = false;
	let isFirstItem = true;
	const itemLines: string[] = [];

	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		if (!trimmed) {
			continue;
		}

		if (
			trimmed.match(
				/^(theme|direction|columns|shape|showValues|showPercentages|layout|orientation)\s/
			)
		) {
			newLines.push(line);
			continue;
		}

		if (trimmed.startsWith('//')) {
			newLines.push(line);
			continue;
		}

		if (trimmed.match(/^image\s+"[^"]+"\s+label\s+"[^"]+"/)) {
			hasItems = true;
			const labelMatch = line.match(/^\s*image\s+"[^"]+"\s+label\s+"([^"]+)"/);
			if (labelMatch) {
				if (isFirstItem) {
					newLines.push(`  root "${labelMatch[1]}"`);
					isFirstItem = false;
				} else {
					itemLines.push(`  child "${labelMatch[1]}"`);
				}
			}
			continue;
		}

		if (
			trimmed.match(
				/^(item|step|level|stage|person|node|side|input|output|circle|quadrant|spoke|center|event|callout|root|child)\s+"[^"]+"/
			)
		) {
			hasItems = true;
			const match = line.match(
				/^(\s*)(item|step|level|stage|person|node|side|input|output|circle|quadrant|spoke|center|event|callout|root|child)(\s+"[^"]+")/
			);
			if (match) {
				if (isFirstItem) {
					newLines.push(`  root${match[3]}`);
					isFirstItem = false;
				} else {
					itemLines.push(`  child${match[3]}`);
				}
			}
			continue;
		}

		if (trimmed === '}') {
			newLines.push(...itemLines);
			newLines.push(line);
			break;
		}
	}

	if (!hasItems) {
		warnings.push('No items found to convert');
	} else {
		warnings.push('First item designated as root, remaining items converted to children');
	}

	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}
