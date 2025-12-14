import { ProfileType } from '@runiq/core';
import { describe, expect, it } from 'vitest';
import { parse } from '../langium-parser.js';

describe('Class Diagram Parser', () => {
  it('should parse simple class with name only', () => {
    const input = `
diagram "test" {
  shape Order as @class label:"Order"
}
`;

    const result = parse(input);
    expect(result.success).toBe(true);
    expect(result.document?.profiles).toHaveLength(1);

    const diagram = result.document!.profiles[0];
    expect(diagram.type).toBe(ProfileType.DIAGRAM);
    if (diagram.type === ProfileType.DIAGRAM) {
      expect(diagram.nodes).toHaveLength(1);
      expect(diagram.nodes[0].id).toBe('Order');
      expect(diagram.nodes[0].shape).toBe('class');
      expect(diagram.nodes[0].label).toBe('Order');
    }
  });

  it('should default label to ID when not specified', () => {
    const input = `
diagram "test" {
  shape Customer as @class
}
`;

    const result = parse(input);
    expect(result.success).toBe(true);

    const diagram = result.document!.profiles[0];
    if (diagram.type === ProfileType.DIAGRAM) {
      expect(diagram.nodes).toHaveLength(1);
      expect(diagram.nodes[0].id).toBe('Customer');
      expect(diagram.nodes[0].label).toBe('Customer'); // Should default to ID
    }
  });

  it('should parse class with attributes', () => {
    const input = `
diagram "test" {
  shape Order as @class label:"Order" 
    attributes:[
      {name:"id" type:"int" visibility:private},
      {name:"total" type:"decimal" visibility:public}
    ]
}
`;

    const result = parse(input);
    if (!result.success) {
      console.log('Parse errors:', result.errors);
    }
    expect(result.success).toBe(true);

    const diagram = result.document!.profiles[0];
    if (diagram.type === ProfileType.DIAGRAM) {
      const node = diagram.nodes[0];
      expect(node.data).toBeDefined();
      expect(node.data!.attributes).toBeDefined();
      expect(node.data!.attributes).toHaveLength(2);

      const attrs = node.data!.attributes as any[];
      expect(attrs[0]).toEqual({
        name: 'id',
        type: 'int',
        visibility: 'private',
      });
      expect(attrs[1]).toEqual({
        name: 'total',
        type: 'decimal',
        visibility: 'public',
      });
    }
  });

  it('should parse class with methods', () => {
    const input = `
diagram "test" {
  shape Calculator as @class label:"Calculator"
    methods:[
      {name:"add" params:[{name:"a" type:"int"}, {name:"b" type:"int"}] returnType:"int" visibility:public},
      {name:"clear" visibility:private}
    ]
}
`;

    const result = parse(input);
    if (!result.success) {
      console.log('Parse errors:', result.errors);
    }
    expect(result.success).toBe(true);

    const diagram = result.document!.profiles[0];
    if (diagram.type === ProfileType.DIAGRAM) {
      const node = diagram.nodes[0];
      expect(node.data).toBeDefined();
      expect(node.data!.methods).toBeDefined();
      expect(node.data!.methods).toHaveLength(2);

      const methods = node.data!.methods as any[];
      expect(methods[0].name).toBe('add');
      expect(methods[0].params).toHaveLength(2);
      expect(methods[0].params[0]).toEqual({ name: 'a', type: 'int' });
      expect(methods[0].returnType).toBe('int');
      expect(methods[0].visibility).toBe('public');

      expect(methods[1].name).toBe('clear');
      expect(methods[1].visibility).toBe('private');
    }
  });

  it('should parse class with generic types', () => {
    const input = `
diagram "test" {
  shape List as @class label:"List" genericTypes:["T"]
}
`;

    const result = parse(input);
    expect(result.success).toBe(true);

    const diagram = result.document!.profiles[0];
    if (diagram.type === ProfileType.DIAGRAM) {
      const node = diagram.nodes[0];
      expect(node.data).toBeDefined();
      expect(node.data!.genericTypes).toBeDefined();
      expect(node.data!.genericTypes).toEqual(['T']);
    }
  });

  it('should parse class with stereotype', () => {
    const input = `
diagram "test" {
  shape IComparable as @class label:"IComparable" stereotype:"interface"
}
`;

    const result = parse(input);
    expect(result.success).toBe(true);

    const diagram = result.document!.profiles[0];
    if (diagram.type === ProfileType.DIAGRAM) {
      const node = diagram.nodes[0];
      expect(node.data).toBeDefined();
      expect(node.data!.stereotype).toBe('interface');
    }
  });

  it('should parse complete class with all properties', () => {
    const input = `
diagram "test" {
  shape BankAccount as @class label:"BankAccount"
    stereotype:"abstract"
    genericTypes:["T"]
    attributes:[
      {name:"balance" type:"decimal" visibility:private default:"0"},
      {name:"accountNumber" type:"string" visibility:public}
    ]
    methods:[
      {name:"deposit" params:[{name:"amount" type:"decimal"}] returnType:"void" visibility:public},
      {name:"withdraw" params:[{name:"amount" type:"decimal"}] returnType:"bool" visibility:public abstract:true}
    ]
}
`;

    const result = parse(input);
    if (!result.success) {
      console.log('Parse errors:', result.errors);
    }
    expect(result.success).toBe(true);

    const diagram = result.document!.profiles[0];
    if (diagram.type === ProfileType.DIAGRAM) {
      const node = diagram.nodes[0];
      expect(node.id).toBe('BankAccount');
      expect(node.shape).toBe('class');
      expect(node.label).toBe('BankAccount');

      expect(node.data).toBeDefined();
      expect(node.data!.stereotype).toBe('abstract');
      expect(node.data!.genericTypes).toEqual(['T']);

      const attrs = node.data!.attributes as any[];
      expect(attrs).toHaveLength(2);
      expect(attrs[0].defaultValue).toBe('0');

      const methods = node.data!.methods as any[];
      expect(methods).toHaveLength(2);
      expect(methods[1].isAbstract).toBe(true);
    }
  });

  it('should parse member-level edge connections', () => {
    const input = `
diagram "test" {
  shape Order as @class label:"Order" attributes:[{name:"customerId" type:"int"}]
  shape Customer as @class label:"Customer" attributes:[{name:"id" type:"int"}]
  
  Order.customerId -> Customer.id
}
`;

    const result = parse(input);
    if (!result.success) {
      console.log('Parse errors:', result.errors);
    }
    expect(result.success).toBe(true);

    const diagram = result.document!.profiles[0];
    if (diagram.type === ProfileType.DIAGRAM) {
      expect(diagram.edges).toHaveLength(1);
      expect(diagram.edges[0].from).toBe('Order.customerId');
      expect(diagram.edges[0].to).toBe('Customer.id');
    }
  });

  it('should parse mixed node and member references in edges', () => {
    const input = `
diagram "test" {
  shape Controller as @class label:"Controller" attributes:[{name:"service" type:"Service"}]
  shape Service as @class label:"Service"
  
  Controller.service -> Service
  Service -> Controller
}
`;

    const result = parse(input);
    if (!result.success) {
      console.log('Parse errors:', result.errors);
    }
    expect(result.success).toBe(true);

    const diagram = result.document!.profiles[0];
    if (diagram.type === ProfileType.DIAGRAM) {
      expect(diagram.edges).toHaveLength(2);

      // Member to class
      expect(diagram.edges[0].from).toBe('Controller.service');
      expect(diagram.edges[0].to).toBe('Service');

      // Class to class
      expect(diagram.edges[1].from).toBe('Service');
      expect(diagram.edges[1].to).toBe('Controller');
    }
  });

  // Phase 1: Relationship Features Tests
  describe('Multiplicity', () => {
    it('should parse edge with multiplicity on both ends', () => {
      const input = `
diagram "test" {
  shape Customer as @class label:"Customer"
  shape Order as @class label:"Order"
  
  Customer -> Order
    multiplicitySource: "1"
    multiplicityTarget: "0..*"
}
`;

      const result = parse(input);
      if (!result.success) {
        console.log('Parse errors:', result.errors);
      }
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        expect(diagram.edges).toHaveLength(1);
        const edge = diagram.edges[0];
        expect(edge.multiplicitySource).toBe('1');
        expect(edge.multiplicityTarget).toBe('0..*');
      }
    });

    it('should parse various multiplicity formats', () => {
      const input = `
diagram "test" {
  shape A as @class label:"A"
  shape B as @class label:"B"
  shape C as @class label:"C"
  shape D as @class label:"D"
  
  A -> B multiplicitySource:"0..1" multiplicityTarget:"1"
  B -> C multiplicitySource:"1..1" multiplicityTarget:"*"
  C -> D multiplicitySource:"1..*" multiplicityTarget:"0..*"
}
`;

      const result = parse(input);
      if (!result.success) {
        console.log('Parse errors:', result.errors);
      }
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        expect(diagram.edges).toHaveLength(3);

        expect(diagram.edges[0].multiplicitySource).toBe('0..1');
        expect(diagram.edges[0].multiplicityTarget).toBe('1');

        expect(diagram.edges[1].multiplicitySource).toBe('1..1');
        expect(diagram.edges[1].multiplicityTarget).toBe('*');

        expect(diagram.edges[2].multiplicitySource).toBe('1..*');
        expect(diagram.edges[2].multiplicityTarget).toBe('0..*');
      }
    });
  });

  describe('Aggregation', () => {
    it('should parse aggregation edge type', () => {
      const input = `
diagram "test" {
  shape Department as @class label:"Department"
  shape Employee as @class label:"Employee"
  
  Department -> Employee
    edgeType: aggregation
    multiplicitySource: "1"
    multiplicityTarget: "1..*"
}
`;

      const result = parse(input);
      if (!result.success) {
        console.log('Parse errors:', result.errors);
      }
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        expect(diagram.edges).toHaveLength(1);
        const edge = diagram.edges[0];
        expect(edge.edgeType).toBe('aggregation');
        expect(edge.multiplicitySource).toBe('1');
        expect(edge.multiplicityTarget).toBe('1..*');
      }
    });
  });

  describe('Composition', () => {
    it('should parse composition edge type', () => {
      const input = `
diagram "test" {
  shape House as @class label:"House"
  shape Room as @class label:"Room"
  
  House -> Room
    edgeType: composition
    multiplicitySource: "1"
    multiplicityTarget: "1..*"
}
`;

      const result = parse(input);
      if (!result.success) {
        console.log('Parse errors:', result.errors);
      }
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        expect(diagram.edges).toHaveLength(1);
        const edge = diagram.edges[0];
        expect(edge.edgeType).toBe('composition');
        expect(edge.multiplicitySource).toBe('1');
        expect(edge.multiplicityTarget).toBe('1..*');
      }
    });
  });

  describe('Role Names', () => {
    it('should parse role names on association ends', () => {
      const input = `
diagram "test" {
  shape Company as @class label:"Company"
  shape Person as @class label:"Person"
  
  Company -employs-> Person
    roleSource: "employer"
    roleTarget: "employee"
    multiplicitySource: "1..*"
    multiplicityTarget: "1..*"
}
`;

      const result = parse(input);
      if (!result.success) {
        console.log('Parse errors:', result.errors);
      }
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        expect(diagram.edges).toHaveLength(1);
        const edge = diagram.edges[0];
        expect(edge.label).toBe('employs');
        expect(edge.roleSource).toBe('employer');
        expect(edge.roleSource).toBe('employer');
        expect(edge.roleTarget).toBe('employee');
        expect(edge.multiplicitySource).toBe('1..*');
        expect(edge.multiplicityTarget).toBe('1..*');
      }
    });
  });

  describe('Complete UML Association', () => {
    it('should parse edge with all relationship properties', () => {
      const input = `
diagram "test" {
  shape University as @class label:"University"
  shape Department as @class label:"Department"
  
  University -consists_of-> Department
    edgeType: composition
    roleSource: "parent"
    roleTarget: "child"
    multiplicitySource: "1"
    multiplicityTarget: "1..*"
}
`;

      const result = parse(input);
      if (!result.success) {
        console.log('Parse errors:', result.errors);
      }
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        expect(diagram.edges).toHaveLength(1);
        const edge = diagram.edges[0];
        expect(edge.edgeType).toBe('composition');
        expect(edge.label).toBe('consists_of');
        expect(edge.roleSource).toBe('parent');
        expect(edge.roleTarget).toBe('child');
        expect(edge.multiplicitySource).toBe('1');
        expect(edge.multiplicityTarget).toBe('1..*');
      }
    });
  });

  describe('Visual Enhancements (Phase 2)', () => {
    it('should parse derived attributes', () => {
      const input = `
diagram "test" {
  shape Person as @class
    attributes:[
      {name:"birthDate" type:"Date" visibility:private},
      {name:"age" type:"int" visibility:public derived:true}
    ]
}
`;

      const result = parse(input);
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        expect(diagram.nodes).toHaveLength(1);
        const node = diagram.nodes[0];
        expect(node.data).toBeDefined();
        expect(node.data?.attributes).toHaveLength(2);

        const birthDate = node.data.attributes[0];
        expect(birthDate.name).toBe('birthDate');
        expect(birthDate.isDerived).toBeUndefined(); // Not derived

        const age = node.data.attributes[1];
        expect(age.name).toBe('age');
        expect(age.isDerived).toBe(true); // Derived attribute
      }
    });

    it('should parse static and abstract members', () => {
      const input = `
diagram "test" {
  shape MathUtils as @class
    attributes:[
      {name:"PI" type:"double" visibility:public static:true}
    ]
    methods:[
      {name:"max" params:[{name:"a" type:"int"}, {name:"b" type:"int"}] returnType:"int" visibility:public static:true},
      {name:"calculate" returnType:"double" visibility:public abstract:true}
    ]
}
`;

      const result = parse(input);
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        const node = diagram.nodes[0];

        // Check static attribute
        const pi = node.data.attributes[0];
        expect(pi.name).toBe('PI');
        expect(pi.isStatic).toBe(true);

        // Check static method
        const max = node.data.methods[0];
        expect(max.name).toBe('max');
        expect(max.isStatic).toBe(true);

        // Check abstract method
        const calculate = node.data.methods[1];
        expect(calculate.name).toBe('calculate');
        expect(calculate.isAbstract).toBe(true);
      }
    });

    it('should combine derived and static properties', () => {
      const input = `
diagram "test" {
  shape Counter as @class
    attributes:[
      {name:"count" type:"int" visibility:private static:true},
      {name:"total" type:"int" visibility:public static:true derived:true}
    ]
}
`;

      const result = parse(input);
      expect(result.success).toBe(true);

      const diagram = result.document!.profiles[0];
      if (diagram.type === ProfileType.DIAGRAM) {
        const node = diagram.nodes[0];
        const total = node.data.attributes[1];

        expect(total.name).toBe('total');
        expect(total.isStatic).toBe(true);
        expect(total.isDerived).toBe(true); // Both static AND derived
      }
    });
  });
});
