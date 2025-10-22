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
					label: 'Class',
					data: {
						attributes: [{ name: 'attr', type: 'type', visibility: 'public' }],
						methods: [{ name: 'method', returnType: 'void', visibility: 'public' }]
					}
				},
				style: {
					padding: 3,
					fill: '#cbd5e1',
					stroke: '#000',
					strokeWidth: 1,
					font: 'sans-serif',
					fontSize: 7
				},
				measureText: (text: string, style: any) => {
					const charWidth = 4;
					return { width: text.length * charWidth, height: 8 };
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

		// Special handling for lightning bolt to make it more visible
		if (shapeId === 'lightning') {
			return {
				node: { id: '', label: '' },
				style: {
					padding: 4,
					fill: '#fbbf24',
					stroke: '#000',
					strokeWidth: 1.5,
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
			'document',
			'delay',
			'braceLeft',
			'braceRight'
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
		// Handle electrical components that don't have shape definitions
		const electricalComponents = [
			'resistor',
			'capacitor',
			'inductor',
			'transformer',
			'voltageSource',
			'currentSource',
			'ground',
			'junction',
			'diode',
			'led',
			'npnTransistor',
			'pnpTransistor',
			'nmosTransistor',
			'pmosTransistor',
			'opamp',
			'andGate',
			'orGate',
			'notGate',
			'bufferGate',
			'xorGate',
			'xnorGate',
			'nandGate',
			'norGate',
			'and3Gate',
			'or3Gate',
			'nand3Gate',
			'nor3Gate',
			'dFlipFlop',
			'jkFlipFlop',
			'tFlipFlop',
			'register4',
			'register8',
			'mux4to1',
			'mux8to1',
			'decoder2to4',
			'decoder3to8'
		];

		if (electricalComponents.includes(shapeId)) {
			// Return a simple icon representation for electrical components
			const iconMap: Record<string, string> = {
				resistor: '─┴─',
				capacitor: '─||─',
				inductor: '─∿─',
				transformer: '∿∿',
				voltageSource: '─⊕─',
				currentSource: '─⊙─',
				ground: '⏚',
				junction: '●',
				diode: '─▷|─',
				led: '─▷|→',
				npnTransistor: '─┤├─',
				pnpTransistor: '─├┤─',
				nmosTransistor: '─┤├─',
				pmosTransistor: '─├┤─',
				opamp: '─▷─',
				andGate: '─D─',
				orGate: '─)─',
				notGate: '─▷○',
				bufferGate: '─▷─',
				xorGate: '─⊕─',
				xnorGate: '⊕○',
				nandGate: '─D○',
				norGate: '─)○',
				and3Gate: 'D3',
				or3Gate: ')3',
				nand3Gate: 'D3○',
				nor3Gate: ')3○',
				dFlipFlop: 'D',
				jkFlipFlop: 'JK',
				tFlipFlop: 'T',
				register4: 'R4',
				register8: 'R8',
				mux4to1: 'M4',
				mux8to1: 'M8',
				decoder2to4: 'D24',
				decoder3to8: 'D38'
			};

			const icon = iconMap[shapeId] || '─?─';

			return `
				<svg 
					width="${size}" 
					height="${size}" 
					viewBox="0 0 40 40"
					xmlns="http://www.w3.org/2000/svg"
					style="display: block;"
				>
					<text 
						x="20" 
						y="25" 
						text-anchor="middle" 
						font-family="monospace" 
						font-size="16" 
						fill="#334155"
					>${icon}</text>
				</svg>
			`;
		}

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
