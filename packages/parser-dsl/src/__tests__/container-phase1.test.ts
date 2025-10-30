import { describe, it, expect } from 'vitest';
import { parse } from '../index.js';

describe('Container Phase 1: Styling Enhancements', () => {
  describe('Header Property', () => {
    it('should parse container with header property', () => {
      const dsl = `
        diagram "test"
        container "Frontend" header: "Frontend Services" {
          shape node1 as @rect label: "UI"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.containers).toHaveLength(1);
      const container = result.diagram?.containers?.[0];
      expect(container?.label).toBe('Frontend');
      expect(container?.header).toBe('Frontend Services');
    });

    it('should parse container with different header than label', () => {
      const dsl = `
        diagram "test"
        container "API" header: "API Gateway Layer" {
          shape node1 as @rect label: "REST"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.label).toBe('API');
      expect(container?.header).toBe('API Gateway Layer');
      expect(container?.header).not.toBe(container?.label);
    });

    it('should parse container without header property', () => {
      const dsl = `
        diagram "test"
        container "Backend" {
          shape node1 as @rect label: "DB"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.header).toBeUndefined();
    });
  });

  describe('Icon Property', () => {
    it('should parse container with icon property', () => {
      const dsl = `
        diagram "test"
        container "Backend" icon: "server" {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.icon).toBe('server');
    });

    it('should parse different icon names', () => {
      const icons = ['database', 'cloud', 'lock', 'users', 'desktop'];
      
      for (const iconName of icons) {
        const dsl = `
          diagram "test"
          container "Container" icon: "${iconName}" {
            shape node1 as @rect label: "Node"
          }
        `;
        const result = parse(dsl);

        expect(result.success).toBe(true);
        const container = result.diagram?.containers?.[0];
        expect(container?.icon).toBe(iconName);
      }
    });

    it('should parse container without icon', () => {
      const dsl = `
        diagram "test"
        container "Container" {
          shape node1 as @rect label: "Node"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.icon).toBeUndefined();
    });
  });

  describe('Badge Property', () => {
    it('should parse container with badge property', () => {
      const dsl = `
        diagram "test"
        container "API Gateway" badge: "v2.0" {
          shape node1 as @rect label: "REST"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.badge).toBe('v2.0');
    });

    it('should parse different badge values', () => {
      const badges = ['v1.0', 'PROD', 'Beta', '3.2.1', 'NEW'];
      
      for (const badgeText of badges) {
        const dsl = `
          diagram "test"
          container "Service" badge: "${badgeText}" {
            shape node1 as @rect label: "Node"
          }
        `;
        const result = parse(dsl);

        expect(result.success).toBe(true);
        const container = result.diagram?.containers?.[0];
        expect(container?.badge).toBe(badgeText);
      }
    });

    it('should parse container with both icon and badge', () => {
      const dsl = `
        diagram "test"
        container "API" icon: "server" badge: "v2.0" {
          shape node1 as @rect label: "REST"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.icon).toBe('server');
      expect(container?.badge).toBe('v2.0');
    });
  });

  describe('Collapsible and Collapsed Properties', () => {
    it('should parse container with collapsible property', () => {
      const dsl = `
        diagram "test"
        container "Services" collapsible: true {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapsible).toBe(true);
    });

    it('should parse container with collapsible false', () => {
      const dsl = `
        diagram "test"
        container "Services" collapsible: false {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapsible).toBe(false);
    });

    it('should parse container with collapsed property', () => {
      const dsl = `
        diagram "test"
        container "Services" collapsed: true {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapsed).toBe(true);
    });

    it('should parse container with both collapsible and collapsed', () => {
      const dsl = `
        diagram "test"
        container "Services" collapsible: true collapsed: false {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapsible).toBe(true);
      expect(container?.collapsed).toBe(false);
    });
  });

  describe('Shadow Style Property', () => {
    it('should parse container with shadow enabled', () => {
      const dsl = `
        diagram "test"
        container "Services" shadow: true {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.shadow).toBe(true);
    });

    it('should parse container with shadow disabled', () => {
      const dsl = `
        diagram "test"
        container "Services" shadow: false {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.shadow).toBe(false);
    });
  });

  describe('Depth Style Property', () => {
    it('should parse container with depth level', () => {
      const dsl = `
        diagram "test"
        container "Services" depth: 2 {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.depth).toBe(2);
    });

    it('should parse different depth levels', () => {
      const depths = [0, 1, 2, 3];
      
      for (const depthLevel of depths) {
        const dsl = `
          diagram "test"
          container "Container" depth: ${depthLevel} {
            shape node1 as @rect label: "Node"
          }
        `;
        const result = parse(dsl);

        expect(result.success).toBe(true);
        const container = result.diagram?.containers?.[0];
        expect(container?.containerStyle?.depth).toBe(depthLevel);
      }
    });

    it('should parse container with shadow and depth together', () => {
      const dsl = `
        diagram "test"
        container "Services" shadow: true depth: 2 {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.shadow).toBe(true);
      expect(container?.containerStyle?.depth).toBe(2);
    });
  });

  describe('Header Style Properties', () => {
    it('should parse container with headerPosition', () => {
      const dsl = `
        diagram "test"
        container "Services" headerPosition: top {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.headerPosition).toBe('top');
    });

    it('should parse different header positions', () => {
      const positions = ['top', 'bottom', 'left', 'right'];
      
      for (const position of positions) {
        const dsl = `
          diagram "test"
          container "Container" headerPosition: ${position} {
            shape node1 as @rect label: "Node"
          }
        `;
        const result = parse(dsl);

        expect(result.success).toBe(true);
        const container = result.diagram?.containers?.[0];
        expect(container?.containerStyle?.headerPosition).toBe(position);
      }
    });

    it('should parse container with headerBackgroundColor', () => {
      const dsl = `
        diagram "test"
        container "Services" headerBackgroundColor: "#1976d2" {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.headerBackgroundColor).toBe('#1976d2');
    });
  });

  describe('Icon Style Properties', () => {
    it('should parse container with iconSize', () => {
      const dsl = `
        diagram "test"
        container "Services" iconSize: 24 {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.iconSize).toBe(24);
    });

    it('should parse container with iconColor', () => {
      const dsl = `
        diagram "test"
        container "Services" iconColor: "#ffffff" {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.iconColor).toBe('#ffffff');
    });

    it('should parse container with both iconSize and iconColor', () => {
      const dsl = `
        diagram "test"
        container "Services" iconSize: 20 iconColor: "#ff0000" {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.iconSize).toBe(20);
      expect(container?.containerStyle?.iconColor).toBe('#ff0000');
    });
  });

  describe('Complete Phase 1 Container', () => {
    it('should parse container with all Phase 1 features', () => {
      const dsl = `
        diagram "Architecture"
        container "Frontend" 
          header: "Frontend Services"
          icon: "desktop"
          badge: "v3.2"
          collapsible: true
          collapsed: false
          backgroundColor: "#e1f5fe"
          borderColor: "#01579b"
          borderWidth: 2
          borderStyle: solid
          padding: 20
          shadow: true
          depth: 1
          labelPosition: top
          headerPosition: top
          headerBackgroundColor: "#0277bd"
          iconSize: 20
          iconColor: "#ffffff"
          opacity: 0.95 {
          shape ui as @rect label: "UI Layer"
          shape components as @rect label: "Components"
          ui -> components
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.containers).toHaveLength(1);
      
      const container = result.diagram?.containers?.[0];
      expect(container?.label).toBe('Frontend');
      expect(container?.header).toBe('Frontend Services');
      expect(container?.icon).toBe('desktop');
      expect(container?.badge).toBe('v3.2');
      expect(container?.collapsible).toBe(true);
      expect(container?.collapsed).toBe(false);
      
      const style = container?.containerStyle;
      expect(style?.backgroundColor).toBe('#e1f5fe');
      expect(style?.borderColor).toBe('#01579b');
      expect(style?.borderWidth).toBe(2);
      expect(style?.borderStyle).toBe('solid');
      expect(style?.padding).toBe(20);
      expect(style?.shadow).toBe(true);
      expect(style?.depth).toBe(1);
      expect(style?.labelPosition).toBe('top');
      expect(style?.headerPosition).toBe('top');
      expect(style?.headerBackgroundColor).toBe('#0277bd');
      expect(style?.iconSize).toBe(20);
      expect(style?.iconColor).toBe('#ffffff');
      expect(style?.opacity).toBe(0.95);
      
      expect(container?.children).toHaveLength(2);
      expect(result.diagram?.edges).toHaveLength(1);
    });
  });

  describe('Nested Containers with Phase 1 Features', () => {
    it('should parse nested containers with different depths', () => {
      const dsl = `
        diagram "Architecture"
        container "Outer" depth: 0 shadow: true {
          shape node1 as @rect label: "N1"
          
          container "Middle" depth: 1 shadow: true {
            shape node2 as @rect label: "N2"
            
            container "Inner" depth: 2 shadow: false {
              shape node3 as @rect label: "N3"
            }
          }
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.containers).toHaveLength(1);
      
      const outer = result.diagram?.containers?.[0];
      expect(outer?.containerStyle?.depth).toBe(0);
      expect(outer?.containerStyle?.shadow).toBe(true);
      
      const middle = outer?.containers?.[0];
      expect(middle?.containerStyle?.depth).toBe(1);
      expect(middle?.containerStyle?.shadow).toBe(true);
      
      const inner = middle?.containers?.[0];
      expect(inner?.containerStyle?.depth).toBe(2);
      expect(inner?.containerStyle?.shadow).toBe(false);
    });

    it('should parse nested containers with header and icon', () => {
      const dsl = `
        diagram "System"
        container "Backend" header: "Backend Layer" icon: "server" {
          shape api as @rect label: "API"
          
          container "Database" header: "Data Layer" icon: "database" {
            shape db as @rect label: "PostgreSQL"
          }
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      
      const backend = result.diagram?.containers?.[0];
      expect(backend?.header).toBe('Backend Layer');
      expect(backend?.icon).toBe('server');
      
      const database = backend?.containers?.[0];
      expect(database?.header).toBe('Data Layer');
      expect(database?.icon).toBe('database');
    });
  });

  describe('Backward Compatibility', () => {
    it('should parse containers without Phase 1 properties', () => {
      const dsl = `
        diagram "test"
        container "Services" {
          shape node1 as @rect label: "API"
          shape node2 as @rect label: "DB"
          node1 -> node2
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.label).toBe('Services');
      expect(container?.header).toBeUndefined();
      expect(container?.icon).toBeUndefined();
      expect(container?.badge).toBeUndefined();
      expect(container?.collapsible).toBeUndefined();
      expect(container?.collapsed).toBeUndefined();
    });

    it('should parse containers with only old style properties', () => {
      const dsl = `
        diagram "test"
        container "Services" 
          backgroundColor: "#f0f0f0"
          borderColor: "#333"
          padding: 15 {
          shape node1 as @rect label: "API"
        }
      `;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.backgroundColor).toBe('#f0f0f0');
      expect(container?.containerStyle?.borderColor).toBe('#333');
      expect(container?.containerStyle?.padding).toBe(15);
      expect(container?.containerStyle?.shadow).toBeUndefined();
      expect(container?.containerStyle?.depth).toBeUndefined();
    });
  });
});
