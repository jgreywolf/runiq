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
    DiagramProfile | ElectricalProfile | ControlProfile | DigitalProfile | RailroadProfile | WardleyProfile | SequenceProfile | PneumaticProfile | HydraulicProfile | HvacProfile | PIDProfile | TimelineProfile | GlyphSetProfile | KanbanProfile | GitGraphProfile | TreemapProfile;

// ============================================================================
// Visual Diagram Profile (existing functionality)
// ============================================================================
DiagramProfile:
    'diagram' name=STRING '{' statements+=DiagramStatement* '}';

// Statements within diagram profile
DiagramStatement:
    DirectionDeclaration
    | RoutingDeclaration
    | ThemeDeclaration
    | StyleDeclaration
    | ShapeDeclaration
    | EdgeDeclaration
    | GroupBlock
    | ContainerBlock
    | TemplateBlock
    | PresetBlock
    | DataSourceDeclaration
    | ForEachBlock;

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
    'net' names+=ProfileIdentifier (',' names+=ProfileIdentifier)*;

// part R1 type:R value:10k pins:(IN,OUT)
PartStatement:
    'part' ref=ProfileIdentifier properties+=PartProperty+;

PartProperty:
    PartTypeProperty | PartValueProperty | PartPinsProperty | PartSourceProperty | PartGenericProperty;

PartTypeProperty:
    'type:' type=ProfileIdentifier;

PartValueProperty:
    'value:' value=(STRING | NUMBER | FlexibleID);

PartSourceProperty:
    'source:' source=STRING;

PartPinsProperty:
    'pins:' '(' pins+=ProfileIdentifier (',' pins+=ProfileIdentifier)* ')';

// Generic parameters for transistors, op-amps, etc: model:"2N2222", w:"10u", l:"1u", ratio:"10:1"
PartGenericProperty:
    key=ID ':' value=(STRING | NUMBER | FlexibleID);

// analysis tran "0 5m"
AnalysisStatement:
    'analysis' kind=AnalysisKind args=STRING?;

AnalysisKind returns string:
    'tran' | 'ac' | 'dc' | 'op' | 'noise';

// ============================================================================
// Control Profile (PLC ladder / FBD)
// ============================================================================
ControlProfile:
    'control' name=STRING '{'
        statements+=ControlStatement*
    '}';

ControlStatement:
    ControlVariantStatement | NetStatement | PartStatement;

ControlVariantStatement:
    'variant' variant=ControlVariant;

ControlVariant returns string:
    'ladder' | 'fbd' | 'sfc';

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
    'module' name=ProfileIdentifier properties+=ModuleProperty+;

ModuleProperty:
    ModulePortsProperty | ModuleParamsProperty;

ModulePortsProperty:
    'ports:' '(' ports+=PortDecl (',' ports+=PortDecl)* ')';

ModuleParamsProperty:
    'params:' '(' params+=ParamDecl (',' params+=ParamDecl)* ')';

PortDecl:
    name=ProfileIdentifier ('[' width=BusWidth ']')?;

BusWidth:
    msb=NUMBER ':' lsb=NUMBER;

ParamDecl:
    name=ProfileIdentifier ':' value=(STRING | NUMBER);

// inst U1 of:Counter map:(clk:clk, reset:reset)
InstStatement:
    'inst' ref=ProfileIdentifier properties+=InstProperty+;

InstProperty:
    InstOfProperty | InstMapProperty | InstParamsProperty;

InstOfProperty:
    'of:' module=ProfileIdentifier;

InstMapProperty:
    'map:' '(' connections+=PortConnection (',' connections+=PortConnection)* ')';

InstParamsProperty:
    'params:' '(' params+=ParamOverride (',' params+=ParamOverride)* ')';

PortConnection:
    port=ProfileIdentifier ':' net=ProfileIdentifier ('[' range=BusWidth ']')?;

ParamOverride:
    param=ProfileIdentifier ':' value=(STRING | NUMBER);

// Digital nets (with optional bus notation)
DigitalNetStatement:
    'net' names+=NetDecl (',' names+=NetDecl)*;

NetDecl:
    name=ProfileIdentifier ('[' width=BusWidth ']')?;

// ============================================================================
// Railroad Profile (syntax diagrams)
// ============================================================================
RailroadProfile:
    'railroad' name=STRING '{'
        statements+=RailroadStatement*
    '}';

RailroadStatement:
    ThemeDeclaration | RailroadOptionsStatement | RailroadDiagramStatement;

RailroadDiagramStatement:
    'diagram' name=ID '=' expression=RailroadExpression;

RailroadExpression:
    RailroadChoice;

RailroadChoice:
    first=RailroadSequence ('|' rest+=RailroadSequence)*;

RailroadSequence:
    items+=RailroadUnary+;

RailroadUnary:
    primary=RailroadPrimary op=('?' | '*' | '+')?;

RailroadPrimary:
    token=STRING | ref=ID | '(' expression=RailroadExpression ')';

RailroadOptionsStatement:
    'options' properties+=RailroadOptionProperty+;

RailroadOptionProperty:
    RailroadMarkerColorProperty
    | RailroadOperatorColorProperty
    | RailroadStartMarkerProperty
    | RailroadEndMarkerProperty
    | RailroadCompactProperty
    | RailroadGapProperty
    | RailroadBranchPadProperty
    | RailroadVGapProperty
    | RailroadLoopProperty
    | RailroadBoxPadXProperty
    | RailroadBoxPadYProperty;

RailroadMarkerColorProperty:
    'markerColor:' value=STRING;

RailroadOperatorColorProperty:
    'operatorColor:' value=STRING;

