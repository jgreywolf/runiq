import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser';

describe('State Invariant Parsing', () => {
  it('should parse stateInvariant property on lifeline', () => {
    const dsl = `
      shape user as @lifeline label:"User" stateInvariant:"authenticated = true"
      shape account as @lifeline label:"Account" stateInvariant:"balance >= 0"
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram).toBeDefined();
    expect(result.diagram!.nodes).toHaveLength(2);

    const user = result.diagram!.nodes.find((n) => n.id === 'user');
    expect(user).toBeDefined();
    expect(user?.label).toBe('User');
    expect(user?.stateInvariant).toBe('authenticated = true');

    const account = result.diagram!.nodes.find((n) => n.id === 'account');
    expect(account).toBeDefined();
    expect(account?.label).toBe('Account');
    expect(account?.stateInvariant).toBe('balance >= 0');
  });

  it('should parse complex boolean expressions in state invariants', () => {
    const dsl = `
      shape order as @lifeline label:"Order" stateInvariant:"status = 'active' AND items.length > 0"
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram!.nodes).toHaveLength(1);
    const order = result.diagram!.nodes[0];
    expect(order.stateInvariant).toBe("status = 'active' AND items.length > 0");
  });

  it('should parse OCL-style constraints', () => {
    const dsl = `
      shape customer as @lifeline label:"Customer" stateInvariant:"self.age >= 18"
      shape cart as @lifeline label:"Cart" stateInvariant:"self.items->size() > 0"
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram!.nodes).toHaveLength(2);

    const customer = result.diagram!.nodes.find((n) => n.id === 'customer');
    expect(customer?.stateInvariant).toBe('self.age >= 18');

    const cart = result.diagram!.nodes.find((n) => n.id === 'cart');
    expect(cart?.stateInvariant).toBe('self.items->size() > 0');
  });

  it('should handle lifelines without state invariants', () => {
    const dsl = `
      shape app as @lifeline label:"Application"
      shape db as @lifeline label:"Database" stateInvariant:"connected = true"
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram!.nodes).toHaveLength(2);

    const app = result.diagram!.nodes.find((n) => n.id === 'app');
    expect(app?.stateInvariant).toBeUndefined();

    const db = result.diagram!.nodes.find((n) => n.id === 'db');
    expect(db?.stateInvariant).toBe('connected = true');
  });

  it('should parse state invariants with comparison operators', () => {
    const dsl = `
      shape account as @lifeline label:"Account" stateInvariant:"balance >= minBalance"
      shape counter as @lifeline label:"Counter" stateInvariant:"count <= maxValue"
      shape user as @lifeline label:"User" stateInvariant:"age != 0"
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram!.nodes).toHaveLength(3);
    expect(result.diagram!.nodes[0].stateInvariant).toBe('balance >= minBalance');
    expect(result.diagram!.nodes[1].stateInvariant).toBe('count <= maxValue');
    expect(result.diagram!.nodes[2].stateInvariant).toBe('age != 0');
  });

  it('should parse state invariants with mathematical expressions', () => {
    const dsl = `
      shape calc as @lifeline label:"Calculator" stateInvariant:"result = input1 + input2"
    `;

    const result = parse(dsl);

    expect(result.success).toBe(true);
    expect(result.diagram!.nodes).toHaveLength(1);
    expect(result.diagram!.nodes[0].stateInvariant).toBe('result = input1 + input2');
  });
});
