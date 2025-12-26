<!-- Gallery JSON index for UI - included so docs build packages these assets -->

# Gallery JSON

The gallery JSON files used by the documentation UI are included here. They are generated from `docs/examples/metadata.json` and written to these files:

- [gallery-all.json](gallery-all.json)
- [gallery-diagram.json](gallery-diagram.json)
- [gallery-charts.json](gallery-charts.json)
- [gallery-schematic.json](gallery-schematic.json)
- [gallery-glyphset.json](gallery-glyphset.json)
- [gallery-sequence.json](gallery-sequence.json)

Use these JSON endpoints from the documentation front-end or gallery UI to populate lists and filters.

# Example Gallery

Browse interactive examples organized by diagram type. Click any example to view the code and try it in the online editor.

## Architecture Diagrams

### C4 System Context

```runiq
diagram "Banking System - System Context" {
  direction TB
  spacing: 120

  // External actors
  shape customer as @actor label: "Customer" description: "Bank customer"
  shape admin as @actor label: "Admin Staff" description: "Bank employees"

  // System
  shape banking as @c4System label: "Internet Banking System" description: "Allows customers to view info and make transactions"

  // External systems
  shape mainframe as @c4System label: "Mainframe" description: "Stores customer accounts"
  shape email as @c4System label: "Email System" description: "Sends emails to customers"

  // Relationships
  customer -> banking label: "Views balances, makes payments"
  admin -> banking label: "Administers accounts"
  banking -> mainframe label: "Gets account data"
  banking -> email label: "Sends notifications"
}
```

