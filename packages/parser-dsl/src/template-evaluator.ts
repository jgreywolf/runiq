/**
 * Template Expression Evaluator
 * 
 * Phase 2.2: Variable Substitution Implementation
 * 
 * Evaluates template expressions like ${variable.path} against a data context,
 * supporting nested property access, type coercion, and safe navigation.
 */

/**
 * Data context for template evaluation
 */
export type DataContext = Record<string, unknown>;

/**
 * Result of evaluating a template expression
 */
export interface EvaluationResult {
  value: unknown;
  success: boolean;
  error?: string;
}

/**
 * Options for expression evaluation
 */
export interface EvaluationOptions {
  /** If true, return undefined for missing properties instead of throwing */
  safeNavigation?: boolean;
  /** Default value to return when property is not found */
  defaultValue?: unknown;
}

/**
 * Evaluates a template variable path against a data context
 * 
 * @param path - Dot-separated property path (e.g., "item.user.name")
 * @param context - Data context object
 * @param options - Evaluation options
 * @returns Evaluation result with value and status
 * 
 * @example
 * const context = { item: { user: { name: "Alice" } } };
 * const result = evaluateVariablePath("item.user.name", context);
 * // result.value === "Alice"
 */
export function evaluateVariablePath(
  path: string,
  context: DataContext,
  options: EvaluationOptions = {}
): EvaluationResult {
  const { safeNavigation = true, defaultValue = undefined } = options;
  
  // Split path into segments
  const segments = path.split('.').filter(s => s.length > 0);
  
  if (segments.length === 0) {
    return {
      value: undefined,
      success: false,
      error: 'Empty variable path'
    };
  }
  
  // Navigate through the path
  let current: unknown = context;
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    
    // Check if current value is an object
    if (current === null || current === undefined) {
      if (safeNavigation) {
        return {
          value: defaultValue,
          success: true
        };
      } else {
        return {
          value: undefined,
          success: false,
          error: `Cannot access property '${segment}' of ${current}`
        };
      }
    }
    
    // Type guard: ensure current is an object
    if (typeof current !== 'object') {
      if (safeNavigation) {
        return {
          value: defaultValue,
          success: true
        };
      } else {
        return {
          value: undefined,
          success: false,
          error: `Cannot access property '${segment}' of non-object type ${typeof current}`
        };
      }
    }
    
    // Access property
    const obj = current as Record<string, unknown>;
    
    if (!(segment in obj)) {
      if (safeNavigation) {
        return {
          value: defaultValue,
          success: true
        };
      } else {
        return {
          value: undefined,
          success: false,
          error: `Property '${segment}' not found in object`
        };
      }
    }
    
    current = obj[segment];
  }
  
  return {
    value: current,
    success: true
  };
}

/**
 * Coerces a value to a specific type
 * 
 * @param value - Value to coerce
 * @param targetType - Target type ('string', 'number', 'boolean')
 * @returns Coerced value
 */
export function coerceValue(value: unknown, targetType: 'string' | 'number' | 'boolean'): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  
  switch (targetType) {
    case 'string':
      return String(value);
      
    case 'number':
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      }
      if (typeof value === 'boolean') return value ? 1 : 0;
      return 0;
      
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const lower = value.toLowerCase();
        if (lower === 'true' || lower === 'yes' || lower === '1') return true;
        if (lower === 'false' || lower === 'no' || lower === '0') return false;
      }
      return Boolean(value);
      
    default:
      return value;
  }
}

/**
 * Evaluates a template expression with variables
 * 
 * @param expression - Template expression (e.g., "User: ${user.name}")
 * @param context - Data context
 * @param options - Evaluation options
 * @returns Evaluated string with variables substituted
 * 
 * @example
 * const context = { user: { name: "Alice", age: 30 } };
 * const result = evaluateExpression("User: ${user.name} (${user.age})", context);
 * // result === "User: Alice (30)"
 */
export function evaluateExpression(
  expression: string,
  context: DataContext,
  options: EvaluationOptions = {}
): string {
  // Match all ${...} patterns
  const variablePattern = /\$\{([^}]+)\}/g;
  
  return expression.replace(variablePattern, (match, path: string) => {
    const result = evaluateVariablePath(path.trim(), context, options);
    
    if (!result.success) {
      // Return original match on error in safe mode, or empty string
      return options.safeNavigation ? '' : match;
    }
    
    // Convert value to string
    const value = result.value;
    
    if (value === null || value === undefined) {
      return '';
    }
    
    return String(value);
  });
}

/**
 * Evaluates a template expression and returns the raw value (not converted to string)
 * Used for property assignments where we want to preserve types
 * 
 * @param expression - Template expression (should be a single ${...} variable)
 * @param context - Data context
 * @param options - Evaluation options
 * @returns Raw value from the expression
 */
export function evaluateExpressionValue(
  expression: string,
  context: DataContext,
  options: EvaluationOptions = {}
): unknown {
  // If the expression is a simple variable reference, return the raw value
  const variablePattern = /^\$\{([^}]+)\}$/;
  const match = expression.match(variablePattern);
  
  if (match) {
    const path = match[1].trim();
    const result = evaluateVariablePath(path, context, options);
    return result.success ? result.value : undefined;
  }
  
  // Otherwise, evaluate as string expression
  return evaluateExpression(expression, context, options);
}
