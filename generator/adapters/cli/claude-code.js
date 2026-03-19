/**
 * Cohesium AI — Claude Code Adapter
 *
 * Generates the correct file structure for Claude Code:
 *   CLAUDE.md                              — concise project instructions (< 30 lines) with @imports
 *   .claude/agents/{marvel-slug}/AGENT.md  — one directory per agent with AGENT.md inside
 *   .claude/skills/{skill-slug}/SKILL.md   — 10 skill directories (go, party, dismiss, help, review, bugfix, feature, sprint, release, mvp)
 *   .claude/rules/*.md                     — orchestrator, teams, and routing rules
 */

const fs = require('fs');
const path = require('path');
const {
  prepareAgent,
  renderOrchestrator,
  renderRoutingRules,
  renderCompactHelp,
  agentId,
  marvelSlug,
  marvelDisplayName,
  workflowSlug,
  workflowField,
} = require('../../lib/template-engine');

module.exports = {
  name: 'claude-code',
  displayName: 'Claude Code',
  type: 'cli',

  // ─── Helpers ────────────────────────────────────────────────────────────────

  _agentId(agent) {
    return agent.fileName.replace(/^AGENT-/, '').replace(/\.md$/, '');
  },

  _marvelSlug(agent) {
    return (agent.meta.name || this._agentId(agent))
      .toLowerCase()
      .replace(/\s+/g, '-');
  },

  _marvelDisplayName(agent) {
    const raw = agent.meta.marvel || agent.meta.name || '';
    return raw.split('—')[0].split('(')[0].trim();
  },

  _workflowSlug(workflow) {
    const triggerMatch = workflow.raw.match(/trigger:\s*\/?([\w-]+)/);
    return triggerMatch
      ? triggerMatch[1]
      : workflow.fileName.replace(/\.(yaml|yml)$/, '');
  },

  _yamlField(raw, field) {
    const match = raw.match(new RegExp(`${field}:\\s*"?([^"\\n]+)"?`));
    return match ? match[1].trim() : '';
  },

  // ─── Output paths (used by validator) ───────────────────────────────────────

  getOutputPaths(projectDir, { agents = [], workflows = [] } = {}) {
    const paths = [
      path.join(projectDir, 'CLAUDE.md'),
      path.join(projectDir, '.claude', 'rules', 'orchestrator.md'),
      path.join(projectDir, '.claude', 'rules', 'teams.md'),
      path.join(projectDir, '.claude', 'rules', 'routing.md'),
    ];

    for (const agent of agents) {
      const slug = this._marvelSlug(agent);
      paths.push(path.join(projectDir, '.claude', 'agents', slug, 'AGENT.md'));
    }

    // 10 skills only
    const skillSlugs = ['go', 'party', 'dismiss', 'help', 'review', 'bugfix', 'feature', 'sprint', 'release', 'mvp'];
    for (const slug of skillSlugs) {
      paths.push(path.join(projectDir, '.claude', 'skills', slug, 'SKILL.md'));
    }

    return paths;
  },

  // ─── Main generation ────────────────────────────────────────────────────────

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const agentsDir = path.join(projectDir, '.claude', 'agents');
    const skillsDir = path.join(projectDir, '.claude', 'skills');
    const rulesDir  = path.join(projectDir, '.claude', 'rules');

    fs.mkdirSync(agentsDir, { recursive: true });
    fs.mkdirSync(skillsDir, { recursive: true });
    fs.mkdirSync(rulesDir,  { recursive: true });

    // Build agent lookup table (agentId → marvelSlug + display name)
    const agentLookup = {};
    for (const agent of agents) {
      const id = this._agentId(agent);
      agentLookup[id] = {
        marvelSlug: this._marvelSlug(agent),
        displayName: this._marvelDisplayName(agent),
        description: agent.meta.description || '',
      };
    }

    // ── 1. .claude/agents/{marvel-slug}/AGENT.md ──────────────────────────────

    for (const agent of agents) {
      const prepared   = prepareAgent(agent, config);
      const slug       = this._marvelSlug(agent);
      const id         = this._agentId(agent);
      const displayName = this._marvelDisplayName(agent);
      const description = agent.meta.description || '';

      const agentDir = path.join(agentsDir, slug);
      fs.mkdirSync(agentDir, { recursive: true });

      let content = '---\n';
      content += `name: ${slug}\n`;
      content += `description: "${displayName} — ${id}. ${description.replace(/"/g, '\\"')}"\n`;
      content += `model: inherit\n`;
      content += '---\n\n';
      content += prepared.content;

      fs.writeFileSync(path.join(agentDir, 'AGENT.md'), content, 'utf-8');
    }

    // ── 2. Generate exactly 10 SKILL.md files ─────────────────────────────────

    // 2a. /go — routing entry point
    {
      const dir = path.join(skillsDir, 'go');
      fs.mkdirSync(dir, { recursive: true });
      let content = '---\n';
      content += 'name: go\n';
      content += 'description: "Jarvis routes — assesses complexity, selects agents, applies methodology"\n';
      content += 'user-invocable: true\n';
      content += '---\n\n';
      content += '# /go — Jarvis Smart Routing\n\n';
      content += 'Read and apply the routing rules from `.claude/rules/routing.md`.\n\n';
      content += '1. Assess complexity of the request (TRIVIAL / MODERATE / COMPLEX)\n';
      content += '2. Select the appropriate agent(s) or workflow\n';
      content += '3. For COMPLEX tasks, apply the Spec-Driven Methodology (SPECIFY → PLAN → TASKS → IMPLEMENT)\n';
      content += '4. Execute with full agent context from `.claude/agents/`\n\n';
      content += 'User request: $ARGUMENTS\n';
      fs.writeFileSync(path.join(dir, 'SKILL.md'), content, 'utf-8');
    }

    // 2b. /party — from party-mode.md
    {
      const partySkill = (skills.specific || []).find(s => s.meta.name === 'party-mode' || (s.meta.trigger || '').includes('party'));
      const dir = path.join(skillsDir, 'party');
      fs.mkdirSync(dir, { recursive: true });
      let content = '---\n';
      content += 'name: party\n';
      content += 'description: "Persistent multi-agent collaborative session"\n';
      content += 'user-invocable: true\n';
      content += '---\n\n';
      if (partySkill) {
        const prepared = prepareAgent(partySkill, config);
        content += prepared.content;
      } else {
        content += '# Party Mode\n\nOpen a persistent multi-agent session. Jarvis selects relevant agents.\n\n$ARGUMENTS\n';
      }
      fs.writeFileSync(path.join(dir, 'SKILL.md'), content, 'utf-8');
    }

    // 2c. /dismiss
    {
      const dir = path.join(skillsDir, 'dismiss');
      fs.mkdirSync(dir, { recursive: true });
      let content = '---\n';
      content += 'name: dismiss\n';
      content += 'description: "End the current agent or party session"\n';
      content += 'user-invocable: true\n';
      content += '---\n\n';
      content += 'If an agent name is provided, remove that agent from the session and update the footer.\n';
      content += 'If no argument is provided, close the entire session — all agents leave and the footer is removed.\n\n';
      content += '$ARGUMENTS\n';
      fs.writeFileSync(path.join(dir, 'SKILL.md'), content, 'utf-8');
    }

    // 2d. /help — compact catalog
    {
      const dir = path.join(skillsDir, 'help');
      fs.mkdirSync(dir, { recursive: true });
      let content = '---\n';
      content += 'name: help\n';
      content += 'description: "Show the complete command catalog"\n';
      content += 'user-invocable: true\n';
      content += '---\n\n';
      content += renderCompactHelp(agents, workflows);
      fs.writeFileSync(path.join(dir, 'SKILL.md'), content, 'utf-8');
    }

    // 2e-2j. Workflow shortcut skills
    const workflowShortcuts = {
      'review': 'code-review-pipeline',
      'bugfix': 'bug-fix',
      'feature': 'feature-development',
      'sprint': 'sprint-cycle',
      'release': 'release-cycle',
      'mvp': 'mvp-launch',
    };

    for (const [cmdSlug, workflowFileName] of Object.entries(workflowShortcuts)) {
      const wf = workflows.find(w => {
        const fn = (w.fileName || '').replace(/\.(yaml|yml)$/, '');
        return fn === workflowFileName;
      });

      const dir = path.join(skillsDir, cmdSlug);
      fs.mkdirSync(dir, { recursive: true });

      const workflowName = wf ? (this._yamlField(wf.raw, 'name') || cmdSlug) : cmdSlug;
      const workflowDesc = wf ? this._yamlField(wf.raw, 'description') : '';

      let content = '---\n';
      content += `name: ${cmdSlug}\n`;
      content += `description: "${(workflowDesc || `Launch ${workflowName} workflow`).replace(/"/g, '\\"')}"\n`;
      content += 'user-invocable: true\n';
      content += '---\n\n';
      content += `# Workflow : ${workflowName}\n\n`;
      if (workflowDesc) content += `${workflowDesc}\n\n`;

      if (wf) {
        content += this._renderWorkflowInstructions(wf, agentLookup, config);
      }

      content += '\nApply this workflow to: $ARGUMENTS\n';

      fs.writeFileSync(path.join(dir, 'SKILL.md'), content, 'utf-8');
    }

    // ── 3. .claude/rules/routing.md ───────────────────────────────────────────

    const routingContent = renderRoutingRules(agents, workflows);
    fs.writeFileSync(path.join(rulesDir, 'routing.md'), routingContent, 'utf-8');

    // ── 4. .claude/rules/orchestrator.md ──────────────────────────────────────

    if (orchestrator) {
      const orchestratorContent = renderOrchestrator(orchestrator, config);
      fs.writeFileSync(path.join(rulesDir, 'orchestrator.md'), orchestratorContent, 'utf-8');
    }

    // ── 5. .claude/rules/teams.md ─────────────────────────────────────────────

    let teamsContent = '# Équipes Cohesium AI\n\n';
    teamsContent += 'Répertoire des agents disponibles. Chaque agent est invocable via `@nom-agent`.\n\n';

    for (const agent of agents) {
      const slug  = this._marvelSlug(agent);
      const displayName = this._marvelDisplayName(agent);
      const id     = this._agentId(agent);
      const desc = (agent.meta.description || '').split('—')[0].trim();
      teamsContent += `- **${displayName}** (\`@${slug}\`) — ${id} — ${desc}\n`;
    }

    fs.writeFileSync(path.join(rulesDir, 'teams.md'), teamsContent, 'utf-8');

    // ── 6. CLAUDE.md — compact, with @imports ─────────────────────────────────

    let claude = '# Cohesium AI\n\n';
    claude += 'You are Jarvis, orchestrator of a 31-agent AI team.\n\n';
    claude += '@.claude/rules/routing.md\n';
    claude += '@.claude/rules/teams.md\n';
    claude += '@.claude/rules/orchestrator.md\n\n';
    claude += '## Commands\n\n';
    claude += '/go — describe what you need, Jarvis routes (primary)\n';
    claude += '/party — multi-agent session | /dismiss — end session | /help — catalog\n';
    claude += 'Shortcuts: /review /bugfix /feature /sprint /release /mvp\n';
    claude += 'Agents: use @marvel-name for direct access\n';

    fs.writeFileSync(path.join(projectDir, 'CLAUDE.md'), claude, 'utf-8');
  },

  // ─── Workflow → actionable instructions ─────────────────────────────────────

  _renderWorkflowInstructions(workflow, agentLookup, config) {
    const steps = this._parseWorkflowSteps(workflow.raw);
    const outputDir = config.output_dir || './cohesium-output';

    let out = '## Instructions d\'exécution\n\n';
    out += `Répertoire de sortie : \`${outputDir}\`\n\n`;
    out += 'Exécute les étapes suivantes dans l\'ordre. ';
    out += 'Pour chaque étape, adopte le rôle de l\'agent indiqué en lisant sa définition dans `.claude/agents/`.\n\n';

    if (steps.length === 0) {
      out += '```yaml\n' + workflow.raw + '\n```\n';
      return out;
    }

    for (const step of steps) {
      const info = agentLookup[step.agent] || {};
      const agentRef = info.marvelSlug || step.agent;
      const agentDisplay = info.displayName || step.agent;

      out += `### Étape ${step.num} — ${agentDisplay} (\`@${agentRef}\`)\n\n`;
      out += `**Action :** ${step.action}\n\n`;

      if (step.inputs.length > 0) {
        out += '**Inputs :** ';
        out += step.inputs.map(i => `\`${i}\``).join(', ') + '\n\n';
      }

      if (step.depends_on.length > 0) {
        out += `**Dépend de :** étape(s) ${step.depends_on.join(', ')}\n\n`;
      }

      out += '**Livrables attendus :**\n';
      for (const o of step.outputs) {
        out += `- \`${o}\`\n`;
      }
      out += '\n';
    }

    return out;
  },

  _parseWorkflowSteps(raw) {
    const steps = [];
    const blocks = raw.split(/(?=- step:)/);

    for (const block of blocks) {
      const stepMatch = block.match(/step:\s*(\d+)/);
      if (!stepMatch) continue;

      const step = {
        num: parseInt(stepMatch[1], 10),
        agent: (block.match(/agent:\s*([\w-]+)/) || [])[1] || '',
        action: (block.match(/action:\s*"([^"]+)"/) || [])[1] || '',
        outputs: [],
        inputs: [],
        depends_on: [],
      };

      const outputsMatch = block.match(/outputs:\s*\[([^\]]+)\]/);
      if (outputsMatch) {
        step.outputs = outputsMatch[1].split(',').map(o => o.trim());
      }

      const inputsMatch = block.match(/inputs:\s*\[([^\]]+)\]/);
      if (inputsMatch) {
        step.inputs = inputsMatch[1].split(',').map(i => i.trim());
      }

      const depsMatch = block.match(/depends_on:\s*\[([^\]]*)\]/);
      if (depsMatch && depsMatch[1].trim()) {
        step.depends_on = depsMatch[1].split(',').map(d => d.trim());
      }

      steps.push(step);
    }

    return steps;
  },

  // ─── Validation ─────────────────────────────────────────────────────────────

  validate(projectDir) {
    const errors = [];

    // Check CLAUDE.md
    const claudeMdPath = path.join(projectDir, 'CLAUDE.md');
    if (!fs.existsSync(claudeMdPath)) {
      errors.push('CLAUDE.md manquant');
    } else {
      const content = fs.readFileSync(claudeMdPath, 'utf-8');
      if (content.trim().length === 0) {
        errors.push('CLAUDE.md est vide');
      }
      const lineCount = content.split('\n').length;
      if (lineCount > 30) {
        errors.push(`CLAUDE.md trop long (${lineCount} lignes, recommandé < 30)`);
      }
    }

    // Check routing.md exists
    const routingPath = path.join(projectDir, '.claude', 'rules', 'routing.md');
    if (!fs.existsSync(routingPath)) {
      errors.push('.claude/rules/routing.md manquant');
    } else {
      const content = fs.readFileSync(routingPath, 'utf-8');
      if (content.trim().length === 0) {
        errors.push('.claude/rules/routing.md est vide');
      }
    }

    // Check agent directories → each must contain AGENT.md
    const agentsDir = path.join(projectDir, '.claude', 'agents');
    if (fs.existsSync(agentsDir)) {
      for (const entry of fs.readdirSync(agentsDir)) {
        const agentMd = path.join(agentsDir, entry, 'AGENT.md');
        const stat = fs.statSync(path.join(agentsDir, entry));
        if (!stat.isDirectory()) {
          errors.push(`Fichier inattendu dans .claude/agents/ : ${entry} (doit être un dossier)`);
          continue;
        }
        if (!fs.existsSync(agentMd)) {
          errors.push(`AGENT.md manquant dans .claude/agents/${entry}/`);
        } else {
          const content = fs.readFileSync(agentMd, 'utf-8');
          if (content.trim().length === 0) {
            errors.push(`AGENT.md vide dans .claude/agents/${entry}/`);
          }
        }
      }
    }

    // Check skill directories → each must contain SKILL.md
    const skillsDir = path.join(projectDir, '.claude', 'skills');
    if (fs.existsSync(skillsDir)) {
      for (const entry of fs.readdirSync(skillsDir)) {
        const entryPath = path.join(skillsDir, entry);
        const stat = fs.statSync(entryPath);
        if (!stat.isDirectory()) continue;
        const skillMd = path.join(entryPath, 'SKILL.md');
        if (!fs.existsSync(skillMd)) {
          errors.push(`SKILL.md manquant dans .claude/skills/${entry}/`);
        } else {
          const content = fs.readFileSync(skillMd, 'utf-8');
          if (content.trim().length === 0) {
            errors.push(`SKILL.md vide dans .claude/skills/${entry}/`);
          }
        }
      }
    }

    // Check rules
    const rulesDir = path.join(projectDir, '.claude', 'rules');
    if (fs.existsSync(rulesDir)) {
      for (const file of fs.readdirSync(rulesDir)) {
        const content = fs.readFileSync(path.join(rulesDir, file), 'utf-8');
        if (content.trim().length === 0) {
          errors.push(`Fichier de règle vide : .claude/rules/${file}`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  },
};
