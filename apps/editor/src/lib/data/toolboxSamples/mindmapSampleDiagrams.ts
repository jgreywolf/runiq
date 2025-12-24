import type { SampleCategory } from '../sample-data';

export const mindmapSampleDiagrams: SampleCategory[] = [
	{
		id: 'mindmapTemplates',
		label: 'Mindmap Templates',
		samples: [
			{
				name: 'Simple Mindmap',
				description: 'Basic mindmap with automatic styling and colors - no manual styling needed!',
				code: `// Simple Mindmap - Automatic Styling & Colors
// NO color specifications needed! Colors are automatically assigned:
// - Level 0 (central): White with purple accent
// - Level 1 (main branches): Vibrant colors (blue, green, amber, pink, etc.)
// - Level 2+ (sub-branches): Lighter tints of parent branch colors
diagram "Simple Mindmap" {
  
  container "Ideas" algorithm: radial spacing: 80 {
    shape central as @circle label: "Project Ideas" icon:fa/lightbulb
    
    shape mobile as @roundedRectangle label: "Mobile App"
    shape web as @roundedRectangle label: "Website"
    shape api as @roundedRectangle label: "API Service"
    shape desktop as @roundedRectangle label: "Desktop Tool"
    
    shape ios as @rectangle label: "iOS"
    shape android as @rectangle label: "Android"
    shape frontend as @rectangle label: "Frontend"
    shape backend as @rectangle label: "Backend"
    
    central -> mobile
    central -> web
    central -> api
    central -> desktop
    
    mobile -> ios
    mobile -> android
    web -> frontend
    web -> backend
  }
}`
			},
			{
				name: 'Styled Mindmap with Colors',
				description:
					'Custom colors override automatic styling - use when you need specific brand colors',
				code: `// Styled Mindmap - Custom Color Overrides
// Automatic colors are great, but you can still specify custom colors
// when needed (e.g., for brand colors or specific themes)
diagram "Product Strategy" {
  
  container "Strategy" algorithm: radial spacing: 100 {
    // Central node with gradient-like color
    shape central as @circle label: "Product Strategy" 
      fillColor:"#6366f1" strokeColor:"#4338ca" strokeWidth:3
    
    // Features branch (green theme)
    shape features as @roundedRectangle label: "Features"
      fillColor:"#10b981" strokeColor:"#059669" strokeWidth:2
    shape feature1 as @rectangle label: "Core Functions"
      fillColor:"#d1fae5" strokeColor:"#059669"
    shape feature2 as @rectangle label: "Integrations"
      fillColor:"#d1fae5" strokeColor:"#059669"
    
    // Marketing branch (pink theme)
    shape marketing as @roundedRectangle label: "Marketing"
      fillColor:"#ec4899" strokeColor:"#db2777" strokeWidth:2
    shape marketing1 as @rectangle label: "Social Media"
      fillColor:"#fce7f3" strokeColor:"#db2777"
    shape marketing2 as @rectangle label: "Content"
      fillColor:"#fce7f3" strokeColor:"#db2777"
    
    // Technology branch (blue theme)
    shape tech as @roundedRectangle label: "Technology"
      fillColor:"#3b82f6" strokeColor:"#2563eb" strokeWidth:2
    shape tech1 as @rectangle label: "Frontend"
      fillColor:"#dbeafe" strokeColor:"#2563eb"
    shape tech2 as @rectangle label: "Backend"
      fillColor:"#dbeafe" strokeColor:"#2563eb"
    
    // Business branch (amber theme)
    shape business as @roundedRectangle label: "Business Model"
      fillColor:"#f59e0b" strokeColor:"#d97706" strokeWidth:2
    shape business1 as @rectangle label: "Revenue"
      fillColor:"#fef3c7" strokeColor:"#d97706"
    shape business2 as @rectangle label: "Costs"
      fillColor:"#fef3c7" strokeColor:"#d97706"
    
    // Structure
    central -> features
    central -> marketing
    central -> tech
    central -> business
    
    features -> feature1
    features -> feature2
    marketing -> marketing1
    marketing -> marketing2
    tech -> tech1
    tech -> tech2
    business -> business1
    business -> business2
  }
}`
			},
			{
				name: 'Mindmap with Icons',
				description: 'Mindmap using FontAwesome icons with automatic color styling',
				code: `// Mindmap with Icons - Automatic Colors
// Icons add visual clarity while automatic colors handle the theming
diagram "Team Workflow" {
  
  container "Workflow" algorithm: radial spacing: 110 {
    // Central node
    shape central as @circle label: "Team Workflow" icon:fa/sitemap
    
    // Planning branch
    shape planning as @roundedRectangle label: "Planning" icon:fa/calendar
    shape sprint as @rectangle label: "Sprint Planning" icon:fa/clock
    shape backlog as @rectangle label: "Backlog" icon:fa/list
    
    // Development branch
    shape dev as @roundedRectangle label: "Development" icon:fa/code
    shape coding as @rectangle label: "Coding" icon:fa/laptop
    shape review as @rectangle label: "Code Review" icon:fa/search
    
    // Testing branch
    shape testing as @roundedRectangle label: "Testing" icon:fa/flask
    shape unit as @rectangle label: "Unit Tests" icon:fa/vial
    shape integration as @rectangle label: "Integration" icon:fa/sitemap
    
    // Deployment branch
    shape deploy as @roundedRectangle label: "Deployment" icon:fa/rocket
    shape staging as @rectangle label: "Staging" icon:fa/server
    shape production as @rectangle label: "Production" icon:fa/globe
    
    // Structure
    central -> planning
    central -> dev
    central -> testing
    central -> deploy
    
    planning -> sprint
    planning -> backlog
    dev -> coding
    dev -> review
    testing -> unit
    testing -> integration
    deploy -> staging
    deploy -> production
  }
}`
			},
			{
				name: 'Project Planning',
				description: 'Multi-level mindmap with icons and automatic color theming',
				code: `// Project Planning Mindmap - Automatic Styling
diagram "Project Planning" {
  
  container "ProjectPlan" algorithm: radial spacing: 120 {
    // Central topic with icon
    shape project as @circle label: "New Product Launch" icon:fa/rocket
    
    // Research branch
    shape research as @roundedRectangle label: "Research" icon:fa/search
    shape market as @rectangle label: "Market Analysis" icon:fa/chart
    shape competitors as @rectangle label: "Competitors" icon:fa/users
    
    // Design branch
    shape design as @roundedRectangle label: "Design" icon:fa/palette
    shape ux as @rectangle label: "UX Design" icon:fa/user
    shape ui as @rectangle label: "UI Design" icon:fa/paintbrush
    
    // Development branch
    shape development as @roundedRectangle label: "Development" icon:fa/code
    shape frontend as @rectangle label: "Frontend" icon:fa/desktop
    shape backend as @rectangle label: "Backend" icon:fa/server
    
    // Marketing branch
    shape marketing as @roundedRectangle label: "Marketing" icon:fa/bullhorn
    shape social as @rectangle label: "Social Media" icon:fa/hashtag
    shape ads as @rectangle label: "Advertising" icon:fa/ad
    
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
				description: 'Educational mindmap with icons and automatic color theming',
				code: `// Learning Roadmap - Automatic Styling
diagram "Learning Roadmap" {
  
  container "LearningPath" algorithm: radial spacing: 105 {
    // Center - Main goal
    shape learn as @circle label: "Learn Programming" icon:fa/graduation
    
    // Basics path
    shape basics as @roundedRectangle label: "Basics" icon:fa/book
    shape variables as @rectangle label: "Variables" icon:fa/box
    shape functions as @rectangle label: "Functions" icon:fa/function
    
    // Web Dev path
    shape web as @roundedRectangle label: "Web Development" icon:fa/globe
    shape html as @rectangle label: "HTML/CSS" icon:fa/code
    shape js as @rectangle label: "JavaScript" icon:fa/js
    
    // Data Science path
    shape data as @roundedRectangle label: "Data Science" icon:fa/chart
    shape python as @rectangle label: "Python" icon:fa/python
    shape ml as @rectangle label: "Machine Learning" icon:fa/brain
    
    // Mobile Dev path
    shape mobile as @roundedRectangle label: "Mobile Dev" icon:fa/mobile
    shape react as @rectangle label: "React Native" icon:fa/react
    shape flutter as @rectangle label: "Flutter" icon:fa/mobile
    
    // Connections
    learn -> basics
    learn -> web
    learn -> data
    learn -> mobile
    
    basics -> variables
    basics -> functions
    web -> html
    web -> js
    data -> python
    data -> ml
    mobile -> react
    mobile -> flutter
  }
}`
			},
			{
				name: 'Business Strategy Map',
				description: 'Strategic planning mindmap with business icons and automatic theming',
				code: `// Business Strategy Map - Automatic Styling
diagram "Business Strategy" {
  
  container "Strategy2025" algorithm: radial spacing: 115 {
    // Central vision
    shape vision as @circle label: "2025 Vision" icon:fa/lightbulb
    
    // Growth branch
    shape growth as @roundedRectangle label: "Growth" icon:fa/chart
    shape revenue as @rectangle label: "Revenue +40%" icon:fa/dollar
    shape customers as @rectangle label: "New Markets" icon:fa/globe
    shape partners as @rectangle label: "Partnerships" icon:fa/handshake
    
    // Innovation branch
    shape innovation as @roundedRectangle label: "Innovation" icon:fa/flask
    shape ai as @rectangle label: "AI Integration" icon:fa/robot
    shape automation as @rectangle label: "Automation" icon:fa/gears
    
    // Operations branch
    shape operations as @roundedRectangle label: "Operations" icon:fa/industry
    shape efficiency as @rectangle label: "Efficiency" icon:fa/gauge
    shape quality as @rectangle label: "Quality" icon:fa/certificate
    
    // People branch
    shape people as @roundedRectangle label: "People" icon:fa/users
    shape talent as @rectangle label: "Attract Talent" icon:fa/user
    shape culture as @rectangle label: "Culture" icon:fa/heart
    shape training as @rectangle label: "Training" icon:fa/book
    
    // Structure
    vision -> growth
    vision -> innovation
    vision -> operations
    vision -> people
    
    growth -> revenue
    growth -> customers
    growth -> partners
    innovation -> ai
    innovation -> automation
    operations -> efficiency
    operations -> quality
    people -> talent
    people -> culture
    people -> training
  }
}`
			}
		]
	}
];
