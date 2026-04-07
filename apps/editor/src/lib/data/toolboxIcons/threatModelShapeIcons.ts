import type { ShapeCategory } from '../toolbox-data';

export const threatModelShapeIcons: ShapeCategory[] = [
	{
		id: 'threatModel',
		label: 'Threat Modeling',
		profiles: ['diagram'],
		shapes: [
			{
				id: 'trustBoundary',
				label: 'Trust Boundary',
				code: `container internet "Internet" as @trustBoundary {
  shape user as @actor label:"User"
}`
			},
			{
				id: 'threat',
				label: 'Threat',
				code: 'shape threat1 as @threat label:"Credential spoofing"'
			},
			{
				id: 'mitigation',
				label: 'Mitigation',
				code: 'shape mitigation1 as @mitigation label:"Require MFA"'
			},
			{
				id: 'securityControl',
				label: 'Security Control',
				code: 'shape control1 as @securityControl label:"WAF"'
			}
		]
	}
];
