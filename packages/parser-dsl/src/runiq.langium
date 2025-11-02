grammar Runiq

// ============================================================================
// Entry point - Profile-based Runiq document
// ============================================================================
// A document can contain multiple profiles (diagram, electrical, pneumatic, hydraulic, etc.)
// Each profile has its own grammar and semantics
entry Document:
    profiles+=Profile*;

// Profile types - keyword determines which grammar rules apply
Profile:
    DiagramProfile | ElectricalProfile | DigitalProfile | WardleyProfile | SequenceProfile | PneumaticProfile | HydraulicProfile;

// ============================================================================
// Visual Diagram Profile (existing functionality)
// ============================================================================
DiagramProfile:
    'diagram' name=STRING '{' statements+=DiagramStatement* '}';

// Statements within diagram profile
DiagramStatement:
    DirectionDeclaration
    | RoutingDeclaration
    | StyleDeclaration
    | ShapeDeclaration
    | EdgeDeclaration
    | GroupBlock
    | ContainerBlock
    | TemplateBlock
    | PresetBlock;

// ============================================================================
// Electrical Profile (analog circuits) - accepts both 'electrical' and 'schematic' keywords
// ============================================================================
ElectricalProfile:
    ('electrical' | 'schematic') name=STRING '{'
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
// Pneumatic Profile (ISO 1219-1 pneumatic circuits)
// ============================================================================
PneumaticProfile:
    'pneumatic' name=STRING '{'
        statements+=PneumaticStatement*
    '}';

// Statements within pneumatic profile
PneumaticStatement:
    NetStatement | PartStatement | PressureStatement | FlowRateStatement;

// pressure 6 bar operating
PressureStatement:
    'pressure' value=NUMBER unit=PressureUnit type=PressureType?;

PressureUnit returns string:
    'bar' | 'psi' | 'kPa' | 'MPa';

PressureType returns string:
    'operating' | 'max' | 'min' | 'rated';

// flowRate 100 L/min
FlowRateStatement:
    'flowRate' value=NUMBER unit=FlowRateUnit;

FlowRateUnit returns string:
    'L/min' | 'L/s' | 'CFM' | 'GPM' | 'm³/h';

// ============================================================================
// Hydraulic Profile (ISO 1219-2 hydraulic circuits)
// ============================================================================
HydraulicProfile:
    'hydraulic' name=STRING '{'
        statements+=HydraulicStatement*
    '}';

// Statements within hydraulic profile
HydraulicStatement:
    NetStatement | PartStatement | PressureStatement | FlowRateStatement | FluidStatement;

// fluid mineral "ISO VG 46" temp:(10,60,C)
FluidStatement:
    'fluid' type=FluidType viscosity=STRING? ('temp:' '(' minTemp=NUMBER ',' maxTemp=NUMBER ',' tempUnit=TempUnit ')')?;

FluidType returns string:
    'mineral' | 'synthetic' | 'biodegradable' | 'water-glycol' | 'phosphate-ester';

TempUnit returns string:
    'degC' | 'degF' | 'K';

// ============================================================================
// Wardley Map Profile (strategic mapping)
// ============================================================================
WardleyProfile:
    'wardley' name=STRING '{'
        statements+=WardleyStatement*
    '}';

WardleyStatement:
    WardleyComponentStatement | WardleyDependencyStatement | WardleyAnchorStatement | WardleyEvolutionStatement;

// component "Customer" at evolution:0.8 value:0.9
WardleyComponentStatement:
    'component' name=STRING properties+=WardleyComponentProperty+;

WardleyComponentProperty:
    WardleyEvolutionProperty | WardleyValueProperty | WardleyLabelProperty | WardleyInertiaProperty;

WardleyEvolutionProperty:
    'evolution:' value=NUMBER;

WardleyValueProperty:
    'value:' value=NUMBER;

WardleyLabelProperty:
    'label:' value=STRING;

