import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type {
  RuniqAstType,
  ShapeDeclaration,
  EdgeDeclaration,
} from './generated/ast.js';
import type { RuniqServices } from './langium-module.js';
import { ValidationRegistry as LangiumValidationRegistry } from 'langium';
import { shapeRegistry } from '@runiq/core';
import { findClosestMatches } from './utils/levenshtein.js';

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
    // Validate shape ID length
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

    // Validate shape type using the shape registry
    // Skip validation if shape is not specified (will be set by container type defaults)
    if (shape.shape) {
      // Remove @ prefix if present
      const shapeId = shape.shape.startsWith('@')
        ? shape.shape.slice(1)
        : shape.shape;

      // Check if shape exists in registry (includes both IDs and aliases)
      if (!shapeRegistry.has(shapeId)) {
        // Get all available shape identifiers (IDs + aliases)
        const availableShapes = shapeRegistry.listAllIdentifiers();

        // Find closest matches using Levenshtein distance
        const suggestions = findClosestMatches(shapeId, availableShapes, 3, 5);

        // Build error message with suggestions
        let message = `Unknown shape type "${shapeId}".`;
        if (suggestions.length > 0) {
          message += ` Did you mean: ${suggestions.map((s) => `"${s}"`).join(', ')}?`;
        } else {
          // If no close matches, suggest looking at documentation
          message += ` See shape catalog for available shapes.`;
        }

        accept('error', message, {
          node: shape,
          property: 'shape',
        });
      } else {
        // Optional: Suggest using canonical ID instead of alias
        const canonicalId = shapeRegistry.resolveAlias(shapeId);
        if (canonicalId !== shapeId) {
          const aliases = shapeRegistry.getAliases(canonicalId);
          accept(
            'hint',
            `Shape "${shapeId}" is an alias for "${canonicalId}". Available aliases: ${aliases.join(', ')}.`,
            {
              node: shape,
              property: 'shape',
            }
          );
        }
      }
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
