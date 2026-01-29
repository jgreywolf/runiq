---
title: Timeline Diagrams
description: Visualize chronological events, milestones, and periods with horizontal or vertical timeline diagrams.
lastUpdated: 2025-11-10
---

# Timeline Diagrams

Create chronological timeline diagrams to visualize events, milestones, and periods over time with Runiq's timeline profile.

## Overview

Timeline diagrams display events in chronological order, perfect for project roadmaps, company histories, product releases, and career progressions. They support both horizontal and vertical orientations with customizable colors, icons, and period backgrounds.

Timeline diagrams support two linear modes:

- **Chronological timelines**: `event` + `period`
- **Gantt/Roadmap timelines**: `task` + `milestone` (+ optional `lane`, `depends`)

## Timeline Modes

| Mode                 | Primary Elements             | Best For                         |
| -------------------- | ---------------------------- | -------------------------------- |
| Chronological        | `event`, `period`            | Histories, milestones, releases  |
| Gantt/Roadmap        | `task`, `milestone`, `lane`  | Project plans, roadmaps, phases  |

## Theming

Apply professional color schemes to your timeline diagrams:

```runiq
timeline "Themed Project Roadmap" {
  theme forest

  event kickoff date:"2024-01-15" label:"Project Kickoff"
  event design date:"2024-02-20" label:"Design Complete"
  event launch date:"2024-06-01" label:"Product Launch"

  orientation horizontal
}
```

**Available themes**: `runiq` (default), `professional`, `forest`, `sunset`, `ocean`, `monochrome`, `colorful`, `vibrant`, `warm`, `cool`

[Learn more about themes →](/guide/themes)

## Key Concepts

### Events

Events are the primary building blocks representing specific moments in time:

```runiq
timeline "Project Milestones" {
  event kickoff date:"2024-01-15" label:"Project Kickoff"
    description:"Initial planning meeting"
    icon:"flag"
    textColor:"#3B82F6"
}
```

**Event Properties:**

- `date:"YYYY-MM-DD"` - The event's date (required)
- `label:"text"` - Short event title (required)
- `description:"text"` - Detailed description (optional)
- `icon:"name"` - Icon identifier (optional)
- `textColor:"#hex"` - Custom color for the event marker (optional, default: `#3B82F6`)
- `position:left|right` - Label position for vertical timelines (optional)

### Periods

Periods represent spans of time with shaded backgrounds:

```runiq
timeline "Development Phases" {
  period planning startDate:"2024-01-01" endDate:"2024-03-01"
    label:"Planning Phase"
    textColor:"#E0E7FF"
    opacity:0.3
}
```

**Period Properties:**

- `startDate:"YYYY-MM-DD"` - Period start date (required)
- `endDate:"YYYY-MM-DD"` - Period end date (required)
- `label:"text"` - Period name (required)
- `textColor:"#hex"` - Background color (optional, default: `#E0E7FF`)
- `opacity:number` - Transparency 0-1 (optional, default: `0.3`)

### Orientation

Timelines can be displayed horizontally (default) or vertically:

```runiq
timeline "My Timeline" {
  // ... events and periods ...

  orientation horizontal  // or vertical
}
```

## Gantt & Roadmap Timelines

Use tasks and milestones to build linear, lane-based timelines. Lanes are optional—if you omit them, tasks and milestones appear in a single default lane.

```runiq
timeline "Product Roadmap" {
  theme professional

  lane platform label:"Platform" {
    task api1 startDate:"2024-01-10" endDate:"2024-02-28" label:"API Foundation"
    milestone beta1 date:"2024-03-05" label:"Beta"
  }

  lane experience label:"Experience" {
    task ux1 startDate:"2024-01-20" endDate:"2024-02-15" label:"UX Refresh"
    task onboarding startDate:"2024-02-10" endDate:"2024-03-20" label:"Onboarding"
  }

  task ops1 startDate:"2024-02-01" endDate:"2024-03-25" label:"Ops Readiness"
  milestone launch1 date:"2024-03-30" label:"Launch"

  depends api1 -> launch1
}
```

**Task Properties:**

