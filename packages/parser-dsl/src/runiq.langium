grammar Runiq

// Entry point - a Runiq diagram document
entry Document:
    statements+=Statement*;

// Top-level statements
Statement:
    DiagramDeclaration
    | DirectionDeclaration
    | StyleDeclaration
    | ShapeDeclaration
    | EdgeDeclaration
    | GroupBlock
    | ContainerBlock;

// diagram "flowchart"
DiagramDeclaration:
    'diagram' type=STRING;

// direction: LR | RL | TB | BT
DirectionDeclaration:
    'direction:' value=DirectionValue;

DirectionValue returns string:
    'LR' | 'RL' | 'TB' | 'BT';

// style myStyle fill: "red" stroke: "blue"
StyleDeclaration:
    'style' name=ID properties+=StyleProperty+;

StyleProperty:
    key=ID ':' value=(STRING | NUMBER | ID);

// shape node1 as @rounded label: "My Node" style: myStyle icon: fa/user link: "http://example.com"
ShapeDeclaration:
    'shape' id=ID 'as' '@' shape=(SHAPE_ID | ID) properties+=NodeProperty*;

NodeProperty:
    LabelProperty
    | StyleRefProperty
    | IconProperty
    | LinkProperty
    | TooltipProperty
    | DataProperty;

LabelProperty:
    'label:' value=STRING;

StyleRefProperty:
    'style:' ref=[StyleDeclaration:ID];

IconProperty:
    'icon:' provider=ID '/' icon=ID;

LinkProperty:
    'link:' url=STRING;

TooltipProperty:
    'tooltip:' text=STRING;

DataProperty:
    'data:' '[' (items+=DataItem (',' items+=DataItem)*)? ']';

DataItem:
    DataObject | DataValue;

DataValue:
    value=NUMBER;

DataObject:
    '{' properties+=DataObjectProperty (',' properties+=DataObjectProperty)* '}';

DataObjectProperty:
    key=(ID | STRING) ':' value=(STRING | NUMBER);

// node1 -> node2
// node1 -label-> node2
EdgeDeclaration:
    from=ID (arrow=ARROW | labeledArrow=LABELED_ARROW) to=ID;

// group "My Group" { ... }
GroupBlock:
    'group' label=STRING '{'
        statements+=Statement*
    '}';

// container "Label" { ... } with optional properties
ContainerBlock:
    'container' (id=ID)? label=STRING properties+=ContainerProperty* '{'
        statements+=Statement*
    '}';

ContainerProperty:
    StyleRefProperty
    | ContainerStyleProperty
    | ContainerLayoutProperty;

ContainerStyleProperty:
    'borderStyle:' borderStyle=BorderStyleValue
    | 'borderColor:' borderColor=STRING
    | 'borderWidth:' borderWidth=NUMBER
    | 'backgroundColor:' backgroundColor=STRING
    | 'opacity:' opacity=NUMBER
    | 'padding:' padding=NUMBER
    | 'labelPosition:' labelPosition=LabelPositionValue;

ContainerLayoutProperty:
    'algorithm:' algorithm=LayoutAlgorithmValue
    | 'spacing:' spacing=NUMBER;

BorderStyleValue returns string:
    'solid' | 'dashed' | 'dotted';

LabelPositionValue returns string:
    'top' | 'bottom' | 'left' | 'right';

LayoutAlgorithmValue returns string:
    'layered' | 'force' | 'stress' | 'radial' | 'mrtree';

// Terminals
terminal LABELED_ARROW: /-[a-zA-Z_][a-zA-Z0-9_-]*->/;
terminal ARROW: '->';
terminal HYPHEN: '-';
terminal SHAPE_ID: /[a-zA-Z_][a-zA-Z0-9_]*-[a-zA-Z0-9_-]*/;
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal STRING: /"(?:[^"\\]|\\.)*"/;
terminal NUMBER: /-?[0-9]+(\.[0-9]+)?/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /(\/\/|#)[^\n\r]*/;
