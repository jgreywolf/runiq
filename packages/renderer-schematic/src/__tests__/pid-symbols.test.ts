/**
 * Tests for P&ID (Piping & Instrumentation Diagram) Symbols
 * Following ISA-5.1 and ISO 14617 standards
 *
 * @vitest
 */

import { describe, expect, it } from 'vitest';
import { pidSymbols } from '../pid-symbols.js';

describe('P&ID Symbols - Vessels & Tanks', () => {
  describe('vesselVertical', () => {
    it('should have correct id', () => {
      expect(pidSymbols.vesselVertical.id).toBe('VESSEL_V');
    });

    it('should have correct category', () => {
      expect(pidSymbols.vesselVertical.category).toBe('vessel');
    });

    it('should have correct dimensions', () => {
      expect(pidSymbols.vesselVertical.width).toBe(60);
      expect(pidSymbols.vesselVertical.height).toBe(100);
    });

    it('should have 4 terminals (top, bottom, left, right)', () => {
      expect(pidSymbols.vesselVertical.terminals).toHaveLength(4);
      expect(pidSymbols.vesselVertical.terminals[0].name).toBe('top');
      expect(pidSymbols.vesselVertical.terminals[1].name).toBe('bottom');
      expect(pidSymbols.vesselVertical.terminals[2].name).toBe('left');
      expect(pidSymbols.vesselVertical.terminals[3].name).toBe('right');
    });

    it('should render SVG with rect', () => {
      const svg = pidSymbols.vesselVertical.render(0, 0);
      expect(svg).toContain('<rect');
      expect(svg).toContain('stroke="currentColor"');
    });

    it('should render with label when provided', () => {
      const svg = pidSymbols.vesselVertical.render(0, 0, 'T-101');
      expect(svg).toContain('T-101');
      expect(svg).toContain('<text');
    });
  });

  describe('vesselHorizontal', () => {
    it('should have correct id', () => {
      expect(pidSymbols.vesselHorizontal.id).toBe('VESSEL_H');
    });

    it('should have correct dimensions', () => {
      expect(pidSymbols.vesselHorizontal.width).toBe(100);
      expect(pidSymbols.vesselHorizontal.height).toBe(60);
    });

    it('should have 4 terminals', () => {
      expect(pidSymbols.vesselHorizontal.terminals).toHaveLength(4);
    });

    it('should render with elliptical ends (ISA standard)', () => {
      const svg = pidSymbols.vesselHorizontal.render(0, 0);
      expect(svg).toContain('<ellipse');
      expect(svg).toContain('<line');
    });
  });

  describe('storageTank', () => {
    it('should have correct id', () => {
      expect(pidSymbols.storageTank.id).toBe('TANK_STORAGE');
    });

    it('should render with dished roof', () => {
      const svg = pidSymbols.storageTank.render(0, 0);
      expect(svg).toContain('<path'); // Dished roof is a path
      expect(svg).toContain('Q'); // Quadratic curve for dish
    });
  });
});

describe('P&ID Symbols - Pumps', () => {
  describe('pumpCentrifugal', () => {
    it('should have correct id', () => {
      expect(pidSymbols.pumpCentrifugal.id).toBe('PUMP_CENT');
    });

    it('should have correct category', () => {
      expect(pidSymbols.pumpCentrifugal.category).toBe('pump');
    });

    it('should be square-ish (50x50)', () => {
      expect(pidSymbols.pumpCentrifugal.width).toBe(50);
      expect(pidSymbols.pumpCentrifugal.height).toBe(50);
    });

    it('should have inlet and outlet terminals', () => {
      expect(pidSymbols.pumpCentrifugal.terminals).toHaveLength(2);
      expect(pidSymbols.pumpCentrifugal.terminals[0].name).toBe('inlet');
      expect(pidSymbols.pumpCentrifugal.terminals[1].name).toBe('outlet');
    });

    it('should render with circle (pump body)', () => {
      const svg = pidSymbols.pumpCentrifugal.render(0, 0);
      expect(svg).toContain('<circle');
      expect(svg).toContain('r="20"'); // 20px radius
    });

    it('should render with impeller indicator', () => {
      const svg = pidSymbols.pumpCentrifugal.render(0, 0);
      expect(svg).toContain('r="3"'); // Small center circle
    });
  });

  describe('pumpPositiveDisplacement', () => {
    it('should have correct id', () => {
      expect(pidSymbols.pumpPositiveDisplacement.id).toBe('PUMP_PD');
    });

    it('should render with filled semicircle (PD indicator)', () => {
      const svg = pidSymbols.pumpPositiveDisplacement.render(0, 0);
      expect(svg).toContain('<path');
      expect(svg).toContain('fill="currentColor"'); // Filled semicircle
    });
  });
});

