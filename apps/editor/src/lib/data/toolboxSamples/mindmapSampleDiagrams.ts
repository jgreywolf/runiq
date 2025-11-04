import type { SampleCategory } from '../sample-data';

export const mindmapSampleDiagrams: SampleCategory[] = [
	{
		id: 'mindmapTemplates',
		label: 'Mindmap Templates',
		samples: [
			{
				name: 'Simple Mindmap',
				description: 'Basic mindmap with central node and branches',
				code: `// Simple Mindmap
diagram "Simple Mindmap" {
  
  container "Ideas" type: mindmap algorithm: radial spacing: 80 {
    shape central label: "Project Ideas"
    shape branch1 label: "Mobile App"
    shape branch2 label: "Website"
    shape branch3 label: "API Service"
    shape branch4 label: "Desktop Tool"
    
    central -> branch1
    central -> branch2
    central -> branch3
    central -> branch4
  }
}`
			},
			{
				name: 'Project Planning',
				description: 'Multi-level mindmap for project organization',
				code: `// Project Planning Mindmap
diagram "Project Planning" {
  
  container "ProjectPlan" type: mindmap algorithm: radial spacing: 100 {
    // Central topic
    shape project label: "New Product Launch"
    
    // Main branches
    shape research label: "Research"
    shape design label: "Design"
    shape development label: "Development"
    shape marketing label: "Marketing"
    
    // Sub-branches
    shape market label: "Market Analysis"
    shape competitors label: "Competitors"
    shape ux label: "UX Design"
    shape ui label: "UI Design"
    shape frontend label: "Frontend"
    shape backend label: "Backend"
    shape social label: "Social Media"
    shape ads label: "Advertising"
    
    // Structure
    project -> research
    project -> design
    project -> development
    project -> marketing
    
    research -> market
    research -> competitors
    design -> ux
    design -> ui
    development -> frontend
    development -> backend
    marketing -> social
    marketing -> ads
  }
}`
			},
			{
				name: 'Learning Roadmap',
				description: 'Educational mindmap showing learning paths',
				code: `// Learning Roadmap Mindmap
diagram "Learning Roadmap" {
  
  container "LearningPath" type: mindmap algorithm: radial spacing: 90 {
    // Center
    shape learn label: "Learn Programming"
    
    // Major paths
    shape basics label: "Basics"
    shape web label: "Web Dev"
    shape data label: "Data Science"
    
    // Details
    shape variables label: "Variables"
    shape functions label: "Functions"
    shape html label: "HTML/CSS"
    shape js label: "JavaScript"
    shape python label: "Python"
    shape ml label: "Machine Learning"
    
    // Connections
    learn -> basics
    learn -> web
    learn -> data
    
    basics -> variables
    basics -> functions
    web -> html
    web -> js
    data -> python
    data -> ml
  }
}`
			}
		]
	}
];
