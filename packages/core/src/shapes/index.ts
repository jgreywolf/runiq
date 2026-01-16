import { shapeRegistry } from '../registries.js';
import { registerShapeAliases } from '../shape-aliases.js';

// Import from category folders
import * as aws from './aws/index.js';
import * as basic from './basic/index.js';
import * as bpmn from './bpmn/index.js';
import * as c4 from './c4/index.js';
import * as charts from './charts/index.js';
import * as controlSystems from './control-systems/index.js';
import * as dataFlow from './data-flow/index.js';
import * as erd from './erd/index.js';
import * as flowchart from './flowchart/index.js';
import * as glyphsets from './glyphsets/index.js';
import * as kinematic from './kinematic/index.js';
import * as network from './network/index.js';
import * as pedigree from './pedigree/index.js';
import * as quantum from './quantum/index.js';
import * as rectVariants from './rect-variants/index.js';
import * as special from './special/index.js';
import * as storage from './storage/index.js';
import * as uml from './uml/index.js';

// Selective registration functions for tree-shaking
export function registerBasicShapes(): void {
  shapeRegistry.register(basic.rectangleShape);
  shapeRegistry.register(basic.roundedRectangleShape);
  shapeRegistry.register(basic.circleShape);
  shapeRegistry.register(basic.smallCircleShape);
  shapeRegistry.register(basic.doubleCircleShape);
  shapeRegistry.register(basic.framedCircleShape);
  shapeRegistry.register(basic.crossCircleShape);
  shapeRegistry.register(basic.filledCircleShape);
  shapeRegistry.register(basic.ellipseWideShape);
  shapeRegistry.register(basic.rhombusShape);
  shapeRegistry.register(basic.hexShape);
  shapeRegistry.register(basic.stadiumShape);
  shapeRegistry.register(basic.triangleShape);
  shapeRegistry.register(basic.flippedTriangleShape);
  shapeRegistry.register(basic.parallelogramShape);
  shapeRegistry.register(basic.chevronShape);
  shapeRegistry.register(basic.trapezoidShape);
  shapeRegistry.register(basic.flippedTrapezoidShape);
  shapeRegistry.register(basic.starShape);
  shapeRegistry.register(basic.starFilledShape);
  shapeRegistry.register(basic.octagonShape);
  shapeRegistry.register(basic.plusShape);
}

export function registerFlowchartShapes(): void {
  shapeRegistry.register(flowchart.documentShape);
  shapeRegistry.register(flowchart.linedDocumentShape);
  shapeRegistry.register(flowchart.multiDocumentShape);
  shapeRegistry.register(flowchart.taggedDocumentShape);
  shapeRegistry.register(flowchart.predefinedProcessShape);
  shapeRegistry.register(flowchart.preparationAltShape);
  shapeRegistry.register(flowchart.manualInputShape);
  shapeRegistry.register(flowchart.decisionManualShape);
  shapeRegistry.register(flowchart.delayShape);
  shapeRegistry.register(flowchart.displayShape);
  shapeRegistry.register(flowchart.offPageConnectorShape);
  shapeRegistry.register(flowchart.cardShape);
  shapeRegistry.register(flowchart.paperTapeShape);
  shapeRegistry.register(flowchart.leanLeftShape);
}

export function registerStorageShapes(): void {
  shapeRegistry.register(storage.cylinderShape);
  shapeRegistry.register(storage.hCylinderShape);
  shapeRegistry.register(storage.diskStorageShape);
  shapeRegistry.register(storage.storedDataShape);
  shapeRegistry.register(storage.internalStorageShape);
  shapeRegistry.register(storage.sequentialStorageShape);
  shapeRegistry.register(storage.directStorageShape);
}

export function registerRectVariantShapes(): void {
  shapeRegistry.register(rectVariants.framedRectangleShape);
  shapeRegistry.register(rectVariants.multiRectangleShape);
  shapeRegistry.register(rectVariants.linedRectangleShape);
  shapeRegistry.register(rectVariants.dividedRectangleShape);
  shapeRegistry.register(rectVariants.taggedRectangleShape);
  shapeRegistry.register(rectVariants.notchedRectangleShape);
  shapeRegistry.register(rectVariants.notchedPentagonShape);
}

