import { describe, expect, it, vi } from 'vitest';
import { createCanvasEventHandlers } from './canvasEventHandlers';
import { ProfileName } from '$lib/types';

function createSelectionStub() {
	return {
		editingNodeId: null,
		editingEdgeId: null,
		selectedNodeId: null,
		selectedEdgeId: null,
		selectedNodeIds: new Set<string>(),
		selectedEdgeIds: new Set<string>(),
		hasMultiSelection: false,
		isLassoPending: false,
		isLassoActive: false,
		lassoStartX: 0,
		lassoStartY: 0,
		lassoEndX: 0,
		lassoEndY: 0,
		editingLabel: '',
		cancelLabelEdit: vi.fn(),
		startLasso: vi.fn(),
		updateLasso: vi.fn(),
		completeLasso: vi.fn(),
		cancelLasso: vi.fn(),
		selectAll: vi.fn()
	} as any;
}

function createViewportStub() {
	return {
		mouseX: 0,
		mouseY: 0,
		scale: 1,
		translateX: 0,
		translateY: 0,
		isPanning: false,
		startPan: vi.fn(),
		updatePan: vi.fn(),
		endPan: vi.fn(),
		updateMousePosition: vi.fn(),
		zoom: vi.fn()
	} as any;
}

function createBaseDeps(overrides: Record<string, unknown> = {}) {
	return {
		selection: createSelectionStub(),
		viewport: createViewportStub(),
		interactionManager: { clearSelection: vi.fn() } as any,
		getSvgContainer: () => null,
		getProfileName: () => ProfileName.diagram,
		getMode: () => 'select' as const,
		handleDelete: vi.fn(),
		handleEdit: vi.fn(),
		handleInsertShape: vi.fn(),
		handleInsertEdge: vi.fn(),
		handleInsertShapeAndEdge: vi.fn(),
		getNextShapeId: () => 'id1',
		onConnectPreviewStart: vi.fn(),
		onConnectPreviewMove: vi.fn(),
		onConnectPreviewEnd: vi.fn(),
		...overrides
	} as any;
}

describe('canvasEventHandlers', () => {
	it('deletes all multi-selected elements on Delete key', () => {
		const selection = createSelectionStub();
		selection.selectedNodeIds = new Set(['n1', 'n2']);
		selection.selectedEdgeIds = new Set(['e1']);
		const handleDelete = vi.fn();
		const interactionManager = { clearSelection: vi.fn() } as any;

		const handlers = createCanvasEventHandlers({
			...createBaseDeps({
				selection,
				viewport: createViewportStub(),
				interactionManager,
				handleDelete
			})
		});

		const event = { key: 'Delete', preventDefault: vi.fn() } as any;
		handlers.handleCanvasKeyDown(event);

		expect(handleDelete).toHaveBeenCalledWith('n1', null);
		expect(handleDelete).toHaveBeenCalledWith('n2', null);
		expect(handleDelete).toHaveBeenCalledWith(null, 'e1');
		expect(interactionManager.clearSelection).toHaveBeenCalledOnce();
		expect(event.preventDefault).toHaveBeenCalledOnce();
	});

	it('starts lasso selection on ctrl+left mouse down', () => {
		const selection = createSelectionStub();
		const viewport = createViewportStub();
		const svgContainer = {
			getBoundingClientRect: () => ({ left: 10, top: 20 }),
			querySelector: vi.fn()
		} as any;

		const handlers = createCanvasEventHandlers({
			...createBaseDeps({
				selection,
				viewport,
				getSvgContainer: () => svgContainer
			})
		});

		const event = {
			button: 0,
			ctrlKey: true,
			metaKey: false,
			clientX: 110,
			clientY: 220,
			target: { closest: () => null }
		} as any;

		handlers.handleMouseDown(event);
		expect(selection.startLasso).toHaveBeenCalledWith(100, 200);
		expect(viewport.startPan).not.toHaveBeenCalled();
	});

	it('inserts dropped shape code from drag data', () => {
		const handleInsertShape = vi.fn();
		const handlers = createCanvasEventHandlers({
			...createBaseDeps({
				handleInsertShape
			})
		});

		const event = {
			preventDefault: vi.fn(),
			dataTransfer: {
				getData: (type: string) => (type === 'application/x-runiq-shape' ? 'shape x as @rect' : '')
			}
		} as any;

		handlers.handleDrop(event);
		expect(handleInsertShape).toHaveBeenCalledWith('shape x as @rect');
	});

	it('in connect mode links two nodes on mouse up', () => {
		const svgContainer = {
			querySelector: vi.fn(() => ({ classList: { add: vi.fn(), remove: vi.fn() } }))
		} as any;
		const handleInsertEdge = vi.fn();

		const handlers = createCanvasEventHandlers(
			createBaseDeps({
				getMode: () => 'connect',
				getSvgContainer: () => svgContainer,
				handleInsertEdge
			})
		);

		handlers.handleMouseDown({
			button: 0,
			target: {
				closest: () => ({ getAttribute: () => 'a' })
			}
		} as any);

		handlers.handleMouseUp({
			target: {
				closest: () => ({ getAttribute: () => 'b' })
			}
		} as any);

		expect(handleInsertEdge).toHaveBeenCalledWith('a', 'b');
	});
});
