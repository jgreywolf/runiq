---
title: Mindmap Examples
description: Complete examples of mindmap diagrams using Runiq's radial layout
---

# Mindmap Examples

This page showcases various mindmap diagrams demonstrating different use cases and techniques.

## Simple Mindmap

Basic three-branch structure with automatic shape assignment.

```runiq
// Simple Mindmap Example
// Central idea with three main branches
// Uses type:mindmap for automatic shape assignment

diagram "Simple Mindmap" {

  container "BrainstormingSession" type:mindmap algorithm:radial spacing:80 fillColor:"#f5f5f5" strokeColor:"#9e9e9e" strokeWidth:2 {

    // Central node - automatically becomes @circ
    shape central label:"Project Ideas"

    // Main branches - automatically become @rounded
    shape branch1 label:"Mobile App"
    shape branch2 label:"Website"
    shape branch3 label:"API Service"

    // Connect central to branches
    central -> branch1
    central -> branch2
    central -> branch3
  }
}
```

## Project Planning

Hierarchical project breakdown with three levels (19 nodes).

```runiq
// Hierarchical Mindmap Example
// Main topic with subtopics and details
// Uses type:mindmap with explicit shape overrides for third level

diagram "Hierarchical Mindmap" {

  container "ProjectPlanning" type:mindmap algorithm:radial spacing:100 fillColor:"#e8f5e9" strokeColor:"#4caf50" strokeWidth:2 {

    // Central topic - auto @circ
    shape main label:"Website Redesign"

    // Level 1 - Main phases - auto @rounded
    shape research label:"Research"
    shape design label:"Design"
    shape development label:"Development"
    shape testing label:"Testing"

    // Level 2 - Research subtasks - explicit @rect for differentiation
    shape surveys as @rect label:"User Surveys"
    shape competitors as @rect label:"Competitor Analysis"
    shape analytics as @rect label:"Analytics Review"

    // Level 2 - Design subtasks
    shape wireframes as @rect label:"Wireframes"
    shape mockups as @rect label:"Mockups"
    shape prototype as @rect label:"Prototype"

    // Level 2 - Development subtasks
    shape frontend as @rect label:"Frontend"
    shape backend as @rect label:"Backend"
    shape databaseNode as @rect label:"Database"

    // Level 2 - Testing subtasks
    shape unit_tests as @rect label:"Unit Tests"
    shape integration as @rect label:"Integration"
    shape user_testing as @rect label:"User Testing"

    // Main connections
    main -> research
    main -> design
    main -> development
    main -> testing

    // Research connections
    research -> surveys
    research -> competitors
    research -> analytics

    // Design connections
    design -> wireframes
    design -> mockups
    design -> prototype

    // Development connections
    development -> frontend
    development -> backend
    development -> databaseNode

    // Testing connections
    testing -> unit_tests
    testing -> integration
    testing -> user_testing
  }
}
```

## Learning Roadmap

Educational knowledge map with styling (21 nodes).

