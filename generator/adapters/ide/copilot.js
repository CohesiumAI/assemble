/**
 * Assemble — GitHub Copilot Adapter
 * Generates .github/copilot-instructions.md (main)
 * + .github/instructions/*.md (path-specific agent instructions)
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderOrchestrator, marvelSlug, marvelDisplayName, agentId, skillSlug, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions, renderCommandRegistry } = require('../../lib/template-engine');

module.exports = {
  name: 'copilot',
  displayName: 'GitHub Copilot',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
    const paths = [path.join(projectDir, '.github', 'copilot-instructions.md')];
    for (const agent of agents) {
      paths.push(path.join(projectDir, '.github', 'instructions', `agent-${marvelSlug(agent)}.md`));
    }
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      paths.push(path.join(projectDir, '.github', 'instructions', `skill-${skillSlug(skill)}.md`));
    }
    for (const workflow of workflows) {
      paths.push(path.join(projectDir, '.github', 'instructions', `workflow-${workflowSlug(workflow)}.md`));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const githubDir = path.join(projectDir, '.github');
    const instructionsDir = path.join(githubDir, 'instructions');
    fs.mkdirSync(instructionsDir, { recursive: true });

    const agentLookup = buildAgentLookup(agents);

    // ── copilot-instructions.md — main overview ───────────────────────────
    let main = '# Assemble — Copilot Instructions\n\n';

    if (orchestrator) {
      main += '## Orchestrator\n\n';
      main += renderOrchestrator(orchestrator, config) + '\n\n';
    }

    main += '## Agents disponibles\n\n';
    for (const agent of agents) {
      const display = marvelDisplayName(agent);
      const id = agentId(agent);
      const desc = (agent.meta.description || '').split('—')[0].trim();
      main += `- **${display}** (${id}) — ${desc}\n`;
    }

    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    main += '\n## Skills disponibles\n\n';
    for (const skill of allSkills) {
      const slug = skillSlug(skill);
      const desc = (skill.meta.description || '').split('—')[0].trim();
      main += `- **${slug}** — ${desc}\n`;
    }

    main += '\n## Workflows disponibles\n\n';
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const desc = workflowField(workflow.raw, 'description');
      main += `- **${slug}** — ${desc}\n`;
    }

    main += '\n' + renderCommandRegistry(agents, skills, workflows, config.governance);

    main += `\n## Répertoire de sortie\n\nLivrables → \`${config.output_dir || './assemble-output'}\`\n`;
    fs.writeFileSync(path.join(githubDir, 'copilot-instructions.md'), main, 'utf-8');

    // ── Agent instruction files ───────────────────────────────────────────
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = marvelSlug(agent);
      fs.writeFileSync(path.join(instructionsDir, `agent-${slug}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    // ── Skill instruction files ───────────────────────────────────────────
    for (const skill of allSkills) {
      const prepared = prepareAgent(skill, config);
      const slug = skillSlug(skill);
      fs.writeFileSync(path.join(instructionsDir, `skill-${slug}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    // ── Workflow instruction files ────────────────────────────────────────
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const name = workflowField(workflow.raw, 'name') || slug;
      const desc = workflowField(workflow.raw, 'description');
      let content = `# Workflow : ${name}\n\n${desc}\n\n`;
      content += renderWorkflowInstructions(workflow, agentLookup, config);
      fs.writeFileSync(path.join(instructionsDir, `workflow-${slug}.md`), content, 'utf-8');
    }
  },

  validate(projectDir) {
    const errors = [];
    const p = path.join(projectDir, '.github', 'copilot-instructions.md');
    if (!fs.existsSync(p)) errors.push('Missing copilot-instructions.md');
    else if (fs.readFileSync(p, 'utf-8').trim().length === 0) errors.push('copilot-instructions.md is empty');
    const dir = path.join(projectDir, '.github', 'instructions');
    if (fs.existsSync(dir)) {
      for (const file of fs.readdirSync(dir)) {
        const content = fs.readFileSync(path.join(dir, file), 'utf-8');
        if (content.trim().length === 0) errors.push(`Empty: .github/instructions/${file}`);
      }
    }
    return { valid: errors.length === 0, errors };
  }
};
