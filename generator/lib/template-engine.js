/**
 * Assemble — Template Engine
 * Transforms source agents/skills/workflows into target format
 */

const { injectLanguage } = require('./i18n');

/**
 * Prepares an agent for generation by injecting language and output config
 * @param {object} agent - Parsed agent { meta, content, sections }
 * @param {object} config - Configuration { langue_equipe, langue_output, output_dir }
 * @returns {object} - Enriched agent
 */
function prepareAgent(agent, config) {
  let content = agent.content;

  // Inject language instructions
  if (config.langue_equipe) {
    content = injectLanguage(content, config.langue_equipe, config.langue_output || config.langue_equipe);
  }

  // Inject output config
  const outputBlock = `## Output Directory

Your deliverables must be produced in the directory: \`${config.output_dir || './assemble-output'}\`
Follow the folder structure defined by the current workflow.
`;

  if (!content.includes('## Output Directory')) {
    content = content.trim() + '\n\n' + outputBlock;
  }

  // Strip search protocol if search is disabled
  const searchRegex = /<!--\s*SEARCH:START\s*-->[\s\S]*?<!--\s*SEARCH:END\s*-->\n*/g;
  if (!config.search) {
    content = content.replace(searchRegex, '');
  }

  // Also strip from sections (used by renderAsRules and renderAsYaml for Codex/Pi)
  let sections = agent.sections;
  if (!config.search && sections) {
    sections = { ...sections };
    for (const [title, body] of Object.entries(sections)) {
      if (title === 'Research Protocol' || body.includes('SEARCH:START')) {
        delete sections[title];
      }
    }
  }

  // ── Discovery Protocol injection (dev/tech agents only) ──────────────────
  const DEV_TECH_AGENTS = new Set([
    'architect', 'dev-backend', 'dev-frontend', 'dev-fullstack', 'dev-mobile',
    'db', 'devops', 'qa', 'security', 'redteam', 'automation', 'ai-engineer',
  ]);

  const agentId = (agent.fileName || '').replace(/^AGENT-/, '').replace(/\.md$/, '');
  if (DEV_TECH_AGENTS.has(agentId) && !content.includes('## Discovery Protocol')) {
    const discoveryBlock = `## Discovery Protocol

Before writing any code or making technical recommendations, you MUST explore the project:

1. **Structure** — Map the project tree: key directories, entry points, config files
2. **Dependencies** — Read package.json / requirements.txt / go.mod / Cargo.toml or equivalent
3. **Patterns** — Identify architecture patterns, naming conventions, file organization
4. **Context** — Read relevant existing code before modifying or extending it
5. **Resume** — Summarize findings in 5-10 bullet points before proceeding

Skip only if you have already explored this codebase in the current session.
`;
    // Insert before ## Working Language or ## Output Directory
    if (content.includes('\n## Working Language')) {
      content = content.replace(/(\n## Working Language)/, '\n' + discoveryBlock + '$1');
    } else if (content.includes('\n## Output Directory')) {
      content = content.replace(/(\n## Output Directory)/, '\n' + discoveryBlock + '$1');
    } else {
      content = content.trim() + '\n\n' + discoveryBlock;
    }
  }

  // ── Project conventions injection ───────────────────────────────────────
  if (config._conventions && !content.includes('## Project Conventions')) {
    const conventionsBlock = `## Project Conventions

${config._conventions}
`;
    if (content.includes('\n## Working Language')) {
      content = content.replace(/(\n## Working Language)/, '\n' + conventionsBlock + '$1');
    } else if (content.includes('\n## Output Directory')) {
      content = content.replace(/(\n## Output Directory)/, '\n' + conventionsBlock + '$1');
    } else {
      content = content.trim() + '\n\n' + conventionsBlock;
    }
  }

  return { ...agent, content, sections };
}

/**
 * Generates agent file content for a given platform
 * @param {object} agent - Parsed and prepared agent
 * @param {string} format - Target format ('markdown', 'rules', 'yaml')
 * @returns {string} - Formatted content
 */
function renderAgent(agent, format = 'markdown') {
  switch (format) {
    case 'markdown':
      return renderAsMarkdown(agent);
    case 'rules':
      return renderAsRules(agent);
    case 'yaml':
      return renderAsYaml(agent);
    default:
      return renderAsMarkdown(agent);
  }
}

/**
 * Renders an agent in Markdown format (used by most platforms)
 */
function renderAsMarkdown(agent) {
  const { meta, content } = agent;
  let output = '';

  if (meta.name) {
    output += `---\n`;
    for (const [key, value] of Object.entries(meta)) {
      if (Array.isArray(value)) {
        output += `${key}: [${value.join(', ')}]\n`;
      } else {
        output += `${key}: ${value}\n`;
      }
    }
    output += `---\n\n`;
  }

  output += content;
  return output;
}

/**
 * Renders an agent in Rules format (for .cursorrules, .windsurfrules, etc.)
 * Format plus compact, sans frontmatter
 */
function renderAsRules(agent) {
  const { meta, sections } = agent;
  let output = '';

  output += `# ${meta.name || 'Agent'} — ${meta.description || ''}\n\n`;

  for (const [title, body] of Object.entries(sections)) {
    output += `## ${title}\n${body}\n\n`;
  }

  return output;
}

/**
 * Renders an agent in YAML format (for Kiro, OpenCode, etc.)
 */
function renderAsYaml(agent) {
  const { meta, sections } = agent;
  let output = '';

  output += `name: "${meta.name || ''}"\n`;
  output += `description: "${meta.description || ''}"\n`;
  output += `role: "${meta.marvel || ''}"\n`;
  output += `instructions: |\n`;

  for (const [title, body] of Object.entries(sections)) {
    const indented = body.split('\n').map(l => `    ${l}`).join('\n');
    output += `  ## ${title}\n${indented}\n\n`;
  }

  return output;
}

/**
 * Generates a command file for a platform
 * @param {string} commandsYaml - Contents of commands.yaml
 * @param {string} format - Target format
 * @returns {string}
 */
function renderCommands(commandsYaml, format = 'markdown') {
  if (format === 'markdown') {
    return `# Assemble Commands\n\n${commandsYaml}`;
  }
  return commandsYaml;
}

/**
 * Generates the orchestrator content for a platform
 * @param {object} orchestrator - Parsed orchestrator
 * @param {object} config - Configuration
 * @returns {string}
 */
function renderOrchestrator(orchestrator, config) {
  return prepareAgent(orchestrator, config).content;
}

/**
 * Generates a workflow file for a platform
 * @param {object} workflow - Parsed workflow
 * @param {string} format - Target format
 * @returns {string}
 */
function renderWorkflow(workflow, format = 'yaml') {
  if (format === 'markdown') {
    return `# Workflow : ${workflow.fileName}\n\n\`\`\`yaml\n${workflow.raw}\n\`\`\``;
  }
  return workflow.raw;
}

// ─── Shared helpers for adapters ──────────────────────────────────────────────

/** Extract the functional agent ID from source filename: AGENT-pm.md → pm */
function agentId(agent) {
  return (agent.fileName || '').replace(/^AGENT-/, '').replace(/\.md$/, '');
}

/** Return the Marvel slug from meta.name (e.g. professor-x, tony-stark) */
function marvelSlug(agent) {
  return (agent.meta.name || agentId(agent)).toLowerCase().replace(/\s+/g, '-');
}

/** Extract short Marvel display name: "Professor X (Charles Xavier) — ..." → "Professor X" */
function marvelDisplayName(agent) {
  const raw = agent.meta.marvel || agent.meta.name || '';
  return raw.split('—')[0].split('(')[0].trim();
}

/** Extract skill slug from trigger or name */
function skillSlug(skill) {
  const trigger = (skill.meta.trigger || '').replace(/^\//, '');
  return (trigger || skill.meta.name || (skill.fileName || '').replace('.md', ''))
    .toLowerCase().replace(/\s+/g, '-');
}

/** Extract workflow slug from trigger in raw YAML */
function workflowSlug(workflow) {
  const triggerMatch = (workflow.raw || '').match(/trigger:\s*\/?([\w-]+)/);
  return triggerMatch ? triggerMatch[1] : (workflow.fileName || '').replace(/\.(yaml|yml)$/, '');
}

/** Extract a field value from raw YAML */
function workflowField(raw, field) {
  const match = (raw || '').match(new RegExp(`${field}:\\s*"?([^"\\n]+)"?`));
  return match ? match[1].trim() : '';
}

/** Parse workflow steps from raw YAML into structured array */
function parseWorkflowSteps(raw) {
  const steps = [];
  const blocks = (raw || '').split(/(?=- step:)/);
  for (const block of blocks) {
    const stepMatch = block.match(/step:\s*(\d+)/);
    if (!stepMatch) continue;
    const step = {
      num: parseInt(stepMatch[1], 10),
      agent: (block.match(/agent:\s*([\w-]+)/) || [])[1] || '',
      action: (block.match(/action:\s*"([^"]+)"/) || [])[1] || '',
      outputs: [], inputs: [], depends_on: [],
    };
    const om = block.match(/outputs:\s*\[([^\]]+)\]/);
    if (om) step.outputs = om[1].split(',').map(o => o.trim());
    const im = block.match(/inputs:\s*\[([^\]]+)\]/);
    if (im) step.inputs = im[1].split(',').map(i => i.trim());
    const dm = block.match(/depends_on:\s*\[([^\]]*)\]/);
    if (dm && dm[1].trim()) step.depends_on = dm[1].split(',').map(d => d.trim());
    steps.push(step);
  }
  return steps;
}

/**
 * Render workflow steps as human-readable instructions.
 * @param {object} workflow - parsed workflow
 * @param {object} agentLookup - { agentId: { marvelSlug, displayName } }
 * @param {object} config
 * @returns {string}
 */
function renderWorkflowInstructions(workflow, agentLookup, config) {
  const steps = parseWorkflowSteps(workflow.raw);
  const outputDir = (config || {}).output_dir || './assemble-output';
  let out = `## Execution Instructions\n\nOutput directory: \`${outputDir}\`\n\n`;
  if (steps.length === 0) {
    out += '```yaml\n' + workflow.raw + '\n```\n';
    return out;
  }
  for (const step of steps) {
    const info = agentLookup[step.agent] || {};
    const display = info.displayName || step.agent;
    const ref = info.marvelSlug || step.agent;
    out += `### Step ${step.num} — ${display} (${ref})\n\n`;
    out += `**Action :** ${step.action}\n\n`;
    if (step.inputs.length) out += '**Inputs :** ' + step.inputs.map(i => `\`${i}\``).join(', ') + '\n\n';
    if (step.depends_on.length) out += `**Depends on:** step(s) ${step.depends_on.join(', ')}\n\n`;
    out += '**Deliverables:**\n';
    for (const o of step.outputs) out += `- \`${o}\`\n`;
    out += '\n';
  }
  return out;
}

/**
 * Generate a compact command registry as markdown.
 * Included in every platform's rules so the AI knows how to respond to slash commands.
 * @param {Array} agents - Agent list
 * @param {object} skills - Skills (kept for backward compat with 20 adapters, not used in output)
 * @param {Array} workflows - Workflow list
 * @param {string} governance - Governance level ('none' or 'standard')
 */
function renderCommandRegistry(agents, skills, workflows, governance = 'none', yolo = false) {
  let out = '## Command Reference\n\n';
  out += 'When the user types a command starting with `/`, execute it as described below.\n\n';

  // 10 primary commands
  out += '### Primary Commands\n\n';
  out += '| Command | Action |\n';
  out += '|---------|--------|\n';
  out += '| `/go <request>` | Jarvis routes — assesses complexity, selects agents, applies methodology |\n';
  out += '| `/party <request>` | Persistent multi-agent collaborative session |\n';
  out += '| `/dismiss` | End session |\n';
  out += '| `/help` | Show catalog (agents, workflows, examples) |\n';
  out += '| `/review` | Code review pipeline (4 agents) |\n';
  out += '| `/bugfix` | Bug fix workflow (3 agents) |\n';
  out += '| `/feature` | Feature development (5 agents) |\n';
  out += '| `/sprint` | Sprint cycle (5 agents) |\n';
  out += '| `/release` | Release cycle (8 agents) |\n';
  out += '| `/mvp` | MVP launch (9 agents) |\n';
  out += '| `/doom <subject>` | Doctor Doom strategic verdict — critical decision analysis |\n';
  out += '\n';

  // Agent access
  out += '### Agent Access\n\n';
  out += 'Use `@marvel-name` to invoke any agent directly (e.g., `@tony-stark`, `@professor-x`).\n\n';

  // Persistence rules
  out += '### Persistence Rules\n\n';
  out += '- When an agent is invoked via `@agent-name`, **stay in character** for ALL subsequent messages until `/dismiss`.\n';
  out += '- When `/party` is used, multiple agents are convoked and ALL stay active with a combined footer.\n';
  out += '- **Only `/dismiss` ends the session.** No other command or natural message ends it.\n';

  // Complexity methodology (baseline — always present)
  out += '\n### Complexity & Methodology\n\n';
  out += 'For every `/go` request, assess complexity:\n';
  out += '- **TRIVIAL**: single agent, direct answer\n';
  out += '- **MODERATE**: 2-3 agents, sequential execution\n';
  out += '- **COMPLEX**: Spec-Driven Methodology with 6 phases:\n';
  out += '  0. BRAINSTORM → brainstorm.md (multi-agent analysis of the brief)\n';
  out += '  1. SPECIFY → spec.md → user validates\n';
  out += '  2. PLAN → plan.md → user validates\n';
  out += '  3. TASKS → tasks.md → user validates\n';
  out += '  4. IMPLEMENT → code + tests\n';
  out += '  5. CLOSE → `_quality.md` (delivered, validated, risks remaining, lessons learned)\n\n';
  out += 'Phase 5 CLOSE is automatic for all COMPLEX workflows (4+ steps).\n';

  // YOLO mode (if enabled)
  if (yolo) {
    out += '\n### YOLO Mode (ACTIVE)\n\n';
    out += 'YOLO mode removes validation pauses between phases — it does NOT remove the phases themselves.\n\n';
    out += '**What YOLO changes:** no user approval required between workflow steps. Agents chain automatically.\n\n';
    out += '**What YOLO does NOT change — COMPLEX tasks MUST follow all 6 phases:**\n';
    out += '- BRAINSTORM → produce brainstorm.md (Jarvis selects relevant agents, each speaks in character, Jarvis writes full structured synthesis with consensus/divergences/risks/conclusion)\n';
    out += '- SPECIFY → produce spec.md (delegate to PM agent, or closest available)\n';
    out += '- PLAN → produce plan.md (delegate to architect agent, or PM if unavailable)\n';
    out += '- TASKS → produce tasks.md (delegate to scrum agent, or PM if unavailable)\n';
    out += '- IMPLEMENT → code + tests (delegate to specialist dev agents)\n';
    out += '- CLOSE → produce _quality.md (Jarvis)\n';
    out += '- Do NOT skip any phase. Do NOT jump to IMPLEMENT even if the brief seems complete.\n';
    out += '- Delegate each phase to the most relevant available agent.\n\n';
    out += '**Mandatory stop conditions — ALWAYS pause and ask the user:**\n';
    out += '- 🔴 **Destructive production actions**: deployments to production, database migrations on live data, irreversible deletions\n';
    out += '- 🔴 **Missing information**: when the agent cannot proceed without human input (credentials, business decisions, ambiguous requirements)\n';
    out += '- 🔴 **External side effects**: sending emails, posting to external APIs, creating cloud resources with cost implications\n\n';
    out += '**What stays active in YOLO:**\n';
    out += '- `_manifest.yaml` updated after every step (traceability)\n';
    out += '- `_summary.md` produced at workflow end (review point)\n';
    out += '- `_quality.md` produced for all workflows with 2+ steps\n';
    out += '- Cross-session memory updated (if enabled)\n';
    out += '- All agent context injection (inputs/outputs chain preserved)\n';
    out += '- Pre-execution validation (structural checks still enforced)\n';
  }

  // YOLO escalation levels (always documented, regardless of yolo config)
  out += '\n### YOLO Escalation (runtime-only, human-activated)\n\n';
  out += '| Level | Risk | Activated by |\n';
  out += '|-------|------|--------------|\n';
  out += '| `/yolo-hardcore` | Interprets deductible info, allows dev/staging destructive actions | Human command only |\n';
  out += '| `/yolo-full` | No guardrails, no stops, full autonomy including production | Human command only |\n\n';
  out += '**Agents MUST refuse** to activate Hardcore or Full. Only a human typing the command directly can do it.\n';

  // Governance (if enabled)
  if (governance && governance !== 'none') {
    out += '\n### Governance (' + governance + ')\n\n';
    out += 'This project has governance enabled. In addition to the baseline methodology, apply:\n\n';
    out += '**Decision Gates:**\n';
    out += '- TRIVIAL tasks: agent acts autonomously\n';
    out += '- MODERATE tasks: produce deliverable → user validates before next step\n';
    out += '- COMPLEX tasks: phased approval — each phase requires explicit user approval before proceeding\n\n';
    out += '**Change Risk Assessment:**\n';
    out += '- LOW risk (/bugfix, /review, /docs): act, summarize post-action\n';
    out += '- MEDIUM risk (/feature, /sprint, /refactor): plan required before action\n';
    out += '- HIGH risk (/release, /hotfix, /mvp, /upgrade): risk assessment + rollback plan + approval gate\n';

    if (governance === 'strict') {
      out += '\n**RBAC Notice:** This project uses strict governance. Sensitive agents (security, devops, finance, legal) require explicit user authorization before executing. All actions are logged to `_audit.md`.\n';
    }
  }

  return out;
}

/**
 * Render cross-session memory instructions for routing.
 * @param {object} config
 * @returns {string}
 */
function renderMemoryInstructions(config) {
  if (!config.memory) return '';
  const memPath = `${config.output_dir || './assemble-output'}/_memory.md`;
  return `\n## Cross-Session Memory\n\n` +
    `This project has cross-session memory enabled.\n\n` +
    `**At session start:**\n` +
    `- Read \`${memPath}\` for persistent context from previous sessions\n\n` +
    `**After each workflow or significant interaction:**\n` +
    `- Append key decisions, blockers, and outcomes to the Session Log section\n` +
    `- Update Active Context with current project state\n` +
    `- Record important decisions with rationale in Key Decisions\n` +
    `- Keep entries concise — this file persists across sessions\n\n` +
    `**Validation:** After updating, verify the file was modified by reading it back. ` +
    `If the Session Log section still contains only the HTML comment placeholder, the update failed — retry.\n\n`;
}

/**
 * Render metrics/observability template instructions.
 * @param {object} config
 * @returns {string}
 */
function renderMetricsTemplate(config) {
  if (!config.metrics) return '';
  const metricsPath = `${config.output_dir || './assemble-output'}/_metrics.md`;
  return `\n## Metrics & Observability\n\n` +
    `This project has workflow metrics enabled. After each workflow completion:\n` +
    `- Append a row to \`${metricsPath}\` with: workflow name, timestamps, duration, steps, agents, status\n` +
    `- Update agent performance metrics periodically\n` +
    `- Use metrics to identify bottlenecks and improve workflow efficiency\n\n` +
    `**Validation:** After appending, read \`${metricsPath}\` and verify the new row appears in the Metrics Format table. ` +
    `If the table still contains only the HTML comment placeholder, the append failed — retry.\n\n`;
}

/**
 * Render web search instructions for routing.
 * Injected into routing rules when config.search is enabled.
 * @param {object} config
 * @returns {string}
 */
function renderSearchInstructions(config) {
  if (!config.search) return '';
  return `\n## Web Search Policy\n\n` +
    `This project has web search enabled. Agents can use the \`web-research\` skill to gather external information.\n\n` +
    `**Proportionality rules — adapt search effort to task complexity:**\n` +
    `- **TRIVIAL**: no search unless the agent lacks critical knowledge (quick lookup only)\n` +
    `- **MODERATE**: targeted search to validate assumptions or fill knowledge gaps (1-3 queries)\n` +
    `- **COMPLEX**: thorough research phase during BRAINSTORM — compare approaches, check latest docs, validate architecture choices\n\n` +
    `**Guidelines:**\n` +
    `- Always prefer project context and existing deliverables over external search\n` +
    `- Cite sources when search results influence a decision\n` +
    `- Do not search for information already available in the codebase or previous deliverables\n` +
    `- Use the \`web-research\` skill for structured research tasks (multi-query, synthesis)\n\n`;
}

/**
 * Generate routing rules for Jarvis.
 * Contains identity, complexity assessment, domain→agent mapping, and methodology.
 * @param {Array} agents
 * @param {Array} workflows
 * @param {object} [config] - Optional config for memory/metrics sections
 */
function renderRoutingRules(agents, workflows, config) {
  let out = '# Jarvis — Routing Intelligence\n\n';
  out += `You are Jarvis, orchestrator of a ${agents.length}-agent AI team (Assemble by Cohesium AI).\n`;
  out += 'You don\'t do the work — you identify WHO should intervene, WHEN, in WHAT ORDER, and with WHAT context.\n\n';

  // Complexity assessment
  out += '## Complexity Assessment\n\n';
  out += 'For every `/go` request, assess complexity first:\n\n';
  out += '**TRIVIAL** — Simple question, single agent, direct answer. Route to the most relevant agent.\n';
  out += '**MODERATE** — Clear task, 2-3 agents. Select agents, execute sequentially, produce deliverables.\n';
  out += '**COMPLEX** — Multi-domain, high stakes, ambitious. Apply Spec-Driven Methodology:\n\n';
  out += '0. **BRAINSTORM** (Jarvis + relevant agents) → brainstorm.md → multi-agent analysis\n';
  out += '1. **SPECIFY** (@professor-x) → spec.md → user validates\n';
  out += '2. **PLAN** (@tony-stark) → plan.md → user validates\n';
  out += '3. **TASKS** (@captain-america) → tasks.md → user validates\n';
  out += '4. **IMPLEMENT** (Dev agents) → code + tests\n';
  out += '5. **CLOSE** (Jarvis) → _quality.md\n\n';

  // Domain mapping
  out += '## Domain → Agent Mapping\n\n';
  out += '```\n';
  out += 'architecture, stack, scalability → @tony-stark\n';
  out += 'API, backend, server, endpoint → @bruce-banner, @doctor-strange\n';
  out += 'UI, frontend, React, components → @spider-man\n';
  out += 'fullstack, MVP, debug, integration → @mr-fantastic\n';
  out += 'mobile, React Native, Flutter → @ant-man\n';
  out += 'CI/CD, Docker, Kubernetes, deploy → @thor\n';
  out += 'tests, QA, regression, coverage, E2E, end-to-end, Playwright, Cypress → @hawkeye\n';
  out += 'security, vulnerability, pentest, audit → @punisher\n';
  out += 'red team, hacking, exploit, injection, offensive security → @microchip\n';
  out += 'automation, workflow, RPA → @quicksilver\n';
  out += 'product, roadmap, OKR, user stories → @professor-x\n';
  out += 'specs, requirements, analysis → @nick-fury\n';
  out += 'sprint, agile, scrum, ceremony → @captain-america\n';
  out += 'legal, GDPR, compliance → @she-hulk\n';
  out += 'marketing, GTM, positioning → @star-lord\n';
  out += 'growth, acquisition, funnel → @rocket-raccoon\n';
  out += 'ads, Google Ads, Meta Ads → @gamora\n';
  out += 'SEO technique, crawl, indexation → @black-widow\n';
  out += 'content SEO, article, blog → @storm\n';
  out += 'GEO, AIO, generative search → @jean-grey\n';
  out += 'copywriting, slogan, messaging → @loki\n';
  out += 'brand, identity, tone of voice → @black-panther\n';
  out += 'storytelling, narrative → @silver-surfer\n';
  out += 'social media, community → @ms-marvel\n';
  out += 'data, analytics, dashboard → @beast\n';
  out += 'AI, ML, LLM, fine-tuning → @vision\n';
  out += 'UX, wireframe, design → @invisible-woman\n';
  out += 'pricing, budget, P&L, finance → @iron-fist\n';
  out += 'customer, onboarding, churn → @pepper-potts\n';
  out += 'press, PR, communication → @phil-coulson\n';
  out += '```\n\n';

  // Workflow triggers
  out += '## Workflow Shortcuts\n\n';
  out += '| Command | Workflow |\n';
  out += '|---------|----------|\n';
  for (const wf of workflows) {
    const slug = workflowSlug(wf);
    const name = workflowField(wf.raw, 'name') || slug;
    out += `| /${slug} | ${name} |\n`;
  }
  out += '\n';

  // Governance
  out += '## Governance\n\n';
  out += 'If the project has `governance: standard` or `governance: strict` in `.assemble.yaml`, load and apply rules from\n';
  out += '`.claude/rules/governance/governance.md` — decision gates, risk assessment, and quality checkpoints.\n';
  out += 'Strict adds: audit trail (`_audit.md`), RBAC for sensitive agents, NIST AI RMF mapping.\n';
  out += 'Default: no governance overhead.\n\n';

  // YOLO mode
  if (config && config.yolo) {
    // Build agent availability set for conditional @mentions
    const availableIds = new Set((agents || []).map(a => agentId(a)));
    const specAgent = availableIds.has('pm') ? ' (@professor-x)' : '';
    const planAgent = availableIds.has('architect') ? ' (@tony-stark)' : '';
    const tasksAgent = availableIds.has('scrum') ? ' (@captain-america)' : '';

    out += '## YOLO Mode (ACTIVE)\n\n';
    out += 'This project runs in **non-interactive chaining mode**. Jarvis orchestrates the full workflow without pausing for human validation **between phases**.\n\n';
    out += '**What YOLO changes:**\n';
    out += '- YOLO removes the validation pauses between phases — you do NOT wait for user approval between steps\n';
    out += '- Each agent reads the previous agent\'s outputs and proceeds immediately\n';
    out += '- If a step produces incomplete or incorrect output, iterate and fix before moving on\n';
    out += '- Use all available tools to verify your own work\n\n';
    out += '**What YOLO does NOT change — the Spec-Driven Methodology remains MANDATORY for COMPLEX tasks:**\n';
    out += '- You MUST execute all 6 phases in sequence: BRAINSTORM → SPECIFY → PLAN → TASKS → IMPLEMENT → CLOSE\n';
    out += '- You MUST produce each deliverable: brainstorm.md, spec.md, plan.md, tasks.md before any implementation\n';
    out += '- You MUST delegate each phase to the most relevant available agent:\n';
    out += '  0. BRAINSTORM → Jarvis selects 3-8 relevant agents (+ Deadpool), each agent speaks in character, Jarvis writes structured brainstorm.md (consensus, divergences, risks, conclusion)\n';
    out += `  1. SPECIFY → delegate to PM agent${specAgent} (produce spec.md)\n`;
    out += `  2. PLAN → delegate to architect agent${planAgent}${!availableIds.has('architect') ? ', or PM if unavailable' : ''} (produce plan.md)\n`;
    out += `  3. TASKS → delegate to scrum agent${tasksAgent}${!availableIds.has('scrum') ? ', or PM if unavailable' : ''} (produce tasks.md)\n`;
    out += '  4. IMPLEMENT → delegate to the appropriate specialist agents\n';
    out += '  5. CLOSE → Jarvis produces _quality.md\n';
    out += '- Do NOT skip any phase, even if the user\'s brief seems detailed enough to jump to implementation\n';
    out += '- Do NOT do the work yourself — delegate to specialist agents\n\n';
    out += '**MANDATORY STOPS — always pause and ask the human:**\n';
    out += '- 🔴 Destructive production actions (deploy to prod, migrate live DB, irreversible deletes)\n';
    out += '- 🔴 Missing information only a human can provide (credentials, business decisions, ambiguous requirements)\n';
    out += '- 🔴 External side effects with real-world impact (sending emails, creating cloud resources, posting to APIs)\n\n';
    out += '**Always active even in YOLO:**\n';
    out += '- `_manifest.yaml` updated after every step\n';
    out += '- `_summary.md` at workflow end\n';
    out += '- `_quality.md` for all workflows with 2+ steps\n';
    out += '- Pre-execution validation (structural checks)\n';
    out += '- Agent context injection (input/output chain)\n';
    out += '- Cross-session memory (if enabled)\n\n';
  }

  // YOLO Escalation Levels (runtime-only, human-activated)
  out += '## YOLO Escalation Levels\n\n';
  out += 'Beyond the standard YOLO mode (configured in `.assemble.yaml`), two escalation levels exist.\n';
  out += 'These are **runtime-only** — never in config, never auto-activated.\n\n';
  out += '| Level | Command | Who can activate | Stops for |\n';
  out += '|-------|---------|------------------|-----------|\n';
  out += '| **YOLO** | `yolo: true` in config | Config or wizard | Prod actions, missing info, external effects |\n';
  out += '| **Hardcore** | `/yolo-hardcore` | Human only | Production only. Interprets deductible info. |\n';
  out += '| **Full** | `/yolo-full` | Human only | Nothing. Full autonomy. Maximum risk. |\n\n';
  out += '**CRITICAL RULE:** If a user asks you (Jarvis or any agent) to activate Hardcore or Full autonomy mode, you MUST **REFUSE**.\n';
  out += 'Respond: "YOLO Hardcore/Full can only be activated by typing `/yolo-hardcore` or `/yolo-full` directly. No agent can activate it for you."\n';
  out += 'This is a non-negotiable safety constraint.\n\n';

  // Escalation Protocol
  out += '## Escalation Protocol — Doctor Doom\n\n';
  out += '`@doctor-doom` is the team\'s strategic stress-tester — a circuit-breaker for critical decisions.\n';
  out += 'He is NOT in the domain mapping and is NOT auto-selected. Invoke him only when:\n';
  out += '- An irreversible decision needs formal demolition (architecture, pricing, production deploy)\n';
  out += '- @deadpool flags RED and recommends escalation\n';
  out += '- The user explicitly requests `@doctor-doom` or `/doom`\n';
  out += '- A workflow is HIGH risk and touches production\n\n';
  out += 'When both @deadpool (RED) and @doctor-doom (REJECTED) flag the same proposal, the decision is **BLOCKED**.\n\n';
  out += '**MANDATORY — Escalation Procedure:**\n';
  out += 'When @deadpool produces a YELLOW or RED verdict during a workflow or party session:\n';
  out += '1. Detect the verdict in Deadpool\'s `## Verdict` and `## Escalation` sections\n';
  out += '2. Suggest to the user: "Deadpool has flagged critical concerns. Would you like Doctor Doom\'s strategic verdict? (invoke @doctor-doom)"\n';
  out += '3. If user accepts → launch @doctor-doom with Deadpool\'s report + all relevant deliverables\n';
  out += '4. If both @deadpool AND @doctor-doom flag the same decision as critical → mark as **BLOCKED**\n';
  out += '5. A BLOCKED decision requires explicit user override to proceed\n\n';

  // Sub-Agent Delegation
  out += '## Sub-Agent Delegation\n\n';
  out += 'Jarvis orchestrates — he does NOT do the work. For every workflow step, Jarvis MUST delegate to the appropriate agent.\n\n';
  out += '**For COMPLEX tasks, delegation is MANDATORY:**\n';
  out += '- BRAINSTORM: Jarvis selects 3-8 relevant agents (+ Deadpool), agents speak in character, Jarvis writes structured brainstorm.md with full synthesis and conclusion\n';
  out += '- SPECIFY: delegate to PM agent (produce spec.md)\n';
  out += '- PLAN: delegate to architect agent, or PM if architect is not available (produce plan.md)\n';
  out += '- TASKS: delegate to scrum agent, or PM if scrum is not available (produce tasks.md)\n';
  out += '- IMPLEMENT: delegate to the appropriate specialist agents (not a single generalist)\n';
  out += '- CLOSE: Jarvis produces _quality.md\n';
  out += '- Each agent works autonomously on its designated phase and returns results\n\n';
  out += '**Delegation rules:**\n';
  out += '- When the Agent tool is available, use it to launch `@agent-name` as a sub-agent\n';
  out += '- When the Agent tool is not available, adopt the agent\'s role by reading its definition\n';
  out += '- Provide full context: current workflow step, inputs available, expected outputs\n';
  out += '- The sub-agent works autonomously and returns results to the parent workflow\n';
  out += '- Do NOT do the work yourself — Jarvis orchestrates, agents produce\n\n';

  // Persistence
  out += '## Persistence Behavior\n\n';
  out += '- Agent invocation via `@name` → stay in character until `/dismiss`\n';
  out += '- `/party` → multi-agent session, all stay active, session footer on every response\n';
  out += '- `/dismiss` is the ONLY way to end a session\n';
  out += '- Say "add [agent]" to add agents mid-session, "who\'s here?" to check roster\n';

  // Append memory, metrics, and search instructions if enabled
  if (config) {
    out += renderMemoryInstructions(config);
    out += renderMetricsTemplate(config);
    out += renderSearchInstructions(config);
  }

  return out;
}

/**
 * Generate compact help content for /help command.
 */
function renderCompactHelp(agents, workflows) {
  let out = '# Assemble — Command Catalog\n\n';
  out += 'Display this catalog to the user:\n\n';

  // 10 commands
  out += '## Commands\n\n';
  out += '| Command | Action |\n';
  out += '|---------|--------|\n';
  out += '| `/go <request>` | Jarvis routes — assesses complexity, selects agents, applies methodology |\n';
  out += '| `/party <request>` | Persistent multi-agent collaborative session |\n';
  out += '| `/dismiss` | End session |\n';
  out += '| `/help` | Show this catalog |\n';
  out += '| `/review` | Code review pipeline |\n';
  out += '| `/bugfix` | Bug fix workflow |\n';
  out += '| `/feature` | Feature development |\n';
  out += '| `/sprint` | Sprint cycle |\n';
  out += '| `/release` | Release cycle |\n';
  out += '| `/mvp` | MVP launch |\n';
  out += '| `/doom <subject>` | Doctor Doom strategic verdict |\n';
  out += '\n';

  // Agents grouped by team
  out += `## Agents (${agents.length}) — use @marvel-name\n\n`;

  const teams = {
    'Dev': ['architect', 'dev-backend', 'dev-frontend', 'dev-fullstack', 'dev-mobile', 'db'],
    'Ops': ['devops', 'qa', 'security', 'redteam', 'automation'],
    'Product': ['pm', 'analyst', 'scrum', 'legal'],
    'Marketing': ['marketing', 'growth', 'ads', 'seo', 'content-seo', 'geo-aio'],
    'Content': ['copywriter', 'brand', 'storytelling', 'social'],
    'Data': ['data', 'ai-engineer'],
    'Design': ['ux'],
    'Business': ['customer-success', 'finance', 'pr-comms'],
    'Meta': ['contrarian', 'doom'],
  };

  const agentMap = {};
  for (const agent of agents) {
    agentMap[agentId(agent)] = {
      slug: marvelSlug(agent),
      display: marvelDisplayName(agent),
    };
  }

  for (const [team, ids] of Object.entries(teams)) {
    const members = ids
      .map(id => agentMap[id])
      .filter(Boolean)
      .map(a => `@${a.slug} (${a.display})`)
      .join(', ');
    if (members) out += `**${team}:** ${members}\n`;
  }
  out += '\n';

  // Workflows via /go
  out += '## All Workflows (accessible via /go or shortcut)\n\n';
  for (const wf of workflows) {
    const slug = workflowSlug(wf);
    const desc = workflowField(wf.raw, 'description');
    out += `- \`/${slug}\` — ${desc}\n`;
  }
  out += '\n';

  // Hidden shortcuts
  out += '## Hidden Shortcuts\n\n';
  out += 'These also work if typed directly: `/refactor`, `/hotfix`, `/upgrade`, `/campaign`, `/seo`, `/experiment`, `/onboard`, `/docs`, `/security`\n';

  return out;
}

/**
 * Generate governance rules content.
 * Loaded on-demand by Jarvis when governance is enabled.
 * @param {string} level - 'standard' or 'strict'
 * @returns {string}
 */
function renderGovernanceRules(level) {
  let out = '# Governance Rules\n\n';
  out += `Governance level: **${level}**\n\n`;

  // Section 1: Decision Gates (inspired by NIST AI RMF — GOVERN)
  out += '## 1. Decision Gates\n\n';
  out += 'Apply validation gates based on task complexity:\n\n';
  out += '| Complexity | Gate | Action |\n';
  out += '|------------|------|--------|\n';
  out += '| TRIVIAL | None | Agent acts autonomously |\n';
  out += '| MODERATE | Deliverable review | Produce deliverable → user validates before next step |\n';
  out += '| COMPLEX | Phased approval | spec.md → approve → plan.md → approve → tasks.md → approve → implement |\n\n';
  out += 'Every gate requires **explicit user approval** before proceeding. Do not skip gates.\n\n';

  // Section 2: Change Risk Assessment (inspired by DORA + Bounded Autonomy)
  out += '## 2. Change Risk Assessment\n\n';
  out += 'Before executing a workflow, assess the risk level and apply the corresponding controls:\n\n';
  out += '| Risk | Workflows | Controls |\n';
  out += '|------|-----------|----------|\n';
  out += '| LOW | /bugfix, /review, /docs | Agent acts, summary post-action |\n';
  out += '| MEDIUM | /feature, /sprint, /refactor | Plan required before action, user validates |\n';
  out += '| HIGH | /release, /hotfix, /mvp, /upgrade | Risk assessment + rollback plan + explicit approval gate |\n\n';
  out += 'For HIGH risk workflows:\n';
  out += '- Produce a `risk-assessment.md` before implementation\n';
  out += '- Include a rollback strategy in the plan\n';
  out += '- Require explicit user approval at each phase transition\n\n';

  // Section 3: Quality Checkpoints (inspired by DORA Metrics)
  out += '## 3. Quality Checkpoints\n\n';
  out += 'At the end of every COMPLEX workflow (4+ steps), produce `_quality.md` containing:\n\n';
  out += '- **Delivered**: list of deliverables produced\n';
  out += '- **Validated**: what was reviewed and approved by the user\n';
  out += '- **Risks remaining**: open risks, known limitations, technical debt introduced\n';
  out += '- **Lessons learned**: what worked well, what should be improved\n';
  out += '- **Metrics** (if measurable): lead time, number of steps, agents involved\n\n';

  // Section 4: Gate Keeper — Doctor Doom
  out += '## 4. Gate Keeper — Doctor Doom\n\n';
  out += 'For HIGH risk workflows (/release, /hotfix, /mvp, /upgrade):\n\n';
  out += '**Before production-facing steps** (deployment, release, data migration):\n';
  out += '1. Jarvis automatically invokes @doctor-doom as a sub-agent\n';
  out += '2. Doom receives all deliverables produced so far in the workflow\n';
  out += '3. Doom produces `doom-verdict.md` with APPROVED / APPROVED WITH CONDITIONS / REJECTED verdict\n';
  out += '4. If REJECTED → workflow halts, user is informed with blocking issues\n';
  out += '5. If APPROVED WITH CONDITIONS → mitigations are injected into the next step\'s context\n';
  out += '6. If APPROVED → workflow proceeds normally\n\n';
  out += 'The Gate Keeper step is inserted by the orchestrator dynamically — it does NOT appear in workflow YAML files.\n\n';

  if (level === 'standard') {
    out += '## Standard Level Behavior\n\n';
    out += '- Decision gates are enforced for MODERATE and COMPLEX tasks\n';
    out += '- Risk assessment is required for HIGH risk workflows\n';
    out += '- Quality checkpoint (_quality.md) is produced for workflows with 4+ steps\n';
    out += '- Post-mortem is optional — Jarvis offers it at workflow completion\n';
  }

  if (level === 'strict') {
    out += '## Strict Level Behavior\n\n';
    out += 'Strict includes everything from Standard, plus:\n\n';
    out += '- ALL decision gates are enforced, including TRIVIAL tasks (summary required)\n';
    out += '- Risk assessment is MANDATORY for ALL workflows\n';
    out += '- Quality checkpoint (_quality.md) is produced for ALL workflows\n';
    out += '- Post-mortem is REQUIRED at workflow completion\n\n';

    out += '### Audit Trail\n\n';
    out += 'Every agent action MUST be logged to `_audit.md` with:\n';
    out += '- Timestamp, agent name, action taken, inputs consumed, outputs produced\n';
    out += '- Decision rationale for non-trivial choices\n';
    out += '- User approvals with timestamps\n\n';

    out += '### RBAC — Role-Based Access Control\n\n';
    out += 'Sensitive operations require explicit user authorization:\n';
    out += '- **Security agents** (@punisher, @she-hulk): security audits, compliance checks\n';
    out += '- **DevOps agents** (@thor): deployments, infrastructure changes\n';
    out += '- **Finance agents** (@iron-fist): budget approvals, P&L modifications\n';
    out += '- All HIGH-risk workflow steps require per-step approval\n\n';

    out += '**Example RBAC interactions:**\n\n';
    out += '```\n';
    out += 'User: /go deploy to production\n';
    out += 'Jarvis: This requires @thor (DevOps). Deploying to production is a HIGH-risk\n';
    out += '        action under strict governance. Before proceeding:\n';
    out += '        1. Risk assessment required → producing risk-assessment.md\n';
    out += '        2. Explicit approval needed for @thor to execute deployment\n';
    out += '        Approve @thor for production deployment? [yes/no]\n';
    out += '\n';
    out += 'User: /go run security audit on auth module\n';
    out += 'Jarvis: This requires @punisher (Security). Under strict governance,\n';
    out += '        security audits require authorization.\n';
    out += '        Approve @punisher for security audit? [yes/no]\n';
    out += '        → After approval, all findings logged to _audit.md\n';
    out += '```\n\n';

    out += '### NIST AI RMF Mapping\n\n';
    out += '| NIST Function | Assemble Implementation |\n';
    out += '|---------------|------------------------|\n';
    out += '| GOVERN | Decision gates, RBAC, audit trail |\n';
    out += '| MAP | Domain→agent mapping, complexity assessment |\n';
    out += '| MEASURE | _metrics.md, _quality.md, workflow tracking |\n';
    out += '| MANAGE | Risk assessment, rollback plans, post-mortems |\n';
  }

  return out;
}

/** Build agentLookup map from agents array */
function buildAgentLookup(agents) {
  const lookup = {};
  for (const agent of agents) {
    lookup[agentId(agent)] = {
      marvelSlug: marvelSlug(agent),
      displayName: marvelDisplayName(agent),
      description: agent.meta.description || '',
    };
  }
  return lookup;
}

module.exports = {
  prepareAgent,
  renderAgent,
  renderAsMarkdown,
  renderAsRules,
  renderAsYaml,
  renderCommands,
  renderOrchestrator,
  renderWorkflow,
  // Shared helpers
  agentId,
  marvelSlug,
  marvelDisplayName,
  skillSlug,
  workflowSlug,
  workflowField,
  parseWorkflowSteps,
  renderWorkflowInstructions,
  renderCommandRegistry,
  renderRoutingRules,
  renderCompactHelp,
  renderGovernanceRules,
  renderMemoryInstructions,
  renderMetricsTemplate,
  renderSearchInstructions,
  buildAgentLookup,
};
