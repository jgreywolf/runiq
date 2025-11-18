---
title: Data Flow Diagram Examples
description: Complete examples of DFDs using Gane-Sarson notation
---

# Data Flow Diagram Examples

This page showcases Data Flow Diagram examples using Gane-Sarson notation.

## Order Processing System

Basic e-commerce order processing flow.

```runiq
diagram "Order Processing" {

  style entity fill:"#e3f2fd" stroke:"#1976d2" strokeWidth:2
  style process fill:"#f3e5f5" stroke:"#7b1fa2" strokeWidth:2
  style store fill:"#fff3e0" stroke:"#f57c00" strokeWidth:2

  // External entities
  shape customer as @externalEntity label:"Customer" style:entity
  shape inventory as @externalEntity label:"Inventory System" style:entity

  // Processes
  shape processOrder as @processCircle label:"1.0\nProcess Order" style:process
  shape validatePayment as @processCircle label:"2.0\nValidate Payment" style:process

  // Data stores
  shape orders as @dataStoreLine label:"D1 Orders" style:store
  shape payments as @dataStoreLine label:"D2 Payments" style:store

  // Data flows
  customer -Order Request-> processOrder
  processOrder -Order Details-> orders
  processOrder -Payment Info-> validatePayment
  validatePayment -Payment Record-> payments
  inventory -Stock Check-> processOrder
  processOrder -Confirmation-> customer
}
```

## Library Management System

Complete library operations with multiple processes.

```runiq
diagram "Library System" {

  style entity fill:"#e3f2fd" stroke:"#1976d2" strokeWidth:2
  style process fill:"#f3e5f5" stroke:"#7b1fa2" strokeWidth:2
  style store fill:"#fff3e0" stroke:"#f57c00" strokeWidth:2

  // External Entities
  shape member as @externalEntity label:"Library Member" style:entity
  shape staff as @externalEntity label:"Library Staff" style:entity

  // Processes
  shape checkout as @processCircle label:"1.0\nCheckout Book" style:process
  shape returnBook as @processCircle label:"2.0\nReturn Book" style:process
  shape searchCatalog as @processCircle label:"3.0\nSearch Catalog" style:process

  // Data Stores
  shape books as @dataStoreLine label:"D1 Books Catalog" style:store
  shape loans as @dataStoreLine label:"D2 Active Loans" style:store
  shape members as @dataStoreLine label:"D3 Members" style:store

  // Member interactions
  member -Search Request-> searchCatalog
  searchCatalog -Search Results-> member
  member -Checkout Request-> checkout
  checkout -Confirmation-> member
  member -Return Request-> returnBook
  returnBook -Receipt-> member

  // Process-to-store flows
  searchCatalog -Query-> books
  books -Book Info-> searchCatalog
  checkout -Loan Record-> loans
  checkout -Update Availability-> books
  checkout -Member Lookup-> members
  returnBook -Close Loan-> loans
  returnBook -Update Availability-> books

  // Staff interactions
  staff -Book Update-> books
  staff -Member Update-> members
}
```

## User Registration System

New user registration with validation and email confirmation.

```runiq
diagram "User Registration" {

  style entity fill:"#dbeafe" stroke:"#2563eb" strokeWidth:2
  style process fill:"#f3e8ff" stroke:"#9333ea" strokeWidth:2
  style store fill:"#fef3c7" stroke:"#f59e0b" strokeWidth:2

  // External entities
  shape user as @externalEntity label:"New User" style:entity
  shape emailService as @externalEntity label:"Email Service" style:entity

  // Processes
  shape validate as @processCircle label:"1.0\nValidate Input" style:process
  shape createAccount as @processCircle label:"2.0\nCreate Account" style:process
  shape sendConfirm as @processCircle label:"3.0\nSend Confirmation" style:process

  // Data stores
  shape users as @dataStoreLine label:"D1 Users" style:store

  // Flows
  user -Registration Form-> validate
  validate -Valid Data-> createAccount
  createAccount -User Record-> users
  createAccount -User Info-> sendConfirm
  sendConfirm -Confirmation Email-> emailService
  emailService -Email Sent-> user
}
```

