<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import ShapeIcon from './ShapeIcon.svelte';

	interface Props {
		onInsertShape: (shapeCode: string) => void;
		currentCode?: string; // Current editor content to detect diagram type
	}

	let { onInsertShape, currentCode = '' }: Props = $props();

	// Detect if current code is for electrical circuit or regular diagram
	let isElectricalMode = $derived(currentCode.trim().startsWith('electrical'));

	// Shape categories with their shapes
	const shapeCategories = [
		{
			id: 'basic',
			label: 'Basic Shapes',
			shapes: [
				{ id: 'rectangle', label: 'Rectangle', code: 'shape id as @rectangle label:"Label"' },
				{
					id: 'roundedRectangle',
					label: 'Rounded Rectangle',
					code: 'shape id as @roundedRectangle label:"Label"'
				},
				{ id: 'circle', label: 'Circle', code: 'shape id as @circle label:"Label"' },
				{
					id: 'smallCircle',
					label: 'Small Circle',
					code: 'shape id as @smallCircle label:"Label"'
				},
				{ id: 'ellipseWide', label: 'Ellipse', code: 'shape id as @ellipseWide label:"Label"' },
				{ id: 'rhombus', label: 'Diamond', code: 'shape id as @rhombus label:"Label"' },
				{ id: 'hexagon', label: 'Hexagon', code: 'shape id as @hexagon label:"Label"' },
				{ id: 'stadium', label: 'Stadium', code: 'shape id as @stadium label:"Label"' },
				{ id: 'triangle', label: 'Triangle', code: 'shape id as @triangle label:"Label"' },
				{
					id: 'flippedTriangle',
					label: 'Flipped Triangle',
					code: 'shape id as @flippedTriangle label:"Label"'
				},
				{
					id: 'parallelogram',
					label: 'Parallelogram',
					code: 'shape id as @parallelogram label:"Label"'
				},
				{ id: 'trapezoid', label: 'Trapezoid', code: 'shape id as @trapezoid label:"Label"' }
			]
		},
		{
			id: 'flowchart',
			label: 'Flowchart',
			shapes: [
				{ id: 'rectangle', label: 'Process', code: 'shape id as @rectangle label:"Process"' },
				{ id: 'rhombus', label: 'Decision', code: 'shape id as @rhombus label:"Decision?"' },
				{
					id: 'parallelogram',
					label: 'Input/Output',
					code: 'shape id as @parallelogram label:"Input/Output"'
				},
				{ id: 'stadium', label: 'Start/End', code: 'shape id as @stadium label:"Start"' },
				{
					id: 'predefinedProcess',
					label: 'Predefined Process',
					code: 'shape id as @predefinedProcess label:"Subroutine"'
				},
				{
					id: 'preparation',
					label: 'Preparation',
					code: 'shape id as @preparation label:"Setup"'
				},
				{
					id: 'manualInput',
					label: 'Manual Input',
					code: 'shape id as @manualInput label:"Manual Input"'
				},
				{
					id: 'trapezoid',
					label: 'Manual Operation',
					code: 'shape id as @trapezoid label:"Manual"'
				},
				{ id: 'document', label: 'Document', code: 'shape id as @document label:"Document"' },
				{
					id: 'multiDocument',
					label: 'Multiple Documents',
					code: 'shape id as @multiDocument label:"Documents"'
				},
				{ id: 'display', label: 'Display', code: 'shape id as @display label:"Display"' },
				{ id: 'delay', label: 'Delay', code: 'shape id as @delay label:"Wait"' },
				{
					id: 'offPageConnector',
					label: 'Off-Page Connector',
					code: 'shape id as @offPageConnector label:"A"'
				}
			]
		},
		{
			id: 'storage',
			label: 'Data Storage',
			shapes: [
				{ id: 'cylinder', label: 'Database', code: 'shape id as @cylinder label:"Database"' },
				{ id: 'diskStorage', label: 'Disk Storage', code: 'shape id as @diskStorage label:"Disk"' },
				{ id: 'storedData', label: 'Stored Data', code: 'shape id as @storedData label:"Data"' },
				{
					id: 'internalStorage',
					label: 'Internal Storage',
					code: 'shape id as @internalStorage label:"Storage"'
				},
				{
					id: 'sequentialStorage',
					label: 'Sequential Storage',
					code: 'shape id as @sequentialStorage label:"Tape"'
				},
				{
					id: 'directStorage',
					label: 'Direct Storage',
					code: 'shape id as @directStorage label:"Direct"'
				}
			]
		},
		{
			id: 'uml',
			label: 'UML',
			shapes: [
				{
					id: 'class',
					label: 'Class',
					code: `shape id as @class label:"ClassName"
  attributes:[{name:"attribute" type:"String" visibility:public}]
  methods:[{name:"method" returnType:"void" visibility:public}]`
				},
				{ id: 'actor', label: 'Actor', code: 'shape id as @actor label:"Actor"' },
				{
					id: 'systemBoundary',
					label: 'System Boundary',
					code: 'shape id as @systemBoundary label:"System"'
				}
			]
		},
		{
			id: 'network',
			label: 'Network',
			shapes: [
				{ id: 'server', label: 'Server', code: 'shape id as @server label:"Server"' },
				{ id: 'router', label: 'Router', code: 'shape id as @router label:"Router"' },
				{ id: 'switch', label: 'Switch', code: 'shape id as @switch label:"Switch"' },
				{ id: 'firewall', label: 'Firewall', code: 'shape id as @firewall label:"Firewall"' },
				{
					id: 'loadBalancer',
					label: 'Load Balancer',
					code: 'shape id as @loadBalancer label:"Load Balancer"'
				},
				{ id: 'cloud', label: 'Cloud', code: 'shape id as @cloud label:"Cloud"' },
				{ id: 'storage', label: 'Storage', code: 'shape id as @storage label:"Storage"' }
			]
		},
		{
			id: 'block-diagram',
			label: 'Block Diagram',
			shapes: [
				{
					id: 'transferFunction',
					label: 'Transfer Function',
					code: 'shape id as @transferFunction label:"H(s)"'
				},
				{ id: 'gain', label: 'Gain', code: 'shape id as @gain label:"K"' },
				{ id: 'integrator', label: 'Integrator', code: 'shape id as @integrator label:"1/s"' },
				{
					id: 'differentiator',
					label: 'Differentiator',
					code: 'shape id as @differentiator label:"s"'
				},
				{ id: 'timeDelay', label: 'Time Delay', code: 'shape id as @timeDelay label:"Delay"' },
				{ id: 'saturation', label: 'Saturation', code: 'shape id as @saturation label:"Sat"' },
				{
					id: 'summingJunction',
					label: 'Summing Junction',
					code: 'shape id as @summingJunction label:"+"'
				},
				{
					id: 'multiplyJunction',
					label: 'Multiply',
					code: 'shape id as @multiplyJunction label:"×"'
				},
				{ id: 'divideJunction', label: 'Divide', code: 'shape id as @divideJunction label:"÷"' },
				{
					id: 'compareJunction',
					label: 'Compare',
					code: 'shape id as @compareJunction label:"="'
				}
			]
		},
		{
			id: 'charts',
			label: 'Charts & Diagrams',
			shapes: [
				{
					id: 'pieChart',
					label: 'Pie Chart',
					code: 'shape id as @pieChart label:"Sales" data:[30,20,50]'
				},
				{
					id: 'barChartVertical',
					label: 'Bar Chart (Vertical)',
					code: 'shape id as @barChartVertical label:"Data" data:[10,20,15]'
				},
				{
					id: 'barChartHorizontal',
					label: 'Bar Chart (Horizontal)',
					code: 'shape id as @barChartHorizontal label:"Data" data:[10,20,15]'
				},
				{
					id: 'venn2',
					label: 'Venn Diagram (2)',
					code: 'shape id as @venn2 label:"Sets" data:[{"setA":100},{"setB":80},{"intersection":30},{"labelA":"Set A"},{"labelB":"Set B"}]'
				},
				{
					id: 'venn3',
					label: 'Venn Diagram (3)',
					code: 'shape id as @venn3 label:"Sets" data:[{"setA":120},{"setB":100},{"setC":80},{"AB":35},{"AC":28},{"BC":22},{"ABC":15},{"labelA":"Set A"},{"labelB":"Set B"},{"labelC":"Set C"}]'
				},
				{ id: 'pyramid', label: 'Pyramid', code: 'shape id as @pyramid label:"Hierarchy"' }
			]
		},
		{
			id: 'special',
			label: 'Special',
			shapes: [
				{ id: 'textBlock', label: 'Text Block', code: 'shape id as @textBlock label:"Note"' },
				{ id: 'braceLeft', label: 'Brace Left', code: 'shape id as @braceLeft label:""' },
				{ id: 'braceRight', label: 'Brace Right', code: 'shape id as @braceRight label:""' },
				{ id: 'lightning', label: 'Lightning Bolt', code: 'shape id as @lightning label:""' },
				{ id: 'hourglass', label: 'Hourglass', code: 'shape id as @hourglass label:""' },
				{ id: 'fork', label: 'Fork/Join', code: 'shape id as @fork label:""' }
			]
		},
		{
			id: 'electrical',
			label: 'Electrical Components',
			shapes: [
				{ id: 'resistor', label: 'Resistor', code: 'part id type:R value:"1k" pins:(N1,N2)' },
				{ id: 'capacitor', label: 'Capacitor', code: 'part id type:C value:"1u" pins:(N1,N2)' },
				{ id: 'inductor', label: 'Inductor', code: 'part id type:L value:"1m" pins:(N1,N2)' },
				{ id: 'transformer', label: 'Transformer', code: 'part id type:XFMR pins:(P1,P2,S1,S2)' },
				{
					id: 'voltageSource',
					label: 'Voltage Source',
					code: 'part id type:V value:"5" pins:(VCC,GND)'
				},
				{
					id: 'currentSource',
					label: 'Current Source',
					code: 'part id type:I value:"1m" pins:(N1,N2)'
				},
				{ id: 'ground', label: 'Ground', code: 'part id type:GND pins:(GND)' },
				{ id: 'junction', label: 'Junction', code: 'part id type:JUNC pins:(N1)' },
				{ id: 'diode', label: 'Diode', code: 'part id type:D pins:(N1,N2)' },
				{ id: 'led', label: 'LED', code: 'part id type:LED pins:(N1,N2)' },
				{ id: 'npnTransistor', label: 'NPN Transistor', code: 'part id type:NPN pins:(C,B,E)' },
				{ id: 'pnpTransistor', label: 'PNP Transistor', code: 'part id type:PNP pins:(C,B,E)' },
				{ id: 'nmosTransistor', label: 'NMOS', code: 'part id type:NMOS pins:(D,G,S)' },
				{ id: 'pmosTransistor', label: 'PMOS', code: 'part id type:PMOS pins:(D,G,S)' },
				{ id: 'opamp', label: 'Op-Amp', code: 'part id type:OPAMP pins:(OUT,INP,INN,VCC,GND)' }
			]
		},
		{
			id: 'logic-gates',
			label: 'Logic Gates',
			shapes: [
				{ id: 'andGate', label: 'AND (2-input)', code: 'part id type:AND pins:(A,B,Y)' },
				{ id: 'orGate', label: 'OR (2-input)', code: 'part id type:OR pins:(A,B,Y)' },
				{ id: 'notGate', label: 'NOT', code: 'part id type:NOT pins:(A,Y)' },
				{ id: 'bufferGate', label: 'Buffer', code: 'part id type:BUF pins:(A,Y)' },
				{ id: 'xorGate', label: 'XOR', code: 'part id type:XOR pins:(A,B,Y)' },
				{ id: 'xnorGate', label: 'XNOR', code: 'part id type:XNOR pins:(A,B,Y)' },
				{ id: 'nandGate', label: 'NAND (2-input)', code: 'part id type:NAND pins:(A,B,Y)' },
				{ id: 'norGate', label: 'NOR (2-input)', code: 'part id type:NOR pins:(A,B,Y)' },
				{ id: 'and3Gate', label: 'AND (3-input)', code: 'part id type:AND3 pins:(A,B,C,Y)' },
				{ id: 'or3Gate', label: 'OR (3-input)', code: 'part id type:OR3 pins:(A,B,C,Y)' },
				{ id: 'nand3Gate', label: 'NAND (3-input)', code: 'part id type:NAND3 pins:(A,B,C,Y)' },
				{ id: 'nor3Gate', label: 'NOR (3-input)', code: 'part id type:NOR3 pins:(A,B,C,Y)' }
			]
		},
		{
			id: 'digital-components',
			label: 'Digital Components',
			shapes: [
				{ id: 'dFlipFlop', label: 'D Flip-Flop', code: 'part id type:DFF pins:(D,CLK,Q,QB)' },
				{ id: 'jkFlipFlop', label: 'JK Flip-Flop', code: 'part id type:JKFF pins:(J,K,CLK,Q,QB)' },
				{ id: 'tFlipFlop', label: 'T Flip-Flop', code: 'part id type:TFF pins:(T,CLK,Q,QB)' },
				{
					id: 'register4',
					label: '4-bit Register',
					code: 'part id type:REG4 pins:(D0,D1,D2,D3,CLK,Q0,Q1,Q2,Q3)'
				},
				{
					id: 'register8',
					label: '8-bit Register',
					code: 'part id type:REG8 pins:(D0,D1,D2,D3,D4,D5,D6,D7,CLK,Q0,Q1,Q2,Q3,Q4,Q5,Q6,Q7)'
				},
				{
					id: 'mux4to1',
					label: '4-to-1 Mux',
					code: 'part id type:MUX4 pins:(D0,D1,D2,D3,S0,S1,Y)'
				},
				{
					id: 'mux8to1',
					label: '8-to-1 Mux',
					code: 'part id type:MUX8 pins:(D0,D1,D2,D3,D4,D5,D6,D7,S0,S1,S2,Y)'
				},
				{
					id: 'decoder2to4',
					label: '2-to-4 Decoder',
					code: 'part id type:DEC24 pins:(A0,A1,Y0,Y1,Y2,Y3)'
				},
				{
					id: 'decoder3to8',
					label: '3-to-8 Decoder',
					code: 'part id type:DEC38 pins:(A0,A1,A2,Y0,Y1,Y2,Y3,Y4,Y5,Y6,Y7)'
				}
			]
		}
	];

	let shapeCounter = $state(1);
	let partCounter = $state(1);

	function insertShape(shapeCode: string) {
		// Replace 'id' with a unique identifier
		let uniqueCode: string;

		if (shapeCode.startsWith('part ')) {
			// Electrical component - use part counter
			uniqueCode = shapeCode.replace(/^part id /, `part P${partCounter} `);
			partCounter++;
		} else {
			// Regular shape - use shape counter
			uniqueCode = shapeCode.replace(/^shape id /, `shape shape${shapeCounter} `);
			shapeCounter++;
		}

		onInsertShape(uniqueCode);
	}

	// Filter categories based on mode
	let displayedCategories = $derived(
		isElectricalMode
			? shapeCategories.filter(
					(cat) =>
						cat.id === 'electrical' || cat.id === 'logic-gates' || cat.id === 'digital-components'
				)
			: shapeCategories.filter(
					(cat) =>
						cat.id !== 'electrical' && cat.id !== 'logic-gates' && cat.id !== 'digital-components'
				)
	);
