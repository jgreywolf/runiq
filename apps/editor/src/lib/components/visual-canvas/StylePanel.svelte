<script lang="ts">
	interface Props {
		show: boolean;
		isNode: boolean;
		fillColor: string;
		strokeColor: string;
		strokeWidth: string;
		textColor: string;
		routing: string;
		onClose: () => void;
		onStyleChange: (property: string, value: string) => void;
	}

	let {
		show = $bindable(),
		isNode,
		fillColor = $bindable(),
		strokeColor = $bindable(),
		strokeWidth = $bindable(),
		textColor = $bindable(),
		routing = $bindable(),
		onClose,
		onStyleChange
	}: Props = $props();

	function handleColorClick(property: string, currentValue: string) {
		const input = document.createElement('input');
		input.type = 'color';
		input.value = currentValue || '#000000';

		input.addEventListener('change', (e) => {
			const newValue = (e.target as HTMLInputElement).value;
			onStyleChange(property, newValue);
		});

		input.click();
	}
</script>

{#if show}
	<div class="style-panel-container">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="style-panel" onclick={(e) => e.stopPropagation()}>
			<div class="style-panel-header">
				<h3 class="text-sm font-semibold">
					Style {isNode ? 'Node' : 'Edge'}
				</h3>
				<button class="close-button" onclick={onClose} aria-label="Close style panel"> × </button>
			</div>

			<div class="style-panel-content">
				{#if isNode}
					<!-- Fill Color -->
					<div class="style-field">
						<label class="style-label">Fill Color</label>
						<div class="style-color-group">
							<button
								class="style-color-swatch"
								style="background-color: {fillColor || '#f0f0f0'}"
								onclick={() => handleColorClick('fillColor', fillColor)}
								aria-label="Choose fill color"
							></button>
							<input
								type="text"
								class="style-text-input"
								value={fillColor || ''}
								oninput={(e) => onStyleChange('fillColor', e.currentTarget.value)}
								placeholder="#f0f0f0"
							/>
						</div>
					</div>

					<!-- Text Color -->
					<div class="style-field">
						<label class="style-label">Text Color</label>
						<div class="style-color-group">
							<button
								class="style-color-swatch"
								style="background-color: {textColor || '#000000'}"
								onclick={() => handleColorClick('textColor', textColor)}
								aria-label="Choose text color"
							></button>
							<input
								type="text"
								class="style-text-input"
								value={textColor || ''}
								oninput={(e) => onStyleChange('textColor', e.currentTarget.value)}
								placeholder="#000000"
							/>
						</div>
					</div>
				{/if}

				<!-- Stroke Color -->
				<div class="style-field">
					<label class="style-label">Stroke Color</label>
					<div class="style-color-group">
						<button
							class="style-color-swatch"
							style="background-color: {strokeColor || '#333333'}"
							onclick={() => handleColorClick('strokeColor', strokeColor)}
							aria-label="Choose stroke color"
						></button>
						<input
							type="text"
							class="style-text-input"
							value={strokeColor || ''}
							oninput={(e) => onStyleChange('strokeColor', e.currentTarget.value)}
							placeholder="#333333"
						/>
					</div>
				</div>

				<!-- Stroke Width -->
				<div class="style-field">
					<label class="style-label">Stroke Width</label>
					<input
						type="number"
						class="style-text-input"
						value={strokeWidth || ''}
						oninput={(e) => onStyleChange('strokeWidth', e.currentTarget.value)}
						placeholder="2"
						min="0"
						step="0.5"
					/>
				</div>

				{#if !isNode}
					<!-- Edge Routing -->
					<div class="style-field">
						<label class="style-label">Routing</label>
						<select
							class="style-select"
							value={routing || ''}
							onchange={(e) => onStyleChange('routing', e.currentTarget.value)}
						>
							<option value="">Default</option>
							<option value="orthogonal">Orthogonal</option>
							<option value="polyline">Polyline</option>
							<option value="curved">Curved</option>
							<option value="straight">Straight</option>
						</select>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.style-panel-container {
		position: fixed;
		top: 60px;
		right: 20px;
		z-index: 1000;
	}

	.style-panel {
		width: 280px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.style-panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 1px solid #e5e7eb;
		background: #f9fafb;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 24px;
		line-height: 1;
		color: #6b7280;
		cursor: pointer;
		padding: 0;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-button:hover {
		color: #374151;
	}

	.style-panel-content {
		padding: 16px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.style-field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.style-label {
		font-size: 12px;
		font-weight: 500;
		color: #374151;
	}

	.style-color-group {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.style-color-swatch {
		width: 32px;
		height: 32px;
		border-radius: 4px;
		border: 2px solid #d1d5db;
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.style-color-swatch:hover {
		border-color: #9ca3af;
	}

	.style-text-input {
		flex: 1;
		padding: 6px 8px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 13px;
		transition: border-color 0.15s;
	}

	.style-text-input:focus {
		outline: none;
		border-color: #3b82f6;
	}

	.style-select {
		padding: 6px 8px;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 13px;
		background: white;
		cursor: pointer;
		transition: border-color 0.15s;
	}

	.style-select:focus {
		outline: none;
		border-color: #3b82f6;
	}
</style>
