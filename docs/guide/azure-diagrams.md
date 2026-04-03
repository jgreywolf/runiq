---
title: Azure Architecture Diagrams
description: Create Microsoft Azure architecture diagrams with virtual networks, functions, databases, queues, and identity services.
lastUpdated: 2026-04-03
---

# Azure Architecture Diagrams

Create Microsoft Azure infrastructure diagrams with Runiq's diagram profile.

## Overview

Azure diagrams visualize cloud infrastructure using Azure-oriented service shapes. Runiq provides shapes for common Azure services to document architectures, deployments, and data flows.

## Key Shapes

- **Azure Virtual Machine**: `@azureVm` - Compute workloads and application servers
- **Azure Blob Storage**: `@azureBlobStorage` - Object storage
- **Azure Functions**: `@azureFunctions` - Serverless functions
- **Azure SQL Database**: `@azureSqlDatabase` - Managed relational database
- **Azure Virtual Network**: `@azureVirtualNetwork` - Network boundary
- **Azure Resource Group**: `@azureResourceGroup` - Resource boundary
- **Azure Subscription**: `@azureSubscription` - Subscription boundary
- **Azure API Management**: `@azureApiManagement` - API facade and management
- **Azure CDN**: `@azureCdn` - Edge caching and acceleration
- **Azure Cosmos DB**: `@azureCosmosDb` - Globally distributed NoSQL database
- **Azure Service Bus**: `@azureServiceBus` - Messaging and queues
- **Microsoft Entra ID**: `@azureEntraId` - Identity and authentication

See the [Shape Reference - Azure Shapes](/reference/shapes#_16-azure-shapes-12-shapes) for the complete list.

## Basic Azure Architecture

```runiq
diagram "Simple Azure Web App" {
  direction TB

  shape user as @actor label: "User"

  container vnet "Production VNet" as @azureVirtualNetwork {
    shape vm as @azureVm label: "Web VM"
    shape db as @azureSqlDatabase label: "Azure SQL"
  }

  shape blob as @azureBlobStorage label: "Blob Storage"

  user -> vm label: "HTTPS"
  vm -> db label: "SQL"
  vm -> blob label: "Assets"
}
```

## Azure Resource Hierarchy

```runiq
diagram "Azure Resource Hierarchy" {
  direction TB

  container sub1 "Production Subscription" as @azureSubscription {
    container rg1 "Platform Resource Group" as @azureResourceGroup {
      shape vnet as @azureVirtualNetwork label: "Shared VNet"
      shape identity as @azureEntraId label: "Entra ID"
    }

    container rg2 "App Resource Group" as @azureResourceGroup {
      shape api as @azureApiManagement label: "Public API"
      shape sql as @azureSqlDatabase label: "Azure SQL"
      shape bus as @azureServiceBus label: "Service Bus"
    }
  }

  vnet -> api
  api -> identity
  api -> sql
  api -> bus
}
```

## Serverless Azure Architecture

```runiq
diagram "Azure Serverless API" {
  direction TB

  shape client as @actor label: "Client App"
  shape api as @azureApiManagement label: "API Management"
  shape functions as @azureFunctions label: "Azure Functions"
  shape cosmos as @azureCosmosDb label: "Cosmos DB"
  shape storage as @azureBlobStorage label: "Blob Storage"
  shape identity as @azureEntraId label: "Entra ID"

  client -> api label: "HTTPS"
  api -> identity label: "Authenticate"
  api -> functions label: "Invoke"
  functions -> cosmos label: "Query"
  functions -> storage label: "Store Files"
}
```

## Event-Driven Azure

```runiq
diagram "Event-Driven Azure" {
  direction TB

  shape api as @azureApiManagement label: "API"
  shape functions as @azureFunctions label: "Order Function"
  shape bus as @azureServiceBus label: "Service Bus"
  shape worker as @azureFunctions label: "Worker Function"
  shape sql as @azureSqlDatabase label: "Orders DB"
  shape blob as @azureBlobStorage label: "Archive"

  api -> functions label: "POST /orders"
  functions -> sql label: "Save Order"
  functions -> bus label: "Publish Event"
  bus -> worker label: "Deliver Message"
  worker -> blob label: "Archive"
}
```

## Edge And Identity

```runiq
diagram "Azure Edge Platform" {
  direction LR

  shape users as @cloud label: "Global Users"
  shape cdn as @azureCdn label: "Azure CDN"
  shape identity as @azureEntraId label: "Entra ID"
  shape api as @azureApiManagement label: "API Management"
  shape app as @azureVm label: "App Service VM"

  users -> cdn
  users -> identity
  cdn -> api
  api -> app
}
```

## Best Practices

1. **Use subscription and resource-group boundaries** - Model Azure's real resource hierarchy
2. **Use VNet containers** - Group resources by Azure virtual network
3. **Label service boundaries** - Separate edge, compute, data, and identity
4. **Show protocols** - Include HTTPS, SQL, AMQP, and storage access patterns
5. **Document identity flows** - Make Entra ID part of the architecture narrative
6. **Capture async messaging** - Use Service Bus where decoupling matters
7. **Model global delivery** - Show CDN or regional distribution explicitly

## Comparison with Other Tools

| Feature                      | Runiq | Mermaid         | PlantUML | Lucidchart | Draw.io | Azure Architecture Center |
| ---------------------------- | ----- | --------------- | -------- | ---------- | ------- | ------------------------- |
| **Text-Based DSL**           | ✅    | ✅              | ✅       | ❌         | ❌      | ❌                        |
| **Version Control Friendly** | ✅    | ✅              | ✅       | ❌         | ❌      | ❌                        |
| **Azure Service Shapes**     | ✅    | ⚠️ Limited      | ⚠️ Mixed | ✅         | ✅      | ✅                        |
| **Cloud Architecture Focus** | ✅    | ⚠️ Generic      | ✅       | ✅         | ✅      | ✅                        |
| **Integrated With UML**      | ✅    | ❌              | ✅       | ⚠️ Manual  | ⚠️ Manual | ❌                      |
| **Auto-Layout**              | ✅    | ✅              | ✅       | ❌         | ❌      | ❌                        |
| **Free/Open Source**         | ✅    | ✅              | ✅       | ❌         | ✅      | ✅                        |

**Key Advantages of Runiq:**

- **Version control friendly** - Text-based DSL works naturally with Git
- **Unified language** - Same syntax for Azure, AWS, UML, BPMN, and other diagram types
- **Auto-layout** - No manual positioning needed
- **Architecture as code** - Keep infrastructure views close to application source
- **Multi-domain modeling** - Combine Azure diagrams with sequence, ERD, and system-design views

**When to Use Alternatives:**

- **Azure Architecture Center**: Official icon resources and reference patterns
- **Lucidchart**: GUI-first collaboration for mixed technical and business teams
- **Diagrams.net**: Free drag-and-drop cloud architecture editing
- **PlantUML**: Text-based cloud diagrams if PlantUML is already standardized in your stack

## Related

- [Shape Reference - Azure Shapes](/reference/shapes#_16-azure-shapes-12-shapes)
- [AWS Diagrams](/guide/aws-diagrams)
- [Network Diagrams](/guide/network-diagrams)
- [C4 Architecture](/guide/c4-architecture)

## Resources

- [Azure Architecture Center](https://learn.microsoft.com/azure/architecture/)
- [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/)
- [Azure Architecture Icons](https://learn.microsoft.com/azure/architecture/icons/)
