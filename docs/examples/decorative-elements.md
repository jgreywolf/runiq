# Decorative Elements

Decorative shapes are lightweight annotations you can mix into any `diagram` profile.

## Callouts and Badges

Callouts are regular shapes connected with edges. Use `@callout` (alias for `@captionBox`) and point it at the target.

```runiq
diagram "Decorative Callouts" {
  direction LR

  shape header1 as @sectionHeader label:"Release Notes" data:[{ length: 260 }]
  shape divider1 as @hRule data:[{ length: 260 }]

  shape card1 as @roundedRectangle label:"Payment API"
  shape callout1 as @callout label:"Owner: Team A"
  shape badge1 as @badgeNumber label:"2"

  header1 -> divider1
  callout1 -> card1
  badge1 -> card1
}
```

## Typography Elements

```runiq
diagram "Typography Elements" {
  direction TB

  shape title1 as @titleBox label:"Quarterly Report"
  shape subtitle1 as @subtitleText label:"FY 2026, Q1"
  shape caption1 as @captionBox label:"Draft - internal only"
  shape footnote1 as @footnoteText label:"All values in USD"
  shape watermark1 as @watermarkText label:"CONFIDENTIAL"
}
```

## Dividers and Brackets

```runiq
diagram "Dividers" {
  direction TB

  shape top1 as @textBlock label:"Phase 1"
  shape divider1 as @swimlaneDivider label:"Swimlane A" data:[{ length: 220 }]
  shape bottom1 as @textBlock label:"Phase 2"

  top1 -> divider1 -> bottom1
}
```
