# API Docs & TypeDoc

Owner: `@jgreywolf`

Purpose: Describe how to generate and publish API documentation using TypeDoc.

Acceptance criteria:

- A reproducible command to generate API docs for each package.
- Output placed in `docs/reference/api/` or linked from it.

````markdown
# API Docs & TypeDoc

Owner: `@jgreywolf`

Purpose: How to generate and publish API documentation for packages using TypeDoc.

See overall architecture and package responsibilities in: [ARCHITECTURE-GUIDE.md](../ARCHITECTURE-GUIDE.md)

Related developer docs: [architecture.md](architecture.md)

Generate API docs (per-package)

```powershell
cd packages/core
pnpm install
pnpm run typedoc # package must have a typedoc script
```
````

Common options

- Configure `tsconfig.json` with `declaration: true` to improve TypeDoc output.
- Use `--out` to direct output into `docs/reference/api/<package>`.

Publishing

- Generated docs can be checked into the `docs/reference/api/` tree or published as a separate site.
- Optional CI: run TypeDoc in CI to detect breaking API changes (useful for library packages).

Automation tips

- Keep typedoc config per-package in `packages/*/typedoc.json` for consistent output.
- Exclude internal-only files using `exclude` in the TypeDoc config.

```

```
