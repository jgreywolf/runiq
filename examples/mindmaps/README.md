# Mindmap Diagrams

Mindmaps are visual thinking tools that help organize information hierarchically around a central concept. They use a radial layout where ideas branch out from a central node, making them perfect for brainstorming, planning, and knowledge mapping.

## Quick Start - Simplified Syntax

Runiq now supports a simplified syntax for mindmaps using `type:mindmap` on containers. This automatically assigns shapes:

- **First node**: `@circ` (circle for central idea)
- **All other nodes**: `@rounded` (rounded rectangles for branches)

```runiq
diagram "Quick Mindmap" {
  container "Ideas" type:mindmap algorithm:radial spacing:80 {
    // No need to specify shapes - they're automatic!
    shape central label:"Main Idea"
    shape branch1 label:"Branch 1"
    shape branch2 label:"Branch 2"

    central -> branch1
    central -> branch2
  }
}
```

**Benefits**:

- ✅ Less verbose - no repetitive `as @circ` or `as @rounded`
- ✅ Faster to write - focus on content, not formatting
- ✅ Consistent appearance - automatic shape assignments follow mindmap conventions
- ✅ Override when needed - can still specify explicit shapes (e.g., `shape special as @hex`)

## Features

- **Radial Layout**: Central node with branches radiating outward
- **Hierarchical Structure**: Support for multiple levels of subtopics
- **Mixed Shapes**: Use different shapes for different node types (topics, subtopics, actions, metrics)
- **Styled Nodes**: Apply custom colors and styles to highlight importance
- **Flexible Spacing**: Control the distance between nodes for clarity

## When to Use Mindmaps

- **Brainstorming**: Generate and organize ideas
- **Project Planning**: Break down projects into phases and tasks
- **Learning**: Create study guides and knowledge maps
- **Strategy**: Visualize business goals and tactics
- **Problem Solving**: Explore solutions and their components
- **Meeting Notes**: Capture and structure discussion points

## Examples

### 1. Simple Mindmap (`simple-mindmap.runiq`)

Basic three-branch mindmap for quick brainstorming.

```runiq
diagram "Simple Mindmap" {
  container "BrainstormingSession" algorithm:radial spacing:80 {
    shape central as @circ label:"Project Ideas"
    shape branch1 as @rounded label:"Mobile App"
    shape branch2 as @rounded label:"Website"
    shape branch3 as @rounded label:"API Service"

    central -> branch1
    central -> branch2
    central -> branch3
  }
}
```

**Structure**:

- 1 central node (circle)
- 3 main branches (rounded rectangles)
- Radial layout with 80px spacing

### 2. Project Planning (`project-planning.runiq`)

Hierarchical mindmap with multiple levels for detailed planning.

**Structure**:

- Central topic: "Website Redesign"
- Level 1: 4 main phases (Research, Design, Development, Testing)
- Level 2: 12 subtasks distributed across phases
- 19 total nodes
- 16 edges connecting the hierarchy

**Use Case**: Break down a complex project into manageable phases and tasks.

### 3. Learning Roadmap (`learning-roadmap.runiq`)

Educational mindmap with styled nodes for different learning levels.

**Features**:

- **Styled Nodes**: 3 style levels (highlight, level1, level2)
- **Color Coding**: Yellow for central topic, blue for main areas, purple for subtopics
- **Categories**: Basics, Advanced, Frameworks, Tools
- 21 total nodes covering JavaScript ecosystem

**Use Case**: Create a structured learning path for mastering a technology.

### 4. Business Strategy (`business-strategy.runiq`)

Strategic planning mindmap using different shapes for different types of information.

**Shape Usage**:

- 🔵 **Circle** (goal): Central strategic goal
- ⬡ **Hexagon** (strategy): Strategic pillars
- 📦 **Rounded** (tactic): Actionable tactics
- ♦️ **Diamond** (metric): Key performance indicators

**Features**:

- 4 strategic pillars
- 8 tactical initiatives
- 4 measurable KPIs
- Color-coded by type (green=goals, blue=strategy, orange=tactics, purple=metrics)

## Syntax Guide

### Basic Mindmap Structure

```runiq
diagram "My Mindmap" {
  container "MindmapName" algorithm:radial spacing:100 {
    // Central node (typically a circle)
    shape center as @circ label:"Main Topic"

    // Branches (typically rounded)
    shape branch1 as @rounded label:"Branch 1"
    shape branch2 as @rounded label:"Branch 2"

    // Connect central to branches
    center -> branch1
    center -> branch2
  }
}
```

### Hierarchical Levels

