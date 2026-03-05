import type {
	DigitalProfile,
	ElectricalProfile,
	InstanceAst,
	ModuleAst,
	NetAst,
	PartAst,
	PortAst
} from '@runiq/core';
import { createSymbol } from './symbol.ts';
import { getSymbol, symbolRegistry } from './symbolRegistry.ts';

const TYPE_ALIASES: Record<string, string> = {
	ANDGATE: 'AND',
	ORGATE: 'OR',
	XORGATE: 'XOR',
	NANDGATE: 'NAND',
	NORGATE: 'NOR',
	XNORGATE: 'XNOR',
	NOTGATE: 'NOT',
	INVERTER: 'NOT',
	BUFFERGATE: 'BUFFER',
	BUFF: 'BUFFER',
	DFF: 'DFF',
	DFLIPFLOP: 'DFF',
	JKFF: 'JKFF',
	JKFLIPFLOP: 'JKFF',
	TFF: 'TFF',
	TFLIPFLOP: 'TFF',
	REG4: 'REG4',
	REGISTER4: 'REG4',
	REG8: 'REG8',
	REGISTER8: 'REG8',
	MUX41: 'MUX41',
	MUX4TO1: 'MUX41',
	MUX4X1: 'MUX41',
	MUX81: 'MUX81',
	MUX8TO1: 'MUX81',
	DEC24: 'DEC24',
	DEC2TO4: 'DEC24',
	DECODER2TO4: 'DEC24',
	DEC38: 'DEC38',
	DEC3TO8: 'DEC38',
	DECODER3TO8: 'DEC38',
	ANDARRAY4BIT: 'AND',
	ORARRAY4BIT: 'OR'
};

