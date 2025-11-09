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
  shape database as @component label:"Database"
  shape cache as @component label:"Cache"
  
  webServer -> database
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
  
  userRepo -> repository relationship:"realization"
  orderRepo -> repository relationship:"realization"
  productRepo -> repository relationship:"realization"
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

### Key Features

- **Generic Plugin Manager**: Template for type-safe plugins
- **Interface Segregation**: Small, focused interfaces (ISP)
- **Multiple Consumers**: One interface, many plugins
- **Lifecycle Management**: Initialization, configuration interfaces

---

## Component Relationships

### Dependency

Standard dependency between components.

```runiq
diagram "Component Dependencies" {
  shape frontend as @component label:"Frontend"
  shape backend as @component label:"Backend"
  shape database as @component label:"Database"
  
  frontend -> backend relationship:"dependency"
  backend -> database relationship:"dependency"
}
```

### Realization

Component realizes/implements an interface.

```runiq
diagram "Interface Realization" {
  shape iService as @interface label:"IService"
    stereotype:"«interface»"
    methods:[
      {name:"execute" returnType:"void" visibility:public}
    ]
  
  shape serviceImpl as @component label:"ServiceImpl"
  
  serviceImpl -> iService relationship:"realization" lineStyle:"dashed"
}
```

### Association

General association between components.

```runiq
diagram "Component Association" {
  shape client as @component label:"Client"
  shape server as @component label:"Server"
  
  client -> server relationship:"association" label:"connects to"
}
```

---

## Artifacts and Nodes

### Artifacts

Physical files or deployable units (JAR, DLL, EXE).

```runiq
diagram "Deployment Artifacts" {
  shape webapp as @component label:"Web Application"
  shape warFile as @artifact label:"webapp.war"
  shape jarLib as @artifact label:"commons.jar"
  
  webapp -> warFile relationship:"dependency"
  warFile -> jarLib relationship:"dependency"
}
```

**Artifact Shape**:
- Rectangle with folded corner (document icon)
- Represents physical file or deployment unit

### Nodes

Physical hardware or execution environments.

```runiq
diagram "Deployment Topology" {
  shape webServer as @node label:"Web Server"
  shape appServer as @node label:"App Server"
  shape dbServer as @node label:"DB Server"
  
  webServer -> appServer
  appServer -> dbServer
}
```

**Node Shape**:
- 3D cube/box
- Represents physical device or execution environment

---

## Best Practices

### Interface Design

1. **Interface Segregation**: Multiple small, focused interfaces
   ```runiq
   # Good: Separate interfaces
   shape iRead as @providedInterface label:"IReadUser"
   shape iWrite as @providedInterface label:"IWriteUser"
   
   # Avoid: One large interface with everything
   ```

2. **Lollipop and Socket**: Always pair provided with required
   ```runiq
   # Provider
   shape dbService as @component label:"DB Service"
   shape provides as @providedInterface label:"IDatabase"
   
   # Consumer
   shape appService as @component label:"App Service"
   shape requires as @requiredInterface label:"IDatabase"
   
   # Connect with assembly
   shape conn as @assembly
   provides -> conn -> requires
   ```

3. **Explicit Connectors**: Use `@assembly` to show interface wiring
   ```runiq
   shape connector as @assembly
   providedInterface -> connector
   connector -> requiredInterface
   ```

### Component Organization

1. **Layering**: Group components by architectural layer
   - Presentation Layer: UI components
   - Business Logic: Service components with business rules
   - Data Access: Repository, DAO components

2. **Cohesion**: Keep related functionality together
   - High cohesion within components
   - Loose coupling between components

3. **Naming**: Use clear, descriptive names
   - Components: `UserService`, `OrderRepository`
   - Interfaces: Prefix with `I` (e.g., `IUserService`)
   - Ports: Include protocol or purpose (e.g., `HTTP 8080`)

### Template Usage

1. **Generic Collections**: Use templates for reusable patterns
   ```runiq
   shape repository as @template label:"Repository<T>"
   shape service as @template label:"Service<T>"
   ```

2. **Type Parameters**: Show concrete instantiations
   ```runiq
   shape userRepo as @template label:"Repository<User>"
   shape orderRepo as @template label:"Repository<Order>"
   ```

3. **Realization**: Connect concrete to generic
   ```runiq
   userRepo -> repository relationship:"realization"
   ```

### Port Best Practices

1. **Protocol Specification**: Include protocol in port label
   ```runiq
   shape httpPort as @port label:"HTTP 8080"
   shape dbPort as @port label:"PostgreSQL 5432"
   shape mqPort as @port label:"RabbitMQ"
   ```

