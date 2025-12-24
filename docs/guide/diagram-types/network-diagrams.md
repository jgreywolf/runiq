---
title: Network Diagrams
description: Design network topologies and infrastructure diagrams including routers, switches, firewalls, and AWS/VPC overlays.
lastUpdated: 2025-01-09
---

# Network Diagrams

Network diagrams document infrastructure topologies including routers, switches, subnets, and cloud overlays. Use `@router`, `@switch`, `@firewall`, and `@server` shapes to represent components.

## Quick Example

```runiq
diagram "Simple Network" {
  shape router as @router label:"Edge Router"
  shape fw as @firewall label:"Firewall"
  shape lb as @loadBalancer label:"Load Balancer"
  shape app as @server label:"App Server"

  router -> fw -> lb -> app
}
```

... (content preserved)
