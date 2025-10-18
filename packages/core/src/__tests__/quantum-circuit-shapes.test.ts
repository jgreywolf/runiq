/**
 * Tests for Quantum Circuit Shapes (TDD)
 *
 * Tests quantum computing gates and circuit elements:
 * - Single-qubit gates: X, Y, Z, H, S, T
 * - Multi-qubit primitives: control-dot, cnot-target, swap-x
 * - Measurement and utility shapes
 *
 * Visual Standard: IBM Qiskit style
 */

import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../types.js';
import {
  gateXShape,
  gateYShape,
  gateZShape,
  gateHShape,
  gateSShape,
  gateTShape,
  controlDotShape,
  cnotTargetShape,
  swapXShape,
  measurementShape,
  qubitWireShape,
  barrierShape,
} from '../shapes/quantum-circuit.js';

function createMockContext(
  label: string,
  shape: string,
  options?: {
    fill?: string;
    stroke?: string;
  }
): ShapeRenderContext {
  return {
    node: {
      id: label.toLowerCase().replace(/\s+/g, '-'),
      shape,
      label,
    },
    style: {
      fill: options?.fill || '#ffffff',
      stroke: options?.stroke || '#000000',
      strokeWidth: 2,
      fontSize: 12,
    },
    measureText: (text: string) => ({
      width: text.length * 7,
      height: 12,
    }),
  };
}

