/**
 * Cohesium AI — Parser de fichiers agents/skills/workflows
 * Parse les fichiers .md (frontmatter YAML + contenu) et .yaml
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse un fichier Markdown avec frontmatter YAML
 * @param {string} filePath - Chemin du fichier .md
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
 * Parse simple du YAML (sans dépendance externe)
 * Gère : clés simples, listes inline [a, b], strings multilignes
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
    // Booléen
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
  // Pour les fichiers YAML complexes, on utilise un parsing simplifié
  // En production, utiliser js-yaml
  try {
    // Tente un parsing JSON si c'est du JSON
    return JSON.parse(raw);
  } catch {
    // Sinon, retourne le contenu brut pour traitement par l'adaptateur
    return { raw, filePath };
  }
}

/**
 * Charge tous les agents depuis un répertoire
 * @param {string} agentsDir - Chemin vers src/agents/
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
 * Charge toutes les skills depuis un répertoire (shared + specific)
 * @param {string} skillsDir - Chemin vers src/skills/
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
 * Charge tous les workflows depuis un répertoire
 * @param {string} workflowsDir - Chemin vers src/workflows/
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
 * Charge le registre de commandes
 * @param {string} commandsFile - Chemin vers commands.yaml
 * @returns {string} - Contenu brut YAML
 */
function loadCommands(commandsFile) {
  if (!fs.existsSync(commandsFile)) return '';
  return fs.readFileSync(commandsFile, 'utf-8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Charge l'orchestrateur
 * @param {string} orchestratorDir - Chemin vers src/orchestrator/
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
