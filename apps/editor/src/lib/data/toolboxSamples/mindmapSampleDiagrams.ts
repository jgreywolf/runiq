import type { SampleCategory } from '../sample-data';

export const mindmapSampleDiagrams: SampleCategory[] = [
	{
		id: 'mindmapTemplates',
		label: 'Mindmap Templates',
		samples: [
			{
				name: 'Simple Mindmap',
				description: 'Basic mindmap with central node and branches using radial layout',
				code: `// Simple Mindmap with Radial Layout
diagram "Simple Mindmap" {
  
  container "Ideas" algorithm: radial spacing: 80 {
    shape central as @circle label: "Project Ideas"
    shape branch1 as @roundedRectangle label: "Mobile App"
    shape branch2 as @roundedRectangle label: "Website"
    shape branch3 as @roundedRectangle label: "API Service"
    shape branch4 as @roundedRectangle label: "Desktop Tool"
    
    central -> branch1
    central -> branch2
    central -> branch3
    central -> branch4
  }
}`
			},
			{
				name: 'Project Planning',
				description: 'Multi-level mindmap for project organization with radial layout',
				code: `// Project Planning Mindmap with Radial Layout
diagram "Project Planning" {
  
  container "ProjectPlan" algorithm: radial spacing: 100 {
    // Central topic
    shape project as @circle label: "New Product Launch"
    
    // Main branches
    shape research as @roundedRectangle label: "Research"
    shape design as @roundedRectangle label: "Design"
    shape development as @roundedRectangle label: "Development"
    shape marketing as @roundedRectangle label: "Marketing"
    
    // Sub-branches
    shape market as @rectangle label: "Market Analysis"
    shape competitors as @rectangle label: "Competitors"
    shape ux as @rectangle label: "UX Design"
    shape ui as @rectangle label: "UI Design"
    shape frontend as @rectangle label: "Frontend"
    shape backend as @rectangle label: "Backend"
    shape social as @rectangle label: "Social Media"
    shape ads as @rectangle label: "Advertising"
    
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
				description: 'Educational mindmap showing learning paths with radial layout',
				code: `// Learning Roadmap Mindmap with Radial Layout
diagram "Learning Roadmap" {
  
  container "LearningPath" algorithm: radial spacing: 90 {
    // Center
    shape learn as @circle label: "Learn Programming"
    
    // Major paths
    shape basics as @roundedRectangle label: "Basics"
    shape web as @roundedRectangle label: "Web Dev"
    shape data as @roundedRectangle label: "Data Science"
    
    // Details
    shape variables as @rectangle label: "Variables"
    shape functions as @rectangle label: "Functions"
    shape html as @rectangle label: "HTML/CSS"
    shape js as @rectangle label: "JavaScript"
    shape python as @rectangle label: "Python"
    shape ml as @rectangle label: "Machine Learning"
    
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