describe('Quantum Circuit Shapes (TDD)', () => {
  // ============================================================================
  // Pauli X Gate (NOT Gate)
  // ============================================================================

  describe('Pauli X Gate', () => {
    it('should have id gate-x', () => {
      expect(gateXShape.id).toBe('gate-x');
    });

    it('should calculate fixed 20×20 bounds', () => {
      const ctx = createMockContext('X', 'gate-x');
      const bounds = gateXShape.bounds(ctx);
      expect(bounds.width).toBe(20);
      expect(bounds.height).toBe(20);
    });

    it('should have 4 anchor points for wire connections', () => {
      const ctx = createMockContext('X', 'gate-x');
      const anchors = gateXShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render square box with X label', () => {
      const ctx = createMockContext('X', 'gate-x');
      const svg = gateXShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect'); // Gate box
      expect(svg).toContain('X'); // Label
      expect(svg).toContain('width="20"');
      expect(svg).toContain('height="20"');
    });
  });

  // ============================================================================
  // Pauli Y Gate
  // ============================================================================

  describe('Pauli Y Gate', () => {
    it('should have id gate-y', () => {
      expect(gateYShape.id).toBe('gate-y');
    });

    it('should calculate fixed 20×20 bounds', () => {
      const ctx = createMockContext('Y', 'gate-y');
      const bounds = gateYShape.bounds(ctx);
      expect(bounds.width).toBe(20);
      expect(bounds.height).toBe(20);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Y', 'gate-y');
      const anchors = gateYShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render square box with Y label', () => {
      const ctx = createMockContext('Y', 'gate-y');
      const svg = gateYShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      expect(svg).toContain('Y');
    });
  });

  // ============================================================================
  // Pauli Z Gate
  // ============================================================================

  describe('Pauli Z Gate', () => {
    it('should have id gate-z', () => {
      expect(gateZShape.id).toBe('gate-z');
    });

    it('should calculate fixed 20×20 bounds', () => {
      const ctx = createMockContext('Z', 'gate-z');
      const bounds = gateZShape.bounds(ctx);
      expect(bounds.width).toBe(20);
      expect(bounds.height).toBe(20);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Z', 'gate-z');
      const anchors = gateZShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render square box with Z label', () => {
      const ctx = createMockContext('Z', 'gate-z');
      const svg = gateZShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      expect(svg).toContain('Z');
    });
  });

  // ============================================================================
  // Hadamard Gate (Superposition)
  // ============================================================================

  describe('Hadamard Gate', () => {
    it('should have id gate-h', () => {
      expect(gateHShape.id).toBe('gate-h');
    });

    it('should calculate fixed 20×20 bounds', () => {
      const ctx = createMockContext('H', 'gate-h');
      const bounds = gateHShape.bounds(ctx);
      expect(bounds.width).toBe(20);
      expect(bounds.height).toBe(20);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('H', 'gate-h');
      const anchors = gateHShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render square box with H label', () => {
      const ctx = createMockContext('H', 'gate-h');
      const svg = gateHShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      expect(svg).toContain('H');
    });
  });

  // ============================================================================
  // S Gate (Phase Gate π/2)
  // ============================================================================

  describe('S Gate (Phase)', () => {
    it('should have id gate-s', () => {
      expect(gateSShape.id).toBe('gate-s');
    });

    it('should calculate fixed 20×20 bounds', () => {
      const ctx = createMockContext('S', 'gate-s');
      const bounds = gateSShape.bounds(ctx);
      expect(bounds.width).toBe(20);
      expect(bounds.height).toBe(20);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('S', 'gate-s');
      const anchors = gateSShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render square box with S label', () => {
      const ctx = createMockContext('S', 'gate-s');
      const svg = gateSShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      expect(svg).toContain('S');
    });
  });

  // ============================================================================
  // T Gate (π/8 Gate)
  // ============================================================================

  describe('T Gate', () => {
    it('should have id gate-t', () => {
      expect(gateTShape.id).toBe('gate-t');
    });

    it('should calculate fixed 20×20 bounds', () => {
      const ctx = createMockContext('T', 'gate-t');
      const bounds = gateTShape.bounds(ctx);
      expect(bounds.width).toBe(20);
      expect(bounds.height).toBe(20);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('T', 'gate-t');
      const anchors = gateTShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render square box with T label', () => {
      const ctx = createMockContext('T', 'gate-t');
      const svg = gateTShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect');
      expect(svg).toContain('T');
    });
  });

  // ============================================================================
  // Control Dot (for controlled operations)
  // ============================================================================

  describe('Control Dot', () => {
    it('should have id control-dot', () => {
      expect(controlDotShape.id).toBe('control-dot');
    });

    it('should calculate fixed 8×8 bounds', () => {
      const ctx = createMockContext('', 'control-dot');
      const bounds = controlDotShape.bounds(ctx);
      expect(bounds.width).toBe(8);
      expect(bounds.height).toBe(8);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('', 'control-dot');
      const anchors = controlDotShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render filled circle', () => {
      const ctx = createMockContext('', 'control-dot');
      const svg = controlDotShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<circle');
      expect(svg).toContain('r="4"'); // 8px diameter = 4px radius
      expect(svg).toContain('fill='); // Filled, not hollow
    });
  });

  // ============================================================================
  // CNOT Target (⊕ symbol)
  // ============================================================================

  describe('CNOT Target', () => {
    it('should have id cnot-target', () => {
      expect(cnotTargetShape.id).toBe('cnot-target');
    });

    it('should calculate fixed 16×16 bounds', () => {
      const ctx = createMockContext('', 'cnot-target');
      const bounds = cnotTargetShape.bounds(ctx);
      expect(bounds.width).toBe(16);
      expect(bounds.height).toBe(16);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('', 'cnot-target');
      const anchors = cnotTargetShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render circle with cross (⊕)', () => {
      const ctx = createMockContext('', 'cnot-target');
      const svg = cnotTargetShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<circle'); // Outer circle
      expect(svg).toContain('<line'); // Cross lines
      expect(svg).toContain('r="8"'); // 16px diameter = 8px radius
    });
  });

  // ============================================================================
  // SWAP X Symbol
  // ============================================================================

  describe('SWAP X Symbol', () => {
    it('should have id swap-x', () => {
      expect(swapXShape.id).toBe('swap-x');
    });

    it('should calculate fixed 12×12 bounds', () => {
      const ctx = createMockContext('', 'swap-x');
      const bounds = swapXShape.bounds(ctx);
      expect(bounds.width).toBe(12);
      expect(bounds.height).toBe(12);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('', 'swap-x');
      const anchors = swapXShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render X shape (two diagonal lines)', () => {
      const ctx = createMockContext('', 'swap-x');
      const svg = swapXShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<line'); // Diagonal lines
      const lineCount = (svg.match(/<line/g) || []).length;
      expect(lineCount).toBe(2); // Two lines forming X
    });
  });

  // ============================================================================
  // Measurement Gate
  // ============================================================================

  describe('Measurement Gate', () => {
    it('should have id measurement', () => {
      expect(measurementShape.id).toBe('measurement');
    });

    it('should calculate fixed 25×20 bounds', () => {
      const ctx = createMockContext('M', 'measurement');
      const bounds = measurementShape.bounds(ctx);
      expect(bounds.width).toBe(25);
      expect(bounds.height).toBe(20);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('M', 'measurement');
      const anchors = measurementShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render box with meter symbol', () => {
      const ctx = createMockContext('M', 'measurement');
      const svg = measurementShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect'); // Gate box
      expect(svg).toContain('<path'); // Meter arc
      expect(svg).toContain('width="25"');
      expect(svg).toContain('height="20"');
    });
  });

  // ============================================================================
  // Qubit Wire
  // ============================================================================

  describe('Qubit Wire', () => {
    it('should have id qubit-wire', () => {
      expect(qubitWireShape.id).toBe('qubit-wire');
    });

    it('should calculate wire segment bounds', () => {
      const ctx = createMockContext('', 'qubit-wire');
      const bounds = qubitWireShape.bounds(ctx);
      expect(bounds.width).toBeGreaterThan(0);
      expect(bounds.height).toBe(1); // Thin horizontal line
    });

    it('should have 2 anchor points (left and right)', () => {
      const ctx = createMockContext('', 'qubit-wire');
      const anchors = qubitWireShape.anchors!(ctx);
      expect(anchors).toHaveLength(2);
      expect(anchors.map((a) => a.name)).toEqual(['left', 'right']);
    });

    it('should render horizontal line', () => {
      const ctx = createMockContext('', 'qubit-wire');
      const svg = qubitWireShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<line');
      expect(svg).toContain('stroke='); // Has stroke color
    });
  });

  // ============================================================================
  // Barrier (vertical dashed line)
  // ============================================================================

  describe('Barrier', () => {
    it('should have id barrier', () => {
      expect(barrierShape.id).toBe('barrier');
    });

    it('should calculate barrier bounds', () => {
      const ctx = createMockContext('', 'barrier');
      const bounds = barrierShape.bounds(ctx);
      expect(bounds.width).toBe(2); // Thin vertical line
      expect(bounds.height).toBeGreaterThan(0);
    });

    it('should have 2 anchor points (top and bottom)', () => {
      const ctx = createMockContext('', 'barrier');
      const anchors = barrierShape.anchors!(ctx);
      expect(anchors).toHaveLength(2);
      expect(anchors.map((a) => a.name)).toEqual(['top', 'bottom']);
    });

    it('should render dashed vertical line', () => {
      const ctx = createMockContext('', 'barrier');
      const svg = barrierShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<line');
      expect(svg).toContain('stroke-dasharray'); // Dashed line
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration', () => {
    it('should have all 12 quantum gate shapes available', () => {
      const shapes = [
        gateXShape,
        gateYShape,
        gateZShape,
        gateHShape,
        gateSShape,
        gateTShape,
        controlDotShape,
        cnotTargetShape,
        swapXShape,
        measurementShape,
        qubitWireShape,
        barrierShape,
      ];
      expect(shapes).toHaveLength(12);
      shapes.forEach((shape) => {
        expect(shape.id).toBeDefined();
        expect(shape.bounds).toBeDefined();
        expect(shape.render).toBeDefined();
      });
    });

    it('should have consistent anchor systems', () => {
      const fourAnchorShapes = [
        gateXShape,
        gateYShape,
        gateZShape,
        gateHShape,
        gateSShape,
        gateTShape,
        controlDotShape,
        cnotTargetShape,
        swapXShape,
        measurementShape,
      ];
      const ctx = createMockContext('Test', 'test');
      fourAnchorShapes.forEach((shape) => {
        const anchors = shape.anchors!(ctx);
        expect(anchors).toHaveLength(4);
        expect(anchors.map((a) => a.name)).toEqual([
          'top',
          'right',
          'bottom',
          'left',
        ]);
      });
    });

    it('should render all gate shapes without errors', () => {
      const shapes = [
        { shape: gateXShape, label: 'X' },
        { shape: gateYShape, label: 'Y' },
        { shape: gateZShape, label: 'Z' },
        { shape: gateHShape, label: 'H' },
        { shape: gateSShape, label: 'S' },
        { shape: gateTShape, label: 'T' },
        { shape: controlDotShape, label: '' },
        { shape: cnotTargetShape, label: '' },
        { shape: swapXShape, label: '' },
        { shape: measurementShape, label: 'M' },
        { shape: qubitWireShape, label: '' },
        { shape: barrierShape, label: '' },
      ];
      shapes.forEach(({ shape, label }) => {
        const ctx = createMockContext(label, shape.id);
        const svg = shape.render(ctx, { x: 0, y: 0 });
        expect(svg).toBeTruthy();
        expect(svg).toContain('<');
      });
    });

    it('should have appropriate sizes for quantum circuit layout', () => {
      const ctx = createMockContext('', 'test');

      // Single-qubit gates should be 20×20
      expect(gateXShape.bounds(ctx)).toEqual({ width: 20, height: 20 });
      expect(gateHShape.bounds(ctx)).toEqual({ width: 20, height: 20 });

      // Control dot should be small (8×8)
      expect(controlDotShape.bounds(ctx)).toEqual({ width: 8, height: 8 });

      // CNOT target should be medium (16×16)
      expect(cnotTargetShape.bounds(ctx)).toEqual({ width: 16, height: 16 });

      // Measurement should be wider (25×20)
      expect(measurementShape.bounds(ctx)).toEqual({ width: 25, height: 20 });
    });
  });
});
