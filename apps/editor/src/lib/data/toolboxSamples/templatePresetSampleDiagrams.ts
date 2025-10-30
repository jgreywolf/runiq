import type { SampleCategory } from '../sample-data';

export const templatePresetSampleDiagrams: SampleCategory[] = [
	{
		id: 'templates-presets',
		label: 'Templates & Presets (Phase 5)',
		samples: [
			{
				name: 'Basic Template',
				description: 'Define and use a container template',
				code: `template "service-template" {
  label: "Service Template"
  backgroundColor: "#e3f2fd"
  borderColor: "#2196f3"
  borderWidth: 2
  padding: 20
  shadow: true
}

container "My Service" templateId: "service-template" {
  shape api as @rectangle label: "API"
}`
			},
			{
				name: 'Style Preset',
				description: 'Create and apply a style preset',
				code: `preset "card" {
  label: "Card Style"
  padding: 15
  shadow: true
  borderWidth: 1
}

container "Card Container" preset: "card" {
  shape node as @rectangle label: "Content"
}`
			},
			{
				name: 'Template with Parameters',
				description: 'Template with typed parameters',
				code: `template "dashboard-widget" {
  label: "Dashboard Widget"
  parameters: [
    "title": string = "Widget",
    "width": number = 300,
    "collapsible": boolean = true,
    "color": color = "#2196f3"
  ]
  backgroundColor: "#ffffff"
  borderWidth: 1
  padding: 15
  shadow: true
  collapseButtonVisible: true
}`
			},
			{
				name: 'Container Inheritance',
				description: 'Container extending another container',
				code: `container "Base Container" {
  backgroundColor: "#f0f0f0"
  padding: 20
  shape base as @rectangle label: "Base"
}

container "Extended Container" extends: "Base Container" {
  borderColor: "#2196f3"
  borderWidth: 2
  shape child as @rectangle label: "Child"
}

base -> child`
			},
			{
				name: 'Combined: Template + Preset',
				description: 'Using both template and preset together',
				code: `template "microservice" {
  label: "Microservice"
  backgroundColor: "#e3f2fd"
  padding: 20
}

preset "highlighted" {
  label: "Highlighted"
  borderColor: "#ffc107"
  borderWidth: 2
  shadow: true
}

container "API Service" templateId: "microservice" preset: "highlighted" {
  shape api as @server label: "API Gateway"
  shape cache as @cylinder label: "Cache"
}`
			},
			{
				name: 'Complete Example',
				description: 'Full template, preset, and inheritance example',
				code: `diagram "Microservices"

template "microservice" {
  label: "Microservice Template"
  backgroundColor: "#e3f2fd"
  borderColor: "#2196f3"
  borderWidth: 2
  padding: 20
  collapseButtonVisible: true
}

preset "card" {
  label: "Card Style"
  padding: 15
  shadow: true
}

preset "highlighted" {
  label: "Highlighted"
  backgroundColor: "#fff3cd"
  borderColor: "#ffc107"
}

container "User Service" templateId: "microservice" preset: "card" {
  shape api1 as @rectangle label: "User API"
  shape db1 as @cylinder label: "User DB"
}

container "Order Service" templateId: "microservice" preset: "card" {
  shape api2 as @rectangle label: "Order API"
  shape db2 as @cylinder label: "Order DB"
}

container "Analytics" extends: "User Service" preset: "highlighted" {
  shape analytics as @rectangle label: "Analytics Engine"
}

api1 -> db1
api2 -> db2
api1 -> analytics
api2 -> analytics`
			},
			{
				name: 'Multiple Presets',
				description: 'Define multiple style presets',
				code: `preset "primary" {
  backgroundColor: "#e3f2fd"
  borderColor: "#2196f3"
  borderWidth: 2
}

preset "success" {
  backgroundColor: "#e8f5e9"
  borderColor: "#4caf50"
  borderWidth: 2
}

preset "warning" {
  backgroundColor: "#fff3e0"
  borderColor: "#ff9800"
  borderWidth: 2
}

container "Status: OK" preset: "success" {
  shape ok as @circle label: "✓ Ready"
}

container "Status: Warning" preset: "warning" {
  shape warn as @rhombus label: "⚠ Check Required"
}`
			},
			{
				name: 'Template Override',
				description: 'Override template properties inline',
				code: `template "service" {
  backgroundColor: "#f0f0f0"
  padding: 20
  borderWidth: 1
}

container "Custom Service" 
  templateId: "service" 
  backgroundColor: "#e3f2fd"
  padding: 30 {
  shape api as @rectangle label: "Custom API"
}`
			}
		]
	}
];
