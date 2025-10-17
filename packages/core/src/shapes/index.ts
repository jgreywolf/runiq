import { shapeRegistry } from '../registries.js';
import { actorShape } from './actor.js';
import { roundedShape } from './rounded.js';
import { rhombusShape } from './rhombus.js';
import { hexShape } from './hex.js';
import { docShape } from './doc.js';
import { rectangleShape } from './rectangle.js';
import { stadiumShape } from './stadium.js';
import { circleShape } from './circle.js';
import { ellipseWideShape } from './ellipse-wide.js';
import { systemBoundaryShape } from './system-boundary.js';
import { triangleShape } from './triangle.js';
import { parallelogramShape } from './parallelogram.js';
import { trapezoidShape, flippedTrapezoidShape } from './trapezoid.js';
import { manualInputShape } from './manual-input.js';
import { delayShape } from './delay.js';
import { cylinderShape } from './cylinder.js';
import { displayShape } from './display.js';
import { leanLeftShape } from './lean-left.js';
import { paperTapeShape } from './paper-tape.js';
import { flippedTriangleShape } from './flipped-triangle.js';
import { framedRectangleShape } from './framed-rectangle.js';
import { hourglassShape } from './hourglass.js';
import { multiRectangleShape } from './multi-rectangle.js';
import { taggedRectangleShape } from './tagged-rectangle.js';
import { linedRectangleShape } from './lined-rectangle.js';
import { dividedRectangleShape } from './divided-rectangle.js';
import { notchedRectangleShape } from './notched-rectangle.js';
import { hCylinderShape } from './h-cylinder.js';
import { diskStorageShape } from './disk-storage.js';
import { storedDataShape } from './stored-data.js';
import { internalStorageShape } from './internal-storage.js';
import { notchedPentagonShape } from './notched-pentagon.js';
import { lightningBoltShape } from './lightning-bolt.js';
import { forkJoinShape } from './fork-join.js';
import { doubleCircleShape } from './double-circle.js';
import { smallCircleShape } from './small-circle.js';
import { framedCircleShape } from './framed-circle.js';
import { crossCircleShape } from './cross-circle.js';
import { filledCircleShape } from './filled-circle.js';
import { linedDocumentShape } from './lined-document.js';
import { multiDocumentShape } from './multi-document.js';
import { taggedDocumentShape } from './tagged-document.js';
import { textBlockShape } from './text-block.js';
import { braceLeftShape } from './brace-left.js';
import { braceRightShape } from './brace-right.js';
import { predefinedProcessShape } from './predefined-process.js';
import { decisionManualShape } from './decision-manual.js';
import { preparationAltShape } from './preparation-alt.js';
import { sequentialStorageShape } from './sequential-storage.js';
import { directStorageShape } from './direct-storage.js';
import { cardShape } from './card.js';
import { offPageConnectorShape } from './off-page-connector.js';
import { summingJunctionShape } from './summing-junction.js';
import { orShape } from './or.js';
import { cloudShape } from './cloud.js';
import { pieChart } from './charts/pie.js';
import { barChartVertical } from './charts/bar-chart-vertical.js';
import { barChartHorizontal } from './charts/bar-chart-horizontal.js';
import { venn2Shape } from './venn-2.js';
import { venn3Shape } from './venn-3.js';
import { venn4Shape } from './venn-4.js';
import { pyramidShape } from './pyramid.js';

// Block diagram shapes (control systems)
import { transferFunctionShape } from './transfer-function.js';
import { gainShape } from './gain.js';
import { integratorShape } from './integrator.js';
import { differentiatorShape } from './differentiator.js';
import { timeDelayShape } from './time-delay.js';
import { saturationShape } from './saturation.js';
import { multiplyJunctionShape } from './multiply-junction.js';
import { divideJunctionShape } from './divide-junction.js';
import { compareJunctionShape } from './compare-junction.js';

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

  // Block diagram shapes (control systems)
  shapeRegistry.register(transferFunctionShape);
  shapeRegistry.register(gainShape);
  shapeRegistry.register(integratorShape);
  shapeRegistry.register(differentiatorShape);
  shapeRegistry.register(timeDelayShape);
  shapeRegistry.register(saturationShape);
  shapeRegistry.register(multiplyJunctionShape);
  shapeRegistry.register(divideJunctionShape);
  shapeRegistry.register(compareJunctionShape);
}

export * from './actor.js';
export * from './rounded.js';
export * from './rhombus.js';
export * from './hex.js';
export * from './doc.js';
export * from './lined-document.js';
export * from './multi-document.js';
export * from './tagged-document.js';
export * from './rectangle.js';
export * from './stadium.js';
export * from './circle.js';
export * from './ellipse-wide.js';
export * from './system-boundary.js';
export * from './double-circle.js';
export * from './small-circle.js';
export * from './framed-circle.js';
export * from './cross-circle.js';
export * from './filled-circle.js';
export * from './display.js';
export * from './lean-left.js';
export * from './paper-tape.js';
export * from './flipped-triangle.js';
export * from './framed-rectangle.js';
export * from './hourglass.js';
export * from './triangle.js';
export * from './multi-rectangle.js';
export * from './tagged-rectangle.js';
export * from './lined-rectangle.js';
export * from './divided-rectangle.js';
export * from './notched-rectangle.js';
export * from './parallelogram.js';
export * from './trapezoid.js';
export * from './manual-input.js';
export * from './delay.js';
export * from './cylinder.js';
export * from './h-cylinder.js';
export * from './disk-storage.js';
export * from './stored-data.js';
export * from './internal-storage.js';
export * from './notched-pentagon.js';
export * from './lightning-bolt.js';
export * from './fork-join.js';
export * from './text-block.js';
export * from './brace-left.js';
export * from './brace-right.js';
export * from './predefined-process.js';
export * from './decision-manual.js';
export * from './preparation-alt.js';
export * from './sequential-storage.js';
export * from './direct-storage.js';
export * from './card.js';
export * from './off-page-connector.js';
export * from './summing-junction.js';
export * from './or.js';
export * from './cloud.js';
export * from './venn-2.js';
export * from './venn-3.js';
export * from './venn-4.js';
export * from './pyramid.js';

// Block diagram shapes
export * from './transfer-function.js';
export * from './gain.js';
export * from './integrator.js';
export * from './differentiator.js';
export * from './time-delay.js';
export * from './saturation.js';
export * from './multiply-junction.js';
export * from './divide-junction.js';
export * from './compare-junction.js';

export * from './charts/pie.js';
export * from './charts/bar-chart-vertical.js';
export * from './charts/bar-chart-horizontal.js';
