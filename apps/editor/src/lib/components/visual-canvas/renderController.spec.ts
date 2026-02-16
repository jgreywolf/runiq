import { describe, expect, it, vi } from 'vitest';
import { createDebouncedRunner, runRenderCycle } from './renderController';

describe('renderController', () => {
	it('handles empty input via onEmpty', async () => {
		const onEmpty = vi.fn();
		const onComplete = vi.fn();
		const renderDiagram = vi.fn();

		await runRenderCycle({
			dslCode: '   ',
			dataContent: '',
			layoutEngine: 'elk',
			renderDiagram,
			onEmpty,
			onStart: vi.fn(),
			onSuccess: vi.fn(),
			onError: vi.fn(),
			onComplete
		});

		expect(onEmpty).toHaveBeenCalledOnce();
		expect(renderDiagram).not.toHaveBeenCalled();
		expect(onComplete).toHaveBeenCalledOnce();
	});

	it('calls start/success/complete on successful render', async () => {
		const onStart = vi.fn();
		const onSuccess = vi.fn();
		const onComplete = vi.fn();
		const renderResult = {
			success: true,
			svg: '<svg/>',
			errors: [],
			warnings: [],
			parseTime: 1,
			renderTime: 1
		};
		const renderDiagram = vi.fn().mockResolvedValue(renderResult);

		await runRenderCycle({
			dslCode: 'diagram "x" {}',
			dataContent: '',
			layoutEngine: 'elk',
			renderDiagram,
			onEmpty: vi.fn(),
			onStart,
			onSuccess,
			onError: vi.fn(),
			onComplete
		});

		expect(onStart).toHaveBeenCalledOnce();
		expect(onSuccess).toHaveBeenCalledWith(renderResult);
		expect(onComplete).toHaveBeenCalledOnce();
	});

	it('calls onError when render throws', async () => {
		const onError = vi.fn();
		const renderDiagram = vi.fn().mockRejectedValue(new Error('boom'));

		await runRenderCycle({
			dslCode: 'diagram "x" {}',
			dataContent: '',
			layoutEngine: 'elk',
			renderDiagram,
			onEmpty: vi.fn(),
			onStart: vi.fn(),
			onSuccess: vi.fn(),
			onError,
			onComplete: vi.fn()
		});

		expect(onError).toHaveBeenCalledWith('boom');
	});

	it('debounces and cancels scheduled calls', () => {
		vi.useFakeTimers();
		const callback = vi.fn();
		const debounced = createDebouncedRunner(100, callback);

		debounced.schedule('a');
		debounced.schedule('b');
		vi.advanceTimersByTime(99);
		expect(callback).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(callback).toHaveBeenCalledWith('b');

		debounced.schedule('c');
		debounced.cancel();
		vi.advanceTimersByTime(200);
		expect(callback).toHaveBeenCalledTimes(1);

		vi.useRealTimers();
	});
});
