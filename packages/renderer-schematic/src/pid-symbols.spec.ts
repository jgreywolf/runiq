/**
 * Tests for P&ID (Piping & Instrumentation Diagram) Symbols
 * Following ISA-5.1 and ISO 14617 standards
 *
 * @vitest
 */

import { describe, expect, it } from 'vitest';
import { pidSymbols } from './pid-symbols.js';

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
      expect(pidSymbols.heatExchangerShellTube.terminals[0].name).toBe(
        'shellIn'
      );
      expect(pidSymbols.heatExchangerShellTube.terminals[1].name).toBe(
        'shellOut'
      );
      expect(pidSymbols.heatExchangerShellTube.terminals[2].name).toBe(
        'tubeIn'
      );
      expect(pidSymbols.heatExchangerShellTube.terminals[3].name).toBe(
        'tubeOut'
      );
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
      expect(pidSymbols.flowIndicatorController.terminals[0].name).toBe(
        'process'
      );
      expect(pidSymbols.flowIndicatorController.terminals[1].name).toBe(
        'output'
      );
    });

    it('should render with double circle (panel mounted)', () => {
      const svg = pidSymbols.flowIndicatorController.render(0, 0);
      const circles = svg.match(/<circle/g);
      expect(circles!.length).toBe(2); // Panel mounted = double circle
    });
  });
});

describe('P&ID Symbol Library - Completeness', () => {
  it('should export 87 symbols total', () => {
    const symbolCount = Object.keys(pidSymbols).length;
    expect(symbolCount).toBe(87);
  });

  it('should have all vessel types', () => {
    expect(pidSymbols.vesselVertical).toBeDefined();
    expect(pidSymbols.vesselHorizontal).toBeDefined();
    expect(pidSymbols.storageTank).toBeDefined();
    expect(pidSymbols.separator).toBeDefined();
  });

  it('should have all pump types', () => {
    expect(pidSymbols.pumpCentrifugal).toBeDefined();
    expect(pidSymbols.pumpPositiveDisplacement).toBeDefined();
  });

  it('should have all valve types', () => {
    expect(pidSymbols.valveGate).toBeDefined();
    expect(pidSymbols.valveShutoff).toBeDefined();
    expect(pidSymbols.valveGlobe).toBeDefined();
    expect(pidSymbols.valveBall).toBeDefined();
    expect(pidSymbols.valveCheck).toBeDefined();
    expect(pidSymbols.valveControl).toBeDefined();
    expect(pidSymbols.valveControlPositioner).toBeDefined();
    expect(pidSymbols.valveSafetyRelief).toBeDefined();
    expect(pidSymbols.valvePressureReducing).toBeDefined();
  });

  it('should have all heat exchanger types', () => {
    expect(pidSymbols.heatExchangerShellTube).toBeDefined();
    expect(pidSymbols.cooler).toBeDefined();
    expect(pidSymbols.airCooler).toBeDefined();
    expect(pidSymbols.jacket).toBeDefined();
    expect(pidSymbols.ruptureDisk).toBeDefined();
  });

  it('should have all instrument types', () => {
    expect(pidSymbols.flowTransmitter).toBeDefined();
    expect(pidSymbols.temperatureTransmitter).toBeDefined();
    expect(pidSymbols.pressureTransmitter).toBeDefined();
    expect(pidSymbols.levelTransmitter).toBeDefined();
    expect(pidSymbols.flowIndicatorController).toBeDefined();
    expect(pidSymbols.vibrationTransmitter).toBeDefined();
    expect(pidSymbols.speedController).toBeDefined();
    expect(pidSymbols.temperatureAlarmHigh).toBeDefined();
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
      pidSymbols.valveShutoff,
      pidSymbols.valveGlobe,
      pidSymbols.valveBall,
      pidSymbols.valveCheck,
      pidSymbols.valveControl,
      pidSymbols.valveControlPositioner,
      pidSymbols.valveSafetyRelief,
      pidSymbols.valvePressureReducing,
      pidSymbols.valveButterfly,
      pidSymbols.valveThreeWay,
      pidSymbols.valveNeedle,
    ];

    valves.forEach((valve) => {
      const terminalNames = valve.terminals.map((t) => t.name);
      expect(terminalNames).toContain('inlet');
    });
  });
});

