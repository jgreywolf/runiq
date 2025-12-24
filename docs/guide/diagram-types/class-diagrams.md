---
title: UML Class Diagrams
description: Model object-oriented system structures with classes, interfaces, relationships, visibility, multiplicities, and generalization hierarchies.
sidebar: guide
tags:
  - diagram-type
  - class-diagram
lastUpdated: 2025-12-23
---

# UML Class Diagrams

Create UML class diagrams to model object-oriented system structures with Runiq's diagram profile.

## Overview

Class diagrams show classes, their attributes, methods, and relationships (inheritance, composition, aggregation, associations). Runiq supports UML 2.5 notation with proper relationship styling.

## Key Shapes

- **Class**: `@class` - Standard class box
- **Abstract Class**: `@abstract` - Abstract class (italic name)
- **Interface**: `@interface` - Interface definition
- **Enum**: `@enum` - Enumeration type
- **Package**: `@package` - Package/namespace container
- **Note**: `@note` - UML annotation

See the [Shape Reference - UML Shapes](/reference/shapes#_10-uml-shapes-22-shapes) for the complete list.

## Relationship Types

Runiq supports all standard UML relationships with proper arrow styling:

| Relationship                 | Syntax                   | Edge Type                             |
| ---------------------------- | ------------------------ | ------------------------------------- |
| Generalization (Inheritance) | `subclass -> superclass` | `relationship: generalization`        |
| Realization (Interface)      | `class -> interface`     | `relationship: realization`           |
| Composition                  | `whole -> part`          | `relationship: composition`           |
| Aggregation                  | `container -> element`   | `relationship: aggregation`           |
| Association                  | `class1 -> class2`       | `relationship: association` (default) |
| Dependency                   | `client -> supplier`     | `relationship: dependency`            |

...

(content preserved from original guide)
