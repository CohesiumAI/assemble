/**
 * Cohesium AI — Gemini CLI Adapter
 * Generates GEMINI.md with Gemini-compatible markdown format
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderAsRules, renderCommands, renderOrchestrator, renderWorkflow } = require('../../lib/template-engine');

module.exports = {
  name: 'gemini-cli',
  displayName: 'Gemini CLI',
  type: 'cli',

  getOutputPaths(projectDir) {
    return [path.join(projectDir, 'GEMINI.md')];
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    let content = '# Cohesium AI — Gemini CLI Configuration\n\n';

    // Orchestrator
    if (orchestrator) {
      content += '## Orchestrator\n\n';
      content += renderOrchestrator(orchestrator, config) + '\n\n';
    }

    // Commands
    if (commands) {
      content += renderCommands(commands, 'markdown') + '\n\n';
    }

    // Agents — markdown format compatible with Gemini
    if (agents.length > 0) {
      content += '## Agents\n\n';
      for (const agent of agents) {
        const prepared = prepareAgent(agent, config);
        const agentName = agent.meta.name || agent.fileName.replace('.md', '');
        const description = agent.meta.description || '';
        content += `### ${agentName}\n\n`;
        content += `${description}\n\n`;
        content += renderAsRules(prepared) + '\n';
      }
    }

    // Skills
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    if (allSkills.length > 0) {
      content += '## Skills\n\n';
      for (const skill of allSkills) {
        const skillName = skill.meta.name || skill.fileName.replace('.md', '');
        content += `### ${skillName}\n\n`;
        content += `${skill.meta.description || ''}\n\n`;
        if (skill.content) {
          content += skill.content + '\n\n';
        }
      }
    }

    // Workflows
    if (workflows.length > 0) {
      content += '## Workflows\n\n';
      for (const workflow of workflows) {
        content += renderWorkflow(workflow, 'markdown') + '\n\n';
      }
    }

    fs.writeFileSync(path.join(projectDir, 'GEMINI.md'), content, 'utf-8');
  },

  validate(projectDir) {
    const errors = [];
    const geminiPath = path.join(projectDir, 'GEMINI.md');

    if (!fs.existsSync(geminiPath)) {
      errors.push(`Missing main instructions file: ${geminiPath}`);
    } else {
      const content = fs.readFileSync(geminiPath, 'utf-8');
      if (content.trim().length === 0) {
        errors.push('GEMINI.md is empty');
      }
    }

    return { valid: errors.length === 0, errors };
  }
};
