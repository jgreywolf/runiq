import { describe, expect, it } from 'vitest';
import { ProfileName } from '$lib/types';
import {
	buildPositionedRectangleShapeCode,
	shouldShowQuickConnect
} from './quickConnectUtils';

describe('quickConnectUtils', () => {
	it('determines when quick connect handles should be shown', () => {
		expect(shouldShowQuickConnect(ProfileName.diagram, 'connect', null)).toBe(true);
		expect(shouldShowQuickConnect(ProfileName.diagram, 'select', null)).toBe(false);
		expect(shouldShowQuickConnect(ProfileName.timeline, 'connect', null)).toBe(false);
		expect(shouldShowQuickConnect(ProfileName.diagram, 'connect', { x: 10, y: 20 })).toBe(false);
	});

	it('builds positioned rectangle code', () => {
		expect(buildPositionedRectangleShapeCode('id7', { x: 10, y: 20 })).toBe(
			'shape id7 as @rectangle label:"New Node" position:(10,20)'
		);
		expect(buildPositionedRectangleShapeCode('id7', null)).toBe(
			'shape id7 as @rectangle label:"New Node"'
		);
	});
});
