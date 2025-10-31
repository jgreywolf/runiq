import type { SampleCategory } from '../sample-data';

export const containerSampleDiagrams: SampleCategory[] = [
	{
		id: 'containers',
		label: 'Containers & Grouping',
		samples: [
			{
				name: 'Simple Container',
				description: 'Basic container with shapes',
				code: `diagram "Simple Container" {

container backend "Backend Services" backgroundColor:"#e3f2fd" borderColor:"#1976d2" borderWidth:3 {
  shape api as @hexagon label:"API"
  shape auth as @hexagon label:"Auth"
  shape db as @cylinder label:"Database"
  
  api -> auth
  api -> db
}

shape web as @roundedRectangle label:"Web Client"
web -> api
  }`
			},
			{
				name: 'Multi-Region Deployment',
				description: 'Multiple containers for regions',
				code: `diagram "Multi-Region" {
direction TB

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
db1 -> db2 label:"Replication"
}`
			},
			{
				name: 'Microservices Architecture',
				description: 'Containers for service boundaries',
				code: `diagram "Microservices" {

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
auth -> cache
      }`
			}
		]
	}
];
