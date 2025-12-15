import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Container Parser', () => {
  describe('Basic Container Parsing', () => {
    it('should parse a simple container with label', () => {
      const dsl = `
        diagram "test" {
        container "System Boundary" {
          shape Node1 as @rect label: "Service A"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.containers).toHaveLength(1);
      expect(result.diagram?.containers?.[0].label).toBe('System Boundary');
      expect(result.diagram?.containers?.[0].children).toHaveLength(1);
      expect(result.diagram?.containers?.[0].children[0]).toBe('Node1');
    });

    it('should parse container with explicit ID', () => {
      const dsl = `
        diagram "test" {
        container c1 "My Container" {
          shape Node1 as @rect label: "Node"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.id).toBe('c1');
      expect(container?.label).toBe('My Container');
    });

    it('should parse container without explicit ID', () => {
      const dsl = `
        diagram "test" {
        container "Auto ID Container" {
          shape Node1 as @rect label: "Node"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.label).toBe('Auto ID Container');
      // ID should be auto-generated or undefined
      expect(container?.id).toBeDefined();
    });

    it('should parse empty container', () => {
      const dsl = `
        diagram "test" {
        container "Empty" {
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.containers).toHaveLength(1);
      expect(result.diagram?.containers?.[0].children).toHaveLength(0);
    });
  });

  describe('Container with Multiple Nodes', () => {
    it('should parse container with multiple nodes', () => {
      const dsl = `
        diagram "test" {
        container "Services" {
          shape ServiceA as @rect label: "Service A"
          shape ServiceB as @rect label: "Service B"
          shape ServiceC as @rect label: "Service C"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.children).toHaveLength(3);
      expect(container?.children).toContain('ServiceA');
      expect(container?.children).toContain('ServiceB');
      expect(container?.children).toContain('ServiceC');
    });

    it('should parse container with nodes and edges', () => {
      const dsl = `
        diagram "test" {
        container "Flow" {
          shape A as @rect label: "Start"
          shape B as @rect label: "End"
          A -> B
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.children).toHaveLength(2);
      // Edges should be parsed at diagram level
      expect(result.diagram?.edges).toHaveLength(1);
    });
  });

  describe('Nested Containers', () => {
    it('should parse two-level nested containers', () => {
      const dsl = `
        diagram "test" {
        container "Outer" {
          shape Node1 as @rect label: "Outer Node"
          
          container "Inner" {
            shape Node2 as @rect label: "Inner Node"
          }
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const outer = result.diagram?.containers?.[0];
      expect(outer?.label).toBe('Outer');
      expect(outer?.children).toHaveLength(1);
      expect(outer?.containers).toHaveLength(1);

      const inner = outer?.containers?.[0];
      expect(inner?.label).toBe('Inner');
      expect(inner?.children).toHaveLength(1);
      expect(inner?.children[0]).toBe('Node2');
    });

    it('should parse three-level nested containers', () => {
      const dsl = `
        diagram "test" {
        container "Level1" {
          container "Level2" {
            container "Level3" {
              shape DeepNode as @rect label: "Deep"
            }
          }
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const level1 = result.diagram?.containers?.[0];
      expect(level1?.label).toBe('Level1');

      const level2 = level1?.containers?.[0];
      expect(level2?.label).toBe('Level2');

      const level3 = level2?.containers?.[0];
      expect(level3?.label).toBe('Level3');
      expect(level3?.children).toHaveLength(1);
    });

    it('should parse multiple nested containers at same level', () => {
      const dsl = `
        diagram "test" {
        container "Parent" {
          shape ParentNode as @rect label: "Parent"
          
          container "Child1" {
            shape Node1 as @rect label: "Node 1"
          }
          
          container "Child2" {
            shape Node2 as @rect label: "Node 2"
          }
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const parent = result.diagram?.containers?.[0];
      expect(parent?.containers).toHaveLength(2);
      expect(parent?.containers?.[0].label).toBe('Child1');
      expect(parent?.containers?.[1].label).toBe('Child2');
    });

    it('should parse complex nested structure with mixed content', () => {
      const dsl = `
        diagram "test" {
        container "System" {
          shape External as @actor label: "User"
          
          container "Frontend" {
            shape UI as @rect label: "UI"
            shape Cache as @cylinder label: "Cache"
            UI -> Cache
          }
          
          container "Backend" {
            shape API as @rect label: "API"
            
            container "Database" {
              shape DB as @cylinder label: "PostgreSQL"
            }
          }
          
          External -> UI
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const system = result.diagram?.containers?.[0];
      expect(system?.children).toHaveLength(1); // External node
      expect(system?.containers).toHaveLength(2); // Frontend, Backend
    });
  });

  describe('Container with Style Properties', () => {
    it('should parse container with style reference', () => {
      const dsl = `
        diagram "test" {
        style secureZone fillColor: "red"
        container "Secure" style: secureZone {
          shape Node1 as @rect label: "Node"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.style).toBe('secureZone');
    });

    it('should parse container with border style', () => {
      const dsl = `
        diagram "test" {
        container "Styled" borderStyle: dashed {
          shape Node1 as @rect label: "Node"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.borderStyle).toBe('dashed');
    });

    it('should parse container with multiple style properties', () => {
      const dsl = `
        diagram "test" {
        container "Complex"
          borderStyle: dotted
          strokeColor: "#ff0000"
          strokeWidth: 2
          fillColor: "#f0f0f0"
          opacity: 0.8
          padding: 20
          labelPosition: top {
          shape Node1 as @rect label: "Node"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      const style = container?.containerStyle;
      expect(style?.borderStyle).toBe('dotted');
      expect(style?.strokeColor).toBe('#ff0000');
      expect(style?.strokeWidth).toBe(2);
      expect(style?.fillColor).toBe('#f0f0f0');
      expect(style?.opacity).toBe(0.8);
      expect(style?.padding).toBe(20);
      expect(style?.labelPosition).toBe('top');
    });

    it('should parse all border style options', () => {
      const styles = ['solid', 'dashed', 'dotted'];

      styles.forEach((borderStyle) => {
        const dsl = `
          diagram "test" {
          container "Test" borderStyle: ${borderStyle} {
            shape Node1 as @rect label: "Node"
          }
        }`;
        const result = parse(dsl);

        expect(result.success).toBe(true);
        expect(
          result.diagram?.containers?.[0].containerStyle?.borderStyle
        ).toBe(borderStyle);
      });
    });

    it('should parse all label position options', () => {
      const positions = ['top', 'bottom', 'left', 'right'];

      positions.forEach((position) => {
        const dsl = `
          diagram "test" {
          container "Test" labelPosition: ${position} {
            shape Node1 as @rect label: "Node"
          }
        }`;
        const result = parse(dsl);

        expect(result.success).toBe(true);
        expect(
          result.diagram?.containers?.[0].containerStyle?.labelPosition
        ).toBe(position);
      });
    });
  });

  describe('Multiple Top-Level Containers', () => {
    it('should parse multiple containers at diagram level', () => {
      const dsl = `
        diagram "test" {
        
        container "Container1" {
          shape A as @rect label: "A"
        }
        
        container "Container2" {
          shape B as @rect label: "B"
        }
        
        container "Container3" {
          shape C as @rect label: "C"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.containers).toHaveLength(3);
      expect(result.diagram?.containers?.[0].label).toBe('Container1');
      expect(result.diagram?.containers?.[1].label).toBe('Container2');
      expect(result.diagram?.containers?.[2].label).toBe('Container3');
    });
  });

  describe('Cross-Container Edges', () => {
    it('should parse edges between nodes in different containers', () => {
      const dsl = `
        diagram "test" {
        
        container "System1" {
          shape A as @rect label: "Service A"
        }
        
        container "System2" {
          shape B as @rect label: "Service B"
        }
        
        A -> B
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.edges).toHaveLength(1);
      expect(result.diagram?.edges?.[0].from).toBe('A');
      expect(result.diagram?.edges?.[0].to).toBe('B');
    });

    it('should parse edges from external node to container node', () => {
      const dsl = `
        diagram "test" {
        
        shape User as @actor label: "User"
        
        container "System" {
          shape API as @rect label: "API"
        }
        
        User -> API
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.edges).toHaveLength(1);
    });
  });

  describe('Mixed Content', () => {
    it('should parse diagram with containers and standalone nodes', () => {
      const dsl = `
        diagram "test" {
        
        shape StandaloneNode as @actor label: "External"
        
        container "Internal" {
          shape InternalNode as @rect label: "Service"
        }
        
        StandaloneNode -> InternalNode
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.nodes).toHaveLength(2);
      expect(result.diagram?.containers).toHaveLength(1);
      expect(result.diagram?.edges).toHaveLength(1);
    });

    it('should parse containers mixed with styles and directions', () => {
      const dsl = `
        diagram "C4 Diagram" {
        direction TB
        
        style system fillColor: "#08427B" strokeColor: "#fff"
        style external fillColor: "#999" strokeColor: "#fff"
        
        shape User as @actor label: "User" style: external
        
        container "System Boundary" style: system {
          shape WebApp as @rect label: "Web Application"
          shape Database as @cylinder label: "Database"
          
          WebApp -> Database
        }
        
        User -> WebApp
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.direction).toBe('TB');
      expect(result.diagram?.styles).toBeDefined();
      expect(result.diagram?.nodes).toHaveLength(3);
      expect(result.diagram?.containers).toHaveLength(1);
      expect(result.diagram?.edges).toHaveLength(2);
    });
  });

  describe('Real-World C4 Example', () => {
    it('should parse a complete C4 system context diagram', () => {
      const dsl = `
        diagram "Banking System - System Context" {
        direction TB
        
        style personStyle fillColor: "#08427B"
        style systemStyle fillColor: "#1168BD"
        style externalStyle fillColor: "#999999"
        
        shape Customer as @actor label: "Personal Banking Customer" style: personStyle
        
        container "Internet Banking System" style: systemStyle {
          shape WebApp as @rect label: "Web Application"
          shape MobileApp as @rect label: "Mobile App"
          shape API as @rect label: "API Gateway"
          shape Backend as @rect label: "Backend Services"
          
          container "Data Layer" {
            shape MainDB as @cylinder label: "Main Database"
            shape Cache as @cylinder label: "Redis Cache"
          }
        }
        
        shape EmailSystem as @rect label: "Email System" style: externalStyle
        shape MainframeSystem as @rect label: "Mainframe Banking System" style: externalStyle
        
        Customer -> WebApp
        Customer -> MobileApp
        WebApp -> API
        MobileApp -> API
        API -> Backend
        Backend -> MainDB
        Backend -> Cache
        Backend -> MainframeSystem
        Backend -> EmailSystem
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.title).toBe('Banking System - System Context');
      expect(result.diagram?.containers).toHaveLength(1);

      const mainContainer = result.diagram?.containers?.[0];
      expect(mainContainer?.label).toBe('Internet Banking System');
      expect(mainContainer?.children).toHaveLength(4); // WebApp, MobileApp, API, Backend
      expect(mainContainer?.containers).toHaveLength(1); // Data Layer

      const dataLayer = mainContainer?.containers?.[0];
      expect(dataLayer?.label).toBe('Data Layer');
      expect(dataLayer?.children).toHaveLength(2); // MainDB, Cache

      expect(result.diagram?.edges?.length).toBeGreaterThan(0);
    });
  });

  describe('Error Cases', () => {
    it('should handle container without closing brace', () => {
      const dsl = `
        diagram "test" {
        container "Unclosed" {
          shape Node1 as @rect label: "Node"
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should handle container with invalid border style', () => {
      const dsl = `
        diagram "test" {
        container "Test" borderStyle: wavy {
          shape Node1 as @rect label: "Node"
        }
      }`;
      const result = parse(dsl);

      // Should fail parsing due to invalid enum value
      expect(result.success).toBe(false);
    });

    it('should handle container with invalid label position', () => {
      const dsl = `
        diagram "test" {
        container "Test" labelPosition: center {
          shape Node1 as @rect label: "Node"
        }
      }`;
      const result = parse(dsl);

      // Should fail parsing due to invalid enum value
      expect(result.success).toBe(false);
    });
  });

  describe('Container Layout Properties', () => {
    it('should parse container with layered algorithm', () => {
      const dsl = `
        diagram "test" {
        container "Test" algorithm: layered {
          shape Node1 as @rect label: "A"
          shape Node2 as @rect label: "B"
          Node1 -> Node2
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.layoutOptions?.algorithm).toBe('layered');
    });

    it('should parse container with force algorithm', () => {
      const dsl = `
        diagram "test" {
        container "Network" algorithm: force {
          shape Node1 as @server label: "Server 1"
          shape Node2 as @server label: "Server 2"
          Node1 -> Node2
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.layoutOptions?.algorithm).toBe('force');
    });

    it('should parse container with stress algorithm', () => {
      const dsl = `
        diagram "test" {
        container "Graph" algorithm: stress {
          shape Node1 as @rect label: "A"
          shape Node2 as @rect label: "B"
          Node1 -> Node2
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.layoutOptions?.algorithm).toBe('stress');
    });

    it('should parse container with radial algorithm', () => {
      const dsl = `
        diagram "test" {
        container "OrgChart" algorithm: radial {
          shape CEO as @actor label: "CEO"
          shape CTO as @actor label: "CTO"
          CEO -> CTO
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.layoutOptions?.algorithm).toBe('radial');
    });

    it('should parse container with mrtree algorithm', () => {
      const dsl = `
        diagram "test" {
        container "MultiTree" algorithm: mrtree {
          shape Root1 as @rect label: "Root A"
          shape Root2 as @rect label: "Root B"
          shape Child as @rect label: "Child"
          Root1 -> Child
          Root2 -> Child
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.layoutOptions?.algorithm).toBe('mrtree');
    });

    it('should parse container with spacing property', () => {
      const dsl = `
        diagram "test" {
        container "Spaced" spacing: 50 {
          shape Node1 as @rect label: "A"
          shape Node2 as @rect label: "B"
          Node1 -> Node2
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.layoutOptions?.spacing).toBe(50);
    });

    it('should parse container with both algorithm and spacing', () => {
      const dsl = `
        diagram "test" {
        container "Complex" 
          algorithm: force 
          spacing: 30 {
          shape Node1 as @rect label: "A"
          shape Node2 as @rect label: "B"
          Node1 -> Node2
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.layoutOptions?.algorithm).toBe('force');
      expect(container?.layoutOptions?.spacing).toBe(30);
    });

    it('should parse container without layout options', () => {
      const dsl = `
        diagram "test" {
        container "NoLayout" {
          shape Node1 as @rect label: "A"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.layoutOptions).toBeUndefined();
    });

    it('should handle container with invalid algorithm', () => {
      const dsl = `
        diagram "test" {
        container "Test" algorithm: invalid {
          shape Node1 as @rect label: "Node"
        }
      }`;
      const result = parse(dsl);

      // Should fail parsing due to invalid algorithm value
      expect(result.success).toBe(false);
    });
  });
});
