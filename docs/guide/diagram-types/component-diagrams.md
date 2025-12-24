---
title: UML Component Diagrams
description: Model software architecture with components, interfaces (provided/required), ports, dependencies, and assembly connectors for modular design.
lastUpdated: 2025-01-09
---

# UML Component Diagrams

Component diagrams show the organization and dependencies among software components, their interfaces, and ports. They're essential for documenting system architecture, module structure, and component-based design.

## Quick Start

```runiq
diagram "Simple Component Diagram" {
  shape webServer as @component label:"Web Server"
  shape db as @component label:"Database"
  shape cache as @component label:"Cache"

  webServer -> db
  webServer -> cache
}
```

## Core Concepts

### Components

Components represent modular parts of a system with well-defined interfaces. In Runiq, use `@component` (rendered as `@umlComponent` internally due to grammar constraints).

```runiq
diagram "Component with Interfaces" {
  shape service as @component label:"Payment Service"

  # Provided interface (lollipop notation)
  shape iPayment as @providedInterface label:"IPayment"

  # Required interface (socket notation)
  shape needsDb as @requiredInterface label:"IDatabase"

  service -> iPayment
  service -> needsDb
}
```

**Component Shape**:

  - Rectangle with two small rectangles (tabs) on the left side
  - Represents a replaceable, encapsulated unit of functionality
  - Can have multiple provided and required interfaces

---

## Interfaces

### Provided Interfaces (Lollipop Notation)

Interfaces that a component exposes to others. Rendered as a circle on a line (lollipop).

```runiq
diagram "Provided Interface Example" {
  shape authService as @component label:"Auth Service"
  shape iAuth as @providedInterface label:"IAuthentication"
  shape iAuthorization as @providedInterface label:"IAuthorization"

  authService -> iAuth
  authService -> iAuthorization
}
```

**Provided Interface**:

  - **Symbol**: Circle (lollipop) on a line
  - **Purpose**: Interface that component implements and exposes
  - **UML Notation**: Exported interface

### Required Interfaces (Socket Notation)

Interfaces that a component needs from other components. Rendered as a semicircle (socket).

```runiq
diagram "Required Interface Example" {
  shape webApp as @component label:"Web Application"
  shape needsAuth as @requiredInterface label:"IAuthentication"
  shape needsDb as @requiredInterface label:"IDatabase"

  webApp -> needsAuth
  webApp -> needsDb
}
```

**Required Interface**:

  - **Symbol**: Semicircle (socket)
  - **Purpose**: Interface that component depends on
  - **UML Notation**: Imported interface

### Assembly Connectors

Connect provided interfaces to required interfaces, showing which components satisfy dependencies.

```runiq
diagram "Assembly Connector Pattern" {
  # Provider component
  shape dbService as @component label:"DB Service"
  shape providesDb as @providedInterface label:"IDatabase"

  # Consumer component
  shape webApp as @component label:"Web App"
  shape needsDb as @requiredInterface label:"IDatabase"

  # Assembly connector (lollipop fits into socket)
  shape connector as @assembly

  # Connections
  dbService -> providesDb
  webApp -> needsDb
  providesDb -> connector
  connector -> needsDb
}
```

**Assembly Connector**:

  - Visually connects lollipop (provided) to socket (required)
  - Represents dependency satisfaction at design time
  - Shows which component provides the required interface

---

## Ports

Ports represent interaction points on a component's boundary. They're small squares attached to components.

```runiq
diagram "Component with Ports" {
  shape apiGateway as @component label:"API Gateway"

  # Ports for different protocols
  shape httpPort as @port label:"HTTP 8080"
  shape httpsPort as @port label:"HTTPS 443"
  shape wsPort as @port label:"WebSocket"

  apiGateway -> httpPort
  apiGateway -> httpsPort
  apiGateway -> wsPort
}
```

**Port Uses**:

  - Protocol endpoints (HTTP, HTTPS, WebSocket)
  - Message queue connections
  - Database connection points
  - Network interfaces

---

## Modules and Templates

### Modules

Modules represent deployable units or namespaces with the `«module»` stereotype.

```runiq
diagram "Module Organization" {
  shape core as @module label:"Core Module"
  shape plugins as @module label:"Plugin Module"
  shape utilities as @module label:"Utilities"

  plugins -> core
  utilities -> core
}
```

### Templates (Generics)

Templates represent generic or parameterized components, shown with a dashed corner box.

```runiq
diagram "Generic Repository Pattern" {
  shape repository as @template label:"Repository<T>"
  shape userRepo as @template label:"Repository<User>"
  shape orderRepo as @template label:"Repository<Order>"
  shape productRepo as @template label:"Repository<Product>"

  userRepo -> repository relationship:realization
  orderRepo -> repository relationship:realization
  productRepo -> repository relationship:realization
}
```

**Template Uses**:

  - Generic data structures (List\<T\>, Map\<K,V\>)
  - Repository pattern implementations
  - Service layer abstractions
  - DAO/ORM mappers

---

## Layered Architecture Pattern

Three-tier architecture with interface segregation.

### Example: Three-Tier System

