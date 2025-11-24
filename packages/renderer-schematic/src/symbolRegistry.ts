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
  pumpVane,
  pumpPistonAxial,
  pumpPistonRadial,
  pumpGear,
  pumpScrew,
  pumpHand,
  pumpPistonVariable,
  motorGear,
  motorVane,
  motorPistonAxial,
  motorPistonRadial,
  motorOrbit,
  valve22Way,
  valve32WayHydraulic,
  valve42Way,
  valve43ClosedCenter,
  valve43OpenCenter,
  valve43TandemCenter,
  valve43FloatCenter,
  valveProportional,
  valveServo,
  cylinderSingleRod,
  cylinderDoubleRod,
  cylinderTelescopic,
  cylinderMill,
  cylinderTieRod,
  cylinderWelded,
  cylinderFeedback,
  // Phase 2: Pressure Control Valves
  reliefValveDirect,
  reliefValvePilot,
  unloadingValve,
  sequenceValve,
  counterbalanceValve,
  brakeValve,
  // Phase 2: Flow Control Valves
  throttleValve,
  needleValve,
  flowCompensated,
  flowTempCompensated,
  priorityValve,
  flowDivider,
  // Phase 2: Check Valves
  checkValvePilot,
  shuttleValve,
  checkValvePilotOpen,
  // Phase 2: Rotary Actuators
  rotaryActuatorVane,
  rotaryActuatorPiston,
  rackPinionActuator,
  helicalActuator,
  // Phase 2: Accumulators
  accumulatorBladder,
  accumulatorPiston,
  accumulatorDiaphragm,
  accumulatorWeight,
  // Phase 3: Filters
  filterSuction,
  filterPressure,
  filterReturn,
  filterOffline,
  filterBreather,
  filterSpinOn,
  // Phase 3: Heat Exchangers (Coolers)
  coolerAir,
  coolerWater,
  coolerOilAir,
  coolerOilWater,
  // Phase 3: Manifolds
  manifoldSandwich,
  manifoldMonoblock,
  manifoldModular,
  manifoldCartridge,
} from './hydraulic/hydraulicSymbols.ts';
import {
  // Valves
  valve22Way as valve22WayPneumatic,
  valve32Way as valve32WayPneumatic,
  valve42Way as valve42WayPneumatic,
  valve52Way,
  valve53ClosedCenter,
  valve53ExhaustCenter,
  valve53PressureCenter,
  // Actuators
  cylinderSingleActing,
  cylinderDoubleActing,
  cylinderRodless,
  cylinderTelescopic as cylinderTelescopicPneumatic,
  rotaryActuator,
  motorPneumatic,
  gripperParallel,
  gripperAngular,
  gripperVacuum,
  // Accessories
  airSource,
  pressureRegulator,
  filterPneumatic,
  lubricator,
  frlUnit,
  airDryer,
  compressor,
  flowControlPneumatic,
  checkValvePneumatic,
  throttleValve as throttleValvePneumatic,
  quickExhaust,
  exhaustPneumatic,
  muffler,
  pressureGaugePneumatic,
  proximitySensor,
  pressureSensor,
  flowSensor,
  // Vacuum
  vacuumGenerator,
  vacuumPump,
  vacuumReservoir,
  suctionCup,
  vacuumFilter,
  vacuumSwitch,
  blowOffValve,
} from './pneumatic/pneumaticSymbols.ts';
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

// Pneumatic symbols
// Pneumatic Valves
symbolRegistry.set('VALVE_22_P', valve22WayPneumatic);
symbolRegistry.set('VALVE_32', valve32WayPneumatic);
symbolRegistry.set('VALVE_42_P', valve42WayPneumatic);
symbolRegistry.set('VALVE_52', valve52Way);
symbolRegistry.set('VALVE_53_CLOSED', valve53ClosedCenter);
symbolRegistry.set('VALVE_53_EXHAUST', valve53ExhaustCenter);
symbolRegistry.set('VALVE_53_PRESSURE', valve53PressureCenter);

