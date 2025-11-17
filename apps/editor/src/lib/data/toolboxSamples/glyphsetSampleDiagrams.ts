import type { SampleCategory } from '../sample-data';

export const glyphsetSampleDiagrams: SampleCategory[] = [
	{
		id: 'glyphsetsProcess',
		label: 'Process Glyphsets',
		samples: [
			{
				name: 'Basic Process',
				description: 'Simple linear horizontal flow',
				code: `glyphset basicProcess "Product Launch" {
  theme "vibrant"
  orientation "horizontal"
  step "Ideation"
  step "Design"
  step "Development"
  step "Testing"
  step "Launch"
}`
			},
			{
				name: 'Alternating Process',
				description: 'Zigzag S-curve workflow',
				code: `glyphset alternatingProcess "Agile Development" {
  theme "forest"
  item "Sprint Planning"
  item "Development"
  item "Code Review"
  item "Testing"
  item "Deployment"
  item "Retrospective"
}`
			},
			{
				name: 'Step Process',
				description: 'Diagonal stair-step progression',
				code: `glyphset stepProcess "Career Growth" {
  theme "professional"
  item "Junior Developer"
  item "Mid-Level Developer"
  item "Senior Developer"
  item "Tech Lead"
  item "Engineering Manager"
}`
			},
			{
				name: 'Cycle',
				description: 'Circular process flow',
				code: `glyphset cycle "PDCA Cycle" {
  theme "cool"
  step "Plan"
  step "Do"
  step "Check"
  step "Act"
}`
			},
			{
				name: 'Block Cycle',
				description: 'Block-based circular flow',
				code: `glyphset blockCycle "PDCA Quality" {
  theme "sunset"
  item "Plan Objectives"
  item "Do Implementation"
  item "Check Results"
  item "Act on Findings"
}`
			},
			{
				name: 'Radial Cycle',
				description: 'Radial spoke pattern',
				code: `glyphset radialCycle "System Architecture" {
  theme "ocean"
  center "Core Platform"
  item "Web Interface"
  item "Mobile App"
  item "API Gateway"
  item "Analytics"
}`
			},
			{
				name: 'Spiral Cycle',
				description: 'Spiral evolution pattern',
				code: `glyphset spiralCycle "Maturity Model" {
  theme "forest"
  item "Initial"
  item "Managed"
  item "Defined"
  item "Quantitative"
  item "Optimizing"
}`
			},
			{
				name: 'Gear Cycle',
				description: 'Interlocking gears',
				code: `glyphset gearCycle "Manufacturing Process" {
  theme "warm"
  item "Design"
  item "Engineering"
  item "Production"
  item "Quality Control"
}`
			},
			{
				name: 'Segmented Cycle',
				description: 'Segmented circular cycle',
				code: `glyphset segmentedCycle "Time Management" {
  theme "vibrant"
  item "Morning Focus"
  item "Afternoon Meetings"
  item "Evening Review"
}`
			},
			{
				name: 'Orbit Cycle',
				description: 'Orbital hierarchy',
				code: `glyphset orbitCycle "Enterprise Systems" {
  theme "cool"
  item "Core ERP"
  item "Customer Data"
  item "Financial Data"
  item "Operations Data"
  item "Analytics"
}`
			},
			{
				name: 'Continuous Block Process',
				description: 'Connected block flow',
				code: `glyphset continuousBlockProcess "Manufacturing Pipeline" {
  theme "professional"
  item "Raw Materials"
  item "Processing"
  item "Assembly"
  item "Quality Check"
  item "Packaging"
  item "Distribution"
}`
			},
			{
				name: 'Phased Process',
				description: 'Distinct phase milestones',
				code: `glyphset phasedProcess "Software Release" {
  theme "sunset"
  item "Alpha Testing"
  item "Beta Release"
  item "GA Launch"
  item "Post-Launch Support"
}`
			},
			{
				name: 'Detailed Process',
				description: 'Process with substeps',
				code: `glyphset detailedProcess "Product Development" {
  theme "ocean"
  item "Research | Market Analysis | User Interviews | Competitive Study"
  item "Design | Wireframes | Mockups | Prototypes"
  item "Build | Frontend | Backend | Testing"
  item "Launch | Marketing | Sales | Support"
}`
			},
			{
				name: 'Grouped Process',
				description: 'Grouped workstreams',
				code: `glyphset groupedProcess "Cross-Functional Project" {
  theme "forest"
  group "Engineering" {
    item "Architecture"
    item "Development"
    item "Testing"
  }
  group "Design" {
    item "Research"
    item "UI/UX"
    item "Prototyping"
  }
  group "Product" {
    item "Planning"
    item "Requirements"
    item "Launch"
  }
  mergePoint "Product Release"
}`
			},
			{
				name: 'Equation Process',
				description: 'Equation-style process',
				code: `glyphset equationProcess "Success Formula" {
  theme "vibrant"
  operator "+"
  input "Talent"
  input "Process"
  input "Technology"
  output "Innovation"
}`
			}
		]
	},
	{
		id: 'glyphsetsHierarchy',
		label: 'Hierarchy Glyphsets',
		samples: [
			{
				name: 'Organization Chart',
				description: 'Standard org chart with nesting',
				code: `glyphset orgChart "Engineering Team" {
  theme "professional"
  person "CTO" {
    person "VP Engineering" {
      person "Tech Lead" {
        person "Senior Dev"
        person "Junior Dev"
      }
    }
    person "VP Product" {
      person "Product Manager"
    }
  }
}`
			},
			{
				name: 'Horizontal Org Chart',
				description: 'Left-to-right organization',
				code: `glyphset horizontalOrgChart "Project Structure" {
  theme "ocean"
  person "Project Manager" {
    person "Dev Team Lead" {
      person "Developer 1"
      person "Developer 2"
    }
    person "QA Lead" {
      person "QA Engineer"
    }
  }
}`
			},
			{
				name: 'Matrix Org Chart',
				description: 'Matrix organization structure',
				code: `glyphset matrixOrgChart "Matrix Team" {
  theme "sunset"
  person "CEO" {
    person "Engineering Manager"
    person "Product Manager"
    person "Design Manager"
  }
}`
			},
			{
				name: 'Pyramid',
				description: 'Triangular hierarchy',
				code: `glyphset pyramid "Corporate Structure" {
  theme "cool"
  level "Executive Leadership"
  level "Senior Management"
  level "Middle Management"
  level "Team Leads"
  level "Individual Contributors"
}`
			},
			{
				name: 'Inverted Pyramid',
				description: 'Upside-down funnel',
				code: `glyphset invertedPyramid "Sales Funnel" {
  theme "warm"
  level "Website Visitors"
  level "Leads"
  level "Qualified Leads"
  level "Customers"
}`
			},
			{
				name: 'Segmented Pyramid',
				description: 'Pyramid with categories',
				code: `glyphset segmentedPyramid "Skills Development" {
  theme "vibrant"
  level "Expert" {
    item "Architecture"
    item "Leadership"
  }
  level "Advanced" {
    item "System Design"
    item "Mentoring"
    item "Code Review"
  }
  level "Intermediate" {
    item "Full-Stack Dev"
    item "Testing"
    item "CI/CD"
  }
  level "Beginner" {
    item "HTML"
    item "CSS"
    item "JavaScript"
    item "Git"
  }
}`
			},
			{
				name: 'Pyramid List',
				description: 'Pyramid with detailed items',
				code: `glyphset pyramidList "Project Phases" {
  theme "forest"
  level "Planning" {
    item "Define Goals"
    item "Set Timeline"
  }
  level "Execution" {
    item "Development"
    item "Testing"
    item "Deployment"
  }
  level "Monitoring" {
    item "Analytics"
    item "User Feedback"
  }
}`
			},
			{
				name: 'Circle Hierarchy',
				description: 'Concentric circle layers',
				code: `glyphset circleHierarchy "System Layers" {
  theme "professional"
  root "Core Domain"
  child "Business Logic"
  child "Application Services"
  child "API Layer"
  child "User Interface"
}`
			},
			{
				name: 'Labeled Hierarchy',
				description: 'Tree with labeled relationships',
				code: `glyphset labeledHierarchy "Team Structure" {
  theme "ocean"
  root "Engineering Manager" {
    child "Tech Lead" oversees {
      child "Senior Engineer" mentors {
        child "Junior Engineer"
      }
    }
    child "QA Lead" manages {
      child "QA Engineer"
    }
  }
}`
			},
			{
				name: 'Table Hierarchy',
				description: 'Tabular hierarchical rows',
				code: `glyphset tableHierarchy "System Architecture" {
  theme "cool"
  level "Controller A" Presentation
  level "Controller B" Presentation
  level "Service A" BusinessLogic
  level "Service B" BusinessLogic
  level "Repository 1" DataAccess
  level "Repository 2" DataAccess
}`
			},
			{
				name: 'Team Hierarchy',
				description: 'Team containers with members',
				code: `glyphset teamHierarchy "Project Teams" {
  theme "sunset"
  team "Frontend"
  leader "Sarah Chen"
  member "Alice"
  member "Bob"
  
  team "Backend"
  leader "Mike Johnson"
  member "Charlie"
  member "Diana"
  
  team "DevOps"
  leader "Emma Wilson"
  member "Frank"
}`
			}
		]
	},
	{
		id: 'glyphsetsComparison',
		label: 'Comparison Glyphsets',
		samples: [
			{
				name: 'Matrix (2×2)',
				description: 'Four-quadrant matrix',
				code: `glyphset matrix "Eisenhower Matrix" {
  theme "professional"
  quadrant "Do First: Urgent & Important"
  quadrant "Schedule: Important, Not Urgent"
  quadrant "Delegate: Urgent, Not Important"
  quadrant "Eliminate: Neither"
}`
			},
			{
				name: 'Matrix (3×3)',
				description: 'Nine-cell matrix',
				code: `glyphset matrix3x3 "Risk Assessment" {
  theme "warm"
  quadrant "Low/Low"
  quadrant "Low/Med"
  quadrant "Low/High"
  quadrant "Med/Low"
  quadrant "Med/Med"
  quadrant "Med/High"
  quadrant "High/Low"
  quadrant "High/Med"
  quadrant "High/High"
}`
			},
			{
				name: 'Titled Matrix',
				description: 'Matrix with row/column titles',
				code: `glyphset titledMatrix "RACI Matrix" {
  theme "ocean"
  quadrant "R"
  quadrant "A"
  quadrant "C"
  quadrant "I"
}`
			},
			{
				name: 'Segmented Matrix',
				description: 'Multi-section matrix',
				code: `glyphset segmentedMatrix "Priority Analysis" {
  theme "vibrant"
  quadrant "Quick Wins: High Value, Low Effort"
  quadrant "Major Projects: High Value, High Effort"
  quadrant "Fill-Ins: Low Value, Low Effort"
  quadrant "Thankless Tasks: Low Value, High Effort"
}`
			},
			{
				name: 'Venn Diagram',
				description: 'Overlapping circles',
				code: `glyphset venn "Skill Overlap" {
  theme "cool"
  circle "Frontend"
  circle "Backend"
  circle "DevOps"
}`
			},
			{
				name: 'Stepped Venn',
				description: '3D stacked circles',
				code: `glyphset steppedVenn "Market Segments" {
  theme "vibrant"
  circle "Enterprise"
  circle "Mid-Market"
  circle "SMB"
}`
			},
			{
				name: 'Linear Venn',
				description: 'Horizontal overlapping circles',
				code: `glyphset linearVenn "Product Features" {
  theme "professional"
  circle "Basic"
  circle "Standard"
  circle "Premium"
  circle "Enterprise"
}`
			}
		]
	},
	{
		id: 'glyphsetsRelationship',
		label: 'Relationship Glyphsets',
		samples: [
			{
				name: 'Converging',
				description: 'Many-to-one convergence',
				code: `glyphset converging "Data Aggregation" {
  theme "ocean"
  outer "Database A"
  outer "Database B"
  outer "API Feed"
  outer "File Import"
  inner "Data Warehouse"
}`
			},
			{
				name: 'Diverging',
				description: 'One-to-many divergence',
				code: `glyphset diverging "Content Distribution" {
  theme "sunset"
  inner "Content Management"
  outer "Website"
  outer "Mobile App"
  outer "Email"
  outer "Social Media"
}`
			},
			{
				name: 'Balance',
				description: 'Two-sided balance',
				code: `glyphset balance "Cost vs Benefit" {
  theme "cool"
  side "Implementation Costs"
  side "Long-term Benefits"
    leftWeight 1
  rightWeight 3  // tilts toward this side
}`
			},
			{
				name: 'Opposing',
				description: 'Opposing forces',
				code: `glyphset opposing "Traditional vs Innovative" {
  theme "warm"
  item "Stability"
  item "Innovation"
  item "Proven Methods"
  item "New Technologies"
}`
			},
			{
				name: 'Plus/Minus',
				description: 'Pros and cons',
				code: `glyphset plusMinus "Cloud Migration" {
  theme "professional"
  pro "Scalability"
  pro "Cost Efficiency"
  pro "Global Reach"
  con "Migration Complexity"
  con "Learning Curve"
}`
			},
			{
				name: 'Cluster',
				description: 'Grouped clusters',
				code: `glyphset cluster "Product Features" {
  theme "vibrant"
  cluster "Core" items: ["Authentication", "Data Storage", "API"]
  cluster "Advanced" items: ["Analytics", "ML Integration"]
  cluster "Premium" items: ["White Label", "SLA"]
}`
			},
			{
				name: 'Puzzle',
				description: 'Interlocking pieces',
				code: `glyphset puzzle "System Integration" {
  theme "forest"
  piece "CRM System"
  piece "Marketing Platform"
  piece "Analytics Tool"
  piece "Payment Gateway"
}`
			},
			{
				name: 'Target',
				description: 'Concentric rings',
				code: `glyphset target "Market Priorities" {
  theme "sunset"
  ring "Core Market"
  ring "Adjacent Market"
  ring "New Market"
  ring "Future Opportunities"
}`
			},
			{
				name: 'Counterbalance',
				description: 'Balance scale comparison',
				code: `glyphset counterbalance "Cost vs Value" {
  theme "cool"
  side "Low Cost"
  side "High Value"
}`
			},
			{
				name: 'Equation',
				description: 'A+B=C mathematical format',
				code: `glyphset equation "Innovation Formula" {
  theme "professional"
  operator "+"
  input "Creativity"
  input "Technology"
  input "Market Insight"
  output "Breakthrough Product"
}`
			},
			{
				name: 'Interconnected',
				description: 'Circular mesh network',
				code: `glyphset interconnected "Microservices" {
  theme "ocean"
  node "API Gateway"
  node "Auth Service"
  node "User Service"
  node "Payment Service"
  node "Analytics"
}`
			},
			{
				name: 'Hub',
				description: 'Central hub with radial spokes',
				code: `glyphset hub "Platform Architecture" {
  theme "cool"
  bidirectional false
  center "Core Platform"
  spoke "Web Interface"
  spoke "Mobile App"
  spoke "API Gateway"
  spoke "Analytics Engine"
  spoke "Data Storage"
}`
			}
		]
	},
	{
		id: 'glyphsetsList',
		label: 'List Glyphsets',
		samples: [
			{
				name: 'Basic List',
				description: 'Simple vertical list',
				code: `glyphset basicList "Key Features" {
  theme "vibrant"
  orientation "vertical"
  item "Real-time Collaboration"
  item "Cloud Storage"
  item "Advanced Security"
  item "Mobile Access"
  item "API Integration"
}`
			},
			{
				name: 'Horizontal List',
				description: 'Left-to-right list',
				code: `glyphset horizontalList "Project Phases" {
  theme "professional"
  item "Planning"
  item "Design"
  item "Development"
  item "Testing"
  item "Launch"
}`
			},
			{
				name: 'Chevron List',
				description: 'Arrow-shaped progression',
				code: `glyphset chevronList "Customer Journey" {
  theme "ocean"
  item "Awareness"
  item "Consideration"
  item "Decision"
  item "Purchase"
  item "Loyalty"
}`
			},
			{
				name: 'Numbered Chevron List',
				description: 'Numbered arrow progression',
				code: `glyphset numberedChevronList "Project Steps" {
  theme "sunset"
  item "Requirements Gathering"
  item "Architecture Design"
  item "Implementation"
  item "Quality Assurance"
  item "Deployment"
}`
			},
			{
				name: 'Nested List',
				description: 'Multi-level hierarchical list',
				code: `glyphset nestedList "Feature Breakdown" {
  theme "forest"
  level "User Management" {
    item "Authentication"
    item "Authorization"
    item "Profile Management"
  }
  level "Data Management" {
    item "CRUD Operations"
    item "Search & Filter"
  }
}`
			},
			{
				name: 'Column List',
				description: 'Multi-column layout',
				code: `glyphset columnList "Tech Stack" {
  theme "cool"
  item "React"
  item "TypeScript"
  item "Tailwind"
  item "Node.js"
  item "PostgreSQL"
  item "Redis"
  item "Docker"
  item "Kubernetes"
  item "GitHub Actions"
}`
			},
			{
				name: 'Increasing List',
				description: 'Growing size progression',
				code: `glyphset increasingList "Priority Levels" {
  theme "warm"
  item "Nice to Have"
  item "Important"
  item "High Priority"
  item "Critical"
  item "Must Have Now"
}`
			},
			{
				name: 'Alternating List',
				description: 'Zigzag alternating layout',
				code: `glyphset alternatingList "Evolution Timeline" {
  theme "vibrant"
  item "2020: Initial Launch"
  item "2021: Mobile App"
  item "2022: AI Features"
  item "2023: Global Expansion"
  item "2024: Platform 2.0"
}`
			}
		]
	},
	{
		id: 'glyphsetsVisualization',
		label: 'Visualization Glyphsets',
		samples: [
			{
				name: 'Funnel',
				description: 'Conversion funnel',
				code: `glyphset funnel "Sales Pipeline" {
  theme "professional"
  stage "Website Visitors (10,000)"
  stage "Leads (1,000)"
  stage "Qualified Leads (200)"
  stage "Proposals (50)"
  stage "Customers (15)"
}`
			},
			{
				name: 'Events Timeline',
				description: 'Chronological events',
				code: `glyphset events "Product Roadmap" {
  theme "ocean"
  event "Q1: Beta Launch"
  event "Q2: Feature Expansion"
  event "Q3: Enterprise Release"
  event "Q4: Global Rollout"
}`
			}
		]
	}
];
