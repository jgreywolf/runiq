/**
 * Style Resolution System for Phase 5 Templates & Presets
 *
 * Implements the property resolution order:
 * 1. Template styles (from templateId)
 * 2. Preset styles (from preset)
 * 3. Extended container styles (from extends)
 * 4. Inline styles (highest priority)
 */

import type {
  DiagramAst,
  ContainerDeclaration,
  ContainerStyle,
} from '@runiq/core';

/**
 * Resolve final container styles with proper precedence
 * Works with converted DiagramAst (core format), not Langium AST
 *
 * Precedence order (lowest to highest):
 * 1. Extended container's fully resolved styles (from extends)
 * 2. Template styles (from templateId)
 * 3. Preset styles (from preset)
 * 4. Inline styles (highest priority)
 *
 * Note: Extends applies the FULL resolved style chain of the base container FIRST,
 * then the current container's template/preset/inline can override specific properties.
 */
export function resolveContainerStyle(
  container: ContainerDeclaration,
  diagram: DiagramAst
): ContainerStyle {
  let resolvedStyle: ContainerStyle = {};

  const containerStyle = container.containerStyle;

  // 1. Apply extended container's FULL resolved styles first (lowest priority)
  if (containerStyle?.extends) {
    const baseContainer = findContainerById(
      diagram.containers,
      containerStyle.extends
    );
    if (baseContainer) {
      // Recursively resolve the base container's complete style
      const baseStyle = resolveContainerStyle(baseContainer, diagram);
      resolvedStyle = { ...resolvedStyle, ...baseStyle };
    }
  }

  // 2. Apply template styles if templateId exists
  if (containerStyle?.templateId && diagram.templates) {
    const template = diagram.templates.find(
      (t) => t.id === containerStyle.templateId
    );
    if (template?.containerStyle) {
      resolvedStyle = { ...resolvedStyle, ...template.containerStyle };
    }
  }

  // 3. Apply preset styles if preset exists
  if (containerStyle?.preset && diagram.presets) {
    const preset = diagram.presets.find((p) => p.id === containerStyle.preset);
    if (preset?.style) {
      resolvedStyle = { ...resolvedStyle, ...preset.style };
    }
  }

  // 4. Apply inline styles (highest priority)
  if (containerStyle) {
    // Spread all properties except the reference properties
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      templateId,
      preset,
      extends: extendsRef,
      ...inlineStyles
    } = containerStyle;
    resolvedStyle = { ...resolvedStyle, ...inlineStyles };
  }

  return resolvedStyle;
}

/**
 * Find a container by ID, searching recursively through nested containers
 */
function findContainerById(
  containers: ContainerDeclaration[] | undefined,
  containerId: string
): ContainerDeclaration | undefined {
  if (!containers) return undefined;

  for (const container of containers) {
    if (container.id === containerId) {
      return container;
    }
    // Search in nested containers
    if (container.containers) {
      const found = findContainerById(container.containers, containerId);
      if (found) return found;
    }
  }
  return undefined;
}
