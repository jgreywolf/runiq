import { describe, expect, it } from 'vitest';
import { ProfileName } from '$lib/types';
import {
	hasAnySelection,
	hasPrimarySelection,
	shouldClearElementToolbar,
	shouldRepositionElementToolbar
} from './elementToolbarVisibility';

describe('elementToolbarVisibility', () => {
	it('detects primary selection', () => {
		expect(hasPrimarySelection('n1', null)).toBe(true);
		expect(hasPrimarySelection(null, 'e1')).toBe(true);
		expect(hasPrimarySelection(null, null)).toBe(false);
	});

	it('detects any selection across primary + multi-select sets', () => {
		expect(
			hasAnySelection({
				selectedNodeId: null,
				selectedEdgeId: null,
				selectedNodeIdsSize: 1,
				selectedEdgeIdsSize: 0
			})
		).toBe(true);
		expect(
			hasAnySelection({
				selectedNodeId: null,
				selectedEdgeId: null,
				selectedNodeIdsSize: 0,
				selectedEdgeIdsSize: 0
			})
		).toBe(false);
	});

	it('clears toolbar when not in diagram select mode with selection', () => {
		expect(
			shouldClearElementToolbar({
				selectedNodeId: 'n1',
				selectedEdgeId: null,
				profileName: ProfileName.diagram,
				mode: 'select'
			})
		).toBe(false);
		expect(
			shouldClearElementToolbar({
				selectedNodeId: 'n1',
				selectedEdgeId: null,
				profileName: ProfileName.timeline,
				mode: 'select'
			})
		).toBe(true);
		expect(
			shouldClearElementToolbar({
				selectedNodeId: 'n1',
				selectedEdgeId: null,
				profileName: ProfileName.diagram,
				mode: 'connect'
			})
		).toBe(true);
		expect(
			shouldClearElementToolbar({
				selectedNodeId: null,
				selectedEdgeId: null,
				profileName: ProfileName.diagram,
				mode: 'select'
			})
		).toBe(true);
	});

	it('repositions toolbar only in diagram select mode with primary selection', () => {
		expect(
			shouldRepositionElementToolbar({
				selectedNodeId: 'n1',
				selectedEdgeId: null,
				profileName: ProfileName.diagram,
				mode: 'select'
			})
		).toBe(true);
		expect(
			shouldRepositionElementToolbar({
				selectedNodeId: null,
				selectedEdgeId: null,
				profileName: ProfileName.diagram,
				mode: 'select'
			})
		).toBe(false);
		expect(
			shouldRepositionElementToolbar({
				selectedNodeId: 'n1',
				selectedEdgeId: null,
				profileName: ProfileName.diagram,
				mode: 'connect'
			})
		).toBe(false);
	});
});
