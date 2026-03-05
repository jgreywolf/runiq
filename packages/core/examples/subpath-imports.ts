/**
 * Examples of using subpath imports for smaller bundles
 */

// Example 1: Import only basic shapes
import {
  rectangleShape,
  circleShape,
  triangleShape,
} from '@runiq/core/shapes/basic';
import { shapeRegistry } from '@runiq/core';

shapeRegistry.register(rectangleShape);
shapeRegistry.register(circleShape);
shapeRegistry.register(triangleShape);

// Bundle size: ~15 KB (vs 165 KB for full package)

// Example 2: Import UML shapes for class diagrams
import {
  classShape,
  interfaceShape,
  packageShape,
} from '@runiq/core/shapes/uml';

shapeRegistry.register(classShape);
shapeRegistry.register(interfaceShape);
shapeRegistry.register(packageShape);

// Bundle size: ~27 KB (vs 165 KB for full package)

// Example 3: Mix categories as needed
import { docShape, predefinedProcessShape } from '@runiq/core/shapes/flowchart';
import { cylinderShape } from '@runiq/core/shapes/storage';
import { cloudShape } from '@runiq/core/shapes/network';

shapeRegistry.register(docShape);
shapeRegistry.register(predefinedProcessShape);
shapeRegistry.register(cylinderShape);
shapeRegistry.register(cloudShape);

// Bundle size: ~35 KB (basic + flowchart + storage + network portions only)

// Example 4: Still works - register all via category function
import { registerBasicShapes } from '@runiq/core';
registerBasicShapes();

// Example 5: Legacy API still works
import { registerDefaultShapes } from '@runiq/core';
registerDefaultShapes(); // All shapes: 165 KB
