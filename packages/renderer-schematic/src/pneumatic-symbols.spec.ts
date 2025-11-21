/**
 * Tests for ISO 1219 Pneumatic & Hydraulic Symbols
 * Following ISO 1219-1:2012 (Pneumatic) and ISO 1219-2:2012 (Hydraulic)
 *
 * @vitest
 */

import { describe, expect, it } from 'vitest';
import {
  // Pneumatic symbols (12)
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
} from './pneumaticSymbols.js';

describe('ISO 1219-1 Pneumatic Symbols', () => {
  describe('cylinderSingleActing', () => {
    it('should have correct id', () => {
      expect(cylinderSingleActing.id).toBe('CYL_SA');
    });

    it('should have correct dimensions', () => {
      expect(cylinderSingleActing.width).toBe(60);
      expect(cylinderSingleActing.height).toBe(30);
    });

    it('should have 3 terminals', () => {
      expect(cylinderSingleActing.terminals).toHaveLength(3);
      expect(cylinderSingleActing.terminals[0].name).toBe('piston');
      expect(cylinderSingleActing.terminals[1].name).toBe('port_A');
      expect(cylinderSingleActing.terminals[2].name).toBe('exhaust');
    });

    it('should render valid SVG', () => {
      const svg = cylinderSingleActing.render(0, 0);
      expect(svg).toContain('<rect');
      expect(svg).toContain('piston rod');
      expect(svg).toContain('spring'); // Spring return indicator
    });
  });

  describe('cylinderDoubleActing', () => {
    it('should have correct id', () => {
      expect(cylinderDoubleActing.id).toBe('CYL_DA');
    });

    it('should have correct dimensions', () => {
      expect(cylinderDoubleActing.width).toBe(60);
      expect(cylinderDoubleActing.height).toBe(30);
    });

    it('should have 3 terminals (piston, port_A, port_B)', () => {
      expect(cylinderDoubleActing.terminals).toHaveLength(3);
      expect(cylinderDoubleActing.terminals[0].name).toBe('piston');
      expect(cylinderDoubleActing.terminals[1].name).toBe('port_A');
      expect(cylinderDoubleActing.terminals[2].name).toBe('port_B');
    });

    it('should render valid SVG without spring', () => {
      const svg = cylinderDoubleActing.render(0, 0);
      expect(svg).toContain('<rect');
      expect(svg).toContain('piston rod');
      expect(svg).not.toContain('spring'); // No spring return
    });
  });

  describe('valve32Way', () => {
    it('should have correct id', () => {
      expect(valve32Way.id).toBe('VALVE_32');
    });

    it('should have correct dimensions', () => {
      expect(valve32Way.width).toBe(40);
      expect(valve32Way.height).toBe(50);
    });

    it('should have 3 terminals (P, A, R)', () => {
      expect(valve32Way.terminals).toHaveLength(3);
      const names = valve32Way.terminals.map((t) => t.name);
      expect(names).toContain('P'); // Pressure
      expect(names).toContain('A'); // Output
      expect(names).toContain('R'); // Exhaust/Return
    });

    it('should render 2 position boxes', () => {
      const svg = valve32Way.render(0, 0);
      expect(svg).toContain('<rect');
      // Should have 2 boxes for 2 positions
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBeGreaterThanOrEqual(2);
    });
  });

  describe('valve52Way', () => {
    it('should have correct id', () => {
      expect(valve52Way.id).toBe('VALVE_52');
    });

    it('should have correct dimensions', () => {
      expect(valve52Way.width).toBe(60);
      expect(valve52Way.height).toBe(50);
    });

    it('should have 5 terminals (P, A, B, R, S)', () => {
      expect(valve52Way.terminals).toHaveLength(5);
      const names = valve52Way.terminals.map((t) => t.name);
      expect(names).toContain('P'); // Pressure
      expect(names).toContain('A'); // Output A
      expect(names).toContain('B'); // Output B
      expect(names).toContain('R'); // Exhaust 1
      expect(names).toContain('S'); // Exhaust 2
    });

    it('should render 2 position boxes', () => {
      const svg = valve52Way.render(0, 0);
      expect(svg).toContain('<rect');
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBeGreaterThanOrEqual(2);
    });
  });

  describe('airSource', () => {
    it('should have correct id', () => {
      expect(airSource.id).toBe('AIR_SOURCE');
    });

    it('should have correct dimensions', () => {
      expect(airSource.width).toBe(40);
      expect(airSource.height).toBe(40);
    });

    it('should have 1 terminal (out)', () => {
      expect(airSource.terminals).toHaveLength(1);
      expect(airSource.terminals[0].name).toBe('out');
    });

    it('should render circle with pressure triangle', () => {
      const svg = airSource.render(0, 0);
      expect(svg).toContain('<circle');
      expect(svg).toContain('<polygon'); // Triangle for pressure symbol
    });
  });

  describe('pressureRegulator', () => {
    it('should have correct id', () => {
      expect(pressureRegulator.id).toBe('REGULATOR');
    });

    it('should have correct dimensions', () => {
      expect(pressureRegulator.width).toBe(50);
      expect(pressureRegulator.height).toBe(50);
    });

    it('should have 2 terminals (in, out)', () => {
      expect(pressureRegulator.terminals).toHaveLength(2);
      expect(pressureRegulator.terminals[0].name).toBe('in');
      expect(pressureRegulator.terminals[1].name).toBe('out');
    });

    it('should render with spring adjustment symbol', () => {
      const svg = pressureRegulator.render(0, 0);
      expect(svg).toContain('spring');
      expect(svg).toContain('<line'); // Flow path
    });
  });

  describe('filterPneumatic', () => {
    it('should have correct id', () => {
      expect(filterPneumatic.id).toBe('FILTER');
    });

    it('should have correct dimensions', () => {
      expect(filterPneumatic.width).toBe(40);
      expect(filterPneumatic.height).toBe(40);
    });

    it('should have 2 terminals (in, out)', () => {
      expect(filterPneumatic.terminals).toHaveLength(2);
      expect(filterPneumatic.terminals[0].name).toBe('in');
      expect(filterPneumatic.terminals[1].name).toBe('out');
    });

    it('should render diamond with mesh pattern', () => {
      const svg = filterPneumatic.render(0, 0);
      expect(svg).toContain('<polygon'); // Diamond shape
      expect(svg).toContain('<line'); // Mesh pattern
    });
  });

  describe('lubricator', () => {
    it('should have correct id', () => {
      expect(lubricator.id).toBe('LUBRICATOR');
    });

    it('should have correct dimensions', () => {
      expect(lubricator.width).toBe(40);
      expect(lubricator.height).toBe(50);
    });

    it('should have 2 terminals (in, out)', () => {
      expect(lubricator.terminals).toHaveLength(2);
      expect(lubricator.terminals[0].name).toBe('in');
      expect(lubricator.terminals[1].name).toBe('out');
    });

    it('should render circle with droplet symbol', () => {
      const svg = lubricator.render(0, 0);
      expect(svg).toContain('<circle'); // Reservoir
      expect(svg).toContain('droplet'); // Oil droplet indicator
    });
  });

  describe('flowControlPneumatic', () => {
    it('should have correct id', () => {
      expect(flowControlPneumatic.id).toBe('FLOW_CONTROL');
    });

    it('should have correct dimensions', () => {
      expect(flowControlPneumatic.width).toBe(40);
      expect(flowControlPneumatic.height).toBe(40);
    });

    it('should have 2 terminals (in, out)', () => {
      expect(flowControlPneumatic.terminals).toHaveLength(2);
      expect(flowControlPneumatic.terminals[0].name).toBe('in');
      expect(flowControlPneumatic.terminals[1].name).toBe('out');
    });

    it('should render diamond with adjustable arrow', () => {
      const svg = flowControlPneumatic.render(0, 0);
      expect(svg).toContain('<polygon'); // Diamond
      expect(svg).toContain('<path'); // Arrow with adjustment
    });
  });

  describe('checkValvePneumatic', () => {
    it('should have correct id', () => {
      expect(checkValvePneumatic.id).toBe('CHECK_VALVE');
    });

    it('should have correct dimensions', () => {
      expect(checkValvePneumatic.width).toBe(40);
      expect(checkValvePneumatic.height).toBe(30);
    });

    it('should have 2 terminals (in, out)', () => {
      expect(checkValvePneumatic.terminals).toHaveLength(2);
      expect(checkValvePneumatic.terminals[0].name).toBe('in');
      expect(checkValvePneumatic.terminals[1].name).toBe('out');
    });

    it('should render circle with ball and seat', () => {
      const svg = checkValvePneumatic.render(0, 0);
      expect(svg).toContain('<circle');
      expect(svg).toContain('<polygon'); // Seat triangle
    });
  });

  describe('exhaustPneumatic', () => {
    it('should have correct id', () => {
      expect(exhaustPneumatic.id).toBe('EXHAUST');
    });

    it('should have correct dimensions', () => {
      expect(exhaustPneumatic.width).toBe(30);
      expect(exhaustPneumatic.height).toBe(30);
    });

    it('should have 1 terminal (in)', () => {
      expect(exhaustPneumatic.terminals).toHaveLength(1);
      expect(exhaustPneumatic.terminals[0].name).toBe('in');
    });

    it('should render triangle with exhaust lines', () => {
      const svg = exhaustPneumatic.render(0, 0);
      expect(svg).toContain('<polygon'); // Triangle
      expect(svg).toContain('<line'); // Exhaust indicator lines
    });
  });

  describe('pressureGaugePneumatic', () => {
    it('should have correct id', () => {
      expect(pressureGaugePneumatic.id).toBe('GAUGE_P');
    });

    it('should have correct dimensions', () => {
      expect(pressureGaugePneumatic.width).toBe(30);
      expect(pressureGaugePneumatic.height).toBe(30);
    });

    it('should have 1 terminal (in)', () => {
      expect(pressureGaugePneumatic.terminals).toHaveLength(1);
      expect(pressureGaugePneumatic.terminals[0].name).toBe('in');
    });

    it('should render circle with P label', () => {
      const svg = pressureGaugePneumatic.render(0, 0);
      expect(svg).toContain('<circle');
      expect(svg).toContain('>P<'); // Pressure label
    });
  });
});

describe('Symbol Integration', () => {
  it('all pneumatic symbols should be exportable', () => {
    expect(cylinderSingleActing).toBeDefined();
    expect(cylinderDoubleActing).toBeDefined();
    expect(valve32Way).toBeDefined();
    expect(valve52Way).toBeDefined();
    expect(airSource).toBeDefined();
    expect(pressureRegulator).toBeDefined();
    expect(filterPneumatic).toBeDefined();
    expect(lubricator).toBeDefined();
    expect(flowControlPneumatic).toBeDefined();
    expect(checkValvePneumatic).toBeDefined();
    expect(exhaustPneumatic).toBeDefined();
    expect(pressureGaugePneumatic).toBeDefined();
  });

  it('all symbols should have valid SVG output', () => {
    const allSymbols = [
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
