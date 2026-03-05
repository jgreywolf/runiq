# Container Diagram Examples

Hierarchical containers for architecture diagrams, microservices, and complex system structures.

## Simple Container

Basic container with nested shapes.

### DSL Code

```runiq
diagram "Simple Container Example" {
  direction TB

  container "Frontend" {
    shape UI as @rect label: "Web UI"
    shape Router as @rect label: "Router"
  }

  container "Backend" {
    shape API as @rect label: "REST API"
    shape DB as @cylinder label: "Database"
  }

  # Cross-container edges
  UI -> Router
  Router -> API
  API -> DB
}
```

### Generated SVG

![Simple Container](/examples/simple-container.svg)

### Use Cases

- Logical grouping of components
- System boundaries
- Deployment zones
- Network segments

## C4 Context Diagram

System context showing external actors and systems.

### DSL Code

```runiq
diagram "C4 Context - Banking System" {
  direction TB

  # Central system
  shape BankingSystem as @rect
    label: "Internet Banking\nSystem"
    fillColor: "#1168bd"
    textColor: "#ffffff"

  # External actors
  shape Customer as @actor label: "Personal Banking\nCustomer"
  shape Admin as @actor label: "Bank Staff"

  # External systems
  shape EmailSystem as @rect
    label: "Email System"
    fillColor: "#999999"
  shape MainframeSystem as @rect
    label: "Mainframe Banking\nSystem"
    fillColor: "#999999"

  # Relationships
  Customer -> BankingSystem label: "Views accounts,\nmakes payments"
  Admin -> BankingSystem label: "Manages customers"
  BankingSystem -> EmailSystem label: "Sends email"
  BankingSystem -> MainframeSystem label: "Gets account data"
}
```

### C4 Model Hierarchy

1. **Context**: System boundaries and external dependencies
2. **Container**: Applications and data stores
3. **Component**: Internal structure of containers
4. **Code**: Class-level details (optional)

## C4 Container Diagram

Zooming into the system to show containers.

### DSL Code

```runiq
diagram "C4 Container - Banking System" {
  direction TB

  shape Customer as @actor label: "Personal Banking\nCustomer"

  container "Internet Banking System" fillColor: "#e3f2fd" {

    shape WebApp as @rect
      label: "Web Application\n[JavaScript, React]"
      fillColor: "#1168bd"
      textColor: "#ffffff"

    shape API as @rect
      label: "API Application\n[Java, Spring Boot]"
      fillColor: "#1168bd"
      textColor: "#ffffff"

    shape DB as @cylinder
      label: "Database\n[Oracle]"
      fillColor: "#1168bd"
      textColor: "#ffffff"
  }

  # External systems
  shape EmailSystem as @rect
    label: "Email System\n[Microsoft Exchange]"
    fillColor: "#999999"

  shape Mainframe as @rect
    label: "Mainframe System\n[IBM z/OS]"
    fillColor: "#999999"

  # Relationships
  Customer -> WebApp label: "Uses\n[HTTPS]"
  WebApp -> API label: "Makes API calls\n[JSON/HTTPS]"
  API -> DB label: "Reads/writes\n[JDBC]"
  API -> EmailSystem label: "Sends email\n[SMTP]"
  API -> Mainframe label: "Gets data\n[XML/HTTPS]"
}
```

### Technology Labels

Include technology stack in labels:

- `[JavaScript, React]` - Frontend
- `[Java, Spring Boot]` - Backend
- `[Oracle]` - Database
- `[HTTPS]`, `[JSON]`, `[JDBC]` - Protocols

## Microservices Architecture

Modern distributed system with multiple services.

### DSL Code

