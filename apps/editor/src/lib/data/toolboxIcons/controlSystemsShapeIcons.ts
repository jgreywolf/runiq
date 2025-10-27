import type { ShapeCategory } from '../toolbox-data';

export const controlSystemsShapeIcons: ShapeCategory[] = [
	{
		id: 'controlSystems',
		label: 'Control Systems',
		shapes: [
			{
				id: 'transferFunction',
				label: 'Transfer Function',
				code: 'shape id as @transferFunction label:"H(s)"'
			},
			{ id: 'gain', label: 'Gain', code: 'shape id as @gain label:"K"' },
			{ id: 'integrator', label: 'Integrator', code: 'shape id as @integrator label:"1/s"' },
			{
				id: 'differentiator',
				label: 'Differentiator',
				code: 'shape id as @differentiator label:"s"'
			},
			{ id: 'timeDelay', label: 'Time Delay', code: 'shape id as @timeDelay label:"Delay"' },
			{ id: 'saturation', label: 'Saturation', code: 'shape id as @saturation label:"Sat"' },
			{
				id: 'summingJunction',
				label: 'Summing Junction',
				code: 'shape id as @summingJunction label:"+"'
			},
			{
				id: 'multiplyJunction',
				label: 'Multiply',
				code: 'shape id as @multiplyJunction label:"×"'
			},
			{ id: 'divideJunction', label: 'Divide', code: 'shape id as @divideJunction label:"÷"' },
			{
				id: 'compareJunction',
				label: 'Compare',
				code: 'shape id as @compareJunction label:"="'
			}
		]
	}
];
