import type { SampleCategory } from '../sample-data';

export const wardleySampleDiagrams: SampleCategory[] = [
	{
		id: 'wardleyTemplates',
		label: 'Wardley Templates',
		samples: [
			{
				name: 'Basic Wardley Map',
				description: 'Simple Wardley Map with anchor, components, and dependencies',
				code: `wardley "Basic Map"{

// Define user need at top of value chain
anchor "User Need" value:0.95

// Add components with evolution (0-1: genesis→custom→product→commodity)
// and value (0-1: invisible infrastructure→visible to user)
component "Visible Service" evolution:0.75 value:0.85
component "Platform" evolution:0.65 value:0.55
component "Commodity" evolution:0.95 value:0.25

// Connect components to show dependencies
dependency from:"Visible Service" to:"Platform"
dependency from:"Platform" to:"Commodity"
      }
`
			},
			{
				name: 'Tea Shop (Classic)',
				description: "Simon Wardley's classic tea shop example",
				code: `wardley "Tea Shop" {

// Customer need
anchor "Cup of Tea" value:0.9

// Visible components
component "Cup of Tea" evolution:0.8 value:0.9 label:"What customer sees"
component "Tea" evolution:0.9 value:0.8
component "Cup" evolution:1.0 value:0.7
component "Hot Water" evolution:0.95 value:0.6

// Infrastructure
component "Water" evolution:1.0 value:0.3
component "Kettle" evolution:0.9 value:0.4
component "Power" evolution:1.0 value:0.1

// Dependencies showing value chain
dependency from:"Cup of Tea" to:"Tea"
dependency from:"Cup of Tea" to:"Cup"
dependency from:"Cup of Tea" to:"Hot Water"
dependency from:"Hot Water" to:"Water"
dependency from:"Hot Water" to:"Kettle"
dependency from:"Kettle" to:"Power"
      }
`
			},
			{
				name: 'Technology Evolution',
				description: 'Modern web application stack with evolution indicators',
				code: `wardley "Web Application Stack" {

// User anchor
anchor "User Experience" value:0.95 evolution:0.7

// Frontend (visible)
component "Web Interface" evolution:0.75 value:0.9 label:"User-facing"
component "Mobile App" evolution:0.7 value:0.85 inertia:true

// Backend services
component "API Gateway" evolution:0.65 value:0.7
component "Business Logic" evolution:0.6 value:0.6
component "Data Store" evolution:0.8 value:0.5

// Infrastructure
component "Container Platform" evolution:0.7 value:0.35
component "Cloud Compute" evolution:0.9 value:0.2
component "Network" evolution:1.0 value:0.15

// Emerging technologies
component "Serverless" evolution:0.5 value:0.4 label:"Emerging"
component "Edge Computing" evolution:0.3 value:0.3

// Dependencies
dependency from:"Web Interface" to:"API Gateway"
dependency from:"Mobile App" to:"API Gateway"
dependency from:"API Gateway" to:"Business Logic"
dependency from:"Business Logic" to:"Data Store"
dependency from:"API Gateway" to:"Serverless"
dependency from:"Data Store" to:"Container Platform"
dependency from:"Container Platform" to:"Cloud Compute"
dependency from:"Cloud Compute" to:"Network"

// Evolution indicators
evolve "Mobile App" to evolution:0.85
evolve "Serverless" to evolution:0.75
evolve "Edge Computing" to evolution:0.6
      }
`
			},
			{
				name: 'Business Strategy',
				description: 'Strategic mapping for business transformation',
				code: `wardley "Digital Transformation Strategy" {

// Customer need
anchor "Customer Satisfaction" value:0.95

// Customer-facing
component "Customer Portal" evolution:0.6 value:0.9 label:"Differentiator"
component "Mobile Experience" evolution:0.5 value:0.85 inertia:true
component "Customer Data" evolution:0.7 value:0.75

// Core capabilities
component "CRM System" evolution:0.75 value:0.65
component "Analytics Platform" evolution:0.55 value:0.55 label:"Investment area"
component "Integration Layer" evolution:0.65 value:0.45

// Commodity services
component "Email Service" evolution:0.95 value:0.35
component "Cloud Storage" evolution:0.9 value:0.25
component "Compute Resources" evolution:1.0 value:0.15

// Legacy
component "Legacy Database" evolution:0.85 value:0.5 inertia:true label:"Tech debt"

dependency from:"Customer Portal" to:"CRM System"
dependency from:"Mobile Experience" to:"Customer Data"
dependency from:"Customer Data" to:"Analytics Platform"
dependency from:"CRM System" to:"Integration Layer"
dependency from:"CRM System" to:"Legacy Database"
dependency from:"Analytics Platform" to:"Cloud Storage"
dependency from:"Integration Layer" to:"Email Service"
dependency from:"Integration Layer" to:"Compute Resources"

// Strategic moves
evolve "Mobile Experience" to evolution:0.8
evolve "Analytics Platform" to evolution:0.75
evolve "Legacy Database" to evolution:0.95 // Migrate to commodity
      }
`
			},
			{
				name: 'Product Development',
				description: 'Product evolution from genesis to commodity',
				code: `wardley "Product Evolution Map" {

anchor "Market Need" value:0.92

// Genesis - Novel innovation
component "Novel Feature" evolution:0.15 value:0.85 label:"R&D phase"
component "Prototype" evolution:0.2 value:0.75

// Custom Built
component "MVP" evolution:0.35 value:0.8 label:"Custom solution"
component "Beta Version" evolution:0.45 value:0.75

// Product
component "Released Product" evolution:0.65 value:0.85 label:"Product phase"
component "Feature Set" evolution:0.7 value:0.7

// Commodity
component "Standard Components" evolution:0.9 value:0.5
component "Open Source Libs" evolution:0.95 value:0.4
component "Cloud Services" evolution:1.0 value:0.3

dependency from:"Prototype" to:"Novel Feature"
dependency from:"MVP" to:"Prototype"
dependency from:"Beta Version" to:"MVP"
dependency from:"Released Product" to:"Beta Version"
dependency from:"Released Product" to:"Feature Set"
dependency from:"Feature Set" to:"Standard Components"
dependency from:"Standard Components" to:"Open Source Libs"
dependency from:"Open Source Libs" to:"Cloud Services"

// Evolution path
evolve "Novel Feature" to evolution:0.5
evolve "MVP" to evolution:0.65
evolve "Standard Components" to evolution:1.0
      }
`
			}
		]
	}
];
