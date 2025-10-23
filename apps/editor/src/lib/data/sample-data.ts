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
shape baseShape as @abstract label:"Shape"
shape circle as @class label:"Circle"
shape rectangle as @class label:"Rectangle"
shape colors as @enum label:"Color"
shape note1 as @note label:"All shapes implement IShape"

iShape -> baseShape
baseShape -> circle
baseShape -> rectangle
circle -> colors lineStyle:dashed
note1 -> baseShape lineStyle:dashed`
			},
			{
				name: 'Sequence Diagram',
				description: 'User authentication flow',
				code: `diagram "Authentication Sequence"

shape user as @lifeline label:"User"
shape ui as @lifeline label:"LoginUI"
shape controller as @lifeline label:"AuthController"
shape db as @lifeline label:"Database"

user -enterCredentials-> ui
ui -authenticate-> controller
controller -validateUser-> db
db -userData-> controller
controller -token-> ui
ui -showHome-> user`
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
shape decision1 as @choice label:"[has account?]"
shape register as @activity label:"Register"
shape login as @activity label:"Login"
shape merge1 as @choice
shape payment as @activity label:"Enter Payment"
shape decision2 as @choice label:"[payment valid?]"
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

customer -> bankingSystem label:"Uses"
bankingSystem -> emailSystem label:"Sends emails"
bankingSystem -> mainframe label:"Uses"`
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

customer -> webapp label:"Uses [HTTPS]"
webapp -> api label:"API calls [JSON/HTTPS]"
api -> db label:"Reads/Writes [SQL/TCP]"
api -> emailSystem label:"Sends emails [SMTP]"`
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

webapp -> controller label:"Makes API calls"
controller -> security label:"Uses"
controller -> emailComponent label:"Uses"
controller -> accountComponent label:"Uses"
accountComponent -> db label:"Reads/Writes"`
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

customer -> web label:"Uses"
customer -> mobile label:"Uses"
admin -> web label:"Manages"

web -> gateway label:"API Calls"
mobile -> gateway label:"API Calls"

gateway -> auth label:"Authenticates"
gateway -> catalog label:"Fetches Products"
gateway -> orders label:"Places Orders"

auth -> userDb label:"Reads/Writes"
catalog -> catalogDb label:"Reads"
orders -> cache label:"Writes"`
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

shape venn as @venn2 label:"Products" data:[{"setA":100,"setB":80,"intersection":30,"labelA":"Product A","labelB":"Product B"}]`
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
