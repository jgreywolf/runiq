/**
 * Quantum Circuit Shapes
 *
 * Shapes for quantum computing circuits (Qiskit-style):
 * - Single-qubit gates: X, Y, Z, H, S, T
 * - Multi-qubit primitives: control-dot, cnot-target, swap-x
 * - Measurement and utility shapes: measurement, qubit-wire, barrier
 *
 * Visual Standard: IBM Qiskit
 */

import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

// ============================================================================
// Pauli X Gate (NOT Gate)
// ============================================================================

export const gateXShape: ShapeDefinition = {
  id: 'gateX',
  bounds: () => ({ width: 20, height: 20 }),
  anchors: () => [
    { x: 10, y: 0, name: 'top' },
    { x: 20, y: 10, name: 'right' },
    { x: 10, y: 20, name: 'bottom' },
    { x: 0, y: 10, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#ffebee'; // Light red
    const stroke = ctx.style?.stroke || '#000000';

    let svg = `<g>`;

    // Gate box
    svg += `<rect x="${x}" y="${y}" width="20" height="20" fill="${fill}" stroke="${stroke}" stroke-width="2" rx="2" />`;

    // X label
    svg += `<text x="${x + 10}" y="${y + 14}" text-anchor="middle" font-size="14" font-weight="bold" fill="${stroke}">X</text>`;

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Pauli Y Gate
// ============================================================================

export const gateYShape: ShapeDefinition = {
  id: 'gateY',
  bounds: () => ({ width: 20, height: 20 }),
  anchors: () => [
    { x: 10, y: 0, name: 'top' },
    { x: 20, y: 10, name: 'right' },
    { x: 10, y: 20, name: 'bottom' },
    { x: 0, y: 10, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#ffebee'; // Light red
    const stroke = ctx.style?.stroke || '#000000';

    let svg = `<g>`;

    // Gate box
    svg += `<rect x="${x}" y="${y}" width="20" height="20" fill="${fill}" stroke="${stroke}" stroke-width="2" rx="2" />`;

    // Y label
    svg += `<text x="${x + 10}" y="${y + 14}" text-anchor="middle" font-size="14" font-weight="bold" fill="${stroke}">Y</text>`;

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Pauli Z Gate
// ============================================================================

export const gateZShape: ShapeDefinition = {
  id: 'gateZ',
  bounds: () => ({ width: 20, height: 20 }),
  anchors: () => [
    { x: 10, y: 0, name: 'top' },
    { x: 20, y: 10, name: 'right' },
    { x: 10, y: 20, name: 'bottom' },
    { x: 0, y: 10, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#ffebee'; // Light red
    const stroke = ctx.style?.stroke || '#000000';

    let svg = `<g>`;

    // Gate box
    svg += `<rect x="${x}" y="${y}" width="20" height="20" fill="${fill}" stroke="${stroke}" stroke-width="2" rx="2" />`;

    // Z label
    svg += `<text x="${x + 10}" y="${y + 14}" text-anchor="middle" font-size="14" font-weight="bold" fill="${stroke}">Z</text>`;

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Hadamard Gate (Superposition)
// ============================================================================

export const gateHShape: ShapeDefinition = {
  id: 'gateH',
  bounds: () => ({ width: 20, height: 20 }),
  anchors: () => [
    { x: 10, y: 0, name: 'top' },
    { x: 20, y: 10, name: 'right' },
    { x: 10, y: 20, name: 'bottom' },
    { x: 0, y: 10, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#e8f5e9'; // Light green
    const stroke = ctx.style?.stroke || '#000000';

    let svg = `<g>`;

    // Gate box
    svg += `<rect x="${x}" y="${y}" width="20" height="20" fill="${fill}" stroke="${stroke}" stroke-width="2" rx="2" />`;

    // H label
    svg += `<text x="${x + 10}" y="${y + 14}" text-anchor="middle" font-size="14" font-weight="bold" fill="${stroke}">H</text>`;

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// S Gate (Phase Gate π/2)
// ============================================================================

export const gateSShape: ShapeDefinition = {
  id: 'gateS',
  bounds: () => ({ width: 20, height: 20 }),
  anchors: () => [
    { x: 10, y: 0, name: 'top' },
    { x: 20, y: 10, name: 'right' },
    { x: 10, y: 20, name: 'bottom' },
    { x: 0, y: 10, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#fff9c4'; // Light yellow
    const stroke = ctx.style?.stroke || '#000000';

    let svg = `<g>`;

    // Gate box
    svg += `<rect x="${x}" y="${y}" width="20" height="20" fill="${fill}" stroke="${stroke}" stroke-width="2" rx="2" />`;

    // S label
    svg += `<text x="${x + 10}" y="${y + 14}" text-anchor="middle" font-size="14" font-weight="bold" fill="${stroke}">S</text>`;

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// T Gate (π/8 Gate)
// ============================================================================

export const gateTShape: ShapeDefinition = {
  id: 'gateT',
  bounds: () => ({ width: 20, height: 20 }),
  anchors: () => [
    { x: 10, y: 0, name: 'top' },
    { x: 20, y: 10, name: 'right' },
    { x: 10, y: 20, name: 'bottom' },
    { x: 0, y: 10, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#fff9c4'; // Light yellow
    const stroke = ctx.style?.stroke || '#000000';

    let svg = `<g>`;

    // Gate box
    svg += `<rect x="${x}" y="${y}" width="20" height="20" fill="${fill}" stroke="${stroke}" stroke-width="2" rx="2" />`;

    // T label
    svg += `<text x="${x + 10}" y="${y + 14}" text-anchor="middle" font-size="14" font-weight="bold" fill="${stroke}">T</text>`;

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Control Dot (for controlled operations like CNOT)
// ============================================================================

export const controlDotShape: ShapeDefinition = {
  id: 'controlDot',
  bounds: () => ({ width: 8, height: 8 }),
  anchors: () => [
    { x: 4, y: 0, name: 'top' },
    { x: 8, y: 4, name: 'right' },
    { x: 4, y: 8, name: 'bottom' },
    { x: 0, y: 4, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#000000'; // Black filled circle
    const stroke = ctx.style?.stroke || '#000000';

    let svg = `<g>`;

    // Filled circle (control qubit indicator)
    svg += `<circle cx="${x + 4}" cy="${y + 4}" r="4" fill="${fill}" stroke="${stroke}" stroke-width="1" />`;

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// CNOT Target (⊕ symbol - circle with cross)
// ============================================================================

export const cnotTargetShape: ShapeDefinition = {
  id: 'cnotTarget',
  bounds: () => ({ width: 16, height: 16 }),
  anchors: () => [
    { x: 8, y: 0, name: 'top' },
    { x: 16, y: 8, name: 'right' },
    { x: 8, y: 16, name: 'bottom' },
    { x: 0, y: 8, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#ffffff'; // White background
    const stroke = ctx.style?.stroke || '#000000';

    let svg = `<g>`;

    // Outer circle
    svg += `<circle cx="${x + 8}" cy="${y + 8}" r="8" fill="${fill}" stroke="${stroke}" stroke-width="2" />`;

    // Horizontal line of cross
    svg += `<line x1="${x + 2}" y1="${y + 8}" x2="${x + 14}" y2="${y + 8}" stroke="${stroke}" stroke-width="2" />`;

    // Vertical line of cross
    svg += `<line x1="${x + 8}" y1="${y + 2}" x2="${x + 8}" y2="${y + 14}" stroke="${stroke}" stroke-width="2" />`;

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// SWAP X Symbol (✕ for SWAP gate)
// ============================================================================

export const swapXShape: ShapeDefinition = {
  id: 'swapX',
  bounds: () => ({ width: 12, height: 12 }),
  anchors: () => [
    { x: 6, y: 0, name: 'top' },
    { x: 12, y: 6, name: 'right' },
    { x: 6, y: 12, name: 'bottom' },
    { x: 0, y: 6, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const stroke = ctx.style?.stroke || '#000000';

    let svg = `<g>`;

    // Diagonal line (top-left to bottom-right)
    svg += `<line x1="${x}" y1="${y}" x2="${x + 12}" y2="${y + 12}" stroke="${stroke}" stroke-width="2" />`;

    // Diagonal line (top-right to bottom-left)
    svg += `<line x1="${x + 12}" y1="${y}" x2="${x}" y2="${y + 12}" stroke="${stroke}" stroke-width="2" />`;

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Measurement Gate (box with meter symbol)
// ============================================================================

export const measurementShape: ShapeDefinition = {
  id: 'measurement',
  bounds: () => ({ width: 25, height: 20 }),
  anchors: () => [
    { x: 12.5, y: 0, name: 'top' },
    { x: 25, y: 10, name: 'right' },
    { x: 12.5, y: 20, name: 'bottom' },
    { x: 0, y: 10, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#e3f2fd'; // Light blue
    const stroke = ctx.style?.stroke || '#000000';

    let svg = `<g>`;

    // Gate box
    svg += `<rect x="${x}" y="${y}" width="25" height="20" fill="${fill}" stroke="${stroke}" stroke-width="2" rx="2" />`;

    // Meter symbol (arc + pointer)
    const centerX = x + 12.5;
    const centerY = y + 14;

    // Arc (bottom half of circle representing meter)
    svg += `<path d="M ${x + 5},${y + 14} A 7.5,7.5 0 0,1 ${x + 20},${y + 14}" 
            fill="none" stroke="${stroke}" stroke-width="1.5" />`;

    // Pointer (line from center pointing up-right)
    svg += `<line x1="${centerX}" y1="${centerY}" x2="${centerX + 4}" y2="${centerY - 6}" 
            stroke="${stroke}" stroke-width="1.5" />`;

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Qubit Wire (horizontal line segment)
// ============================================================================

export const qubitWireShape: ShapeDefinition = {
  id: 'qubitWire',
  bounds: () => ({ width: 50, height: 1 }), // Default segment length
  anchors: () => [
    { x: 0, y: 0.5, name: 'left' },
    { x: 50, y: 0.5, name: 'right' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const stroke = ctx.style?.stroke || '#000000';

    let svg = `<g>`;

    // Horizontal line (qubit wire)
    svg += `<line x1="${x}" y1="${y}" x2="${x + 50}" y2="${y}" stroke="${stroke}" stroke-width="1" />`;

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Barrier (vertical dashed line for preventing gate reordering)
// ============================================================================

export const barrierShape: ShapeDefinition = {
  id: 'barrier',
  bounds: () => ({ width: 2, height: 40 }), // Default height for multi-qubit circuit
  anchors: () => [
    { x: 1, y: 0, name: 'top' },
    { x: 1, y: 40, name: 'bottom' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const stroke = ctx.style?.stroke || '#888888'; // Gray dashed line

    let svg = `<g>`;

    // Vertical dashed line
    svg += `<line x1="${x + 1}" y1="${y}" x2="${x + 1}" y2="${y + 40}" 
            stroke="${stroke}" stroke-width="2" stroke-dasharray="4,4" />`;

    svg += `</g>`;
    return svg;
  },
};
