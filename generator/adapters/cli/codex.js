/**
 * Cohesium AI — Codex (OpenAI) Adapter
 * Generates AGENTS.md — the standard format for OpenAI Codex CLI
 * All agents, skills, workflows inlined in a single markdown file
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAsRules, renderOrchestrator, agentId, marvelDisplayName, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions, renderCommandRegistry } = require('../../lib/template-engine');

module.exports = {
  name: 'codex',
  displayName: 'Codex (OpenAI)',
  type: 'cli',

  getOutputPaths(projectDir) {
    return [path.join(projectDir, 'AGENTS.md')];
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const agentLookup = buildAgentLookup(agents);

    let content = '# Cohesium AI — Codex Configuration\n\n';

    // Orchestrator
    if (orchestrator) {
      content += '## Orchestrator\n\n';
      content += renderOrchestrator(orchestrator, config) + '\n\n';
    }

    // Team overview
    if (agents.length > 0) {
      content += '## Team\n\n';
      for (const agent of agents) {
        const display = marvelDisplayName(agent);
        const id = agentId(agent);
        const desc = (agent.meta.description || '').split('—')[0].trim();
        content += `- **${display}** (${id}) — ${desc}\n`;
      }
      content += '\n';
    }

    // Agents (compact rules format)
    if (agents.length > 0) {
      content += '## Agents\n\n';
      for (const agent of agents) {
        const prepared = prepareAgent(agent, config);
        content += renderAsRules(prepared) + '\n';
      }
    }

    // Skills
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
        const name = workflowField(workflow.raw, 'name') || workflowSlug(workflow);
        const desc = workflowField(workflow.raw, 'description');
        content += `### ${name}\n\n${desc}\n\n`;
        content += renderWorkflowInstructions(workflow, agentLookup, config);
      }
    }

    content += renderCommandRegistry(agents, skills, workflows);

    fs.writeFileSync(path.join(projectDir, 'AGENTS.md'), content, 'utf-8');
  },

  validate(projectDir) {
    const errors = [];
    const p = path.join(projectDir, 'AGENTS.md');
    if (!fs.existsSync(p)) errors.push('Missing AGENTS.md');
    else if (fs.readFileSync(p, 'utf-8').trim().length === 0) errors.push('AGENTS.md is empty');
    return { valid: errors.length === 0, errors };
  }
};