```runiq
// Learning Roadmap Mindmap
// Knowledge map for learning JavaScript
// Uses type:mindmap with explicit @rect for third level detail nodes

diagram "Learning JavaScript Roadmap" {

  style highlight fillColor:"#ffeb3b" strokeColor:"#f57c00" strokeWidth:3
  style level1 fillColor:"#e3f2fd" strokeColor:"#1976d2" strokeWidth:2
  style level2 fillColor:"#f3e5f5" strokeColor:"#7b1fa2"

  container "LearningPath" type:mindmap algorithm:radial spacing:90 fillColor:"#fafafa" strokeColor:"#757575" strokeWidth:2 {

    // Central topic - auto @circ
    shape js label:"JavaScript" style:highlight

    // Level 1 - Main areas - auto @rounded
    shape basics label:"Basics" style:level1
    shape advanced label:"Advanced" style:level1
    shape frameworks label:"Frameworks" style:level1
    shape tools label:"Tools" style:level1

    // Level 2 - Basics subtopics - explicit @rect for visual hierarchy
    shape variables as @rect label:"Variables" style:level2
    shape functions as @rect label:"Functions" style:level2
    shape arrays as @rect label:"Arrays" style:level2
    shape objects as @rect label:"Objects" style:level2

    // Level 2 - Advanced subtopics
    shape closures as @rect label:"Closures" style:level2
    shape promises as @rect label:"Promises" style:level2
    shape async_await as @rect label:"Async/Await" style:level2
    shape modules as @rect label:"Modules" style:level2

    // Level 2 - Framework subtopics
    shape react as @rect label:"React" style:level2
    shape vue as @rect label:"Vue" style:level2
    shape svelte as @rect label:"Svelte" style:level2

    // Level 2 - Tools subtopics
    shape npm as @rect label:"npm" style:level2
    shape webpack as @rect label:"Webpack" style:level2
    shape vite as @rect label:"Vite" style:level2
    shape typescript as @rect label:"TypeScript" style:level2

    // Main connections
    js -> basics
    js -> advanced
    js -> frameworks
    js -> tools

    // Basics connections
    basics -> variables
    basics -> functions
    basics -> arrays
    basics -> objects

    // Advanced connections
    advanced -> closures
    advanced -> promises
    advanced -> async_await
    advanced -> modules

    // Framework connections
    frameworks -> react
    frameworks -> vue
    frameworks -> svelte

    // Tools connections
    tools -> npm
    tools -> webpack
    tools -> vite
    tools -> typescript
  }
}
```

## Business Strategy

Strategic planning with mixed shapes for semantic meaning (21 nodes).

```runiq
// Business Strategy Mindmap
// Strategic planning with different shape types for different categories
// Uses type:mindmap with explicit shape overrides for semantic meaning

diagram "Business Strategy 2025" {

  style goal fillColor:"#4caf50" strokeColor:"#2e7d32" strokeWidth:3
  style strategy fillColor:"#2196f3" strokeColor:"#1565c0" strokeWidth:2
  style tactic fillColor:"#ff9800" strokeColor:"#e65100"
  style metric fillColor:"#9c27b0" strokeColor:"#6a1b9a"

  container "StrategyMap" type:mindmap algorithm:radial spacing:110 fillColor:"#eceff1" strokeColor:"#546e7a" strokeWidth:3 {

    // Central goal - auto @circ (perfect for central idea!)
    shape goal label:"Market Leadership" style:goal

    // Strategic pillars - explicit hexagons to show structural pillars
    shape product as @hexagon label:"Product Excellence" style:strategy
    shape customer as @hexagon label:"Customer Focus" style:strategy
    shape innovation as @hexagon label:"Innovation" style:strategy
    shape operations as @hexagon label:"Operational Efficiency" style:strategy

    // Tactics - could use auto @rounded, but being explicit for clarity
    shape quality as @rounded label:"Quality Improvement" style:tactic
    shape features as @rounded label:"New Features" style:tactic
    shape support as @rounded label:"24/7 Support" style:tactic
    shape feedback as @rounded label:"Feedback Loop" style:tactic
    shape research as @rounded label:"R&D Investment" style:tactic
    shape partnerships as @rounded label:"Tech Partnerships" style:tactic
    shape automation as @rounded label:"Process Automation" style:tactic
    shape training as @rounded label:"Team Training" style:tactic

    // Metrics - explicit diamonds to distinguish KPIs from actions
    shape nps as @rhombus label:"NPS Score" style:metric
    shape adoption as @rhombus label:"Adoption Rate" style:metric
    shape patents as @rhombus label:"Patent Count" style:metric
    shape efficiency as @rhombus label:"Efficiency %" style:metric

    // Main goal connections
    goal -> product
    goal -> customer
    goal -> innovation
    goal -> operations

    // Product connections
    product -> quality
    product -> features
    quality -> nps

    // Customer connections
    customer -> support
    customer -> feedback
    support -> adoption

    // Innovation connections
    innovation -> research
    innovation -> partnerships
    research -> patents

    // Operations connections
    operations -> automation
    operations -> training
    automation -> efficiency
  }
}
```

## Related Documentation

- [Mindmap Diagrams Guide](/guide/mindmap-diagrams) - Complete guide to creating mindmaps
- [Layout Algorithms](/guide/layout) - Understanding radial layout
- [Styling Guide](/guide/styling) - Advanced styling techniques
