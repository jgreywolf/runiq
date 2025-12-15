/**
 * @runiq/glyphsets
 *
 * Pre-built diagram patterns (GlyphSets) for Runiq - SmartArt-style templates
 */

// Export types
export type {
  GlyphSetCategory,
  GlyphSetDefinition,
  GlyphSetGenerator,
  GlyphSetParameter,
} from './types.js';

export { GlyphSetError } from './types.js';

// Export registry
export { GlyphSetRegistry, glyphsetRegistry } from './registry.js';

// Export constants (moved from parser-dsl for better package boundaries)
export {
  getAllGlyphsetIds,
  getGlyphsetStructureType,
  GlyphsetIdList,
  isGlyphsetId,
  isNestedGlyphset,
  isPictureGlyphset,
  NestedStructureGlyphsets,
  PictureGlyphsets,
} from './constants.js';
export type {
  GlyphsetId,
  NestedGlyphsetId,
  PictureGlyphsetId,
} from './constants.js';

// Export image utilities
export {
  getImageUrl,
  isValidImageUrl,
  PLACEHOLDER_IMAGE,
  renderCircularClipPath,
  renderImage,
  renderRoundedRectClipPath,
  validateImageItem,
} from './utils/image.js';
export type { ImageItem, RenderImageOptions } from './utils/image.js';

