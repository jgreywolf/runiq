export interface PointerDismissContext {
	hasSelection: () => boolean;
	isInsideToolbar: (target: Node) => boolean;
	isInsidePopover: (target: Node) => boolean;
	onDismiss: () => void;
}

export function shouldDismissSelection(
	target: Node | null,
	hasSelection: boolean,
	insideToolbar: boolean,
	insidePopover: boolean
): boolean {
	if (!hasSelection) return false;
	if (!target) return false;
	return !insideToolbar && !insidePopover;
}

export function createGlobalPointerDismissHandler(context: PointerDismissContext) {
	return (event: PointerEvent) => {
		const target = event.target as Node | null;
		const hasSelection = context.hasSelection();
		const insideToolbar = !!target && context.isInsideToolbar(target);
		const insidePopover = !!target && context.isInsidePopover(target);
		if (!shouldDismissSelection(target, hasSelection, insideToolbar, insidePopover)) return;
		context.onDismiss();
	};
}
