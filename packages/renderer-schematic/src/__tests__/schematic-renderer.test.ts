import { describe, it, expect } from 'vitest';
import { renderSchematic } from '../index.js';
import type { ElectricalProfile } from '@runiq/core';

describe('Schematic Renderer', () => {
  describe('Basic Rendering', () => {
    it('should render simple resistor circuit', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Simple Resistor',
        nets: [{ name: 'VCC' }, { name: 'GND' }],
        parts: [
          {
            ref: 'V1',
            type: 'V',
            params: { value: '5' },
            pins: ['VCC', 'GND'],
          },
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['VCC', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('</svg>');
      expect(result.svg).toContain('Simple Resistor');
      expect(result.svg).toContain('data-ref="V1"');
      expect(result.svg).toContain('data-ref="R1"');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render RC filter circuit', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'RC Lowpass Filter',
        nets: [{ name: 'IN' }, { name: 'OUT' }, { name: 'GND' }],
        parts: [
          {
            ref: 'V1',
            type: 'V',
            params: { source: 'SIN(0 1 1k)' },
            pins: ['IN', 'GND'],
          },
          {
            ref: 'R1',
            type: 'R',
            params: { value: '10k' },
            pins: ['IN', 'OUT'],
          },
          {
            ref: 'C1',
            type: 'C',
            params: { value: '1n' },
            pins: ['OUT', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('V1');
      expect(result.svg).toContain('R1');
      expect(result.svg).toContain('C1');
      expect(result.svg).toContain('10k');
      expect(result.svg).toContain('1n');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render circuit with inductor', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'RL Circuit',
        nets: [{ name: 'VIN' }, { name: 'VOUT' }, { name: 'GND' }],
        parts: [
          {
            ref: 'L1',
            type: 'L',
            params: { value: '10m' },
            pins: ['VIN', 'VOUT'],
          },
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['VOUT', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('L1');
      expect(result.svg).toContain('10m');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render current source', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Current Source',
        nets: [{ name: 'N1' }, { name: 'GND' }],
        parts: [
          {
            ref: 'I1',
            type: 'I',
            params: { value: '1m' },
            pins: ['N1', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('I1');
      expect(result.svg).toContain('1m');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Ground Symbols', () => {
    it('should render ground symbols for GND connections', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'With Ground',
        nets: [{ name: 'VCC' }, { name: 'GND' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['VCC', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('schematic-grounds');
      expect(result.warnings).toHaveLength(0);
    });

    it('should normalize VSS to GND', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'With VSS',
        nets: [{ name: 'VCC' }, { name: 'VSS' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['VCC', 'VSS'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('schematic-grounds');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Wiring', () => {
    it('should render wires between components', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Series Circuit',
        nets: [{ name: 'VIN' }, { name: 'N1' }, { name: 'VOUT' }, { name: 'GND' }],
        parts: [
          {
            ref: 'V1',
            type: 'V',
            params: { value: '5' },
            pins: ['VIN', 'GND'],
          },
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['VIN', 'N1'],
          },
          {
            ref: 'R2',
            type: 'R',
            params: { value: '2k' },
            pins: ['N1', 'VOUT'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('schematic-wires');
      expect(result.svg).toContain('<path');
      expect(result.warnings).toHaveLength(0);
    });

    it('should show net labels on wires', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Labeled Nets',
        nets: [{ name: 'VCC' }, { name: 'SIGNAL' }, { name: 'GND' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['VCC', 'SIGNAL'],
          },
          {
            ref: 'R2',
            type: 'R',
            params: { value: '1k' },
            pins: ['SIGNAL', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile, { showNetLabels: true });

      expect(result.svg).toContain('SIGNAL');
      expect(result.svg).toContain('schematic-net-label');
      expect(result.warnings).toHaveLength(0);
    });

    it('should hide net labels when disabled', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'No Labels',
        nets: [{ name: 'VCC' }, { name: 'SIGNAL' }, { name: 'GND' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['VCC', 'SIGNAL'],
          },
          {
            ref: 'R2',
            type: 'R',
            params: { value: '1k' },
            pins: ['SIGNAL', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile, { showNetLabels: false });

      // Check that SIGNAL text is not rendered (CSS class will still exist in styles)
      expect(result.svg).not.toContain('>SIGNAL<');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Component Labels', () => {
    it('should show component references', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'With References',
        nets: [{ name: 'N1' }, { name: 'N2' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['N1', 'N2'],
          },
        ],
      };

      const result = renderSchematic(profile, { showReferences: true });

      expect(result.svg).toContain('>R1<');
      expect(result.warnings).toHaveLength(0);
    });

    it('should show component values', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'With Values',
        nets: [{ name: 'N1' }, { name: 'N2' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '10k' },
            pins: ['N1', 'N2'],
          },
        ],
      };

      const result = renderSchematic(profile, { showValues: true });

      expect(result.svg).toContain('10k');
      expect(result.warnings).toHaveLength(0);
    });

    it('should hide values when disabled', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'No Values',
        nets: [{ name: 'N1' }, { name: 'N2' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '10k' },
            pins: ['N1', 'N2'],
          },
        ],
      };

      const result = renderSchematic(profile, { showValues: false });

      expect(result.svg).not.toContain('10k');
      expect(result.warnings).toHaveLength(0);
    });

    it('should show source parameter for voltage sources', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'AC Source',
        nets: [{ name: 'IN' }, { name: 'GND' }],
        parts: [
          {
            ref: 'V1',
            type: 'V',
            params: { source: 'AC 1 1k' },
            pins: ['IN', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('AC 1 1k');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Options', () => {
    it('should respect custom grid size', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Custom Grid',
        nets: [{ name: 'N1' }, { name: 'N2' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['N1', 'N2'],
          },
        ],
      };

      const result = renderSchematic(profile, { gridSize: 100 });

      expect(result.svg).toContain('<svg');
      expect(result.warnings).toHaveLength(0);
    });

    it('should use vertical orientation', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Vertical Layout',
        nets: [{ name: 'VIN' }, { name: 'VOUT' }, { name: 'GND' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['VIN', 'VOUT'],
          },
          {
            ref: 'R2',
            type: 'R',
            params: { value: '2k' },
            pins: ['VOUT', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile, { orientation: 'vertical' });

      expect(result.svg).toContain('<svg');
      expect(result.warnings).toHaveLength(0);
    });

    it('should apply custom colors', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Custom Colors',
        nets: [{ name: 'N1' }, { name: 'N2' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['N1', 'N2'],
          },
        ],
      };

      const result = renderSchematic(profile, {
        wireColor: '#0066cc',
        componentColor: '#cc0000',
      });

      expect(result.svg).toContain('#0066cc');
      expect(result.svg).toContain('#cc0000');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should warn about unknown component types', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Unknown Type',
        nets: [{ name: 'N1' }, { name: 'N2' }],
        parts: [
          {
            ref: 'X1',
            type: 'UNKNOWN',
            pins: ['N1', 'N2'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Unknown component type');
    });

    it('should handle empty circuit', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Empty',
        nets: [],
        parts: [],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('</svg>');
      expect(result.warnings).toHaveLength(0);
    });

    it('should handle circuit with no nets', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'No Nets',
        nets: [],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: [],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('R1');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Complex Circuits', () => {
    it('should render voltage divider', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Voltage Divider',
        nets: [{ name: 'VIN' }, { name: 'VOUT' }, { name: 'GND' }],
        parts: [
          {
            ref: 'V1',
            type: 'V',
            params: { value: '12' },
            pins: ['VIN', 'GND'],
          },
          {
            ref: 'R1',
            type: 'R',
            params: { value: '10k' },
            pins: ['VIN', 'VOUT'],
          },
          {
            ref: 'R2',
            type: 'R',
            params: { value: '10k' },
            pins: ['VOUT', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('V1');
      expect(result.svg).toContain('R1');
      expect(result.svg).toContain('R2');
      expect(result.svg).toContain('10k');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render complete RC filter', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'RC Lowpass Filter',
        nets: [{ name: 'IN' }, { name: 'OUT' }, { name: 'GND' }],
        parts: [
          {
            ref: 'V1',
            type: 'V',
            params: { source: 'SIN(0 1 1k)' },
            pins: ['IN', 'GND'],
          },
          {
            ref: 'R1',
            type: 'R',
            params: { value: '10k' },
            pins: ['IN', 'OUT'],
          },
          {
            ref: 'C1',
            type: 'C',
            params: { value: '1n' },
            pins: ['OUT', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('SIN(0 1 1k)');
      expect(result.svg).toContain('schematic-wires');
      expect(result.svg).toContain('schematic-grounds');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Transistor Symbols', () => {
    it('should render NPN transistor', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'NPN Transistor Test',
        nets: [{ name: 'VCC' }, { name: 'BASE' }, { name: 'OUT' }, { name: 'GND' }],
        parts: [
          {
            ref: 'V1',
            type: 'V',
            params: { value: '5' },
            pins: ['VCC', 'GND'],
          },
          {
            ref: 'Q1',
            type: 'Q_NPN',
            params: { model: '2N2222' },
            pins: ['OUT', 'BASE', 'GND'], // Collector, Base, Emitter
          },
          {
            ref: 'R1',
            type: 'R',
            params: { value: '10k' },
            pins: ['VCC', 'BASE'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="Q1"');
      expect(result.svg).toContain('2N2222');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render PNP transistor', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'PNP Transistor Test',
        nets: [{ name: 'VCC' }, { name: 'BASE' }, { name: 'OUT' }, { name: 'GND' }],
        parts: [
          {
            ref: 'Q1',
            type: 'Q_PNP',
            params: { model: '2N2907' },
            pins: ['GND', 'BASE', 'VCC'], // Collector, Base, Emitter
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="Q1"');
      expect(result.svg).toContain('2N2907');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render NMOS transistor', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'NMOS Test',
        nets: [{ name: 'VDD' }, { name: 'GATE' }, { name: 'OUT' }, { name: 'GND' }],
        parts: [
          {
            ref: 'M1',
            type: 'M_NMOS',
            params: { model: 'NMOS_BASIC', w: '10u', l: '1u' },
            pins: ['OUT', 'GATE', 'GND', 'GND'], // Drain, Gate, Source, Bulk
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="M1"');
      expect(result.svg).toContain('NMOS_BASIC');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render PMOS transistor', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'PMOS Test',
        nets: [{ name: 'VDD' }, { name: 'GATE' }, { name: 'OUT' }, { name: 'GND' }],
        parts: [
          {
            ref: 'M1',
            type: 'M_PMOS',
            params: { model: 'PMOS_BASIC', w: '20u', l: '1u' },
            pins: ['OUT', 'GATE', 'VDD', 'VDD'], // Drain, Gate, Source, Bulk
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="M1"');
      expect(result.svg).toContain('PMOS_BASIC');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Advanced Symbols', () => {
    it('should render operational amplifier', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Op-Amp Test',
        nets: [{ name: 'VIN+' }, { name: 'VIN-' }, { name: 'VOUT' }, { name: 'VCC' }, { name: 'GND' }],
        parts: [
          {
            ref: 'U1',
            type: 'OPAMP',
            params: { model: 'LM358' },
            pins: ['VIN+', 'VIN-', 'VOUT', 'VCC', 'GND'], // +IN, -IN, OUT, V+, V-
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('LM358');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render transformer', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Transformer Test',
        nets: [{ name: 'AC1' }, { name: 'AC2' }, { name: 'OUT1' }, { name: 'OUT2' }],
        parts: [
          {
            ref: 'T1',
            type: 'XFMR',
            params: { ratio: '10:1' },
            pins: ['AC1', 'AC2', 'OUT1', 'OUT2'], // Primary+, Primary-, Secondary+, Secondary-
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="T1"');
      expect(result.svg).toContain('10:1');
      expect(result.warnings).toHaveLength(0);
    });
  });
});
