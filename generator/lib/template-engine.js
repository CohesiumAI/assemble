/**
 * Assemble — Moteur de template
 * Transforme les agents/skills/workflows source en format cible
 */

const { injectLanguage } = require('./i18n');

/**
 * Prépare un agent pour la génération en injectant langue et output config
 * @param {object} agent - Agent parsé { meta, content, sections }
 * @param {object} config - Configuration { langue_equipe, langue_output, output_dir }
 * @returns {object} - Agent enrichi
 */
function prepareAgent(agent, config) {
  let content = agent.content;

  // Injecter les instructions de langue
  if (config.langue_equipe) {
    content = injectLanguage(content, config.langue_equipe, config.langue_output || config.langue_equipe);
  }

  // Injecter la config output
  const outputBlock = `## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : \`${config.output_dir || './assemble-output'}\`
Respecte la structure de dossiers définie par le workflow en cours.
`;

  if (!content.includes('## Répertoire de sortie')) {
    content = content.trim() + '\n\n' + outputBlock;
  }

  return { ...agent, content };
}

/**
 * Génère le contenu d'un fichier agent pour une plateforme donnée
 * @param {object} agent - Agent parsé et préparé
 * @param {string} format - Format cible ('markdown', 'rules', 'yaml')
 * @returns {string} - Contenu formaté
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
 * Rend un agent au format Markdown (utilisé par la plupart des plateformes)
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
 * Rend un agent au format Rules (pour .cursorrules, .windsurfrules, etc.)
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
 * Rend un agent au format YAML (pour Kiro, OpenCode, etc.)
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
 * Génère un fichier de commandes pour une plateforme
 * @param {string} commandsYaml - Contenu du commands.yaml
 * @param {string} format - Format cible
 * @returns {string}
 */
function renderCommands(commandsYaml, format = 'markdown') {
  if (format === 'markdown') {
    return `# Commandes Assemble\n\n${commandsYaml}`;
  }
  return commandsYaml;
}

/**
 * Génère le contenu de l'orchestrateur pour une plateforme
 * @param {object} orchestrator - Orchestrateur parsé
 * @param {object} config - Configuration
 * @returns {string}
 */
function renderOrchestrator(orchestrator, config) {
  return prepareAgent(orchestrator, config).content;
}

/**
 * Génère un fichier de workflow pour une plateforme
 * @param {object} workflow - Workflow parsé
 * @param {string} format - Format cible
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
  let out = `## Instructions d'exécution\n\nRépertoire de sortie : \`${outputDir}\`\n\n`;
  if (steps.length === 0) {
    out += '```yaml\n' + workflow.raw + '\n```\n';
    return out;
  }
  for (const step of steps) {
    const info = agentLookup[step.agent] || {};
    const display = info.displayName || step.agent;
    const ref = info.marvelSlug || step.agent;
    out += `### Étape ${step.num} — ${display} (${ref})\n\n`;
    out += `**Action :** ${step.action}\n\n`;
    if (step.inputs.length) out += '**Inputs :** ' + step.inputs.map(i => `\`${i}\``).join(', ') + '\n\n';
    if (step.depends_on.length) out += `**Dépend de :** étape(s) ${step.depends_on.join(', ')}\n\n`;
    out += '**Livrables :**\n';
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
 */
function renderCommandRegistry(agents, skills, workflows) {
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
  out += '\n';

  // Agent access
  out += '### Agent Access\n\n';
  out += 'Use `@marvel-name` to invoke any agent directly (e.g., `@tony-stark`, `@professor-x`).\n\n';

  // Persistence rules
  out += '### Persistence Rules\n\n';
  out += '- When an agent is invoked via `@agent-name`, **stay in character** for ALL subsequent messages until `/dismiss`.\n';
  out += '- When `/party` is used, multiple agents are convoked and ALL stay active with a combined footer.\n';
  out += '- **Only `/dismiss` ends the session.** No other command or natural message ends it.\n';

  return out;
}