export function registerControlSystemShapes(): void {
  shapeRegistry.register(controlSystems.transferFunctionShape);
  shapeRegistry.register(controlSystems.gainShape);
  shapeRegistry.register(controlSystems.integratorShape);
  shapeRegistry.register(controlSystems.differentiatorShape);
  shapeRegistry.register(controlSystems.timeDelayShape);
  shapeRegistry.register(controlSystems.saturationShape);
  shapeRegistry.register(controlSystems.summingJunctionShape);
  shapeRegistry.register(controlSystems.multiplyJunctionShape);
  shapeRegistry.register(controlSystems.divideJunctionShape);
  shapeRegistry.register(controlSystems.compareJunctionShape);
}

export function registerSpecialShapes(): void {
  shapeRegistry.register(special.textBlockShape);
  shapeRegistry.register(special.braceLeftShape);
  shapeRegistry.register(special.braceRightShape);
  shapeRegistry.register(special.lightningBoltShape);
  shapeRegistry.register(special.hourglassShape);
  shapeRegistry.register(special.forkJoinShape);
  shapeRegistry.register(special.orShape);
}

export function registerChartShapes(): void {
  shapeRegistry.register(charts.pieChart);
  shapeRegistry.register(charts.barChart);
  shapeRegistry.register(charts.lineChart);
  shapeRegistry.register(charts.radarChart);
  shapeRegistry.register(charts.vennShape); // Unified venn diagram
  shapeRegistry.register(charts.sankeyChart);
  shapeRegistry.register(charts.sankeyNode);
}