- `startDate:"YYYY-MM-DD"` (required)
- `endDate:"YYYY-MM-DD"` (required)
- `label:"text"` (required)
- `description:"text"` (optional)
- `fillColor:"#hex"` (optional)
- `lane:"laneId"` (optional when task is outside a lane block)

**Milestone Properties:**

- `date:"YYYY-MM-DD"` (required)
- `label:"text"` (required)
- `description:"text"` (optional)
- `fillColor:"#hex"` (optional)
- `lane:"laneId"` (optional when milestone is outside a lane block)

**Lane Properties:**

- `label:"text"` (optional)
- `fillColor:"#hex"` (optional)
- `textColor:"#hex"` (optional)

**Dependencies:**

- `depends fromTask -> toTask` draws a dependency arrow between tasks or milestones.

**Orientation Note:** Gantt/roadmap timelines currently render **horizontally** only. Vertical orientation is supported for event/period timelines.

## Basic Timeline

```runiq
timeline "Software Project Launch" {
  event kickoff date:"2024-01-15" label:"Project Kickoff"
    description:"Initial team meeting and planning"
    icon:"flag"

  event requirements date:"2024-02-01" label:"Requirements Complete"
    description:"All user stories documented"

  event design date:"2024-02-20" label:"Design Approved"
    description:"UI/UX mockups finalized"
    textColor:"#3b82f6"

  event launch date:"2024-06-01" label:"Product Launch"
    description:"Public release v1.0"
    icon:"rocket"
    textColor:"#10b981"

  period planning startDate:"2024-01-15" endDate:"2024-02-28"
    label:"Planning Phase"
    textColor:"#e0e7ff"

  period development startDate:"2024-03-01" endDate:"2024-05-31"
    label:"Development Phase"
    textColor:"#dbeafe"

  orientation horizontal
}
```

## Company History Timeline

Visualize organizational milestones over years:

```runiq
timeline "TechCorp Journey: 20 Years of Innovation" {
  event founding date:"2004-03-15" label:"Company Founded"
    description:"Three engineers start TechCorp in a garage"
    icon:"rocket"
    textColor:"#10B981"

  event firstProduct date:"2005-06-20" label:"First Product Launch"
    description:"Cloud storage platform v1.0 released"
    textColor:"#3B82F6"

  event series_a date:"2006-09-10" label:"Series A Funding"
    description:"$5M raised from venture capital"
    icon:"dollar"
    textColor:"#F59E0B"

  event ipo date:"2012-05-15" label:"Initial Public Offering"
    description:"Listed on NASDAQ, raised $200M"
    icon:"chart"
    textColor:"#10B981"

  event present date:"2024-11-10" label:"20th Anniversary"
    description:"Celebrating two decades of innovation"
    icon:"star"
    textColor:"#EF4444"

  period startup startDate:"2004-03-15" endDate:"2008-01-01"
    label:"Startup Phase"
    textColor:"#FEF3C7"
    opacity:0.4

  period publicCompany startDate:"2012-05-15" endDate:"2020-01-01"
    label:"Public Company Era"
    textColor:"#E0E7FF"
    opacity:0.4

  orientation horizontal
}
```

## Product Release Timeline

Track software versions and feature releases:

```runiq
timeline "CloudFlow Platform Releases" {
  event v1_0 date:"2022-01-15" label:"v1.0 - Genesis"
    description:"Initial release: Core workflow engine"
    icon:"rocket"
    textColor:"#3B82F6"

  event v2_0 date:"2022-09-01" label:"v2.0 - Enterprise"
    description:"SSO, RBAC, audit logging"
    icon:"shield"
    textColor:"#8B5CF6"

  event v3_0 date:"2023-05-20" label:"v3.0 - AI Assistant"
    description:"Natural language workflow builder"
    icon:"brain"
    textColor:"#10B981"

  event v4_0 date:"2024-02-15" label:"v4.0 - Platform SDK"
    description:"Public API and developer tools"
    icon:"code"
    textColor:"#F59E0B"

  period v1_era startDate:"2022-01-15" endDate:"2022-09-01"
    label:"v1.x Series"
    textColor:"#DBEAFE"
    opacity:0.3

  period v2_era startDate:"2022-09-01" endDate:"2023-05-20"
    label:"v2.x Series - Enterprise Focus"
    textColor:"#E0E7FF"
    opacity:0.3

  orientation horizontal
}
```

