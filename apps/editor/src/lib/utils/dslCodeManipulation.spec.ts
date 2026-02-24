import { describe, expect, it } from 'vitest';
import {
	editLabel,
	editStyleProperty,
	resetStyles,
	getInsertedShapeId,
	insertEdge,
	insertShape
} from './dslCodeManipulation';

describe('dslCodeManipulation.insertShape', () => {
	it('inserts shape before closing brace of diagram block', () => {
		const code = `diagram "Example" {\n  shape a as @rectangle label:"A"\n}`;
		const updated = insertShape(code, 'shape id as @circle label:"New"', 2);

		expect(updated).toContain('shape id2 as @circle label:"New"');
		expect(updated.indexOf('shape id2 as @circle label:"New"')).toBeLessThan(updated.lastIndexOf('}'));
	});

	it('avoids duplicate ids when inserting a shape', () => {
		const code = `diagram "Example" {\n  shape id2 as @rectangle label:"A"\n}`;
		const updated = insertShape(code, 'shape id as @circle label:"New"', 2);
		expect(updated).toContain('shape id3 as @circle label:"New"');
	});

	it('inserts multiline snippets fully within the profile block with indentation', () => {
		const code = `diagram "Example" {\n  shape a as @rectangle label:"A"\n}`;
		const snippet = `container "Group" {\nshape id as @rectangle label:"Node"\n}`;
		const updated = insertShape(code, snippet, 3);

		expect(updated).toContain('\n  container "Group" {');
		expect(updated).toContain('\n  shape id3 as @rectangle label:"Node"');
		expect(updated).toContain('\n  }');
		expect(updated.trim().endsWith('}')).toBe(true);
	});
});

describe('dslCodeManipulation.insertEdge', () => {
	it('inserts first edge after shape declarations', () => {
		const code = `diagram "Example" {\n  shape a as @rectangle label:"A"\n  shape b as @rectangle label:"B"\n}`;
		const updated = insertEdge(code, 'a', 'b');

		expect(updated).toContain('\n  shape b as @rectangle label:"B"\n  a -> b\n}');
	});

	it('appends additional edges after existing edge declarations', () => {
		const code = `diagram "Example" {\n  shape a as @rectangle label:"A"\n  shape b as @rectangle label:"B"\n  a -> b\n}`;
		const updated = insertEdge(code, 'b', 'a');

		expect(updated).toContain('\n  a -> b\n  b -> a\n}');
	});
});

describe('dslCodeManipulation location-aware edits', () => {
	it('edits shape label using location hint', () => {
		const code = `diagram "Example" {\n  shape n1 as @rectangle label:"Old"\n}`;
		const updated = editLabel(code, 'n1', 'New', false, { startLine: 2 });
		expect(updated).toContain('shape n1 as @rectangle label:"New"');
	});

	it('edits edge style using edge location hint', () => {
		const code = `diagram "Example" {\n  a -> b\n}`;
		const updated = editStyleProperty(code, 'a-b', 'routing', 'orthogonal', { startLine: 2 });
		expect(updated).toContain('a -> b routing:orthogonal');
	});

	it('writes edge lineStyle as quoted string', () => {
		const code = `diagram "Example" {\n  a -> b\n}`;
		const updated = editStyleProperty(code, 'a-b', 'lineStyle', 'dashed', { startLine: 2 });
		expect(updated).toContain('a -> b lineStyle:"dashed"');
	});

	it('resetStyles removes inline lineStyle', () => {
		const code = `diagram "Example" {\n  a -> b lineStyle:"dashed" strokeColor:"#ff0000"\n}`;
		const updated = resetStyles(code, ['a-b']);
		expect(updated).toContain('a -> b');
		expect(updated).not.toContain('lineStyle:');
		expect(updated).not.toContain('strokeColor:');
	});

	it('detects inserted shape id from code diff', () => {
		const before = `diagram "Example" {\n  shape a as @rectangle\n}`;
		const after = `diagram "Example" {\n  shape a as @rectangle\n  shape id9 as @rectangle\n}`;
		expect(getInsertedShapeId(before, after)).toBe('id9');
	});
});
