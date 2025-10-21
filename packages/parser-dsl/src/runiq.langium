grammar Runiq

// ============================================================================
// Entry point - Profile-based Runiq document
// ============================================================================
// A document can contain multiple profiles (diagram, electrical, digital)
// Each profile has its own grammar and semantics
entry Document:
    profiles+=Profile*;

// Profile types - keyword determines which grammar rules apply
Profile:
    DiagramProfile | ElectricalProfile | DigitalProfile;

// ============================================================================
// Visual Diagram Profile (existing functionality)
// ============================================================================
DiagramProfile:
    'diagram' name=STRING ('{' statements+=DiagramStatement* '}' | statements+=DiagramStatement*);

// Statements within diagram profile
DiagramStatement:
    DirectionDeclaration
    | StyleDeclaration
    | ShapeDeclaration
    | EdgeDeclaration
    | GroupBlock
    | ContainerBlock;

// ============================================================================
// Electrical Profile (analog circuits)
// ============================================================================
ElectricalProfile:
    'electrical' name=STRING '{'
        statements+=ElectricalStatement*
    '}';

// Statements within electrical profile
ElectricalStatement:
    NetStatement | PartStatement | AnalysisStatement;

// net IN, OUT, GND
NetStatement:
    'net' names+=ID (',' names+=ID)*;

// part R1 type:R value:10k pins:(IN,OUT)
PartStatement:
    'part' ref=ID properties+=PartProperty+;

PartProperty:
    PartTypeProperty | PartValueProperty | PartPinsProperty | PartSourceProperty | PartGenericProperty;

PartTypeProperty:
    'type:' type=ID;

PartValueProperty:
    'value:' value=(STRING | NUMBER | ID);

PartSourceProperty:
    'source:' source=STRING;

PartPinsProperty:
    'pins:' '(' pins+=ID (',' pins+=ID)* ')';

// Generic parameters for transistors, op-amps, etc: model:"2N2222", w:"10u", l:"1u", ratio:"10:1"
PartGenericProperty:
    key=ID ':' value=(STRING | NUMBER | ID);

// analysis tran "0 5m"
AnalysisStatement:
    'analysis' kind=AnalysisKind args=STRING?;

AnalysisKind returns string:
    'tran' | 'ac' | 'dc' | 'op' | 'noise';

// ============================================================================
// Digital Profile (digital circuits)
// ============================================================================
DigitalProfile:
    'digital' name=STRING '{'
        statements+=DigitalStatement*
    '}';

// Statements within digital profile
DigitalStatement:
    ModuleStatement | InstStatement | DigitalNetStatement;

// module Counter ports:(clk,reset,count[7:0])
ModuleStatement:
    'module' name=ID properties+=ModuleProperty+;

ModuleProperty:
    ModulePortsProperty | ModuleParamsProperty;

ModulePortsProperty:
    'ports:' '(' ports+=PortDecl (',' ports+=PortDecl)* ')';

ModuleParamsProperty:
    'params:' '(' params+=ParamDecl (',' params+=ParamDecl)* ')';

PortDecl:
    name=ID ('[' width=BusWidth ']')?;

BusWidth:
    msb=NUMBER ':' lsb=NUMBER;

ParamDecl:
    name=ID ':' value=(STRING | NUMBER);

// inst U1 of:Counter map:(clk:clk, reset:reset)
InstStatement:
    'inst' ref=ID properties+=InstProperty+;

InstProperty:
    InstOfProperty | InstMapProperty | InstParamsProperty;

InstOfProperty:
    'of:' module=ID;

InstMapProperty:
    'map:' '(' connections+=PortConnection (',' connections+=PortConnection)* ')';

InstParamsProperty:
    'params:' '(' params+=ParamOverride (',' params+=ParamOverride)* ')';

PortConnection:
    port=ID ':' net=ID ('[' range=BusWidth ']')?;

ParamOverride:
    param=ID ':' value=(STRING | NUMBER);

