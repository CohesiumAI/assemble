/**
 * Cohesium AI — Moteur de template
 * Transforme les agents/skills/workflows source en format cible
 */

const { injectLanguage } = require('./i18n');

/**
 * Prépare un agent pour la génération en injectant langue et output config
 * @param {object} agent - Agent parsé { meta, content, sections }
 * @param {object} config - Configuration { langue_equipe, langue_output, output_dir }
 * @returns {object} - Agent enrichi
 */
function prepareAgent(agent, config) {
  let content = agent.content;

  // Injecter les instructions de langue
  if (config.langue_equipe) {
    content = injectLanguage(content, config.langue_equipe, config.langue_output || config.langue_equipe);
  }

  // Injecter la config output
  const outputBlock = `## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : \`${config.output_dir || './cohesium-output'}\`
Respecte la structure de dossiers définie par le workflow en cours.
`;

  if (!content.includes('## Répertoire de sortie')) {
    content = content.trim() + '\n\n' + outputBlock;
  }

  return { ...agent, content };
}

/**
 * Génère le contenu d'un fichier agent pour une plateforme donnée
 * @param {object} agent - Agent parsé et préparé
 * @param {string} format - Format cible ('markdown', 'rules', 'yaml')
 * @returns {string} - Contenu formaté
 */
function renderAgent(agent, format = 'markdown') {
  switch (format) {
    case 'markdown':
      return renderAsMarkdown(agent);
    case 'rules':
      return renderAsRules(agent);
    case 'yaml':
      return renderAsYaml(agent);
    default:
      return renderAsMarkdown(agent);
  }
}

/**
 * Rend un agent au format Markdown (utilisé par la plupart des plateformes)
 */
function renderAsMarkdown(agent) {
  const { meta, content } = agent;
  let output = '';

  if (meta.name) {
    output += `---\n`;
    for (const [key, value] of Object.entries(meta)) {
      if (Array.isArray(value)) {
        output += `${key}: [${value.join(', ')}]\n`;
      } else {
        output += `${key}: ${value}\n`;
      }
    }
    output += `---\n\n`;
  }

  output += content;
  return output;
}

/**
 * Rend un agent au format Rules (pour .cursorrules, .windsurfrules, etc.)
 * Format plus compact, sans frontmatter
 */
function renderAsRules(agent) {
  const { meta, sections } = agent;
  let output = '';

  output += `# ${meta.name || 'Agent'} — ${meta.description || ''}\n\n`;

  for (const [title, body] of Object.entries(sections)) {
    output += `## ${title}\n${body}\n\n`;
  }

  return output;
}

/**
 * Rend un agent au format YAML (pour Kiro, OpenCode, etc.)
 */
function renderAsYaml(agent) {
  const { meta, sections } = agent;
  let output = '';

  output += `name: "${meta.name || ''}"\n`;
  output += `description: "${meta.description || ''}"\n`;
  output += `role: "${meta.marvel || ''}"\n`;
  output += `instructions: |\n`;

  for (const [title, body] of Object.entries(sections)) {
    const indented = body.split('\n').map(l => `    ${l}`).join('\n');
    output += `  ## ${title}\n${indented}\n\n`;
  }

  return output;
}

/**
 * Génère un fichier de commandes pour une plateforme
 * @param {string} commandsYaml - Contenu du commands.yaml
 * @param {string} format - Format cible
 * @returns {string}
 */
function renderCommands(commandsYaml, format = 'markdown') {
  if (format === 'markdown') {
    return `# Commandes Cohesium AI\n\n${commandsYaml}`;
  }
  return commandsYaml;
}

/**
 * Génère le contenu de l'orchestrateur pour une plateforme
 * @param {object} orchestrator - Orchestrateur parsé
 * @param {object} config - Configuration
 * @returns {string}
 */
function renderOrchestrator(orchestrator, config) {
  return prepareAgent(orchestrator, config).content;
}

/**
 * Génère un fichier de workflow pour une plateforme
 * @param {object} workflow - Workflow parsé
 * @param {string} format - Format cible
 * @returns {string}
 */
function renderWorkflow(workflow, format = 'yaml') {
  if (format === 'markdown') {
    return `# Workflow : ${workflow.fileName}\n\n\`\`\`yaml\n${workflow.raw}\n\`\`\``;
  }
  return workflow.raw;
}

module.exports = {
  prepareAgent,
  renderAgent,
  renderAsMarkdown,
  renderAsRules,
  renderAsYaml,
  renderCommands,
  renderOrchestrator,
  renderWorkflow
};
