export interface DebugLogger {
	log: (name: string, payload?: unknown) => void;
}

/**
 * Creates an opt-in console logger for VisualCanvas debug traces.
 * Enable in DevTools:
 *   window.__RUIQ_DEBUG_CANVAS__ = true
 *   window.__RUIQ_DEBUG_CANVAS_BREAK__ = true
 */
export function createCanvasDebugLogger(namespace = 'canvas-debug'): DebugLogger {
	const counters = new Map<string, number>();

	function isEnabled(): boolean {
		try {
			return Boolean((window as any).__RUIQ_DEBUG_CANVAS__);
		} catch {
			return false;
		}
	}

	function isBreakEnabled(): boolean {
		try {
			return Boolean((window as any).__RUIQ_DEBUG_CANVAS_BREAK__);
		} catch {
			return false;
		}
	}

	return {
		log(name: string, payload?: unknown) {
			if (!isEnabled()) return;
			const nextCount = (counters.get(name) ?? 0) + 1;
			counters.set(name, nextCount);
			console.log(`[${namespace}] ${name} #${nextCount}`, payload ?? '');
			if (isBreakEnabled()) debugger;
		}
	};
}

