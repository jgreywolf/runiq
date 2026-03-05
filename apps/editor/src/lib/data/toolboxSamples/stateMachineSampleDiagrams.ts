import type { SampleCategory } from '../sample-data';

export const stateMachineSampleDiagrams: SampleCategory[] = [
	{
		id: 'stateMachine',
		label: 'State Machine',
		samples: [
			{
				name: 'Traffic Light',
				description: 'Simple state machine with three states and automatic transitions',
				code: `// UML State Machine: Traffic Light Controller
diagram "Traffic Light State Machine" {
  direction LR

  shape start as @initialState
  
  // States
  shape red as @state label: "Red"
  shape yellow as @state label: "Yellow"
  shape green as @state label: "Green"

  // Transitions
  start -> red
  red -> green
    label: "timer(30s)"
  green -> yellow
    label: "timer(25s)"
  yellow -> red
    label: "timer(5s)"
}`
			},
			{
				name: 'Door Lock',
				description: 'State machine with entry/exit actions and guard conditions',
				code: `// UML State Machine: Door Lock System
diagram "Door Lock State Machine" {
  direction TB

  shape start as @initialState

  shape locked as @state label: "Locked"
    entry: "engageLock()"
    exit: "releaseLock()"

  shape unlocked as @state label: "Unlocked"
    entry: "soundBeep()"
    doActivity: "startTimer()"

  shape alarm as @state label: "Alarm"
    entry: "soundAlarm()"
    exit: "stopAlarm()"

  // Transitions
  start -> locked
  locked -> unlocked
    event: "validCode"
  unlocked -> locked
    event: "timeout(10s)"
  locked -> alarm
    event: "invalidCode"
    guard: "[attempts > 3]"
  alarm -> locked
    event: "reset"
}`
			},
			{
				name: 'Complete Features',
				description: 'Comprehensive state machine with all node types',
				code: `// UML State Machine: Complete Feature Set
diagram "Complete State Machine" {
  direction TB

  shape start as @initialState

  // Standard states with behaviors
  shape idle as @state label: "Idle"
    entry: "turnOffLight()"
    doActivity: "monitorSensors()"
    exit: "logStateChange()"

  shape processing as @state label: "Processing"
    entry: "startProcess()"
    exit: "cleanup()"

  shape waiting as @state label: "Waiting"

  // Pseudo-states
  shape decision as @choice
  shape fork as @fork
  shape join as @join
  shape junc as @junction
  shape term as @terminate
  shape end as @finalState

  // Transitions
  start -> idle
  idle -> processing
    event: "trigger"
  processing -> decision
  decision -> waiting
    label: "[busy]"
  decision -> fork
    label: "[ready]"
  fork -> processing
  waiting -> join
  join -> end
  processing -> term
    event: "error"
}`
			},
			{
				name: 'History States',
				description: 'State machine demonstrating shallow and deep history',
				code: `// UML State Machine: Media Player with History
diagram "Media Player State Machine" {
  direction TB

  shape start as @initialState

  // Main states
  shape stopped as @state label: "Stopped"
  shape hist as @historyShallow

  container playing label: "Playing" {
    shape normal as @state label: "Normal Speed"
    shape fast as @state label: "Fast Forward"
  }

  // Transitions
  start -> stopped
  stopped -> hist
  hist -> normal
    label: "[no history]"
  normal -> fast
    event: "ff"
  fast -> normal
    event: "normal"
  playing -> stopped
    event: "stop"
}`
			}
		]
	}
];
