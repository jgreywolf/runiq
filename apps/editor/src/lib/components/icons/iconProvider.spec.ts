import { describe, expect, it, beforeEach } from 'vitest';
import { ProfileName } from '$lib/types';
import {
	__clearIconCache,
	__getIconCacheSize,
	getShapeIconDebugInfo,
	getShapeIconSvg
} from './iconProvider';

describe('iconProvider', () => {
	beforeEach(() => {
		__clearIconCache();
	});

	it('routes glyphset icons through glyphset provider', () => {
		const svg = getShapeIconSvg({
			shapeId: 'basicProcess',
			profileName: ProfileName.glyphset,
			size: 24
		});

		expect(svg).toBeTruthy();
		expect(svg).toContain('<svg');
	});

	it('routes BPMN shape ids in diagram profile', () => {
		const svg = getShapeIconSvg({
			shapeId: 'bpmnEventStart',
			profileName: ProfileName.diagram,
			size: 24
		});

		expect(svg).toBeTruthy();
		expect(svg).toContain('<circle');
		expect(svg).not.toContain('font-family="monospace"');
	});

	it('returns railroad snippet icon for railroad profile', () => {
		const svg = getShapeIconSvg({
			shapeId: 'railroad-rule',
			profileName: ProfileName.railroad,
			size: 24
		});

		expect(svg).toBeTruthy();
		expect(svg).toContain('rule');
		expect(svg).toContain('#f8fafc');
	});

	it('returns placeholder for unknown fallback', () => {
		const svg = getShapeIconSvg({
			shapeId: 'unknownShape',
			size: 24
		});

		expect(svg).toBeTruthy();
		expect(svg).toContain('font-family="monospace"');
	});

	it('returns placeholder for snippet-only diagram shapes', () => {
		const svg = getShapeIconSvg({
			shapeId: 'basic-container',
			profileName: ProfileName.diagram,
			size: 24
		});

		expect(svg).toBeTruthy();
		expect(svg).toContain('font-family="monospace"');
	});

	it('memoizes icon generation by request key', () => {
		expect(__getIconCacheSize()).toBe(0);

		const first = getShapeIconSvg({
			shapeId: 'rectangle',
			profileName: ProfileName.diagram,
			size: 24
		});
		const second = getShapeIconSvg({
			shapeId: 'rectangle',
			profileName: ProfileName.diagram,
			size: 24
		});

		expect(first).toBeTruthy();
		expect(second).toBe(first);
		expect(__getIconCacheSize()).toBe(1);
	});

	it('returns debug source and cache status', () => {
		const first = getShapeIconDebugInfo({
			shapeId: 'bpmnEventStart',
			profileName: ProfileName.diagram,
			size: 24
		});
		const second = getShapeIconDebugInfo({
			shapeId: 'bpmnEventStart',
			profileName: ProfileName.diagram,
			size: 24
		});

		expect(first.source).toBe('bpmn');
		expect(first.fromCache).toBe(false);
		expect(second.source).toBe('bpmn');
		expect(second.fromCache).toBe(true);
	});
});
