import type { ShapeCategory } from '../toolbox-data';

export const containerTemplateShapeIcons: ShapeCategory[] = [
	{
		id: 'containers',
		label: 'Containers & Templates',
		shapes: [
			{
				id: 'basic-container',
				label: 'Basic Container',
				code: `container "Container Name" {
  shape node1 as @rectangle label: "Node 1"
  shape node2 as @rectangle label: "Node 2"
}`
			},
			{
				id: 'styled-container',
				label: 'Styled Container',
				code: `container "Styled" backgroundColor: "#e3f2fd" borderColor: "#2196f3" padding: 20 shadow: true {
  shape node as @rectangle label: "Content"
}`
			},
			{
				id: 'template-definition',
				label: 'Template Definition',
				code: `template "my-template" {
  label: "My Template"
  backgroundColor: "#e3f2fd"
  borderColor: "#2196f3"
  borderWidth: 2
  padding: 20
  shadow: true
}`
			},
			{
				id: 'template-usage',
				label: 'Use Template',
				code: `container "Service" templateId: "my-template" {
  shape api as @rectangle label: "API"
}`
			},
			{
				id: 'preset-definition',
				label: 'Preset Definition',
				code: `preset "card" {
  label: "Card Style"
  padding: 15
  shadow: true
  borderWidth: 1
}`
			},
			{
				id: 'preset-usage',
				label: 'Use Preset',
				code: `container "Panel" preset: "card" {
  shape content as @rectangle label: "Content"
}`
			},
			{
				id: 'template-with-params',
				label: 'Template with Parameters',
				code: `template "widget" {
  parameters: [
    "title": string = "Widget",
    "width": number = 300,
    "enabled": boolean = true
  ]
  backgroundColor: "#ffffff"
  padding: 15
}`
			},
			{
				id: 'container-inheritance',
				label: 'Container Inheritance',
				code: `container "Extended" extends: "BaseContainer" {
  borderColor: "#2196f3"
  shape child as @rectangle label: "Child"
}`
			},
			{
				id: 'combined-template-preset',
				label: 'Template + Preset',
				code: `container "Service" templateId: "microservice" preset: "card" {
  shape api as @server label: "API"
}`
			},
			{
				id: 'collapsible-container',
				label: 'Collapsible Container',
				code: `container "Section" collapseButtonVisible: true collapsed: false {
  shape item1 as @rectangle label: "Item 1"
  shape item2 as @rectangle label: "Item 2"
}`
			},
			{
				id: 'nested-containers',
				label: 'Nested Containers',
				code: `container "Outer" {
  container "Inner" {
    shape node as @rectangle label: "Nested"
  }
}`
			},
			{
				id: 'themed-presets',
				label: 'Themed Presets',
				code: `preset "primary" {
  backgroundColor: "#e3f2fd"
  borderColor: "#2196f3"
}

preset "success" {
  backgroundColor: "#e8f5e9"
  borderColor: "#4caf50"
}

preset "warning" {
  backgroundColor: "#fff3e0"
  borderColor: "#ff9800"
}`
			}
		]
	}
];
