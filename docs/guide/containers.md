# Containers

Containers group related shapes together, creating visual boundaries and hierarchical structures in your diagrams.

## Basic Container Syntax

### Simple Container

```runiq
diagram "Basic Container" {

  container "My Container" {
    shape A as @rect label: "Node A"
    shape B as @rect label: "Node B"
    A -> B
  }
}
```

## Container with Styling

### Background and Border

```runiq
diagram "Styled Container" {

  container "Backend Services"
    backgroundColor: "#e3f2fd"
    borderColor: "#2196f3"
    padding: 20
  {
    shape API as @rect label: "API Server"
    shape DB as @cylinder label: "Database"
    API -> DB
  }
}
```

## Multiple Containers

```runiq
diagram "Microservices Architecture" {

  container "Frontend" backgroundColor: "#fff3e0" {
    shape UI as @rect label: "React App"
  }

  container "Backend" backgroundColor: "#e8f5e9" {
    shape API as @rect label: "REST API"
    shape Queue as @rect label: "Message Queue"
    API -> Queue
  }

  container "Data" backgroundColor: "#f3e5f5" {
    shape DB as @cylinder label: "PostgreSQL"
    shape Cache as @cylinder label: "Redis"
  }

  UI -> API label: "HTTP"
  API -> DB label: "queries"
  API -> Cache label: "cache"
}
```

## Nested Containers

::: warning Nested Layout Limitation
The current layout engine (ELK) uses a flat structure. Nested containers are **parsed correctly** but **not positioned hierarchically** in the output. This is a known limitation documented in Phase 2 of hierarchical containers.

For now, use multiple top-level containers with cross-container edges instead of nesting.
:::

```runiq
diagram "Container Hierarchy" {

  container "Cloud Platform" {
    container "Compute" {
      shape VM1 as @rect label: "VM Instance"
    }

    container "Storage" {
      shape S3 as @cylinder label: "Object Storage"
    }
  }
}
```

## Cross-Container Edges

Edges can connect shapes across different containers:

```runiq
diagram "Cross-Container Communication" {

  container "Client Tier" {
    shape Browser as @rect label: "Web Browser"
  }

  container "Application Tier" {
    shape WebServer as @rect label: "Web Server"
    shape AppServer as @rect label: "App Server"
    WebServer -> AppServer
  }

  container "Data Tier" {
    shape Database as @cylinder label: "MySQL"
  }

  Browser -> WebServer label: "HTTPS"
  AppServer -> Database label: "SQL"
}
```

## Container Properties

### Padding

Control the space inside the container:

```runiq
diagram "Container Spacing" {
  container "Tight" padding: 10 {
    shape A as @rect label: "A"
  }

  container "Spacious" padding: 40 {
    shape B as @rect label: "B"
  }
}
```

### Border Styles

```runiq
diagram "Border Styles" {
  container "Solid Border"
    borderWidth: 2
    borderStyle: solid
    borderColor: "#2196f3"
  {
    shape A as @rect label: "A"
  }

  container "Dashed Border"
    borderWidth: 2
    borderStyle: dashed
    borderColor: "#ff9800"
  {
    shape B as @rect label: "B"
  }
}
```

### Shadow

Add depth with shadows:

```runiq
diagram "Shadows" {
  container "With Shadow"
  backgroundColor: "#ffffff"
  shadow: true
  {
    shape Service as @rect label: "Microservice"
  }
}
```

## Phase 5: Templates & Presets

### Presets

Define reusable container styles:

```runiq
diagram "Preset Containers" {

  preset "card" {
    backgroundColor: "#e3f2fd"
    borderColor: "#2196f3"
    padding: 20
    shadow: true
  }

  container "Service A" preset: "card" {
    shape API as @rect label: "API"
  }

  container "Service B" preset: "card" {
    shape Worker as @rect label: "Worker"
  }
}
```

### Templates

Templates allow parameterization:

```runiq
diagram "Template Containers" {

  template "microservice" {
    backgroundColor: "#e8f5e9"
    borderColor: "#4caf50"
    borderWidth: 2
    padding: 15
    resizable: true
  }

  container "Auth Service" templateId: "microservice" {
    shape Auth as @rect label: "Authentication"
  }

  container "Payment Service" templateId: "microservice" {
    shape Pay as @rect label: "Payment Gateway"
  }
}
```

### Container Inheritance

Extend existing containers with `extends`:

```runiq
diagram "Container Inheritance" {

  container "Base"
    backgroundColor: "#f0f0f0"
    padding: 15
  {
    shape Common as @rect label: "Common Logic"
  }

  container "Extended"
    extends: "Base"
    borderColor: "#2196f3"
  {
    shape Specific as @rect label: "Specific Logic"
  }
}
```

### Combining All Three

You can combine presets, templates, extends, and inline styles. The precedence order is:

**extends (lowest) → template → preset → inline (highest)**

```runiq
diagram "Full Example" {

  preset "card" {
    backgroundColor: "#e3f2fd"
    borderColor: "#2196f3"
    padding: 20
  }

  template "service" {
    borderWidth: 2
    resizable: true
  }

  container "Base" backgroundColor: "#f0f0f0" padding: 15 {
    shape base as @rect label: "Base Node"
  }

  container "API Service"
    extends: "Base"
    templateId: "service"
    preset: "card"
    backgroundColor: "#fff3e0"
  {
    shape api as @server label: "REST API"
  }
}
```

