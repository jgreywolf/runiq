export const EditorProfileName = {
	diagram: 'diagram',
	glyphset: 'glyphset',
	electrical: 'electrical',
	digital: 'digital',
	control: 'control',
	pneumatic: 'pneumatic',
	hydraulic: 'hydraulic',
	hvac: 'hvac',
	wardley: 'wardley',
	sequence: 'sequence',
	timeline: 'timeline',
	pid: 'pid',
	railroad: 'railroad',
	kanban: 'kanban',
	gitgraph: 'gitgraph',
	treemap: 'treemap',
	pedigree: 'pedigree'
} as const;

export type EditorProfileName = (typeof EditorProfileName)[keyof typeof EditorProfileName];

export interface EditorCapabilitySettings {
	enableVisualCanvasEditing: boolean;
}

export interface EditorHostPreset {
	id: string;
	label: string;
	supportsVisualCanvasEditing: boolean;
	canvasSelectionProfiles?: readonly EditorProfileName[];
	visualEditingProfiles?: readonly EditorProfileName[];
	canvasContextMenuProfiles?: readonly EditorProfileName[];
	elementToolbarProfiles?: readonly EditorProfileName[];
	inlineEditProfiles?: readonly EditorProfileName[];
	connectModeProfiles?: readonly EditorProfileName[];
	quickConnectProfiles?: readonly EditorProfileName[];
	dragReorderProfiles?: readonly EditorProfileName[];
}

export interface EditorCapabilitiesSnapshot {
	profileName: EditorProfileName | null;
	canvasSelection: boolean;
	visualCanvasEditing: boolean;
	canvasContextMenus: boolean;
	elementToolbar: boolean;
	inlineEdit: boolean;
	connectMode: boolean;
	quickConnect: boolean;
	dragReorder: boolean;
}

const BASE_CANVAS_SELECTION_PROFILES = [
	EditorProfileName.diagram,
	EditorProfileName.timeline,
	EditorProfileName.sequence,
	EditorProfileName.glyphset,
	EditorProfileName.electrical,
	EditorProfileName.control,
	EditorProfileName.pneumatic,
	EditorProfileName.hydraulic,
	EditorProfileName.hvac,
	EditorProfileName.digital
] as const satisfies readonly EditorProfileName[];

const BASE_VISUAL_EDITING_PROFILES = [
	EditorProfileName.diagram,
	EditorProfileName.timeline,
	EditorProfileName.sequence,
	EditorProfileName.glyphset,
	EditorProfileName.electrical,
	EditorProfileName.control,
	EditorProfileName.pneumatic,
	EditorProfileName.hydraulic,
	EditorProfileName.hvac,
	EditorProfileName.digital
] as const satisfies readonly EditorProfileName[];

const BASE_CONNECT_MODE_PROFILES = [
	EditorProfileName.diagram
] as const satisfies readonly EditorProfileName[];

export const OSS_EDITOR_HOST_PRESET: EditorHostPreset = {
	id: 'oss',
	label: 'Open Source',
	supportsVisualCanvasEditing: false
};

export const PREMIUM_EDITOR_HOST_PRESET: EditorHostPreset = {
	id: 'premium',
	label: 'Premium',
	supportsVisualCanvasEditing: true,
	canvasSelectionProfiles: BASE_CANVAS_SELECTION_PROFILES,
	visualEditingProfiles: BASE_VISUAL_EDITING_PROFILES,
	canvasContextMenuProfiles: BASE_VISUAL_EDITING_PROFILES,
	elementToolbarProfiles: BASE_VISUAL_EDITING_PROFILES,
	inlineEditProfiles: BASE_VISUAL_EDITING_PROFILES,
	connectModeProfiles: BASE_CONNECT_MODE_PROFILES,
	quickConnectProfiles: BASE_CONNECT_MODE_PROFILES,
	dragReorderProfiles: BASE_VISUAL_EDITING_PROFILES
};

export function createEditorHostPreset(
	overrides: Partial<EditorHostPreset> & Pick<EditorHostPreset, 'id' | 'label'>
): EditorHostPreset {
	return {
		...PREMIUM_EDITOR_HOST_PRESET,
		...overrides
	};
}

