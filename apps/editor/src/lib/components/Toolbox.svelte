<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import ShapeIcon from './ShapeIcon.svelte';

	interface Props {
		onInsertShape: (shapeCode: string) => void;
	}

	let { onInsertShape }: Props = $props();

	// Shape categories with their shapes
	const shapeCategories = [
		{
			id: 'basic',
			label: 'Basic Shapes',
			shapes: [
				{ id: 'rect', label: 'Rectangle', code: 'shape id as @rectangle label:"Label"' },
				{ id: 'rounded', label: 'Rounded Rectangle', code: 'shape id as @rounded label:"Label"' },
				{ id: 'circ', label: 'Circle', code: 'shape id as @circle label:"Label"' },
				{ id: 'sm-circ', label: 'Small Circle', code: 'shape id as @small-circle label:"Label"' },
				{ id: 'ellipse-wide', label: 'Ellipse', code: 'shape id as @ellipse-wide label:"Label"' },
				{ id: 'rhombus', label: 'Diamond', code: 'shape id as @rhombus label:"Label"' },
				{ id: 'hex', label: 'Hexagon', code: 'shape id as @hex label:"Label"' },
				{ id: 'stadium', label: 'Stadium', code: 'shape id as @stadium label:"Label"' },
				{ id: 'tri', label: 'Triangle', code: 'shape id as @triangle label:"Label"' },
				{
					id: 'flip-tri',
					label: 'Flipped Triangle',
					code: 'shape id as @flipped-triangle label:"Label"'
				},
				{ id: 'lean-r', label: 'Parallelogram', code: 'shape id as @parallelogram label:"Label"' },
				{ id: 'trap-b', label: 'Trapezoid', code: 'shape id as @trapezoid label:"Label"' }
			]
		},
		{
			id: 'flowchart',
			label: 'Flowchart',
			shapes: [
				{ id: 'rect', label: 'Process', code: 'shape id as @rectangle label:"Process"' },
				{ id: 'rhombus', label: 'Decision', code: 'shape id as @rhombus label:"Decision?"' },
				{
					id: 'lean-r',
					label: 'Input/Output',
					code: 'shape id as @parallelogram label:"Input/Output"'
				},
				{ id: 'stadium', label: 'Start/End', code: 'shape id as @stadium label:"Start"' },
				{
					id: 'predef-proc',
					label: 'Predefined Process',
					code: 'shape id as @predefined-process label:"Subroutine"'
				},
				{
					id: 'prep-alt',
					label: 'Preparation',
					code: 'shape id as @preparation-alt label:"Setup"'
				},
				{
					id: 'sl-rect',
					label: 'Manual Input',
					code: 'shape id as @manual-input label:"Manual Input"'
				},
				{
					id: 'trap-b',
					label: 'Manual Operation',
					code: 'shape id as @trapezoid label:"Manual"'
				},
				{ id: 'doc', label: 'Document', code: 'shape id as @doc label:"Document"' },
				{
					id: 'multi-doc',
					label: 'Multiple Documents',
					code: 'shape id as @multi-document label:"Documents"'
				},
				{ id: 'curv-trap', label: 'Display', code: 'shape id as @display label:"Display"' },
				{ id: 'delay', label: 'Delay', code: 'shape id as @delay label:"Wait"' },
				{
					id: 'off-page',
					label: 'Off-Page Connector',
					code: 'shape id as @off-page-connector label:"A"'
				}
			]
		},
		{
			id: 'storage',
			label: 'Data Storage',
			shapes: [
				{ id: 'cyl', label: 'Database', code: 'shape id as @cylinder label:"Database"' },
				{ id: 'disk', label: 'Disk Storage', code: 'shape id as @disk label:"Disk"' },
				{ id: 'storedData', label: 'Stored Data', code: 'shape id as @bow-tie label:"Data"' },
				{
					id: 'int-storage',
					label: 'Internal Storage',
					code: 'shape id as @int-storage label:"Storage"'
				},
				{
					id: 'seq-stor',
					label: 'Sequential Storage',
					code: 'shape id as @sequential-storage label:"Tape"'
				},
				{
					id: 'direct-stor',
					label: 'Direct Storage',
					code: 'shape id as @direct-storage label:"Direct"'
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
					code: 'shape id as @class label:"ClassName"\n  attributes:[{name:"attr" type:"String" visibility:public}]\n  methods:[{name:"method" returnType:"void" visibility:public}]'
				},
				{ id: 'actor', label: 'Actor', code: 'shape id as @actor label:"Actor"' },
				{
					id: 'system-boundary',
					label: 'System Boundary',
					code: 'shape id as @system-boundary label:"System"'
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
					id: 'load-balancer',
					label: 'Load Balancer',
					code: 'shape id as @load-balancer label:"Load Balancer"'
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
					id: 'transfer-fn',
					label: 'Transfer Function',
					code: 'shape id as @transfer-function label:"H(s)"'
				},
				{ id: 'gain', label: 'Gain', code: 'shape id as @gain label:"K"' },
				{ id: 'integrator', label: 'Integrator', code: 'shape id as @integrator label:"1/s"' },
				{
					id: 'differentiator',
					label: 'Differentiator',
					code: 'shape id as @differentiator label:"s"'
				},
				{ id: 'time-delay', label: 'Time Delay', code: 'shape id as @time-delay label:"Delay"' },
				{ id: 'saturation', label: 'Saturation', code: 'shape id as @saturation label:"Sat"' },
				{
					id: 'junction',
					label: 'Summing Junction',
					code: 'shape id as @summing-junction label:"+"'
				},
				{
					id: 'multiply-junction',
					label: 'Multiply',
					code: 'shape id as @multiply-junction label:"×"'
				},
				{ id: 'divide-junction', label: 'Divide', code: 'shape id as @divide-junction label:"÷"' },
				{
					id: 'compare-junction',
					label: 'Compare',
					code: 'shape id as @compare-junction label:"="'
				}
			]
		},
		{
			id: 'charts',
			label: 'Charts & Diagrams',
			shapes: [
				{
					id: 'pie-chart',
					label: 'Pie Chart',
					code: 'shape id as @pie-chart label:"Sales"\n  data:{values:[30,20,50] labels:["A","B","C"]}'
				},
				{
					id: 'bar-chart-vertical',
					label: 'Bar Chart (Vertical)',
					code: 'shape id as @bar-chart-vertical label:"Data"\n  data:{values:[10,20,15] labels:["Q1","Q2","Q3"]}'
				},
				{
					id: 'bar-chart-horizontal',
					label: 'Bar Chart (Horizontal)',
					code: 'shape id as @bar-chart-horizontal label:"Data"\n  data:{values:[10,20,15] labels:["Q1","Q2","Q3"]}'
				},
				{ id: 'venn-2', label: 'Venn Diagram (2)', code: 'shape id as @venn-2 label:"Sets"' },
				{ id: 'venn-3', label: 'Venn Diagram (3)', code: 'shape id as @venn-3 label:"Sets"' },
				{ id: 'pyramid', label: 'Pyramid', code: 'shape id as @pyramid label:"Hierarchy"' }
			]
		},
		{
			id: 'special',
			label: 'Special',
			shapes: [
				{ id: 'text', label: 'Text Block', code: 'shape id as @text-block label:"Note"' },
				{ id: 'brace-l', label: 'Brace Left', code: 'shape id as @brace-left label:""' },
				{ id: 'brace-r', label: 'Brace Right', code: 'shape id as @brace-right label:""' },
				{ id: 'lightning', label: 'Lightning Bolt', code: 'shape id as @lightning-bolt label:""' },
				{ id: 'hourglass', label: 'Hourglass', code: 'shape id as @hourglass label:""' },
				{ id: 'fork', label: 'Fork/Join', code: 'shape id as @fork-join label:""' }
			]
		}
	];

	function insertShape(shapeCode: string) {
		onInsertShape(shapeCode);
	}
</script>

<Tooltip.Provider delayDuration={200}>
	<div class="flex h-full flex-col">
		<Accordion.Root type="multiple" class="w-full">
			{#each shapeCategories as category}
				<Accordion.Item value={category.id}>
					<Accordion.Trigger class="px-4 py-2 text-sm font-medium hover:bg-neutral-50">
						{category.label}
					</Accordion.Trigger>
					<Accordion.Content>
						<div class="grid grid-cols-4 gap-0.5 p-1">
							{#each category.shapes as shape}
								<Tooltip.Root>
									<Tooltip.Trigger>
										<button
											class="flex h-10 w-10 items-center justify-center rounded-md border border-transparent transition-colors hover:border-runiq-200 hover:bg-runiq-50 hover:text-runiq-700"
											onclick={() => insertShape(shape.code)}
										>
											<ShapeIcon shapeId={shape.id} size={20} />
										</button>
									</Tooltip.Trigger>
									<Tooltip.Content side="bottom" class="max-w-xs" sideOffset={2}>
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
