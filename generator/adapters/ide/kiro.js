/**
 * Assemble — Kiro Adapter
 * Generates .kiro/agents/*.json (JSON format required by Kiro)
 * and .kiro/steering/*.md for rules/skills/workflows
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, agentId, marvelSlug, marvelDisplayName, skillSlug, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions, renderOrchestrator, renderCommandRegistry } = require('../../lib/template-engine');

module.exports = {
  name: 'kiro',
  displayName: 'Kiro',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
    const paths = [];
    for (const agent of agents) {
      paths.push(path.join(projectDir, '.kiro', 'agents', `${marvelSlug(agent)}.json`));
    }
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      paths.push(path.join(projectDir, '.kiro', 'steering', `skill-${skillSlug(skill)}.md`));
    }
    for (const workflow of workflows) {
      paths.push(path.join(projectDir, '.kiro', 'steering', `workflow-${workflowSlug(workflow)}.md`));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const kiroAgentsDir = path.join(projectDir, '.kiro', 'agents');
    const kiroSteeringDir = path.join(projectDir, '.kiro', 'steering');
    fs.mkdirSync(kiroAgentsDir, { recursive: true });
    fs.mkdirSync(kiroSteeringDir, { recursive: true });

    const agentLookup = buildAgentLookup(agents);

    // ── Agents as JSON (Kiro native format) ───────────────────────────────
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = marvelSlug(agent);
      const display = marvelDisplayName(agent);
      const id = agentId(agent);

      const kiroAgent = {
        name: slug,
        description: `${display} — ${id}. ${agent.meta.description || ''}`,
        prompt: prepared.content,
        tools: ['*'],
      };

      fs.writeFileSync(
        path.join(kiroAgentsDir, `${slug}.json`),
        JSON.stringify(kiroAgent, null, 2),
        'utf-8'
      );
    }

    // ── Skills as steering files ──────────────────────────────────────────
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      const prepared = prepareAgent(skill, config);
      const slug = skillSlug(skill);
      fs.writeFileSync(path.join(kiroSteeringDir, `skill-${slug}.md`), prepared.content, 'utf-8');
    }

    // ── Workflows as steering files ───────────────────────────────────────
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const name = workflowField(workflow.raw, 'name') || slug;
      const desc = workflowField(workflow.raw, 'description');
      let content = `# Workflow : ${name}\n\n${desc}\n\n`;
      content += renderWorkflowInstructions(workflow, agentLookup, config);
      fs.writeFileSync(path.join(kiroSteeringDir, `workflow-${slug}.md`), content, 'utf-8');
    }

    // ── Orchestrator + Teams steering ─────────────────────────────────────
    if (orchestrator) {
      fs.writeFileSync(path.join(kiroSteeringDir, 'orchestrator.md'), renderOrchestrator(orchestrator, config), 'utf-8');
    }

    let teams = '# Assemble Teams\n\n';
    for (const agent of agents) {
      const display = marvelDisplayName(agent);
      const id = agentId(agent);
      const desc = (agent.meta.description || '').split('—')[0].trim();
      teams += `- **${display}** (${marvelSlug(agent)}) — ${id} — ${desc}\n`;
    }
    fs.writeFileSync(path.join(kiroSteeringDir, 'teams.md'), teams, 'utf-8');

    // ── Command registry ───────────────────────────────────────────────
    fs.writeFileSync(path.join(kiroSteeringDir, 'commands.md'), renderCommandRegistry(agents, skills, workflows, config.governance), 'utf-8');
  },

  validate(projectDir) {
    const errors = [];
    const agentsDir = path.join(projectDir, '.kiro', 'agents');
    if (fs.existsSync(agentsDir)) {
      for (const file of fs.readdirSync(agentsDir).filter(f => f.endsWith('.json'))) {
        try {
          const parsed = JSON.parse(fs.readFileSync(path.join(agentsDir, file), 'utf-8'));
          if (!parsed.name) errors.push(`Missing 'name' in ${file}`);
          if (!parsed.prompt) errors.push(`Missing 'prompt' in ${file}`);
        } catch (e) {
          errors.push(`Invalid JSON: ${file} — ${e.message}`);
        }
      }
    } else {
      errors.push('Missing .kiro/agents/ directory');
    }
    const steeringDir = path.join(projectDir, '.kiro', 'steering');
    if (fs.existsSync(steeringDir)) {
      for (const file of fs.readdirSync(steeringDir)) {
        const content = fs.readFileSync(path.join(steeringDir, file), 'utf-8');
        if (content.trim().length === 0) errors.push(`Empty: ${file}`);
      }
    }
    return { valid: errors.length === 0, errors };
  }
};
