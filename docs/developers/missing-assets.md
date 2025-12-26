# Missing Documentation Assets (SVG)

This page lists SVG assets referenced by documentation that are currently missing from the `examples/` output directory, and provides steps to resolve them.

Missing SVG references (discovered by `packages/core` validation):

- `c4-architecture.md`: `c4-system-context.svg`
- `c4-architecture.md`: `c4-container.svg`
- `c4-architecture.md`: `c4-component.svg`
- `c4-architecture.md`: `c4-microservices.svg`
- `containers.md`: `bpmn-cross-functional.svg`
- `control-diagrams.md`: `pid-controller.svg` (x2)
- `control-diagrams.md`: `feedback-system.svg` (x2)
- `control-diagrams.md`: `transfer-function-chain.svg` (x2)
- `control-diagrams.md`: `state-space.svg` (x2)
- `control-diagrams.md`: `parallel-paths.svg` (x2)
- `digital.md`: `cmos-inverter.svg`
- `electrical.md`: `rc-filter.svg`
- `electrical.md`: `voltage-divider.svg`
- `electrical.md`: `opamp-amplifier.svg`
- `electrical.md`: `led-circuit.svg`
- `electrical.md`: `rlc-resonant.svg`
- `flowcharts.md`: `three-tier-web-app.svg`
- `flowcharts.md`: `etl-pipeline.svg`
- `flowcharts.md`: `bubble-sort.svg`
- `flowcharts.md`: `order-state-machine.svg`
- `use-case.md`: `use-case-simple.svg`
- `wardley-maps.md`: `tea-shop-wardley.svg`
- `wardley-maps.md`: `tech-evolution-wardley.svg`

Resolution options

1. Generate the SVGs automatically (preferred when examples exist):

```powershell
# Generate all example SVGs
node scripts/generate-example-svgs.mjs
```

2. Add the missing SVGs manually to `examples/` at the expected filename (e.g. `examples/c4-system-context.svg`).

3. If an example should not be rendered, update the markdown reference to remove or point to an existing image.

PR requirements

- If you add or change documentation references to SVGs, include the generated SVGs or ensure the CI generator produces them.
- For shape or renderer changes that affect example output, include at least one example and the resulting SVG snapshot in the PR description.

Notes

- The `packages/core` validation test reports missing SVGs as warnings; they do not currently fail the suite, but keeping docs referenced images present improves the docs site and avoids confusion.
- If you run the generator and files still appear missing, confirm the expected filenames in `docs/examples/*` and the `examples/` output folder.
