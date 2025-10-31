# Example Gallery

Browse interactive examples organized by diagram type. Click any example to view the code and try it in the online editor.

## Architecture Diagrams

### C4 System Context

```runiq
diagram "Banking System - System Context"
  direction: TB
  spacing: 120

// External actors
shape customer as @actor label: "Customer" description: "Bank customer"
shape admin as @actor label: "Admin Staff" description: "Bank employees"

// System
shape banking as @c4-system label: "Internet Banking System" description: "Allows customers to view info and make transactions"

// External systems
shape mainframe as @c4-ext-system label: "Mainframe" description: "Stores customer accounts"
shape email as @c4-ext-system label: "Email System" description: "Sends emails to customers"

// Relationships
customer -> banking label: "Views balances, makes payments"
admin -> banking label: "Administers accounts"
banking -> mainframe label: "Gets account data"
banking -> email label: "Sends notifications"
```

[Try this example →](https://editor.runiq.org)

---

### Microservices Architecture

```runiq
diagram "E-Commerce Platform - Microservices"
  direction: TB
  spacing: 100

container "Frontend Layer" backgroundColor: "#e3f2fd" borderColor: "#2196f3" {
  shape web as @c4-web label: "Web App" description: "React SPA"
  shape mobile as @c4-mobile label: "Mobile App" description: "iOS & Android"
}

container "API Gateway" backgroundColor: "#f3e5f5" borderColor: "#9c27b0" {
  shape gateway as @c4-component label: "API Gateway" description: "Kong"
}

container "Services" backgroundColor: "#fff3e0" borderColor: "#ff9800" {
  shape auth as @c4-component label: "Auth Service" description: "JWT tokens"
  shape catalog as @c4-component label: "Catalog Service" description: "Product data"
  shape orders as @c4-component label: "Orders Service" description: "Order processing"
  shape payment as @c4-component label: "Payment Service" description: "Payment gateway"
}

container "Data Layer" backgroundColor: "#e8f5e9" borderColor: "#4caf50" {
  shape postgres as @db label: "PostgreSQL" description: "Transactional data"
  shape redis as @db label: "Redis" description: "Cache & sessions"
  shape s3 as @storage label: "S3" description: "Product images"
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
```

[Try this example →](https://editor.runiq.org)

---

## Flowcharts

### Authentication Flow

```runiq
diagram "User Authentication Flow"
  direction: TB
  spacing: 80

shape start as @start-end label: "Start"
shape input as @input-output label: "Enter Credentials"
shape validate as @process label: "Validate Input"
shape checkFormat as @decision label: "Format Valid?"
shape authenticate as @process label: "Check Database"
shape checkAuth as @decision label: "Credentials Match?"
shape createSession as @process label: "Create Session"
shape sendError as @process label: "Send Error"
shape redirect as @process label: "Redirect to Dashboard"
shape end as @start-end label: "End"

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
```

[Try this example →](https://editor.runiq.org)

---

## BPMN Diagrams

### Cross-Functional Process

```runiq
diagram "Cross-Functional Order Process"
  direction: LR
  spacing: 100

container "Customer" backgroundColor: "#e3f2fd" borderColor: "#2196f3" {
  shape order as @bpmn-task label: "Place Order"
  shape payment as @bpmn-task label: "Make Payment"
  shape receive as @bpmn-task label: "Receive Items"
}

container "Sales" backgroundColor: "#f3e5f5" borderColor: "#9c27b0" {
  shape validate as @bpmn-task label: "Validate Order"
  shape check as @bpmn-gateway label: "Stock Available?"
  shape notify as @bpmn-task label: "Notify Customer"
}

container "Warehouse" backgroundColor: "#fff3e0" borderColor: "#ff9800" {
  shape pick as @bpmn-task label: "Pick Items"
  shape pack as @bpmn-task label: "Pack Order"
  shape ship as @bpmn-task label: "Ship Package"
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
```

[Try this example →](https://editor.runiq.org)

---

## Container Diagrams with Templates

### Dashboard with Reusable Components

```runiq
// Define templates for reusable container styles
template widget
  backgroundColor: "#ffffff"
  borderColor: "#e0e0e0"
  borderRadius: 8
  padding: 16

template panel
  backgroundColor: "#f5f5f5"
  borderColor: "#bdbdbd"
  padding: 20

diagram "Dashboard Components"
  direction: TB
  spacing: 80

container "Header" template:panel {
  shape logo as @rect label: "Logo"
  shape nav as @rect label: "Navigation"
  shape user as @actor label: "User Menu"
}

container "Main Content" template:panel {
  container "Metrics" template:widget {
    shape revenue as @rect label: "Revenue: $125K"
    shape users as @rect label: "Active Users: 1,234"
    shape orders as @rect label: "Orders: 89"
  }

  container "Charts" template:widget {
    shape sales as @rect label: "Sales Chart"
    shape traffic as @rect label: "Traffic Graph"
  }

  container "Recent Activity" template:widget {
    shape activity1 as @rect label: "User signup"
    shape activity2 as @rect label: "New order"
    shape activity3 as @rect label: "Payment received"
  }
}

container "Footer" template:panel {
  shape copyright as @rect label: "© 2025"
  shape links as @rect label: "Links"
}
```

[Try this example →](https://editor.runiq.org)

---

## Network Diagrams

### AWS VPC Architecture

```runiq
diagram "AWS VPC Architecture"
  direction: TB
  spacing: 120

container "VPC 10.0.0.0/16" backgroundColor: "#e8f5e9" borderColor: "#4caf50" padding: 30 {

  container "Public Subnet" backgroundColor: "#e3f2fd" borderColor: "#2196f3" padding: 20 {
    shape igw as @aws-gateway label: "Internet Gateway"
    shape nat as @aws-gateway label: "NAT Gateway"
    shape alb as @aws-elb label: "Application Load Balancer"
    shape bastion as @aws-ec2 label: "Bastion Host"
  }

  container "Private Subnet A" backgroundColor: "#fff3e0" borderColor: "#ff9800" padding: 20 {
    shape web1 as @aws-ec2 label: "Web Server 1"
    shape web2 as @aws-ec2 label: "Web Server 2"
  }

  container "Private Subnet B" backgroundColor: "#fff3e0" borderColor: "#ff9800" padding: 20 {
    shape app1 as @aws-ec2 label: "App Server 1"
    shape app2 as @aws-ec2 label: "App Server 2"
  }

  container "Data Tier" backgroundColor: "#fce4ec" borderColor: "#e91e63" padding: 20 {
    shape rds as @aws-rds label: "RDS Primary"
    shape rds-standby as @aws-rds label: "RDS Standby"
    shape elasticache as @aws-elasticache label: "ElastiCache"
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

rds -> rds-standby label: "replication"
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
- [Class Diagrams](/examples/class-diagrams) - UML class diagrams, relationships
- [Sequence Diagrams](/examples/sequence) - Interactions, message flows
- [Charts](/examples/charts) - Pie charts, bar charts, data visualization
- [Mindmaps](/examples/mindmaps) - Hierarchical concepts, idea maps
- [Pedigree](/examples/pedigree) - Family trees, genealogy
- [Quantum Circuits](/examples/quantum) - Quantum gates, circuits

## Contributing Examples

Have a great example to share? We'd love to include it in the gallery!

1. Fork the [Runiq repository](https://github.com/jgreywolf/runiq)
2. Add your `.runiq` file to the appropriate `examples/` subdirectory
3. Submit a pull request with a brief description

See our [Contributing Guide](/contributing) for more details.
