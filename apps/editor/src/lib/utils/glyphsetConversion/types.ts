/**
 * Type definitions for glyphset conversion system
 */

export interface ConversionResult {
	success: boolean;
	newCode: string;
	warnings: string[];
	errors: string[];
	incompatible?: boolean;
	alternatives?: string[];
	canConvert?: boolean;
}

export interface ParsedGlyphset {
	glyphsetLineIndex: number;
	glyphsetType: string;
	glyphsetName?: string;
	lines: string[];
}
