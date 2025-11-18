/**
 * @runiq/glyphsets
 *
 * Pre-built diagram patterns (GlyphSets) for Runiq - SmartArt-style templates
 */

// Export types
export type {
  GlyphSetDefinition,
  GlyphSetParameter,
  GlyphSetGenerator,
  GlyphSetCategory,
} from './types.js';

export { GlyphSetError } from './types.js';

// Export registry
export { GlyphSetRegistry, glyphsetRegistry } from './registry.js';

// Export image utilities
export type { ImageItem, RenderImageOptions } from './utils/image.js';
export {
  isValidImageUrl,
  getImageUrl,
  renderImage,
  renderCircularClipPath,
  renderRoundedRectClipPath,
  validateImageItem,
  PLACEHOLDER_IMAGE,
} from './utils/image.js';

// Import glyphsets
import { basicProcessGlyphSet } from './process/basicProcess.js';
import { cycleGlyphSet } from './process/cycle.js';
import { alternatingProcessGlyphSet } from './process/alternatingProcess.js';
import { stepProcessGlyphSet } from './process/stepProcess.js';
import { equationProcessGlyphSet } from './process/equationProcess.js';
import { continuousBlockProcessGlyphSet } from './process/continuousBlockProcess.js';
import { phasedProcessGlyphSet } from './process/phasedProcess.js';
import { detailedProcessGlyphSet } from './process/detailedProcess.js';
import { groupedProcessGlyphSet } from './process/groupedProcess.js';
import { pictureProcessGlyphSet } from './process/pictureProcess.js';
import { radialCycleGlyphSet } from './process/radialCycle.js';
import { gearCycleGlyphSet } from './process/gearCycle.js';
import { segmentedCycleGlyphSet } from './process/segmentedCycle.js';
import { blockCycleGlyphSet } from './process/blockCycle.js';
import { spiralCycleGlyphSet } from './process/spiralCycle.js';
import { orbitCycleGlyphSet } from './process/orbitCycle.js';
import { pyramidGlyphSet } from './hierarchy/pyramid.js';
import { invertedPyramidGlyphSet } from './hierarchy/invertedPyramid.js';
import { segmentedPyramidGlyphSet } from './hierarchy/segmentedPyramid.js';
import { pyramidListGlyphSet } from './hierarchy/pyramidList.js';
import { orgChartGlyphSet } from './hierarchy/orgChart.js';
import { horizontalOrgChartGlyphSet } from './hierarchy/horizontalOrgChart.js';
import { matrixOrgChartGlyphSet } from './hierarchy/matrixOrgChart.js';
import { matrixGlyphSet } from './comparison/matrix.js';
import { vennGlyphSet } from './comparison/venn.js';
import { matrix3x3GlyphSet } from './comparison/matrix3x3.js';
import { titledMatrixGlyphSet } from './comparison/titledMatrix.js';
import { segmentedMatrixGlyphSet } from './comparison/segmentedMatrix.js';
import { funnelGlyphSet } from './visualization/funnel.js';
import { pictureGridGlyphSet } from './visualization/pictureGrid.js';
import { pictureCalloutGlyphSet } from './visualization/pictureCallout.js';
import { eventsGlyphSet } from './visualization/events.js';
import { basicListGlyphSet } from './list/basicList.js';
import { horizontalListGlyphSet } from './list/horizontalList.js';
import { chevronListGlyphSet } from './list/chevronList.js';
import { numberedChevronListGlyphSet } from './list/numberedChevronList.js';
import { nestedListGlyphSet } from './list/nestedList.js';
import { columnListGlyphSet } from './list/columnList.js';
import { increasingListGlyphSet } from './list/increasingList.js';
import { alternatingListGlyphSet } from './list/alternatingList.js';
import { pictureListGlyphSet } from './list/pictureList.js';
import { pictureBlocksGlyphSet } from './list/pictureBlocks.js';
import { framedPictureGlyphSet } from './list/framedPicture.js';
import { targetGlyphSet } from './relationship/target.js';
import { balanceGlyphSet } from './relationship/balance.js';
import { opposingGlyphSet } from './relationship/opposing.js';
import { convergingGlyphSet } from './relationship/converging.js';
import { divergingGlyphSet } from './relationship/diverging.js';
import { clusterGlyphSet } from './relationship/cluster.js';
import { puzzleGlyphSet } from './relationship/puzzle.js';
import { plusMinusGlyphSet } from './relationship/plusMinus.js';
import { counterbalanceGlyphSet } from './relationship/counterbalance.js';
import { equationGlyphSet } from './relationship/equation.js';
import { interconnectedGlyphSet } from './relationship/interconnected.js';
import { hubGlyphSet } from './relationship/hub.js';
import { steppedVennGlyphSet } from './comparison/steppedVenn.js';
import { linearVennGlyphSet } from './comparison/linearVenn.js';
import { circleHierarchyGlyphSet } from './hierarchy/circleHierarchy.js';
import { labeledHierarchyGlyphSet } from './hierarchy/labeledHierarchy.js';
import { tableHierarchyGlyphSet } from './hierarchy/tableHierarchy.js';
import { teamHierarchyGlyphSet } from './hierarchy/teamHierarchy.js';