## Invoice Processing

Business invoice workflow with approval.

```runiq
diagram "Invoice Processing" {

  style entity fill:"#e0f2fe" stroke:"#0284c7" strokeWidth:2
  style process fill:"#fce7f3" stroke:"#db2777" strokeWidth:2
  style store fill:"#fef9c3" stroke:"#ca8a04" strokeWidth:2

  // External entities
  shape vendor as @externalEntity label:"Vendor" style:entity
  shape accounting as @externalEntity label:"Accounting Dept" style:entity

  // Processes
  shape receive as @processCircle label:"1.0\nReceive Invoice" style:process
  shape verify as @processCircle label:"2.0\nVerify Details" style:process
  shape approve as @processCircle label:"3.0\nApprove Payment" style:process

  // Data stores
  shape invoices as @dataStoreLine label:"D1 Invoices" style:store
  shape pos as @dataStoreLine label:"D2 Purchase Orders" style:store

  // Flows
  vendor -Invoice-> receive
  receive -Invoice Data-> invoices
  invoices -Invoice-> verify
  verify -PO Lookup-> pos
  pos -PO Details-> verify
  verify -Verified Invoice-> approve
  approve -Approval-> accounting
}
```

## Payment Gateway Integration

System integration for payment processing.

```runiq
diagram "Payment Integration" {

  style entity fill:"#dbeafe" stroke:"#1e40af" strokeWidth:2
  style process fill:"#f3e8ff" stroke:"#7c3aed" strokeWidth:2
  style store fill:"#fef3c7" stroke:"#d97706" strokeWidth:2

  // External entities
  shape customer as @externalEntity label:"Customer" style:entity
  shape gateway as @externalEntity label:"Payment Gateway" style:entity
  shape bank as @externalEntity label:"Bank" style:entity

  // Processes
  shape collect as @processCircle label:"1.0\nCollect Payment" style:process
  shape processPayment as @processCircle label:"2.0\nProcess Transaction" style:process
  shape recordResult as @processCircle label:"3.0\nRecord Result" style:process

  // Data stores
  shape transactions as @dataStoreLine label:"D1 Transactions" style:store

  // Flows
  customer -Payment Info-> collect
  collect -Encrypted Data-> processPayment
  processPayment -Auth Request-> gateway
  gateway -Bank Request-> bank
  bank -Response-> gateway
  gateway -Auth Response-> processPayment
  processPayment -Transaction Result-> recordResult
  recordResult -Transaction-> transactions
  recordResult -Confirmation-> customer
}
```

## E-Commerce Context Diagram

High-level system context showing external interactions.

```runiq
diagram "E-Commerce Context" {

  style entity fill:"#e0f2fe" stroke:"#0369a1" strokeWidth:2
  style system fill:"#fce7f3" stroke:"#be185d" strokeWidth:3

  // External entities
  shape customer as @externalEntity label:"Customer" style:entity
  shape payment as @externalEntity label:"Payment Gateway" style:entity
  shape shipping as @externalEntity label:"Shipping Service" style:entity
  shape supplier as @externalEntity label:"Supplier" style:entity

  // System as single process
  shape system as @processCircle label:"E-Commerce\nSystem" style:system

  // Data flows
  customer -Orders-> system
  system -Confirmations-> customer
  system -Payment Requests-> payment
  payment -Payment Status-> system
  system -Shipping Requests-> shipping
  shipping -Tracking Info-> system
  system -Purchase Orders-> supplier
  supplier -Inventory Updates-> system
}
```

## Related Documentation

- [Data Flow Diagrams Guide](/guide/dfd-diagrams) - Complete guide to creating DFDs
- [BPMN Diagrams](/guide/bpmn-diagrams) - Business process modeling
- [Activity Diagrams](/guide/activity-diagrams) - UML activity flows
- [Flowcharts](/guide/flowcharts) - Control flow diagrams
