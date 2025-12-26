# Adding Diagram Types (Profiles)

Owner: `@jgreywolf`

Purpose: Document how to add a new diagram profile (parser + renderer routing + examples).

Acceptance criteria:

- Parser grammar changes (if any) added to `packages/parser-dsl/src/runiq.langium` and regenerated.
- Renderer function implemented and exported from `packages/renderer-*` and routed by profile.
- Smoke examples added in `examples/` and listed in `docs/examples/metadata.json`.

High-level steps:

1. Define grammar additions in Langium (`packages/parser-dsl/src/runiq.langium`).
2. Run: `pnpm --filter packages/parser-dsl run generate` then `pnpm -w build`.
3. Implement renderer: add `render<ProfileName>` and register routing in `scripts/run-one-example.mjs` / generator helpers.
4. Add examples, update metadata, run `node scripts/export-gallery-lists.cjs`.

Verification:

- Run `node scripts/run-one-example.mjs <example.runiq>` and ensure renderer executes without TypeErrors.
- Add tests for parser changes under `packages/parser-dsl/src/__tests__/`.
