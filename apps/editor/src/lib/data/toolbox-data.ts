export interface Shape {
	id: string;
	label: string;
	code: string;
}

export interface ShapeCategory {
	id: string;
	label: string;
	shapes: Shape[];
	electricalOnly?: boolean;
}

export interface Sample {
	name: string;
	description: string;
	code: string;
}

export interface SampleCategory {
	id: string;
	label: string;
	samples: Sample[];
}

export const shapeCategories: ShapeCategory[] = [
	{
		id: 'basic',
		label: 'Basic Shapes',
		shapes: [
			{ id: 'rectangle', label: 'Rectangle', code: 'shape id as @rectangle label:"Label"' },
			{
				id: 'roundedRectangle',
				label: 'Rounded Rectangle',
				code: 'shape id as @roundedRectangle label:"Label"'
			},
			{ id: 'circle', label: 'Circle', code: 'shape id as @circle label:"Label"' },
			{
				id: 'smallCircle',
				label: 'Small Circle',
				code: 'shape id as @smallCircle label:"Label"'
			},
			{
				id: 'doubleCircle',
				label: 'Double Circle',
				code: 'shape id as @doubleCircle label:"Label"'
			},
			{
				id: 'framedCircle',
				label: 'Framed Circle',
				code: 'shape id as @framedCircle label:"Label"'
			},
			{
				id: 'crossCircle',
				label: 'Cross Circle',
				code: 'shape id as @crossCircle label:"Label"'
			},
			{
				id: 'filledCircle',
				label: 'Filled Circle',
				code: 'shape id as @filledCircle label:"Label"'
			},
			{ id: 'ellipseWide', label: 'Ellipse', code: 'shape id as @ellipseWide label:"Label"' },
			{ id: 'rhombus', label: 'Diamond', code: 'shape id as @rhombus label:"Label"' },
			{ id: 'hexagon', label: 'Hexagon', code: 'shape id as @hexagon label:"Label"' },
			{ id: 'stadium', label: 'Stadium', code: 'shape id as @stadium label:"Label"' },
			{ id: 'triangle', label: 'Triangle', code: 'shape id as @triangle label:"Label"' },
			{
				id: 'flippedTriangle',
				label: 'Flipped Triangle',
				code: 'shape id as @flippedTriangle label:"Label"'
			},
			{
				id: 'parallelogram',
				label: 'Parallelogram',
				code: 'shape id as @parallelogram label:"Label"'
			},
			{ id: 'trapezoid', label: 'Trapezoid', code: 'shape id as @trapezoid label:"Label"' },
			{
				id: 'flippedTrapezoid',
				label: 'Flipped Trapezoid',
				code: 'shape id as @flippedTrapezoid label:"Label"'
			},
			{
				id: 'container',
				label: 'Container',
				code: `container id "Container" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:2 {
  // Add shapes here
  shape s1 as @rectangle label:"Shape"
}`
			}
		]
	},
	{
		id: 'flowchart',
		label: 'Flowchart',
		shapes: [
			{ id: 'rectangle', label: 'Process', code: 'shape id as @rectangle label:"Process"' },
			{ id: 'rhombus', label: 'Decision', code: 'shape id as @rhombus label:"Decision?"' },
			{
				id: 'parallelogram',
				label: 'Input/Output',
				code: 'shape id as @parallelogram label:"Input/Output"'
			},
			{
				id: 'leanLeft',
				label: 'Data (Lean Left)',
				code: 'shape id as @leanLeft label:"Data"'
			},
			{ id: 'stadium', label: 'Start/End', code: 'shape id as @stadium label:"Start"' },
			{
				id: 'predefinedProcess',
				label: 'Predefined Process',
				code: 'shape id as @predefinedProcess label:"Subroutine"'
			},
			{
				id: 'preparation',
				label: 'Preparation',
				code: 'shape id as @preparation label:"Setup"'
			},
			{
				id: 'manualInput',
				label: 'Manual Input',
				code: 'shape id as @manualInput label:"Manual Input"'
			},
			{
				id: 'trapezoid',
				label: 'Manual Operation',
				code: 'shape id as @trapezoid label:"Manual"'
			},
			{
				id: 'decisionManual',
				label: 'Manual Decision',
				code: 'shape id as @decisionManual label:"Choose"'
			},
			{ id: 'document', label: 'Document', code: 'shape id as @document label:"Document"' },
			{
				id: 'linedDocument',
				label: 'Lined Document',
				code: 'shape id as @linedDocument label:"Document"'
			},
			{
				id: 'multiDocument',
				label: 'Multiple Documents',
				code: 'shape id as @multiDocument label:"Documents"'
			},
			{
				id: 'taggedDocument',
				label: 'Tagged Document',
				code: 'shape id as @taggedDocument label:"Document"'
			},
			{
				id: 'paperTape',
				label: 'Paper Tape',
				code: 'shape id as @flag label:"Tape"'
			},
			{
				id: 'card',
				label: 'Punched Card',
				code: 'shape id as @card label:"Card"'
			},
			{ id: 'display', label: 'Display', code: 'shape id as @display label:"Display"' },
			{ id: 'delay', label: 'Delay', code: 'shape id as @delay label:"Wait"' },
			{
				id: 'offPageConnector',
				label: 'Off-Page Connector',
				code: 'shape id as @offPageConnector label:"A"'
			}
		]
	},
	{
		id: 'storage',
		label: 'Data Storage',
		shapes: [
			{ id: 'cylinder', label: 'Database', code: 'shape id as @cylinder label:"Database"' },
			{
				id: 'hCylinder',
				label: 'Horizontal Cylinder',
				code: 'shape id as @hCylinder label:"Storage"'
			},
			{ id: 'diskStorage', label: 'Disk Storage', code: 'shape id as @diskStorage label:"Disk"' },
			{ id: 'storedData', label: 'Stored Data', code: 'shape id as @storedData label:"Data"' },
			{
				id: 'internalStorage',
				label: 'Internal Storage',
				code: 'shape id as @internalStorage label:"Storage"'
			},
			{
				id: 'sequentialStorage',
				label: 'Sequential Storage',
				code: 'shape id as @sequentialStorage label:"Tape"'
			},
			{
				id: 'directStorage',
				label: 'Direct Storage',
				code: 'shape id as @directStorage label:"Direct"'
			}
		]
	},
	{
		id: 'uml',
		label: 'UML',
		shapes: [
			// Class Diagrams
			{ id: 'class', label: 'Class', code: 'shape id as @class label:"ClassName"' },
			{ id: 'interface', label: 'Interface', code: 'shape id as @interface label:"IRepository"' },
			{ id: 'abstract', label: 'Abstract Class', code: 'shape id as @abstract label:"Vehicle"' },
			{ id: 'enum', label: 'Enumeration', code: 'shape id as @enum label:"Priority"' },
			{
				id: 'package',
				label: 'Package',
				code: 'shape id as @package label:"com.example.models"'
			},
			{ id: 'note', label: 'Note', code: 'shape id as @note label:"Important note here"' },
			// Use Case Diagrams
			{ id: 'actor', label: 'Actor', code: 'shape id as @actor label:"Actor"' },
			{
				id: 'systemBoundary',
				label: 'System Boundary',
				code: 'shape id as @systemBoundary label:"System"'
			},
			// Sequence Diagrams
			{ id: 'lifeline', label: 'Lifeline', code: 'shape id as @lifeline label:"Controller"' },
			{ id: 'activation', label: 'Activation', code: 'shape id as @activation' },
			{ id: 'fragment', label: 'Fragment', code: 'shape id as @fragment label:"alt"' },
			{ id: 'deletion', label: 'Deletion', code: 'shape id as @deletion' },
			// State Machine Diagrams
			{ id: 'state', label: 'State', code: 'shape id as @state label:"Active"' },
			{ id: 'initialState', label: 'Initial State', code: 'shape id as @initialState' },
			{ id: 'finalState', label: 'Final State', code: 'shape id as @finalState' },
			{ id: 'choice', label: 'Choice', code: 'shape id as @choice label:"[x > 0]"' },
			{ id: 'fork', label: 'Fork/Join Bar', code: 'shape id as @fork' },
			// Activity Diagrams
			{ id: 'activity', label: 'Activity', code: 'shape id as @activity label:"Process Order"' },
			{ id: 'activityDecision', label: 'Decision', code: 'shape id as @activityDecision label:"[approved?]"' },
			{ id: 'activityMerge', label: 'Merge', code: 'shape id as @activityMerge label:""' }
		]
	},
	{
		id: 'c4',
		label: 'C4 Architecture',
		shapes: [
			{
				id: 'c4-person',
				label: 'Person',
				code: 'shape id as @c4-person label:"User"'
			},
			{
				id: 'c4-system',
				label: 'Software System',
				code: 'shape id as @c4-system label:"System Name"'
			},
			{
				id: 'c4-container',
				label: 'Container',
				code: 'shape id as @c4-container label:"Web App\\n[React, TypeScript]"'
			},
			{
				id: 'c4-component',
				label: 'Component',
				code: 'shape id as @c4-component label:"Controller"'
			}
		]
	},
	{
		id: 'network',
		label: 'Network',
		shapes: [
			{ id: 'server', label: 'Server', code: 'shape id as @server label:"Server"' },
			{ id: 'router', label: 'Router', code: 'shape id as @router label:"Router"' },
			{ id: 'switch', label: 'Switch', code: 'shape id as @switch label:"Switch"' },
			{ id: 'firewall', label: 'Firewall', code: 'shape id as @firewall label:"Firewall"' },
			{
				id: 'loadBalancer',
				label: 'Load Balancer',
				code: 'shape id as @loadBalancer label:"Load Balancer"'
			},
			{ id: 'cloud', label: 'Cloud', code: 'shape id as @cloud label:"Cloud"' },
			{ id: 'storage', label: 'Storage', code: 'shape id as @storage label:"Storage"' }
		]
	},
	{
		id: 'control-systems',
		label: 'Control Systems',
		shapes: [
			{
				id: 'transferFunction',
				label: 'Transfer Function',
				code: 'shape id as @transferFunction label:"H(s)"'
			},
			{ id: 'gain', label: 'Gain', code: 'shape id as @gain label:"K"' },
			{ id: 'integrator', label: 'Integrator', code: 'shape id as @integrator label:"1/s"' },
			{
				id: 'differentiator',
				label: 'Differentiator',
				code: 'shape id as @differentiator label:"s"'
			},
			{ id: 'timeDelay', label: 'Time Delay', code: 'shape id as @timeDelay label:"Delay"' },
			{ id: 'saturation', label: 'Saturation', code: 'shape id as @saturation label:"Sat"' },
			{
				id: 'summingJunction',
				label: 'Summing Junction',
				code: 'shape id as @summingJunction label:"+"'
			},
			{
				id: 'multiplyJunction',
				label: 'Multiply',
				code: 'shape id as @multiplyJunction label:"×"'
			},
			{ id: 'divideJunction', label: 'Divide', code: 'shape id as @divideJunction label:"÷"' },
			{
				id: 'compareJunction',
				label: 'Compare',
				code: 'shape id as @compareJunction label:"="'
			}
		]
	},
	{
		id: 'charts',
		label: 'Charts & Diagrams',
		shapes: [
			{
				id: 'pieChart',
				label: 'Pie Chart',
				code: 'shape id as @pieChart label:"Sales" data:[30,20,50]'
			},
			{
				id: 'barChartVertical',
				label: 'Bar Chart (Vertical)',
				code: 'shape id as @barChartVertical label:"Data" data:[10,20,15]'
			},
			{
				id: 'barChartHorizontal',
				label: 'Bar Chart (Horizontal)',
				code: 'shape id as @barChartHorizontal label:"Data" data:[10,20,15]'
			},
			{
				id: 'venn2',
				label: 'Venn Diagram (2)',
				code: 'shape id as @venn2 label:"Sets" data:[{"setA":100},{"setB":80},{"intersection":30},{"labelA":"Set A"},{"labelB":"Set B"}]'
			},
			{
				id: 'venn3',
				label: 'Venn Diagram (3)',
				code: 'shape id as @venn3 label:"Sets" data:[{"setA":120},{"setB":100},{"setC":80},{"AB":35},{"AC":28},{"BC":22},{"ABC":15},{"labelA":"Set A"},{"labelB":"Set B"},{"labelC":"Set C"}]'
			},
			{
				id: 'venn4',
				label: 'Venn Diagram (4)',
				code: 'shape id as @venn4 label:"Sets" data:[{"setA":100},{"setB":100},{"setC":100},{"setD":100}]'
			},
			{
				id: 'pyramid',
				label: 'Pyramid',
				code: 'shape id as @pyramid label:"Hierarchy" data:[{"label":"Top","value":100},{"label":"Middle","value":200},{"label":"Bottom","value":300}]'
			}
		]
	},
	{
		id: 'special',
		label: 'Special',
		shapes: [
			{ id: 'textBlock', label: 'Text Block', code: 'shape id as @textBlock label:"Note"' },
			{ id: 'braceLeft', label: 'Brace Left', code: 'shape id as @braceLeft label:""' },
			{ id: 'braceRight', label: 'Brace Right', code: 'shape id as @braceRight label:""' },
			{ id: 'lightning', label: 'Lightning Bolt', code: 'shape id as @lightning label:""' },
			{ id: 'hourglass', label: 'Hourglass', code: 'shape id as @hourglass label:""' },
			{ id: 'fork', label: 'Fork/Join', code: 'shape id as @fork label:""' },
			{ id: 'or', label: 'OR Symbol', code: 'shape id as @or label:""' }
		]
	},
	{
		id: 'rect-variants',
		label: 'Rectangle Variants',
		shapes: [
			{
				id: 'framedRectangle',
				label: 'Framed Rectangle',
				code: 'shape id as @framedRectangle label:"Frame"'
			},
			{
				id: 'multiRectangle',
				label: 'Multi Rectangle',
				code: 'shape id as @multiRectangle label:"Stack"'
			},
			{
				id: 'linedRectangle',
				label: 'Lined Rectangle',
				code: 'shape id as @linedRectangle label:"Lined"'
			},
			{
				id: 'dividedRectangle',
				label: 'Divided Rectangle',
				code: 'shape id as @dividedRectangle label:"Divided"'
			},
			{
				id: 'taggedRectangle',
				label: 'Tagged Rectangle',
				code: 'shape id as @taggedRectangle label:"Tagged"'
			},
			{
				id: 'notchedRectangle',
				label: 'Notched Rectangle',
				code: 'shape id as @notchedRectangle label:"Notch"'
			},
			{
				id: 'notchedPentagon',
				label: 'Notched Pentagon',
				code: 'shape id as @notchedPentagon label:"Notch"'
			}
		]
	},
	{
		id: 'pedigree',
		label: 'Pedigree Charts',
		shapes: [
			{ id: 'pedigreeMale', label: 'Male', code: 'shape id as @pedigreeMale label:"M"' },
			{ id: 'pedigreeFemale', label: 'Female', code: 'shape id as @pedigreeFemale label:"F"' },
			{ id: 'pedigreeUnknown', label: 'Unknown', code: 'shape id as @pedigreeUnknown label:"?"' }
		]
	},
	{
		id: 'quantum',
		label: 'Quantum Circuits',
		shapes: [
			{ id: 'gateX', label: 'X Gate (Pauli-X)', code: 'shape id as @gateX label:"X"' },
			{ id: 'gateY', label: 'Y Gate (Pauli-Y)', code: 'shape id as @gateY label:"Y"' },
			{ id: 'gateZ', label: 'Z Gate (Pauli-Z)', code: 'shape id as @gateZ label:"Z"' },
			{ id: 'gateH', label: 'H Gate (Hadamard)', code: 'shape id as @gateH label:"H"' },
			{ id: 'gateS', label: 'S Gate (Phase)', code: 'shape id as @gateS label:"S"' },
			{ id: 'gateT', label: 'T Gate (π/8)', code: 'shape id as @gateT label:"T"' },
			{ id: 'controlDot', label: 'Control Dot', code: 'shape id as @controlDot label:""' },
			{ id: 'cnotTarget', label: 'CNOT Target', code: 'shape id as @cnotTarget label:""' },
			{ id: 'swapX', label: 'Swap Gate', code: 'shape id as @swapX label:""' },
			{ id: 'measurement', label: 'Measurement', code: 'shape id as @measurement label:"M"' },
			{ id: 'qubitWire', label: 'Qubit Wire', code: 'shape id as @qubitWire label:""' },
			{ id: 'barrier', label: 'Barrier', code: 'shape id as @barrier label:""' }
		]
	},
	{
		id: 'electrical',
		label: 'Electrical Components',
		electricalOnly: true,
		shapes: [
			{ id: 'resistor', label: 'Resistor', code: 'part id type:R value:"1k" pins:(N1,N2)' },
			{ id: 'capacitor', label: 'Capacitor', code: 'part id type:C value:"1u" pins:(N1,N2)' },
			{ id: 'inductor', label: 'Inductor', code: 'part id type:L value:"1m" pins:(N1,N2)' },
			{ id: 'transformer', label: 'Transformer', code: 'part id type:XFMR pins:(P1,P2,S1,S2)' },
			{
				id: 'voltageSource',
				label: 'Voltage Source',
				code: 'part id type:V value:"5" pins:(VCC,GND)'
			},
			{
				id: 'currentSource',
				label: 'Current Source',
				code: 'part id type:I value:"1m" pins:(N1,N2)'
			},
			{ id: 'ground', label: 'Ground', code: 'part id type:GND pins:(GND)' },
			{ id: 'junction', label: 'Junction', code: 'part id type:JUNC pins:(N1)' },
			{ id: 'diode', label: 'Diode', code: 'part id type:D pins:(N1,N2)' },
			{ id: 'led', label: 'LED', code: 'part id type:LED pins:(N1,N2)' },
			{ id: 'npnTransistor', label: 'NPN Transistor', code: 'part id type:NPN pins:(C,B,E)' },
			{ id: 'pnpTransistor', label: 'PNP Transistor', code: 'part id type:PNP pins:(C,B,E)' },
			{ id: 'nmosTransistor', label: 'NMOS', code: 'part id type:NMOS pins:(D,G,S)' },
			{ id: 'pmosTransistor', label: 'PMOS', code: 'part id type:PMOS pins:(D,G,S)' },
			{ id: 'opamp', label: 'Op-Amp', code: 'part id type:OPAMP pins:(OUT,INP,INN,VCC,GND)' }
		]
	},
	{
		id: 'logic-gates',
		label: 'Logic Gates',
		electricalOnly: true,
		shapes: [
			{ id: 'andGate', label: 'AND (2-input)', code: 'part id type:AND pins:(A,B,Y)' },
			{ id: 'orGate', label: 'OR (2-input)', code: 'part id type:OR pins:(A,B,Y)' },
			{ id: 'notGate', label: 'NOT', code: 'part id type:NOT pins:(A,Y)' },
			{ id: 'bufferGate', label: 'Buffer', code: 'part id type:BUF pins:(A,Y)' },
			{ id: 'xorGate', label: 'XOR', code: 'part id type:XOR pins:(A,B,Y)' },
			{ id: 'xnorGate', label: 'XNOR', code: 'part id type:XNOR pins:(A,B,Y)' },
			{ id: 'nandGate', label: 'NAND (2-input)', code: 'part id type:NAND pins:(A,B,Y)' },
			{ id: 'norGate', label: 'NOR (2-input)', code: 'part id type:NOR pins:(A,B,Y)' },
			{ id: 'and3Gate', label: 'AND (3-input)', code: 'part id type:AND3 pins:(A,B,C,Y)' },
			{ id: 'or3Gate', label: 'OR (3-input)', code: 'part id type:OR3 pins:(A,B,C,Y)' },
			{ id: 'nand3Gate', label: 'NAND (3-input)', code: 'part id type:NAND3 pins:(A,B,C,Y)' },
			{ id: 'nor3Gate', label: 'NOR (3-input)', code: 'part id type:NOR3 pins:(A,B,C,Y)' }
		]
	},
	{
		id: 'digital-components',
		label: 'Digital Components',
		electricalOnly: true,
		shapes: [
			{ id: 'dFlipFlop', label: 'D Flip-Flop', code: 'part id type:DFF pins:(D,CLK,Q,QB)' },
			{ id: 'jkFlipFlop', label: 'JK Flip-Flop', code: 'part id type:JKFF pins:(J,K,CLK,Q,QB)' },
			{ id: 'tFlipFlop', label: 'T Flip-Flop', code: 'part id type:TFF pins:(T,CLK,Q,QB)' },
			{
				id: 'register4',
				label: '4-bit Register',
				code: 'part id type:REG4 pins:(D0,D1,D2,D3,CLK,Q0,Q1,Q2,Q3)'
			},
			{
				id: 'register8',
				label: '8-bit Register',
				code: 'part id type:REG8 pins:(D0,D1,D2,D3,D4,D5,D6,D7,CLK,Q0,Q1,Q2,Q3,Q4,Q5,Q6,Q7)'
			},
			{
				id: 'mux4to1',
				label: '4-to-1 Mux',
				code: 'part id type:MUX4 pins:(D0,D1,D2,D3,S0,S1,Y)'
			},
			{
				id: 'mux8to1',
				label: '8-to-1 Mux',
				code: 'part id type:MUX8 pins:(D0,D1,D2,D3,D4,D5,D6,D7,S0,S1,S2,Y)'
			},
			{
				id: 'decoder2to4',
				label: '2-to-4 Decoder',
				code: 'part id type:DEC24 pins:(A0,A1,Y0,Y1,Y2,Y3)'
			},
			{
				id: 'decoder3to8',
				label: '3-to-8 Decoder',
				code: 'part id type:DEC38 pins:(A0,A1,A2,Y0,Y1,Y2,Y3,Y4,Y5,Y6,Y7)'
			}
		]
	}
];

