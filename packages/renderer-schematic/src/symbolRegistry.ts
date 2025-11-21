import {
  and3Gate,
  andGate,
  bufferGate,
  capacitor,
  currentSource,
  decoder2to4,
  decoder3to8,
  dFlipFlop,
  diode,
  ground,
  inductor,
  jkFlipFlop,
  junction,
  led,
  mux4to1,
  mux8to1,
  nand3Gate,
  nandGate,
  nmosTransistor,
  nor3Gate,
  norGate,
  notGate,
  npnTransistor,
  opamp,
  or3Gate,
  orGate,
  pmosTransistor,
  pnpTransistor,
  register4,
  register8,
  resistor,
  tFlipFlop,
  transformer,
  voltageSource,
  xnorGate,
  xorGate,
} from './electricalSymbols.ts';
import {
  pumpFixed,
  pumpVariable,
  motorHydraulic,
  cylinderHydraulic,
  valve43Way,
  pressureReliefValve,
  pressureReducingValve,
  flowControlHydraulic,
  checkValveHydraulic,
  filterHydraulic,
  reservoir,
  accumulator,
  pressureGaugeHydraulic,
} from './hydraulicSymbols.ts';
import {
  cylinderSingleActing,
  cylinderDoubleActing,
  valve32Way,
  valve52Way,
  airSource,
  pressureRegulator,
  filterPneumatic,
  lubricator,
  flowControlPneumatic,
  checkValvePneumatic,
  exhaustPneumatic,
  pressureGaugePneumatic,
  proximitySensor,
  pressureSensor,
} from './pneumaticSymbols.ts';
import { SymbolDefinition } from './symbol.ts';

/**
 * Get symbol for component type
 */
export function getSymbol(type: string): SymbolDefinition | undefined {
  return symbolRegistry.get(type.toUpperCase());
}

/**
 * Symbol registry
 */
export const symbolRegistry = new Map<string, SymbolDefinition>([
  // Electrical components
  ['R', resistor],
  ['C', capacitor],
  ['L', inductor],
  ['V', voltageSource],
  ['I', currentSource],
  ['D', diode],
  ['LED', led],
  ['GND', ground],
  ['JUNCTION', junction],
  ['Q_NPN', npnTransistor],
  ['Q_PNP', pnpTransistor],
  ['M_NMOS', nmosTransistor],
  ['M_PMOS', pmosTransistor],
  ['OPAMP', opamp],
  ['XFMR', transformer],
  // Digital logic gates
  ['AND', andGate],
  ['OR', orGate],
  ['NOT', notGate],
  ['XOR', xorGate],
  ['NAND', nandGate],
  ['NOR', norGate],
  ['BUFFER', bufferGate],
  ['XNOR', xnorGate],
  ['AND3', and3Gate],
  ['OR3', or3Gate],
  ['NAND3', nand3Gate],
  ['NOR3', nor3Gate],
  // Flip-flops
  ['DFF', dFlipFlop],
  ['JKFF', jkFlipFlop],
  ['TFF', tFlipFlop],
  // Registers
  ['REG4', register4],
  ['REG8', register8],
  // Multiplexers
  ['MUX41', mux4to1],
  ['MUX81', mux8to1],
  // Decoders
  ['DEC24', decoder2to4],
  ['DEC38', decoder3to8],
]);

// Add pneumatic and hydraulic symbols to registry
symbolRegistry.set('CYL_SA', cylinderSingleActing);
symbolRegistry.set('CYL_DA', cylinderDoubleActing);
symbolRegistry.set('VALVE_32', valve32Way);
symbolRegistry.set('VALVE_52', valve52Way);
symbolRegistry.set('AIR_SOURCE', airSource);
symbolRegistry.set('REGULATOR', pressureRegulator);
symbolRegistry.set('FILTER', filterPneumatic);
symbolRegistry.set('LUBRICATOR', lubricator);
symbolRegistry.set('FLOW_CONTROL', flowControlPneumatic);
symbolRegistry.set('CHECK_VALVE', checkValvePneumatic);
symbolRegistry.set('EXHAUST', exhaustPneumatic);
symbolRegistry.set('GAUGE_P', pressureGaugePneumatic);
symbolRegistry.set('SENSOR_PROX', proximitySensor);
symbolRegistry.set('SENSOR_PRESS', pressureSensor);

symbolRegistry.set('PUMP_FIXED', pumpFixed);
symbolRegistry.set('PUMP_VAR', pumpVariable);
symbolRegistry.set('MOTOR_HYD', motorHydraulic);
symbolRegistry.set('CYL_HYD', cylinderHydraulic);
symbolRegistry.set('VALVE_43', valve43Way);
symbolRegistry.set('RELIEF_VALVE', pressureReliefValve);
symbolRegistry.set('REDUCING_VALVE', pressureReducingValve);
symbolRegistry.set('FLOW_CONTROL_HYD', flowControlHydraulic);
symbolRegistry.set('CHECK_VALVE_HYD', checkValveHydraulic);
symbolRegistry.set('FILTER_HYD', filterHydraulic);
symbolRegistry.set('RESERVOIR', reservoir);
symbolRegistry.set('ACCUMULATOR', accumulator);
symbolRegistry.set('GAUGE_P_HYD', pressureGaugeHydraulic);