## Vertical Timeline

Perfect for career progression or chronological flows:

```runiq
timeline "Professional Development Journey" {
  event education_start date:"2015-09-01" label:"University Enrollment"
    description:"Started Computer Science degree"
    textColor:"#3B82F6"
    position:left

  event graduation date:"2019-05-20" label:"Graduation"
    description:"BS in Computer Science, Magna Cum Laude"
    icon:"graduation"
    textColor:"#10B981"
    position:left

  event first_job date:"2019-07-01" label:"Junior Developer"
    description:"Joined TechCorp as Junior Software Engineer"
    textColor:"#3B82F6"
    position:right

  event promotion1 date:"2020-09-01" label:"Promoted to Mid-Level"
    description:"Software Engineer II"
    textColor:"#8B5CF6"
    position:right

  event manager date:"2024-01-10" label:"Engineering Manager"
    description:"Managing team of 8 engineers"
    icon:"star"
    textColor:"#10B981"
    position:left

  period education startDate:"2015-09-01" endDate:"2019-05-20"
    label:"Education"
    textColor:"#DBEAFE"
    opacity:0.3

  period junior startDate:"2019-07-01" endDate:"2020-09-01"
    label:"Junior Developer"
    textColor:"#E0E7FF"
    opacity:0.3

  period leadership startDate:"2024-01-10" endDate:"2024-11-10"
    label:"Leadership"
    textColor:"#FCE7F3"
    opacity:0.3

  orientation vertical
}
```

## Color Palette

Use consistent colors for different event types:

| Color       | Hex       | Usage                                |
| ----------- | --------- | ------------------------------------ |
| Blue        | `#3B82F6` | Standard milestones                  |
| Green       | `#10B981` | Positive events, launches, successes |
| Amber       | `#F59E0B` | Important updates, warnings          |
| Purple      | `#8B5CF6` | Innovation, features                 |
| Red         | `#EF4444` | Critical events, current status      |
| Light Blue  | `#DBEAFE` | Period backgrounds                   |
| Light Green | `#D1FAE5` | Growth periods                       |
| Light Amber | `#FEF3C7` | Transition phases                    |

## Best Practices

### Event Spacing

For readable timelines:

- **Short timelines**: 5-10 events work best
- **Medium timelines**: 10-20 events with periods
- **Long timelines**: Group related events into periods

### Orientation Choice

- **Horizontal**: Better for wide displays, many events
- **Vertical**: Better for chronological narratives, career paths

### Period Usage

Use periods to:

- Highlight distinct phases
- Provide context for event groups
- Add visual structure to long timelines

### Icon Selection

Common icons:

- `rocket` - Launches, starts
- `star` - Achievements, milestones
- `flag` - Beginning, kickoff
- `trophy` - Awards, recognition
- `chart` - Financial milestones
- `globe` - Expansion, global events
- `dollar` - Funding, revenue
- `shield` - Security, protection
- `brain` - Innovation, AI features
- `code` - Technical releases
- `leaf` - Sustainability, growth
- `graduation` - Education, certification
- `certificate` - Certifications, credentials
- `users` - Team milestones

## Advanced Features

### Alternating Labels

Horizontal timelines automatically alternate event labels above/below the timeline for better readability.

### Date Formatting

Dates must be in ISO format `YYYY-MM-DD`:

- `2024-01-15` ✓ Valid
- `01/15/2024` ✗ Invalid
- `2024-1-15` ✗ Invalid (use zero-padding)

### Overlapping Periods

Periods can overlap to show concurrent phases:

```runiq
timeline "Overlapping Phases" {
  event startDate date:"2024-01-01" label:"Start"
  event endDate date:"2024-12-31" label:"End"

  period development startDate:"2024-01-01" endDate:"2024-10-01"
    label:"Development"
    textColor:"#DBEAFE"

  period testing startDate:"2024-04-01" endDate:"2024-12-31"
    label:"Testing"
    textColor:"#FEF3C7"

  orientation horizontal
}
```

## Common Use Cases

### Project Management

- Sprint timelines
- Roadmaps
- Milestone tracking
- Release schedules

