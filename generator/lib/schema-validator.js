/**
 * Assemble — Schema Validator
 * Validates agents, workflows, skills, and .assemble.yaml against expected schemas.
 * Zero external dependencies — uses simple structural checks.
 */

// ─── Schema definitions ────────────────────────────────────────────────────

const AGENT_SCHEMA = {
  required: ['name', 'description', 'marvel'],
  types: {
    name: 'string',
    description: 'string',
    marvel: 'string',
  },
};

const WORKFLOW_SCHEMA = {
  required: ['name', 'description', 'trigger', 'steps'],
  types: {
    name: 'string',
    description: 'string',
    trigger: 'string',
    output_dir: 'string',
  },
  stepSchema: {
    required: ['step', 'agent', 'action', 'outputs'],
    types: {
      step: 'number',
      agent: 'string',
      action: 'string',
    },
  },
};

const SKILL_SCHEMA = {
  required: ['name', 'description'],
  types: {
    name: 'string',
    description: 'string',
    trigger: 'string',
  },
};

const VALID_GOVERNANCE = ['none', 'standard', 'strict'];
const VALID_PROFILES = ['custom', 'startup', 'enterprise', 'agency'];
const VALID_PLATFORMS = [
  'cursor', 'windsurf', 'cline', 'roocode', 'copilot', 'kiro', 'trae',
  'antigravity', 'codebuddy', 'crush', 'iflow', 'kilocoder', 'opencode',
  'qwencoder', 'rovodev', 'claude-code-desktop', 'claude-code', 'codex',
  'gemini-cli', 'auggie', 'pi',
];

const CONFIG_SCHEMA = {
  types: {
    version: 'string',
    profile: 'string',
    langue_equipe: 'string',
    langue_output: 'string',
    output_dir: 'string',
    governance: 'string',
    yolo: 'boolean',
    mcp: 'boolean',
    memory: 'boolean',
    metrics: 'boolean',
    installed_at: 'string',
    updated_at: 'string',
  },
  enums: {
    governance: VALID_GOVERNANCE,
    profile: VALID_PROFILES,
  },
};

// ─── Core validation functions ─────────────────────────────────────────────

