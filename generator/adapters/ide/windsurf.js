/**
 * Assemble — Windsurf Adapter
 * Generates .windsurfrules (compact overview, respecting 6000 char limit)
 * + .windsurf/rules/*.md for full agent/skill definitions
 * + .windsurf/workflows/ for workflow YAML files
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderWorkflow, renderOrchestrator, marvelSlug, marvelDisplayName, agentId, skillSlug, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions, renderCommandRegistry } = require('../../lib/template-engine');

module.exports = {
  name: 'windsurf',
  displayName: 'Windsurf',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
    const paths = [path.join(projectDir, '.windsurfrules')];
    for (const agent of agents) {
      paths.push(path.join(projectDir, '.windsurf', 'rules', `agent-${marvelSlug(agent)}.md`));
    }
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      paths.push(path.join(projectDir, '.windsurf', 'rules', `skill-${skillSlug(skill)}.md`));
    }
    for (const workflow of workflows) {
      paths.push(path.join(projectDir, '.windsurf', 'workflows', workflow.fileName));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const rulesDir = path.join(projectDir, '.windsurf', 'rules');
    const workflowsDir = path.join(projectDir, '.windsurf', 'workflows');
    fs.mkdirSync(rulesDir, { recursive: true });
    fs.mkdirSync(workflowsDir, { recursive: true });

    const agentLookup = buildAgentLookup(agents);

    // ── .windsurfrules — compact overview (under 6000 chars) ──────────────
    let rules = '# Assemble\n\n';
    rules += 'Système multi-agents IA spécialisés. Détails dans .windsurf/rules/.\n\n';

    if (orchestrator) {
      rules += '## Orchestrator\n\nVoir .windsurf/rules/orchestrator.md\n\n';
    }

    rules += '## Agents\n\n';
    for (const agent of agents) {
      const slug = marvelSlug(agent);
      const display = marvelDisplayName(agent);
      const desc = (agent.meta.description || '').split('—')[0].trim();
      rules += `- **${display}** — ${desc}\n`;
    }

    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    rules += '\n## Skills\n\n';
    for (const skill of allSkills) {
      const slug = skillSlug(skill);
      const desc = (skill.meta.description || '').split('—')[0].trim();
      rules += `- **${slug}** — ${desc}\n`;
    }

    rules += '\n## Workflows\n\n';
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const desc = workflowField(workflow.raw, 'description');
      rules += `- **${slug}** — ${desc}\n`;
    }

    rules += '\n' + renderCommandRegistry(agents, skills, workflows);

    rules += `\n## Output\n\nLivrables → \`${config.output_dir || './assemble-output'}\`\n`;
    fs.writeFileSync(path.join(projectDir, '.windsurfrules'), rules, 'utf-8');

    // ── Full agent files in .windsurf/rules/ ──────────────────────────────
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = marvelSlug(agent);
      fs.writeFileSync(path.join(rulesDir, `agent-${slug}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    // ── Orchestrator in .windsurf/rules/ ──────────────────────────────────
    if (orchestrator) {
      fs.writeFileSync(path.join(rulesDir, 'orchestrator.md'), renderOrchestrator(orchestrator, config), 'utf-8');
    }

    // ── Skill files in .windsurf/rules/ ───────────────────────────────────
    for (const skill of allSkills) {
      const prepared = prepareAgent(skill, config);
      const slug = skillSlug(skill);
      fs.writeFileSync(path.join(rulesDir, `skill-${slug}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    // ── Workflow files ────────────────────────────────────────────────────
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const name = workflowField(workflow.raw, 'name') || slug;
      const desc = workflowField(workflow.raw, 'description');
      let content = `# Workflow : ${name}\n\n${desc}\n\n`;
      content += renderWorkflowInstructions(workflow, agentLookup, config);
      fs.writeFileSync(path.join(workflowsDir, workflow.fileName), content, 'utf-8');
    }
  },

  validate(projectDir) {
    const errors = [];
    const rulesPath = path.join(projectDir, '.windsurfrules');
    if (!fs.existsSync(rulesPath)) {
      errors.push('Missing .windsurfrules');
    } else {
      const content = fs.readFileSync(rulesPath, 'utf-8');
      if (content.trim().length === 0) errors.push('.windsurfrules is empty');
      if (content.length > 6000) errors.push(`.windsurfrules exceeds 6000 char limit (${content.length})`);
    }
    for (const subdir of ['rules', 'workflows']) {
      const dir = path.join(projectDir, '.windsurf', subdir);
      if (fs.existsSync(dir)) {
        for (const file of fs.readdirSync(dir)) {
          const content = fs.readFileSync(path.join(dir, file), 'utf-8');
          if (content.trim().length === 0) errors.push(`Empty: .windsurf/${subdir}/${file}`);
        }
      }
    }
    return { valid: errors.length === 0, errors };
  }
};
