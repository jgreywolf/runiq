import type { ShapeCategory } from '../toolbox-data';

export const c4ShapeIcons: ShapeCategory[] = [
	{
		id: 'c4',
		label: 'C4 Architecture',
		profiles: ['diagram'],
		shapes: [
			{
				id: 'c4Person',
				label: 'Person',
				code: 'shape id as @c4Person label:"User"'
			},
			{
				id: 'c4System',
				label: 'Software System',
				code: 'shape id as @c4System label:"System Name"'
			},
			{
				id: 'c4ExternalSystem',
				label: 'External System',
				code: 'shape id as @c4ExternalSystem label:"Payments Gateway"'
			},
			{
				id: 'c4Container',
				label: 'Container',
				code: 'shape id as @c4Container label:"Web App\\n[React, TypeScript]"'
			},
			{
				id: 'c4ContainerInstance',
				label: 'Container Instance',
				code: 'shape id as @c4ContainerInstance label:"Web App Instance\\n[React]"'
			},
			{
				id: 'c4Component',
				label: 'Component',
				code: 'shape id as @c4Component label:"Controller"'
			},
			{
				id: 'c4SystemInstance',
				label: 'System Instance',
				code: 'shape id as @c4SystemInstance label:"Banking System Instance"'
			},
			{
				id: 'c4DeploymentNode',
				label: 'Deployment Node',
				code: 'shape id as @c4DeploymentNode label:"Kubernetes Cluster"'
			},
			{
				id: 'c4ExternalPerson',
				label: 'External Person',
				code: 'shape id as @c4ExternalPerson label:"External Customer"'
			}
		]
	}
];
