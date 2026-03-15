/**
 * Cohesium AI — Codex (OpenAI) Adapter
 * Generates codex.md or AGENTS.md with compact markdown format
 * All agents, skills, and commands are inlined in a single file
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAsRules, renderCommands, renderOrchestrator, renderWorkflow } = require('../../lib/template-engine');

module.exports = {
  name: 'codex',
  displayName: 'Codex (OpenAI)',
  type: 'cli',

  getOutputPaths(projectDir) {
    return [
      path.join(projectDir, 'AGENTS.md'),
      path.join(projectDir, 'codex.md')
    ];
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    // Build a single comprehensive file with all definitions
    let content = '# Cohesium AI — Codex Configuration\n\n';

    // Orchestrator
    if (orchestrator) {
      content += '## Orchestrator\n\n';
      content += renderOrchestrator(orchestrator, config) + '\n\n';
    }

    // Commands
    if (commands) {
      content += renderCommands(commands, 'markdown') + '\n\n';
    }

    // Agents — compact rules format, all inlined
    if (agents.length > 0) {
      content += '## Agents\n\n';
      for (const agent of agents) {
        const prepared = prepareAgent(agent, config);
        content += renderAsRules(prepared) + '\n';
      }
    }

    // Skills — all inlined
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    if (allSkills.length > 0) {
      content += '## Skills\n\n';
      for (const skill of allSkills) {
        const prepared = prepareAgent(skill, config);
        content += renderAsRules(prepared);
      }
    }

    // Workflows
    if (workflows.length > 0) {
      content += '## Workflows\n\n';
      for (const workflow of workflows) {
        content += renderWorkflow(workflow, 'markdown') + '\n\n';
      }
    }

    // Write both codex.md and AGENTS.md (same content, two conventions)
    fs.writeFileSync(path.join(projectDir, 'AGENTS.md'), content, 'utf-8');
    fs.writeFileSync(path.join(projectDir, 'codex.md'), content, 'utf-8');
  },

  validate(projectDir) {
    const errors = [];
    const agentsMdPath = path.join(projectDir, 'AGENTS.md');
    const codexMdPath = path.join(projectDir, 'codex.md');

    const hasAgentsMd = fs.existsSync(agentsMdPath);
    const hasCodexMd = fs.existsSync(codexMdPath);

    if (!hasAgentsMd && !hasCodexMd) {
      errors.push('Missing main instructions file: expected AGENTS.md or codex.md');
    }

    for (const filePath of [agentsMdPath, codexMdPath]) {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (content.trim().length === 0) {
          errors.push(`Empty file: ${path.basename(filePath)}`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
};
