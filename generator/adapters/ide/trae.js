/**
 * Assemble — Trae Adapter
 * Generates .trae/rules/ (compact) + .trae/agents/ + .trae/skills/ + .trae/workflows/
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, marvelSlug, skillSlug, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions, renderCommandRegistry } = require('../../lib/template-engine');

module.exports = {
  name: 'trae',
  displayName: 'Trae',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
    const paths = [];
    for (const agent of agents) { const s = marvelSlug(agent); paths.push(path.join(projectDir, '.trae', 'rules', `${s}.md`)); paths.push(path.join(projectDir, '.trae', 'agents', `${s}.md`)); }
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) paths.push(path.join(projectDir, '.trae', 'skills', `${skillSlug(skill)}.md`));
    for (const wf of workflows) paths.push(path.join(projectDir, '.trae', 'workflows', `${workflowSlug(wf)}.md`));
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    for (const d of ['rules', 'agents', 'skills', 'workflows']) fs.mkdirSync(path.join(projectDir, '.trae', d), { recursive: true });
    const agentLookup = buildAgentLookup(agents);

    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = marvelSlug(agent);
      const content = renderAgent(prepared, 'markdown');
      fs.writeFileSync(path.join(projectDir, '.trae', 'rules', `${slug}.md`), content, 'utf-8');
      fs.writeFileSync(path.join(projectDir, '.trae', 'agents', `${slug}.md`), content, 'utf-8');
    }

    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      const prepared = prepareAgent(skill, config);
      fs.writeFileSync(path.join(projectDir, '.trae', 'skills', `${skillSlug(skill)}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const name = workflowField(workflow.raw, 'name') || slug;
      const desc = workflowField(workflow.raw, 'description');
      let content = `# Workflow : ${name}\n\n${desc}\n\n`;
      content += renderWorkflowInstructions(workflow, agentLookup, config);
      fs.writeFileSync(path.join(projectDir, '.trae', 'workflows', `${slug}.md`), content, 'utf-8');
    }

    fs.writeFileSync(path.join(projectDir, '.trae', 'commands.md'), renderCommandRegistry(agents, skills, workflows), 'utf-8');
  },

  validate(projectDir) {
    const errors = [];
    if (!fs.existsSync(path.join(projectDir, '.trae'))) { errors.push('Missing .trae directory'); return { valid: false, errors }; }
    for (const subdir of ['rules', 'agents', 'skills', 'workflows']) {
      const dir = path.join(projectDir, '.trae', subdir);
      if (fs.existsSync(dir)) for (const file of fs.readdirSync(dir)) { const c = fs.readFileSync(path.join(dir, file), 'utf-8'); if (c.trim().length === 0) errors.push(`Empty: .trae/${subdir}/${file}`); }
    }
    return { valid: errors.length === 0, errors };
  }
};
