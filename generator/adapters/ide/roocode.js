/**
 * Cohesium AI — Roo Code Adapter
 * Generates .roomodes (JSON custom modes) + .roo/rules-*.md
 * Includes agents as modes + skills and workflows in rules
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderOrchestrator, marvelSlug, marvelDisplayName, agentId, skillSlug, workflowSlug, workflowField, buildAgentLookup, renderWorkflowInstructions } = require('../../lib/template-engine');

module.exports = {
  name: 'roocode',
  displayName: 'Roo Code',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
    const paths = [path.join(projectDir, '.roomodes')];
    for (const agent of agents) {
      paths.push(path.join(projectDir, '.roo', `rules-${marvelSlug(agent)}.md`));
    }
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      paths.push(path.join(projectDir, '.roo', `rules-skill-${skillSlug(skill)}.md`));
    }
    for (const workflow of workflows) {
      paths.push(path.join(projectDir, '.roo', `rules-workflow-${workflowSlug(workflow)}.md`));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const rooDir = path.join(projectDir, '.roo');
    fs.mkdirSync(rooDir, { recursive: true });

    const agentLookup = buildAgentLookup(agents);
    const customModes = [];

    // ── Agent modes ───────────────────────────────────────────────────────
    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const slug = marvelSlug(agent);
      const display = marvelDisplayName(agent);
      const id = agentId(agent);
      const description = agent.meta.description || '';

      const roleDefinition = (agent.sections || {})['Identité']
        || (agent.sections || {})['Identity']
        || description;

      const customInstructions = (agent.sections || {})['Posture']
        || (agent.sections || {})['Approach']
        || '';

      customModes.push({
        slug,
        name: `${display} (${id})`,
        roleDefinition: typeof roleDefinition === 'string' ? roleDefinition.trim() : description,
        customInstructions: typeof customInstructions === 'string' ? customInstructions.trim() : '',
        groups: ['read', 'edit', 'browser', 'command', 'mcp'],
        source: 'project'
      });

      fs.writeFileSync(path.join(rooDir, `rules-${slug}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    // ── Orchestrator mode ─────────────────────────────────────────────────
    if (orchestrator) {
      const orchRole = (orchestrator.sections || {})['Identité']
        || (orchestrator.sections || {})['Identity']
        || (orchestrator.meta || {}).description || 'Orchestrateur de projet';

      customModes.push({
        slug: 'orchestrator',
        name: 'Jarvis (Orchestrator)',
        roleDefinition: typeof orchRole === 'string' ? orchRole.trim() : 'Orchestrateur de projet',
        customInstructions: renderOrchestrator(orchestrator, config),
        groups: ['read', 'edit', 'browser', 'command', 'mcp'],
        source: 'project'
      });

      const preparedOrch = prepareAgent(orchestrator, config);
      fs.writeFileSync(path.join(rooDir, 'rules-orchestrator.md'), renderAgent(preparedOrch, 'markdown'), 'utf-8');
    }

    // ── Skill rules ───────────────────────────────────────────────────────
    const allSkills = [...(skills.shared || []), ...(skills.specific || [])];
    for (const skill of allSkills) {
      const prepared = prepareAgent(skill, config);
      const slug = skillSlug(skill);
      fs.writeFileSync(path.join(rooDir, `rules-skill-${slug}.md`), renderAgent(prepared, 'markdown'), 'utf-8');
    }

    // ── Workflow rules ────────────────────────────────────────────────────
    for (const workflow of workflows) {
      const slug = workflowSlug(workflow);
      const name = workflowField(workflow.raw, 'name') || slug;
      const desc = workflowField(workflow.raw, 'description');
      let content = `# Workflow : ${name}\n\n${desc}\n\n`;
      content += renderWorkflowInstructions(workflow, agentLookup, config);
      fs.writeFileSync(path.join(rooDir, `rules-workflow-${slug}.md`), content, 'utf-8');
    }

    // ── .roomodes JSON ────────────────────────────────────────────────────
    fs.writeFileSync(
      path.join(projectDir, '.roomodes'),
      JSON.stringify({ customModes }, null, 2),
      'utf-8'
    );
  },

  validate(projectDir) {
    const errors = [];
    const roomodesPath = path.join(projectDir, '.roomodes');
    if (!fs.existsSync(roomodesPath)) {
      errors.push('Missing .roomodes');
    } else {
      try {
        const parsed = JSON.parse(fs.readFileSync(roomodesPath, 'utf-8'));
        if (!parsed.customModes || !Array.isArray(parsed.customModes)) errors.push('.roomodes missing customModes array');
      } catch (e) {
        errors.push(`Invalid JSON in .roomodes: ${e.message}`);
      }
    }
    const rooDir = path.join(projectDir, '.roo');
    if (fs.existsSync(rooDir)) {
      for (const file of fs.readdirSync(rooDir).filter(f => f.startsWith('rules-'))) {
        const content = fs.readFileSync(path.join(rooDir, file), 'utf-8');
        if (content.trim().length === 0) errors.push(`Empty: .roo/${file}`);
      }
    }
    return { valid: errors.length === 0, errors };
  }
};
