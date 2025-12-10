import { getPrimaryKeyword } from '../glyphsetConversion';
import { createParseError, parseGlyphsetDeclaration, replaceGlyphsetType } from './parsing';
import type { ConversionResult } from './types';

/**
 * Flatten matrix glyphsets (segmentedMatrix, titledMatrix, matrix2x2, matrix3x3)
 * These use flat item lists, so just need keyword conversion
 */
export function flattenMatrix(code: string, targetGlyphsetType: string): ConversionResult {
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

	// Process remaining lines - convert item to target keyword
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Convert item or quadrant to target keyword
		if (trimmed.match(/^(item|quadrant)\s+"[^"]+"/)) {
			const match = line.match(/^(\s*)(item|quadrant)(\s+"[^"]+")/);
			if (match) {
				newLines.push(`${match[1]}${targetKeyword}${match[3]}`);
				continue;
			}
		}

		// Keep everything else as-is
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
 * Expand to matrix glyphsets by converting items
 * Handles matrix2x2 (4 items), matrix3x3 (9 items), segmentedMatrix, titledMatrix
 * Warns if item count doesn't match matrix capacity
 */
export function expandToMatrix(code: string, targetMatrixType: string): ConversionResult {
	// Define matrix capacities
	const matrixCapacity: Record<string, { max: number; keyword: string }> = {
		matrix2x2: { max: 4, keyword: 'item' },
		matrix3x3: { max: 9, keyword: 'item' },
		segmentedMatrix: { max: Infinity, keyword: 'item' },
		titledMatrix: { max: Infinity, keyword: 'item' }
	};

	const capacity = matrixCapacity[targetMatrixType];
	if (!capacity) {
		return {
			success: false,
			newCode: code,
			warnings: [],
			errors: [`Unknown matrix type: ${targetMatrixType}`]
		};
	}

	// Use shared parsing utilities
	const parsed = parseGlyphsetDeclaration(code);
	if (!parsed) {
		return createParseError(code);
	}

	const { glyphsetLineIndex, lines } = parsed;
	const newLines = replaceGlyphsetType(lines, glyphsetLineIndex, targetMatrixType);
	const warnings: string[] = [];
	const errors: string[] = [];

	// Count items and convert keywords
	let itemCount = 0;
	const sourceKeywords = [
		'item',
		'step',
		'level',
		'stage',
		'person',
		'node',
		'circle',
		'event',
		'spoke'
	];

	// Process remaining lines
	for (let i = glyphsetLineIndex + 1; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Skip non-item lines
		if (
			!trimmed ||
			trimmed.startsWith('//') ||
			trimmed === '}' ||
			trimmed.match(/^(theme|direction|columns|shape|showValues|layout|orientation)\s/)
		) {
			newLines.push(line);
			continue;
		}

		// Convert source keywords to target keyword
		let converted = false;
		for (const keyword of sourceKeywords) {
			const match = line.match(new RegExp(`^(\\s*)${keyword}(\\s+"[^"]+")`));
			if (match) {
				itemCount++;
				if (itemCount <= capacity.max) {
					newLines.push(`${match[1]}${capacity.keyword}${match[2]}`);
				}
				// Skip items beyond capacity (data loss)
				converted = true;
				break;
			}
		}

		if (!converted) {
			newLines.push(line);
		}
	}

	// Add warnings about data loss
	if (itemCount > capacity.max) {
		warnings.push(
			`⚠️ Data loss: Found ${itemCount} items, but ${targetMatrixType} only supports ${capacity.max}. Extra items were removed.`
		);
	}

	// Add info about item count
	if (itemCount < capacity.max && capacity.max !== Infinity) {
		warnings.push(
			`ℹ️ Note: ${targetMatrixType} is designed for ${capacity.max} items. You currently have ${itemCount}.`
		);
	}

	return {
		success: true,
		newCode: newLines.join('\n'),
		warnings,
		errors
	};
}