WardleyInertiaProperty:
    'inertia:' value=BooleanValue;

// anchor "User Need" at value:0.95
WardleyAnchorStatement:
    'anchor' name=STRING properties+=WardleyAnchorProperty+;

WardleyAnchorProperty:
    WardleyValueProperty | WardleyEvolutionProperty;

// dependency from:"Customer" to:"CRM System"
WardleyDependencyStatement:
    'dependency' 'from:' from=STRING 'to:' to=STRING;

// evolve "Legacy System" to evolution:0.7
WardleyEvolutionStatement:
    'evolve' component=STRING 'to' properties+=WardleyEvolutionProperty+;

// ============================================================================
// Sequence Profile (sequence diagrams)
// ============================================================================
SequenceProfile:
    'sequence' name=STRING '{'
        statements+=SequenceStatement*
    '}';

SequenceStatement:
    SequenceParticipantStatement | SequenceMessageStatement | SequenceNoteStatement | SequenceFragmentStatement | SequenceDurationConstraintStatement;

// participant Actor as actor
// participant "Web Server" as entity
SequenceParticipantStatement:
    'participant' name=STRING ('as' type=SequenceParticipantType)?;

SequenceParticipantType returns string:
    'actor' | 'entity' | 'boundary' | 'control' | 'database' | 'continuation';

// message from:"Actor" to:"Web Server" label:"HTTP Request" type:sync activate:true
SequenceMessageStatement:
    'message' properties+=SequenceMessageProperty+;

SequenceMessageProperty:
    SequenceFromProperty | SequenceToProperty | SequenceLabelProperty | SequenceTypeProperty | SequenceActivateProperty | SequenceGuardProperty | SequenceTimingProperty;

SequenceFromProperty:
    'from:' (from=STRING | from='lost' | from='found');

SequenceToProperty:
    'to:' (to=STRING | to='lost' | to='found');

SequenceLabelProperty:
    'label:' label=STRING;

SequenceTypeProperty:
    'type:' type=SequenceMessageType;

SequenceMessageType returns string:
    'sync' | 'async' | 'return' | 'create' | 'destroy';

SequenceActivateProperty:
    'activate:' value=BooleanValue;

SequenceGuardProperty:
    'guard:' value=STRING;

SequenceTimingProperty:
    'timing:' value=STRING;

// note "This is a note" position:left participants:("Actor")
// note "Spanning note" position:over participants:("Actor","Web Server")
SequenceNoteStatement:
    'note' text=STRING properties+=SequenceNoteProperty+;

SequenceNoteProperty:
    SequenceNotePositionProperty | SequenceNoteParticipantsProperty;

SequenceNotePositionProperty:
    'position:' position=SequenceNotePosition;

SequenceNotePosition returns string:
    'left' | 'right' | 'over';

SequenceNoteParticipantsProperty:
    'participants:' '(' participants+=STRING (',' participants+=STRING)* ')';

// fragment loop "Retry Logic" from:5 to:7
// fragment alt "Error Handling" from:10 to:15 alternatives:("Success":10-12,"Failure":13-15)
SequenceFragmentStatement:
    'fragment' type=SequenceFragmentType label=STRING properties+=SequenceFragmentProperty+;

SequenceFragmentType returns string:
    'loop' | 'alt' | 'opt' | 'par' | 'critical' | 'break' | 'ref';

SequenceFragmentProperty:
    SequenceFragmentFromProperty | SequenceFragmentToProperty | SequenceFragmentAlternativesProperty | SequenceFragmentGatesProperty | SequenceFragmentReferenceProperty;

SequenceFragmentFromProperty:
    'from:' from=NUMBER;

SequenceFragmentToProperty:
    'to:' to=NUMBER;

SequenceFragmentAlternativesProperty:
    'alternatives:' '(' alternatives+=SequenceAlternativeDecl (',' alternatives+=SequenceAlternativeDecl)* ')';