/**
 * Validate an object against a schema.
 * @param {object} obj - Object to validate
 * @param {object} schema - Schema with required/types fields
 * @param {string} label - Label for error messages
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateObject(obj, schema, label) {
  const errors = [];

  if (!obj || typeof obj !== 'object') {
    return { valid: false, errors: [`${label}: expected object, got ${typeof obj}`] };
  }

  // Check required fields
  for (const field of (schema.required || [])) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
      errors.push(`${label}: missing required field "${field}"`);
    }
  }

  // Check types
  for (const [field, expectedType] of Object.entries(schema.types || {})) {
    if (obj[field] !== undefined && obj[field] !== null) {
      const actualType = typeof obj[field];
      if (actualType !== expectedType) {
        errors.push(`${label}: field "${field}" expected ${expectedType}, got ${actualType}`);
      }
    }
  }

  // Check enums
  for (const [field, validValues] of Object.entries(schema.enums || {})) {
    if (obj[field] !== undefined && !validValues.includes(obj[field])) {
      errors.push(`${label}: field "${field}" must be one of [${validValues.join(', ')}], got "${obj[field]}"`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Domain-specific validators ────────────────────────────────────────────

/**
 * Validate a parsed agent.
 * @param {object} agent - { meta, content, fileName }
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
function validateAgent(agent) {
  const label = `Agent ${agent.fileName || 'unknown'}`;
  const { valid, errors } = validateObject(agent.meta, AGENT_SCHEMA, label);
  const warnings = [];

  // Check content has substance
  if (!agent.content || agent.content.trim().length < 50) {
    warnings.push(`${label}: content is very short (< 50 chars)`);
  }

  // Check Identity section exists
  if (agent.sections && !agent.sections['Identity']) {
    warnings.push(`${label}: missing ## Identity section`);
  }

  return { valid, errors, warnings };
}

/**
 * Validate a parsed workflow (from raw YAML string).
 * @param {object} workflow - { raw, fileName }
 * @param {string[]} knownAgentIds - List of valid agent IDs for cross-reference
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
function validateWorkflow(workflow, knownAgentIds = []) {
  const label = `Workflow ${workflow.fileName || 'unknown'}`;
  const errors = [];
  const warnings = [];

  const raw = workflow.raw || '';
  if (!raw.trim()) {
    return { valid: false, errors: [`${label}: empty workflow`], warnings: [] };
  }

  // Parse top-level fields with the flat YAML parser
  const { parseFlatYaml } = require('./parser');
  const parsed = parseFlatYaml(raw);

  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, errors: [`${label}: YAML did not produce an object`], warnings: [] };
  }

  // Check for steps via regex (parseFlatYaml doesn't handle nested step structures)
  const hasSteps = /^steps:/m.test(raw) && /- step:/m.test(raw);
  if (hasSteps) parsed.steps = true; // Mark as present for required-field check

  // Required top-level fields
  for (const field of WORKFLOW_SCHEMA.required) {
    if (!parsed[field]) {
      errors.push(`${label}: missing required field "${field}"`);
    }
  }

  // Validate trigger format
  if (parsed.trigger && typeof parsed.trigger === 'string') {
    if (!parsed.trigger.startsWith('/')) {
      warnings.push(`${label}: trigger "${parsed.trigger}" should start with /`);
    }
  }

  // Validate steps using the existing regex-based step parser
  const { parseWorkflowSteps } = require('./template-engine');
  const steps = parseWorkflowSteps(raw);

  if (steps.length === 0 && hasSteps) {
    warnings.push(`${label}: steps section found but no steps could be parsed`);
  }

  const stepNums = new Set();
  for (const step of steps) {
    const stepLabel = `${label} step ${step.num || '?'}`;

    // Required step fields
    if (!step.agent) errors.push(`${stepLabel}: missing required field "agent"`);
    if (!step.action) errors.push(`${stepLabel}: missing required field "action"`);
    if (!step.outputs || step.outputs.length === 0) errors.push(`${stepLabel}: missing required field "outputs"`);

    // Duplicate step number
    if (step.num !== undefined) {
      if (stepNums.has(step.num)) {
        errors.push(`${stepLabel}: duplicate step number ${step.num}`);
      }
      stepNums.add(step.num);
    }

    // Cross-reference agents (warning, not error — profiles may filter agents)
    if (step.agent && knownAgentIds.length > 0 && !knownAgentIds.includes(step.agent)) {
      warnings.push(`${stepLabel}: references agent "${step.agent}" not in current agent set`);
    }

    // Validate depends_on references
    if (Array.isArray(step.depends_on)) {
      for (const dep of step.depends_on) {
        const depNum = typeof dep === 'string' ? parseInt(dep, 10) : dep;
        if (step.num !== undefined && depNum >= step.num) {
          errors.push(`${stepLabel}: depends_on [${dep}] references step >= current (${step.num})`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate a parsed skill.
 * @param {object} skill - { meta, content, fileName }
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
function validateSkill(skill) {
  const label = `Skill ${skill.fileName || 'unknown'}`;
  const { valid, errors } = validateObject(skill.meta, SKILL_SCHEMA, label);
  const warnings = [];

  if (!skill.content || skill.content.trim().length < 20) {
    warnings.push(`${label}: content is very short (< 20 chars)`);
  }

  return { valid, errors, warnings };
}

/**
 * Validate a parsed .assemble.yaml config.
 * @param {object} config - Parsed config object
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
function validateConfig(config) {
  const label = 'Config .assemble.yaml';
  const errors = [];
  const warnings = [];

  // Type checks
  for (const [field, expectedType] of Object.entries(CONFIG_SCHEMA.types)) {
    if (config[field] !== undefined && config[field] !== null) {
      const actualType = typeof config[field];
      if (actualType !== expectedType) {
        errors.push(`${label}: field "${field}" expected ${expectedType}, got ${actualType}`);
      }
    }
  }

  // Enum checks
  for (const [field, validValues] of Object.entries(CONFIG_SCHEMA.enums)) {
    if (config[field] !== undefined && !validValues.includes(config[field])) {
      errors.push(`${label}: field "${field}" must be one of [${validValues.join(', ')}], got "${config[field]}"`);
    }
  }

  // Platform validation
  if (Array.isArray(config.platforms)) {
    for (const p of config.platforms) {
      if (!VALID_PLATFORMS.includes(p)) {
        warnings.push(`${label}: unknown platform "${p}"`);
      }
    }
  }

  // Check platforms is present and non-empty
  if (!config.platforms || (Array.isArray(config.platforms) && config.platforms.length === 0)) {
    warnings.push(`${label}: no platforms selected`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate all sources in bulk.
 * @param {object} sources - { agents, skills, workflows, config }
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
function validateAll({ agents = [], skills = { shared: [], specific: [] }, workflows = [], config = {} }) {
  const allErrors = [];
  const allWarnings = [];

  // Extract known agent IDs
  const knownAgentIds = agents.map(a =>
    (a.fileName || '').replace(/^AGENT-/, '').replace(/\.md$/, '')
  );

  // Validate config
  const configResult = validateConfig(config);
  allErrors.push(...configResult.errors);
  allWarnings.push(...configResult.warnings);

  // Validate agents
  for (const agent of agents) {
    const result = validateAgent(agent);
    allErrors.push(...result.errors);
    allWarnings.push(...(result.warnings || []));
  }

  // Validate workflows
  for (const workflow of workflows) {
    const result = validateWorkflow(workflow, knownAgentIds);
    allErrors.push(...result.errors);
    allWarnings.push(...(result.warnings || []));
  }

  // Validate skills
  const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
  for (const skill of allSkills) {
    const result = validateSkill(skill);
    allErrors.push(...result.errors);
    allWarnings.push(...(result.warnings || []));
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

module.exports = {
  validateAgent,
  validateWorkflow,
  validateSkill,
  validateConfig,
  validateAll,
  VALID_PLATFORMS,
  VALID_GOVERNANCE,
  VALID_PROFILES,
};
