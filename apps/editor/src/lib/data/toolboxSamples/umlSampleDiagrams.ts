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
				description: 'Factory Pattern Example',
				code: `diagram "Factory Pattern" {
  direction TB
  
  // Product interface
  shape IButton as @class label:"IButton"
    stereotype:"interface"
    methods:[
      {name:"render" returnType:"void" visibility:public},
      {name:"onClick" params:[{name:"handler" type:"EventHandler"}] returnType:"void" visibility:public}
    ]
  
  // Concrete products
  shape WindowsButton as @class label:"WindowsButton"
    attributes:[
      {name:"style" type:"WindowsStyle" visibility:private}
    ]
    methods:[
      {name:"render" returnType:"void" visibility:public},
      {name:"onClick" params:[{name:"handler" type:"EventHandler"}] returnType:"void" visibility:public}
    ]
  
  shape MacButton as @class label:"MacButton"
    attributes:[
      {name:"theme" type:"MacTheme" visibility:private}
    ]
    methods:[
      {name:"render" returnType:"void" visibility:public},
      {name:"onClick" params:[{name:"handler" type:"EventHandler"}] returnType:"void" visibility:public}
    ]
  
  shape LinuxButton as @class label:"LinuxButton"
    attributes:[
      {name:"desktop" type:"string" visibility:private}
    ]
    methods:[
      {name:"render" returnType:"void" visibility:public},
      {name:"onClick" params:[{name:"handler" type:"EventHandler"}] returnType:"void" visibility:public}
    ]
  
  // Factory interface
  shape IButtonFactory as @class label:"IButtonFactory"
    stereotype:"interface"
    methods:[
      {name:"createButton" returnType:"IButton" visibility:public}
    ]
  
  // Concrete factories
  shape WindowsFactory as @class label:"WindowsFactory"
    methods:[
      {name:"createButton" returnType:"IButton" visibility:public}
    ]
  
  shape MacFactory as @class label:"MacFactory"
    methods:[
      {name:"createButton" returnType:"IButton" visibility:public}
    ]
  
  shape LinuxFactory as @class label:"LinuxFactory"
    methods:[
      {name:"createButton" returnType:"IButton" visibility:public}
    ]
  
  // Client class
  shape Application as @class label:"Application"
    attributes:[
      {name:"factory" type:"IButtonFactory" visibility:private},
      {name:"button" type:"IButton" visibility:private}
    ]
    methods:[
      {name:"initialize" params:[{name:"factory" type:"IButtonFactory"}] returnType:"void" visibility:public},
      {name:"createUI" returnType:"void" visibility:public}
    ]
  
  // Product hierarchy
  WindowsButton -> IButton lineStyle:"dashed"
  MacButton -> IButton lineStyle:"dashed"
  LinuxButton -> IButton lineStyle:"dashed"
  
  // Factory hierarchy
  WindowsFactory -> IButtonFactory lineStyle:"dashed"
  MacFactory -> IButtonFactory lineStyle:"dashed"
  LinuxFactory -> IButtonFactory lineStyle:"dashed"
  
  // Dependencies
  Application.factory -> IButtonFactory
  Application.button -> IButton
  
  // Factory creates products (dashed with label)
  WindowsFactory -creates-> WindowsButton lineStyle:"dashed"
  MacFactory -creates-> MacButton lineStyle:"dashed"
  LinuxFactory -creates-> LinuxButton lineStyle:"dashed"
}
`
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