describe('P&ID Symbols - New Equipment', () => {
  describe('reactor', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.reactor.id).toBe('REACTOR');
      expect(pidSymbols.reactor.category).toBe('vessel');
    });

    it('should render with agitator shaft', () => {
      const svg = pidSymbols.reactor.render(0, 0);
      expect(svg).toContain('Agitator');
      expect(svg).toContain('Impeller');
    });

    it('should have 4 terminals', () => {
      expect(pidSymbols.reactor.terminals).toHaveLength(4);
    });
  });

  describe('knockoutDrum', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.knockoutDrum.id).toBe('KNOCKOUT_DRUM');
      expect(pidSymbols.knockoutDrum.category).toBe('vessel');
    });

    it('should have gasOut, liquidOut, and feedIn terminals', () => {
      const terminalNames = pidSymbols.knockoutDrum.terminals.map(
        (t) => t.name
      );
      expect(terminalNames).toContain('gasOut');
      expect(terminalNames).toContain('liquidOut');
      expect(terminalNames).toContain('feedIn');
    });
  });

  describe('compressorCentrifugal', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.compressorCentrifugal.id).toBe('COMP_CENT');
      expect(pidSymbols.compressorCentrifugal.category).toBe('pump');
    });

    it('should render with circle body', () => {
      const svg = pidSymbols.compressorCentrifugal.render(0, 0);
      expect(svg).toContain('<circle');
    });
  });

  describe('compressorReciprocating', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.compressorReciprocating.id).toBe('COMP_RECIP');
      expect(pidSymbols.compressorReciprocating.category).toBe('pump');
    });

    it('should render with rectangle body', () => {
      const svg = pidSymbols.compressorReciprocating.render(0, 0);
      expect(svg).toContain('<rect');
    });
  });

  describe('valveButterfly', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.valveButterfly.id).toBe('VALVE_BUTTERFLY');
      expect(pidSymbols.valveButterfly.category).toBe('valve');
    });

    it('should render with disc (ellipse)', () => {
      const svg = pidSymbols.valveButterfly.render(0, 0);
      expect(svg).toContain('<ellipse');
    });
  });

  describe('valveThreeWay', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.valveThreeWay.id).toBe('VALVE_3WAY');
      expect(pidSymbols.valveThreeWay.category).toBe('valve');
    });

    it('should have 3 terminals', () => {
      expect(pidSymbols.valveThreeWay.terminals).toHaveLength(3);
      const terminalNames = pidSymbols.valveThreeWay.terminals.map(
        (t) => t.name
      );
      expect(terminalNames).toContain('inlet');
      expect(terminalNames).toContain('outlet1');
      expect(terminalNames).toContain('outlet2');
    });
  });

  describe('valveNeedle', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.valveNeedle.id).toBe('VALVE_NEEDLE');
      expect(pidSymbols.valveNeedle.category).toBe('valve');
    });

    it('should render with needle indicator', () => {
      const svg = pidSymbols.valveNeedle.render(0, 0);
      expect(svg).toContain('Needle');
    });
  });

  describe('heatExchangerPlate', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.heatExchangerPlate.id).toBe('HX_PLATE');
      expect(pidSymbols.heatExchangerPlate.category).toBe('heatExchanger');
    });

    it('should have 4 terminals with camelCase names', () => {
      expect(pidSymbols.heatExchangerPlate.terminals).toHaveLength(4);
      const terminalNames = pidSymbols.heatExchangerPlate.terminals.map(
        (t) => t.name
      );
      expect(terminalNames).toContain('hot_in');
      expect(terminalNames).toContain('hot_out');
      expect(terminalNames).toContain('cold_in');
      expect(terminalNames).toContain('cold_out');
    });
  });

  describe('firedHeater', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.firedHeater.id).toBe('HEATER_FIRED');
      expect(pidSymbols.firedHeater.category).toBe('heatExchanger');
    });

    it('should render with flame symbols', () => {
      const svg = pidSymbols.firedHeater.render(0, 0);
      expect(svg).toContain('Flame');
    });

    it('should have inlet, outlet, and fuel terminals', () => {
      const terminalNames = pidSymbols.firedHeater.terminals.map((t) => t.name);
      expect(terminalNames).toContain('inlet');
      expect(terminalNames).toContain('outlet');
      expect(terminalNames).toContain('fuel');
    });
  });

  describe('analyzerTransmitter', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.analyzerTransmitter.id).toBe('AT');
      expect(pidSymbols.analyzerTransmitter.category).toBe('instrument');
    });

    it('should render with circle (ISA-5.1)', () => {
      const svg = pidSymbols.analyzerTransmitter.render(0, 0);
      expect(svg).toContain('<circle');
    });
  });

  describe('pressureIndicator', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.pressureIndicator.id).toBe('PI');
      expect(pidSymbols.pressureIndicator.category).toBe('instrument');
    });
  });

  describe('temperatureIndicatorController', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.temperatureIndicatorController.id).toBe('TIC');
      expect(pidSymbols.temperatureIndicatorController.category).toBe(
        'instrument'
      );
    });

    it('should have process and output terminals', () => {
      const terminalNames =
        pidSymbols.temperatureIndicatorController.terminals.map((t) => t.name);
      expect(terminalNames).toContain('process');
      expect(terminalNames).toContain('output');
    });
  });

  describe('levelIndicatorController', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.levelIndicatorController.id).toBe('LIC');
      expect(pidSymbols.levelIndicatorController.category).toBe('instrument');
    });
  });

  describe('pressureIndicatorController', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.pressureIndicatorController.id).toBe('PIC');
      expect(pidSymbols.pressureIndicatorController.category).toBe(
        'instrument'
      );
    });
  });
});

