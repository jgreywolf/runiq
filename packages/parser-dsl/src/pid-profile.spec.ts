import { describe, expect, it } from 'vitest';
import { parse } from './langium-parser.js';

describe('P&ID Profile DSL Syntax', () => {
  describe('Basic P&ID Profile', () => {
    it('should parse empty P&ID profile', () => {
      const text = `
        pid "Simple Process" {
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse P&ID profile with name', () => {
      const text = `
        pid "Distillation Unit P&ID" {
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Equipment Statement', () => {
    it('should parse vessel equipment', () => {
      const text = `
        pid "Process" {
          equipment V-101 type:vesselVertical volume:5000 unit:L
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse pump equipment', () => {
      const text = `
        pid "Process" {
          equipment P-101 type:pumpCentrifugal flowRate:100 unit:m³/h
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse heat exchanger', () => {
      const text = `
        pid "Process" {
          equipment E-101 type:heatExchangerShellTube material:SS316
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse valve with material and rating', () => {
      const text = `
        pid "Process" {
          equipment V-201 type:valveControl material:SS316 rating:300#
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse reactor with multiple properties', () => {
      const text = `
        pid "Process" {
          equipment R-101 type:reactor volume:10000 unit:L material:SS316L rating:PN25
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Instrument Statement', () => {
    it('should parse flow transmitter', () => {
      const text = `
        pid "Process" {
          instrument FT-101 type:flowTransmitter range:(0,1000) unit:kg/h loop:101
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse temperature indicator controller', () => {
      const text = `
        pid "Process" {
          instrument TIC-205 type:temperatureIndicatorController range:(0,500) unit:degC loop:205 location:panel
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse pressure transmitter with accuracy', () => {
      const text = `
        pid "Process" {
          instrument PT-301 type:pressureTransmitter range:(0,100) unit:bar location:field accuracy:0.5 unit:%
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse level indicator', () => {
      const text = `
        pid "Process" {
          instrument LI-401 type:levelIndicator range:(0,100) unit:% location:local
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse flow switch', () => {
      const text = `
        pid "Process" {
          instrument FSL-102 type:flowSwitch range:(10,1000) unit:L/min loop:102 location:field
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse analysis transmitter', () => {
      const text = `
        pid "Process" {
          instrument AT-501 type:analyzerTransmitter range:(0,100) unit:% loop:501 location:field
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Line Statement', () => {
    it('should parse process line', () => {
      const text = `
        pid "Process" {
          line process from:V-101.outlet to:P-101.inlet size:4 unit:in
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse process line with schedule and material', () => {
      const text = `
        pid "Process" {
          line process solid from:P-101.discharge to:E-101.shellIn size:4 schedule:SCH40 material:SS316
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse utility line', () => {
      const text = `
        pid "Process" {
          line utility from:STEAM-1.header to:E-101.tubeIn size:2 unit:in material:CS
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse signal line', () => {
      const text = `
        pid "Process" {
          line signal dashed from:FT-101 to:FIC-101
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse line with insulation', () => {
      const text = `
        pid "Process" {
          line process from:R-101.outlet to:C-101.feed size:6 insulation:thermal
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse future line', () => {
      const text = `
        pid "Process" {
          line process future from:V-101.spare to:P-102.inlet size:4 schedule:STD
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse electrical line', () => {
      const text = `
        pid "Process" {
          line electrical from:MCC-01 to:M-101
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Loop Statement', () => {
    it('should parse control loop', () => {
      const text = `
        pid "Process" {
          loop 101 controlled_variable:flow setpoint:1000 unit:kg/h controller:FIC-101
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse temperature control loop', () => {
      const text = `
        pid "Process" {
          loop 205 controlled_variable:temperature setpoint:350 unit:degC controller:TIC-205 mode:auto
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse pressure control loop in manual mode', () => {
      const text = `
        pid "Process" {
          loop 301 controlled_variable:pressure setpoint:5 unit:bar controller:PIC-301 mode:manual
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse level control loop', () => {
      const text = `
        pid "Process" {
          loop 401 controlled_variable:level setpoint:75 unit:% controller:LIC-401 mode:cascade
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse composition control loop', () => {
      const text = `
        pid "Process" {
          loop 501 controlled_variable:composition setpoint:95 unit:% controller:AIC-501
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Process Specifications', () => {
    it('should parse pressure specification', () => {
      const text = `
        pid "Process" {
          pressure 10 bar operating
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse flow rate specification', () => {
      const text = `
        pid "Process" {
          flowRate 5000 kg/h
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse fluid specification', () => {
      const text = `
        pid "Process" {
          fluid mineral "ISO VG 46" temp:(10,60,degC)
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Complete P&ID Examples', () => {
    it('should parse simple process flow', () => {
      const text = `
        pid "Simple Process Flow" {
          equipment V-101 type:vesselVertical volume:5000 unit:L material:SS316
          equipment P-101 type:pumpCentrifugal flowRate:100 unit:m³/h
          equipment E-101 type:heatExchangerShellTube material:SS316
          
          instrument FT-101 type:flowTransmitter range:(0,150) unit:m³/h loop:101 location:field
          instrument FIC-101 type:flowIndicatorController range:(0,150) unit:m³/h loop:101 location:panel
          instrument TT-201 type:temperatureTransmitter range:(0,200) unit:degC loop:201 location:field
          
          line process from:V-101.outlet to:P-101.inlet size:4 unit:in schedule:SCH40
          line process from:P-101.discharge to:E-101.shellIn size:4 schedule:SCH40 material:SS316
          line signal from:FT-101 to:FIC-101
          
          loop 101 controlled_variable:flow setpoint:100 unit:m³/h controller:FIC-101 mode:auto
          
          pressure 10 bar operating
          flowRate 100 m³/h
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse distillation column setup', () => {
      const text = `
        pid "Distillation Column" {
          equipment C-101 type:distillationColumn volume:50000 unit:L material:SS316 rating:PN16
          equipment R-101 type:reboiler type:heatExchangerShellTube material:SS316
          equipment D-101 type:refluxDrum volume:2000 unit:L material:SS316
          
          instrument PT-301 type:pressureTransmitter range:(0,5) unit:bar loop:301 location:field
          instrument PIC-301 type:pressureIndicatorController range:(0,5) unit:bar loop:301 location:panel
          instrument LT-401 type:levelTransmitter range:(0,100) unit:% loop:401 location:field
          instrument LIC-401 type:levelIndicatorController range:(0,100) unit:% loop:401 location:panel
          instrument TT-201 type:temperatureTransmitter range:(50,250) unit:degC loop:201 location:field
          instrument TIC-201 type:temperatureIndicatorController range:(50,250) unit:degC loop:201 location:panel
          
          loop 301 controlled_variable:pressure setpoint:2.5 unit:bar controller:PIC-301 mode:auto
          loop 401 controlled_variable:level setpoint:50 unit:% controller:LIC-401 mode:auto
          loop 201 controlled_variable:temperature setpoint:180 unit:degC controller:TIC-201 mode:auto
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should parse reactor with safety systems', () => {
      const text = `
        pid "Reactor System with Safety" {
          equipment R-101 type:reactor volume:10000 unit:L material:Hastelloy rating:PN40
          equipment V-101 type:valveSafetyRelief rating:PN40
          
          instrument PT-301 type:pressureTransmitter range:(0,50) unit:bar loop:301 location:field
          instrument PAHH-301 type:pressureSwitch range:(0,50) unit:bar loop:301 location:field
          instrument TT-201 type:temperatureTransmitter range:(0,300) unit:degC loop:201 location:field
          instrument TAH-201 type:temperatureSwitch range:(0,300) unit:degC loop:201 location:field
          
          line process from:R-101.outlet to:V-101 size:6 schedule:XS material:Hastelloy
          line signal from:PAHH-301 to:SIS-01
          line signal from:TAH-201 to:SIS-01
          
          pressure 30 bar operating
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Material Types', () => {
    it('should parse various material types', () => {
      const materials = [
        'CS',
        'SS304',
        'SS316',
        'SS316L',
        'Alloy20',
        'Hastelloy',
        'Monel',
        'Titanium',
        'PVC',
        'PP',
        'PTFE',
      ];

      for (const material of materials) {
        const text = `
          pid "Test" {
            equipment V-101 type:vesselVertical material:${material}
          }
        `;
        const result = parse(text);
        expect(result.success).toBe(true);
        expect(result.errors).toHaveLength(0);
      }
    });
  });

  describe('Pressure Ratings', () => {
    it('should parse ANSI ratings', () => {
      const ratings = ['150#', '300#', '600#', '900#', '1500#', '2500#'];

      for (const rating of ratings) {
        const text = `
          pid "Test" {
            equipment V-101 type:valveGate rating:${rating}
          }
        `;
        const result = parse(text);
        expect(result.success).toBe(true);
        expect(result.errors).toHaveLength(0);
      }
    });

    it('should parse PN ratings', () => {
      const ratings = ['PN10', 'PN16', 'PN25', 'PN40'];

      for (const rating of ratings) {
        const text = `
          pid "Test" {
            equipment V-101 type:valveGate rating:${rating}
          }
        `;
        const result = parse(text);
        expect(result.success).toBe(true);
        expect(result.errors).toHaveLength(0);
      }
    });
  });

  describe('Pipe Schedules', () => {
    it('should parse pipe schedules', () => {
      const schedules = ['STD', 'SCH40', 'XS', 'SCH80', 'XXS', 'SCH160'];

      for (const schedule of schedules) {
        const text = `
          pid "Test" {
            line process from:V-101 to:P-102 schedule:${schedule}
          }
        `;
        const result = parse(text);
        expect(result.success).toBe(true);
        expect(result.errors).toHaveLength(0);
      }
    });
  });

  describe('Error Cases', () => {
    it('should fail on invalid equipment type', () => {
      const text = `
        pid "Test" {
          equipment V-101 type:invalidType
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail on invalid line type', () => {
      const text = `
        pid "Test" {
          line invalidType from:A to:B
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail on missing required property', () => {
      const text = `
        pid "Test" {
          line process
        }
      `;
      const result = parse(text);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