export function registerGlyphsets(): void {
  shapeRegistry.register(glyphsets.pyramidShape);
  shapeRegistry.register(glyphsets.invertedPyramidShape); // Inverted pyramid (funnel)
  shapeRegistry.register(glyphsets.segmentedPyramidShape); // Pyramid with subdivided levels
  shapeRegistry.register(glyphsets.pyramidListShape); // Pyramid with list items
  shapeRegistry.register(glyphsets.processBoxShape); // SmartArt-style process box
  shapeRegistry.register(glyphsets.cycleShape); // Circular cycle diagram
  shapeRegistry.register(glyphsets.target); // Target/bullseye diagram (concentric circles)
  shapeRegistry.register(glyphsets.balance); // Balance scale diagram
  shapeRegistry.register(glyphsets.opposing); // Opposing forces diagram
  shapeRegistry.register(glyphsets.converging); // Converging sources diagram
  shapeRegistry.register(glyphsets.diverging); // Diverging branches diagram
  shapeRegistry.register(glyphsets.cluster); // Cluster diagram (radial hub-and-spoke)
  shapeRegistry.register(glyphsets.puzzle); // Puzzle pieces diagram
  shapeRegistry.register(glyphsets.plusMinus); // Plus/minus diagram (pros vs cons)
  shapeRegistry.register(glyphsets.matrix); // 2x2 matrix (four quadrants)
  shapeRegistry.register(glyphsets.matrix3x3); // 3x3 matrix (nine quadrants)
  shapeRegistry.register(glyphsets.titledMatrix); // Matrix with headers
  shapeRegistry.register(glyphsets.segmentedMatrix); // Segmented matrix
  shapeRegistry.register(glyphsets.columnListShape); // Multi-column list
  shapeRegistry.register(glyphsets.nestedListShape); // Nested/indented list
  shapeRegistry.register(glyphsets.chevronListShape); // Chevron/arrow list
  shapeRegistry.register(glyphsets.numberedChevronListShape); // Numbered chevron list
  shapeRegistry.register(glyphsets.horizontalListShape); // Horizontal list
  shapeRegistry.register(glyphsets.increasingListShape); // Increasing size list
  shapeRegistry.register(glyphsets.alternatingListShape); // Alternating list (zigzag layout)
  shapeRegistry.register(glyphsets.pictureListShape); // Picture list with images
  shapeRegistry.register(glyphsets.pictureGridShape); // Picture grid with square cells
  shapeRegistry.register(glyphsets.pictureProcessShape); // Picture process with step images
  shapeRegistry.register(glyphsets.pictureCalloutShape); // Picture with callout annotations
  shapeRegistry.register(glyphsets.pictureBlocksShape); // Alternating picture blocks
  shapeRegistry.register(glyphsets.framedPictureShape); // Pictures with decorative frames
  shapeRegistry.register(glyphsets.alternatingProcessShape); // Alternating process
  shapeRegistry.register(glyphsets.stepProcessShape); // Step process
  shapeRegistry.register(glyphsets.equationProcessShape); // Equation process
  shapeRegistry.register(glyphsets.continuousBlockProcessShape); // Continuous block process
  shapeRegistry.register(glyphsets.phasedProcessShape); // Phased process
  shapeRegistry.register(glyphsets.detailedProcessShape); // Detailed process with substeps
  shapeRegistry.register(glyphsets.groupedProcessShape); // Grouped parallel process
  shapeRegistry.register(glyphsets.radialCycleShape); // Radial cycle with center hub
  shapeRegistry.register(glyphsets.gearCycleShape); // Gear cycle (interlocking)
  shapeRegistry.register(glyphsets.segmentedCycleShape); // Segmented cycle (pie chart style)
  shapeRegistry.register(glyphsets.blockCycleShape); // Block cycle (rectangles in circle)
  shapeRegistry.register(glyphsets.spiralCycleShape); // Spiral cycle (growth progression)
  shapeRegistry.register(glyphsets.orbitCycleShape); // Orbit cycle (planetary style)
  shapeRegistry.register(glyphsets.steppedVenn); // Stepped Venn (3D stacked circles)
  shapeRegistry.register(glyphsets.linearVenn); // Linear Venn (horizontal overlap)
  shapeRegistry.register(glyphsets.counterBalance); // Counterbalance (tilted scale)
  shapeRegistry.register(glyphsets.equation); // Equation (A + B = C)
  shapeRegistry.register(glyphsets.interconnected); // Interconnected (mesh network)
  shapeRegistry.register(glyphsets.hub); // Hub (radial hub-and-spoke)
  shapeRegistry.register(glyphsets.circleHierarchy); // Circle Hierarchy (concentric circles)
  shapeRegistry.register(glyphsets.labeledHierarchy); // Labeled Hierarchy (tree with edge labels)
  shapeRegistry.register(glyphsets.tableHierarchy); // Table Hierarchy (tabular rows)
  shapeRegistry.register(glyphsets.teamHierarchy); // Team Hierarchy (team containers)
  shapeRegistry.register(glyphsets.orgChart); // Organization Chart (vertical tree)
  shapeRegistry.register(glyphsets.horizontalOrgChart); // Horizontal Org Chart (left-to-right)
  shapeRegistry.register(glyphsets.matrixOrgChart); // Matrix Org Chart (dual reporting)
}

export function registerKinematicShapes(): void {
  shapeRegistry.register(kinematic.revoluteJointShape);
  shapeRegistry.register(kinematic.fixedJointShape);
  shapeRegistry.register(kinematic.prismaticJointShape);
  shapeRegistry.register(kinematic.sphericalJointShape);
  shapeRegistry.register(kinematic.universalJointShape);
  shapeRegistry.register(kinematic.cylindricalJointShape);
  shapeRegistry.register(kinematic.planarJointShape);
  shapeRegistry.register(kinematic.binaryLinkShape);
  shapeRegistry.register(kinematic.ternaryLinkShape);
  shapeRegistry.register(kinematic.quaternaryLinkShape);
  shapeRegistry.register(kinematic.groundLinkShape);
  shapeRegistry.register(kinematic.rotaryMotorShape);
  shapeRegistry.register(kinematic.linearActuatorShape);
  shapeRegistry.register(kinematic.springShape);
  shapeRegistry.register(kinematic.damperShape);
  shapeRegistry.register(kinematic.gearShape);
}