```runiq
diagram "Microservices Architecture" {
  direction TB

  # API Gateway
  shape Gateway as @rect
    label: "API Gateway\n[Nginx]"
    fillColor: "#ff9800"
    textColor: "#ffffff"

  container "User Services" fillColor: "#e3f2fd" {
    shape Auth as @rect label: "Auth Service\n[Node.js]"
    shape User as @rect label: "User Service\n[Node.js]"
    shape AuthDB as @cylinder label: "Auth DB\n[MongoDB]"
    shape UserDB as @cylinder label: "User DB\n[PostgreSQL]"
  }

  container "Business Services" fillColor: "#fff3e0" {
    shape Order as @rect label: "Order Service\n[Java]"
    shape Payment as @rect label: "Payment Service\n[Java]"
    shape Inventory as @rect label: "Inventory Service\n[Go]"
    shape OrderDB as @cylinder label: "Order DB\n[PostgreSQL]"
    shape PaymentDB as @cylinder label: "Payment DB\n[PostgreSQL]"
    shape InventoryDB as @cylinder label: "Inventory DB\n[Redis]"
  }

  container "Infrastructure" fillColor: "#e8f5e9" {
    shape MessageBroker as @rect label: "Message Broker\n[RabbitMQ]"
    shape ServiceDiscovery as @rect label: "Service Discovery\n[Consul]"
  }

  # External
  shape Client as @actor label: "Mobile App"

  # Connections
  Client -> Gateway
  Gateway -> Auth
  Gateway -> User
  Gateway -> Order
  Gateway -> Payment
  Gateway -> Inventory

  Auth -> AuthDB
  User -> UserDB
  Order -> OrderDB
  Payment -> PaymentDB
  Inventory -> InventoryDB

  Order -> MessageBroker
  Payment -> MessageBroker
  Inventory -> MessageBroker

  Auth -> ServiceDiscovery
  User -> ServiceDiscovery
  Order -> ServiceDiscovery
  Payment -> ServiceDiscovery
  Inventory -> ServiceDiscovery
}
```

### Microservices Patterns

**Service Mesh**: Communication between services

- Service discovery
- Load balancing
- Circuit breakers

**Event-Driven**: Asynchronous messaging

- Message queues
- Event bus
- Pub/sub

**Data Isolation**: Each service owns its data

- Separate databases
- No shared tables
- API-only access

## Three-Tier Architecture

Classic web application structure.

### DSL Code

```runiq
diagram "Three-Tier Web Application" {
  direction TB

  container "Presentation Tier" fillColor: "#e3f2fd" {
    shape Browser as @rect label: "Web Browser"
    shape WebServer as @rect label: "Web Server\n[Apache]"
    shape StaticContent as @doc label: "Static Assets"
  }

  container "Application Tier" fillColor: "#fff3e0" {
    shape AppServer1 as @rect label: "App Server 1\n[Tomcat]"
    shape AppServer2 as @rect label: "App Server 2\n[Tomcat]"
    shape LoadBalancer as @rect label: "Load Balancer\n[HAProxy]"
  }

  container "Data Tier" fillColor: "#e8f5e9" {
    shape PrimaryDB as @cylinder label: "Primary DB\n[MySQL]"
    shape ReplicaDB as @cylinder label: "Replica DB\n[MySQL]"
    shape Cache as @cylinder label: "Cache\n[Memcached]"
  }

  # Connections - Presentation to Application
  Browser -> WebServer
  WebServer -> LoadBalancer
  LoadBalancer -> AppServer1
  LoadBalancer -> AppServer2

  # Application to Data
  AppServer1 -> PrimaryDB
  AppServer1 -> Cache
  AppServer2 -> PrimaryDB
  AppServer2 -> Cache
  PrimaryDB -> ReplicaDB label: "replication"
}
```

## BPMN-Style Swimlanes

Process flow with organizational boundaries.

### DSL Code

```runiq
diagram "Purchase Order Process" {
  direction LR

  container "Customer" fillColor: "#e3f2fd" {
    shape C1 as @rounded label: "Start"
    shape C2 as @rect label: "Submit\nOrder"
    shape C3 as @rhombus label: "Approved?"
    shape C4 as @hexagon label: "Receive\nGoods"
    shape C5 as @rounded label: "End"
  }

  container "Sales Department" fillColor: "#fff3e0" {
    shape S1 as @rect label: "Review\nOrder"
    shape S2 as @rect label: "Check\nInventory"
    shape S3 as @rect label: "Approve\nOrder"
    shape S4 as @doc label: "Generate\nInvoice"
  }

  container "Warehouse" fillColor: "#e8f5e9" {
    shape W1 as @rect label: "Pick\nItems"
    shape W2 as @rect label: "Pack\nOrder"
    shape W3 as @rect label: "Ship\nGoods"
  }

  # Process flow
  C1 -> C2
  C2 -> S1
  S1 -> S2
  S2 -> S3
  S3 -> C3
  C3 -yes-> S4
  S4 -> W1
  W1 -> W2
  W2 -> W3
  W3 -> C4
  C4 -> C5
  C3 -no-> C5
}
```

