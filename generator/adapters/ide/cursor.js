/**
 * Cohesium AI — Cursor Adapter
 * Generates .cursorrules + .cursor/agents/ with skills & workflows
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderOrchestrator, marvelSlug, marvelDisplayName, agentId, skillSlug, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions } = require('../../lib/template-engine');

module.exports = {
  name: 'cursor',
  displayName: 'Cursor',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [], orchestrator } = {}) {
    const paths = [path.join(projectDir, '.cursorrules')];
    for (const agent of agents) {
      paths.push(path.join(projectDir, '.cursor', 'agents', `${marvelSlug(agent)}.md`));
    }
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      paths.push(path.join(projectDir, '.cursor', 'skills', `${skillSlug(skill)}.md`));
    }
    for (const workflow of workflows) {
      paths.push(path.join(projectDir, '.cursor', 'workflows', `${workflowSlug(workflow)}.md`));
    }
    if (orchestrator) paths.push(path.join(projectDir, '.cursor', 'agents', 'ORCHESTRATOR.md'));
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const agentsDir = path.join(projectDir, '.cursor', 'agents');
    const skillsDir = path.join(projectDir, '.cursor', 'skills');
    const workflowsDir = path.join(projectDir, '.cursor', 'workflows');
    fs.mkdirSync(agentsDir, { recursive: true });
    fs.mkdirSync(skillsDir, { recursive: true });
    fs.mkdirSync(workflowsDir, { recursive: true });

    const agentLookup = buildAgentLookup(agents);

    // ── .cursorrules — compact overview ───────────────────────────────────
    let rules = '# Cohesium AI — Cursor Configuration\n\n';

    if (orchestrator) {
      rules += '## Orchestrator\n\n';
      rules += renderOrchestrator(orchestrator, config) + '\n\n';
    }

    rules += '## Agents disponibles\n\n';
    for (const agent of agents) {
      const slug = marvelSlug(agent);
      const display = marvelDisplayName(agent);
      const desc = (agent.meta.description || '').split('—')[0].trim();
      rules += `- **${display}** — ${desc} → \`.cursor/agents/${slug}.md\`\n`;
    }

    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    rules += '\n## Skills disponibles\n\n';
    for (const skill of allSkills) {
      const slug = skillSlug(skill);
      const desc = (skill.meta.description || '').split('—')[0].trim();
      rules += `- **${slug}** — ${desc}\n`;
    }

    rules += '\n## Workflows disponibles\n\n';
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const desc = workflowField(workflow.raw, 'description');
      rules += `- **${slug}** — ${desc}\n`;
    }

    rules += `\n## Répertoire de sortie\n\nLes livrables → \`${config.output_dir || './cohesium-output'}\`\n`;
    fs.writeFileSync(path.join(projectDir, '.cursorrules'), rules, 'utf-8');

    // ── Individual agent files ────────────────────────────────────────────
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = marvelSlug(agent);
      fs.writeFileSync(path.join(agentsDir, `${slug}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    // ── Orchestrator file ─────────────────────────────────────────────────
    if (orchestrator) {
      const preparedOrch = prepareAgent(orchestrator, config);
      fs.writeFileSync(path.join(agentsDir, 'ORCHESTRATOR.md'), renderAgent(preparedOrch, 'markdown'), 'utf-8');
    }

    // ── Skill files ───────────────────────────────────────────────────────
    for (const skill of allSkills) {
      const prepared = prepareAgent(skill, config);
      const slug = skillSlug(skill);
      fs.writeFileSync(path.join(skillsDir, `${slug}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    // ── Workflow files ────────────────────────────────────────────────────
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const name = workflowField(workflow.raw, 'name') || slug;
      const desc = workflowField(workflow.raw, 'description');
      let content = `# Workflow : ${name}\n\n${desc}\n\n`;
      content += renderWorkflowInstructions(workflow, agentLookup, config);
      fs.writeFileSync(path.join(workflowsDir, `${slug}.md`), content, 'utf-8');
    }
  },

  validate(projectDir) {
    const errors = [];
    if (!fs.existsSync(path.join(projectDir, '.cursorrules'))) errors.push('Missing .cursorrules');
    for (const subdir of ['agents', 'skills', 'workflows']) {
      const dir = path.join(projectDir, '.cursor', subdir);
      if (fs.existsSync(dir)) {
        for (const file of fs.readdirSync(dir)) {
          const content = fs.readFileSync(path.join(dir, file), 'utf-8');
          if (content.trim().length === 0) errors.push(`Empty: .cursor/${subdir}/${file}`);
        }
      }
    }
    return { valid: errors.length === 0, errors };
  }
};
