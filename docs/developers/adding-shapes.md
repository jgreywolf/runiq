# Adding Shapes

````markdown
# Adding Shapes

Owner: `@jgreywolf`

Purpose: Step-by-step guide to implement, test, and register a new shape in Runiq.

See the full architecture guide for broader context: [ARCHITECTURE-GUIDE.md](../ARCHITECTURE-GUIDE.md)

Related developer docs: [architecture.md](architecture.md), [adding-diagram-types.md](adding-diagram-types.md)

Minimum acceptance criteria

- A new shape file in `packages/core/src/shapes/` exporting a `ShapeDefinition`.
- Unit tests covering `id`, `bounds()`, `anchors()` and `render()` behavior.
- The shape is registered (via `registerDefaultShapes` or a dedicated register function) and an example is added to `examples/`.

Recommended checklist

1. Create `packages/core/src/shapes/<category>/<name>.ts` and export a `ShapeDefinition` with:
   - `id` (unique)
   - `bounds(ctx)` — deterministic size calculation
   - `anchors(ctx)` — 4-point system (top, right, bottom, left)
   - `render(ctx, position)` — returns SVG markup string
2. Add unit tests in `packages/core/src/shapes/<category>/<name>.spec.ts` verifying:
   - `id` equals the expected string
   - `bounds()` returns expected width/height for sample inputs
   - `anchors()` includes four anchor points with stable coordinates
   - `render()` returns valid SVG fragments (string contains expected elements)
3. Add an example `examples/<category>/<name>.runiq` demonstrating common usage and edge cases.
4. Register the shape in `packages/core/src/shapes/index.ts` using the existing registration grouping (e.g., `registerBasicShapes()`), or add a new `registerXxxShapes()` and export it.
5. Run tests and examples locally:

```powershell
pnpm --filter @runiq/core test
node scripts/run-one-example.mjs examples/<category>/<name>.runiq
```

Concrete example: adding `badge` shape

1. Create file `packages/core/src/shapes/badge.ts`:

```ts
import type { ShapeDefinition } from '@runiq/core';

export const badge: ShapeDefinition = {
  id: 'badge',
  bounds(ctx) {
    const text = ctx.props.label ?? 'Badge';
    return { width: Math.max(80, text.length * 8 + 24), height: 32 };
  },
  anchors(ctx) {
    const b = this.bounds(ctx as any);
    return [
      { x: b.width / 2, y: 0 },
      { x: b.width, y: b.height / 2 },
      { x: b.width / 2, y: b.height },
      { x: 0, y: b.height / 2 },
    ];
  },
  render(ctx, pos) {
    const { width, height } = this.bounds(ctx as any);
    const label = (ctx.props.label ?? 'Badge').replace(/</g, '&lt;');
    return `<g transform="translate(${pos.x},${pos.y})"><rect x="0" y="0" width="${width}" height="${height}" rx="6" fill="#111827"/><text x="${width / 2}" y="${height / 2 + 5}" text-anchor="middle" fill="#fff">${label}</text></g>`;
  },
};
```

2. Add unit tests `packages/core/src/shapes/badge.spec.ts`:

```ts
import { badge } from './badge';

describe('badge shape', () => {
  it('has expected id', () => expect(badge.id).toBe('badge'));

  it('computes bounds for label', () => {
    const b = badge.bounds({ props: { label: 'Hi' } } as any);
    expect(b.width).toBeGreaterThanOrEqual(80);
    expect(b.height).toBe(32);
  });

  it('provides 4 anchors', () => {
    const a = badge.anchors({ props: { label: 'X' } } as any);
    expect(a).toHaveLength(4);
  });

  it('renders SVG string', () => {
    const svg = badge.render(
      { props: { label: 'Test' } } as any,
      { x: 0, y: 0 } as any
    );
    expect(typeof svg).toBe('string');
    expect(svg).toContain('<rect');
  });
});
```

3. Add example `examples/badge/basics.runiq` showing usage:

```runiq
diagram BadgeExample {
   shape b as @badge label:"Hello"
}
```

4. Register the shape in `packages/core/src/shapes/index.ts` by importing and adding to registration list; or ensure `registerDefaultShapes()` includes it.

5. Run tests and render example:

```powershell
pnpm --filter @runiq/core test
node scripts/run-one-example.mjs examples/badge/basics.runiq
```
````

Testing expectations for PRs

- Unit tests: Every new shape must include unit tests; PRs that add shapes must have all new tests passing.
- Coverage and style: Keep changes small; follow existing style and avoid `any` types.
- Visual checks: If the shape affects renderer output, include a Playwright visual snapshot or at least provide rendered SVG sample in the PR description.

Notes

- We intentionally do not require a separate per-shape canonical docs page for every shape. Add docs only when the shape is complex or widely reused.
- Keep shapes focused and well-tested; prefer composition (glyphsets) over many near-duplicate shapes.

If a shape or example references an SVG that is missing from `examples/`, consult [Missing Documentation Assets](missing-assets.md) for the remediation workflow.

References

- `packages/core/src/registries.ts`
- `packages/core/src/shapes/` (existing shapes)

```

```