const TERMINAL_ALIASES: Record<string, Record<string, string[]>> = {
	AND: {
		A: ['A', 'IN', 'IN1', 'I1'],
		B: ['B', 'IN2', 'I2'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'SUM', 'CARRY', 'COUT', 'Q']
	},
	OR: {
		A: ['A', 'IN', 'IN1', 'I1'],
		B: ['B', 'IN2', 'I2'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'SUM', 'CARRY', 'COUT', 'Q']
	},
	XOR: {
		A: ['A', 'IN', 'IN1', 'I1'],
		B: ['B', 'IN2', 'I2'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'SUM', 'CARRY', 'COUT', 'Q']
	},
	NAND: {
		A: ['A', 'IN', 'IN1', 'I1'],
		B: ['B', 'IN2', 'I2'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'SUM', 'CARRY', 'COUT', 'Q']
	},
	NOR: {
		A: ['A', 'IN', 'IN1', 'I1'],
		B: ['B', 'IN2', 'I2'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'SUM', 'CARRY', 'COUT', 'Q']
	},
	XNOR: {
		A: ['A', 'IN', 'IN1', 'I1'],
		B: ['B', 'IN2', 'I2'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'SUM', 'CARRY', 'COUT', 'Q']
	},
	NOT: {
		A: ['A', 'IN', 'INPUT'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'Q']
	},
	BUFFER: {
		A: ['A', 'IN', 'INPUT'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'Q']
	},
	AND3: {
		A: ['A', 'IN1', 'I1'],
		B: ['B', 'IN2', 'I2'],
		C: ['C', 'IN3', 'I3'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'SUM', 'CARRY', 'COUT', 'Q']
	},
	OR3: {
		A: ['A', 'IN1', 'I1'],
		B: ['B', 'IN2', 'I2'],
		C: ['C', 'IN3', 'I3'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'SUM', 'CARRY', 'COUT', 'Q']
	},
	NAND3: {
		A: ['A', 'IN1', 'I1'],
		B: ['B', 'IN2', 'I2'],
		C: ['C', 'IN3', 'I3'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'SUM', 'CARRY', 'COUT', 'Q']
	},
	NOR3: {
		A: ['A', 'IN1', 'I1'],
		B: ['B', 'IN2', 'I2'],
		C: ['C', 'IN3', 'I3'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT', 'SUM', 'CARRY', 'COUT', 'Q']
	},
	DFF: {
		D: ['D', 'DATA'],
		CLK: ['CLK', 'CLOCK'],
		Q: ['Q', 'OUT'],
		QN: ['QN', 'QB', 'QBAR', 'NOTQ']
	},
	JKFF: {
		J: ['J'],
		K: ['K'],
		CLK: ['CLK', 'CLOCK'],
		Q: ['Q', 'OUT'],
		QN: ['QN', 'QB', 'QBAR', 'NOTQ']
	},
	TFF: {
		T: ['T'],
		CLK: ['CLK', 'CLOCK'],
		Q: ['Q', 'OUT'],
		QN: ['QN', 'QB', 'QBAR', 'NOTQ']
	},
	MUX41: {
		D0: ['D0', 'IN0', 'I0'],
		D1: ['D1', 'IN1', 'I1'],
		D2: ['D2', 'IN2', 'I2'],
		D3: ['D3', 'IN3', 'I3'],
		S0: ['S0', 'SEL0', 'SEL'],
		S1: ['S1', 'SEL1'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT']
	},
	MUX81: {
		D0: ['D0', 'IN0', 'I0'],
		D1: ['D1', 'IN1', 'I1'],
		D2: ['D2', 'IN2', 'I2'],
		D3: ['D3', 'IN3', 'I3'],
		D4: ['D4', 'IN4', 'I4'],
		D5: ['D5', 'IN5', 'I5'],
		D6: ['D6', 'IN6', 'I6'],
		D7: ['D7', 'IN7', 'I7'],
		S0: ['S0', 'SEL0', 'SEL'],
		S1: ['S1', 'SEL1'],
		S2: ['S2', 'SEL2'],
		Y: ['Y', 'OUT', 'OUTPUT', 'RESULT']
	},
	DEC24: {
		A0: ['A0', 'IN0', 'I0'],
		A1: ['A1', 'IN1', 'I1'],
		EN: ['EN', 'ENABLE'],
		Y0: ['Y0', 'OUT0', 'O0'],
		Y1: ['Y1', 'OUT1', 'O1'],
		Y2: ['Y2', 'OUT2', 'O2'],
		Y3: ['Y3', 'OUT3', 'O3']
	},
	DEC38: {
		A0: ['A0', 'IN0', 'I0'],
		A1: ['A1', 'IN1', 'I1'],
		A2: ['A2', 'IN2', 'I2'],
		EN: ['EN', 'ENABLE'],
		Y0: ['Y0', 'OUT0', 'O0'],
		Y1: ['Y1', 'OUT1', 'O1'],
		Y2: ['Y2', 'OUT2', 'O2'],
		Y3: ['Y3', 'OUT3', 'O3'],
		Y4: ['Y4', 'OUT4', 'O4'],
		Y5: ['Y5', 'OUT5', 'O5'],
		Y6: ['Y6', 'OUT6', 'O6'],
		Y7: ['Y7', 'OUT7', 'O7']
	},
	REG4: {
		D0: ['D0', 'IN0', 'I0'],
		D1: ['D1', 'IN1', 'I1'],
		D2: ['D2', 'IN2', 'I2'],
		D3: ['D3', 'IN3', 'I3'],
		CLK: ['CLK', 'CLOCK'],
		EN: ['EN', 'ENABLE'],
		Q0: ['Q0', 'OUT0', 'O0'],
		Q1: ['Q1', 'OUT1', 'O1'],
		Q2: ['Q2', 'OUT2', 'O2'],
		Q3: ['Q3', 'OUT3', 'O3']
	},
	REG8: {
		D0: ['D0', 'IN0', 'I0'],
		D1: ['D1', 'IN1', 'I1'],
		D2: ['D2', 'IN2', 'I2'],
		D3: ['D3', 'IN3', 'I3'],
		D4: ['D4', 'IN4', 'I4'],
		D5: ['D5', 'IN5', 'I5'],
		D6: ['D6', 'IN6', 'I6'],
		D7: ['D7', 'IN7', 'I7'],
		CLK: ['CLK', 'CLOCK'],
		EN: ['EN', 'ENABLE'],
		Q0: ['Q0', 'OUT0', 'O0'],
		Q1: ['Q1', 'OUT1', 'O1'],
		Q2: ['Q2', 'OUT2', 'O2'],
		Q3: ['Q3', 'OUT3', 'O3'],
		Q4: ['Q4', 'OUT4', 'O4'],
		Q5: ['Q5', 'OUT5', 'O5'],
		Q6: ['Q6', 'OUT6', 'O6'],
		Q7: ['Q7', 'OUT7', 'O7']
	}
};

function normalizeKey(value: string): string {
	return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

function resolveSymbolType(
	instance: InstanceAst,
	module: ModuleAst | undefined
): string | null {
	const instanceSymbol = instance.paramMap?.symbol || instance.paramMap?.type;
	if (typeof instanceSymbol === 'string') {
		const normalized = normalizeKey(instanceSymbol);
		if (symbolRegistry.has(normalized)) return normalized;
		if (TYPE_ALIASES[normalized]) return TYPE_ALIASES[normalized];
	}

	const moduleParamType = module?.params?.symbol || module?.params?.type;
	if (typeof moduleParamType === 'string') {
		const normalized = normalizeKey(moduleParamType);
		if (symbolRegistry.has(normalized)) return normalized;
		if (TYPE_ALIASES[normalized]) return TYPE_ALIASES[normalized];
	}

	const normalizedName = normalizeKey(instance.of);
	if (symbolRegistry.has(normalizedName)) return normalizedName;
	if (TYPE_ALIASES[normalizedName]) return TYPE_ALIASES[normalizedName];
	return null;
}

function buildModuleSymbol(moduleName: string, ports: PortAst[]): string {
	const normalizedName = normalizeKey(moduleName);
	if (symbolRegistry.has(normalizedName)) return normalizedName;

	const inputPorts: string[] = [];
	const outputPorts: string[] = [];
	const outputHints = /^(out|y|q|qn|qb|result|sum|carry|zero|done|valid|ready|flag)/i;

	for (const port of ports) {
		if (outputHints.test(port.name)) {
			outputPorts.push(port.name);
		} else {
			inputPorts.push(port.name);
		}
	}

	const leftCount = Math.max(1, inputPorts.length);
	const rightCount = Math.max(1, outputPorts.length);
	const maxCount = Math.max(leftCount, rightCount);
	const padding = 12;
	const spacing = 14;
	const height = Math.max(50, padding * 2 + (maxCount - 1) * spacing);
	const width = 120;

	const terminals: { x: number; y: number; name: string }[] = [];
	inputPorts.forEach((name, index) => {
		terminals.push({ x: 0, y: padding + index * spacing, name });
	});
	outputPorts.forEach((name, index) => {
		terminals.push({ x: width, y: padding + index * spacing, name });
	});

	const symbol = createSymbol(normalizedName, width, height, terminals, (cx, cy) => {
		const left = cx - width / 2;
		const top = cy - height / 2;
		return `
      <rect x="${left}" y="${top}" width="${width}" height="${height}"
        stroke="currentColor" stroke-width="2" fill="white"/>
      <text x="${cx}" y="${cy}" font-family="sans-serif" font-size="12"
        fill="currentColor" text-anchor="middle">${moduleName}</text>
    `;
	});

	symbolRegistry.set(normalizedName, symbol);
	return normalizedName;
}

function mapTerminalToNet(
	instance: InstanceAst,
	terminalName: string,
	symbolType: string,
	usedKeys: Set<string>,
	orderedPorts: Array<[string, string]>
): string {
	const terminalKey = normalizeKey(terminalName);
	const portMap = instance.portMap;
	const aliases = TERMINAL_ALIASES[symbolType]?.[terminalKey] || [terminalKey];

	if (terminalKey.startsWith('S')) {
		for (const [key, net] of Object.entries(portMap)) {
			const normalizedKey = normalizeKey(key);
			if (normalizedKey === 'SEL' || normalizedKey === 'SELECT') {
				return net;
			}
		}
	}

	for (const alias of aliases) {
		for (const [key, net] of Object.entries(portMap)) {
			if (usedKeys.has(key)) continue;
			if (normalizeKey(key) === normalizeKey(alias)) {
				usedKeys.add(key);
				return net;
			}
		}
	}

	for (const [key, net] of orderedPorts) {
		if (usedKeys.has(key)) continue;
		usedKeys.add(key);
		return net;
	}

	return `__unconnected_${instance.ref}_${terminalName}`;
}

function buildPinsForInstance(
	instance: InstanceAst,
	symbolType: string
): string[] {
	const symbol = getSymbol(symbolType);
	if (!symbol) return Object.values(instance.portMap);

	const orderedPorts = Object.entries(instance.portMap);
	const usedKeys = new Set<string>();

	return symbol.terminals.map((terminal) =>
		mapTerminalToNet(instance, terminal.name, symbolType, usedKeys, orderedPorts)
	);
}

function getPortsForInstance(
	instance: InstanceAst,
	module: ModuleAst | undefined
): PortAst[] {
	if (module?.ports?.length) return module.ports;
	return Object.keys(instance.portMap).map((name) => ({ name, dir: 'input' }));
}

export function convertDigitalToSchematic(profile: DigitalProfile): ElectricalProfile {
	const modulesByName = new Map<string, ModuleAst>();
	(profile.modules || []).forEach((mod) => modulesByName.set(normalizeKey(mod.name), mod));

	const parts: PartAst[] = [];
	const nets: NetAst[] = profile.nets || [];

	for (const instance of profile.instances) {
		const module = modulesByName.get(normalizeKey(instance.of));
		let symbolType = resolveSymbolType(instance, module);

		if (!symbolType) {
			const ports = getPortsForInstance(instance, module);
			symbolType = buildModuleSymbol(instance.of, ports);
		}

		parts.push({
			ref: instance.ref,
			type: symbolType,
			pins: buildPinsForInstance(instance, symbolType),
			params: instance.paramMap ? { ...instance.paramMap } : undefined
		});
	}

	return {
		type: 'electrical',
		name: profile.name,
		nets,
		parts
	};
}
