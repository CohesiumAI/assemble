/**
 * Cohesium AI — Cursor Adapter
 * Generates .cursorrules and .cursor/agents/ files
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderAsMarkdown, renderOrchestrator, renderCommands } = require('../../lib/template-engine');
const { translateSectionLabel } = require('../../lib/i18n');

module.exports = {
  name: 'cursor',
  displayName: 'Cursor',
  type: 'ide',

  /**
   * Returns the list of output file paths this adapter will create
   */
  getOutputPaths(projectDir, { agents = [], orchestrator, commands } = {}) {
    const paths = [path.join(projectDir, '.cursorrules')];

    for (const agent of agents) {
      const agentName = agent.meta.name || agent.fileName.replace('.md', '');
      paths.push(path.join(projectDir, '.cursor', 'agents', `AGENT-${agentName}.md`));
    }

    if (orchestrator) {
      paths.push(path.join(projectDir, '.cursor', 'agents', 'ORCHESTRATOR.md'));
    }

    return paths;
  },

  /**
   * Generate all config files for Cursor
   */
  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const agentsDir = path.join(projectDir, '.cursor', 'agents');
    fs.mkdirSync(agentsDir, { recursive: true });

    // Build .cursorrules main file
    let rulesContent = '# Cohesium AI — Cursor Configuration\n\n';

    // Include orchestrator reference in rules
    if (orchestrator) {
      const preparedOrch = prepareAgent(orchestrator, config);
      rulesContent += '## Orchestrator\n\n';
      rulesContent += 'This project uses an AI agent orchestrator. See `.cursor/agents/ORCHESTRATOR.md` for the full orchestration rules.\n\n';
      rulesContent += renderOrchestrator(orchestrator, config) + '\n\n';
    }

    // Include commands reference
    if (commands) {
      rulesContent += '## Commands\n\n';
      rulesContent += renderCommands(commands, 'markdown') + '\n\n';
    }

    // Agent listing in rules
    if (agents.length > 0) {
      rulesContent += '## Available Agents\n\n';
      for (const agent of agents) {
        const agentName = agent.meta.name || agent.fileName.replace('.md', '');
        const description = agent.meta.description || '';
        rulesContent += `- **${agentName}**: ${description} (see \`.cursor/agents/AGENT-${agentName}.md\`)\n`;
      }
      rulesContent += '\n';
    }

    // Skills summary
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    if (allSkills.length > 0) {
      rulesContent += '## Skills\n\n';
      for (const skill of allSkills) {
        const skillName = skill.meta.name || skill.fileName.replace('.md', '');
        rulesContent += `- **${skillName}**: ${skill.meta.description || ''}\n`;
      }
      rulesContent += '\n';
    }

    // Workflows summary
    if (workflows.length > 0) {
      rulesContent += '## Workflows\n\n';
      for (const workflow of workflows) {
        rulesContent += `- ${workflow.fileName}\n`;
      }
      rulesContent += '\n';
    }

    fs.writeFileSync(path.join(projectDir, '.cursorrules'), rulesContent, 'utf-8');

    // Generate individual agent files (full markdown)
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const agentName = agent.meta.name || agent.fileName.replace('.md', '');
      const agentContent = renderAgent(prepared, 'markdown');
      fs.writeFileSync(path.join(agentsDir, `AGENT-${agentName}.md`), agentContent, 'utf-8');
    }

    // Generate orchestrator file
    if (orchestrator) {
      const preparedOrch = prepareAgent(orchestrator, config);
      const orchContent = renderAgent(preparedOrch, 'markdown');
      fs.writeFileSync(path.join(agentsDir, 'ORCHESTRATOR.md'), orchContent, 'utf-8');
    }
  },

  /**
   * Validate generated files
   */
  validate(projectDir) {
    const errors = [];
    const rulesPath = path.join(projectDir, '.cursorrules');

    if (!fs.existsSync(rulesPath)) {
      errors.push(`Missing main rules file: ${rulesPath}`);
    }

    const agentsDir = path.join(projectDir, '.cursor', 'agents');
    if (fs.existsSync(agentsDir)) {
      const files = fs.readdirSync(agentsDir);
      for (const file of files) {
        const filePath = path.join(agentsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.trim().length === 0) {
          errors.push(`Empty agent file: ${filePath}`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
};
