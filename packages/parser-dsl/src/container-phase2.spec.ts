import { describe, it, expect } from 'vitest';
import { parse } from './index.js';

describe('Container Phase 2: Collapse/Expand Parser Tests', () => {
  describe('Collapse Mode', () => {
    it('should parse collapseMode full', () => {
      const dsl = `
        diagram "test"{
        container "Services" 
          collapsed: true
          collapseMode: full {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapsed).toBe(true);
      expect(container?.collapseMode).toBe('full');
    });

    it('should parse collapseMode partial', () => {
      const dsl = `
        diagram "test" {
        container "Services" 
          collapsed: true
          collapseMode: partial {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseMode).toBe('partial');
    });
  });

  describe('Collapse Edge Redirection', () => {
    it('should parse collapseRedirectEdges true', () => {
      const dsl = `
        diagram "test" {
        container "Services" 
          collapsed: true
          collapseRedirectEdges: true {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseRedirectEdges).toBe(true);
    });

    it('should parse collapseRedirectEdges false', () => {
      const dsl = `
        diagram "test" {
        container "Services" collapseRedirectEdges: false {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseRedirectEdges).toBe(false);
    });
  });

  describe('Collapse Transition State', () => {
    it('should parse collapseTransitionState stable', () => {
      const dsl = `
        diagram "test" {
        container "Services" collapseTransitionState: stable {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseTransitionState).toBe('stable');
    });

    it('should parse collapseTransitionState collapsing', () => {
      const dsl = `
        diagram "test" {
        container "Services" collapseTransitionState: collapsing {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseTransitionState).toBe('collapsing');
    });

    it('should parse collapseTransitionState expanding', () => {
      const dsl = `
        diagram "test" {
        container "Services" collapseTransitionState: expanding {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseTransitionState).toBe('expanding');
    });
  });

  describe('Collapse Animation', () => {
    it('should parse collapseAnimationDuration', () => {
      const dsl = `
        diagram "test" {
        container "Services" collapseAnimationDuration: 300 {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseAnimationDuration).toBe(300);
    });

    it('should parse different animation durations', () => {
      const durations = [0, 150, 300, 500, 1000];

      for (const duration of durations) {
        const dsl = `
          diagram "test" {
          container "Services" collapseAnimationDuration: ${duration} {
            shape node1 as @rect label: "API"
          }
        }`;
        const result = parse(dsl);

        expect(result.success).toBe(true);
        const container = result.diagram?.containers?.[0];
        expect(container?.collapseAnimationDuration).toBe(duration);
      }
    });

    it('should parse collapseAnimationEasing linear', () => {
      const dsl = `
        diagram "test" {
        container "Services" collapseAnimationEasing: linear {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseAnimationEasing).toBe('linear');
    });

    it('should parse all easing functions', () => {
      const easings = ['linear', 'easeIn', 'easeOut', 'easeInOut'];

      for (const easing of easings) {
        const dsl = `
          diagram "test" {
          container "Services" collapseAnimationEasing: ${easing} {
            shape node1 as @rect label: "API"
          }
        }`;
        const result = parse(dsl);

        expect(result.success).toBe(true);
        const container = result.diagram?.containers?.[0];
        expect(container?.collapseAnimationEasing).toBe(easing);
      }
    });

    it('should parse both duration and easing together', () => {
      const dsl = `
        diagram "test" {
        container "Services" 
          collapseAnimationDuration: 300
          collapseAnimationEasing: easeInOut {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseAnimationDuration).toBe(300);
      expect(container?.collapseAnimationEasing).toBe('easeInOut');
    });
  });

  describe('Collapse Visibility', () => {
    it('should parse collapseSummary', () => {
      const dsl = `
        diagram "test" {
        container "Services" 
          collapsed: true
          collapseSummary: "5 services" {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseSummary).toBe('5 services');
    });

    it('should parse collapseShowCount', () => {
      const dsl = `
        diagram "test" {
        container "Services" 
          collapsed: true
          collapseShowCount: true {
          shape node1 as @rect label: "API"
          shape node2 as @rect label: "DB"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseShowCount).toBe(true);
    });

    it('should parse collapseIcon', () => {
      const dsl = `
        diagram "test" {
        container "Services" 
          collapsed: true
          collapseIcon: "chevron-right" {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseIcon).toBe('chevron-right');
    });

    it('should parse all visibility properties together', () => {
      const dsl = `
        diagram "test" {
        container "Services" 
          collapsed: true
          collapseSummary: "12 services"
          collapseShowCount: true
          collapseIcon: "chevron-right" {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseSummary).toBe('12 services');
      expect(container?.collapseShowCount).toBe(true);
      expect(container?.collapseIcon).toBe('chevron-right');
    });
  });

  describe('Collapse State Persistence', () => {
    it('should parse collapsePersistState', () => {
      const dsl = `
        diagram "test" {
        container "Services" 
          collapsible: true
          collapsePersistState: true {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapsePersistState).toBe(true);
    });

    it('should parse collapseStateKey', () => {
      const dsl = `
        diagram "test" {
        container "Services" 
          collapsePersistState: true
          collapseStateKey: "diagram-services-c1" {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseStateKey).toBe('diagram-services-c1');
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should parse collapseKeyboardShortcut', () => {
      const dsl = `
        diagram "test" {
        container "Services" 
          collapsible: true
          collapseKeyboardShortcut: "Space" {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.collapseKeyboardShortcut).toBe('Space');
    });

    it('should parse different keyboard shortcuts', () => {
      const shortcuts = ['Space', 'Enter', 'c', 'Ctrl+Space'];

      for (const shortcut of shortcuts) {
        const dsl = `
          diagram "test" {
          container "Services" collapseKeyboardShortcut: "${shortcut}" {
            shape node1 as @rect label: "API"
          }
        }`;
        const result = parse(dsl);

        expect(result.success).toBe(true);
        const container = result.diagram?.containers?.[0];
        expect(container?.collapseKeyboardShortcut).toBe(shortcut);
      }
    });
  });

  describe('Complete Phase 2 Example', () => {
    it('should parse container with all Phase 2 collapse properties', () => {
      const dsl = `
        diagram "Architecture" {
        container "Backend Services" 
          header: "Backend Layer"
          icon: "server"
          badge: "v2.0"
          collapsible: true
          collapsed: true
          collapseMode: partial
          collapseRedirectEdges: true
          collapseTransitionState: stable
          collapseAnimationDuration: 300
          collapseAnimationEasing: easeInOut
          collapseSummary: "12 services"
          collapseShowCount: true
          collapseIcon: "chevron-right"
          collapsePersistState: true
          collapseStateKey: "backend-services"
          collapseKeyboardShortcut: "Space" {
          shape api1 as @rect label: "API 1"
          shape api2 as @rect label: "API 2"
          api1 -> api2
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      expect(result.diagram?.containers).toHaveLength(1);

      const container = result.diagram?.containers?.[0];
      expect(container?.label).toBe('Backend Services');
      expect(container?.header).toBe('Backend Layer');
      expect(container?.icon).toBe('server');
      expect(container?.badge).toBe('v2.0');
      expect(container?.collapsible).toBe(true);
      expect(container?.collapsed).toBe(true);
      expect(container?.collapseMode).toBe('partial');
      expect(container?.collapseRedirectEdges).toBe(true);
      expect(container?.collapseTransitionState).toBe('stable');
      expect(container?.collapseAnimationDuration).toBe(300);
      expect(container?.collapseAnimationEasing).toBe('easeInOut');
      expect(container?.collapseSummary).toBe('12 services');
      expect(container?.collapseShowCount).toBe(true);
      expect(container?.collapseIcon).toBe('chevron-right');
      expect(container?.collapsePersistState).toBe(true);
      expect(container?.collapseStateKey).toBe('backend-services');
      expect(container?.collapseKeyboardShortcut).toBe('Space');

      expect(container?.children).toHaveLength(2);
      expect(result.diagram?.edges).toHaveLength(1);
    });
  });

  describe('Nested Containers with Collapse States', () => {
    it('should parse nested containers with independent collapse states', () => {
      const dsl = `
        diagram "System" {
        container "Outer" 
          collapsed: false
          collapseMode: partial {
          shape node1 as @rect label: "N1"
          
          container "Inner1" 
            collapsed: true
            collapseMode: full {
            shape node2 as @rect label: "N2"
          }
          
          container "Inner2" 
            collapsed: false {
            shape node3 as @rect label: "N3"
          }
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);

      const outer = result.diagram?.containers?.[0];
      expect(outer?.collapsed).toBe(false);
      expect(outer?.collapseMode).toBe('partial');

      const inner1 = outer?.containers?.[0];
      expect(inner1?.collapsed).toBe(true);
      expect(inner1?.collapseMode).toBe('full');

      const inner2 = outer?.containers?.[1];
      expect(inner2?.collapsed).toBe(false);
    });
  });

  describe('Backward Compatibility', () => {
    it('should parse containers without Phase 2 properties', () => {
      const dsl = `
        diagram "test" {
        container "Services" {
          shape node1 as @rect label: "API"
          shape node2 as @rect label: "DB"
          node1 -> node2
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.label).toBe('Services');
      expect(container?.collapseMode).toBeUndefined();
      expect(container?.collapseRedirectEdges).toBeUndefined();
      expect(container?.collapseTransitionState).toBeUndefined();
    });

    it('should parse containers with Phase 1 properties only', () => {
      const dsl = `
        diagram "test" {
        container "Services" 
          header: "Service Layer"
          icon: "server"
          collapsible: true
          collapsed: false {
          shape node1 as @rect label: "API"
        }
      }`;
      const result = parse(dsl);

      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.header).toBe('Service Layer');
      expect(container?.icon).toBe('server');
      expect(container?.collapsible).toBe(true);
      expect(container?.collapsed).toBe(false);
      // Phase 2 properties should be undefined
      expect(container?.collapseMode).toBeUndefined();
      expect(container?.collapseAnimationDuration).toBeUndefined();
    });
  });
});