export function isSchematicProfile(profileName: EditorProfileName | null): boolean {
	return (
		profileName === EditorProfileName.electrical ||
		profileName === EditorProfileName.control ||
		profileName === EditorProfileName.pneumatic ||
		profileName === EditorProfileName.hydraulic ||
		profileName === EditorProfileName.hvac ||
		profileName === EditorProfileName.digital
	);
}

export function supportsCanvasSelection(profileName: EditorProfileName | null): boolean {
	return (
		profileName === EditorProfileName.diagram ||
		profileName === EditorProfileName.timeline ||
		profileName === EditorProfileName.sequence ||
		profileName === EditorProfileName.glyphset ||
		isSchematicProfile(profileName)
	);
}

function presetAllowsFeature(
	profileName: EditorProfileName | null,
	allowedProfiles: readonly EditorProfileName[] | undefined,
	fallback: boolean
): boolean {
	if (!profileName) return false;
	if (!allowedProfiles) return fallback;
	return allowedProfiles.includes(profileName);
}

function profileSupportsCanvasContextMenus(profileName: EditorProfileName | null): boolean {
	return (
		profileName === EditorProfileName.diagram ||
		profileName === EditorProfileName.timeline ||
		profileName === EditorProfileName.sequence ||
		profileName === EditorProfileName.glyphset ||
		isSchematicProfile(profileName)
	);
}

function profileSupportsElementToolbar(profileName: EditorProfileName | null): boolean {
	return (
		profileName === EditorProfileName.diagram ||
		profileName === EditorProfileName.timeline ||
		profileName === EditorProfileName.sequence ||
		profileName === EditorProfileName.glyphset ||
		isSchematicProfile(profileName)
	);
}

function profileSupportsDragReorder(profileName: EditorProfileName | null): boolean {
	return (
		profileName === EditorProfileName.diagram ||
		profileName === EditorProfileName.timeline ||
		profileName === EditorProfileName.sequence ||
		profileName === EditorProfileName.glyphset ||
		isSchematicProfile(profileName)
	);
}

export function resolveEditorCapabilities(
	profileName: EditorProfileName | null,
	settings: EditorCapabilitySettings,
	hostPreset: EditorHostPreset = PREMIUM_EDITOR_HOST_PRESET
): EditorCapabilitiesSnapshot {
	const baseCanvasSelection = supportsCanvasSelection(profileName);
	const canvasSelection =
		baseCanvasSelection &&
		presetAllowsFeature(profileName, hostPreset.canvasSelectionProfiles, true);
	const baseVisualEditing = canvasSelection && settings.enableVisualCanvasEditing;
	const visualCanvasEditing =
		baseVisualEditing &&
		hostPreset.supportsVisualCanvasEditing &&
		presetAllowsFeature(profileName, hostPreset.visualEditingProfiles, true);
	const connectMode =
		visualCanvasEditing &&
		presetAllowsFeature(
			profileName,
			hostPreset.connectModeProfiles,
			profileName === EditorProfileName.diagram
		);

	return {
		profileName,
		canvasSelection,
		visualCanvasEditing,
		canvasContextMenus:
			visualCanvasEditing &&
			profileSupportsCanvasContextMenus(profileName) &&
			presetAllowsFeature(profileName, hostPreset.canvasContextMenuProfiles, true),
		elementToolbar:
			visualCanvasEditing &&
			profileSupportsElementToolbar(profileName) &&
			presetAllowsFeature(profileName, hostPreset.elementToolbarProfiles, true),
		inlineEdit:
			visualCanvasEditing &&
			canvasSelection &&
			presetAllowsFeature(profileName, hostPreset.inlineEditProfiles, true),
		connectMode,
		quickConnect:
			connectMode &&
			presetAllowsFeature(profileName, hostPreset.quickConnectProfiles, true),
		dragReorder:
			visualCanvasEditing &&
			profileSupportsDragReorder(profileName) &&
			presetAllowsFeature(profileName, hostPreset.dragReorderProfiles, true)
	};
}
