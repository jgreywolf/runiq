import { ProfileType } from '@runiq/core';
import { describe, expect, it } from 'vitest';
import { parse } from '../langium-parser';

describe('Sequence Diagram Duration Constraints', () => {
  it('should parse duration constraint with all properties', () => {
    const dsl = `
      sequence "Duration Test" {
        participant "Client" as actor
        participant "Server" as control
        
        message from:"Client" to:"Server" label:"Request" type:sync
        message from:"Server" to:"Client" label:"Response" type:return
        message from:"Client" to:"Server" label:"Ack" type:async
        
        durationConstraint from:0 to:2 constraint:"< 100ms"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.durationConstraints).toBeDefined();
    expect(seqProfile?.durationConstraints).toHaveLength(1);

    const constraint = seqProfile?.durationConstraints?.[0];
    expect(constraint?.fromMessage).toBe(0);
    expect(constraint?.toMessage).toBe(2);
    expect(constraint?.constraint).toBe('< 100ms');
  });

  it('should parse multiple duration constraints', () => {
    const dsl = `
      sequence "Multiple Constraints" {
        participant "A" as control
        participant "B" as control
        participant "C" as control
        
        message from:"A" to:"B" label:"Step1" type:sync
        message from:"B" to:"C" label:"Step2" type:sync
        message from:"C" to:"B" label:"Step3" type:return
        message from:"B" to:"A" label:"Step4" type:return
        
        durationConstraint from:0 to:1 constraint:"< 50ms"
        durationConstraint from:1 to:3 constraint:"< 150ms"
        durationConstraint from:0 to:3 constraint:"< 200ms total"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.durationConstraints).toBeDefined();
    expect(seqProfile?.durationConstraints).toHaveLength(3);

    const constraint1 = seqProfile?.durationConstraints?.[0];
    expect(constraint1?.fromMessage).toBe(0);
    expect(constraint1?.toMessage).toBe(1);
    expect(constraint1?.constraint).toBe('< 50ms');

    const constraint2 = seqProfile?.durationConstraints?.[1];
    expect(constraint2?.fromMessage).toBe(1);
    expect(constraint2?.toMessage).toBe(3);
    expect(constraint2?.constraint).toBe('< 150ms');

    const constraint3 = seqProfile?.durationConstraints?.[2];
    expect(constraint3?.fromMessage).toBe(0);
    expect(constraint3?.toMessage).toBe(3);
    expect(constraint3?.constraint).toBe('< 200ms total');
  });

  it('should parse constraint with UML 2.5 interval notation', () => {
    const dsl = `
      sequence "UML Intervals" {
        participant "Service1" as control
        participant "Service2" as control
        
        message from:"Service1" to:"Service2" label:"Call" type:sync
        message from:"Service2" to:"Service1" label:"Return" type:return
        
        durationConstraint from:0 to:1 constraint:"{d..2d}"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    const constraint = seqProfile?.durationConstraints?.[0];
    expect(constraint?.constraint).toBe('{d..2d}');
  });

  it('should parse constraint spanning entire sequence', () => {
    const dsl = `
      sequence "End-to-End SLA" {
        participant "User" as actor
        participant "Frontend" as boundary
        participant "Backend" as control
        participant "Database" as database
        
        message from:"User" to:"Frontend" label:"Submit" type:sync
        message from:"Frontend" to:"Backend" label:"Process" type:sync
        message from:"Backend" to:"Database" label:"Query" type:sync
        message from:"Database" to:"Backend" label:"Data" type:return
        message from:"Backend" to:"Frontend" label:"Result" type:return
        message from:"Frontend" to:"User" label:"Display" type:return
        
        durationConstraint from:0 to:5 constraint:"< 500ms SLA"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.durationConstraints).toHaveLength(1);
    const constraint = seqProfile?.durationConstraints?.[0];
    expect(constraint?.fromMessage).toBe(0);
    expect(constraint?.toMessage).toBe(5);
    expect(constraint?.constraint).toBe('< 500ms SLA');
  });

  it('should parse constraint with mathematical expressions', () => {
    const dsl = `
      sequence "Mathematical Constraints" {
        participant "Client" as actor
        participant "Server" as control
        
        message from:"Client" to:"Server" label:"Request" type:sync
        message from:"Server" to:"Client" label:"Response" type:return
        
        durationConstraint from:0 to:1 constraint:"{t < 5s}"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    const constraint = seqProfile?.durationConstraints?.[0];
    expect(constraint?.constraint).toBe('{t < 5s}');
  });

  it('should parse constraints with descriptive labels', () => {
    const dsl = `
      sequence "Descriptive Constraints" {
        participant "API" as boundary
        participant "Cache" as database
        participant "Service" as control
        
        message from:"API" to:"Cache" label:"Check" type:sync
        message from:"Cache" to:"API" label:"Miss" type:return
        message from:"API" to:"Service" label:"Fetch" type:sync
        message from:"Service" to:"API" label:"Data" type:return
        
        durationConstraint from:0 to:1 constraint:"Cache lookup < 10ms"
        durationConstraint from:2 to:3 constraint:"Service call < 100ms"
        durationConstraint from:0 to:3 constraint:"Total request < 150ms"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.durationConstraints).toHaveLength(3);
    expect(seqProfile?.durationConstraints?.[0].constraint).toBe(
      'Cache lookup < 10ms'
    );
    expect(seqProfile?.durationConstraints?.[1].constraint).toBe(
      'Service call < 100ms'
    );
    expect(seqProfile?.durationConstraints?.[2].constraint).toBe(
      'Total request < 150ms'
    );
  });

  it('should handle sequence diagram without duration constraints', () => {
    const dsl = `
      sequence "No Constraints" {
        participant "A" as control
        participant "B" as control
        
        message from:"A" to:"B" label:"Call" type:sync
        message from:"B" to:"A" label:"Return" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.durationConstraints).toBeUndefined();
  });

  it('should parse constraints alongside fragments', () => {
    const dsl = `
      sequence "Constraints with Fragments" {
        participant "Client" as actor
        participant "Server" as control
        
        message from:"Client" to:"Server" label:"Request" type:sync
        
        fragment loop "Retry" from:1 to:2
        
        message from:"Server" to:"Client" label:"Attempt" type:async
        message from:"Server" to:"Client" label:"Success" type:return
        
        durationConstraint from:0 to:2 constraint:"< 5s with retries"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.fragments).toHaveLength(1);
    expect(seqProfile?.durationConstraints).toHaveLength(1);

    const constraint = seqProfile?.durationConstraints?.[0];
    expect(constraint?.fromMessage).toBe(0);
    expect(constraint?.toMessage).toBe(2);
    expect(constraint?.constraint).toBe('< 5s with retries');
  });

  it('should parse constraint with range expressions', () => {
    const dsl = `
      sequence "Range Constraints" {
        participant "Service" as control
        participant "Worker" as control
        
        message from:"Service" to:"Worker" label:"Task" type:async
        message from:"Worker" to:"Service" label:"Done" type:return
        
        durationConstraint from:0 to:1 constraint:"{100ms..500ms}"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    const constraint = seqProfile?.durationConstraints?.[0];
    expect(constraint?.constraint).toBe('{100ms..500ms}');
  });

  it('should parse constraints in complex scenario', () => {
    const dsl = `
      sequence "Complex Timing Requirements" {
        participant "Frontend" as boundary
        participant "API Gateway" as control
        participant "Auth" as control
        participant "Service" as control
        
        message from:"Frontend" to:"API Gateway" label:"Request" type:sync
        message from:"API Gateway" to:"Auth" label:"Validate" type:sync
        message from:"Auth" to:"API Gateway" label:"OK" type:return
        message from:"API Gateway" to:"Service" label:"Process" type:sync
        message from:"Service" to:"API Gateway" label:"Result" type:return
        message from:"API Gateway" to:"Frontend" label:"Response" type:return
        
        durationConstraint from:1 to:2 constraint:"Auth < 50ms"
        durationConstraint from:3 to:4 constraint:"Service < 200ms"
        durationConstraint from:0 to:5 constraint:"Total < 300ms P99"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.messages).toHaveLength(6);
    expect(seqProfile?.durationConstraints).toHaveLength(3);

    // Verify all constraints are properly parsed
    expect(seqProfile?.durationConstraints?.[0].constraint).toContain('Auth');
    expect(seqProfile?.durationConstraints?.[1].constraint).toContain(
      'Service'
    );
    expect(seqProfile?.durationConstraints?.[2].constraint).toContain('Total');
  });
});
