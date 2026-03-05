import type { SampleCategory } from '../sample-data';

export const classSampleDiagrams: SampleCategory[] = [
	{
		id: 'class',
		label: 'Class Diagrams',
		samples: [
			{
				name: 'Simple Inheritance',
				description: 'Basic class inheritance structure',
				code: `diagram "Animal Hierarchy" {
  direction TB
  
  // Abstract base class
  shape Animal as @class label:"Animal"
    stereotype:"abstract"
    attributes:[
      {name:"name" type:"string" visibility:protected},
      {name:"age" type:"int" visibility:protected}
    ]
    methods:[
      {name:"eat" returnType:"void" visibility:public},
      {name:"sleep" returnType:"void" visibility:public},
      {name:"makeSound" returnType:"void" visibility:public abstract:true}
    ]
  
  // Concrete derived classes
  shape Dog as @class label:"Dog"
    attributes:[
      {name:"breed" type:"string" visibility:private}
    ]
    methods:[
      {name:"makeSound" returnType:"void" visibility:public},
      {name:"fetch" returnType:"void" visibility:public}
    ]
  
  shape Cat as @class label:"Cat"
    attributes:[
      {name:"indoor" type:"bool" visibility:private}
    ]
    methods:[
      {name:"makeSound" returnType:"void" visibility:public},
      {name:"scratch" returnType:"void" visibility:public}
    ]
  
  shape Bird as @class label:"Bird"
    attributes:[
      {name:"wingspan" type:"float" visibility:private}
    ]
    methods:[
      {name:"makeSound" returnType:"void" visibility:public},
      {name:"fly" returnType:"void" visibility:public}
    ]
  
  // Inheritance relationships
  Dog -> Animal
  Cat -> Animal
  Bird -> Animal
}
`
			},
			{
				name: 'Generics',
				description: 'Generic collections and bounded types',
				code: `diagram "Generic Collections" {
  direction LR
  
  // Simple generic class
  shape List as @class label:"List"
    stereotype:"interface"
    genericTypes:["T"]
    methods:[
      {name:"add" params:[{name:"item" type:"T"}] returnType:"void" visibility:public},
      {name:"get" params:[{name:"index" type:"int"}] returnType:"T" visibility:public},
      {name:"remove" params:[{name:"index" type:"int"}] returnType:"T" visibility:public},
      {name:"size" returnType:"int" visibility:public}
    ]
  
  // Multiple type parameters
  shape Map as @class label:"Map"
    stereotype:"interface"
    genericTypes:["K", "V"]
    methods:[
      {name:"put" params:[{name:"key" type:"K"}, {name:"value" type:"V"}] returnType:"void" visibility:public},
      {name:"get" params:[{name:"key" type:"K"}] returnType:"V" visibility:public},
      {name:"containsKey" params:[{name:"key" type:"K"}] returnType:"bool" visibility:public},
      {name:"remove" params:[{name:"key" type:"K"}] returnType:"V" visibility:public}
    ]
  
  // Concrete implementation with generics
  shape ArrayList as @class label:"ArrayList"
    genericTypes:["T"]
    attributes:[
      {name:"elements" type:"T[]" visibility:private},
      {name:"capacity" type:"int" visibility:private}
    ]
    methods:[
      {name:"add" params:[{name:"item" type:"T"}] returnType:"void" visibility:public},
      {name:"get" params:[{name:"index" type:"int"}] returnType:"T" visibility:public},
      {name:"ensureCapacity" returnType:"void" visibility:private}
    ]
  
  // HashMap with complex generics
  shape HashMap as @class label:"HashMap"
    genericTypes:["K", "V"]
    attributes:[
      {name:"buckets" type:"Entry<K,V>[]" visibility:private},
      {name:"size" type:"int" visibility:private}
    ]
    methods:[
      {name:"put" params:[{name:"key" type:"K"}, {name:"value" type:"V"}] returnType:"void" visibility:public},
      {name:"get" params:[{name:"key" type:"K"}] returnType:"V" visibility:public},
      {name:"hash" params:[{name:"key" type:"K"}] returnType:"int" visibility:private}
    ]
  
  // Nested generics example
  shape Repository as @class label:"Repository"
    genericTypes:["T"]
    attributes:[
      {name:"cache" type:"Map<String,T>" visibility:private},
      {name:"items" type:"List<T>" visibility:private}
    ]
    methods:[
      {name:"findById" params:[{name:"id" type:"String"}] returnType:"T" visibility:public},
      {name:"save" params:[{name:"item" type:"T"}] returnType:"void" visibility:public},
      {name:"getAll" returnType:"List<T>" visibility:public}
    ]
  
  // Bounded type parameters
  shape SortedList as @class label:"SortedList"
    genericTypes:["T extends Comparable<T>"]
    attributes:[
      {name:"elements" type:"T[]" visibility:private}
    ]
    methods:[
      {name:"add" params:[{name:"item" type:"T"}] returnType:"void" visibility:public},
      {name:"sort" returnType:"void" visibility:private}
    ]
  
  // Implementation relationships
  ArrayList -> List lineStyle:"dashed"
  HashMap -> Map lineStyle:"dashed"
  
  // Composition relationships
  Repository -> Map
  Repository -> List
}`
			},
			{
				name: 'Composition',
				description: 'Class composition',
				code: `diagram "Car-Engine Composition" {
  direction LR
  
  shape Car as @class label:"Car"
    attributes:[
      {name:"vin" type:"string" visibility:private},
      {name:"make" type:"string" visibility:private},
      {name:"model" type:"string" visibility:private}
    ]
    methods:[
      {name:"start" visibility:public},
      {name:"stop" visibility:public}
    ]
  
  shape Engine as @class label:"Engine"
    attributes:[
      {name:"serialNumber" type:"string" visibility:private},
      {name:"horsepower" type:"int" visibility:private},
      {name:"cylinders" type:"int" visibility:private}
    ]
    methods:[
      {name:"ignite" visibility:public},
      {name:"shutdown" visibility:public}
    ]
  
  shape Wheel as @class label:"Wheel"
    attributes:[
      {name:"diameter" type:"int" visibility:private},
      {name:"pressure" type:"int" visibility:private}
    ]
    methods:[
      {name:"rotate" visibility:public},
      {name:"inflate" params:[{name:"psi" type:"int"}] visibility:public}
    ]
  
  // Composition: Car has exactly one Engine
  Car -> Engine
    edgeType: composition
    multiplicitySource: "1"
    multiplicityTarget: "1"
  
  // Composition: Car has exactly 4 Wheels
  Car -> Wheel
    edgeType: composition
    multiplicitySource: "1"
    multiplicityTarget: "4"
}`
			}
		]
	}
];
