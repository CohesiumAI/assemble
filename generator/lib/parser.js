/**
 * Assemble — Agent/skill/workflow file parser
 * Parses .md files (YAML frontmatter + content) and .yaml files
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse a Markdown file with YAML frontmatter
 * @param {string} filePath - Path to the .md file
 * @returns {{ meta: object, content: string, sections: object }}
 */
function parseMarkdown(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return { meta: {}, content: raw, sections: parseSections(raw) };
  }

  const meta = parseYamlSimple(frontmatterMatch[1]);
  const content = frontmatterMatch[2].trim();
  const sections = parseSections(content);

  return { meta, content, sections };
}

/**
 * Simple YAML parser (no external dependency)
 * Handles: simple keys, inline lists [a, b], multiline strings
 */
function parseYamlSimple(yamlStr) {
  const result = {};
  const lines = yamlStr.split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    let value = rawValue.trim();

    // Liste inline [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    }
    // Boolean
    else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    // Nombre
    else if (/^\d+$/.test(value)) value = parseInt(value, 10);
    // String (enlever les quotes)
    else value = value.replace(/^["']|["']$/g, '');

    result[key] = value;
  }

  return result;
}

/**
 * Parse les sections ## d'un fichier Markdown
 * @param {string} content - Contenu markdown
 * @returns {object} - { "Section Name": "content..." }
 */
function parseSections(content) {
  const sections = {};
  const parts = content.split(/^## /m);

  for (const part of parts.slice(1)) {
    const newlineIndex = part.indexOf('\n');
    if (newlineIndex === -1) continue;
    const title = part.substring(0, newlineIndex).trim();
    const body = part.substring(newlineIndex + 1).trim();
    sections[title] = body;
  }

  return sections;
}

/**
 * Parse un fichier YAML de workflow
 * @param {string} filePath - Chemin du fichier .yaml
 * @returns {object}
 */
function parseYamlFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
  // For complex YAML files, use simplified parsing
  // In production, use js-yaml
  try {
    // Attempt JSON parsing if it's JSON
    return JSON.parse(raw);
  } catch {
    // Otherwise, return raw content for adapter processing
    return { raw, filePath };
  }
}

/**
 * Loads all agents from a directory
 * @param {string} agentsDir - Path to src/agents/
 * @returns {Array<{ meta, content, sections, fileName }>}
 */
function loadAgents(agentsDir) {
  const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
  return files.map(fileName => ({
    ...parseMarkdown(path.join(agentsDir, fileName)),
    fileName
  }));
}

/**
 * Loads all skills from a directory (shared + specific)
 * @param {string} skillsDir - Path to src/skills/
 * @returns {{ shared: Array, specific: Array }}
 */
function loadSkills(skillsDir) {
  const loadDir = (dir) => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(fileName => ({
        ...parseMarkdown(path.join(dir, fileName)),
        fileName
      }));
  };

  return {
    shared: loadDir(path.join(skillsDir, 'shared')),
    specific: loadDir(path.join(skillsDir, 'specific'))
  };
}

/**
 * Loads all workflows from a directory
 * @param {string} workflowsDir - Path to src/workflows/
 * @returns {Array}
 */
function loadWorkflows(workflowsDir) {
  if (!fs.existsSync(workflowsDir)) return [];
  return fs.readdirSync(workflowsDir)
    .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
    .map(fileName => {
      const raw = fs.readFileSync(path.join(workflowsDir, fileName), 'utf-8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      return { raw, fileName };
    });
}

/**
 * Loads the command registry
 * @param {string} commandsFile - Path to commands.yaml
 * @returns {string} - Raw YAML content
 */
function loadCommands(commandsFile) {
  if (!fs.existsSync(commandsFile)) return '';
  return fs.readFileSync(commandsFile, 'utf-8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Loads the orchestrator
 * @param {string} orchestratorDir - Path to src/orchestrator/
 * @returns {object|null}
 */
function loadOrchestrator(orchestratorDir) {
  const filePath = path.join(orchestratorDir, 'ORCHESTRATOR.md');
  if (!fs.existsSync(filePath)) return null;
  return parseMarkdown(filePath);
}

module.exports = {
  parseMarkdown,
  parseYamlSimple,
  parseSections,
  parseYamlFile,
  loadAgents,
  loadSkills,
  loadWorkflows,
  loadCommands,
  loadOrchestrator
};
