import { describe, expect, it } from 'vitest';
import {
	buildGlyphsetAddItemStatement,
	getGlyphsetTypeFromCode,
	isGlyphsetReorderSupported
} from './glyphsetCanvasSupport';

describe('glyphsetCanvasSupport', () => {
	it('detects glyphset type from code', () => {
		const code = `glyphset basicProcess "Flow" {\n  item "A"\n}`;
		expect(getGlyphsetTypeFromCode(code)).toBe('basicProcess');
	});

	it('returns null when code is not a glyphset', () => {
		expect(buildGlyphsetAddItemStatement('diagram "x" {}')).toBeNull();
	});

	it('builds item statement for basic process', () => {
		const code = `glyphset basicProcess "Flow" {\n  item "A"\n}`;
		expect(buildGlyphsetAddItemStatement(code)).toBe('item "New Item"');
	});

	it('builds event statement for events glyphset', () => {
		const code = `glyphset events "Roadmap" {\n  event "Kickoff"\n}`;
		expect(buildGlyphsetAddItemStatement(code)).toBe('event "New Event"');
	});

	it('builds circle statement for venn glyphsets', () => {
		const code = `glyphset venn "Sets" {\n  circle "A"\n  circle "B"\n}`;
		expect(buildGlyphsetAddItemStatement(code)).toBe('circle "Set"');
	});

	it('builds image statement for pictureProcess glyphset', () => {
		const code = `glyphset pictureProcess "Photos" {\n  image "https://example.com/1.jpg" label "One"\n}`;
		expect(buildGlyphsetAddItemStatement(code)).toContain(
			'image "https://images.unsplash.com/photo-1461749280684-dccba630e2f6" label "New Image"'
		);
	});

	it('builds image statement with title for framedPicture glyphset', () => {
		const code = `glyphset framedPicture "Photos" {\n  image "https://example.com/1.jpg" title "One"\n}`;
		expect(buildGlyphsetAddItemStatement(code)).toContain(
			'image "https://images.unsplash.com/photo-1461749280684-dccba630e2f6" title "New Image"'
		);
	});

	it('builds child statement for labeled hierarchy glyphsets', () => {
		const code = `glyphset labeledHierarchy "Org" {\n  root "CEO"\n}`;
		expect(buildGlyphsetAddItemStatement(code)).toBe('child "New Child"');
	});

	it('reports reorder support for configured glyphsets only', () => {
		expect(isGlyphsetReorderSupported('basicProcess')).toBe(true);
		expect(isGlyphsetReorderSupported('events')).toBe(true);
		expect(isGlyphsetReorderSupported('cycle')).toBe(false);
	});
});
