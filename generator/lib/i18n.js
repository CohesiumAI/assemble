/**
 * Assemble — i18n Module
 * Manages language instruction injection in generated agents
 * "Free language" approach: no translation files, the LLM handles it
 */

/**
 * Generates the language instruction block to inject in each agent
 * @param {string} langueEquipe - Interaction language (e.g., "english", "deutsch", "français")
 * @param {string} langueOutput - Deliverable output language
 * @returns {string} - Markdown block to inject
 */
function generateLanguageBlock(langueEquipe, langueOutput) {
  return `## Working Language

You communicate and write all your exchanges in **${langueEquipe}**.
The files and deliverables you produce are written in **${langueOutput}**.
Technical terms, source code, variable names, and commands remain in **English**.
`;
}

/**
 * Replaces existing language instructions in an agent's content
 * Looks for language instruction patterns and replaces them
 * @param {string} content - Agent content
 * @param {string} langueEquipe - Interaction language
 * @param {string} langueOutput - Deliverable language
 * @returns {string} - Modified content
 */
function injectLanguage(content, langueEquipe, langueOutput) {
  const languageBlock = generateLanguageBlock(langueEquipe, langueOutput);

  // Replace existing language mentions in the approach section
  let modified = content.replace(
    /- Tu travailles toujours en français.*\n/g,
    `- You communicate in ${langueEquipe} for interactions and in ${langueOutput} for deliverables.\n`
  );

  // Also replace "unless instructed otherwise" variant
  modified = modified.replace(
    /- Tu travailles toujours en français sauf instruction contraire\.\n/g,
    `- You communicate in ${langueEquipe} for interactions and in ${langueOutput} for deliverables.\n`
  );

  // Replace English variants too
  modified = modified.replace(
    /- You communicate in the team language.*\n/g,
    `- You communicate in ${langueEquipe} for interactions and in ${langueOutput} for deliverables.\n`
  );

  // Add language block at the end if not already present
  if (!modified.includes('## Working Language') && !modified.includes('## Langue de travail')) {
    modified = modified.trim() + '\n\n' + languageBlock;
  }

  return modified;
}

/**
 * Translates section labels if necessary
 * Used to adapt agent headers to the target language
 * @param {string} sectionName - Section name in English
 * @param {string} langue - Target language
 * @returns {string} - Translated name
 */
function translateSectionLabel(sectionName, langue) {
  // If the language is English, no translation needed
  if (langue.toLowerCase().startsWith('en')) return sectionName;

  // Basic mapping for main languages
  const translations = {
    english: {
      'Identity': 'Identity',
      'Approach': 'Approach',
      'Intervention Sequence': 'Intervention Sequence',
      'Anti-patterns — what you never do': 'Anti-patterns — what you never do',
      'Default Output Format': 'Default Output Format',
      'Typical Deliverables': 'Typical Deliverables',
      'Quality Rules': 'Quality Rules',
      'Working Language': 'Working Language'
    },
    deutsch: {
      'Identity': 'Identität',
      'Approach': 'Haltung',
      'Intervention Sequence': 'Interventionssequenz',
      'Anti-patterns — what you never do': 'Anti-Patterns — was du nie tust',
      'Default Output Format': 'Standard-Ausgabeformat',
      'Typical Deliverables': 'Typische Ergebnisse',
      'Quality Rules': 'Qualitätsregeln',
      'Working Language': 'Arbeitssprache'
    },
    español: {
      'Identity': 'Identidad',
      'Approach': 'Postura',
      'Intervention Sequence': 'Secuencia de intervención',
      'Anti-patterns — what you never do': 'Anti-patrones — lo que nunca haces',
      'Default Output Format': 'Formato de salida por defecto',
      'Typical Deliverables': 'Lo que produces típicamente',
      'Quality Rules': 'Reglas de calidad',
      'Working Language': 'Idioma de trabajo'
    },
    français: {
      'Identity': 'Identité',
      'Approach': 'Posture',
      'Intervention Sequence': 'Séquence d\'intervention',
      'Anti-patterns — what you never do': 'Anti-patterns — ce que tu ne fais jamais',
      'Default Output Format': 'Format de sortie par défaut',
      'Typical Deliverables': 'Ce que tu produis typiquement',
      'Quality Rules': 'Règles de qualité',
      'Working Language': 'Langue de travail'
    }
  };

  // Find the closest language match
  const langKey = Object.keys(translations).find(k =>
    langue.toLowerCase().includes(k) || k.includes(langue.toLowerCase())
  );

  if (langKey && translations[langKey][sectionName]) {
    return translations[langKey][sectionName];
  }

  // For unlisted languages, keep English
  // The LLM will naturally adapt
  return sectionName;
}

module.exports = {
  generateLanguageBlock,
  injectLanguage,
  translateSectionLabel
};
