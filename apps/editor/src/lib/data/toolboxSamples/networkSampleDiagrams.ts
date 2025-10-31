import type { SampleCategory } from '../sample-data';

export const networkSampleDiagrams: SampleCategory[] = [
	{
		id: 'network',
		label: 'Network Diagrams',
		samples: [
			{
				name: 'Simple Network',
				description: 'Basic client-server architecture',
				code: `diagram "Simple Network" {

shape client1 as @rectangle label:"Client 1"
shape client2 as @rectangle label:"Client 2"
shape router as @router label:"Router"
shape server as @server label:"Web Server"
shape db as @cylinder label:"Database"

client1 -> router
client2 -> router
router -> server
server -> db}`
			},
			{
				name: 'Three-Tier Architecture',
				description: 'Web application architecture',
				code: `diagram "Three-Tier Architecture" {

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
app2 -> cache}`
			},
			{
				name: 'Cloud Infrastructure',
				description: 'Cloud-based system with firewall',
				code: `diagram "Cloud Infrastructure" {

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
app -> storage}`
			}
		]
	}
];
