/**
 * Cohesium AI — GitHub Copilot Adapter
 * Generates .github/copilot-instructions.md and .github/copilot/agents/ files
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderAsRules, renderCommands, renderOrchestrator, renderWorkflow } = require('../../lib/template-engine');

module.exports = {
  name: 'copilot',
  displayName: 'GitHub Copilot',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [] } = {}) {
    const paths = [path.join(projectDir, '.github', 'copilot-instructions.md')];
    for (const agent of agents) {
      const agentName = (agent.meta.name || agent.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      paths.push(path.join(projectDir, '.github', 'copilot', 'agents', `${agentName}.md`));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const githubDir = path.join(projectDir, '.github');
    const copilotAgentsDir = path.join(githubDir, 'copilot', 'agents');
    fs.mkdirSync(copilotAgentsDir, { recursive: true });

    // Build main copilot-instructions.md
    let instructions = '# Copilot Instructions — Cohesium AI\n\n';

    if (orchestrator) {
      instructions += '## Orchestrator\n\n';
      instructions += renderOrchestrator(orchestrator, config) + '\n\n';
    }

    if (commands) {
      instructions += renderCommands(commands, 'markdown') + '\n\n';
    }

    // Agent directory
    if (agents.length > 0) {
      instructions += '## Available Agents\n\n';
      instructions += 'The following specialized agents are available in `.github/copilot/agents/`:\n\n';
      for (const agent of agents) {
        const agentName = agent.meta.name || agent.fileName.replace('.md', '');
        const slug = agentName.toLowerCase().replace(/\s+/g, '-');
        const description = agent.meta.description || '';
        instructions += `- **${agentName}** (\`${slug}.md\`): ${description}\n`;
      }
      instructions += '\n';
    }

    // Skills summary
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    if (allSkills.length > 0) {
      instructions += '## Skills\n\n';
      for (const skill of allSkills) {
        const skillName = skill.meta.name || skill.fileName.replace('.md', '');
        instructions += `### ${skillName}\n\n`;
        instructions += `${skill.meta.description || ''}\n\n`;
        if (skill.content) {
          instructions += skill.content + '\n\n';
        }
      }
    }

    // Workflows summary
    if (workflows.length > 0) {
      instructions += '## Workflows\n\n';
      for (const workflow of workflows) {
        instructions += `### ${workflow.fileName}\n\n`;
        instructions += renderWorkflow(workflow, 'markdown') + '\n\n';
      }
    }

    fs.writeFileSync(path.join(githubDir, 'copilot-instructions.md'), instructions, 'utf-8');

    // Generate individual agent files
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const agentName = agent.meta.name || agent.fileName.replace('.md', '');
      const slug = agentName.toLowerCase().replace(/\s+/g, '-');
      const agentContent = renderAgent(prepared, 'markdown');
      fs.writeFileSync(path.join(copilotAgentsDir, `${slug}.md`), agentContent, 'utf-8');
    }
  },

  validate(projectDir) {
    const errors = [];
    const instructionsPath = path.join(projectDir, '.github', 'copilot-instructions.md');

    if (!fs.existsSync(instructionsPath)) {
      errors.push(`Missing instructions file: ${instructionsPath}`);
    } else {
      const content = fs.readFileSync(instructionsPath, 'utf-8');
      if (content.trim().length === 0) {
        errors.push('Instructions file is empty');
      }
    }

    const agentsDir = path.join(projectDir, '.github', 'copilot', 'agents');
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
