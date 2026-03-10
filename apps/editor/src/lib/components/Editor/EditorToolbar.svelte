<script lang="ts">
	import type { EditorMode } from '$lib/types/editor';
	import Icon from '@iconify/svelte';
	import {
		editorRefs,
		editorState,
		handleInsertShape,
		updateCode
	} from '$lib/state/editorState.svelte';
	import { canvasState } from '$lib/state';
	import { ProfileName } from '$lib/types';
	import * as DSL from '$lib/utils/dslCodeManipulation';
	import { applyThemeToDsl, extractSvgDimensions } from './editorToolbarActions';
	import ContainerPickerFlyout from '$lib/components/ContainerPickerFlyout.svelte';
	import ImageInsertFlyout from '$lib/components/ImageInsertFlyout.svelte';
	import ShapePickerFlyout from '$lib/components/ShapePickerFlyout.svelte';
	import ThemePickerFlyout from '$lib/components/ThemePickerFlyout.svelte';
	import {
		isSchematicProfile,
		supportsCanvasSelection
	} from '$lib/components/visual-canvas/interactiveProfiles';

	interface Props {
		svgContainer?: HTMLDivElement | null;
		svgOutput?: string;
	}

	let { svgContainer, svgOutput }: Props = $props();

	let showThemeFlyout = $state(false);
	let showShapeFlyout = $state(false);
	let showContainerFlyout = $state(false);
	let showImageFlyout = $state(false);

	const isDiagramProfile = $derived(editorState.profileName === ProfileName.diagram);
	const isSequenceProfile = $derived(editorState.profileName === ProfileName.sequence);
	const isSchematicCanvasProfile = $derived(isSchematicProfile(editorState.profileName));
	const canUseThemeControl = $derived.by(() => {
		switch (editorState.profileName) {
			case ProfileName.diagram:
			case ProfileName.sequence:
			case ProfileName.timeline:
			case ProfileName.wardley:
			case ProfileName.kanban:
			case ProfileName.gitgraph:
			case ProfileName.treemap:
			case ProfileName.railroad:
			case ProfileName.glyphset:
				return true;
			default:
				return false;
		}
	});
	const schematicToolbarMeta = $derived.by(() => {
		switch (editorState.profileName) {
			case ProfileName.electrical:
				return {
					addPartLabel: 'Add Electrical Part',
					addNetLabel: 'Add Electrical Net',
					partIcon: 'lucide:zap',
					netIcon: 'lucide:network'
				};
			case ProfileName.hvac:
				return {
					addPartLabel: 'Add HVAC Part',
					addNetLabel: 'Add HVAC Net',
					partIcon: 'lucide:fan',
					netIcon: 'lucide:network'
				};
			case ProfileName.pneumatic:
				return {
					addPartLabel: 'Add Pneumatic Part',
					addNetLabel: 'Add Pneumatic Net',
					partIcon: 'lucide:wind',
					netIcon: 'lucide:network'
				};
			case ProfileName.hydraulic:
				return {
					addPartLabel: 'Add Hydraulic Part',
					addNetLabel: 'Add Hydraulic Net',
					partIcon: 'lucide:droplets',
					netIcon: 'lucide:network'
				};
			case ProfileName.control:
				return {
					addPartLabel: 'Add Control Part',
					addNetLabel: 'Add Control Net',
					partIcon: 'lucide:sliders-horizontal',
					netIcon: 'lucide:network'
				};
			case ProfileName.digital:
				return {
					addPartLabel: 'Add Digital Part',
					addNetLabel: 'Add Digital Net',
					partIcon: 'lucide:cpu',
					netIcon: 'lucide:network'
				};
			default:
				return {
					addPartLabel: 'Add Part',
					addNetLabel: 'Add Net',
					partIcon: 'lucide:circuit-board',
					netIcon: 'lucide:network'
				};
		}
	});
	const canSelectInCanvas = $derived(supportsCanvasSelection(editorState.profileName));
	const canUseConnectMode = $derived(
		editorState.profileName === ProfileName.diagram
	);

	function getNextContainerLabel(baseLabel = 'New Container'): string {
		const code = editorState.code || '';
		const escapedBase = baseLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const pattern = new RegExp(
			`container\\s+(?:[A-Za-z_][\\w-]*\\s+)?\"${escapedBase}(?:\\s+(\\d+))?\"`,
			'g'
		);
		let maxIndex = 0;
		for (const match of code.matchAll(pattern)) {
			const suffix = match[1];
			if (!suffix) {
				maxIndex = Math.max(maxIndex, 1);
			} else {
				const parsed = Number.parseInt(suffix, 10);
				if (Number.isFinite(parsed)) {
					maxIndex = Math.max(maxIndex, parsed);
				}
			}
		}
		return maxIndex <= 0 ? baseLabel : `${baseLabel} ${maxIndex + 1}`;
	}

	function withUniqueContainerLabel(code: string): string {
		const nextLabel = getNextContainerLabel('New Container');
		return code.replace(/container\s+"New Container"/, `container "${nextLabel}"`);
	}

	// Mode handlers
	function handleModeChange(newMode: EditorMode) {
		if (!canSelectInCanvas) return;
		if (newMode === 'connect' && !canUseConnectMode) return;
		canvasState.mode = newMode;
	}

	function setFlyoutOpen(flyout: 'theme' | 'shape' | 'container' | 'image' | null) {
		showThemeFlyout = flyout === 'theme';
		showShapeFlyout = flyout === 'shape';
		showContainerFlyout = flyout === 'container';
		showImageFlyout = flyout === 'image';
	}

	$effect(() => {
		if (!canUseThemeControl && showThemeFlyout) {
			showThemeFlyout = false;
		}
	});

	function handleAddShape() {
		if (!isDiagramProfile) return;
		setFlyoutOpen(showShapeFlyout ? null : 'shape');
	}

	function handleAddContainer() {
		if (!isDiagramProfile) return;
		setFlyoutOpen(showContainerFlyout ? null : 'container');
	}

	function handleAddImage() {
		if (!isDiagramProfile) return;
		setFlyoutOpen(showImageFlyout ? null : 'image');
	}

	function handleAddText() {
		if (!isDiagramProfile) return;
		handleInsertShape('shape id as @textBlock label:"Edit text" textAlign:left');
		canvasState.mode = 'select';
	}

	function getNextParticipantLabel(baseLabel = 'New Participant'): string {
		const code = editorState.code || '';
		const escapedBase = baseLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const pattern = new RegExp(`participant\\s+\"${escapedBase}(?:\\s+(\\d+))?\"`, 'g');
		let maxIndex = 0;
		for (const match of code.matchAll(pattern)) {
			const suffix = match[1];
			if (!suffix) {
				maxIndex = Math.max(maxIndex, 1);
			} else {
				const parsed = Number.parseInt(suffix, 10);
				if (Number.isFinite(parsed)) {
					maxIndex = Math.max(maxIndex, parsed);
				}
			}
		}
		return maxIndex <= 0 ? baseLabel : `${baseLabel} ${maxIndex + 1}`;
	}

	function extractSequenceParticipantNames(code: string): string[] {
		const names: string[] = [];
		const lines = code.split('\n');
		for (const line of lines) {
			const match = /^\s*participant\s+\"((?:\\.|[^\"])*)\"/.exec(line);
			if (!match) continue;
			names.push(match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
		}
		return names;
	}

	function handleAddSequenceParticipant() {
		if (!isSequenceProfile) return;
		const label = getNextParticipantLabel('New Participant').replace(/"/g, '\\"');
		handleInsertShape(`participant "${label}" as entity`);
		canvasState.mode = 'select';
	}

	function handleAddSequenceMessage() {
		if (!isSequenceProfile) return;
		const participants = extractSequenceParticipantNames(editorState.code || '');
		const from = (participants[0] ?? 'Participant A').replace(/"/g, '\\"');
		const to = (participants[1] ?? participants[0] ?? 'Participant B').replace(/"/g, '\\"');
		handleInsertShape(`message from:"${from}" to:"${to}" label:"New Message" type:sync`);
		canvasState.mode = 'select';
	}

	function handleAddSequenceNote() {
		if (!isSequenceProfile) return;
		const participants = extractSequenceParticipantNames(editorState.code || '');
		const target = (participants[0] ?? 'Participant A').replace(/"/g, '\\"');
		handleInsertShape(`note "New note" position:right participants:("${target}")`);
		canvasState.mode = 'select';
	}

	function collectSchematicNetNames(code: string): Set<string> {
		const nets = new Set<string>();
		for (const line of code.split('\n')) {
			const match = line.match(/^\s*net\s+(.+)$/);
			if (!match) continue;
			for (const token of match[1].split(',')) {
				const value = token.trim();
				if (value) nets.add(value);
			}
		}
		return nets;
	}

	function getNextSchematicPartRef(code: string, prefix = 'R'): string {
		const regex = new RegExp(`^\\s*part\\s+${prefix}(\\d+)\\b`);
		let maxIndex = 0;
		for (const line of code.split('\n')) {
			const match = line.match(regex);
			if (!match) continue;
			const numeric = Number.parseInt(match[1], 10);
			if (Number.isFinite(numeric)) maxIndex = Math.max(maxIndex, numeric);
		}
		return `${prefix}${maxIndex + 1}`;
	}

	function getNextSchematicNetName(code: string): string {
		const nets = collectSchematicNetNames(code);
		let index = 1;
		let candidate = `N${index}`;
		while (nets.has(candidate)) {
			index += 1;
			candidate = `N${index}`;
		}
		return candidate;
	}

	function handleAddSchematicPart() {
		if (!isSchematicCanvasProfile) return;
		const code = editorState.code || '';
		const ref = getNextSchematicPartRef(code, 'R');
		const netA = getNextSchematicNetName(code);
		const netB = getNextSchematicNetName(`${code}\nnet ${netA}`);
		insertSchematicStatement(`part ${ref} type:R value:"1k" pins:(${netA},${netB})`);
		canvasState.mode = 'select';
	}

	function handleAddSchematicNet() {
		if (!isSchematicCanvasProfile) return;
		const code = editorState.code || '';
		const net = getNextSchematicNetName(code);
		insertSchematicStatement(`net ${net}`);
		canvasState.mode = 'select';
	}

	function getSchematicProfileKeyword(profile: ProfileName | null): string {
		switch (profile) {
			case ProfileName.electrical:
				return 'electrical';
			case ProfileName.hvac:
				return 'hvac';
			case ProfileName.pneumatic:
				return 'pneumatic';
			case ProfileName.hydraulic:
				return 'hydraulic';
			case ProfileName.control:
				return 'control';
			case ProfileName.digital:
				return 'digital';
			default:
				return 'electrical';
		}
	}

	function insertSchematicStatement(statement: string) {
		const code = editorState.code || '';
		const inserted = DSL.insertShape(code, statement, editorState.shapeCounter);
		if (inserted !== code) {
			updateCode(inserted, true);
			return;
		}
		const keyword = getSchematicProfileKeyword(editorState.profileName);
		const bootstrap = `${keyword} "New ${keyword[0].toUpperCase()}${keyword.slice(1)}" {\n  ${statement}\n}`;
		updateCode(bootstrap, true);
	}

	function insertShapeFromPicker(code: string) {
		handleInsertShape(code);
		setFlyoutOpen(null);
	}

	function insertContainerFromPicker(code: string) {
		handleInsertShape(withUniqueContainerLabel(code));
		setFlyoutOpen(null);
	}

	function insertImageShape(src: string) {
		const safeSrc = src.trim();
		if (!safeSrc) return;
		const normalizedSrc = safeSrc.replace(/"/g, '\\"');
		handleInsertShape(
			`shape id as @image label:"Image" data:[{ src:"${normalizedSrc}" }]`
		);
		setFlyoutOpen(null);
	}

	function handleChangeTheme() {
		if (!canUseThemeControl) return;
		setFlyoutOpen(showThemeFlyout ? null : 'theme');
	}

	function applyTheme(themeId: string) {
		const code = editorState.code || '';
		const newCode = applyThemeToDsl(code, themeId);
		updateCode(newCode, true);
		setFlyoutOpen(null);
	}

	// Zoom handlers
	function handleZoomIn() {
		editorRefs.viewport?.zoomIn();
	}

	function handleZoomOut() {
		editorRefs.viewport?.zoomOut();
	}

	function handleResetZoom() {
		editorRefs.viewport?.resetZoom();
	}

	function handleFitToScreen() {
		if (!editorRefs.viewport || !svgContainer || !svgOutput) return;

		// Reset pan
		editorRefs.viewport.translateX = 0;
		editorRefs.viewport.translateY = 0;

		const dimensions = extractSvgDimensions(svgOutput);
		if (!dimensions) {
			editorRefs.viewport.scale = 0.9;
			return;
		}

		const containerWidth = svgContainer.clientWidth;
		const containerHeight = svgContainer.clientHeight;

		editorRefs.viewport.fitToScreen(dimensions.width, dimensions.height, containerWidth, containerHeight);
	}

</script>

<div class="toolbar-wrapper">
	<div class="editor-toolbar">
		<!-- Mode Tools -->
		<div class="toolbar-section">
			<button
				class="toolbar-btn"
				class:active={canvasState.mode === 'select'}
				onclick={() => handleModeChange('select')}
				title="Select Mode (V)"
				aria-label="Select Mode (V)"
				disabled={!canSelectInCanvas}
			>
				<Icon icon="lucide:pointer" class="icon" />
			</button>

			{#if canUseConnectMode}
				<button
					class="toolbar-btn"
					class:active={canvasState.mode === 'connect'}
					onclick={() => handleModeChange('connect')}
					title="Connect Mode (C)"
					aria-label="Connect Mode (C)"
					disabled={!canUseConnectMode}
				>
					<Icon icon="lucide:git-branch" class="icon" />
				</button>
			{/if}
		</div>

		<div class="toolbar-divider"></div>

		<!-- Shape Tools -->
		<div class="toolbar-section">
			{#if isSequenceProfile}
				<button
					class="toolbar-btn"
					onclick={handleAddSequenceParticipant}
					title="Add Participant"
					aria-label="Add Participant"
				>
					<Icon icon="lucide:user-plus" class="icon" />
				</button>
				<button
					class="toolbar-btn"
					onclick={handleAddSequenceMessage}
					title="Add Message"
					aria-label="Add Message"
				>
					<Icon icon="lucide:arrow-right-left" class="icon" />
				</button>
				<button
					class="toolbar-btn"
					onclick={handleAddSequenceNote}
					title="Add Note"
					aria-label="Add Note"
				>
					<Icon icon="lucide:sticky-note" class="icon" />
				</button>
			{:else if isSchematicCanvasProfile}
				<button
					class="toolbar-btn"
					onclick={handleAddSchematicPart}
					title={schematicToolbarMeta.addPartLabel}
					aria-label={schematicToolbarMeta.addPartLabel}
				>
					<Icon icon={schematicToolbarMeta.partIcon} class="icon" />
				</button>
				<button
					class="toolbar-btn"
					onclick={handleAddSchematicNet}
					title={schematicToolbarMeta.addNetLabel}
					aria-label={schematicToolbarMeta.addNetLabel}
				>
					<Icon icon={schematicToolbarMeta.netIcon} class="icon" />
				</button>
			{:else}
				<button
					class="toolbar-btn"
					onclick={handleAddShape}
					title="Add Shape"
					aria-label="Add Shape"
					disabled={!isDiagramProfile}
				>
					<Icon icon="lucide:square-plus" class="icon" />
				</button>

				<button
					class="toolbar-btn"
					onclick={handleAddContainer}
					title="Add Container"
					aria-label="Add Container"
					disabled={!isDiagramProfile}
				>
					<Icon icon="lucide:box" class="icon" />
				</button>

				<button
					class="toolbar-btn"
					onclick={handleAddImage}
					title="Add Image"
					aria-label="Add Image"
					disabled={!isDiagramProfile}
				>
					<Icon icon="lucide:image-plus" class="icon" />
				</button>

				<button
					class="toolbar-btn"
					onclick={handleAddText}
					title="Add Text"
					aria-label="Add Text"
					disabled={!isDiagramProfile}
				>
					<Icon icon="lucide:text-cursor-input" class="icon" />
				</button>
			{/if}
		</div>

		<div class="toolbar-divider"></div>

		<!-- View Tools -->
		<div class="toolbar-section">
			<button
				class="toolbar-btn"
				onclick={handleChangeTheme}
				title="Change Theme"
				aria-label="Change Theme"
				disabled={!canUseThemeControl}
			>
				<Icon icon="lucide:palette" class="icon" />
			</button>

			<button
				class="toolbar-btn"
				onclick={() => console.log('Export clicked')}
				title="Export Diagram"
				aria-label="Export"
			>
				<Icon icon="lucide:download" class="icon" />
			</button>
		</div>

		<div class="toolbar-divider"></div>

		<!-- Zoom Tools -->
		<div class="toolbar-section">
			<button
				class="toolbar-btn"
				onclick={handleZoomIn}
				title="Zoom In"
				aria-label="Zoom In"
				disabled={!editorRefs.viewport}
			>
				<Icon icon="lucide:zoom-in" class="icon" />
			</button>
			<button
				class="toolbar-btn"
				onclick={handleZoomOut}
				title="Zoom Out"
				aria-label="Zoom Out"
				disabled={!editorRefs.viewport}
			>
				<Icon icon="lucide:zoom-out" class="icon" />
			</button>

			<button
				class="toolbar-btn"
				onclick={handleResetZoom}
				title="Reset Zoom (100%)"
				aria-label="Reset Zoom"
				disabled={!editorRefs.viewport}
			>
				<Icon icon="lucide:scan" class="icon" />
			</button>

			<button
				class="toolbar-btn"
				onclick={handleFitToScreen}
				title="Fit to Screen"
				aria-label="Fit to Screen"
				disabled={!editorRefs.viewport}
			>
				<Icon icon="lucide:maximize" class="size-5" />
			</button>
		</div>
	</div>

	<!-- Theme Flyout -->
	{#if showThemeFlyout}
		<div class="theme-flyout">
			<ThemePickerFlyout onSelect={applyTheme} />
		</div>
	{/if}

	{#if showShapeFlyout}
		<div class="theme-flyout">
			<ShapePickerFlyout
				profileName={editorState.profileName ?? ProfileName.diagram}
				iconSize={12}
				onSelect={insertShapeFromPicker}
			/>
		</div>
	{/if}

	{#if showContainerFlyout}
		<div class="theme-flyout">
			<ContainerPickerFlyout
				profileName={editorState.profileName ?? ProfileName.diagram}
				onSelect={insertContainerFromPicker}
			/>
		</div>
	{/if}

	{#if showImageFlyout}
		<div class="theme-flyout">
			<ImageInsertFlyout onInsert={insertImageShape} />
		</div>
	{/if}
</div>

<style>
	.toolbar-wrapper {
		position: relative;
		display: flex;
		gap: 0.5rem;
	}

	.editor-toolbar {
		display: flex;
		flex-direction: column;
		gap: 0;
		background: white;
		border: 1px solid hsl(var(--border));
		border-radius: 0.5rem;
		padding: 0.5rem;
		min-width: 3rem;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	.toolbar-section {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.toolbar-divider {
		height: 1px;
		background: hsl(var(--border));
		margin: 0.5rem 0;
	}

	.toolbar-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 0.375rem;
		color: hsl(var(--foreground));
		cursor: pointer;
		transition: all 0.15s ease;
		user-select: none;
		min-width: 2rem;
		min-height: 2rem;
	}

	.toolbar-btn:hover {
		background: hsl(var(--accent));
		border-color: hsl(var(--border));
		color: hsl(var(--accent-foreground));
	}

	.toolbar-btn.active {
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		border-color: hsl(var(--primary));
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
	}

	.toolbar-btn:focus-visible {
		outline: 2px solid hsl(var(--ring));
		outline-offset: 2px;
	}

	.toolbar-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.theme-flyout {
		position: absolute;
		left: 100%;
		top: 0;
		margin-left: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 180px;
		max-height: 400px;
		overflow-y: auto;
		background: white;
		border: 1px solid hsl(var(--border));
		border-radius: 0.5rem;
		padding: 0.5rem;
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
	}

	:global(.theme-flyout button) {
		width: 100%;
	}
</style>
