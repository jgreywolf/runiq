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
		// Helper to create base context with common properties
		const createBaseContext = (overrides: any = {}) => ({
			node: { id: '', label: '', ...overrides.node },
			style: {
				padding: 2,
				fill: '#cbd5e1',
				stroke: '#000',
				strokeWidth: 1,
				font: 'sans-serif',
				fontSize: 6,
				...overrides.style
			},
			measureText:
				overrides.measureText || ((text: string, style: any) => ({ width: 0, height: 0 }))
		});

		// Helper for text measurement
		const textMeasure = (width: number, height: number) => (text: string, style: any) => ({
			width,
			height
		});

		// Shape-specific configurations
		const shapeConfigs: Record<string, any> = {
			// Special data-driven shapes
			class: {
				node: {
					label: 'Class',
					data: {
						attributes: [{ name: 'attr', type: 'type', visibility: 'public' }],
						methods: [{ name: 'method', returnType: 'void', visibility: 'public' }]
					}
				},
				style: { padding: 3, fontSize: 7 },
				measureText: (text: string) => ({ width: text.length * 4, height: 8 })
			},
			actor: {
				style: { padding: 1, fill: 'none' }
			},
			pyramid: {
				node: {
					data: {
						levels: [
							{ label: 'Top', value: 50 },
							{ label: 'Mid', value: 100 },
							{ label: 'Base', value: 150 }
						]
					}
				},
				measureText: textMeasure(20, 8)
			},
			multiRectangle: {
				node: { data: { offset: 6, stackCount: 3 } },
				style: { fill: '#f0f0f0', stroke: '#333' },
				measureText: textMeasure(20, 8)
			},
			lightning: {
				style: { padding: 4, fill: '#fbbf24', strokeWidth: 1.5 }
			},
			// C4 shapes
			c4Person: {
				style: { fill: '#08427B', stroke: '#052E56' }
			},
			c4System: {
				style: { padding: 3, fill: '#1168BD', stroke: '#0B4884', fontSize: 7 },
				measureText: textMeasure(30, 10)
			},
			c4Container: {
				style: { padding: 3, fill: '#438DD5', stroke: '#2E6295' },
				measureText: textMeasure(28, 10)
			},
			c4Component: {
				style: { fill: '#85BBF0', stroke: '#5A9BD5' },
				measureText: textMeasure(24, 8)
			},
			// BPMN shapes
			bpmnTask: {
				style: { fill: '#fff' },
				measureText: textMeasure(28, 10)
			},
			bpmnDataObject: {
				style: { fill: '#fff' },
				measureText: textMeasure(18, 24)
			},
			bpmnMessage: {
				style: { fill: '#fff' },
				measureText: textMeasure(24, 18)
			},
			// Quantum shapes
			controlDot: {
				style: { padding: 0, fill: '#000', stroke: 'none', strokeWidth: 0 }
			},
			cnotTarget: {
				style: { padding: 0, fill: 'none', strokeWidth: 0.5 }
			},
			// Chart shapes
			pieChart: {
				node: {
					data: {
						values: [
							{ label: 'A', value: 30 },
							{ label: 'B', value: 25 },
							{ label: 'C', value: 20 }
						],
						showLegend: false
					}
				},
				style: { fontSize: 5 }
			},
			barChartVertical: {
				node: {
					data: {
						values: [
							{ label: 'A', value: 30 },
							{ label: 'B', value: 45 },
							{ label: 'C', value: 25 }
						],
						showLegend: false
					}
				},
				style: { fontSize: 5 }
			},
			barChartHorizontal: {
				node: {
					data: {
						values: [
							{ label: 'A', value: 30 },
							{ label: 'B', value: 45 },
							{ label: 'C', value: 25 }
						],
						showLegend: false
					}
				},
				style: { fontSize: 5 }
			},
			// AWS shapes - use lookup for colors
			awsEc2: { style: { fill: '#FF9900', stroke: '#232F3E' } },
			awsS3: { style: { fill: '#569A31', stroke: '#232F3E' } },
			awsLambda: { style: { fill: '#FF9900', stroke: '#232F3E' } },
			awsRds: { style: { fill: '#3F5BE7', stroke: '#232F3E' } },
			awsVpc: {
				node: { data: { width: 80, height: 60 } },
				style: { fill: '#E6F3FF', stroke: '#147EB8' }
			},
			awsApiGateway: { style: { fill: '#945BB3', stroke: '#232F3E' } },
			// Package shape
			package: {
				node: { label: 'Pkg', shape: 'umlPackage' },
				style: { padding: 4, fill: '#ffe4b5', stroke: '#333', color: '#000' },
				measureText: textMeasure(15, 8)
			},
			// Rectangle variants
			dividedRectangle: {
				node: { data: { minWidth: 32 } },
				style: { fill: '#f0f0f0', stroke: '#333' },
				measureText: textMeasure(20, 8)
			},
			linedRectangle: {
				node: { data: { minHeight: 28 } },
				style: { fill: '#f0f0f0', stroke: '#333' },
				measureText: textMeasure(18, 8)
			},
			taggedRectangle: {
				style: { padding: 3, fill: '#e0f2fe', stroke: '#0369a1', strokeWidth: 1.5 },
				measureText: textMeasure(20, 10)
			},
			notchedRectangle: {
				style: { padding: 3, fill: '#fef3c7', stroke: '#d97706', strokeWidth: 1.5 },
				measureText: textMeasure(20, 10)
			}
		};

		// ERD shapes - all use white fill and similar config
		const erdShapes = [
			'erdEntity',
			'erdWeakEntity',
			'erdRelationship',
			'erdAttribute',
			'erdKeyAttribute',
			'erdMultiValuedAttribute'
		];
		erdShapes.forEach((shape) => {
			const width = shape.includes('Entity') ? 30 : 25;
			shapeConfigs[shape] = {
				style: { fill: '#fff' },
				measureText: textMeasure(width, 12)
			};
		});

		// BPMN events with dynamic eventType
		if (shapeId.startsWith('bpmnEvent')) {
			const eventType = shapeId.replace('bpmnEvent', '').toLowerCase();
			return createBaseContext({
				node: { shape: 'bpmnEvent', data: { values: [{ eventType }] } },
				style: { padding: 1, fill: '#fff' }
			});
		}

		// BPMN gateways with dynamic gatewayType
		if (shapeId.startsWith('bpmnGateway')) {
			const gatewayType = shapeId.replace('bpmnGateway', '').toLowerCase();
			return createBaseContext({
				node: { shape: 'bpmnGateway', data: { values: [{ gatewayType }] } },
				style: { padding: 1, fill: '#fff' }
			});
		}

		// Check for specific shape config
		if (shapeConfigs[shapeId]) {
			return createBaseContext(shapeConfigs[shapeId]);
		}

		// Shapes that need minimum bounds
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
			return createBaseContext({
				style: { fontSize: 8 },
				measureText: textMeasure(30, 12)
			});
		}

		// Shapes that need wider bounds
		const needsWiderBounds = ['parallelogram', 'trapezoid'];
		if (needsWiderBounds.includes(shapeId)) {
			return createBaseContext({
				style: { fontSize: 8 },
				measureText: textMeasure(40, 10)
			});
		}

		// Default context
		return createBaseContext({ style: { fontSize: 8 } });
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

		// For electrical/digital components and sequence diagram elements, use special text-based icons
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
				'decoder3to8',
				// Sequence diagram participants
				'participantActor',
				'participantEntity',
				'participantBoundary',
				'participantControl',
				'participantDatabase',
				'participantContinuation',
				// Sequence diagram messages
				'messageSync',
				'messageAsync',
				'messageReturn',
				'messageCreate',
				'messageDestroy',
				'messageActivate',
				'messageLost',
				'messageFound',
				// Sequence diagram fragments
				'fragmentAlt',
				'fragmentOpt',
				'fragmentLoop',
				'fragmentPar',
				'fragmentBreak',
				'fragmentCritical',
				'fragmentNeg',
				'fragmentRef',
				// Sequence diagram annotations
				'noteOver',
				'noteLeft',
				'noteRight',
				'stateInvariant',
				'timeObservation',
				'durationConstraint'
			].includes(shapeId)
		) {
			// Return a simple icon representation for electrical/digital components and sequence elements
			const iconMap: Record<string, string> = {
				// Electrical/Digital components
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
				decoder3to8: 'D38',
				// Sequence diagram participants
				participantActor: '👤',
				participantEntity: '□',
				participantBoundary: '○',
				participantControl: '◎',
				participantDatabase: '⬢',
				participantContinuation: '⋯',
				// Sequence diagram messages
				messageSync: '─▶',
				messageAsync: '╌▶',
				messageReturn: '◀╌',
				messageCreate: '─▶○',
				messageDestroy: '─▶✕',
				messageActivate: '▶▭',
				messageLost: '─▶●',
				messageFound: '●▶─',
				// Sequence diagram fragments
				fragmentAlt: '[alt]',
				fragmentOpt: '[opt]',
				fragmentLoop: '[loop]',
				fragmentPar: '[par]',
				fragmentBreak: '[brk]',
				fragmentCritical: '[crit]',
				fragmentNeg: '[neg]',
				fragmentRef: '[ref]',
				// Sequence diagram annotations
				noteOver: '📝',
				noteLeft: '◀📝',
				noteRight: '📝▶',
				stateInvariant: '{inv}',
				timeObservation: '⏱',
				durationConstraint: '⏱⟷'
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
		const isChartShape = ['pieChart', 'barChartVertical', 'barChartHorizontal', 'pyramid'].includes(
			shapeId
		);
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
