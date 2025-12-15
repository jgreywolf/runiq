import type { IconRef, PositionedNode } from '@runiq/core';
import { IconProvider, iconRegistry } from '@runiq/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderIcon } from './icons.js';

describe('renderIcon', () => {
  let warnings: string[] = [];

  beforeEach(() => {
    warnings = [];
  });

  const createPositionedNode = (
    overrides?: Partial<PositionedNode>
  ): PositionedNode => ({
    id: 'node1',
    x: 100,
    y: 200,
    width: 150,
    height: 80,
    ...overrides,
  });

  describe('Basic Icon Rendering', () => {
    it('should render icon with valid provider and name', () => {
      // Create a mock icon provider
      const mockProvider: IconProvider = {
        id: 'test-provider',
        getPath: (name: string) => {
          if (name === 'test-icon') {
            return {
              d: 'M10 10 L20 20',
              viewBox: '0 0 24 24',
            };
          }
          return undefined;
        },
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider',
        name: 'test-icon',
      };

      const positioned = createPositionedNode();
      const result = renderIcon(icon, positioned, warnings);

      expect(result).toContain('<svg');
      expect(result).toContain('viewBox="0 0 24 24"');
      expect(result).toContain('<path');
      expect(result).toContain('d="M10 10 L20 20"');
      expect(warnings).toHaveLength(0);
    });

    it('should add warning for missing icon provider', () => {
      const icon: IconRef = {
        provider: 'nonexistent-provider',
        name: 'test-icon',
      };

      const positioned = createPositionedNode();
      const result = renderIcon(icon, positioned, warnings);

      expect(result).toBe('');
      expect(warnings).toContain(
        'Icon nonexistent-provider/test-icon not found'
      );
    });

    it('should add warning for missing icon name', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider2',
        getPath: (name: string) => {
          if (name === 'exists') {
            return {
              d: 'M10 10',
              viewBox: '0 0 24 24',
            };
          }
          return undefined;
        },
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider2',
        name: 'nonexistent-icon',
      };

      const positioned = createPositionedNode();
      const result = renderIcon(icon, positioned, warnings);

      expect(result).toBe('');
      expect(warnings).toContain(
        'Icon test-provider2/nonexistent-icon not found'
      );
    });
  });

  describe('Icon Positioning', () => {
    it('should position icon at top-right with padding', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider3',
        getPath: () => ({
          d: 'M10 10',
          viewBox: '0 0 24 24',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider3',
        name: 'icon',
      };

      const positioned = createPositionedNode({
        x: 100,
        y: 200,
        width: 150,
        height: 80,
      });

      const result = renderIcon(icon, positioned, warnings);

      // Icon size is 16, padding is 12
      // iconX = 100 + 150 - 16 - 12 = 222
      // iconY = 200 + 4 = 204
      expect(result).toContain('x="222"');
      expect(result).toContain('y="204"');
    });

    it('should use default icon size of 16', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider4',
        getPath: () => ({
          d: 'M10 10',
          viewBox: '0 0 24 24',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider4',
        name: 'icon',
      };

      const positioned = createPositionedNode();
      const result = renderIcon(icon, positioned, warnings);

      expect(result).toContain('width="16"');
      expect(result).toContain('height="16"');
    });

    it('should handle nodes at origin', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider5',
        getPath: () => ({
          d: 'M10 10',
          viewBox: '0 0 24 24',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider5',
        name: 'icon',
      };

      const positioned = createPositionedNode({
        x: 0,
        y: 0,
        width: 50,
        height: 50,
      });

      const result = renderIcon(icon, positioned, warnings);

      // iconX = 0 + 50 - 16 - 12 = 22
      // iconY = 0 + 4 = 4
      expect(result).toContain('x="22"');
      expect(result).toContain('y="4"');
    });
  });

  describe('Icon Color', () => {
    it('should use currentColor by default', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider6',
        getPath: () => ({
          d: 'M10 10',
          viewBox: '0 0 24 24',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider6',
        name: 'icon',
      };

      const positioned = createPositionedNode();
      const result = renderIcon(icon, positioned, warnings);

      expect(result).toContain('fill="currentColor"');
    });

    it('should use custom icon color from node data', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider7',
        getPath: () => ({
          d: 'M10 10',
          viewBox: '0 0 24 24',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider7',
        name: 'icon',
      };

      const positioned = createPositionedNode();
      // Add iconColor to data
      (positioned as any).data = {
        iconColor: '#ff0000',
      };

      const result = renderIcon(icon, positioned, warnings);

      expect(result).toContain('fill="#ff0000"');
    });
  });

  describe('ViewBox Handling', () => {
    it('should preserve icon viewBox', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider8',
        getPath: () => ({
          d: 'M0 0 L100 100',
          viewBox: '0 0 512 512',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider8',
        name: 'icon',
      };

      const positioned = createPositionedNode();
      const result = renderIcon(icon, positioned, warnings);

      expect(result).toContain('viewBox="0 0 512 512"');
    });

    it('should handle different viewBox formats', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider9',
        getPath: () => ({
          d: 'M0 0 L100 100',
          viewBox: '-10 -10 48 48',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider9',
        name: 'icon',
      };

      const positioned = createPositionedNode();
      const result = renderIcon(icon, positioned, warnings);

      expect(result).toContain('viewBox="-10 -10 48 48"');
    });
  });

  describe('Path Data', () => {
    it('should render simple path data', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider10',
        getPath: () => ({
          d: 'M10 10 L20 20',
          viewBox: '0 0 24 24',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider10',
        name: 'icon',
      };

      const positioned = createPositionedNode();
      const result = renderIcon(icon, positioned, warnings);

      expect(result).toContain('d="M10 10 L20 20"');
    });

    it('should render complex path data', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider11',
        getPath: () => ({
          d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
          viewBox: '0 0 24 24',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider11',
        name: 'icon',
      };

      const positioned = createPositionedNode();
      const result = renderIcon(icon, positioned, warnings);

      expect(result).toContain(
        'd="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small nodes', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider12',
        getPath: () => ({
          d: 'M10 10',
          viewBox: '0 0 24 24',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider12',
        name: 'icon',
      };

      const positioned = createPositionedNode({
        x: 0,
        y: 0,
        width: 20,
        height: 20,
      });

      const result = renderIcon(icon, positioned, warnings);

      // iconX = 0 + 20 - 16 - 12 = -8 (negative is ok)
      expect(result).toContain('x="-8"');
    });

    it('should handle large nodes', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider13',
        getPath: () => ({
          d: 'M10 10',
          viewBox: '0 0 24 24',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider13',
        name: 'icon',
      };

      const positioned = createPositionedNode({
        x: 0,
        y: 0,
        width: 500,
        height: 300,
      });

      const result = renderIcon(icon, positioned, warnings);

      // iconX = 0 + 500 - 16 - 12 = 472
      expect(result).toContain('x="472"');
    });

    it('should handle nodes with negative coordinates', () => {
      const mockProvider: IconProvider = {
        id: 'test-provider14',
        getPath: () => ({
          d: 'M10 10',
          viewBox: '0 0 24 24',
        }),
      };

      iconRegistry.register(mockProvider);

      const icon: IconRef = {
        provider: 'test-provider14',
        name: 'icon',
      };

      const positioned = createPositionedNode({
        x: -100,
        y: -200,
        width: 150,
        height: 80,
      });

      const result = renderIcon(icon, positioned, warnings);

      // iconX = -100 + 150 - 16 - 12 = 22
      // iconY = -200 + 4 = -196
      expect(result).toContain('x="22"');
      expect(result).toContain('y="-196"');
    });
  });
});
