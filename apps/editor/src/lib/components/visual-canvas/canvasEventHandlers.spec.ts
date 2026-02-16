import { describe, expect, it, vi } from 'vitest';
import { createCanvasEventHandlers } from './canvasEventHandlers';

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

describe('canvasEventHandlers', () => {
	it('deletes all multi-selected elements on Delete key', () => {
		const selection = createSelectionStub();
		selection.selectedNodeIds = new Set(['n1', 'n2']);
		selection.selectedEdgeIds = new Set(['e1']);
		const handleDelete = vi.fn();
		const interactionManager = { clearSelection: vi.fn() } as any;

		const handlers = createCanvasEventHandlers({
			selection,
			viewport: createViewportStub(),
			interactionManager,
			getSvgContainer: () => null,
			handleDelete,
			handleEdit: vi.fn(),
			handleInsertShape: vi.fn()
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
			selection,
			viewport,
			interactionManager: { clearSelection: vi.fn() } as any,
			getSvgContainer: () => svgContainer,
			handleDelete: vi.fn(),
			handleEdit: vi.fn(),
			handleInsertShape: vi.fn()
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
			selection: createSelectionStub(),
			viewport: createViewportStub(),
			interactionManager: { clearSelection: vi.fn() } as any,
			getSvgContainer: () => null,
			handleDelete: vi.fn(),
			handleEdit: vi.fn(),
			handleInsertShape
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
});
