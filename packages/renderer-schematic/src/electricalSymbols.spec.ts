import { describe, expect, it } from 'vitest';
import {
  // Logic gates (3-input)
  and3Gate,
  // Logic gates (2-input)
  andGate,
  bufferGate,
  capacitor,
  currentSource,
  // Decoders
  decoder2to4,
  decoder3to8,
  // Sequential logic
  dFlipFlop,
  // Semiconductors
  diode,
  ground,
  inductor,
  jkFlipFlop,
  junction,
  led,
  // Multiplexers
  mux4to1,
  mux8to1,
  nand3Gate,
  nandGate,
  nmosTransistor,
  nor3Gate,
  norGate,
  notGate,
  // Transistors
  npnTransistor,
  // Analog
  opamp,
  or3Gate,
  orGate,
  pmosTransistor,
  pnpTransistor,
  // Registers
  register4,
  register8,
  // Passive components
  resistor,
  tFlipFlop,
  transformer,
  // Sources
  voltageSource,
  xnorGate,
  xorGate,
} from './electricalSymbols.js';

describe('electricalSymbols', () => {
  describe('Passive Components', () => {
    describe('resistor', () => {
      it('should have correct symbol definition', () => {
        expect(resistor.id).toBe('resistor');
        expect(resistor.width).toBe(60);
        expect(resistor.height).toBe(20);
        expect(resistor.terminals).toHaveLength(2);
      });

      it('should have left and right terminals', () => {
        expect(resistor.terminals[0]).toEqual({ x: 0, y: 10, name: 'left' });
        expect(resistor.terminals[1]).toEqual({ x: 60, y: 10, name: 'right' });
      });

      it('should render SVG with zigzag pattern', () => {
        const svg = resistor.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('stroke="currentColor"');
        expect(svg).toContain('stroke-width="2"');
        expect(svg).toContain('fill="none"');
      });

      it('should render at custom position', () => {
        const svg = resistor.render(100, 200);
        expect(svg).toBeDefined();
        expect(svg.length).toBeGreaterThan(0);
      });
    });

    describe('capacitor', () => {
      it('should have correct symbol definition', () => {
        expect(capacitor.id).toBe('capacitor');
        expect(capacitor.width).toBe(40);
        expect(capacitor.height).toBe(30);
        expect(capacitor.terminals).toHaveLength(2);
      });

      it('should have left and right terminals', () => {
        expect(capacitor.terminals[0]).toEqual({ x: 0, y: 15, name: 'left' });
        expect(capacitor.terminals[1]).toEqual({ x: 40, y: 15, name: 'right' });
      });

      it('should render SVG with parallel plates', () => {
        const svg = capacitor.render(0, 0);
        expect(svg).toContain('<line');
        expect(svg).toContain('stroke-width="2"');
      });
    });

    describe('inductor', () => {
      it('should have correct symbol definition', () => {
        expect(inductor.id).toBe('inductor');
        expect(inductor.width).toBe(60);
        expect(inductor.height).toBe(24);
        expect(inductor.terminals).toHaveLength(2);
      });

      it('should have left and right terminals', () => {
        expect(inductor.terminals[0]).toEqual({ x: 0, y: 12, name: 'left' });
        expect(inductor.terminals[1]).toEqual({ x: 60, y: 12, name: 'right' });
      });

      it('should render SVG with coil pattern', () => {
        const svg = inductor.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('stroke="currentColor"');
        expect(svg).toContain('fill="none"');
      });
    });
  });

  describe('Sources', () => {
    describe('voltageSource', () => {
      it('should have correct symbol definition', () => {
        expect(voltageSource.id).toBe('voltage-source');
        expect(voltageSource.width).toBe(40);
        expect(voltageSource.height).toBe(40);
        expect(voltageSource.terminals).toHaveLength(2);
      });

      it('should have positive and negative terminals', () => {
        expect(voltageSource.terminals[0].name).toBe('negative');
        expect(voltageSource.terminals[1].name).toBe('positive');
      });

      it('should render SVG with circle and polarity marks', () => {
        const svg = voltageSource.render(0, 0);
        expect(svg).toContain('<circle');
        expect(svg).toContain('<text');
      });
    });

    describe('currentSource', () => {
      it('should have correct symbol definition', () => {
        expect(currentSource.id).toBe('current-source');
        expect(currentSource.width).toBe(40);
        expect(currentSource.height).toBe(40);
        expect(currentSource.terminals).toHaveLength(2);
      });

      it('should render SVG with circle and arrow', () => {
        const svg = currentSource.render(0, 0);
        expect(svg).toContain('<circle');
        expect(svg).toContain('<path');
      });
    });

    describe('ground', () => {
      it('should have correct symbol definition', () => {
        expect(ground.id).toBe('ground');
        expect(ground.width).toBe(30);
        expect(ground.height).toBe(25);
        expect(ground.terminals).toHaveLength(1);
      });

      it('should have top terminal', () => {
        expect(ground.terminals[0]).toEqual({ x: 15, y: 0, name: 'terminal' });
      });

      it('should render SVG with ground symbol', () => {
        const svg = ground.render(0, 0);
        expect(svg).toContain('<line');
      });
    });
  });

  describe('Semiconductors', () => {
    describe('diode', () => {
      it('should have correct symbol definition', () => {
        expect(diode.id).toBe('diode');
        expect(diode.width).toBe(40);
        expect(diode.height).toBe(30);
        expect(diode.terminals).toHaveLength(2);
      });

      it('should have anode and cathode terminals', () => {
        expect(diode.terminals[0].name).toBe('anode');
        expect(diode.terminals[1].name).toBe('cathode');
      });

      it('should render SVG with triangle and line', () => {
        const svg = diode.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('<line');
      });
    });

    describe('led', () => {
      it('should have correct symbol definition', () => {
        expect(led.id).toBe('led');
        expect(led.width).toBe(40);
        expect(led.height).toBe(40);
        expect(led.terminals).toHaveLength(2);
      });

      it('should have anode and cathode terminals', () => {
        expect(led.terminals[0].name).toBe('anode');
        expect(led.terminals[1].name).toBe('cathode');
      });

      it('should render SVG with diode and light arrows', () => {
        const svg = led.render(0, 0);
        expect(svg).toContain('<path');
      });
    });

    describe('junction', () => {
      it('should have correct symbol definition', () => {
        expect(junction.id).toBe('junction');
        expect(junction.width).toBe(8);
        expect(junction.height).toBe(8);
        expect(junction.terminals).toHaveLength(1);
      });

      it('should render SVG with filled circle', () => {
        const svg = junction.render(0, 0);
        expect(svg).toContain('<circle');
        expect(svg).toContain('fill="currentColor"');
      });
    });
  });

  describe('Transistors', () => {
    describe('npnTransistor', () => {
      it('should have correct symbol definition', () => {
        expect(npnTransistor.id).toBe('npn');
        expect(npnTransistor.width).toBe(50);
        expect(npnTransistor.height).toBe(60);
        expect(npnTransistor.terminals).toHaveLength(3);
      });

      it('should have base, collector, and emitter terminals', () => {
        expect(npnTransistor.terminals[0].name).toBe('collector');
        expect(npnTransistor.terminals[1].name).toBe('base');
        expect(npnTransistor.terminals[2].name).toBe('emitter');
      });

      it('should render SVG with transistor structure', () => {
        const svg = npnTransistor.render(0, 0);
        expect(svg).toContain('<line');
        expect(svg).toContain('<path');
      });
    });

    describe('pnpTransistor', () => {
      it('should have correct symbol definition', () => {
        expect(pnpTransistor.id).toBe('pnp');
        expect(pnpTransistor.width).toBe(50);
        expect(pnpTransistor.height).toBe(60);
        expect(pnpTransistor.terminals).toHaveLength(3);
      });

      it('should have base, collector, and emitter terminals', () => {
        expect(pnpTransistor.terminals[0].name).toBe('collector');
        expect(pnpTransistor.terminals[1].name).toBe('base');
        expect(pnpTransistor.terminals[2].name).toBe('emitter');
      });

      it('should render SVG with transistor structure', () => {
        const svg = pnpTransistor.render(0, 0);
        expect(svg).toContain('<line');
        expect(svg).toContain('<path');
      });
    });

    describe('nmosTransistor', () => {
      it('should have correct symbol definition', () => {
        expect(nmosTransistor.id).toBe('nmos');
        expect(nmosTransistor.width).toBe(50);
        expect(nmosTransistor.height).toBe(60);
        expect(nmosTransistor.terminals).toHaveLength(4);
      });

      it('should have gate, drain, source, and bulk terminals', () => {
        const terminalNames = nmosTransistor.terminals.map((t) => t.name);
        expect(terminalNames).toContain('gate');
        expect(terminalNames).toContain('drain');
        expect(terminalNames).toContain('source');
        expect(terminalNames).toContain('bulk');
      });

      it('should render SVG with MOSFET structure', () => {
        const svg = nmosTransistor.render(0, 0);
        expect(svg).toContain('<line');
        expect(svg).toContain('<path');
      });
    });

    describe('pmosTransistor', () => {
      it('should have correct symbol definition', () => {
        expect(pmosTransistor.id).toBe('pmos');
        expect(pmosTransistor.width).toBe(50);
        expect(pmosTransistor.height).toBe(60);
        expect(pmosTransistor.terminals).toHaveLength(4);
      });

      it('should have gate, drain, source, and bulk terminals', () => {
        const terminalNames = pmosTransistor.terminals.map((t) => t.name);
        expect(terminalNames).toContain('gate');
        expect(terminalNames).toContain('drain');
        expect(terminalNames).toContain('source');
        expect(terminalNames).toContain('bulk');
      });

      it('should render SVG with PMOS structure', () => {
        const svg = pmosTransistor.render(0, 0);
        expect(svg).toContain('<line');
        expect(svg).toContain('<circle');
      });
    });
  });

  describe('Analog Components', () => {
    describe('opamp', () => {
      it('should have correct symbol definition', () => {
        expect(opamp.id).toBe('opamp');
        expect(opamp.width).toBe(60);
        expect(opamp.height).toBe(60);
        expect(opamp.terminals).toHaveLength(5);
      });

      it('should have noninverting, inverting, output, and power terminals', () => {
        const terminalNames = opamp.terminals.map((t) => t.name);
        expect(terminalNames).toContain('noninverting');
        expect(terminalNames).toContain('inverting');
        expect(terminalNames).toContain('output');
        expect(terminalNames).toContain('vplus');
        expect(terminalNames).toContain('vminus');
      });

      it('should render SVG with triangle shape', () => {
        const svg = opamp.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('<text');
      });
    });

    describe('transformer', () => {
      it('should have correct symbol definition', () => {
        expect(transformer.id).toBe('transformer');
        expect(transformer.width).toBe(80);
        expect(transformer.height).toBe(60);
        expect(transformer.terminals).toHaveLength(4);
      });

      it('should have primary and secondary terminals', () => {
        const terminalNames = transformer.terminals.map((t) => t.name);
        expect(terminalNames).toContain('pri_plus');
        expect(terminalNames).toContain('pri_minus');
        expect(terminalNames).toContain('sec_plus');
        expect(terminalNames).toContain('sec_minus');
      });

      it('should render SVG with two coils', () => {
        const svg = transformer.render(0, 0);
        expect(svg).toContain('<path');
      });
    });
  });

  describe('Logic Gates - 2 Input', () => {
    describe('andGate', () => {
      it('should have correct symbol definition', () => {
        expect(andGate.id).toBe('and');
        expect(andGate.width).toBe(60);
        expect(andGate.height).toBe(40);
        expect(andGate.terminals).toHaveLength(3);
      });

      it('should have two inputs and one output', () => {
        const terminalNames = andGate.terminals.map((t) => t.name);
        expect(terminalNames).toContain('A');
        expect(terminalNames).toContain('B');
        expect(terminalNames).toContain('Y');
      });

      it('should render SVG with AND gate shape', () => {
        const svg = andGate.render(0, 0);
        expect(svg).toContain('<path');
      });
    });

    describe('orGate', () => {
      it('should have correct symbol definition', () => {
        expect(orGate.id).toBe('or');
        expect(orGate.terminals).toHaveLength(3);
      });

      it('should render SVG with OR gate shape', () => {
        const svg = orGate.render(0, 0);
        expect(svg).toContain('<path');
      });
    });

    describe('notGate', () => {
      it('should have correct symbol definition', () => {
        expect(notGate.id).toBe('not');
        expect(notGate.terminals).toHaveLength(2);
      });

      it('should have input and output terminals', () => {
        const terminalNames = notGate.terminals.map((t) => t.name);
        expect(terminalNames).toContain('A');
        expect(terminalNames).toContain('Y');
      });

      it('should render SVG with inverter bubble', () => {
        const svg = notGate.render(0, 0);
        expect(svg).toContain('<circle');
      });
    });

    describe('xorGate', () => {
      it('should have correct symbol definition', () => {
        expect(xorGate.id).toBe('xor');
        expect(xorGate.terminals).toHaveLength(3);
      });

      it('should render SVG with XOR gate shape', () => {
        const svg = xorGate.render(0, 0);
        expect(svg).toContain('<path');
      });
    });

    describe('nandGate', () => {
      it('should have correct symbol definition', () => {
        expect(nandGate.id).toBe('nand');
        expect(nandGate.terminals).toHaveLength(3);
      });

      it('should render SVG with NAND gate shape and bubble', () => {
        const svg = nandGate.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('<circle');
      });
    });

    describe('norGate', () => {
      it('should have correct symbol definition', () => {
        expect(norGate.id).toBe('nor');
        expect(norGate.terminals).toHaveLength(3);
      });

      it('should render SVG with NOR gate shape and bubble', () => {
        const svg = norGate.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('<circle');
      });
    });

    describe('bufferGate', () => {
      it('should have correct symbol definition', () => {
        expect(bufferGate.id).toBe('buffer');
        expect(bufferGate.terminals).toHaveLength(2);
      });

      it('should render SVG with buffer triangle', () => {
        const svg = bufferGate.render(0, 0);
        expect(svg).toContain('<path');
      });
    });

    describe('xnorGate', () => {
      it('should have correct symbol definition', () => {
        expect(xnorGate.id).toBe('xnor');
        expect(xnorGate.terminals).toHaveLength(3);
      });

      it('should render SVG with XNOR gate shape', () => {
        const svg = xnorGate.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('<circle');
      });
    });
  });

  describe('Logic Gates - 3 Input', () => {
    describe('and3Gate', () => {
      it('should have correct symbol definition', () => {
        expect(and3Gate.id).toBe('and3');
        expect(and3Gate.terminals).toHaveLength(4);
      });

      it('should have three inputs and one output', () => {
        const terminalNames = and3Gate.terminals.map((t) => t.name);
        expect(terminalNames).toContain('A');
        expect(terminalNames).toContain('B');
        expect(terminalNames).toContain('C');
        expect(terminalNames).toContain('Y');
      });

      it('should render SVG with 3-input AND gate', () => {
        const svg = and3Gate.render(0, 0);
        expect(svg).toContain('<path');
      });
    });

    describe('or3Gate', () => {
      it('should have correct symbol definition', () => {
        expect(or3Gate.id).toBe('or3');
        expect(or3Gate.terminals).toHaveLength(4);
      });

      it('should render SVG with 3-input OR gate', () => {
        const svg = or3Gate.render(0, 0);
        expect(svg).toContain('<path');
      });
    });

    describe('nand3Gate', () => {
      it('should have correct symbol definition', () => {
        expect(nand3Gate.id).toBe('nand3');
        expect(nand3Gate.terminals).toHaveLength(4);
      });

      it('should render SVG with 3-input NAND gate and bubble', () => {
        const svg = nand3Gate.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('<circle');
      });
    });

    describe('nor3Gate', () => {
      it('should have correct symbol definition', () => {
        expect(nor3Gate.id).toBe('nor3');
        expect(nor3Gate.terminals).toHaveLength(4);
      });

      it('should render SVG with 3-input NOR gate and bubble', () => {
        const svg = nor3Gate.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('<circle');
      });
    });
  });

  describe('Sequential Logic', () => {
    describe('dFlipFlop', () => {
      it('should have correct symbol definition', () => {
        expect(dFlipFlop.id).toBe('dff');
        expect(dFlipFlop.width).toBe(80);
        expect(dFlipFlop.height).toBe(60);
        expect(dFlipFlop.terminals.length).toBeGreaterThanOrEqual(4);
      });

      it('should have D, CLK, Q, and QN terminals', () => {
        const terminalNames = dFlipFlop.terminals.map((t) => t.name);
        expect(terminalNames).toContain('D');
        expect(terminalNames).toContain('CLK');
        expect(terminalNames).toContain('Q');
        expect(terminalNames).toContain('QN');
      });

      it('should render SVG with flip-flop box', () => {
        const svg = dFlipFlop.render(0, 0);
        expect(svg).toContain('<rect');
        expect(svg).toContain('<text');
      });
    });

    describe('jkFlipFlop', () => {
      it('should have correct symbol definition', () => {
        expect(jkFlipFlop.id).toBe('jkff');
        expect(jkFlipFlop.terminals.length).toBeGreaterThanOrEqual(5);
      });

      it('should have J, K, CLK, Q, and QN terminals', () => {
        const terminalNames = jkFlipFlop.terminals.map((t) => t.name);
        expect(terminalNames).toContain('J');
        expect(terminalNames).toContain('K');
        expect(terminalNames).toContain('CLK');
        expect(terminalNames).toContain('Q');
        expect(terminalNames).toContain('QN');
      });

      it('should render SVG with flip-flop box', () => {
        const svg = jkFlipFlop.render(0, 0);
        expect(svg).toContain('<rect');
        expect(svg).toContain('<text');
      });
    });

    describe('tFlipFlop', () => {
      it('should have correct symbol definition', () => {
        expect(tFlipFlop.id).toBe('tff');
        expect(tFlipFlop.terminals.length).toBeGreaterThanOrEqual(4);
      });

      it('should have T, CLK, Q, and QN terminals', () => {
        const terminalNames = tFlipFlop.terminals.map((t) => t.name);
        expect(terminalNames).toContain('T');
        expect(terminalNames).toContain('CLK');
        expect(terminalNames).toContain('Q');
        expect(terminalNames).toContain('QN');
      });

      it('should render SVG with flip-flop box', () => {
        const svg = tFlipFlop.render(0, 0);
        expect(svg).toContain('<rect');
        expect(svg).toContain('<text');
      });
    });
  });

  describe('Registers', () => {
    describe('register4', () => {
      it('should have correct symbol definition', () => {
        expect(register4.id).toBe('reg4');
        expect(register4.width).toBe(100);
        expect(register4.height).toBe(80);
        expect(register4.terminals.length).toBeGreaterThanOrEqual(10);
      });

      it('should have 4 data inputs and 4 outputs', () => {
        const terminalNames = register4.terminals.map((t) => t.name);
        expect(terminalNames).toContain('D0');
        expect(terminalNames).toContain('D1');
        expect(terminalNames).toContain('D2');
        expect(terminalNames).toContain('D3');
        expect(terminalNames).toContain('Q0');
        expect(terminalNames).toContain('Q1');
        expect(terminalNames).toContain('Q2');
        expect(terminalNames).toContain('Q3');
      });

      it('should render SVG with register box', () => {
        const svg = register4.render(0, 0);
        expect(svg).toContain('<rect');
        expect(svg).toContain('<text');
      });
    });

    describe('register8', () => {
      it('should have correct symbol definition', () => {
        expect(register8.id).toBe('reg8');
        expect(register8.width).toBe(120);
        expect(register8.height).toBe(100);
        expect(register8.terminals.length).toBeGreaterThanOrEqual(18);
      });

      it('should have 8 data inputs and 8 outputs', () => {
        const terminalNames = register8.terminals.map((t) => t.name);
        expect(terminalNames).toContain('D0');
        expect(terminalNames).toContain('D7');
        expect(terminalNames).toContain('Q0');
        expect(terminalNames).toContain('Q7');
      });

      it('should render SVG with register box', () => {
        const svg = register8.render(0, 0);
        expect(svg).toContain('<rect');
        expect(svg).toContain('<text');
      });
    });
  });

  describe('Multiplexers', () => {
    describe('mux4to1', () => {
      it('should have correct symbol definition', () => {
        expect(mux4to1.id).toBe('mux41');
        expect(mux4to1.width).toBe(60);
        expect(mux4to1.height).toBe(80);
        expect(mux4to1.terminals.length).toBeGreaterThanOrEqual(7);
      });

      it('should have 4 data inputs, 2 select lines, and 1 output', () => {
        const terminalNames = mux4to1.terminals.map((t) => t.name);
        expect(terminalNames).toContain('D0');
        expect(terminalNames).toContain('D1');
        expect(terminalNames).toContain('D2');
        expect(terminalNames).toContain('D3');
        expect(terminalNames).toContain('S0');
        expect(terminalNames).toContain('S1');
        expect(terminalNames).toContain('Y');
      });

      it('should render SVG with MUX shape', () => {
        const svg = mux4to1.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('<text');
      });
    });

    describe('mux8to1', () => {
      it('should have correct symbol definition', () => {
        expect(mux8to1.id).toBe('mux81');
        expect(mux8to1.width).toBe(70);
        expect(mux8to1.height).toBe(120);
        expect(mux8to1.terminals.length).toBeGreaterThanOrEqual(12);
      });

      it('should have 8 data inputs, 3 select lines, and 1 output', () => {
        const terminalNames = mux8to1.terminals.map((t) => t.name);
        expect(terminalNames).toContain('D0');
        expect(terminalNames).toContain('D7');
        expect(terminalNames).toContain('S0');
        expect(terminalNames).toContain('S1');
        expect(terminalNames).toContain('S2');
        expect(terminalNames).toContain('Y');
      });

      it('should render SVG with MUX shape', () => {
        const svg = mux8to1.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('<text');
      });
    });
  });

  describe('Decoders', () => {
    describe('decoder2to4', () => {
      it('should have correct symbol definition', () => {
        expect(decoder2to4.id).toBe('dec24');
        expect(decoder2to4.width).toBe(60);
        expect(decoder2to4.height).toBe(70);
        expect(decoder2to4.terminals.length).toBeGreaterThanOrEqual(6);
      });

      it('should have 2 inputs and 4 outputs', () => {
        const terminalNames = decoder2to4.terminals.map((t) => t.name);
        expect(terminalNames).toContain('A0');
        expect(terminalNames).toContain('A1');
        expect(terminalNames).toContain('Y0');
        expect(terminalNames).toContain('Y1');
        expect(terminalNames).toContain('Y2');
        expect(terminalNames).toContain('Y3');
      });

      it('should render SVG with decoder shape', () => {
        const svg = decoder2to4.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('<text');
      });
    });

    describe('decoder3to8', () => {
      it('should have correct symbol definition', () => {
        expect(decoder3to8.id).toBe('dec38');
        expect(decoder3to8.width).toBe(70);
        expect(decoder3to8.height).toBe(110);
        expect(decoder3to8.terminals.length).toBeGreaterThanOrEqual(11);
      });

      it('should have 3 inputs and 8 outputs', () => {
        const terminalNames = decoder3to8.terminals.map((t) => t.name);
        expect(terminalNames).toContain('A0');
        expect(terminalNames).toContain('A1');
        expect(terminalNames).toContain('A2');
        expect(terminalNames).toContain('Y0');
        expect(terminalNames).toContain('Y7');
      });

      it('should render SVG with decoder shape', () => {
        const svg = decoder3to8.render(0, 0);
        expect(svg).toContain('<path');
        expect(svg).toContain('<text');
      });
    });
  });

  describe('Symbol rendering consistency', () => {
    const allSymbols = [
      resistor,
      capacitor,
      inductor,
      voltageSource,
      currentSource,
      ground,
      diode,
      led,
      junction,
      npnTransistor,
      pnpTransistor,
      nmosTransistor,
      pmosTransistor,
      opamp,
      transformer,
      andGate,
      orGate,
      notGate,
      xorGate,
      nandGate,
      norGate,
      bufferGate,
      xnorGate,
      and3Gate,
      or3Gate,
      nand3Gate,
      nor3Gate,
      dFlipFlop,
      jkFlipFlop,
      tFlipFlop,
      register4,
      register8,
      mux4to1,
      mux8to1,
      decoder2to4,
      decoder3to8,
    ];

    it('should have all symbols defined', () => {
      expect(allSymbols).toHaveLength(36);
      allSymbols.forEach((symbol) => {
        expect(symbol).toBeDefined();
      });
    });

    it('should have valid SymbolDefinition structure for all symbols', () => {
      allSymbols.forEach((symbol) => {
        expect(symbol.id).toBeDefined();
        expect(typeof symbol.id).toBe('string');
        expect(symbol.width).toBeDefined();
        expect(typeof symbol.width).toBe('number');
        expect(symbol.width).toBeGreaterThan(0);
        expect(symbol.height).toBeDefined();
        expect(typeof symbol.height).toBe('number');
        expect(symbol.height).toBeGreaterThan(0);
        expect(Array.isArray(symbol.terminals)).toBe(true);
        expect(symbol.terminals.length).toBeGreaterThan(0);
        expect(typeof symbol.render).toBe('function');
      });
    });

    it('should render valid SVG for all symbols', () => {
      allSymbols.forEach((symbol) => {
        const svg = symbol.render(0, 0);
        expect(svg).toBeDefined();
        expect(typeof svg).toBe('string');
        expect(svg.length).toBeGreaterThan(0);
      });
    });

    it('should have valid terminal structures for all symbols', () => {
      allSymbols.forEach((symbol) => {
        symbol.terminals.forEach((terminal) => {
          expect(terminal).toHaveProperty('x');
          expect(terminal).toHaveProperty('y');
          expect(terminal).toHaveProperty('name');
          expect(typeof terminal.x).toBe('number');
          expect(typeof terminal.y).toBe('number');
          expect(typeof terminal.name).toBe('string');
        });
      });
    });
  });
});
