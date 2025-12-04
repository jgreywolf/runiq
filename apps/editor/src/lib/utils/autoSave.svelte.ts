/**
 * Auto-save functionality for editor content
 */

import { SvelteDate } from 'svelte/reactivity';

export class AutoSaveManager {
	private timeout: ReturnType<typeof setTimeout> | null = null;
	private readonly delay: number;
	private readonly storageKey: string;
	private readonly timeKey: string;

	lastSaved = $state<Date | null>(null);

	constructor(delay: number = 2000, storageKey: string = 'runiq-autosave-code') {
		this.delay = delay;
		this.storageKey = storageKey;
		this.timeKey = `${storageKey}-time`;
	}

	/**
	 * Restore auto-saved content from localStorage
	 */
	restore(): { code: string; lastSaved: Date | null } {
		if (typeof window === 'undefined') {
			return { code: '', lastSaved: null };
		}

		const saved = localStorage.getItem(this.storageKey);
		const savedTime = localStorage.getItem(this.timeKey);

		if (saved) {
			console.log('Restored auto-saved code');
			return {
				code: saved,
				lastSaved: savedTime ? new SvelteDate(savedTime) : new SvelteDate()
			};
		}

		return { code: '', lastSaved: null };
	}

	/**
	 * Schedule an auto-save
	 */
	schedule(code: string, onSave?: () => void): void {
		if (this.timeout) {
			clearTimeout(this.timeout);
		}

		this.timeout = setTimeout(() => {
			this.save(code);
			onSave?.();
		}, this.delay);
	}

	/**
	 * Save immediately
	 */
	save(code: string): void {
		try {
			const now = new SvelteDate();
			localStorage.setItem(this.storageKey, code);
			localStorage.setItem(this.timeKey, now.toISOString());
			this.lastSaved = now;
			console.log('Auto-saved at', this.lastSaved.toLocaleTimeString());
		} catch (e) {
			console.warn('Auto-save failed:', e);
		}
	}

	/**
	 * Clear auto-saved content
	 */
	clear(): void {
		localStorage.removeItem(this.storageKey);
		localStorage.removeItem(this.timeKey);
		this.lastSaved = null;
	}

	/**
	 * Cancel pending auto-save
	 */
	cancel(): void {
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
	}
}
