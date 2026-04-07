import type { ShapeCategory } from '../toolbox-data';

export const requirementsShapeIcons: ShapeCategory[] = [
	{
		id: 'requirements',
		label: 'Requirements',
		profiles: ['diagram'],
		shapes: [
			{
				id: 'requirementPackage',
				label: 'Requirement Package',
				code: `container reqs "System Requirements" as @requirementPackage {
  shape req1 as @requirement title:"REQ-001" label:"Stopping distance under 40m"
}`
			},
			{
				id: 'requirement',
				label: 'Requirement',
				code: 'shape req1 as @requirement title:"REQ-001" label:"Stopping distance under 40m"'
			},
			{
				id: 'testCase',
				label: 'Test Case',
				code: 'shape tc1 as @testCase label:"BrakeBenchTest"'
			}
		]
	}
];
