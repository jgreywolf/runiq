import { describe, expect, it, vi } from 'vitest';
import { ProfileName } from '$lib/types';
import {
	activateQuickConnectPreview,
	resetQuickConnectState,
	runQuickConnect,
	updateQuickConnectFromMouseEvent,
	type QuickConnectState
} from './quickConnectActions';

function createState(): QuickConnectState {
	return {
		quickConnectNodeId: 'node-a',
		quickConnectHandles: [{ direction: 'right', x: 10, y: 20 }],
		quickConnectActiveDirection: null,
		quickConnectPreviewStart: null,
		quickConnectPreviewEnd: null,
		quickConnectTargetNodeId: null,
		quickConnectNewNodePosition: null
	};
}

describe('quickConnectActions', () => {
	it('resets quick connect state', () => {
		const state = createState();
		resetQuickConnectState(state);
		expect(state.quickConnectNodeId).toBeNull();
		expect(state.quickConnectHandles).toEqual([]);
		expect(state.quickConnectActiveDirection).toBeNull();
		expect(state.quickConnectPreviewStart).toBeNull();
		expect(state.quickConnectPreviewEnd).toBeNull();
		expect(state.quickConnectTargetNodeId).toBeNull();
		expect(state.quickConnectNewNodePosition).toBeNull();
	});

	it('activates preview for new-node behavior', () => {
		const state = createState();
		activateQuickConnectPreview({
			state,
			svgContainer: null,
			profile: null,
			nodeId: 'node-a',
			direction: 'right',
			behavior: 'new'
		});
		expect(state.quickConnectActiveDirection).toBe('right');
		expect(state.quickConnectPreviewStart).toEqual({ x: 10, y: 20 });
		expect(state.quickConnectPreviewEnd).toBeTruthy();
		expect(state.quickConnectTargetNodeId).toBeNull();
	});

	it('runs new-node connect flow', () => {
		const state = createState();
		const onInsertEdge = vi.fn();
		const onInsertShapeAndEdge = vi.fn();
		runQuickConnect({
			state,
			svgContainer: null,
			profile: null,
			nodeId: 'node-a',
			direction: 'right',
			behavior: 'new',
			newNodeId: 'id42',
			onInsertEdge,
			onInsertShapeAndEdge
		});
		expect(onInsertEdge).not.toHaveBeenCalled();
		expect(onInsertShapeAndEdge).toHaveBeenCalledTimes(1);
		expect(onInsertShapeAndEdge.mock.calls[0][0]).toContain('shape id42 as @rectangle');
		expect(state.quickConnectNodeId).toBeNull();
	});

	it('clears state when behavior is existing but no target is found', () => {
		const state = createState();
		const onInsertEdge = vi.fn();
		const onInsertShapeAndEdge = vi.fn();
		runQuickConnect({
			state,
			svgContainer: null,
			profile: null,
			nodeId: 'node-a',
			direction: 'right',
			behavior: 'existing',
			newNodeId: 'id43',
			onInsertEdge,
			onInsertShapeAndEdge
		});
		expect(onInsertEdge).not.toHaveBeenCalled();
		expect(onInsertShapeAndEdge).not.toHaveBeenCalled();
		expect(state.quickConnectNodeId).toBeNull();
	});

	it('updates hover state from node target in connect mode', () => {
		const state: QuickConnectState = {
			quickConnectNodeId: null,
			quickConnectHandles: [],
			quickConnectActiveDirection: null,
			quickConnectPreviewStart: null,
			quickConnectPreviewEnd: null,
			quickConnectTargetNodeId: null,
			quickConnectNewNodePosition: null
		};

		const target = {
			closest: (selector: string) => {
				if (selector === '.quick-connect-layer') return null;
				if (selector === '[data-node-id]') {
					return { getAttribute: (name: string) => (name === 'data-node-id' ? 'node-z' : null) };
				}
				return null;
			}
		};
		const event = { target, clientX: 0, clientY: 0 } as unknown as MouseEvent;

		updateQuickConnectFromMouseEvent({
			state,
			event,
			profileName: ProfileName.diagram,
			mode: 'connect',
			connectPreviewStart: null,
			svgContainer: null
		});

		expect(state.quickConnectNodeId).toBe('node-z');
	});
});
