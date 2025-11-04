import type { ShapeCategory } from '../toolbox-data';

export const sequenceShapeIcons: ShapeCategory[] = [
	{
		id: 'sequenceParticipants',
		label: 'Participants',
		profiles: ['sequence'],
		shapes: [
			{
				id: 'participantActor',
				label: 'Actor',
				code: 'participant "User" as actor'
			},
			{
				id: 'participantEntity',
				label: 'Entity',
				code: 'participant "System" as entity'
			},
			{
				id: 'participantBoundary',
				label: 'Boundary',
				code: 'participant "API Gateway" as boundary'
			},
			{
				id: 'participantControl',
				label: 'Control',
				code: 'participant "Controller" as control'
			},
			{
				id: 'participantDatabase',
				label: 'Database',
				code: 'participant "Database" as database'
			},
			{
				id: 'participantContinuation',
				label: 'Continuation',
				code: 'participant "Next Page" as continuation'
			}
		]
	},
	{
		id: 'sequenceMessages',
		label: 'Messages',
		profiles: ['sequence'],
		shapes: [
			{
				id: 'messageSync',
				label: 'Synchronous Call',
				code: 'message from:"A" to:"B" label:"call()" type:sync'
			},
			{
				id: 'messageAsync',
				label: 'Asynchronous Call',
				code: 'message from:"A" to:"B" label:"notify()" type:async'
			},
			{
				id: 'messageReturn',
				label: 'Return Message',
				code: 'message from:"B" to:"A" label:"result" type:return'
			},
			{
				id: 'messageCreate',
				label: 'Create Object',
				code: 'message from:"A" to:"B" label:"new()" type:create'
			},
			{
				id: 'messageDestroy',
				label: 'Destroy Object',
				code: 'message from:"A" to:"B" label:"destroy()" type:destroy'
			},
			{
				id: 'messageActivate',
				label: 'Call with Activation',
				code: 'message from:"A" to:"B" label:"process()" type:sync activate:true'
			},
			{
				id: 'messageLost',
				label: 'Lost Message',
				code: 'message from:"A" to:lost label:"timeout"'
			},
			{
				id: 'messageFound',
				label: 'Found Message',
				code: 'message from:found to:"A" label:"event"'
			}
		]
	},
	{
		id: 'sequenceFragments',
		label: 'Combined Fragments',
		profiles: ['sequence'],
		shapes: [
			{
				id: 'fragmentAlt',
				label: 'Alternative (alt)',
				code: 'fragment alt "Condition" from:1 to:3 alternatives:("If true":1..2,"Else":2..3)'
			},
			{
				id: 'fragmentOpt',
				label: 'Optional (opt)',
				code: 'fragment opt "Optional Flow" from:1 to:2'
			},
			{
				id: 'fragmentLoop',
				label: 'Loop',
				code: 'fragment loop "Retry Loop" from:1 to:3 condition:"attempts < 3"'
			},
			{
				id: 'fragmentPar',
				label: 'Parallel (par)',
				code: 'fragment par "Concurrent" from:1 to:4'
			},
			{
				id: 'fragmentBreak',
				label: 'Break',
				code: 'fragment break "Error Handling" from:1 to:2'
			},
			{
				id: 'fragmentCritical',
				label: 'Critical Region',
				code: 'fragment critical "Thread Safe" from:1 to:2'
			},
			{
				id: 'fragmentNeg',
				label: 'Negative (neg)',
				code: 'fragment neg "Invalid Scenario" from:1 to:2'
			},
			{
				id: 'fragmentRef',
				label: 'Interaction Use (ref)',
				code: 'fragment ref "Common Flow" from:1 to:2 interaction:"Authentication"'
			}
		]
	},
	{
		id: 'sequenceAnnotations',
		label: 'Annotations',
		profiles: ['sequence'],
		shapes: [
			{
				id: 'noteOver',
				label: 'Note Over Participant',
				code: 'note "Comment text" position:over participants:("A")'
			},
			{
				id: 'noteLeft',
				label: 'Note Left',
				code: 'note "Comment text" position:left participants:("A")'
			},
			{
				id: 'noteRight',
				label: 'Note Right',
				code: 'note "Comment text" position:right participants:("A")'
			},
			{
				id: 'stateInvariant',
				label: 'State Invariant',
				code: 'message from:"A" to:"B" label:"update()" stateInvariant:"balance >= 0"'
			},
			{
				id: 'timeObservation',
				label: 'Time Observation',
				code: 'message from:"A" to:"B" label:"process()" timeObservation:"t1"'
			},
			{
				id: 'durationConstraint',
				label: 'Duration Constraint',
				code: 'duration from:1 to:3 constraint:"< 100ms" participants:("A","B") label:"Response Time"'
			}
		]
	}
];
