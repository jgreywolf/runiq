import { shapeRegistry } from '../registries.js';
import { actorShape } from './actor.js';
import { roundedShape } from './roundedRectangle.js';
import { rhombusShape } from './rhombus.js';
import { hexShape } from './hex.js';
import { docShape } from './document.js';
import { rectangleShape } from './rectangle.js';
import { stadiumShape } from './stadium.js';
import { circleShape } from './circle.js';
import { ellipseWideShape } from './ellipseWide.js';
import { systemBoundaryShape } from './systemBoundary.js';
import { triangleShape } from './triangle.js';
import { parallelogramShape } from './parallelogram.js';
import { trapezoidShape, flippedTrapezoidShape } from './trapezoid.js';
import { manualInputShape } from './manualInput.js';
import { delayShape } from './delay.js';
import { cylinderShape } from './cylinder.js';
import { displayShape } from './display.js';
import { leanLeftShape } from './leanLeft.js';
import { paperTapeShape } from './paperTape.js';
import { flippedTriangleShape } from './flippedTriangle.js';
import { framedRectangleShape } from './framedRectangle.js';
import { hourglassShape } from './hourglass.js';
import { multiRectangleShape } from './multiRectangle.js';
import { taggedRectangleShape } from './taggedRectangle.js';
import { linedRectangleShape } from './linedRectangle.js';
import { dividedRectangleShape } from './dividedRectangle.js';
import { notchedRectangleShape } from './notchedRectangle.js';
import { hCylinderShape } from './hCylinder.js';
import { diskStorageShape } from './diskStorage.js';
import { storedDataShape } from './storedData.js';
import { internalStorageShape } from './internalStorage.js';
import { notchedPentagonShape } from './notchedPentagon.js';
import { lightningBoltShape } from './lightningBolt.js';
import { forkJoinShape } from './forkJoin.js';
import { doubleCircleShape } from './doubleCircle.js';
import { smallCircleShape } from './smallCircle.js';
import { framedCircleShape } from './framedCircle.js';
import { crossCircleShape } from './crossCircle.js';
import { filledCircleShape } from './filledCircle.js';
import { linedDocumentShape } from './linedDocument.js';
import { multiDocumentShape } from './multiDocument.js';
import { taggedDocumentShape } from './taggedDocument.js';
import { textBlockShape } from './textBlock.js';
import { braceLeftShape } from './braceLeft.js';
import { braceRightShape } from './braceRight.js';
import { predefinedProcessShape } from './predefinedProcess.js';
import { decisionManualShape } from './decisionManual.js';
import { preparationAltShape } from './preparationAlt.js';
import { sequentialStorageShape } from './sequentialStorage.js';
import { directStorageShape } from './directStorage.js';
import { cardShape } from './card.js';
import { offPageConnectorShape } from './offPageConnector.js';
import { summingJunctionShape } from './summingJunction.js';
import { orShape } from './or.js';
import { cloudShape } from './cloud.js';
import { pieChart } from './charts/pieChart.js';
import { barChartVertical } from './charts/barChartVertical.js';
import { barChartHorizontal } from './charts/barChartHorizontal.js';
import { venn2Shape } from './venn2.js';
import { venn3Shape } from './venn3.js';
import { venn4Shape } from './venn4.js';
import { pyramidShape } from './pyramid.js';

// Block diagram shapes (control systems)
import { transferFunctionShape } from './transferFunction.js';
import { gainShape } from './gain.js';
import { integratorShape } from './integrator.js';
import { differentiatorShape } from './differentiator.js';
import { timeDelayShape } from './timeDelay.js';
import { saturationShape } from './saturation.js';
import { multiplyJunctionShape } from './multiplyJunction.js';
import { divideJunctionShape } from './divideJunction.js';
import { compareJunctionShape } from './compareJunction.js';

// Pedigree chart shapes
import {
  pedigreeMaleShape,
  pedigreeFemaleShape,
  pedigreeUnknownShape,
} from './pedigree.js';

// Network topology shapes
import {
  serverShape,
  routerShape,
  switchShape,
  firewallShape,
  loadBalancerShape,
  cloudShape as networkCloudShape,
  storageShape,
} from './networkTopology.js';

