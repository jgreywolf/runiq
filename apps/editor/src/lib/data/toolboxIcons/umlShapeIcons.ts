import type { ShapeCategory } from '../toolbox-data';

export const umlShapeIcons: ShapeCategory[] = [
	{
		id: 'uml',
		label: 'UML',
		shapes: [
			// Class Diagrams
			{ id: 'class', label: 'Class', code: 'shape id as @class label:"ClassName"' },
			{
				id: 'interface',
				label: 'Interface',
				code: 'shape interfaceId as @interface label:"IRepository"'
			},
			{
				id: 'abstract',
				label: 'Abstract Class',
				code: 'shape abstractId as @abstract label:"Vehicle"'
			},
			{ id: 'enum', label: 'Enumeration', code: 'shape enumId as @enum label:"Priority"' },
			{
				id: 'package',
				label: 'Package',
				code: `container pkg1 "com.example.models" as @umlPackage {
  shape class1 as @class label:"MyClass"
}`
			},
			{ id: 'note', label: 'Note', code: 'shape noteId as @note label:"Important note here"' },
			// Use Case Diagrams
			{ id: 'actor', label: 'Actor', code: 'shape actorId as @actor label:"Actor"' },
			{
				id: 'systemBoundary',
				label: 'System Boundary',
				code: `container boundary1 "System" as @systemBoundary {
  shape usecase1 as @ellipseWide label:"Use Case"
}`
			},
			// Sequence Diagrams
			{
				id: 'lifeline',
				label: 'Lifeline',
				code: 'shape id as @lifeline label:"Account" stateInvariant:"balance >= 0"'
			},
			{ id: 'activation', label: 'Activation', code: 'shape id as @activation' },
			{
				id: 'interactionFragment',
				label: 'Interaction Fragment',
				code: 'shape id as @interactionFragment label:"alt"'
			},
			{ id: 'deletion', label: 'Deletion', code: 'shape id as @deletion' },
			{
				id: 'continuation',
				label: 'Continuation',
				code: 'shape id as @continuation label:"ref LoginSuccess"'
			},
			{
				id: 'timeObservation',
				label: 'Time Observation',
				code: 'shape id as @timeObservation label:"t < 100ms"'
			},
			// State Machine Diagrams
			{ id: 'state', label: 'State', code: 'shape id as @state label:"Active"' },
			{ id: 'initialState', label: 'Initial State', code: 'shape id as @initialState' },
			{ id: 'finalState', label: 'Final State', code: 'shape id as @finalState' },
			{ id: 'choice', label: 'Choice', code: 'shape id as @choice label:"[x > 0]"' },
			{ id: 'fork', label: 'Fork/Join Bar', code: 'shape id as @fork' },
			{ id: 'historyShallow', label: 'Shallow History', code: 'shape id as @history-shallow' },
			{ id: 'historyDeep', label: 'Deep History', code: 'shape id as @history-deep' },
			{ id: 'junction', label: 'Junction', code: 'shape id as @junction' },
			{ id: 'entryPoint', label: 'Entry Point', code: 'shape id as @entry-point' },
			{ id: 'exitPoint', label: 'Exit Point', code: 'shape id as @exit-point' },
			{ id: 'terminate', label: 'Terminate', code: 'shape id as @terminate' },
			// Activity Diagrams
			{ id: 'activity', label: 'Activity', code: 'shape id as @activity label:"Process Order"' },
			{ id: 'activityFinal', label: 'Activity Final', code: 'shape id as @activityFinal' },
			{ id: 'flowFinal', label: 'Flow Final', code: 'shape id as @flowFinal' },
			{ id: 'objectNode', label: 'Object Node', code: 'shape id as @objectNode label:"Order"' },
			{
				id: 'centralBuffer',
				label: 'Central Buffer',
				code: 'shape id as @centralBuffer label:"Buffer"'
			},
			{ id: 'dataStore', label: 'Data Store', code: 'shape id as @dataStore label:"Database"' },
			{
				id: 'swimlane',
				label: 'Swimlane',
				code: 'shape id as @swimlane label:"Department" data:[{orientation:"vertical"}]'
			},
			{
				id: 'sendSignal',
				label: 'Send Signal',
				code: 'shape id as @sendSignal label:"Send Email"'
			},
			{
				id: 'receiveSignal',
				label: 'Receive Signal',
				code: 'shape id as @receiveSignal label:"Email Received"'
			},
			{
				id: 'acceptEvent',
				label: 'Accept Event',
				code: 'shape id as @acceptEvent label:"Wait for Response"'
			},
			// Component Diagrams
			{
				id: 'umlComponent',
				label: 'Component',
				code: 'shape id as @umlComponent label:"UserService"'
			},
			{ id: 'artifact', label: 'Artifact', code: 'shape id as @artifact label:"config.xml"' },
			{ id: 'node', label: 'Node', code: 'shape id as @node label:"Application Server"' }
		]
	}
];
