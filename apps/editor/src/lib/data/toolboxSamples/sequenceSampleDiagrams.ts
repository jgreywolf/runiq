import type { SampleCategory } from '../sample-data';

export const sequenceSampleDiagrams: SampleCategory[] = [
	{
		id: 'sequence',
		label: 'Sequence Diagrams',
		samples: [
			{
				name: 'Simple Authentication',
				description: 'Basic user login sequence',
				code: `sequence "User Authentication" {

  participant "User" as actor
  participant "Web App" as entity
  participant "Auth Service" as control
  participant "Database" as database

  message from:"User" to:"Web App" label:"Enter credentials" type:sync
  message from:"Web App" to:"Auth Service" label:"Validate login" type:sync activate:true
  message from:"Auth Service" to:"Database" label:"Query user" type:sync
  message from:"Database" to:"Auth Service" label:"User data" type:return
  message from:"Auth Service" to:"Web App" label:"Auth token" type:return
  message from:"Web App" to:"User" label:"Login success" type:return

  note "Token stored in session" position:right participants:("Web App")
      }`
			},
			{
				name: 'API with Error Handling',
				description: 'REST API call with retry logic',
				code: `sequence "API Error Handling" {

  participant "Client" as actor
  participant "API Gateway" as control
  participant "Service" as entity
  participant "Database" as database

  message from:"Client" to:"API Gateway" label:"POST /api/data" type:sync
  message from:"API Gateway" to:"Service" label:"Process request" type:sync activate:true

  note "First attempt" position:left participants:("API Gateway")

  message from:"Service" to:"Database" label:"Query" type:sync
  message from:"Database" to:"Service" label:"Timeout" type:return

  note "Retry logic" position:right participants:("Service")

  message from:"Service" to:"Database" label:"Query (retry)" type:sync
  message from:"Database" to:"Service" label:"Data" type:return
  message from:"Service" to:"API Gateway" label:"Success response" type:return
  message from:"API Gateway" to:"Client" label:"200 OK" type:return
      }`
			},
			{
				name: 'Async Messaging',
				description: 'Asynchronous message queue pattern',
				code: `sequence "Async Order Processing" {

  participant "User" as actor
  participant "Web UI" as boundary
  participant "Order Service" as control
  participant "Message Queue" as entity
  participant "Worker" as control
  participant "Email Service" as entity

  message from:"User" to:"Web UI" label:"Place order" type:sync
  message from:"Web UI" to:"Order Service" label:"Create order" type:sync activate:true
  message from:"Order Service" to:"Message Queue" label:"Enqueue order" type:async

  note "Order accepted immediately" position:right participants:("Order Service")

  message from:"Order Service" to:"Web UI" label:"Order ID" type:return
  message from:"Web UI" to:"User" label:"Order confirmation" type:return

  note "Async processing begins" position:left participants:("Message Queue")

  message from:"Message Queue" to:"Worker" label:"Process order" type:async activate:true
  message from:"Worker" to:"Email Service" label:"Send confirmation" type:async
  message from:"Email Service" to:"User" label:"Email" type:async
      }`
			},
			{
				name: 'Object Lifecycle',
				description: 'Object creation and destruction',
				code: `sequence "Object Lifecycle" {

  participant "Factory" as control
  participant "Manager" as control
  participant "Resource" as entity

  note "Object creation" position:over participants:("Factory", "Manager")

  message from:"Factory" to:"Manager" label:"createResource()" type:sync
  message from:"Manager" to:"Resource" label:"<<create>>" type:sync
  message from:"Resource" to:"Manager" label:"initialized" type:return
  message from:"Manager" to:"Factory" label:"resource" type:return

  note "Object usage" position:over participants:("Manager", "Resource")

  message from:"Factory" to:"Resource" label:"execute()" type:sync activate:true
  message from:"Resource" to:"Resource" label:"process()" type:self
  message from:"Resource" to:"Factory" label:"result" type:return

  note "Object destruction" position:over participants:("Manager", "Resource")

  message from:"Factory" to:"Manager" label:"cleanup()" type:sync
  message from:"Manager" to:"Resource" label:"<<destroy>>" type:sync
      }{}`
			},
			{
				name: 'Loop and Conditional',
				description: 'Retry loop with conditional logic',
				code: `sequence "Retry with Backoff" {

  participant "Client" as actor
  participant "Service" as control
  participant "External API" as entity

  note "Initial attempt" position:over participants:("Client", "Service")

  message from:"Client" to:"Service" label:"Request data" type:sync activate:true

  note "[loop: retry count < 3]" position:right participants:("Service")

  message from:"Service" to:"External API" label:"API call" type:sync
  message from:"External API" to:"Service" label:"Error 503" type:return

  note "Wait with exponential backoff" position:right participants:("Service")

  message from:"Service" to:"External API" label:"API call (retry 1)" type:sync
  message from:"External API" to:"Service" label:"Error 503" type:return

  message from:"Service" to:"External API" label:"API call (retry 2)" type:sync
  message from:"External API" to:"Service" label:"Success" type:return

  note "[end loop]" position:right participants:("Service")

  message from:"Service" to:"Client" label:"Response data" type:return
      }`
			},
			{
				name: 'Advanced Features',
				description: 'Guards, timing, lost/found messages',
				code: `sequence "Advanced Sequence Features" {

  participant "Client" as actor
  participant "Server" as control
  participant "Cache" as entity
  participant "Database" as database

  note "Guard conditions protect actions" position:over participants:("Client", "Server")

  message from:"Client" to:"Server" label:"request(data)" type:sync guard:"authenticated" activate:true

  note "Self-messaging for internal processing" position:right participants:("Server")

  message from:"Server" to:"Server" label:"validateInput()" type:sync

  note "Timing constraints ensure SLA" position:over participants:("Server", "Cache")

  message from:"Server" to:"Cache" label:"lookup(key)" type:sync timing:"< 10ms"
  message from:"Cache" to:"Server" label:"null" type:return

  message from:"Server" to:"Database" label:"query()" type:sync guard:"cache miss" timing:"< 100ms"
  message from:"Database" to:"Server" label:"result" type:return

  note "Lost message: no response expected" position:right participants:("Server")

  message from:"Server" to:lost label:"auditLog(event)" type:async

  note "Found message: unsolicited event" position:left participants:("Client")

  message from:found to:"Client" label:"pushNotification" type:async

  message from:"Server" to:"Client" label:"response" type:return guard:"success" timing:"< 200ms"
      }`
			}
		]
	}
];
