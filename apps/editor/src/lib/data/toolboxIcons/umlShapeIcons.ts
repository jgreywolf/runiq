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
			{ id: 'lifeline', label: 'Lifeline', code: 'shape id as @lifeline label:"Controller"' },
			{ id: 'activation', label: 'Activation', code: 'shape id as @activation' },
			{ id: 'fragment', label: 'Fragment', code: 'shape id as @fragment label:"alt"' },
			{ id: 'deletion', label: 'Deletion', code: 'shape id as @deletion' },
			// State Machine Diagrams
			{ id: 'state', label: 'State', code: 'shape id as @state label:"Active"' },
			{ id: 'initialState', label: 'Initial State', code: 'shape id as @initialState' },
			{ id: 'finalState', label: 'Final State', code: 'shape id as @finalState' },
			{ id: 'choice', label: 'Choice', code: 'shape id as @choice label:"[x > 0]"' },
			{ id: 'fork', label: 'Fork/Join Bar', code: 'shape id as @fork' },
			// Activity Diagrams
			{ id: 'activity', label: 'Activity', code: 'shape id as @activity label:"Process Order"' },
			// Component Diagrams
			{ id: 'component', label: 'Component', code: 'shape id as @component label:"UserService"' },
			{ id: 'artifact', label: 'Artifact', code: 'shape id as @artifact label:"config.xml"' },
			{ id: 'node', label: 'Node', code: 'shape id as @node label:"Application Server"' }
		]
	}
];
