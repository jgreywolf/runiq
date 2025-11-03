import type { ShapeCategory } from '../toolbox-data';

export const erdShapeIcons: ShapeCategory[] = [
	{
		id: 'erd',
		label: 'ERD (Entity Relationship)',
		profiles: ['diagram'],
		shapes: [
			{ id: 'erdEntity', label: 'Entity', code: 'shape id as @erdEntity label:"Customer"' },
			{
				id: 'erdWeakEntity',
				label: 'Weak Entity',
				code: 'shape id as @erdWeakEntity label:"OrderItem"'
			},
			{
				id: 'erdRelationship',
				label: 'Relationship',
				code: 'shape id as @erdRelationship label:"Places"'
			},
			{
				id: 'erdAttribute',
				label: 'Attribute',
				code: 'shape id as @erdAttribute label:"email"'
			},
			{
				id: 'erdKeyAttribute',
				label: 'Key Attribute',
				code: 'shape id as @erdKeyAttribute label:"customer_id"'
			},
			{
				id: 'erdMultiValuedAttribute',
				label: 'Multi-valued Attribute',
				code: 'shape id as @erdMultiValuedAttribute label:"phone_numbers"'
			}
		]
	}
];
