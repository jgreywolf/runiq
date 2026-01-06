import { isNestedGlyphset } from '@runiq/glyphsets';
import { GlyphsetIds, isPictureGlyphset, type GlyphsetId } from '@runiq/parser-dsl';
import { getGlyphsetKeywords } from '../glyphsetConversion';
import { imageWithLabelRegex, standardKeywordRegex } from './constants';

export const convertLine = (
	line: string,
	oldGlyphsetId: GlyphsetId,
	newGlyphsetId: GlyphsetId,
	itemCount: number,
	index: number
): string => {
	// Get target keyword
	const keywords = getGlyphsetKeywords(newGlyphsetId);
	const targetKeyword = keywords[0]; // Primary keyword for target glyphset
	let indent = '  ';
	let labelText = '';

	if (isNestedGlyphset(newGlyphsetId)) {
		indent = '    ';
	}

	// Try to extract indent, old keyword and label
	const itemMatch = line.match(standardKeywordRegex);
	if (itemMatch) {
		labelText = itemMatch[3];
	}

	// check for special handling
	if (newGlyphsetId === GlyphsetIds.detailedProcess) {
		if (itemCount > 4) {
			// detailedProcess can only handle five lines properly without overcrowding
			return `// ${line}`;
		} else {
			return convertLineToDetailedProcess(line, labelText, oldGlyphsetId, targetKeyword, indent);
		}
	} else if (isPictureGlyphset(newGlyphsetId)) {
		return convertLineToPictureLine(line, labelText, targetKeyword, index);
	} else if (isPictureGlyphset(oldGlyphsetId)) {
		return convertFromPictureLine(line, labelText, targetKeyword, indent);
	}

	return `${indent}${targetKeyword} "${labelText}"`;
};

export const convertLineToPictureLine = (
	line: string,
	labelText: string,
	targetKeyword: string,
	index: number
): string => {
	let imageUrl = null;

	// const itemMatch = line.match(standardKeywordRegex);
	//	if (itemMatch) {
	const pictureLineMatch = line.match(imageWithLabelRegex);
	if (pictureLineMatch) {
		// Already in image format, keep as-is since target also uses 'image'
		return line;
	}

	imageUrl = `https://i.pravatar.cc/200?img=${index}`;
	//	}

	return `  ${targetKeyword} "${imageUrl}" label "${labelText}"`;
};

export const convertFromPictureLine = (
	line: string,
	labelText: string,
	targetKeyword: string,
	indent: string
): string => {
	const pictureLineMatch = line.match(imageWithLabelRegex);
	if (pictureLineMatch) {
		labelText = pictureLineMatch[1];
	}

	return `${indent}${targetKeyword} "${labelText}"`;
};

export const convertLineToDetailedProcess = (
	line: string,
	labelText: string,
	oldGlyphsetId: GlyphsetId,
	targetKeyword: string,
	indent: string
): string => {
	// Try to extract indent, old keyword and label
	// const itemMatch = line.match(standardKeywordRegex);

	// if (itemMatch) {
	//	labelText = itemMatch[3];

	if (isPictureGlyphset(oldGlyphsetId)) {
		const labelMatch = line.match(imageWithLabelRegex);
		if (labelMatch) {
			labelText = labelMatch[1];
		}
	}

	// If label doesn't already contain a pipe separator, add one to indicate substeps are possible
	if (!labelText.includes(' | ')) {
		labelText = labelText + ' | ';
	}
	//}

	return `${indent}${targetKeyword} "${labelText}"`;
};
