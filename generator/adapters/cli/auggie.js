/**
 * Cohesium AI — Auggie Adapter
 * Generates .auggie/agents/{agent-name}.md files
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent } = require('../../lib/template-engine');

module.exports = {
  name: 'auggie',
  displayName: 'Auggie',
  type: 'cli',

  getOutputPaths(projectDir, { agents = [] } = {}) {
    return agents.map(agent => {
      const slug = (agent.meta.name || agent.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      return path.join(projectDir, '.auggie', 'agents', `${slug}.md`);
    });
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const agentsDir = path.join(projectDir, '.auggie', 'agents');
    fs.mkdirSync(agentsDir, { recursive: true });

    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = (agent.meta.name || agent.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      const content = renderAgent(prepared, 'markdown');
      fs.writeFileSync(path.join(agentsDir, `${slug}.md`), content, 'utf-8');
    }
  },

  validate(projectDir) {
    const errors = [];
    const agentsDir = path.join(projectDir, '.auggie', 'agents');

    if (!fs.existsSync(agentsDir)) {
      errors.push(`Missing agents directory: ${agentsDir}`);
    } else {
      const files = fs.readdirSync(agentsDir);
      for (const file of files) {
        const content = fs.readFileSync(path.join(agentsDir, file), 'utf-8');
        if (content.trim().length === 0) {
          errors.push(`Empty agent file: ${file}`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
};
