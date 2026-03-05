/**
 * Tests for ISO 1219 Hydraulic Symbols
 * Following ISO 1219-2:2012 (Hydraulic)
 *
 * @vitest
 */

import { describe, expect, it } from 'vitest';
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
} from './hydraulicSymbols.js';

describe('ISO 1219-2 Hydraulic Symbols', () => {
  describe('pumpFixed', () => {
    it('should have correct id', () => {
      expect(pumpFixed.id).toBe('PUMP_FIXED');
    });

    it('should have correct dimensions', () => {
      expect(pumpFixed.width).toBe(50);
      expect(pumpFixed.height).toBe(50);
    });

    it('should have 2 terminals (in, out)', () => {
      expect(pumpFixed.terminals).toHaveLength(2);
      expect(pumpFixed.terminals[0].name).toBe('in');
      expect(pumpFixed.terminals[1].name).toBe('out');
    });

    it('should render circle with fixed displacement arrow', () => {
      const svg = pumpFixed.render(0, 0);
      expect(svg).toContain('<circle');
      expect(svg).toContain('<polygon'); // Solid triangle (fixed)
      expect(svg).toContain('<path'); // Arrow
    });
  });

  describe('pumpVariable', () => {
    it('should have correct id', () => {
      expect(pumpVariable.id).toBe('PUMP_VAR');
    });

    it('should have correct dimensions', () => {
      expect(pumpVariable.width).toBe(50);
      expect(pumpVariable.height).toBe(50);
    });

    it('should have 3 terminals (in, out, control)', () => {
      expect(pumpVariable.terminals).toHaveLength(3);
      expect(pumpVariable.terminals[0].name).toBe('in');
      expect(pumpVariable.terminals[1].name).toBe('out');
      expect(pumpVariable.terminals[2].name).toBe('control');
    });

    it('should render circle with variable displacement indicator', () => {
      const svg = pumpVariable.render(0, 0);
      expect(svg).toContain('<circle');
      expect(svg).toContain('<line'); // Diagonal line (variable)
      expect(svg).toContain('<path'); // Arrow
    });
  });

  describe('motorHydraulic', () => {
    it('should have correct id', () => {
      expect(motorHydraulic.id).toBe('MOTOR_HYD');
    });

    it('should have correct dimensions', () => {
      expect(motorHydraulic.width).toBe(50);
      expect(motorHydraulic.height).toBe(50);
    });

    it('should have 3 terminals (in, out, shaft)', () => {
      expect(motorHydraulic.terminals).toHaveLength(3);
      expect(motorHydraulic.terminals[0].name).toBe('in');
      expect(motorHydraulic.terminals[1].name).toBe('out');
      expect(motorHydraulic.terminals[2].name).toBe('shaft');
    });

    it('should render circle with motor arrow and shaft', () => {
      const svg = motorHydraulic.render(0, 0);
      expect(svg).toContain('<circle');
      expect(svg).toContain('<path'); // Arrow
      expect(svg).toContain('shaft'); // Shaft line
    });
  });

  describe('cylinderHydraulic', () => {
    it('should have correct id', () => {
      expect(cylinderHydraulic.id).toBe('CYL_HYD');
    });

    it('should have correct dimensions', () => {
      expect(cylinderHydraulic.width).toBe(60);
      expect(cylinderHydraulic.height).toBe(30);
    });

    it('should have 3 terminals (piston, port_A, port_B)', () => {
      expect(cylinderHydraulic.terminals).toHaveLength(3);
      expect(cylinderHydraulic.terminals[0].name).toBe('piston');
      expect(cylinderHydraulic.terminals[1].name).toBe('port_A');
      expect(cylinderHydraulic.terminals[2].name).toBe('port_B');
    });

    it('should render with thicker lines than pneumatic', () => {
      const svg = cylinderHydraulic.render(0, 0);
      expect(svg).toContain('<rect');
      expect(svg).toContain('stroke-width="2.5"'); // Thicker for hydraulic
    });
  });

  describe('valve43Way', () => {
    it('should have correct id', () => {
      expect(valve43Way.id).toBe('VALVE_43');
    });

    it('should have correct dimensions', () => {
      expect(valve43Way.width).toBe(70);
      expect(valve43Way.height).toBe(50);
    });

    it('should have 4 terminals (P, A, B, T)', () => {
      expect(valve43Way.terminals).toHaveLength(4);
      const names = valve43Way.terminals.map((t) => t.name);
      expect(names).toContain('P'); // Pressure
      expect(names).toContain('A'); // Output A
      expect(names).toContain('B'); // Output B
      expect(names).toContain('T'); // Tank
    });

    it('should render 3 position boxes', () => {
      const svg = valve43Way.render(0, 0);
      expect(svg).toContain('<rect');
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBeGreaterThanOrEqual(3);
    });
  });

  describe('pressureReliefValve', () => {
    it('should have correct id', () => {
      expect(pressureReliefValve.id).toBe('RELIEF_VALVE');
    });

    it('should have correct dimensions', () => {
      expect(pressureReliefValve.width).toBe(40);
      expect(pressureReliefValve.height).toBe(40);
      expect(pressureReliefValve.height).toBe(40);
    });

    it('should have 2 terminals (in, out)', () => {
      expect(pressureReliefValve.terminals).toHaveLength(2);
      expect(pressureReliefValve.terminals[0].name).toBe('in');
      expect(pressureReliefValve.terminals[1].name).toBe('out');
      expect(pressureReliefValve.terminals[1].name).toBe('out');
    });

    it('should render with spring and adjustment', () => {
      const svg = pressureReliefValve.render(0, 0);
      expect(svg).toContain('<!-- Spring symbol');
      expect(svg).toContain('<path'); // Flow path
    });
  });

  describe('pressureReducingValve', () => {
    it('should have correct id', () => {
      expect(pressureReducingValve.id).toBe('REDUCING_VALVE');
    });

    it('should have correct dimensions', () => {
      expect(pressureReducingValve.width).toBe(40);
      expect(pressureReducingValve.height).toBe(40);
      expect(pressureReducingValve.height).toBe(40);
    });

    it('should have 2 terminals (in, out)', () => {
      expect(pressureReducingValve.terminals).toHaveLength(2);
      expect(pressureReducingValve.terminals[0].name).toBe('in');
      expect(pressureReducingValve.terminals[1].name).toBe('out');
    });

    it('should render with spring and pilot line', () => {
      const svg = pressureReducingValve.render(0, 0);
      expect(svg).toContain('<!-- Spring symbol');
      expect(svg).toContain('<path'); // Spring path
    });
  });

  describe('flowControlHydraulic', () => {
    it('should have correct id', () => {
      expect(flowControlHydraulic.id).toBe('FLOW_CONTROL_HYD');
    });

    it('should have correct dimensions', () => {
      expect(flowControlHydraulic.width).toBe(40);
      expect(flowControlHydraulic.height).toBe(40);
    });

    it('should have 2 terminals (in, out)', () => {
      expect(flowControlHydraulic.terminals).toHaveLength(2);
      expect(flowControlHydraulic.terminals[0].name).toBe('in');
      expect(flowControlHydraulic.terminals[1].name).toBe('out');
    });

    it('should render diamond with adjustable orifice', () => {
      const svg = flowControlHydraulic.render(0, 0);
      expect(svg).toContain('<polygon'); // Diamond body
      expect(svg).toContain('<line'); // Variable orifice
    });
  });

  describe('checkValveHydraulic', () => {
    it('should have correct id', () => {
      expect(checkValveHydraulic.id).toBe('CHECK_VALVE_HYD');
    });

    it('should have correct dimensions', () => {
      expect(checkValveHydraulic.width).toBe(40);
      expect(checkValveHydraulic.height).toBe(40);
      expect(checkValveHydraulic.height).toBe(40);
    });

    it('should have 2 terminals (in, out)', () => {
      expect(checkValveHydraulic.terminals).toHaveLength(2);
      expect(checkValveHydraulic.terminals[0].name).toBe('in');
      expect(checkValveHydraulic.terminals[1].name).toBe('out');
    });

    it('should render with ball and seat', () => {
      const svg = checkValveHydraulic.render(0, 0);
      expect(svg).toContain('<circle');
      expect(svg).toContain('<polygon'); // Check valve triangle
      expect(svg).toContain('<polygon'); // Check valve triangle
    });

    describe('filterHydraulic', () => {
      it('should have correct id', () => {
        expect(filterHydraulic.id).toBe('FILTER_HYD');
      });

      it('should have correct dimensions', () => {
        expect(filterHydraulic.width).toBe(40);
        expect(filterHydraulic.height).toBe(40);
      });

      it('should have 2 terminals (in, out)', () => {
        expect(filterHydraulic.terminals).toHaveLength(2);
        expect(filterHydraulic.terminals[0].name).toBe('in');
        expect(filterHydraulic.terminals[1].name).toBe('out');
      });

      it('should render with thicker lines than pneumatic', () => {
        const svg = filterHydraulic.render(0, 0);
        expect(svg).toContain('<polygon'); // Diamond
        expect(svg).toContain('stroke-width="2.5"'); // Thicker
      });
    });

    describe('reservoir', () => {
      it('should have correct id', () => {
        expect(reservoir.id).toBe('RESERVOIR');
      });

      it('should have correct dimensions', () => {
        expect(reservoir.width).toBe(50);
        expect(reservoir.height).toBe(60);
      });

      it('should have 3 terminals (return, suction, vent)', () => {
        expect(reservoir.terminals).toHaveLength(3);
        expect(reservoir.terminals[0].name).toBe('return');
        expect(reservoir.terminals[1].name).toBe('suction');
        expect(reservoir.terminals[2].name).toBe('vent');
      });

      it('should render tank with fluid level', () => {
        const svg = reservoir.render(0, 0);
        expect(svg).toContain('<rect'); // Tank body
        expect(svg).toContain('fluid level'); // Fluid indicator
      });
    });

    describe('accumulator', () => {
      it('should have correct id', () => {
        expect(accumulator.id).toBe('ACCUMULATOR');
      });

      it('should have correct dimensions', () => {
        expect(accumulator.width).toBe(40);
        expect(accumulator.height).toBe(50);
      });

      it('should have 1 terminal (in)', () => {
        expect(accumulator.terminals).toHaveLength(1);
        expect(accumulator.terminals[0].name).toBe('in');
      });

      it('should render cylinder with gas symbol', () => {
        const svg = accumulator.render(0, 0);
        expect(svg).toContain('<rect'); // Cylinder
        expect(svg).toContain('N2'); // Gas charge indicator
        expect(svg).toContain('<line'); // Dividing line (piston/bladder)
      });
    });

    describe('pressureGaugeHydraulic', () => {
      it('should have correct id', () => {
        expect(pressureGaugeHydraulic.id).toBe('GAUGE_P_HYD');
      });

      it('should have correct dimensions', () => {
        expect(pressureGaugeHydraulic.width).toBe(30);
        expect(pressureGaugeHydraulic.height).toBe(30);
      });

      it('should have 1 terminal (in)', () => {
        expect(pressureGaugeHydraulic.terminals).toHaveLength(1);
        expect(pressureGaugeHydraulic.terminals[0].name).toBe('in');
      });

      it('should render circle with P label', () => {
        const svg = pressureGaugeHydraulic.render(0, 0);
        expect(svg).toContain('<circle');
        expect(svg).toContain('>P<'); // Pressure label
      });
    });
  });

  describe('Symbol Integration', () => {
    it('all hydraulic symbols should be exportable', () => {
      expect(pumpFixed).toBeDefined();
      expect(pumpVariable).toBeDefined();
      expect(motorHydraulic).toBeDefined();
      expect(cylinderHydraulic).toBeDefined();
      expect(valve43Way).toBeDefined();
      expect(pressureReliefValve).toBeDefined();
      expect(pressureReducingValve).toBeDefined();
      expect(flowControlHydraulic).toBeDefined();
      expect(checkValveHydraulic).toBeDefined();
      expect(filterHydraulic).toBeDefined();
      expect(reservoir).toBeDefined();
      expect(accumulator).toBeDefined();
      expect(pressureGaugeHydraulic).toBeDefined();
    });

    it('all symbols should have valid SVG output', () => {
      const allSymbols = [
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
      ];

      allSymbols.forEach((symbol) => {
        const svg = symbol.render(0, 0);
        expect(svg).toBeTruthy();
        expect(svg.length).toBeGreaterThan(0);
        // Should contain SVG elements (allow HTML comments)
        expect(svg).toMatch(/<(rect|circle|polygon|line|path|text|g)/);
      });
    });
  });
});
