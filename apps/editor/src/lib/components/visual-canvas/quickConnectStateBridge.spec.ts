import { describe, expect, it } from 'vitest';
import { withQuickConnectState } from './quickConnectStateBridge';
import type { QuickConnectState } from './quickConnectActions';

function createState(): QuickConnectState {
	return {
		quickConnectNodeId: 'n1',
		quickConnectHandles: [],
		quickConnectActiveDirection: null,
		quickConnectPreviewStart: null,
		quickConnectPreviewEnd: null,
		quickConnectTargetNodeId: null,
		quickConnectNewNodePosition: null
	};
}

describe('quickConnectStateBridge', () => {
	it('reads, mutates, and writes quick-connect state via bindings', () => {
		let backingState = createState();

		const result = withQuickConnectState(
			{
				read: () => ({ ...backingState }),
				write: (next) => {
					backingState = next;
				}
			},
			(state) => {
				state.quickConnectNodeId = 'n2';
				state.quickConnectTargetNodeId = 'n3';
				return 'ok';
			}
		);

		expect(result).toBe('ok');
		expect(backingState.quickConnectNodeId).toBe('n2');
		expect(backingState.quickConnectTargetNodeId).toBe('n3');
	});
});
