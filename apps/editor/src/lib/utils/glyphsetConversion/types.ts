/**
 * Type definitions for glyphset conversion system
 */

import type { GlyphsetId } from '@runiq/parser-dsl';

export interface ConversionResult {
	success: boolean;
	newCode: string;
	warnings: string[];
	errors: string[];
	//compatible?: boolean;
	//alternatives?: string[];
	canConvert?: boolean;
}

export interface ParsedGlyphset {
	glyphsetLineIndex: number;
	oldGlyphsetId: GlyphsetId;
	glyphsetTitle: string;
	lines: string[];
}