SequenceAlternativeDecl:
    label=STRING ':' fromMsg=NUMBER '..' toMsg=NUMBER;

// gates:["gateIn","gateOut"] - Connection points at fragment boundaries  
SequenceFragmentGatesProperty:
    'gates:' '[' (gates+=STRING (',' gates+=STRING)*)? ']';

// ref:"OtherSequence" - Reference to another sequence diagram (UML 2.5 interaction use)
SequenceFragmentReferenceProperty:
    'ref:' ref=STRING;

// durationConstraint from:1 to:5 constraint:"< 100ms" - UML 2.5 duration constraints
SequenceDurationConstraintStatement:
    'durationConstraint' properties+=SequenceDurationConstraintProperty+;

SequenceDurationConstraintProperty:
    SequenceDurationFromProperty | SequenceDurationToProperty | SequenceDurationConstraintValueProperty;

SequenceDurationFromProperty:
    'from:' from=NUMBER;

SequenceDurationToProperty:
    'to:' to=NUMBER;

SequenceDurationConstraintValueProperty:
    'constraint:' constraint=STRING;

// ============================================================================
// Diagram profile statements (existing grammar)
// ============================================================================

// diagram "flowchart" - DEPRECATED, now part of DiagramProfile
// DiagramDeclaration:
//     'diagram' type=STRING;

// direction LR | RL | TB | BT
DirectionDeclaration:
    'direction' value=DirectionValue;

DirectionValue returns string:
    'LR' | 'RL' | 'TB' | 'BT';

// routing orthogonal | polyline | splines | straight
RoutingDeclaration:
    'routing' value=RoutingValue;

RoutingValue returns string:
    'orthogonal' | 'polyline' | 'splines' | 'straight';

// style myStyle fill:"red" stroke:"blue" stroke:"#f00" fillColor:"#0f0"
StyleDeclaration:
    'style' name=ID properties+=StyleProperty+;

StyleProperty:
    key=StylePropertyKey value=(STRING | NUMBER | ID);

// Allow regular IDs plus property keywords that users might use in styles
StylePropertyKey returns string:
    ID ':' | 'fill:' | 'stroke:' | 'color:' | 'strokeWidth:' | 'fontSize:' | 'fontFamily:' | 'fontWeight:' | 'textAlign:' | 'opacity:' | 'borderRadius:' | 'lineStyle:';

// shape node1 as @rounded label: "My Node" style: myStyle icon: fa/user link: "http://example.com"
// shape node1 label: "My Node" (shape optional if inside type:mindmap container)
ShapeDeclaration:
    'shape' id=ID ('as' '@' shape=ShapeIdentifier)? properties+=NodeProperty*;

// Allow shape IDs, regular IDs, and certain keywords that are valid shape names
ShapeIdentifier returns string:
    SHAPE_ID | ID | 'actor' | 'entity' | 'boundary' | 'control' | 'database' | 'note'
    | 'lifeline' | 'continuation' | 'timeObservation' | 'activity'
    | 'objectNode' | 'centralBuffer' | 'dataStore';

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
    | DeceasedProperty
    | AttributesProperty
    | MethodsProperty
    | GenericTypesProperty
    | StereotypeProperty
    | FillProperty
    | ColorProperty
    | StrokeProperty
    | StrokeWidthProperty
    | FontSizeProperty
    | FontFamilyProperty
    | FontWeightProperty
    | TextAlignProperty
    | OpacityProperty
    | BorderRadiusProperty
    | EntryProperty
    | ExitProperty
    | DoActivityProperty
    | InputPinsProperty
    | OutputPinsProperty
    | StateInvariantProperty
    | ExtensionPointsProperty;

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
    'showLegend:' value=BooleanValue;

LegendPositionProperty:
    'legendPosition:' value=STRING;

StackedProperty:
    'stacked:' value=BooleanValue;

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
    'affected:' value=BooleanValue;

CarrierProperty:
    'carrier:' value=BooleanValue;

