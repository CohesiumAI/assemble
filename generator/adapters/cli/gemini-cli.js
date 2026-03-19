/**
 * Assemble — Gemini CLI Adapter
 * Generates GEMINI.md (concise overview) + .gemini/ directory with
 * individual agent, skill, and workflow files
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderOrchestrator, agentId, marvelSlug, marvelDisplayName, skillSlug, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions, renderCommandRegistry } = require('../../lib/template-engine');

module.exports = {
  name: 'gemini-cli',
  displayName: 'Gemini CLI',
  type: 'cli',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
    const paths = [path.join(projectDir, 'GEMINI.md')];
    for (const agent of agents) {
      paths.push(path.join(projectDir, '.gemini', 'agents', `${marvelSlug(agent)}.md`));
    }
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      paths.push(path.join(projectDir, '.gemini', 'skills', `${skillSlug(skill)}.md`));
    }
    for (const workflow of workflows) {
      paths.push(path.join(projectDir, '.gemini', 'workflows', `${workflowSlug(workflow)}.md`));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const geminiAgentsDir = path.join(projectDir, '.gemini', 'agents');
    const geminiSkillsDir = path.join(projectDir, '.gemini', 'skills');
    const geminiWorkflowsDir = path.join(projectDir, '.gemini', 'workflows');
    fs.mkdirSync(geminiAgentsDir, { recursive: true });
    fs.mkdirSync(geminiSkillsDir, { recursive: true });
    fs.mkdirSync(geminiWorkflowsDir, { recursive: true });

    const agentLookup = buildAgentLookup(agents);

    // ── Individual agent files ────────────────────────────────────────────
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = marvelSlug(agent);
      fs.writeFileSync(path.join(geminiAgentsDir, `${slug}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    // ── Individual skill files ────────────────────────────────────────────
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      const prepared = prepareAgent(skill, config);
      const slug = skillSlug(skill);
      fs.writeFileSync(path.join(geminiSkillsDir, `${slug}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    // ── Individual workflow files ─────────────────────────────────────────
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const name = workflowField(workflow.raw, 'name') || slug;
      const desc = workflowField(workflow.raw, 'description');
      let content = `# Workflow : ${name}\n\n${desc}\n\n`;
      content += renderWorkflowInstructions(workflow, agentLookup, config);
      fs.writeFileSync(path.join(geminiWorkflowsDir, `${slug}.md`), content, 'utf-8');
    }

    // ── Orchestrator ──────────────────────────────────────────────────────
    if (orchestrator) {
      fs.writeFileSync(path.join(projectDir, '.gemini', 'orchestrator.md'), renderOrchestrator(orchestrator, config), 'utf-8');
    }

    // ── GEMINI.md — concise overview ──────────────────────────────────────
    let gemini = '# Assemble\n\n';
    gemini += 'Ce projet utilise le système Assemble by Cohesium AI avec des agents IA spécialisés.\n\n';

    gemini += '## Agents disponibles\n\n';
    for (const agent of agents) {
      const slug = marvelSlug(agent);
      const display = marvelDisplayName(agent);
      const desc = (agent.meta.description || '').split('—')[0].trim();
      gemini += `- **${display}** — ${desc} → \`.gemini/agents/${slug}.md\`\n`;
    }

    gemini += '\n## Skills disponibles\n\n';
    for (const skill of allSkills) {
      const slug = skillSlug(skill);
      const desc = (skill.meta.description || '').split('—')[0].trim();
      gemini += `- **${slug}** — ${desc}\n`;
    }

    gemini += '\n## Workflows disponibles\n\n';
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const desc = workflowField(workflow.raw, 'description');
      gemini += `- **${slug}** — ${desc}\n`;
    }

    gemini += '\n' + renderCommandRegistry(agents, skills, workflows, config.governance);

    gemini += `\n## Répertoire de sortie\n\nLes livrables sont produits dans : \`${config.output_dir || './assemble-output'}\`\n`;

    fs.writeFileSync(path.join(projectDir, 'GEMINI.md'), gemini, 'utf-8');
  },

  validate(projectDir) {
    const errors = [];
    const p = path.join(projectDir, 'GEMINI.md');
    if (!fs.existsSync(p)) errors.push('Missing GEMINI.md');
    else if (fs.readFileSync(p, 'utf-8').trim().length === 0) errors.push('GEMINI.md is empty');
    for (const subdir of ['agents', 'skills', 'workflows']) {
      const dir = path.join(projectDir, '.gemini', subdir);
      if (fs.existsSync(dir)) {
        for (const file of fs.readdirSync(dir)) {
          const content = fs.readFileSync(path.join(dir, file), 'utf-8');
          if (content.trim().length === 0) errors.push(`Empty: .gemini/${subdir}/${file}`);
        }
      }
    }
    return { valid: errors.length === 0, errors };
  }
};
