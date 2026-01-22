import { describe, expect, it } from 'vitest';
import { ArrowType, LineStyle } from '@runiq/core';
import { parse } from '../langium-parser';

describe('BPMN Message Flows', () => {
  it('should default cross-pool edges to message flow styling', () => {
    const dsl = `
      diagram "Message Flow" {
        container "Customer" as @bpmnPool {
          shape c1 as @bpmnTask label:"Place Order"
        }
        container "Vendor" as @bpmnPool {
          shape v1 as @bpmnTask label:"Receive Order"
        }

        c1 -> v1 label:"Order Details"
      }
    `;

    const result = parse(dsl);
    expect(result.success).toBe(true);
    const edge = result.diagram?.edges?.[0];

    expect(edge?.lineStyle).toBe(LineStyle.DASHED);
    expect(edge?.arrowType).toBe(ArrowType.OPEN);
  });
});
