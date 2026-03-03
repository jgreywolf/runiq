import type { QuickConnectState } from './quickConnectActions';

export interface QuickConnectBindings {
	read: () => QuickConnectState;
	write: (state: QuickConnectState) => void;
}

export function withQuickConnectState<T>(
	bindings: QuickConnectBindings,
	action: (state: QuickConnectState) => T
): T {
	const state = bindings.read();
	const result = action(state);
	bindings.write(state);
	return result;
}
