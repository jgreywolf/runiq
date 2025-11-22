---
title: Pyramid Diagram Examples
description: Complete examples of pyramid diagrams for hierarchical visualization
---

# Pyramid Diagram Examples

This page showcases pyramid diagram examples demonstrating various hierarchical structures.

## Maslow's Hierarchy of Needs

Classic psychological model showing human needs from basic to advanced.

```runiq
diagram "Psychological Needs" {
  shape maslow as @pyramid
    label:"Maslow's Hierarchy of Needs"
    data:[
        {"label": "Self-Actualization", "value": 10},
        {"label": "Esteem", "value": 30},
        {"label": "Love & Belonging", "value": 50},
        {"label": "Safety Needs", "value": 70},
        {"label": "Physiological Needs", "value": 100}
      ]
      colors: ["#9f7aea", "#ed8936", "#48bb78", "#4299e1", "#f56565"]
      showValues: true
}
```

**Interpretation:**

- Top tier (10%): Self-actualization - creativity, problem-solving, self-fulfillment
- Upper-middle (30%): Esteem - achievement, status, recognition
- Middle (50%): Love & belonging - friendship, intimacy, family
- Lower-middle (70%): Safety - security, employment, health, property
- Base (100%): Physiological - food, water, warmth, rest

## Organizational Structure

Company hierarchy showing employee distribution across levels.

```runiq
diagram "Company Hierarchy" {
  shape organization as @pyramid
    label:"Employee Distribution"
    data:[
        {"label": "CEO", "value": 1},
        {"label": "VP & Directors", "value": 5},
        {"label": "Senior Managers", "value": 15},
        {"label": "Team Leads", "value": 45},
        {"label": "Individual Contributors", "value": 180}
      ]
      showValues: true
}
```

**Company Structure:**

- Total employees: 246
- Leadership ratio: 1:246 (CEO to total employees)
- Management layers: 5 tiers
- Span of control: CEO → 5 VPs, each VP → 3 Directors average

## Sales Funnel

Lead conversion pipeline from visitors to customers.

```runiq
diagram "Lead Conversion" {
  shape sales as @pyramid
    label:"Sales Pipeline"
    data:[
        {"label": "Closed Deals", "value": 15},
        {"label": "Negotiations", "value": 45},
        {"label": "Qualified Leads", "value": 120},
        {"label": "Marketing Leads", "value": 300},
        {"label": "Total Visitors", "value": 1000}
      ]
      colors: ["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"]
      showValues: true
}
```

**Conversion Metrics:**

- Visitor → Lead: 30% (300/1000)
- Lead → Qualified: 40% (120/300)
- Qualified → Negotiation: 37.5% (45/120)
- Negotiation → Close: 33.3% (15/45)
- **Overall conversion: 1.5% (15/1000)**

## Learning Progression

Bloom's Taxonomy showing cognitive skill levels.

```runiq
diagram "Learning Levels" {
  shape bloom as @pyramid
    label:"Bloom's Taxonomy"
    data: [
        {"label": "Create", "value": 10},
        {"label": "Evaluate", "value": 20},
        {"label": "Analyze", "value": 35},
        {"label": "Apply", "value": 50},
        {"label": "Understand", "value": 75},
        {"label": "Remember", "value": 100}
      ]
      colors: ["#9f7aea", "#ed8936", "#ecc94b", "#48bb78", "#4299e1", "#38b2ac"]
      showValues: true
}
```

**Cognitive Levels:**

- Remember (base): Recall facts and basic concepts
- Understand: Explain ideas or concepts
- Apply: Use information in new situations
- Analyze: Draw connections among ideas
- Evaluate: Justify a stand or decision
- Create (top): Produce new or original work

## Food Pyramid

Nutritional guidelines showing recommended food group proportions.

```runiq
diagram "Nutritional Guidelines" {
  shape food as @pyramid
    label:"Daily Nutrition Guide"
    data:[
        {"label": "Fats & Sweets (Use Sparingly)", "value": 5},
        {"label": "Dairy & Protein", "value": 20},
        {"label": "Vegetables & Fruits", "value": 40},
        {"label": "Grains & Cereals", "value": 50}
      ]
      colors: ["#fbbf24", "#3b82f6", "#22c55e", "#92400e"]
      showValues: true
}
```

**Recommended Servings:**

- Grains (base): 6-11 servings/day
- Vegetables & Fruits: 5-9 servings/day
- Dairy & Protein: 2-3 servings each/day
- Fats & Sweets (top): Use sparingly

## Market Segmentation

Customer tier distribution by value.

```runiq
diagram "Customer Tiers" {
  shape market as @pyramid
    label:"Customer Value Segments"
    data: [
        {"label": "Premium (Lifetime Value $10K+)", "value": 500},
        {"label": "Standard ($1K-$10K)", "value": 2000},
        {"label": "Basic ($0-$1K)", "value": 8000}
      ]
      colors: ["#f59e0b", "#3b82f6", "#6b7280"]
      showValues: true
}
```

**Customer Analysis:**

- Total customers: 10,500
- Premium segment: 4.8% of customers, likely 40%+ of revenue
- Standard segment: 19% of customers, moderate value
- Basic segment: 76.2% of customers, volume strategy

## Related Documentation

- [Pyramid Diagrams Guide](/guide/pyramid-diagrams) - Complete guide to creating pyramids
- [Hierarchy Glyphsets](/guide/glyphsets-hierarchy) - Pre-built hierarchy templates
- [Data-Driven Diagrams](/reference/data-driven) - Dynamic data binding
