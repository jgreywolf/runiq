import type { SampleCategory } from '../sample-data';

export const umlSampleDiagrams: SampleCategory[] = [
	{
		id: 'uml',
		label: 'UML Diagrams',
		samples: [
			{
				name: 'Simple Use Case',
				description: 'User authentication use case',
				code: `diagram "Authentication Use Case" {

shape user as @actor label:"User"
shape admin as @actor label:"Admin"

container "Auth System" as @systemBoundary {
  shape login as @ellipseWide label:"Login"
  shape register as @ellipseWide label:"Register"
  shape resetPwd as @ellipseWide label:"Reset Password"
}

user -> login
user -> register
user -> resetPwd
admin -> login
}`
			},
			{
				name: 'Class Diagram',
				description: 'Simple class hierarchy with interface',
				code: `diagram "Class Hierarchy" {

shape iShape as @interface label:"IShape"
shape baseShape as @abstract label:"Shape"
shape circle as @class label:"Circle"
shape rectangle as @class label:"Rectangle"
shape colors as @enum label:"Color"
shape note1 as @note label:"All shapes implement IShape"

iShape -> baseShape
baseShape -> circle
baseShape -> rectangle
circle -> colors lineStyle:"dashed"
note1 -> baseShape lineStyle:"dashed"
}`
			},
			{
				name: 'State Machine',
				description: 'Order processing states',
				code: `diagram "Order State Machine" {

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
cancelled -> final
}`
			},
			{
				name: 'Activity Diagram',
				description: 'Online shopping process flow',
				code: `diagram "Online Shopping Activity" {

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
join1 -> end
}`
			}
		]
	}
];
