import type { SampleCategory } from '../sample-data';

export const timelineSampleDiagrams: SampleCategory[] = [
	{
		id: 'timeline',
		label: 'Timeline Diagrams',
		samples: [
			{
				name: 'Project Timeline',
				description: 'Software project milestones with development phases',
				code: `// Project Timeline Example
// Shows key milestones in a software project

timeline "Software Project Launch" {
  // Project milestones
  event kickoff date:"2024-01-15" label:"Project Kickoff" description:"Initial team meeting and planning" icon:"flag"
  
  event requirements date:"2024-02-01" label:"Requirements Complete" description:"All user stories documented"
  
  event design date:"2024-02-20" label:"Design Approved" description:"UI/UX mockups finalized" color:"#3b82f6"
  
  event devStart date:"2024-03-01" label:"Development Starts" description:"Sprint 1 begins"
  
  event alpha date:"2024-04-15" label:"Alpha Release" description:"Internal testing version" color:"#f59e0b"
  
  event beta date:"2024-05-01" label:"Beta Release" description:"External user testing" color:"#f59e0b"
  
  event launch date:"2024-06-01" label:"Product Launch" description:"Public release v1.0" icon:"rocket" color:"#10b981"
  
  // Optional: Define development periods
  period planning startDate:"2024-01-15" endDate:"2024-02-28" label:"Planning Phase" color:"#e0e7ff"
  
  period development startDate:"2024-03-01" endDate:"2024-05-31" label:"Development Phase" color:"#dbeafe"
  
  period testing startDate:"2024-04-15" endDate:"2024-05-31" label:"Testing Period" color:"#fef3c7"
}`
			},
			{
				name: 'Company History',
				description: '20-year technology company journey with major milestones',
				code: `// Company History Timeline
// Chronicles the major milestones of a technology company

timeline "TechCorp Journey: 20 Years of Innovation" {
  // Company founding and early years
  event founding date:"2004-03-15" label:"Company Founded" 
    description:"Three engineers start TechCorp in a garage" 
    icon:"rocket" 
    color:"#10B981"
  
  event firstProduct date:"2005-06-20" label:"First Product Launch" 
    description:"Cloud storage platform v1.0 released"
    color:"#3B82F6"
  
  event series_a date:"2006-09-10" label:"Series A Funding" 
    description:"$5M raised from venture capital" 
    icon:"dollar"
    color:"#F59E0B"
  
  // Growth phase
  event team100 date:"2008-01-15" label:"Team Reaches 100" 
    description:"Hiring milestone achieved"
    color:"#8B5CF6"
  
  event expansion date:"2009-04-01" label:"European Expansion" 
    description:"First international office in London"
    icon:"globe"
    color:"#3B82F6"
  
  event acquisition1 date:"2010-11-20" label:"First Acquisition" 
    description:"Acquired DataSync Technologies" 
    color:"#F59E0B"
  
  // Maturity and public offering
  event ipo date:"2012-05-15" label:"Initial Public Offering" 
    description:"Listed on NASDAQ, raised $200M" 
    icon:"chart"
    color:"#10B981"
  
  event innovation date:"2014-08-30" label:"AI Platform Launch" 
    description:"Revolutionary machine learning tools"
    color:"#8B5CF6"
  
  event global date:"2016-03-10" label:"Global Leader" 
    description:"#1 market position worldwide"
    icon:"trophy"
    color:"#F59E0B"
  
  event billion date:"2018-12-01" label:"$1B Revenue" 
    description:"Annual revenue milestone"
    color:"#10B981"
  
  // Recent achievements
  event sustainability date:"2020-06-05" label:"Carbon Neutral" 
    description:"100% renewable energy operations"
    icon:"leaf"
    color:"#10B981"
  
  event innovation2 date:"2022-09-15" label:"Quantum Computing Lab" 
    description:"New R&D facility opens"
    color:"#8B5CF6"
  
  event present date:"2024-11-10" label:"20th Anniversary" 
    description:"Celebrating two decades of innovation" 
    icon:"star"
    color:"#EF4444"
  
  // Define major business periods
  period startup startDate:"2004-03-15" endDate:"2008-01-01" 
    label:"Startup Phase" 
    color:"#FEF3C7" 
    opacity:0.4
  
  period growth startDate:"2008-01-01" endDate:"2012-05-15" 
    label:"Growth & Expansion" 
    color:"#DBEAFE" 
    opacity:0.4
  
  period publicCompany startDate:"2012-05-15" endDate:"2020-01-01" 
    label:"Public Company Era" 
    color:"#E0E7FF" 
    opacity:0.4
  
  period mature startDate:"2020-01-01" endDate:"2024-11-10" 
    label:"Market Leader" 
    color:"#D1FAE5" 
    opacity:0.4
  
  // Timeline orientation
  orientation horizontal
}`
			},
			{
				name: 'Product Releases',
				description: 'Software version releases with feature milestones',
				code: `// Software Product Release Timeline
// Tracks major version releases and feature milestones

timeline "CloudFlow Platform Releases" {
  // Version 1.x - Foundation
  event v1_0 date:"2022-01-15" label:"v1.0 - Genesis" 
    description:"Initial release: Core workflow engine" 
    icon:"rocket"
    color:"#3B82F6"
  
  event v1_1 date:"2022-03-20" label:"v1.1 - Integrations" 
    description:"Added Slack, Teams, Email connectors"
    color:"#3B82F6"
  
  event v1_2 date:"2022-06-10" label:"v1.2 - Templates" 
    description:"Pre-built workflow templates library"
    color:"#3B82F6"
  
  // Version 2.x - Enterprise
  event v2_0 date:"2022-09-01" label:"v2.0 - Enterprise" 
    description:"SSO, RBAC, audit logging" 
    icon:"shield"
    color:"#8B5CF6"
  
  event v2_1 date:"2022-11-15" label:"v2.1 - Analytics" 
    description:"Advanced reporting and dashboards"
    color:"#8B5CF6"
  
  event v2_2 date:"2023-02-05" label:"v2.2 - Performance" 
    description:"10x throughput improvement"
    color:"#8B5CF6"
  
  // Version 3.x - AI-Powered
  event v3_0 date:"2023-05-20" label:"v3.0 - AI Assistant" 
    description:"Natural language workflow builder" 
    icon:"brain"
    color:"#10B981"
  
  event v3_1 date:"2023-08-10" label:"v3.1 - Smart Routing" 
    description:"ML-based intelligent task assignment"
    color:"#10B981"
  
  event v3_2 date:"2023-11-01" label:"v3.2 - Predictions" 
    description:"Predictive analytics and forecasting"
    color:"#10B981"
  
  // Version 4.x - Platform
  event v4_0 date:"2024-02-15" label:"v4.0 - Platform SDK" 
    description:"Public API and developer tools" 
    icon:"code"
    color:"#F59E0B"
  
  event v4_1 date:"2024-05-30" label:"v4.1 - Marketplace" 
    description:"Plugin marketplace launches"
    color:"#F59E0B"
  
  event v4_2 date:"2024-08-20" label:"v4.2 - Mobile Apps" 
    description:"iOS and Android native apps"
    icon:"mobile"
    color:"#F59E0B"
  
  // Future releases
  event v5_0 date:"2024-12-01" label:"v5.0 - Real-time" 
    description:"WebSocket streaming and live collaboration" 
    icon:"star"
    color:"#EF4444"
  
  event v5_1 date:"2025-03-15" label:"v5.1 - Multi-tenant" 
    description:"Advanced workspace isolation (Planned)"
    color:"#EF4444"
  
  // Development periods
  period alpha startDate:"2021-09-01" endDate:"2021-12-31" 
    label:"Alpha Testing" 
    color:"#FEE2E2" 
    opacity:0.3
  
  period beta startDate:"2021-12-31" endDate:"2022-01-15" 
    label:"Beta Program" 
    color:"#FEF3C7" 
    opacity:0.3
  
  period v1_era startDate:"2022-01-15" endDate:"2022-09-01" 
    label:"v1.x Series" 
    color:"#DBEAFE" 
    opacity:0.3
  
  period v2_era startDate:"2022-09-01" endDate:"2023-05-20" 
    label:"v2.x Series - Enterprise Focus" 
    color:"#E0E7FF" 
    opacity:0.3
  
  period v3_era startDate:"2023-05-20" endDate:"2024-02-15" 
    label:"v3.x Series - AI Integration" 
    color:"#D1FAE5" 
    opacity:0.3
  
  period v4_era startDate:"2024-02-15" endDate:"2024-12-01" 
    label:"v4.x Series - Platform Era" 
    color:"#FEF3C7" 
    opacity:0.3
  
  period v5_era startDate:"2024-12-01" endDate:"2025-06-01" 
    label:"v5.x Series - Next Generation" 
    color:"#FCE7F3" 
    opacity:0.3
  
  // Horizontal timeline for better readability
  orientation horizontal
}`
			},
			{
				name: 'Career Journey (Vertical)',
				description: 'Professional development from education to leadership',
				code: `// Personal Career Journey - Vertical Timeline
// Shows career progression from education to current role

timeline "Professional Development Journey" {
  // Education phase
  event education_start date:"2015-09-01" label:"University Enrollment" 
    description:"Started Computer Science degree"
    color:"#3B82F6"
    position:left
  
  event internship1 date:"2017-06-15" label:"First Internship" 
    description:"Summer intern at StartupXYZ"
    color:"#8B5CF6"
    position:right
  
  event graduation date:"2019-05-20" label:"Graduation" 
    description:"BS in Computer Science, Magna Cum Laude" 
    icon:"graduation"
    color:"#10B981"
    position:left
  
  // Early career
  event first_job date:"2019-07-01" label:"Junior Developer" 
    description:"Joined TechCorp as Junior Software Engineer"
    color:"#3B82F6"
    position:right
  
  event certification1 date:"2020-03-15" label:"AWS Certified" 
    description:"Solutions Architect certification"
    icon:"certificate"
    color:"#F59E0B"
    position:left
  
  event promotion1 date:"2020-09-01" label:"Promoted to Mid-Level" 
    description:"Software Engineer II"
    color:"#8B5CF6"
    position:right
  
  // Career growth
  event lead date:"2021-06-15" label:"Tech Lead" 
    description:"Leading team of 4 developers"
    icon:"users"
    color:"#10B981"
    position:left
  
  event speaker date:"2022-02-20" label:"Conference Speaker" 
    description:"Presented at DevCon 2022"
    color:"#F59E0B"
    position:right
  
  event promotion2 date:"2022-08-01" label:"Senior Engineer" 
    description:"Promoted to Senior Software Engineer"
    color:"#8B5CF6"
    position:left
  
  // Leadership phase
  event architecture date:"2023-03-15" label:"Architecture Role" 
    description:"Solutions Architect for Platform Team"
    icon:"blueprint"
    color:"#3B82F6"
    position:right
  
  event manager date:"2024-01-10" label:"Engineering Manager" 
    description:"Managing team of 8 engineers"
    icon:"star"
    color:"#10B981"
    position:left
  
  event present date:"2024-11-10" label:"Current Role" 
    description:"Senior Engineering Manager"
    color:"#EF4444"
    position:right
  
  // Career periods
  period education startDate:"2015-09-01" endDate:"2019-05-20" 
    label:"Education" 
    color:"#DBEAFE"
    opacity:0.3
  
  period junior startDate:"2019-07-01" endDate:"2020-09-01" 
    label:"Junior Developer" 
    color:"#E0E7FF"
    opacity:0.3
  
  period mid startDate:"2020-09-01" endDate:"2022-08-01" 
    label:"Mid-Level Growth" 
    color:"#D1FAE5"
    opacity:0.3
  
  period senior startDate:"2022-08-01" endDate:"2024-01-10" 
    label:"Senior IC" 
    color:"#FEF3C7"
    opacity:0.3
  
  period leadership startDate:"2024-01-10" endDate:"2024-11-10" 
    label:"Leadership" 
    color:"#FCE7F3"
    opacity:0.3
  
  // Vertical orientation for chronological flow
  orientation vertical
}`
			}
		]
	}
];