/**
 * Generate routing rules for Jarvis.
 * Contains identity, complexity assessment, domain→agent mapping, and methodology.
 */
function renderRoutingRules(agents, workflows) {
  let out = '# Jarvis — Routing Intelligence\n\n';
  out += 'You are Jarvis, orchestrator of a 31-agent AI team (Assemble by Cohesium AI).\n';
  out += 'You don\'t do the work — you identify WHO should intervene, WHEN, in WHAT ORDER, and with WHAT context.\n\n';

  // Complexity assessment
  out += '## Complexity Assessment\n\n';
  out += 'For every `/go` request, assess complexity first:\n\n';
  out += '**TRIVIAL** — Simple question, single agent, direct answer. Act as the most relevant agent.\n';
  out += '**MODERATE** — Clear task, 2-3 agents. Select agents, execute sequentially, produce deliverables.\n';
  out += '**COMPLEX** — Multi-domain, high stakes, ambitious. Apply Spec-Driven Methodology:\n\n';
  out += '1. **SPECIFY** (@professor-x) → spec.md → user validates\n';
  out += '2. **PLAN** (@tony-stark) → plan.md → user validates\n';
  out += '3. **TASKS** (@captain-america) → tasks.md → user validates\n';
  out += '4. **IMPLEMENT** (Dev agents) → code + tests\n\n';

  // Domain mapping
  out += '## Domain → Agent Mapping\n\n';
  out += '```\n';
  out += 'architecture, stack, scalability → @tony-stark\n';
  out += 'API, backend, server, endpoint → @bruce-banner, @doctor-strange\n';
  out += 'UI, frontend, React, components → @spider-man\n';
  out += 'fullstack, MVP, debug, integration → @mr-fantastic\n';
  out += 'mobile, React Native, Flutter → @ant-man\n';
  out += 'CI/CD, Docker, Kubernetes, deploy → @thor\n';
  out += 'tests, QA, regression, coverage → @hawkeye\n';
  out += 'security, vulnerability, pentest → @punisher\n';
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
  out += 'If the project has `governance: standard` in `.assemble.yaml`, load and apply rules from\n';
  out += '`.claude/rules/governance/governance.md` — decision gates, risk assessment, and quality checkpoints.\n';
  out += 'Default: no governance overhead.\n\n';

  // Persistence
  out += '## Persistence Behavior\n\n';
  out += '- Agent invocation via `@name` → stay in character until `/dismiss`\n';
  out += '- `/party` → multi-agent session, all stay active, session footer on every response\n';
  out += '- `/dismiss` is the ONLY way to end a session\n';
  out += '- Say "add [agent]" to add agents mid-session, "who\'s here?" to check roster\n';

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
  out += '\n';

  // Agents grouped by team
  out += '## Agents (31) — use @marvel-name\n\n';

  const teams = {
    'Dev': ['architect', 'dev-backend', 'dev-frontend', 'dev-fullstack', 'dev-mobile', 'db'],
    'Ops': ['devops', 'qa', 'security', 'automation'],
    'Product': ['pm', 'analyst', 'scrum', 'legal'],
    'Marketing': ['marketing', 'growth', 'ads', 'seo', 'content-seo', 'geo-aio'],
    'Content': ['copywriter', 'brand', 'storytelling', 'social'],
    'Data': ['data', 'ai-engineer'],
    'Design': ['ux'],
    'Business': ['customer-success', 'finance', 'pr-comms'],
    'Meta': ['contrarian'],
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

  if (level === 'standard') {
    out += '## Standard Level Behavior\n\n';
    out += '- Decision gates are enforced for MODERATE and COMPLEX tasks\n';
    out += '- Risk assessment is required for HIGH risk workflows\n';
    out += '- Quality checkpoint (_quality.md) is produced for workflows with 4+ steps\n';
    out += '- Post-mortem is optional — Jarvis offers it at workflow completion\n';
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
  buildAgentLookup,
};
