/**
 * Tests for Template Expression Evaluator
 * Phase 2.2: Variable Substitution Implementation
 */

import { describe, it, expect } from 'vitest';
import {
  evaluateVariablePath,
  evaluateExpression,
  evaluateExpressionValue,
  coerceValue,
  type DataContext,
} from './template-evaluator';

describe('Template Evaluator', () => {
  describe('evaluateVariablePath', () => {
    it('evaluates simple property access', () => {
      const context: DataContext = { name: 'Alice' };
      const result = evaluateVariablePath('name', context);

      expect(result.success).toBe(true);
      expect(result.value).toBe('Alice');
    });

    it('evaluates nested property access', () => {
      const context: DataContext = {
        user: {
          profile: {
            name: 'Bob',
          },
        },
      };
      const result = evaluateVariablePath('user.profile.name', context);

      expect(result.success).toBe(true);
      expect(result.value).toBe('Bob');
    });

    it('evaluates deep nested property access', () => {
      const context: DataContext = {
        company: {
          department: {
            team: {
              lead: {
                name: 'Charlie',
              },
            },
          },
        },
      };
      const result = evaluateVariablePath(
        'company.department.team.lead.name',
        context
      );

      expect(result.success).toBe(true);
      expect(result.value).toBe('Charlie');
    });

    it('returns undefined for missing property with safe navigation', () => {
      const context: DataContext = { user: { name: 'Alice' } };
      const result = evaluateVariablePath('user.age', context);

      expect(result.success).toBe(true);
      expect(result.value).toBeUndefined();
    });

    it('returns default value when property not found', () => {
      const context: DataContext = { user: { name: 'Alice' } };
      const result = evaluateVariablePath('user.age', context, {
        defaultValue: 0,
      });

      expect(result.success).toBe(true);
      expect(result.value).toBe(0);
    });

    it('handles null intermediate values with safe navigation', () => {
      const context: DataContext = { user: null };
      const result = evaluateVariablePath('user.name', context);

      expect(result.success).toBe(true);
      expect(result.value).toBeUndefined();
    });

    it('handles undefined intermediate values with safe navigation', () => {
      const context: DataContext = { user: undefined };
      const result = evaluateVariablePath('user.name', context);

      expect(result.success).toBe(true);
      expect(result.value).toBeUndefined();
    });

    it('returns error for null without safe navigation', () => {
      const context: DataContext = { user: null };
      const result = evaluateVariablePath('user.name', context, {
        safeNavigation: false,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Cannot access property');
    });

    it('returns error for non-object property access', () => {
      const context: DataContext = { value: 42 };
      const result = evaluateVariablePath('value.toString', context, {
        safeNavigation: false,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('non-object type');
    });

    it('returns error for empty path', () => {
      const context: DataContext = { name: 'Alice' };
      const result = evaluateVariablePath('', context);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Empty variable path');
    });

    it('handles array index access', () => {
      const context: DataContext = {
        users: [{ name: 'Alice' }, { name: 'Bob' }],
      };
      const result = evaluateVariablePath('users.0.name', context);

      expect(result.success).toBe(true);
      expect(result.value).toBe('Alice');
    });

    it('evaluates properties with numeric values', () => {
      const context: DataContext = { count: 42, price: 19.99 };

      const countResult = evaluateVariablePath('count', context);
      expect(countResult.value).toBe(42);

      const priceResult = evaluateVariablePath('price', context);
      expect(priceResult.value).toBe(19.99);
    });

    it('evaluates properties with boolean values', () => {
      const context: DataContext = { active: true, deleted: false };

      const activeResult = evaluateVariablePath('active', context);
      expect(activeResult.value).toBe(true);

      const deletedResult = evaluateVariablePath('deleted', context);
      expect(deletedResult.value).toBe(false);
    });
  });

  describe('coerceValue', () => {
    it('coerces to string', () => {
      expect(coerceValue(42, 'string')).toBe('42');
      expect(coerceValue(true, 'string')).toBe('true');
      expect(coerceValue(null, 'string')).toBe(null);
    });

    it('coerces to number', () => {
      expect(coerceValue('42', 'number')).toBe(42);
      expect(coerceValue('19.99', 'number')).toBe(19.99);
      expect(coerceValue(true, 'number')).toBe(1);
      expect(coerceValue(false, 'number')).toBe(0);
      expect(coerceValue('invalid', 'number')).toBe(0);
    });

    it('coerces to boolean', () => {
      expect(coerceValue('true', 'boolean')).toBe(true);
      expect(coerceValue('false', 'boolean')).toBe(false);
      expect(coerceValue('yes', 'boolean')).toBe(true);
      expect(coerceValue('no', 'boolean')).toBe(false);
      expect(coerceValue('1', 'boolean')).toBe(true);
      expect(coerceValue('0', 'boolean')).toBe(false);
      expect(coerceValue(1, 'boolean')).toBe(true);
      expect(coerceValue(0, 'boolean')).toBe(false);
    });
  });

  describe('evaluateExpression', () => {
    it('evaluates expression with single variable', () => {
      const context: DataContext = { name: 'Alice' };
      const result = evaluateExpression('${name}', context);

      expect(result).toBe('Alice');
    });

    it('evaluates expression with nested variable', () => {
      const context: DataContext = {
        user: {
          profile: {
            name: 'Bob',
          },
        },
      };
      const result = evaluateExpression('${user.profile.name}', context);

      expect(result).toBe('Bob');
    });

    it('evaluates expression with multiple variables', () => {
      const context: DataContext = {
        user: {
          name: 'Alice',
          age: 30,
        },
      };
      const result = evaluateExpression(
        'User: ${user.name} (${user.age})',
        context
      );

      expect(result).toBe('User: Alice (30)');
    });

    it('evaluates expression with literal text and variables', () => {
      const context: DataContext = {
        product: {
          name: 'Widget',
          price: 19.99,
        },
      };
      const result = evaluateExpression(
        'Product: ${product.name} - $${product.price}',
        context
      );

      expect(result).toBe('Product: Widget - $19.99');
    });

    it('returns empty string for missing variables', () => {
      const context: DataContext = { name: 'Alice' };
      const result = evaluateExpression('${name} - ${age}', context);

      expect(result).toBe('Alice - ');
    });

    it('handles expressions with whitespace in variable references', () => {
      const context: DataContext = { name: 'Alice' };
      const result = evaluateExpression('${ name }', context);

      expect(result).toBe('Alice');
    });

    it('handles expressions with no variables', () => {
      const context: DataContext = {};
      const result = evaluateExpression('Plain text', context);

      expect(result).toBe('Plain text');
    });

    it('evaluates complex nested expression', () => {
      const context: DataContext = {
        order: {
          customer: {
            name: 'Alice',
            email: 'alice@example.com',
          },
          items: [{ product: 'Widget', quantity: 2 }],
        },
      };
      const result = evaluateExpression(
        'Order from ${order.customer.name} (${order.customer.email})',
        context
      );

      expect(result).toBe('Order from Alice (alice@example.com)');
    });
  });

  describe('evaluateExpressionValue', () => {
    it('returns raw value for simple variable reference', () => {
      const context: DataContext = { count: 42 };
      const result = evaluateExpressionValue('${count}', context);

      expect(result).toBe(42);
    });

    it('returns raw boolean value', () => {
      const context: DataContext = { active: true };
      const result = evaluateExpressionValue('${active}', context);

      expect(result).toBe(true);
    });

    it('returns raw object value', () => {
      const context: DataContext = {
        user: {
          name: 'Alice',
          age: 30,
        },
      };
      const result = evaluateExpressionValue('${user}', context);

      expect(result).toEqual({ name: 'Alice', age: 30 });
    });

    it('returns string for complex expression', () => {
      const context: DataContext = { name: 'Alice', age: 30 };
      const result = evaluateExpressionValue('User: ${name} (${age})', context);

      expect(result).toBe('User: Alice (30)');
    });

    it('returns undefined for missing variable', () => {
      const context: DataContext = { name: 'Alice' };
      const result = evaluateExpressionValue('${age}', context);

      expect(result).toBeUndefined();
    });
  });

  describe('Edge cases', () => {
    it('handles circular references gracefully', () => {
      const context: DataContext = { a: {} };
      (context.a as Record<string, unknown>).b = context.a;

      const result = evaluateVariablePath('a.b', context);
      expect(result.success).toBe(true);
      expect(result.value).toBe(context.a);
    });

    it('handles special characters in property names', () => {
      const context: DataContext = {
        'user-name': 'Alice',
        'email@address': 'alice@example.com',
      };

      const nameResult = evaluateVariablePath('user-name', context);
      expect(nameResult.value).toBe('Alice');

      const emailResult = evaluateVariablePath('email@address', context);
      expect(emailResult.value).toBe('alice@example.com');
    });

    it('handles empty string values', () => {
      const context: DataContext = { name: '' };
      const result = evaluateExpression('Name: ${name}', context);

      expect(result).toBe('Name: ');
    });

    it('handles zero values', () => {
      const context: DataContext = { count: 0 };
      const result = evaluateExpression('Count: ${count}', context);

      expect(result).toBe('Count: 0');
    });
  });
});
