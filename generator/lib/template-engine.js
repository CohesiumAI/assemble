/**
 * Cohesium AI — Moteur de template
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

Tes livrables doivent être produits dans le répertoire : \`${config.output_dir || './cohesium-output'}\`
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
    return `# Commandes Cohesium AI\n\n${commandsYaml}`;
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
  const outputDir = (config || {}).output_dir || './cohesium-output';
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
 * Generate a complete command registry as markdown.
 * Included in every platform's rules so the AI knows how to respond to slash commands.
 */
function renderCommandRegistry(agents, skills, workflows) {
  const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
  let out = '## Command Reference\n\n';
  out += 'When the user types a command starting with `/`, execute it as described below.\n\n';

  // Slash command behavior instructions
  out += '### How Slash Commands Work\n\n';
  out += '**IMPORTANT:** When the user types any `/command`, you MUST recognize and execute it immediately.\n\n';
  out += '**Persistence rules:**\n';
  out += '- When an agent is invoked via `/agent-<name>`, **stay in character as that agent** for ALL subsequent messages until `/dismiss` is used.\n';
  out += '- At the end of EVERY response while an agent is active, display this footer:\n';
  out += '  ```\n';
  out += '  ─────────────────────────────────────────────────────────\n';
  out += '  🎭 Active: [Agent Marvel Name]\n';
  out += '  💡 /summon <agent> to add · /dismiss to end\n';
  out += '  ─────────────────────────────────────────────────────────\n';
  out += '  ```\n';
  out += '- When `/party` is used, multiple agents are convoked and ALL stay active with a combined footer.\n';
  out += '- When `/summon <agent>` is used during an active session, add the agent to the session.\n';
  out += '- When `/dismiss <agent>` is used, remove that agent. When `/dismiss` alone is used, end the entire session.\n';
  out += '- **Only `/dismiss` ends the session.** No other command or natural message ends it.\n\n';

  // Agent commands
  out += '### Agent Commands\n\n';
  out += 'Invoke a specialist. Adopt their full role, expertise, and Marvel personality.\n\n';
  out += '| Command | Agent | Marvel Name | Role |\n';
  out += '|---------|-------|-------------|------|\n';
  for (const agent of agents) {
    const id = agentId(agent);
    const slug = marvelSlug(agent);
    const display = marvelDisplayName(agent);
    const desc = (agent.meta.description || '').split('—')[0].trim();
    out += `| \`/agent-${id}\` | ${slug} | ${display} | ${desc} |\n`;
  }

  // Workflow commands
  out += '\n### Workflow Commands\n\n';
  out += 'Launch a multi-agent workflow. Execute steps in order, respecting dependencies.\n\n';
  out += '| Command | Workflow | Description |\n';
  out += '|---------|----------|-------------|\n';
  for (const wf of workflows) {
    const slug = workflowSlug(wf);
    const desc = workflowField(wf.raw, 'description');
    out += `| \`/${slug}\` | ${workflowField(wf.raw, 'name') || slug} | ${desc} |\n`;
  }

  // Skill commands
  out += '\n### Skill Commands\n\n';
  out += '| Command | Skill |\n';
  out += '|---------|-------|\n';
  for (const skill of allSkills) {
    const slug = skillSlug(skill);
    const desc = (skill.meta.description || '').split('—')[0].trim();
    out += `| \`/${slug}\` | ${desc} |\n`;
  }

  // Session commands
  out += '\n### Session Commands (Party Mode)\n\n';
  out += '| Command | Action |\n';
  out += '|---------|--------|\n';
  out += '| `/party <request>` | Open persistent multi-agent session — Jarvis selects relevant agents |\n';
  out += '| `/party <team> <request>` | Open session with specific team(s) |\n';
  out += '| `/party all <request>` | Open session with all 31 agents |\n';
  out += '| `/summon <agent>` | Add an agent to the current session |\n';
  out += '| `/dismiss <agent>` | Remove an agent from the session |\n';
  out += '| `/dismiss` | Close the entire session |\n';
  out += '| `/who` | Show agents currently in session |\n';

  // Meta commands
  out += '\n### Meta Commands\n\n';
  out += '| Command | Action |\n';
  out += '|---------|--------|\n';
  out += '| `/team` | Display full team roster |\n';
  out += '| `/team-dev` | Display Dev team |\n';
  out += '| `/team-ops` | Display Ops & Quality team |\n';
  out += '| `/team-product` | Display Product & Strategy team |\n';
  out += '| `/team-marketing` | Display Marketing & Growth team |\n';
  out += '| `/team-content` | Display Content & Communication team |\n';
  out += '| `/team-data` | Display Data & AI team |\n';
  out += '| `/team-business` | Display Business & Operations team |\n';
  out += '| `/team-design` | Display Design team |\n';
  out += '| `/status` | Show current workflow status |\n';
  out += '| `/help` | Show this command reference |\n';
  out += '| `/agents` | List all available agents |\n';
  out += '| `/skills` | List all available skills |\n';
  out += '| `/workflows` | List all available workflows |\n';
  out += '| `/handoff <agent>` | Manual handoff to a specific agent |\n';
  out += '| `/update` | Regenerate from .cohesium.yaml |\n';
  out += '| `/reconfigure` | Relaunch configuration wizard |\n';

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
  buildAgentLookup,
};
