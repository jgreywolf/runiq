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
			{ id: 'basicProcess', label: 'Basic Process', code: 'glyphset basicProcess' },
			{ id: 'cycle', label: 'Cycle', code: 'glyphset cycle' },
			{
				id: 'alternatingProcess',
				label: 'Alternating Process',
				code: 'glyphset alternatingProcess'
			},
			{ id: 'stepProcess', label: 'Step Process', code: 'glyphset stepProcess' },
			{ id: 'equationProcess', label: 'Equation Process', code: 'glyphset equationProcess' },
			{
				id: 'continuousBlockProcess',
				label: 'Continuous Block',
				code: 'glyphset continuousBlockProcess'
			},
			{ id: 'phasedProcess', label: 'Phased Process', code: 'glyphset phasedProcess' },
			{ id: 'detailedProcess', label: 'Detailed Process', code: 'glyphset detailedProcess' },
			{ id: 'groupedProcess', label: 'Grouped Process', code: 'glyphset groupedProcess' },
			{ id: 'pictureProcess', label: 'Picture Process', code: 'glyphset pictureProcess' },
			{ id: 'radialCycle', label: 'Radial Cycle', code: 'glyphset radialCycle' },
			{ id: 'gearCycle', label: 'Gear Cycle', code: 'glyphset gearCycle' },
			{ id: 'segmentedCycle', label: 'Segmented Cycle', code: 'glyphset segmentedCycle' },
			{ id: 'blockCycle', label: 'Block Cycle', code: 'glyphset blockCycle' },
			{ id: 'spiralCycle', label: 'Spiral Cycle', code: 'glyphset spiralCycle' },
			{ id: 'orbitCycle', label: 'Orbit Cycle', code: 'glyphset orbitCycle' }
		]
	},
	{
		id: 'glyphset-hierarchy',
		label: 'Hierarchy',
		profiles: ['glyphset'],
		shapes: [
			{ id: 'pyramid', label: 'Pyramid', code: 'glyphset pyramid' },
			{ id: 'invertedPyramid', label: 'Inverted Pyramid', code: 'glyphset invertedPyramid' },
			{ id: 'segmentedPyramid', label: 'Segmented Pyramid', code: 'glyphset segmentedPyramid' },
			{ id: 'pyramidList', label: 'Pyramid List', code: 'glyphset pyramidList' },
			{ id: 'orgChart', label: 'Org Chart', code: 'glyphset orgChart' },
			{
				id: 'horizontalOrgChart',
				label: 'Horizontal Org Chart',
				code: 'glyphset horizontalOrgChart'
			},
			{ id: 'matrixOrgChart', label: 'Matrix Org Chart', code: 'glyphset matrixOrgChart' },
			{ id: 'circleHierarchy', label: 'Circle Hierarchy', code: 'glyphset circleHierarchy' },
			{ id: 'labeledHierarchy', label: 'Labeled Hierarchy', code: 'glyphset labeledHierarchy' },
			{ id: 'tableHierarchy', label: 'Table Hierarchy', code: 'glyphset tableHierarchy' },
			{ id: 'teamHierarchy', label: 'Team Hierarchy', code: 'glyphset teamHierarchy' }
		]
	},
	{
		id: 'glyphset-comparison',
		label: 'Comparison',
		profiles: ['glyphset'],
		shapes: [
			{ id: 'matrix', label: 'Matrix', code: 'glyphset matrix' },
			{ id: 'venn', label: 'Venn', code: 'glyphset venn' },
			{ id: 'matrix3x3', label: 'Matrix 3x3', code: 'glyphset matrix3x3' },
			{ id: 'titledMatrix', label: 'Titled Matrix', code: 'glyphset titledMatrix' },
			{ id: 'segmentedMatrix', label: 'Segmented Matrix', code: 'glyphset segmentedMatrix' },
			{ id: 'steppedVenn', label: 'Stepped Venn', code: 'glyphset steppedVenn' },
			{ id: 'linearVenn', label: 'Linear Venn', code: 'glyphset linearVenn' }
		]
	},
	{
		id: 'glyphset-relationship',
		label: 'Relationship',
		profiles: ['glyphset'],
		shapes: [
			{ id: 'target', label: 'Target', code: 'glyphset target' },
			{ id: 'balance', label: 'Balance', code: 'glyphset balance' },
			{ id: 'opposing', label: 'Opposing', code: 'glyphset opposing' },
			{ id: 'converging', label: 'Converging', code: 'glyphset converging' },
			{ id: 'diverging', label: 'Diverging', code: 'glyphset diverging' },
			{ id: 'cluster', label: 'Cluster', code: 'glyphset cluster' },
			{ id: 'puzzle', label: 'Puzzle', code: 'glyphset puzzle' },
			{ id: 'plusMinus', label: 'Plus Minus', code: 'glyphset plusMinus' },
			{ id: 'counterbalance', label: 'Counterbalance', code: 'glyphset counterbalance' },
			{ id: 'equation', label: 'Equation', code: 'glyphset equation' },
			{ id: 'interconnected', label: 'Interconnected', code: 'glyphset interconnected' },
			{ id: 'hub', label: 'Hub', code: 'glyphset hub' }
		]
	},
	{
		id: 'glyphset-visualization',
		label: 'Visualization',
		profiles: ['glyphset'],
		shapes: [
			{ id: 'funnel', label: 'Funnel', code: 'glyphset funnel' },
			{ id: 'pictureGrid', label: 'Picture Grid', code: 'glyphset pictureGrid' },
			{ id: 'pictureCallout', label: 'Picture Callout', code: 'glyphset pictureCallout' },
			{ id: 'events', label: 'Events', code: 'glyphset events' }
		]
	},
	{
		id: 'glyphset-list',
		label: 'List',
		profiles: ['glyphset'],
		shapes: [
			{ id: 'basicList', label: 'Basic List', code: 'glyphset basicList' },
			{ id: 'horizontalList', label: 'Horizontal List', code: 'glyphset horizontalList' },
			{ id: 'chevronList', label: 'Chevron List', code: 'glyphset chevronList' },
			{
				id: 'numberedChevronList',
				label: 'Numbered Chevron List',
				code: 'glyphset numberedChevronList'
			},
			{ id: 'nestedList', label: 'Nested List', code: 'glyphset nestedList' },
			{ id: 'columnList', label: 'Column List', code: 'glyphset columnList' },
			{ id: 'increasingList', label: 'Increasing List', code: 'glyphset increasingList' },
			{ id: 'alternatingList', label: 'Alternating List', code: 'glyphset alternatingList' },
			{ id: 'pictureList', label: 'Picture List', code: 'glyphset pictureList' },
			{ id: 'pictureBlocks', label: 'Picture Blocks', code: 'glyphset pictureBlocks' },
			{ id: 'framedPicture', label: 'Framed Picture', code: 'glyphset framedPicture' }
		]
	}
];
