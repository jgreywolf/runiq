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

	it('builds callout statement for pictureCallout glyphset', () => {
		const code = `glyphset pictureCallout "Highlights" {\n  image "https://example.com/a.jpg"\n  callout "Note A"\n}`;
		expect(buildGlyphsetAddItemStatement(code)).toBe('callout "New Callout"');
	});

	it('builds member statement for teamHierarchy glyphset', () => {
		const code = `glyphset teamHierarchy "Team" {\n  team "Product"\n  leader "Alex"\n}`;
		expect(buildGlyphsetAddItemStatement(code)).toBe('member "New Item"');
	});

	it('builds person statement for orgChart glyphset', () => {
		const code = `glyphset orgChart "Org" {\n  person "CEO"\n}`;
		expect(buildGlyphsetAddItemStatement(code)).toBe('person "New Item"');
	});

	it('builds item statement for multi-key flat glyphsets that append items', () => {
		const clusterCode = `glyphset cluster "Ideas" {\n  center "Theme"\n  item "A"\n}`;
		const divergingCode = `glyphset diverging "Plan" {\n  source "Goal"\n  item "Task 1"\n}`;
		const convergingCode = `glyphset converging "Plan" {\n  target "Outcome"\n  item "Input 1"\n}`;

		expect(buildGlyphsetAddItemStatement(clusterCode)).toBe('item "New Item"');
		expect(buildGlyphsetAddItemStatement(divergingCode)).toBe('item "New Item"');
		expect(buildGlyphsetAddItemStatement(convergingCode)).toBe('item "New Item"');
	});

	it('reports reorder support for configured glyphsets only', () => {
		expect(isGlyphsetReorderSupported('basicProcess')).toBe(true);
		expect(isGlyphsetReorderSupported('events')).toBe(true);
		expect(isGlyphsetReorderSupported('cycle')).toBe(false);
	});
});