// Auto-register built-in glyphsets
import { glyphsetRegistry } from './registry.js';

// Process glyphsets
glyphsetRegistry.register(basicProcessGlyphSet);
glyphsetRegistry.register(cycleGlyphSet);
glyphsetRegistry.register(alternatingProcessGlyphSet);
glyphsetRegistry.register(stepProcessGlyphSet);
glyphsetRegistry.register(equationProcessGlyphSet);
glyphsetRegistry.register(continuousBlockProcessGlyphSet);
glyphsetRegistry.register(phasedProcessGlyphSet);
glyphsetRegistry.register(detailedProcessGlyphSet);
glyphsetRegistry.register(groupedProcessGlyphSet);
glyphsetRegistry.register(pictureProcessGlyphSet);
glyphsetRegistry.register(radialCycleGlyphSet);
glyphsetRegistry.register(gearCycleGlyphSet);
glyphsetRegistry.register(segmentedCycleGlyphSet);
glyphsetRegistry.register(blockCycleGlyphSet);
glyphsetRegistry.register(spiralCycleGlyphSet);
glyphsetRegistry.register(orbitCycleGlyphSet);

// Hierarchy glyphsets
glyphsetRegistry.register(pyramidGlyphSet);
glyphsetRegistry.register(invertedPyramidGlyphSet);
glyphsetRegistry.register(segmentedPyramidGlyphSet);
glyphsetRegistry.register(pyramidListGlyphSet);
glyphsetRegistry.register(orgChartGlyphSet);
glyphsetRegistry.register(horizontalOrgChartGlyphSet);
glyphsetRegistry.register(matrixOrgChartGlyphSet);
glyphsetRegistry.register(circleHierarchyGlyphSet);
glyphsetRegistry.register(labeledHierarchyGlyphSet);
glyphsetRegistry.register(tableHierarchyGlyphSet);
glyphsetRegistry.register(teamHierarchyGlyphSet);

// Comparison glyphsets
glyphsetRegistry.register(matrixGlyphSet);
glyphsetRegistry.register(vennGlyphSet);
glyphsetRegistry.register(matrix3x3GlyphSet);
glyphsetRegistry.register(titledMatrixGlyphSet);
glyphsetRegistry.register(segmentedMatrixGlyphSet);
glyphsetRegistry.register(steppedVennGlyphSet);
glyphsetRegistry.register(linearVennGlyphSet);

// Relationship glyphsets
glyphsetRegistry.register(targetGlyphSet);
glyphsetRegistry.register(balanceGlyphSet);
glyphsetRegistry.register(opposingGlyphSet);
glyphsetRegistry.register(convergingGlyphSet);
glyphsetRegistry.register(divergingGlyphSet);
glyphsetRegistry.register(clusterGlyphSet);
glyphsetRegistry.register(puzzleGlyphSet);
glyphsetRegistry.register(plusMinusGlyphSet);
glyphsetRegistry.register(counterbalanceGlyphSet);
glyphsetRegistry.register(equationGlyphSet);
glyphsetRegistry.register(interconnectedGlyphSet);
glyphsetRegistry.register(hubGlyphSet);

// Visualization glyphsets
glyphsetRegistry.register(funnelGlyphSet);
glyphsetRegistry.register(pictureGridGlyphSet);
glyphsetRegistry.register(pictureCalloutGlyphSet);
glyphsetRegistry.register(eventsGlyphSet);

// List glyphsets
glyphsetRegistry.register(basicListGlyphSet);
glyphsetRegistry.register(horizontalListGlyphSet);
glyphsetRegistry.register(chevronListGlyphSet);
glyphsetRegistry.register(numberedChevronListGlyphSet);
glyphsetRegistry.register(nestedListGlyphSet);
glyphsetRegistry.register(columnListGlyphSet);
glyphsetRegistry.register(increasingListGlyphSet);
glyphsetRegistry.register(alternatingListGlyphSet);
glyphsetRegistry.register(pictureListGlyphSet);
glyphsetRegistry.register(pictureBlocksGlyphSet);
glyphsetRegistry.register(framedPictureGlyphSet);

