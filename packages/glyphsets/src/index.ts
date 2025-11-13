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

// Import glyphsets
import { horizontalProcessGlyphSet } from './process/horizontal-process.js';
import { verticalProcessGlyphSet } from './process/vertical-process.js';
import { cycleGlyphSet } from './process/cycle.js';
import { alternatingProcessGlyphSet } from './process/alternatingProcess.js';
import { stepProcessGlyphSet } from './process/stepProcess.js';
import { equationProcessGlyphSet } from './process/equationProcess.js';
import { continuousBlockProcessGlyphSet } from './process/continuousBlockProcess.js';
import { phasedProcessGlyphSet } from './process/phasedProcess.js';
import { detailedProcessGlyphSet } from './process/detailedProcess.js';
import { groupedProcessGlyphSet } from './process/groupedProcess.js';
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
import { eventsGlyphSet } from './visualization/events.js';
import { basicListGlyphSet } from './list/basicList.js';
import { horizontalListGlyphSet } from './list/horizontalList.js';
import { chevronListGlyphSet } from './list/chevronList.js';
import { numberedChevronListGlyphSet } from './list/numberedChevronList.js';
import { nestedListGlyphSet } from './list/nestedList.js';
import { columnListGlyphSet } from './list/columnList.js';
import { increasingListGlyphSet } from './list/increasingList.js';
import { alternatingListGlyphSet } from './list/alternatingList.js';
import { targetGlyphSet } from './relationship/target.js';
import { balanceGlyphSet } from './relationship/balance.js';
import { opposingGlyphSet } from './relationship/opposing.js';
import { convergingGlyphSet } from './relationship/converging.js';
import { divergingGlyphSet } from './relationship/diverging.js';
import { clusterGlyphSet } from './relationship/cluster.js';
import { puzzleGlyphSet } from './relationship/puzzle.js';
import { plusMinusGlyphSet } from './relationship/plusMinus.js';

// Auto-register built-in glyphsets
import { glyphsetRegistry } from './registry.js';

// Process glyphsets
glyphsetRegistry.register(horizontalProcessGlyphSet);
glyphsetRegistry.register(verticalProcessGlyphSet);
glyphsetRegistry.register(cycleGlyphSet);
glyphsetRegistry.register(alternatingProcessGlyphSet);
glyphsetRegistry.register(stepProcessGlyphSet);
glyphsetRegistry.register(equationProcessGlyphSet);
glyphsetRegistry.register(continuousBlockProcessGlyphSet);
glyphsetRegistry.register(phasedProcessGlyphSet);
glyphsetRegistry.register(detailedProcessGlyphSet);
glyphsetRegistry.register(groupedProcessGlyphSet);

// Hierarchy glyphsets
glyphsetRegistry.register(pyramidGlyphSet);
glyphsetRegistry.register(invertedPyramidGlyphSet);
glyphsetRegistry.register(segmentedPyramidGlyphSet);
glyphsetRegistry.register(pyramidListGlyphSet);
glyphsetRegistry.register(orgChartGlyphSet);
glyphsetRegistry.register(horizontalOrgChartGlyphSet);
glyphsetRegistry.register(matrixOrgChartGlyphSet);

// Comparison glyphsets
glyphsetRegistry.register(matrixGlyphSet);
glyphsetRegistry.register(vennGlyphSet);
glyphsetRegistry.register(matrix3x3GlyphSet);
glyphsetRegistry.register(titledMatrixGlyphSet);
glyphsetRegistry.register(segmentedMatrixGlyphSet);

// Relationship glyphsets
glyphsetRegistry.register(targetGlyphSet);
glyphsetRegistry.register(balanceGlyphSet);
glyphsetRegistry.register(opposingGlyphSet);
glyphsetRegistry.register(convergingGlyphSet);
glyphsetRegistry.register(divergingGlyphSet);
glyphsetRegistry.register(clusterGlyphSet);
glyphsetRegistry.register(puzzleGlyphSet);
glyphsetRegistry.register(plusMinusGlyphSet);

// Visualization glyphsets
glyphsetRegistry.register(funnelGlyphSet);
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

// Export individual glyphsets (for direct import if needed)
export { horizontalProcessGlyphSet } from './process/horizontal-process.js';
export { verticalProcessGlyphSet } from './process/vertical-process.js';
export { cycleGlyphSet } from './process/cycle.js';
export { alternatingProcessGlyphSet } from './process/alternatingProcess.js';
export { stepProcessGlyphSet } from './process/stepProcess.js';
export { equationProcessGlyphSet } from './process/equationProcess.js';
export { continuousBlockProcessGlyphSet } from './process/continuousBlockProcess.js';
export { phasedProcessGlyphSet } from './process/phasedProcess.js';
export { detailedProcessGlyphSet } from './process/detailedProcess.js';
export { groupedProcessGlyphSet } from './process/groupedProcess.js';
export { pyramidGlyphSet } from './hierarchy/pyramid.js';
export { invertedPyramidGlyphSet } from './hierarchy/invertedPyramid.js';
export { segmentedPyramidGlyphSet } from './hierarchy/segmentedPyramid.js';
export { pyramidListGlyphSet } from './hierarchy/pyramidList.js';
export { orgChartGlyphSet } from './hierarchy/orgChart.js';
export { horizontalOrgChartGlyphSet } from './hierarchy/horizontalOrgChart.js';
export { matrixOrgChartGlyphSet } from './hierarchy/matrixOrgChart.js';
export { matrixGlyphSet } from './comparison/matrix.js';
export { vennGlyphSet } from './comparison/venn.js';
export { matrix3x3GlyphSet } from './comparison/matrix3x3.js';
export { titledMatrixGlyphSet } from './comparison/titledMatrix.js';
export { segmentedMatrixGlyphSet } from './comparison/segmentedMatrix.js';
export { targetGlyphSet } from './relationship/target.js';
export { balanceGlyphSet } from './relationship/balance.js';
export { opposingGlyphSet } from './relationship/opposing.js';
export { convergingGlyphSet } from './relationship/converging.js';
export { divergingGlyphSet } from './relationship/diverging.js';
export { clusterGlyphSet } from './relationship/cluster.js';
export { puzzleGlyphSet } from './relationship/puzzle.js';
export { plusMinusGlyphSet } from './relationship/plusMinus.js';
export { funnelGlyphSet } from './visualization/funnel.js';
export { eventsGlyphSet } from './visualization/events.js';
export { basicListGlyphSet } from './list/basicList.js';
export { horizontalListGlyphSet } from './list/horizontalList.js';
export { chevronListGlyphSet } from './list/chevronList.js';
export { numberedChevronListGlyphSet } from './list/numberedChevronList.js';
export { nestedListGlyphSet } from './list/nestedList.js';
export { columnListGlyphSet } from './list/columnList.js';
export { increasingListGlyphSet } from './list/increasingList.js';
export { alternatingListGlyphSet } from './list/alternatingList.js';

// Export themes
export { COLOR_THEMES, getThemeColor, type ColorTheme } from './themes.js';
