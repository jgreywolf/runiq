/**
 * Text-based Icons
 * Special Unicode text icons for electrical, digital, hydraulic, pneumatic, and sequence diagram shapes
 */

import { repairMojibake } from './encoding';

const TEXT_ICON_MAP: Record<string, string> = {
	// Electrical/Digital components
	resistor: '─∿─',
	capacitor: '─||─',
	inductor: '─∿─',
	transformer: '∿∿',
	voltageSource: '─⊕─',
	currentSource: '─⊗─',
	ground: '⏚',
	junction: '●',
	diode: '─▷|─',
	led: '─▷|↯',
	npnTransistor: '─↓↑─',
	pnpTransistor: '─↑↓─',
	nmosTransistor: '─↓↑─',
	pmosTransistor: '─↑↓─',
	opamp: '─▷─',
	andGate: '─D─',
	orGate: '─)─',
	notGate: '─▷○',
	bufferGate: '─▷─',
	xorGate: '─⊕─',
	xnorGate: '⊕○',
	nandGate: '─D○',
	norGate: '─)○',
	and3Gate: 'D3',
	or3Gate: ')3',
	nand3Gate: 'D3○',
	nor3Gate: ')3○',
	dFlipFlop: 'D',
	jkFlipFlop: 'JK',
	tFlipFlop: 'T',
	register4: 'R4',
	register8: 'R8',
	mux4to1: 'M4',
	mux8to1: 'M8',
	decoder2to4: 'D24',
	decoder3to8: 'D38',

	// Sequence diagram participants
	participantActor: '👤',
	participantEntity: '□',
	participantBoundary: '○',
	participantControl: '◎',
	participantDatabase: '⬢',
	participantContinuation: '⋯',

	// Sequence diagram messages
	messageSync: '─▶',
	messageAsync: '╌▶',
	messageReturn: '◀╌',
	messageCreate: '─▶○',
	messageDestroy: '─▶✕',
	messageActivate: '▶▭',
	messageLost: '─▶●',
	messageFound: '●▶─',

	// Sequence diagram fragments
	fragmentAlt: '[alt]',
	fragmentOpt: '[opt]',
	fragmentLoop: '[loop]',
	fragmentPar: '[par]',
	fragmentBreak: '[brk]',
	fragmentCritical: '[crit]',
	fragmentNeg: '[neg]',
	fragmentRef: '[ref]',

	// Sequence diagram annotations
	noteOver: '📝',
	noteLeft: '◀📝',
	noteRight: '📝▶',
	stateInvariant: '{inv}',
	timeObservation: '⏱',
	durationConstraint: '⏱⟷',

	// Hydraulic components
	reservoir: '▭',
	pumpFixed: '⊙→',
	pumpVariable: '⊙⤴',
	pumpGear: '⊙⚙',
	pumpVane: '⊙▭',
	pumpPistonAxial: '⊙↕',
	pumpPistonRadial: '⊙◎',
	pumpScrew: '⊙⌇',
	pumpHand: '⊙✋',
	pumpPistonVar: '⊙↕⤴',
	motorHyd: '←⊙',
	motorGear: '⚙⊙',
	motorVane: '▭⊙',
	motorPistonAxial: '↕⊙',
	motorPistonRadial: '◎⊙',
	motorOrbit: '↻⊙',
	cylinderHyd: '═║═',
	cylinderSingleRod: '═║─',
	cylinderDoubleRod: '─║─',
	cylinderTelescopic: '═║║',
	cylinderMill: '▓║═',
	cylinderTieRod: '─║─',
	cylinderWelded: '▓║▓',
	cylinderFeedback: '═║┤',
	valve22: '┤├',
	valve32Hyd: '┤├┤',
	valve42: '┤╪┤',
	valve43: '╪',
	valve43Closed: '╪○',
	valve43Open: '╪□',
	valve43Tandem: '╪T',
	valve43Float: '╪~',
	valveProportional: '╪⚡',
	valveServo: '╪⚙',
	reliefValve: '┤∧',
	reducingValve: '∨┤',
	flowControlHyd: '┤⊗',
	checkValveHyd: '─▷|',
	filterHyd: '▭▓',
	accumulator: '⊕',
	gaugePHyd: '⊙P',

	// Phase 2 Hydraulic
	reliefValveDirect: '┤∧',
	reliefValvePilot: '┤∧◇',
	unloadingValve: '┤U',
	sequenceValve: '┤S',
	counterbalanceValve: '┤CB',
	brakeValve: '┤B',
	throttleValve: '┤⊗',
	needleValve: '┤▷',
	flowCompensated: '┤⊗C',
	flowTempComp: '┤⊗T',
	priorityValve: '┤P',
	flowDivider: '┤Y',
	checkValvePilot: '▷|◇',
	shuttleValve: 'Y▷',
	checkValvePilotOpen: '▷|○',
	rotaryVane: '↻▭',
	rotaryPiston: '↻↕',
	rackPinion: '═⚙',
	helicalActuator: '↻⌇',
	accumulatorBladder: '⊕B',
	accumulatorPiston: '⊕P',
	accumulatorDiaphragm: '⊕D',
	accumulatorWeight: '⊕W',

	// Phase 3 Hydraulic - Filters
	filterSuction: '◇S',
	filterPressure: '◇P',
	filterReturn: '◇R',
	filterOffline: '◇↻',
	filterBreather: '◇~',
	filterSpinOn: '⊙◇',

	// Phase 3 Hydraulic - Heat Exchangers
	coolerAir: '⬡↑',
	coolerWater: '⬡H₂O',
	coolerOilAir: '⬡A',
	coolerOilWater: '⬡W',

	// Phase 3 Hydraulic - Manifolds
	manifoldSandwich: '▭▭',
	manifoldMonoblock: '▓□',
	manifoldModular: '▭▭▭',
	manifoldCartridge: '⊙▭',

	// Pneumatic valves
	valve22Pneu: '┤├',
	valve32Pneu: '┤├┤',
	valve42Pneu: '┤╪┤',
	valve52: '╪',
	valve53Closed: '╪○',
	valve53Exhaust: '╪R',
	valve53Pressure: '╪P',

	// Pneumatic actuators
	cylSingleActing: '═║∿',
	cylDoubleActing: '═║═',
	cylRodless: '▭═▭',
	cylTelescopic: '═║║',
	rotaryActuator: '↻∿',
	motorPneumatic: '⊙∿',
	gripperParallel: '┤├',
	gripperAngular: '∧∨',
	gripperVacuum: '⊙V',

	// Pneumatic accessories
	airSource: '⊕A',
	regulator: 'R',
	filterAir: '▭▓',
	lubricator: '💧',
	frlUnit: 'FRL',
	airDryer: '▭◇',
	compressor: '⊙C',
	flowControl: '┤⊗',
	checkValve: '─▷|',
	throttle: '┤▷',
	quickExhaust: 'QE',
	exhaust: '▓▓',
	muffler: '▓~',
	gaugeP: '⊙P',
	sensorProx: '⊙◉',
	sensorPress: '⊙S',
	flowSensor: '⊙F',

	// Vacuum components
	vacuumGenerator: '∿V',
	vacuumPump: '⊙-',
	vacuumReservoir: '▭-',
	suctionCup: '∪V',
	vacuumFilter: '▓V',
	vacuumSwitch: '⊙V',
	blowOff: 'BO'
};

