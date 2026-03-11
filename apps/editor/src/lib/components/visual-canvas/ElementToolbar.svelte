<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Popover from '$lib/components/ui/popover';
	import type { ElementPanelKey } from './elementToolbarState';

	interface ShapeOption {
		id: string;
		label: string;
	}

	interface ShapeCategoryOption {
		label: string;
		shapes: ShapeOption[];
	}

	interface StyleDeclarationView {
		name: string;
		properties: Record<string, string>;
	}

	interface Props {
		selectedNodeId: string | null;
		panelOpen: Record<ElementPanelKey, boolean>;
		diagramShapeCategories: ShapeCategoryOption[];
		borderStyleChoices: ReadonlyArray<{ id: string; label: string; icon: string }>;
		filteredStyleDeclarations: StyleDeclarationView[];
		filteredIconTokens: string[];
		borderDraft: {
			strokeColor: string;
			strokeWidth: number;
			lineStyle: 'solid' | 'dashed' | 'dotted' | 'none';
		};
		fillDraft: { fillColor: string };
		textDraft: { textColor: string; fontSize: number; fontFamily: string };
		styleSearchQuery: string;
		iconSearchQuery: string;
		iconInputValue: string;
		showCreateStyleDialog: boolean;
		editingStyleName: string | null;
		newStyleName: string;
		newStyleDraft: {
			fillColor: string;
			strokeColor: string;
			strokeWidth: number;
			textColor: string;
			fontSize: number;
			fontFamily: string;
			lineStyle: string;
		};
		onPanelOpenChange: (panel: ElementPanelKey, open: boolean) => void;
		onApplyShape: (shapeId: string) => void;
		onApplyStyleRef: (styleName: string) => void;
		onOpenCreateStyleDialog: (existing?: { name: string; properties: Record<string, string> }) => void;
		onRemoveStyleDeclaration: (styleName: string) => void;
		onResetStyleRefToTheme: () => void;
		onCloseAllPanels: () => void;
		onApplyBorderDraft: () => void;
		onApplyFillDraft: () => void;
		onResetTextDraftToTheme: () => void;
		onApplyTextDraft: () => void;
		onSelectIconToken: (token: string) => void;
		onApplyIcon: () => void;
		onClearIcon: () => void;
		onDelete: () => void;
		onCloseCreateStyleDialog: () => void;
		onSaveStyleDeclarationAndApply: () => void;
	}

	let {
		selectedNodeId,
		panelOpen,
		diagramShapeCategories,
		borderStyleChoices,
		filteredStyleDeclarations,
		filteredIconTokens,
		borderDraft = $bindable(),
		fillDraft = $bindable(),
		textDraft = $bindable(),
		styleSearchQuery = $bindable(),
		iconSearchQuery = $bindable(),
		iconInputValue = $bindable(),
		showCreateStyleDialog = $bindable(),
		editingStyleName,
		newStyleName = $bindable(),
		newStyleDraft = $bindable(),
		onPanelOpenChange,
		onApplyShape,
		onApplyStyleRef,
		onOpenCreateStyleDialog,
		onRemoveStyleDeclaration,
		onResetStyleRefToTheme,
		onCloseAllPanels,
		onApplyBorderDraft,
		onApplyFillDraft,
		onResetTextDraftToTheme,
		onApplyTextDraft,
		onSelectIconToken,
		onApplyIcon,
		onClearIcon,
		onDelete,
		onCloseCreateStyleDialog,
		onSaveStyleDeclarationAndApply
	}: Props = $props();
</script>

<Popover.Root
	open={panelOpen.changeShape}
	onOpenChange={(open) => onPanelOpenChange('changeShape', open)}
