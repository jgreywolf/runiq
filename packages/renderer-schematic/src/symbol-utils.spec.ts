import { Position } from '@runiq/core';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_STYLE,
  renderArrowHead,
  renderCircleBody,
  renderClockwiseArrow,
  renderConnectionLine,
  renderCounterClockwiseArrow,
  renderFixedDisplacementIndicator,
  renderGearTeeth,
  renderHorizontalConnectionLines,
  renderLabel,
  renderMeshPattern,
  renderPilotLine,
  renderPortCircle,
  renderRectangleBody,
  renderSeatLine,
  renderShaftLine,
  renderSpool,
  renderSpring,
  renderVariableDisplacementIndicator,
  renderVerticalConnectionLines,
  styleAttrs,
  type SymbolStyle,
} from './symbol-utils.js';

describe('symbol-utils', () => {
  describe('styleAttrs', () => {
    it('should return default style attributes', () => {
      const result = styleAttrs();
      expect(result).toContain('stroke="currentColor"');
      expect(result).toContain('stroke-width="2.5"');
      expect(result).toContain('fill="white"');
    });

    it('should override stroke color', () => {
      const result = styleAttrs({ strokeColor: '#ff0000' });
      expect(result).toContain('stroke="#ff0000"');
      expect(result).toContain('stroke-width="2.5"');
      expect(result).toContain('fill="white"');
    });

    it('should override stroke width', () => {
      const result = styleAttrs({ strokeWidth: 5 });
      expect(result).toContain('stroke="currentColor"');
      expect(result).toContain('stroke-width="5"');
      expect(result).toContain('fill="white"');
    });

    it('should override fill color', () => {
      const result = styleAttrs({ fillColor: 'none' });
      expect(result).toContain('stroke="currentColor"');
      expect(result).toContain('stroke-width="2.5"');
      expect(result).toContain('fill="none"');
    });

    it('should override all style properties', () => {
      const style: SymbolStyle = {
        strokeColor: '#00ff00',
        strokeWidth: 3.5,
        fillColor: '#cccccc',
      };
      const result = styleAttrs(style);
      expect(result).toContain('stroke="#00ff00"');
      expect(result).toContain('stroke-width="3.5"');
      expect(result).toContain('fill="#cccccc"');
    });

    it('should handle empty style object', () => {
      const result = styleAttrs({});
      expect(result).toBe(styleAttrs(undefined));
    });
  });

  describe('renderCircleBody', () => {
    it('should render circle with default style', () => {
      const result = renderCircleBody(50, 50, 20);
      expect(result).toContain('<circle');
      expect(result).toContain('cx="50"');
      expect(result).toContain('cy="50"');
      expect(result).toContain('r="20"');
      expect(result).toContain('stroke="currentColor"');
      expect(result).toContain('stroke-width="2.5"');
      expect(result).toContain('fill="white"');
    });

    it('should render circle with custom style', () => {
      const result = renderCircleBody(100, 100, 30, {
        strokeColor: '#0000ff',
        strokeWidth: 4,
        fillColor: '#ffff00',
      });
      expect(result).toContain('cx="100"');
      expect(result).toContain('cy="100"');
      expect(result).toContain('r="30"');
      expect(result).toContain('stroke="#0000ff"');
      expect(result).toContain('stroke-width="4"');
      expect(result).toContain('fill="#ffff00"');
    });

    it('should handle zero radius', () => {
      const result = renderCircleBody(50, 50, 0);
      expect(result).toContain('r="0"');
    });

    it('should handle negative coordinates', () => {
      const result = renderCircleBody(-10, -20, 15);
      expect(result).toContain('cx="-10"');
      expect(result).toContain('cy="-20"');
    });

    it('should handle decimal values', () => {
      const result = renderCircleBody(50.5, 60.75, 12.25);
      expect(result).toContain('cx="50.5"');
      expect(result).toContain('cy="60.75"');
      expect(result).toContain('r="12.25"');
    });
  });

  describe('renderRectangleBody', () => {
    it('should render rectangle centered at position', () => {
      const result = renderRectangleBody(50, 50, 40, 30);
      expect(result).toContain('<rect');
      expect(result).toContain('x="30"'); // 50 - 40/2
      expect(result).toContain('y="35"'); // 50 - 30/2
      expect(result).toContain('width="40"');
      expect(result).toContain('height="30"');
    });

    it('should render rectangle with custom style', () => {
      const result = renderRectangleBody(100, 100, 60, 40, {
        strokeColor: '#ff00ff',
        fillColor: 'none',
      });
      expect(result).toContain('x="70"'); // 100 - 60/2
      expect(result).toContain('y="80"'); // 100 - 40/2
      expect(result).toContain('stroke="#ff00ff"');
      expect(result).toContain('fill="none"');
    });

    it('should handle zero dimensions', () => {
      const result = renderRectangleBody(50, 50, 0, 0);
      expect(result).toContain('width="0"');
      expect(result).toContain('height="0"');
    });

    it('should handle negative dimensions', () => {
      const result = renderRectangleBody(50, 50, -20, -10);
      expect(result).toContain('width="-20"');
      expect(result).toContain('height="-10"');
    });

    it('should correctly calculate top-left corner', () => {
      const result = renderRectangleBody(100, 200, 50, 80);
      expect(result).toContain('x="75"'); // 100 - 50/2
      expect(result).toContain('y="160"'); // 200 - 80/2
    });

    it('should handle decimal values', () => {
      const result = renderRectangleBody(50.5, 60.25, 30.5, 40.75);
      expect(result).toContain('x="35.25"'); // 50.5 - 30.5/2
      expect(result).toContain('y="39.875"'); // 60.25 - 40.75/2
    });
  });

  describe('renderHorizontalConnectionLines', () => {
    it('should render left and right connection lines with default extension', () => {
      const result = renderHorizontalConnectionLines(50, 50, 20);
      expect(result).toContain('<line');
      expect(result).toContain('x1="23"'); // 50 - 20 - 7
      expect(result).toContain('x2="30"'); // 50 - 20
      expect(result).toContain('y1="50"');
      expect(result).toContain('y2="50"');
      expect(result).toContain('x1="70"'); // 50 + 20
      expect(result).toContain('x2="77"'); // 50 + 20 + 7
    });

    it('should render with custom extension', () => {
      const result = renderHorizontalConnectionLines(50, 50, 20, 15);
      expect(result).toContain('x1="15"'); // 50 - 20 - 15
      expect(result).toContain('x2="30"'); // 50 - 20
      expect(result).toContain('x1="70"'); // 50 + 20
      expect(result).toContain('x2="85"'); // 50 + 20 + 15
    });

    it('should apply custom style', () => {
      const result = renderHorizontalConnectionLines(50, 50, 20, 7, {
        strokeColor: '#00ff00',
        strokeWidth: 3,
      });
      expect(result).toContain('stroke="#00ff00"');
      expect(result).toContain('stroke-width="3"');
    });

    it('should handle zero extension', () => {
      const result = renderHorizontalConnectionLines(50, 50, 20, 0);
      expect(result).toContain('x1="30"'); // 50 - 20 - 0
      expect(result).toContain('x2="30"'); // 50 - 20
      expect(result).toContain('x1="70"'); // 50 + 20
      expect(result).toContain('x2="70"'); // 50 + 20 + 0
    });

    it('should contain two line elements', () => {
      const result = renderHorizontalConnectionLines(50, 50, 20);
      const lineCount = (result.match(/<line/g) || []).length;
      expect(lineCount).toBe(2);
    });
  });

  describe('renderVerticalConnectionLines', () => {
    it('should render top and bottom connection lines with default extension', () => {
      const result = renderVerticalConnectionLines(50, 50, 20);
      expect(result).toContain('<line');
      expect(result).toContain('y1="23"'); // 50 - 20 - 7
      expect(result).toContain('y2="30"'); // 50 - 20
      expect(result).toContain('x1="50"');
      expect(result).toContain('x2="50"');
      expect(result).toContain('y1="70"'); // 50 + 20
      expect(result).toContain('y2="77"'); // 50 + 20 + 7
    });

    it('should render with custom extension', () => {
      const result = renderVerticalConnectionLines(50, 50, 20, 10);
      expect(result).toContain('y1="20"'); // 50 - 20 - 10
      expect(result).toContain('y2="30"'); // 50 - 20
      expect(result).toContain('y1="70"'); // 50 + 20
      expect(result).toContain('y2="80"'); // 50 + 20 + 10
    });

    it('should apply custom style', () => {
      const result = renderVerticalConnectionLines(50, 50, 20, 7, {
        strokeColor: '#ff0000',
        strokeWidth: 4,
      });
      expect(result).toContain('stroke="#ff0000"');
      expect(result).toContain('stroke-width="4"');
    });

    it('should handle zero extension', () => {
      const result = renderVerticalConnectionLines(50, 50, 20, 0);
      expect(result).toContain('y1="30"'); // 50 - 20 - 0
      expect(result).toContain('y2="30"'); // 50 - 20
      expect(result).toContain('y1="70"'); // 50 + 20
      expect(result).toContain('y2="70"'); // 50 + 20 + 0
    });

    it('should contain two line elements', () => {
      const result = renderVerticalConnectionLines(50, 50, 20);
      const lineCount = (result.match(/<line/g) || []).length;
      expect(lineCount).toBe(2);
    });
  });

  describe('renderConnectionLine', () => {
    it('should render line between two points', () => {
      const result = renderConnectionLine(10, 20, 30, 40);
      expect(result).toContain('<line');
      expect(result).toContain('x1="10"');
      expect(result).toContain('y1="20"');
      expect(result).toContain('x2="30"');
      expect(result).toContain('y2="40"');
    });

    it('should apply custom style', () => {
      const result = renderConnectionLine(0, 0, 100, 100, {
        strokeColor: '#0000ff',
        strokeWidth: 5,
      });
      expect(result).toContain('stroke="#0000ff"');
      expect(result).toContain('stroke-width="5"');
    });

    it('should handle negative coordinates', () => {
      const result = renderConnectionLine(-10, -20, -30, -40);
      expect(result).toContain('x1="-10"');
      expect(result).toContain('y1="-20"');
      expect(result).toContain('x2="-30"');
      expect(result).toContain('y2="-40"');
    });

    it('should handle decimal coordinates', () => {
      const result = renderConnectionLine(10.5, 20.75, 30.25, 40.5);
      expect(result).toContain('x1="10.5"');
      expect(result).toContain('y1="20.75"');
      expect(result).toContain('x2="30.25"');
      expect(result).toContain('y2="40.5"');
    });

    it('should handle zero-length line', () => {
      const result = renderConnectionLine(50, 50, 50, 50);
      expect(result).toContain('x1="50"');
      expect(result).toContain('y1="50"');
      expect(result).toContain('x2="50"');
      expect(result).toContain('y2="50"');
    });
  });

  describe('DEFAULT_STYLE', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_STYLE.strokeColor).toBe('currentColor');
      expect(DEFAULT_STYLE.strokeWidth).toBe(2.5);
      expect(DEFAULT_STYLE.fillColor).toBe('white');
    });

    it('should be immutable type (Required<SymbolStyle>)', () => {
      // Type test - this should compile
      const style: Required<SymbolStyle> = DEFAULT_STYLE;
      expect(style).toBeDefined();
    });
  });

  describe('Arrow functions', () => {
    describe('renderClockwiseArrow', () => {
      it('should render clockwise arrow with default size', () => {
        const result = renderClockwiseArrow(50, 50);
        expect(result).toContain('<path d="M');
        expect(result).toContain('stroke="currentColor"');
        expect(result).toContain('stroke-width="1.5"');
        expect(result).toContain('fill="none"');
      });

      it('should render with custom size', () => {
        const result = renderClockwiseArrow(50, 50, 36);
        expect(result).toContain('<path');
      });

      it('should apply custom style', () => {
        const result = renderClockwiseArrow(50, 50, 18, {
          strokeColor: '#ff0000',
          strokeWidth: 2.5,
        });
        expect(result).toContain('stroke="#ff0000"');
        expect(result).toContain('stroke-width="2.5"');
      });
    });

    describe('renderCounterClockwiseArrow', () => {
      it('should render counter-clockwise arrow with default size', () => {
        const result = renderCounterClockwiseArrow(50, 50);
        expect(result).toContain('<path d="M');
        expect(result).toContain('stroke="currentColor"');
        expect(result).toContain('fill="none"');
      });

      it('should render with custom size', () => {
        const result = renderCounterClockwiseArrow(50, 50, 36);
        expect(result).toContain('<path');
      });

      it('should apply custom style', () => {
        const result = renderCounterClockwiseArrow(50, 50, 18, {
          strokeColor: '#0000ff',
          strokeWidth: 3,
        });
        expect(result).toContain('stroke="#0000ff"');
        expect(result).toContain('stroke-width="3"');
      });
    });

    describe('renderArrowHead', () => {
      it('should render arrow pointing up', () => {
        const result = renderArrowHead(50, 50, 'up');
        expect(result).toContain('<path');
        expect(result).toContain('fill="currentColor"');
        expect(result).toContain('Z'); // Closed path
      });

      it('should render arrow pointing down', () => {
        const result = renderArrowHead(50, 50, 'down');
        expect(result).toContain('<path');
        expect(result).toContain('fill="currentColor"');
      });

      it('should render arrow pointing left', () => {
        const result = renderArrowHead(50, 50, 'left');
        expect(result).toContain('<path');
        expect(result).toContain('fill="currentColor"');
      });

      it('should render arrow pointing right', () => {
        const result = renderArrowHead(50, 50, 'right');
        expect(result).toContain('<path');
        expect(result).toContain('fill="currentColor"');
      });

      it('should render with custom size', () => {
        const result = renderArrowHead(50, 50, 'up', 16);
        expect(result).toContain('<path');
      });

      it('should apply custom style', () => {
        const result = renderArrowHead(50, 50, 'up', 8, {
          strokeColor: '#00ff00',
        });
        expect(result).toContain('fill="#00ff00"');
      });
    });
  });

  describe('Mechanical elements', () => {
    describe('renderShaftLine', () => {
      it('should render shaft line with default extension', () => {
        const result = renderShaftLine(50, 50, 20);
        expect(result).toContain('<line');
        expect(result).toContain('x1="50"');
        expect(result).toContain('x2="50"');
        expect(result).toContain('y1="30"'); // cy - radius
        expect(result).toContain('y2="23"'); // cy - radius - extension
        expect(result).toContain('stroke-width="3"');
      });

      it('should render with custom extension', () => {
        const result = renderShaftLine(50, 50, 20, 15);
        expect(result).toContain('y2="15"'); // cy - radius - extension
      });

      it('should apply custom style', () => {
        const result = renderShaftLine(50, 50, 20, 7, {
          strokeColor: '#ff00ff',
          strokeWidth: 5,
        });
        expect(result).toContain('stroke="#ff00ff"');
        expect(result).toContain('stroke-width="5"');
      });
    });

    describe('renderGearTeeth', () => {
      it('should render gear teeth around circle', () => {
        const result = renderGearTeeth(50, 50, 20);
        expect(result).toContain('<!-- Top tooth -->');
        expect(result).toContain('<!-- Right tooth -->');
        expect(result).toContain('<!-- Bottom tooth -->');
        expect(result).toContain('<!-- Left tooth -->');
        expect(result).toContain('fill="currentColor"');
      });

      it('should render with custom teeth size', () => {
        const result = renderGearTeeth(50, 50, 20, 5);
        expect(result).toContain('<path');
      });
    });
  });

  describe('Hydraulic/Pneumatic indicators', () => {
    describe('renderFixedDisplacementIndicator', () => {
      it('should render triangle on left by default', () => {
        const result = renderFixedDisplacementIndicator(50, 50, 20);
        expect(result).toContain('<polygon');
        expect(result).toContain('fill="currentColor"');
      });

      it('should render triangle on right when specified', () => {
        const result = renderFixedDisplacementIndicator(
          50,
          50,
          20,
          Position.RIGHT
        );
        expect(result).toContain('<polygon');
      });
    });

    describe('renderVariableDisplacementIndicator', () => {
      it('should render diagonal line on left by default', () => {
        const result = renderVariableDisplacementIndicator(50, 50, 20);
        expect(result).toContain('<line');
        expect(result).toContain('stroke="currentColor"');
      });

      it('should render diagonal line on right when specified', () => {
        const result = renderVariableDisplacementIndicator(
          50,
          50,
          20,
          Position.RIGHT
        );
        expect(result).toContain('<line');
      });

      it('should apply custom style', () => {
        const result = renderVariableDisplacementIndicator(
          50,
          50,
          20,
          Position.LEFT,
          {
            strokeColor: '#0000ff',
            strokeWidth: 3.5,
          }
        );
        expect(result).toContain('stroke="#0000ff"');
        expect(result).toContain('stroke-width="3.5"');
      });
    });
  });

  describe('Text labels', () => {
    describe('renderLabel', () => {
      it('should render text label with default font size', () => {
        const result = renderLabel(10, 20, 'Test Label');
        expect(result).toContain('<text');
        expect(result).toContain('x="10"');
        expect(result).toContain('y="20"');
        expect(result).toContain('font-size="7"');
        expect(result).toContain('fill="currentColor"');
        expect(result).toContain('Test Label');
      });

      it('should render with custom font size', () => {
        const result = renderLabel(10, 20, 'Custom', 12);
        expect(result).toContain('font-size="12"');
        expect(result).toContain('Custom');
      });

      it('should handle special characters in text', () => {
        const result = renderLabel(10, 20, '<>&"\'');
        expect(result).toContain('<>&"\'');
      });
    });
  });

  describe('Specialized component elements', () => {
    describe('renderSpring', () => {
      it('should render zigzag spring pattern with default coils', () => {
        const result = renderSpring(0, 0, 60, 0);
        expect(result).toContain('<path d="M');
        expect(result).toContain('stroke="currentColor"');
        expect(result).toContain('stroke-width="1.5"');
        expect(result).toContain('fill="none"');
      });

      it('should render with custom number of coils', () => {
        const result = renderSpring(0, 0, 60, 0, 5);
        expect(result).toContain('<path');
      });

      it('should apply custom style', () => {
        const result = renderSpring(0, 0, 60, 0, 3, {
          strokeColor: '#ff0000',
          strokeWidth: 2,
        });
        expect(result).toContain('stroke="#ff0000"');
        expect(result).toContain('stroke-width="2"');
      });
    });

    describe('renderSpool', () => {
      it('should render filled spool by default', () => {
        const result = renderSpool(10, 20, 30, 40);
        expect(result).toContain('<rect');
        expect(result).toContain('x="10"');
        expect(result).toContain('y="20"');
        expect(result).toContain('width="30"');
        expect(result).toContain('height="40"');
        expect(result).toContain('fill="white"');
      });

      it('should render unfilled spool when specified', () => {
        const result = renderSpool(10, 20, 30, 40, false);
        expect(result).toContain('fill="none"');
      });

      it('should apply custom style', () => {
        const result = renderSpool(10, 20, 30, 40, true, {
          strokeColor: '#0000ff',
          strokeWidth: 3,
          fillColor: '#cccccc',
        });
        expect(result).toContain('stroke="#0000ff"');
        expect(result).toContain('stroke-width="3"');
        expect(result).toContain('fill="#cccccc"');
      });
    });

    describe('renderPilotLine', () => {
      it('should render dashed line', () => {
        const result = renderPilotLine(10, 20, 100, 80);
        expect(result).toContain('<line');
        expect(result).toContain('x1="10"');
        expect(result).toContain('y1="20"');
        expect(result).toContain('x2="100"');
        expect(result).toContain('y2="80"');
        expect(result).toContain('stroke-dasharray="2,2"');
        expect(result).toContain('stroke-width="1.5"');
      });

      it('should apply custom style', () => {
        const result = renderPilotLine(10, 20, 100, 80, {
          strokeColor: '#00ff00',
          strokeWidth: 2.5,
        });
        expect(result).toContain('stroke="#00ff00"');
        expect(result).toContain('stroke-width="2.5"');
        expect(result).toContain('stroke-dasharray="2,2"');
      });
    });

    describe('renderMeshPattern', () => {
      it('should render mesh pattern', () => {
        const result = renderMeshPattern(50, 50, 40, 30);
        expect(result).toContain('<path');
        expect(result).toContain('stroke="currentColor"');
        expect(result).toContain('stroke-width="1.5"');
        expect(result).toContain('fill="none"');
      });

      it('should apply custom style', () => {
        const result = renderMeshPattern(50, 50, 40, 30, {
          strokeColor: '#ff00ff',
          strokeWidth: 2,
        });
        expect(result).toContain('stroke="#ff00ff"');
        expect(result).toContain('stroke-width="2"');
      });
    });

    describe('renderSeatLine', () => {
      it('should render valve seat line', () => {
        const result = renderSeatLine(10, 20, 100, 80);
        expect(result).toContain('<line');
        expect(result).toContain('x1="10"');
        expect(result).toContain('y1="20"');
        expect(result).toContain('x2="100"');
        expect(result).toContain('y2="80"');
        expect(result).toContain('stroke-width="1.5"');
      });

      it('should apply custom style', () => {
        const result = renderSeatLine(10, 20, 100, 80, {
          strokeColor: '#0000ff',
          strokeWidth: 3,
        });
        expect(result).toContain('stroke="#0000ff"');
        expect(result).toContain('stroke-width="3"');
      });
    });

    describe('renderPortCircle', () => {
      it('should render port circle with default radius', () => {
        const result = renderPortCircle(50, 50);
        expect(result).toContain('<circle');
        expect(result).toContain('cx="50"');
        expect(result).toContain('cy="50"');
        expect(result).toContain('r="2"');
        expect(result).toContain('fill="currentColor"');
      });

      it('should render with custom radius', () => {
        const result = renderPortCircle(50, 50, 5);
        expect(result).toContain('r="5"');
      });
    });
  });
});
