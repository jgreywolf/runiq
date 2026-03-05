import { describe, expect, it } from 'vitest';
import { renderDefs } from './defs.js';

describe('renderDefs', () => {
  describe('Basic Structure', () => {
    it('should render defs element', () => {
      const result = renderDefs();

      expect(result).toContain('<defs>');
      expect(result).toContain('</defs>');
    });

    it('should include style element', () => {
      const result = renderDefs();

      expect(result).toContain('<style type="text/css">');
      expect(result).toContain('</style>');
    });

    it('should wrap styles in CDATA section', () => {
      const result = renderDefs();

      expect(result).toContain('<![CDATA[');
      expect(result).toContain(']]>');
    });
  });

  describe('CSS Styles', () => {
    it('should define node text style', () => {
      const result = renderDefs();

      expect(result).toContain('.runiq-node-text');
      expect(result).toContain('font-family: sans-serif');
      expect(result).toContain('font-size: 14px');
    });

    it('should define edge text style', () => {
      const result = renderDefs();

      expect(result).toContain('.runiq-edge-text');
      expect(result).toContain('font-family: sans-serif');
      expect(result).toContain('font-size: 12px');
    });

    it('should define container label style', () => {
      const result = renderDefs();

      expect(result).toContain('.runiq-container-label');
      expect(result).toContain('font-family: sans-serif');
      expect(result).toContain('font-size: 16px');
      expect(result).toContain('font-weight: bold');
      expect(result).toContain('fill: #666');
    });
  });

  describe('Output Format', () => {
    it('should return a non-empty string', () => {
      const result = renderDefs();

      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should contain all required elements in order', () => {
      const result = renderDefs();

      const defsStart = result.indexOf('<defs>');
      const styleStart = result.indexOf('<style');
      const cdataStart = result.indexOf('<![CDATA[');
      const nodeTextStyle = result.indexOf('.runiq-node-text');
      const edgeTextStyle = result.indexOf('.runiq-edge-text');
      const containerLabelStyle = result.indexOf('.runiq-container-label');
      const cdataEnd = result.indexOf(']]>');
      const styleEnd = result.indexOf('</style>');
      const defsEnd = result.indexOf('</defs>');

      // Verify order
      expect(defsStart).toBeLessThan(styleStart);
      expect(styleStart).toBeLessThan(cdataStart);
      expect(cdataStart).toBeLessThan(nodeTextStyle);
      expect(nodeTextStyle).toBeLessThan(edgeTextStyle);
      expect(edgeTextStyle).toBeLessThan(containerLabelStyle);
      expect(containerLabelStyle).toBeLessThan(cdataEnd);
      expect(cdataEnd).toBeLessThan(styleEnd);
      expect(styleEnd).toBeLessThan(defsEnd);
    });
  });
});
