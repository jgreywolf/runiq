import { describe, expect, it, vi } from 'vitest';
import {
	createGlobalPointerDismissHandler,
	shouldDismissSelection
} from './elementToolbarDismiss';

describe('elementToolbarDismiss', () => {
	it('should dismiss only when selected and click is outside toolbar/popover', () => {
		const node = {} as Node;
		expect(shouldDismissSelection(node, true, false, false)).toBe(true);
		expect(shouldDismissSelection(node, false, false, false)).toBe(false);
		expect(shouldDismissSelection(node, true, true, false)).toBe(false);
		expect(shouldDismissSelection(node, true, false, true)).toBe(false);
		expect(shouldDismissSelection(null, true, false, false)).toBe(false);
	});

	it('handler calls onDismiss when conditions match', () => {
		const onDismiss = vi.fn();
		const handler = createGlobalPointerDismissHandler({
			hasSelection: () => true,
			isInsideToolbar: () => false,
			isInsidePopover: () => false,
			onDismiss
		});
		handler({ target: {} as Node } as PointerEvent);
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	it('handler does not dismiss when target is inside toolbar', () => {
		const onDismiss = vi.fn();
		const handler = createGlobalPointerDismissHandler({
			hasSelection: () => true,
			isInsideToolbar: () => true,
			isInsidePopover: () => false,
			onDismiss
		});
		handler({ target: {} as Node } as PointerEvent);
		expect(onDismiss).not.toHaveBeenCalled();
	});
});
