<script lang="ts">
	import { shapeRegistry } from '@runiq/core';

	interface Props {
		shapeId: string;
		size?: number;
	}

	let { shapeId, size = 24 }: Props = $props();

	// Get the shape definition from registry
	const shape = shapeRegistry.get(shapeId);

	// Create a minimal render context for the icon
	const createMockContext = (shapeId: string) => {
		// Special handling for class shape to show structure
		if (shapeId === 'class') {
			return {
				node: {
					id: '',
					label: '',
					attributes: [{ name: '...', type: '', visibility: 'public' }],
					methods: [{ name: '...', returnType: '', visibility: 'public' }]
				},
				style: {
					padding: 2,
					fill: '#cbd5e1',
					stroke: '#000',
					strokeWidth: 1,
					font: 'sans-serif',
					fontSize: 6
				},
				measureText: (text: string, style: any) => {
					if (text === '...') return { width: 8, height: 4 };
					return { width: 0, height: 0 };
				}
			};
		}

		// Special handling for actor to show stick figure
		if (shapeId === 'actor') {
			return {
				node: { id: '', label: '' },
				style: {
					padding: 1,
					fill: 'none',
					stroke: '#000',
					strokeWidth: 1,
					font: 'sans-serif',
					fontSize: 6
				},
				measureText: (text: string, style: any) => {
					return { width: 0, height: 0 };
				}
			};
		}

		// Shapes that need minimum bounds (won't render properly with no text)
		const needsMinBounds = [
			'roundedRectangle',
			'stadium',
			'trapezoid',
			'flippedTriangle',
			'integrator',
			'pyramid',
			'predefinedProcess',
			'preparation',
			'manualInput',
			'brace-l',
			'brace-r'
		];
		if (needsMinBounds.includes(shapeId)) {
			return {
				node: { id: '', label: '' },
				style: {
					padding: 2,
					fill: '#cbd5e1',
					stroke: '#000',
					strokeWidth: 1,
					font: 'sans-serif',
					fontSize: 8
				},
				measureText: (text: string, style: any) => {
					// Return minimum text size to ensure shape renders
					return { width: 30, height: 12 };
				}
			};
		}

		// Shapes that are squashed and need wider bounds
		const needsWiderBounds = ['parallelogram', 'trapezoid'];
		if (needsWiderBounds.includes(shapeId)) {
			return {
				node: { id: '', label: '' },
				style: {
					padding: 2,
					fill: '#cbd5e1',
					stroke: '#000',
					strokeWidth: 1,
					font: 'sans-serif',
					fontSize: 8
				},
				measureText: (text: string, style: any) => {
					// Return wider text size for parallelogram and trapezoid
					return { width: 40, height: 10 };
				}
			};
		}

		// Default context for other shapes
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#cbd5e1',
				stroke: '#000',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 8
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	};

	// Render the shape
	let svgContent = $derived.by(() => {
		if (!shape) return '';

		const mockContext = createMockContext(shapeId);
		const bounds = shape.bounds(mockContext as any);
		const shapeContent = shape.render(mockContext as any, { x: 0, y: 0 });

		return `
			<svg 
				width="${size}" 
				height="${size}" 
				viewBox="0 0 ${bounds.width} ${bounds.height}"
				xmlns="http://www.w3.org/2000/svg"
				style="display: block;"
			>
				${shapeContent}
			</svg>
		`;
	});
</script>

{@html svgContent}
