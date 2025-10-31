<script lang="ts">
	import { shapeRegistry } from '@runiq/core';

	interface Props {
		shapeId: string;
		size?: number;
	}

	let { shapeId, size = 24 }: Props = $props();

	// Map toolbox IDs to actual shape registry IDs
	const shapeIdMap: Record<string, string> = {
		paperTape: 'flag',
		package: 'umlPackage', // UML package
		// BPMN events map to bpmnEvent
		bpmnEventStart: 'bpmnEvent',
		bpmnEventEnd: 'bpmnEvent',
		bpmnEventIntermediate: 'bpmnEvent',
		// BPMN gateways map to bpmnGateway
		bpmnGatewayExclusive: 'bpmnGateway',
		bpmnGatewayParallel: 'bpmnGateway',
		bpmnGatewayInclusive: 'bpmnGateway'
	};

	// IDs that should display special icons (not in shape registry)
	const specialIcons: Record<string, string> = {
		container: '📦',
		containerStyled: '📦',
		group: '🗂️'
	};

	// Get the actual shape ID (mapped or original)
	const actualShapeId = shapeIdMap[shapeId] || shapeId;

	// Get the shape definition from registry
	const shape = shapeRegistry.get(actualShapeId);

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

		// Special handling for pyramid - requires data
		if (shapeId === 'pyramid') {
			return {
				node: {
					id: '',
					label: '',
					data: {
						levels: [
							{ label: 'Top', value: 50 },
							{ label: 'Mid', value: 100 },
							{ label: 'Base', value: 150 }
						]
					}
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
					return { width: 20, height: 8 };
				}
			};
		}

	// Special handling for multiRectangle to make offset more visible
	if (shapeId === 'multiRectangle') {
		return {
			node: { id: '', label: '', data: { offset: 6, stackCount: 3 } },
			style: {
				padding: 2,
				fill: '#f0f0f0',
				stroke: '#333',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 20, height: 8 };
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

	// Special handling for C4 shapes to show proper styling
	if (shapeId === 'c4-person') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#08427B',
				stroke: '#052E56',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	if (shapeId === 'c4-system') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 3,
				fill: '#1168BD',
				stroke: '#0B4884',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 7
			},
			measureText: (text: string, style: any) => {
				return { width: 30, height: 10 };
			}
		};
	}

	if (shapeId === 'c4-container') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 3,
				fill: '#438DD5',
				stroke: '#2E6295',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 28, height: 10 };
			}
		};
	}

	if (shapeId === 'c4-component') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#85BBF0',
				stroke: '#5A9BD5',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 24, height: 8 };
			}
		};
	}

	// BPMN shapes with proper styling
	if (shapeId === 'bpmnTask') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#fff',
				stroke: '#000',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 28, height: 10 };
			}
		};
	}

	if (shapeId === 'bpmnEventStart' || shapeId === 'bpmnEventEnd' || shapeId === 'bpmnEventIntermediate') {
		const eventType = shapeId.replace('bpmnEvent', '').toLowerCase();
		return {
			node: { id: '', label: '', shape: 'bpmnEvent', data: { values: [{ eventType }] } },
			style: {
				padding: 1,
				fill: '#fff',
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

	if (shapeId === 'bpmnGatewayExclusive' || shapeId === 'bpmnGatewayParallel' || shapeId === 'bpmnGatewayInclusive') {
		const gatewayType = shapeId.replace('bpmnGateway', '').toLowerCase();
		return {
			node: { id: '', label: '', shape: 'bpmnGateway', data: { values: [{ gatewayType }] } },
			style: {
				padding: 1,
				fill: '#fff',
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

	if (shapeId === 'bpmnDataObject') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#fff',
				stroke: '#000',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 18, height: 24 };
			}
		};
	}

	if (shapeId === 'bpmnMessage') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#fff',
				stroke: '#000',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 24, height: 18 };
			}
		};
	}

	// Quantum circuit shapes - use thinner strokes for small circles
	if (shapeId === 'controlDot') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 0,
				fill: '#000',
				stroke: 'none', // No stroke - solid filled circle
				strokeWidth: 0,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	if (shapeId === 'cnotTarget') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 0,
				fill: 'none',
				stroke: '#000',
				strokeWidth: 0.5, // Thinner stroke for icon
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	if (shapeId === 'pieChart') {
		return {
			node: { id: '', label: '', data: { width: 120, height: 40 } },
			style: {
				padding: 2,
				fill: '#e6f3ff',
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

	// Chart shapes with sample data for preview
	if (shapeId === 'pieChart') {
		return {
			node: {
				id: '',
				label: '',
				data: {
					values: [
						{ label: 'A', value: 30 },
						{ label: 'B', value: 25 },
						{ label: 'C', value: 20 }
					],
					showLegend: false
				}
			},
			style: {
				padding: 2,
				font: 'sans-serif',
				fontSize: 5
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	if (shapeId === 'barChartVertical') {
		return {
			node: {
				id: '',
				label: '',
				data: {
					values: [
						{ label: 'A', value: 30 },
						{ label: 'B', value: 45 },
						{ label: 'C', value: 25 }
					],
					showLegend: false
				}
			},
			style: {
				padding: 2,
				font: 'sans-serif',
				fontSize: 5
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	if (shapeId === 'barChartHorizontal') {
		return {
			node: {
				id: '',
				label: '',
				data: {
					values: [
						{ label: 'A', value: 30 },
						{ label: 'B', value: 45 },
						{ label: 'C', value: 25 }
					],
					showLegend: false
				}
			},
			style: {
				padding: 2,
				font: 'sans-serif',
				fontSize: 5
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	// AWS shapes with official AWS colors
	if (shapeId === 'awsEc2') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#FF9900',
				stroke: '#232F3E',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	if (shapeId === 'awsS3') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#569A31',
				stroke: '#232F3E',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	if (shapeId === 'awsLambda') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#FF9900',
				stroke: '#232F3E',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	if (shapeId === 'awsRds') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#3F5BE7',
				stroke: '#232F3E',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	if (shapeId === 'awsVpc') {
		return {
			node: { id: '', label: '', data: { width: 80, height: 60 } },
			style: {
				padding: 2,
				fill: '#E6F3FF',
				stroke: '#147EB8',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	if (shapeId === 'awsApiGateway') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#945BB3',
				stroke: '#232F3E',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 0, height: 0 };
			}
		};
	}

	// ERD shapes
	if (shapeId === 'erdEntity') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#fff',
				stroke: '#000',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 30, height: 12 };
			}
		};
	}

	if (shapeId === 'erdWeakEntity') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#fff',
				stroke: '#000',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 30, height: 12 };
			}
		};
	}

	if (shapeId === 'erdRelationship') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#fff',
				stroke: '#000',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 25, height: 12 };
			}
		};
	}

	if (shapeId === 'erdAttribute') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#fff',
				stroke: '#000',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 25, height: 12 };
			}
		};
	}

	if (shapeId === 'erdKeyAttribute') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#fff',
				stroke: '#000',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 25, height: 12 };
			}
		};
	}

	if (shapeId === 'erdMultiValuedAttribute') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 2,
				fill: '#fff',
				stroke: '#000',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 25, height: 12 };
			}
		};
	}

	// Package (UML) shape - toolbox uses 'package', maps to 'umlPackage'
	if (shapeId === 'package') {
		return {
			node: { id: '', label: 'Pkg', shape: 'umlPackage' },
			style: {
				padding: 4,
				fill: '#ffe4b5', // Orange/moccasin color
				stroke: '#333',
				strokeWidth: 1,
				color: '#000', // Black text
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 15, height: 8 };
			}
		};
	}

	// Special handling for dividedRectangle - narrower for icon
	if (shapeId === 'dividedRectangle') {
		return {
			node: { id: '', label: '', data: { minWidth: 32 } },
			style: {
				padding: 2,
				fill: '#f0f0f0',
				stroke: '#333',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 20, height: 8 };
			}
		};
	}

	// Special handling for linedRectangle - shorter for icon
	if (shapeId === 'linedRectangle') {
		return {
			node: { id: '', label: '', data: { minHeight: 28 } },
			style: {
				padding: 2,
				fill: '#f0f0f0',
				stroke: '#333',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 18, height: 8 };
			}
		};
	}

	// Special handling for taggedRectangle - proper styling
	if (shapeId === 'taggedRectangle') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 3,
				fill: '#e0f2fe', // Light blue fill
				stroke: '#0369a1', // Darker blue for outline and tag
				strokeWidth: 1.5,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 20, height: 10 };
			}
		};
	}

	// Special handling for notchedRectangle - proper styling
	if (shapeId === 'notchedRectangle') {
		return {
			node: { id: '', label: '' },
			style: {
				padding: 3,
				fill: '#fef3c7', // Light yellow fill
				stroke: '#d97706', // Amber for outline
				strokeWidth: 1.5,
				font: 'sans-serif',
				fontSize: 6
			},
			measureText: (text: string, style: any) => {
				return { width: 20, height: 10 };
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
			'braceRight',
			'flag'
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
		// Check for special icons first (non-shape elements like containers)
		const specialIcon = specialIcons[shapeId];
		if (specialIcon) {
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
						y="28" 
						text-anchor="middle" 
						font-size="24"
					>${specialIcon}</text>
				</svg>
			`;
		}

		// For electrical components, use special text-based icons
		if (
			[
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
			].includes(shapeId)
		) {
			// Return a simple icon representation for electrical components
			const iconMap: Record<string, string> = {
				resistor: '─∿─', // Zigzag to match actual shape
				capacitor: '─||─',
				inductor: '─∿─',
				transformer: '∿∿',
				voltageSource: '─⊕─',
				currentSource: '─⊗─',
				ground: '⏚',
				junction: '●',
				diode: '─▷|─',
				led: '─▷|↯',
				npnTransistor: '─↓↑─',
				pnpTransistor: '─↑↓─',
				nmosTransistor: '─↓↑─',
				pmosTransistor: '─↑↓─',
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
						font-size="32" 
						fill="#334155"
					>${icon}</text>
				</svg>
			`;
		}

		// Special handling for very small shapes (entry/exit points)
		// Render them larger in the toolbox for better visibility
		if (shapeId === 'entryPoint' || shapeId === 'exitPoint') {
			const isExit = shapeId === 'exitPoint';
			const r = size * 0.35; // 35% of icon size
			const cx = size / 2;
			const cy = size / 2;

			if (isExit) {
				// Exit point: circle with X
				const xSize = r * 0.6;
				return `
					<svg 
						width="${size}" 
						height="${size}" 
						viewBox="0 0 ${size} ${size}"
						xmlns="http://www.w3.org/2000/svg"
						style="display: block;"
					>
						<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#000" stroke-width="1.5" />
						<line x1="${cx - xSize}" y1="${cy - xSize}" x2="${cx + xSize}" y2="${cy + xSize}" stroke="#000" stroke-width="1.2" />
						<line x1="${cx + xSize}" y1="${cy - xSize}" x2="${cx - xSize}" y2="${cy + xSize}" stroke="#000" stroke-width="1.2" />
					</svg>
				`;
			} else {
				// Entry point: simple circle
				return `
					<svg 
						width="${size}" 
						height="${size}" 
						viewBox="0 0 ${size} ${size}"
						xmlns="http://www.w3.org/2000/svg"
						style="display: block;"
					>
						<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#000" stroke-width="1.5" />
					</svg>
				`;
			}
		}

		if (!shape) return '';

		const mockContext = createMockContext(shapeId);
		const bounds = shape.bounds(mockContext as any);
		const shapeContent = shape.render(mockContext as any, { x: 0, y: 0 });

		// Chart shapes need larger display size in toolbox
		const isChartShape = ['pieChart', 'barChartVertical', 'barChartHorizontal', 'pyramid'].includes(shapeId);
		const displaySize = isChartShape ? size * 3 : size;

		return `
			<svg 
				width="${displaySize}" 
				height="${displaySize}" 
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