// Export individual glyphsets (for direct import if needed)
export { basicProcessGlyphSet } from './process/basicProcess.js';
export { cycleGlyphSet } from './process/cycle.js';
export { alternatingProcessGlyphSet } from './process/alternatingProcess.js';
export { stepProcessGlyphSet } from './process/stepProcess.js';
export { equationProcessGlyphSet } from './process/equationProcess.js';
export { continuousBlockProcessGlyphSet } from './process/continuousBlockProcess.js';
export { phasedProcessGlyphSet } from './process/phasedProcess.js';
export { detailedProcessGlyphSet } from './process/detailedProcess.js';
export { groupedProcessGlyphSet } from './process/groupedProcess.js';
export { pictureProcessGlyphSet } from './process/pictureProcess.js';
export { radialCycleGlyphSet } from './process/radialCycle.js';
export { gearCycleGlyphSet } from './process/gearCycle.js';
export { segmentedCycleGlyphSet } from './process/segmentedCycle.js';
export { blockCycleGlyphSet } from './process/blockCycle.js';
export { spiralCycleGlyphSet } from './process/spiralCycle.js';
export { orbitCycleGlyphSet } from './process/orbitCycle.js';
export { pyramidGlyphSet } from './hierarchy/pyramid.js';
export { invertedPyramidGlyphSet } from './hierarchy/invertedPyramid.js';
export { segmentedPyramidGlyphSet } from './hierarchy/segmentedPyramid.js';
export { pyramidListGlyphSet } from './hierarchy/pyramidList.js';
export { orgChartGlyphSet } from './hierarchy/orgChart.js';
export { horizontalOrgChartGlyphSet } from './hierarchy/horizontalOrgChart.js';
export { matrixOrgChartGlyphSet } from './hierarchy/matrixOrgChart.js';
export { circleHierarchyGlyphSet } from './hierarchy/circleHierarchy.js';
export { labeledHierarchyGlyphSet } from './hierarchy/labeledHierarchy.js';
export { tableHierarchyGlyphSet } from './hierarchy/tableHierarchy.js';
export { teamHierarchyGlyphSet } from './hierarchy/teamHierarchy.js';
export { matrixGlyphSet } from './comparison/matrix.js';
export { vennGlyphSet } from './comparison/venn.js';
export { matrix3x3GlyphSet } from './comparison/matrix3x3.js';
export { titledMatrixGlyphSet } from './comparison/titledMatrix.js';
export { segmentedMatrixGlyphSet } from './comparison/segmentedMatrix.js';
export { steppedVennGlyphSet } from './comparison/steppedVenn.js';
export { linearVennGlyphSet } from './comparison/linearVenn.js';
export { targetGlyphSet } from './relationship/target.js';
export { balanceGlyphSet } from './relationship/balance.js';
export { opposingGlyphSet } from './relationship/opposing.js';
export { convergingGlyphSet } from './relationship/converging.js';
export { divergingGlyphSet } from './relationship/diverging.js';
export { clusterGlyphSet } from './relationship/cluster.js';
export { puzzleGlyphSet } from './relationship/puzzle.js';
export { plusMinusGlyphSet } from './relationship/plusMinus.js';
export { counterbalanceGlyphSet } from './relationship/counterbalance.js';
export { equationGlyphSet } from './relationship/equation.js';
export { interconnectedGlyphSet } from './relationship/interconnected.js';
export { hubGlyphSet } from './relationship/hub.js';
export { funnelGlyphSet } from './visualization/funnel.js';
export { pictureGridGlyphSet } from './visualization/pictureGrid.js';
export { pictureCalloutGlyphSet } from './visualization/pictureCallout.js';
export { eventsGlyphSet } from './visualization/events.js';
export { basicListGlyphSet } from './list/basicList.js';
export { horizontalListGlyphSet } from './list/horizontalList.js';
export { chevronListGlyphSet } from './list/chevronList.js';
export { numberedChevronListGlyphSet } from './list/numberedChevronList.js';
export { nestedListGlyphSet } from './list/nestedList.js';
export { columnListGlyphSet } from './list/columnList.js';
export { increasingListGlyphSet } from './list/increasingList.js';
export { alternatingListGlyphSet } from './list/alternatingList.js';
export { pictureListGlyphSet } from './list/pictureList.js';
export { pictureBlocksGlyphSet } from './list/pictureBlocks.js';
export { framedPictureGlyphSet } from './list/framedPicture.js';

// Export themes
export { COLOR_THEMES, getThemeColor, type ColorTheme } from './themes.js';