// Digital nets (with optional bus notation)
DigitalNetStatement:
    'net' names+=NetDecl (',' names+=NetDecl)*;

NetDecl:
    name=ID ('[' width=BusWidth ']')?;

// ============================================================================
// Diagram profile statements (existing grammar)
// ============================================================================

// diagram "flowchart" - DEPRECATED, now part of DiagramProfile
// DiagramDeclaration:
//     'diagram' type=STRING;

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
// shape node1 label: "My Node" (shape optional if inside type:mindmap container)
ShapeDeclaration:
    'shape' id=ID ('as' '@' shape=(SHAPE_ID | ID))? properties+=NodeProperty*;

NodeProperty:
    LabelProperty
    | StyleRefProperty
    | IconProperty
    | LinkProperty
    | TooltipProperty
    | DataProperty
    | ShowLegendProperty
    | LegendPositionProperty
    | StackedProperty
    | ColorsProperty
    | TitleProperty
    | XLabelProperty
    | YLabelProperty
    | AffectedProperty
    | CarrierProperty
    | DeceasedProperty;

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

ShowLegendProperty:
    'showLegend:' value=BOOLEAN;

LegendPositionProperty:
    'legendPosition:' value=STRING;

StackedProperty:
    'stacked:' value=BOOLEAN;

ColorsProperty:
    'colors:' value=StringArray;

TitleProperty:
    'title:' value=STRING;

XLabelProperty:
    'xLabel:' value=STRING;

YLabelProperty:
    'yLabel:' value=STRING;

// Pedigree-specific properties
AffectedProperty:
    'affected:' value=BOOLEAN;

CarrierProperty:
    'carrier:' value=BOOLEAN;

DeceasedProperty:
    'deceased:' value=BOOLEAN;

StringArray:
    '[' (items+=STRING (',' items+=STRING)*)? ']';

DataProperty:
    'data:' '[' (items+=DataItem (',' items+=DataItem)*)? ']';

DataItem:
    DataObject | DataValue;

DataValue:
    value=NUMBER;

DataObject:
    '{' properties+=DataObjectProperty (',' properties+=DataObjectProperty)* '}';

DataObjectProperty:
    key=(ID | STRING) ':' value=(DataArray | STRING | NUMBER);

DataArray:
    '[' (items+=NUMBER (',' items+=NUMBER)*)? ']';

// node1 -> node2
// node1 -label-> node2
// node1 -> node2 lineStyle:double arrowType:none (for marriage edges)
EdgeDeclaration:
    from=ID (arrow=ARROW | labeledArrow=LABELED_ARROW) to=ID properties+=EdgeProperty*;

EdgeProperty:
    LineStyleProperty
    | ArrowTypeProperty;

LineStyleProperty:
    'lineStyle:' value=LineStyleValue;

LineStyleValue returns string:
    'solid' | 'dashed' | 'dotted' | 'double';

ArrowTypeProperty:
    'arrowType:' value=ArrowTypeValue;

ArrowTypeValue returns string:
    'standard' | 'hollow' | 'open' | 'none';

// group "My Group" { ... }
GroupBlock:
    'group' label=STRING '{'
        statements+=DiagramStatement*
    '}';

// container "Label" { ... } with optional properties
ContainerBlock:
    'container' (id=ID)? label=STRING properties+=ContainerProperty* '{'
        statements+=DiagramStatement*
    '}';

ContainerProperty:
    StyleRefProperty
    | ContainerTypeProperty
    | ContainerStyleProperty
    | ContainerLayoutProperty;

ContainerTypeProperty:
    'type:' type=ContainerTypeValue;

ContainerTypeValue returns string:
    'mindmap' | 'default';

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
terminal BOOLEAN: /true|false/;
terminal SHAPE_ID: /[a-zA-Z_][a-zA-Z0-9_]*-[a-zA-Z0-9_-]*/;
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal STRING: /"(?:[^"\\]|\\.)*"/;
terminal NUMBER: /-?[0-9]+(\.[0-9]+)?/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /(\/\/|#)[^\n\r]*/;