>
	<Popover.Trigger
		class={`toolbar-button ${panelOpen.changeShape ? 'is-active' : ''}`}
		title="Change Shape"
		disabled={!selectedNodeId}
	>
		<Icon icon="lucide:shapes" class="size-4" />
		<span>Change Shape</span>
	</Popover.Trigger>
	<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
		<div class="flyout-title">Change Shape</div>
		{#each diagramShapeCategories as category}
			<div class="shape-picker-group">
				<div class="shape-picker-group-title">{category.label}</div>
				<div class="shape-picker-grid">
					{#each category.shapes as shape}
						<button type="button" class="shape-picker-item" onclick={() => onApplyShape(shape.id)}>
							<span class="shape-picker-label">{shape.label}</span>
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</Popover.Content>
</Popover.Root>

<Popover.Root open={panelOpen.styles} onOpenChange={(open) => onPanelOpenChange('styles', open)}>
	<Popover.Trigger
		class={`toolbar-button ${panelOpen.styles ? 'is-active' : ''}`}
		title="Apply Style"
		disabled={!selectedNodeId}
	>
		<Icon icon="lucide:swatch-book" class="size-4" />
		<span>Styles</span>
	</Popover.Trigger>
	<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
		<div class="flyout-title">Styles</div>
		<input class="icon-flyout-input" type="text" bind:value={styleSearchQuery} placeholder="Search styles..." />
		<div class="icon-results-list">
			{#each filteredStyleDeclarations as styleDecl}
				<div class="style-row">
					<button type="button" class="style-apply-btn" onclick={() => onApplyStyleRef(styleDecl.name)}>
						<span class="font-semibold">{styleDecl.name}</span>
						<span class="style-preview">
							<span
								class="style-preview-chip"
								style={`background:${styleDecl.properties.fillColor || '#f3f4f6'}; border-color:${styleDecl.properties.strokeColor || '#d1d5db'};`}
							></span>
							<span>{styleDecl.properties.fillColor || 'theme'} / {styleDecl.properties.strokeColor || 'theme'}</span>
						</span>
					</button>
					<button type="button" class="toolbar-button toolbar-button-sm" onclick={() => onOpenCreateStyleDialog(styleDecl)}>
						Edit
					</button>
					<button type="button" class="toolbar-button toolbar-button-sm" onclick={() => onRemoveStyleDeclaration(styleDecl.name)}>
						Delete
					</button>
				</div>
			{/each}
		</div>
		<div class="icon-flyout-actions">
			<button class="toolbar-button toolbar-button-sm" onclick={onResetStyleRefToTheme}>Reset to Theme</button>
			<button class="toolbar-button toolbar-button-sm" onclick={() => onOpenCreateStyleDialog()}>Create New</button>
		</div>
	</Popover.Content>
</Popover.Root>

<div class="toolbar-divider-vertical"></div>

<Popover.Root open={panelOpen.border} onOpenChange={(open) => onPanelOpenChange('border', open)}>
	<Popover.Trigger class={`toolbar-button ${panelOpen.border ? 'is-active' : ''}`} title="Border/Stroke">
		<Icon icon="lucide:square-dashed-bottom-code" class="size-4" />
		<span>Border</span>
	</Popover.Trigger>
	<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
		<div class="flyout-title">Border / Stroke</div>
		<div class="icon-flyout-label">Color</div>
		<input class="icon-flyout-input" type="color" bind:value={borderDraft.strokeColor} />
		<div class="icon-flyout-label">Width</div>
		<input class="icon-flyout-input" type="number" min="0" step="0.5" bind:value={borderDraft.strokeWidth} />
		<div class="border-style-buttons">
			{#each borderStyleChoices as choice}
				<button
					type="button"
					class="toolbar-button toolbar-button-sm"
					class:is-active={borderDraft.lineStyle === choice.id}
					onclick={() => (borderDraft.lineStyle = choice.id as 'solid' | 'dashed' | 'dotted' | 'none')}
				>
					<Icon icon={choice.icon} class="size-4" />
					<span>{choice.label}</span>
				</button>
			{/each}
		</div>
		<div class="icon-flyout-actions">
			<button class="toolbar-button toolbar-button-sm" onclick={onCloseAllPanels}>Cancel</button>
			<button class="toolbar-button toolbar-button-sm" onclick={onApplyBorderDraft}>Apply</button>
		</div>
	</Popover.Content>
</Popover.Root>

<Popover.Root open={panelOpen.fill} onOpenChange={(open) => onPanelOpenChange('fill', open)}>
	<Popover.Trigger class={`toolbar-button ${panelOpen.fill ? 'is-active' : ''}`} title="Fill Color">
		<Icon icon="lucide:paintbucket" class="size-4" />
		<span>Fill</span>
	</Popover.Trigger>
	<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
		<div class="flyout-title">Fill Color</div>
		{#if !selectedNodeId}
			<div class="icon-result-empty">Fill is available for nodes only.</div>
		{/if}
		<input class="icon-flyout-input" type="color" bind:value={fillDraft.fillColor} />
		<div class="icon-flyout-actions">
			<button class="toolbar-button toolbar-button-sm" onclick={onCloseAllPanels}>Cancel</button>
			<button class="toolbar-button toolbar-button-sm" onclick={onApplyFillDraft}>Apply</button>
		</div>
	</Popover.Content>
</Popover.Root>

<Popover.Root open={panelOpen.text} onOpenChange={(open) => onPanelOpenChange('text', open)}>
	<Popover.Trigger class={`toolbar-button ${panelOpen.text ? 'is-active' : ''}`} title="Text Styling">
		<Icon icon="lucide:type" class="size-4" />
		<span>Text</span>
	</Popover.Trigger>
	<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
		<div class="flyout-title">Text</div>
		<div class="icon-flyout-label">Color</div>
		<input class="icon-flyout-input" type="color" bind:value={textDraft.textColor} />
		<div class="icon-flyout-label">Size</div>
		<input class="icon-flyout-input" type="number" min="8" step="1" bind:value={textDraft.fontSize} />
		<div class="icon-flyout-label">Font Family</div>
		<input class="icon-flyout-input" type="text" bind:value={textDraft.fontFamily} placeholder="sans-serif" />
		<div class="icon-flyout-actions">
			<button class="toolbar-button toolbar-button-sm" onclick={onResetTextDraftToTheme}>Reset</button>
			<button class="toolbar-button toolbar-button-sm" onclick={onCloseAllPanels}>Cancel</button>
			<button class="toolbar-button toolbar-button-sm" onclick={onApplyTextDraft}>Apply</button>
		</div>
	</Popover.Content>
</Popover.Root>

<Popover.Root open={panelOpen.icon} onOpenChange={(open) => onPanelOpenChange('icon', open)}>
	<Popover.Trigger
		class={`toolbar-button ${panelOpen.icon ? 'is-active' : ''}`}
		title="Icon"
		disabled={!selectedNodeId}
	>
		<Icon icon="lucide:badge-plus" class="size-4" />
		<span>Icon</span>
	</Popover.Trigger>
	<Popover.Content class="element-flyout-panel" align="start" sideOffset={8}>
		<div class="flyout-title">Icon</div>
		<label class="icon-flyout-label" for="node-icon-input">Search icons</label>
		<input
			id="node-icon-input"
			class="icon-flyout-input"
			type="text"
			bind:value={iconSearchQuery}
			placeholder="Search (e.g. aws, database, github)"
		/>
		<div class="icon-token-preview">
			<span class="icon-token-preview-label">Selected</span>
			<input
				class="icon-flyout-input"
				type="text"
				bind:value={iconInputValue}
				placeholder="brand/github_actions"
				onkeydown={(event) => {
					if (event.key === 'Enter') onApplyIcon();
				}}
			/>
		</div>
		<div class="icon-results-list" role="listbox" aria-label="Available icons">
			{#each filteredIconTokens as token}
				<button type="button" class="icon-result-item" onclick={() => onSelectIconToken(token)}>
					<code>{token}</code>
				</button>
			{/each}
			{#if filteredIconTokens.length === 0}
				<div class="icon-result-empty">No icons match your search.</div>
			{/if}
		</div>
		<div class="icon-flyout-actions">
			<button class="toolbar-button toolbar-button-sm" onclick={onApplyIcon}>Apply</button>
			<button class="toolbar-button toolbar-button-sm" onclick={onClearIcon}>Clear</button>
		</div>
	</Popover.Content>
</Popover.Root>

<div class="toolbar-divider-vertical"></div>
<button onclick={onDelete} class="toolbar-button toolbar-button-danger" title="Delete element">
	<Icon icon="lucide:trash-2" class="size-4" />
</button>

{#if showCreateStyleDialog}
	<div class="style-create-overlay">
		<div class="style-create-dialog">
			<h3 class="flyout-title mb-2">{editingStyleName ? 'Edit Style' : 'Create Style'}</h3>
			<label class="icon-flyout-label" for="style-name-input">Style Name</label>
			<input id="style-name-input" class="icon-flyout-input" type="text" bind:value={newStyleName} placeholder="myStyle" />
			<div class="style-create-grid">
				<div>
					<label class="icon-flyout-label" for="style-fill-input">Fill</label>
					<input id="style-fill-input" class="icon-flyout-input" type="color" bind:value={newStyleDraft.fillColor} />
				</div>
				<div>
					<label class="icon-flyout-label" for="style-stroke-input">Stroke</label>
					<input id="style-stroke-input" class="icon-flyout-input" type="color" bind:value={newStyleDraft.strokeColor} />
				</div>
				<div>
					<label class="icon-flyout-label" for="style-stroke-width-input">Stroke Width</label>
					<input
						id="style-stroke-width-input"
						class="icon-flyout-input"
						type="number"
						min="0"
						step="0.5"
						bind:value={newStyleDraft.strokeWidth}
					/>
				</div>
				<div>
					<label class="icon-flyout-label" for="style-text-color-input">Text Color</label>
					<input id="style-text-color-input" class="icon-flyout-input" type="color" bind:value={newStyleDraft.textColor} />
				</div>
				<div>
					<label class="icon-flyout-label" for="style-font-size-input">Font Size</label>
					<input
						id="style-font-size-input"
						class="icon-flyout-input"
						type="number"
						min="8"
						step="1"
						bind:value={newStyleDraft.fontSize}
					/>
				</div>
				<div>
					<label class="icon-flyout-label" for="style-font-family-input">Font Family</label>
					<input
						id="style-font-family-input"
						class="icon-flyout-input"
						type="text"
						bind:value={newStyleDraft.fontFamily}
						placeholder="sans-serif"
					/>
				</div>
			</div>
			<div class="icon-flyout-actions">
				<button class="toolbar-button toolbar-button-sm" onclick={onCloseCreateStyleDialog}>Cancel</button>
				<button class="toolbar-button toolbar-button-sm" onclick={onSaveStyleDeclarationAndApply}>Save</button>
			</div>
		</div>
	</div>
{/if}