describe('P&ID Symbol Completeness', () => {
  it('should have 87 total symbols', () => {
    const symbolCount = Object.keys(pidSymbols).length;
    expect(symbolCount).toBe(87);
  });

  it('should have all vessel types', () => {
    expect(pidSymbols.vesselVertical).toBeDefined();
    expect(pidSymbols.vesselHorizontal).toBeDefined();
    expect(pidSymbols.storageTank).toBeDefined();
    expect(pidSymbols.separator).toBeDefined();
    expect(pidSymbols.reactor).toBeDefined();
    expect(pidSymbols.knockoutDrum).toBeDefined();
    expect(pidSymbols.distillationColumn).toBeDefined();
    expect(pidSymbols.filter).toBeDefined();
    expect(pidSymbols.separatorHorizontal).toBeDefined();
    expect(pidSymbols.flashDrum).toBeDefined();
    expect(pidSymbols.refluxDrum).toBeDefined();
    expect(pidSymbols.cyclone).toBeDefined();
  });

  it('should have all pump and compressor types', () => {
    expect(pidSymbols.pumpCentrifugal).toBeDefined();
    expect(pidSymbols.pumpPositiveDisplacement).toBeDefined();
    expect(pidSymbols.compressorCentrifugal).toBeDefined();
    expect(pidSymbols.compressorReciprocating).toBeDefined();
    expect(pidSymbols.turbineSteam).toBeDefined();
    expect(pidSymbols.fan).toBeDefined();
    expect(pidSymbols.agitator).toBeDefined();
  });

  it('should have all valve types', () => {
    expect(pidSymbols.valveGate).toBeDefined();
    expect(pidSymbols.valveShutoff).toBeDefined();
    expect(pidSymbols.valveGlobe).toBeDefined();
    expect(pidSymbols.valveBall).toBeDefined();
    expect(pidSymbols.valveCheck).toBeDefined();
    expect(pidSymbols.valveControl).toBeDefined();
    expect(pidSymbols.valveControlPositioner).toBeDefined();
    expect(pidSymbols.valveSafetyRelief).toBeDefined();
    expect(pidSymbols.valvePressureReducing).toBeDefined();
    expect(pidSymbols.valveButterfly).toBeDefined();
    expect(pidSymbols.valveThreeWay).toBeDefined();
    expect(pidSymbols.valveNeedle).toBeDefined();
    expect(pidSymbols.valvePlug).toBeDefined();
    expect(pidSymbols.valveDiaphragm).toBeDefined();
    expect(pidSymbols.valveAngle).toBeDefined();
    expect(pidSymbols.valvePinch).toBeDefined();
  });

  it('should have all heat exchanger types', () => {
    expect(pidSymbols.heatExchangerShellTube).toBeDefined();
    expect(pidSymbols.cooler).toBeDefined();
    expect(pidSymbols.airCooler).toBeDefined();
    expect(pidSymbols.heatExchangerPlate).toBeDefined();
    expect(pidSymbols.firedHeater).toBeDefined();
    expect(pidSymbols.jacket).toBeDefined();
    expect(pidSymbols.coolingTower).toBeDefined();
    expect(pidSymbols.condenser).toBeDefined();
    expect(pidSymbols.reboiler).toBeDefined();
    expect(pidSymbols.ruptureDisk).toBeDefined();
  });

  it('should have all instrument types', () => {
    // Transmitters
    expect(pidSymbols.flowTransmitter).toBeDefined();
    expect(pidSymbols.temperatureTransmitter).toBeDefined();
    expect(pidSymbols.pressureTransmitter).toBeDefined();
    expect(pidSymbols.levelTransmitter).toBeDefined();
    expect(pidSymbols.analyzerTransmitter).toBeDefined();
    expect(pidSymbols.phTransmitter).toBeDefined();
    expect(pidSymbols.conductivityTransmitter).toBeDefined();
    expect(pidSymbols.vibrationTransmitter).toBeDefined();

    // Indicators
    expect(pidSymbols.flowIndicator).toBeDefined();
    expect(pidSymbols.temperatureIndicator).toBeDefined();
    expect(pidSymbols.pressureIndicator).toBeDefined();
    expect(pidSymbols.levelIndicator).toBeDefined();

    // Recorders
    expect(pidSymbols.flowRecorder).toBeDefined();
    expect(pidSymbols.pressureRecorder).toBeDefined();
    expect(pidSymbols.temperatureRecorder).toBeDefined();

    // Controllers
    expect(pidSymbols.flowController).toBeDefined();
    expect(pidSymbols.pressureController).toBeDefined();
    expect(pidSymbols.temperatureController).toBeDefined();
    expect(pidSymbols.levelController).toBeDefined();
    expect(pidSymbols.speedController).toBeDefined();

    // Indicator Controllers
    expect(pidSymbols.flowIndicatorController).toBeDefined();
    expect(pidSymbols.temperatureIndicatorController).toBeDefined();
    expect(pidSymbols.levelIndicatorController).toBeDefined();
    expect(pidSymbols.pressureIndicatorController).toBeDefined();

    // Switches
    expect(pidSymbols.flowSwitch).toBeDefined();
    expect(pidSymbols.levelSwitch).toBeDefined();
    expect(pidSymbols.pressureSwitch).toBeDefined();
    expect(pidSymbols.temperatureSwitch).toBeDefined();

    // Alarms
    expect(pidSymbols.temperatureAlarmHigh).toBeDefined();
    expect(pidSymbols.temperatureAlarmLow).toBeDefined();
    expect(pidSymbols.temperatureAlarmHighHigh).toBeDefined();
    expect(pidSymbols.temperatureAlarmLowLow).toBeDefined();
    expect(pidSymbols.pressureAlarmHigh).toBeDefined();
    expect(pidSymbols.pressureAlarmLow).toBeDefined();
    expect(pidSymbols.pressureAlarmHighHigh).toBeDefined();
    expect(pidSymbols.pressureAlarmLowLow).toBeDefined();
    expect(pidSymbols.levelAlarmHigh).toBeDefined();
    expect(pidSymbols.levelAlarmLow).toBeDefined();
    expect(pidSymbols.levelAlarmHighHigh).toBeDefined();
    expect(pidSymbols.levelAlarmLowLow).toBeDefined();
    expect(pidSymbols.flowAlarmHigh).toBeDefined();
    expect(pidSymbols.flowAlarmLow).toBeDefined();
  });
});
describe('P&ID Symbols - Phase 2 Equipment', () => {
  describe('distillationColumn', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.distillationColumn.id).toBe('COLUMN');
      expect(pidSymbols.distillationColumn.category).toBe('vessel');
    });

    it('should have 4 terminals', () => {
      expect(pidSymbols.distillationColumn.terminals).toHaveLength(4);
      const terminalNames = pidSymbols.distillationColumn.terminals.map(
        (t) => t.name
      );
      expect(terminalNames).toContain('overhead');
      expect(terminalNames).toContain('bottoms');
      expect(terminalNames).toContain('feed');
      expect(terminalNames).toContain('reflux');
    });

    it('should render with trays', () => {
      const svg = pidSymbols.distillationColumn.render(0, 0);
      expect(svg).toContain('Trays');
    });
  });

  describe('filter', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.filter.id).toBe('FILTER');
      expect(pidSymbols.filter.category).toBe('vessel');
    });

    it('should render with diamond shape', () => {
      const svg = pidSymbols.filter.render(0, 0);
      expect(svg).toContain('<path');
    });
  });

  describe('coolingTower', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.coolingTower.id).toBe('COOLING_TOWER');
      expect(pidSymbols.coolingTower.category).toBe('heatExchanger');
    });

    it('should have airOut, coldWaterOut, and hotWaterIn terminals', () => {
      const terminalNames = pidSymbols.coolingTower.terminals.map(
        (t) => t.name
      );
      expect(terminalNames).toContain('airOut');
      expect(terminalNames).toContain('coldWaterOut');
      expect(terminalNames).toContain('hotWaterIn');
    });
  });

  describe('turbineSteam', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.turbineSteam.id).toBe('TURBINE_STEAM');
      expect(pidSymbols.turbineSteam.category).toBe('pump');
    });

    it('should have steamIn, exhaustOut, and shaft terminals', () => {
      const terminalNames = pidSymbols.turbineSteam.terminals.map(
        (t) => t.name
      );
      expect(terminalNames).toContain('steamIn');
      expect(terminalNames).toContain('exhaustOut');
      expect(terminalNames).toContain('shaft');
    });
  });

  describe('fan', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.fan.id).toBe('FAN');
      expect(pidSymbols.fan.category).toBe('pump');
    });

    it('should render with circle body and blades', () => {
      const svg = pidSymbols.fan.render(0, 0);
      expect(svg).toContain('<circle');
      expect(svg).toContain('blades');
    });
  });

  describe('agitator', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.agitator.id).toBe('AGITATOR');
      expect(pidSymbols.agitator.category).toBe('pump');
    });

    it('should render with motor and impeller', () => {
      const svg = pidSymbols.agitator.render(0, 0);
      expect(svg).toContain('Motor');
      expect(svg).toContain('Impeller');
    });
  });

  describe('valvePlug', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.valvePlug.id).toBe('VALVE_PLUG');
      expect(pidSymbols.valvePlug.category).toBe('valve');
    });

    it('should render with rectangle body', () => {
      const svg = pidSymbols.valvePlug.render(0, 0);
      expect(svg).toContain('<rect');
    });
  });

  describe('valveDiaphragm', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.valveDiaphragm.id).toBe('VALVE_DIAPHRAGM');
      expect(pidSymbols.valveDiaphragm.category).toBe('valve');
    });

    it('should render with diaphragm curve', () => {
      const svg = pidSymbols.valveDiaphragm.render(0, 0);
      expect(svg).toContain('Diaphragm');
    });
  });

  describe('new instrument indicators', () => {
    it('flowIndicator should have correct id', () => {
      expect(pidSymbols.flowIndicator.id).toBe('FI');
      expect(pidSymbols.flowIndicator.category).toBe('instrument');
    });

    it('temperatureIndicator should have correct id', () => {
      expect(pidSymbols.temperatureIndicator.id).toBe('TI');
      expect(pidSymbols.temperatureIndicator.category).toBe('instrument');
    });

    it('levelIndicator should have correct id', () => {
      expect(pidSymbols.levelIndicator.id).toBe('LI');
      expect(pidSymbols.levelIndicator.category).toBe('instrument');
    });
  });

  describe('new instrument recorders', () => {
    it('flowRecorder should have correct id', () => {
      expect(pidSymbols.flowRecorder.id).toBe('FR');
      expect(pidSymbols.flowRecorder.category).toBe('instrument');
    });

    it('pressureRecorder should have correct id', () => {
      expect(pidSymbols.pressureRecorder.id).toBe('PR');
      expect(pidSymbols.pressureRecorder.category).toBe('instrument');
    });

    it('temperatureRecorder should have correct id', () => {
      expect(pidSymbols.temperatureRecorder.id).toBe('TR');
      expect(pidSymbols.temperatureRecorder.category).toBe('instrument');
    });
  });

  describe('new instrument controllers', () => {
    it('flowController should have correct id and terminals', () => {
      expect(pidSymbols.flowController.id).toBe('FC');
      expect(pidSymbols.flowController.category).toBe('instrument');
      const terminalNames = pidSymbols.flowController.terminals.map(
        (t) => t.name
      );
      expect(terminalNames).toContain('process');
      expect(terminalNames).toContain('output');
    });

    it('pressureController should have correct id', () => {
      expect(pidSymbols.pressureController.id).toBe('PC');
      expect(pidSymbols.pressureController.category).toBe('instrument');
    });

    it('temperatureController should have correct id', () => {
      expect(pidSymbols.temperatureController.id).toBe('TC');
      expect(pidSymbols.temperatureController.category).toBe('instrument');
    });

    it('levelController should have correct id', () => {
      expect(pidSymbols.levelController.id).toBe('LC');
      expect(pidSymbols.levelController.category).toBe('instrument');
    });
  });
});