## Use Cases

### Software Architecture

```runiq
diagram "3-Tier Architecture" {

  container "Presentation Layer" {
    shape WebUI as @rect label: "Web UI"
    shape MobileUI as @rect label: "Mobile App"
  }

  container "Business Logic Layer" {
    shape API as @rect label: "API Gateway"
    shape Services as @rect label: "Business Services"
    API -> Services
  }

  container "Data Layer" {
    shape SQL as @cylinder label: "SQL Database"
    shape NoSQL as @cylinder label: "NoSQL Store"
  }

  WebUI -> API
  MobileUI -> API
  Services -> SQL
  Services -> NoSQL
}
```

### C4 Architecture Diagrams

```runiq
diagram "C4 Container View" {

  container "Web Application" {
    shape SPA as @rect label: "Single-Page Application"
  }

  container "API Application" {
    shape APIGateway as @rect label: "API Gateway"
    shape AuthService as @rect label: "Auth Service"
    shape UserService as @rect label: "User Service"
  }

  container "Database" {
    shape UserDB as @cylinder label: "User Database"
  }

  SPA -> APIGateway label: "HTTPS/JSON"
  APIGateway -> AuthService
  APIGateway -> UserService
  UserService -> UserDB
}
```

### BPMN Process Diagrams

```runiq
diagram "Order Process" {

  container "Customer" {
    shape Order as @rounded label: "Place Order"
    shape Confirm as @hexagon label: "Receive Confirmation"
  }

  container "System" {
    shape Validate as @rect label: "Validate Order"
    shape Process as @rect label: "Process Payment"
    shape Ship as @rect label: "Ship Order"

    Validate -> Process -> Ship
  }

  Order -> Validate
  Ship -> Confirm
}
```

### Network Topology

```runiq
diagram "Network Zones" {

  container "DMZ" backgroundColor: "#ffebee" {
    shape Firewall as @rect label: "Firewall"
    shape Proxy as @rect label: "Proxy Server"
  }

  container "Internal Network" backgroundColor: "#e8f5e9" {
    shape AppServer as @rect label: "App Server"
    shape DBServer as @cylinder label: "DB Server"
    AppServer -> DBServer
  }

  Firewall -> Proxy -> AppServer
}
```

## Container Style Properties

| Property        | Type                      | Default     | Example                      |
| --------------- | ------------------------- | ----------- | ---------------------------- |
| `fill`          | color                     | transparent | `backgroundColor: "#e3f2fd"` |
| `borderColor`   | color                     | #444        | `borderColor: "#2196f3"`     |
| `borderWidth`   | number                    | 1           | `borderWidth: 2`             |
| `borderStyle`   | solid \| dashed \| dotted | solid       | `borderStyle: dashed`        |
| `padding`       | number                    | 20          | `padding: 30`                |
| `paddingTop`    | number                    | -           | `paddingTop: 10`             |
| `paddingRight`  | number                    | -           | `paddingRight: 10`           |
| `paddingBottom` | number                    | -           | `paddingBottom: 10`          |
| `paddingLeft`   | number                    | -           | `paddingLeft: 10`            |
| `shadow`        | boolean                   | false       | `shadow: true`               |
| `opacity`       | number                    | 1.0         | `opacity: 0.8`               |

### Phase 5 Properties

| Property     | Type    | Default | Example                          |
| ------------ | ------- | ------- | -------------------------------- |
| `templateId` | string  | -       | `templateId: "service-template"` |
| `preset`     | string  | -       | `preset: "card"`                 |
| `extends`    | string  | -       | `extends: "BaseContainer"`       |
| `resizable`  | boolean | false   | `resizable: true`                |

## Best Practices

### 1. **Meaningful Names**

❌ Bad:

```runiq
container "Container1" { }
```

✅ Good:

```runiq
container "Authentication Service" { }
```

### 2. **Consistent Styling**

Define presets for common patterns:

```runiq
preset "frontend" {
  backgroundColor: "#fff3e0"
  borderColor: "#ff9800"
}

preset "backend" {
  backgroundColor: "#e8f5e9"
  borderColor: "#4caf50"
}

preset "database" {
  backgroundColor: "#f3e5f5"
  borderColor: "#9c27b0"
}
```

### 3. **Logical Grouping**

Group by:

- **Layer** (Frontend, Backend, Data)
- **Service** (Auth, Payment, Notification)
- **Environment** (Dev, Staging, Production)
- **Network Zone** (Public, Private, DMZ)

### 4. **Avoid Deep Nesting**

Due to layout engine limitations, use flat structure with multiple containers instead of deep nesting.

## Known Limitations

1. **Nested Container Layout**: ELK adapter uses flat structure (see `elk-adapter.ts:43-47`)
2. **Visual Controls**: Collapse buttons and resize handles not rendered yet (Phase 4)
3. **Container Shape**: Custom container shapes not yet supported

## See Also

- [Phase 5 Editor Guide](/apps/editor/PHASE5-EDITOR-GUIDE.md) - Templates & Presets usage
- [Styling](/guide/styling) - Customize appearance
- [Layout](/guide/layout) - Control diagram layout
- [Examples: Containers](/examples/containers) - Real-world examples
