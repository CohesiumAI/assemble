/**
 * Assemble — Agent/skill/workflow file parser
 * Parses .md files (YAML frontmatter + content) and .yaml files
 * Zero external dependencies — uses built-in line-based YAML parser.
 */

const fs = require('fs');
const path = require('path');

/**
 * Normalize line endings to \n (handles Windows \r\n and old Mac \r)
 * @param {string} str
 * @returns {string}
 */
function normalizeLineEndings(str) {
  return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Parse flat YAML content (no nesting beyond sequences).
 * Handles: key: value, key: "quoted: value", booleans, numbers,
 * inline arrays [a, b], YAML sequences (- item), and comments.
 * @param {string} yamlStr - Raw YAML content (must have \n line endings)
 * @returns {object}
 */
function parseFlatYaml(yamlStr) {
  const result = {};
  const lines = yamlStr.split('\n');
  let currentKey = null;
  let currentList = null;

  for (const line of lines) {
    // Skip comments and empty lines
    if (/^\s*#/.test(line) || line.trim() === '') {
      // If we were collecting a list and hit a blank/comment, keep going
      continue;
    }

    // YAML sequence item: "  - value"
    if (/^\s+-\s+/.test(line) && currentKey && currentList) {
      const item = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
      currentList.push(item);
      continue;
    }

    // If we were collecting a list, flush it
    if (currentKey && currentList) {
      result[currentKey] = currentList;
      currentKey = null;
      currentList = null;
    }

    // Key: value line — match first colon only, key must start at column 0
    const idx = line.indexOf(':');
    if (idx < 1) continue;
    const key = line.substring(0, idx).trim();
    if (!/^[\w][\w_-]*$/.test(key)) continue;

    let value = line.substring(idx + 1).trim();

    // Empty value — might be start of a YAML sequence
    if (value === '') {
      currentKey = key;
      currentList = [];
      continue;
    }

    // Inline list [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      result[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    }
    // 'all' keyword (special value for agents/workflows)
    else if (value === 'all') {
      result[key] = 'all';
    }
    // Boolean
    else if (value === 'true') result[key] = true;
    else if (value === 'false') result[key] = false;
    // Number
    else if (/^\d+$/.test(value)) result[key] = parseInt(value, 10);
    // String (strip surrounding quotes)
    else result[key] = value.replace(/^["']|["']$/g, '');
  }

  // Flush last list if still open
  if (currentKey && currentList) {
    result[currentKey] = currentList;
  }

  return result;
}

/**
 * Parse a Markdown file with YAML frontmatter
 * @param {string} filePath - Path to the .md file
 * @returns {{ meta: object, content: string, sections: object }}
 */
function parseMarkdown(filePath) {
  const raw = normalizeLineEndings(
    fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '')
  );
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!frontmatterMatch) {
    return { meta: {}, content: raw, sections: parseSections(raw) };
  }

  const meta = parseFlatYaml(frontmatterMatch[1]);
  const content = frontmatterMatch[2].trim();
  const sections = parseSections(content);

  return { meta, content, sections };
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
  const raw = normalizeLineEndings(
    fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '')
  );
  try {
    return JSON.parse(raw);
  } catch {
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
      const raw = normalizeLineEndings(
        fs.readFileSync(path.join(workflowsDir, fileName), 'utf-8').replace(/^\uFEFF/, '')
      );
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
  return normalizeLineEndings(
    fs.readFileSync(commandsFile, 'utf-8').replace(/^\uFEFF/, '')
  );
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
  parseFlatYaml,
  normalizeLineEndings,
  parseSections,
  parseYamlFile,
  loadAgents,
  loadSkills,
  loadWorkflows,
  loadCommands,
  loadOrchestrator
};