export function registerNetworkShapes(): void {
  shapeRegistry.register(network.serverShape);
  shapeRegistry.register(network.routerShape);
  shapeRegistry.register(network.switchShape);
  shapeRegistry.register(network.firewallShape);
  shapeRegistry.register(network.loadBalancerShape);
  shapeRegistry.register(network.cloudShape);
  shapeRegistry.register(network.storageShape);
}

export function registerQuantumShapes(): void {
  shapeRegistry.register(quantum.gateXShape);
  shapeRegistry.register(quantum.gateYShape);
  shapeRegistry.register(quantum.gateZShape);
  shapeRegistry.register(quantum.gateHShape);
  shapeRegistry.register(quantum.gateSShape);
  shapeRegistry.register(quantum.gateTShape);
  shapeRegistry.register(quantum.controlDotShape);
  shapeRegistry.register(quantum.cnotTargetShape);
  shapeRegistry.register(quantum.swapXShape);
  shapeRegistry.register(quantum.measurementShape);
  shapeRegistry.register(quantum.qubitWireShape);
  shapeRegistry.register(quantum.barrierShape);
}

export function registerUMLShapes(): void {
  shapeRegistry.register(uml.classShape);
  shapeRegistry.register(uml.actorShape);
  shapeRegistry.register(uml.systemBoundaryShape);
  shapeRegistry.register(uml.interfaceShape);
  shapeRegistry.register(uml.abstractShape);
  shapeRegistry.register(uml.enumShape);
  shapeRegistry.register(uml.packageShape);
  shapeRegistry.register(uml.noteShape);
  shapeRegistry.register(uml.lifelineShape);
  shapeRegistry.register(uml.activationShape);
  shapeRegistry.register(uml.fragmentShape);
  shapeRegistry.register(uml.deletionShape);
  shapeRegistry.register(uml.continuationShape);
  shapeRegistry.register(uml.timeObservationShape);
  shapeRegistry.register(uml.stateShape);
  shapeRegistry.register(uml.initialStateShape);
  shapeRegistry.register(uml.finalStateShape);
  shapeRegistry.register(uml.choiceShape);
  shapeRegistry.register(uml.forkShape);
  shapeRegistry.register(uml.joinShape);
  shapeRegistry.register(uml.activityShape);
  // Activity diagram object nodes
  shapeRegistry.register(uml.objectNodeShape);
  shapeRegistry.register(uml.centralBufferShape);
  shapeRegistry.register(uml.dataStoreShape);
  // Activity diagram final nodes
  shapeRegistry.register(uml.activityFinalShape);
  shapeRegistry.register(uml.flowFinalShape);
  // Activity diagram swimlanes/partitions
  shapeRegistry.register(uml.swimlaneShape);
  // Activity diagram signal actions
  shapeRegistry.register(uml.sendSignalShape);
  shapeRegistry.register(uml.receiveSignalShape);
  shapeRegistry.register(uml.acceptEventShape);
  shapeRegistry.register(uml.componentShape);
  shapeRegistry.register(uml.artifactShape);
  shapeRegistry.register(uml.nodeShape);
  // Component diagram additions
  shapeRegistry.register(uml.portShape);
  shapeRegistry.register(uml.moduleShape);
  shapeRegistry.register(uml.templateShape);
  shapeRegistry.register(uml.historyShape);
  shapeRegistry.register(uml.pinShape);
  shapeRegistry.register(uml.assemblyShape);
  shapeRegistry.register(uml.providedInterfaceShape);
  shapeRegistry.register(uml.requiredInterfaceShape);
  shapeRegistry.register(uml.frameShape);
  shapeRegistry.register(uml.collaborationShape);
  shapeRegistry.register(uml.submachineShape);
  shapeRegistry.register(uml.loopShape);
  shapeRegistry.register(uml.verticalForkShape);
  // State machine pseudo-states
  shapeRegistry.register(uml.historyShallowShape);
  shapeRegistry.register(uml.historyDeepShape);
  shapeRegistry.register(uml.junctionShape);
  shapeRegistry.register(uml.entryPointShape);
  shapeRegistry.register(uml.exitPointShape);
  shapeRegistry.register(uml.terminateShape);
}

