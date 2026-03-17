import { describe, expect, it } from 'vitest';
import { EditorProfileName } from './editorCapabilities.js';
import { resolveSelectionSourceLocation } from './selectionCodeNavigation.js';

describe('resolveSelectionSourceLocation', () => {
	it('finds diagram shape line from node id', () => {
		const code = `diagram "Example" {
  shape A as @rectangle label:"A"
  shape B as @rectangle label:"B"
  A -> B
}`;

		const location = resolveSelectionSourceLocation({
			code,
			profileName: EditorProfileName.diagram,
			selectedNodeId: 'B',
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
			profileName: EditorProfileName.sequence,
			selectedNodeId: 'seq-participant-user_client',
			selectedEdgeId: null
		});

		expect(location).toEqual({ line: 2, column: 1 });
	});

	it('finds electrical net line from schematic edge id', () => {
		const code = `electrical "Filter" {
  net IN, OUT, GND
  part R1 type:R value:"10k" pins:(IN,OUT)
  part C1 type:C value:"1n" pins:(OUT,GND)
}`;

		const location = resolveSelectionSourceLocation({
			code,
			profileName: EditorProfileName.electrical,
			selectedNodeId: null,
			selectedEdgeId: 'sch-net-OUT-0'
		});

		expect(location).toEqual({ line: 2, column: 1 });
	});
});
