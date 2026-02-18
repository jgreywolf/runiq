import { describe, expect, it } from 'vitest';
import {
	findNonOverlappingPreviewPoint,
	getQuickConnectBehaviorFromModifiers,
	offsetPointInDirection,
	selectDirectionalTarget,
	type CanvasNodeBox
} from './quickConnect';

const baseNodes: CanvasNodeBox[] = [
	{ id: 'a', left: 80, right: 140, top: 80, bottom: 120, centerX: 110, centerY: 100 },
	{ id: 'b', left: 180, right: 240, top: 80, bottom: 120, centerX: 210, centerY: 100 },
	{ id: 'c', left: 260, right: 320, top: 88, bottom: 128, centerX: 290, centerY: 108 }
];

describe('quickConnect utils', () => {
	it('maps key modifiers to behavior', () => {
		expect(getQuickConnectBehaviorFromModifiers()).toBe('auto');
		expect(getQuickConnectBehaviorFromModifiers({})).toBe('auto');
		expect(getQuickConnectBehaviorFromModifiers({ shiftKey: true })).toBe('existing');
		expect(getQuickConnectBehaviorFromModifiers({ altKey: true })).toBe('new');
		expect(getQuickConnectBehaviorFromModifiers({ altKey: true, shiftKey: true })).toBe('new');
	});

	it('offsets points by direction', () => {
		expect(offsetPointInDirection({ x: 10, y: 10 }, 'right', 5)).toEqual({ x: 15, y: 10 });
		expect(offsetPointInDirection({ x: 10, y: 10 }, 'left', 5)).toEqual({ x: 5, y: 10 });
		expect(offsetPointInDirection({ x: 10, y: 10 }, 'top', 5)).toEqual({ x: 10, y: 5 });
		expect(offsetPointInDirection({ x: 10, y: 10 }, 'bottom', 5)).toEqual({ x: 10, y: 15 });
	});

	it('in auto mode prefers unconnected candidate in the same direction', () => {
		const result = selectDirectionalTarget({
			sourceNodeId: 'a',
			direction: 'right',
			nodeBoxes: baseNodes,
			connectedTargets: new Set(['b']),
			behavior: 'auto'
		});

		expect(result?.targetNodeId).toBe('c');
		expect(result?.point).toEqual({ x: 260, y: 108 });
	});

	it('in existing mode selects nearest directional target', () => {
		const result = selectDirectionalTarget({
			sourceNodeId: 'a',
			direction: 'right',
			nodeBoxes: baseNodes,
			connectedTargets: new Set(['b']),
			behavior: 'existing'
		});

		expect(result?.targetNodeId).toBe('b');
		expect(result?.point).toEqual({ x: 180, y: 100 });
	});

	it('moves forced-new preview away from overlaps', () => {
		const overlapNodes: CanvasNodeBox[] = [
			{ id: 'a', left: 80, right: 140, top: 80, bottom: 120, centerX: 110, centerY: 100 },
			{ id: 'x', left: 100, right: 220, top: 150, bottom: 210, centerX: 160, centerY: 180 }
		];

		const result = findNonOverlappingPreviewPoint({
			initialPoint: { x: 110, y: 170 },
			direction: 'bottom',
			sourceNodeId: 'a',
			nodeBoxes: overlapNodes,
			previewWidth: 112,
			previewHeight: 44,
			stepDistance: 96,
			maxSteps: 4
		});

		expect(result.y).toBeGreaterThan(170);
	});

	it('returns null when no directional candidate exists', () => {
		const result = selectDirectionalTarget({
			sourceNodeId: 'a',
			direction: 'left',
			nodeBoxes: baseNodes,
			connectedTargets: new Set<string>(),
			behavior: 'auto'
		});
		expect(result).toBeNull();
	});
});
