---
title: Network Diagrams
description: Design network topologies with servers, routers, switches, firewalls, and cloud infrastructure using specialized icons.
lastUpdated: 2025-01-09
---

# Network Diagrams

Create network topology and infrastructure diagrams with Runiq's diagram profile.

## Overview

Network diagrams visualize computer networks, infrastructure layouts, and system connectivity. Runiq provides specialized shapes for servers, routers, switches, firewalls, and cloud services.

## Key Shapes

- **Server**: `@server` - Physical or virtual servers
- **Router**: `@router` - Network routing devices
- **Switch**: `@switch` - Network switches
- **Firewall**: `@firewall` - Security appliances
- **Load Balancer**: `@loadBalancer` - Traffic distribution
- **Cloud**: `@cloud` - Cloud services
- **Storage**: `@storage` - Network storage devices

See the [Shape Reference - Network Shapes](/reference/shapes#_8-network-shapes-7-shapes) for the complete list.

## Basic Network Topology

```runiq
diagram "Office Network" {
  direction TB

  shape internet as @cloud label: "Internet"
  shape router as @router label: "Router"
  shape firewall as @firewall label: "Firewall"
  shape switch as @switch label: "Core Switch"
  shape server1 as @server label: "Web Server"
  shape server2 as @server label: "DB Server"
  shape storage as @storage label: "NAS"

  internet -> router
  router -> firewall
  firewall -> switch
  switch -> server1
  switch -> server2
  switch -> storage
}
```

## Three-Tier Web Architecture

```runiq
diagram "Three-Tier Architecture" {
  direction TB

  shape users as @cloud label: "Internet Users"
  shape lb as @loadBalancer label: "Load Balancer"

  container webTier "Web Tier" {
    shape web1 as @server label: "Web Server 1"
    shape web2 as @server label: "Web Server 2"
    shape web3 as @server label: "Web Server 3"
  }

  container appTier "Application Tier" {
    shape app1 as @server label: "App Server 1"
    shape app2 as @server label: "App Server 2"
  }

  container dataTier as @systemBoundary label: "Data Tier" {
    shape db as @server label: "Database Primary"
    shape dbReplica as @server label: "Database Replica"
    shape cache as @server label: "Redis Cache"
  }

  users -> lb label: "HTTPS"
  lb -> web1
  lb -> web2
  lb -> web3
  web1 -> app1 label: "HTTP"
  web2 -> app1
  web3 -> app2
  app1 -> db
  app2 -> db
  db -> dbReplica label: "Replication"
  app1 -> cache
  app2 -> cache
}
```

## DMZ Architecture

```runiq
diagram "DMZ Network" {
  direction LR

  shape internet as @cloud label: "Internet"
  shape outerFW as @firewall label: "External\nFirewall"

  container dmz as @systemBoundary label: "DMZ" {
    shape webServer as @server label: "Web Server"
    shape emailServer as @server label: "Email Server"
  }

  shape innerFW as @firewall label: "Internal\nFirewall"

  container internal as @systemBoundary label: "Internal Network" {
    shape appServer as @server label: "App Server"
    shape dbServer as @server label: "Database"
    shape fileServer as @storage label: "File Server"
  }

  internet -> outerFW
  outerFW -> webServer
  outerFW -> emailServer
  webServer -> innerFW
  innerFW -> appServer
  appServer -> dbServer
  appServer -> fileServer
}
```

## High Availability Setup

```runiq
diagram "HA Infrastructure" {
  direction TB

  shape internet as @cloud label: "Internet"

  container primary as @systemBoundary label: "Primary Data Center" {
    shape router1 as @router label: "Router 1"
    shape fw1 as @firewall label: "Firewall 1"
    shape lb1 as @loadBalancer label: "LB 1"
    shape web1 as @server label: "Web 1"
    shape db1 as @server label: "DB Primary"
  }

  container secondary as @systemBoundary label: "Secondary Data Center" {
    shape router2 as @router label: "Router 2"
    shape fw2 as @firewall label: "Firewall 2"
    shape lb2 as @loadBalancer label: "LB 2"
    shape web2 as @server label: "Web 2"
    shape db2 as @server label: "DB Standby"
  }

  internet -> router1 label: "Primary"
  internet -> router2 label: "Failover"
  router1 -> fw1
  router2 -> fw2
  fw1 -> lb1
  fw2 -> lb2
  lb1 -> web1
  lb2 -> web2
  web1 -> db1
  web2 -> db2
  db1 -> db2 label: "Replication" style: { strokeDasharray: "5,5" }
}
```

## VPN Setup

```runiq
diagram "Remote Access VPN" {
  direction LR

  shape remote as @server label: "Remote\nWorker"
  shape vpn as @cloud label: "VPN Gateway"
  shape fw as @firewall label: "Corporate\nFirewall"
  shape router as @router label: "Core Router"

  container corp as @systemBoundary label: "Corporate Network" {
    shape fileServer as @storage label: "File Server"
    shape appServer as @server label: "App Server"
    shape dbServer as @server label: "Database"
  }

  remote -> vpn label: "SSL VPN"
  vpn -> fw
  fw -> router
  router -> fileServer
  router -> appServer
  router -> dbServer
}
```

## Microservices Network

```runiq
diagram "Microservices Network" {
  direction TB

  shape users as @cloud label: "Users"
  shape cdn as @cloud label: "CDN"
  shape gateway as @loadBalancer label: "API Gateway"

  container services as @systemBoundary label: "Service Mesh" {
    shape auth as @server label: "Auth Service"
    shape user as @server label: "User Service"
    shape order as @server label: "Order Service"
    shape payment as @server label: "Payment Service"
    shape notification as @server label: "Notification Service"
  }

  container data as @systemBoundary label: "Data Layer" {
    shape postgres as @server label: "PostgreSQL"
    shape mongo as @server label: "MongoDB"
    shape redis as @server label: "Redis"
  }

  shape messageQueue as @storage label: "Message Queue\n(RabbitMQ)"

  users -> cdn
  users -> gateway
  gateway -> auth
  gateway -> user
  gateway -> order
  order -> payment
  payment -> notification
  auth -> postgres
  user -> postgres
  order -> mongo
  payment -> postgres
  notification -> messageQueue
  order -> messageQueue
}
```

## Styling

Apply consistent network diagram styling:

```runiq
diagram "Styled Network" {
  direction LR

  shape internet as @cloud label: "Internet" fill: "#dbeafe" stroke: "#3b82f6"
  shape fw as @firewall label: "Firewall" fill: "#fee2e2" stroke: "#dc2626"
  shape switch as @switch label: "Switch" fill: "#fef3c7" stroke: "#f59e0b"
  shape server as @server label: "Server" fill: "#d1fae5" stroke: "#10b981"

  internet -> fw style: { stroke: "#3b82f6", strokeWidth: 2 }
  fw -> switch style: { stroke: "#dc2626", strokeWidth: 2 }
  switch -> server style: { stroke: "#10b981", strokeWidth: 2 }
}
```

## Best Practices

1. **Use standard symbols** - Leverage recognizable network icons
2. **Show hierarchy** - Organize by network layers (edge, core, access)
3. **Label connections** - Indicate protocols, VLANs, or bandwidth
4. **Use containers** - Group devices by location or security zone
5. **Color code** - Different colors for security zones (DMZ, internal, external)
6. **Show redundancy** - Indicate primary/backup paths
7. **Include IP ranges** - Add subnet information in labels
8. **Document protocols** - Show HTTPS, SSH, RDP, etc. on connections

## Common Patterns

### Edge/Core/Access

- **Edge**: Internet-facing devices (routers, firewalls)
- **Core**: High-speed backbone (core switches, routers)
- **Access**: End-user devices (access switches, servers)

### Security Zones

- **Internet**: External, untrusted
- **DMZ**: Public-facing services
- **Internal**: Corporate network
- **Management**: Admin access only

### Redundancy

- **Active/Active**: Both paths used simultaneously
- **Active/Passive**: Backup path for failover
- **N+1**: Extra capacity for redundancy

## Comparison with Other Tools

| Feature                      | Runiq          | Mermaid        | PlantUML       | Lucidchart  | Visio       | Draw.io     | NetBrain   | Diagrams.net |
| ---------------------------- | -------------- | -------------- | -------------- | ----------- | ----------- | ----------- | ---------- | ------------ |
| **Text-based DSL**           | ✅             | ✅             | ✅             | ❌          | ❌          | ❌          | ❌         | ⚠️ XML       |
| **Version control friendly** | ✅             | ✅             | ✅             | ⚠️ Partial  | ❌          | ⚠️ Partial  | ❌         | ⚠️ Partial   |
| **Automatic layout**         | ✅             | ✅             | ✅             | ❌          | ❌          | ⚠️ Smart    | ❌         | ⚠️ Smart     |
| **Network topology**         | ✅             | ⚠️ Basic       | ⚠️ Basic       | ✅          | ✅          | ✅          | ✅         | ✅           |
| **Infrastructure icons**     | ✅             | ❌             | ❌             | ✅          | ✅          | ✅          | ✅         | ✅           |
| **Layered architecture**     | ✅             | ❌             | ❌             | ✅          | ✅          | ✅          | ⚠️ Basic   | ✅           |
| **Custom shapes**            | ✅             | ❌             | ❌             | ✅          | ✅          | ✅          | ⚠️ Limited | ✅           |
| **Live network discovery**   | ❌             | ❌             | ❌             | ❌          | ❌          | ❌          | ✅         | ❌           |
| **IP addressing**            | ✅ Via labels  | ❌             | ❌             | ✅          | ✅          | ✅          | ✅         | ✅           |
| **Documentation generation** | ✅             | ✅             | ✅             | ⚠️ Partial  | ⚠️ Partial  | ⚠️ Partial  | ✅         | ⚠️ Partial   |
| **Cloud provider symbols**   | ✅             | ❌             | ❌             | ✅          | ✅          | ✅          | ✅         | ✅           |
| **Learning curve**           | Low            | Low            | Medium         | Low         | Medium      | Low         | High       | Low          |
| **Real-time collaboration**  | ✅ Via Git     | ❌             | ❌             | ✅          | ✅          | ✅          | ✅         | ✅           |
| **Export formats**           | SVG, PNG       | SVG, PNG       | SVG, PNG       | Multiple    | Multiple    | Multiple    | PDF, Image | Multiple     |
| **Cost**                     | Free           | Free           | Free           | Paid        | Paid        | Free        | Paid       | Free         |
| **Platform**                 | Cross-platform | Cross-platform | Cross-platform | Web/Desktop | Windows/Mac | Web/Desktop | Windows    | Web/Desktop  |

**Key Advantages of Runiq:**

- **Infrastructure as Code**: Perfect for documenting network architectures alongside IaC
- **Version Control**: Track network changes over time with Git
- **Automation**: Generate diagrams from network inventory systems
- **Cloud-Native**: Strong support for AWS, Azure, GCP symbols

**When to Use Alternatives:**

- **NetBrain**: Live network discovery and automated documentation from production networks
- **Visio**: Enterprise standard with extensive template libraries
- **Draw.io**: Free collaborative editing with less technical users
- **Lucidchart**: Real-time collaboration with built-in presentation mode

## Related

- [Shape Reference - Network Shapes](/reference/shapes#_8-network-shapes-7-shapes)
- [AWS Diagrams](/guide/aws-diagrams)
- [C4 Architecture](/guide/c4-architecture)
- [Containers](/guide/containers)

## Resources

- [Cisco Network Topology Icons](https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html)
- [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/)
- [Network Diagram Best Practices](https://www.lucidchart.com/pages/network-diagram)