describe('P&ID Symbols - Valves', () => {
  describe('valveGate', () => {
    it('should have correct id', () => {
      expect(pidSymbols.valveGate.id).toBe('VALVE_GATE');
    });

    it('should have correct category', () => {
      expect(pidSymbols.valveGate.category).toBe('valve');
    });

    it('should have inlet and outlet terminals', () => {
      expect(pidSymbols.valveGate.terminals).toHaveLength(2);
      expect(pidSymbols.valveGate.terminals[0].name).toBe('inlet');
      expect(pidSymbols.valveGate.terminals[1].name).toBe('outlet');
    });

    it('should render as triangle (ISA standard)', () => {
      const svg = pidSymbols.valveGate.render(0, 0);
      expect(svg).toContain('<path');
      expect(svg).toContain('Z'); // Closed path (triangle)
      expect(svg).toContain('fill="white"');
    });
  });

  describe('valveGlobe', () => {
    it('should have correct id', () => {
      expect(pidSymbols.valveGlobe.id).toBe('VALVE_GLOBE');
    });

    it('should render with circle and S-path', () => {
      const svg = pidSymbols.valveGlobe.render(0, 0);
      expect(svg).toContain('<circle');
      expect(svg).toContain('Q'); // Quadratic curve for S-path
    });
  });

  describe('valveBall', () => {
    it('should have correct id', () => {
      expect(pidSymbols.valveBall.id).toBe('VALVE_BALL');
    });

    it('should render with perpendicular line (ball indicator)', () => {
      const svg = pidSymbols.valveBall.render(0, 0);
      expect(svg).toContain('<circle');
      const lines = svg.match(/<line/g);
      expect(lines!.length).toBeGreaterThanOrEqual(3); // Inlet + outlet + indicator
    });
  });

  describe('valveCheck', () => {
    it('should have correct id', () => {
      expect(pidSymbols.valveCheck.id).toBe('VALVE_CHECK');
    });

    it('should render with triangle and flap indicator', () => {
      const svg = pidSymbols.valveCheck.render(0, 0);
      expect(svg).toContain('<path'); // Triangle
      expect(svg).toContain('r="2"'); // Small circle (flap)
    });
  });

  describe('valveControl', () => {
    it('should have correct id', () => {
      expect(pidSymbols.valveControl.id).toBe('VALVE_CONTROL');
    });

    it('should have 3 terminals (inlet, outlet, actuator)', () => {
      expect(pidSymbols.valveControl.terminals).toHaveLength(3);
      expect(pidSymbols.valveControl.terminals[2].name).toBe('actuator');
    });

    it('should be taller (to accommodate actuator)', () => {
      expect(pidSymbols.valveControl.height).toBe(50);
    });

    it('should render with actuator diamond on top', () => {
      const svg = pidSymbols.valveControl.render(0, 0);
      expect(svg).toContain('<path'); // Actuator diamond
      expect(svg).toContain('<circle'); // Valve body
    });
  });

  describe('valveSafetyRelief', () => {
    it('should have correct id', () => {
      expect(pidSymbols.valveSafetyRelief.id).toBe('VALVE_PSV');
    });

    it('should render with spring indicator', () => {
      const svg = pidSymbols.valveSafetyRelief.render(0, 0);
      const paths = svg.match(/<path/g);
      expect(paths!.length).toBeGreaterThanOrEqual(2); // Valve body + spring
    });

    it('should have angled outlet', () => {
      expect(pidSymbols.valveSafetyRelief.terminals[1].name).toBe('outlet');
      expect(pidSymbols.valveSafetyRelief.terminals[1].y).toBeLessThan(
        pidSymbols.valveSafetyRelief.terminals[0].y
      ); // Outlet higher than inlet
    });
  });
});

