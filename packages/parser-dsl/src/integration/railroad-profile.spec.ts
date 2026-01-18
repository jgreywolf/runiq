import { describe, expect, it } from 'vitest';
import { parseRailroadProfile } from '../test-utils/profile-helpers.js';

describe('Railroad Profile Parser', () => {
  it('parses a simple token sequence', () => {
    const profile = parseRailroadProfile(
      `railroad "Basic" {
        diagram Expr = "a" "b"
      }`
    );

    expect(profile.diagrams).toHaveLength(1);
    const expr = profile.diagrams[0].expression;
    expect(expr.type).toBe('sequence');
    if (expr.type === 'sequence') {
      expect(expr.items).toHaveLength(2);
      expect(expr.items[0]).toMatchObject({ type: 'token', value: 'a' });
      expect(expr.items[1]).toMatchObject({ type: 'token', value: 'b' });
    }
  });

  it('honors precedence: sequence binds tighter than choice', () => {
    const profile = parseRailroadProfile(
      `railroad "Precedence" {
        diagram Expr = A B | C
      }`
    );

    const expr = profile.diagrams[0].expression;
    expect(expr.type).toBe('choice');
    if (expr.type === 'choice') {
      expect(expr.options).toHaveLength(2);
      expect(expr.options[1]).toMatchObject({ type: 'reference', name: 'C' });
      const first = expr.options[0];
      expect(first.type).toBe('sequence');
      if (first.type === 'sequence') {
        expect(first.items).toHaveLength(2);
        expect(first.items[0]).toMatchObject({ type: 'reference', name: 'A' });
        expect(first.items[1]).toMatchObject({ type: 'reference', name: 'B' });
      }
    }
  });

  it('parses postfix operators', () => {
    const profile = parseRailroadProfile(
      `railroad "Quantifiers" {
        diagram Expr = A? B* C+
      }`
    );

    const expr = profile.diagrams[0].expression;
    expect(expr.type).toBe('sequence');
    if (expr.type === 'sequence') {
      expect(expr.items[0]).toMatchObject({ type: 'optional' });
      expect(expr.items[1]).toMatchObject({ type: 'zeroOrMore' });
      expect(expr.items[2]).toMatchObject({ type: 'oneOrMore' });
    }
  });

  it('parses grouping with choice and repetition', () => {
    const profile = parseRailroadProfile(
      `railroad "Grouping" {
        diagram Expr = ("+" | "-") Term
      }`
    );

    const expr = profile.diagrams[0].expression;
    expect(expr.type).toBe('sequence');
    if (expr.type === 'sequence') {
      const choice = expr.items[0];
      expect(choice.type).toBe('choice');
      if (choice.type === 'choice') {
        expect(choice.options).toHaveLength(2);
        expect(choice.options[0]).toMatchObject({ type: 'token', value: '+' });
        expect(choice.options[1]).toMatchObject({ type: 'token', value: '-' });
      }
    }
  });
});
