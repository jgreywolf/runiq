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

  style entityStyle fillColor:"#e3f2fd" strokeColor:"#1976d2" strokeWidth:2
  style processStyle fillColor:"#f3e5f5" strokeColor:"#7b1fa2" strokeWidth:2
  style storeStyle fillColor:"#fff3e0" strokeColor:"#f57c00" strokeWidth:2

  // External entities
  shape customer as @externalEntity label:"Customer" style:entityStyle
  shape inventory as @externalEntity label:"Inventory System" style:entityStyle

  // Processes
  shape processOrder as @processCircle label:"1.0\nProcess Order" style:processStyle
  shape validatePayment as @processCircle label:"2.0\nValidate Payment" style:processStyle

  // Data stores
  shape orders as @dataStoreLine label:"D1 Orders" style:storeStyle
  shape payments as @dataStoreLine label:"D2 Payments" style:storeStyle

  // Data flows
  customer -> processOrder label:"Order Request"
  processOrder -> orders label:"Order Details"
  processOrder -> validatePayment label:"Payment Info"
  validatePayment -> payments label:"Payment Record"
  inventory -> processOrder label:"Stock Check"
  processOrder -> customer label:"Confirmation"
}
```

## Library Management System

Complete library operations with multiple processes.

```runiq
diagram "Library System" {

  style entityStyle fillColor:"#e3f2fd" strokeColor:"#1976d2" strokeWidth:2
  style processStyle fillColor:"#f3e5f5" strokeColor:"#7b1fa2" strokeWidth:2
  style storeStyle fillColor:"#fff3e0" strokeColor:"#f57c00" strokeWidth:2

  // External Entities
  shape member as @externalEntity label:"Library Member" style:entityStyle
  shape staff as @externalEntity label:"Library Staff" style:entityStyle

  // Processes
  shape checkout as @processCircle label:"1.0\nCheckout Book" style:processStyle
  shape returnBook as @processCircle label:"2.0\nReturn Book" style:processStyle
  shape searchCatalog as @processCircle label:"3.0\nSearch Catalog" style:processStyle

  // Data Stores
  shape books as @dataStoreLine label:"D1 Books Catalog" style:storeStyle
  shape loans as @dataStoreLine label:"D2 Active Loans" style:storeStyle
  shape members as @dataStoreLine label:"D3 Members" style:storeStyle

  // Member interactions
  member -> searchCatalog label:"Search Request"
  searchCatalog -> member label:"Search Results"
  member -> checkout label:"Checkout Request"
  checkout -> member label:"Confirmation"
  member -> returnBook label:"Return Request"
  returnBook -> member label:"Receipt"
  // Process-to-store flows
  searchCatalog -> books label:"Query"
  books -> searchCatalog label:"Book Info"
  checkout -> loans label:"Loan Record"
  checkout -> books label:"Update Availability"
  checkout -> members label:"Member Lookup"
  returnBook -> loans label:"Close Loan"
  returnBook -> books label:"Update Availability"
  // Staff interactions
  staff -> books label:"Book Update"
  staff -> members label:"Member Update"
}
```

## User Registration System

New user registration with validation and email confirmation.

```runiq
diagram "User Registration" {

  style entityStyle fillColor:"#dbeafe" strokeColor:"#2563eb" strokeWidth:2
  style processStyle fillColor:"#f3e8ff" strokeColor:"#9333ea" strokeWidth:2
  style storeStyle fillColor:"#fef3c7" strokeColor:"#f59e0b" strokeWidth:2

  // External entities
  shape user as @externalEntity label:"New User" style:entityStyle
  shape emailService as @externalEntity label:"Email Service" style:entityStyle

  // Processes
  shape validate as @processCircle label:"1.0\nValidate Input" style:processStyle
  shape createAccount as @processCircle label:"2.0\nCreate Account" style:processStyle
  shape sendConfirm as @processCircle label:"3.0\nSend Confirmation" style:processStyle

  // Data stores
  shape users as @dataStoreLine label:"D1 Users" style:storeStyle

  // Flows
  user -> validate label:"Registration Form"
  validate -> createAccount label:"Valid Data"
  createAccount -> users label:"User Record"
  createAccount -> sendConfirm label:"User Info"
  sendConfirm -> emailService label:"Confirmation Email"
  emailService -> user label:"Email Sent"
}
```

## Invoice Processing

Business invoice workflow with approval.

```runiq
diagram "Invoice Processing" {

  style entityStyle fillColor:"#e0f2fe" strokeColor:"#0284c7" strokeWidth:2
  style processStyle fillColor:"#fce7f3" strokeColor:"#db2777" strokeWidth:2
  style storeStyle fillColor:"#fef9c3" strokeColor:"#ca8a04" strokeWidth:2

  // External entities
  shape vendor as @externalEntity label:"Vendor" style:entityStyle
  shape accounting as @externalEntity label:"Accounting Dept" style:entityStyle

  // Processes
  shape receive as @processCircle label:"1.0\nReceive Invoice" style:processStyle
  shape verify as @processCircle label:"2.0\nVerify Details" style:processStyle
  shape approve as @processCircle label:"3.0\nApprove Payment" style:processStyle

  // Data stores
  shape invoices as @dataStoreLine label:"D1 Invoices" style:storeStyle
  shape pos as @dataStoreLine label:"D2 Purchase Orders" style:storeStyle

  // Flows
  vendor -> receive label:"Invoice"
  receive -> invoices label:"Invoice Data"
  invoices -> verify label:"Invoice"
  verify -> pos label:"PO Lookup"
  pos -> verify label:"PO Details"
  verify -> approve label:"Verified Invoice"
  approve -> accounting label:"Approval"
}
```

## Payment Gateway Integration

System integration for payment processing.

```runiq
diagram "Payment Integration" {

  style entityStyle fillColor:"#dbeafe" strokeColor:"#1e40af" strokeWidth:2
  style processStyle fillColor:"#f3e8ff" strokeColor:"#7c3aed" strokeWidth:2
  style storeStyle fillColor:"#fef3c7" strokeColor:"#d97706" strokeWidth:2

  // External entities
  shape customer as @externalEntity label:"Customer" style:entityStyle
  shape gateway as @externalEntity label:"Payment Gateway" style:entityStyle
  shape bank as @externalEntity label:"Bank" style:entityStyle

  // Processes
  shape collect as @processCircle label:"1.0\nCollect Payment" style:processStyle
  shape processPayment as @processCircle label:"2.0\nProcess Transaction" style:processStyle
  shape recordResult as @processCircle label:"3.0\nRecord Result" style:processStyle

  // Data stores
  shape transactions as @dataStoreLine label:"D1 Transactions" style:storeStyle

  // Flows
  customer -> collect label:"Payment Info"
  collect -> processPayment label:"Encrypted Data"
  processPayment -> gateway label:"Auth Request"
  gateway -> bank label:"Bank Request"
  bank -> gateway label:"Response"
  gateway -> processPayment label:"Auth Response"
  processPayment -> recordResult label:"Transaction Result"
  recordResult -> transactions label:"Transaction"
  recordResult -> customer label:"Confirmation"
}
```

## E-Commerce Context Diagram

High-level system context showing external interactions.

```runiq
diagram "E-Commerce Context" {

  style entityStyle fillColor:"#e0f2fe" strokeColor:"#0369a1" strokeWidth:2
  style systemStyle fillColor:"#fce7f3" strokeColor:"#be185d" strokeWidth:3

  // External entities
  shape customer as @externalEntity label:"Customer" style:entityStyle
  shape payment as @externalEntity label:"Payment Gateway" style:entityStyle
  shape shipping as @externalEntity label:"Shipping Service" style:entityStyle
  shape supplier as @externalEntity label:"Supplier" style:entityStyle

  // System as single process
  shape system as @processCircle label:"E-Commerce\nSystem" style:systemStyle

  // Data flows
  customer -> system label:"Orders"
  system -> customer label:"Confirmations"
  system -> payment label:"Payment Requests"
  payment -> system label:"Payment Status"
  system -> shipping label:"Shipping Requests"
  shipping -> system label:"Tracking Info"
  system -> supplier label:"Purchase Orders"
  supplier -> system label:"Inventory Updates"
}
```

## Related Documentation

- [Data Flow Diagrams Guide](/guide/dfd-diagrams) - Complete guide to creating DFDs
- [BPMN Diagrams](/guide/bpmn-diagrams) - Business process modeling
- [Activity Diagrams](/guide/activity-diagrams) - UML activity flows
- [Flowcharts](/guide/flowcharts) - Control flow diagrams