RailroadStartMarkerProperty:
    'startMarker:' value=RailroadStartMarkerValue;

RailroadStartMarkerValue returns string:
    'circle' | 'none';

RailroadEndMarkerProperty:
    'endMarker:' value=RailroadEndMarkerValue;

RailroadEndMarkerValue returns string:
    'arrow' | 'circle' | 'none';

RailroadCompactProperty:
    'compact:' value=BooleanValue;

RailroadGapProperty:
    'gap:' value=NUMBER;

RailroadBranchPadProperty:
    'branchPad:' value=NUMBER;

RailroadVGapProperty:
    'vGap:' value=NUMBER;

RailroadLoopProperty:
    'loop:' value=NUMBER;

RailroadBoxPadXProperty:
    'boxPadX:' value=NUMBER;

RailroadBoxPadYProperty:
    'boxPadY:' value=NUMBER;

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
    'kg/h' | 't/h' | 'L/min' | 'L/s' | 'm³/h' | 'CFM' | 'GPM' | 'gal/min' | 'bbl/day';

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

// ============================================================================
// HVAC Profile (ASHRAE-style HVAC diagrams)
// ============================================================================

HvacProfile:
    'hvac' name=STRING '{'
        statements+=HvacStatement*
    '}';

HvacStatement:
    HvacEquipmentStatement | HvacDuctStatement | HvacConnectStatement;

// equipment AHU1 type:air-handling-unit cfm:5000
HvacEquipmentStatement:
    'equipment' id=ProfileIdentifier properties+=HvacEquipmentProperty*;

HvacEquipmentProperty:
    HvacEquipmentTypeProperty | HvacEquipmentMetaProperty;

HvacEquipmentTypeProperty:
    'type:' type=HvacEquipmentType;

HvacEquipmentMetaProperty:
    key=(ProfileIdentifier | SHAPE_ID) ':' value=(STRING | NUMBER | FlexibleID);

HvacEquipmentType returns string:
    'air-handling-unit' | 'supply-fan' | 'return-fan' | 'exhaust-fan'
    | 'filter' | 'heating-coil' | 'cooling-coil' | 'humidifier' | 'dehumidifier'
    | 'vav-box' | 'diffuser-supply' | 'diffuser-return'
    | 'damper-motorized' | 'damper-manual' | 'damper-fire'
    | 'thermostat' | 'temperature-sensor' | 'pressure-sensor'
    | 'chiller' | 'boiler' | 'cooling-tower' | 'pump' | 'heat-exchanger';

// duct Supply type:supply size:"16x12"
HvacDuctStatement:
    'duct' id=ProfileIdentifier properties+=HvacDuctProperty*;

HvacDuctProperty:
    HvacDuctTypeProperty | HvacDuctSizeProperty | HvacEquipmentMetaProperty;

HvacDuctTypeProperty:
    'type:' type=HvacDuctType;

HvacDuctType returns string:
    'supply' | 'return' | 'exhaust';

HvacDuctSizeProperty:
    'size:' value=STRING;

// connect AHU1.out -> Supply -> VAV1.in
HvacConnectStatement:
    'connect' path+=HvacConnection (ARROW path+=HvacConnection)*;

HvacConnection:
    ref=ProfileIdentifier ('.' port=ProfileIdentifier)?;

// fluid mineral "ISO VG 46" temp:(10,60,C)
FluidStatement:
    'fluid' type=FluidType viscosity=STRING? ('temp:' '(' minTemp=NUMBER ',' maxTemp=NUMBER ',' tempUnit=TempUnit ')')?;

FluidType returns string:
    'mineral' | 'synthetic' | 'biodegradable' | 'water-glycol' | 'phosphate-ester';

TempUnit returns string:
    'degC' | 'degF' | 'K';

// ============================================================================
// P&ID Profile (Piping & Instrumentation Diagrams) - ISA-5.1 standard
// ============================================================================
PIDProfile:
    'pid' name=STRING '{'
        statements+=PIDStatement*
    '}';

// Statements within P&ID profile
PIDStatement:
    PIDEquipmentStatement
    | PIDInstrumentStatement
    | PIDLineStatement
    | PIDLoopStatement
    | PressureStatement
    | FlowRateStatement
    | FluidStatement;

// equipment V-101 type:vesselVertical volume:5000 unit:L material:SS316
PIDEquipmentStatement:
    'equipment' tag=TAG properties+=PIDEquipmentProperty+;

PIDEquipmentProperty:
    PIDEquipmentTypeProperty
    | PIDVolumeProperty
    | PIDFlowRateProperty
    | PIDMaterialProperty
    | PIDDimensionProperty
    | PIDRatingProperty
    | GenericPIDProperty;

PIDEquipmentTypeProperty:
    'type:' type=PIDEquipmentType;

PIDEquipmentType returns string:
    // Vessels
    'vesselVertical' | 'vesselHorizontal' | 'storageTank' | 'reactor' | 'knockoutDrum'
    | 'distillationColumn' | 'filter' | 'separator' | 'separatorHorizontal' | 'flashDrum' | 'refluxDrum' | 'cyclone'
    // Rotating Equipment
    | 'pumpCentrifugal' | 'pumpPositiveDisplacement' | 'compressorCentrifugal' | 'compressorReciprocating'
    | 'turbineSteam' | 'fan' | 'agitator'
    // Valves
    | 'valveGate' | 'valveGlobe' | 'valveBall' | 'valveCheck' | 'valveControl' | 'valveSafetyRelief'
    | 'valveControlPositioner' | 'valvePressureReducing' | 'valveButterfly' | 'valveThreeWay' | 'valveNeedle' | 'valvePlug' | 'valveDiaphragm'
    | 'valveAngle' | 'valvePinch' | 'valveShutoff'
    // Heat Exchangers
    | 'heatExchangerShellTube' | 'cooler' | 'airCooler' | 'heatExchangerPlate' | 'firedHeater'
    | 'coolingTower' | 'condenser' | 'reboiler' | 'jacket'
    // Safety Equipment
    | 'ruptureDisk';