// Quantum circuit shapes
import {
  gateXShape,
  gateYShape,
  gateZShape,
  gateHShape,
  gateSShape,
  gateTShape,
  controlDotShape,
  cnotTargetShape,
  swapXShape,
  measurementShape,
  qubitWireShape,
  barrierShape,
} from './quantumCircuit.js';

// UML shapes
import { classShape } from './uml/class.js';

// C4 model shapes
import { c4Person, c4System, c4Container, c4Component } from './c4/index.js';

export function registerDefaultShapes(): void {
  // Original shapes
  shapeRegistry.register(actorShape);
  shapeRegistry.register(roundedShape);
  shapeRegistry.register(rhombusShape);
  shapeRegistry.register(hexShape);
  shapeRegistry.register(docShape);

  // Basic geometric shapes
  shapeRegistry.register(rectangleShape);
  shapeRegistry.register(stadiumShape);
  shapeRegistry.register(circleShape);
  shapeRegistry.register(ellipseWideShape);
  shapeRegistry.register(systemBoundaryShape);
  shapeRegistry.register(triangleShape);

  // Circle variants
  shapeRegistry.register(doubleCircleShape);
  shapeRegistry.register(smallCircleShape);
  shapeRegistry.register(framedCircleShape);
  shapeRegistry.register(crossCircleShape);
  shapeRegistry.register(filledCircleShape);

  // Document variants
  shapeRegistry.register(linedDocumentShape);
  shapeRegistry.register(multiDocumentShape);
  shapeRegistry.register(taggedDocumentShape);

  // Data I/O shapes
  shapeRegistry.register(parallelogramShape);
  shapeRegistry.register(leanLeftShape);
  shapeRegistry.register(displayShape);
  shapeRegistry.register(paperTapeShape);
  shapeRegistry.register(manualInputShape);
  shapeRegistry.register(cardShape);
  shapeRegistry.register(offPageConnectorShape);

  // Process shapes
  shapeRegistry.register(trapezoidShape);
  shapeRegistry.register(flippedTrapezoidShape);
  shapeRegistry.register(framedRectangleShape);
  shapeRegistry.register(multiRectangleShape);
  shapeRegistry.register(taggedRectangleShape);
  shapeRegistry.register(linedRectangleShape);
  shapeRegistry.register(dividedRectangleShape);
  shapeRegistry.register(notchedRectangleShape);
  shapeRegistry.register(predefinedProcessShape);
  shapeRegistry.register(decisionManualShape);
  shapeRegistry.register(preparationAltShape);

  // Storage shapes
  shapeRegistry.register(cylinderShape);
  shapeRegistry.register(hCylinderShape);
  shapeRegistry.register(diskStorageShape);
  shapeRegistry.register(storedDataShape);
  shapeRegistry.register(internalStorageShape);
  shapeRegistry.register(sequentialStorageShape);
  shapeRegistry.register(directStorageShape);

  // Specialized shapes
  shapeRegistry.register(delayShape);
  shapeRegistry.register(triangleShape);
  shapeRegistry.register(flippedTriangleShape);
  shapeRegistry.register(hourglassShape);
  shapeRegistry.register(notchedPentagonShape);
  shapeRegistry.register(lightningBoltShape);
  shapeRegistry.register(forkJoinShape);
  shapeRegistry.register(summingJunctionShape);
  shapeRegistry.register(orShape);
  shapeRegistry.register(cloudShape);

  // Annotation shapes
  shapeRegistry.register(textBlockShape);
  shapeRegistry.register(braceLeftShape);
  shapeRegistry.register(braceRightShape);

  // Data-driven charts
  shapeRegistry.register(pieChart);
  shapeRegistry.register(barChartVertical);
  shapeRegistry.register(barChartHorizontal);

  // Statistical/Set diagrams
  shapeRegistry.register(venn2Shape);
  shapeRegistry.register(venn3Shape);
  shapeRegistry.register(venn4Shape);

  // Hierarchical diagrams
  shapeRegistry.register(pyramidShape);

  // Block diagram shapes - control systems
  shapeRegistry.register(transferFunctionShape);
  shapeRegistry.register(gainShape);
  shapeRegistry.register(integratorShape);
  shapeRegistry.register(differentiatorShape);
  shapeRegistry.register(timeDelayShape);
  shapeRegistry.register(saturationShape);
  shapeRegistry.register(multiplyJunctionShape);
  shapeRegistry.register(divideJunctionShape);
  shapeRegistry.register(compareJunctionShape);

  // Pedigree chart shapes
  shapeRegistry.register(pedigreeMaleShape);
  shapeRegistry.register(pedigreeFemaleShape);
  shapeRegistry.register(pedigreeUnknownShape);

  // Network topology shapes
  shapeRegistry.register(serverShape);
  shapeRegistry.register(routerShape);
  shapeRegistry.register(switchShape);
  shapeRegistry.register(firewallShape);
  shapeRegistry.register(loadBalancerShape);
  shapeRegistry.register(networkCloudShape);
  shapeRegistry.register(storageShape);
  // Note: 'database' uses the existing cylinderShape

  // Quantum circuit shapes
  shapeRegistry.register(gateXShape);
  shapeRegistry.register(gateYShape);
  shapeRegistry.register(gateZShape);
  shapeRegistry.register(gateHShape);
  shapeRegistry.register(gateSShape);
  shapeRegistry.register(gateTShape);
  shapeRegistry.register(controlDotShape);
  shapeRegistry.register(cnotTargetShape);
  shapeRegistry.register(swapXShape);
  shapeRegistry.register(measurementShape);
  shapeRegistry.register(qubitWireShape);
  shapeRegistry.register(barrierShape);

  // UML shapes
  shapeRegistry.register(classShape);

  // C4 model shapes
  shapeRegistry.register(c4Person);
  shapeRegistry.register(c4System);
  shapeRegistry.register(c4Container);
  shapeRegistry.register(c4Component);
}

