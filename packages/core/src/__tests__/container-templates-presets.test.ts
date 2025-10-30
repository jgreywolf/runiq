/**
 * Tests for Phase 5: Container Templates & Presets
 * These tests verify the type definitions for reusable container patterns,
 * style presets, and template inheritance.
 */

import { describe, it, expect } from 'vitest';
import type {
  ContainerTemplate,
  TemplateParameter,
  ContainerPreset,
  ContainerDeclaration,
  DiagramAst,
} from '../types.js';

describe('Phase 5: Container Templates & Presets', () => {
  describe('Template Definitions', () => {
    it('should support basic template definition', () => {
      const template: ContainerTemplate = {
        id: 'service-template',
        label: 'Microservice Template',
        description: 'Standard microservice container',
      };

      expect(template.id).toBe('service-template');
      expect(template.label).toBe('Microservice Template');
      expect(template.description).toBe('Standard microservice container');
    });

    it('should support template with parameters', () => {
      const template: ContainerTemplate = {
        id: 'card-template',
        label: 'Card Layout',
        parameters: [
          {
            name: 'title',
            type: 'string',
            defaultValue: 'Card Title',
            description: 'Card header text',
          },
          {
            name: 'width',
            type: 'number',
            defaultValue: 300,
            description: 'Card width in pixels',
          },
        ],
      };

      expect(template.parameters).toHaveLength(2);
      expect(template.parameters?.[0].name).toBe('title');
      expect(template.parameters?.[0].type).toBe('string');
      expect(template.parameters?.[1].defaultValue).toBe(300);
    });

    it('should support template with default style', () => {
      const template: ContainerTemplate = {
        id: 'highlighted-section',
        containerStyle: {
          backgroundColor: '#fff3cd',
          borderColor: '#ffc107',
          borderWidth: 2,
          padding: 20,
          shadow: true,
        },
      };

      expect(template.containerStyle?.backgroundColor).toBe('#fff3cd');
      expect(template.containerStyle?.borderWidth).toBe(2);
      expect(template.containerStyle?.shadow).toBe(true);
    });

    it('should support template with placeholder children', () => {
      const template: ContainerTemplate = {
        id: 'trio-layout',
        label: 'Three Column Layout',
        children: ['left-node', 'center-node', 'right-node'],
      };

      expect(template.children).toHaveLength(3);
      expect(template.children).toEqual(['left-node', 'center-node', 'right-node']);
    });

    it('should support all parameter types', () => {
      const params: TemplateParameter[] = [
        { name: 'label', type: 'string', defaultValue: 'Default' },
        { name: 'width', type: 'number', defaultValue: 200 },
        { name: 'visible', type: 'boolean', defaultValue: true },
        { name: 'color', type: 'color', defaultValue: '#3498db' },
      ];

      expect(params[0].type).toBe('string');
      expect(params[1].type).toBe('number');
      expect(params[2].type).toBe('boolean');
      expect(params[3].type).toBe('color');
    });

    it('should support parameter without default value', () => {
      const param: TemplateParameter = {
        name: 'requiredField',
        type: 'string',
        description: 'This field is required',
      };

      expect(param.defaultValue).toBeUndefined();
      expect(param.description).toBe('This field is required');
    });

    it('should support complex template with all features', () => {
      const template: ContainerTemplate = {
        id: 'dashboard-widget',
        label: 'Dashboard Widget',
        description: 'Reusable dashboard component',
        parameters: [
          { name: 'title', type: 'string', defaultValue: 'Widget' },
          { name: 'height', type: 'number', defaultValue: 250 },
          { name: 'collapsible', type: 'boolean', defaultValue: true },
        ],
        containerStyle: {
          backgroundColor: '#ffffff',
          borderColor: '#dee2e6',
          borderWidth: 1,
          borderStyle: 'solid',
          padding: 15,
          shadow: true,
        },
        children: ['widget-header', 'widget-content'],
      };

      expect(template.id).toBe('dashboard-widget');
      expect(template.parameters).toHaveLength(3);
      expect(template.containerStyle?.padding).toBe(15);
      expect(template.children).toHaveLength(2);
    });

    it('should support templates in diagram AST', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
        templates: [
          {
            id: 'card',
            label: 'Card Template',
            containerStyle: { padding: 20 },
          },
          {
            id: 'panel',
            label: 'Panel Template',
            containerStyle: { padding: 10 },
          },
        ],
      };

      expect(diagram.templates).toHaveLength(2);
      expect(diagram.templates?.[0].id).toBe('card');
      expect(diagram.templates?.[1].id).toBe('panel');
    });
  });

  describe('Container Template Usage', () => {
    it('should reference template by ID', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'services',
        label: 'Services',
        children: [],
        containerStyle: {
          templateId: 'service-template',
        },
      };

      expect(container.containerStyle?.templateId).toBe('service-template');
    });

    it('should apply template and override styles', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'custom-service',
        label: 'Custom Service',
        children: [],
        containerStyle: {
          templateId: 'service-template',
          backgroundColor: '#custom-color', // Override template default
          padding: 25, // Override template default
        },
      };

      expect(container.containerStyle?.templateId).toBe('service-template');
      expect(container.containerStyle?.backgroundColor).toBe('#custom-color');
      expect(container.containerStyle?.padding).toBe(25);
    });

    it('should support template inheritance with extends', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'derived',
        label: 'Derived Container',
        children: [],
        containerStyle: {
          extends: 'base-container',
        },
      };

      expect(container.containerStyle?.extends).toBe('base-container');
    });

    it('should combine templateId and extends', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'advanced',
        label: 'Advanced Container',
        children: [],
        containerStyle: {
          templateId: 'card-template',
          extends: 'section-base',
        },
      };

      expect(container.containerStyle?.templateId).toBe('card-template');
      expect(container.containerStyle?.extends).toBe('section-base');
    });

    it('should support multiple containers using same template', () => {
      const containers: ContainerDeclaration[] = [
        {
          type: 'container',
          id: 'service1',
          label: 'User Service',
          children: [],
          containerStyle: { templateId: 'microservice' },
        },
        {
          type: 'container',
          id: 'service2',
          label: 'Order Service',
          children: [],
          containerStyle: { templateId: 'microservice' },
        },
        {
          type: 'container',
          id: 'service3',
          label: 'Payment Service',
          children: [],
          containerStyle: { templateId: 'microservice' },
        },
      ];

      expect(containers).toHaveLength(3);
      expect(containers.every((c) => c.containerStyle?.templateId === 'microservice')).toBe(true);
    });

    it('should support nested containers with different templates', () => {
      const parent: ContainerDeclaration = {
        type: 'container',
        id: 'system',
        label: 'System',
        children: [],
        containerStyle: { templateId: 'system-boundary' },
        containers: [
          {
            type: 'container',
            id: 'subsystem',
            label: 'Subsystem',
            children: [],
            containerStyle: { templateId: 'subsystem-panel' },
          },
        ],
      };

      expect(parent.containerStyle?.templateId).toBe('system-boundary');
      expect(parent.containers?.[0].containerStyle?.templateId).toBe('subsystem-panel');
    });

    it('should support template with all Phase 1-4 styles', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'full-featured',
        label: 'Full Featured',
        children: [],
        collapsible: true, // Phase 2 - on ContainerDeclaration
        collapsed: false, // Phase 2 - on ContainerDeclaration
        containerStyle: {
          templateId: 'premium-widget',
          // Phase 1
          backgroundColor: '#f8f9fa',
          borderColor: '#dee2e6',
          borderWidth: 2,
          padding: 20,
          // Phase 3
          minWidth: 300,
          autoResize: 'fit-content',
          alignContent: 'center',
          // Phase 4
          collapseButtonVisible: true,
          resizable: true,
          hoverHighlight: true,
        },
      };

      expect(container.containerStyle?.templateId).toBe('premium-widget');
      expect(container.collapsible).toBe(true);
      expect(container.containerStyle?.minWidth).toBe(300);
      expect(container.containerStyle?.resizable).toBe(true);
    });
  });

  describe('Style Presets', () => {
    it('should support basic preset definition', () => {
      const preset: ContainerPreset = {
        id: 'card',
        label: 'Card Style',
        style: {
          backgroundColor: '#ffffff',
          borderColor: '#dee2e6',
          borderWidth: 1,
          padding: 15,
          shadow: true,
        },
      };

      expect(preset.id).toBe('card');
      expect(preset.label).toBe('Card Style');
      expect(preset.style.padding).toBe(15);
    });

    it('should support preset with partial style', () => {
      const preset: ContainerPreset = {
        id: 'highlighted',
        style: {
          backgroundColor: '#fff3cd',
          borderColor: '#ffc107',
        },
      };

      expect(preset.style.backgroundColor).toBe('#fff3cd');
      expect(preset.style.padding).toBeUndefined();
    });

    it('should apply preset to container', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'info-box',
        label: 'Info Box',
        children: [],
        containerStyle: {
          preset: 'card',
        },
      };

      expect(container.containerStyle?.preset).toBe('card');
    });

    it('should support preset with override', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'custom-card',
        label: 'Custom Card',
        children: [],
        containerStyle: {
          preset: 'card',
          backgroundColor: '#e3f2fd', // Override preset
        },
      };

      expect(container.containerStyle?.preset).toBe('card');
      expect(container.containerStyle?.backgroundColor).toBe('#e3f2fd');
    });

    it('should support multiple preset definitions', () => {
      const presets: ContainerPreset[] = [
        {
          id: 'card',
          label: 'Card',
          style: { padding: 15, shadow: true },
        },
        {
          id: 'panel',
          label: 'Panel',
          style: { padding: 20, borderWidth: 2 },
        },
        {
          id: 'group',
          label: 'Group',
          style: { padding: 10, borderStyle: 'dashed' },
        },
      ];

      expect(presets).toHaveLength(3);
      expect(presets[0].id).toBe('card');
      expect(presets[1].id).toBe('panel');
      expect(presets[2].id).toBe('group');
    });

    it('should support presets in diagram AST', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
        presets: [
          { id: 'card', style: { padding: 15 } },
          { id: 'panel', style: { padding: 20 } },
        ],
      };

      expect(diagram.presets).toHaveLength(2);
      expect(diagram.presets?.[0].id).toBe('card');
    });

    it('should support preset combining multiple phases', () => {
      const preset: ContainerPreset = {
        id: 'interactive-widget',
        label: 'Interactive Widget',
        style: {
          // Phase 1
          backgroundColor: '#f8f9fa',
          padding: 20,
          shadow: true,
          // Phase 3
          autoResize: 'fit-content',
          alignContent: 'center',
          // Phase 4
          collapseButtonVisible: true,
          hoverHighlight: true,
        },
      };

      expect(preset.style.backgroundColor).toBe('#f8f9fa');
      expect(preset.style.autoResize).toBe('fit-content');
      expect(preset.style.hoverHighlight).toBe(true);
    });
  });

  describe('Template Inheritance', () => {
    it('should support extends property', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'derived',
        label: 'Derived',
        children: [],
        containerStyle: {
          extends: 'base-style',
        },
      };

      expect(container.containerStyle?.extends).toBe('base-style');
    });

    it('should combine extends with custom styles', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'custom',
        label: 'Custom',
        children: [],
        containerStyle: {
          extends: 'base-style',
          backgroundColor: '#custom', // Override
          padding: 30, // Override
        },
      };

      expect(container.containerStyle?.extends).toBe('base-style');
      expect(container.containerStyle?.backgroundColor).toBe('#custom');
    });

    it('should support extends referencing another container', () => {
      const baseContainer: ContainerDeclaration = {
        type: 'container',
        id: 'base',
        label: 'Base Container',
        children: [],
        containerStyle: {
          backgroundColor: '#f0f0f0',
          padding: 20,
        },
      };

      const derivedContainer: ContainerDeclaration = {
        type: 'container',
        id: 'derived',
        label: 'Derived Container',
        children: [],
        containerStyle: {
          extends: 'base',
          borderColor: '#3498db', // Add new property
        },
      };

      expect(baseContainer.containerStyle?.backgroundColor).toBe('#f0f0f0');
      expect(derivedContainer.containerStyle?.extends).toBe('base');
      expect(derivedContainer.containerStyle?.borderColor).toBe('#3498db');
    });

    it('should support extends referencing a template', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'enhanced',
        label: 'Enhanced',
        children: [],
        containerStyle: {
          extends: 'card-template',
          shadow: false, // Override template
        },
      };

      expect(container.containerStyle?.extends).toBe('card-template');
      expect(container.containerStyle?.shadow).toBe(false);
    });

    it('should combine preset and extends', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'hybrid',
        label: 'Hybrid',
        children: [],
        containerStyle: {
          preset: 'card',
          extends: 'section-base',
        },
      };

      expect(container.containerStyle?.preset).toBe('card');
      expect(container.containerStyle?.extends).toBe('section-base');
    });

    it('should combine templateId, preset, and extends', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'mega',
        label: 'Mega Container',
        children: [],
        containerStyle: {
          templateId: 'dashboard-widget',
          preset: 'card',
          extends: 'base-section',
          padding: 25, // Final override
        },
      };

      expect(container.containerStyle?.templateId).toBe('dashboard-widget');
      expect(container.containerStyle?.preset).toBe('card');
      expect(container.containerStyle?.extends).toBe('base-section');
      expect(container.containerStyle?.padding).toBe(25);
    });
  });

  describe('Validation & Edge Cases', () => {
    it('should handle container without any Phase 5 properties', () => {
      const container: ContainerDeclaration = {
        type: 'container',
        id: 'simple',
        label: 'Simple',
        children: [],
        containerStyle: {
          padding: 20,
        },
      };

      expect(container.containerStyle?.templateId).toBeUndefined();
      expect(container.containerStyle?.preset).toBeUndefined();
      expect(container.containerStyle?.extends).toBeUndefined();
    });

    it('should handle empty template', () => {
      const template: ContainerTemplate = {
        id: 'minimal',
      };

      expect(template.id).toBe('minimal');
      expect(template.label).toBeUndefined();
      expect(template.parameters).toBeUndefined();
    });

    it('should handle empty preset', () => {
      const preset: ContainerPreset = {
        id: 'empty',
        style: {},
      };

      expect(preset.id).toBe('empty');
      expect(Object.keys(preset.style)).toHaveLength(0);
    });

    it('should handle diagram with templates and presets', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [],
        edges: [],
        templates: [{ id: 'template1' }],
        presets: [{ id: 'preset1', style: {} }],
        containers: [
          {
            type: 'container',
            id: 'c1',
            label: 'Container 1',
            children: [],
            containerStyle: {
              templateId: 'template1',
              preset: 'preset1',
            },
          },
        ],
      };

      expect(diagram.templates).toHaveLength(1);
      expect(diagram.presets).toHaveLength(1);
      expect(diagram.containers?.[0].containerStyle?.templateId).toBe('template1');
      expect(diagram.containers?.[0].containerStyle?.preset).toBe('preset1');
    });

    it('should support template parameter with all types', () => {
      const params: TemplateParameter[] = [
        { name: 'name', type: 'string' },
        { name: 'size', type: 'number' },
        { name: 'enabled', type: 'boolean' },
        { name: 'tint', type: 'color' },
      ];

      params.forEach((param) => {
        expect(param.name).toBeDefined();
        expect(['string', 'number', 'boolean', 'color']).toContain(param.type);
      });
    });

    it('should handle complex inheritance chain', () => {
      const containers: ContainerDeclaration[] = [
        {
          type: 'container',
          id: 'level1',
          label: 'Level 1',
          children: [],
          containerStyle: { padding: 10 },
        },
        {
          type: 'container',
          id: 'level2',
          label: 'Level 2',
          children: [],
          containerStyle: { extends: 'level1', padding: 15 },
        },
        {
          type: 'container',
          id: 'level3',
          label: 'Level 3',
          children: [],
          containerStyle: { extends: 'level2', padding: 20 },
        },
      ];

      expect(containers[0].containerStyle?.extends).toBeUndefined();
      expect(containers[1].containerStyle?.extends).toBe('level1');
      expect(containers[2].containerStyle?.extends).toBe('level2');
    });
  });

  describe('Complete Phase 5 Example', () => {
    it('should support comprehensive diagram with templates, presets, and inheritance', () => {
      const diagram: DiagramAst = {
        astVersion: '1.0',
        nodes: [
          { id: 'n1', shape: 'rect', label: 'Service 1' },
          { id: 'n2', shape: 'rect', label: 'Service 2' },
          { id: 'n3', shape: 'rect', label: 'Database' },
        ],
        edges: [
          { from: 'n1', to: 'n3' },
          { from: 'n2', to: 'n3' },
        ],
        templates: [
          {
            id: 'microservice',
            label: 'Microservice Container',
            description: 'Standard microservice layout',
            parameters: [
              { name: 'serviceName', type: 'string' },
              { name: 'replicas', type: 'number', defaultValue: 3 },
            ],
            containerStyle: {
              backgroundColor: '#e3f2fd',
              borderColor: '#2196f3',
              borderWidth: 2,
              padding: 20,
              collapseButtonVisible: true,
            },
          },
          {
            id: 'database',
            label: 'Database Container',
            containerStyle: {
              backgroundColor: '#fff3e0',
              borderColor: '#ff9800',
              borderWidth: 2,
              padding: 15,
            },
          },
        ],
        presets: [
          {
            id: 'card',
            label: 'Card Preset',
            style: {
              padding: 15,
              shadow: true,
              borderWidth: 1,
            },
          },
          {
            id: 'highlighted',
            label: 'Highlighted Section',
            style: {
              backgroundColor: '#fff3cd',
              borderColor: '#ffc107',
              borderWidth: 2,
            },
          },
        ],
        containers: [
          {
            type: 'container',
            id: 'services',
            label: 'Services',
            children: ['n1', 'n2'],
            containerStyle: {
              templateId: 'microservice',
              preset: 'card',
              padding: 25, // Override
            },
          },
          {
            type: 'container',
            id: 'data',
            label: 'Data Layer',
            children: ['n3'],
            containerStyle: {
              templateId: 'database',
              extends: 'services',
              preset: 'highlighted',
            },
          },
        ],
      };

      // Verify templates
      expect(diagram.templates).toHaveLength(2);
      expect(diagram.templates?.[0].id).toBe('microservice');
      expect(diagram.templates?.[0].parameters).toHaveLength(2);
      expect(diagram.templates?.[1].containerStyle?.backgroundColor).toBe('#fff3e0');

      // Verify presets
      expect(diagram.presets).toHaveLength(2);
      expect(diagram.presets?.[0].style.shadow).toBe(true);

      // Verify containers using templates and presets
      expect(diagram.containers?.[0].containerStyle?.templateId).toBe('microservice');
      expect(diagram.containers?.[0].containerStyle?.preset).toBe('card');
      expect(diagram.containers?.[1].containerStyle?.extends).toBe('services');
      expect(diagram.containers?.[1].containerStyle?.preset).toBe('highlighted');

      // Verify structure
      expect(diagram.nodes).toHaveLength(3);
      expect(diagram.edges).toHaveLength(2);
      expect(diagram.containers).toHaveLength(2);
    });
  });
});
