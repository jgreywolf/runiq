import type { ShapeDefinition, ShapeRenderContext } from '../../types.js';

/**
 * Team Hierarchy Shape - Grouped teams with leader and members
 * Shows organizational structure with team containers
 */
export const teamHierarchy: ShapeDefinition = {
  id: 'teamHierarchy',

  bounds: (ctx) => {
    const data = ctx?.node?.data as
      | {
          teams?: Array<{
            name: string;
            leader: string;
            members: string[];
          }>;
        }
      | undefined;

    const teams = data?.teams || [];
    const teamCount = teams.length || 2;
    const teamWidth = 280;
    const teamGap = 40;
    const padding = 40;

    const width = Math.max(
      700,
      teamCount * teamWidth + (teamCount - 1) * teamGap + padding * 2
    );

    return {
      width,
      height: 600,
    };
  },

  anchors: (ctx) => {
    const bounds = (teamHierarchy.bounds as any)(ctx);
    const width = bounds.width;
    return [
      { x: 0, y: 300, name: 'left' },
      { x: width, y: 300, name: 'right' },
      { x: width / 2, y: 0, name: 'top' },
      { x: width / 2, y: 600, name: 'bottom' },
    ];
  },

  render: (
    ctx: ShapeRenderContext,
    position: { x: number; y: number }
  ): string => {
    const data = ctx.node.data as {
      teams?: Array<{
        name: string;
        leader: string;
        members: string[];
      }>;
      colors?: string[];
    };

    const teams = data?.teams || [
      {
        name: 'Team A',
        leader: 'Leader A',
        members: ['Member A1', 'Member A2'],
      },
      {
        name: 'Team B',
        leader: 'Leader B',
        members: ['Member B1', 'Member B2', 'Member B3'],
      },
    ];
    const colors = data?.colors || ['#4A90E2', '#FF6B6B', '#4ECDC4', '#FFD93D'];

    const teamCount = teams.length;
    const teamWidth = 280;
    const teamGap = 40;
    const leaderHeight = 60;
    const memberHeight = 50;
    const memberWidth = 120;
    const padding = 20;

    // Calculate canvas width
    const canvasWidth = Math.max(
      700,
      teamCount * teamWidth + (teamCount - 1) * teamGap + padding * 2
    );

    let svg = `<g transform="translate(${position.x}, ${position.y})">`;

    // Helper function to wrap text
    const wrapText = (text: string, maxWidth: number): string[] => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length * 7 > maxWidth) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    // Calculate layout
    const totalWidth = teamCount * teamWidth + (teamCount - 1) * teamGap;
    const startX = (canvasWidth - totalWidth) / 2;

    // Draw each team
    teams.forEach((team, teamIdx) => {
      const teamX = startX + teamIdx * (teamWidth + teamGap);
      const teamY = 80;
      const color = colors[teamIdx % colors.length];

      // Calculate team container height
      const memberRows = Math.ceil(team.members.length / 2);
      const teamHeight =
        leaderHeight + padding * 2 + memberRows * (memberHeight + 15) + 40;

      // Team container
      svg += `<rect 
        x="${teamX}" 
        y="${teamY}" 
        width="${teamWidth}" 
        height="${teamHeight}" 
        fill="${color}" 
        fill-opacity="0.1" 
        stroke="${color}" 
        stroke-width="2" 
        rx="8"
      />`;

      // Team name header
      svg += `<rect 
        x="${teamX}" 
        y="${teamY}" 
        width="${teamWidth}" 
        height="40" 
        fill="${color}" 
        fill-opacity="0.3" 
        stroke="${color}" 
        stroke-width="2" 
        rx="8"
      />`;

      svg += `<text 
        x="${teamX + teamWidth / 2}" 
        y="${teamY + 20}" 
        text-anchor="middle" 
        alignment-baseline="middle" 
        font-family="Arial, sans-serif" 
        font-size="14" 
        font-weight="bold" 
        fill="#333333"
      >${team.name}</text>`;

      // Leader node
      const leaderY = teamY + 60;
      const leaderX = teamX + teamWidth / 2;

      svg += `<rect 
        x="${leaderX - memberWidth / 2}" 
        y="${leaderY}" 
        width="${memberWidth}" 
        height="${leaderHeight}" 
        fill="${color}" 
        fill-opacity="0.9" 
        stroke="#333333" 
        stroke-width="2" 
        rx="5"
      />`;

      // Leader crown icon
      svg += `<text 
        x="${leaderX - memberWidth / 2 + 15}" 
        y="${leaderY + 20}" 
        font-size="18" 
        fill="#FFD700"
      >👑</text>`;

      // Leader label
      const leaderLines = wrapText(team.leader, memberWidth - 40);
      const leaderLineHeight = 14;
      const leaderStartY =
        leaderY +
        leaderHeight / 2 -
        ((leaderLines.length - 1) * leaderLineHeight) / 2;

      leaderLines.forEach((line, idx) => {
        svg += `<text 
          x="${leaderX + 15}" 
          y="${leaderStartY + idx * leaderLineHeight}" 
          text-anchor="middle" 
          alignment-baseline="middle" 
          font-family="Arial, sans-serif" 
          font-size="12" 
          font-weight="bold" 
          fill="#FFFFFF"
        >${line}</text>`;
      });

      // Members
      let memberY = leaderY + leaderHeight + 30;

      team.members.forEach((member, memberIdx) => {
        const col = memberIdx % 2;
        const row = Math.floor(memberIdx / 2);

        if (col === 0 && memberIdx > 0) {
          memberY += memberHeight + 15;
        }

        const memberX =
          teamX +
          padding +
          col * (memberWidth + 20) +
          (teamWidth - 2 * padding - 2 * memberWidth - 20) / 2;
        const currentMemberY =
          leaderY + leaderHeight + 30 + row * (memberHeight + 15);

        // Connection line
        svg += `<line 
          x1="${leaderX}" 
          y1="${leaderY + leaderHeight}" 
          x2="${memberX + memberWidth / 2}" 
          y2="${currentMemberY}" 
          stroke="#999999" 
          stroke-width="1.5" 
          opacity="0.5"
        />`;

        // Member node
        svg += `<rect 
          x="${memberX}" 
          y="${currentMemberY}" 
          width="${memberWidth}" 
          height="${memberHeight}" 
          fill="#FFFFFF" 
          fill-opacity="0.9" 
          stroke="${color}" 
          stroke-width="2" 
          rx="5"
        />`;

        // Member label
        const memberLines = wrapText(member, memberWidth - 20);
        const memberLineHeight = 13;
        const memberStartY =
          currentMemberY +
          memberHeight / 2 -
          ((memberLines.length - 1) * memberLineHeight) / 2;

        memberLines.forEach((line, idx) => {
          svg += `<text 
            x="${memberX + memberWidth / 2}" 
            y="${memberStartY + idx * memberLineHeight}" 
            text-anchor="middle" 
            alignment-baseline="middle" 
            font-family="Arial, sans-serif" 
            font-size="11" 
            fill="#333333"
          >${line}</text>`;
        });
      });
    });

    svg += `</g>`;
    return svg;
  },
};
