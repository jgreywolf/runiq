import { describe, it, expect } from 'vitest';
import { resolveContainerStyle } from './renderers/style-resolver.js';
import type {
  DiagramAst,
  ContainerDeclaration,
  ContainerTemplate,
  ContainerPreset,
} from '@runiq/core';

describe('Phase 5: Style Resolution', () => {
  it('should use inline styles when no references', () => {
    const container: ContainerDeclaration = {
      type: 'container',
      id: 'test',
      label: 'Test',
      children: [],
      containerStyle: {
        fillColor: '#ff0000',
        strokeColor: '#00ff00',
        padding: 10,
      },
    };

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
    };

    const resolved = resolveContainerStyle(container, diagram);

    expect(resolved.fillColor).toBe('#ff0000');
    expect(resolved.strokeColor).toBe('#00ff00');
    expect(resolved.padding).toBe(10);
  });

  it('should apply template styles when templateId is specified', () => {
    const template: ContainerTemplate = {
      id: 'card-template',
      label: 'Card',
      containerStyle: {
        fillColor: '#e3f2fd',
        strokeColor: '#2196f3',
        borderWidth: 2,
        padding: 20,
        shadow: true,
      },
    };

    const container: ContainerDeclaration = {
      type: 'container',
      id: 'test',
      label: 'Test',
      children: [],
      containerStyle: {
        templateId: 'card-template',
      },
    };

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
      templates: [template],
    };

    const resolved = resolveContainerStyle(container, diagram);

    expect(resolved.fillColor).toBe('#e3f2fd');
    expect(resolved.strokeColor).toBe('#2196f3');
    expect(resolved.borderWidth).toBe(2);
    expect(resolved.padding).toBe(20);
    expect(resolved.shadow).toBe(true);
  });

  it('should apply preset styles when preset is specified', () => {
    const preset: ContainerPreset = {
      id: 'success',
      label: 'Success',
      style: {
        fillColor: '#e8f5e9',
        strokeColor: '#4caf50',
        borderWidth: 3,
      },
    };

    const container: ContainerDeclaration = {
      type: 'container',
      id: 'test',
      label: 'Test',
      children: [],
      containerStyle: {
        preset: 'success',
      },
    };

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
      presets: [preset],
    };

    const resolved = resolveContainerStyle(container, diagram);

    expect(resolved.fillColor).toBe('#e8f5e9');
    expect(resolved.strokeColor).toBe('#4caf50');
    expect(resolved.borderWidth).toBe(3);
  });

  it('should apply extends styles when extends is specified', () => {
    const baseContainer: ContainerDeclaration = {
      type: 'container',
      id: 'base',
      label: 'Base',
      children: [],
      containerStyle: {
        fillColor: '#f0f0f0',
        strokeColor: '#999',
        padding: 15,
      },
    };

    const container: ContainerDeclaration = {
      type: 'container',
      id: 'derived',
      label: 'Derived',
      children: [],
      containerStyle: {
        extends: 'base',
      },
    };

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
      containers: [baseContainer, container],
    };

    const resolved = resolveContainerStyle(container, diagram);

    expect(resolved.fillColor).toBe('#f0f0f0');
    expect(resolved.strokeColor).toBe('#999');
    expect(resolved.padding).toBe(15);
  });

  it('should follow correct precedence: extends → template → preset → inline', () => {
    const template: ContainerTemplate = {
      id: 'my-template',
      label: 'Template',
      containerStyle: {
        fillColor: '#template',
        strokeColor: '#template',
        borderWidth: 1,
        padding: 10,
      },
    };

    const preset: ContainerPreset = {
      id: 'my-preset',
      label: 'Preset',
      style: {
        fillColor: '#preset',
        strokeColor: '#preset',
        borderWidth: 2,
      },
    };

    const baseContainer: ContainerDeclaration = {
      type: 'container',
      id: 'base',
      label: 'Base',
      children: [],
      containerStyle: {
        fillColor: '#base',
        strokeColor: '#base',
        margin: 5, // Unique to base
      },
    };

    const container: ContainerDeclaration = {
      type: 'container',
      id: 'derived',
      label: 'Derived',
      children: [],
      containerStyle: {
        extends: 'base', // Lowest priority
        templateId: 'my-template',
        preset: 'my-preset',
        fillColor: '#inline', // Highest priority
        // borderColor from preset should win (no inline override)
        // borderWidth from preset should win
        // padding from template should win
        // margin from extends (base) should be included
      },
    };

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
      templates: [template],
      presets: [preset],
      containers: [baseContainer, container],
    };

    const resolved = resolveContainerStyle(container, diagram);

    // Inline wins
    expect(resolved.fillColor).toBe('#inline');
    // Preset wins over template and extends
    expect(resolved.strokeColor).toBe('#preset');
    expect(resolved.borderWidth).toBe(2);
    // Template property not overridden by preset or inline
    expect(resolved.padding).toBe(10);
    // Extends property not overridden by anyone
    expect(resolved.margin).toBe(5);
  });

  it('should handle nested extends (recursive resolution)', () => {
    const base1: ContainerDeclaration = {
      type: 'container',
      id: 'base1',
      label: 'Base 1',
      children: [],
      containerStyle: {
        fillColor: '#base1',
        padding: 5,
      },
    };

    const base2: ContainerDeclaration = {
      type: 'container',
      id: 'base2',
      label: 'Base 2',
      children: [],
      containerStyle: {
        extends: 'base1',
        strokeColor: '#base2',
      },
    };

    const container: ContainerDeclaration = {
      type: 'container',
      id: 'derived',
      label: 'Derived',
      children: [],
      containerStyle: {
        extends: 'base2',
        borderWidth: 3,
      },
    };

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
      containers: [base1, base2, container],
    };

    const resolved = resolveContainerStyle(container, diagram);

    // From base1 (through base2)
    expect(resolved.fillColor).toBe('#base1');
    expect(resolved.padding).toBe(5);
    // From base2
    expect(resolved.strokeColor).toBe('#base2');
    // From derived (inline)
    expect(resolved.borderWidth).toBe(3);
  });

  it('should handle missing template reference gracefully', () => {
    const container: ContainerDeclaration = {
      type: 'container',
      id: 'test',
      label: 'Test',
      children: [],
      containerStyle: {
        templateId: 'nonexistent',
        fillColor: '#fallback',
      },
    };

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
    };

    const resolved = resolveContainerStyle(container, diagram);

    // Should use inline style when template not found
    expect(resolved.fillColor).toBe('#fallback');
  });

  it('should handle missing preset reference gracefully', () => {
    const container: ContainerDeclaration = {
      type: 'container',
      id: 'test',
      label: 'Test',
      children: [],
      containerStyle: {
        preset: 'nonexistent',
        strokeColor: '#fallback',
      },
    };

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
    };

    const resolved = resolveContainerStyle(container, diagram);

    // Should use inline style when preset not found
    expect(resolved.strokeColor).toBe('#fallback');
  });

  it('should handle missing extends reference gracefully', () => {
    const container: ContainerDeclaration = {
      type: 'container',
      id: 'test',
      label: 'Test',
      children: [],
      containerStyle: {
        extends: 'nonexistent',
        padding: 10,
      },
    };

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
    };

    const resolved = resolveContainerStyle(container, diagram);

    // Should use inline style when extends not found
    expect(resolved.padding).toBe(10);
  });

  it('should not include reference properties in resolved style', () => {
    const container: ContainerDeclaration = {
      type: 'container',
      id: 'test',
      label: 'Test',
      children: [],
      containerStyle: {
        templateId: 'nonexistent',
        preset: 'also-nonexistent',
        extends: 'still-nonexistent',
        fillColor: '#test',
      },
    };

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
    };

    const resolved = resolveContainerStyle(container, diagram);

    // Reference properties should not be in resolved style
    expect(resolved).not.toHaveProperty('templateId');
    expect(resolved).not.toHaveProperty('preset');
    expect(resolved).not.toHaveProperty('extends');
    // But actual style properties should be there
    expect(resolved.fillColor).toBe('#test');
  });

  it('should find containers in nested structures', () => {
    const base: ContainerDeclaration = {
      type: 'container',
      id: 'base',
      label: 'Base',
      children: [],
      containerStyle: {
        fillColor: '#nested',
      },
      containers: [
        {
          type: 'container',
          id: 'nested-base',
          label: 'Nested Base',
          children: [],
          containerStyle: {
            strokeColor: '#nested-border',
          },
        },
      ],
    };

    const container: ContainerDeclaration = {
      type: 'container',
      id: 'test',
      label: 'Test',
      children: [],
      containerStyle: {
        extends: 'nested-base',
      },
    };

    const diagram: DiagramAst = {
      astVersion: '1.0',
      nodes: [],
      edges: [],
      containers: [base, container],
    };

    const resolved = resolveContainerStyle(container, diagram);

    // Should find nested-base inside base container
    expect(resolved.strokeColor).toBe('#nested-border');
  });
});
