import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser';

describe('Sequence Diagram Gates', () => {
  it('should parse fragment with gates property', () => {
    const dsl = `
      sequence "Gates Test" {
        participant "User" as actor
        participant "System" as control
        
        message from:"User" to:"System" label:"Request" type:sync
        
        fragment alt "Validation" from:1 to:3 gates:["gateIn", "gateOut"] alternatives:("Success":1..2,"Error":2..3)
        
        message from:"System" to:"User" label:"Success" type:return
        message from:"System" to:"User" label:"Error" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);

    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === 'sequence'
    );
    expect(seqProfile).toBeDefined();
    expect(seqProfile?.fragments).toBeDefined();
    expect(seqProfile?.fragments).toHaveLength(1);

    const fragment = seqProfile?.fragments?.[0];
    expect(fragment?.gates).toBeDefined();
    expect(fragment?.gates).toHaveLength(2);
    expect(fragment?.gates).toContain('gateIn');
    expect(fragment?.gates).toContain('gateOut');
  });

  it('should parse fragment with single gate', () => {
    const dsl = `
      sequence "Single Gate" {
        participant "A" as control
        participant "B" as control
        
        message from:"A" to:"B" label:"Call" type:sync
        
        fragment loop "Retry" from:1 to:2 gates:["retryGate"]
        
        message from:"B" to:"A" label:"Response" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === 'sequence'
    );
    const fragment = seqProfile?.fragments?.[0];

    expect(fragment?.gates).toBeDefined();
    expect(fragment?.gates).toHaveLength(1);
    expect(fragment?.gates?.[0]).toBe('retryGate');
  });

  it('should parse fragment with multiple gates', () => {
    const dsl = `
      sequence "Multiple Gates" {
        participant "Client" as actor
        participant "Gateway" as control
        participant "Service" as control
        
        message from:"Client" to:"Gateway" label:"Request" type:sync
        
        fragment par "Parallel Calls" from:1 to:4 gates:["northGate", "southGate", "eastGate", "westGate"]
        
        message from:"Gateway" to:"Service" label:"Call1" type:async
        message from:"Gateway" to:"Service" label:"Call2" type:async
        message from:"Gateway" to:"Service" label:"Call3" type:async
        message from:"Service" to:"Gateway" label:"Response" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === 'sequence'
    );
    const fragment = seqProfile?.fragments?.[0];

    expect(fragment?.gates).toBeDefined();
    expect(fragment?.gates).toHaveLength(4);
    expect(fragment?.gates).toContain('northGate');
    expect(fragment?.gates).toContain('southGate');
    expect(fragment?.gates).toContain('eastGate');
    expect(fragment?.gates).toContain('westGate');
  });

  it('should parse fragment with empty gates array', () => {
    const dsl = `
      sequence "Empty Gates" {
        participant "A" as control
        participant "B" as control
        
        message from:"A" to:"B" label:"Call" type:sync
        
        fragment opt "Optional" from:1 to:2 gates:[]
        
        message from:"B" to:"A" label:"Response" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === 'sequence'
    );
    const fragment = seqProfile?.fragments?.[0];

    expect(fragment?.gates).toBeDefined();
    expect(fragment?.gates).toHaveLength(0);
  });

  it('should handle fragment without gates property', () => {
    const dsl = `
      sequence "No Gates" {
        participant "A" as control
        participant "B" as control
        
        message from:"A" to:"B" label:"Call" type:sync
        
        fragment loop "Retry" from:1 to:2
        
        message from:"B" to:"A" label:"Response" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === 'sequence'
    );
    const fragment = seqProfile?.fragments?.[0];

    expect(fragment?.gates).toBeUndefined();
  });

  it('should parse fragment with gates alongside other properties', () => {
    const dsl = `
      sequence "Gates with Alternatives" {
        participant "User" as actor
        participant "System" as control
        
        message from:"User" to:"System" label:"Login" type:sync
        
        fragment alt "Authentication" from:1 to:5 gates:["authIn", "authOut"] alternatives:("Success":2..3, "Failure":4..5)
        
        message from:"System" to:"User" label:"Processing" type:async
        message from:"System" to:"User" label:"Token" type:return
        message from:"System" to:"User" label:"Checking" type:async
        message from:"System" to:"User" label:"Error" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === 'sequence'
    );
    const fragment = seqProfile?.fragments?.[0];

    expect(fragment?.gates).toBeDefined();
    expect(fragment?.gates).toHaveLength(2);
    expect(fragment?.alternatives).toBeDefined();
    expect(fragment?.alternatives).toHaveLength(2);
    expect(fragment?.startAfterMessage).toBe(1);
    expect(fragment?.endAfterMessage).toBe(5);
  });

  it('should parse fragment with descriptive gate names', () => {
    const dsl = `
      sequence "Descriptive Gates" {
        participant "Client" as actor
        participant "Server" as control
        
        message from:"Client" to:"Server" label:"Request" type:sync
        
        fragment critical "Transaction" from:1 to:3 gates:["entry_point", "success_exit", "error_exit"]
        
        message from:"Server" to:"Client" label:"Processing" type:async
        message from:"Server" to:"Client" label:"Complete" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === 'sequence'
    );
    const fragment = seqProfile?.fragments?.[0];

    expect(fragment?.gates).toBeDefined();
    expect(fragment?.gates).toHaveLength(3);
    expect(fragment?.gates).toContain('entry_point');
    expect(fragment?.gates).toContain('success_exit');
    expect(fragment?.gates).toContain('error_exit');
  });

  it('should parse multiple fragments with gates', () => {
    const dsl = `
      sequence "Multiple Fragments with Gates" {
        participant "A" as control
        participant "B" as control
        participant "C" as control
        
        message from:"A" to:"B" label:"Start" type:sync
        
        fragment loop "Phase1" from:1 to:2 gates:["loop_in", "loop_out"]
        
        message from:"B" to:"C" label:"Process" type:sync
        message from:"C" to:"A" label:"Step1" type:return
        
        fragment alt "Phase2" from:3 to:5 gates:["alt_gate"] alternatives:("Result":3..4,"Error":4..5)
        
        message from:"C" to:"A" label:"Result" type:return
        message from:"C" to:"A" label:"Error" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === 'sequence'
    );

    expect(seqProfile?.fragments).toBeDefined();
    expect(seqProfile?.fragments).toHaveLength(2);

    const fragment1 = seqProfile?.fragments?.[0];
    expect(fragment1?.gates).toHaveLength(2);
    expect(fragment1?.gates).toContain('loop_in');
    expect(fragment1?.gates).toContain('loop_out');

    const fragment2 = seqProfile?.fragments?.[1];
    expect(fragment2?.gates).toHaveLength(1);
    expect(fragment2?.gates).toContain('alt_gate');
  });

  it('should handle gates with special characters in names', () => {
    const dsl = `
      sequence "Special Gate Names" {
        participant "A" as control
        participant "B" as control
        
        message from:"A" to:"B" label:"Call" type:sync
        
        fragment par "Parallel" from:1 to:2 gates:["gate-1", "gate_2", "gate.3"]
        
        message from:"B" to:"A" label:"Response" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === 'sequence'
    );
    const fragment = seqProfile?.fragments?.[0];

    expect(fragment?.gates).toBeDefined();
    expect(fragment?.gates).toHaveLength(3);
    expect(fragment?.gates).toContain('gate-1');
    expect(fragment?.gates).toContain('gate_2');
    expect(fragment?.gates).toContain('gate.3');
  });
});
