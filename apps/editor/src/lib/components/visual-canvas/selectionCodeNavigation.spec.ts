import { describe, expect, it } from 'vitest';
import { ProfileName } from '$lib/types';
import { resolveSelectionSourceLocation } from './selectionCodeNavigation';

describe('resolveSelectionSourceLocation', () => {
	it('finds diagram shape line from node id', () => {
		const code = `diagram "Example" {
  shape A as @rectangle label:"A"
  shape B as @rectangle label:"B"
  A -> B
}`;

		const location = resolveSelectionSourceLocation({
			code,
			profileName: ProfileName.diagram,
			selectedNodeId: 'B',
			selectedEdgeId: null
		});

		expect(location).toEqual({ line: 3, column: 1 });
	});

	it('finds diagram edge line from edge endpoints', () => {
		const code = `diagram "Example" {
  shape A as @rectangle label:"A"
  shape B as @rectangle label:"B"
  A -Yes-> B
}`;

		const location = resolveSelectionSourceLocation({
			code,
			profileName: ProfileName.diagram,
			selectedNodeId: null,
			selectedEdgeId: 'A-B-0',
			selectedEdgeFrom: 'A',
			selectedEdgeTo: 'B'
		});

		expect(location).toEqual({ line: 4, column: 1 });
	});

	it('finds timeline event line from node id', () => {
		const code = `timeline "Launch" {
  event kickoff date:"2024-01-01" label:"Kickoff"
  milestone goLive date:"2024-03-01" label:"Go Live"
}`;

		const location = resolveSelectionSourceLocation({
			code,
			profileName: ProfileName.timeline,
			selectedNodeId: 'goLive',
			selectedEdgeId: null
		});

		expect(location).toEqual({ line: 3, column: 1 });
	});
});
