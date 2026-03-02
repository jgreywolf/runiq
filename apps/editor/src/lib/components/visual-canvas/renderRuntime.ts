import { createDebouncedRunner, runRenderCycle } from './renderController';
import type { RenderDiagramResult } from './renderingUtils';

interface RenderRuntimeCallbacks {
	onEmpty: () => void;
	onStart: () => void;
	onSuccess: (result: RenderDiagramResult) => void;
	onError: (errorMessage: string) => void;
	onComplete: () => void;
}

interface RenderRuntimeOptions extends RenderRuntimeCallbacks {
	getDataContent: () => string;
	getLayoutEngine: () => string;
	renderDiagram: (
		dslCode: string,
		dataContent?: string,
		layoutEngine?: string
	) => Promise<RenderDiagramResult>;
	debounceMs?: number;
}

export interface CanvasRenderRuntime {
	updateInputs: (dslCode: string, dataContent: string) => void;
	cancel: () => void;
}

export function createCanvasRenderRuntime(options: RenderRuntimeOptions): CanvasRenderRuntime {
	let lastCode = '';
	let lastDataContent = '';

	const debouncedRender = createDebouncedRunner(options.debounceMs ?? 300, (dslCode: string) => {
		void runRenderCycle({
			dslCode,
			dataContent: options.getDataContent(),
			layoutEngine: options.getLayoutEngine(),
			renderDiagram: options.renderDiagram,
			onEmpty: options.onEmpty,
			onStart: options.onStart,
			onSuccess: options.onSuccess,
			onError: options.onError,
			onComplete: options.onComplete
		});
	});

	return {
		updateInputs(dslCode: string, dataContent: string) {
			if (dslCode !== lastCode || dataContent !== lastDataContent) {
				lastCode = dslCode;
				lastDataContent = dataContent;
				debouncedRender.schedule(dslCode);
			}
		},
		cancel() {
			debouncedRender.cancel();
		}
	};
}
