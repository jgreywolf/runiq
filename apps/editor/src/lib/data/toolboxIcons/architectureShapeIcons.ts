import type { ShapeCategory } from '../toolbox-data';

export const architectureShapeIcons: ShapeCategory[] = [
	{
		id: 'architecture',
		label: 'Architecture',
		profiles: ['diagram'],
		shapes: [
			{
				id: 'architectureLayer',
				label: 'Architecture Layer',
				code: `container layer1 "User mode" as @architectureLayer {
  shape subsystem1 as @subsystemBlock label:"Subsystem"
}`
			},
			{
				id: 'subsystemBlock',
				label: 'Subsystem Block',
				code: 'shape id as @subsystemBlock label:"Subsystem"'
			},
			{
				id: 'platformBlock',
				label: 'Platform Block',
				code: 'shape id as @platformBlock label:"Platform Service"'
			},
			{
				id: 'externalSystemBlock',
				label: 'External System',
				code: 'shape id as @externalSystemBlock label:"Hardware"'
			}
		]
	}
];
