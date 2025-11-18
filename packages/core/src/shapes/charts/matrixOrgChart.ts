import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Matrix Organization Chart Shape
 *
 * Renders a matrix organization structure showing both functional
 * and project-based relationships as a single composite shape.
 *
 * Expected data structure:
 * {
 *   structure: MatrixStructure,
 *   colors: string[] (theme colors),
 *   showDottedLines: boolean
 * }
 */

interface MatrixStructure {
  ceo: string;
  functional?: Array<{
    name: string;
    reports?: string[];
  }>;
  projects?: Array<{
    name: string;
    team?: string[];
  }>;
}

interface MatrixOrgChartData {
  structure: MatrixStructure;
  colors: string[];
  showDottedLines?: boolean;
}

const NODE_WIDTH = 120;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 30;
const VERTICAL_SPACING = 80;

export const matrixOrgChart: ShapeDefinition = {
  id: 'matrixOrgChart',

  bounds: (ctx: ShapeRenderContext) => {
    const data = ctx?.node?.data as MatrixOrgChartData | undefined;
    if (!data?.structure) {
      return { width: NODE_WIDTH, height: NODE_HEIGHT };
    }

    const { structure } = data;
    const funcCount = structure.functional?.length || 0;
    const projectCount = structure.projects?.length || 0;

    // Calculate width needed for each functional group (including employees)
    let totalOrgWidth = 0;
    structure.functional?.forEach((func) => {
      const reportCount = func.reports?.length || 0;
      const funcWidth = Math.max(
        NODE_WIDTH,
        reportCount * (NODE_WIDTH + HORIZONTAL_SPACING) - HORIZONTAL_SPACING
      );
      totalOrgWidth += funcWidth;
    });
    
    // Add spacing between functional groups
    if (funcCount > 1) {
      totalOrgWidth += (funcCount - 1) * HORIZONTAL_SPACING;
    }
    
    // Ensure CEO can fit at top
    totalOrgWidth = Math.max(totalOrgWidth, NODE_WIDTH);

    const width =
      totalOrgWidth +
      (projectCount > 0 ? NODE_WIDTH + HORIZONTAL_SPACING * 2 : 0);

    const height =
      NODE_HEIGHT + // CEO
      (funcCount > 0 ? VERTICAL_SPACING + NODE_HEIGHT : 0) + // Functions
      (structure.functional?.some(f => f.reports && f.reports.length > 0) ? VERTICAL_SPACING + NODE_HEIGHT : 0); // Employees

    return { width, height };
  },

  anchors: (ctx: ShapeRenderContext) => {
    const bounds = matrixOrgChart.bounds(ctx);
    const { width, height } = bounds;
    return [
      { id: 'top', x: width / 2, y: 0 },
      { id: 'right', x: width, y: height / 2 },
      { id: 'bottom', x: width / 2, y: height },
      { id: 'left', x: 0, y: height / 2 },
    ];
  },

  render: (ctx: ShapeRenderContext, position: { x: number; y: number }) => {
    const data = ctx?.node?.data as MatrixOrgChartData | undefined;
    if (!data?.structure) {
      return `<rect x="${position.x}" y="${position.y}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" fill="#f0f0f0" stroke="#666" />`;
    }

    const { structure, colors, showDottedLines = true } = data;
    const themeColors = colors || [
      '#4A90E2',
      '#50C878',
      '#FFB84D',
      '#E74C3C',
      '#9C27B0',
    ];

    let svg = '<g class="matrix-org-chart">';

    // Calculate layout for functional groups
    const functionalLayouts: Array<{
      funcX: number;
      funcWidth: number;
      employeeCount: number;
    }> = [];
    
    let currentX = position.x;
    structure.functional?.forEach((func) => {
      const employeeCount = func.reports?.length || 0;
      const funcWidth = Math.max(
        NODE_WIDTH,
        employeeCount * (NODE_WIDTH + HORIZONTAL_SPACING) - HORIZONTAL_SPACING
      );
      
      functionalLayouts.push({
        funcX: currentX,
        funcWidth,
        employeeCount,
      });
      
      currentX += funcWidth + HORIZONTAL_SPACING;
    });

    // Calculate total org width and CEO position
    const totalOrgWidth = currentX - position.x - (functionalLayouts.length > 0 ? HORIZONTAL_SPACING : 0);
    const ceoX = position.x + totalOrgWidth / 2 - NODE_WIDTH / 2;
    const ceoY = position.y;
    
    // Render CEO
    svg += renderNodeBox(
      ceoX,
      ceoY,
      structure.ceo,
      undefined,
      themeColors[0],
      'rounded'
    );

    // Track employee positions for project connections
    const employeePositions = new Map<string, { x: number; y: number }>();

    // Render functional hierarchy
    if (structure.functional) {
      const funcY = ceoY + NODE_HEIGHT + VERTICAL_SPACING;

      structure.functional.forEach((func, funcIndex) => {
        const layout = functionalLayouts[funcIndex];
        
        // Center function node within its allocated width
        const funcX = layout.funcX + layout.funcWidth / 2 - NODE_WIDTH / 2;
        const funcCenterX = funcX + NODE_WIDTH / 2;

        // Function node
        svg += renderNodeBox(
          funcX,
          funcY,
          func.name,
          undefined,
          themeColors[1],
          'rounded'
        );

        // Line from CEO to function
        svg += `<line x1="${ceoX + NODE_WIDTH / 2}" y1="${ceoY + NODE_HEIGHT}" x2="${funcCenterX}" y2="${funcY}" stroke="#666" stroke-width="2" />`;

        // Render employees centered under function
        if (func.reports && func.reports.length > 0) {
          const employeeY = funcY + NODE_HEIGHT + VERTICAL_SPACING;
          const totalEmployeeWidth =
            func.reports.length * (NODE_WIDTH + HORIZONTAL_SPACING) - HORIZONTAL_SPACING;
          let employeeX = layout.funcX + layout.funcWidth / 2 - totalEmployeeWidth / 2;

          func.reports.forEach((empName) => {
            const empCenterX = employeeX + NODE_WIDTH / 2;

            // Store position for project connections
            employeePositions.set(empName, { x: empCenterX, y: employeeY });

            // Employee node
            svg += renderNodeBox(
              employeeX,
              employeeY,
              empName,
              undefined,
              themeColors[2 + (funcIndex % (themeColors.length - 2))],
              'rect'
            );

            // Line from function to employee
            svg += `<line x1="${funcCenterX}" y1="${funcY + NODE_HEIGHT}" x2="${empCenterX}" y2="${employeeY}" stroke="#666" stroke-width="2" />`;

            employeeX += NODE_WIDTH + HORIZONTAL_SPACING;
          });
        }
      });
    }

    // Render projects on the right side
    if (structure.projects && structure.projects.length > 0) {
      const projectX = position.x + totalOrgWidth + HORIZONTAL_SPACING * 2;
      const projectStartY = ceoY + NODE_HEIGHT + VERTICAL_SPACING;
      const projectSpacing = VERTICAL_SPACING;

      structure.projects.forEach((project, projIndex) => {
        const projectY =
          projectStartY + projIndex * (NODE_HEIGHT + projectSpacing);
        const projectCenterX = projectX + NODE_WIDTH / 2;
        const projectCenterY = projectY + NODE_HEIGHT / 2;

        // Project node (purple/distinct color)
        svg += renderNodeBox(
          projectX,
          projectY,
          project.name,
          undefined,
          '#9C27B0',
          'hexagon'
        );

        // Dotted line from CEO to project
        svg += `<line x1="${ceoX + NODE_WIDTH / 2}" y1="${ceoY + NODE_HEIGHT / 2}" x2="${projectCenterX}" y2="${projectCenterY}" stroke="#666" stroke-width="2" stroke-dasharray="${showDottedLines ? '5,5' : ''}" />`;

        // Connect project to team members
        if (project.team) {
          project.team.forEach((memberName) => {
            const memberPos = employeePositions.get(memberName);
            if (memberPos) {
              svg += `<line x1="${memberPos.x}" y1="${memberPos.y + NODE_HEIGHT / 2}" x2="${projectCenterX}" y2="${projectCenterY}" stroke="#999" stroke-width="1" stroke-dasharray="${showDottedLines ? '3,3' : ''}" />`;
            }
          });
        }
      });
    }

    svg += '</g>';
    return svg;
  },
};

