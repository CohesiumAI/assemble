/**
 * Assemble — Pi Adapter
 * Generates AGENTS.md (project guidelines) + SYSTEM.md (system prompt override)
 * Pi reads AGENTS.md from project root and SYSTEM.md for persona
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAsRules, renderOrchestrator, agentId, marvelDisplayName, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions, renderCommandRegistry } = require('../../lib/template-engine');

module.exports = {
  name: 'pi',
  displayName: 'Pi',
  type: 'cli',

  getOutputPaths(projectDir) {
    return [
      path.join(projectDir, 'AGENTS.md'),
      path.join(projectDir, 'SYSTEM.md'),
    ];
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const agentLookup = buildAgentLookup(agents);

    // ── SYSTEM.md — orchestrator as system prompt ─────────────────────────
    let system = '# Assemble — System Prompt\n\n';
    system += 'You are an AI orchestrator coordinating a team of specialized agents.\n\n';
    if (orchestrator) {
      system += renderOrchestrator(orchestrator, config) + '\n\n';
    }
    system += '## Team\n\n';
    for (const agent of agents) {
      const display = marvelDisplayName(agent);
      const id = agentId(agent);
      const desc = (agent.meta.description || '').split('—')[0].trim();
      system += `- **${display}** (${id}) — ${desc}\n`;
    }
    fs.writeFileSync(path.join(projectDir, 'SYSTEM.md'), system, 'utf-8');

    // ── AGENTS.md — comprehensive project guidelines ──────────────────────
    let content = '# Assemble — Agents & Skills\n\n';

    content += '## Agents\n\n';
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      content += renderAsRules(prepared) + '\n';
    }

    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    if (allSkills.length > 0) {
      content += '## Skills\n\n';
      for (const skill of allSkills) {
        const prepared = prepareAgent(skill, config);
        content += renderAsRules(prepared);
      }
    }

    if (workflows.length > 0) {
      content += '## Workflows\n\n';
      for (const workflow of workflows) {
        const name = workflowField(workflow.raw, 'name') || workflowSlug(workflow);
        const desc = workflowField(workflow.raw, 'description');
        content += `### ${name}\n\n${desc}\n\n`;
        content += renderWorkflowInstructions(workflow, agentLookup, config);
      }
    }

    content += renderCommandRegistry(agents, skills, workflows, config.governance, config.yolo);

    fs.writeFileSync(path.join(projectDir, 'AGENTS.md'), content, 'utf-8');
  },

  validate(projectDir) {
    const errors = [];
    for (const file of ['AGENTS.md', 'SYSTEM.md']) {
      const p = path.join(projectDir, file);
      if (!fs.existsSync(p)) errors.push(`Missing ${file}`);
      else if (fs.readFileSync(p, 'utf-8').trim().length === 0) errors.push(`${file} is empty`);
    }
    return { valid: errors.length === 0, errors };
  }
};
