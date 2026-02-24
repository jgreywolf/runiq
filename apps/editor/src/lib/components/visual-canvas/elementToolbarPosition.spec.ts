import { describe, expect, it } from 'vitest';
import {
	computeElementToolbarPosition,
	constrainToolbarPosition
} from './elementToolbarPosition';

describe('elementToolbarPosition', () => {
	it('returns null position when container is missing', () => {
		const result = computeElementToolbarPosition(null, 'n1', null);
		expect(result).toBeNull();
	});

	it('constrains toolbar position within canvas bounds', () => {
		const position = { x: 4, y: 3 };
		const containerRect = { width: 300, height: 200 } as DOMRect;
		const toolbarRect = { width: 100, height: 40 } as DOMRect;
		const result = constrainToolbarPosition(position, containerRect, toolbarRect);
		expect(result.x).toBeGreaterThanOrEqual(60);
		expect(result.y).toBeGreaterThanOrEqual(50);
	});
});