/**
 * Render a single node box
 */
function renderNodeBox(
  x: number,
  y: number,
  name: string,
  role: string | undefined,
  color: string,
  shape: string
): string {
  let svg = '';

  // Render shape
  switch (shape) {
    case 'hexagon':
      svg += renderHexagon(x, y, color);
      break;
    case 'rect':
      svg += `<rect x="${x}" y="${y}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" fill="${color}" stroke="#666" stroke-width="2" rx="0" />`;
      break;
    case 'rounded':
    default:
      svg += `<rect x="${x}" y="${y}" width="${NODE_WIDTH}" height="${NODE_HEIGHT}" fill="${color}" stroke="#666" stroke-width="2" rx="8" />`;
      break;
  }

  // Render text
  svg += `<text x="${x + NODE_WIDTH / 2}" y="${y + NODE_HEIGHT / 2 - (role ? 8 : 0)}" text-anchor="middle" dominant-baseline="middle" fill="#000" font-size="12" font-weight="bold">${escapeXml(name)}</text>`;

  if (role) {
    svg += `<text x="${x + NODE_WIDTH / 2}" y="${y + NODE_HEIGHT / 2 + 12}" text-anchor="middle" dominant-baseline="middle" fill="#000" font-size="10">${escapeXml(role)}</text>`;
  }

  return svg;
}

/**
 * Render hexagon shape
 */
function renderHexagon(x: number, y: number, color: string): string {
  const cx = x + NODE_WIDTH / 2;
  const cy = y + NODE_HEIGHT / 2;
  const rx = NODE_WIDTH / 2;
  const ry = NODE_HEIGHT / 2;

  const points = [
    [cx - rx * 0.5, cy - ry],
    [cx + rx * 0.5, cy - ry],
    [cx + rx, cy],
    [cx + rx * 0.5, cy + ry],
    [cx - rx * 0.5, cy + ry],
    [cx - rx, cy],
  ]
    .map((p) => `${p[0]},${p[1]}`)
    .join(' ');

  return `<polygon points="${points}" fill="${color}" stroke="#666" stroke-width="2" />`;
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
