/**
 * Cohesium AI — Claude Code Adapter
 *
 * Generates the correct file structure for Claude Code:
 *   CLAUDE.md                              — concise project instructions (< 200 lines) with @imports
 *   .claude/agents/{marvel-slug}/AGENT.md  — one directory per agent with AGENT.md inside
 *   .claude/skills/{skill-slug}/SKILL.md   — one directory per skill/workflow with SKILL.md inside
 *   .claude/rules/*.md                     — orchestrator and team definitions
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderOrchestrator } = require('../../lib/template-engine');

module.exports = {
  name: 'claude-code',
  displayName: 'Claude Code',
  type: 'cli',

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Extract the functional agent ID from the source filename.
   * AGENT-pm.md → pm, AGENT-dev-backend.md → dev-backend
   */
  _agentId(agent) {
    return agent.fileName.replace(/^AGENT-/, '').replace(/\.md$/, '');
  },

  /**
   * Return the Marvel slug from meta.name (already lowercase with hyphens).
   * professor-x, tony-stark, bruce-banner, etc.
   */
  _marvelSlug(agent) {
    return (agent.meta.name || this._agentId(agent))
      .toLowerCase()
      .replace(/\s+/g, '-');
  },

  /**
   * Extract a short Marvel display name from meta.marvel.
   * "Professor X (Charles Xavier) — vision stratégique..." → "Professor X"
   */
  _marvelDisplayName(agent) {
    const raw = agent.meta.marvel || agent.meta.name || '';
    return raw.split('—')[0].split('(')[0].trim();
  },

  /**
   * Extract the slug for a skill from its metadata.
   */
  _skillSlug(skill) {
    const trigger = (skill.meta.trigger || '').replace(/^\//, '');
    return (trigger || skill.meta.name || skill.fileName.replace('.md', ''))
      .toLowerCase()
      .replace(/\s+/g, '-');
  },

  /**
   * Extract the slug for a workflow from its raw YAML.
   */
  _workflowSlug(workflow) {
    const triggerMatch = workflow.raw.match(/trigger:\s*\/?([\w-]+)/);
    return triggerMatch
      ? triggerMatch[1]
      : workflow.fileName.replace(/\.(yaml|yml)$/, '');
  },

  /**
   * Extract a field value from raw YAML.
   */
  _yamlField(raw, field) {
    const match = raw.match(new RegExp(`${field}:\\s*"?([^"\\n]+)"?`));
    return match ? match[1].trim() : '';
  },

  // ─── Output paths (used by validator) ───────────────────────────────────────

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
    const paths = [
      path.join(projectDir, 'CLAUDE.md'),
      path.join(projectDir, '.claude', 'rules', 'orchestrator.md'),
      path.join(projectDir, '.claude', 'rules', 'teams.md'),
    ];

    for (const agent of agents) {
      const slug = this._marvelSlug(agent);
      paths.push(path.join(projectDir, '.claude', 'agents', slug, 'AGENT.md'));
    }

    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      const slug = this._skillSlug(skill);
      paths.push(path.join(projectDir, '.claude', 'skills', slug, 'SKILL.md'));
    }

    for (const workflow of workflows) {
      const slug = this._workflowSlug(workflow);
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
      const marvelSlug = this._marvelSlug(agent);
      const agentId    = this._agentId(agent);
      const displayName = this._marvelDisplayName(agent);
      const description = agent.meta.description || '';

      const agentDir = path.join(agentsDir, marvelSlug);
      fs.mkdirSync(agentDir, { recursive: true });

      // Build Claude Code compliant frontmatter
      let content = '---\n';
      content += `name: ${marvelSlug}\n`;
      content += `description: "${displayName} — ${agentId}. ${description.replace(/"/g, '\\"')}"\n`;
      content += `model: inherit\n`;
      content += '---\n\n';
      content += prepared.content;

      fs.writeFileSync(path.join(agentDir, 'AGENT.md'), content, 'utf-8');
    }

    // ── 2. .claude/skills/{skill-slug}/SKILL.md ───────────────────────────────

    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      const prepared = prepareAgent(skill, config);
      const slug     = this._skillSlug(skill);
      const description = skill.meta.description || '';

      const skillDir = path.join(skillsDir, slug);
      fs.mkdirSync(skillDir, { recursive: true });

      let content = '---\n';
      content += `name: ${slug}\n`;
      content += `description: "${description.replace(/"/g, '\\"')}"\n`;
      content += `user-invocable: true\n`;
      content += '---\n\n';
      content += prepared.content;

      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content, 'utf-8');
    }

    // ── 3. Workflows → .claude/skills/{workflow-slug}/SKILL.md ────────────────

    for (const workflow of workflows) {
      const slug         = this._workflowSlug(workflow);
      const workflowName = this._yamlField(workflow.raw, 'name') || slug;
      const workflowDesc = this._yamlField(workflow.raw, 'description');

      const skillDir = path.join(skillsDir, slug);
      fs.mkdirSync(skillDir, { recursive: true });

      let content = '---\n';
      content += `name: ${slug}\n`;
      content += `description: "${workflowDesc.replace(/"/g, '\\"')}"\n`;
      content += `user-invocable: true\n`;
      content += '---\n\n';
      content += `# Workflow : ${workflowName}\n\n`;
      content += `${workflowDesc}\n\n`;
      content += this._renderWorkflowInstructions(workflow, agentLookup, config);

      fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content, 'utf-8');
    }

    // ── 4. .claude/rules/orchestrator.md ──────────────────────────────────────

    if (orchestrator) {
      const orchestratorContent = renderOrchestrator(orchestrator, config);
      fs.writeFileSync(path.join(rulesDir, 'orchestrator.md'), orchestratorContent, 'utf-8');
    }

    // ── 5. .claude/rules/teams.md ─────────────────────────────────────────────

    let teamsContent = '# Équipes Cohesium AI\n\n';
    teamsContent += 'Répertoire des agents disponibles. Chaque agent est invocable via `@nom-agent`.\n\n';

    for (const agent of agents) {
      const marvelSlug  = this._marvelSlug(agent);
      const displayName = this._marvelDisplayName(agent);
      const agentId     = this._agentId(agent);
      const desc = (agent.meta.description || '').split('—')[0].trim();
      teamsContent += `- **${displayName}** (\`@${marvelSlug}\`) — ${agentId} — ${desc}\n`;
    }

    fs.writeFileSync(path.join(rulesDir, 'teams.md'), teamsContent, 'utf-8');

    // ── 6. CLAUDE.md — concise, with @imports ─────────────────────────────────

    let claude = '# Cohesium AI\n\n';
    claude += 'Ce projet utilise le système Cohesium AI avec des agents IA spécialisés.\n\n';

    claude += '@.claude/rules/orchestrator.md\n';
    claude += '@.claude/rules/teams.md\n\n';

    claude += '## Agents disponibles\n\n';
    claude += 'Invoque un agent avec `@nom-agent` dans le prompt.\n\n';

    for (const agent of agents) {
      const marvelSlug  = this._marvelSlug(agent);
      const displayName = this._marvelDisplayName(agent);
      const agentId     = this._agentId(agent);
      const desc = (agent.meta.description || '').split('—')[0].trim();
      claude += `- **${displayName}** (\`@${marvelSlug}\`) — ${desc}\n`;
    }

    claude += '\n## Skills disponibles\n\n';
    claude += 'Invoque une skill avec `/nom-skill`.\n\n';

    for (const skill of allSkills) {
      const slug = this._skillSlug(skill);
      const desc = (skill.meta.description || '').split('—')[0].trim();
      claude += `- \`/${slug}\` — ${desc}\n`;
    }

    claude += '\n## Workflows disponibles\n\n';
    claude += 'Lance un workflow avec `/nom-workflow`.\n\n';

    for (const workflow of workflows) {
      const slug = this._workflowSlug(workflow);
      const desc = this._yamlField(workflow.raw, 'description');
      claude += `- \`/${slug}\` — ${desc}\n`;
    }

    claude += `\n## Répertoire de sortie\n\n`;
    claude += `Les livrables sont produits dans : \`${config.output_dir || './cohesium-output'}\`\n`;

    fs.writeFileSync(path.join(projectDir, 'CLAUDE.md'), claude, 'utf-8');
  },

  // ─── Workflow → actionable instructions ─────────────────────────────────────

  /**
   * Parse workflow steps from raw YAML and render them as actionable
   * instructions that Claude Code can execute step-by-step.
   */
  _renderWorkflowInstructions(workflow, agentLookup, config) {
    const steps = this._parseWorkflowSteps(workflow.raw);
    const outputDir = config.output_dir || './cohesium-output';

    let out = '## Instructions d\'exécution\n\n';
    out += `Répertoire de sortie : \`${outputDir}\`\n\n`;
    out += 'Exécute les étapes suivantes dans l\'ordre. ';
    out += 'Pour chaque étape, adopte le rôle de l\'agent indiqué en lisant sa définition dans `.claude/agents/`.\n\n';

    if (steps.length === 0) {
      // Fallback : inclure le YAML brut si le parsing échoue
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

  /**
   * Parse steps from a raw YAML workflow string.
   */
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
      if (lineCount > 200) {
        errors.push(`CLAUDE.md trop long (${lineCount} lignes, recommandé < 200)`);
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
