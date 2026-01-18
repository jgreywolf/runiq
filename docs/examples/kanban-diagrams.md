# Kanban Diagrams

Kanban boards help teams manage work across stages. Use columns for workflow states and cards for tasks.

## Product Roadmap Board

<div style="margin: 1rem 0;">
  <img src="/examples/kanban-product-roadmap.svg" alt="Kanban product roadmap" style="max-width: 720px; margin: 0 auto; display: block;">
</div>

```runiq
kanban "Product Roadmap" {
  theme runiq
  swimlane "Q1 Focus" {
    column backlog "Backlog" wip:6 {
      card K1 "Customer interviews" priority:high tags:["research"]
      card K2 "Design refresh" priority:medium tags:["design"]
    }
    column progress "In Progress" wip:3 {
      card K3 "Mobile onboarding" priority:high assignee:"Avery" estimate:"5d"
      card K4 "Billing optimizations" priority:medium assignee:"Noah"
    }
    column review "Review" wip:2 {
      card K5 "New pricing page" priority:medium tags:["marketing"]
    }
    column completed "Done" {
      card K6 "Stability sprint" priority:low
    }
  }
}
```

## Bug Triage

```runiq
kanban "Bug Triage" {
  theme ocean
  column incoming "Incoming" wip:8 {
    card B1 "Checkout timeout" priority:critical assignee:"DevOps"
    card B2 "Missing email receipts" priority:high tags:["billing"]
  }
  column investigating "Investigating" wip:4 {
    card B3 "Search latency spike" priority:high assignee:"Sasha"
  }
  column fix "Fix In Progress" wip:3 {
    card B4 "Webhook retries" priority:medium assignee:"Ravi" estimate:"2d"
  }
  column resolved "Resolved" {
    card B5 "Dark mode contrast" priority:low
  }
}
```

## Campaign Planning

```runiq
kanban "Campaign Planning" {
  swimlane "Spring Launch" fillColor:"#f8fafc" strokeColor:"#e2e8f0" {
    column ideas "Ideas" {
      card C1 "Customer story video" tags:["content"]
      card C2 "Partner webinar" tags:["events"]
    }
    column production "Production" {
      card C3 "Landing page copy" assignee:"Jordan"
    }
    column ready "Ready" {
      card C4 "Paid social assets" priority:medium
    }
  }
}
```
