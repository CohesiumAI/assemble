/**
 * Cohesium AI — Kiro Adapter
 * Generates .kiro/agents/, .kiro/skills/, and .kiro/workflows/ files
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderWorkflow } = require('../../lib/template-engine');

module.exports = {
  name: 'kiro',
  displayName: 'Kiro',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
    const paths = [];
    for (const agent of agents) {
      const slug = (agent.meta.name || agent.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      paths.push(path.join(projectDir, '.kiro', 'agents', `${slug}.md`));
    }
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      const slug = (skill.meta.name || skill.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      paths.push(path.join(projectDir, '.kiro', 'skills', `${slug}.md`));
    }
    for (const workflow of workflows) {
      paths.push(path.join(projectDir, '.kiro', 'workflows', workflow.fileName));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const kiroAgentsDir = path.join(projectDir, '.kiro', 'agents');
    const kiroSkillsDir = path.join(projectDir, '.kiro', 'skills');
    const kiroWorkflowsDir = path.join(projectDir, '.kiro', 'workflows');
    fs.mkdirSync(kiroAgentsDir, { recursive: true });
    fs.mkdirSync(kiroSkillsDir, { recursive: true });
    fs.mkdirSync(kiroWorkflowsDir, { recursive: true });

    // Generate agent files
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = (agent.meta.name || agent.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      const content = renderAgent(prepared, 'markdown');
      fs.writeFileSync(path.join(kiroAgentsDir, `${slug}.md`), content, 'utf-8');
    }

    // Generate skill files
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      const prepared = prepareAgent(skill, config);
      const slug = (skill.meta.name || skill.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      const content = renderAgent(prepared, 'markdown');
      fs.writeFileSync(path.join(kiroSkillsDir, `${slug}.md`), content, 'utf-8');
    }

    // Generate workflow files
    for (const workflow of workflows) {
      const content = renderWorkflow(workflow, 'yaml');
      fs.writeFileSync(path.join(kiroWorkflowsDir, workflow.fileName), content, 'utf-8');
    }
  },

  validate(projectDir) {
    const errors = [];
    const kiroDir = path.join(projectDir, '.kiro');

    if (!fs.existsSync(kiroDir)) {
      errors.push(`Missing .kiro directory: ${kiroDir}`);
    } else {
      for (const subdir of ['agents', 'skills', 'workflows']) {
        const dir = path.join(kiroDir, subdir);
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
