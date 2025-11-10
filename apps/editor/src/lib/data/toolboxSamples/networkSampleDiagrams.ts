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
	},
	{
		id: 'network-analysis',
		label: 'Network Analysis',
		samples: [
			{
				name: 'Social Network (Degree)',
				description: 'Social network with degree centrality metrics',
				code: `// Social Network with Metrics Visualization
// Demonstrates degree centrality on a small social network

diagram "Social Network Analysis" {
  shape alice as @person label: "Alice" showMetrics: true
  shape bob as @person label: "Bob" showMetrics: true
  shape charlie as @person label: "Charlie" showMetrics: true
  shape diana as @person label: "Diana" showMetrics: true
  shape eve as @person label: "Eve" showMetrics: true
  shape frank as @person label: "Frank" showMetrics: true

  // Alice is a hub (highest degree)
  alice -> bob label: "friends"
  alice -> charlie label: "friends"
  alice -> diana label: "friends"
  alice -> eve label: "friends"

  // Bob connects to multiple people
  bob -> charlie label: "friends"
  bob -> frank label: "friends"

  // Charlie has connections
  charlie -> diana label: "friends"
  charlie -> frank label: "friends"

  // Eve and Frank are less connected
  eve -> frank label: "friends"
}`
			},
			{
				name: 'Citation Network (Betweenness)',
				description: 'Citation network with betweenness centrality',
				code: `// Citation Network with Betweenness Centrality
// Shows papers and citations with betweenness metric
// Identifies papers that connect different research clusters

diagram "Citation Network" {
  shape paper1 as @document label: "Paper 1\\n(Foundational)" showMetrics: true metricType: betweenness
  shape paper2 as @document label: "Paper 2" showMetrics: true metricType: betweenness
  shape paper3 as @document label: "Paper 3" showMetrics: true metricType: betweenness
  shape paper4 as @document label: "Paper 4\\n(Bridge)" showMetrics: true metricType: betweenness
  shape paper5 as @document label: "Paper 5" showMetrics: true metricType: betweenness
  shape paper6 as @document label: "Paper 6" showMetrics: true metricType: betweenness
  shape paper7 as @document label: "Paper 7" showMetrics: true metricType: betweenness

  // Early cluster
  paper1 -> paper2 label: "cites"
  paper1 -> paper3 label: "cites"
  paper2 -> paper3 label: "cites"

  // Bridge paper connects clusters
  paper2 -> paper4 label: "cites"
  paper3 -> paper4 label: "cites"

  // Later cluster
  paper4 -> paper5 label: "cites"
  paper4 -> paper6 label: "cites"
  paper5 -> paper7 label: "cites"
  paper6 -> paper7 label: "cites"
}`
			},
			{
				name: 'Infrastructure (Closeness)',
				description: 'Server infrastructure with closeness centrality',
				code: `// Infrastructure Network with Closeness Centrality
// Shows servers and their connections with closeness metric
// Identifies servers with best average connectivity

diagram "Server Infrastructure" {
  shape lb as @server label: "Load Balancer" showMetrics: true metricType: closeness metricPosition: top-left
  shape web1 as @server label: "Web Server 1" showMetrics: true metricType: closeness
  shape web2 as @server label: "Web Server 2" showMetrics: true metricType: closeness
  shape api1 as @server label: "API Server 1" showMetrics: true metricType: closeness
  shape api2 as @server label: "API Server 2" showMetrics: true metricType: closeness
  shape db1 as @database label: "Database 1" showMetrics: true metricType: closeness
  shape db2 as @database label: "Database 2" showMetrics: true metricType: closeness
  shape cache as @storage label: "Cache" showMetrics: true metricType: closeness

  // Load balancer distributes
  lb -> web1
  lb -> web2

  // Web servers call APIs
  web1 -> api1
  web1 -> api2
  web2 -> api1
  web2 -> api2

  // APIs access databases
  api1 -> db1
  api1 -> db2
  api2 -> db1
  api2 -> db2

  // APIs use cache
  api1 -> cache
  api2 -> cache

  // Database replication
  db1 -> db2 label: "replicate"
}`
			}
		]
	}
];
