import { describe, it, expect } from 'vitest';
import {
  parseTag,
  validateTag,
  createTag,
  isFieldMounted,
  getTagCategory,
  generateSequentialTags,
  getLoopNumber,
  isSameLoop,
  getLoopTags,
  formatTagDisplay,
  suggestTags,
  isISACompliant,
  measuredVariables,
  readoutFunctions,
  commonTagCombinations,
} from '../pid-tags';

describe('P&ID Tag Numbering System', () => {
  describe('ISA-5.1 Reference Tables', () => {
    it('should have all 26 measured variables defined', () => {
      const keys = Object.keys(measuredVariables);
      expect(keys.length).toBe(26);
      expect(keys).toContain('F'); // Flow
      expect(keys).toContain('T'); // Temperature
      expect(keys).toContain('P'); // Pressure
      expect(keys).toContain('L'); // Level
    });

    it('should have all 26 readout functions defined', () => {
      const keys = Object.keys(readoutFunctions);
      expect(keys.length).toBe(26);
      expect(keys).toContain('T'); // Transmit
      expect(keys).toContain('I'); // Indicate
      expect(keys).toContain('C'); // Control
      expect(keys).toContain('R'); // Record
    });

    it('should have common tag combinations defined', () => {
      const keys = Object.keys(commonTagCombinations);
      expect(keys.length).toBeGreaterThan(30);
      expect(commonTagCombinations.FT).toBe('Flow Transmitter');
      expect(commonTagCombinations.TIC).toBe('Temperature Indicator Controller');
    });
  });

  describe('parseTag function', () => {
    it('should parse basic flow transmitter tag', () => {
      const tag = parseTag('FT-101');
      
      expect(tag).not.toBeNull();
      expect(tag?.fullTag).toBe('FT-101');
      expect(tag?.functionCode).toBe('FT');
      expect(tag?.loopNumber).toBe('101');
      expect(tag?.measuredVariable).toBe('F');
      expect(tag?.readoutFunction).toBe('T');
      expect(tag?.suffix).toBeUndefined();
    });

    it('should parse temperature indicator controller', () => {
      const tag = parseTag('TIC-205');
      
      expect(tag?.functionCode).toBe('TIC');
      expect(tag?.loopNumber).toBe('205');
      expect(tag?.measuredVariable).toBe('T');
      expect(tag?.readoutFunction).toBe('IC');
    });

    it('should parse alarm with high-high designation', () => {
      const tag = parseTag('PAHH-310');
      
      expect(tag?.functionCode).toBe('PAHH');
      expect(tag?.loopNumber).toBe('310');
      expect(tag?.measuredVariable).toBe('P');
      expect(tag?.readoutFunction).toBe('AHH');
    });

    it('should parse tag with suffix', () => {
      const tag = parseTag('FT-101A');
      
      expect(tag?.functionCode).toBe('FT');
      expect(tag?.loopNumber).toBe('101');
      expect(tag?.suffix).toBe('A');
    });

    it('should handle lowercase input', () => {
      const tag = parseTag('ft-101');
      
      expect(tag?.fullTag).toBe('FT-101');
      expect(tag?.functionCode).toBe('FT');
    });

    it('should handle whitespace', () => {
      const tag = parseTag('  FT-101  ');
      
      expect(tag?.fullTag).toBe('FT-101');
    });

    it('should return null for invalid format', () => {
      expect(parseTag('INVALID')).toBeNull();
      expect(parseTag('FT101')).toBeNull(); // Missing dash
      expect(parseTag('FT-')).toBeNull(); // Missing number
      expect(parseTag('-101')).toBeNull(); // Missing function
    });

    it('should handle single digit loop numbers', () => {
      const tag = parseTag('FT-1');
      
      expect(tag?.loopNumber).toBe('1');
    });

    it('should handle four digit loop numbers', () => {
      const tag = parseTag('FT-9999');
      
      expect(tag?.loopNumber).toBe('9999');
    });

    it('should get description for common tags', () => {
      const tag = parseTag('FT-101');
      expect(tag?.description).toBe('Flow Transmitter');
      
      const tag2 = parseTag('TIC-205');
      expect(tag2?.description).toBe('Temperature Indicator Controller');
    });
  });

  describe('validateTag function', () => {
    it('should validate correct flow transmitter tag', () => {
      const errors = validateTag('FT-101');
      expect(errors).toHaveLength(0);
    });

    it('should validate correct temperature controller', () => {
      const errors = validateTag('TIC-205');
      expect(errors).toHaveLength(0);
    });

    it('should validate pressure alarm high high', () => {
      const errors = validateTag('PAHH-310');
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid format', () => {
      const errors = validateTag('INVALID');
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('Invalid tag format');
    });

    it('should reject invalid measured variable', () => {
      const errors = validateTag('9T-101'); // 9 is not a valid letter
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject function code too long', () => {
      const errors = validateTag('ABCDE-101'); // 5 letters is too long
      expect(errors.length).toBeGreaterThan(0);
      // Note: Will fail format check before length check
    });

    it('should accept valid suffixes', () => {
      const errors = validateTag('FT-101A');
      expect(errors).toHaveLength(0);
    });

    it('should handle loop numbers at boundaries', () => {
      expect(validateTag('FT-1')).toHaveLength(0);
      expect(validateTag('FT-9999')).toHaveLength(0);
    });
  });

  describe('createTag function', () => {
    it('should create basic tag from components', () => {
      const tag = createTag('FT', 101);
      expect(tag).toBe('FT-101');
    });

    it('should pad loop numbers to 3 digits', () => {
      const tag = createTag('FT', 1);
      expect(tag).toBe('FT-001');
    });

    it('should handle string loop numbers', () => {
      const tag = createTag('TIC', '205');
      expect(tag).toBe('TIC-205');
    });

    it('should add suffix when provided', () => {
      const tag = createTag('FT', 101, 'A');
      expect(tag).toBe('FT-101A');
    });

    it('should convert function code to uppercase', () => {
      const tag = createTag('ft', 101);
      expect(tag).toBe('FT-101');
    });

    it('should add location when provided', () => {
      const tag = createTag('FT', 101, undefined, 'AREA1');
      expect(tag).toBe('FT-101(AREA1)');
    });

    it('should handle both suffix and location', () => {
      const tag = createTag('FT', 101, 'A', 'AREA1');
      expect(tag).toBe('FT-101A(AREA1)');
    });
  });

  describe('isFieldMounted function', () => {
    it('should identify transmitters as field-mounted', () => {
      const tag = parseTag('FT-101');
      expect(isFieldMounted(tag!)).toBe(true);
    });

    it('should identify elements as field-mounted', () => {
      const tag = parseTag('FE-101');
      expect(isFieldMounted(tag!)).toBe(true);
    });

    it('should identify controllers as panel-mounted', () => {
      const tag = parseTag('FIC-101');
      expect(isFieldMounted(tag!)).toBe(false);
    });

    it('should identify recorders as panel-mounted', () => {
      const tag = parseTag('FR-101');
      expect(isFieldMounted(tag!)).toBe(false);
    });

    it('should identify indicator controllers as panel-mounted', () => {
      const tag = parseTag('TIC-205');
      expect(isFieldMounted(tag!)).toBe(false);
    });

    it('should identify standalone indicators as field-mounted', () => {
      const tag = parseTag('TI-101');
      expect(isFieldMounted(tag!)).toBe(true);
    });
  });

  describe('getTagCategory function', () => {
    it('should categorize flow tags', () => {
      const tag = parseTag('FT-101');
      expect(getTagCategory(tag!)).toBe('Flow');
    });

    it('should categorize temperature tags', () => {
      const tag = parseTag('TIC-205');
      expect(getTagCategory(tag!)).toBe('Temperature');
    });

    it('should categorize pressure tags', () => {
      const tag = parseTag('PAHH-310');
      expect(getTagCategory(tag!)).toBe('Pressure');
    });

    it('should categorize level tags', () => {
      const tag = parseTag('LT-401');
      expect(getTagCategory(tag!)).toBe('Level');
    });

    it('should categorize analysis tags', () => {
      const tag = parseTag('AT-501');
      expect(getTagCategory(tag!)).toBe('Analysis');
    });

    it('should handle unknown categories', () => {
      const tag = parseTag('XT-999');
      expect(getTagCategory(tag!)).toBe('Special');
    });
  });

  describe('generateSequentialTags function', () => {
    it('should generate multiple sequential tags', () => {
      const tags = generateSequentialTags('FT', 101, 3);
      
      expect(tags).toHaveLength(3);
      expect(tags[0]).toBe('FT-101');
      expect(tags[1]).toBe('FT-102');
      expect(tags[2]).toBe('FT-103');
    });

    it('should handle suffix in sequential tags', () => {
      const tags = generateSequentialTags('FT', 101, 2, 'A');
      
      expect(tags[0]).toBe('FT-101A');
      expect(tags[1]).toBe('FT-102A');
    });

    it('should generate single tag when count is 1', () => {
      const tags = generateSequentialTags('TIC', 205, 1);
      
      expect(tags).toHaveLength(1);
      expect(tags[0]).toBe('TIC-205');
    });
  });

  describe('getLoopNumber function', () => {
    it('should extract loop number from tag', () => {
      const loopNum = getLoopNumber('FT-101');
      expect(loopNum).toBe(101);
    });

    it('should handle three digit loop numbers', () => {
      const loopNum = getLoopNumber('TIC-205');
      expect(loopNum).toBe(205);
    });

    it('should return null for invalid tags', () => {
      const loopNum = getLoopNumber('INVALID');
      expect(loopNum).toBeNull();
    });
  });

  describe('isSameLoop function', () => {
    it('should identify tags in same loop', () => {
      expect(isSameLoop('FT-101', 'FI-101')).toBe(true);
      expect(isSameLoop('FT-101', 'FIC-101')).toBe(true);
      expect(isSameLoop('FE-101', 'FT-101')).toBe(true);
    });

    it('should reject tags in different loops', () => {
      expect(isSameLoop('FT-101', 'FT-102')).toBe(false);
      expect(isSameLoop('FT-101', 'TT-101')).toBe(false);
    });

    it('should handle suffixes correctly', () => {
      expect(isSameLoop('FT-101A', 'FT-101B')).toBe(true);
      expect(isSameLoop('FT-101A', 'FI-101')).toBe(true);
    });

    it('should return false for invalid tags', () => {
      expect(isSameLoop('INVALID', 'FT-101')).toBe(false);
      expect(isSameLoop('FT-101', 'INVALID')).toBe(false);
    });
  });

  describe('getLoopTags function', () => {
    it('should find all tags in a loop', () => {
      const allTags = ['FT-101', 'FI-101', 'FIC-101', 'TT-201', 'FT-102'];
      const loopTags = getLoopTags(allTags, 'FT-101');
      
      expect(loopTags).toHaveLength(3);
      expect(loopTags).toContain('FT-101');
      expect(loopTags).toContain('FI-101');
      expect(loopTags).toContain('FIC-101');
    });

    it('should exclude tags from different loops', () => {
      const allTags = ['FT-101', 'FT-102', 'TT-101'];
      const loopTags = getLoopTags(allTags, 'FT-101');
      
      expect(loopTags).toHaveLength(1);
      expect(loopTags).toContain('FT-101');
    });

    it('should return empty array when no matches', () => {
      const allTags = ['TT-201', 'PT-301'];
      const loopTags = getLoopTags(allTags, 'FT-101');
      
      expect(loopTags).toHaveLength(0);
    });
  });

  describe('formatTagDisplay function', () => {
    it('should format tag with description by default', () => {
      const formatted = formatTagDisplay('FT-101');
      expect(formatted).toBe('FT-101 (Flow Transmitter)');
    });

    it('should format tag without description when requested', () => {
      const formatted = formatTagDisplay('FT-101', false);
      expect(formatted).toBe('FT-101');
    });

    it('should handle tags without common descriptions', () => {
      const formatted = formatTagDisplay('FXY-999');
      expect(formatted).toBe('FXY-999');
    });

    it('should return original string for invalid tags', () => {
      const formatted = formatTagDisplay('INVALID');
      expect(formatted).toBe('INVALID');
    });
  });

  describe('suggestTags function', () => {
    it('should suggest tags starting with F', () => {
      const suggestions = suggestTags('F');
      
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('FT'))).toBe(true);
      expect(suggestions.some(s => s.includes('FIC'))).toBe(true);
    });

    it('should suggest specific tags for FT', () => {
      const suggestions = suggestTags('FT');
      
      expect(suggestions.some(s => s.startsWith('FT '))).toBe(true);
      expect(suggestions.some(s => s.includes('Flow Transmitter'))).toBe(true);
    });

    it('should limit suggestions to 10', () => {
      const suggestions = suggestTags('');
      expect(suggestions.length).toBeLessThanOrEqual(10);
    });

    it('should handle case-insensitive matching', () => {
      const suggestions = suggestTags('ft');
      expect(suggestions.length).toBeGreaterThan(0);
    });

    it('should return empty for non-matching input', () => {
      const suggestions = suggestTags('ZZZ');
      expect(suggestions).toHaveLength(0);
    });
  });

  describe('isISACompliant function', () => {
    it('should return true for valid tags', () => {
      expect(isISACompliant('FT-101')).toBe(true);
      expect(isISACompliant('TIC-205')).toBe(true);
      expect(isISACompliant('PAHH-310A')).toBe(true);
    });

    it('should return false for invalid tags', () => {
      expect(isISACompliant('INVALID')).toBe(false);
      expect(isISACompliant('FT101')).toBe(false);
      expect(isISACompliant('9T-101')).toBe(false);
    });
  });

  describe('Common Tag Patterns', () => {
    it('should validate flow measurement loop', () => {
      expect(isISACompliant('FE-101')).toBe(true); // Flow Element
      expect(isISACompliant('FT-101')).toBe(true); // Flow Transmitter
      expect(isISACompliant('FI-101')).toBe(true); // Flow Indicator
      expect(isISACompliant('FIC-101')).toBe(true); // Flow Indicator Controller
      expect(isISACompliant('FV-101')).toBe(true); // Flow Valve
    });

    it('should validate temperature measurement loop', () => {
      expect(isISACompliant('TE-201')).toBe(true); // Temperature Element
      expect(isISACompliant('TW-201')).toBe(true); // Temperature Well
      expect(isISACompliant('TT-201')).toBe(true); // Temperature Transmitter
      expect(isISACompliant('TI-201')).toBe(true); // Temperature Indicator
      expect(isISACompliant('TIC-201')).toBe(true); // Temperature Indicator Controller
    });

    it('should validate pressure alarms', () => {
      expect(isISACompliant('PAH-301')).toBe(true); // Pressure Alarm High
      expect(isISACompliant('PAHH-301')).toBe(true); // Pressure Alarm High High
      expect(isISACompliant('PAL-302')).toBe(true); // Pressure Alarm Low
      expect(isISACompliant('PALL-302')).toBe(true); // Pressure Alarm Low Low
    });

    it('should validate level control loop', () => {
      expect(isISACompliant('LT-401')).toBe(true); // Level Transmitter
      expect(isISACompliant('LI-401')).toBe(true); // Level Indicator
      expect(isISACompliant('LIC-401')).toBe(true); // Level Indicator Controller
      expect(isISACompliant('LV-401')).toBe(true); // Level Valve
      expect(isISACompliant('LG-401')).toBe(true); // Level Gauge/Glass
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum loop number', () => {
      const tag = parseTag('FT-1');
      expect(tag?.loopNumber).toBe('1');
      expect(validateTag('FT-1')).toHaveLength(0);
    });

    it('should handle maximum loop number', () => {
      const tag = parseTag('FT-9999');
      expect(tag?.loopNumber).toBe('9999');
      expect(validateTag('FT-9999')).toHaveLength(0);
    });

    it('should handle all alphabet suffixes', () => {
      for (let i = 65; i <= 90; i++) { // A-Z
        const suffix = String.fromCharCode(i);
        const tagStr = `FT-101${suffix}`;
        expect(validateTag(tagStr)).toHaveLength(0);
      }
    });

    it('should handle single letter function codes', () => {
      const tag = parseTag('F-101');
      // ISA-5.1 allows 1-4 letter codes, so single letter is valid
      expect(tag).not.toBeNull();
      expect(tag?.functionCode).toBe('F');
    });

    it('should handle maximum 4 letter function codes', () => {
      expect(validateTag('PAHH-310')).toHaveLength(0); // 4 letters OK
      expect(validateTag('PAHHH-310').length).toBeGreaterThan(0); // 5 letters NOT OK
    });
  });
});
