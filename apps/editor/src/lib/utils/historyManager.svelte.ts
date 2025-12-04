/**
 * History management for undo/redo functionality
 */

export class HistoryManager {
	private history = $state<string[]>([]);
	private index = $state(0);
	private maxSize: number;
	public isUndoRedoAction = $state(false);

	constructor(initialCode: string = '', maxSize: number = 100) {
		this.history = [initialCode];
		this.index = 0;
		this.maxSize = maxSize;
	}

	/**
	 * Add a new state to history
	 */
	push(code: string): void {
		if (this.isUndoRedoAction) return;

		// Remove any "future" history if we're not at the end
		if (this.index < this.history.length - 1) {
			this.history = this.history.slice(0, this.index + 1);
		}

		// Add new state
		this.history.push(code);
		this.index = this.history.length - 1;

		// Limit size
		if (this.history.length > this.maxSize) {
			this.history = this.history.slice(-this.maxSize);
			this.index = this.history.length - 1;
		}
	}

	/**
	 * Undo to previous state
	 */
	undo(): string | null {
		if (this.index > 0) {
			this.index--;
			this.isUndoRedoAction = true;
			return this.history[this.index];
		}
		return null;
	}

	/**
	 * Redo to next state
	 */
	redo(): string | null {
		if (this.index < this.history.length - 1) {
			this.index++;
			this.isUndoRedoAction = true;
			return this.history[this.index];
		}
		return null;
	}

	/**
	 * Reset undo/redo flag
	 */
	resetFlag(): void {
		this.isUndoRedoAction = false;
	}

	/**
	 * Check if undo is available
	 */
	canUndo(): boolean {
		return this.index > 0;
	}

	/**
	 * Check if redo is available
	 */
	canRedo(): boolean {
		return this.index < this.history.length - 1;
	}

	/**
	 * Reset history with new initial state
	 */
	reset(code: string): void {
		this.history = [code];
		this.index = 0;
	}

	/**
	 * Get current state
	 */
	getCurrent(): string {
		return this.history[this.index] || '';
	}
}