describe('P&ID Symbols - Heat Exchangers', () => {
  describe('heatExchangerShellTube', () => {
    it('should have correct id', () => {
      expect(pidSymbols.heatExchangerShellTube.id).toBe('HX_SHELL_TUBE');
    });

    it('should have correct category', () => {
      expect(pidSymbols.heatExchangerShellTube.category).toBe('heatExchanger');
    });

    it('should have 4 terminals (shell in/out, tube in/out)', () => {
      expect(pidSymbols.heatExchangerShellTube.terminals).toHaveLength(4);
      expect(pidSymbols.heatExchangerShellTube.terminals[0].name).toBe('shellIn');
      expect(pidSymbols.heatExchangerShellTube.terminals[1].name).toBe('shellOut');
      expect(pidSymbols.heatExchangerShellTube.terminals[2].name).toBe('tubeIn');
      expect(pidSymbols.heatExchangerShellTube.terminals[3].name).toBe('tubeOut');
    });

    it('should render with rectangle (shell) and circles (tube passes)', () => {
      const svg = pidSymbols.heatExchangerShellTube.render(0, 0);
      expect(svg).toContain('<rect');
      const circles = svg.match(/<circle/g);
      expect(circles!.length).toBe(2); // Two tube pass indicators
    });
  });

  describe('airCooler', () => {
    it('should have correct id', () => {
      expect(pidSymbols.airCooler.id).toBe('COOLER_AIR');
    });

    it('should render with fan on top', () => {
      const svg = pidSymbols.airCooler.render(0, 0);
      expect(svg).toContain('<circle'); // Fan
      const lines = svg.match(/<line/g);
      expect(lines!.length).toBeGreaterThanOrEqual(4); // Fin diagonals + fan blades
    });
  });
});

describe('P&ID Symbols - Instrumentation', () => {
  describe('flowTransmitter', () => {
    it('should have correct id', () => {
      expect(pidSymbols.flowTransmitter.id).toBe('FT');
    });

    it('should have correct category', () => {
      expect(pidSymbols.flowTransmitter.category).toBe('instrument');
    });

    it('should be 40x40 (standard instrument bubble)', () => {
      expect(pidSymbols.flowTransmitter.width).toBe(40);
      expect(pidSymbols.flowTransmitter.height).toBe(40);
    });

    it('should render with single circle (field mounted)', () => {
      const svg = pidSymbols.flowTransmitter.render(0, 0);
      const circles = svg.match(/<circle/g);
      expect(circles!.length).toBe(1); // Field mounted = single circle
    });

    it('should display tag text', () => {
      const svg = pidSymbols.flowTransmitter.render(0, 0, 'FT-101');
      expect(svg).toContain('FT-101');
    });

    it('should default to "FT" if no label provided', () => {
      const svg = pidSymbols.flowTransmitter.render(0, 0);
      expect(svg).toContain('FT');
    });
  });

  describe('temperatureTransmitter', () => {
    it('should have correct id', () => {
      expect(pidSymbols.temperatureTransmitter.id).toBe('TT');
    });

    it('should default to "TT" tag', () => {
      const svg = pidSymbols.temperatureTransmitter.render(0, 0);
      expect(svg).toContain('TT');
    });
  });

  describe('pressureTransmitter', () => {
    it('should have correct id', () => {
      expect(pidSymbols.pressureTransmitter.id).toBe('PT');
    });

    it('should default to "PT" tag', () => {
      const svg = pidSymbols.pressureTransmitter.render(0, 0);
      expect(svg).toContain('PT');
    });
  });

  describe('levelTransmitter', () => {
    it('should have correct id', () => {
      expect(pidSymbols.levelTransmitter.id).toBe('LT');
    });

    it('should default to "LT" tag', () => {
      const svg = pidSymbols.levelTransmitter.render(0, 0);
      expect(svg).toContain('LT');
    });
  });

  describe('flowIndicatorController', () => {
    it('should have correct id', () => {
      expect(pidSymbols.flowIndicatorController.id).toBe('FIC');
    });

    it('should have 2 terminals (process input and control output)', () => {
      expect(pidSymbols.flowIndicatorController.terminals).toHaveLength(2);
      expect(pidSymbols.flowIndicatorController.terminals[0].name).toBe('process');
      expect(pidSymbols.flowIndicatorController.terminals[1].name).toBe('output');
    });

    it('should render with double circle (panel mounted)', () => {
      const svg = pidSymbols.flowIndicatorController.render(0, 0);
      const circles = svg.match(/<circle/g);
      expect(circles!.length).toBe(2); // Panel mounted = double circle
    });
  });
});

