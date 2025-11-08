/**
 * Tests for editor utility functions
 */

import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility function', () => {
	it('should merge class names', () => {
		const result = cn('foo', 'bar');
		expect(result).toBe('foo bar');
	});

	it('should handle conditional classes', () => {
		const result = cn('base', true && 'active', false && 'disabled');
		expect(result).toBe('base active');
	});

	it('should merge Tailwind classes correctly', () => {
		const result = cn('px-2 py-1', 'px-4');
		expect(result).toBe('py-1 px-4'); // tailwind-merge removes conflicting px-2
	});

	it('should handle arrays of classes', () => {
		const result = cn(['foo', 'bar'], 'baz');
		expect(result).toBe('foo bar baz');
	});

	it('should handle undefined and null', () => {
		const result = cn('foo', undefined, null, 'bar');
		expect(result).toBe('foo bar');
	});

	it('should handle objects with boolean values', () => {
		const result = cn('base', {
			active: true,
			disabled: false,
			error: true
		});
		expect(result).toBe('base active error');
	});

	it('should handle empty input', () => {
		const result = cn();
		expect(result).toBe('');
	});

	it('should handle complex Tailwind merging', () => {
		const result = cn('text-sm text-red-500', 'text-blue-600');
		expect(result).toBe('text-sm text-blue-600');
	});
});
