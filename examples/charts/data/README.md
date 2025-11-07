# Chart Data Files

This directory contains sample data files for testing chart data upload features in the Runiq editor.

## File Formats

### JSON Files

JSON files should contain an array of objects with consistent keys:

```json
[
  { "label": "Category 1", "value": 100 },
  { "label": "Category 2", "value": 150 }
]
```

The editor will:

- Use the first numeric column as chart data
- Use the first string column as labels (if present)
- Automatically inject both into your chart shape

### CSV Files

CSV files should have a header row with column names:

```csv
Category,Value
Product A,120
Product B,150
```

The editor will:

- Parse the CSV headers
- Use the first numeric column as chart data
- Use the first string column as labels (if present)
- Automatically inject both into your chart shape

## Available Sample Files

### JSON Files

- **monthly-sales.json** - 12 months of sales data (line charts, bar charts)
- **team-performance.json** - Department performance scores (bar charts, radar charts)
- **quarterly-revenue.json** - 4 quarters of revenue (bar charts, line charts)

### CSV Files

- **annual-trends.csv** - Monthly revenue/expenses/profit (line charts, multi-series)
- **skill-matrix.csv** - Developer skills proficiency (radar charts)
- **product-comparison.csv** - Product feature comparison (radar charts, bar charts)

## Usage in Editor

1. Create a chart shape in your diagram:

   ```runiq
   diagram "My Chart" {
     shape chart as @lineChart label:"Sales Data"
   }
   ```

2. Drag and drop a data file onto the editor

3. The editor will automatically inject data and labels:

   ```runiq
   shape chart as @lineChart
     label:"Sales Data"
     data:[45000, 52000, 48000, ...]
     labels:["January", "February", "March", ...]
   ```

4. Customize with additional properties:
   ```runiq
   shape chart as @lineChart
     label:"Sales Data"
     data:[45000, 52000, 48000, ...]
     labels:["January", "February", "March", ...]
     colors:["#3b82f6", "#10b981", ...]
     flipAxes:true
   ```

## Chart Type Recommendations

### Line Charts

- Best for: Time series, trends over time
- Use with: monthly-sales.json, annual-trends.csv

### Bar Charts

- Best for: Categorical comparisons
- Use with: team-performance.json, quarterly-revenue.json

### Radar Charts

- Best for: Multi-dimensional assessments
- Use with: skill-matrix.csv, product-comparison.csv

## Creating Your Own Data Files

### JSON Format

```json
[
  { "category": "A", "value": 10 },
  { "category": "B", "value": 20 }
]
```

### CSV Format

```csv
Category,Value
A,10
B,20
```

**Tips:**

- Keep numeric values in one column for simple charts
- Use descriptive column names
- Ensure consistent data types within columns
- For multi-series charts, use multiple numeric columns
