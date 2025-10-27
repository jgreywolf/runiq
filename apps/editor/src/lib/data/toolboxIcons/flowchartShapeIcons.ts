import type { ShapeCategory } from '../toolbox-data';

export const flowchartShapeIcons: ShapeCategory[] = [
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
			{
				id: 'leanLeft',
				label: 'Data (Lean Left)',
				code: 'shape id as @leanLeft label:"Data"'
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
			{
				id: 'decisionManual',
				label: 'Manual Decision',
				code: 'shape id as @decisionManual label:"Choose"'
			},
			{ id: 'document', label: 'Document', code: 'shape id as @document label:"Document"' },
			{
				id: 'linedDocument',
				label: 'Lined Document',
				code: 'shape id as @linedDocument label:"Document"'
			},
			{
				id: 'multiDocument',
				label: 'Multiple Documents',
				code: 'shape id as @multiDocument label:"Documents"'
			},
			{
				id: 'taggedDocument',
				label: 'Tagged Document',
				code: 'shape id as @taggedDocument label:"Document"'
			},
			{
				id: 'paperTape',
				label: 'Paper Tape',
				code: 'shape id as @flag label:"Tape"'
			},
			{
				id: 'card',
				label: 'Punched Card',
				code: 'shape id as @card label:"Card"'
			},
			{ id: 'display', label: 'Display', code: 'shape id as @display label:"Display"' },
			{ id: 'delay', label: 'Delay', code: 'shape id as @delay label:"Wait"' },
			{
				id: 'offPageConnector',
				label: 'Off-Page Connector',
				code: 'shape id as @offPageConnector label:"A"'
			}
		]
	}
];
