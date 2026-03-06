import { generateShapeCode, extractElementData, type ClipboardItem } from './codeHelpers';
import { handleDelete, handleInsertShape } from '../state/editorState.svelte';

/**
 * ClipboardManager - Manages copy, cut, paste operations for diagram elements
 * Uses Svelte 5 runes for reactive state management
 */
class ClipboardManager {
	private clipboards = $state<Record<string, ClipboardItem[]>>({ canvas: [], default: [] });

	private ensureScope(scope: string): void {
		if (!this.clipboards[scope]) {
			this.clipboards = { ...this.clipboards, [scope]: [] };
		}
	}

	private getScopeClipboard(scope: string): ClipboardItem[] {
		this.ensureScope(scope);
		return this.clipboards[scope];
	}

	getItemsInScope(scope: string = 'default'): ClipboardItem[] {
		return [...this.getScopeClipboard(scope)];
	}

	/**
	 * Copy selected elements to clipboard
	 */
	copy(
		svgContainer: HTMLDivElement | null,
		selectedNodeId: string | null,
		selectedEdgeId: string | null,
		selectedNodeIds: Set<string>,
		selectedEdgeIds: Set<string>,
		scope: string = 'default'
	): void {
		if (!svgContainer) return;

		const svgElement = svgContainer.querySelector('svg');
		if (!svgElement) return;

		this.ensureScope(scope);
		this.clipboards[scope] = [];

		// Copy multi-selected items
		if (selectedNodeIds.size > 0 || selectedEdgeIds.size > 0) {
			selectedNodeIds.forEach((nodeId) => {
				const element = svgElement.querySelector(`[data-node-id="${nodeId}"]`);
				if (element) {
					this.clipboards[scope].push({
						type: 'node',
						id: nodeId,
						data: extractElementData(element, 'node')
					});
				}
			});

			selectedEdgeIds.forEach((edgeId) => {
				const element = svgElement.querySelector(`[data-edge-id="${edgeId}"]`);
				if (element) {
					this.clipboards[scope].push({
						type: 'edge',
						id: edgeId,
						data: extractElementData(element, 'edge')
					});
				}
			});
		}
		// Copy single selected item
		else if (selectedNodeId) {
			const element = svgElement.querySelector(`[data-node-id="${selectedNodeId}"]`);
			if (element) {
				this.clipboards[scope].push({
					type: 'node',
					id: selectedNodeId,
					data: extractElementData(element, 'node')
				});
			}
		} else if (selectedEdgeId) {
			const element = svgElement.querySelector(`[data-edge-id="${selectedEdgeId}"]`);
			if (element) {
				this.clipboards[scope].push({
					type: 'edge',
					id: selectedEdgeId,
					data: extractElementData(element, 'edge')
				});
			}
		}
	}

	/**
	 * Cut selected elements (copy + delete)
	 */
	cut(
		svgContainer: HTMLDivElement | null,
		selectedNodeId: string | null,
		selectedEdgeId: string | null,
		selectedNodeIds: Set<string>,
		selectedEdgeIds: Set<string>,
		ondelete?: (nodeId: string | null, edgeId: string | null) => void,
		scope: string = 'default'
	): void {
		// First copy to clipboard
		this.copy(svgContainer, selectedNodeId, selectedEdgeId, selectedNodeIds, selectedEdgeIds, scope);

		// Then delete the elements
		const deleteElement = (nodeId: string | null, edgeId: string | null) => {
			if (ondelete) ondelete(nodeId, edgeId);
			else handleDelete(nodeId, edgeId);
		};

		if (selectedNodeIds.size > 0 || selectedEdgeIds.size > 0) {
			selectedNodeIds.forEach((nodeId) => {
				deleteElement(nodeId, null);
			});
			selectedEdgeIds.forEach((edgeId) => {
				deleteElement(null, edgeId);
			});
		} else if (selectedNodeId || selectedEdgeId) {
			deleteElement(selectedNodeId, selectedEdgeId);
		}
	}

	/**
	 * Paste clipboard contents with new IDs
	 */
	paste(oninsertshape?: (shapeCode: string) => void, scope: string = 'default'): void {
		const clipboard = this.getScopeClipboard(scope);
		if (clipboard.length === 0) return;

		// Generate DSL code for pasted elements with new IDs
		clipboard.forEach((item, index) => {
			if (item.type !== 'node') return;
			const newId = `${item.id}_copy_${Date.now()}_${index}`;
			const shapeCode = generateShapeCode(item, newId);
			if (shapeCode) {
				if (oninsertshape) oninsertshape(shapeCode);
				else handleInsertShape(shapeCode);
			}
		});
	}

	/**
	 * Check if clipboard has content
	 */
	get hasContent(): boolean {
		return this.hasContentInScope('default');
	}

	hasContentInScope(scope: string = 'default'): boolean {
		return this.getScopeClipboard(scope).length > 0;
	}

	/**
	 * Get clipboard size
	 */
	get size(): number {
		return this.sizeInScope('default');
	}

	sizeInScope(scope: string = 'default'): number {
		return this.getScopeClipboard(scope).length;
	}

	/**
	 * Clear clipboard
	 */
	clear(scope: string = 'default'): void {
		this.ensureScope(scope);
		this.clipboards[scope] = [];
	}
}

// Export singleton instance
export const clipboardManager = new ClipboardManager();