// Import glyphsets
import { linearVennGlyphSet } from './comparison/linearVenn.js';
import { matrixGlyphSet } from './comparison/matrix.js';
import { matrix3x3GlyphSet } from './comparison/matrix3x3.js';
import { segmentedMatrixGlyphSet } from './comparison/segmentedMatrix.js';
import { steppedVennGlyphSet } from './comparison/steppedVenn.js';
import { titledMatrixGlyphSet } from './comparison/titledMatrix.js';
import { vennGlyphSet } from './comparison/venn.js';
import { circleHierarchyGlyphSet } from './hierarchy/circleHierarchy.js';
import { horizontalOrgChartGlyphSet } from './hierarchy/horizontalOrgChart.js';
import { invertedPyramidGlyphSet } from './hierarchy/invertedPyramid.js';
import { labeledHierarchyGlyphSet } from './hierarchy/labeledHierarchy.js';
import { matrixOrgChartGlyphSet } from './hierarchy/matrixOrgChart.js';
import { orgChartGlyphSet } from './hierarchy/orgChart.js';
import { pyramidGlyphSet } from './hierarchy/pyramid.js';
import { pyramidListGlyphSet } from './hierarchy/pyramidList.js';
import { segmentedPyramidGlyphSet } from './hierarchy/segmentedPyramid.js';
import { tableHierarchyGlyphSet } from './hierarchy/tableHierarchy.js';
import { teamHierarchyGlyphSet } from './hierarchy/teamHierarchy.js';
import { alternatingListGlyphSet } from './list/alternatingList.js';
import { basicListGlyphSet } from './list/basicList.js';
import { chevronListGlyphSet } from './list/chevronList.js';
import { columnListGlyphSet } from './list/columnList.js';
import { framedPictureGlyphSet } from './list/framedPicture.js';
import { horizontalListGlyphSet } from './list/horizontalList.js';
import { increasingListGlyphSet } from './list/increasingList.js';
import { nestedListGlyphSet } from './list/nestedList.js';
import { numberedChevronListGlyphSet } from './list/numberedChevronList.js';
import { pictureBlocksGlyphSet } from './list/pictureBlocks.js';
import { pictureListGlyphSet } from './list/pictureList.js';
import { alternatingProcessGlyphSet } from './process/alternatingProcess.js';
import { basicProcessGlyphSet } from './process/basicProcess.js';
import { blockCycleGlyphSet } from './process/blockCycle.js';
import { continuousBlockProcessGlyphSet } from './process/continuousBlockProcess.js';
import { cycleGlyphSet } from './process/cycle.js';
import { detailedProcessGlyphSet } from './process/detailedProcess.js';
import { equationProcessGlyphSet } from './process/equationProcess.js';
import { gearCycleGlyphSet } from './process/gearCycle.js';
import { groupedProcessGlyphSet } from './process/groupedProcess.js';
import { orbitCycleGlyphSet } from './process/orbitCycle.js';
import { phasedProcessGlyphSet } from './process/phasedProcess.js';
import { pictureProcessGlyphSet } from './process/pictureProcess.js';
import { radialCycleGlyphSet } from './process/radialCycle.js';
import { segmentedCycleGlyphSet } from './process/segmentedCycle.js';
import { spiralCycleGlyphSet } from './process/spiralCycle.js';
import { stepProcessGlyphSet } from './process/stepProcess.js';
import { balanceGlyphSet } from './relationship/balance.js';
import { clusterGlyphSet } from './relationship/cluster.js';
import { convergingGlyphSet } from './relationship/converging.js';
import { counterBalanceGlyphSet } from './relationship/counterbalance.js';
import { divergingGlyphSet } from './relationship/diverging.js';
import { equationGlyphSet } from './relationship/equation.js';
import { hubGlyphSet } from './relationship/hub.js';
import { interconnectedGlyphSet } from './relationship/interconnected.js';
import { opposingGlyphSet } from './relationship/opposing.js';
import { plusMinusGlyphSet } from './relationship/plusMinus.js';
import { puzzleGlyphSet } from './relationship/puzzle.js';
import { targetGlyphSet } from './relationship/target.js';
import { eventsGlyphSet } from './visualization/events.js';
import { funnelGlyphSet } from './visualization/funnel.js';
import { pictureCalloutGlyphSet } from './visualization/pictureCallout.js';
import { pictureGridGlyphSet } from './visualization/pictureGrid.js';

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
glyphsetRegistry.register(counterBalanceGlyphSet);
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
export { linearVennGlyphSet } from './comparison/linearVenn.js';
export { matrixGlyphSet } from './comparison/matrix.js';
export { matrix3x3GlyphSet } from './comparison/matrix3x3.js';
export { segmentedMatrixGlyphSet } from './comparison/segmentedMatrix.js';
export { steppedVennGlyphSet } from './comparison/steppedVenn.js';
export { titledMatrixGlyphSet } from './comparison/titledMatrix.js';
export { vennGlyphSet } from './comparison/venn.js';
export { circleHierarchyGlyphSet } from './hierarchy/circleHierarchy.js';
export { horizontalOrgChartGlyphSet } from './hierarchy/horizontalOrgChart.js';
export { invertedPyramidGlyphSet } from './hierarchy/invertedPyramid.js';
export { labeledHierarchyGlyphSet } from './hierarchy/labeledHierarchy.js';
export { matrixOrgChartGlyphSet } from './hierarchy/matrixOrgChart.js';
export { orgChartGlyphSet } from './hierarchy/orgChart.js';
export { pyramidGlyphSet } from './hierarchy/pyramid.js';
export { pyramidListGlyphSet } from './hierarchy/pyramidList.js';
export { segmentedPyramidGlyphSet } from './hierarchy/segmentedPyramid.js';
export { tableHierarchyGlyphSet } from './hierarchy/tableHierarchy.js';
export { teamHierarchyGlyphSet } from './hierarchy/teamHierarchy.js';
export { alternatingListGlyphSet } from './list/alternatingList.js';
export { basicListGlyphSet } from './list/basicList.js';
export { chevronListGlyphSet } from './list/chevronList.js';
export { columnListGlyphSet } from './list/columnList.js';
export { framedPictureGlyphSet } from './list/framedPicture.js';
export { horizontalListGlyphSet } from './list/horizontalList.js';
export { increasingListGlyphSet } from './list/increasingList.js';
export { nestedListGlyphSet } from './list/nestedList.js';
export { numberedChevronListGlyphSet } from './list/numberedChevronList.js';
export { pictureBlocksGlyphSet } from './list/pictureBlocks.js';
export { pictureListGlyphSet } from './list/pictureList.js';
export { alternatingProcessGlyphSet } from './process/alternatingProcess.js';
export { basicProcessGlyphSet } from './process/basicProcess.js';
export { blockCycleGlyphSet } from './process/blockCycle.js';
export { continuousBlockProcessGlyphSet } from './process/continuousBlockProcess.js';
export { cycleGlyphSet } from './process/cycle.js';
export { detailedProcessGlyphSet } from './process/detailedProcess.js';
export { equationProcessGlyphSet } from './process/equationProcess.js';
export { gearCycleGlyphSet } from './process/gearCycle.js';
export { groupedProcessGlyphSet } from './process/groupedProcess.js';
export { orbitCycleGlyphSet } from './process/orbitCycle.js';
export { phasedProcessGlyphSet } from './process/phasedProcess.js';
export { pictureProcessGlyphSet } from './process/pictureProcess.js';
export { radialCycleGlyphSet } from './process/radialCycle.js';
export { segmentedCycleGlyphSet } from './process/segmentedCycle.js';
export { spiralCycleGlyphSet } from './process/spiralCycle.js';
export { stepProcessGlyphSet } from './process/stepProcess.js';
export { balanceGlyphSet } from './relationship/balance.js';
export { clusterGlyphSet } from './relationship/cluster.js';
export { convergingGlyphSet } from './relationship/converging.js';
export { counterBalanceGlyphSet } from './relationship/counterbalance.js';
export { divergingGlyphSet } from './relationship/diverging.js';
export { equationGlyphSet } from './relationship/equation.js';
export { hubGlyphSet } from './relationship/hub.js';
export { interconnectedGlyphSet } from './relationship/interconnected.js';
export { opposingGlyphSet } from './relationship/opposing.js';
export { plusMinusGlyphSet } from './relationship/plusMinus.js';
export { puzzleGlyphSet } from './relationship/puzzle.js';
export { targetGlyphSet } from './relationship/target.js';
export { eventsGlyphSet } from './visualization/events.js';
export { funnelGlyphSet } from './visualization/funnel.js';
export { pictureCalloutGlyphSet } from './visualization/pictureCallout.js';
export { pictureGridGlyphSet } from './visualization/pictureGrid.js';

// Export themes
export { COLOR_THEMES, getThemeColor, type ColorTheme } from './themes.js';
