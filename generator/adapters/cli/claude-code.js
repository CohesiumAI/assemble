/**
 * Cohesium AI — Claude Code Adapter
 * Generates CLAUDE.md, .claude/commands/, and .claude/agents/ files
 * This is the most feature-rich adapter — includes all skills, workflows, and orchestrator
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderAsRules, renderCommands, renderOrchestrator, renderWorkflow } = require('../../lib/template-engine');
const { translateSectionLabel } = require('../../lib/i18n');

module.exports = {
  name: 'claude-code',
  displayName: 'Claude Code',
  type: 'cli',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [], commands } = {}) {
    const paths = [path.join(projectDir, 'CLAUDE.md')];

    for (const agent of agents) {
      const slug = (agent.meta.name || agent.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      paths.push(path.join(projectDir, '.claude', 'agents', `${slug}.md`));
      // Each agent also gets a command file
      paths.push(path.join(projectDir, '.claude', 'commands', `${slug}.md`));
    }

    // Skills as commands
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      const slug = (skill.meta.name || skill.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      paths.push(path.join(projectDir, '.claude', 'commands', `skill-${slug}.md`));
    }

    // Workflows as commands
    for (const workflow of workflows) {
      const slug = workflow.fileName.replace(/\.(yaml|yml)$/, '');
      paths.push(path.join(projectDir, '.claude', 'commands', `workflow-${slug}.md`));
    }

    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const claudeAgentsDir = path.join(projectDir, '.claude', 'agents');
    const claudeCommandsDir = path.join(projectDir, '.claude', 'commands');
    fs.mkdirSync(claudeAgentsDir, { recursive: true });
    fs.mkdirSync(claudeCommandsDir, { recursive: true });

    // Build the main CLAUDE.md file — comprehensive instructions
    let claudeContent = '# Cohesium AI — Claude Code Configuration\n\n';

    // Orchestrator section (full content)
    if (orchestrator) {
      claudeContent += '## Orchestrator\n\n';
      claudeContent += renderOrchestrator(orchestrator, config) + '\n\n';
    }

    // Commands section
    if (commands) {
      claudeContent += renderCommands(commands, 'markdown') + '\n\n';
    }

    // Agent directory with descriptions and references
    if (agents.length > 0) {
      claudeContent += '## Available Agents\n\n';
      claudeContent += 'The following specialized agents are available. Use the corresponding slash command or reference the agent file directly.\n\n';
      for (const agent of agents) {
        const agentName = agent.meta.name || agent.fileName.replace('.md', '');
        const slug = agentName.toLowerCase().replace(/\s+/g, '-');
        const description = agent.meta.description || '';
        claudeContent += `- **${agentName}** — ${description}\n`;
        claudeContent += `  - Agent file: \`.claude/agents/${slug}.md\`\n`;
        claudeContent += `  - Command: \`.claude/commands/${slug}.md\`\n`;
      }
      claudeContent += '\n';
    }

    // Skills section — full inline content for Claude Code
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    if (allSkills.length > 0) {
      claudeContent += '## Skills\n\n';
      for (const skill of allSkills) {
        const skillName = skill.meta.name || skill.fileName.replace('.md', '');
        const description = skill.meta.description || '';
        claudeContent += `### ${skillName}\n\n`;
        claudeContent += `${description}\n\n`;
        if (skill.content) {
          claudeContent += skill.content + '\n\n';
        }
      }
    }

    // Workflows section — full inline content for Claude Code
    if (workflows.length > 0) {
      claudeContent += '## Workflows\n\n';
      for (const workflow of workflows) {
        claudeContent += `### ${workflow.fileName}\n\n`;
        claudeContent += renderWorkflow(workflow, 'markdown') + '\n\n';
      }
    }

    fs.writeFileSync(path.join(projectDir, 'CLAUDE.md'), claudeContent, 'utf-8');

    // Generate individual agent files (full markdown)
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const agentName = agent.meta.name || agent.fileName.replace('.md', '');
      const slug = agentName.toLowerCase().replace(/\s+/g, '-');
      const agentContent = renderAgent(prepared, 'markdown');

      // Agent file in .claude/agents/
      fs.writeFileSync(path.join(claudeAgentsDir, `${slug}.md`), agentContent, 'utf-8');

      // Command file in .claude/commands/ (triggers the agent)
      let commandContent = `# ${agentName}\n\n`;
      commandContent += `Load and apply the agent definition from \`.claude/agents/${slug}.md\`.\n\n`;
      commandContent += `${agent.meta.description || ''}\n\n`;
      commandContent += `## Instructions\n\n`;
      commandContent += `Read the agent file at \`.claude/agents/${slug}.md\` and follow all instructions defined there.\n`;
      commandContent += `Apply the agent's role, posture, and rules for the current task.\n`;
      fs.writeFileSync(path.join(claudeCommandsDir, `${slug}.md`), commandContent, 'utf-8');
    }

    // Generate skill command files
    for (const skill of allSkills) {
      const skillName = skill.meta.name || skill.fileName.replace('.md', '');
      const slug = skillName.toLowerCase().replace(/\s+/g, '-');
      const prepared = prepareAgent(skill, config);
      const skillContent = renderAgent(prepared, 'markdown');
      fs.writeFileSync(path.join(claudeCommandsDir, `skill-${slug}.md`), skillContent, 'utf-8');
    }

    // Generate workflow command files
    for (const workflow of workflows) {
      const slug = workflow.fileName.replace(/\.(yaml|yml)$/, '');
      const workflowContent = renderWorkflow(workflow, 'markdown');
      fs.writeFileSync(path.join(claudeCommandsDir, `workflow-${slug}.md`), workflowContent, 'utf-8');
    }
  },

  validate(projectDir) {
    const errors = [];
    const claudeMdPath = path.join(projectDir, 'CLAUDE.md');

    if (!fs.existsSync(claudeMdPath)) {
      errors.push(`Missing main instructions file: ${claudeMdPath}`);
    } else {
      const content = fs.readFileSync(claudeMdPath, 'utf-8');
      if (content.trim().length === 0) {
        errors.push('CLAUDE.md is empty');
      }
    }

    // Validate agent files
    const agentsDir = path.join(projectDir, '.claude', 'agents');
    if (fs.existsSync(agentsDir)) {
      const files = fs.readdirSync(agentsDir);
      for (const file of files) {
        const content = fs.readFileSync(path.join(agentsDir, file), 'utf-8');
        if (content.trim().length === 0) {
          errors.push(`Empty agent file: ${file}`);
        }
      }
    }

    // Validate command files
    const commandsDir = path.join(projectDir, '.claude', 'commands');
    if (fs.existsSync(commandsDir)) {
      const files = fs.readdirSync(commandsDir);
      for (const file of files) {
        const content = fs.readFileSync(path.join(commandsDir, file), 'utf-8');
        if (content.trim().length === 0) {
          errors.push(`Empty command file: ${file}`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
};
