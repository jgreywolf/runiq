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
  shapeRegistry.registerAlias('desktop', 'workstation');
  shapeRegistry.registerAlias('workstation', 'workstation');
  shapeRegistry.registerAlias('wifi', 'accessPoint');
  shapeRegistry.registerAlias('wirelessAp', 'accessPoint');
  shapeRegistry.registerAlias('vpn', 'vpnGateway');
  shapeRegistry.registerAlias('modem', 'modem');

  // AWS Shapes
  shapeRegistry.registerAlias('s3', 'awsS3');
  shapeRegistry.registerAlias('lambda', 'awsLambda');
  shapeRegistry.registerAlias('rds', 'awsRds');
  shapeRegistry.registerAlias('vpc', 'awsVpc');
  shapeRegistry.registerAlias('ec2', 'awsEc2');
  shapeRegistry.registerAlias('cloudFront', 'awsCloudFront');
  shapeRegistry.registerAlias('cdn', 'awsCloudFront');
  shapeRegistry.registerAlias('dynamoDb', 'awsDynamoDb');
  shapeRegistry.registerAlias('sqs', 'awsSqs');
  shapeRegistry.registerAlias('cognito', 'awsCognito');

  // Azure Shapes
  shapeRegistry.registerAlias('azureVm', 'azureVm');
  shapeRegistry.registerAlias('vm', 'azureVm');
  shapeRegistry.registerAlias('blobStorage', 'azureBlobStorage');
  shapeRegistry.registerAlias('azureFunctions', 'azureFunctions');
  shapeRegistry.registerAlias('functions', 'azureFunctions');
  shapeRegistry.registerAlias('sqlDatabase', 'azureSqlDatabase');
  shapeRegistry.registerAlias('virtualNetwork', 'azureVirtualNetwork');
  shapeRegistry.registerAlias('vnet', 'azureVirtualNetwork');
  shapeRegistry.registerAlias('resourceGroup', 'azureResourceGroup');
  shapeRegistry.registerAlias('subscription', 'azureSubscription');
  shapeRegistry.registerAlias('apiManagement', 'azureApiManagement');
  shapeRegistry.registerAlias('azureCdn', 'azureCdn');
  shapeRegistry.registerAlias('cosmosDb', 'azureCosmosDb');
  shapeRegistry.registerAlias('serviceBus', 'azureServiceBus');
  shapeRegistry.registerAlias('entraId', 'azureEntraId');

  // Flowchart Shapes
  shapeRegistry.registerAlias('process', 'rectangle');
  shapeRegistry.registerAlias('terminator', 'stadium');
  shapeRegistry.registerAlias('start', 'stadium');
  shapeRegistry.registerAlias('end', 'stadium');
  shapeRegistry.registerAlias('input', 'parallelogram');
  shapeRegistry.registerAlias('output', 'parallelogram');
  shapeRegistry.registerAlias('io', 'parallelogram');
  shapeRegistry.registerAlias('doc', 'document');
  shapeRegistry.registerAlias('connector', 'onPageConnector');
  shapeRegistry.registerAlias('onPage', 'onPageConnector');
  shapeRegistry.registerAlias('manualOperation', 'manualOperation');
  shapeRegistry.registerAlias('manualOp', 'manualOperation');
  shapeRegistry.registerAlias('collate', 'collate');
  shapeRegistry.registerAlias('extract', 'extract');
  shapeRegistry.registerAlias('merge', 'merge');
  shapeRegistry.registerAlias('sort', 'sort');
  shapeRegistry.registerAlias('donut', 'ringChart');
  shapeRegistry.registerAlias('ring', 'ringChart');
  shapeRegistry.registerAlias('scatter', 'scatterChart');

  // Decorative Shapes
  shapeRegistry.registerAlias('callout', 'captionBox');
  shapeRegistry.registerAlias('calloutBox', 'captionBox');
  shapeRegistry.registerAlias('architectureLayer', 'architectureLayer');
  shapeRegistry.registerAlias('layer', 'architectureLayer');
  shapeRegistry.registerAlias('subsystem', 'subsystemBlock');
  shapeRegistry.registerAlias('subsystemBlock', 'subsystemBlock');
  shapeRegistry.registerAlias('platformBlock', 'platformBlock');
  shapeRegistry.registerAlias('externalBlock', 'externalSystemBlock');
  shapeRegistry.registerAlias('externalSystemBlock', 'externalSystemBlock');
  shapeRegistry.registerAlias('fileTree', 'fileTree');
  shapeRegistry.registerAlias('folder', 'folder');
  shapeRegistry.registerAlias('file', 'file');
  shapeRegistry.registerAlias('trustBoundary', 'trustBoundary');
  shapeRegistry.registerAlias('boundary', 'trustBoundary');
  shapeRegistry.registerAlias('threat', 'threat');
  shapeRegistry.registerAlias('mitigation', 'mitigation');
  shapeRegistry.registerAlias('securityControl', 'securityControl');
  shapeRegistry.registerAlias('control', 'securityControl');
  shapeRegistry.registerAlias('wbs', 'wbs');
  shapeRegistry.registerAlias('deliverable', 'wbsDeliverable');
  shapeRegistry.registerAlias('wbsDeliverable', 'wbsDeliverable');
  shapeRegistry.registerAlias('workPackage', 'wbsWorkPackage');
  shapeRegistry.registerAlias('wbsWorkPackage', 'wbsWorkPackage');

  // BPMN Shapes
  shapeRegistry.registerAlias('task', 'bpmnTask');
  shapeRegistry.registerAlias('subProcess', 'bpmnSubProcess');
  shapeRegistry.registerAlias('choreographyTask', 'bpmnChoreographyTask');
  shapeRegistry.registerAlias('gateway', 'bpmnGateway');
  shapeRegistry.registerAlias('xor', 'bpmnGateway');
  shapeRegistry.registerAlias('event', 'bpmnEvent');
  shapeRegistry.registerAlias('boundaryEvent', 'bpmnBoundaryEvent');
  shapeRegistry.registerAlias('message', 'bpmnMessage');
  shapeRegistry.registerAlias('pool', 'bpmnPool');
  shapeRegistry.registerAlias('dataObject', 'bpmnDataObject');
  shapeRegistry.registerAlias('dataStore', 'bpmnDataStore');
  shapeRegistry.registerAlias('dataInput', 'bpmnDataInput');
  shapeRegistry.registerAlias('dataOutput', 'bpmnDataOutput');

  // UML Shapes
  shapeRegistry.registerAlias('class', 'class');
  shapeRegistry.registerAlias('person', 'user'); // UML actor/user shape
  shapeRegistry.registerAlias('actor', 'user'); // Alias for sequence diagrams compatibility
  shapeRegistry.registerAlias('state', 'state');
  shapeRegistry.registerAlias('activity', 'activity');

  // C4 Shapes
  shapeRegistry.registerAlias('system', 'c4System');
  shapeRegistry.registerAlias('externalSystem', 'c4ExternalSystem');
  shapeRegistry.registerAlias('container', 'c4Container');
  shapeRegistry.registerAlias('containerInstance', 'c4ContainerInstance');
  shapeRegistry.registerAlias('component', 'c4Component');
  shapeRegistry.registerAlias('deploymentNode', 'c4DeploymentNode');
  shapeRegistry.registerAlias('systemInstance', 'c4SystemInstance');
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
