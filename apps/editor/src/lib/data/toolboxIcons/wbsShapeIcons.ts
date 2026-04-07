import type { ShapeCategory } from '../toolbox-data';

export const wbsShapeIcons: ShapeCategory[] = [
	{
		id: 'wbs',
		label: 'Work Breakdown',
		profiles: ['diagram'],
		shapes: [
			{
				id: 'wbs',
				label: 'WBS Root',
				code: `container plan "Website Launch" as @wbs {
  container discovery "Discovery" as @wbsDeliverable {
    shape audit as @wbsWorkPackage label:"Content audit"
  }
}`
			},
			{
				id: 'wbsDeliverable',
				label: 'Deliverable',
				code: `container deliverable1 "Discovery" as @wbsDeliverable {
  shape task1 as @wbsWorkPackage label:"Stakeholder interviews"
}`
			},
			{
				id: 'wbsWorkPackage',
				label: 'Work Package',
				code: 'shape package1 as @wbsWorkPackage label:"Wireframes"'
			}
		]
	}
];
