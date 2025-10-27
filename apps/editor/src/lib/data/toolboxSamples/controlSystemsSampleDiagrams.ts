import type { SampleCategory } from '../sample-data';

export const controlSystemsSampleDiagrams: SampleCategory[] = [
	{
		id: 'controlSystems',
		label: 'Control Systems',
		samples: [
			{
				name: 'Feedback Control Loop',
				description: 'Classic feedback control system',
				code: `diagram "Feedback Control"

shape input as @circle label:"Input"
shape sum as @summingJunction label:"+"
shape controller as @transferFunction label:"K"
shape plant as @transferFunction label:"G(s)"
shape output as @circle label:"Output"
shape feedback as @transferFunction label:"H(s)"

input -> sum
sum -> controller
controller -> plant
plant -> output
output -> feedback
feedback -> sum`
			},
			{
				name: 'Signal Processing Chain',
				description: 'DSP filter chain',
				code: `diagram "Signal Processing"

shape input as @rectangle label:"Input"
shape lpf as @transferFunction label:"LPF"
shape gain as @gain label:"K=10"
shape integrator as @integrator label:"1/s"
shape output as @rectangle label:"Output"

input -> lpf
lpf -> gain
gain -> integrator
integrator -> output`
			}
		]
	}
];