DeceasedProperty:
    'deceased:' value=BooleanValue;

// UML State Machine properties
EntryProperty:
    'entry:' value=STRING;

ExitProperty:
    'exit:' value=STRING;

DoActivityProperty:
    'doActivity:' value=STRING;

// UML Activity Diagram properties
InputPinsProperty:
    'inputPins:' value=StringArray;

OutputPinsProperty:
    'outputPins:' value=StringArray;

// UML Sequence Diagram properties
StateInvariantProperty:
    'stateInvariant:' value=STRING;

// UML Use Case Diagram properties
ExtensionPointsProperty:
    'extensionPoints:' value=StringArray;

// UML Class Diagram properties
AttributesProperty:
    'attributes:' '[' (attributes+=AttributeDecl (',' attributes+=AttributeDecl)*)? ']';

AttributeDecl:
    '{' properties+=AttributeField+ '}';

AttributeField:
    AttrNameField | AttrTypeField | AttrVisibilityField | AttrDefaultField | AttrStaticField | AttrDerivedField | AttrConstraintsField;

AttrNameField:
    'name:' value=STRING;

AttrTypeField:
    'type:' value=STRING;

AttrVisibilityField:
    'visibility:' value=VisibilityValue;

VisibilityValue returns string:
    'public' | 'private' | 'protected' | 'package';

AttrDefaultField:
    'default:' value=STRING;

AttrStaticField:
    'static:' value=BooleanValue;

AttrDerivedField:
    'derived:' value=BooleanValue;

AttrConstraintsField:
    'constraints:' '[' values+=STRING (',' values+=STRING)* ']';

MethodsProperty:
    'methods:' '[' (methods+=MethodDecl (',' methods+=MethodDecl)*)? ']';

MethodDecl:
    '{' properties+=MethodField+ '}';

MethodField:
    MethodNameField | MethodParamsField | MethodReturnTypeField | MethodVisibilityField | MethodAbstractField | MethodStaticField | MethodConstraintsField;

MethodNameField:
    'name:' value=STRING;

MethodParamsField:
    'params:' '[' (params+=MethodParamDecl (',' params+=MethodParamDecl)*)? ']';

MethodParamDecl:
    '{' properties+=MethodParamField+ '}';

MethodParamField:
    ParamNameField | ParamTypeField;

ParamNameField:
    'name:' value=STRING;

ParamTypeField:
    'type:' value=STRING;

MethodReturnTypeField:
    'returnType:' value=STRING;

MethodVisibilityField:
    'visibility:' value=VisibilityValue;

MethodAbstractField:
    'abstract:' value=BooleanValue;

MethodStaticField:
    'static:' value=BooleanValue;

MethodConstraintsField:
    'constraints:' '[' values+=STRING (',' values+=STRING)* ']';

GenericTypesProperty:
    'genericTypes:' '[' (types+=STRING (',' types+=STRING)*)? ']';

StereotypeProperty:
    'stereotype:' value=STRING
    | 'stereotypes:' '[' values+=STRING (',' values+=STRING)* ']';

// Inline styling properties for shapes
FillProperty:
    'fill:' value=STRING;

ColorProperty:
    'color:' value=STRING;

StrokeProperty:
    'stroke:' value=STRING;

StrokeWidthProperty:
    'strokeWidth:' value=NUMBER;

FontSizeProperty:
    'fontSize:' value=NUMBER;

FontFamilyProperty:
    'fontFamily:' value=STRING;

TextAlignProperty:
    'textAlign:' value=TextAlignValue;

TextAlignValue returns string:
    'left' | 'center' | 'right';

FontWeightProperty:
    'fontWeight:' value=NUMBER;

OpacityProperty:
    'opacity:' value=NUMBER;

BorderRadiusProperty:
    'borderRadius:' value=NUMBER;

