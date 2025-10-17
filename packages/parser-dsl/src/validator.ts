import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type {
  RuniqAstType,
  ShapeDeclaration,
  EdgeDeclaration,
} from './generated/ast.js';
import type { RuniqServices } from './langium-module.js';
import { ValidationRegistry as LangiumValidationRegistry } from 'langium';

/**
 * Registry for validation checks.
 */
export class RuniqValidationRegistry extends LangiumValidationRegistry {
  constructor(services: RuniqServices) {
    super(services);
    const validator = services.validation.RuniqValidator;
    const checks: ValidationChecks<RuniqAstType> = {
      ShapeDeclaration: validator.checkShapeDeclaration,
      EdgeDeclaration: validator.checkEdgeDeclaration,
    };
    this.register(checks, validator);
  }
}

/**
 * Implementation of custom validations.
 */
export class RuniqValidator {
  /**
   * Validate shape declarations
   */
  checkShapeDeclaration(
    shape: ShapeDeclaration,
    accept: ValidationAcceptor
  ): void {
    // Example: warn about long IDs
    if (shape.id.length > 50) {
      accept(
        'warning',
        'Shape ID is very long. Consider using a shorter name.',
        {
          node: shape,
          property: 'id',
        }
      );
    }

    // Check for valid shape types (could be extended)
    const validShapes = [
      'rounded',
      'rect',
      'circle',
      'ellipse',
      'ellipse-wide',
      'rhombus',
      'hex',
      'cylinder',
      'actor',
      'system-boundary',
      'doc',
      'note',
      'queue',
    ];

    if (!validShapes.includes(shape.shape)) {
      accept(
        'warning',
        `Unknown shape type "${shape.shape}". Valid shapes: ${validShapes.join(', ')}`,
        {
          node: shape,
          property: 'shape',
        }
      );
    }
  }

  /**
   * Validate edge declarations
   */
  checkEdgeDeclaration(
    edge: EdgeDeclaration,
    accept: ValidationAcceptor
  ): void {
    // Edges are validated at a higher level (checking node references)
    // This is handled by Langium's built-in cross-reference validation

    // Example: warn about self-loops
    if (edge.from === edge.to) {
      accept('warning', 'Edge connects a node to itself (self-loop).', {
        node: edge,
      });
    }
  }
}
