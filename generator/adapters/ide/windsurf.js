/**
 * Cohesium AI — Windsurf Adapter
 * Generates .windsurfrules and .windsurf/workflows/ files
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAsRules, renderWorkflow, renderCommands, renderOrchestrator } = require('../../lib/template-engine');

module.exports = {
  name: 'windsurf',
  displayName: 'Windsurf',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [], workflows = [] } = {}) {
    const paths = [path.join(projectDir, '.windsurfrules')];
    for (const workflow of workflows) {
      paths.push(path.join(projectDir, '.windsurf', 'workflows', workflow.fileName));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    // Build compact .windsurfrules with all agent capabilities
    let rulesContent = '# Cohesium AI — Windsurf Configuration\n\n';

    if (orchestrator) {
      rulesContent += '## Orchestrator\n\n';
      rulesContent += renderOrchestrator(orchestrator, config) + '\n\n';
    }

    if (commands) {
      rulesContent += renderCommands(commands, 'markdown') + '\n\n';
    }

    // Inline all agents in compact rules format
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      rulesContent += renderAsRules(prepared) + '\n';
    }

    // Inline all skills
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    if (allSkills.length > 0) {
      rulesContent += '## Skills\n\n';
      for (const skill of allSkills) {
        const prepared = prepareAgent(skill, config);
        rulesContent += renderAsRules(prepared);
      }
    }

    fs.writeFileSync(path.join(projectDir, '.windsurfrules'), rulesContent, 'utf-8');

    // Generate workflow files
    if (workflows.length > 0) {
      const workflowsDir = path.join(projectDir, '.windsurf', 'workflows');
      fs.mkdirSync(workflowsDir, { recursive: true });

      for (const workflow of workflows) {
        const content = renderWorkflow(workflow, 'yaml');
        fs.writeFileSync(path.join(workflowsDir, workflow.fileName), content, 'utf-8');
      }
    }
  },

  validate(projectDir) {
    const errors = [];
    const rulesPath = path.join(projectDir, '.windsurfrules');

    if (!fs.existsSync(rulesPath)) {
      errors.push(`Missing main rules file: ${rulesPath}`);
    } else {
      const content = fs.readFileSync(rulesPath, 'utf-8');
      if (content.trim().length === 0) {
        errors.push('Main rules file is empty');
      }
    }

    return { valid: errors.length === 0, errors };
  }
};