// ============================================================================

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
// node1 <-> node2 (bidirectional connection)
// Class.field -> OtherClass.method (member-level connections)
// A -> B -> C (chained edges)
EdgeDeclaration:
    from=NodeRef (arrow=ARROW | bidirectionalArrow=BIDIRECTIONAL_ARROW | labeledArrow=LABELED_ARROW) to=NodeRef 
    chain+=(EdgeChain)* properties+=EdgeProperty*;

EdgeChain:
    (arrow=ARROW | bidirectionalArrow=BIDIRECTIONAL_ARROW | labeledArrow=LABELED_ARROW) to=NodeRef;

// Support both simple node references (node1) and member references (Class.field)
NodeRef:
    node=ID ('.' member=ID)?;

EdgeProperty:
    EdgeLabelProperty
    | LineStyleProperty
    | ArrowTypeProperty
    | MultiplicitySourceProperty
    | MultiplicityTargetProperty
    | RoleSourceProperty
    | RoleTargetProperty
    | EdgeTypeProperty
    | NavigabilityProperty
    | EdgeConstraintsProperty
    | RoutingProperty
    | StereotypeProperty
    | StrokeProperty
    | StrokeWidthProperty
    | StyleRefProperty
    | EventProperty
    | GuardProperty
    | EffectProperty
    | FlowTypeProperty;

EdgeLabelProperty:
    'label:' label=STRING;

LineStyleProperty:
    'lineStyle:' value=STRING;

ArrowTypeProperty:
    'arrowType:' value=ArrowTypeValue;

ArrowTypeValue returns string:
    'standard' | 'hollow' | 'open' | 'none';

// UML Relationship Properties
MultiplicitySourceProperty:
    'multiplicitySource:' value=STRING;

MultiplicityTargetProperty:
    'multiplicityTarget:' value=STRING;

RoleSourceProperty:
    'roleSource:' value=STRING;

RoleTargetProperty:
    'roleTarget:' value=STRING;

EdgeTypeProperty:
    ('edgeType:' | 'relationship:') value=EdgeTypeValue;

EdgeTypeValue returns string:
    'association' | 'aggregation' | 'composition' | 'dependency' | 'generalization' | 'realization';

NavigabilityProperty:
    'navigability:' value=NavigabilityDirection;

NavigabilityDirection returns string:
    'source' | 'target' | 'bidirectional' | 'none';

EdgeConstraintsProperty:
    'constraints:' '[' values+=STRING (',' values+=STRING)* ']';

// UML State Machine Transition Properties
EventProperty:
    'event:' value=STRING;

GuardProperty:
    'guard:' value=STRING;

EffectProperty:
    'effect:' value=STRING;

// UML Activity Diagram Flow Properties
FlowTypeProperty:
    'flowType:' value=STRING;

RoutingProperty:
    'routing:' value=RoutingValue;

// group "My Group" { ... }
GroupBlock:
    'group' label=STRING '{'
        statements+=DiagramStatement*
    '}';

// container "Label" { ... } with optional properties
// Now supports: container id "Label" as @shapeName { ... }
ContainerBlock:
    'container' (id=ID)? label=STRING ('as' '@' shape=(SHAPE_ID | ID))? properties+=ContainerProperty* '{'
        statements+=DiagramStatement*
    '}';

ContainerProperty:
    StyleRefProperty
    | ContainerTypeProperty
    | ContainerMetadataProperty
    | ContainerStyleProperty
    | ContainerLayoutProperty;

ContainerTypeProperty:
    'type:' type=ContainerTypeValue;

ContainerTypeValue returns string:
    'mindmap' | ID;

