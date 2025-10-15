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
    | GroupBlock;

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
    'shape' id=ID 'as' '@' shape=ID properties+=NodeProperty*;

NodeProperty:
    LabelProperty
    | StyleRefProperty
    | IconProperty
    | LinkProperty
    | TooltipProperty;

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

// node1 -> node2
// node1 -label-> node2
EdgeDeclaration:
    from=ID (arrow=ARROW | (HYPHEN label=ID? arrow=ARROW)) to=ID;

// group "My Group" { ... }
GroupBlock:
    'group' label=STRING '{'
        statements+=Statement*
    '}';

// Terminals
terminal ARROW: '->';
terminal HYPHEN: '-';
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal STRING: /"(?:[^"\\]|\\.)*"/;
terminal NUMBER: /[0-9]+(\.[0-9]+)?/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /(\/\/|#)[^\n\r]*/;
