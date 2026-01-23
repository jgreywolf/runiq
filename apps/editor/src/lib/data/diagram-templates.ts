/**
 * Default diagram templates for each profile type
 */

import { ProfileName } from '$lib/types';

export interface DiagramTemplate {
	content: string;
	name: string;
}

export const diagramTemplates: Record<ProfileName, DiagramTemplate> = {
	[ProfileName.diagram]: {
		content: 'diagram "My Diagram"\n\n// Add your shapes and connections here',
		name: 'Untitled Diagram'
	},

	[ProfileName.pid]: {
		content: `pid "My P&ID" {
  // Equipment
  equipment TK-101 type:storageTank volume:5000 unit:L material:CS
  equipment P-101 type:pumpCentrifugal flowRate:50 unit:m³/h material:SS316
  
  // Instruments
  instrument FT-101 type:flowTransmitter range:(0,100) unit:m³/h location:field
  instrument FIC-101 type:flowIndicatorController range:(0,100) unit:m³/h location:panel
  
  // Process Lines
  line process from:TK-101.outlet to:P-101.inlet size:4 unit:in schedule:STD material:CS
  
  // Signal Lines
  line signal from:FT-101 to:FIC-101
  
  // Control Loop
  loop 101 controlled_variable:flow setpoint:50 unit:m³/h controller:FIC-101 mode:auto
  
  // Process Specifications
  fluid "Water"
  pressure 3 unit:bar
}`,
		name: 'Untitled P&ID'
	},

	[ProfileName.sequence]: {
		content: `sequence "My Sequence Diagram" {

  participant "User" as actor
  participant "System" as entity
  participant "Database" as database

  message from:"User" to:"System" label:"Request" type:sync
  message from:"System" to:"Database" label:"Query" type:sync
  message from:"Database" to:"System" label:"Data" type:return
  message from:"System" to:"User" label:"Response" type:return
}`,
		name: 'Untitled Sequence'
	},

	[ProfileName.timeline]: {
		content: `timeline "My Timeline" {
  // Events with dates and descriptions
  event projectStart date:"2024-01-01" label:"Project Start" 
    description:"Project kickoff meeting" 
    textColor:"#3B82F6"
  
  event milestone1 date:"2024-03-15" label:"First Milestone" 
    description:"Initial release" 
    icon:"rocket" 
    textColor:"#10B981"
  
  event milestone2 date:"2024-06-01" label:"Second Milestone" 
    description:"Feature complete" 
    textColor:"#F59E0B"
  
  event complete date:"2024-09-01" label:"Project Complete" 
    description:"Final delivery" 
    icon:"star" 
    textColor:"#EF4444"
  
  // Optional: Define periods
  period phase1 startDate:"2024-01-01" endDate:"2024-03-15" 
    label:"Phase 1" 
    textColor:"#DBEAFE" 
    opacity:0.3
  
  period phase2 startDate:"2024-03-15" endDate:"2024-09-01" 
    label:"Phase 2" 
    textColor:"#D1FAE5" 
    opacity:0.3
  
  // Timeline orientation (horizontal or vertical)
  orientation horizontal
}`,
		name: 'Untitled Timeline'
	},

	[ProfileName.kanban]: {
		content: `kanban "Product Board" {
  theme runiq
  swimlane "Q1 Focus" {
    column backlog "Backlog" wip:5 {
      card C1 "Audit auth flow" priority:high tags:["security","backend"]
      card C2 "Onboarding copy refresh" priority:medium assignee:"Maya"
    }
    column progress "In Progress" wip:3 {
      card C3 "Billing sync fixes" priority:high assignee:"Alex" estimate:"3d"
    }
    column completed "Done" {
      card C4 "Upgrade dependencies" priority:low
    }
  }
}`,
		name: 'Untitled Kanban'
	},

	[ProfileName.gitgraph]: {
		content: `gitgraph "Release Flow" {
  theme runiq

  branch main label:"main" color:"#0f172a"
  branch feature label:"feature/login" parent:main color:"#2563eb"

  commit c1 branch:main label:"Initial scaffold"
  commit c2 branch:feature label:"Login form"
  commit c3 branch:feature label:"OAuth support"
  merge m1 from:feature into:main label:"Merge login" tag:"v1.0.0"
}`,
		name: 'Untitled GitGraph'
	},

	[ProfileName.treemap]: {
		content: `treemap "Product Usage" {
  layout slice-dice
  padding 10
  gap 6

  group "North America" value:60 color:"#bfdbfe" {
    item "Enterprise" value:40
    item "SMB" value:20
  }
  group "EMEA" value:25 color:"#fecdd3" {
    item "Enterprise" value:15
    item "SMB" value:10
  }
  group "APAC" value:15 color:"#bbf7d0" {
    item "Enterprise" value:8
    item "SMB" value:7
  }
}`,
		name: 'Untitled Treemap'
	},

	[ProfileName.electrical]: {
		content: `electrical "My Circuit" {
  net VCC, GND
  
  // Add your electrical components here
  // Example: part R1 type:R value:"1k" pins:(VCC,GND)
}`,
		name: 'Untitled Circuit'
	},

	[ProfileName.control]: {
		content: `control "Motor Start-Stop" {
  variant ladder
  net L1, L2, M1, M2

  part Start type:NO_CONTACT pins:(L1,M1) doc:"Start button"
  part Stop type:NC_CONTACT pins:(M1,M2) doc:"Stop button"
  part Motor type:COIL pins:(M2,L2) doc:"Motor coil"
}`,
		name: 'Untitled Control Diagram'
	},

	[ProfileName.digital]: {
		content: `digital "My Digital Circuit" {
  // Define a reusable module
  module Counter ports:(clk, reset, count[3:0])

  // Declare nets
  net clk, reset
  net count[3:0]

  // Instantiate the module
  inst U1 of:Counter map:(clk:clk, reset:reset, count:count)
}`,
		name: 'Untitled Digital Circuit'
	},

	[ProfileName.pneumatic]: {
		content: `pneumatic "My Pneumatic Circuit" {
  pressure 6 bar operating
  flowRate 500 L/min
  
  net SUPPLY
  net PORT_A
  net PORT_B
  
  // Add your pneumatic components here
  // Example: part C1 CYL_DA pins:(PORT_A,PORT_B) doc:"Cylinder"
}`,
		name: 'Untitled Pneumatic'
	},

	[ProfileName.hydraulic]: {
		content: `hydraulic "My Hydraulic Circuit" {
  pressure 210 bar operating
  flowRate 40 L/min
  fluid mineral "ISO VG 46"
  
  net TANK
  net PUMP
  net PORT_A
  net PORT_B
  
  // Add your hydraulic components here
  // Example: part P1 PUMP_FIXED pins:(TANK,PUMP) doc:"Main pump"
}`,
		name: 'Untitled Hydraulic'
	},

	[ProfileName.hvac]: {
		content: `hvac "Office HVAC System" {
  equipment AHU1 type:air-handling-unit cfm:5000
  equipment Coil1 type:cooling-coil capacity:"10 tons"
  equipment VAV1 type:vav-box cfm-max:1000
  equipment Diff1 type:diffuser-supply

  duct Supply type:supply size:"16x12"
  duct Return type:return size:"20x14"

  connect AHU1.out -> Supply -> VAV1.in
  connect VAV1.out -> Diff1.in
  connect Diff1.out -> Return -> AHU1.in
}`,
		name: 'Untitled HVAC'
	},

	[ProfileName.wardley]: {
		content: `wardley "My Strategy Map" {
  // Define user needs at the top
  anchor "User Need" value:0.95
  
  // Add components with evolution (0=genesis, 1=commodity) and value (0=invisible, 1=visible)
  component "Product" evolution:0.7 value:0.8
  component "Platform" evolution:0.5 value:0.6
  component "Infrastructure" evolution:0.9 value:0.3
  
  // Define dependencies
  dependency from:"User Need" to:"Product"
  dependency from:"Product" to:"Platform"
  dependency from:"Platform" to:"Infrastructure"
}`,
		name: 'Untitled Wardley Map'
	},

	[ProfileName.railroad]: {
		content: `railroad "My Grammar" {
  diagram Expr = Term (("+" | "-") Term)*
  diagram Term = Factor (("*" | "/") Factor)*
  diagram Factor = Number | "(" Expr ")"
  diagram Number = digit+
}`,
		name: 'Untitled Railroad Diagram'
	},

	[ProfileName.glyphset]: {
		content: `glyphset columnList "Our Tech Stack" {
	theme "forest"
	item "TypeScript"
	item "React"
	item "Node.js"
	item "PostgreSQL"
	item "Redis"
	item "Docker"
	item "Kubernetes"
	item "AWS"

	columns 2
}`,
		name: 'Untitled Glyph Set'
	}
};

export function getTemplate(type: ProfileName): DiagramTemplate {
	return diagramTemplates[type] || diagramTemplates[ProfileName.diagram];
}
