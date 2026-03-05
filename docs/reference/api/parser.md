---
title: Parser API
---

# Parser API

The parser consumes DSL text and produces a typed AST shared with the JSON twin.

## parse(dsl)

```ts
import { parse } from '@runiq/parser-dsl';

const result = parse(source);
if (!result.success) {
  console.error(result.errors);
}
const diagram = result.document!.diagrams[0];
```

### ParseResult

```ts
interface ParseResult {
  success: boolean;
  document?: Document;
  errors?: { message: string; line?: number; column?: number }[];
}
```

Errors include line/column when available. The AST is stable between DSL and JSON inputs.
