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

	it('finds sequence participant line from synthetic participant node id', () => {
		const code = `sequence "Auth Flow" {
  participant "User Client" as actor
  participant "API Server" as boundary
  message from:"User Client" to:"API Server" label:"Login"
}`;

		const location = resolveSelectionSourceLocation({
			code,
			profileName: ProfileName.sequence,
			selectedNodeId: 'seq-participant-user_client',
			selectedEdgeId: null
		});

		expect(location).toEqual({ line: 2, column: 1 });
	});

	it('finds sequence message line from synthetic message edge id', () => {
		const code = `sequence "Auth Flow" {
  participant "User Client" as actor
  participant "API Server" as boundary
  message from:"User Client" to:"API Server" label:"Login"
  message from:"API Server" to:"User Client" label:"OK"
}`;

		const location = resolveSelectionSourceLocation({
			code,
			profileName: ProfileName.sequence,
			selectedNodeId: null,
			selectedEdgeId: 'seq-message-1'
		});

		expect(location).toEqual({ line: 5, column: 1 });
	});

	it('finds electrical part line from schematic node id', () => {
		const code = `electrical "Filter" {
  net IN, OUT, GND
  part R1 type:R value:"10k" pins:(IN,OUT)
  part C1 type:C value:"1n" pins:(OUT,GND)
}`;

		const location = resolveSelectionSourceLocation({
			code,
			profileName: ProfileName.electrical,
			selectedNodeId: 'sch-part-R1',
			selectedEdgeId: null
		});

		expect(location).toEqual({ line: 3, column: 1 });
	});

	it('finds electrical net line from schematic edge id', () => {
		const code = `electrical "Filter" {
  net IN, OUT, GND
  part R1 type:R value:"10k" pins:(IN,OUT)
  part C1 type:C value:"1n" pins:(OUT,GND)
}`;

		const location = resolveSelectionSourceLocation({
			code,
			profileName: ProfileName.electrical,
			selectedNodeId: null,
			selectedEdgeId: 'sch-net-OUT-0'
		});

		expect(location).toEqual({ line: 2, column: 1 });
	});
});
