<script lang="ts">
	import type { StyleProperties } from '$lib/types/editor';
	import Icon from '@iconify/svelte';

	interface Props {
		selectedIds: Set<string>;
		currentStyles: StyleProperties;
		hasMixedValues?: boolean;
		onClose: () => void;
		onStyleChange: (property: string, value: string | number) => void;
		onResetStyles?: () => void;
	}

	let {
		selectedIds,
		currentStyles,
		hasMixedValues = false,
		onClose,
		onStyleChange,
		onResetStyles
	}: Props = $props();

	let isVisible = $derived(selectedIds.size > 0);
	let isMultiSelect = $derived(selectedIds.size > 1);

	function handleColorClick(property: string, currentValue?: string) {
		const input = document.createElement('input');
		input.type = 'color';
		input.value = currentValue || '#000000';

		input.addEventListener('change', (e) => {
			const newValue = (e.target as HTMLInputElement).value;
			onStyleChange(property, newValue);
		});

		input.click();
	}

	function handleNumberInput(property: string, value: string) {
		const numValue = parseFloat(value);
		if (!isNaN(numValue)) {
			onStyleChange(property, numValue);
		}
	}
</script>

{#if isVisible}
	<div class="style-panel-overlay" onclick={onClose} role="presentation"></div>
	<div class="style-panel">
		<div class="panel-header">
			<div class="header-content">
				<Icon icon="lucide:palette" class="header-icon" />
				<h3 class="header-title">
					Style Properties
					{#if isMultiSelect}
						<span class="selection-count">({selectedIds.size} selected)</span>
					{/if}
				</h3>
			</div>
			<button class="close-btn" onclick={onClose} aria-label="Close style panel" title="Close">
				<Icon icon="lucide:x" class="icon" />
			</button>
		</div>

		<div class="panel-body">
			{#if hasMixedValues}
				<div class="mixed-values-notice">
					<Icon icon="lucide:info" class="notice-icon" />
					<span>Multiple values selected. Changes will apply to all.</span>
				</div>
			{/if}

			<!-- Fill Color -->
			<div class="style-field">
				<label class="field-label">Fill Color</label>
				<div class="field-input-group">
					<button
						type="button"
						class="color-swatch"
						style="background-color: {currentStyles.fill || '#ffffff'}"
						onclick={() => handleColorClick('fill', currentStyles.fill)}
						title="Click to pick color"
						aria-label="Pick fill color"
					>
						<span class="sr-only">Pick fill color</span>
					</button>
					<input
						type="text"
						class="text-input"
						value={currentStyles.fill || ''}
						onchange={(e) => onStyleChange('fill', e.currentTarget.value)}
						placeholder="#FFFFFF"
						aria-label="Fill color hex value"
					/>
				</div>
			</div>

			<!-- Stroke Color -->
			<div class="style-field">
				<label class="field-label">Stroke Color</label>
				<div class="field-input-group">
					<button
						type="button"
						class="color-swatch"
						style="background-color: {currentStyles.stroke || '#000000'}"
						onclick={() => handleColorClick('stroke', currentStyles.stroke)}
						title="Click to pick color"
						aria-label="Pick stroke color"
					>
						<span class="sr-only">Pick stroke color</span>
					</button>
					<input
						type="text"
						class="text-input"
						value={currentStyles.stroke || ''}
						onchange={(e) => onStyleChange('stroke', e.currentTarget.value)}
						placeholder="#000000"
						aria-label="Stroke color hex value"
					/>
				</div>
			</div>

			<!-- Stroke Width -->
			<div class="style-field">
				<label class="field-label" for="stroke-width">Stroke Width</label>
				<input
					id="stroke-width"
					type="number"
					class="number-input"
					value={currentStyles.strokeWidth || 1}
					oninput={(e) => handleNumberInput('strokeWidth', e.currentTarget.value)}
					min="0"
					max="20"
					step="0.5"
					aria-label="Stroke width"
				/>
			</div>

			<!-- Opacity -->
			<div class="style-field">
				<label class="field-label" for="opacity">
					Opacity <span class="field-value">{currentStyles.opacity || 1}</span>
				</label>
				<input
					id="opacity"
					type="range"
					class="range-input"
					value={currentStyles.opacity || 1}
					oninput={(e) => handleNumberInput('opacity', e.currentTarget.value)}
					min="0"
					max="1"
					step="0.1"
					aria-label="Opacity"
				/>
			</div>

			<!-- Font Size -->
			<div class="style-field">
				<label class="field-label" for="font-size">Font Size</label>
				<input
					id="font-size"
					type="number"
					class="number-input"
					value={currentStyles.fontSize || 14}
					oninput={(e) => handleNumberInput('fontSize', e.currentTarget.value)}
					min="8"
					max="72"
					step="1"
					aria-label="Font size"
				/>
			</div>

			<!-- Font Family -->
			<div class="style-field">
				<label class="field-label" for="font-family">Font Family</label>
				<select
					id="font-family"
					class="select-input"
					value={currentStyles.fontFamily || 'inherit'}
					onchange={(e) => onStyleChange('fontFamily', e.currentTarget.value)}
					aria-label="Font family"
				>
					<option value="inherit">Inherit</option>
					<option value="Arial">Arial</option>
					<option value="Helvetica">Helvetica</option>
					<option value="Times New Roman">Times New Roman</option>
					<option value="Courier New">Courier New</option>
					<option value="Georgia">Georgia</option>
					<option value="Verdana">Verdana</option>
				</select>
			</div>
		</div>

		<!-- Reset Button -->
		{#if onResetStyles}
			<div class="panel-footer">
				<button class="reset-btn" onclick={onResetStyles} title="Remove custom styles">
					<Icon icon="lucide:rotate-ccw" class="icon" />
					<span>Reset to Theme</span>
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.style-panel-overlay {
		position: fixed;
		inset: 0;
		background: transparent;
		z-index: 999;
	}

	.style-panel {
		position: fixed;
		top: 4rem;
		right: 1rem;
		width: 320px;
		max-height: calc(100vh - 6rem);
		background: white;
		border: 1px solid hsl(var(--border));
		border-radius: 0.5rem;
		box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
		z-index: 1000;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid hsl(var(--border));
		background: hsl(var(--muted) / 0.5);
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.header-icon {
		width: 1.25rem;
		height: 1.25rem;
		color: hsl(var(--primary));
	}

	.header-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: hsl(var(--foreground));
		margin: 0;
	}

	.selection-count {
		font-size: 0.75rem;
		font-weight: 400;
		color: hsl(var(--muted-foreground));
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		color: hsl(var(--muted-foreground));
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.close-btn:hover {
		background: hsl(var(--accent));
		color: hsl(var(--accent-foreground));
	}

	.icon {
		width: 1rem;
		height: 1rem;
	}

	.panel-body {
		padding: 1rem;
		overflow-y: auto;
		flex: 1;
	}

	.mixed-values-notice {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		margin-bottom: 1rem;
		background: hsl(var(--muted));
		border-radius: 0.375rem;
		font-size: 0.75rem;
		color: hsl(var(--muted-foreground));
	}

	.notice-icon {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
	}

	.style-field {
		margin-bottom: 1rem;
	}

	.field-label {
		display: block;
		font-size: 0.75rem;
		font-weight: 500;
		color: hsl(var(--foreground));
		margin-bottom: 0.5rem;
	}

	.field-value {
		color: hsl(var(--muted-foreground));
		font-weight: 400;
	}

	.field-input-group {
		display: flex;
		gap: 0.5rem;
	}

	.color-swatch {
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid hsl(var(--border));
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.15s ease;
		flex-shrink: 0;
	}

	.color-swatch:hover {
		border-color: hsl(var(--primary));
		box-shadow: 0 0 0 2px hsl(var(--primary) / 0.1);
	}

	.text-input,
	.number-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		border: 1px solid hsl(var(--border));
		border-radius: 0.375rem;
		background: white;
		color: hsl(var(--foreground));
		transition: all 0.15s ease;
	}

	.text-input:focus,
	.number-input:focus {
		outline: none;
		border-color: hsl(var(--primary));
		box-shadow: 0 0 0 2px hsl(var(--primary) / 0.1);
	}

	.range-input {
		width: 100%;
		height: 0.375rem;
		background: hsl(var(--muted));
		border-radius: 0.25rem;
		appearance: none;
		cursor: pointer;
	}

	.range-input::-webkit-slider-thumb {
		appearance: none;
		width: 1rem;
		height: 1rem;
		background: hsl(var(--primary));
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.range-input::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 0 0 4px hsl(var(--primary) / 0.1);
	}

	.range-input::-moz-range-thumb {
		width: 1rem;
		height: 1rem;
		background: hsl(var(--primary));
		border: none;
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.range-input::-moz-range-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 0 0 4px hsl(var(--primary) / 0.1);
	}

	.select-input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		border: 1px solid hsl(var(--border));
		border-radius: 0.375rem;
		background: white;
		color: hsl(var(--foreground));
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.select-input:focus {
		outline: none;
		border-color: hsl(var(--primary));
		box-shadow: 0 0 0 2px hsl(var(--primary) / 0.1);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.panel-footer {
		padding: 1rem;
		border-top: 1px solid hsl(var(--border));
		background: hsl(var(--muted) / 0.3);
	}

	.reset-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.625rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: hsl(var(--destructive-foreground));
		background: hsl(var(--destructive));
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.reset-btn:hover {
		background: hsl(var(--destructive) / 0.9);
	}

	.reset-btn:active {
		transform: scale(0.98);
	}

	.reset-btn .icon {
		width: 1rem;
		height: 1rem;
	}

	@media (max-width: 640px) {
		.style-panel {
			left: 1rem;
			right: 1rem;
			width: auto;
		}
	}
</style>
