/**
 * Cohesium AI — Cline Adapter
 * Generates .clinerules and .cline/agents/ files
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderAsRules, renderCommands, renderOrchestrator } = require('../../lib/template-engine');

module.exports = {
  name: 'cline',
  displayName: 'Cline',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [] } = {}) {
    const paths = [path.join(projectDir, '.clinerules')];
    for (const agent of agents) {
      const agentName = agent.meta.name || agent.fileName.replace('.md', '');
      paths.push(path.join(projectDir, '.cline', 'agents', `AGENT-${agentName}.md`));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const agentsDir = path.join(projectDir, '.cline', 'agents');
    fs.mkdirSync(agentsDir, { recursive: true });

    // Build .clinerules main file
    let rulesContent = '# Cohesium AI — Cline Configuration\n\n';

    if (orchestrator) {
      rulesContent += '## Orchestrator\n\n';
      rulesContent += renderOrchestrator(orchestrator, config) + '\n\n';
    }

    if (commands) {
      rulesContent += renderCommands(commands, 'markdown') + '\n\n';
    }

    if (agents.length > 0) {
      rulesContent += '## Available Agents\n\n';
      for (const agent of agents) {
        const agentName = agent.meta.name || agent.fileName.replace('.md', '');
        rulesContent += `- **${agentName}**: ${agent.meta.description || ''} (see \`.cline/agents/AGENT-${agentName}.md\`)\n`;
      }
      rulesContent += '\n';
    }

    fs.writeFileSync(path.join(projectDir, '.clinerules'), rulesContent, 'utf-8');

    // Generate individual agent files (full markdown)
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const agentName = agent.meta.name || agent.fileName.replace('.md', '');
      const agentContent = renderAgent(prepared, 'markdown');
      fs.writeFileSync(path.join(agentsDir, `AGENT-${agentName}.md`), agentContent, 'utf-8');
    }
  },

  validate(projectDir) {
    const errors = [];
    const rulesPath = path.join(projectDir, '.clinerules');

    if (!fs.existsSync(rulesPath)) {
      errors.push(`Missing main rules file: ${rulesPath}`);
    }

    const agentsDir = path.join(projectDir, '.cline', 'agents');
    if (fs.existsSync(agentsDir)) {
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
