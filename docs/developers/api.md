# API Docs & TypeDoc

Owner: `@jgreywolf`

Purpose: Describe how to generate and publish API documentation using TypeDoc.

Acceptance criteria:

- A reproducible command to generate API docs for each package.
- Output placed in `docs/reference/api/` or linked from it.

Commands:

`powershell
cd packages/core
pnpm install
pnpm run typedoc  # ensure package has typedoc script configured
`

Notes:

- Verify `tsconfig` `declaration` and `types` are set for packages to improve output.
- CI job can run TypeDoc and fail if public API changes without a docs update (optional).