### Business History

- Company milestones
- Growth phases
- Acquisition timelines
- Product evolution

### Personal Development

- Career progression
- Education timeline
- Skill development
- Achievement tracking

### Product Development

- Version releases
- Feature rollouts
- Beta/Alpha phases
- Deprecation schedules

## Comparison with Other Tools

| Feature                      | Runiq          | Mermaid        | PlantUML       | Lucidchart  | Office Timeline | Preceden     | Toggl Plan | Aeon Timeline |
| ---------------------------- | -------------- | -------------- | -------------- | ----------- | --------------- | ------------ | ---------- | ------------- |
| **Text-based DSL**           | ✅             | ✅             | ⚠️ Limited     | ❌          | ❌              | ❌           | ❌         | ❌            |
| **Version control friendly** | ✅             | ✅             | ✅             | ⚠️ Partial  | ❌              | ❌           | ❌         | ⚠️ Partial    |
| **Horizontal timelines**     | ✅             | ✅             | ✅             | ✅          | ✅              | ✅           | ✅         | ✅            |
| **Vertical timelines**       | ✅             | ❌             | ❌             | ✅          | ❌              | ❌           | ❌         | ❌            |
| **Multiple swimlanes**       | ✅             | ❌             | ❌             | ✅          | ✅              | ⚠️ Limited   | ✅         | ✅            |
| **Date/time support**        | ✅             | ⚠️ Basic       | ⚠️ Basic       | ✅          | ✅              | ✅           | ✅         | ✅            |
| **Milestone markers**        | ✅             | ✅             | ✅             | ✅          | ✅              | ✅           | ✅         | ✅            |
| **Dependency arrows**        | ✅             | ❌             | ❌             | ✅          | ⚠️ Limited      | ⚠️ Limited   | ✅         | ✅            |
| **Custom styling**           | ✅             | ⚠️ Limited     | ⚠️ Limited     | ✅          | ✅              | ✅           | ⚠️ Limited | ✅            |
| **Documentation generation** | ✅             | ✅             | ✅             | ⚠️ Partial  | ❌              | ❌           | ❌         | ❌            |
| **Gantt chart view**         | ⚠️ Separate    | ✅             | ✅             | ✅          | ✅              | ⚠️ Limited   | ✅         | ⚠️ Limited    |
| **Interactive editing**      | ❌             | ❌             | ❌             | ✅          | ✅              | ✅           | ✅         | ✅            |
| **Automatic layout**         | ✅             | ✅             | ✅             | ❌          | ⚠️ Templates    | ⚠️ Templates | ❌         | ⚠️ Partial    |
| **Export formats**           | SVG, PNG       | SVG, PNG       | SVG, PNG       | Multiple    | PowerPoint      | PDF, Image   | PDF        | Multiple      |
| **Learning curve**           | Low            | Low            | Medium         | Low         | Very Low        | Very Low     | Low        | Medium        |
| **Cost**                     | Free           | Free           | Free           | Paid        | Paid            | Paid         | Paid       | Paid          |
| **Platform**                 | Cross-platform | Cross-platform | Cross-platform | Web/Desktop | Windows         | Web          | Web        | Windows/Mac   |

**Key Advantages of Runiq:**

- **Version Control**: Track timeline evolution in Git alongside project changes
- **Flexible Layouts**: Both horizontal and vertical timeline support
- **Documentation**: Natural integration with technical and project documentation
- **Programmatic**: Generate timelines from project management data or logs

**When to Use Alternatives:**

- **Office Timeline**: PowerPoint integration for executive presentations
- **Preceden**: Simple web-based historical or educational timelines
- **Toggl Plan**: Project planning with team collaboration and resource management
- **Aeon Timeline**: Complex multi-era timelines for creative writing and research

## Examples

See the [Timeline Examples](/examples/timeline-diagrams) page for more complete examples and use cases.

## See Also

- [Sequence Diagrams](/guide/sequence-diagrams) - For interaction timelines
- [Activity Diagrams](/guide/activity-diagrams) - For process flows
- [State Machine Diagrams](/guide/state-machine-diagrams) - For state transitions
- [Charts & Graphs](/guide/charts) - For data visualization
