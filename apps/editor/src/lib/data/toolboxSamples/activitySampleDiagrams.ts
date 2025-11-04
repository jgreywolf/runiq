import type { SampleCategory } from '../sample-data';

export const activitySampleDiagrams: SampleCategory[] = [
	{
		id: 'activity',
		label: 'Activity Diagrams',
		samples: [
			{
				name: 'Order Processing',
				description: 'Activity diagram showing order fulfillment workflow with object nodes',
				code: `// UML Activity Diagram: Order Processing Workflow
diagram "Order Processing Activity" {
  direction TB

  // Initial and final nodes
  shape start as @initialState
  shape end as @finalState

  // Activities
  shape receiveOrder as @activity label:"Receive Order"
  shape validateCustomer as @activity label:"Validate Customer"
  shape checkInventory as @activity label:"Check Inventory"
  shape processPayment as @activity label:"Process Payment"
  shape shipOrder as @activity label:"Ship Order"

  // Object nodes (data in flow)
  shape order as @objectNode label:"Order"
  shape validatedOrder as @objectNode label:"Validated Order"

  // Control flow
  start -> receiveOrder
  receiveOrder -> order
  order -> validateCustomer
  validateCustomer -> validatedOrder
  validatedOrder -> checkInventory
  checkInventory -> processPayment
  processPayment -> shipOrder
  shipOrder -> end
}`
			},
			{
				name: 'Document Approval',
				description: 'Activity diagram with decision nodes and parallel flows',
				code: `// UML Activity Diagram: Document Approval Process
diagram "Document Approval" {
  direction TB

  shape start as @initialState
  shape end as @finalState

  // Activities
  shape submit as @activity label:"Submit Document"
  shape review as @activity label:"Review"
  shape revise as @activity label:"Revise"
  shape approve as @activity label:"Approve"
  shape archive as @activity label:"Archive"

  // Decision node
  shape decision as @decision

  // Flow
  start -> submit
  submit -> review
  review -> decision
  decision -> approve
    label: "[approved]"
  decision -> revise
    label: "[needs revision]"
  revise -> review
  approve -> archive
  archive -> end
}`
			},
			{
				name: 'Swimlanes',
				description: 'Activity diagram with horizontal swimlanes for different actors',
				code: `// UML Activity Diagram: Swimlanes Example
diagram "Swimlane Process" {
  direction TB

  // Swimlanes (containers)
  container customer label:"Customer" {
    shape placeOrder as @activity label:"Place Order"
    shape receiveConfirmation as @activity label:"Receive Confirmation"
  }

  container warehouse label:"Warehouse" {
    shape checkStock as @activity label:"Check Stock"
    shape packItems as @activity label:"Pack Items"
  }

  container shipping label:"Shipping" {
    shape shipOrder as @activity label:"Ship Order"
  }

  // Cross-swimlane flow
  placeOrder -> checkStock
  checkStock -> packItems
  packItems -> shipOrder
  shipOrder -> receiveConfirmation
}`
			},
			{
				name: 'Fork and Join',
				description: 'Parallel activities with fork and join nodes',
				code: `// UML Activity Diagram: Parallel Processing
diagram "Parallel Activities" {
  direction TB

  shape start as @initialState
  shape end as @finalState

  shape prepare as @activity label:"Prepare Data"
  shape fork as @fork
  shape processA as @activity label:"Process Part A"
  shape processB as @activity label:"Process Part B"
  shape processC as @activity label:"Process Part C"
  shape join as @join
  shape combine as @activity label:"Combine Results"

  // Sequential to parallel
  start -> prepare
  prepare -> fork

  // Parallel execution
  fork -> processA
  fork -> processB
  fork -> processC

  // Parallel to sequential
  processA -> join
  processB -> join
  processC -> join
  join -> combine
  combine -> end
}`
			}
		]
	}
];
