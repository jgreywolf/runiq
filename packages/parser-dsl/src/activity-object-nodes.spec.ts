import { describe, it, expect } from 'vitest';
import { parse } from './langium-parser';
import type { NodeAst } from '@runiq/core';

describe('Activity Diagram Object Nodes', () => {
  it('should parse objectNode shape', () => {
    const dsl = `
      diagram "Activity Diagram" {
        shape order as @objectNode label:"Order Data"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(1);

    const node = result.diagram?.nodes[0] as NodeAst;
    expect(node.id).toBe('order');
    expect(node.shape).toBe('objectNode');
    expect(node.label).toBe('Order Data');
  });

  it('should parse centralBuffer shape', () => {
    const dsl = `
      diagram "Activity Diagram" {
        shape buffer as @centralBuffer label:"Order Queue"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(1);

    const node = result.diagram?.nodes[0] as NodeAst;
    expect(node.id).toBe('buffer');
    expect(node.shape).toBe('centralBuffer');
    expect(node.label).toBe('Order Queue');
  });

  it('should parse dataStore shape', () => {
    const dsl = `
      diagram "Activity Diagram" {
        shape db as @dataStore label:"Customer Database"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(1);

    const node = result.diagram?.nodes[0] as NodeAst;
    expect(node.id).toBe('db');
    expect(node.shape).toBe('dataStore');
    expect(node.label).toBe('Customer Database');
  });

  it('should parse activity diagram with multiple object node types', () => {
    const dsl = `
      diagram "Order Processing Activity" {
        // Activities
        shape receiveOrder as @activity label:"Receive Order"
        shape validateOrder as @activity label:"Validate Order"
        shape processPayment as @activity label:"Process Payment"

        // Object nodes
        shape orderInput as @objectNode label:"Order"
        shape validatedOrder as @objectNode label:"Validated Order"
        
        // Central buffer
        shape orderQueue as @centralBuffer label:"Order Queue"
        
        // Data store
        shape customerDB as @dataStore label:"Customer DB"

        // Flow
        receiveOrder -> orderInput
        orderInput -> validateOrder
        validateOrder -> validatedOrder
        validatedOrder -> orderQueue
        orderQueue -> processPayment
        customerDB -> validateOrder
      }
    `;
    const result = parse(dsl);
    if (!result.success) {
      console.log('Parse errors:', result.errors);
    }
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(7); // 7 declared shapes
    expect(result.diagram?.edges).toHaveLength(6);

    // Verify object node types
    const objectNode = result.diagram?.nodes.find(
      (n: NodeAst) => n.id === 'orderInput'
    );
    expect(objectNode?.shape).toBe('objectNode');

    const bufferNode = result.diagram?.nodes.find(
      (n: NodeAst) => n.id === 'orderQueue'
    );
    expect(bufferNode?.shape).toBe('centralBuffer');

    const storeNode = result.diagram?.nodes.find(
      (n: NodeAst) => n.id === 'customerDB'
    );
    expect(storeNode?.shape).toBe('dataStore');
  });

  it('should parse object nodes with flowType edges', () => {
    const dsl = `
      diagram "Activity with Object Flow" {
        shape processA as @activity label:"Process A"
        shape objectData as @objectNode label:"Data Object"
        shape processB as @activity label:"Process B"

        processA -> objectData flowType:"object"
        objectData -> processB flowType:"object"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(3);
    expect(result.diagram?.edges).toHaveLength(2);

    // Both edges should have flowType
    const edges = result.diagram?.edges || [];
    expect(edges[0].flowType).toBe('object');
    expect(edges[1].flowType).toBe('object');
  });

  it('should parse activity with control and object flows mixed', () => {
    const dsl = `
      diagram "Mixed Flow Types" {
        shape init as @initialState
        shape actA as @activity label:"Action A"
        shape data as @objectNode label:"Data"
        shape actB as @activity label:"Action B"
        shape end as @finalState

        init -> actA flowType:"control"
        actA -> data flowType:"object"
        data -> actB flowType:"object"
        actB -> end flowType:"control"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.edges).toHaveLength(4);

    const controlFlows = result.diagram?.edges.filter(
      (e) => e.flowType === 'control'
    );
    const objectFlows = result.diagram?.edges.filter(
      (e) => e.flowType === 'object'
    );

    expect(controlFlows).toHaveLength(2);
    expect(objectFlows).toHaveLength(2);
  });

  it('should parse data stores with bidirectional flows', () => {
    const dsl = `
      diagram "Database Access Activity" {
        shape readAction as @activity label:"Read Data"
        shape writeAction as @activity label:"Write Data"
        shape customerDB as @dataStore label:"Database"

        customerDB -> readAction flowType:"object" label:"query result"
        writeAction -> customerDB flowType:"object" label:"update"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);

    const edges = result.diagram?.edges || [];
    expect(edges).toHaveLength(2);

    // Verify one edge from DB to action, one from action to DB
    const readEdge = edges.find(
      (e) => e.from === 'customerDB' && e.to === 'readAction'
    );
    const writeEdge = edges.find(
      (e) => e.from === 'writeAction' && e.to === 'customerDB'
    );

    expect(readEdge).toBeDefined();
    expect(writeEdge).toBeDefined();
    expect(readEdge?.label).toBe('query result');
    expect(writeEdge?.label).toBe('update');
  });
  it('should parse central buffer with multiple inputs and outputs', () => {
    const dsl = `
      diagram "Buffer Pattern" {
        shape producer1 as @activity label:"Producer 1"
        shape producer2 as @activity label:"Producer 2"
        shape buffer as @centralBuffer label:"Message Queue"
        shape consumer1 as @activity label:"Consumer 1"
        shape consumer2 as @activity label:"Consumer 2"

        producer1 -> buffer flowType:"object"
        producer2 -> buffer flowType:"object"
        buffer -> consumer1 flowType:"object"
        buffer -> consumer2 flowType:"object"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(5);
    expect(result.diagram?.edges).toHaveLength(4);

    // Verify buffer is central point
    const edges = result.diagram?.edges || [];
    const toBuffer = edges.filter((e) => e.to === 'buffer').length;
    const fromBuffer = edges.filter((e) => e.from === 'buffer').length;

    expect(toBuffer).toBe(2);
    expect(fromBuffer).toBe(2);
  });

  it('should parse complete activity diagram with all object node types', () => {
    const dsl = `
      diagram "Complete Order Fulfillment" {
        direction TB

        // Initial and final
        shape start as @initialState
        shape end as @finalState

        // Activities
        shape receive as @activity label:"Receive Order"
        shape validate as @activity label:"Validate"
        shape authorize as @activity label:"Authorize Payment"
        shape fulfill as @activity label:"Fulfill Order"
        shape ship as @activity label:"Ship"

        // Object nodes for data flow
        shape rawOrder as @objectNode label:"Raw Order"
        shape validOrder as @objectNode label:"Valid Order"
        shape payment as @objectNode label:"Payment Info"
        shape shipment as @objectNode label:"Shipment"

        // Buffer for queuing
        shape fulfillmentQueue as @centralBuffer label:"Fulfillment Queue"

        // Persistent stores
        shape orderDB as @dataStore label:"Order Database"
        shape inventoryDB as @dataStore label:"Inventory"

        // Control flow
        start -> receive flowType:"control"
        
        // Object flow
        receive -> rawOrder flowType:"object"
        rawOrder -> validate flowType:"object"
        validate -> validOrder flowType:"object"
        validOrder -> authorize flowType:"object"
        authorize -> payment flowType:"object"
        payment -> fulfillmentQueue flowType:"object"
        fulfillmentQueue -> fulfill flowType:"object"
        fulfill -> shipment flowType:"object"
        shipment -> ship flowType:"object"
        
        // Control flow
        ship -> end flowType:"control"

        // Database interactions
        validate -> orderDB flowType:"object" label:"save"
        inventoryDB -> fulfill flowType:"object" label:"check stock"
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);
    expect(result.diagram?.nodes).toHaveLength(14);
    expect(result.diagram?.edges).toHaveLength(13);

    // Verify all object node types are present
    const nodes = result.diagram?.nodes || [];
    const objectNodes = nodes.filter((n: NodeAst) => n.shape === 'objectNode');
    const buffers = nodes.filter((n: NodeAst) => n.shape === 'centralBuffer');
    const stores = nodes.filter((n: NodeAst) => n.shape === 'dataStore');

    expect(objectNodes).toHaveLength(4);
    expect(buffers).toHaveLength(1);
    expect(stores).toHaveLength(2);
  });

  it('should parse object nodes with styling', () => {
    const dsl = `
      diagram "Styled Activity" {
        style dataStyle fillColor:"#e3f2fd" strokeColor:"#1976d2" strokeWidth:2

        shape input as @objectNode label:"Input Data" style:dataStyle
        shape buffer as @centralBuffer label:"Queue" style:dataStyle
        shape db as @dataStore label:"Database" style:dataStyle
      }
    `;
    const result = parse(dsl);
    expect(result.success).toBe(true);

    const nodes = result.diagram?.nodes || [];
    expect(nodes).toHaveLength(3);

    // All nodes should have the style
    nodes.forEach((node: NodeAst) => {
      expect(node.style).toBe('dataStyle');
    });
  });
});
