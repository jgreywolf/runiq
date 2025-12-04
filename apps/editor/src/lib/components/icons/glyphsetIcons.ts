/**
 * Glyphset Profile Icons
 * SVG icon definitions for all glyphset types
 */

export const glyphsetShapeIcons: Record<string, string> = {
	// Process - rectangles/shapes with arrows flowing left-to-right or in cycles
	basicProcess:
		'<rect x="4" y="16" width="8" height="8" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><path d="M12,20 L16,20" stroke="#333" stroke-width="0.8" marker-end="url(#arrow)"/><rect x="16" y="16" width="8" height="8" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><path d="M24,20 L28,20" stroke="#333" stroke-width="0.8" marker-end="url(#arrow)"/><rect x="28" y="16" width="8" height="8" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#333"/></marker></defs>',
	cycle:
		'<circle cx="20" cy="20" r="11" fill="none" stroke="#999" stroke-width="0.5" stroke-dasharray="2,2"/><rect x="16" y="6" width="8" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="28" y="16" width="8" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="16" y="28" width="8" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="4" y="16" width="8" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	alternatingProcess:
		'<rect x="4" y="8" width="10" height="7" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><path d="M14,11.5 L18,11.5" stroke="#333" stroke-width="0.8" marker-end="url(#arrow)"/><rect x="18" y="21" width="10" height="7" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><path d="M28,24.5 L32,24.5" stroke="#333" stroke-width="0.8" marker-end="url(#arrow)"/><defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#333"/></marker></defs>',
	stepProcess:
		'<path d="M4,16 L8,16 L10,20 L14,20 L16,16 L20,16 L22,20 L26,20 L28,16 L32,16 L34,20 L36,20" fill="none" stroke="#8B9DC3" stroke-width="2"/>',
	equationProcess:
		'<circle cx="8" cy="20" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><text x="14" y="23" font-size="7" fill="#333">+</text><circle cx="20" cy="20" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><text x="26" y="23" font-size="7" fill="#333">=</text><circle cx="32" cy="20" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	continuousBlockProcess:
		'<rect x="4" y="14" width="8" height="12" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="12" y="14" width="8" height="12" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="20" y="14" width="8" height="12" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="28" y="14" width="8" height="12" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	phasedProcess:
		'<rect x="6" y="8" width="7" height="24" fill="none" stroke="#8B9DC3" stroke-width="1.5"/><line x1="6" y1="16" x2="13" y2="16" stroke="#8B9DC3" stroke-width="0.8"/><line x1="6" y1="24" x2="13" y2="24" stroke="#8B9DC3" stroke-width="0.8"/><rect x="16" y="8" width="7" height="24" fill="none" stroke="#8B9DC3" stroke-width="1.5"/><line x1="16" y1="16" x2="23" y2="16" stroke="#8B9DC3" stroke-width="0.8"/><line x1="16" y1="24" x2="23" y2="24" stroke="#8B9DC3" stroke-width="0.8"/><rect x="26" y="8" width="7" height="24" fill="none" stroke="#8B9DC3" stroke-width="1.5"/><line x1="26" y1="16" x2="33" y2="16" stroke="#8B9DC3" stroke-width="0.8"/><line x1="26" y1="24" x2="33" y2="24" stroke="#8B9DC3" stroke-width="0.8"/>',
	detailedProcess:
		'<rect x="4" y="10" width="32" height="5" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="4" y="17" width="32" height="5" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="4" y="24" width="32" height="5" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	groupedProcess:
		'<rect x="4" y="8" width="12" height="9" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="4" y="19" width="12" height="9" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="20" y="13" width="16" height="14" rx="1" fill="none" stroke="#8B9DC3" stroke-width="1.2" stroke-dasharray="2,1"/>',
	pictureProcess:
		'<rect x="4" y="12" width="10" height="10" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="9" cy="17" r="2.5" fill="#8B9DC3"/><rect x="16" y="12" width="10" height="10" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="21" cy="17" r="2.5" fill="#8B9DC3"/><rect x="28" y="12" width="10" height="10" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="33" cy="17" r="2.5" fill="#8B9DC3"/>',
	radialCycle:
		'<circle cx="20" cy="20" r="5" fill="none" stroke="#8B9DC3" stroke-width="1.5"/><circle cx="20" cy="8" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="31" cy="14" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="31" cy="26" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="20" cy="32" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="9" cy="26" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="9" cy="14" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	gearCycle:
		'<circle cx="20" cy="20" r="9" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="18" y="8" width="4" height="5" fill="#333"/><rect x="27" y="18" width="5" height="4" fill="#333"/><rect x="18" y="27" width="4" height="5" fill="#333"/><rect x="8" y="18" width="5" height="4" fill="#333"/>',
	segmentedCycle:
		'<path d="M20,8 A12,12 0 0,1 32,20" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><path d="M32,20 A12,12 0 0,1 20,32" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><path d="M20,32 A12,12 0 0,1 8,20" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/><path d="M8,20 A12,12 0 0,1 20,8" fill="#D8E2F0" stroke="#333" stroke-width="0.8"/>',
	blockCycle:
		'<circle cx="20" cy="20" r="11" fill="none" stroke="#DDD" stroke-width="0.5" stroke-dasharray="2,2"/><rect x="8" y="6" width="8" height="7" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="27" y="8" width="7" height="8" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="24" y="27" width="8" height="7" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="6" y="24" width="7" height="8" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	spiralCycle:
		'<path d="M20,20 Q20,12 26,12 Q32,12 32,20 Q32,28 24,28 Q16,28 16,20 Q16,16 20,16" fill="none" stroke="#8B9DC3" stroke-width="2" marker-end="url(#arrow)"/><defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#8B9DC3"/></marker></defs>',
	orbitCycle:
		'<circle cx="20" cy="20" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><ellipse cx="20" cy="20" rx="13" ry="7" fill="none" stroke="#8B9DC3" stroke-width="1"/><ellipse cx="20" cy="20" rx="7" ry="13" fill="none" stroke="#8B9DC3" stroke-width="1"/>',
	// Hierarchy - pyramids, org charts, tree structures
	pyramid:
		'<path d="M20,6 L34,32 L6,32 Z" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="11" y1="22" x2="29" y2="22" stroke="#333" stroke-width="0.8"/><line x1="14" y1="27" x2="26" y2="27" stroke="#333" stroke-width="0.8"/>',
	invertedPyramid:
		'<path d="M6,8 L34,8 L20,34 Z" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="11" y1="18" x2="29" y2="18" stroke="#333" stroke-width="0.8"/><line x1="14" y1="23" x2="26" y2="23" stroke="#333" stroke-width="0.8"/>',
	segmentedPyramid:
		'<path d="M20,6 L34,32 L6,32 Z" fill="none" stroke="#333" stroke-width="0.8"/><line x1="10" y1="20" x2="30" y2="20" stroke="#333" stroke-width="0.8"/><path d="M10,20 L18,11 L22,11 L30,20" fill="#8B9DC3"/><line x1="13" y1="26" x2="27" y2="26" stroke="#333" stroke-width="0.8"/><path d="M13,26 L10,20 L30,20 L27,26" fill="#A8B8D8"/><path d="M13,26 L6,32 L34,32 L27,26" fill="#C8D5E8"/>',
	trapezoidPyramid:
		'<path d="M12,8 L28,8 L34,32 L6,32 Z" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="10" y1="18" x2="30" y2="18" stroke="#333" stroke-width="0.8"/><line x1="8" y1="25" x2="32" y2="25" stroke="#333" stroke-width="0.8"/>',
	pyramidList:
		'<path d="M20,6 L32,18 L20,18 L8,18 Z" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="12" y="20" width="16" height="4" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><rect x="10" y="26" width="20" height="4" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/>',
	orgChart:
		'<rect x="16" y="4" width="8" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="20" y1="10" x2="20" y2="14" stroke="#333" stroke-width="0.8"/><line x1="10" y1="14" x2="30" y2="14" stroke="#333" stroke-width="0.8"/><rect x="6" y="14" width="8" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="16" y="14" width="8" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="26" y="14" width="8" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="10" y1="20" x2="10" y2="24" stroke="#333" stroke-width="0.8"/><line x1="30" y1="20" x2="30" y2="24" stroke="#333" stroke-width="0.8"/><rect x="6" y="24" width="8" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="26" y="24" width="8" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	horizontalOrgChart:
		'<rect x="4" y="16" width="6" height="8" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="10" y1="20" x2="14" y2="20" stroke="#333" stroke-width="0.8"/><line x1="14" y1="10" x2="14" y2="30" stroke="#333" stroke-width="0.8"/><rect x="14" y="6" width="6" height="8" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="14" y="16" width="6" height="8" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="14" y="26" width="6" height="8" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="20" y1="10" x2="24" y2="10" stroke="#333" stroke-width="0.8"/><line x1="20" y1="30" x2="24" y2="30" stroke="#333" stroke-width="0.8"/><rect x="24" y="6" width="6" height="8" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="24" y="26" width="6" height="8" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	matrixOrgChart:
		'<rect x="4" y="8" width="6" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="17" y="8" width="6" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="30" y="8" width="6" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="7" y1="14" x2="7" y2="18" stroke="#333" stroke-width="0.8"/><line x1="20" y1="14" x2="20" y2="18" stroke="#333" stroke-width="0.8"/><line x1="33" y1="14" x2="33" y2="18" stroke="#333" stroke-width="0.8"/><line x1="7" y1="18" x2="33" y2="18" stroke="#333" stroke-width="0.8"/><rect x="17" y="18" width="6" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="20" y1="24" x2="20" y2="28" stroke="#333" stroke-width="0.8"/><rect x="17" y="28" width="6" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	circleHierarchy:
		'<circle cx="20" cy="10" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="20" y1="14" x2="20" y2="18" stroke="#333" stroke-width="0.8"/><line x1="10" y1="18" x2="30" y2="18" stroke="#333" stroke-width="0.8"/><circle cx="10" cy="18" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="20" cy="18" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="30" cy="18" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="10" y1="21" x2="10" y2="25" stroke="#333" stroke-width="0.8"/><line x1="30" y1="21" x2="30" y2="25" stroke="#333" stroke-width="0.8"/><circle cx="10" cy="28" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="30" cy="28" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	labeledHierarchy:
		'<rect x="10" y="6" width="20" height="5" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="8" y="13" width="11" height="5" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><rect x="21" y="13" width="11" height="5" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><rect x="6" y="20" width="9" height="5" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/><rect x="16" y="20" width="8" height="5" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/><rect x="25" y="20" width="9" height="5" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/>',
	tableHierarchy:
		'<rect x="6" y="8" width="28" height="6" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="6" y1="14" x2="34" y2="14" stroke="#333" stroke-width="0.8"/><rect x="6" y="14" width="13" height="6" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><rect x="21" y="14" width="13" height="6" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><line x1="6" y1="20" x2="34" y2="20" stroke="#333" stroke-width="0.8"/><rect x="6" y="20" width="8" height="6" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/><rect x="16" y="20" width="8" height="6" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/><rect x="26" y="20" width="8" height="6" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/>',
	teamHierarchy:
		'<rect x="12" y="6" width="16" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="20" y1="12" x2="20" y2="16" stroke="#333" stroke-width="0.8"/><rect x="4" y="16" width="32" height="6" rx="1" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><line x1="10" y1="22" x2="10" y2="26" stroke="#333" stroke-width="0.8"/><line x1="20" y1="22" x2="20" y2="26" stroke="#333" stroke-width="0.8"/><line x1="30" y1="22" x2="30" y2="26" stroke="#333" stroke-width="0.8"/><rect x="6" y="26" width="8" height="6" rx="1" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/><rect x="16" y="26" width="8" height="6" rx="1" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/><rect x="26" y="26" width="8" height="6" rx="1" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/>',
	// Comparison - matrices, venn diagrams
	matrix:
		'<rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="0.8"/><line x1="20" y1="6" x2="20" y2="34" stroke="#333" stroke-width="0.8"/><line x1="6" y1="20" x2="34" y2="20" stroke="#333" stroke-width="0.8"/><circle cx="13" cy="13" r="2" fill="#8B9DC3"/><circle cx="27" cy="13" r="2" fill="#8B9DC3"/><circle cx="13" cy="27" r="2" fill="#8B9DC3"/><circle cx="27" cy="27" r="2" fill="#8B9DC3"/>',
	matrix3x3:
		'<rect x="6" y="6" width="28" height="28" fill="none" stroke="#333" stroke-width="0.8"/><line x1="15" y1="6" x2="15" y2="34" stroke="#333" stroke-width="0.8"/><line x1="25" y1="6" x2="25" y2="34" stroke="#333" stroke-width="0.8"/><line x1="6" y1="15" x2="34" y2="15" stroke="#333" stroke-width="0.8"/><line x1="6" y1="25" x2="34" y2="25" stroke="#333" stroke-width="0.8"/>',
	titledMatrix:
		'<rect x="10" y="4" width="20" height="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="8" y="10" width="24" height="24" fill="none" stroke="#333" stroke-width="0.8"/><line x1="20" y1="10" x2="20" y2="34" stroke="#333" stroke-width="0.8"/><line x1="8" y1="22" x2="32" y2="22" stroke="#333" stroke-width="0.8"/>',
	segmentedMatrix:
		'<rect x="6" y="6" width="13" height="13" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="21" y="6" width="13" height="13" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><rect x="6" y="21" width="13" height="13" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/><rect x="21" y="21" width="13" height="13" fill="#D8E2F0" stroke="#333" stroke-width="0.8"/>',
	venn: '<circle cx="16" cy="20" r="10" fill="#8B9DC3" fill-opacity="0.5" stroke="#333" stroke-width="0.8"/><circle cx="24" cy="20" r="10" fill="#A8B8D8" fill-opacity="0.5" stroke="#333" stroke-width="0.8"/>',
	linearVenn:
		'<ellipse cx="12" cy="20" rx="8" ry="12" fill="#8B9DC3" fill-opacity="0.5" stroke="#333" stroke-width="0.8"/><ellipse cx="20" cy="20" rx="8" ry="12" fill="#A8B8D8" fill-opacity="0.5" stroke="#333" stroke-width="0.8"/><ellipse cx="28" cy="20" rx="8" ry="12" fill="#C8D5E8" fill-opacity="0.5" stroke="#333" stroke-width="0.8"/>',
	steppedVenn:
		'<circle cx="14" cy="24" r="8" fill="#8B9DC3" fill-opacity="0.5" stroke="#333" stroke-width="0.8"/><circle cx="20" cy="18" r="8" fill="#A8B8D8" fill-opacity="0.5" stroke="#333" stroke-width="0.8"/><circle cx="26" cy="12" r="8" fill="#C8D5E8" fill-opacity="0.5" stroke="#333" stroke-width="0.8"/>',
	// Relationship - balance, converging/diverging, networks
	balance:
		'<line x1="20" y1="8" x2="20" y2="32" stroke="#333" stroke-width="1"/><line x1="6" y1="16" x2="34" y2="16" stroke="#333" stroke-width="1"/><circle cx="6" cy="16" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="34" cy="16" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	opposing:
		'<line x1="6" y1="20" x2="16" y2="20" stroke="#333" stroke-width="1" marker-end="url(#arrow)"/><line x1="34" y1="20" x2="24" y2="20" stroke="#333" stroke-width="1" marker-end="url(#arrow)"/><rect x="8" y="16" width="8" height="8" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="24" y="16" width="8" height="8" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#333"/></marker></defs>',
	converging:
		'<rect x="4" y="8" width="6" height="6" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="4" y="18" width="6" height="6" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="4" y="28" width="6" height="6" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="10" y1="11" x2="28" y2="20" stroke="#333" stroke-width="0.8" marker-end="url(#arrow)"/><line x1="10" y1="21" x2="28" y2="20" stroke="#333" stroke-width="0.8" marker-end="url(#arrow)"/><line x1="10" y1="31" x2="28" y2="20" stroke="#333" stroke-width="0.8" marker-end="url(#arrow)"/><rect x="28" y="17" width="6" height="6" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#333"/></marker></defs>',
	diverging:
		'<rect x="6" y="17" width="6" height="6" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="12" y1="20" x2="28" y2="11" stroke="#333" stroke-width="0.8" marker-end="url(#arrow)"/><line x1="12" y1="20" x2="28" y2="20" stroke="#333" stroke-width="0.8" marker-end="url(#arrow)"/><line x1="12" y1="20" x2="28" y2="29" stroke="#333" stroke-width="0.8" marker-end="url(#arrow)"/><rect x="28" y="8" width="6" height="6" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="28" y="17" width="6" height="6" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="28" y="26" width="6" height="6" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#333"/></marker></defs>',
	hub: '<circle cx="20" cy="20" r="5" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="20" y1="15" x2="20" y2="6" stroke="#333" stroke-width="0.8"/><line x1="23.5" y1="16.5" x2="30" y2="10" stroke="#333" stroke-width="0.8"/><line x1="25" y1="20" x2="34" y2="20" stroke="#333" stroke-width="0.8"/><line x1="23.5" y1="23.5" x2="30" y2="30" stroke="#333" stroke-width="0.8"/><line x1="20" y1="25" x2="20" y2="34" stroke="#333" stroke-width="0.8"/><line x1="16.5" y1="23.5" x2="10" y2="30" stroke="#333" stroke-width="0.8"/><line x1="15" y1="20" x2="6" y2="20" stroke="#333" stroke-width="0.8"/><line x1="16.5" y1="16.5" x2="10" y2="10" stroke="#333" stroke-width="0.8"/><circle cx="20" cy="6" r="2" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><circle cx="30" cy="10" r="2" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><circle cx="34" cy="20" r="2" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><circle cx="30" cy="30" r="2" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><circle cx="20" cy="34" r="2" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><circle cx="10" cy="30" r="2" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><circle cx="6" cy="20" r="2" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><circle cx="10" cy="10" r="2" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/>',
	interconnected:
		'<circle cx="10" cy="10" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="30" cy="10" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="10" cy="30" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="30" cy="30" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="10" y1="10" x2="30" y2="10" stroke="#333" stroke-width="0.8"/><line x1="10" y1="10" x2="10" y2="30" stroke="#333" stroke-width="0.8"/><line x1="30" y1="10" x2="30" y2="30" stroke="#333" stroke-width="0.8"/><line x1="10" y1="30" x2="30" y2="30" stroke="#333" stroke-width="0.8"/><line x1="10" y1="10" x2="30" y2="30" stroke="#333" stroke-width="0.8" stroke-dasharray="2,2"/><line x1="30" y1="10" x2="10" y2="30" stroke="#333" stroke-width="0.8" stroke-dasharray="2,2"/>',
	cluster:
		'<circle cx="20" cy="14" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="12" cy="22" r="3" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><circle cx="20" cy="26" r="3" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><circle cx="28" cy="22" r="3" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><line x1="20" y1="18" x2="12" y2="22" stroke="#333" stroke-width="0.8"/><line x1="20" y1="18" x2="20" y2="26" stroke="#333" stroke-width="0.8"/><line x1="20" y1="18" x2="28" y2="22" stroke="#333" stroke-width="0.8"/>',
	puzzle:
		'<path d="M8,8 L18,8 Q18,12 22,12 Q26,12 26,8 L32,8 L32,18 Q28,18 28,22 Q28,26 32,26 L32,32 L22,32 Q22,28 18,28 Q14,28 14,32 L8,32 Z" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	plusMinus:
		'<circle cx="14" cy="20" r="8" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="14" y1="16" x2="14" y2="24" stroke="#333" stroke-width="1.5"/><line x1="10" y1="20" x2="18" y2="20" stroke="#333" stroke-width="1.5"/><circle cx="26" cy="20" r="8" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><line x1="22" y1="20" x2="30" y2="20" stroke="#333" stroke-width="1.5"/>',
	counterbalance:
		'<rect x="6" y="12" width="10" height="16" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="24" y="12" width="10" height="16" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><line x1="20" y1="8" x2="20" y2="32" stroke="#333" stroke-width="1"/>',
	equation:
		'<circle cx="8" cy="20" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><text x="14" y="23" font-size="7" fill="#333">+</text><circle cx="20" cy="20" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><text x="26" y="23" font-size="7" fill="#333">=</text><circle cx="32" cy="20" r="4" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	// Visualization
	target:
		'<circle cx="20" cy="20" r="14" fill="none" stroke="#8B9DC3" stroke-width="1.5"/><circle cx="20" cy="20" r="10" fill="none" stroke="#8B9DC3" stroke-width="1.5"/><circle cx="20" cy="20" r="6" fill="none" stroke="#8B9DC3" stroke-width="1.5"/><circle cx="20" cy="20" r="2" fill="#8B9DC3"/>',
	funnel:
		'<path d="M8,8 L32,8 L26,20 L14,20 Z" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><path d="M14,20 L26,20 L24,28 L16,28 Z" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><path d="M16,28 L24,28 L22,34 L18,34 Z" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/>',
	pictureGrid:
		'<rect x="6" y="6" width="12" height="12" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="12" cy="12" r="3" fill="#8B9DC3"/><rect x="22" y="6" width="12" height="12" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="28" cy="12" r="3" fill="#8B9DC3"/><rect x="6" y="22" width="12" height="12" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="12" cy="28" r="3" fill="#8B9DC3"/><rect x="22" y="22" width="12" height="12" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="28" cy="28" r="3" fill="#8B9DC3"/>',
	pictureCallout:
		'<rect x="6" y="8" width="14" height="14" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="13" cy="15" r="4" fill="#8B9DC3"/><line x1="20" y1="10" x2="26" y2="10" stroke="#333" stroke-width="0.8"/><line x1="20" y1="14" x2="30" y2="14" stroke="#333" stroke-width="0.8"/><line x1="20" y1="18" x2="28" y2="18" stroke="#333" stroke-width="0.8"/>',
	events:
		'<line x1="10" y1="30" x2="30" y2="30" stroke="#333" stroke-width="1"/><circle cx="10" cy="30" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="18" cy="30" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><circle cx="26" cy="30" r="3" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><line x1="10" y1="27" x2="10" y2="12" stroke="#333" stroke-width="0.8"/><line x1="18" y1="27" x2="18" y2="18" stroke="#333" stroke-width="0.8"/><line x1="26" y1="27" x2="26" y2="8" stroke="#333" stroke-width="0.8"/>',
	// List
	basicList:
		'<rect x="8" y="8" width="24" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="8" y="16" width="24" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="8" y="24" width="24" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	horizontalList:
		'<rect x="4" y="14" width="8" height="12" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="14" y="14" width="8" height="12" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="24" y="14" width="8" height="12" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	chevronList:
		'<path d="M4,12 L12,12 L16,20 L12,28 L4,28 Z" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><path d="M14,12 L22,12 L26,20 L22,28 L14,28 Z" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><path d="M24,12 L32,12 L36,20 L32,28 L24,28 Z" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/>',
	numberedChevronList:
		'<path d="M6,12 L14,12 L18,20 L14,28 L6,28 Z" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><text x="10" y="22" font-size="8" fill="#fff" text-anchor="middle">1</text><path d="M16,12 L24,12 L28,20 L24,28 L16,28 Z" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><text x="20" y="22" font-size="8" fill="#fff" text-anchor="middle">2</text><path d="M26,12 L34,12 L38,20 L34,28 L26,28 Z" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/><text x="30" y="22" font-size="8" fill="#fff" text-anchor="middle">3</text>',
	nestedList:
		'<rect x="6" y="8" width="28" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="10" y="16" width="24" height="4" rx="1" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><rect x="10" y="22" width="24" height="4" rx="1" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><rect x="6" y="28" width="28" height="6" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/>',
	columnList:
		'<rect x="6" y="8" width="10" height="24" rx="1" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="18" y="8" width="10" height="24" rx="1" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><rect x="30" y="8" width="4" height="24" rx="1" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/>',
	increasingList:
		'<rect x="4" y="24" width="8" height="8" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="14" y="18" width="10" height="14" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><rect x="26" y="8" width="12" height="24" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/>',
	alternatingList:
		'<rect x="6" y="8" width="14" height="6" fill="#8B9DC3" stroke="#333" stroke-width="0.8"/><rect x="20" y="16" width="14" height="6" fill="#A8B8D8" stroke="#333" stroke-width="0.8"/><rect x="6" y="24" width="14" height="6" fill="#C8D5E8" stroke="#333" stroke-width="0.8"/>',
	pictureList:
		'<rect x="6" y="8" width="8" height="8" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="10" cy="12" r="2" fill="#8B9DC3"/><line x1="16" y1="10" x2="32" y2="10" stroke="#333" stroke-width="0.8"/><line x1="16" y1="14" x2="28" y2="14" stroke="#333" stroke-width="0.8"/><rect x="6" y="20" width="8" height="8" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="10" cy="24" r="2" fill="#8B9DC3"/><line x1="16" y1="22" x2="32" y2="22" stroke="#333" stroke-width="0.8"/><line x1="16" y1="26" x2="28" y2="26" stroke="#333" stroke-width="0.8"/>',
	pictureBlocks:
		'<rect x="6" y="8" width="10" height="10" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="11" cy="13" r="2.5" fill="#8B9DC3"/><rect x="18" y="8" width="10" height="10" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="23" cy="13" r="2.5" fill="#8B9DC3"/><rect x="30" y="8" width="4" height="10" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><line x1="6" y1="20" x2="34" y2="20" stroke="#333" stroke-width="0.8"/><line x1="6" y1="24" x2="28" y2="24" stroke="#333" stroke-width="0.8"/><line x1="6" y1="28" x2="32" y2="28" stroke="#333" stroke-width="0.8"/>',
	framedPicture:
		'<rect x="6" y="8" width="28" height="20" rx="1" fill="#E8E8E8" stroke="#333" stroke-width="0.8"/><circle cx="20" cy="18" r="6" fill="#8B9DC3"/><line x1="6" y1="30" x2="34" y2="30" stroke="#333" stroke-width="0.8"/><line x1="10" y1="32" x2="30" y2="32" stroke="#333" stroke-width="0.8"/>'
};

/**
 * Check if an ID is a glyphset shape
 */
export function isGlyphsetShape(shapeId: string): boolean {
	return shapeId in glyphsetShapeIcons;
}

/**
 * Get glyphset shape icon SVG
 */
export function getGlyphsetShapeIcon(shapeId: string, size: number): string | null {
	const icon = glyphsetShapeIcons[shapeId];
	if (!icon) return null;

	return `
		<svg 
			width="${size}" 
			height="${size}" 
			viewBox="0 0 40 40"
			xmlns="http://www.w3.org/2000/svg"
			style="display: block;"
		>
			${icon}
		</svg>
	`;
}
