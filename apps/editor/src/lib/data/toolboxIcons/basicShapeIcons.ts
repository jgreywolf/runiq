import type { ShapeCategory } from '../toolbox-data';

export const basicShapeIcons: ShapeCategory[] = [
	{
		id: 'basic',
		label: 'Basic Shapes',
		profiles: ['diagram'],
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
			{ id: 'cylinder', label: 'Database', code: 'shape id as @cylinder label:"Database"' },
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
			{ id: 'trapezoid', label: 'Trapezoid', code: 'shape id as @trapezoid label:"Label"' },
			{
				id: 'flippedTrapezoid',
				label: 'Flipped Trapezoid',
				code: 'shape id as @flippedTrapezoid label:"Label"'
			},
			{
				id: 'container',
				label: 'Container',
				code: `container id "Container" fillColor:"#e3f2fd" strokeColor:"#1976d2" borderWidth:2 {
  // Add shapes here
  shape s1 as @rectangle label:"Shape"
}`
			},
			{
				id: 'framedRectangle',
				label: 'Framed Rectangle',
				code: 'shape id as @framedRectangle label:"Frame"'
			},
			{
				id: 'multiRectangle',
				label: 'Multi Rectangle',
				code: 'shape id as @multiRectangle label:"Stack"'
			},
			{
				id: 'linedRectangle',
				label: 'Lined Rectangle',
				code: 'shape id as @linedRectangle label:"Lined"'
			},
			{
				id: 'dividedRectangle',
				label: 'Divided Rectangle',
				code: 'shape id as @dividedRectangle label:"Divided"'
			},
			{
				id: 'taggedRectangle',
				label: 'Tagged Rectangle',
				code: 'shape id as @taggedRectangle label:"Tagged"'
			},
			{
				id: 'notchedRectangle',
				label: 'Notched Rectangle',
				code: 'shape id as @notchedRectangle label:"Notch"'
			},
			{
				id: 'notchedPentagon',
				label: 'Notched Pentagon',
				code: 'shape id as @notchedPentagon label:"Notch"'
			}
		]
	}
];