2. **Multiple Ports**: Show all external connection points
   ```runiq
   shape apiGateway as @component label:"API Gateway"
   shape http as @port label:"HTTP"
   shape https as @port label:"HTTPS"
   shape grpc as @port label:"gRPC"
   
   apiGateway -> http
   apiGateway -> https
   apiGateway -> grpc
   ```

---

## Component Diagram Patterns

### 1. Layered Architecture

**When to use**: Traditional n-tier applications

**Structure**:
- Presentation → Business Logic → Data Access
- Each layer exposes interfaces to layer above
- Clear separation of concerns

### 2. Microservices

**When to use**: Distributed systems, cloud-native apps

**Structure**:
- Independent services with REST/gRPC APIs
- API Gateway for routing
- Service mesh for communication

### 3. Plugin Architecture

**When to use**: Extensible applications, modular systems

**Structure**:
- Core with plugin interfaces
- Plugins implement standard interfaces
- Dynamic loading and configuration

### 4. Hexagonal (Ports and Adapters)

**When to use**: Domain-driven design, testability focus

**Structure**:
- Core business logic in center
- Ports (interfaces) around perimeter
- Adapters (implementations) outside

---

## Shape Reference

| Shape | ID | Purpose | Symbol |
|-------|-----|---------|--------|
| Component | `@component` | Modular software unit | Rectangle with tabs |
| Provided Interface | `@providedInterface` | Exported interface | Circle (lollipop) |
| Required Interface | `@requiredInterface` | Imported interface | Semicircle (socket) |
| Port | `@port` | Connection point | Small square |
| Module | `@module` | Deployable unit | Rectangle with «module» |
| Template | `@template` | Generic component | Rectangle with dashed corner |
| Assembly | `@assembly` | Interface connector | Small circle |
| Artifact | `@artifact` | Physical file | Rectangle with folded corner |
| Node | `@node` | Hardware device | 3D cube |

---

## Relationships

| Relationship | Usage | Line Style |
|-------------|-------|------------|
| Dependency | Component uses another | Dashed arrow |
| Realization | Implements interface | Dashed arrow |
| Association | General connection | Solid line |

---

## Related Resources

- [UML 2.5 Specification](https://www.omg.org/spec/UML/) - Official component diagram notation
- [C4 Architecture](/guide/c4-architecture) - Context, Container, Component, Code
- [Class Diagrams](/guide/class-diagrams) - Detailed class-level design

---

## Common Patterns Summary

### Repository Pattern with Interfaces

```runiq
diagram "Repository Pattern" {
  shape service as @component label:"User Service"
  shape needsRepo as @requiredInterface label:"IUserRepository"
  
  shape repo as @component label:"User Repository"
  shape providesRepo as @providedInterface label:"IUserRepository"
  
  shape connector as @assembly
  
  service -> needsRepo
  repo -> providesRepo
  providesRepo -> connector -> needsRepo
}
```

### Service Layer with Multiple Interfaces

```runiq
diagram "Service Interfaces" {
  shape service as @component label:"Order Service"
  
  # Multiple provided interfaces (API segregation)
  shape iCreate as @providedInterface label:"ICreateOrder"
  shape iQuery as @providedInterface label:"IQueryOrder"
  shape iUpdate as @providedInterface label:"IUpdateOrder"
  
  service -> iCreate
  service -> iQuery
  service -> iUpdate
  
  # Multiple required interfaces (dependencies)
  shape needsUser as @requiredInterface label:"IUserService"
  shape needsPayment as @requiredInterface label:"IPaymentService"
  
  service -> needsUser
  service -> needsPayment
}
```

### Component with Ports and Interfaces

```runiq
diagram "Full Component Specification" {
  shape apiService as @component label:"API Service"
  
  # Ports (physical connections)
  shape httpPort as @port label:"HTTP 8080"
  shape dbPort as @port label:"Database"
  
  apiService -> httpPort
  apiService -> dbPort
  
  # Provided interfaces (what it offers)
  shape iREST as @providedInterface label:"REST API"
  apiService -> iREST
  
  # Required interfaces (what it needs)
  shape needsCache as @requiredInterface label:"ICache"
  apiService -> needsCache
}
```

---

## Tips for Effective Component Diagrams

1. **Start High-Level**: Begin with major components, add detail progressively
2. **Interface First**: Define interfaces before components
3. **Show Dependencies**: Use required/provided interfaces and assembly connectors
4. **Layer Organization**: Arrange components by architectural layer
5. **Limit Scope**: One diagram per architectural view (don't try to show everything)
6. **Consistent Naming**: Use naming conventions (I prefix for interfaces)
7. **Document Ports**: Include protocol and port number in labels
8. **Use Templates**: For generic or reusable components