export * from './actor.js';
export * from './roundedRectangle.js';
export * from './rhombus.js';
export * from './hex.js';
export * from './document.js';
export * from './linedDocument.js';
export * from './multiDocument.js';
export * from './taggedDocument.js';
export * from './rectangle.js';
export * from './stadium.js';
export * from './circle.js';
export * from './ellipseWide.js';
export * from './systemBoundary.js';
export * from './doubleCircle.js';
export * from './smallCircle.js';
export * from './framedCircle.js';
export * from './crossCircle.js';
export * from './filledCircle.js';
export * from './display.js';
export * from './leanLeft.js';
export * from './paperTape.js';
export * from './flippedTriangle.js';
export * from './framedRectangle.js';
export * from './hourglass.js';
export * from './triangle.js';
export * from './multiRectangle.js';
export * from './taggedRectangle.js';
export * from './linedRectangle.js';
export * from './dividedRectangle.js';
export * from './notchedRectangle.js';
export * from './parallelogram.js';
export * from './trapezoid.js';
export * from './manualInput.js';
export * from './delay.js';
export * from './cylinder.js';
export * from './hCylinder.js';
export * from './diskStorage.js';
export * from './storedData.js';
export * from './internalStorage.js';
export * from './notchedPentagon.js';
export * from './lightningBolt.js';
export * from './forkJoin.js';
export * from './textBlock.js';
export * from './braceLeft.js';
export * from './braceRight.js';
export * from './predefinedProcess.js';
export * from './decisionManual.js';
export * from './preparationAlt.js';
export * from './sequentialStorage.js';
export * from './directStorage.js';
export * from './card.js';
export * from './offPageConnector.js';
export * from './summingJunction.js';
export * from './or.js';
export * from './cloud.js';
export * from './venn2.js';
export * from './venn3.js';
export * from './venn4.js';
export * from './pyramid.js';

// Block diagram shapes
export * from './transferFunction.js';
export * from './gain.js';
export * from './integrator.js';
export * from './differentiator.js';
export * from './timeDelay.js';
export * from './saturation.js';
export * from './multiplyJunction.js';
export * from './divideJunction.js';
export * from './compareJunction.js';

export * from './charts/pieChart.js';
export * from './charts/barChartVertical.js';
export * from './charts/barChartHorizontal.js';

// Pedigree charts
export * from './pedigree.js';

// Network topology
export {
  serverShape,
  routerShape,
  switchShape,
  firewallShape,
  loadBalancerShape,
  cloudShape as networkTopologyCloudShape,
  storageShape,
} from './networkTopology.js';

// Quantum circuits
export * from './quantumCircuit.js';

// C4 model
export * from './c4/index.js';
