// ============================================================================
// Common Types and Values
// ============================================================================
// Shared types used across profiles

import './terminals'

// Allow keywords as identifiers in node/edge IDs and other contexts
// This prevents conflicts when users want to use reserved words as node IDs
FlexibleID returns string:
    ID;

BooleanValue returns string:
    'true' | 'false';

DirectionValue returns string:
    'LR' | 'RL' | 'TB' | 'BT';

RoutingValue returns string:
    'orthogonal' | 'polyline' | 'splines' | 'straight';

// Visual controls value types
ButtonPositionValue returns string:
    'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

ButtonStyleValue returns string:
    'icon' | 'text' | 'icon-text';

ResizeHandleValue returns string:
    'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

DepthIndicatorStyleValue returns string:
    'bar' | 'indent' | 'color';