PIDVolumeProperty:
    'volume:' value=NUMBER 'unit:' unit=VolumeUnit;

VolumeUnit returns string:
    'L' | 'm³' | 'gal' | 'bbl' | 'ft³';

PIDFlowRateProperty:
    'flowRate:' value=NUMBER 'unit:' unit=FlowRateUnit;

PIDMaterialProperty:
    'material:' material=MaterialType;

MaterialType returns string:
    'CS' | 'SS304' | 'SS316' | 'SS316L' | 'Alloy20' | 'Hastelloy' | 'Monel' | 'Titanium' | 'PVC' | 'PP' | 'PTFE';

PIDDimensionProperty:
    'dimension:' value=NUMBER 'unit:' unit=DimensionUnit;

DimensionUnit returns string:
    'mm' | 'cm' | 'm' | 'in' | 'ft';

PIDRatingProperty:
    'rating:' rating=PressureRating;

PressureRating returns string:
    '150#' | '300#' | '600#' | '900#' | '1500#' | '2500#' | 'PN10' | 'PN16' | 'PN25' | 'PN40';

// instrument FT-101 type:flowTransmitter range:(0,1000) unit:kg/h loop:101 location:field
PIDInstrumentStatement:
    'instrument' tag=TAG properties+=PIDInstrumentProperty+;

PIDInstrumentProperty:
    PIDInstrumentTypeProperty
    | PIDRangeProperty
    | PIDLoopRefProperty
    | PIDLocationProperty
    | PIDAccuracyProperty
    | GenericPIDProperty;

PIDInstrumentTypeProperty:
    'type:' type=PIDInstrumentType;

PIDInstrumentType returns string:
    // Transmitters
    'flowTransmitter' | 'temperatureTransmitter' | 'pressureTransmitter' | 'levelTransmitter'
    | 'analyzerTransmitter' | 'phTransmitter' | 'conductivityTransmitter' | 'vibrationTransmitter'
    // Indicators
    | 'flowIndicator' | 'temperatureIndicator' | 'pressureIndicator' | 'levelIndicator'
    // Controllers
    | 'flowController' | 'temperatureController' | 'pressureController' | 'levelController' | 'speedController'
    // Indicator Controllers
    | 'flowIndicatorController' | 'temperatureIndicatorController' | 'levelIndicatorController'
    | 'pressureIndicatorController'
    // Switches
    | 'flowSwitch' | 'levelSwitch' | 'pressureSwitch' | 'temperatureSwitch'
    // Alarms
    | 'temperatureAlarmHigh' | 'temperatureAlarmLow' | 'temperatureAlarmHighHigh' | 'temperatureAlarmLowLow'
    | 'pressureAlarmHigh' | 'pressureAlarmLow' | 'pressureAlarmHighHigh' | 'pressureAlarmLowLow'
    | 'levelAlarmHigh' | 'levelAlarmLow' | 'levelAlarmHighHigh' | 'levelAlarmLowLow'
    | 'flowAlarmHigh' | 'flowAlarmLow'
    // Recorders
    | 'flowRecorder' | 'pressureRecorder' | 'temperatureRecorder';

PIDRangeProperty:
    'range:' '(' min=NUMBER ',' max=NUMBER ')' 'unit:' unit=MeasurementUnit;

MeasurementUnit returns string:
    'kg/h' | 't/h' | 'L/min' | 'm³/h' | 'degC' | 'degF' | 'bar' | 'psi' | 'kPa' | 'm' | 'mm' | '%' | 'rpm' | 'mm/s';

PIDLoopRefProperty:
    'loop:' loopNum=NUMBER;

PIDLocationProperty:
    'location:' location=InstrumentLocation;

InstrumentLocation returns string:
    'field' | 'panel' | 'local' | 'remote' | 'control_room';

PIDAccuracyProperty:
    'accuracy:' value=NUMBER 'unit:' unit=AccuracyUnit;

AccuracyUnit returns string:
    '%' | 'ppm' | 'units';

// line process solid from:V-101.outlet to:P-101.inlet size:4 schedule:40 material:SS316
PIDLineStatement:
    'line' lineType=PIDLineType style=PIDLineStyle? properties+=PIDLineProperty+;

PIDLineType returns string:
    'process' | 'utility' | 'signal' | 'electrical' | 'pneumatic' | 'hydraulic' | 'data';

PIDLineStyle returns string:
    'solid' | 'dashed' | 'dotted' | 'double' | 'future';

PIDLineProperty:
    PIDLineFromProperty
    | PIDLineToProperty
    | PIDLineSizeProperty
    | PIDLineScheduleProperty
    | PIDLineMaterialProperty
    | PIDLineInsulationProperty
    | GenericPIDProperty;

PIDLineFromProperty:
    'from:' from=ConnectionPoint;

PIDLineToProperty:
    'to:' to=ConnectionPoint;

ConnectionPoint:
    equipment=TAG ('.' port=FlexibleID)?;

PIDLineSizeProperty:
    'size:' size=NUMBER ('unit:' unit=SizeUnit)?;

SizeUnit returns string:
    'in' | 'mm' | 'NPS' | 'DN';

PIDLineScheduleProperty:
    'schedule:' schedule=PipeSchedule;

