import type { RenderResult } from './renderingUtils';

type RenderDiagramFn = (
	code: string,
	dataContent: string,
	layoutEngine: string
) => Promise<RenderResult>;

interface RenderLifecycleOptions {
	dslCode: string;
	dataContent: string;
	layoutEngine: string;
	renderDiagram: RenderDiagramFn;
	onEmpty: () => void;
	onStart: () => void;
	onSuccess: (result: RenderResult) => void;
	onError: (message: string) => void;
	onComplete?: () => void;
}

export async function runRenderCycle(options: RenderLifecycleOptions): Promise<void> {
	const {
		dslCode,
		dataContent,
		layoutEngine,
		renderDiagram,
		onEmpty,
		onStart,
		onSuccess,
		onError,
		onComplete
	} = options;

	if (!dslCode.trim()) {
		onEmpty();
		onComplete?.();
		return;
	}

	onStart();

	try {
		const result = await renderDiagram(dslCode, dataContent, layoutEngine);
		onSuccess(result);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		onError(message);
	} finally {
		onComplete?.();
	}
}

export function createDebouncedRunner<TArgs extends unknown[]>(
	delayMs: number,
	callback: (...args: TArgs) => void
) {
	let timer: ReturnType<typeof setTimeout> | undefined;

	return {
		schedule: (...args: TArgs) => {
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => callback(...args), delayMs);
		},
		cancel: () => {
			if (timer) {
				clearTimeout(timer);
				timer = undefined;
			}
		}
	};
}
