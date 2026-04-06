---
title: Fault Tree Diagrams
description: Build reliability and failure-analysis diagrams with top events, AND/OR gates, and undeveloped events in Runiq.
---

# Fault Tree Diagrams

Runiq supports a dedicated `faultTree` profile for top-down failure analysis.

Use it when you want:

- a single top event at the top
- logical decomposition through `and` / `or` gates
- basic and undeveloped events beneath those gates

## Basic Syntax

```runiq
faultTree "Brake Failure" {
  topEvent loss "Brake system fails"

  gate g1 type:or under:loss
  event hydLoss "Hydraulic pressure lost" under:g1
  event controlFailure "Controller failure" under:g1

  gate g2 type:and under:hydLoss
  event pumpFailure "Pump failure" under:g2
  event leak "Major line leak" under:g2
}
```

## Supported Statements

### Top Event

```runiq
topEvent loss "Brake system fails"
```

### Gates

```runiq
gate g1 type:or under:loss
gate g2 type:and under:hydraulic
```

Supported gate types:

- `and`
- `or`

### Events

```runiq
event hydraulicPressure "Hydraulic pressure lost" under:g1
undevelopedEvent backup "Backup generator unavailable" under:g1
```

### Optional Probability

```runiq
event mains "Main feed unavailable" under:g1 probability:0.2
```

## Example

```runiq
faultTree "Facility Power Loss" {
  topEvent outage "Facility loses power"

  gate root type:and under:outage
  event mains "Main feed unavailable" under:root probability:0.2
  undevelopedEvent backup "Backup generator unavailable" under:root
}
```

## Notes

- `topEvent` is typically the root of the tree.
- `under:` attaches an event or gate beneath another event or gate.
- `undevelopedEvent` is useful when the cause is known but not expanded further yet.
