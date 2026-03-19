/**
 * Assemble — QwenCoder Adapter
 * Generates .qwencoder/agents/ + skills/ + workflows/
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, marvelSlug, skillSlug, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions, renderCommandRegistry } = require('../../lib/template-engine');

module.exports = {
  name: 'qwencoder',
  displayName: 'QwenCoder',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
    const paths = [];
    for (const a of agents) paths.push(path.join(projectDir, '.qwencoder', 'agents', `${marvelSlug(a)}.md`));
    for (const s of [...(skills.shared || []), ...(skills.specific || [])]) paths.push(path.join(projectDir, '.qwencoder', 'skills', `${skillSlug(s)}.md`));
    for (const w of workflows) paths.push(path.join(projectDir, '.qwencoder', 'workflows', `${workflowSlug(w)}.md`));
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    for (const d of ['agents', 'skills', 'workflows']) fs.mkdirSync(path.join(projectDir, '.qwencoder', d), { recursive: true });
    const agentLookup = buildAgentLookup(agents);

    for (const agent of agents) { const p = prepareAgent(agent, config); fs.writeFileSync(path.join(projectDir, '.qwencoder', 'agents', `${marvelSlug(agent)}.md`), renderAgent(p, 'markdown'), 'utf-8'); }
    for (const skill of [...(skills.shared || []), ...(skills.specific || [])]) { const p = prepareAgent(skill, config); fs.writeFileSync(path.join(projectDir, '.qwencoder', 'skills', `${skillSlug(skill)}.md`), renderAgent(p, 'markdown'), 'utf-8'); }
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      let content = `# Workflow : ${workflowField(workflow.raw, 'name') || slug}\n\n${workflowField(workflow.raw, 'description')}\n\n`;
      content += renderWorkflowInstructions(workflow, agentLookup, config);
      fs.writeFileSync(path.join(projectDir, '.qwencoder', 'workflows', `${slug}.md`), content, 'utf-8');
    }

    fs.writeFileSync(path.join(projectDir, '.qwencoder', 'commands.md'), renderCommandRegistry(agents, skills, workflows), 'utf-8');
  },

  validate(projectDir) {
    const errors = [];
    for (const subdir of ['agents', 'skills', 'workflows']) {
      const dir = path.join(projectDir, '.qwencoder', subdir);
      if (fs.existsSync(dir)) for (const file of fs.readdirSync(dir)) { if (fs.readFileSync(path.join(dir, file), 'utf-8').trim().length === 0) errors.push(`Empty: .qwencoder/${subdir}/${file}`); }
    }
    if (!fs.existsSync(path.join(projectDir, '.qwencoder', 'agents'))) errors.push('Missing .qwencoder/agents/');
    return { valid: errors.length === 0, errors };
  }
};
