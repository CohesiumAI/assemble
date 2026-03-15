/**
 * Cohesium AI — iFlow Adapter
 * Generates .iflow/agents/{agent-name}.md and .iflow/flows/ for workflows
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderWorkflow } = require('../../lib/template-engine');

module.exports = {
  name: 'iflow',
  displayName: 'iFlow',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [], workflows = [] } = {}) {
    const paths = [];
    for (const agent of agents) {
      const slug = (agent.meta.name || agent.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      paths.push(path.join(projectDir, '.iflow', 'agents', `${slug}.md`));
    }
    for (const workflow of workflows) {
      paths.push(path.join(projectDir, '.iflow', 'flows', workflow.fileName));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const agentsDir = path.join(projectDir, '.iflow', 'agents');
    const flowsDir = path.join(projectDir, '.iflow', 'flows');
    fs.mkdirSync(agentsDir, { recursive: true });
    fs.mkdirSync(flowsDir, { recursive: true });

    // Generate agent files
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = (agent.meta.name || agent.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      const content = renderAgent(prepared, 'markdown');
      fs.writeFileSync(path.join(agentsDir, `${slug}.md`), content, 'utf-8');
    }

    // Generate workflow/flow files
    for (const workflow of workflows) {
      const content = renderWorkflow(workflow, 'yaml');
      fs.writeFileSync(path.join(flowsDir, workflow.fileName), content, 'utf-8');
    }
  },

  validate(projectDir) {
    const errors = [];
    const iflowDir = path.join(projectDir, '.iflow');

    if (!fs.existsSync(iflowDir)) {
      errors.push(`Missing .iflow directory: ${iflowDir}`);
    } else {
      for (const subdir of ['agents', 'flows']) {
        const dir = path.join(iflowDir, subdir);
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            const content = fs.readFileSync(path.join(dir, file), 'utf-8');
            if (content.trim().length === 0) {
              errors.push(`Empty file: ${path.join(subdir, file)}`);
            }
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
};
