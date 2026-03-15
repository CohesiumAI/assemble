/**
 * Cohesium AI — Roo Code Adapter
 * Generates .roomodes (JSON) and .roo/rules-{agent-name}.md files
 */

const fs = require('fs');
const path = require('path');
const { prepareAgent, renderAgent, renderOrchestrator } = require('../../lib/template-engine');

module.exports = {
  name: 'roocode',
  displayName: 'Roo Code',
  type: 'ide',

  getOutputPaths(projectDir, { agents = [] } = {}) {
    const paths = [path.join(projectDir, '.roomodes')];
    for (const agent of agents) {
      const agentName = (agent.meta.name || agent.fileName.replace('.md', '')).toLowerCase().replace(/\s+/g, '-');
      paths.push(path.join(projectDir, '.roo', `rules-${agentName}.md`));
    }
    return paths;
  },

  generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
    const rooDir = path.join(projectDir, '.roo');
    fs.mkdirSync(rooDir, { recursive: true });

    // Build .roomodes JSON file defining custom modes
    const customModes = [];

    for (const agent of agents) {
      const prepared = prepareAgent(agent, config);
      const agentName = agent.meta.name || agent.fileName.replace('.md', '');
      const slug = agentName.toLowerCase().replace(/\s+/g, '-');
      const description = agent.meta.description || '';

      // Extract role definition from the identity section if present
      const roleDefinition = agent.sections['Identité'] ||
        agent.sections['Identity'] ||
        description;

      // Extract custom instructions from the posture section
      const customInstructions = agent.sections['Posture'] ||
        agent.sections['Approach'] ||
        '';

      // Determine file patterns for this agent based on meta
      const groups = agent.meta.groups || [];
      const fileRegex = Array.isArray(groups) ? groups : [];

      customModes.push({
        slug,
        name: agentName,
        roleDefinition: typeof roleDefinition === 'string' ? roleDefinition.trim() : description,
        customInstructions: typeof customInstructions === 'string' ? customInstructions.trim() : '',
        groups: ['read', 'edit', 'browser', 'command', 'mcp'],
        source: 'project'
      });

      // Generate rules file for each agent
      const agentContent = renderAgent(prepared, 'markdown');
      fs.writeFileSync(path.join(rooDir, `rules-${slug}.md`), agentContent, 'utf-8');
    }

    // Add orchestrator as a mode if present
    if (orchestrator) {
      const preparedOrch = prepareAgent(orchestrator, config);
      const orchRole = orchestrator.sections['Identité'] ||
        orchestrator.sections['Identity'] ||
        orchestrator.meta.description || 'Project orchestrator';

      customModes.push({
        slug: 'orchestrator',
        name: 'Orchestrator',
        roleDefinition: typeof orchRole === 'string' ? orchRole.trim() : 'Project orchestrator',
        customInstructions: renderOrchestrator(orchestrator, config),
        groups: ['read', 'edit', 'browser', 'command', 'mcp'],
        source: 'project'
      });

      const orchContent = renderAgent(preparedOrch, 'markdown');
      fs.writeFileSync(path.join(rooDir, 'rules-orchestrator.md'), orchContent, 'utf-8');
    }

    // Write .roomodes JSON
    const roomodes = { customModes };
    fs.writeFileSync(
      path.join(projectDir, '.roomodes'),
      JSON.stringify(roomodes, null, 2),
      'utf-8'
    );
  },

  validate(projectDir) {
    const errors = [];
    const roomodesPath = path.join(projectDir, '.roomodes');

    if (!fs.existsSync(roomodesPath)) {
      errors.push(`Missing .roomodes file: ${roomodesPath}`);
    } else {
      try {
        const content = fs.readFileSync(roomodesPath, 'utf-8');
        const parsed = JSON.parse(content);
        if (!parsed.customModes || !Array.isArray(parsed.customModes)) {
          errors.push('.roomodes must contain a customModes array');
        }
      } catch (e) {
        errors.push(`Invalid JSON in .roomodes: ${e.message}`);
      }
    }

    const rooDir = path.join(projectDir, '.roo');
    if (fs.existsSync(rooDir)) {
      const files = fs.readdirSync(rooDir).filter(f => f.startsWith('rules-'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(rooDir, file), 'utf-8');
        if (content.trim().length === 0) {
          errors.push(`Empty rules file: ${file}`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }
};
