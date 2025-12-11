import { ProfileType } from '@runiq/core';
import { describe, expect, it } from 'vitest';
import { parse } from './langium-parser';

describe('Sequence Diagram Interaction Use (ref)', () => {
  it('should parse ref fragment with reference', () => {
    const dsl = `
      sequence "Main Flow" {
        participant "User" as actor
        participant "System" as control
        
        message from:"User" to:"System" label:"Start" type:sync
        
        fragment ref "Authentication" from:1 to:2 ref:"AuthSequence"
        
        message from:"System" to:"User" label:"Complete" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.fragments).toBeDefined();
    expect(seqProfile?.fragments).toHaveLength(1);

    const fragment = seqProfile?.fragments?.[0];
    expect(fragment?.type).toBe('ref');
    expect(fragment?.label).toBe('Authentication');
    expect(fragment?.reference).toBe('AuthSequence');
    expect(fragment?.startAfterMessage).toBe(1);
    expect(fragment?.endAfterMessage).toBe(2);
  });

  it('should parse multiple ref fragments', () => {
    const dsl = `
      sequence "Complex Flow" {
        participant "Client" as actor
        participant "Server" as control
        participant "Database" as database
        
        message from:"Client" to:"Server" label:"Request" type:sync
        
        fragment ref "Authentication" from:1 to:2 ref:"AuthFlow"
        
        message from:"Server" to:"Database" label:"Query" type:sync
        
        fragment ref "Data Processing" from:3 to:4 ref:"DataProcFlow"
        
        message from:"Database" to:"Server" label:"Results" type:return
        message from:"Server" to:"Client" label:"Response" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.fragments).toHaveLength(2);

    const fragment1 = seqProfile?.fragments?.[0];
    expect(fragment1?.type).toBe('ref');
    expect(fragment1?.reference).toBe('AuthFlow');

    const fragment2 = seqProfile?.fragments?.[1];
    expect(fragment2?.type).toBe('ref');
    expect(fragment2?.reference).toBe('DataProcFlow');
  });

  it('should parse ref fragment with gates', () => {
    const dsl = `
      sequence "Modular Flow" {
        participant "Controller" as control
        participant "Service" as control
        
        message from:"Controller" to:"Service" label:"Process" type:sync
        
        fragment ref "Validation" from:1 to:2 ref:"ValidationSequence" gates:["in", "out"]
        
        message from:"Service" to:"Controller" label:"Done" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    const fragment = seqProfile?.fragments?.[0];
    expect(fragment?.type).toBe('ref');
    expect(fragment?.reference).toBe('ValidationSequence');
    expect(fragment?.gates).toBeDefined();
    expect(fragment?.gates).toHaveLength(2);
    expect(fragment?.gates).toContain('in');
    expect(fragment?.gates).toContain('out');
  });

  it('should parse ref fragment alongside other fragment types', () => {
    const dsl = `
      sequence "Mixed Fragments" {
        participant "User" as actor
        participant "System" as control
        
        message from:"User" to:"System" label:"Login" type:sync
        
        fragment ref "Authentication" from:1 to:2 ref:"AuthSequence"
        
        message from:"System" to:"User" label:"Token" type:return
        
        fragment loop "Retry" from:3 to:4
        
        message from:"User" to:"System" label:"Request" type:sync
        message from:"System" to:"User" label:"Response" type:return
        
        fragment alt "Error Handling" from:5 to:7 alternatives:("Success":5..6,"Error":6..7)
        
        message from:"System" to:"User" label:"Success" type:return
        message from:"System" to:"User" label:"Error" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.fragments).toHaveLength(3);

    expect(seqProfile?.fragments?.[0].type).toBe('ref');
    expect(seqProfile?.fragments?.[0].reference).toBe('AuthSequence');

    expect(seqProfile?.fragments?.[1].type).toBe('loop');
    expect(seqProfile?.fragments?.[1].reference).toBeUndefined();

    expect(seqProfile?.fragments?.[2].type).toBe('alt');
    expect(seqProfile?.fragments?.[2].reference).toBeUndefined();
  });

  it('should parse ref fragment with descriptive reference names', () => {
    const dsl = `
      sequence "Payment Flow" {
        participant "Customer" as actor
        participant "PaymentGateway" as boundary
        
        message from:"Customer" to:"PaymentGateway" label:"Pay" type:sync
        
        fragment ref "Credit Card Processing" from:1 to:2 ref:"CreditCardPaymentSequence"
        
        message from:"PaymentGateway" to:"Customer" label:"Confirmation" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    const fragment = seqProfile?.fragments?.[0];
    expect(fragment?.reference).toBe('CreditCardPaymentSequence');
    expect(fragment?.label).toBe('Credit Card Processing');
  });

  it('should parse ref fragment in nested scenario', () => {
    const dsl = `
      sequence "Order Processing" {
        participant "Customer" as actor
        participant "OrderService" as control
        participant "PaymentService" as control
        
        message from:"Customer" to:"OrderService" label:"Place Order" type:sync
        
        fragment ref "Inventory Check" from:1 to:2 ref:"InventorySequence"
        
        message from:"OrderService" to:"PaymentService" label:"Process Payment" type:sync
        
        fragment ref "Payment Processing" from:3 to:4 ref:"PaymentSequence"
        
        message from:"PaymentService" to:"OrderService" label:"Payment Success" type:return
        message from:"OrderService" to:"Customer" label:"Order Confirmed" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.fragments).toHaveLength(2);
    expect(seqProfile?.fragments?.[0].reference).toBe('InventorySequence');
    expect(seqProfile?.fragments?.[1].reference).toBe('PaymentSequence');
  });

  it('should parse ref fragment without gates', () => {
    const dsl = `
      sequence "Simple Ref" {
        participant "A" as control
        participant "B" as control
        
        message from:"A" to:"B" label:"Start" type:sync
        
        fragment ref "SubProcess" from:1 to:2 ref:"SubProcessSequence"
        
        message from:"B" to:"A" label:"End" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    const fragment = seqProfile?.fragments?.[0];
    expect(fragment?.gates).toBeUndefined();
    expect(fragment?.reference).toBe('SubProcessSequence');
  });

  it('should parse ref with numeric message indices', () => {
    const dsl = `
      sequence "Index Test" {
        participant "Service1" as control
        participant "Service2" as control
        
        message from:"Service1" to:"Service2" label:"Msg0" type:sync
        message from:"Service2" to:"Service1" label:"Msg1" type:return
        message from:"Service1" to:"Service2" label:"Msg2" type:sync
        
        fragment ref "External Process" from:0 to:2 ref:"ExternalSequence"
        
        message from:"Service2" to:"Service1" label:"Msg3" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    const fragment = seqProfile?.fragments?.[0];
    expect(fragment?.startAfterMessage).toBe(0);
    expect(fragment?.endAfterMessage).toBe(2);
    expect(fragment?.reference).toBe('ExternalSequence');
  });

  it('should handle ref fragments with special characters in reference', () => {
    const dsl = `
      sequence "Special Ref Names" {
        participant "A" as control
        participant "B" as control
        
        message from:"A" to:"B" label:"Call" type:sync
        
        fragment ref "Process" from:1 to:2 ref:"Sub-Process_Flow.v2"
        
        message from:"B" to:"A" label:"Return" type:return
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    const fragment = seqProfile?.fragments?.[0];
    expect(fragment?.reference).toBe('Sub-Process_Flow.v2');
  });

  it('should parse ref alongside duration constraints', () => {
    const dsl = `
      sequence "Ref with Timing" {
        participant "Client" as actor
        participant "API" as boundary
        
        message from:"Client" to:"API" label:"Request" type:sync
        
        fragment ref "Backend Processing" from:1 to:2 ref:"BackendSequence"
        
        message from:"API" to:"Client" label:"Response" type:return
        
        durationConstraint from:0 to:2 constraint:"< 500ms including ref"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.fragments).toHaveLength(1);
    expect(seqProfile?.fragments?.[0].type).toBe('ref');
    expect(seqProfile?.fragments?.[0].reference).toBe('BackendSequence');

    expect(seqProfile?.durationConstraints).toHaveLength(1);
    expect(seqProfile?.durationConstraints?.[0].constraint).toContain(
      'including ref'
    );
  });
});
