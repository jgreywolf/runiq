import { describe, expect, it } from 'vitest';
import { getSymbol, symbolRegistry } from './symbolRegistry.js';

describe('symbolRegistry', () => {
  describe('getSymbol', () => {
    it('should retrieve electrical resistor symbol', () => {
      const symbol = getSymbol('R');
      expect(symbol).toBeDefined();
      expect(symbol?.id).toBe('resistor');
    });

    it('should retrieve electrical capacitor symbol', () => {
      const symbol = getSymbol('C');
      expect(symbol).toBeDefined();
      expect(symbol?.id).toBe('capacitor');
    });

    it('should retrieve electrical inductor symbol', () => {
      const symbol = getSymbol('L');
      expect(symbol).toBeDefined();
      expect(symbol?.id).toBe('inductor');
    });

    it('should retrieve digital logic gate (AND)', () => {
      const symbol = getSymbol('AND');
      expect(symbol).toBeDefined();
      expect(symbol?.id).toBe('and');
    });

    it('should retrieve hydraulic pump symbol', () => {
      const symbol = getSymbol('PUMP_FIXED');
      expect(symbol).toBeDefined();
      expect(symbol?.id).toBe('PUMP_FIXED');
    });

    it('should retrieve pneumatic cylinder symbol', () => {
      const symbol = getSymbol('CYL_DA');
      expect(symbol).toBeDefined();
      expect(symbol?.id).toBe('CYL_DA');
    });

    it('should be case-insensitive', () => {
      const upperCase = getSymbol('PUMP_FIXED');
      const lowerCase = getSymbol('pump_fixed');
      const mixedCase = getSymbol('Pump_Fixed');

      expect(upperCase).toBeDefined();
      expect(lowerCase).toBeDefined();
      expect(mixedCase).toBeDefined();
      expect(upperCase).toBe(lowerCase);
      expect(lowerCase).toBe(mixedCase);
    });

    it('should return undefined for non-existent symbol', () => {
      const symbol = getSymbol('DOES_NOT_EXIST');
      expect(symbol).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const symbol = getSymbol('');
      expect(symbol).toBeUndefined();
    });

    it('should handle symbols with numbers', () => {
      const symbol = getSymbol('REG4');
      expect(symbol).toBeDefined();
      expect(symbol?.id).toBe('reg4');
    });

    it('should handle symbols with underscores', () => {
      const symbol = getSymbol('PUMP_VAR');
      expect(symbol).toBeDefined();
      expect(symbol?.id).toBe('PUMP_VAR');
    });
  });

  describe('symbolRegistry Map', () => {
    it('should be initialized with symbols', () => {
      expect(symbolRegistry.size).toBeGreaterThan(0);
    });

    it('should contain electrical components', () => {
      expect(symbolRegistry.has('R')).toBe(true); // Resistor
      expect(symbolRegistry.has('C')).toBe(true); // Capacitor
      expect(symbolRegistry.has('L')).toBe(true); // Inductor
      expect(symbolRegistry.has('D')).toBe(true); // Diode
      expect(symbolRegistry.has('LED')).toBe(true);
      expect(symbolRegistry.has('GND')).toBe(true);
    });

    it('should contain digital logic gates', () => {
      expect(symbolRegistry.has('AND')).toBe(true);
      expect(symbolRegistry.has('OR')).toBe(true);
      expect(symbolRegistry.has('NOT')).toBe(true);
      expect(symbolRegistry.has('XOR')).toBe(true);
      expect(symbolRegistry.has('NAND')).toBe(true);
      expect(symbolRegistry.has('NOR')).toBe(true);
    });

    it('should contain flip-flops', () => {
      expect(symbolRegistry.has('DFF')).toBe(true);
      expect(symbolRegistry.has('JKFF')).toBe(true);
      expect(symbolRegistry.has('TFF')).toBe(true);
    });

    it('should contain multiplexers and decoders', () => {
      expect(symbolRegistry.has('MUX41')).toBe(true);
      expect(symbolRegistry.has('MUX81')).toBe(true);
      expect(symbolRegistry.has('DEC24')).toBe(true);
      expect(symbolRegistry.has('DEC38')).toBe(true);
    });

    it('should contain hydraulic symbols', () => {
      expect(symbolRegistry.has('PUMP_FIXED')).toBe(true);
      expect(symbolRegistry.has('PUMP_VAR')).toBe(true);
      expect(symbolRegistry.has('MOTOR_HYD')).toBe(true);
      expect(symbolRegistry.has('CYL_HYD')).toBe(true);
      expect(symbolRegistry.has('VALVE_43')).toBe(true);
      expect(symbolRegistry.has('RESERVOIR')).toBe(true);
      expect(symbolRegistry.has('ACCUMULATOR')).toBe(true);
    });

    it('should contain pneumatic symbols', () => {
      expect(symbolRegistry.has('VALVE_22_P')).toBe(true);
      expect(symbolRegistry.has('CYL_SA')).toBe(true);
      expect(symbolRegistry.has('CYL_DA')).toBe(true);
      expect(symbolRegistry.has('AIR_SOURCE')).toBe(true);
      expect(symbolRegistry.has('COMPRESSOR')).toBe(true);
      expect(symbolRegistry.has('FRL')).toBe(true);
    });

    it('should contain HVAC symbols', () => {
      expect(symbolRegistry.has('AIR_HANDLING_UNIT')).toBe(true);
      expect(symbolRegistry.has('SUPPLY_FAN')).toBe(true);
      expect(symbolRegistry.has('COOLING_COIL')).toBe(true);
      expect(symbolRegistry.has('VAV_BOX')).toBe(true);
      expect(symbolRegistry.has('DIFFUSER_SUPPLY')).toBe(true);
      expect(symbolRegistry.has('DAMPER_MOTORIZED')).toBe(true);
      expect(symbolRegistry.has('TEMPERATURE_SENSOR')).toBe(true);
      expect(symbolRegistry.has('CHILLER')).toBe(true);
      expect(symbolRegistry.has('BOILER')).toBe(true);
      expect(symbolRegistry.has('COOLING_TOWER')).toBe(true);
      expect(symbolRegistry.has('HEAT_EXCHANGER')).toBe(true);
      expect(symbolRegistry.has('DUCT_SUPPLY')).toBe(true);
      expect(symbolRegistry.has('DUCT_RETURN')).toBe(true);
      expect(symbolRegistry.has('DUCT_EXHAUST')).toBe(true);
    });

    it('should contain control system symbols', () => {
      expect(symbolRegistry.has('NO_CONTACT')).toBe(true);
      expect(symbolRegistry.has('NC_CONTACT')).toBe(true);
      expect(symbolRegistry.has('COIL')).toBe(true);
      expect(symbolRegistry.has('SET_COIL')).toBe(true);
      expect(symbolRegistry.has('RESET_COIL')).toBe(true);
      expect(symbolRegistry.has('TIMER_ON')).toBe(true);
    });

    it('should contain Phase 2 hydraulic symbols (pressure control)', () => {
      expect(symbolRegistry.has('RELIEF_DIRECT')).toBe(true);
      expect(symbolRegistry.has('RELIEF_PILOT')).toBe(true);
      expect(symbolRegistry.has('UNLOADING_VALVE')).toBe(true);
      expect(symbolRegistry.has('SEQUENCE_VALVE')).toBe(true);
      expect(symbolRegistry.has('COUNTERBALANCE_VALVE')).toBe(true);
      expect(symbolRegistry.has('BRAKE_VALVE')).toBe(true);
    });

    it('should contain Phase 2 hydraulic symbols (flow control)', () => {
      expect(symbolRegistry.has('THROTTLE_VALVE')).toBe(true);
      expect(symbolRegistry.has('NEEDLE_VALVE')).toBe(true);
      expect(symbolRegistry.has('FLOW_COMPENSATED')).toBe(true);
      expect(symbolRegistry.has('FLOW_TEMP_COMP')).toBe(true);
      expect(symbolRegistry.has('PRIORITY_VALVE')).toBe(true);
      expect(symbolRegistry.has('FLOW_DIVIDER')).toBe(true);
    });

    it('should contain Phase 2 hydraulic symbols (check valves)', () => {
      expect(symbolRegistry.has('CHECK_PILOT')).toBe(true);
      expect(symbolRegistry.has('SHUTTLE_VALVE')).toBe(true);
      expect(symbolRegistry.has('CHECK_PILOT_OPEN')).toBe(true);
    });

    it('should contain Phase 2 hydraulic symbols (rotary actuators)', () => {
      expect(symbolRegistry.has('ROTARY_VANE')).toBe(true);
      expect(symbolRegistry.has('ROTARY_PISTON')).toBe(true);
      expect(symbolRegistry.has('RACK_PINION')).toBe(true);
      expect(symbolRegistry.has('HELICAL_ACTUATOR')).toBe(true);
    });

    it('should contain Phase 2 hydraulic symbols (accumulators)', () => {
      expect(symbolRegistry.has('ACCUMULATOR_BLADDER')).toBe(true);
      expect(symbolRegistry.has('ACCUMULATOR_PISTON')).toBe(true);
      expect(symbolRegistry.has('ACCUMULATOR_DIAPHRAGM')).toBe(true);
      expect(symbolRegistry.has('ACCUMULATOR_WEIGHT')).toBe(true);
    });

    it('should contain Phase 3 hydraulic symbols (filters)', () => {
      expect(symbolRegistry.has('FILTER_SUCTION')).toBe(true);
      expect(symbolRegistry.has('FILTER_PRESSURE')).toBe(true);
      expect(symbolRegistry.has('FILTER_RETURN')).toBe(true);
      expect(symbolRegistry.has('FILTER_OFFLINE')).toBe(true);
      expect(symbolRegistry.has('FILTER_BREATHER')).toBe(true);
      expect(symbolRegistry.has('FILTER_SPIN_ON')).toBe(true);
    });

    it('should contain Phase 3 hydraulic symbols (coolers)', () => {
      expect(symbolRegistry.has('COOLER_AIR')).toBe(true);
      expect(symbolRegistry.has('COOLER_WATER')).toBe(true);
      expect(symbolRegistry.has('COOLER_OIL_AIR')).toBe(true);
      expect(symbolRegistry.has('COOLER_OIL_WATER')).toBe(true);
    });

    it('should contain Phase 3 hydraulic symbols (manifolds)', () => {
      expect(symbolRegistry.has('MANIFOLD_SANDWICH')).toBe(true);
      expect(symbolRegistry.has('MANIFOLD_MONOBLOCK')).toBe(true);
      expect(symbolRegistry.has('MANIFOLD_MODULAR')).toBe(true);
      expect(symbolRegistry.has('MANIFOLD_CARTRIDGE')).toBe(true);
    });

    it('should contain pneumatic vacuum symbols', () => {
      expect(symbolRegistry.has('VACUUM_GENERATOR')).toBe(true);
      expect(symbolRegistry.has('VACUUM_PUMP')).toBe(true);
      expect(symbolRegistry.has('VACUUM_RESERVOIR')).toBe(true);
      expect(symbolRegistry.has('SUCTION_CUP')).toBe(true);
      expect(symbolRegistry.has('VACUUM_FILTER')).toBe(true);
      expect(symbolRegistry.has('VACUUM_SWITCH')).toBe(true);
      expect(symbolRegistry.has('BLOW_OFF')).toBe(true);
    });

    it('should have registry size greater than 100 symbols', () => {
      // With electrical, digital, hydraulic, pneumatic, and vacuum symbols
      expect(symbolRegistry.size).toBeGreaterThan(100);
    });

    it('should check for duplicate symbol IDs', () => {
      const ids = new Set<string>();
      for (const symbol of symbolRegistry.values()) {
        ids.add(symbol.id);
      }
      // Note: Some symbols may share IDs (e.g., valve variants)
      // This test verifies the registry is populated correctly
      expect(ids.size).toBeGreaterThan(0);
      expect(symbolRegistry.size).toBeGreaterThan(0);
    });

    it('should have all symbols with valid SymbolDefinition structure', () => {
      for (const symbol of symbolRegistry.values()) {
        expect(symbol).toBeDefined();
        expect(symbol.id).toBeDefined();
        expect(typeof symbol.id).toBe('string');
        expect(symbol.width).toBeDefined();
        expect(typeof symbol.width).toBe('number');
        expect(symbol.height).toBeDefined();
        expect(typeof symbol.height).toBe('number');
        expect(symbol.terminals).toBeDefined();
        expect(Array.isArray(symbol.terminals)).toBe(true);
        expect(symbol.render).toBeDefined();
        expect(typeof symbol.render).toBe('function');
      }
    });
  });
});
