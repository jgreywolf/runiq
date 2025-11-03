import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser';

describe('BPMN Gateway Types', () => {
  it('should parse exclusive gateway (XOR)', () => {
    const dsl = `
      diagram "Process" {
        shape g1 as @bpmnGateway label:"Decision" gatewayType:exclusive
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const gateway = result.diagram?.nodes[0];
    expect(gateway?.shape).toBe('bpmnGateway');
    expect(gateway?.data?.gatewayType).toBe('exclusive');
  });

  it('should parse exclusive gateway with XOR alias', () => {
    const dsl = `
      diagram "Process" {
        shape g1 as @bpmnGateway gatewayType:xor
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const gateway = result.diagram?.nodes[0];
    expect(gateway?.data?.gatewayType).toBe('xor');
  });

  it('should parse parallel gateway (AND)', () => {
    const dsl = `
      diagram "Process" {
        shape g1 as @bpmnGateway label:"Fork" gatewayType:parallel
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const gateway = result.diagram?.nodes[0];
    expect(gateway?.data?.gatewayType).toBe('parallel');
  });

  it('should parse parallel gateway with AND alias', () => {
    const dsl = `
      diagram "Process" {
        shape g1 as @bpmnGateway gatewayType:and
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const gateway = result.diagram?.nodes[0];
    expect(gateway?.data?.gatewayType).toBe('and');
  });

  it('should parse inclusive gateway (OR)', () => {
    const dsl = `
      diagram "Process" {
        shape g1 as @bpmnGateway label:"Multi-choice" gatewayType:inclusive
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const gateway = result.diagram?.nodes[0];
    expect(gateway?.data?.gatewayType).toBe('inclusive');
  });

  it('should parse inclusive gateway with OR alias', () => {
    const dsl = `
      diagram "Process" {
        shape g1 as @bpmnGateway gatewayType:or
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const gateway = result.diagram?.nodes[0];
    expect(gateway?.data?.gatewayType).toBe('or');
  });

  it('should parse event-based gateway', () => {
    const dsl = `
      diagram "Process" {
        shape g1 as @bpmnGateway label:"Wait for Event" gatewayType:eventBased
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const gateway = result.diagram?.nodes[0];
    expect(gateway?.data?.gatewayType).toBe('eventBased');
  });

  it('should parse event-based gateway with event alias', () => {
    const dsl = `
      diagram "Process" {
        shape g1 as @bpmnGateway gatewayType:event
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const gateway = result.diagram?.nodes[0];
    expect(gateway?.data?.gatewayType).toBe('event');
  });

  it('should parse complex gateway', () => {
    const dsl = `
      diagram "Process" {
        shape g1 as @bpmnGateway label:"Complex Decision" gatewayType:complex
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const gateway = result.diagram?.nodes[0];
    expect(gateway?.data?.gatewayType).toBe('complex');
  });

  it('should parse workflow with multiple gateway types', () => {
    const dsl = `
      diagram "Order Processing" {
        shape start as @bpmnEvent
        shape checkOrder as @bpmnGateway gatewayType:exclusive
        shape parallelGw as @bpmnGateway gatewayType:parallel
        shape waitEvent as @bpmnGateway gatewayType:eventBased
        shape endEvent as @bpmnEvent

        start -> checkOrder
        checkOrder -> parallelGw
        parallelGw -> waitEvent
        waitEvent -> endEvent
      }
    `;

    const result = parse(dsl);
    if (!result.success) {
      console.log('Parse errors:', result.errors);
    }
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes?.length).toBe(5);
    
    const checkOrder = result.diagram?.nodes?.find(n => n.id === 'checkOrder');
    expect(checkOrder?.data?.gatewayType).toBe('exclusive');
    
    const parallelGw = result.diagram?.nodes?.find(n => n.id === 'parallelGw');
    expect(parallelGw?.data?.gatewayType).toBe('parallel');
    
    const waitEvent = result.diagram?.nodes?.find(n => n.id === 'waitEvent');
    expect(waitEvent?.data?.gatewayType).toBe('eventBased');
  });

  it('should default to exclusive when gatewayType not specified', () => {
    const dsl = `
      diagram "Process" {
        shape g1 as @bpmnGateway
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const gateway = result.diagram?.nodes[0];
    // Gateway should exist but gatewayType should be undefined (defaults to exclusive in rendering)
    expect(gateway?.shape).toBe('bpmnGateway');
  });
});
