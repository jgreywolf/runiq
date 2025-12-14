import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Activity Diagram Swimlanes (Task 29)', () => {
  it('should parse horizontal swimlane orientation', () => {
    const dsl = `diagram "Test" {
      container "Sales" orientation: horizontal {
        shape task1 as @rect label: "Review Order"
      }
    }`;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    const container = result.diagram?.containers?.[0];
    expect(container).toBeDefined();
    expect(container?.layoutOptions?.orientation).toBe('horizontal');
  });

  it('should parse vertical swimlane orientation', () => {
    const dsl = `diagram "Test" {
      container "Engineering" orientation: vertical {
        shape task1 as @rect label: "Develop Feature"
      }
    }`;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    const container = result.diagram?.containers?.[0];
    expect(container).toBeDefined();
    expect(container?.layoutOptions?.orientation).toBe('vertical');
  });

  it('should parse multiple horizontal swimlanes', () => {
    const dsl = `diagram "Cross-Functional Process" {
      container "Customer" orientation: horizontal {
        shape c1 as @rounded label: "Place Order"
        shape c2 as @hexagon label: "Receive Goods"
      }
      
      container "Sales" orientation: horizontal {
        shape s1 as @rect label: "Process Order"
        shape s2 as @rect label: "Invoice"
      }
      
      container "Warehouse" orientation: horizontal {
        shape w1 as @rect label: "Pick Items"
        shape w2 as @rect label: "Ship"
      }
      
      c1 -> s1
      s1 -> w1
      w1 -> w2
      w2 -> c2
    }`;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    expect(result.diagram?.containers).toHaveLength(3);
    expect(result.diagram?.containers?.[0].layoutOptions?.orientation).toBe('horizontal');
    expect(result.diagram?.containers?.[1].layoutOptions?.orientation).toBe('horizontal');
    expect(result.diagram?.containers?.[2].layoutOptions?.orientation).toBe('horizontal');
    expect(result.diagram?.nodes).toHaveLength(6);
    expect(result.diagram?.edges).toHaveLength(4);
  });

  it('should parse vertical swimlanes for parallel teams', () => {
    const dsl = `diagram "Parallel Development" {
      container "Frontend Team" orientation: vertical {
        shape ui1 as @rect label: "Design UI"
        shape ui2 as @rect label: "Implement"
        shape ui3 as @rect label: "Test"
      }
      
      container "Backend Team" orientation: vertical {
        shape be1 as @rect label: "API Design"
        shape be2 as @rect label: "Implement"
        shape be3 as @rect label: "Test"
      }
      
      ui2 -> be2
    }`;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    expect(result.diagram?.containers).toHaveLength(2);
    expect(result.diagram?.containers?.[0].layoutOptions?.orientation).toBe('vertical');
    expect(result.diagram?.containers?.[1].layoutOptions?.orientation).toBe('vertical');
    expect(result.diagram?.nodes).toHaveLength(6);
    expect(result.diagram?.edges).toHaveLength(1);
  });

  it('should parse swimlanes with activity shapes', () => {
    const dsl = `diagram "Activity with Partitions" {
      container "Participant 1" orientation: horizontal {
        shape start as @initialState
        shape action1 as @activity label: "Action 1"
        shape decision as @diamond
      }
      
      container "Participant 2" orientation: horizontal {
        shape action2 as @activity label: "Action 2"
        shape end as @finalState
      }
      
      start -> action1
      action1 -> decision
      decision -> action2
      action2 -> end
    }`;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    expect(result.diagram?.containers).toHaveLength(2);
    expect(result.diagram?.nodes.length).toBeGreaterThanOrEqual(5);
    expect(result.diagram?.edges).toHaveLength(4);
    
    // Verify shapes
    const startNode = result.diagram?.nodes.find(n => n.id === 'start');
    expect(startNode?.shape).toBe('initialState');
    const action1Node = result.diagram?.nodes.find(n => n.id === 'action1');
    expect(action1Node?.shape).toBe('activity');
    const endNode = result.diagram?.nodes.find(n => n.id === 'end');
    expect(endNode?.shape).toBe('finalState');
  });

  it('should parse swimlanes with decision branches', () => {
    const dsl = `diagram "Approval Process" {
      container "Employee" orientation: horizontal {
        shape req as @rect label: "Submit Request"
        shape wait as @rect label: "Wait"
        shape done as @hexagon label: "Done"
      }
      
      container "Manager" orientation: horizontal {
        shape review as @rect label: "Review"
        shape approve as @choice
      }
      
      req -> review
      review -> approve
      approve -yes-> done
      approve -no-> wait
      wait -> review
    }`;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    expect(result.diagram?.containers).toHaveLength(2);
    expect(result.diagram?.nodes).toHaveLength(5);
    expect(result.diagram?.edges).toHaveLength(5);
    
    // Verify labeled edges
    const yesEdge = result.diagram?.edges.find(e => e.label === 'yes');
    expect(yesEdge).toBeDefined();
    expect(yesEdge?.from).toBe('approve');
    expect(yesEdge?.to).toBe('done');
  });

  it('should combine orientation with other layout options', () => {
    const dsl = `diagram "Test" {
      container "Team A" orientation: horizontal algorithm: layered spacing: 100 {
        shape task1 as @rect label: "Task 1"
        shape task2 as @rect label: "Task 2"
      }
    }`;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    const container = result.diagram?.containers?.[0];
    expect(container?.layoutOptions?.orientation).toBe('horizontal');
    expect(container?.layoutOptions?.algorithm).toBe('layered');
    expect(container?.layoutOptions?.spacing).toBe(100);
  });

  it('should parse swimlanes with styling', () => {
    const dsl = `diagram "Styled Swimlanes" {
      container "Frontend" orientation: vertical fillColor: "#e3f2fd" padding: 20 {
        shape ui as @rect label: "UI"
      }
      
      container "Backend" orientation: vertical fillColor: "#fff3e0" padding: 20 {
        shape api as @rect label: "API"
      }
      
      ui -> api
    }`;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    expect(result.diagram?.containers).toHaveLength(2);
    expect(result.diagram?.containers?.[0].containerStyle?.fillColor).toBe('#e3f2fd');
    expect(result.diagram?.containers?.[0].containerStyle?.padding).toBe(20);
    expect(result.diagram?.containers?.[1].containerStyle?.fillColor).toBe('#fff3e0');
  });

  it('should parse nested swimlanes (sub-partitions)', () => {
    const dsl = `diagram "Nested Partitions" {
      container "Department" orientation: horizontal {
        container "Team A" orientation: vertical {
          shape a1 as @rect label: "Task A1"
          shape a2 as @rect label: "Task A2"
        }
        
        container "Team B" orientation: vertical {
          shape b1 as @rect label: "Task B1"
          shape b2 as @rect label: "Task B2"
        }
        
        a1 -> b1
      }
    }`;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    const outerContainer = result.diagram?.containers?.[0];
    expect(outerContainer?.layoutOptions?.orientation).toBe('horizontal');
    
    // Verify nested containers have orientation
    expect(outerContainer?.containers).toHaveLength(2);
    expect(outerContainer?.containers?.[0].layoutOptions?.orientation).toBe('vertical');
    expect(outerContainer?.containers?.[1].layoutOptions?.orientation).toBe('vertical');
    
    // Verify nodes are properly nested
    expect(result.diagram?.nodes.length).toBeGreaterThanOrEqual(4);
  });

  it('should parse complex multi-stage process with swimlanes', () => {
    const dsl = `diagram "Software Release Process" {
      container "Development" orientation: horizontal {
        shape dev1 as @initialState
        shape dev2 as @activity label: "Code"
        shape dev3 as @activity label: "Unit Test"
      }
      
      container "QA" orientation: horizontal {
        shape qa1 as @activity label: "Integration Test"
        shape qa2 as @diamond
        shape qa3 as @activity label: "Bug Report"
      }
      
      container "Operations" orientation: horizontal {
        shape ops1 as @activity label: "Deploy Staging"
        shape ops2 as @activity label: "Deploy Prod"
        shape ops3 as @finalState
      }
      
      dev1 -> dev2
      dev2 -> dev3
      dev3 -> qa1
      qa1 -> qa2
      qa2 -pass-> ops1
      qa2 -fail-> qa3
      qa3 -> dev2
      ops1 -> ops2
      ops2 -> ops3
    }`;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    
    expect(result.diagram?.containers).toHaveLength(3);
    expect(result.diagram?.nodes.length).toBeGreaterThanOrEqual(9);
    expect(result.diagram?.edges).toHaveLength(9);
    
    // Verify all containers have horizontal orientation
    result.diagram?.containers?.forEach(container => {
      expect(container.layoutOptions?.orientation).toBe('horizontal');
    });
    
    // Verify edge labels
    const passEdge = result.diagram?.edges.find(e => e.label === 'pass');
    expect(passEdge).toBeDefined();
    expect(passEdge?.from).toBe('qa2');
    expect(passEdge?.to).toBe('ops1');
    
    const failEdge = result.diagram?.edges.find(e => e.label === 'fail');
    expect(failEdge).toBeDefined();
    expect(failEdge?.from).toBe('qa2');
    expect(failEdge?.to).toBe('qa3');
  });
});
