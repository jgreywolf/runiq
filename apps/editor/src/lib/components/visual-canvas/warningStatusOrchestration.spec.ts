import { describe, expect, it, vi } from 'vitest';
import type { WarningDetail } from '@runiq/parser-dsl';
import {
	applyRenderEmptyState,
	applyRenderErrorState,
	applyRenderSuccessState,
	computeWarningUiState,
	getFloatingToolbarTop,
	jumpToWarningLocation,
	shouldForceSelectMode
} from './warningStatusOrchestration';

function createCallbacks() {
	return {
		setSvgOutput: vi.fn(),
		clearErrors: vi.fn(),
		clearWarnings: vi.fn(),
		setErrors: vi.fn(),
		setWarnings: vi.fn(),
		setWarningDetails: vi.fn(),
		setParseTime: vi.fn(),
		setRenderTime: vi.fn(),
		setNodeLocations: vi.fn(),
		clearNodeLocations: vi.fn(),
		setProfile: vi.fn(),
		handleParse: vi.fn()
	};
}

describe('warningStatusOrchestration', () => {
	it('computes warning UI state from warning details + diagram + lint warnings', () => {
		const detail = [{ message: 'detail-warning' }] as WarningDetail[];
		const result = computeWarningUiState({
			warningDetails: detail,
			diagramWarnings: ['diagram-warning', 'detail-warning'],
			lintWarnings: ['lint-warning'],
			currentShowWarnings: false,
			lastWarningCount: 0
		});

		expect(result.combinedWarnings).toEqual(['diagram-warning', 'lint-warning']);
		expect(result.showWarnings).toBe(true);
		expect(result.lastWarningCount).toBe(3);
	});

	it('forces select mode only when errors exist and mode is not select', () => {
		expect(shouldForceSelectMode(1, 'connect')).toBe(true);
		expect(shouldForceSelectMode(0, 'connect')).toBe(false);
		expect(shouldForceSelectMode(1, 'select')).toBe(false);
	});

	it('computes floating toolbar top offset from warning visibility', () => {
		expect(getFloatingToolbarTop(true, 1, 0)).toBe('120px');
		expect(getFloatingToolbarTop(false, 1, 0)).toBe('66px');
		expect(getFloatingToolbarTop(true, 0, 0)).toBe('66px');
	});

	it('applies empty render state', () => {
		const callbacks = createCallbacks();
		applyRenderEmptyState(callbacks);
		expect(callbacks.setSvgOutput).toHaveBeenCalledWith('');
		expect(callbacks.clearErrors).toHaveBeenCalled();
		expect(callbacks.clearWarnings).toHaveBeenCalled();
		expect(callbacks.setWarningDetails).toHaveBeenCalledWith([]);
		expect(callbacks.setParseTime).toHaveBeenCalledWith(0);
		expect(callbacks.setRenderTime).toHaveBeenCalledWith(0);
		expect(callbacks.handleParse).toHaveBeenCalledWith(true, []);
	});

	it('applies successful render state', () => {
		const callbacks = createCallbacks();
		const nodeLocations = new Map<string, any>([['n1', { x: 10, y: 20 }]]);
		applyRenderSuccessState(
			{
				svg: '<svg></svg>',
				errors: [],
				warnings: ['warn'],
				warningDetails: [],
				parseTime: 12,
				renderTime: 34,
				success: true,
				nodeLocations,
				profile: { nodes: [], edges: [] } as any
			},
			callbacks
		);
		expect(callbacks.setSvgOutput).toHaveBeenCalledWith('<svg></svg>');
		expect(callbacks.setWarnings).toHaveBeenCalledWith(['warn']);
		expect(callbacks.setNodeLocations).toHaveBeenCalledWith(nodeLocations);
		expect(callbacks.handleParse).toHaveBeenCalledWith(true, []);
	});

	it('applies render error state', () => {
		const callbacks = createCallbacks();
		applyRenderErrorState('boom', callbacks);
		expect(callbacks.setErrors).toHaveBeenCalledWith(['boom']);
		expect(callbacks.setWarningDetails).toHaveBeenCalledWith([]);
		expect(callbacks.handleParse).toHaveBeenCalledWith(false, ['boom']);
	});

	it('jumps to warning location after tick', async () => {
		const warning = { range: { startLine: 9, startColumn: 3 } } as WarningDetail;
		const setShowCodeEditor = vi.fn();
		const setActiveTab = vi.fn();
		const jumpTo = vi.fn();
		const tick = vi.fn(async () => {});

		await jumpToWarningLocation({
			warning,
			setShowCodeEditor,
			setActiveTab,
			jumpTo,
			tick
		});

		expect(setShowCodeEditor).toHaveBeenCalledWith(true);
		expect(setActiveTab).toHaveBeenCalledWith('syntax');
		expect(tick).toHaveBeenCalled();
		expect(jumpTo).toHaveBeenCalledWith(9, 3);
	});
});
