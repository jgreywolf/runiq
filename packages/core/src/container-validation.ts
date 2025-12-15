/**
 * Validation utilities for hierarchical containers
 */

import type { ContainerDeclaration, DiagramAst } from './types/index.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a container structure for common issues
 */
export function validateContainer(
  container: ContainerDeclaration,
  diagram?: DiagramAst
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for empty containers
  if (
    container.children.length === 0 &&
    (!container.containers || container.containers.length === 0)
  ) {
    warnings.push(
      `Container "${container.label || container.id}" is empty (no children or nested containers)`
    );
  }

  // Check for duplicate child IDs within the container
  const childIds = new Set<string>();
  for (const childId of container.children) {
    if (childIds.has(childId)) {
      errors.push(
        `Duplicate child ID "${childId}" in container "${container.label || container.id}"`
      );
    }
    childIds.add(childId);
  }

  // Validate child node existence if diagram provided
  if (diagram) {
    const nodeIds = new Set(diagram.nodes.map((n) => n.id));
    for (const childId of container.children) {
      if (!nodeIds.has(childId)) {
        errors.push(
          `Child node "${childId}" referenced in container "${container.label || container.id}" does not exist`
        );
      }
    }
  }

  // Recursively validate nested containers
  if (container.containers) {
    for (const nested of container.containers) {
      const nestedResult = validateContainer(nested, diagram);
      errors.push(...nestedResult.errors);
      warnings.push(...nestedResult.warnings);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Detects circular references in container hierarchy
 */
export function detectCircularReferences(
  container: ContainerDeclaration,
  visited: Set<string> = new Set()
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const containerId = container.id || container.label || 'unnamed';

  // Check if we've seen this container before (circular reference)
  if (visited.has(containerId)) {
    errors.push(
      `Circular reference detected: Container "${containerId}" references itself in its own hierarchy`
    );
    return { valid: false, errors, warnings };
  }

  // Add to visited set
  visited.add(containerId);

  // Check nested containers
  if (container.containers) {
    for (const nested of container.containers) {
      const nestedResult = detectCircularReferences(nested, new Set(visited));
      errors.push(...nestedResult.errors);
      warnings.push(...nestedResult.warnings);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculates the nesting depth of a container
 */
export function calculateNestingDepth(container: ContainerDeclaration): number {
  if (!container.containers || container.containers.length === 0) {
    return 1;
  }

  const childDepths = container.containers.map((nested) =>
    calculateNestingDepth(nested)
  );
  return 1 + Math.max(...childDepths);
}

/**
 * Validates container nesting depth (warns if too deep)
 */
export function validateNestingDepth(
  container: ContainerDeclaration,
  maxDepth: number = 5
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const depth = calculateNestingDepth(container);

  if (depth > maxDepth) {
    warnings.push(
      `Container "${container.label || container.id}" has nesting depth of ${depth}, which exceeds recommended maximum of ${maxDepth}`
    );
  }

  return {
    valid: true, // This is a warning, not an error
    errors,
    warnings,
  };
}

/**
 * Validates all containers in a diagram
 */
export function validateDiagram(diagram: DiagramAst): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!diagram.containers || diagram.containers.length === 0) {
    return { valid: true, errors, warnings };
  }

  // Check for duplicate container IDs at top level
  const containerIds = new Set<string>();
  for (const container of diagram.containers) {
    const containerId = container.id || container.label;
    if (containerId && containerIds.has(containerId)) {
      errors.push(`Duplicate container ID: "${containerId}"`);
    }
    if (containerId) {
      containerIds.add(containerId);
    }
  }

  // Validate each container
  for (const container of diagram.containers) {
    // Check structure
    const structureResult = validateContainer(container, diagram);
    errors.push(...structureResult.errors);
    warnings.push(...structureResult.warnings);

    // Check circular references
    const circularResult = detectCircularReferences(container);
    errors.push(...circularResult.errors);
    warnings.push(...circularResult.warnings);

    // Check nesting depth
    const depthResult = validateNestingDepth(container);
    warnings.push(...depthResult.warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Collects all node IDs that are members of any container
 */
export function getContainerMembership(
  diagram: DiagramAst
): Map<string, string> {
  const membership = new Map<string, string>(); // nodeId -> containerId

  function traverse(container: ContainerDeclaration) {
    const containerId = container.id || container.label || 'unnamed';

    // Add direct children
    for (const childId of container.children) {
      membership.set(childId, containerId);
    }

    // Traverse nested containers
    if (container.containers) {
      for (const nested of container.containers) {
        traverse(nested);
      }
    }
  }

  if (diagram.containers) {
    for (const container of diagram.containers) {
      traverse(container);
    }
  }

  return membership;
}

/**
 * Finds the container that contains a given node
 */
export function findContainerForNode(
  nodeId: string,
  containers: ContainerDeclaration[]
): ContainerDeclaration | null {
  for (const container of containers) {
    // Check direct children
    if (container.children.includes(nodeId)) {
      return container;
    }

    // Check nested containers
    if (container.containers) {
      const found = findContainerForNode(nodeId, container.containers);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Gets all descendant node IDs from a container (including nested)
 */
export function getAllDescendants(container: ContainerDeclaration): string[] {
  const descendants = [...container.children];

  if (container.containers) {
    for (const nested of container.containers) {
      descendants.push(...getAllDescendants(nested));
    }
  }

  return descendants;
}