export function registerPedigreeShapes(): void {
  shapeRegistry.register(pedigree.pedigreeMaleShape);
  shapeRegistry.register(pedigree.pedigreeFemaleShape);
  shapeRegistry.register(pedigree.pedigreeUnknownShape);
}

export function registerC4Shapes(): void {
  shapeRegistry.register(c4.c4Person);
  shapeRegistry.register(c4.c4System);
  shapeRegistry.register(c4.c4Container);
  shapeRegistry.register(c4.c4Component);
}

export function registerBPMNShapes(): void {
  shapeRegistry.register(bpmn.bpmnTaskShape);
  shapeRegistry.register(bpmn.bpmnEventShape);
  shapeRegistry.register(bpmn.bpmnGatewayShape);
  shapeRegistry.register(bpmn.bpmnDataObjectShape);
  shapeRegistry.register(bpmn.bpmnMessageShape);
  shapeRegistry.register(bpmn.bpmnPoolShape);
}

export function registerAWSShapes(): void {
  shapeRegistry.register(aws.awsEc2Shape);
  shapeRegistry.register(aws.awsS3Shape);
  shapeRegistry.register(aws.awsLambdaShape);
  shapeRegistry.register(aws.awsRdsShape);
  shapeRegistry.register(aws.awsVpcShape);
  shapeRegistry.register(aws.awsApiGatewayShape);
}

export function registerERDShapes(): void {
  shapeRegistry.register(erd.erdEntityShape);
  shapeRegistry.register(erd.erdWeakEntityShape);
  shapeRegistry.register(erd.erdRelationshipShape);
  shapeRegistry.register(erd.erdAttributeShape);
  shapeRegistry.register(erd.erdKeyAttributeShape);
  shapeRegistry.register(erd.erdMultivaluedAttributeShape);
}

export function registerDataFlowShapes(): void {
  shapeRegistry.register(dataFlow.externalEntityShape);
  shapeRegistry.register(dataFlow.externalEntityCornerShape);
  shapeRegistry.register(dataFlow.processCircleShape);
  shapeRegistry.register(dataFlow.dataStoreLineShape);
  shapeRegistry.register(dataFlow.dataStoreLeftShape);
  shapeRegistry.register(dataFlow.dataStoreOpenShape);
}

/**
 * Register all default shapes at once.
 * This is the legacy API and includes all shapes (larger bundle).
 * For smaller bundles, use selective registration functions above.
 */
export function registerDefaultShapes(): void {
  registerBasicShapes();
  registerFlowchartShapes();
  registerStorageShapes();
  registerRectVariantShapes();
  registerControlSystemShapes();
  registerSpecialShapes();
  registerChartShapes();
  registerNetworkShapes();
  registerQuantumShapes();
  registerUMLShapes();
  registerPedigreeShapes();
  registerC4Shapes();
  registerBPMNShapes();
  registerAWSShapes();
  registerERDShapes();
  registerDataFlowShapes();
  registerGlyphsets();
  registerKinematicShapes();

  // Register all common aliases
  registerShapeAliases();
}

// Re-export all shapes from category folders
export * from './aws/index.js';
export * from './basic/index.js';
export * from './bpmn/index.js';
export * from './c4/index.js';
export * from './charts/index.js';
export * from './control-systems/index.js';
export * from './data-flow/index.js';
export * from './erd/index.js';
export * from './flowchart/index.js';
export * from './kinematic/index.js';
export * from './network/index.js';
export * from './pedigree/index.js';
export * from './quantum/index.js';
export * from './rect-variants/index.js';
export * from './special/index.js';
export * from './storage/index.js';
export * from './uml/index.js';
