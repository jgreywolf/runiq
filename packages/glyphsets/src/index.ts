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
import { pyramidGlyphSet } from './hierarchy/pyramid.js';
import { orgChartGlyphSet } from './hierarchy/orgChart.js';
import { horizontalOrgChartGlyphSet } from './hierarchy/horizontalOrgChart.js';
import { matrixOrgChartGlyphSet } from './hierarchy/matrixOrgChart.js';
import { matrixGlyphSet } from './comparison/matrix.js';
import { vennGlyphSet } from './comparison/venn.js';
import { funnelGlyphSet } from './visualization/funnel.js';
import { eventsGlyphSet } from './visualization/events.js';
import { basicListGlyphSet } from './list/basicList.js';
import { targetGlyphSet } from './relationship/target.js';
import { balanceGlyphSet } from './relationship/balance.js';
import { opposingGlyphSet } from './relationship/opposing.js';
import { convergingGlyphSet } from './relationship/converging.js';
import { divergingGlyphSet } from './relationship/diverging.js';
import { clusterGlyphSet } from './relationship/cluster.js';

// Auto-register built-in glyphsets
import { glyphsetRegistry } from './registry.js';

// Process glyphsets
glyphsetRegistry.register(horizontalProcessGlyphSet);
glyphsetRegistry.register(verticalProcessGlyphSet);
glyphsetRegistry.register(cycleGlyphSet);

// Hierarchy glyphsets
glyphsetRegistry.register(pyramidGlyphSet);
glyphsetRegistry.register(orgChartGlyphSet);
glyphsetRegistry.register(horizontalOrgChartGlyphSet);
glyphsetRegistry.register(matrixOrgChartGlyphSet);

// Comparison glyphsets
glyphsetRegistry.register(matrixGlyphSet);
glyphsetRegistry.register(vennGlyphSet);

// Relationship glyphsets
glyphsetRegistry.register(targetGlyphSet);
glyphsetRegistry.register(balanceGlyphSet);
glyphsetRegistry.register(opposingGlyphSet);
glyphsetRegistry.register(convergingGlyphSet);
glyphsetRegistry.register(divergingGlyphSet);
glyphsetRegistry.register(clusterGlyphSet);

// Visualization glyphsets
glyphsetRegistry.register(funnelGlyphSet);
glyphsetRegistry.register(eventsGlyphSet);

// List glyphsets
glyphsetRegistry.register(basicListGlyphSet);

// Export individual glyphsets (for direct import if needed)
export { horizontalProcessGlyphSet } from './process/horizontal-process.js';
export { verticalProcessGlyphSet } from './process/vertical-process.js';
export { cycleGlyphSet } from './process/cycle.js';
export { pyramidGlyphSet } from './hierarchy/pyramid.js';
export { orgChartGlyphSet } from './hierarchy/orgChart.js';
export { horizontalOrgChartGlyphSet } from './hierarchy/horizontalOrgChart.js';
export { matrixOrgChartGlyphSet } from './hierarchy/matrixOrgChart.js';
export { matrixGlyphSet } from './comparison/matrix.js';
export { vennGlyphSet } from './comparison/venn.js';
export { targetGlyphSet } from './relationship/target.js';
export { balanceGlyphSet } from './relationship/balance.js';
export { opposingGlyphSet } from './relationship/opposing.js';
export { convergingGlyphSet } from './relationship/converging.js';
export { divergingGlyphSet } from './relationship/diverging.js';
export { clusterGlyphSet } from './relationship/cluster.js';
export { funnelGlyphSet } from './visualization/funnel.js';
export { eventsGlyphSet } from './visualization/events.js';
export { basicListGlyphSet } from './list/basicList.js';

// Export themes
export { COLOR_THEMES, getThemeColor, type ColorTheme } from './themes.js';
