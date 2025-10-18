/**
 * Network Topology Shapes
 *
 * Shapes for IT infrastructure and network diagrams:
 * - server, router, switch, firewall
 * - load-balancer, cloud, storage
 * - database (alias to cylinder)
 */

import type { ShapeDefinition, ShapeRenderContext } from '../types.js';

// ============================================================================
// Server Shape (Rack-mount appearance)
// ============================================================================

export const serverShape: ShapeDefinition = {
  id: 'server',
  bounds: () => ({ width: 60, height: 80 }),
  anchors: () => [
    { x: 30, y: 0, name: 'top' },
    { x: 60, y: 40, name: 'right' },
    { x: 30, y: 80, name: 'bottom' },
    { x: 0, y: 40, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#e0e0e0';
    const stroke = ctx.style?.stroke || '#424242';
    const label = ctx.node.label || '';

    let svg = `<g>`;

    // Main body
    svg += `<rect x="${x}" y="${y}" width="60" height="80" fill="${fill}" stroke="${stroke}" stroke-width="2" />`;

    // Horizontal dividers (rack units)
    svg += `<line x1="${x + 5}" y1="${y + 20}" x2="${x + 55}" y2="${y + 20}" stroke="${stroke}" stroke-width="1" />`;
    svg += `<line x1="${x + 5}" y1="${y + 40}" x2="${x + 55}" y2="${y + 40}" stroke="${stroke}" stroke-width="1" />`;
    svg += `<line x1="${x + 5}" y1="${y + 60}" x2="${x + 55}" y2="${y + 60}" stroke="${stroke}" stroke-width="1" />`;

    // Label
    if (label) {
      svg += `<text x="${x + 30}" y="${y + 45}" text-anchor="middle" font-size="10" fill="#000">${label}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Router Shape (Rounded rectangle with directional arrows)
// ============================================================================

export const routerShape: ShapeDefinition = {
  id: 'router',
  bounds: () => ({ width: 60, height: 60 }),
  anchors: () => [
    { x: 30, y: 0, name: 'top' },
    { x: 60, y: 30, name: 'right' },
    { x: 30, y: 60, name: 'bottom' },
    { x: 0, y: 30, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#e3f2fd';
    const stroke = ctx.style?.stroke || '#1976d2';
    const label = ctx.node.label || '';

    let svg = `<g>`;

    // Main body (rounded rectangle)
    svg += `<rect x="${x}" y="${y}" width="60" height="60" rx="5" ry="5" fill="${fill}" stroke="${stroke}" stroke-width="2" />`;

    // Direction arrows (small triangles pointing outward)
    // Top arrow
    svg += `<polygon points="${x + 30},${y + 8} ${x + 27},${y + 13} ${x + 33},${y + 13}" fill="${stroke}" />`;
    // Right arrow
    svg += `<polygon points="${x + 52},${y + 30} ${x + 47},${y + 27} ${x + 47},${y + 33}" fill="${stroke}" />`;
    // Bottom arrow
    svg += `<polygon points="${x + 30},${y + 52} ${x + 27},${y + 47} ${x + 33},${y + 47}" fill="${stroke}" />`;
    // Left arrow
    svg += `<polygon points="${x + 8},${y + 30} ${x + 13},${y + 27} ${x + 13},${y + 33}" fill="${stroke}" />`;

    // Label
    if (label) {
      svg += `<text x="${x + 30}" y="${y + 33}" text-anchor="middle" font-size="9" fill="#000">${label}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Switch Shape (Rectangle with ports at bottom)
// ============================================================================

export const switchShape: ShapeDefinition = {
  id: 'switch',
  bounds: () => ({ width: 60, height: 50 }),
  anchors: () => [
    { x: 30, y: 0, name: 'top' },
    { x: 60, y: 25, name: 'right' },
    { x: 30, y: 50, name: 'bottom' },
    { x: 0, y: 25, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#f5f5f5';
    const stroke = ctx.style?.stroke || '#616161';
    const label = ctx.node.label || '';

    let svg = `<g>`;

    // Main body
    svg += `<rect x="${x}" y="${y}" width="60" height="50" fill="${fill}" stroke="${stroke}" stroke-width="2" />`;

    // Port indicators (8 small circles at bottom)
    const portY = y + 42;
    const spacing = 6;
    const startX = x + 9;
    for (let i = 0; i < 8; i++) {
      svg += `<circle cx="${startX + i * spacing}" cy="${portY}" r="1.5" fill="${stroke}" />`;
    }

    // Label
    if (label) {
      svg += `<text x="${x + 30}" y="${y + 22}" text-anchor="middle" font-size="9" fill="#000">${label}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Firewall Shape (Rectangle with flame icon)
// ============================================================================

export const firewallShape: ShapeDefinition = {
  id: 'firewall',
  bounds: () => ({ width: 60, height: 60 }),
  anchors: () => [
    { x: 30, y: 0, name: 'top' },
    { x: 60, y: 30, name: 'right' },
    { x: 30, y: 60, name: 'bottom' },
    { x: 0, y: 30, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#ffebee';
    const stroke = ctx.style?.stroke || '#c62828';
    const label = ctx.node.label || '';

    let svg = `<g>`;

    // Main body
    svg += `<rect x="${x}" y="${y}" width="60" height="60" fill="${fill}" stroke="${stroke}" stroke-width="2" />`;

    // Flame icon (simplified path)
    const flameX = x + 30;
    const flameY = y + 30;
    svg += `<path d="M ${flameX},${flameY - 12} 
                   Q ${flameX - 6},${flameY - 6} ${flameX - 8},${flameY} 
                   Q ${flameX - 6},${flameY - 4} ${flameX},${flameY + 4} 
                   Q ${flameX + 6},${flameY - 4} ${flameX + 8},${flameY} 
                   Q ${flameX + 6},${flameY - 6} ${flameX},${flameY - 12} Z" 
            fill="${stroke}" opacity="0.6" />`;

    // Inner flame
    svg += `<path d="M ${flameX},${flameY - 8} 
                   Q ${flameX - 3},${flameY - 4} ${flameX - 4},${flameY} 
                   Q ${flameX},${flameY - 2} ${flameX},${flameY + 2} 
                   Q ${flameX + 4},${flameY} ${flameX + 4},${flameY - 4} 
                   Q ${flameX + 3},${flameY - 6} ${flameX},${flameY - 8} Z" 
            fill="#fff" opacity="0.8" />`;

    // Label
    if (label) {
      svg += `<text x="${x + 30}" y="${y + 50}" text-anchor="middle" font-size="8" fill="#000">${label}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Load Balancer Shape (Trapezoid with distribution arrows)
// ============================================================================

export const loadBalancerShape: ShapeDefinition = {
  id: 'load-balancer',
  bounds: () => ({ width: 70, height: 60 }),
  anchors: () => [
    { x: 35, y: 0, name: 'top' },
    { x: 70, y: 30, name: 'right' },
    { x: 35, y: 60, name: 'bottom' },
    { x: 0, y: 30, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#f3e5f5';
    const stroke = ctx.style?.stroke || '#7b1fa2';
    const label = ctx.node.label || '';

    let svg = `<g>`;

    // Trapezoid body (narrow top, wide bottom for distribution visual)
    svg += `<polygon points="${x + 20},${y + 10} ${x + 50},${y + 10} ${x + 65},${y + 35} ${x + 5},${y + 35}" 
            fill="${fill}" stroke="${stroke}" stroke-width="2" />`;

    // Distribution arrows (1 input splitting to 3 outputs)
    // Input arrow (top)
    svg += `<line x1="${x + 35}" y1="${y}" x2="${x + 35}" y2="${y + 10}" stroke="${stroke}" stroke-width="2" />`;

    // Output arrows (bottom - 3 arrows)
    svg += `<line x1="${x + 15}" y1="${y + 35}" x2="${x + 15}" y2="${y + 45}" stroke="${stroke}" stroke-width="1.5" />`;
    svg += `<line x1="${x + 35}" y1="${y + 35}" x2="${x + 35}" y2="${y + 45}" stroke="${stroke}" stroke-width="1.5" />`;
    svg += `<line x1="${x + 55}" y1="${y + 35}" x2="${x + 55}" y2="${y + 45}" stroke="${stroke}" stroke-width="1.5" />`;

    // Label
    if (label) {
      svg += `<text x="${x + 35}" y="${y + 26}" text-anchor="middle" font-size="8" fill="#000">${label}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Cloud Shape (Cloud outline)
// ============================================================================

export const cloudShape: ShapeDefinition = {
  id: 'cloud',
  bounds: () => ({ width: 80, height: 50 }),
  anchors: () => [
    { x: 40, y: 10, name: 'top' },
    { x: 75, y: 30, name: 'right' },
    { x: 40, y: 45, name: 'bottom' },
    { x: 5, y: 30, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#e1f5fe';
    const stroke = ctx.style?.stroke || '#0277bd';
    const label = ctx.node.label || '';

    let svg = `<g>`;

    // Cloud path (three bumps)
    svg += `<path d="
      M ${x + 20},${y + 35}
      Q ${x + 10},${y + 35} ${x + 10},${y + 25}
      Q ${x + 10},${y + 15} ${x + 20},${y + 15}
      Q ${x + 20},${y + 8} ${x + 30},${y + 8}
      Q ${x + 40},${y + 8} ${x + 45},${y + 13}
      Q ${x + 52},${y + 8} ${x + 58},${y + 13}
      Q ${x + 65},${y + 13} ${x + 68},${y + 20}
      Q ${x + 72},${y + 20} ${x + 72},${y + 28}
      Q ${x + 72},${y + 38} ${x + 62},${y + 38}
      L ${x + 20},${y + 38}
      Q ${x + 10},${y + 38} ${x + 10},${y + 28}
      Q ${x + 10},${y + 35} ${x + 20},${y + 35}
      Z" fill="${fill}" stroke="${stroke}" stroke-width="2" />`;

    // Label
    if (label) {
      svg += `<text x="${x + 40}" y="${y + 28}" text-anchor="middle" font-size="10" fill="#000">${label}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Storage Shape (Stacked disk array)
// ============================================================================

export const storageShape: ShapeDefinition = {
  id: 'storage',
  bounds: () => ({ width: 60, height: 60 }),
  anchors: () => [
    { x: 30, y: 0, name: 'top' },
    { x: 60, y: 30, name: 'right' },
    { x: 30, y: 60, name: 'bottom' },
    { x: 0, y: 30, name: 'left' },
  ],
  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const { x, y } = position;
    const fill = ctx.style?.fill || '#e8f5e9';
    const stroke = ctx.style?.stroke || '#388e3c';
    const label = ctx.node.label || '';

    let svg = `<g>`;

    // Four stacked disks
    const diskHeight = 12;
    for (let i = 0; i < 4; i++) {
      const diskY = y + 5 + i * 13;
      svg += `<rect x="${x + 5}" y="${diskY}" width="50" height="${diskHeight}" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="1.5" />`;
      // Separator line
      svg += `<line x1="${x + 5}" y1="${diskY + 6}" x2="${x + 55}" y2="${diskY + 6}" stroke="${stroke}" stroke-width="0.5" opacity="0.5" />`;
    }

    // Label
    if (label) {
      svg += `<text x="${x + 30}" y="${y + 58}" text-anchor="middle" font-size="8" fill="#000">${label}</text>`;
    }

    svg += `</g>`;
    return svg;
  },
};

// ============================================================================
// Database Shape (alias to cylinder - already exists)
// ============================================================================
// Note: 'database' will use the existing 'cylinder' shape
// This is handled in the shape registration
