// ============================================================================
// Core Terminals
// ============================================================================
// Common terminal definitions used across all profiles

terminal LABELED_ARROW: /-[a-zA-Z_][a-zA-Z0-9_-]*->/;
terminal BIDIRECTIONAL_ARROW: '<->';
terminal ARROW: '->';
terminal TAG: /[A-Z][A-Z0-9]*-[0-9]{1,4}[A-Z]?/;  // P&ID instrument/equipment tags like V-101, FT-205, PIC-301A
terminal SHAPE_ID: /[a-z_][a-zA-Z0-9_]*-[a-zA-Z0-9_-]*/;  // Shape IDs like circle-filled
terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal STRING: /"(?:[^"\\]|\\.)*"/;
terminal NUMBER: /-?[0-9]+(\.[0-9]+)?/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /(\/\/|#)[^\n\r]*/;
