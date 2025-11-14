import { shapeRegistry } from '../registries.js';
import type { ShapeDefinition } from '../types.js';
import { registerShapeAliases } from '../shape-aliases.js';

// Import from category folders
import * as basic from './basic/index.js';
import * as flowchart from './flowchart/index.js';
import * as storage from './storage/index.js';
import * as controlSystems from './control-systems/index.js';
import * as special from './special/index.js';
import * as rectVariants from './rect-variants/index.js';
import * as charts from './charts/index.js';
import * as network from './network/index.js';
import * as quantum from './quantum/index.js';
import * as uml from './uml/index.js';
import * as c4 from './c4/index.js';
import * as pedigree from './pedigree/index.js';
import * as bpmn from './bpmn/index.js';
import * as aws from './aws/index.js';
import * as erd from './erd/index.js';
import * as dataFlow from './data-flow/index.js';

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
  shapeRegistry.register(charts.pyramidShape);
  shapeRegistry.register(charts.invertedPyramidShape); // Inverted pyramid (funnel)
  shapeRegistry.register(charts.segmentedPyramidShape); // Pyramid with subdivided levels
  shapeRegistry.register(charts.pyramidListShape); // Pyramid with list items
  shapeRegistry.register(charts.vennShape); // Unified venn diagram
  shapeRegistry.register(charts.venn2Shape); // Legacy
  shapeRegistry.register(charts.venn3Shape); // Legacy
  shapeRegistry.register(charts.venn4Shape); // Legacy
  shapeRegistry.register(charts.sankeyChart);
  shapeRegistry.register(charts.sankeyNode);
  shapeRegistry.register(charts.processBoxShape); // SmartArt-style process box
  shapeRegistry.register(charts.cycleShape); // Circular cycle diagram
  shapeRegistry.register(charts.target); // Target/bullseye diagram (concentric circles)
  shapeRegistry.register(charts.balance); // Balance scale diagram
  shapeRegistry.register(charts.opposing); // Opposing forces diagram
  shapeRegistry.register(charts.converging); // Converging sources diagram
  shapeRegistry.register(charts.diverging); // Diverging branches diagram
  shapeRegistry.register(charts.cluster); // Cluster diagram (radial hub-and-spoke)
  shapeRegistry.register(charts.puzzle); // Puzzle pieces diagram
  shapeRegistry.register(charts.plusMinus); // Plus/minus diagram (pros vs cons)
  shapeRegistry.register(charts.matrix3x3); // 3x3 matrix (nine quadrants)
  shapeRegistry.register(charts.titledMatrix); // Matrix with headers
  shapeRegistry.register(charts.segmentedMatrix); // Segmented matrix
  shapeRegistry.register(charts.columnListShape); // Multi-column list
  shapeRegistry.register(charts.nestedListShape); // Nested/indented list
  shapeRegistry.register(charts.chevronListShape); // Chevron/arrow list
  shapeRegistry.register(charts.numberedChevronListShape); // Numbered chevron list
  shapeRegistry.register(charts.horizontalListShape); // Horizontal list
  shapeRegistry.register(charts.increasingListShape); // Increasing size list
  shapeRegistry.register(charts.alternatingListShape); // Alternating list (zigzag layout)
  shapeRegistry.register(charts.alternatingProcessShape); // Alternating process
  shapeRegistry.register(charts.stepProcessShape); // Step process
  shapeRegistry.register(charts.equationProcessShape); // Equation process
  shapeRegistry.register(charts.continuousBlockProcessShape); // Continuous block process
  shapeRegistry.register(charts.phasedProcessShape); // Phased process
  shapeRegistry.register(charts.detailedProcessShape); // Detailed process with substeps
  shapeRegistry.register(charts.groupedProcessShape); // Grouped parallel process
  shapeRegistry.register(charts.radialCycleShape); // Radial cycle with center hub
  shapeRegistry.register(charts.gearCycleShape); // Gear cycle (interlocking)
  shapeRegistry.register(charts.segmentedCycleShape); // Segmented cycle (pie chart style)
  shapeRegistry.register(charts.blockCycleShape); // Block cycle (rectangles in circle)
  shapeRegistry.register(charts.spiralCycleShape); // Spiral cycle (growth progression)
  shapeRegistry.register(charts.orbitCycleShape); // Orbit cycle (planetary style)
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

  // Register all common aliases
  registerShapeAliases();
}

// Re-export all shapes from category folders
export * from './basic/index.js';
export * from './flowchart/index.js';
export * from './storage/index.js';
export * from './control-systems/index.js';
export * from './special/index.js';
export * from './rect-variants/index.js';
export * from './charts/index.js';
export * from './network/index.js';
export * from './quantum/index.js';
export * from './uml/index.js';
export * from './pedigree/index.js';
export * from './c4/index.js';
export * from './bpmn/index.js';
export * from './aws/index.js';
export * from './erd/index.js';
export * from './data-flow/index.js';
