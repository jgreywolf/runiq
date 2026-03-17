import { describe, expect, it } from 'vitest';
import {
	createEditorHostPreset,
	EditorProfileName,
	isSchematicProfile,
	OSS_EDITOR_HOST_PRESET,
	PREMIUM_EDITOR_HOST_PRESET,
	resolveEditorCapabilities,
	supportsCanvasSelection
} from './editorCapabilities.js';

describe('editorCapabilities', () => {
	it('allows canvas selection without editing for supported profiles', () => {
		const capabilities = resolveEditorCapabilities(EditorProfileName.diagram, {
			enableVisualCanvasEditing: false
		});

		expect(capabilities.canvasSelection).toBe(true);
		expect(capabilities.visualCanvasEditing).toBe(false);
		expect(capabilities.canvasContextMenus).toBe(false);
		expect(capabilities.inlineEdit).toBe(false);
		expect(capabilities.connectMode).toBe(false);
	});

	it('enables diagram editing affordances only when editing is on', () => {
		const capabilities = resolveEditorCapabilities(EditorProfileName.diagram, {
			enableVisualCanvasEditing: true
		}, PREMIUM_EDITOR_HOST_PRESET);

		expect(capabilities.canvasSelection).toBe(true);
		expect(capabilities.visualCanvasEditing).toBe(true);
		expect(capabilities.canvasContextMenus).toBe(true);
		expect(capabilities.inlineEdit).toBe(true);
		expect(capabilities.connectMode).toBe(true);
		expect(capabilities.quickConnect).toBe(true);
		expect(capabilities.dragReorder).toBe(true);
	});

	it('recognizes schematic profiles as interactive canvas profiles', () => {
		expect(isSchematicProfile(EditorProfileName.electrical)).toBe(true);
		expect(supportsCanvasSelection(EditorProfileName.electrical)).toBe(true);
		expect(supportsCanvasSelection(EditorProfileName.kanban)).toBe(false);
	});

	it('lets the OSS preset keep selection while denying visual editing', () => {
		const capabilities = resolveEditorCapabilities(EditorProfileName.diagram, {
			enableVisualCanvasEditing: true
		}, OSS_EDITOR_HOST_PRESET);

		expect(capabilities.canvasSelection).toBe(true);
		expect(capabilities.visualCanvasEditing).toBe(false);
		expect(capabilities.elementToolbar).toBe(false);
		expect(capabilities.inlineEdit).toBe(false);
	});

	it('supports premium host overrides without changing shared capability logic', () => {
		const hostPreset = createEditorHostPreset({
			id: 'commercial-lite',
			label: 'Commercial Lite',
			connectModeProfiles: [EditorProfileName.diagram, EditorProfileName.sequence]
		});
		const sequenceCapabilities = resolveEditorCapabilities(
			EditorProfileName.sequence,
			{ enableVisualCanvasEditing: true },
			hostPreset
		);

		expect(sequenceCapabilities.visualCanvasEditing).toBe(true);
		expect(sequenceCapabilities.connectMode).toBe(true);
	});
});
