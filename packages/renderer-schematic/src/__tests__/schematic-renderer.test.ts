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
        nets: [
          { name: 'VIN' },
          { name: 'N1' },
          { name: 'VOUT' },
          { name: 'GND' },
        ],
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
        nets: [
          { name: 'VCC' },
          { name: 'BASE' },
          { name: 'OUT' },
          { name: 'GND' },
        ],
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
        nets: [
          { name: 'VCC' },
          { name: 'BASE' },
          { name: 'OUT' },
          { name: 'GND' },
        ],
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
        nets: [
          { name: 'VDD' },
          { name: 'GATE' },
          { name: 'OUT' },
          { name: 'GND' },
        ],
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
        nets: [
          { name: 'VDD' },
          { name: 'GATE' },
          { name: 'OUT' },
          { name: 'GND' },
        ],
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
        nets: [
          { name: 'VIN+' },
          { name: 'VIN-' },
          { name: 'VOUT' },
          { name: 'VCC' },
          { name: 'GND' },
        ],
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
        nets: [
          { name: 'AC1' },
          { name: 'AC2' },
          { name: 'OUT1' },
          { name: 'OUT2' },
        ],
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

  describe('Component Rotation', () => {
    it('should render resistor with 0 degree rotation (default)', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Rotated Resistor Test',
        nets: [{ name: 'IN' }, { name: 'OUT' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k', rotation: 0 },
            pins: ['IN', 'OUT'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="R1"');
      expect(result.svg).toContain('1k');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render resistor with 90 degree rotation', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Rotated Resistor Test',
        nets: [{ name: 'IN' }, { name: 'OUT' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k', rotation: 90 },
            pins: ['IN', 'OUT'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="R1"');
      expect(result.svg).toContain('transform="rotate(90');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render transistor with 180 degree rotation', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Rotated Transistor Test',
        nets: [{ name: 'VCC' }, { name: 'BASE' }, { name: 'GND' }],
        parts: [
          {
            ref: 'Q1',
            type: 'Q_NPN',
            params: { model: '2N2222', rotation: 180 },
            pins: ['VCC', 'BASE', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="Q1"');
      expect(result.svg).toContain('transform="rotate(180');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render capacitor with 270 degree rotation', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Rotated Capacitor Test',
        nets: [{ name: 'IN' }, { name: 'GND' }],
        parts: [
          {
            ref: 'C1',
            type: 'C',
            params: { value: '10u', rotation: 270 },
            pins: ['IN', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="C1"');
      expect(result.svg).toContain('transform="rotate(270');
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn about invalid rotation angles', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Invalid Rotation Test',
        nets: [{ name: 'IN' }, { name: 'OUT' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k', rotation: 45 },
            pins: ['IN', 'OUT'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('Invalid rotation');
    });
  });

  describe('Orthogonal Wire Routing', () => {
    it('should route wires with Manhattan distance (horizontal then vertical)', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Orthogonal Routing Test',
        nets: [{ name: 'SIGNAL' }, { name: 'GND' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['SIGNAL', 'GND'],
          },
          {
            ref: 'R2',
            type: 'R',
            params: { value: '1k' },
            pins: ['SIGNAL', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile, { routing: 'orthogonal' });

      // Should contain path with multiple line segments (L commands in SVG path)
      expect(result.svg).toContain('schematic-wire');
      expect(result.warnings).toHaveLength(0);
    });

    it('should add junction dots at wire intersections', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Junction Test',
        nets: [{ name: 'VCC' }, { name: 'GND' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['VCC', 'GND'],
          },
          {
            ref: 'R2',
            type: 'R',
            params: { value: '1k' },
            pins: ['VCC', 'GND'],
          },
          {
            ref: 'R3',
            type: 'R',
            params: { value: '1k' },
            pins: ['VCC', 'GND'],
          },
        ],
      };

      const result = renderSchematic(profile, { routing: 'orthogonal' });

      // Should contain junction circles at connection points
      expect(result.svg).toContain('schematic-junction');
      expect(result.warnings).toHaveLength(0);
    });

    it('should use direct routing by default', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Direct Routing Test',
        nets: [{ name: 'SIGNAL' }, { name: 'GND' }],
        parts: [
          {
            ref: 'R1',
            type: 'R',
            params: { value: '1k' },
            pins: ['SIGNAL', 'GND'],
          },
        ],
      };

      // Default routing should be 'direct'
      const result = renderSchematic(profile);

      expect(result.svg).toContain('schematic-wire');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Logic Gate Symbols', () => {
    it('should render 2-input AND gate', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'AND Gate',
        nets: [{ name: 'A' }, { name: 'B' }, { name: 'Y' }],
        parts: [
          {
            ref: 'U1',
            type: 'AND',
            params: {},
            pins: ['A', 'B', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('AND Gate');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 2-input OR gate', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'OR Gate',
        nets: [{ name: 'A' }, { name: 'B' }, { name: 'Y' }],
        parts: [
          {
            ref: 'U1',
            type: 'OR',
            params: {},
            pins: ['A', 'B', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('OR Gate');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render NOT gate (inverter)', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'NOT Gate',
        nets: [{ name: 'A' }, { name: 'Y' }],
        parts: [
          {
            ref: 'U1',
            type: 'NOT',
            params: {},
            pins: ['A', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('NOT Gate');
      // Check for inverter bubble (circle)
      expect(result.svg).toContain('circle');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 2-input XOR gate', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'XOR Gate',
        nets: [{ name: 'A' }, { name: 'B' }, { name: 'Y' }],
        parts: [
          {
            ref: 'U1',
            type: 'XOR',
            params: {},
            pins: ['A', 'B', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('XOR Gate');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 2-input NAND gate', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'NAND Gate',
        nets: [{ name: 'A' }, { name: 'B' }, { name: 'Y' }],
        parts: [
          {
            ref: 'U1',
            type: 'NAND',
            params: {},
            pins: ['A', 'B', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('NAND Gate');
      // NAND should have inverter bubble on output
      expect(result.svg).toContain('circle');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 2-input NOR gate', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'NOR Gate',
        nets: [{ name: 'A' }, { name: 'B' }, { name: 'Y' }],
        parts: [
          {
            ref: 'U1',
            type: 'NOR',
            params: {},
            pins: ['A', 'B', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('NOR Gate');
      // NOR should have inverter bubble on output
      expect(result.svg).toContain('circle');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render BUFFER gate', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Buffer',
        nets: [{ name: 'A' }, { name: 'Y' }],
        parts: [
          {
            ref: 'U1',
            type: 'BUFFER',
            params: {},
            pins: ['A', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('Buffer');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render half adder with multiple logic gates', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Half Adder',
        nets: [
          { name: 'A' },
          { name: 'B' },
          { name: 'SUM' },
          { name: 'CARRY' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'XOR',
            params: {},
            pins: ['A', 'B', 'SUM'],
          },
          {
            ref: 'U2',
            type: 'AND',
            params: {},
            pins: ['A', 'B', 'CARRY'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('data-ref="U2"');
      expect(result.svg).toContain('Half Adder');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render SR latch with NAND gates', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'SR Latch',
        nets: [{ name: 'S' }, { name: 'R' }, { name: 'Q' }, { name: 'Qn' }],
        parts: [
          {
            ref: 'U1',
            type: 'NAND',
            params: {},
            pins: ['S', 'Qn', 'Q'],
          },
          {
            ref: 'U2',
            type: 'NAND',
            params: {},
            pins: ['R', 'Q', 'Qn'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('data-ref="U2"');
      expect(result.svg).toContain('SR Latch');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Advanced Digital Components', () => {
    it('should render XNOR gate with inverter bubble', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'XNOR Gate',
        nets: [{ name: 'A' }, { name: 'B' }, { name: 'Y' }],
        parts: [
          {
            ref: 'U1',
            type: 'XNOR',
            params: {},
            pins: ['A', 'B', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('circle'); // Inverter bubble
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 3-input AND gate', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '3-Input AND',
        nets: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'Y' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'AND3',
            params: {},
            pins: ['A', 'B', 'C', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('3-Input AND');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 3-input OR gate', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '3-Input OR',
        nets: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'Y' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'OR3',
            params: {},
            pins: ['A', 'B', 'C', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 3-input NAND gate with bubble', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '3-Input NAND',
        nets: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'Y' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'NAND3',
            params: {},
            pins: ['A', 'B', 'C', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('circle'); // Inverter bubble
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 3-input NOR gate with bubble', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '3-Input NOR',
        nets: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'Y' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'NOR3',
            params: {},
            pins: ['A', 'B', 'C', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('circle'); // Inverter bubble
      expect(result.warnings).toHaveLength(0);
    });

    it('should render D flip-flop with clock triangle', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'D Flip-Flop',
        nets: [
          { name: 'D' },
          { name: 'CLK' },
          { name: 'Q' },
          { name: 'QN' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'DFF',
            params: {},
            pins: ['D', 'CLK', 'Q', 'QN'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('D Flip-Flop');
      expect(result.svg).toContain('rect'); // Rectangular body
      expect(result.warnings).toHaveLength(0);
    });

    it('should render JK flip-flop', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'JK Flip-Flop',
        nets: [
          { name: 'J' },
          { name: 'K' },
          { name: 'CLK' },
          { name: 'Q' },
          { name: 'QN' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'JKFF',
            params: {},
            pins: ['J', 'CLK', 'K', 'Q', 'QN'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('JK Flip-Flop');
      expect(result.svg).toContain('rect');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render T flip-flop', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'T Flip-Flop',
        nets: [
          { name: 'T' },
          { name: 'CLK' },
          { name: 'Q' },
          { name: 'QN' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'TFF',
            params: {},
            pins: ['T', 'CLK', 'Q', 'QN'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('T Flip-Flop');
      expect(result.svg).toContain('rect');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 4-bit register', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '4-bit Register',
        nets: [
          { name: 'D0' },
          { name: 'D1' },
          { name: 'D2' },
          { name: 'D3' },
          { name: 'CLK' },
          { name: 'EN' },
          { name: 'Q0' },
          { name: 'Q1' },
          { name: 'Q2' },
          { name: 'Q3' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'REG4',
            params: {},
            pins: [
              'D0',
              'D1',
              'D2',
              'D3',
              'CLK',
              'EN',
              'Q0',
              'Q1',
              'Q2',
              'Q3',
            ],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('4-bit Register');
      expect(result.svg).toContain('REG');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 8-bit register', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '8-bit Register',
        nets: [
          { name: 'D0' },
          { name: 'D1' },
          { name: 'D2' },
          { name: 'D3' },
          { name: 'D4' },
          { name: 'D5' },
          { name: 'D6' },
          { name: 'D7' },
          { name: 'CLK' },
          { name: 'EN' },
          { name: 'Q0' },
          { name: 'Q1' },
          { name: 'Q2' },
          { name: 'Q3' },
          { name: 'Q4' },
          { name: 'Q5' },
          { name: 'Q6' },
          { name: 'Q7' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'REG8',
            params: {},
            pins: [
              'D0',
              'D1',
              'D2',
              'D3',
              'D4',
              'D5',
              'D6',
              'D7',
              'CLK',
              'EN',
              'Q0',
              'Q1',
              'Q2',
              'Q3',
              'Q4',
              'Q5',
              'Q6',
              'Q7',
            ],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('8-bit Register');
      expect(result.svg).toContain('REG');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render full adder with 3-input gates', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Full Adder (3-input)',
        nets: [
          { name: 'A' },
          { name: 'B' },
          { name: 'CIN' },
          { name: 'SUM' },
          { name: 'COUT' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'XOR',
            params: {},
            pins: ['A', 'B', 'SUM'],
          },
          {
            ref: 'U2',
            type: 'AND3',
            params: {},
            pins: ['A', 'B', 'CIN', 'COUT'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('data-ref="U2"');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 2-bit counter with flip-flops', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '2-bit Counter',
        nets: [
          { name: 'CLK' },
          { name: 'Q0' },
          { name: 'Q0N' },
          { name: 'Q1' },
          { name: 'Q1N' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'TFF',
            params: {},
            pins: ['Q0N', 'CLK', 'Q0', 'Q0N'],
          },
          {
            ref: 'U2',
            type: 'TFF',
            params: {},
            pins: ['Q1N', 'Q0', 'Q1', 'Q1N'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('data-ref="U2"');
      expect(result.svg).toContain('2-bit Counter');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render equality comparator with XNOR gates', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Equality Comparator',
        nets: [
          { name: 'A0' },
          { name: 'A1' },
          { name: 'B0' },
          { name: 'B1' },
          { name: 'EQ0' },
          { name: 'EQ1' },
          { name: 'EQUAL' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'XNOR',
            params: {},
            pins: ['A0', 'B0', 'EQ0'],
          },
          {
            ref: 'U2',
            type: 'XNOR',
            params: {},
            pins: ['A1', 'B1', 'EQ1'],
          },
          {
            ref: 'U3',
            type: 'AND',
            params: {},
            pins: ['EQ0', 'EQ1', 'EQUAL'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('data-ref="U2"');
      expect(result.svg).toContain('data-ref="U3"');
      expect(result.svg).toContain('Equality Comparator');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render majority gate with 3-input logic', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Majority Gate',
        nets: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'AND1' },
          { name: 'AND2' },
          { name: 'AND3' },
          { name: 'Y' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'AND',
            params: {},
            pins: ['A', 'B', 'AND1'],
          },
          {
            ref: 'U2',
            type: 'AND',
            params: {},
            pins: ['B', 'C', 'AND2'],
          },
          {
            ref: 'U3',
            type: 'AND',
            params: {},
            pins: ['A', 'C', 'AND3'],
          },
          {
            ref: 'U4',
            type: 'OR3',
            params: {},
            pins: ['AND1', 'AND2', 'AND3', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('data-ref="U2"');
      expect(result.svg).toContain('data-ref="U3"');
      expect(result.svg).toContain('data-ref="U4"');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Multiplexers and Decoders', () => {
    it('should render 4-to-1 MUX with trapezoidal shape', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '4-to-1 Multiplexer',
        nets: [
          { name: 'D0' },
          { name: 'D1' },
          { name: 'D2' },
          { name: 'D3' },
          { name: 'S0' },
          { name: 'S1' },
          { name: 'Y' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'MUX41',
            params: {},
            pins: ['D0', 'D1', 'D2', 'D3', 'S0', 'S1', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('MUX'); // Label
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 8-to-1 MUX with 8:1 label', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '8-to-1 Multiplexer',
        nets: [
          { name: 'D0' },
          { name: 'D1' },
          { name: 'D2' },
          { name: 'D3' },
          { name: 'D4' },
          { name: 'D5' },
          { name: 'D6' },
          { name: 'D7' },
          { name: 'S0' },
          { name: 'S1' },
          { name: 'S2' },
          { name: 'Y' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'MUX81',
            params: {},
            pins: ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'S0', 'S1', 'S2', 'Y'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('MUX');
      expect(result.svg).toContain('8:1');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 2-to-4 decoder with inverted trapezoid', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '2-to-4 Decoder',
        nets: [
          { name: 'A0' },
          { name: 'A1' },
          { name: 'EN' },
          { name: 'Y0' },
          { name: 'Y1' },
          { name: 'Y2' },
          { name: 'Y3' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'DEC24',
            params: {},
            pins: ['A0', 'A1', 'EN', 'Y0', 'Y1', 'Y2', 'Y3'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('DEC');
      expect(result.svg).toContain('2:4');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render 3-to-8 decoder with 3:8 label', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '3-to-8 Decoder',
        nets: [
          { name: 'A0' },
          { name: 'A1' },
          { name: 'A2' },
          { name: 'EN' },
          { name: 'Y0' },
          { name: 'Y1' },
          { name: 'Y2' },
          { name: 'Y3' },
          { name: 'Y4' },
          { name: 'Y5' },
          { name: 'Y6' },
          { name: 'Y7' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'DEC38',
            params: {},
            pins: ['A0', 'A1', 'A2', 'EN', 'Y0', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('DEC');
      expect(result.svg).toContain('3:8');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render ALU data path with MUX selector', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Simple ALU with MUX',
        nets: [
          { name: 'ADD_RESULT' },
          { name: 'SUB_RESULT' },
          { name: 'AND_RESULT' },
          { name: 'OR_RESULT' },
          { name: 'OP0' },
          { name: 'OP1' },
          { name: 'OUTPUT' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'MUX41',
            params: {},
            pins: ['ADD_RESULT', 'SUB_RESULT', 'AND_RESULT', 'OR_RESULT', 'OP0', 'OP1', 'OUTPUT'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('MUX');
      expect(result.svg).toContain('Simple ALU with MUX');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render memory address decoder circuit', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: 'Memory Address Decoder',
        nets: [
          { name: 'ADDR0' },
          { name: 'ADDR1' },
          { name: 'ADDR2' },
          { name: 'CS' },
          { name: 'MEM0' },
          { name: 'MEM1' },
          { name: 'MEM2' },
          { name: 'MEM3' },
          { name: 'MEM4' },
          { name: 'MEM5' },
          { name: 'MEM6' },
          { name: 'MEM7' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'DEC38',
            params: {},
            pins: ['ADDR0', 'ADDR1', 'ADDR2', 'CS', 'MEM0', 'MEM1', 'MEM2', 'MEM3', 'MEM4', 'MEM5', 'MEM6', 'MEM7'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('DEC');
      expect(result.svg).toContain('3:8');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render data selector with cascaded MUXes', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '8-input Data Selector',
        nets: [
          { name: 'D0' },
          { name: 'D1' },
          { name: 'D2' },
          { name: 'D3' },
          { name: 'D4' },
          { name: 'D5' },
          { name: 'D6' },
          { name: 'D7' },
          { name: 'SEL0' },
          { name: 'SEL1' },
          { name: 'SEL2' },
          { name: 'OUT' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'MUX81',
            params: {},
            pins: ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'SEL0', 'SEL1', 'SEL2', 'OUT'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('8:1');
      expect(result.warnings).toHaveLength(0);
    });

    it('should render demultiplexer using decoder with enable', () => {
      const profile: ElectricalProfile = {
        type: 'electrical',
        name: '1-to-4 Demux (using decoder)',
        nets: [
          { name: 'A0' },
          { name: 'A1' },
          { name: 'DATA_IN' },
          { name: 'OUT0' },
          { name: 'OUT1' },
          { name: 'OUT2' },
          { name: 'OUT3' },
        ],
        parts: [
          {
            ref: 'U1',
            type: 'DEC24',
            params: {},
            pins: ['A0', 'A1', 'DATA_IN', 'OUT0', 'OUT1', 'OUT2', 'OUT3'],
          },
        ],
      };

      const result = renderSchematic(profile);

      expect(result.svg).toContain('data-ref="U1"');
      expect(result.svg).toContain('DEC');
      expect(result.svg).toContain('2:4');
      expect(result.warnings).toHaveLength(0);
    });
  });
});


