import { isGlyphsetId, type GlyphsetId } from '@runiq/parser-dsl';
import { getGlyphsetKeywords } from './glyphsetConversion';

const REORDERABLE_GLYPHSETS = new Set<GlyphsetId>([
	'basicProcess',
	'stepProcess',
	'basicList',
	'events'
]);

export function getGlyphsetTypeFromCode(code: string): GlyphsetId | null {
	const match = code.match(/^\s*glyphset\s+([A-Za-z_][A-Za-z0-9_-]*)\b/m);
	if (!match) return null;
	return isGlyphsetId(match[1]);
}

export function isGlyphsetReorderSupported(glyphsetType: string | null): boolean {
	const glyphsetId = glyphsetType ? isGlyphsetId(glyphsetType) : null;
	return !!glyphsetId && REORDERABLE_GLYPHSETS.has(glyphsetId);
}

export function buildGlyphsetAddItemStatement(code: string): string | null {
	const glyphsetId = getGlyphsetTypeFromCode(code);
	if (!glyphsetId) return null;

	const keyword = getPreferredGlyphsetAddKeyword(glyphsetId);

	if (keyword === 'event') {
		const next = getNextNumberedLabel(code, /^(\s*event\s+")New Event(?:\s+(\d+))?(")/, 'New Event');
		return `event "${next}"`;
	}

	if (
		keyword === 'circle' ||
		glyphsetId === 'venn' ||
		glyphsetId === 'linearVenn' ||
		glyphsetId === 'steppedVenn' ||
		glyphsetId === 'stackedVenn'
	) {
		const next = getNextNumberedLabel(code, /^(\s*circle\s+")Set(?:\s+([A-Z0-9]+))?(")/, 'Set');
		return `circle "${next}"`;
	}

	if (glyphsetId === 'pictureCallout') {
		const next = getNextNumberedLabel(
			code,
			/^(\s*callout\s+")New Callout(?:\s+(\d+))?(")/,
			'New Callout'
		);
		return `callout "${next}"`;
	}

	if (glyphsetId === 'pictureProcess' || glyphsetId === 'pictureList' || glyphsetId === 'pictureGrid') {
		const next = getNextNumberedLabel(
			code,
			/^(\s*image\s+"[^"]+"\s+label\s+")New Image(?:\s+(\d+))?(")/,
			'New Image'
		);
		return `image "https://images.unsplash.com/photo-1461749280684-dccba630e2f6" label "${next}"`;
	}

	if (glyphsetId === 'framedPicture') {
		const next = getNextNumberedLabel(
			code,
			/^(\s*image\s+"[^"]+"\s+title\s+")New Image(?:\s+(\d+))?(")/,
			'New Image'
		);
		return `image "https://images.unsplash.com/photo-1461749280684-dccba630e2f6" title "${next}"`;
	}

	if (glyphsetId === 'circleHierarchy' || glyphsetId === 'labeledHierarchy') {
		const next = getNextNumberedLabel(
			code,
			/^(\s*child\s+")New Child(?:\s+(\d+))?(")/,
			'New Child'
		);
		return `child "${next}"`;
	}

	const nextItem = getNextNumberedLabel(
		code,
		/^(\s*item\s+")New Item(?:\s+(\d+))?(")/,
		'New Item'
	);
	return `${keyword} "${nextItem}"`;
}

function getPreferredGlyphsetAddKeyword(glyphsetId: GlyphsetId): string {
	const keywords = getGlyphsetKeywords(glyphsetId);
	if (!keywords || keywords.length === 0) return 'item';

	// Prefer appendable child/member/item keywords where present.
	if (keywords.includes('item')) return 'item';
	if (keywords.includes('child')) return 'child';
	if (keywords.includes('member')) return 'member';
	if (glyphsetId === 'pictureCallout' && keywords.includes('callout')) return 'callout';

	// Multi-key glyphsets often have a primary/root keyword + secondary content keyword.
	if (keywords.length > 1) return keywords[keywords.length - 1] ?? keywords[0];
	return keywords[0];
}

function getNextNumberedLabel(code: string, pattern: RegExp, baseLabel: string): string {
	const lines = code.split('\n');
	let max = 0;
	for (const line of lines) {
		const match = line.match(pattern);
		if (!match) continue;
		const suffix = match[2];
		if (!suffix) {
			max = Math.max(max, 1);
			continue;
		}
		const parsed = Number.parseInt(suffix, 10);
		if (Number.isFinite(parsed)) {
			max = Math.max(max, parsed);
		}
	}
	return max <= 0 ? baseLabel : `${baseLabel} ${max + 1}`;
}