```runiq
diagram "Three-Tier Architecture" {
  # Presentation Layer
  shape ui as @component label:"Web UI"
  shape httpPort as @port label:"HTTP 8080"

  ui -> httpPort

  # Business Logic Layer
  shape userService as @module label:"User Service"
  shape orderService as @module label:"Order Service"

  shape iUserService as @providedInterface label:"IUserService"
  shape iOrderService as @providedInterface label:"IOrderService"

  userService -> iUserService
  orderService -> iOrderService

  # Data Access Layer
  shape dataAccess as @component label:"Data Access"
  shape dbPort as @port label:"Database 5432"

  dataAccess -> dbPort

  # Repository pattern
  shape userRepo as @template label:"Repository<User>"
  shape orderRepo as @template label:"Repository<Order>"

  shape iUserData as @providedInterface label:"IUserData"
  shape iOrderData as @providedInterface label:"IOrderData"

  userRepo -> iUserData
  orderRepo -> iOrderData

  # Service requirements
  shape needsUserData as @requiredInterface label:"IUserData"
  shape needsOrderData as @requiredInterface label:"IOrderData"

  userService -> needsUserData
  orderService -> needsOrderData

  # Assembly connectors
  shape userConnector as @assembly
  shape orderConnector as @assembly

  iUserData -> userConnector
  userConnector -> needsUserData

  iOrderData -> orderConnector
  orderConnector -> needsOrderData

  # Layer dependencies
  ui -> iUserService
  ui -> iOrderService
}
```

### Key Features

  - **Clear Separation**: Presentation, business logic, data access layers
  - **Interface Abstraction**: Provided/required interfaces between layers
  - **Assembly Connectors**: Show how layers satisfy dependencies
  - **Ports**: External connection points (HTTP, database)
  - **Templates**: Generic repository pattern

---

## Microservices Architecture Pattern

Component diagrams excel at showing microservice dependencies and communication.

### Example: API Gateway with Services

```runiq
diagram "Microservices with API Gateway" {
  # API Gateway component
  shape apiGateway as @component label:"API Gateway"
  shape httpIn as @port label:"HTTP"
  shape httpsIn as @port label:"HTTPS"

  apiGateway -> httpIn
  apiGateway -> httpsIn

  # Authentication Service
  shape authService as @component label:"Auth Service"
  shape providesAuth as @providedInterface label:"IAuth"

  authService -> providesAuth

  # User Service
  shape userService as @component label:"User Service"
  shape providesUser as @providedInterface label:"IUserAPI"

  userService -> providesUser

  # Order Service
  shape orderService as @component label:"Order Service"
  shape providesOrder as @providedInterface label:"IOrderAPI"
  shape needsUser as @requiredInterface label:"IUserAPI"
  shape needsPayment as @requiredInterface label:"IPayment"

  orderService -> providesOrder
  orderService -> needsUser
  orderService -> needsPayment

  # Payment Service
  shape paymentService as @component label:"Payment Service"
  shape providesPayment as @providedInterface label:"IPayment"

  paymentService -> providesPayment

  # Assembly connectors
  shape userConnector as @assembly
  shape paymentConnector as @assembly

  providesUser -> userConnector
  userConnector -> needsUser

  providesPayment -> paymentConnector
  paymentConnector -> needsPayment

  # Gateway routes to services
  apiGateway -> providesAuth
  apiGateway -> providesUser
  apiGateway -> providesOrder
}
```

### Key Features

  - **API Gateway Pattern**: Central entry point with multiple ports
  - **Service Discovery**: Provided interfaces show service capabilities
  - **Service Dependencies**: Required interfaces and assembly connectors
  - **Decoupling**: Services communicate through well-defined interfaces

---

## Plugin Architecture Pattern

Extensible systems with plugin interfaces.

### Example: Plugin System

```runiq
diagram "Plugin System Architecture" {
  # Core plugin manager (generic)
  shape pluginManager as @template label:"PluginManager<T>"
  shape pluginAPI as @module label:"Plugin API"

  pluginManager -> pluginAPI flowType:"control"

  # Interface segregation - multiple small interfaces
  shape iInitializable as @providedInterface label:"IInitializable"
  shape iConfigurable as @providedInterface label:"IConfigurable"
  shape iLifecycle as @providedInterface label:"ILifecycle"

  pluginAPI -> iInitializable
  pluginAPI -> iConfigurable
  pluginAPI -> iLifecycle

  # Plugin modules
  shape authPlugin as @module label:"Authentication Plugin"
  shape loggingPlugin as @module label:"Logging Plugin"
  shape cachingPlugin as @module label:"Caching Plugin"

  # Plugins require initialization
  shape needsInit1 as @requiredInterface label:"IInitializable"
  shape needsInit2 as @requiredInterface label:"IInitializable"
  shape needsInit3 as @requiredInterface label:"IInitializable"

  authPlugin -> needsInit1
  loggingPlugin -> needsInit2
  cachingPlugin -> needsInit3

  # Assembly connectors (one interface, many consumers)
  shape conn1 as @assembly
  shape conn2 as @assembly
  shape conn3 as @assembly

  iInitializable -> conn1
  conn1 -> needsInit1

  iInitializable -> conn2
  conn2 -> needsInit2

  iInitializable -> conn3
  conn3 -> needsInit3

  # Plugin registration
  pluginAPI -> authPlugin flowType:"control"
  pluginAPI -> loggingPlugin flowType:"control"
  pluginAPI -> cachingPlugin flowType:"control"
}
```
