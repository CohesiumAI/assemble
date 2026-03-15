/**
 * Cohesium AI — Trae Adapter
 * Generates .trae/rules/ and .trae/agents/ files
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent } = require('../../lib/template-engine');

module.exports = {
  name: 'trae',
  displayName: 'Trae',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [] } = {}) {
    const paths = [];
    for (const agent of agents) {
      const slug = (agent.meta.name || agent.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      paths.push(path.join(projectDir, '.trae', 'rules', `${slug}.md`));
      paths.push(path.join(projectDir, '.trae', 'agents', `${slug}.md`));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const rulesDir = path.join(projectDir, '.trae', 'rules');
    const agentsDir = path.join(projectDir, '.trae', 'agents');
    fs.mkdirSync(rulesDir, { recursive: true });
    fs.mkdirSync(agentsDir, { recursive: true });

    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = (agent.meta.name || agent.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      const content = renderAgent(prepared, 'markdown');

      // Rules file (same content as agent)
      fs.writeFileSync(path.join(rulesDir, `${slug}.md`), content, 'utf-8');
      // Agent file
      fs.writeFileSync(path.join(agentsDir, `${slug}.md`), content, 'utf-8');
    }
  },

  validate(projectDir) {
    const errors = [];
    const traeDir = path.join(projectDir, '.trae');

    if (!fs.existsSync(traeDir)) {
      errors.push(`Missing .trae directory: ${traeDir}`);
    } else {
      for (const subdir of ['rules', 'agents']) {
        const dir = path.join(traeDir, subdir);
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
