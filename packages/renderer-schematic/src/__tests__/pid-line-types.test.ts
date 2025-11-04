import { describe, it, expect } from 'vitest';
import {
  pidLineTypes,
  getLineType,
  getLineTypeStyle,
  renderPIDLine,
  renderDoubleLine,
  renderInsulationMarks,
} from '../pid-line-types';

describe('P&ID Line Types', () => {
  describe('Line Type Library - Completeness', () => {
    it('should export 14 line types', () => {
      expect(Object.keys(pidLineTypes).length).toBe(14);
    });

    it('should have all required process line types', () => {
      expect(pidLineTypes.processLine).toBeDefined();
      expect(pidLineTypes.processFuture).toBeDefined();
      expect(pidLineTypes.utilityLine).toBeDefined();
    });

    it('should have all required signal line types', () => {
      expect(pidLineTypes.signalPneumatic).toBeDefined();
      expect(pidLineTypes.signalElectronic).toBeDefined();
      expect(pidLineTypes.signalHydraulic).toBeDefined();
      expect(pidLineTypes.signalSoftware).toBeDefined();
    });

    it('should have all required electrical line types', () => {
      expect(pidLineTypes.electrical).toBeDefined();
      expect(pidLineTypes.electricalSignal).toBeDefined();
    });

    it('should have all required supply line types', () => {
      expect(pidLineTypes.pneumaticSupply).toBeDefined();
      expect(pidLineTypes.hydraulicSupply).toBeDefined();
    });

    it('should have all required special purpose line types', () => {
      expect(pidLineTypes.mechanicalLink).toBeDefined();
      expect(pidLineTypes.insulatedLine).toBeDefined();
      expect(pidLineTypes.jacketedLine).toBeDefined();
    });
  });

  describe('Line Type Properties', () => {
    it('should have valid structure for processLine', () => {
      const line = pidLineTypes.processLine;
      expect(line.id).toBe('PROCESS');
      expect(line.name).toBe('Process Line');
      expect(line.category).toBe('process');
      expect(line.dashPattern).toBe('');
      expect(line.widthMultiplier).toBe(1.5);
      expect(line.description).toContain('process piping');
    });

    it('should have dashed pattern for future lines', () => {
      const line = pidLineTypes.processFuture;
      expect(line.dashPattern).toBe('10,5');
      expect(line.category).toBe('process');
    });

    it('should have correct category for signals', () => {
      expect(pidLineTypes.signalPneumatic.category).toBe('signal');
      expect(pidLineTypes.signalElectronic.category).toBe('signal');
      expect(pidLineTypes.signalHydraulic.category).toBe('signal');
    });

    it('should have data category for software links', () => {
      const line = pidLineTypes.signalSoftware;
      expect(line.category).toBe('data');
      expect(line.dashPattern).toBe('2,3');
    });

    it('should mark pneumatic supply as double line', () => {
      const line = pidLineTypes.pneumaticSupply;
      expect(line.isDoubleLine).toBe(true);
      expect(line.category).toBe('pneumatic');
    });

    it('should have thick width for hydraulic supply', () => {
      const line = pidLineTypes.hydraulicSupply;
      expect(line.widthMultiplier).toBe(2.0);
      expect(line.category).toBe('hydraulic');
    });

    it('should have dash-dot pattern for electrical signal', () => {
      const line = pidLineTypes.electricalSignal;
      expect(line.dashPattern).toBe('10,3,2,3');
      expect(line.category).toBe('electrical');
    });
  });

  describe('ISA-5.1 Standard Compliance', () => {
    it('should use dashed lines for instrument signals', () => {
      const pneumatic = pidLineTypes.signalPneumatic;
      const electronic = pidLineTypes.signalElectronic;
      
      expect(pneumatic.dashPattern).toBeTruthy();
      expect(electronic.dashPattern).toBeTruthy();
    });

    it('should use double lines for pneumatic supply', () => {
      expect(pidLineTypes.pneumaticSupply.isDoubleLine).toBe(true);
    });

    it('should distinguish between signal and supply lines', () => {
      const signal = pidLineTypes.signalPneumatic;
      const supply = pidLineTypes.pneumaticSupply;
      
      expect(signal.isDoubleLine).toBeUndefined();
      expect(supply.isDoubleLine).toBe(true);
    });

    it('should have solid lines for main process', () => {
      const line = pidLineTypes.processLine;
      expect(line.dashPattern).toBe('');
    });
  });

  describe('getLineType function', () => {
    it('should retrieve line type by ID', () => {
      const line = getLineType('processLine');
      expect(line.id).toBe('PROCESS');
      expect(line.name).toBe('Process Line');
    });

    it('should retrieve signal line types', () => {
      const line = getLineType('signalElectronic');
      expect(line.id).toBe('SIGNAL_ELECTRONIC');
    });

    it('should retrieve special purpose lines', () => {
      const line = getLineType('mechanicalLink');
      expect(line.id).toBe('MECHANICAL');
    });
  });

  describe('getLineTypeStyle function', () => {
    it('should generate style for solid line', () => {
      const line = pidLineTypes.processLine;
      const style = getLineTypeStyle(line, 2);
      
      expect(style).toContain('stroke-width="3"'); // 2 * 1.5
      expect(style).toContain('stroke=');
      expect(style).toContain('fill="none"');
    });

    it('should include dash pattern when specified', () => {
      const line = pidLineTypes.signalPneumatic;
      const style = getLineTypeStyle(line, 2);
      
      expect(style).toContain('stroke-dasharray="8,4"');
    });

    it('should not include dash pattern for solid lines', () => {
      const line = pidLineTypes.processLine;
      const style = getLineTypeStyle(line, 2);
      
      expect(style).not.toContain('stroke-dasharray');
    });

    it('should use custom color when provided', () => {
      const line = pidLineTypes.processLine;
      const style = getLineTypeStyle(line, 2, 'blue');
      
      expect(style).toContain('stroke="blue"');
    });

    it('should use default color when no custom color', () => {
      const line = pidLineTypes.processLine;
      const style = getLineTypeStyle(line, 2);
      
      expect(style).toContain('stroke="black"');
    });

    it('should apply width multiplier correctly', () => {
      const thin = pidLineTypes.signalPneumatic; // 1.0x
      const thick = pidLineTypes.hydraulicSupply; // 2.0x
      
      const thinStyle = getLineTypeStyle(thin, 2);
      const thickStyle = getLineTypeStyle(thick, 2);
      
      expect(thinStyle).toContain('stroke-width="2"');
      expect(thickStyle).toContain('stroke-width="4"');
    });
  });

  describe('renderPIDLine function', () => {
    it('should render single line for standard types', () => {
      const line = pidLineTypes.processLine;
      const svg = renderPIDLine(line, 0, 0, 100, 0);
      
      expect(svg).toContain('<line');
      expect(svg).toContain('x1="0"');
      expect(svg).toContain('y1="0"');
      expect(svg).toContain('x2="100"');
      expect(svg).toContain('y2="0"');
    });

    it('should apply line style to rendered line', () => {
      const line = pidLineTypes.signalPneumatic;
      const svg = renderPIDLine(line, 0, 0, 100, 0);
      
      expect(svg).toContain('stroke-dasharray="8,4"');
    });

    it('should render double line for pneumatic supply', () => {
      const line = pidLineTypes.pneumaticSupply;
      const svg = renderPIDLine(line, 0, 0, 100, 0);
      
      // Should contain two line elements
      const lineCount = (svg.match(/<line/g) || []).length;
      expect(lineCount).toBe(2);
    });

    it('should handle diagonal lines', () => {
      const line = pidLineTypes.processLine;
      const svg = renderPIDLine(line, 0, 0, 100, 100);
      
      expect(svg).toContain('x1="0"');
      expect(svg).toContain('y1="0"');
      expect(svg).toContain('x2="100"');
      expect(svg).toContain('y2="100"');
    });

    it('should use custom base width', () => {
      const line = pidLineTypes.processLine;
      const svg = renderPIDLine(line, 0, 0, 100, 0, 4);
      
      expect(svg).toContain('stroke-width="6"'); // 4 * 1.5
    });

    it('should use custom color', () => {
      const line = pidLineTypes.processLine;
      const svg = renderPIDLine(line, 0, 0, 100, 0, 2, 'red');
      
      expect(svg).toContain('stroke="red"');
    });
  });

  describe('renderDoubleLine function', () => {
    it('should render two parallel lines', () => {
      const svg = renderDoubleLine(0, 0, 100, 0, 4, 'stroke="black"');
      
      const lineCount = (svg.match(/<line/g) || []).length;
      expect(lineCount).toBe(2);
    });

    it('should handle zero-length lines', () => {
      const svg = renderDoubleLine(0, 0, 0, 0, 4, 'stroke="black"');
      
      expect(svg).toBe('');
    });

    it('should create parallel horizontal lines', () => {
      const svg = renderDoubleLine(0, 0, 100, 0, 4, 'stroke="black"');
      
      // Lines should be separated vertically
      expect(svg).toContain('y1="2"');
      expect(svg).toContain('y1="-2"');
    });

    it('should create parallel vertical lines', () => {
      const svg = renderDoubleLine(0, 0, 0, 100, 4, 'stroke="black"');
      
      // Lines should be separated horizontally
      expect(svg).toContain('x1="2"');
      expect(svg).toContain('x1="-2"');
    });

    it('should apply style to both lines', () => {
      const svg = renderDoubleLine(0, 0, 100, 0, 4, 'stroke="blue" stroke-width="2"');
      
      expect(svg).toContain('stroke="blue"');
      const strokeCount = (svg.match(/stroke="blue"/g) || []).length;
      expect(strokeCount).toBe(2);
    });
  });

  describe('renderInsulationMarks function', () => {
    it('should render insulation marks along a line', () => {
      const svg = renderInsulationMarks(0, 0, 100, 0, 20, 8);
      
      expect(svg).toContain('<line');
      expect(svg.length).toBeGreaterThan(0);
    });

    it('should handle zero-length lines', () => {
      const svg = renderInsulationMarks(0, 0, 0, 0, 20, 8);
      
      expect(svg).toBe('');
    });

    it('should create perpendicular marks', () => {
      const svg = renderInsulationMarks(0, 0, 100, 0, 20, 8);
      
      // For horizontal line, marks should be vertical
      expect(svg).toContain('y1="4"');
      expect(svg).toContain('y2="-4"');
    });

    it('should space marks evenly', () => {
      const svg = renderInsulationMarks(0, 0, 100, 0, 25, 8);
      
      // Line length 100, spacing 25 → 4 marks
      const markCount = (svg.match(/<line/g) || []).length;
      expect(markCount).toBe(4);
    });

    it('should use currentColor for marks', () => {
      const svg = renderInsulationMarks(0, 0, 100, 0, 20, 8);
      
      expect(svg).toContain('stroke="currentColor"');
    });
  });

  describe('Line Type Categories', () => {
    it('should have correct category distribution', () => {
      const types = Object.values(pidLineTypes);
      const categories = types.map(t => t.category);
      
      expect(categories).toContain('process');
      expect(categories).toContain('signal');
      expect(categories).toContain('electrical');
      expect(categories).toContain('pneumatic');
      expect(categories).toContain('hydraulic');
      expect(categories).toContain('data');
    });

    it('should have multiple process line variants', () => {
      const processLines = Object.values(pidLineTypes)
        .filter(t => t.category === 'process');
      
      expect(processLines.length).toBeGreaterThanOrEqual(6);
    });

    it('should have multiple signal line variants', () => {
      const signalLines = Object.values(pidLineTypes)
        .filter(t => t.category === 'signal');
      
      expect(signalLines.length).toBe(3);
    });
  });

  describe('Line Type Descriptions', () => {
    it('should have meaningful descriptions', () => {
      const types = Object.values(pidLineTypes);
      
      types.forEach(type => {
        expect(type.description).toBeTruthy();
        expect(type.description.length).toBeGreaterThan(10);
      });
    });

    it('should describe process line usage', () => {
      const line = pidLineTypes.processLine;
      expect(line.description.toLowerCase()).toContain('process');
    });

    it('should describe signal line usage', () => {
      const line = pidLineTypes.signalElectronic;
      expect(line.description.toLowerCase()).toContain('signal');
    });
  });

  describe('Width Multipliers', () => {
    it('should have consistent width multipliers', () => {
      const types = Object.values(pidLineTypes);
      
      types.forEach(type => {
        expect(type.widthMultiplier).toBeGreaterThan(0);
        expect(type.widthMultiplier).toBeLessThanOrEqual(2.5);
      });
    });

    it('should use thicker lines for main process', () => {
      const process = pidLineTypes.processLine;
      const signal = pidLineTypes.signalPneumatic;
      
      expect(process.widthMultiplier).toBeGreaterThan(signal.widthMultiplier);
    });

    it('should use thickest lines for hydraulic', () => {
      const hydraulic = pidLineTypes.hydraulicSupply;
      const types = Object.values(pidLineTypes);
      
      const maxWidth = Math.max(...types.map(t => t.widthMultiplier));
      expect(hydraulic.widthMultiplier).toBe(maxWidth);
    });
  });

  describe('Dash Patterns', () => {
    it('should have valid dash pattern format', () => {
      const types = Object.values(pidLineTypes);
      
      types.forEach(type => {
        if (type.dashPattern) {
          // Should be comma-separated numbers
          expect(type.dashPattern).toMatch(/^[\d,]+$/);
        }
      });
    });

    it('should use consistent signal dashing', () => {
      const pneumatic = pidLineTypes.signalPneumatic;
      const electronic = pidLineTypes.signalElectronic;
      
      expect(pneumatic.dashPattern).toBe('8,4');
      expect(electronic.dashPattern).toBe('8,4');
    });

    it('should use unique dash pattern for software', () => {
      const software = pidLineTypes.signalSoftware;
      
      expect(software.dashPattern).toBe('2,3');
      expect(software.dashPattern).not.toBe('8,4');
    });
  });

  describe('Integration with Symbols', () => {
    it('should be usable for connecting symbols', () => {
      // Simulate connecting two symbols at different positions
      const line = pidLineTypes.processLine;
      
      const x1 = 50, y1 = 50; // Symbol 1 terminal
      const x2 = 200, y2 = 150; // Symbol 2 terminal
      
      const svg = renderPIDLine(line, x1, y1, x2, y2);
      
      expect(svg).toContain(`x1="${x1}"`);
      expect(svg).toContain(`y1="${y1}"`);
      expect(svg).toContain(`x2="${x2}"`);
      expect(svg).toContain(`y2="${y2}"`);
    });

    it('should support different line types for different connections', () => {
      const process = renderPIDLine(pidLineTypes.processLine, 0, 0, 100, 0);
      const signal = renderPIDLine(pidLineTypes.signalElectronic, 0, 10, 100, 10);
      
      expect(process).not.toContain('stroke-dasharray');
      expect(signal).toContain('stroke-dasharray');
    });
  });
});
