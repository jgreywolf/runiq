<script lang="ts">
	interface Props {
		show: boolean;
		isNode: boolean;
		selectedElementId: string | null;
		currentProfile: any;
		onClose: () => void;
		onStyleChange: (property: string, value: string) => void;
	}

	let {
		show = $bindable(),
		isNode = $bindable(),
		selectedElementId = $bindable(),
		currentProfile,
		onClose,
		onStyleChange
	}: Props = $props();

	const styleValues = $derived.by(() => {
		console.debug('Entered styleValues effect');
		console.debug('selectedElementId:', selectedElementId);
		console.debug('isNode:', isNode);
		console.debug('currentProfile:', currentProfile);
		if (!selectedElementId) {
			return {
				fillColor: '',
				strokeColor: '',
				strokeWidth: '',
				textSize: '',
				textColor: '',
				shadow: false,
				routing: ''
			};
		}

		// Find the element in the profile
		let element: any = null;

		// Try to find as a node
		if (isNode) {
			element = currentProfile.nodes.find((n: any) => n.id === selectedElementId);
		} else {
			element = currentProfile.edges.find((e: any) => {
				// Edge ID might be "from-to" format, possibly with suffix like "from-to-1" or "from-to-2"
				const edgeId = `${e.from}-${e.to}`;

				// Direct match
				if (edgeId === selectedElementId || e.id === selectedElementId) {
					return true;
				}

				// Match with suffix stripped (e.g., "decision-process2-2" -> "decision-process2")
				if (selectedElementId.startsWith(edgeId + '-')) {
					return true;
				}

				return false;
			});
		}

		// Load current style values from node.data or edge properties
		// For nodes, properties are in node.data: fillColor, textColor, strokeColor, strokeWidth, fontSize
		// For edges, properties are directly on edge: strokeColor, strokeWidth, routing
		if (element && isNode) {
			console.debug(element);
			let returnValue = {
				fillColor: element.data.fillColor || '',
				strokeColor: element.data.strokeColor || '',
				strokeWidth: element.data.strokeWidth ? String(element.data.strokeWidth) : '',
				textSize: element.data.fontSize ? String(element.data.fontSize) : '',
				textColor: element.data.textColor || '',
				shadow: element.data.shadow === true || element.data.shadow === 'true',
				routing: ''
			};

			return returnValue;
		}
		if (element && !isNode) {
			return {
				fillColor: '',
				strokeColor: element.strokeColor || element.data?.strokeColor || '',
				strokeWidth: element.strokeWidth
					? String(element.strokeWidth)
					: element.data?.strokeWidth
						? String(element.data.strokeWidth)
						: '',
				textSize: element.fontSize ? String(element.fontSize) : '',
				textColor: element.textColor || '',
				shadow: false,
				routing: element.routing || element.data?.routing || ''
			};
		}

		return {
			fillColor: '',
			strokeColor: '',
			strokeWidth: '',
			textSize: '',
			textColor: '',
			shadow: false,
			routing: ''
		};
	});

	function handleColorClick(property: string, currentValue: string) {
		const input = document.createElement('input');
		input.type = 'color';
		input.value = currentValue || '#000000';
		let newValue = input.value;

		input.addEventListener('change', (e) => {
			newValue = (e.target as HTMLInputElement).value;
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

			<div class="style-panel-body">
				{#if isNode}
					<!-- Fill Color -->
					<div class="style-field">
						<label for="style-background">Background:</label>
						<div class="color-picker-wrapper">
							<button
								type="button"
								class="color-swatch-button"
								style="background-color: {styleValues.fillColor || '#ffffff'}"
								onclick={() => handleColorClick('fillColor', styleValues.fillColor)}
								title="Click to change color"
							>
								<span class="sr-only">Pick color</span>
							</button>
						</div>
						<input
							type="text"
							value={styleValues.fillColor || ''}
							onchange={(e) => onStyleChange('fillColor', e.currentTarget.value)}
							placeholder="#FFFFFF"
							class="style-text-input"
						/>
					</div>
				{/if}

				<!-- Stroke Color -->
				<div class="style-field">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label class="style-label">Stroke Color:</label>
					<div class="color-picker-wrapper">
						<button
							type="button"
							class="color-swatch-button"
							style="background-color: {styleValues.strokeColor || '#ffffff'}"
							onclick={() => handleColorClick('strokeColor', styleValues.strokeColor)}
							title="Click to change color"
						>
							<span class="sr-only">Pick color</span>
						</button>
					</div>
					<input
						type="text"
						value={styleValues.strokeColor || ''}
						onchange={(e) => onStyleChange('strokeColor', e.currentTarget.value)}
						placeholder="#FFFFFF"
						class="style-text-input"
					/>
				</div>

				<!-- Stroke Width -->
				<div class="style-field">
					<label class="style-label">Stroke Width</label>
					<input
						type="number"
						class="style-number-input"
						value={styleValues.strokeWidth || '2'}
						oninput={(e) => onStyleChange('strokeWidth', e.currentTarget.value)}
						placeholder="2"
						min="0"
						step="1"
					/>
				</div>

				<!-- Text Color -->
				<div class="style-field">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label class="style-label">Text Color:</label>
					<div class="color-picker-wrapper">
						<button
							type="button"
							class="color-swatch-button"
							style="background-color: {styleValues.textColor || '#ffffff'}"
							onclick={() => handleColorClick('textColor', styleValues.textColor)}
							title="Click to change color"
						>
							<span class="sr-only">Pick color</span>
						</button>
					</div>
					<input
						type="text"
						value={styleValues.textColor || ''}
						onchange={(e) => onStyleChange('textColor', e.currentTarget.value)}
						placeholder="#FFFFFF"
						class="style-text-input"
					/>
				</div>

				{#if !isNode}
					<!-- Edge Routing -->
					<div class="style-field">
						<label class="style-label">Routing</label>
						<select
							class="style-select"
							value={styleValues.routing || ''}
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
		right: 40px;
		z-index: 1000;
	}

	.style-label {
		font-size: 12px;
		font-weight: 500;
		color: #374151;
	}
</style>