PipeSchedule returns string:
    'SCH5' | 'SCH10' | 'SCH20' | 'SCH30' | 'STD' | 'SCH40' | 'SCH60' | 'XS' | 'SCH80' | 'SCH100' | 'SCH120' | 'SCH140' | 'SCH160' | 'XXS';

PIDLineMaterialProperty:
    'material:' material=MaterialType;

PIDLineInsulationProperty:
    'insulation:' type=InsulationType;

InsulationType returns string:
    'none' | 'thermal' | 'acoustic' | 'fireproof' | 'personnel_protection';

// loop 101 controlled_variable:flow setpoint:1000 unit:kg/h controller:FIC-101
PIDLoopStatement:
    'loop' loopNum=NUMBER properties+=PIDLoopProperty+;

PIDLoopProperty:
    PIDControlledVariableProperty
    | PIDSetpointProperty
    | PIDControllerProperty
    | PIDControlModeProperty
    | GenericPIDProperty;

PIDControlledVariableProperty:
    'controlled_variable:' variable=ControlVariable;

ControlVariable returns string:
    'flow' | 'temperature' | 'pressure' | 'level' | 'composition' | 'ph' | 'conductivity' | 'speed';

PIDSetpointProperty:
    'setpoint:' value=NUMBER ('unit:' unit=MeasurementUnit)?;

PIDControllerProperty:
    'controller:' tag=TAG;

PIDControlModeProperty:
    'mode:' mode=ControlMode;

ControlMode returns string:
    'manual' | 'auto' | 'cascade' | 'ratio' | 'feedforward';

// Generic property for extensibility
GenericPIDProperty:
    key=ID ':' value=(STRING | NUMBER | ID);

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
    'participant' name=SequenceIdentifier ('as' type=SequenceParticipantType)?;

SequenceParticipantType returns string:
    'actor' | 'entity' | 'boundary' | 'control' | 'database' | 'continuation';

// message from:"Actor" to:"Web Server" label:"HTTP Request" type:sync activate:true
SequenceMessageStatement:
    'message' properties+=SequenceMessageProperty+;

SequenceMessageProperty:
    SequenceFromProperty | SequenceToProperty | SequenceLabelProperty | SequenceTypeProperty | SequenceActivateProperty | SequenceGuardProperty | SequenceTimingProperty | SequenceStateInvariantProperty;

SequenceFromProperty:
    'from:' (from=SequenceIdentifier | from='lost' | from='found');

SequenceToProperty:
    'to:' (to=SequenceIdentifier | to='lost' | to='found');

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

SequenceStateInvariantProperty:
    'stateInvariant:' value=STRING;

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
    'participants:' '(' participants+=SequenceIdentifier (',' participants+=SequenceIdentifier)* ')';

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
// Timeline Profile - Chronological events and milestones
// ============================================================================

TimelineProfile:
    'timeline' name=STRING '{'
        statements+=TimelineStatement*
    '}';

TimelineStatement:
    TimelineEventStatement | TimelinePeriodStatement | TimelineOrientationStatement;

// event kickoff date:"2024-01-15" label:"Project Kickoff" description:"Initial meeting" icon:"flag" textColor:"#3b82f6"
  TimelineEventStatement:
      'event' id=TimelineIdentifier properties+=TimelineEventProperty+;

TimelineEventProperty:
    TimelineDateProperty | TimelineLabelProperty | TimelineDescriptionProperty | TimelineIconProperty | TimelineColorProperty | TimelinePositionProperty;

TimelineDateProperty:
    'date:' date=STRING;

TimelineLabelProperty:
    'label:' label=STRING;

TimelineDescriptionProperty:
    'description:' description=STRING;

TimelineIconProperty:
    'icon:' icon=STRING;

TimelineColorProperty:
    'textColor:' color=STRING;

TimelinePositionProperty:
    'position:' position=TimelinePosition;

TimelinePosition returns string:
    'top' | 'bottom' | 'left' | 'right';

// period planning startDate:"2024-01-15" endDate:"2024-02-28" label:"Planning Phase" textColor:"#e0e7ff"
  TimelinePeriodStatement:
      'period' id=TimelineIdentifier properties+=TimelinePeriodProperty+;

  TimelineIdentifier returns string:
      FlexibleID | STRING;

TimelinePeriodProperty:
    TimelineStartDateProperty | TimelineEndDateProperty | TimelineLabelProperty | TimelineColorProperty | TimelineOpacityProperty;

TimelineStartDateProperty:
    'startDate:' startDate=STRING;

TimelineEndDateProperty:
    'endDate:' endDate=STRING;

TimelineOpacityProperty:
    'opacity:' opacity=NUMBER;

// Optional: orientation horizontal (default) or vertical
TimelineOrientationStatement:
    'orientation' orientation=TimelineOrientation;

TimelineOrientation returns string:
    'horizontal' | 'vertical';

// ============================================================================
// Kanban Profile - Columns, cards, and swimlanes
// ============================================================================

KanbanProfile:
    'kanban' name=STRING '{'
        statements+=KanbanStatement*
    '}';

KanbanStatement:
    ThemeDeclaration
    | KanbanSwimlaneBlock
    | KanbanColumnBlock;

// swimlane "Product" { column ... }
KanbanSwimlaneBlock:
    'swimlane' label=STRING? properties+=KanbanStyleProperty* '{'
        columns+=KanbanColumnBlock*
    '}';

// column Backlog "Backlog" wip:5 { card ... }
  KanbanColumnBlock:
      'column' id=KanbanIdentifier? label=STRING properties+=KanbanColumnProperty* '{'
          cards+=KanbanCardStatement*
      '}';

  KanbanColumnProperty:
      KanbanWipProperty | KanbanMaxCardsProperty | KanbanOverflowProperty | KanbanStyleProperty;

  KanbanWipProperty:
      'wip:' value=NUMBER;

  KanbanMaxCardsProperty:
      'maxCards:' value=NUMBER;

  KanbanOverflowProperty:
      'overflow:' value=KanbanOverflowValue;

  KanbanOverflowValue returns string:
      'stack' | 'ellipsis';

