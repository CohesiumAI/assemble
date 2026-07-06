/**
 * Assemble — Generic adapter factory
 *
 * Several IDE targets share the exact same layout: a hidden project directory
 * with agents/, skills/ and a workflows/ subdir, plus commands.md and
 * orchestrator.md at its root. Instead of duplicating ~57 near-identical lines
 * per platform (a documented source of drift), those adapters are built from
 * this single factory. Any fix to the shared logic now lands in one place.
 *
 * @param {object} opts
 * @param {string} opts.name           adapter id (also the platform key)
 * @param {string} opts.displayName    human-readable name
 * @param {string} [opts.dir]          root directory (default: "." + name)
 * @param {string} [opts.workflowsSubdir] name of the workflows subdir (default: "workflows")
 */
const fs = require('fs');
const path = require('path');
const {
  prepareAgent, renderAgent, marvelSlug, skillSlug, workflowSlug, workflowField,
  buildAgentLookup, renderWorkflowInstructions, renderCommandRegistry, renderOrchestrator,
} = require('../lib/template-engine');

function makeGenericAdapter({ name, displayName, dir = `.${name}`, workflowsSubdir = 'workflows' }) {
  const allSkills = (skills) => [...(skills.shared || []), ...(skills.specific || [])];

  return {
    name,
    displayName,
    type: 'ide',

    getOutputPaths(projectDir, { agents = [], skills = {}, workflows = [] } = {}) {
      const paths = [];
      for (const a of agents) paths.push(path.join(projectDir, dir, 'agents', `${marvelSlug(a)}.md`));
      for (const s of allSkills(skills)) paths.push(path.join(projectDir, dir, 'skills', `${skillSlug(s)}.md`));
      for (const w of workflows) paths.push(path.join(projectDir, dir, workflowsSubdir, `${workflowSlug(w)}.md`));
      paths.push(path.join(projectDir, dir, 'commands.md'));
      paths.push(path.join(projectDir, dir, 'orchestrator.md'));
      return paths;
    },

    generate(projectDir, { agents = [], skills = {}, workflows = [], commands, orchestrator, config = {} }) {
      for (const d of ['agents', 'skills', workflowsSubdir]) fs.mkdirSync(path.join(projectDir, dir, d), { recursive: true });
      const agentLookup = buildAgentLookup(agents);

      for (const agent of agents) { const p = prepareAgent(agent, config); fs.writeFileSync(path.join(projectDir, dir, 'agents', `${marvelSlug(agent)}.md`), renderAgent(p, 'markdown'), 'utf-8'); }
      for (const skill of allSkills(skills)) { const p = prepareAgent(skill, config); fs.writeFileSync(path.join(projectDir, dir, 'skills', `${skillSlug(skill)}.md`), renderAgent(p, 'markdown'), 'utf-8'); }
      for (const workflow of workflows) {
        const slug = workflowSlug(workflow);
        let content = `# Workflow : ${workflowField(workflow.raw, 'name') || slug}\n\n${workflowField(workflow.raw, 'description')}\n\n`;
        content += renderWorkflowInstructions(workflow, agentLookup, config);
        fs.writeFileSync(path.join(projectDir, dir, workflowsSubdir, `${slug}.md`), content, 'utf-8');
      }

      fs.writeFileSync(path.join(projectDir, dir, 'commands.md'), renderCommandRegistry(agents, skills, workflows, config.governance, config.yolo), 'utf-8');
      if (orchestrator) {
        fs.writeFileSync(path.join(projectDir, dir, 'orchestrator.md'), renderOrchestrator(orchestrator, config), 'utf-8');
      }
    },

    validate(projectDir) {
      const errors = [];
      for (const subdir of ['agents', 'skills', workflowsSubdir]) {
        const d = path.join(projectDir, dir, subdir);
        if (fs.existsSync(d)) for (const file of fs.readdirSync(d)) { if (fs.readFileSync(path.join(d, file), 'utf-8').trim().length === 0) errors.push(`Empty: ${dir}/${subdir}/${file}`); }
      }
      for (const rootFile of ['commands.md', 'orchestrator.md']) {
        const p = path.join(projectDir, dir, rootFile);
        if (fs.existsSync(p) && fs.readFileSync(p, 'utf-8').trim().length === 0) errors.push(`Empty: ${dir}/${rootFile}`);
      }
      if (!fs.existsSync(path.join(projectDir, dir, 'agents'))) errors.push(`Missing ${dir}/agents/`);
      return { valid: errors.length === 0, errors };
    },
  };
}

module.exports = { makeGenericAdapter };