```runiq
// Level 1: Main topics (from center)
center -> topic1
center -> topic2

// Level 2: Subtopics (from topics)
topic1 -> subtopic1a
topic1 -> subtopic1b
topic2 -> subtopic2a

// Level 3: Details (from subtopics)
subtopic1a -> detail1
```

### Shape Selection Guide

| Node Type     | Recommended Shape | Why                                 |
| ------------- | ----------------- | ----------------------------------- |
| Central Topic | `@circ`           | Draws attention, represents unity   |
| Main Branches | `@rounded`        | Soft, approachable, main categories |
| Subtopics     | `@rect`           | Clear hierarchy, detail level       |
| Actions/Tasks | `@hexagon`        | Dynamic, action-oriented            |
| Decisions     | `@rhombus`        | Traditional decision symbol         |
| Metrics/KPIs  | `@rhombus`        | Measurable outcomes                 |

### Styling Mindmaps

```runiq
// Define styles for different levels
style main fill:"#ffeb3b" strokeColor:"#f57c00" strokeWidth:3
style branch fill:"#e3f2fd" strokeColor:"#1976d2" strokeWidth:2
style detail fill:"#f3e5f5" strokeColor:"#7b1fa2"

container "Mindmap" algorithm:radial {
  shape center as @circ label:"Topic" style:main
  shape sub1 as @rounded label:"Branch" style:branch
  shape detail1 as @rect label:"Detail" style:detail

  center -> sub1
  sub1 -> detail1
}
```

### Container Styling

```runiq
container "Mindmap"
  algorithm:radial
  spacing:100
  fillColor:"#f5f5f5"
  strokeColor:"#9e9e9e"
  strokeWidth:2 {
  // nodes here
}
```

## Layout Options

### `algorithm:radial`

**Required** for mindmap layout. Places the first node (root) at the center and arranges other nodes radially around it based on their connections.

### `spacing:NUMBER`

Controls the distance between nodes. Typical values:

- **60-80**: Compact, good for simple mindmaps
- **90-100**: Balanced, most common
- **110-150**: Spacious, good for complex hierarchies

## Best Practices

### 1. Start with the Center

Always place your main topic in a circle (`@circ`) at the center. This draws the eye and establishes the focus.

### 2. Use Consistent Shapes per Level

- Level 1 (main branches): Rounded rectangles
- Level 2 (subtopics): Rectangles
- Level 3 (details): Stadium or small shapes

### 3. Color Code by Category

Use styles to differentiate:

- **Topics** (warm colors: yellow, orange)
- **Actions** (blue, green)
- **Risks** (red, purple)
- **Metrics** (purple, indigo)

### 4. Limit Depth

For clarity, limit mindmaps to 3-4 levels. Beyond that, create separate mindmaps or use a different diagram type.

### 5. Balance Branches

Try to distribute nodes evenly around the center for visual balance. 3-6 main branches work best.

### 6. Use Descriptive Labels

Keep labels short (2-4 words) but meaningful. Use nouns for topics, verbs for actions.

## Integration with Other Diagram Types

Mindmaps work well alongside:

- **Flowcharts**: Mindmap for planning, flowchart for execution
- **Gantt Charts**: Mindmap for work breakdown, Gantt for scheduling
- **Org Charts**: Mindmap for strategy, org chart for structure
- **Use Case Diagrams**: Mindmap for features, use case for interactions

## Technical Notes

### Radial Algorithm (ELK)

Runiq uses the Eclipse Layout Kernel (ELK) radial algorithm, which:

- Places root node at center
- Arranges children in concentric circles
- Minimizes edge crossings
- Optimizes angular distribution

### Performance

Mindmaps scale well:

- ✅ Under 50 nodes: Excellent performance
- ✅ 50-100 nodes: Good performance
- ⚠️ 100-200 nodes: Consider splitting
- ❌ Over 200 nodes: Use hierarchical sub-mindmaps

## Resources

- [Mindmap Wikipedia](https://en.wikipedia.org/wiki/Mind_map)
- [Tony Buzan's Mindmapping](https://www.tonybuzan.com/about/mind-mapping/)
- [ELK Radial Layout](https://www.eclipse.org/elk/reference/algorithms/org-eclipse-elk-radial.html)

## Examples in This Directory

1. **simple-mindmap.runiq** - Basic three-branch structure
2. **project-planning.runiq** - Hierarchical project breakdown (19 nodes)
3. **learning-roadmap.runiq** - Educational knowledge map (21 nodes)
4. **business-strategy.runiq** - Strategic planning with mixed shapes (21 nodes)

---

**Tip**: Start with `simple-mindmap.runiq` and gradually add complexity as needed. The radial layout handles growth naturally!