// card C1 "Implement auth" priority:high tags:["frontend"]
  KanbanCardStatement:
      'card' id=KanbanIdentifier? label=STRING properties+=KanbanCardProperty*;

KanbanCardProperty:
    KanbanDescriptionProperty
    | KanbanAssigneeProperty
    | KanbanPriorityProperty
    | KanbanTagsProperty
    | KanbanEstimateProperty
    | KanbanStyleProperty;

KanbanDescriptionProperty:
    'description:' description=STRING;

KanbanAssigneeProperty:
    'assignee:' assignee=STRING;

KanbanPriorityProperty:
    'priority:' priority=KanbanPriorityValue;

KanbanPriorityValue returns string:
    'low' | 'medium' | 'high' | 'critical';

KanbanTagsProperty:
    'tags:' value=StringArray;

KanbanEstimateProperty:
    'estimate:' estimate=STRING;

KanbanStyleProperty:
    KanbanFillColorProperty
    | KanbanStrokeColorProperty
    | KanbanTextColorProperty
    | KanbanBorderRadiusProperty;

KanbanFillColorProperty:
    'fillColor:' value=STRING;

KanbanStrokeColorProperty:
    'strokeColor:' value=STRING;

KanbanTextColorProperty:
    'textColor:' value=STRING;

  KanbanBorderRadiusProperty:
      'borderRadius:' value=NUMBER;

KanbanIdentifier returns string:
    FlexibleID | STRING;

ProfileIdentifier returns string:
    FlexibleID | STRING;

DiagramIdentifier returns string:
    FlexibleID | STRING;

SequenceIdentifier returns string:
    FlexibleID | STRING;

// ============================================================================
// GitGraph Profile - Branches, commits, merges, tags
// ============================================================================

GitGraphProfile:
    'gitgraph' name=STRING '{'
        statements+=GitGraphStatement*
    '}';

GitGraphStatement:
    ThemeDeclaration
    | GitGraphOrientationStatement
    | GitGraphSpacingStatement
    | GitGraphBranchStatement
    | GitGraphCommitStatement
    | GitGraphMergeStatement;

GitGraphOrientationStatement:
    'orientation' orientation=GitGraphOrientationValue;

GitGraphOrientationValue returns string:
    'vertical' | 'horizontal';

GitGraphSpacingStatement:
    'spacing' '(' properties+=GitGraphSpacingProperty (',' properties+=GitGraphSpacingProperty)* ')';

GitGraphSpacingProperty:
    GitGraphRowSpacingProperty | GitGraphColumnSpacingProperty;

GitGraphRowSpacingProperty:
    'row:' value=NUMBER;

GitGraphColumnSpacingProperty:
    'column:' value=NUMBER;

  GitGraphBranchStatement:
      'branch' id=GitGraphIdentifier properties+=GitGraphBranchProperty*;

GitGraphBranchProperty:
    GitGraphBranchLabelProperty | GitGraphBranchColorProperty | GitGraphBranchParentProperty;

GitGraphBranchLabelProperty:
    'label:' label=STRING;

GitGraphBranchColorProperty:
    'color:' color=STRING;

  GitGraphBranchParentProperty:
      'parent:' parent=GitGraphIdentifier;

  GitGraphCommitStatement:
      'commit' id=GitGraphIdentifier properties+=GitGraphCommitProperty+;

GitGraphCommitProperty:
    GitGraphCommitBranchProperty
    | GitGraphCommitLabelProperty
    | GitGraphCommitMessageProperty
    | GitGraphCommitAuthorProperty
    | GitGraphCommitTagProperty;

  GitGraphCommitBranchProperty:
      'branch:' branch=GitGraphIdentifier;

GitGraphCommitLabelProperty:
    'label:' label=STRING;

GitGraphCommitMessageProperty:
    'message:' message=STRING;

GitGraphCommitAuthorProperty:
    'author:' author=STRING;

GitGraphCommitTagProperty:
    'tag:' tag=STRING;

  GitGraphMergeStatement:
      'merge' id=GitGraphIdentifier properties+=GitGraphMergeProperty+;

GitGraphMergeProperty:
    GitGraphMergeFromProperty
    | GitGraphMergeIntoProperty
    | GitGraphMergeLabelProperty
    | GitGraphMergeTagProperty;

  GitGraphMergeFromProperty:
      'from:' from=GitGraphIdentifier;

  GitGraphMergeIntoProperty:
      'into:' into=GitGraphIdentifier;

  GitGraphIdentifier returns string:
      FlexibleID | STRING;

GitGraphMergeLabelProperty:
    'label:' label=STRING;

GitGraphMergeTagProperty:
    'tag:' tag=STRING;

// ============================================================================
// Treemap Profile - Hierarchical area layout
// ============================================================================

TreemapProfile:
    'treemap' name=STRING '{'
        statements+=TreemapStatement*
    '}';

TreemapStatement:
    ThemeDeclaration
    | TreemapLayoutStatement
    | TreemapPaddingStatement
    | TreemapGapStatement
    | TreemapShowValuesStatement
    | TreemapShowLegendStatement
    | TreemapGroupBlock
    | TreemapItemStatement;

TreemapLayoutStatement:
    'layout' layout=TreemapLayoutValue;

TreemapLayoutValue returns string:
    'slice-dice' | 'squarify';

