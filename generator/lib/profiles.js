/**
 * Assemble — Team Profiles
 * Pre-configured agent/workflow selections for common team types.
 * Profiles provide sensible defaults that can be overridden by explicit config.
 */

const PROFILES = {
  startup: {
    description: 'Lean team for early-stage startups — focus on shipping fast',
    agents: [
      'pm', 'architect', 'dev-backend', 'dev-frontend', 'dev-fullstack',
      'qa', 'devops', 'growth', 'copywriter', 'data', 'ux', 'contrarian',
    ],
    workflows: [
      'mvp-launch', 'feature-development', 'bug-fix', 'sprint-cycle',
      'hotfix-release', 'experimentation',
    ],
    governance: 'none',
    yolo: true,
  },
  enterprise: {
    description: 'Full team with governance for regulated environments',
    agents: 'all',
    workflows: 'all',
    governance: 'strict',
  },
  agency: {
    description: 'Marketing & content focus for agencies and consultancies',
    agents: [
      'pm', 'analyst', 'marketing', 'growth', 'ads', 'seo', 'content-seo',
      'geo-aio', 'copywriter', 'brand', 'storytelling', 'social', 'data',
      'ux', 'dev-frontend', 'contrarian',
    ],
    workflows: [
      'seo-content-pipeline', 'marketing-campaign', 'experimentation',
      'feature-development', 'sprint-cycle',
    ],
    governance: 'none',
  },
};

/**
 * Resolve profile defaults into config.
 * Profile values serve as defaults — only applied when keys were NOT
 * explicitly set in the config file (tracked via config._explicitKeys).
 * @param {object} config - Current configuration (with optional _explicitKeys Set)
 * @returns {object} - Config with profile defaults merged in
 */
function resolveProfile(config) {
  const profileName = config.profile || 'custom';
  if (profileName === 'custom' || !PROFILES[profileName]) {
    return config;
  }

  const profile = PROFILES[profileName];
  const resolved = { ...config };
  const explicit = config._explicitKeys || new Set();

  // Profile provides defaults only — explicit config keys always win
  if (!explicit.has('agents')) {
    resolved.agents = profile.agents;
  }

  if (!explicit.has('workflows')) {
    resolved.workflows = profile.workflows;
  }

  if (!explicit.has('governance')) {
    resolved.governance = profile.governance || 'none';
  }

  if (!explicit.has('yolo') && profile.yolo !== undefined) {
    resolved.yolo = profile.yolo;
  }

  return resolved;
}

module.exports = {
  PROFILES,
  resolveProfile,
};
