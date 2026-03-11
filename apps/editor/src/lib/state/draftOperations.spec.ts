import { describe, expect, it } from 'vitest';
import { applyDraftOperation } from './draftOperations';

describe('draftOperations', () => {
	it('applies insert-shape operation and increments shape counter', () => {
		const code = `diagram "Test" {\n}`;
		const result = applyDraftOperation(code, 3, {
			type: 'insert-shape',
			shapeCode: 'shape id as @rectangle label:"X"'
		});
		expect(result.newCode).toContain('shape id3 as @rectangle label:"X"');
		expect(result.shapeCounterDelta).toBe(1);
	});

	it('applies insert-edge operation', () => {
		const code = `diagram "Test" {\n  shape a as @rectangle\n  shape b as @rectangle\n}`;
		const result = applyDraftOperation(code, 1, {
			type: 'insert-edge',
			fromNodeId: 'a',
			toNodeId: 'b'
		});
		expect(result.newCode).toContain('a -> b');
		expect(result.shapeCounterDelta).toBe(0);
	});

	it('applies edit label operation', () => {
		const code = `diagram "Test" {\n  shape a as @rectangle label:"Old"\n}`;
		const result = applyDraftOperation(code, 1, {
			type: 'edit',
			targetId: 'a',
			property: 'label',
			value: 'New'
		});
		expect(result.newCode).toContain('label:"New"');
	});

	it('uses location hints for edge edits when available', () => {
		const code = `diagram "Test" {\n  a -> b\n}`;
		const locations = new Map([
			[
				'a-b',
				{
					nodeId: 'a-b',
					startLine: 2,
					startColumn: 3,
					endLine: 2,
					endColumn: 9
				}
			]
		]);
		const result = applyDraftOperation(
			code,
			1,
			{
				type: 'edit',
				targetId: 'a-b',
				property: 'routing',
				value: 'orthogonal'
			},
			locations as any
		);
		expect(result.newCode).toContain('a -> b routing:orthogonal');
	});

	it('insert-shape-and-edge connects to actual inserted unique id', () => {
		const code = `diagram "Test" {\n  shape id1 as @rectangle\n}`;
		const result = applyDraftOperation(code, 1, {
			type: 'insert-shape-and-edge',
			shapeCode: 'shape id as @rectangle label:"New Node"',
			fromNodeId: 'id1',
			toNodeId: 'id1'
		});
		expect(result.newCode).toContain('shape id2 as @rectangle label:"New Node"');
		expect(result.newCode).toContain('id1 -> id2');
	});
});