// Phase 1: Container metadata properties (header, icon, badge, collapsible, collapsed)
// Phase 2: Collapse/expand properties
ContainerMetadataProperty:
    'header:' header=STRING
    | 'icon:' icon=STRING
    | 'badge:' badge=STRING
    | 'collapsible:' collapsible=BooleanValue
    | 'collapsed:' collapsed=BooleanValue
    | 'collapseMode:' collapseMode=CollapseModeValue
    | 'collapseRedirectEdges:' collapseRedirectEdges=BooleanValue
    | 'collapseTransitionState:' collapseTransitionState=CollapseTransitionValue
    | 'collapseAnimationDuration:' collapseAnimationDuration=NUMBER
    | 'collapseAnimationEasing:' collapseAnimationEasing=CollapseEasingValue
    | 'collapseSummary:' collapseSummary=STRING
    | 'collapseShowCount:' collapseShowCount=BooleanValue
    | 'collapseIcon:' collapseIcon=STRING
    | 'collapsePersistState:' collapsePersistState=BooleanValue
    | 'collapseStateKey:' collapseStateKey=STRING
    | 'collapseKeyboardShortcut:' collapseKeyboardShortcut=STRING;

ContainerStyleProperty:
    'borderStyle:' borderStyle=BorderStyleValue
    | 'borderColor:' borderColor=STRING
    | 'borderWidth:' borderWidth=NUMBER
    | 'fill:' fill=STRING
    | 'backgroundColor:' backgroundColor=STRING
    | 'opacity:' opacity=NUMBER
    | 'padding:' padding=NUMBER
    | 'labelPosition:' labelPosition=LabelPositionValue
    | 'shadow:' shadow=BooleanValue
    | 'depth:' depth=NUMBER
    | 'headerPosition:' headerPosition=LabelPositionValue
    | 'headerBackgroundColor:' headerBackgroundColor=STRING
    | 'iconSize:' iconSize=NUMBER
    | 'iconColor:' iconColor=STRING
    | 'minWidth:' minWidth=NUMBER
    | 'maxWidth:' maxWidth=NUMBER
    | 'minHeight:' minHeight=NUMBER
    | 'maxHeight:' maxHeight=NUMBER
    | 'autoResize:' autoResize=AutoResizeValue
    | 'paddingTop:' paddingTop=NUMBER
    | 'paddingRight:' paddingRight=NUMBER
    | 'paddingBottom:' paddingBottom=NUMBER
    | 'paddingLeft:' paddingLeft=NUMBER
    | 'margin:' margin=NUMBER
    | 'marginTop:' marginTop=NUMBER
    | 'marginRight:' marginRight=NUMBER
    | 'marginBottom:' marginBottom=NUMBER
    | 'marginLeft:' marginLeft=NUMBER
    | 'alignContent:' alignContent=AlignContentValue
    | 'verticalAlign:' verticalAlign=VerticalAlignValue
    | 'distribution:' distribution=DistributionValue
    | 'nodeSpacing:' nodeSpacing=NUMBER
    | 'edgeRouting:' edgeRouting=EdgeRoutingValue
    | 'edgeBundling:' edgeBundling=BooleanValue
    | 'crossContainerEdgeOptimization:' crossContainerEdgeOptimization=BooleanValue
    | 'layoutCache:' layoutCache=BooleanValue
    | 'incrementalLayout:' incrementalLayout=BooleanValue
    | 'layoutComplexity:' layoutComplexity=LayoutComplexityValue
    | 'collapseButtonVisible:' collapseButtonVisible=BooleanValue
    | 'collapseButtonPosition:' collapseButtonPosition=ButtonPositionValue
    | 'collapseButtonStyle:' collapseButtonStyle=ButtonStyleValue
    | 'collapseButtonSize:' collapseButtonSize=NUMBER
    | 'collapseButtonColor:' collapseButtonColor=STRING
    | 'resizable:' resizable=BooleanValue
    | 'resizeHandles:' '[' (resizeHandles+=ResizeHandleValue (',' resizeHandles+=ResizeHandleValue)*)? ']'
    | 'minResizeWidth:' minResizeWidth=NUMBER
    | 'minResizeHeight:' minResizeHeight=NUMBER
    | 'hoverHighlight:' hoverHighlight=BooleanValue
    | 'hoverBorderColor:' hoverBorderColor=STRING
    | 'hoverBorderWidth:' hoverBorderWidth=NUMBER
    | 'selectionHighlight:' selectionHighlight=BooleanValue
    | 'selectionBorderColor:' selectionBorderColor=STRING
    | 'selectionBorderWidth:' selectionBorderWidth=NUMBER
    | 'showChildCount:' showChildCount=BooleanValue
    | 'childCountPosition:' childCountPosition=ButtonPositionValue
    | 'showDepthIndicator:' showDepthIndicator=BooleanValue
    | 'depthIndicatorStyle:' depthIndicatorStyle=DepthIndicatorStyleValue
    // Phase 5: Templates & Presets
    | 'templateId:' templateId=STRING
    | 'extends:' extends=STRING
    | 'preset:' preset=STRING;

