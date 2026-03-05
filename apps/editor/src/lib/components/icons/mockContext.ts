/**
 * Mock Context Factory
 * Creates rendering contexts for shape icons
 */

export interface MockContext {
	node: {
		id: string;
		label: string;
		shape: string;
		data?: any;
	};
	style: {
		padding: number;
		fill: string;
		stroke: string;
		strokeWidth: number;
		font: string;
		fontSize: number;
		color?: string;
	};
	measureText: (text: string, style: any) => { width: number; height: number };
}

/**
 * Create a minimal render context for a shape
 */
export function createMockContext(shapeId: string): MockContext {
	// Helper to create base context with common properties
	const createBaseContext = (overrides: Partial<MockContext> = {}): MockContext => ({
		node: { id: '', label: '', shape: '', ...overrides.node },
		style: {
			padding: 2,
			fill: '#cbd5e1',
			stroke: '#000',
			strokeWidth: 1,
			font: 'sans-serif',
			fontSize: 6,
			...overrides.style
		},
		measureText: overrides.measureText || ((text: string, style: any) => ({ width: 0, height: 0 }))
	});

	// Helper for text measurement
	const textMeasure = (width: number, height: number) => (text: string, style: any) => ({
		width,
		height
	});

	// Shape-specific configurations
	const shapeConfigs: Record<string, Partial<MockContext>> = {
		// Special data-driven shapes
		class: {
			node: {
				id: '',
				label: 'Class',
				data: {
					attributes: [{ name: 'attr', type: 'type', visibility: 'public' }],
					methods: [{ name: 'method', returnType: 'void', visibility: 'public' }]
				}
			},
			style: { padding: 3, fontSize: 7 } as any,
			measureText: (text: string) => ({ width: text.length * 4, height: 8 })
		},
		actor: {
			style: { padding: 1, fill: 'none' } as any
		},
		pyramid: {
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
			measureText: textMeasure(20, 8)
		},
		multiRectangle: {
			node: { id: '', label: '', data: { offset: 6, stackCount: 3 } },
			style: { fill: '#f0f0f0', stroke: '#333' } as any,
			measureText: textMeasure(20, 8)
		},
		lightning: {
			style: { padding: 4, fill: '#fbbf24', strokeWidth: 1.5 } as any
		},
		// C4 shapes
		c4Person: {
			style: { fill: '#08427B', stroke: '#052E56' } as any
		},
		c4System: {
			style: { padding: 3, fill: '#1168BD', stroke: '#0B4884', fontSize: 7 } as any,
			measureText: textMeasure(30, 10)
		},
		c4Container: {
			style: { padding: 3, fill: '#438DD5', stroke: '#2E6295' } as any,
			measureText: textMeasure(28, 10)
		},
		c4Component: {
			style: { fill: '#85BBF0', stroke: '#5A9BD5' } as any,
			measureText: textMeasure(24, 8)
		},
		// BPMN shapes
		bpmnTask: {
			style: { fill: '#fff' } as any,
			measureText: textMeasure(28, 10)
		},
		bpmnDataObject: {
			style: { fill: '#fff' } as any,
			measureText: textMeasure(18, 24)
		},
		bpmnMessage: {
			style: { fill: '#fff' } as any,
			measureText: textMeasure(24, 18)
		},
		// Quantum shapes
		controlDot: {
			style: { padding: 0, fill: '#000', stroke: 'none', strokeWidth: 0 } as any
		},
		cnotTarget: {
			style: { padding: 0, fill: 'none', strokeWidth: 0.5 } as any
		},
		// Chart shapes
		lineChart: {
			node: {
				id: '',
				label: '',
				data: {
					values: [
						{ label: 'A', value: 20 },
						{ label: 'B', value: 45 },
						{ label: 'C', value: 30 },
						{ label: 'D', value: 60 },
						{ label: 'E', value: 50 }
					],
					showLegend: false
				}
			},
			style: { fontSize: 5 } as any
		},
		radarChart: {
			node: {
				id: '',
				label: '',
				data: {
					values: [
						{ label: 'A', value: 80 },
						{ label: 'B', value: 65 },
						{ label: 'C', value: 90 },
						{ label: 'D', value: 70 },
						{ label: 'E', value: 75 }
					],
					showLegend: false
				}
			},
			style: { fontSize: 5 } as any
		},
		pieChart: {
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
			style: { fontSize: 5 } as any
		},
		barChart: {
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
			style: { fontSize: 5 } as any
		},
		// AWS shapes
		awsEc2: { style: { fill: '#FF9900', stroke: '#232F3E' } as any },
		awsS3: { style: { fill: '#569A31', stroke: '#232F3E' } as any },
		awsLambda: { style: { fill: '#FF9900', stroke: '#232F3E' } as any },
		awsRds: { style: { fill: '#3F5BE7', stroke: '#232F3E' } as any },
		awsVpc: {
			node: { id: '', label: '', data: { width: 80, height: 60 } },
			style: { fill: '#E6F3FF', stroke: '#147EB8' } as any
		},
		awsApiGateway: { style: { fill: '#945BB3', stroke: '#232F3E' } as any },
		// Package shape
		package: {
			node: { id: '', label: 'Pkg', shape: 'umlPackage' },
			style: {
				padding: 4,
				fill: '#ffe4b5',
				stroke: '#333',
				color: '#000'
			} as any,
			measureText: textMeasure(15, 8)
		},
		// Rectangle variants
		dividedRectangle: {
			node: { id: '', label: '', data: { minWidth: 32 } },
			style: { fill: '#f0f0f0', stroke: '#333' } as any,
			measureText: textMeasure(20, 8)
		},
		linedRectangle: {
			node: { id: '', label: '', data: { minHeight: 28 } },
			style: { fill: '#f0f0f0', stroke: '#333' } as any,
			measureText: textMeasure(18, 8)
		},
		taggedRectangle: {
			style: {
				padding: 3,
				fill: '#e0f2fe',
				stroke: '#0369a1',
				strokeWidth: 1.5
			} as any,
			measureText: textMeasure(20, 10)
		},
		notchedRectangle: {
			style: {
				padding: 3,
				fill: '#fef3c7',
				stroke: '#d97706',
				strokeWidth: 1.5
			} as any,
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
			style: { fill: '#fff' } as any,
			measureText: textMeasure(width, 12)
		};
	});

	// BPMN events with dynamic eventType
	if (shapeId.startsWith('bpmnEvent')) {
		const eventType = shapeId.replace('bpmnEvent', '').toLowerCase();
		return createBaseContext({
			node: { id: '', label: '', shape: 'bpmnEvent', data: { values: [{ eventType }] } },
			style: { padding: 1, fill: '#fff' } as any
		});
	}

	// BPMN gateways with dynamic gatewayType
	if (shapeId.startsWith('bpmnGateway')) {
		const gatewayType = shapeId.replace('bpmnGateway', '').toLowerCase();
		return createBaseContext({
			node: { id: '', label: '', shape: 'bpmnGateway', data: { values: [{ gatewayType }] } },
			style: { padding: 1, fill: '#fff' } as any
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
			style: { fontSize: 8 } as any,
			measureText: textMeasure(30, 12)
		});
	}

	// Shapes that need wider bounds
	const needsWiderBounds = ['parallelogram', 'trapezoid'];
	if (needsWiderBounds.includes(shapeId)) {
		return createBaseContext({
			style: { fontSize: 8 } as any,
			measureText: textMeasure(40, 10)
		});
	}

	// Default context
	return createBaseContext({ style: { fontSize: 8 } as any });
}
