# Missing Documentation Assets (SVG)

This page documents how contributors should generate, normalize, verify, and (optionally) commit SVG example assets referenced from the docs.

Prerequisites

- Node.js (LTS) and pnpm available locally. On Windows PowerShell, enable corepack if using pnpm:

```powershell
corepack enable
pnpm -v
```

Quick workflow (recommended)

1. Generate the example SVGs into the generated output structure:

```powershell
# From repo root (PowerShell)
node scripts/generate-example-svgs.mjs

# POSIX / CI
node scripts/generate-example-svgs.mjs
```

2. Normalize filenames into the `examples/` root (script will copy referenced names):

```powershell
node scripts/copy-missing-svgs.mjs
```

3. Run the inventory check to verify no docs references are missing:

```powershell
node scripts/list-missing-svgs.mjs
```

Expected output: `Found N SVG references in documentation` followed by `No missing SVG files found` and exit code `0`.

If the script lists missing files, inspect the printed `mdFile: svgFile` pairs and:

- Re-run the generator and copy step to ensure generated files were placed into `examples/`.
- If an example is intentionally omitted, update the markdown file in `docs/examples/` to remove or replace the `![](/examples/...).svg` reference.
- If the example exists under a different name, either rename the generated file to the expected name or update the markdown reference.

Committing generated files vs keeping generation out-of-band

- Option A (commit): Commit `examples/*.svg` into the repo if you want docs to render without running the generator. This increases repo size but makes the docs site self-contained.
- Option B (do not commit): Keep `examples/` files generated on demand and rely on CI to regenerate/copy them during checks or as an optional workflow artifact.

If you commit generated files, ensure your PR includes those files and update the PR description to note they are generated.

CI integration notes

- We run `scripts/list-missing-svgs.mjs` in CI; it exits non-zero when missing references are found, causing the workflow to fail.
- Consider adding a CI job that runs `generate-example-svgs.mjs` and `copy-missing-svgs.mjs` before the inventory check if you prefer CI to regenerate missing assets automatically.

Troubleshooting

- If `node scripts/list-missing-svgs.mjs` reports missing files even after generation:
  - Confirm `examples/` is writable and the copy script completed successfully.
  - Inspect the generated output folders for the expected filenames; sometimes generators place files in subfolders which `copy-missing-svgs.mjs` will relocate.

Commands summary

```powershell
corepack enable
pnpm install --frozen-lockfile
node scripts/generate-example-svgs.mjs
node scripts/copy-missing-svgs.mjs
node scripts/list-missing-svgs.mjs
```

PR expectations

- Document any decision to commit or not commit generated SVGs in the PR description.
- If you change examples or add new ones, update this doc with the new reference names and include regeneration steps used to produce them.

If you want, I can add an optional CI workflow that regenerates and caches generated SVGs as artifacts; open an item on the todo list to request that.
