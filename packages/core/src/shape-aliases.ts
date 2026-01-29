import { shapeRegistry } from './registries.js';

/**
 * Common shape aliases for easier usage
 * Organized by category for maintainability
 */
export function registerShapeAliases() {
  // Basic Shapes
  shapeRegistry.registerAlias('rect', 'rectangle');
  shapeRegistry.registerAlias('box', 'rectangle');
  shapeRegistry.registerAlias('square', 'rectangle');
  shapeRegistry.registerAlias('rounded', 'roundedRectangle');
  shapeRegistry.registerAlias('circ', 'circle');
  shapeRegistry.registerAlias('diamond', 'rhombus');
  shapeRegistry.registerAlias('decision', 'rhombus');
  shapeRegistry.registerAlias('pill', 'stadium');

  // Storage Shapes
  shapeRegistry.registerAlias('db', 'cylinder');
  shapeRegistry.registerAlias('database', 'cylinder');
  shapeRegistry.registerAlias('data', 'cylinder');
  shapeRegistry.registerAlias('disk', 'diskStorage');
  shapeRegistry.registerAlias('hdd', 'diskStorage');

  // Network Shapes
  shapeRegistry.registerAlias('backend', 'server');
  shapeRegistry.registerAlias('api', 'server');
  shapeRegistry.registerAlias('browser', 'display');
  shapeRegistry.registerAlias('client', 'display');

  // AWS Shapes
  shapeRegistry.registerAlias('s3', 'awsS3');
  shapeRegistry.registerAlias('lambda', 'awsLambda');
  shapeRegistry.registerAlias('rds', 'awsRds');
  shapeRegistry.registerAlias('vpc', 'awsVpc');
  shapeRegistry.registerAlias('ec2', 'awsEc2');

  // Flowchart Shapes
  shapeRegistry.registerAlias('process', 'rectangle');
  shapeRegistry.registerAlias('terminator', 'stadium');
  shapeRegistry.registerAlias('start', 'stadium');
  shapeRegistry.registerAlias('end', 'stadium');
  shapeRegistry.registerAlias('input', 'parallelogram');
  shapeRegistry.registerAlias('output', 'parallelogram');
  shapeRegistry.registerAlias('io', 'parallelogram');
  shapeRegistry.registerAlias('doc', 'document');

  // Decorative Shapes
  shapeRegistry.registerAlias('callout', 'captionBox');
  shapeRegistry.registerAlias('calloutBox', 'captionBox');

  // BPMN Shapes
  shapeRegistry.registerAlias('task', 'bpmnTask');
  shapeRegistry.registerAlias('gateway', 'bpmnGateway');
  shapeRegistry.registerAlias('xor', 'bpmnGateway');
  shapeRegistry.registerAlias('event', 'bpmnEvent');
  shapeRegistry.registerAlias('message', 'bpmnMessage');
  shapeRegistry.registerAlias('pool', 'bpmnPool');

  // UML Shapes
  shapeRegistry.registerAlias('class', 'class');
  shapeRegistry.registerAlias('person', 'user'); // UML actor/user shape
  shapeRegistry.registerAlias('actor', 'user'); // Alias for sequence diagrams compatibility
  shapeRegistry.registerAlias('state', 'state');
  shapeRegistry.registerAlias('activity', 'activity');

  // C4 Shapes
  shapeRegistry.registerAlias('system', 'c4System');
  shapeRegistry.registerAlias('container', 'c4Container');
  shapeRegistry.registerAlias('component', 'c4Component');
}

/**
 * Get all aliases as a structured map for documentation
 */
export function getAliasMap(): Map<string, string[]> {
  const aliasMap = new Map<string, string[]>();

  for (const shape of shapeRegistry.list()) {
    const aliases = shapeRegistry.getAliases(shape.id);
    if (aliases.length > 0) {
      aliasMap.set(shape.id, aliases);
    }
  }

  return aliasMap;
}
