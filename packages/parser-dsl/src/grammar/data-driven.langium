// ============================================================================
// Data-Driven Rendering
// ============================================================================
// Data source loading and template-based node/edge generation

import './terminals'
import './common-types'

// datasource "json" key:users from:"data/users.json"  
// datasource "csv" key:metrics from:"metrics.csv"
// Using PropertyPair pattern to avoid keyword reservation
DataSourceDeclaration:
    'datasource' format=STRING properties+=DataSourceProperty+;

DataSourceProperty:
    PropertyPair;

PropertyPair:
    key=ID ':' value=(STRING | NUMBER | BooleanValue | ID | PropertyObject);

PropertyObject:
    '{' pairs+=PropertyPair (',' pairs+=PropertyPair)* '}';

// Data-driven template block: generates nodes/edges from data
// template "userCard" from:users { ... }
DataTemplateBlock:
    'template' id=STRING properties+=TemplateBlockProperty* '{'
        statements+=TemplateStatement*
    '}';

TemplateBlockProperty:
    PropertyPair;

TemplateStatement:
    TemplateNodeDeclaration
    | TemplateEdgeDeclaration
    | ConditionalBlock
    | LoopBlock
    | TemplateCallStatement;

// Node with variable substitution: node ${item.id} shape:rect label:${item.name}
TemplateNodeDeclaration:
    'node' id=TemplateExpression properties+=TemplatePropertyPair*;

TemplatePropertyPair:
    key=ID ':' value=(TemplateExpression | ID | PropertyObject);

// Edge with variable substitution: edge ${item.source} -> ${item.target}
TemplateEdgeDeclaration:
    'edge' from=TemplateExpression ARROW to=TemplateExpression properties+=TemplatePropertyPair*;

// Conditional rendering: if ${item.active} { ... }
ConditionalBlock:
    'if' condition=TemplateExpression '{' 
        statements+=TemplateStatement* 
    '}' 
    ('else' '{' elseStatements+=TemplateStatement* '}')?;

// Loop over data: for item in ${data.items} { ... }
LoopBlock:
    'for' variable=ID 'in' collection=TemplateExpression '{' statements+=TemplateStatement* '}';

// Template composition: call another template
TemplateCallStatement:
    'call' templateName=STRING ('with' ':' '{' params+=TemplateCallParam (',' params+=TemplateCallParam)* '}')?;

TemplateCallParam:
    key=ID ':' value=TemplateExpression;

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

// Allow keywords as identifiers in template variable paths
// Note: These are only valid inside template contexts, not globally
TemplateIdentifier returns string:
    ID | 'data' | 'color' | 'header' | 'delimiter' | 'value' | 'type' | 'from' | 'to'
    | 'label' | 'name' | 'id' | 'key' | 'format' | 'source' | 'filter' | 'limit';
