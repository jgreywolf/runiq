import type { ShapeCategory } from '../toolbox-data';

export const bpmnShapeIcons: ShapeCategory[] = [
	{
		id: 'bpmn',
		label: 'BPMN',
		profiles: ['diagram'],
		shapes: [
			{ id: 'bpmnTask', label: 'Task', code: 'shape id as @bpmnTask label:"Process Order"' },
			{
				id: 'bpmnTaskUser',
				label: 'User Task',
				code: 'shape id as @bpmnTask label:"Review Order" data:[{"taskType":"user"}]'
			},
			{
				id: 'bpmnTaskService',
				label: 'Service Task',
				code: 'shape id as @bpmnTask label:"Validate Data" data:[{"taskType":"service"}]'
			},
			{
				id: 'bpmnTaskManual',
				label: 'Manual Task',
				code: 'shape id as @bpmnTask label:"Pack Items" data:[{"taskType":"manual"}]'
			},
			{
				id: 'bpmnTaskScript',
				label: 'Script Task',
				code: 'shape id as @bpmnTask label:"Calculate Total" data:[{"taskType":"script"}]'
			},
			{
				id: 'bpmnTaskReceive',
				label: 'Receive Task',
				code: 'shape id as @bpmnTask label:"Receive Approval" data:[{"taskType":"receive"}]'
			},
			{
				id: 'bpmnTaskSend',
				label: 'Send Task',
				code: 'shape id as @bpmnTask label:"Send Confirmation" data:[{"taskType":"send"}]'
			},
			{
				id: 'bpmnTaskBusinessRule',
				label: 'Business Rule Task',
				code: 'shape id as @bpmnTask label:"Check Policy" data:[{"taskType":"businessRule"}]'
			},
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
				id: 'bpmnEventTimer',
				label: 'Timer Event',
				code: 'shape id as @bpmnEvent label:"Timer" data:[{"eventType":"timer"}]'
			},
			{
				id: 'bpmnEventMessage',
				label: 'Message Event',
				code: 'shape id as @bpmnEvent label:"Message" data:[{"eventType":"message"}]'
			},
			{
				id: 'bpmnEventError',
				label: 'Error Event',
				code: 'shape id as @bpmnEvent label:"Error" data:[{"eventType":"error"}]'
			},
			{
				id: 'bpmnEventSignal',
				label: 'Signal Event',
				code: 'shape id as @bpmnEvent label:"Signal" data:[{"eventType":"signal"}]'
			},
			{
				id: 'bpmnEventConditional',
				label: 'Conditional Event',
				code: 'shape id as @bpmnEvent label:"Conditional" data:[{"eventType":"conditional"}]'
			},
			{
				id: 'bpmnEventEscalation',
				label: 'Escalation Event',
				code: 'shape id as @bpmnEvent label:"Escalate" data:[{"eventType":"escalation"}]'
			},
			{
				id: 'bpmnEventCompensation',
				label: 'Compensation Event',
				code: 'shape id as @bpmnEvent label:"Compensate" data:[{"eventType":"compensation"}]'
			},
			{
				id: 'bpmnEventCancel',
				label: 'Cancel Event',
				code: 'shape id as @bpmnEvent label:"Cancel" data:[{"eventType":"intermediate-cancel"}]'
			},
			{
				id: 'bpmnEventLink',
				label: 'Link Event',
				code: 'shape id as @bpmnEvent label:"Link" data:[{"eventType":"intermediate-link"}]'
			},
			{
				id: 'bpmnEventTerminate',
				label: 'Terminate Event',
				code: 'shape id as @bpmnEvent label:"Terminate" data:[{"eventType":"end-terminate"}]'
			},
			{
				id: 'bpmnEventMultiple',
				label: 'Multiple Event',
				code: 'shape id as @bpmnEvent label:"Multiple" data:[{"eventType":"intermediate-multiple"}]'
			},
			{
				id: 'bpmnEventParallelMultiple',
				label: 'Parallel Multiple Event',
				code: 'shape id as @bpmnEvent label:"Parallel" data:[{"eventType":"intermediate-parallelMultiple"}]'
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
				id: 'bpmnGatewayEventBased',
				label: 'Event-Based Gateway',
				code: 'shape id as @bpmnGateway data:[{"gatewayType":"eventBased"}]'
			},
			{
				id: 'bpmnGatewayComplex',
				label: 'Complex Gateway',
				code: 'shape id as @bpmnGateway data:[{"gatewayType":"complex"}]'
			},
			{
				id: 'bpmnDataObject',
				label: 'Data Object',
				code: 'shape id as @bpmnDataObject label:"Customer Data"'
			},
			{
				id: 'bpmnDataStore',
				label: 'Data Store',
				code: 'shape id as @bpmnDataStore label:"Customer DB"'
			},
			{
				id: 'bpmnDataInput',
				label: 'Data Input',
				code: 'shape id as @bpmnDataInput label:"Order Form"'
			},
			{
				id: 'bpmnDataOutput',
				label: 'Data Output',
				code: 'shape id as @bpmnDataOutput label:"Invoice"'
			},
			{
				id: 'bpmnMessage',
				label: 'Message',
				code: 'shape id as @bpmnMessage label:"Email"'
			},
			{
				id: 'bpmnTransaction',
				label: 'Transaction',
				code: 'shape id as @transaction label:"Transaction"'
			},
			{
				id: 'bpmnEventSubProcess',
				label: 'Event Subprocess',
				code: 'shape id as @eventSubProcess label:"Event Subprocess"'
			},
			{
				id: 'bpmnCallActivity',
				label: 'Call Activity',
				code: 'shape id as @callActivity label:"Call Activity"'
			},
			{
				id: 'bpmnConversation',
				label: 'Conversation',
				code: 'shape id as @conversation label:"Conversation"'
			},
			{
				id: 'bpmnAnnotation',
				label: 'Annotation',
				code: 'shape id as @annotation label:"Note"'
			},
			{
				id: 'bpmnPool',
				label: 'Pool',
				code: `container pool1 "Customer" as @bpmnPool {
  shape task1 as @bpmnTask label:"Task"
}`
			},
			{
				id: 'bpmnLane',
				label: 'Lane',
				code: `container lane1 "Sales" as @bpmnLane {
  shape task1 as @bpmnTask label:"Review Order"
}`
			}
		]
	}
];
