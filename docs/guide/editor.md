---
title: Editor Guide
description: What the Runiq Editor can do today, what it cannot do yet, and recommended workflows.
lastUpdated: 2026-02-15
---

# Editor Guide

The Runiq Editor is a browser-based authoring app for writing DSL, previewing diagrams, and exporting output.

## What The Editor Does Well

- Create new diagrams by profile from the **New Diagram** dialog.
- Edit DSL and data side-by-side with a live preview.
- Parse, lint, and show inline errors/warnings while you type.
- Browse profile-aware shapes and insert snippets from the toolbox.
- Use the sample browser with global search across sample categories.
- Pan/zoom/select elements on the visual canvas.
- Edit common properties from the canvas and style panel (labels, colors, font size, stroke, routing).
- Export directly to `SVG` and `PNG`.
- Auto-save your DSL in browser storage and restore it on reload.
- Undo/redo code changes from the app-level key handler (`Ctrl/Cmd+Z`, `Ctrl/Cmd+Y`, `Ctrl/Cmd+Shift+Z`).

## What The Editor Cannot Do Yet

- Full visual-first authoring for every DSL feature. Advanced constructs still require direct DSL edits.
- Multi-file project management. The editor currently works as a single-document session.
- Real-time collaboration or shared cursors.
- In-editor export to all backend formats (SPICE, Verilog, LaTeX, Simulink). Use CLI/packages for those.
- Complete settings/preferences UI. The settings action is currently a placeholder.
- Uniform toolbox behavior across every profile. Some profiles are sample-driven for faster starts.

## Recommended Workflow

1. Start from **Sample Browser** or **New Diagram** profile template.
2. Use the **Syntax** tab for structure and advanced options.
3. Use the **Data** tab for data-aware diagrams (JSON/CSV), then map fields in DSL.
4. Refine styling from the canvas and style panel.
5. Export as `SVG` for source-of-truth assets, then `PNG` if needed for docs/slides.

## Keyboard And Interaction Notes

- App-level undo/redo works from the main editor page.
- Canvas interactions focus on selection, dragging, quick edits, and style adjustments.
- Additional shortcuts shown in Help are evolving; prefer toolbar actions when in doubt.

## Related Pages

- [Getting Started](/guide/getting-started)
- [Troubleshooting](/guide/troubleshooting)
- [Profiles](/guide/profiles)
- [Web SDK Integration](/guide/web-sdk)
