import type { SampleCategory } from '../sample-data';

export const templatePresetSampleDiagrams: SampleCategory[] = [
	{
		id: 'templatesPresets',
		label: 'Templates & Presets (Phase 5)',
		samples: [
			{
				name: 'Basic Template',
				description: 'Reusable container template with templateId',
				code: `diagram "Basic Template Example" {
  template "service-template" {
    label: "Microservice Template"
    backgroundColor: "#e8f5e9"
    borderColor: "#4caf50"
    borderWidth: 2
    padding: 15
    resizable: true
  }

  container "Auth Service" templateId: "service-template" {
    shape auth as @server label: "Authentication"
  }

  container "Payment Service" templateId: "service-template" {
    shape payment as @server label: "Payment Gateway"
  }

  auth -> payment
}`
			},
			{
				name: 'Style Preset',
				description: 'Named style preset for consistent styling',
				code: `diagram "Style Preset Example" {
  preset "card" {
    label: "Card Style"
    backgroundColor: "#e3f2fd"
    borderColor: "#2196f3"
    padding: 20
    shadow: true
  }

  container "Frontend" preset: "card" {
    shape ui as @rectangle label: "UI Components"
  }

  container "Backend" preset: "card" {
    shape api as @server label: "REST API"
  }

  ui -> api
}`
			},
			{
				name: 'Combined: Template + Preset',
				description: 'Using both templates and presets together',
				code: `diagram "Combined Example" {
  template "microservice" {
    backgroundColor: "#e8f5e9"
    borderWidth: 2
    padding: 15
  }

  preset "highlighted" {
    borderColor: "#ff9800"
    shadow: true
  }

  container "API Gateway" templateId: "microservice" preset: "highlighted" {
    shape gateway as @hexagon label: "Gateway"
  }

  container "Auth Service" templateId: "microservice" {
    shape auth as @server label: "Auth"
  }

  container "Database" preset: "highlighted" {
    shape db as @cylinder label: "DB"
  }

  gateway -> auth
  gateway -> db
}`
			},
			{
				name: 'Container Inheritance',
				description: 'Inherit styles from parent containers using extends',
				code: `diagram "Container Inheritance" {
  container "Base Container" backgroundColor: "#f0f0f0" padding: 20 {
    shape base as @rectangle label: "Base Component"
  }

  container "Extended Container" extends: "Base Container" borderColor: "#2196f3" {
    shape extended as @rectangle label: "Extended Component"
  }

  base -> extended
}`
			}
		]
	}
];
