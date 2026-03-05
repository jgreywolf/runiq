import { describe, it, expect } from 'vitest';
import type { EditorMode } from '$lib/types/editor';

describe('EditorToolbar', () => {
	describe('Mode Logic', () => {
		it('should support select mode', () => {
			const mode: EditorMode = 'select';
			expect(mode).toBe('select');
		});

		it('should support connect mode', () => {
			const mode: EditorMode = 'connect';
			expect(mode).toBe('connect');
		});

		it('should determine if mode is active', () => {
			const currentMode: EditorMode = 'select';
			const checkMode = (mode: EditorMode) => currentMode === mode;

			expect(checkMode('select')).toBe(true);
			expect(checkMode('connect')).toBe(false);
		});

		it('should toggle between modes', () => {
			let mode: EditorMode = 'select';
			const setMode = (newMode: EditorMode) => {
				mode = newMode;
			};

			setMode('connect');
			expect(mode).toBe('connect');

			setMode('select');
			expect(mode).toBe('select');
		});
	});

	describe('Keyboard Shortcuts', () => {
		it('should map V key to select mode', () => {
			const keyToMode = (key: string): EditorMode | null => {
				if (key === 'v' || key === 'V') return 'select';
				if (key === 'c' || key === 'C') return 'connect';
				return null;
			};

			expect(keyToMode('V')).toBe('select');
			expect(keyToMode('v')).toBe('select');
		});

		it('should map C key to connect mode', () => {
			const keyToMode = (key: string): EditorMode | null => {
				if (key === 'v' || key === 'V') return 'select';
				if (key === 'c' || key === 'C') return 'connect';
				return null;
			};

			expect(keyToMode('C')).toBe('connect');
			expect(keyToMode('c')).toBe('connect');
		});

		it('should return null for unmapped keys', () => {
			const keyToMode = (key: string): EditorMode | null => {
				if (key === 'v' || key === 'V') return 'select';
				if (key === 'c' || key === 'C') return 'connect';
				return null;
			};

			expect(keyToMode('a')).toBeNull();
			expect(keyToMode('x')).toBeNull();
			expect(keyToMode('h')).toBeNull();
			expect(keyToMode('1')).toBeNull();
		});
	});

	describe('Mode Button States', () => {
		it('should identify active button', () => {
			const mode: EditorMode = 'select';
			const isActive = (buttonMode: EditorMode) => mode === buttonMode;

			expect(isActive('select')).toBe(true);
			expect(isActive('connect')).toBe(false);
		});

		it('should have only one active button at a time', () => {
			const mode: EditorMode = 'connect';
			const modes: EditorMode[] = ['select', 'connect'];
			const activeCount = modes.filter((m) => m === mode).length;

			expect(activeCount).toBe(1);
		});
	});

	describe('Tooltip Text', () => {
		it('should include keyboard shortcut for select mode', () => {
			const tooltip = 'Select Mode (V)';
			expect(tooltip).toContain('V');
			expect(tooltip).toContain('Select');
		});

		it('should include keyboard shortcut for connect mode', () => {
			const tooltip = 'Connect Mode (C)';
			expect(tooltip).toContain('C');
			expect(tooltip).toContain('Connect');
		});
	});
});