[Try this example →](https://editor.runiq.org)

---

### Microservices Architecture

```runiq
diagram "E-Commerce Platform - Microservices" {
  direction TB

  container "Frontend Layer" fillColor: "#e3f2fd" strokeColor: "#2196f3" {
    shape web as @c4Container label: "Web App\nReact SPA"
    shape mobile as @c4Container label: "Mobile App\niOS & Android"
  }

  container "API Gateway" fillColor: "#f3e5f5" strokeColor: "#9c27b0" {
    shape gateway as @c4Component label: "API Gateway\nKong"
  }

  container "Services" fillColor: "#fff3e0" strokeColor: "#ff9800" {
    shape auth as @c4Component label: "Auth Service\nJWT tokens"
    shape catalog as @c4Component label: "Catalog Service\nProduct data"
    shape orders as @c4Component label: "Orders Service\nOrder processing"
    shape payment as @c4Component label: "Payment Service\nPayment gateway"
  }

  container "Data Layer" fillColor: "#e8f5e9" strokeColor: "#4caf50" {
    shape postgres as @db label: "PostgreSQL\nTransactional data"
    shape redis as @db label: "Redis\nCache & sessions"
    shape s3 as @storage label: "S3\nProduct images"
  }

  // Frontend to Gateway
  web -> gateway
  mobile -> gateway

  // Gateway to Services
  gateway -> auth
  gateway -> catalog
  gateway -> orders
  gateway -> payment

  // Services to Data
  auth -> redis
  catalog -> postgres
  catalog -> s3
  orders -> postgres
  payment -> postgres
}
```

[Try this example →](https://editor.runiq.org)

---

## Flowcharts

### Authentication Flow

```runiq
diagram "User Authentication Flow" {
  direction TB

  shape start as @stadium label: "Start"
  shape input as @input label: "Enter Credentials"
  shape validate as @process label: "Validate Input"
  shape checkFormat as @decision label: "Format Valid?"
  shape authenticate as @process label: "Check Database"
  shape checkAuth as @decision label: "Credentials Match?"
  shape createSession as @process label: "Create Session"
  shape sendError as @process label: "Send Error"
  shape redirect as @process label: "Redirect to Dashboard"
  shape end as @stadium label: "End"

  start -> input
  input -> validate
  validate -> checkFormat
  checkFormat -yes-> authenticate
  checkFormat -no-> sendError
  authenticate -> checkAuth
  checkAuth -yes-> createSession
  checkAuth -no-> sendError
  createSession -> redirect
  sendError -> input
  redirect -> end
}
```

[Try this example →](https://editor.runiq.org)

---

## BPMN Diagrams

### Cross-Functional Process

```runiq
diagram "Cross-Functional Order Process" {
  direction LR

  container "Customer" fillColor: "#e3f2fd" strokeColor: "#2196f3" {
    shape order as @bpmnTask label: "Place Order"
    shape payment as @bpmnTask label: "Make Payment"
    shape receive as @bpmnTask label: "Receive Items"
  }

  container "Sales" fillColor: "#f3e5f5" strokeColor: "#9c27b0" {
    shape validate as @bpmnTask label: "Validate Order"
    shape check as @bpmnGateway label: "Stock Available?"
    shape notify as @bpmnTask label: "Notify Customer"
  }

  container "Warehouse" fillColor: "#fff3e0" strokeColor: "#ff9800" {
    shape pick as @bpmnTask label: "Pick Items"
    shape pack as @bpmnTask label: "Pack Order"
    shape ship as @bpmnTask label: "Ship Package"
  }

  // Customer lane
  order -> payment
  payment -> receive

  // Cross-lane edges
  order -> validate
  payment -> check
  check -yes-> pick
  check -no-> notify
  ship -> receive

  // Sales lane
  validate -> check
  check -> notify

  // Warehouse lane
  pick -> pack
  pack -> ship
}
```

[Try this example →](https://editor.runiq.org)

---

## Container Diagrams with Templates

### Dashboard with Reusable Components

```runiq
diagram "Dashboard Components" {
  direction TB

  // Define templates for reusable container styles
  template: "widget" {
    fillColor: "#ffffff"
    strokeColor: "#e0e0e0"
    padding: 16
  }
  template: "panel" {
    fillColor: "#f5f5f5"
    padding: 20
  }
  container "Header" templateId:"panel" {
    shape logo as @rect label: "Logo"
    shape nav as @rect label: "Navigation"
    shape user as @actor label: "User Menu"
  }

  container "Main Content" templateId:"panel" {
    container "Metrics" templateId:"widget" {
      shape revenue as @rect label: "Revenue: $125K"
      shape users as @rect label: "Active Users: 1,234"
      shape orders as @rect label: "Orders: 89"
    }

    container "Charts" templateId:"widget" {
      shape sales as @rect label: "Sales Chart"
      shape traffic as @rect label: "Traffic Graph"
    }

    container "Recent Activity" templateId:"widget" {
      shape activity1 as @rect label: "User signup"
      shape activity2 as @rect label: "New order"
      shape activity3 as @rect label: "Payment received"
    }
  }

  container "Footer" templateId:"panel" {
    shape copyright as @rect label: "© 2025"
    shape links as @rect label: "Links"
  }
}
```

[Try this example →](https://editor.runiq.org)

---

## Network Diagrams

### AWS VPC Architecture

```runiq
diagram "AWS VPC Architecture" {
  direction TB

  container "VPC 10.0.0.0/16" fillColor: "#e8f5e9" strokeColor: "#4caf50" padding: 30 {

    container "Public Subnet" fillColor: "#e3f2fd" strokeColor: "#2196f3" padding: 20 {
      shape igw as @awsApiGateway label: "Internet Gateway"
      shape nat as @awsApiGateway label: "NAT Gateway"
      shape alb as @loadBalancer label: "Application Load Balancer"
      shape bastion as @awsEc2 label: "Bastion Host"
    }

    container "Private Subnet A" fillColor: "#fff3e0" strokeColor: "#ff9800" padding: 20 {
      shape web1 as @awsEc2 label: "Web Server 1"
      shape web2 as @awsEc2 label: "Web Server 2"
    }

    container "Private Subnet B" fillColor: "#fff3e0" strokeColor: "#ff9800" padding: 20 {
      shape app1 as @awsEc2 label: "App Server 1"
      shape app2 as @awsEc2 label: "App Server 2"
    }

    container "Data Tier" fillColor: "#fce4ec" strokeColor: "#e91e63" padding: 20 {
      shape rds as @awsRds label: "RDS Primary"
      shape rdsStandby as @awsRds label: "RDS Standby"
      shape elasticache as @db label: "ElastiCache"
    }
  }

  // External
  shape users as @actor label: "Users"
  shape admin as @actor label: "Administrators"

  // Connections
  users -> igw
  igw -> alb
  alb -> web1
  alb -> web2
  admin -> bastion

  web1 -> nat
  web2 -> nat
  nat -> igw

  web1 -> app1
  web2 -> app2

  app1 -> rds
  app2 -> rds
  app1 -> elasticache
  app2 -> elasticache

  rds -> rdsStandby label: "replication"
}
```

[Try this example →](https://editor.runiq.org)

---

## What's Next?

- **[Getting Started](/guide/getting-started)** - Install Runiq and create your first diagram
- **[DSL Reference](/reference/dsl)** - Complete syntax documentation
- **[Shape Catalog](/reference/shapes)** - All 52 available shapes
- **[Try the Editor](https://editor.runiq.org)** - Create diagrams online

## More Examples

Explore additional examples organized by category:

- [Flowcharts](/examples/flowcharts) - Decision trees, processes, algorithms
- [Electrical Circuits](/examples/electrical) - Analog circuits, schematics
- [Digital Circuits](/examples/digital) - Logic gates, digital systems
- [Sequence Diagrams](/examples/sequence-diagrams) - Interactions, message flows
<!-- - [Pedigree](/examples/pedigree) - Family trees, genealogy -->

## Contributing Examples

Have a great example to share? We'd love to include it in the gallery!

1. Fork the [Runiq repository](https://github.com/jgreywolf/runiq)
2. Add your `.runiq` file to the appropriate `examples/` subdirectory
3. Submit a pull request with a brief description

See our [Contributing Guide](/contributing) for more details.