</script>

<Tooltip.Provider delayDuration={200}>
	<div class="flex h-full flex-col">
		{#if isElectricalMode}
			<div class="border-b border-amber-200 bg-amber-50 px-4 py-2">
				<p class="text-xs font-medium text-amber-900">⚡ Electrical Circuit Mode</p>
			</div>
		{/if}

		<Accordion.Root type="multiple" class="w-full">
			{#each displayedCategories as category}
				<Accordion.Item value={category.id}>
					<Accordion.Trigger class="px-4 py-2 text-sm font-medium hover:bg-neutral-50">
						{category.label}
					</Accordion.Trigger>
					<Accordion.Content>
						<div class="grid grid-cols-4 gap-0.5 p-1">
							{#each category.shapes as shape}
								<Tooltip.Root>
									<Tooltip.Trigger
										class="flex h-10 w-10 items-center justify-center rounded-md border border-transparent transition-colors hover:border-runiq-200 hover:bg-runiq-50 hover:text-runiq-700"
										onclick={() => insertShape(shape.code)}
									>
										<ShapeIcon shapeId={shape.id} size={20} />
									</Tooltip.Trigger>
									<Tooltip.Content
										side="top"
										class="max-w-xs border border-neutral-300 bg-white text-neutral-900 shadow-lg"
										sideOffset={4}
										arrowClasses="bg-white border-r border-b border-neutral-300"
									>
										<p class="text-xs font-medium">{shape.label}</p>
									</Tooltip.Content>
								</Tooltip.Root>
							{/each}
						</div>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>

		<div class="mt-auto border-t border-neutral-200 bg-neutral-50 p-3">
			<p class="text-xs text-neutral-500">Click a shape to insert it at the cursor</p>
		</div>
	</div>
</Tooltip.Provider>