TreemapPaddingStatement:
    'padding' value=NUMBER;

TreemapGapStatement:
    'gap' value=NUMBER;

TreemapShowValuesStatement:
    'showValues' value=BooleanValue;

TreemapShowLegendStatement:
    'showLegend' value=BooleanValue;

TreemapGroupBlock:
    'group' label=STRING properties+=TreemapNodeProperty* '{'
        children+=(TreemapGroupBlock | TreemapItemStatement)*
    '}';

TreemapItemStatement:
    'item' label=STRING properties+=TreemapNodeProperty*;

TreemapNodeProperty:
    TreemapValueProperty | TreemapColorProperty | TreemapLabelProperty;

TreemapValueProperty:
    'value:' value=NUMBER;

TreemapColorProperty:
    'color:' color=STRING;

TreemapLabelProperty:
    'label:' label=STRING;

// ============================================================================
// GlyphSet Profile - SmartArt-style diagram templates
// ============================================================================

GlyphSetProfile:
    'glyphset' glyphsetType=GlyphSetType name=STRING '{'
        items+=(GlyphSetItemStatement | GlyphSetParameter)*
    '}';

// Allow both IDs and certain keywords as glyphset types
GlyphSetType returns string:
    ID | 'target' | 'source' | 'balance' | 'events';

GlyphSetItemStatement:
    GlyphSetImageItem | GlyphSetSimpleItem | GlyphSetNestedItem;

// Image items with optional label and description: image "url" label "text" description "text"
GlyphSetImageItem:
    keyword='image' url=STRING ('label' label=STRING)? ('description' description=STRING)?;

// Simple flat items: step "Label", level "Label", etc.
GlyphSetSimpleItem:
    keyword=GlyphSetKeyword label=STRING relationship=GlyphSetRelationshipValue?;

// Nested items with children: person "Name" { person "Child1" person "Child2" }
GlyphSetNestedItem:
    keyword=GlyphSetKeyword label=STRING relationship=GlyphSetRelationshipValue? '{' children+=GlyphSetItemStatement* '}';

GlyphSetRelationshipValue returns string:
    STRING
    | 'topSide' | 'rightSide' | 'bottomSide' | 'leftSide'
    | 'top' | 'right' | 'bottom' | 'left';

// Parameter assignments: direction "LR", theme professional, columns 3, shape "circle", showPercentages true
GlyphSetParameter:
    name=GlyphSetParameterName value=(GlyphSetParameterValue);

GlyphSetParameterValue:
    stringValue=STRING | numberValue=NUMBER | boolValue=BooleanValue | themeValue=ThemeValue | directionValue=DirectionValue;

GlyphSetParameterName returns string:
    'alternating' | 'bidirectional' | 'callouts' | 'center' | 'centerLabel' | 'circles' | 'colorScheme' | 'columnHeaders' | 'columns'
    | 'direction' | 'events' | 'frameStyle' | 'groups' | 'horizontalAxis' | 'image' | 'images' | 'items'
    | 'layout' | 'leftWeight' | 'levels' | 'mergePoint' | 'operator' | 'orientation' | 'overlap'
    | 'quadrants' | 'relationship' | 'result' | 'rightWeight' | 'rowHeaders'
    | 'segments' | 'shape' | 'showAllConnections' | 'showConnections' | 'showDottedLines' | 'showPercentages' | 'showValues' | 'sides' | 'source'
    | 'stages' | 'steps' | 'structure' | 'target' | 'theme' | 'useContainers' | 'verticalAxis' | 'xAxis' | 'yAxis';

GlyphSetKeyword returns string:
    'step' | 'item' | 'person' | 'level' | 'stage' | 'event' | 'quadrant' | 'circle' | 'node' | 'group' | 'side'
    | 'left' | 'right' | 'input' | 'output' | 'center' | 'spoke' | 'team' | 'root' | 'child' | 'leader' | 'member'
    | 'callout';


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

// theme professional | forest | sunset | ocean | monochrome | colorful | vibrant | warm | cool | runiq
ThemeDeclaration:
    'theme' value=ThemeValue;

ThemeValue returns string:
    'professional' | 'forest' | 'sunset' | 'ocean' | 'monochrome' | 'colorful' | 'vibrant' | 'warm' | 'cool' | 'runiq';

// routing orthogonal | polyline | splines | straight
RoutingDeclaration:
    'routing' value=RoutingValue;

RoutingValue returns string:
    'orthogonal' | 'polyline' | 'splines' | 'straight';

// style myStyle fillColor:"red" strokeColor:"blue" textColor:"#333"
StyleDeclaration:
    'style' name=DiagramIdentifier properties+=StyleProperty+;

StyleProperty:
    key=StylePropertyKey value=(STRING | NUMBER | ID);

// Allow regular IDs plus property keywords that users might use in styles
StylePropertyKey returns string:
    ID ':' | 'fillColor:' | 'strokeColor:' | 'textColor:' | 'strokeWidth:' | 'fontSize:' | 'fontFamily:' | 'fontWeight:' | 'textAlign:' | 'opacity:' | 'borderRadius:' | 'lineStyle:';

// shape node1 as @rounded label: "My Node" style: myStyle icon: fa/user link: "http://example.com"
// shape node1 label: "My Node" (shape optional if inside type:mindmap container)
ShapeDeclaration:
    'shape' id=DiagramIdentifier ('as' '@' shape=ShapeIdentifier)? properties+=NodeProperty*;