export const sampleDiagrams: SampleCategory[] = [
	{
		id: 'flowcharts',
		label: 'Flowcharts',
		samples: [
			{
				name: 'Simple Process Flow',
				description: 'Basic process with decision',
				code: `diagram "Process Flow"

shape start as @stadium label:"Start"
shape process1 as @rectangle label:"Process Data"
shape decision as @rhombus label:"Valid?"
shape process2 as @rectangle label:"Save"
shape end as @stadium label:"End"

start -> process1
process1 -> decision
decision -Yes-> process2
decision -No-> end
process2 -> end`
			},
			{
				name: 'User Login Flow',
				description: 'Authentication workflow with error handling',
				code: `diagram "User Login"

shape start as @stadium label:"Start"
shape input as @parallelogram label:"Enter Credentials"
shape validate as @rhombus label:"Valid?"
shape checkAttempts as @rhombus label:"Attempts < 3?"
shape success as @rectangle label:"Grant Access"
shape lockout as @rectangle label:"Lock Account"
shape end as @stadium label:"End"

start -> input
input -> validate
validate -Yes-> success
validate -No-> checkAttempts
checkAttempts -Yes-> input
checkAttempts -No-> lockout
success -> end
lockout -> end`
			},
			{
				name: 'Document Approval',
				description: 'Multi-step approval process',
				code: `diagram "Document Approval"

shape submit as @stadium label:"Submit"
shape review as @rectangle label:"Manager Review"
shape approved as @rhombus label:"Approved?"
shape director as @rectangle label:"Director Review"
shape finalApproval as @rhombus label:"Final Approval?"
shape archive as @document label:"Archive"
shape reject as @rectangle label:"Reject"
shape end as @stadium label:"End"

submit -> review
review -> approved
approved -Yes-> director
approved -No-> reject
director -> finalApproval
finalApproval -Yes-> archive
finalApproval -No-> reject
archive -> end
reject -> end`
			},
			{
				name: 'Data Processing Loop',
				description: 'Iterative data processing with loop',
				code: `diagram "Data Processing"

shape start as @stadium label:"Start"
shape loadData as @parallelogram label:"Load Data"
shape processRecord as @rectangle label:"Process Record"
shape hasMore as @rhombus label:"More Records?"
shape save as @cylinder label:"Save Results"
shape end as @stadium label:"End"

start -> loadData
loadData -> processRecord
processRecord -> hasMore
hasMore -Yes-> processRecord
hasMore -No-> save
save -> end`
			}
		]
	},
	{
		id: 'network',
		label: 'Network Diagrams',
		samples: [
			{
				name: 'Simple Network',
				description: 'Basic client-server architecture',
				code: `diagram "Simple Network"

shape client1 as @rectangle label:"Client 1"
shape client2 as @rectangle label:"Client 2"
shape router as @router label:"Router"
shape server as @server label:"Web Server"
shape db as @cylinder label:"Database"

client1 -> router
client2 -> router
router -> server
server -> db`
			},
			{
				name: 'Three-Tier Architecture',
				description: 'Web application architecture',
				code: `diagram "Three-Tier Architecture"

shape lb as @loadBalancer label:"Load Balancer"
shape web1 as @server label:"Web Server 1"
shape web2 as @server label:"Web Server 2"
shape app1 as @server label:"App Server 1"
shape app2 as @server label:"App Server 2"
shape db as @cylinder label:"Database"
shape cache as @cylinder label:"Cache"

lb -> web1
lb -> web2
web1 -> app1
web2 -> app2
app1 -> db
app2 -> db
app1 -> cache
app2 -> cache`
			},
			{
				name: 'Cloud Infrastructure',
				description: 'Cloud-based system with firewall',
				code: `diagram "Cloud Infrastructure"

shape internet as @cloud label:"Internet"
shape fw as @firewall label:"Firewall"
shape lb as @loadBalancer label:"Load Balancer"
shape web as @server label:"Web Tier"
shape app as @server label:"App Tier"
shape storage as @storage label:"Storage"

internet -> fw
fw -> lb
lb -> web
web -> app
app -> storage`
			}
		]
	},
	{
		id: 'uml',
		label: 'UML Diagrams',
		samples: [
			{
				name: 'Simple Use Case',
				description: 'User authentication use case',
				code: `diagram "Authentication Use Case"

shape user as @actor label:"User"
shape admin as @actor label:"Admin"

container boundary "Auth System" as @systemBoundary {
  shape login as @ellipseWide label:"Login"
  shape register as @ellipseWide label:"Register"
  shape resetPwd as @ellipseWide label:"Reset Password"
}

user -> login
user -> register
user -> resetPwd
admin -> login`
			},
			{
				name: 'Class Diagram',
				description: 'Simple class hierarchy with interface',
				code: `diagram "Class Hierarchy"

shape iShape as @interface label:"IShape"
shape shape as @abstract label:"Shape"
shape circle as @class label:"Circle"
shape rectangle as @class label:"Rectangle"
shape colors as @enum label:"Color"
shape note1 as @note label:"All shapes implement IShape"

iShape -> shape
shape -> circle
shape -> rectangle
circle .. colors
note1 .. shape`
			},
			{
				name: 'Sequence Diagram',
				description: 'User authentication flow',
				code: `diagram "Authentication Sequence"

shape user as @lifeline label:"User"
shape ui as @lifeline label:"LoginUI"
shape controller as @lifeline label:"AuthController"
shape db as @lifeline label:"Database"

user -enter credentials-> ui
ui -authenticate-> controller
controller -validateUser-> db
db -user data-> controller
controller -token-> ui
ui -show home-> user`
			},
			{
				name: 'State Machine',
				description: 'Order processing states',
				code: `diagram "Order State Machine"

shape initial as @initialState
shape final as @finalState
shape pending as @state label:"Pending"
shape processing as @state label:"Processing"
shape shipped as @state label:"Shipped"
shape delivered as @state label:"Delivered"
shape cancelled as @state label:"Cancelled"
shape choice1 as @choice label:"[valid?]"
shape fork1 as @fork

initial -> pending
pending -> choice1
choice1 -yes-> processing
choice1 -no-> cancelled
processing -> fork1
fork1 -> shipped
shipped -> delivered
delivered -> final
cancelled -> final`
			},
			{
				name: 'Activity Diagram',
				description: 'Online shopping process flow',
				code: `diagram "Online Shopping Activity"

shape start as @initialState
shape end as @finalState

shape browse as @activity label:"Browse Products"
shape addCart as @activity label:"Add to Cart"
shape checkout as @activity label:"Checkout"
shape decision1 as @activityDecision label:"[has account?]"
shape register as @activity label:"Register"
shape login as @activity label:"Login"
shape merge1 as @activityMerge
shape payment as @activity label:"Enter Payment"
shape decision2 as @activityDecision label:"[payment valid?]"
shape fork1 as @fork
shape processPayment as @activity label:"Process Payment"
shape sendConfirm as @activity label:"Send Confirmation"
shape updateInventory as @activity label:"Update Inventory"
shape join1 as @join

start -> browse
browse -> addCart
addCart -> checkout
checkout -> decision1
decision1 -no-> register
decision1 -yes-> login
register -> merge1
login -> merge1
merge1 -> payment
payment -> decision2
decision2 -no-> payment
decision2 -yes-> fork1
fork1 -> processPayment
fork1 -> sendConfirm
fork1 -> updateInventory
processPayment -> join1
sendConfirm -> join1
updateInventory -> join1
join1 -> end`
			}
		]
	},
	{
		id: 'c4-architecture',
		label: 'C4 Architecture',
		samples: [
			{
				name: 'System Context',
				description: 'C4 Level 1: Banking system context',
				code: `diagram "Banking System - Context"
direction: TB

shape customer as @c4-person label:"Customer"
shape bankingSystem as @c4-system label:"Internet Banking\\nSystem"
shape emailSystem as @c4-system label:"Email System"
shape mainframe as @c4-system label:"Mainframe\\nBanking System"

customer -Uses-> bankingSystem
bankingSystem -Sends emails-> emailSystem
bankingSystem -Uses-> mainframe`
			},
			{
				name: 'Container Diagram',
				description: 'C4 Level 2: System containers',
				code: `diagram "Banking System - Containers"
direction: TB

shape customer as @c4-person label:"Customer"

container web "Web Container" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:2 {
  shape webapp as @c4-container label:"Single-Page App\\n[JavaScript, React]"
  shape api as @c4-container label:"API Application\\n[Java, Spring Boot]"
  shape db as @c4-container label:"Database\\n[Oracle]"
}

shape emailSystem as @c4-system label:"Email System"

customer -Uses [HTTPS]-> webapp
webapp -API calls [JSON/HTTPS]-> api
api -Reads/Writes [SQL/TCP]-> db
api -Sends emails [SMTP]-> emailSystem`
			},
			{
				name: 'Component Diagram',
				description: 'C4 Level 3: API components',
				code: `diagram "API Application - Components"
direction: TB

shape webapp as @c4-container label:"Web Application"

container apiContainer "API Container" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:2 {
  shape controller as @c4-component label:"REST Controller"
  shape security as @c4-component label:"Security Component"
  shape emailComponent as @c4-component label:"Email Component"
  shape accountComponent as @c4-component label:"Account Component"
}

shape db as @c4-container label:"Database"

webapp -Makes API calls-> controller
controller -Uses-> security
controller -Uses-> emailComponent
controller -Uses-> accountComponent
accountComponent -Reads/Writes-> db`
			},
			{
				name: 'Microservices Architecture',
				description: 'C4 Container view with multiple services',
				code: `diagram "E-Commerce Platform"
direction: LR

shape customer as @c4-person label:"Customer"
shape admin as @c4-person label:"Admin"

container frontend "Frontend" backgroundColor:"#fce4ec" borderColor:"#c2185b" borderWidth:2 {
  shape web as @c4-container label:"Web UI\\n[React]"
  shape mobile as @c4-container label:"Mobile App\\n[Flutter]"
}

container backend "Backend Services" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:2 {
  shape gateway as @c4-container label:"API Gateway\\n[Node.js]"
  shape auth as @c4-container label:"Auth Service\\n[Java]"
  shape catalog as @c4-container label:"Catalog Service\\n[Python]"
  shape orders as @c4-container label:"Orders Service\\n[Go]"
}

container data "Data Layer" backgroundColor:"#f3e5f5" borderColor:"#7b1fa2" borderWidth:2 {
  shape userDb as @c4-container label:"User DB\\n[PostgreSQL]"
  shape catalogDb as @c4-container label:"Catalog DB\\n[MongoDB]"
  shape cache as @c4-container label:"Cache\\n[Redis]"
}

customer -Uses-> web
customer -Uses-> mobile
admin -Manages-> web

web -API Calls-> gateway
mobile -API Calls-> gateway

gateway -Authenticates-> auth
gateway -Fetches Products-> catalog
gateway -Places Orders-> orders

auth -Reads/Writes-> userDb
catalog -Reads-> catalogDb
orders -Writes-> cache`
			}
		]
	},
	{
		id: 'control-systems',
		label: 'Control Systems',
		samples: [
			{
				name: 'Feedback Control Loop',
				description: 'Classic feedback control system',
				code: `diagram "Feedback Control"

shape input as @circle label:"Input"
shape sum as @summingJunction label:"+"
shape controller as @transferFunction label:"K"
shape plant as @transferFunction label:"G(s)"
shape output as @circle label:"Output"
shape feedback as @transferFunction label:"H(s)"

input -> sum
sum -> controller
controller -> plant
plant -> output
output -> feedback
feedback -> sum`
			},
			{
				name: 'Signal Processing Chain',
				description: 'DSP filter chain',
				code: `diagram "Signal Processing"

shape input as @rectangle label:"Input"
shape lpf as @transferFunction label:"LPF"
shape gain as @gain label:"K=10"
shape integrator as @integrator label:"1/s"
shape output as @rectangle label:"Output"

input -> lpf
lpf -> gain
gain -> integrator
integrator -> output`
			}
		]
	},
	{
		id: 'containers',
		label: 'Containers & Grouping',
		samples: [
			{
				name: 'Simple Container',
				description: 'Basic container with shapes',
				code: `diagram "Simple Container"

container backend "Backend Services" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:3 {
  shape api as @hexagon label:"API"
  shape auth as @hexagon label:"Auth"
  shape db as @cylinder label:"Database"
  
  api -> auth
  api -> db
}

shape web as @roundedRectangle label:"Web Client"
web -> api`
			},
			{
				name: 'Multi-Region Deployment',
				description: 'Multiple containers for regions',
				code: `diagram "Multi-Region"
direction: LR

container useast "US East" backgroundColor:"#e8f5e9" borderColor:"#388e3c" borderWidth:3 {
  shape lb1 as @rectangle label:"Load Balancer"
  shape app1 as @roundedRectangle label:"App Server"
  shape db1 as @cylinder label:"DB Primary"
  
  lb1 -> app1
  app1 -> db1
}

container uswest "US West" backgroundColor:"#fff8e1" borderColor:"#f57f17" borderWidth:3 {
  shape lb2 as @rectangle label:"Load Balancer"
  shape app2 as @roundedRectangle label:"App Server"
  shape db2 as @cylinder label:"DB Replica"
  
  lb2 -> app2
  app2 -> db2
}

shape cdn as @cloud label:"CDN"
cdn -> lb1
cdn -> lb2
db1 -> db2 label:"Replication"`
			},
			{
				name: 'Microservices Architecture',
				description: 'Containers for service boundaries',
				code: `diagram "Microservices"

container frontend "Frontend" backgroundColor:"#fce4ec" borderColor:"#c2185b" borderWidth:2 {
  shape web as @roundedRectangle label:"Web UI"
  shape mobile as @roundedRectangle label:"Mobile UI"
}

container backend "Backend Services" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:2 {
  shape gateway as @hexagon label:"API Gateway"
  shape auth as @rectangle label:"Auth Service"
  shape orders as @rectangle label:"Orders Service"
  shape payments as @rectangle label:"Payments Service"
}

container data "Data Layer" backgroundColor:"#f3e5f5" borderColor:"#7b1fa2" borderWidth:2 {
  shape cache as @cylinder label:"Redis"
  shape db as @cylinder label:"PostgreSQL"
}

web -> gateway
mobile -> gateway
gateway -> auth
gateway -> orders
gateway -> payments
orders -> db
payments -> db
auth -> cache`
			}
		]
	},
	{
		id: 'org-charts',
		label: 'Organizational Charts',
		samples: [
			{
				name: 'Company Hierarchy',
				description: 'Simple org structure',
				code: `diagram "Company Organization"
direction: TB

shape ceo as @rectangle label:"CEO"
shape cto as @rectangle label:"CTO"
shape cfo as @rectangle label:"CFO"
shape dev1 as @rectangle label:"Dev Team Lead"
shape dev2 as @rectangle label:"QA Team Lead"
shape acc as @rectangle label:"Accounting"

ceo -> cto
ceo -> cfo
cto -> dev1
cto -> dev2
cfo -> acc`
			},
			{
				name: 'Project Team',
				description: 'Project team structure',
				code: `diagram "Project Team"
direction: TB

shape pm as @rectangle label:"Project Manager"
shape ba as @rectangle label:"Business Analyst"
shape dev as @rectangle label:"Development Lead"
shape qa as @rectangle label:"QA Lead"
shape dev1 as @roundedRectangle label:"Developer 1"
shape dev2 as @roundedRectangle label:"Developer 2"
shape qa1 as @roundedRectangle label:"Tester 1"

pm -> ba
pm -> dev
pm -> qa
dev -> dev1
dev -> dev2
qa -> qa1`
			}
		]
	},
	{
		id: 'data-viz',
		label: 'Data Visualizations',
		samples: [
			{
				name: 'Sales Dashboard',
				description: 'Multiple chart types',
				code: `diagram "Sales Dashboard"

shape pie as @pieChart label:"Market Share" data:[35,25,40]
shape bar as @barChartVertical label:"Quarterly Sales" data:[120,150,180,200]
shape pyramid as @pyramid label:"Sales Funnel" data:[{"label":"Leads","value":1000},{"label":"Qualified","value":500},{"label":"Closed","value":150}]`
			},
			{
				name: 'Venn Diagram',
				description: 'Set relationships',
				code: `diagram "Feature Comparison"

shape venn as @venn2 label:"Products" data:[{"setA":100},{"setB":80},{"intersection":30},{"labelA":"Product A"},{"labelB":"Product B"}]`
			}
		]
	},
	{
		id: 'pedigree',
		label: 'Pedigree Charts',
		samples: [
			{
				name: 'Family Tree',
				description: 'Three generation family tree',
				code: `diagram "Family Tree"
direction: TB

shape gf as @pedigreeMale label:"Grandfather"
shape gm as @pedigreeFemale label:"Grandmother"
shape f as @pedigreeMale label:"Father"
shape m as @pedigreeFemale label:"Mother"
shape s as @pedigreeMale label:"Son"
shape d as @pedigreeFemale label:"Daughter"

gf -> f
gm -> f
f -> s
f -> d
m -> s
m -> d`
			}
		]
	},
	{
		id: 'quantum',
		label: 'Quantum Circuits',
		samples: [
			{
				name: 'Bell State',
				description: 'Quantum entanglement circuit',
				code: `diagram "Bell State Circuit"

shape q0 as @qubitWire label:"q0"
shape q1 as @qubitWire label:"q1"
shape h as @gateH label:"H"
shape cnot as @cnotTarget label:"⊕"
shape ctrl as @controlDot label:"●"
shape m0 as @measurement label:"M"
shape m1 as @measurement label:"M"

q0 -> h
h -> ctrl
ctrl -> m0
q1 -> cnot
cnot -> m1`
			},
			{
				name: 'Quantum Teleportation',
				description: 'Simplified teleportation circuit',
				code: `diagram "Quantum Teleportation"

shape q0 as @qubitWire label:"ψ"
shape q1 as @qubitWire label:"q1"
shape q2 as @qubitWire label:"q2"
shape h as @gateH label:"H"
shape cnot1 as @cnotTarget label:"⊕"
shape cnot2 as @cnotTarget label:"⊕"
shape barrier as @barrier label:"|"
shape m as @measurement label:"M"

q0 -> h
q1 -> cnot1
h -> cnot2
barrier -> m`
			}
		]
	},
	{
		id: 'electrical',
		label: 'Electrical Circuits',
		samples: [
			{
				name: 'Simple LED Circuit',
				description: 'Basic LED with current-limiting resistor',
				code: `electrical "LED Circuit" {
  net VCC, GND, N1

  part V1 type:V value:"5V" pins:(VCC,GND)
  part R1 type:R value:"220" pins:(VCC,N1)
  part D1 type:LED pins:(N1,GND)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: 'RC Low-Pass Filter',
				description: 'First-order passive filter',
				code: `electrical "RC Filter" {
  net IN, OUT, GND

  part R1 type:R value:"1k" pins:(IN,OUT)
  part C1 type:C value:"100n" pins:(OUT,GND)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: 'Voltage Divider',
				description: 'Basic voltage divider circuit',
				code: `electrical "Voltage Divider" {
  net VCC, VOUT, GND

  part V1 type:V value:"12V" pins:(VCC,GND)
  part R1 type:R value:"10k" pins:(VCC,VOUT)
  part R2 type:R value:"10k" pins:(VOUT,GND)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: 'NPN Transistor Switch',
				description: 'Transistor as a switch',
				code: `electrical "Transistor Switch" {
  net VCC, BASE, COLL, GND

  part V1 type:V value:"5V" pins:(VCC,GND)
  part R1 type:R value:"1k" pins:(BASE,GND)
  part Q1 type:NPN pins:(COLL,BASE,GND)
  part R2 type:R value:"470" pins:(VCC,COLL)
  part LED1 type:LED pins:(COLL,GND)
  part GND1 type:GND pins:(GND)
}`
			}
		]
	},
	{
		id: 'logic',
		label: 'Logic Circuits',
		samples: [
			{
				name: 'Half Adder',
				description: 'Single-bit adder without carry-in',
				code: `electrical "Half Adder" {
  net A, B, SUM, CARRY, GND

  part XOR1 type:XOR pins:(A,B,SUM)
  part AND1 type:AND pins:(A,B,CARRY)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: 'Full Adder',
				description: 'Single-bit adder with carry',
				code: `electrical "Full Adder" {
  net A, B, CIN, S1, C1, SUM, COUT, GND

  part XOR1 type:XOR pins:(A,B,S1)
  part XOR2 type:XOR pins:(S1,CIN,SUM)
  part AND1 type:AND pins:(A,B,C1)
  part AND2 type:AND pins:(S1,CIN,C2)
  part OR1 type:OR pins:(C1,C2,COUT)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: 'SR Latch',
				description: 'Set-Reset latch using NOR gates',
				code: `electrical "SR Latch" {
  net S, R, Q, QB, GND

  part NOR1 type:NOR pins:(S,QB,Q)
  part NOR2 type:NOR pins:(R,Q,QB)
  part GND1 type:GND pins:(GND)
}`
			}
		]
	},
	{
		id: 'digital',
		label: 'Digital Systems',
		samples: [
			{
				name: '4-bit Counter',
				description: 'Synchronous 4-bit counter',
				code: `electrical "4-bit Counter" {
  net CLK, Q0, Q1, Q2, Q3, GND

  part FF0 type:DFF pins:(Q3,CLK,Q0,QB0)
  part FF1 type:DFF pins:(Q0,CLK,Q1,QB1)
  part FF2 type:DFF pins:(Q1,CLK,Q2,QB2)
  part FF3 type:DFF pins:(Q2,CLK,Q3,QB3)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: '2-to-4 Decoder',
				description: 'Address decoder circuit',
				code: `electrical "2-to-4 Decoder" {
  net A0, A1, Y0, Y1, Y2, Y3, GND

  part DEC1 type:DEC24 pins:(A0,A1,Y0,Y1,Y2,Y3)
  part GND1 type:GND pins:(GND)
}`
			},
			{
				name: '4-to-1 Multiplexer',
				description: 'Data selector circuit',
				code: `electrical "4-to-1 Multiplexer" {
  net D0, D1, D2, D3, S0, S1, Y, GND

  part MUX1 type:MUX4 pins:(D0,D1,D2,D3,S0,S1,Y)
  part GND1 type:GND pins:(GND)
}`
			}
		]
	}
];
