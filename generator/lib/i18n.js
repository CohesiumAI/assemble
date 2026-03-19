/**
 * Assemble — Module i18n
 * Gère l'injection des instructions de langue dans les agents générés
 * Approche "langue libre" : pas de fichiers de traduction, le LLM gère
 */

/**
 * Génère le bloc d'instructions de langue à injecter dans chaque agent
 * @param {string} langueEquipe - Langue des interactions (ex: "français", "english", "deutsch")
 * @param {string} langueOutput - Langue des livrables produits
 * @returns {string} - Bloc markdown à injecter
 */
function generateLanguageBlock(langueEquipe, langueOutput) {
  return `## Langue de travail

Tu communiques et rédiges tous tes échanges en **${langueEquipe}**.
Les fichiers et livrables que tu produis sont rédigés en **${langueOutput}**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.
`;
}

/**
 * Remplace les instructions de langue existantes dans le contenu d'un agent
 * Cherche le pattern "Tu travailles toujours en français" et le remplace
 * @param {string} content - Contenu de l'agent
 * @param {string} langueEquipe - Langue des interactions
 * @param {string} langueOutput - Langue des livrables
 * @returns {string} - Contenu modifié
 */
function injectLanguage(content, langueEquipe, langueOutput) {
  const languageBlock = generateLanguageBlock(langueEquipe, langueOutput);

  // Remplacer les mentions de langue existantes dans la posture
  let modified = content.replace(
    /- Tu travailles toujours en français.*\n/g,
    `- Tu travailles en ${langueEquipe} pour les échanges et en ${langueOutput} pour les livrables.\n`
  );

  // Remplacer aussi "sauf instruction contraire"
  modified = modified.replace(
    /- Tu travailles toujours en français sauf instruction contraire\.\n/g,
    `- Tu travailles en ${langueEquipe} pour les échanges et en ${langueOutput} pour les livrables.\n`
  );

  // Ajouter le bloc de langue à la fin si pas déjà présent
  if (!modified.includes('## Langue de travail')) {
    modified = modified.trim() + '\n\n' + languageBlock;
  }

  return modified;
}

/**
 * Traduit les labels de section si nécessaire
 * Utilisé pour adapter les headers des agents à la langue cible
 * @param {string} sectionName - Nom de section en français
 * @param {string} langue - Langue cible
 * @returns {string} - Nom traduit
 */
function translateSectionLabel(sectionName, langue) {
  // Si la langue est le français, pas de traduction
  if (langue.toLowerCase().startsWith('fran')) return sectionName;

  // Mapping basique pour les langues principales
  const translations = {
    english: {
      'Identité': 'Identity',
      'Posture': 'Approach',
      'Séquence d\'intervention': 'Intervention Sequence',
      'Anti-patterns — ce que tu ne fais jamais': 'Anti-patterns — what you never do',
      'Format de sortie par défaut': 'Default Output Format',
      'Ce que tu produis typiquement': 'Typical Deliverables',
      'Règles de qualité': 'Quality Rules',
      'Langue de travail': 'Working Language'
    },
    deutsch: {
      'Identité': 'Identität',
      'Posture': 'Haltung',
      'Séquence d\'intervention': 'Interventionssequenz',
      'Anti-patterns — ce que tu ne fais jamais': 'Anti-Patterns — was du nie tust',
      'Format de sortie par défaut': 'Standard-Ausgabeformat',
      'Ce que tu produis typiquement': 'Typische Ergebnisse',
      'Règles de qualité': 'Qualitätsregeln',
      'Langue de travail': 'Arbeitssprache'
    },
    español: {
      'Identité': 'Identidad',
      'Posture': 'Postura',
      'Séquence d\'intervention': 'Secuencia de intervención',
      'Anti-patterns — ce que tu ne fais jamais': 'Anti-patrones — lo que nunca haces',
      'Format de sortie par défaut': 'Formato de salida por defecto',
      'Ce que tu produis typiquement': 'Lo que produces típicamente',
      'Règles de qualité': 'Reglas de calidad',
      'Langue de travail': 'Idioma de trabajo'
    }
  };

  // Trouver la langue la plus proche
  const langKey = Object.keys(translations).find(k =>
    langue.toLowerCase().includes(k) || k.includes(langue.toLowerCase())
  );

  if (langKey && translations[langKey][sectionName]) {
    return translations[langKey][sectionName];
  }

  // Pour les langues non listées, on garde le français
  // Le LLM adaptera naturellement
  return sectionName;
}

module.exports = {
  generateLanguageBlock,
  injectLanguage,
  translateSectionLabel
};