### Generated SVG

![BPMN Cross-Functional](/examples/bpmn-cross-functional.svg)

## Multi-Region Deployment

Geographic distribution with replication.

### DSL Code

```runiq
diagram "Multi-Region Architecture" {
  direction TB

  container "US East Region" fillColor: "#e3f2fd" {
    shape USLb as @rect label: "Load Balancer"
    shape USApp1 as @rect label: "App Server 1"
    shape USApp2 as @rect label: "App Server 2"
    shape USDB as @cylinder label: "Primary DB"
  }

  container "EU West Region" fillColor: "#fff3e0" {
    shape EULb as @rect label: "Load Balancer"
    shape EUApp1 as @rect label: "App Server 1"
    shape EUApp2 as @rect label: "App Server 2"
    shape EUDB as @cylinder label: "Replica DB"
  }

  container "APAC Region" fillColor: "#e8f5e9" {
    shape APLb as @rect label: "Load Balancer"
    shape APApp1 as @rect label: "App Server 1"
    shape APApp2 as @rect label: "App Server 2"
    shape APDB as @cylinder label: "Replica DB"
  }

  # Global
  shape CDN as @cloud label: "CDN\n[CloudFlare]"
  shape DNS as @cloud label: "Global DNS\n[Route53]"

  # Connections
  DNS -> CDN
  CDN -> USLb
  CDN -> EULb
  CDN -> APLb

  USLb -> USApp1
  USLb -> USApp2
  USApp1 -> USDB
  USApp2 -> USDB

  EULb -> EUApp1
  EULb -> EUApp2
  EUApp1 -> EUDB
  EUApp2 -> EUDB

  APLb -> APApp1
  APLb -> APApp2
  APApp1 -> APDB
  APApp2 -> APDB

  # Replication
  USDB -> EUDB label: "replicate"
  USDB -> APDB label: "replicate"
}
```

### Generated SVG

![Multi-Region Architecture](/examples/multi-region.svg)

## Container Styling

### Background Colors

```runiq
diagram "Container Background Colors" {
  container "Frontend" fillColor: "#e3f2fd" {
    # Light blue background
  }

  container "Backend" fillColor: "#fff3e0" {
    # Light orange background
  }

  container "Database" fillColor: "#e8f5e9" {
    # Light green background
  }
}
```

### Border Styles

```runiq
diagram "Container Border Styles" {
  container "Secure Zone"
    strokeColor: "#f44336"
    strokeWidth: 3
    borderStyle: dashed {
    # Dashed red border
  }
}
```

### Nested Containers

```runiq
diagram "Nested Containers" {
  container "Data Center" {
    container "Rack 1" {
      shape Server1 as @rect
      shape Server2 as @rect
    }

    container "Rack 2" {
      shape Server3 as @rect
      shape Server4 as @rect
    }
  }
}
```

## Best Practices

::: tip Color Coding
Use consistent colors for container types:

- **Blue** (#e3f2fd): Frontend/UI layers
- **Orange** (#fff3e0): Backend/API layers
- **Green** (#e8f5e9): Data/infrastructure layers
- **Gray** (#999999): External systems
  :::

::: tip Labels
Include technology stack in labels:

```runiq
shape API as @rect label: "API Service\n[Java, Spring Boot]"
```

Format: `Name\n[Technology]`
:::

::: tip Cross-Container Edges
Always connect shapes across containers:

```runiq
# ✅ Good
Frontend.UI -> Backend.API

# ❌ Avoid orphaned shapes
```

:::

## Use Cases

### Software Architecture

- C4 model diagrams
- Microservices topology
- Component relationships

### Infrastructure

- Multi-region deployments
- Network zones (DMZ, private, public)
- Cloud architecture (VPC, subnets)

### Business Processes

- BPMN swimlanes
- Organizational boundaries
- Cross-functional workflows

### Deployment

- Docker containers
- Kubernetes pods/namespaces
- VM distributions

## Next Steps

- [Use Case Diagrams →](/examples/use-case) - Actor interactions
- [Flowcharts →](/examples/flowcharts) - Process flows
- [Reference →](/reference/shapes) - All shape types

---

## Download Examples

All example `.runiq` files are available in the [GitHub repository](https://github.com/jgreywolf/runiq/tree/main/examples).

```bash
git clone https://github.com/jgreywolf/runiq.git
cd runiq/examples
```
