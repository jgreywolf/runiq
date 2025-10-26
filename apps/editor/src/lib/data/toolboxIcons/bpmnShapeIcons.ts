import type { ShapeCategory } from '../toolbox-data';

export const bpmnShapeIcons: ShapeCategory[] = [
	{
		id: 'bpmn',
		label: 'BPMN',
		shapes: [
			{ id: 'bpmnTask', label: 'Task', code: 'shape id as @bpmnTask label:"Process Order"' },
			{
				id: 'bpmnEventStart',
				label: 'Start Event',
				code: 'shape id as @bpmnEvent label:"Start" data:[{"eventType":"start"}]'
			},
			{
				id: 'bpmnEventEnd',
				label: 'End Event',
				code: 'shape id as @bpmnEvent label:"End" data:[{"eventType":"end"}]'
			},
			{
				id: 'bpmnEventIntermediate',
				label: 'Intermediate Event',
				code: 'shape id as @bpmnEvent data:[{"eventType":"intermediate"}]'
			},
			{
				id: 'bpmnGatewayExclusive',
				label: 'Exclusive Gateway',
				code: 'shape id as @bpmnGateway data:[{"gatewayType":"exclusive"}]'
			},
			{
				id: 'bpmnGatewayParallel',
				label: 'Parallel Gateway',
				code: 'shape id as @bpmnGateway data:[{"gatewayType":"parallel"}]'
			},
			{
				id: 'bpmnGatewayInclusive',
				label: 'Inclusive Gateway',
				code: 'shape id as @bpmnGateway data:[{"gatewayType":"inclusive"}]'
			},
			{
				id: 'bpmnDataObject',
				label: 'Data Object',
				code: 'shape id as @bpmnDataObject label:"Customer Data"'
			},
			{
				id: 'bpmnMessage',
				label: 'Message',
				code: 'shape id as @bpmnMessage label:"Email"'
			},
			{
				id: 'bpmnPool',
				label: 'Pool/Lane',
				code: `container pool1 "Customer" as @bpmnPool {
  shape task1 as @bpmnTask label:"Task"
}`
			}
		]
	}
];