// Allow shape IDs, regular IDs, and certain keywords that are valid shape names
ShapeIdentifier returns string:
    SHAPE_ID | ID | 'actor' | 'entity' | 'boundary' | 'control' | 'database' | 'note'
    | 'lifeline' | 'continuation' | 'timeObservation' | 'activity'
    | 'objectNode' | 'centralBuffer' | 'dataStore' | 'component' | 'artifact' | 'node'
    | 'port' | 'module' | 'template' | 'history' | 'pin' | 'assembly'
    | 'providedInterface' | 'requiredInterface' | 'frame' | 'collaboration'
    | 'submachine' | 'loop' | 'verticalFork' | 'sendSignal' | 'receiveSignal' | 'acceptEvent'
    | 'activityFinal' | 'flowFinal' | 'initialState' | 'finalState'
    | 'historyShallow' | 'historyDeep' | 'junction' | 'entryPoint' | 'exitPoint' | 'terminate'
    | 'db' | 'pill' | 'circle' | 'person';

NodeProperty:
    LabelProperty
    | PositionProperty
    | StyleRefProperty
    | IconProperty
    | LinkProperty
    | TooltipProperty
    | DataProperty
    | LabelsProperty
    | ShowLegendProperty
    | ShowValuesProperty
    | LegendPositionProperty
    | StackedProperty
    | ColorsProperty
    | IntersectionsProperty
    | FlipAxesProperty
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
    | FillColorProperty
    | TextColorProperty
    | StrokeColorProperty
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
    | ExtensionPointsProperty
    | GatewayTypeProperty
    | ShowMetricsProperty
    | MetricTypeProperty
    | MetricPositionProperty;

LabelProperty:
    'label:' value=STRING;

PositionProperty:
    'position:' '(' x=NUMBER ',' y=NUMBER ')';

// BPMN Gateway property
GatewayTypeProperty:
    'gatewayType:' value=GatewayTypeValue;

GatewayTypeValue returns string:
    'exclusive' | 'xor' | 'parallel' | 'and' | 'inclusive' | 'or' | 'eventBased' | 'event' | 'complex';

StyleRefProperty:
    'style:' ref=[StyleDeclaration:DiagramIdentifier];

IconProperty:
    'icon:' provider=ID '/' icon=ID;

LinkProperty:
    'link:' url=STRING;

TooltipProperty:
    'tooltip:' text=STRING;

LabelsProperty:
    'labels:' value=StringArray;

ShowLegendProperty:
    'showLegend:' value=BooleanValue;

ShowValuesProperty:
    'showValues:' value=BooleanValue;

LegendPositionProperty:
    'legendPosition:' value=STRING;

StackedProperty:
    'stacked:' value=BooleanValue;

ColorsProperty:
    'colors:' value=StringArray;

IntersectionsProperty:
    'intersections:' value=StringArray;

FlipAxesProperty:
    'flipAxes:' value=BooleanValue;

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

// Graph Metrics Visualization properties
ShowMetricsProperty:
    'showMetrics:' value=BooleanValue;

MetricTypeProperty:
    'metricType:' value=MetricTypeValue;

MetricTypeValue returns string:
    'degree' | 'betweenness' | 'closeness' | 'clustering';

MetricPositionProperty:
    'metricPosition:' value=MetricPositionValue;

MetricPositionValue returns string:
    'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

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
FillColorProperty:
    'fillColor:' value=STRING;

TextColorProperty:
    'textColor:' value=STRING;

StrokeColorProperty:
    'strokeColor:' value=STRING;

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
// node1 -east-> node2 (exit from east side)
// node1 -north->south node2 (exit north, enter south)
// node1 -east-"label"->west node2 (anchors with label)
// node1 <-> node2 (bidirectional connection)
// Class.field -> OtherClass.method (member-level connections)
// A -> B -> C (chained edges)
EdgeDeclaration:
    from=NodeRef (arrow=ARROW | bidirectionalArrow=BIDIRECTIONAL_ARROW | labeledArrow=LABELED_ARROW | anchoredArrow=ANCHORED_ARROW) to=NodeRef
    chain+=(EdgeChain)* properties+=EdgeProperty*;

EdgeChain:
    (arrow=ARROW | bidirectionalArrow=BIDIRECTIONAL_ARROW | labeledArrow=LABELED_ARROW | anchoredArrow=ANCHORED_ARROW) to=NodeRef;

// Support both simple node references (node1) and member references (Class.field)
// Use FlexibleID to allow keywords like 'data', 'label', 'm' as node names
NodeRef:
    node=DiagramIdentifier ('.' member=DiagramIdentifier)?;

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
    | StrokeColorProperty
    | StrokeWidthProperty
    | StyleRefProperty
    | EventProperty
    | GuardProperty
    | EffectProperty
    | FlowTypeProperty
    | WeightProperty;

EdgeLabelProperty:
    'label:' label=STRING;

WeightProperty:
    'weight:' value=NUMBER;

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
    'container' (id=ID)? label=STRING ('as' '@' shape=(SHAPE_ID | FlexibleID))? properties+=ContainerProperty* '{'
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
    | 'strokeColor:' strokeColor=STRING
    | 'strokeWidth:' strokeWidth=NUMBER
    | 'fillColor:' fillColor=STRING
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
    | 'direction:' direction=DirectionValue
    | 'spacing:' spacing=NUMBER
    | 'orientation:' orientation=OrientationValue;

// ============================================================================
// Phase 2: Data-Driven Rendering - Data Sources & Templates
// ============================================================================

// datasource "json" key:users from:"data/users.json"
// datasource "csv" key:metrics from:"metrics.csv"
DataSourceDeclaration:
    'datasource' format=STRING 'key:' key=DiagramIdentifier 'from:' source=STRING
    ('options:' '{' options+=DataSourceOption (',' options+=DataSourceOption)* '}')?;

