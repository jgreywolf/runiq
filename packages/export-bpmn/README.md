# @runiq/export-bpmn

Minimal BPMN 2.0 XML exporter/importer scaffolding for Runiq diagrams.

## Features

- Exports basic BPMN elements (pools, lanes, tasks, events, gateways)
- Emits sequence flows within pools and message flows across pools
- Provides a lightweight import stub (placeholder for future XML parsing)

## Installation

```bash
pnpm add @runiq/export-bpmn
```

## Usage

```ts
import { toBpmnXml, fromBpmnXml } from '@runiq/export-bpmn';
import type { DiagramAst } from '@runiq/core';

const diagram: DiagramAst = {
  astVersion: '1.0',
  nodes: [],
  edges: [],
};

const exportResult = toBpmnXml(diagram);
console.log(exportResult.xml);

const importResult = fromBpmnXml(exportResult.xml);
console.log(importResult.diagram);
```

## Notes

- The exporter focuses on BPMN 2.0 core elements and can be extended.
- The importer currently returns an empty diagram with warnings.
