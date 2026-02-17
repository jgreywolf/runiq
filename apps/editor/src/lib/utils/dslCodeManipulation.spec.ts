import { describe, expect, it } from 'vitest';
import { insertEdge, insertShape } from './dslCodeManipulation';

describe('dslCodeManipulation.insertShape', () => {
	it('inserts shape before closing brace of diagram block', () => {
		const code = `diagram "Example" {\n  shape a as @rectangle label:"A"\n}`;
		const updated = insertShape(code, 'shape id as @circle label:"New"', 2);

		expect(updated).toContain('shape id2 as @circle label:"New"');
		expect(updated.indexOf('shape id2 as @circle label:"New"')).toBeLessThan(updated.lastIndexOf('}'));
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