DataSourceOption:
    name=ID ':' value=(STRING | NUMBER | BooleanValue);

// Data-driven ForEach block: generates nodes/edges from data
// foreach "userCard" from:users { ... }
ForEachBlock:
    'foreach' id=STRING 'from:' dataKey=DiagramIdentifier '{'
        ('filter:' filter=STRING)?
        ('limit:' limit=NUMBER)?
        statements+=TemplateStatement*
    '}';

TemplateStatement:
    TemplateNodeDeclaration
    | TemplateEdgeDeclaration
    | ConditionalBlock
    | LoopBlock;

// Node with variable substitution: node ${item.id} shape:rect label:${item.name}
TemplateNodeDeclaration:
    'node' id=TemplateExpression properties+=TemplateNodeProperty*;

TemplateNodeProperty:
    'shape:' shape=ID
    | 'label:' label=TemplateExpression
    | 'fillColor:' fillColor=TemplateExpression
    | 'strokeColor:' strokeColor=TemplateExpression
    | 'style:' style=DiagramIdentifier
    | 'data:' '{' dataProps+=TemplateDataProperty (',' dataProps+=TemplateDataProperty)* '}';

TemplateDataProperty:
    key=TemplateIdentifier ':' value=TemplateExpression;

// Edge with variable substitution: edge ${item.source} -> ${item.target}
TemplateEdgeDeclaration:
    'edge' from=TemplateExpression ARROW to=TemplateExpression properties+=TemplateEdgeProperty*;

TemplateEdgeProperty:
    'label:' label=TemplateExpression
    | 'style:' style=DiagramIdentifier
    | 'when:' condition=TemplateExpression;

// Conditional rendering: if ${item.active} { ... }
ConditionalBlock:
    'if' condition=TemplateExpression '{' statements+=TemplateStatement* '}';

// Loop over data: for item in ${data.items} { ... }
LoopBlock:
    'for' variable=DiagramIdentifier 'in' collection=TemplateExpression '{' statements+=TemplateStatement* '}';

// Template expression: literal string, variable reference ${...}, or combination
TemplateExpression:
    parts+=TemplateExpressionPart+;

TemplateExpressionPart:
    TemplateLiteral | TemplateVariable;

TemplateLiteral:
    value=STRING;

TemplateVariable:
    '${' path=TemplateVariablePath '}';

TemplateVariablePath:
    segments+=TemplateIdentifier ('.' segments+=TemplateIdentifier)*;

// Allow keywords as identifiers in node/edge IDs and other contexts
// This prevents conflicts when users want to use reserved property names as node IDs
// Common words from examples: data, label, process, start, end, mobile, etc.
// NOTE: 'template' and 'preset' are NOT included here as they are Phase 5 keywords
FlexibleID returns string:
    ID 
    // Data-driven keywords (excluding 'template' which is a Phase 5 keyword)
    | 'data' | 'from' | 'to' | 'key' | 'source' | 'filter' | 'limit'
    // Property keywords  
    | 'label' | 'name' | 'id' | 'type' | 'value' | 'format' | 'color' | 'header' | 'delimiter'
    // Control flow keywords
    | 'for' | 'in' | 'if' | 'loop' | 'call'
    // Common node names
    | 'start' | 'end' | 'done' | 'process' | 'mobile' | 'm' | 'f' | 'e' | 'step' | 'action'
    | 'input' | 'output' | 'config' | 'settings' | 'api' | 'db' | 'cache' | 'queue'
    // Common mindmap/hierarchy node names
    | 'root' | 'child' | 'branch' | 'leaf' | 'node' | 'center' | 'central' | 'hub'
    | 'left' | 'right' | 'team' | 'leader' | 'member' | 'detail' | 'spoke'
    // Control variable keywords used in profiles
    | 'flow' | 'temperature' | 'pressure' | 'level' | 'composition' | 'ph' | 'conductivity' | 'speed';

// Allow keywords as identifiers in template variable paths
TemplateIdentifier returns string:
    ID | 'data' | 'color' | 'header' | 'delimiter' | 'value' | 'type' | 'from' | 'to'
    | 'label' | 'name' | 'id' | 'key' | 'format' | 'source' | 'filter' | 'limit' | 'item';

// ============================================================================
// Phase 5: Template & Preset Definitions (Container Templates)
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
    'layered' | 'force' | 'stress' | 'radial' | 'mrtree' | 'circular';

OrientationValue returns string:
    'horizontal' | 'vertical';

// Phase 2: Collapse/expand value types
CollapseModeValue returns string:
    'full' | 'partial';

CollapseTransitionValue returns string:
    'stable' | 'collapsing' | 'expanding';

CollapseEasingValue returns string:
    'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

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
// Note: Order matters! More specific patterns must come first
terminal ANCHORED_ARROW: /-(north|south|east|west)(-"[^"]*")?->(north|south|east|west)?/;
terminal LABELED_ARROW: /-[a-zA-Z_][a-zA-Z0-9_-]*->/;
terminal BIDIRECTIONAL_ARROW: '<->';
terminal ARROW: '->';
terminal TAG: /[A-Z][A-Z0-9]*-[0-9]{1,4}[A-Z]?/;  // P&ID instrument/equipment tags like V-101, FT-205, PIC-301A (uppercase-number format, must come first)
terminal SHAPE_ID: /[a-z_][a-zA-Z0-9_]*-[a-zA-Z0-9_-]*/;  // Shape IDs like circle-filled, must start with lowercase or underscore to avoid matching P&ID tags
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal STRING: /"(?:[^"\\]|\\.)*"/;
terminal NUMBER: /-?[0-9]+(\.[0-9]+)?/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /(\/\/|#)[^\n\r]*/;
