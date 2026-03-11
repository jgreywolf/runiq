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

	it('does not write when action produces no state changes', () => {
		let backingState = createState();
		let writeCount = 0;

		const result = withQuickConnectState(
			{
				read: () => ({ ...backingState }),
				write: (next) => {
					writeCount += 1;
					backingState = next;
				}
			},
			() => 'noop'
		);

		expect(result).toBe('noop');
		expect(writeCount).toBe(0);
		expect(backingState.quickConnectNodeId).toBe('n1');
	});
});
