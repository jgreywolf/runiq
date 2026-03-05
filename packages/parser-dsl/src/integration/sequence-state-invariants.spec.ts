import { ProfileType } from '@runiq/core';
import { describe, expect, it } from 'vitest';
import { parse } from '../langium-parser';

describe('Sequence Diagram - Message State Invariants', () => {
  it('should parse a basic state invariant on a message', () => {
    const dsl = `
      sequence "User Authentication" {
        participant "User" as actor
        participant "System" as control
        
        message from:"User" to:"System" label:"login()" type:sync
        message from:"System" to:"User" label:"success" type:return stateInvariant:"user.isAuthenticated"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.messages).toHaveLength(2);
    const messageWithInvariant = seqProfile?.messages?.[1];
    expect(messageWithInvariant?.stateInvariant).toBe('user.isAuthenticated');
  });

  it('should parse state invariants with complex conditions', () => {
    const dsl = `
      sequence "Bank Transfer" {
        participant "Account A" as database
        participant "Account B" as database
        
        message from:"Account A" to:"Account B" label:"transfer($100)" type:sync stateInvariant:"accountA.balance >= 100"
        message from:"Account B" to:"Account A" label:"confirmed" type:return stateInvariant:"accountB.balance >= 0 && accountA.balance >= 0"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.messages).toHaveLength(2);
    expect(seqProfile?.messages?.[0].stateInvariant).toBe(
      'accountA.balance >= 100'
    );
    expect(seqProfile?.messages?.[1].stateInvariant).toBe(
      'accountB.balance >= 0 && accountA.balance >= 0'
    );
  });

  it('should parse multiple state invariants in a sequence', () => {
    const dsl = `
      sequence "Order Processing" {
        participant "Customer" as actor
        participant "System" as control
        participant "Inventory" as database
        
        message from:"Customer" to:"System" label:"placeOrder()" type:sync
        message from:"System" to:"Inventory" label:"checkStock()" type:sync stateInvariant:"order.status == 'pending'"
        message from:"Inventory" to:"System" label:"inStock" type:return stateInvariant:"inventory.count > 0"
        message from:"System" to:"Customer" label:"confirmed" type:return stateInvariant:"order.status == 'confirmed'"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.messages).toHaveLength(4);
    expect(seqProfile?.messages?.[0].stateInvariant).toBeUndefined();
    expect(seqProfile?.messages?.[1].stateInvariant).toBe(
      "order.status == 'pending'"
    );
    expect(seqProfile?.messages?.[2].stateInvariant).toBe(
      'inventory.count > 0'
    );
    expect(seqProfile?.messages?.[3].stateInvariant).toBe(
      "order.status == 'confirmed'"
    );
  });

  it('should parse state invariant combined with guard', () => {
    const dsl = `
      sequence "Secure Operation" {
        participant "Client" as actor
        participant "Server" as control
        
        message from:"Client" to:"Server" label:"execute()" type:sync guard:"isAuthorized" stateInvariant:"session.active"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    const message = seqProfile?.messages?.[0];
    expect(message?.guard).toBe('isAuthorized');
    expect(message?.stateInvariant).toBe('session.active');
  });

  it('should parse state invariant combined with timing constraint', () => {
    const dsl = `
      sequence "Performance Critical" {
        participant "API" as boundary
        participant "Cache" as database
        
        message from:"API" to:"Cache" label:"get(key)" type:sync timing:"< 10ms" stateInvariant:"cache.connected"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    const message = seqProfile?.messages?.[0];
    expect(message?.timing).toBe('< 10ms');
    expect(message?.stateInvariant).toBe('cache.connected');
  });

  it('should parse state invariant with guard and timing together', () => {
    const dsl = `
      sequence "Complex Message" {
        participant "A" as actor
        participant "B" as control
        
        message from:"A" to:"B" label:"criticalOp()" type:sync guard:"authorized" timing:"< 100ms" stateInvariant:"system.ready"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    const message = seqProfile?.messages?.[0];
    expect(message?.guard).toBe('authorized');
    expect(message?.timing).toBe('< 100ms');
    expect(message?.stateInvariant).toBe('system.ready');
  });

  it('should parse state invariants with mathematical expressions', () => {
    const dsl = `
      sequence "Resource Management" {
        participant "Process" as control
        participant "ResourcePool" as database
        
        message from:"Process" to:"ResourcePool" label:"allocate(5)" type:sync stateInvariant:"available >= requested"
        message from:"ResourcePool" to:"Process" label:"allocated" type:return stateInvariant:"total - used >= 0"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.messages?.[0].stateInvariant).toBe(
      'available >= requested'
    );
    expect(seqProfile?.messages?.[1].stateInvariant).toBe('total - used >= 0');
  });

  it('should parse state invariants with dot notation', () => {
    const dsl = `
      sequence "Nested State" {
        participant "Client" as actor
        participant "Service" as control
        
        message from:"Client" to:"Service" label:"request()" type:sync stateInvariant:"client.session.user.isVerified"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.messages?.[0].stateInvariant).toBe(
      'client.session.user.isVerified'
    );
  });

  it('should parse state invariants with boolean expressions', () => {
    const dsl = `
      sequence "Access Control" {
        participant "User" as actor
        participant "System" as control
        
        message from:"User" to:"System" label:"accessResource()" type:sync stateInvariant:"(user.role == 'admin' || user.role == 'manager') && !user.isSuspended"
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.messages?.[0].stateInvariant).toBe(
      "(user.role == 'admin' || user.role == 'manager') && !user.isSuspended"
    );
  });

  it('should handle messages without state invariants', () => {
    const dsl = `
      sequence "Mixed Messages" {
        participant "A" as actor
        participant "B" as control
        
        message from:"A" to:"B" label:"normal()" type:sync
        message from:"B" to:"A" label:"withInvariant" type:return stateInvariant:"validated"
        message from:"A" to:"B" label:"anotherNormal()" type:async
      }
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    const seqProfile = result.document?.profiles?.find(
      (p) => p.type === ProfileType.SEQUENCE
    );

    expect(seqProfile?.messages).toHaveLength(3);
    expect(seqProfile?.messages?.[0].stateInvariant).toBeUndefined();
    expect(seqProfile?.messages?.[1].stateInvariant).toBe('validated');
    expect(seqProfile?.messages?.[2].stateInvariant).toBeUndefined();
  });
});