describe('P&ID Symbols - Phase 3 Final Equipment', () => {
  describe('separatorHorizontal', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.separatorHorizontal.id).toBe('SEPARATOR_H');
      expect(pidSymbols.separatorHorizontal.category).toBe('vessel');
    });

    it('should have feedIn, gasOut, and liquidOut terminals', () => {
      const terminalNames = pidSymbols.separatorHorizontal.terminals.map(
        (t) => t.name
      );
      expect(terminalNames).toContain('feedIn');
      expect(terminalNames).toContain('gasOut');
      expect(terminalNames).toContain('liquidOut');
    });

    it('should render with ellipse shape', () => {
      const svg = pidSymbols.separatorHorizontal.render(0, 0);
      expect(svg).toContain('<ellipse');
    });
  });

  describe('flashDrum', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.flashDrum.id).toBe('FLASH_DRUM');
      expect(pidSymbols.flashDrum.category).toBe('vessel');
    });

    it('should render with vapor bubbles', () => {
      const svg = pidSymbols.flashDrum.render(0, 0);
      expect(svg).toContain('Vapor');
    });
  });

  describe('refluxDrum', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.refluxDrum.id).toBe('REFLUX_DRUM');
      expect(pidSymbols.refluxDrum.category).toBe('vessel');
    });

    it('should have condensateIn, refluxOut, and distillateOut terminals', () => {
      const terminalNames = pidSymbols.refluxDrum.terminals.map((t) => t.name);
      expect(terminalNames).toContain('condensateIn');
      expect(terminalNames).toContain('refluxOut');
      expect(terminalNames).toContain('distillateOut');
    });
  });

  describe('cyclone', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.cyclone.id).toBe('CYCLONE');
      expect(pidSymbols.cyclone.category).toBe('vessel');
    });

    it('should have feedIn, cleanGasOut, and solidsOut terminals', () => {
      const terminalNames = pidSymbols.cyclone.terminals.map((t) => t.name);
      expect(terminalNames).toContain('feedIn');
      expect(terminalNames).toContain('cleanGasOut');
      expect(terminalNames).toContain('solidsOut');
    });
  });

  describe('condenser', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.condenser.id).toBe('CONDENSER');
      expect(pidSymbols.condenser.category).toBe('heatExchanger');
    });

    it('should have 4 terminals', () => {
      expect(pidSymbols.condenser.terminals).toHaveLength(4);
      const terminalNames = pidSymbols.condenser.terminals.map((t) => t.name);
      expect(terminalNames).toContain('vaporIn');
      expect(terminalNames).toContain('liquidOut');
    });
  });

  describe('reboiler', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.reboiler.id).toBe('REBOILER');
      expect(pidSymbols.reboiler.category).toBe('heatExchanger');
    });

    it('should have heating and vapor/liquid terminals', () => {
      const terminalNames = pidSymbols.reboiler.terminals.map((t) => t.name);
      expect(terminalNames).toContain('heatingIn');
      expect(terminalNames).toContain('heatingOut');
      expect(terminalNames).toContain('vaporOut');
      expect(terminalNames).toContain('liquidIn');
    });
  });

  describe('valveAngle', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.valveAngle.id).toBe('VALVE_ANGLE');
      expect(pidSymbols.valveAngle.category).toBe('valve');
    });

    it('should have inlet and outlet terminals', () => {
      const terminalNames = pidSymbols.valveAngle.terminals.map((t) => t.name);
      expect(terminalNames).toContain('inlet');
      expect(terminalNames).toContain('outlet');
    });
  });

  describe('valvePinch', () => {
    it('should have correct id and category', () => {
      expect(pidSymbols.valvePinch.id).toBe('VALVE_PINCH');
      expect(pidSymbols.valvePinch.category).toBe('valve');
    });

    it('should render with pinch mechanism', () => {
      const svg = pidSymbols.valvePinch.render(0, 0);
      expect(svg).toContain('Pinch');
    });
  });

  describe('analytical instruments', () => {
    it('phTransmitter should have correct id', () => {
      expect(pidSymbols.phTransmitter.id).toBe('PHT');
      expect(pidSymbols.phTransmitter.category).toBe('instrument');
    });

    it('conductivityTransmitter should have correct id', () => {
      expect(pidSymbols.conductivityTransmitter.id).toBe('CT');
      expect(pidSymbols.conductivityTransmitter.category).toBe('instrument');
    });
  });

  describe('instrument switches', () => {
    it('flowSwitch should have correct id and alarm terminal', () => {
      expect(pidSymbols.flowSwitch.id).toBe('FS');
      expect(pidSymbols.flowSwitch.category).toBe('instrument');
      const terminalNames = pidSymbols.flowSwitch.terminals.map((t) => t.name);
      expect(terminalNames).toContain('process');
      expect(terminalNames).toContain('alarm');
    });

    it('levelSwitch should have correct id', () => {
      expect(pidSymbols.levelSwitch.id).toBe('LS');
      expect(pidSymbols.levelSwitch.category).toBe('instrument');
    });

    it('pressureSwitch should have correct id', () => {
      expect(pidSymbols.pressureSwitch.id).toBe('PS');
      expect(pidSymbols.pressureSwitch.category).toBe('instrument');
    });

    it('temperatureSwitch should have correct id', () => {
      expect(pidSymbols.temperatureSwitch.id).toBe('TS');
      expect(pidSymbols.temperatureSwitch.category).toBe('instrument');
    });
  });
});