/**
 * Check if a shape should use a text-based icon
 */
export function hasTextIcon(shapeId: string): boolean {
	return shapeId in TEXT_ICON_MAP;
}

/**
 * Get text-based icon SVG
 */
export function getTextIcon(shapeId: string, size: number): string | null {
	const icon = TEXT_ICON_MAP[shapeId];
	if (!icon) return null;
	const displayIcon = repairMojibake(icon);

	return `
		<svg 
			width="${size}" 
			height="${size}" 
			viewBox="0 0 40 40"
			xmlns="http://www.w3.org/2000/svg"
			style="display: block;"
		>
			<text 
				x="20" 
				y="25" 
				text-anchor="middle" 
				font-family="monospace" 
				font-size="32" 
				fill="#334155"
			>${displayIcon}</text>
		</svg>
	`;
}

/**
 * Get special handling for entry/exit point shapes
 */
export function getEntryExitIcon(shapeId: string, size: number): string | null {
	if (shapeId !== 'entryPoint' && shapeId !== 'exitPoint') {
		return null;
	}

	const isExit = shapeId === 'exitPoint';
	const r = size * 0.35; // 35% of icon size
	const cx = size / 2;
	const cy = size / 2;

	if (isExit) {
		// Exit point: circle with X
		const xSize = r * 0.6;
		return `
			<svg 
				width="${size}" 
				height="${size}" 
				viewBox="0 0 ${size} ${size}"
				xmlns="http://www.w3.org/2000/svg"
				style="display: block;"
			>
				<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#000" stroke-width="1.5" />
				<line x1="${cx - xSize}" y1="${cy - xSize}" x2="${cx + xSize}" y2="${cy + xSize}" stroke="#000" stroke-width="1.2" />
				<line x1="${cx + xSize}" y1="${cy - xSize}" x2="${cx - xSize}" y2="${cy + xSize}" stroke="#000" stroke-width="1.2" />
			</svg>
		`;
	} else {
		// Entry point: simple circle
		return `
			<svg 
				width="${size}" 
				height="${size}" 
				viewBox="0 0 ${size} ${size}"
				xmlns="http://www.w3.org/2000/svg"
				style="display: block;"
			>
				<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#000" stroke-width="1.5" />
			</svg>
		`;
	}
}
