import { describe, it, expect } from 'vitest';
import { toVerilog } from './index.js';
import type { DigitalProfile } from '@runiq/core';

describe('Verilog Exporter', () => {
  describe('Simple Modules', () => {
    it('should generate basic module with no ports', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'EmptyModule',
        instances: [],
        nets: [],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('module EmptyModule');
      expect(result.verilog).toContain('endmodule');
      expect(result.warnings).toHaveLength(0);
    });

    it('should generate module with input/output ports', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'SimpleGate',
        modules: [
          {
            name: 'SimpleGate',
            ports: [
              { name: 'a', dir: 'input' },
              { name: 'b', dir: 'input' },
              { name: 'y', dir: 'output' },
            ],
          },
        ],
        instances: [],
        nets: [],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('module SimpleGate');
      expect(result.verilog).toContain('input a');
      expect(result.verilog).toContain('input b');
      expect(result.verilog).toContain('output y');
      expect(result.verilog).toContain('endmodule');
    });

    it('should generate module with bus ports', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'Counter',
        modules: [
          {
            name: 'Counter',
            ports: [
              { name: 'clk', dir: 'input' },
              { name: 'reset', dir: 'input' },
              { name: 'count', dir: 'output', width: 8 },
            ],
          },
        ],
        instances: [],
        nets: [],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('module Counter');
      expect(result.verilog).toContain('input clk');
      expect(result.verilog).toContain('input reset');
      expect(result.verilog).toContain('output [7:0] count');
      expect(result.verilog).toContain('endmodule');
    });

    it('should generate module with parameters', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'ParameterizedCounter',
        modules: [
          {
            name: 'ParameterizedCounter',
            ports: [
              { name: 'clk', dir: 'input' },
              { name: 'count', dir: 'output', width: 8 },
            ],
            params: {
              WIDTH: 8,
              INIT_VALUE: 0,
            },
          },
        ],
        instances: [],
        nets: [],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('module ParameterizedCounter');
      expect(result.verilog).toContain('parameter WIDTH = 8');
      expect(result.verilog).toContain('parameter INIT_VALUE = 0');
      expect(result.verilog).toContain('input clk');
    });
  });

  describe('Wire Declarations', () => {
    it('should generate wire declarations from nets', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'WithWires',
        modules: [
          {
            name: 'WithWires',
            ports: [
              { name: 'in', dir: 'input' },
              { name: 'out', dir: 'output' },
            ],
          },
        ],
        instances: [],
        nets: [
          { name: 'in' },
          { name: 'out' },
          { name: 'internal' },
          { name: 'data_bus', width: 8 },
        ],
      };

      const result = toVerilog(profile);

      // Internal nets should be declared as wires
      expect(result.verilog).toContain('wire internal');
      expect(result.verilog).toContain('wire [7:0] data_bus');

      // Port names should not be re-declared as wires
      expect(result.verilog).not.toMatch(/wire in[;\s]/);
      expect(result.verilog).not.toMatch(/wire out[;\s]/);
    });

    it('should handle nets with no internal wires', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'NoInternalWires',
        modules: [
          {
            name: 'NoInternalWires',
            ports: [
              { name: 'a', dir: 'input' },
              { name: 'b', dir: 'output' },
            ],
          },
        ],
        instances: [],
        nets: [{ name: 'a' }, { name: 'b' }],
      };

      const result = toVerilog(profile);

      // Should not have a wire declaration section
      expect(result.verilog).not.toContain('wire a');
      expect(result.verilog).not.toContain('wire b');
    });
  });

  describe('Module Instances', () => {
    it('should generate simple instance with port connections', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'TopLevel',
        modules: [
          {
            name: 'TopLevel',
            ports: [
              { name: 'clk', dir: 'input' },
              { name: 'out', dir: 'output' },
            ],
          },
        ],
        instances: [
          {
            ref: 'U1',
            of: 'Inverter',
            portMap: {
              a: 'clk',
              y: 'out',
            },
          },
        ],
        nets: [{ name: 'clk' }, { name: 'out' }],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('Inverter U1');
      expect(result.verilog).toContain('.a(clk)');
      expect(result.verilog).toContain('.y(out)');
    });

    it('should generate instance with parameters', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'TopLevel',
        modules: [
          {
            name: 'TopLevel',
            ports: [{ name: 'clk', dir: 'input' }],
          },
        ],
        instances: [
          {
            ref: 'CNT1',
            of: 'Counter',
            paramMap: {
              WIDTH: 16,
              INIT_VALUE: 100,
            },
            portMap: {
              clk: 'clk',
            },
          },
        ],
        nets: [{ name: 'clk' }],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('Counter');
      expect(result.verilog).toContain('#(');
      expect(result.verilog).toContain('.WIDTH(16)');
      expect(result.verilog).toContain('.INIT_VALUE(100)');
      expect(result.verilog).toContain('CNT1');
    });

    it('should generate multiple instances', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'MultiInstance',
        modules: [
          {
            name: 'MultiInstance',
            ports: [
              { name: 'a', dir: 'input' },
              { name: 'b', dir: 'input' },
              { name: 'y', dir: 'output' },
            ],
          },
        ],
        instances: [
          {
            ref: 'U1',
            of: 'AND2',
            portMap: { a: 'a', b: 'b', y: 'and_out' },
          },
          {
            ref: 'U2',
            of: 'NOT',
            portMap: { a: 'and_out', y: 'y' },
          },
        ],
        nets: [
          { name: 'a' },
          { name: 'b' },
          { name: 'and_out' },
          { name: 'y' },
        ],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('AND2 U1');
      expect(result.verilog).toContain('NOT U2');
      expect(result.verilog).toContain('wire and_out');
    });

    it('should handle bus connections in instances', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'BusExample',
        modules: [
          {
            name: 'BusExample',
            ports: [
              { name: 'data_in', dir: 'input', width: 8 },
              { name: 'data_out', dir: 'output', width: 8 },
            ],
          },
        ],
        instances: [
          {
            ref: 'REG1',
            of: 'Register',
            portMap: {
              d: 'data_in',
              q: 'data_out',
            },
          },
        ],
        nets: [
          { name: 'data_in', width: 8 },
          { name: 'data_out', width: 8 },
        ],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('Register REG1');
      expect(result.verilog).toContain('.d(data_in)');
      expect(result.verilog).toContain('.q(data_out)');
      expect(result.verilog).toContain('input [7:0] data_in');
      expect(result.verilog).toContain('output [7:0] data_out');
    });
  });

  describe('Edge Cases and Validation', () => {
    it('should handle empty instance list', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'NoInstances',
        modules: [
          {
            name: 'NoInstances',
            ports: [{ name: 'clk', dir: 'input' }],
          },
        ],
        instances: [],
        nets: [{ name: 'clk' }],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('module NoInstances');
      expect(result.verilog).toContain('input clk');
      expect(result.verilog).toContain('endmodule');
    });

    it('should warn about undeclared nets in instances', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'UndeclaredNet',
        modules: [
          {
            name: 'UndeclaredNet',
            ports: [],
          },
        ],
        instances: [
          {
            ref: 'U1',
            of: 'Gate',
            portMap: {
              a: 'unknown_net',
            },
          },
        ],
        nets: [],
      };

      const result = toVerilog(profile);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('unknown_net');
      expect(result.warnings[0]).toContain('not declared');
    });

    it('should handle inout ports', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'WithInout',
        modules: [
          {
            name: 'WithInout',
            ports: [
              { name: 'data', dir: 'inout', width: 8 },
              { name: 'enable', dir: 'input' },
            ],
          },
        ],
        instances: [],
        nets: [{ name: 'data', width: 8 }, { name: 'enable' }],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('inout [7:0] data');
      expect(result.verilog).toContain('input enable');
    });
  });

  describe('Complete Examples', () => {
    it('should generate complete 4-bit counter module', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'Counter4bit',
        modules: [
          {
            name: 'Counter4bit',
            ports: [
              { name: 'clk', dir: 'input' },
              { name: 'reset', dir: 'input' },
              { name: 'enable', dir: 'input' },
              { name: 'count', dir: 'output', width: 4 },
            ],
            params: {
              INIT: 0,
            },
          },
        ],
        instances: [],
        nets: [
          { name: 'clk' },
          { name: 'reset' },
          { name: 'enable' },
          { name: 'count', width: 4 },
        ],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('module Counter4bit');
      expect(result.verilog).toContain('parameter INIT = 0');
      expect(result.verilog).toContain('input clk');
      expect(result.verilog).toContain('input reset');
      expect(result.verilog).toContain('input enable');
      expect(result.verilog).toContain('output [3:0] count');
      expect(result.verilog).toContain('endmodule');
      expect(result.warnings).toHaveLength(0);
    });

    it('should generate hierarchical design with multiple instances', () => {
      const profile: DigitalProfile = {
        type: 'digital',
        name: 'ALU4bit',
        modules: [
          {
            name: 'ALU4bit',
            ports: [
              { name: 'a', dir: 'input', width: 4 },
              { name: 'b', dir: 'input', width: 4 },
              { name: 'op', dir: 'input', width: 2 },
              { name: 'result', dir: 'output', width: 4 },
              { name: 'zero', dir: 'output' },
            ],
          },
        ],
        instances: [
          {
            ref: 'ADDER',
            of: 'Adder4bit',
            portMap: {
              a: 'a',
              b: 'b',
              sum: 'add_result',
            },
          },
          {
            ref: 'MUX',
            of: 'Mux4to1',
            paramMap: { WIDTH: 4 },
            portMap: {
              sel: 'op',
              in0: 'add_result',
              in1: 'sub_result',
              in2: 'and_result',
              in3: 'or_result',
              out: 'result',
            },
          },
        ],
        nets: [
          { name: 'a', width: 4 },
          { name: 'b', width: 4 },
          { name: 'op', width: 2 },
          { name: 'result', width: 4 },
          { name: 'zero' },
          { name: 'add_result', width: 4 },
          { name: 'sub_result', width: 4 },
          { name: 'and_result', width: 4 },
          { name: 'or_result', width: 4 },
        ],
      };

      const result = toVerilog(profile);

      expect(result.verilog).toContain('module ALU4bit');
      expect(result.verilog).toContain('Adder4bit ADDER');
      expect(result.verilog).toContain('Mux4to1 #(');
      expect(result.verilog).toContain('.WIDTH(4)');
      expect(result.verilog).toContain('wire [3:0] add_result');
      expect(result.verilog).toContain('wire [3:0] sub_result');
    });
  });
});
