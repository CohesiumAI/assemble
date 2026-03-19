/**
 * Assemble — iFlow Adapter
 * Generates .iflow/agents/ + .iflow/skills/ + .iflow/flows/
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, marvelSlug, skillSlug, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions, renderCommandRegistry, renderOrchestrator } = require('../../lib/template-engine');

module.exports = {
  name: 'iflow',
  displayName: 'iFlow',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
    const paths = [];
    for (const agent of agents) paths.push(path.join(projectDir, '.iflow', 'agents', `${marvelSlug(agent)}.md`));
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) paths.push(path.join(projectDir, '.iflow', 'skills', `${skillSlug(skill)}.md`));
    for (const wf of workflows) paths.push(path.join(projectDir, '.iflow', 'flows', `${workflowSlug(wf)}.md`));
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    for (const d of ['agents', 'skills', 'flows']) fs.mkdirSync(path.join(projectDir, '.iflow', d), { recursive: true });
    const agentLookup = buildAgentLookup(agents);

    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      fs.writeFileSync(path.join(projectDir, '.iflow', 'agents', `${marvelSlug(agent)}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      const prepared = prepareAgent(skill, config);
      fs.writeFileSync(path.join(projectDir, '.iflow', 'skills', `${skillSlug(skill)}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const name = workflowField(workflow.raw, 'name') || slug;
      const desc = workflowField(workflow.raw, 'description');
      let content = `# Workflow : ${name}\n\n${desc}\n\n`;
      content += renderWorkflowInstructions(workflow, agentLookup, config);
      fs.writeFileSync(path.join(projectDir, '.iflow', 'flows', `${slug}.md`), content, 'utf-8');
    }

    fs.writeFileSync(path.join(projectDir, '.iflow', 'commands.md'), renderCommandRegistry(agents, skills, workflows, config.governance), 'utf-8');
    if (orchestrator) {
      fs.writeFileSync(path.join(projectDir, '.iflow', 'orchestrator.md'), renderOrchestrator(orchestrator, config), 'utf-8');
    }
  },

  validate(projectDir) {
    const errors = [];
    if (!fs.existsSync(path.join(projectDir, '.iflow'))) { errors.push('Missing .iflow directory'); return { valid: false, errors }; }
    for (const subdir of ['agents', 'skills', 'flows']) {
      const dir = path.join(projectDir, '.iflow', subdir);
      if (fs.existsSync(dir)) for (const file of fs.readdirSync(dir)) { const c = fs.readFileSync(path.join(dir, file), 'utf-8'); if (c.trim().length === 0) errors.push(`Empty: .iflow/${subdir}/${file}`); }
    }
    return { valid: errors.length === 0, errors };
  }
};
