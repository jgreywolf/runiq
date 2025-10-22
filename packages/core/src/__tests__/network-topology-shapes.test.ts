/**
 * Tests for Network Topology Shapes
 *
 * Tests 8 network infrastructure device shapes:
 * - server, router, switch, firewall
 * - load-balancer, cloud, database (cylinder), storage
 */

import { describe, it, expect } from 'vitest';
import type { ShapeRenderContext } from '../types.js';
import {
  serverShape,
  routerShape,
  switchShape,
  firewallShape,
  loadBalancerShape,
  cloudShape,
  storageShape,
} from '../shapes/network/index.js';
import { cylinderShape } from '../shapes/storage/cylinder.js';

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
      fill: options?.fill || '#e0e0e0',
      stroke: options?.stroke || '#424242',
      strokeWidth: 2,
      fontSize: 10,
    },
    measureText: (text: string) => ({
      width: text.length * 6,
      height: 10,
    }),
  };
}

describe('Network Topology Shapes', () => {
  // ============================================================================
  // Server Shape Tests
  // ============================================================================

  describe('Server Shape', () => {
    it('should have id server', () => {
      expect(serverShape.id).toBe('server');
    });

    it('should calculate fixed 60×80 bounds', () => {
      const ctx = createMockContext('Web Server', 'server');
      const bounds = serverShape.bounds(ctx);
      expect(bounds.width).toBe(60);
      expect(bounds.height).toBe(80);
    });

    it('should have 4 anchor points (top, right, bottom, left)', () => {
      const ctx = createMockContext('Web Server', 'server');
      const anchors = serverShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render rack-mount server with dividers', () => {
      const ctx = createMockContext('Web Server', 'server');
      const svg = serverShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect'); // Main body
      expect(svg).toContain('<line'); // Horizontal dividers
      expect(svg).toContain('Web Server'); // Label
    });
  });

  // ============================================================================
  // Router Shape Tests
  // ============================================================================

  describe('Router Shape', () => {
    it('should have id router', () => {
      expect(routerShape.id).toBe('router');
    });

    it('should calculate fixed 60×60 bounds', () => {
      const ctx = createMockContext('Gateway', 'router');
      const bounds = routerShape.bounds(ctx);
      expect(bounds.width).toBe(60);
      expect(bounds.height).toBe(60);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Gateway', 'router');
      const anchors = routerShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render router with directional arrows', () => {
      const ctx = createMockContext('Gateway', 'router');
      const svg = routerShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect'); // Body
      expect(svg).toContain('rx='); // Rounded corners
      expect(svg).toContain('<polygon'); // Direction arrows
    });
  });

  // ============================================================================
  // Switch Shape Tests
  // ============================================================================

  describe('Switch Shape', () => {
    it('should have id switch', () => {
      expect(switchShape.id).toBe('switch');
    });

    it('should calculate fixed 60×50 bounds', () => {
      const ctx = createMockContext('Core Switch', 'switch');
      const bounds = switchShape.bounds(ctx);
      expect(bounds.width).toBe(60);
      expect(bounds.height).toBe(50);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('Core Switch', 'switch');
      const anchors = switchShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render switch with port indicators', () => {
      const ctx = createMockContext('Core Switch', 'switch');
      const svg = switchShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect'); // Body
      expect(svg).toContain('<circle'); // Port indicators (8 ports)
    });
  });

  // ============================================================================
  // Firewall Shape Tests
  // ============================================================================

  describe('Firewall Shape', () => {
    it('should have id firewall', () => {
      expect(firewallShape.id).toBe('firewall');
    });

    it('should calculate fixed 60×60 bounds', () => {
      const ctx = createMockContext('DMZ Firewall', 'firewall');
      const bounds = firewallShape.bounds(ctx);
      expect(bounds.width).toBe(60);
      expect(bounds.height).toBe(60);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('DMZ Firewall', 'firewall');
      const anchors = firewallShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render firewall with flame icon', () => {
      const ctx = createMockContext('DMZ Firewall', 'firewall');
      const svg = firewallShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect'); // Body
      expect(svg).toContain('<path'); // Flame icon
      expect(svg).toContain('fill="#424242"'); // Flame uses stroke color
    });
  });

  // ============================================================================
  // Load Balancer Shape Tests
  // ============================================================================

  describe('Load Balancer Shape', () => {
    it('should have id load-balancer', () => {
      expect(loadBalancerShape.id).toBe('loadBalancer');
    });

    it('should calculate fixed 70×60 bounds', () => {
      const ctx = createMockContext('ALB', 'load-balancer');
      const bounds = loadBalancerShape.bounds(ctx);
      expect(bounds.width).toBe(70);
      expect(bounds.height).toBe(60);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('ALB', 'load-balancer');
      const anchors = loadBalancerShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render load balancer with distribution arrows', () => {
      const ctx = createMockContext('ALB', 'load-balancer');
      const svg = loadBalancerShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<polygon'); // Trapezoid body
      expect(svg).toContain('<line'); // Distribution arrows
    });
  });

  // ============================================================================
  // Cloud Shape Tests
  // ============================================================================

  describe('Cloud Shape', () => {
    it('should have id cloud', () => {
      expect(cloudShape.id).toBe('cloud');
    });

    it('should calculate fixed 100×70 bounds', () => {
      const ctx = createMockContext('AWS', 'cloud');
      const bounds = cloudShape.bounds(ctx);
      expect(bounds.width).toBe(100);
      expect(bounds.height).toBe(70);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('AWS', 'cloud');
      const anchors = cloudShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render cloud outline', () => {
      const ctx = createMockContext('AWS', 'cloud');
      const svg = cloudShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<path'); // Cloud path
      expect(svg).toContain('C'); // Cubic Bezier curves for bumps
    });
  });

  // ============================================================================
  // Storage Shape Tests
  // ============================================================================

  describe('Storage Shape', () => {
    it('should have id storage', () => {
      expect(storageShape.id).toBe('storage');
    });

    it('should calculate fixed 60×60 bounds', () => {
      const ctx = createMockContext('SAN', 'storage');
      const bounds = storageShape.bounds(ctx);
      expect(bounds.width).toBe(60);
      expect(bounds.height).toBe(60);
    });

    it('should have 4 anchor points', () => {
      const ctx = createMockContext('SAN', 'storage');
      const anchors = storageShape.anchors!(ctx);
      expect(anchors).toHaveLength(4);
      expect(anchors.map((a) => a.name)).toEqual([
        'top',
        'right',
        'bottom',
        'left',
      ]);
    });

    it('should render stacked disk array (4 disks)', () => {
      const ctx = createMockContext('SAN', 'storage');
      const svg = storageShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<rect'); // Disk rectangles
      expect(svg).toContain('rx="2"'); // Rounded corners
      // Count <rect elements (should be 4 for 4 disks)
      const rectCount = (svg.match(/<rect/g) || []).length;
      expect(rectCount).toBe(4);
    });
  });

  // ============================================================================
  // Database Shape Tests (Cylinder Alias)
  // ============================================================================

  describe('Database Shape (Cylinder)', () => {
    it('should have id cyl', () => {
      expect(cylinderShape.id).toBe('cylinder');
    });

    it('should render as cylinder (database visual)', () => {
      const ctx = createMockContext('PostgreSQL', 'cylinder');
      const svg = cylinderShape.render(ctx, { x: 0, y: 0 });
      expect(svg).toContain('<ellipse'); // Top/bottom of cylinder
      expect(svg).toContain('<rect'); // Body of cylinder
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration', () => {
    it('should have all 7 network topology shapes available', () => {
      const shapes = [
        serverShape,
        routerShape,
        switchShape,
        firewallShape,
        loadBalancerShape,
        cloudShape,
        storageShape,
      ];
      expect(shapes).toHaveLength(7);
      shapes.forEach((shape) => {
        expect(shape.id).toBeDefined();
        expect(shape.bounds).toBeDefined();
        expect(shape.anchors).toBeDefined();
        expect(shape.render).toBeDefined();
      });
    });

    it('should have consistent 4-anchor system', () => {
      const shapes = [
        serverShape,
        routerShape,
        switchShape,
        firewallShape,
        loadBalancerShape,
        cloudShape,
        storageShape,
      ];
      const ctx = createMockContext('Test', 'test');
      shapes.forEach((shape) => {
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

    it('should render all shapes without errors', () => {
      const shapes = [
        { shape: serverShape, label: 'Web Server' },
        { shape: routerShape, label: 'Gateway' },
        { shape: switchShape, label: 'Core Switch' },
        { shape: firewallShape, label: 'DMZ Firewall' },
        { shape: loadBalancerShape, label: 'ALB' },
        { shape: cloudShape, label: 'AWS' },
        { shape: storageShape, label: 'SAN' },
      ];
      shapes.forEach(({ shape, label }) => {
        const ctx = createMockContext(label, shape.id);
        const svg = shape.render(ctx, { x: 0, y: 0 });
        expect(svg).toBeTruthy();
        expect(svg).toContain('<g>');
        expect(svg).toContain(label);
      });
    });
  });
});
