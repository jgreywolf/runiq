import type { GlyphSetDefinition } from '../types.js';
import { GlyphSetError } from '../types.js';
import { getThemeColor } from '../themes.js';

/**
 * Team Hierarchy Glyphset - Grouped teams
 * Shows organizational structure with team containers
 */
export const teamHierarchyGlyphSet: GlyphSetDefinition = {
  id: 'teamHierarchy',
  name: 'Team Hierarchy',
  category: 'hierarchy',
  description:
    'Organizational structure showing teams with leaders and members in grouped containers',
  parameters: [
    {
      name: 'theme',
      type: 'string',
      required: false,
      default: 'blue',
      description: 'Color theme (blue, green, red, purple, orange)',
    },
  ],
  minItems: 4,
  maxItems: 20,
  generator: (params) => {
    const teamNames = (params.teams as string[]) || [];
    const members = (params.members as string[]) || [];
    const leaders = (params.leaders as string[]) || [];
    const theme = (params.theme as string) || 'professional';

    if (teamNames.length === 0 || members.length < 3) {
      throw new GlyphSetError(
        'teamHierarchy',
        `Team hierarchy requires at least 1 team and 3 members, got ${teamNames.length} team(s) and ${members.length} member(s)`
      );
    }

    // Create teams with leaders and members
    const teams: Array<{
      name: string;
      leader?: string;
      members: string[];
    }> = [];

    teamNames.forEach((teamName, idx) => {
      teams.push({
        name: teamName || `Team ${idx + 1}`,
        leader: leaders[idx] || teamName || 'Team Lead',
        members: [],
      });
    });

    // Distribute members across teams
    members.forEach((member, idx) => {
      const teamIdx = idx % teams.length;
      teams[teamIdx].members.push(member);
    });

    const colors = [0, 1, 2, 3].map((idx) =>
      getThemeColor(theme as Parameters<typeof getThemeColor>[0], idx)
    );

    return {
      astVersion: '1.0',
      nodes: [
        {
          id: 'teamHierarchy',
          shape: 'teamHierarchy',
          label: '',
          data: {
            teams,
            colors,
          },
        },
      ],
      edges: [],
    };
  },
};