ContainerLayoutProperty:
    'algorithm:' algorithm=LayoutAlgorithmValue
    | 'spacing:' spacing=NUMBER;

// ============================================================================
// Phase 5: Template & Preset Definitions
// ============================================================================

// template "name" { ... }
TemplateBlock:
    'template' id=STRING '{'
        ('label:' label=STRING)?
        ('description:' description=STRING)?
        ('parameters:' '[' parameters+=TemplateParameter (',' parameters+=TemplateParameter)* ']')?
        ('children:' '[' children+=STRING (',' children+=STRING)* ']')?
        properties+=ContainerStyleProperty*
    '}';

TemplateParameter:
    name=STRING ':' type=TemplateParameterType ('=' defaultValue=(STRING | NUMBER | BooleanValue))?;

TemplateParameterType returns string:
    'string' | 'number' | 'boolean' | 'color';

// preset "name" { ... }
PresetBlock:
    'preset' id=STRING '{'
        ('label:' label=STRING)?
        properties+=ContainerStyleProperty*
    '}';


BorderStyleValue returns string:
    'solid' | 'dashed' | 'dotted';

LabelPositionValue returns string:
    'top' | 'bottom' | 'left' | 'right';

LayoutAlgorithmValue returns string:
    'layered' | 'force' | 'stress' | 'radial' | 'mrtree';

// Phase 2: Collapse/expand value types
CollapseModeValue returns string:
    'full' | 'partial';

CollapseTransitionValue returns string:
    'stable' | 'collapsing' | 'expanding';

CollapseEasingValue returns string:
    'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

// Phase 3: Layout optimization value types
AutoResizeValue returns string:
    'true' | 'false' | 'fit-content' | 'fill-available';

AlignContentValue returns string:
    'left' | 'center' | 'right';

VerticalAlignValue returns string:
    'top' | 'middle' | 'bottom';

DistributionValue returns string:
    'space-evenly' | 'space-between' | 'space-around' | 'packed';

EdgeRoutingValue returns string:
    'container-aware' | 'orthogonal' | 'spline' | 'polyline';

LayoutComplexityValue returns string:
    'low' | 'medium' | 'high';

BooleanValue returns string:
    'true' | 'false';

// Phase 4: Visual controls value types
ButtonPositionValue returns string:
    'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

ButtonStyleValue returns string:
    'icon' | 'text' | 'icon-text';

ResizeHandleValue returns string:
    'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

DepthIndicatorStyleValue returns string:
    'bar' | 'indent' | 'color';

// Terminals
terminal LABELED_ARROW: /-[a-zA-Z_][a-zA-Z0-9_-]*->/;
terminal BIDIRECTIONAL_ARROW: '<->';
terminal ARROW: '->';
terminal SHAPE_ID: /[a-zA-Z_][a-zA-Z0-9_]*-[a-zA-Z0-9_-]*/;
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal STRING: /"(?:[^"\\]|\\.)*"/;
terminal NUMBER: /-?[0-9]+(\.[0-9]+)?/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /(\/\/|#)[^\n\r]*/;
