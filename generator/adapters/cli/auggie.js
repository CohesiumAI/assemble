/**
 * Assemble — Auggie (Augment Code) Adapter
 * Generates .augment/commands/*.md with YAML frontmatter
 * Each agent, skill, and workflow becomes a slash command
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, agentId, marvelSlug, marvelDisplayName, skillSlug, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions, renderCommandRegistry } = require('../../lib/template-engine');

module.exports = {
  name: 'auggie',
  displayName: 'Auggie',
  type: 'cli',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
    const paths = [
      // Command registry (always generated)
      path.join(projectDir, '.augment', 'commands', '_commands.md'),
    ];
    for (const agent of agents) {
      paths.push(path.join(projectDir, '.augment', 'commands', `agent-${marvelSlug(agent)}.md`));
    }
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      paths.push(path.join(projectDir, '.augment', 'commands', `${skillSlug(skill)}.md`));
    }
    for (const workflow of workflows) {
      paths.push(path.join(projectDir, '.augment', 'commands', `${workflowSlug(workflow)}.md`));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const commandsDir = path.join(projectDir, '.augment', 'commands');
    fs.mkdirSync(commandsDir, { recursive: true });

    const agentLookup = buildAgentLookup(agents);

    // ── Agent commands ────────────────────────────────────────────────────
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = marvelSlug(agent);
      const display = marvelDisplayName(agent);
      const id = agentId(agent);
      const desc = agent.meta.description || '';

      let content = '---\n';
      content += `name: "${display} (${id})"\n`;
      content += `slug: agent-${slug}\n`;
      content += `description: "${desc.replace(/"/g, '\\"')}"\n`;
      content += `category: "agent"\n`;
      content += '---\n\n';
      content += prepared.content;

      fs.writeFileSync(path.join(commandsDir, `agent-${slug}.md`), content, 'utf-8');
    }

    // ── Skill commands ────────────────────────────────────────────────────
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      const prepared = prepareAgent(skill, config);
      const slug = skillSlug(skill);
      const desc = skill.meta.description || '';

      let content = '---\n';
      content += `name: "${skill.meta.name || slug}"\n`;
      content += `slug: ${slug}\n`;
      content += `description: "${desc.replace(/"/g, '\\"')}"\n`;
      content += `category: "skill"\n`;
      content += '---\n\n';
      content += prepared.content;

      fs.writeFileSync(path.join(commandsDir, `${slug}.md`), content, 'utf-8');
    }

    // ── Workflow commands ─────────────────────────────────────────────────
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const name = workflowField(workflow.raw, 'name') || slug;
      const desc = workflowField(workflow.raw, 'description');

      let content = '---\n';
      content += `name: "Workflow ${name}"\n`;
      content += `slug: ${slug}\n`;
      content += `description: "${desc.replace(/"/g, '\\"')}"\n`;
      content += `category: "workflow"\n`;
      content += '---\n\n';
      content += `# Workflow : ${name}\n\n${desc}\n\n`;
      content += renderWorkflowInstructions(workflow, agentLookup, config);

      fs.writeFileSync(path.join(commandsDir, `${slug}.md`), content, 'utf-8');
    }

    // ── Command registry (global reference with governance) ─────────────
    fs.writeFileSync(
      path.join(commandsDir, '_commands.md'),
      '---\nname: "Command Reference"\nslug: help\ndescription: "Show command catalog and methodology"\ncategory: "meta"\n---\n\n' +
      renderCommandRegistry(agents, skills, workflows, config.governance),
      'utf-8'
    );
  },

  validate(projectDir) {
    const errors = [];
    const commandsDir = path.join(projectDir, '.augment', 'commands');
    if (!fs.existsSync(commandsDir)) {
      errors.push('Missing .augment/commands/ directory');
    } else {
      for (const file of fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'))) {
        const content = fs.readFileSync(path.join(commandsDir, file), 'utf-8');
        if (content.trim().length === 0) errors.push(`Empty: ${file}`);
        if (!content.startsWith('---')) errors.push(`Missing frontmatter: ${file}`);
      }
    }
    return { valid: errors.length === 0, errors };
  }
};
