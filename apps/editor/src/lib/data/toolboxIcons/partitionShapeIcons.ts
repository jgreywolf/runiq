import type { ShapeCategory } from '../toolbox-data';

export const partitionShapeIcons: ShapeCategory[] = [
	{
		id: 'partitions',
		label: 'Lanes & Boundaries',
		profiles: ['diagram'],
		shapes: [
			{
				id: 'swimlane',
				label: 'Swimlane',
				code: 'shape id as @swimlane label:"Department" data:[{orientation:"vertical"}]'
			},
			{
				id: 'systemBoundary',
				label: 'System Boundary',
				code: `container boundary1 "System" as @systemBoundary {
  shape usecase1 as @ellipseWide label:"Use Case"
}`
			},
			{
				id: 'bpmnPool',
				label: 'BPMN Pool',
				code: `container pool1 "Customer" as @bpmnPool {
  shape task1 as @bpmnTask label:"Task"
}`
			},
			{
				id: 'bpmnLane',
				label: 'BPMN Lane',
				code: `container lane1 "Sales" as @bpmnLane {
  shape task1 as @bpmnTask label:"Review Order"
}`
			}
		]
	}
];
