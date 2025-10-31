import type { SampleCategory } from '../sample-data';

export const c4SampleDiagrams: SampleCategory[] = [
	{
		id: 'c4',
		label: 'C4 Architecture',
		samples: [
			{
				name: 'System Context',
				description: 'C4 Level 1: Banking system context',
				code: `diagram "Banking System - Context"
direction TB

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
direction TB

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
direction TB

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
direction LR

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
	}
];
