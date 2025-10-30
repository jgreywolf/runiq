/**
 * Parser tests for Phase 5: Container Templates & Presets
 * Tests DSL parsing for template definitions, preset definitions,
 * and their usage in containers.
 */

import { describe, it, expect } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Phase 5: Container Templates & Presets', () => {
  describe('Template Definitions', () => {
    it('should parse basic template definition', () => {
      const dsl = `diagram "test"
        template "card-template" {
          label: "Card Template"
          backgroundColor: "#ffffff"
          padding: 15
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const templates = result.diagram?.templates;
      expect(templates).toHaveLength(1);
      expect(templates?.[0].id).toBe('card-template');
      expect(templates?.[0].label).toBe('Card Template');
    });

    it('should parse template with description', () => {
      const dsl = `diagram "test"
        template "widget" {
          label: "Dashboard Widget"
          description: "A reusable dashboard component"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const template = result.diagram?.templates?.[0];
      expect(template?.description).toBe('A reusable dashboard component');
    });

    it('should parse template with string parameter', () => {
      const dsl = `diagram "test"
        template "configurable" {
          parameters: ["title": string = "Default Title"]
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const template = result.diagram?.templates?.[0];
      expect(template?.parameters).toHaveLength(1);
      expect(template?.parameters?.[0].name).toBe('title');
      expect(template?.parameters?.[0].type).toBe('string');
      expect(template?.parameters?.[0].defaultValue).toBe('Default Title');
    });

    it('should parse template with number parameter', () => {
      const dsl = `diagram "test"
        template "sized" {
          parameters: ["width": number = 300]
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const param = result.diagram?.templates?.[0].parameters?.[0];
      expect(param?.type).toBe('number');
      expect(param?.defaultValue).toBe(300);
    });

    it('should parse template with boolean parameter', () => {
      const dsl = `diagram "test"
        template "toggleable" {
          parameters: ["visible": boolean = true]
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const param = result.diagram?.templates?.[0].parameters?.[0];
      expect(param?.type).toBe('boolean');
      expect(param?.defaultValue).toBe(true);
    });

    it('should parse template with multiple parameters', () => {
      const dsl = `diagram "test"
        template "advanced" {
          parameters: [
            "title": string = "Widget",
            "width": number = 400,
            "enabled": boolean = true
          ]
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const params = result.diagram?.templates?.[0].parameters;
      expect(params).toHaveLength(3);
      expect(params?.[0].name).toBe('title');
      expect(params?.[1].name).toBe('width');
      expect(params?.[2].name).toBe('enabled');
    });

    it('should parse template with children placeholders', () => {
      const dsl = `diagram "test"
        template "three-col" {
          children: ["left", "center", "right"]
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const children = result.diagram?.templates?.[0].children;
      expect(children).toHaveLength(3);
      expect(children).toEqual(['left', 'center', 'right']);
    });

    it('should parse template with style properties', () => {
      const dsl = `diagram "test"
        template "styled" {
          backgroundColor: "#e3f2fd"
          borderColor: "#2196f3"
          borderWidth: 2
          padding: 20
          shadow: true
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const style = result.diagram?.templates?.[0].containerStyle;
      expect(style?.backgroundColor).toBe('#e3f2fd');
      expect(style?.borderColor).toBe('#2196f3');
      expect(style?.borderWidth).toBe(2);
      expect(style?.padding).toBe(20);
      expect(style?.shadow).toBe(true);
    });

    it('should parse complete template with all features', () => {
      const dsl = `diagram "test"
        template "full-featured" {
          label: "Complete Template"
          description: "Has all features"
          parameters: ["title": string = "Title"]
          children: ["node1", "node2"]
          backgroundColor: "#ffffff"
          padding: 15
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const template = result.diagram?.templates?.[0];
      expect(template?.id).toBe('full-featured');
      expect(template?.label).toBe('Complete Template');
      expect(template?.description).toBe('Has all features');
      expect(template?.parameters).toHaveLength(1);
      expect(template?.children).toHaveLength(2);
      expect(template?.containerStyle?.backgroundColor).toBe('#ffffff');
    });
  });

  describe('Container Template Usage', () => {
    it('should parse container with templateId', () => {
      const dsl = `diagram "test"
        container "Services" templateId: "microservice-template" {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.templateId).toBe('microservice-template');
    });

    it('should parse container with extends', () => {
      const dsl = `diagram "test"
        container "Derived" extends: "base-container" {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.extends).toBe('base-container');
    });

    it('should parse container with templateId and extends', () => {
      const dsl = `diagram "test"
        container "Advanced" templateId: "card" extends: "section" {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.templateId).toBe('card');
      expect(container?.containerStyle?.extends).toBe('section');
    });

    it('should parse template and container using it', () => {
      const dsl = `diagram "test"
        template "service" {
          backgroundColor: "#e3f2fd"
          padding: 20
        }
        container "API" templateId: "service" {
          shape node1 as @rect label: "Endpoint"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.templates).toHaveLength(1);
      expect(result.diagram?.containers).toHaveLength(1);
      expect(result.diagram?.containers?.[0].containerStyle?.templateId).toBe('service');
    });

    it('should parse container with template and style overrides', () => {
      const dsl = `diagram "test"
        container "Custom" templateId: "card" backgroundColor: "#custom" padding: 30 {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.templateId).toBe('card');
      expect(container?.containerStyle?.backgroundColor).toBe('#custom');
      expect(container?.containerStyle?.padding).toBe(30);
    });

    it('should parse multiple containers using same template', () => {
      const dsl = `diagram "test"
        template "service" {
          backgroundColor: "#f0f0f0"
        }
        container "Service1" templateId: "service" {
          shape n1 as @rect label: "S1"
        }
        container "Service2" templateId: "service" {
          shape n2 as @rect label: "S2"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.templates).toHaveLength(1);
      expect(result.diagram?.containers).toHaveLength(2);
      expect(result.diagram?.containers?.[0].containerStyle?.templateId).toBe('service');
      expect(result.diagram?.containers?.[1].containerStyle?.templateId).toBe('service');
    });
  });

  describe('Preset Definitions', () => {
    it('should parse basic preset', () => {
      const dsl = `diagram "test"
        preset "card" {
          padding: 15
          shadow: true
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const presets = result.diagram?.presets;
      expect(presets).toHaveLength(1);
      expect(presets?.[0].id).toBe('card');
    });

    it('should parse preset with label', () => {
      const dsl = `diagram "test"
        preset "highlighted" {
          label: "Highlighted Section"
          backgroundColor: "#fff3cd"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const preset = result.diagram?.presets?.[0];
      expect(preset?.label).toBe('Highlighted Section');
      expect(preset?.style.backgroundColor).toBe('#fff3cd');
    });

    it('should parse preset with multiple style properties', () => {
      const dsl = `diagram "test"
        preset "panel" {
          backgroundColor: "#f8f9fa"
          borderColor: "#dee2e6"
          borderWidth: 1
          padding: 20
          shadow: true
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const style = result.diagram?.presets?.[0].style;
      expect(style?.backgroundColor).toBe('#f8f9fa');
      expect(style?.borderColor).toBe('#dee2e6');
      expect(style?.borderWidth).toBe(1);
      expect(style?.padding).toBe(20);
      expect(style?.shadow).toBe(true);
    });

    it('should parse multiple presets', () => {
      const dsl = `diagram "test"
        preset "card" {
          padding: 15
        }
        preset "panel" {
          padding: 20
        }
        preset "group" {
          padding: 10
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.presets).toHaveLength(3);
      expect(result.diagram?.presets?.[0].id).toBe('card');
      expect(result.diagram?.presets?.[1].id).toBe('panel');
      expect(result.diagram?.presets?.[2].id).toBe('group');
    });
  });

  describe('Container Preset Usage', () => {
    it('should parse container with preset', () => {
      const dsl = `diagram "test"
        container "Info" preset: "card" {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.preset).toBe('card');
    });

    it('should parse container with preset and overrides', () => {
      const dsl = `diagram "test"
        container "Custom" preset: "card" backgroundColor: "#e3f2fd" {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.preset).toBe('card');
      expect(container?.containerStyle?.backgroundColor).toBe('#e3f2fd');
    });

    it('should parse preset definition and usage together', () => {
      const dsl = `diagram "test"
        preset "highlighted" {
          backgroundColor: "#fff3cd"
          borderColor: "#ffc107"
        }
        container "Important" preset: "highlighted" {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      expect(result.diagram?.presets).toHaveLength(1);
      expect(result.diagram?.containers).toHaveLength(1);
      expect(result.diagram?.containers?.[0].containerStyle?.preset).toBe('highlighted');
    });

    it('should parse container with both template and preset', () => {
      const dsl = `diagram "test"
        container "Hybrid" templateId: "widget" preset: "card" {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.templateId).toBe('widget');
      expect(container?.containerStyle?.preset).toBe('card');
    });
  });

  describe('Inheritance & Combinations', () => {
    it('should parse container with preset and extends', () => {
      const dsl = `diagram "test"
        container "Derived" preset: "card" extends: "base" {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const container = result.diagram?.containers?.[0];
      expect(container?.containerStyle?.preset).toBe('card');
      expect(container?.containerStyle?.extends).toBe('base');
    });

    it('should parse container with templateId, preset, and extends', () => {
      const dsl = `diagram "test"
        container "Mega" templateId: "widget" preset: "card" extends: "section" {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const style = result.diagram?.containers?.[0].containerStyle;
      expect(style?.templateId).toBe('widget');
      expect(style?.preset).toBe('card');
      expect(style?.extends).toBe('section');
    });

    it('should parse container with all Phase 5 features and overrides', () => {
      const dsl = `diagram "test"
        container "Complete" templateId: "widget" preset: "card" extends: "base" backgroundColor: "#custom" padding: 25 {
          shape node1 as @rect label: "Node"
        }`;
      const result = parse(dsl);
      expect(result.success).toBe(true);
      const style = result.diagram?.containers?.[0].containerStyle;
      expect(style?.templateId).toBe('widget');
      expect(style?.preset).toBe('card');
      expect(style?.extends).toBe('base');
      expect(style?.backgroundColor).toBe('#custom');
      expect(style?.padding).toBe(25);
    });
  });

  describe('Complete Phase 5 Example', () => {
    it('should parse diagram with templates, presets, and containers', () => {
      const dsl = `diagram "Architecture"
        template "microservice" {
          backgroundColor: "#e3f2fd"
          padding: 20
        }
        
        preset "card" {
          padding: 15
          shadow: true
        }
        
        container "Services" templateId: "microservice" preset: "card" {
          shape api as @rect label: "API"
        }`;
      
      const result = parse(dsl);
      expect(result.success).toBe(true);
      
      // Verify templates
      expect(result.diagram?.templates).toHaveLength(1);
      expect(result.diagram?.templates?.[0].id).toBe('microservice');
      
      // Verify presets
      expect(result.diagram?.presets).toHaveLength(1);
      expect(result.diagram?.presets?.[0].id).toBe('card');
      
      // Verify containers
      expect(result.diagram?.containers).toHaveLength(1);
      expect(result.diagram?.containers?.[0].containerStyle?.templateId).toBe('microservice');
      expect(result.diagram?.containers?.[0].containerStyle?.preset).toBe('card');
      
      // Verify nodes
      expect(result.diagram?.nodes).toHaveLength(1);
    });
  });
});
