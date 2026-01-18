# Treemap Diagrams

Treemap diagrams summarize hierarchical data by area size.

## Product Usage by Region

<div style="margin: 1rem 0;">
  <img src="/examples/treemap-product-usage.svg" alt="Treemap product usage" style="max-width: 720px; margin: 0 auto; display: block;">
</div>

```runiq
treemap "Product Usage" {
  layout slice-dice
  padding 10
  gap 6

  group "North America" value:60 color:"#bfdbfe" {
    item "Enterprise" value:40
    item "SMB" value:20
  }
  group "EMEA" value:25 color:"#fecdd3" {
    item "Enterprise" value:15
    item "SMB" value:10
  }
  group "APAC" value:15 color:"#bbf7d0" {
    item "Enterprise" value:8
    item "SMB" value:7
  }
}
```

## Portfolio Allocation

```runiq
treemap "Portfolio Allocation" {
  layout squarify
  padding 8
  gap 4
  showValues true
  showLegend true

  group "Core Platform" color:"#e2e8f0" {
    item "Auth" value:32
    item "Billing" value:20
    item "Search" value:18
  }
  group "Customer Experience" color:"#fef3c7" {
    item "Onboarding" value:16
    item "Support" value:12
    item "Analytics" value:14
  }
  group "Growth" color:"#dcfce7" {
    item "Acquisition" value:22
    item "Retention" value:10
  }
}
```

## Cloud Spend Breakdown

```runiq
treemap "Cloud Spend" {
  layout slice-dice
  padding 10
  gap 6

  group "Compute" color:"#dbeafe" {
    item "Kubernetes" value:40
    item "Batch Jobs" value:15
  }
  group "Storage" color:"#fee2e2" {
    item "Object Storage" value:18
    item "Databases" value:12
  }
  group "Network" color:"#e0f2fe" {
    item "CDN" value:10
    item "Ingress" value:5
  }
}
```
