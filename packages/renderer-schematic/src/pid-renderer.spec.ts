import type {
  PIDEquipment,
  PIDInstrument,
  PIDLine,
  PIDLoop,
  PIDProfile,
} from '@runiq/core';
import { PIDLineType } from '@runiq/core';
import { describe, expect, it } from 'vitest';
import { renderPID, type PIDRenderOptions } from './pid-renderer.js';

describe('pid-renderer', () => {
  describe('renderPID', () => {
    it('should render empty profile with minimal SVG', () => {
      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Empty P&ID' },
        equipment: [],
        instruments: [],
        lines: [],
        loops: [],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(result.svg).toContain('</svg>');
      expect(result.warnings).toHaveLength(0);
    });

    it('should use default dimensions when no options provided', () => {
      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments: [],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('width="1200"');
      expect(result.svg).toContain('height="800"');
      expect(result.svg).toContain('viewBox="0 0 1200 800"');
    });

    it('should use custom dimensions from options', () => {
      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments: [],
      };

      const options: PIDRenderOptions = {
        width: 1600,
        height: 1000,
      };

      const result = renderPID(profile, options);

      expect(result.svg).toContain('width="1600"');
      expect(result.svg).toContain('height="1000"');
    });

    it('should include CSS styles in SVG defs', () => {
      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments: [],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('<defs>');
      expect(result.svg).toContain('<style>');
      expect(result.svg).toContain('.pid-equipment');
      expect(result.svg).toContain('.pid-instrument');
      expect(result.svg).toContain('.pid-line');
      expect(result.svg).toContain('.pid-tag');
      expect(result.svg).toContain('</style>');
      expect(result.svg).toContain('</defs>');
    });

    it('should render white background rectangle', () => {
      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments: [],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain(
        '<rect width="1200" height="800" fill="#fff"/>'
      );
    });

    it('should render grid when showGrid is true', () => {
      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments: [],
      };

      const options: PIDRenderOptions = {
        showGrid: true,
        gridSize: 50,
      };

      const result = renderPID(profile, options);

      expect(result.svg).toContain('class="pid-grid"');
      expect(result.svg).toContain('opacity="0.1"');
    });

    it('should not render grid when showGrid is false', () => {
      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments: [],
      };

      const options: PIDRenderOptions = {
        showGrid: false,
      };

      const result = renderPID(profile, options);

      expect(result.svg).not.toContain('class="pid-grid"');
    });
  });

  describe('equipment rendering', () => {
    it('should render equipment with tag', () => {
      const equipment: PIDEquipment = {
        tag: 'V-101',
        type: 'vesselVertical',
        description: 'Storage Tank',
        properties: {},
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [equipment],
        instruments: [],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('class="pid-equipment-group"');
      expect(result.svg).toContain('V-101');
    });

    it('should hide equipment tags when showTags is false', () => {
      const equipment: PIDEquipment = {
        tag: 'V-101',
        type: 'vesselVertical',
        description: 'Storage Tank',
        properties: {},
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [equipment],
        instruments: [],
      };

      const options: PIDRenderOptions = {
        showTags: false,
      };

      const result = renderPID(profile, options);

      // Tag should not appear as text element
      expect(result.svg).not.toContain('class="pid-tag"');
    });

    it('should render equipment properties when showProperties is true', () => {
      const equipment: PIDEquipment = {
        tag: 'V-101',
        type: 'vesselVertical',
        description: 'Storage Tank',
        properties: {
          volume: 1000,
          volumeUnit: 'L',
          material: 'SS316',
        },
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [equipment],
        instruments: [],
      };

      const options: PIDRenderOptions = {
        showProperties: true,
      };

      const result = renderPID(profile, options);

      expect(result.svg).toContain('class="pid-property"');
      expect(result.svg).toContain('1000L');
      expect(result.svg).toContain('SS316');
    });

    it('should hide equipment properties when showProperties is false', () => {
      const equipment: PIDEquipment = {
        tag: 'V-101',
        type: 'vesselVertical',
        description: 'Storage Tank',
        properties: {
          volume: 1000,
          material: 'SS316',
        },
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [equipment],
        instruments: [],
      };

      const options: PIDRenderOptions = {
        showProperties: false,
      };

      const result = renderPID(profile, options);

      expect(result.svg).not.toContain('SS316');
    });

    it('should warn about unknown equipment type', () => {
      const equipment: PIDEquipment = {
        tag: 'X-999',
        type: 'unknown-type',
        description: 'Unknown',
        properties: {},
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [equipment],
        instruments: [],
      };

      const result = renderPID(profile);

      expect(result.warnings).toContain('Unknown equipment type: unknown-type');
    });

    it('should render multiple equipment items', () => {
      const equipment: PIDEquipment[] = [
        {
          tag: 'V-101',
          type: 'vesselVertical',
          description: 'Tank 1',
          properties: {},
        },
        {
          tag: 'P-201',
          type: 'pumpCentrifugal',
          description: 'Pump 1',
          properties: {},
        },
        {
          tag: 'E-301',
          type: 'heatExchangerShellTube',
          description: 'HX 1',
          properties: {},
        },
      ];

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment,
        instruments: [],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('V-101');
      expect(result.svg).toContain('P-201');
      expect(result.svg).toContain('E-301');
    });
  });

  describe('instrument rendering', () => {
    it('should render instrument with circular bubble', () => {
      const instrument: PIDInstrument = {
        tag: 'TI-101',
        type: 'temperature-indicator',
        description: 'Temperature Indicator',
        properties: {},
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments: [instrument],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('class="pid-instruments-group"');
      expect(result.svg).toContain('class="pid-instrument"');
      expect(result.svg).toContain('<circle');
      expect(result.svg).toContain('TI-101');
    });

    it('should render field-mounted instrument with mounting symbol', () => {
      const instrument: PIDInstrument = {
        tag: 'PT-101',
        type: 'pressure-transmitter',
        description: 'Pressure Transmitter',
        properties: {
          location: 'field',
        },
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments: [instrument],
      };

      const result = renderPID(profile);

      // Should have mounting line below circle
      expect(result.svg).toContain('<line');
    });

    it('should render panel-mounted instrument with dashed circle', () => {
      const instrument: PIDInstrument = {
        tag: 'TIC-101',
        type: 'temperature-controller',
        description: 'Temperature Controller',
        properties: {
          location: 'panel',
        },
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments: [instrument],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('stroke-dasharray="3,3"');
    });

    it('should render multiple instruments', () => {
      const instruments: PIDInstrument[] = [
        {
          tag: 'TI-101',
          type: 'temperature-indicator',
          description: 'TI',
          properties: {},
        },
        {
          tag: 'PI-102',
          type: 'pressure-indicator',
          description: 'PI',
          properties: {},
        },
        {
          tag: 'FI-103',
          type: 'flow-indicator',
          description: 'FI',
          properties: {},
        },
      ];

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments,
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('TI-101');
      expect(result.svg).toContain('PI-102');
      expect(result.svg).toContain('FI-103');
    });
  });

  describe('line rendering', () => {
    it('should render process line between equipment', () => {
      const equipment: PIDEquipment[] = [
        {
          tag: 'V-101',
          type: 'vesselVertical',
          description: 'Tank',
          properties: {},
        },
        {
          tag: 'P-201',
          type: 'pumpCentrifugal',
          description: 'Pump',
          properties: {},
        },
      ];

      const line: PIDLine = {
        from: { equipment: 'V-101', port: 'outlet' },
        to: { equipment: 'P-201', port: 'inlet' },
        type: PIDLineType.PROCESS,
        properties: {},
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment,
        instruments: [],
        lines: [line],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('class="pid-lines-group"');
      expect(result.svg).toContain('class="pid-line"');
    });

    it('should render signal line with dashed style', () => {
      const equipment: PIDEquipment[] = [
        {
          tag: 'V-101',
          type: 'vesselVertical',
          description: 'Tank',
          properties: {},
        },
      ];

      const instrument: PIDInstrument = {
        tag: 'LT-101',
        type: 'level-transmitter',
        description: 'Level Transmitter',
        properties: {},
      };

      const line: PIDLine = {
        from: { equipment: 'V-101', port: 'top' },
        to: { equipment: 'LT-101', port: 'input' },
        type: PIDLineType.SIGNAL,
        properties: {},
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment,
        instruments: [instrument],
        lines: [line],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('class="pid-line-signal"');
    });

    it('should render electrical line with dotted style', () => {
      const equipment: PIDEquipment[] = [
        {
          tag: 'P-201',
          type: 'pumpCentrifugal',
          description: 'Pump',
          properties: {},
        },
      ];

      const instrument: PIDInstrument = {
        tag: 'HS-201',
        type: 'hand-switch',
        description: 'Hand Switch',
        properties: {},
      };

      const line: PIDLine = {
        from: { equipment: 'HS-201', port: 'output' },
        to: { equipment: 'P-201', port: 'motor' },
        type: PIDLineType.ELECTRICAL,
        properties: {},
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment,
        instruments: [instrument],
        lines: [line],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('class="pid-line-electrical"');
    });

    it('should render utility line with blue color', () => {
      const equipment: PIDEquipment[] = [
        {
          tag: 'V-101',
          type: 'vesselVertical',
          description: 'Tank',
          properties: {},
        },
        {
          tag: 'V-102',
          type: 'vesselVertical',
          description: 'Tank',
          properties: {},
        },
      ];

      const line: PIDLine = {
        from: { equipment: 'V-101', port: 'outlet' },
        to: { equipment: 'V-102', port: 'inlet' },
        type: PIDLineType.UTILITY,
        properties: {},
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment,
        instruments: [],
        lines: [line],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('class="pid-line-utility"');
    });

    it('should render line size annotation for process lines', () => {
      const equipment: PIDEquipment[] = [
        {
          tag: 'V-101',
          type: 'vesselVertical',
          description: 'Tank',
          properties: {},
        },
        {
          tag: 'P-201',
          type: 'pumpCentrifugal',
          description: 'Pump',
          properties: {},
        },
      ];

      const line: PIDLine = {
        from: { equipment: 'V-101', port: 'outlet' },
        to: { equipment: 'P-201', port: 'inlet' },
        type: PIDLineType.PROCESS,
        properties: {
          size: 4,
        },
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment,
        instruments: [],
        lines: [line],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('4"');
    });

    it('should warn about missing equipment for line', () => {
      const line: PIDLine = {
        from: { equipment: 'V-999', port: 'outlet' },
        to: { equipment: 'P-999', port: 'inlet' },
        type: PIDLineType.PROCESS,
        properties: {},
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments: [],
        lines: [line],
      };

      const result = renderPID(profile);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('V-999');
      expect(result.warnings[0]).toContain('P-999');
    });
  });

  describe('control loop rendering', () => {
    it('should render control loop annotation', () => {
      const instrument: PIDInstrument = {
        tag: 'TIC-101',
        type: 'temperature-controller',
        description: 'Temperature Controller',
        properties: {},
      };

      const loop: PIDLoop = {
        id: 'L-101',
        controller: 'TIC-101',
        controlledVariable: 'Temperature',
        setpoint: '150',
        unit: '°C',
      };

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments: [instrument],
        loops: [loop],
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('class="pid-loops-group"');
      expect(result.svg).toContain('class="pid-loop"');
      expect(result.svg).toContain('Loop L-101');
      expect(result.svg).toContain('Temperature: 150 °C');
    });

    it('should render multiple control loops', () => {
      const instruments: PIDInstrument[] = [
        {
          tag: 'TIC-101',
          type: 'temperature-controller',
          description: 'TC',
          properties: {},
        },
        {
          tag: 'PIC-201',
          type: 'pressure-controller',
          description: 'PC',
          properties: {},
        },
      ];

      const loops: PIDLoop[] = [
        {
          id: 'L-101',
          controller: 'TIC-101',
          controlledVariable: 'Temperature',
          setpoint: '150',
          unit: '°C',
        },
        {
          id: 'L-201',
          controller: 'PIC-201',
          controlledVariable: 'Pressure',
          setpoint: '5',
          unit: 'bar',
        },
      ];

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment: [],
        instruments,
        loops,
      };

      const result = renderPID(profile);

      expect(result.svg).toContain('Loop L-101');
      expect(result.svg).toContain('Loop L-201');
      expect(result.svg).toContain('Temperature: 150 °C');
      expect(result.svg).toContain('Pressure: 5 bar');
    });
  });

  describe('layout calculation', () => {
    it('should calculate height based on content', () => {
      const equipment: PIDEquipment[] = Array.from({ length: 30 }, (_, i) => ({
        tag: `V-${i + 101}`,
        type: 'vesselVertical',
        description: `Tank ${i + 1}`,
        properties: {},
      }));

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment,
        instruments: [],
      };

      const result = renderPID(profile);

      // Should have increased height for multiple rows of equipment
      const heightMatch = result.svg.match(/height="(\d+)"/);
      expect(heightMatch).toBeTruthy();
      const height = Number.parseInt(heightMatch![1], 10);
      expect(height).toBeGreaterThanOrEqual(800); // At least default height
    });

    it('should use custom spacing option', () => {
      const equipment: PIDEquipment[] = [
        {
          tag: 'V-101',
          type: 'vesselVertical',
          description: 'Tank',
          properties: {},
        },
        {
          tag: 'V-102',
          type: 'vesselVertical',
          description: 'Tank',
          properties: {},
        },
      ];

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Test' },
        equipment,
        instruments: [],
      };

      const options: PIDRenderOptions = {
        spacing: 200,
      };

      const result = renderPID(profile, options);

      // Verify equipment is spaced appropriately (hard to test exact positions from SVG)
      expect(result.svg).toContain('V-101');
      expect(result.svg).toContain('V-102');
    });
  });

  describe('integration tests', () => {
    it('should render complete P&ID with all elements', () => {
      const equipment: PIDEquipment[] = [
        {
          tag: 'V-101',
          type: 'vesselVertical',
          description: 'Feed Tank',
          properties: { volume: 1000 },
        },
        {
          tag: 'P-201',
          type: 'pumpCentrifugal',
          description: 'Feed Pump',
          properties: {},
        },
      ];

      const instruments: PIDInstrument[] = [
        {
          tag: 'LT-101',
          type: 'level-transmitter',
          description: 'Level',
          properties: { location: 'field' },
        },
        {
          tag: 'FIC-201',
          type: 'flow-controller',
          description: 'Flow',
          properties: { location: 'panel' },
        },
      ];

      const lines: PIDLine[] = [
        {
          from: { equipment: 'V-101', port: 'outlet' },
          to: { equipment: 'P-201', port: 'inlet' },
          type: PIDLineType.PROCESS,
          properties: { size: 3 },
        },
        {
          from: { equipment: 'V-101', port: 'top' },
          to: { equipment: 'LT-101', port: 'input' },
          type: PIDLineType.SIGNAL,
          properties: {},
        },
      ];

      const loops: PIDLoop[] = [
        {
          id: 'L-201',
          controller: 'FIC-201',
          controlledVariable: 'Flow',
          setpoint: '50',
          unit: 'm³/h',
        },
      ];

      const profile: PIDProfile = {
        version: '1.0',
        metadata: { title: 'Complete P&ID' },
        equipment,
        instruments,
        lines,
        loops,
      };

      const result = renderPID(profile);

      // Verify all sections are present
      expect(result.svg).toContain('class="pid-equipment-group"');
      expect(result.svg).toContain('class="pid-instruments-group"');
      expect(result.svg).toContain('class="pid-lines-group"');
      expect(result.svg).toContain('class="pid-loops-group"');

      // Verify specific elements
      expect(result.svg).toContain('V-101');
      expect(result.svg).toContain('P-201');
      expect(result.svg).toContain('LT-101');
      expect(result.svg).toContain('FIC-201');
      expect(result.svg).toContain('3"'); // Line size
      expect(result.svg).toContain('Loop L-201');

      expect(result.warnings).toHaveLength(0);
    });
  });
});