// Pneumatic Actuators
symbolRegistry.set('CYL_SA', cylinderSingleActing);
symbolRegistry.set('CYL_DA', cylinderDoubleActing);
symbolRegistry.set('CYL_RODLESS', cylinderRodless);
symbolRegistry.set('CYL_TELESCOPIC_P', cylinderTelescopicPneumatic);
symbolRegistry.set('ROTARY_ACTUATOR', rotaryActuator);
symbolRegistry.set('MOTOR_PNEUMATIC', motorPneumatic);
symbolRegistry.set('GRIPPER_PARALLEL', gripperParallel);
symbolRegistry.set('GRIPPER_ANGULAR', gripperAngular);
symbolRegistry.set('GRIPPER_VACUUM', gripperVacuum);

// Pneumatic Accessories
symbolRegistry.set('AIR_SOURCE', airSource);
symbolRegistry.set('REGULATOR', pressureRegulator);
symbolRegistry.set('FILTER', filterPneumatic);
symbolRegistry.set('LUBRICATOR', lubricator);
symbolRegistry.set('FRL', frlUnit);
symbolRegistry.set('AIR_DRYER', airDryer);
symbolRegistry.set('COMPRESSOR', compressor);
symbolRegistry.set('FLOW_CONTROL', flowControlPneumatic);
symbolRegistry.set('CHECK_VALVE', checkValvePneumatic);
symbolRegistry.set('THROTTLE', throttleValvePneumatic);
symbolRegistry.set('QUICK_EXHAUST', quickExhaust);
symbolRegistry.set('EXHAUST', exhaustPneumatic);
symbolRegistry.set('MUFFLER', muffler);
symbolRegistry.set('GAUGE_P', pressureGaugePneumatic);
symbolRegistry.set('SENSOR_PROX', proximitySensor);
symbolRegistry.set('SENSOR_PRESS', pressureSensor);
symbolRegistry.set('FLOW_SENSOR', flowSensor);

// Vacuum Components
symbolRegistry.set('VACUUM_GENERATOR', vacuumGenerator);
symbolRegistry.set('VACUUM_PUMP', vacuumPump);
symbolRegistry.set('VACUUM_RESERVOIR', vacuumReservoir);
symbolRegistry.set('SUCTION_CUP', suctionCup);
symbolRegistry.set('VACUUM_FILTER', vacuumFilter);
symbolRegistry.set('VACUUM_SWITCH', vacuumSwitch);
symbolRegistry.set('BLOW_OFF', blowOffValve);

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

symbolRegistry.set('PUMP_GEAR', pumpGear);
symbolRegistry.set('PUMP_VANE', pumpVane);
symbolRegistry.set('PUMP_PISTON_AXIAL', pumpPistonAxial);
symbolRegistry.set('PUMP_PISTON_RADIAL', pumpPistonRadial);
symbolRegistry.set('PUMP_SCREW', pumpScrew);
symbolRegistry.set('PUMP_HAND', pumpHand);
symbolRegistry.set('PUMP_PISTON_VAR', pumpPistonVariable);

symbolRegistry.set('MOTOR_GEAR', motorGear);
symbolRegistry.set('MOTOR_VANE', motorVane);
symbolRegistry.set('MOTOR_PISTON_AXIAL', motorPistonAxial);
symbolRegistry.set('MOTOR_PISTON_RADIAL', motorPistonRadial);
symbolRegistry.set('MOTOR_ORBIT', motorOrbit);

symbolRegistry.set('VALVE_22', valve22Way);
symbolRegistry.set('VALVE_32_HYD', valve32WayHydraulic);
symbolRegistry.set('VALVE_42', valve42Way);
symbolRegistry.set('VALVE_43_CLOSED', valve43ClosedCenter);
symbolRegistry.set('VALVE_43_OPEN', valve43OpenCenter);
symbolRegistry.set('VALVE_43_TANDEM', valve43TandemCenter);
symbolRegistry.set('VALVE_43_FLOAT', valve43FloatCenter);
symbolRegistry.set('VALVE_PROPORTIONAL', valveProportional);
symbolRegistry.set('VALVE_SERVO', valveServo);

