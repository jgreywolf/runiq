<script lang="ts">
	import { getAvailableBaseThemes, getDiagramTheme } from '@runiq/core';

	interface ThemePreviewEntry {
		id: string;
		name: string;
		backgroundColor: string;
		edgeColor: string;
		accentColor: string;
		nodeColors: string[];
		sampleBackground: string;
		sampleTextColor: string;
	}

	interface Props {
		onSelect: (themeId: string) => void;
	}

	let { onSelect }: Props = $props();

	function hexToRgb(hexColor: string): { r: number; g: number; b: number } | null {
		const normalized = hexColor.trim();
		const shortMatch = /^#([0-9a-f]{3})$/i.exec(normalized);
		if (shortMatch) {
			const [r, g, b] = shortMatch[1].split('').map((char) => parseInt(char + char, 16));
			return { r, g, b };
		}
		const longMatch = /^#([0-9a-f]{6})$/i.exec(normalized);
		if (!longMatch) return null;
		return {
			r: parseInt(longMatch[1].slice(0, 2), 16),
			g: parseInt(longMatch[1].slice(2, 4), 16),
			b: parseInt(longMatch[1].slice(4, 6), 16)
		};
	}

	function getReadableTextColor(backgroundColor: string): string {
		const rgb = hexToRgb(backgroundColor);
		if (!rgb) return '#111827';
		const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
		return luminance > 0.57 ? '#111827' : '#ffffff';
	}

	const themePreviewEntries: ThemePreviewEntry[] = getAvailableBaseThemes().map((themeId) => {
		const theme = getDiagramTheme(themeId);
		const sampleBackground = theme.nodeColors[0] ?? theme.accentColor;
		return {
			id: themeId,
			name: theme.name,
			backgroundColor: theme.backgroundColor,
			edgeColor: theme.edgeColor,
			accentColor: theme.accentColor,
			nodeColors: theme.nodeColors.slice(0, 3),
			sampleBackground,
			sampleTextColor: getReadableTextColor(sampleBackground)
		};
	});
</script>

<div class="theme-picker-flyout">
	<div class="section-label">Theme</div>
	{#each themePreviewEntries as theme}
		<button class="theme-preview-row" onclick={() => onSelect(theme.id)}>
			<div class="theme-preview-header">
				<span>{theme.name}</span>
				<span class="theme-preview-id">{theme.id}</span>
			</div>
			<div class="theme-preview-swatches">
				<span style="background: {theme.backgroundColor}; border-color: {theme.edgeColor};"></span>
				<span style="background: {theme.nodeColors[0] ?? theme.accentColor};"></span>
				<span style="background: {theme.nodeColors[1] ?? theme.accentColor};"></span>
				<span style="background: {theme.nodeColors[2] ?? theme.accentColor};"></span>
				<span style="background: {theme.accentColor};"></span>
			</div>
			<div
				class="theme-preview-sample"
				style="color: {theme.sampleTextColor}; background: {theme.sampleBackground}; border-color: {theme.edgeColor};"
			>
				Aa
			</div>
		</button>
	{/each}
</div>

<style>
	.theme-picker-flyout {
		display: flex;
		flex-direction: column;
		min-width: 220px;
	}

	.section-label {
		padding: 4px 8px 2px;
		font-size: 11px;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.theme-preview-row {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-areas:
			'header sample'
			'swatches sample';
		column-gap: 10px;
		row-gap: 4px;
		padding: 8px;
		text-align: left;
		background: transparent;
		border: 0;
		border-radius: 6px;
		font-size: 12px;
		color: #1f2937;
	}

	.theme-preview-row:hover {
		background: #f3f4f6;
	}

	.theme-preview-header {
		grid-area: header;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}

	.theme-preview-id {
		font-size: 10px;
		color: #6b7280;
		text-transform: lowercase;
	}

	.theme-preview-swatches {
		grid-area: swatches;
		display: flex;
		gap: 4px;
	}

	.theme-preview-swatches span {
		width: 14px;
		height: 14px;
		border-radius: 4px;
		border: 1px solid #e5e7eb;
	}

	.theme-preview-sample {
		grid-area: sample;
		width: 28px;
		height: 28px;
		border-radius: 6px;
		border: 1px solid #d1d5db;
		font-size: 11px;
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
</style>
