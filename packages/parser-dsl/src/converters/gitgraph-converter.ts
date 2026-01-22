import type {
  GitGraphBranch,
  GitGraphCommit,
  GitGraphMerge,
  GitGraphProfile,
} from '@runiq/core';
import { ProfileType } from '@runiq/core';
import * as Langium from '../generated/ast.js';
import { unescapeString } from '../utils/index.js';

function parseBranch(statement: Langium.GitGraphBranchStatement): GitGraphBranch {
  const branch: GitGraphBranch = {
    id: unescapeString(statement.id),
  };

  for (const prop of statement.properties) {
    if (Langium.isGitGraphBranchLabelProperty(prop)) {
      branch.label = unescapeString(prop.label);
    } else if (Langium.isGitGraphBranchColorProperty(prop)) {
      branch.color = prop.color.replace(/^"|"$/g, '');
    } else if (Langium.isGitGraphBranchParentProperty(prop)) {
      branch.parent = unescapeString(prop.parent);
    }
  }

  return branch;
}

function parseCommit(statement: Langium.GitGraphCommitStatement): GitGraphCommit {
  const commit: GitGraphCommit = {
    id: unescapeString(statement.id),
    branch: '',
  };

  for (const prop of statement.properties) {
    if (Langium.isGitGraphCommitBranchProperty(prop)) {
      commit.branch = unescapeString(prop.branch);
    } else if (Langium.isGitGraphCommitLabelProperty(prop)) {
      commit.label = unescapeString(prop.label);
    } else if (Langium.isGitGraphCommitMessageProperty(prop)) {
      commit.message = unescapeString(prop.message);
    } else if (Langium.isGitGraphCommitAuthorProperty(prop)) {
      commit.author = unescapeString(prop.author);
    } else if (Langium.isGitGraphCommitTagProperty(prop)) {
      commit.tag = unescapeString(prop.tag);
    }
  }

  return commit;
}

function parseMerge(statement: Langium.GitGraphMergeStatement): GitGraphMerge {
  const merge: GitGraphMerge = {
    id: unescapeString(statement.id),
    from: '',
    into: '',
  };

  for (const prop of statement.properties) {
    if (Langium.isGitGraphMergeFromProperty(prop)) {
      merge.from = unescapeString(prop.from);
    } else if (Langium.isGitGraphMergeIntoProperty(prop)) {
      merge.into = unescapeString(prop.into);
    } else if (Langium.isGitGraphMergeLabelProperty(prop)) {
      merge.label = unescapeString(prop.label);
    } else if (Langium.isGitGraphMergeTagProperty(prop)) {
      merge.tag = unescapeString(prop.tag);
    }
  }

  return merge;
}

export function convertGitGraphProfile(
  profile: Langium.GitGraphProfile
): GitGraphProfile {
  const gitProfile: GitGraphProfile = {
    type: ProfileType.GITGRAPH,
    name: profile.name.replace(/^"|"$/g, ''),
    branches: [],
    commits: [],
    merges: [],
  };

  let order = 0;

  for (const statement of profile.statements) {
    if (Langium.isThemeDeclaration(statement)) {
      gitProfile.theme = statement.value;
    } else if (Langium.isGitGraphOrientationStatement(statement)) {
      gitProfile.orientation = statement.orientation as GitGraphProfile['orientation'];
    } else if (Langium.isGitGraphSpacingStatement(statement)) {
      for (const prop of statement.properties) {
        if (Langium.isGitGraphRowSpacingProperty(prop)) {
          gitProfile.rowSpacing = Number(prop.value);
        } else if (Langium.isGitGraphColumnSpacingProperty(prop)) {
          gitProfile.columnSpacing = Number(prop.value);
        }
      }
    } else if (Langium.isGitGraphBranchStatement(statement)) {
      gitProfile.branches.push(parseBranch(statement));
    } else if (Langium.isGitGraphCommitStatement(statement)) {
      const commit = parseCommit(statement);
      commit.order = order++;
      gitProfile.commits.push(commit);
    } else if (Langium.isGitGraphMergeStatement(statement)) {
      const merge = parseMerge(statement);
      merge.order = order++;
      gitProfile.merges.push(merge);
    }
  }

  return gitProfile;
}
