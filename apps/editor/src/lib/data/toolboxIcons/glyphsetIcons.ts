import type { ShapeCategory } from '../toolbox-data';

/**
 * Glyphset toolbox icons
 * When clicked, these replace the glyphset type while preserving name, items, theme, etc.
 */
export const glyphsetIcons: ShapeCategory[] = [
	{
		id: 'glyphset-process',
		label: 'Process',
		profiles: ['glyphset'],
		shapes: [
			{ id: 'basicProcess', label: 'Basic Process', code: 'basicProcess' },
			{ id: 'cycle', label: 'Cycle', code: 'cycle' },
			{
				id: 'alternatingProcess',
				label: 'Alternating Process',
				code: 'alternatingProcess'
			},
			{ id: 'stepProcess', label: 'Step Process', code: 'stepProcess' },
			{ id: 'equationProcess', label: 'Equation Process', code: 'equationProcess' },
			{
				id: 'continuousBlockProcess',
				label: 'Continuous Block',
				code: 'continuousBlockProcess'
			},
			{ id: 'phasedProcess', label: 'Phased Process', code: 'phasedProcess' },
			{ id: 'detailedProcess', label: 'Detailed Process', code: 'detailedProcess' },
			{ id: 'groupedProcess', label: 'Grouped Process', code: 'groupedProcess' },
			{ id: 'pictureProcess', label: 'Picture Process', code: 'pictureProcess' },
			{ id: 'radialCycle', label: 'Radial Cycle', code: 'radialCycle' },
			{ id: 'gearCycle', label: 'Gear Cycle', code: 'gearCycle' },
			{ id: 'segmentedCycle', label: 'Segmented Cycle', code: 'segmentedCycle' },
			{ id: 'blockCycle', label: 'Block Cycle', code: 'blockCycle' },
			{ id: 'spiralCycle', label: 'Spiral Cycle', code: 'spiralCycle' },
			{ id: 'orbitCycle', label: 'Orbit Cycle', code: 'orbitCycle' }
		]
	},
	{
		id: 'glyphset-hierarchy',
		label: 'Hierarchy',
		profiles: ['glyphset'],
		shapes: [
			{ id: 'pyramid', label: 'Pyramid', code: 'pyramid' },
			{ id: 'invertedPyramid', label: 'Inverted Pyramid', code: 'invertedPyramid' },
			{ id: 'segmentedPyramid', label: 'Segmented Pyramid', code: 'segmentedPyramid' },
			{ id: 'pyramidList', label: 'Pyramid List', code: 'pyramidList' },
			{ id: 'orgChart', label: 'Org Chart', code: 'orgChart' },
			{
				id: 'horizontalOrgChart',
				label: 'Horizontal Org Chart',
				code: 'horizontalOrgChart'
			},
			{ id: 'matrixOrgChart', label: 'Matrix Org Chart', code: 'matrixOrgChart' },
			{ id: 'circleHierarchy', label: 'Circle Hierarchy', code: 'circleHierarchy' },
			{ id: 'labeledHierarchy', label: 'Labeled Hierarchy', code: 'labeledHierarchy' },
			{ id: 'tableHierarchy', label: 'Table Hierarchy', code: 'tableHierarchy' },
			{ id: 'teamHierarchy', label: 'Team Hierarchy', code: 'teamHierarchy' }
		]
	},
	{
		id: 'glyphset-comparison',
		label: 'Comparison',
		profiles: ['glyphset'],
		shapes: [
			{ id: 'matrix', label: 'Matrix', code: 'matrix' },
			{ id: 'venn', label: 'Venn', code: 'venn' },
			{ id: 'matrix3x3', label: 'Matrix 3x3', code: 'matrix3x3' },
			{ id: 'titledMatrix', label: 'Titled Matrix', code: 'titledMatrix' },
			{ id: 'segmentedMatrix', label: 'Segmented Matrix', code: 'segmentedMatrix' },
			{ id: 'steppedVenn', label: 'Stepped Venn', code: 'steppedVenn' },
			{ id: 'linearVenn', label: 'Linear Venn', code: 'linearVenn' }
		]
	},
	{
		id: 'glyphset-relationship',
		label: 'Relationship',
		profiles: ['glyphset'],
		shapes: [
			{ id: 'target', label: 'Target', code: 'target' },
			{ id: 'balance', label: 'Balance', code: 'balance' },
			{ id: 'opposing', label: 'Opposing', code: 'opposing' },
			{ id: 'converging', label: 'Converging', code: 'converging' },
			{ id: 'diverging', label: 'Diverging', code: 'diverging' },
			{ id: 'cluster', label: 'Cluster', code: 'cluster' },
			{ id: 'puzzle', label: 'Puzzle', code: 'puzzle' },
			{ id: 'plusMinus', label: 'Plus Minus', code: 'plusMinus' },
			{ id: 'counterBalance', label: 'Counterbalance', code: 'counterBalance' },
			{ id: 'equation', label: 'Equation', code: 'equation' },
			{ id: 'interconnected', label: 'Interconnected', code: 'interconnected' },
			{ id: 'hub', label: 'Hub', code: 'hub' }
		]
	},
	{
		id: 'glyphset-visualization',
		label: 'Visualization',
		profiles: ['glyphset'],
		shapes: [
			{ id: 'funnel', label: 'Funnel', code: 'funnel' },
			{ id: 'pictureGrid', label: 'Picture Grid', code: 'pictureGrid' },
			{ id: 'pictureCallout', label: 'Picture Callout', code: 'pictureCallout' },
			{ id: 'events', label: 'Events', code: 'events' }
		]
	},
	{
		id: 'glyphset-list',
		label: 'List',
		profiles: ['glyphset'],
		shapes: [
			{ id: 'basicList', label: 'Basic List', code: 'basicList' },
			{ id: 'horizontalList', label: 'Horizontal List', code: 'horizontalList' },
			{ id: 'chevronList', label: 'Chevron List', code: 'chevronList' },
			{
				id: 'numberedChevronList',
				label: 'Numbered Chevron List',
				code: 'numberedChevronList'
			},
			{ id: 'nestedList', label: 'Nested List', code: 'nestedList' },
			{ id: 'columnList', label: 'Column List', code: 'columnList' },
			{ id: 'increasingList', label: 'Increasing List', code: 'increasingList' },
			{ id: 'alternatingList', label: 'Alternating List', code: 'alternatingList' },
			{ id: 'pictureList', label: 'Picture List', code: 'pictureList' },
			{ id: 'pictureBlocks', label: 'Picture Blocks', code: 'pictureBlocks' },
			{ id: 'framedPicture', label: 'Framed Picture', code: 'framedPicture' }
		]
	}
];