describe('P&ID Symbol Library - Completeness', () => {
  it('should export 18 symbols total', () => {
    const symbolCount = Object.keys(pidSymbols).length;
    expect(symbolCount).toBe(18);
  });

  it('should have all vessel types', () => {
    expect(pidSymbols.vesselVertical).toBeDefined();
    expect(pidSymbols.vesselHorizontal).toBeDefined();
    expect(pidSymbols.storageTank).toBeDefined();
  });

  it('should have all pump types', () => {
    expect(pidSymbols.pumpCentrifugal).toBeDefined();
    expect(pidSymbols.pumpPositiveDisplacement).toBeDefined();
  });

  it('should have all valve types', () => {
    expect(pidSymbols.valveGate).toBeDefined();
    expect(pidSymbols.valveGlobe).toBeDefined();
    expect(pidSymbols.valveBall).toBeDefined();
    expect(pidSymbols.valveCheck).toBeDefined();
    expect(pidSymbols.valveControl).toBeDefined();
    expect(pidSymbols.valveSafetyRelief).toBeDefined();
  });

  it('should have all heat exchanger types', () => {
    expect(pidSymbols.heatExchangerShellTube).toBeDefined();
    expect(pidSymbols.airCooler).toBeDefined();
  });

  it('should have all instrument types', () => {
    expect(pidSymbols.flowTransmitter).toBeDefined();
    expect(pidSymbols.temperatureTransmitter).toBeDefined();
    expect(pidSymbols.pressureTransmitter).toBeDefined();
    expect(pidSymbols.levelTransmitter).toBeDefined();
    expect(pidSymbols.flowIndicatorController).toBeDefined();
  });
});

describe('ISA-5.1 Standard Compliance', () => {
  it('all instruments should use circle symbols', () => {
    const instruments = [
      pidSymbols.flowTransmitter,
      pidSymbols.temperatureTransmitter,
      pidSymbols.pressureTransmitter,
      pidSymbols.levelTransmitter,
      pidSymbols.flowIndicatorController,
    ];

    instruments.forEach((instrument) => {
      const svg = instrument.render(0, 0);
      expect(svg).toContain('<circle'); // ISA-5.1 requires circles for instruments
    });
  });

  it('field-mounted instruments should have single circle', () => {
    const fieldInstruments = [
      pidSymbols.flowTransmitter,
      pidSymbols.temperatureTransmitter,
      pidSymbols.pressureTransmitter,
      pidSymbols.levelTransmitter,
    ];

    fieldInstruments.forEach((instrument) => {
      const svg = instrument.render(0, 0);
      const circles = svg.match(/<circle/g);
      expect(circles!.length).toBe(1);
    });
  });

  it('panel-mounted instruments should have double circle', () => {
    const svg = pidSymbols.flowIndicatorController.render(0, 0);
    const circles = svg.match(/<circle/g);
    expect(circles!.length).toBe(2);
  });

  it('all valves should have inlet and outlet terminals', () => {
    const valves = [
      pidSymbols.valveGate,
      pidSymbols.valveGlobe,
      pidSymbols.valveBall,
      pidSymbols.valveCheck,
      pidSymbols.valveControl,
      pidSymbols.valveSafetyRelief,
    ];

    valves.forEach((valve) => {
      const terminalNames = valve.terminals.map((t) => t.name);
      expect(terminalNames).toContain('inlet');
      expect(terminalNames).toContain('outlet');
    });
  });
});