symbolRegistry.set('CYL_SINGLE_ROD', cylinderSingleRod);
symbolRegistry.set('CYL_DOUBLE_ROD', cylinderDoubleRod);
symbolRegistry.set('CYL_TELESCOPIC', cylinderTelescopic);
symbolRegistry.set('CYL_MILL', cylinderMill);
symbolRegistry.set('CYL_TIE_ROD', cylinderTieRod);
symbolRegistry.set('CYL_WELDED', cylinderWelded);
symbolRegistry.set('CYL_FEEDBACK', cylinderFeedback);

// Phase 2: Pressure Control Valves
symbolRegistry.set('RELIEF_DIRECT', reliefValveDirect);
symbolRegistry.set('RELIEF_PILOT', reliefValvePilot);
symbolRegistry.set('UNLOADING_VALVE', unloadingValve);
symbolRegistry.set('SEQUENCE_VALVE', sequenceValve);
symbolRegistry.set('COUNTERBALANCE_VALVE', counterbalanceValve);
symbolRegistry.set('BRAKE_VALVE', brakeValve);

// Phase 2: Flow Control Valves
symbolRegistry.set('THROTTLE_VALVE', throttleValve);
symbolRegistry.set('NEEDLE_VALVE', needleValve);
symbolRegistry.set('FLOW_COMPENSATED', flowCompensated);
symbolRegistry.set('FLOW_TEMP_COMP', flowTempCompensated);
symbolRegistry.set('PRIORITY_VALVE', priorityValve);
symbolRegistry.set('FLOW_DIVIDER', flowDivider);

// Phase 2: Check Valves
symbolRegistry.set('CHECK_PILOT', checkValvePilot);
symbolRegistry.set('SHUTTLE_VALVE', shuttleValve);
symbolRegistry.set('CHECK_PILOT_OPEN', checkValvePilotOpen);

// Phase 2: Rotary Actuators
symbolRegistry.set('ROTARY_VANE', rotaryActuatorVane);
symbolRegistry.set('ROTARY_PISTON', rotaryActuatorPiston);
symbolRegistry.set('RACK_PINION', rackPinionActuator);
symbolRegistry.set('HELICAL_ACTUATOR', helicalActuator);

// Phase 2: Accumulators
symbolRegistry.set('ACCUMULATOR_BLADDER', accumulatorBladder);
symbolRegistry.set('ACCUMULATOR_PISTON', accumulatorPiston);
symbolRegistry.set('ACCUMULATOR_DIAPHRAGM', accumulatorDiaphragm);
symbolRegistry.set('ACCUMULATOR_WEIGHT', accumulatorWeight);

// Phase 3: Filters
symbolRegistry.set('FILTER_SUCTION', filterSuction);
symbolRegistry.set('FILTER_PRESSURE', filterPressure);
symbolRegistry.set('FILTER_RETURN', filterReturn);
symbolRegistry.set('FILTER_OFFLINE', filterOffline);
symbolRegistry.set('FILTER_BREATHER', filterBreather);
symbolRegistry.set('FILTER_SPIN_ON', filterSpinOn);

// Phase 3: Heat Exchangers (Coolers)
symbolRegistry.set('COOLER_AIR', coolerAir);
symbolRegistry.set('COOLER_WATER', coolerWater);
symbolRegistry.set('COOLER_OIL_AIR', coolerOilAir);
symbolRegistry.set('COOLER_OIL_WATER', coolerOilWater);

// Phase 3: Manifolds
symbolRegistry.set('MANIFOLD_SANDWICH', manifoldSandwich);
symbolRegistry.set('MANIFOLD_MONOBLOCK', manifoldMonoblock);
symbolRegistry.set('MANIFOLD_MODULAR', manifoldModular);
symbolRegistry.set('MANIFOLD_CARTRIDGE', manifoldCartridge);
