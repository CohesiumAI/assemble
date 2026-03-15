/**
 * Cohesium AI — Validateur de fichiers générés
 * Vérifie que les fichiers produits par le générateur sont valides
 */

const fs = require('fs');
const path = require('path');

/**
 * Valide un fichier agent généré
 * @param {string} filePath - Chemin du fichier
 * @param {string} platform - Nom de la plateforme
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateAgent(filePath, platform) {
  const errors = [];

  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: [`Fichier non trouvé : ${filePath}`] };
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  if (content.trim().length === 0) {
    errors.push('Fichier vide');
  }

  if (content.length < 100) {
    errors.push('Fichier trop court (< 100 caractères)');
  }

  // Vérifications spécifiques par plateforme
  const platformChecks = {
    cursor: () => {
      if (filePath.endsWith('.cursorrules') && !content.includes('#')) {
        errors.push('Le fichier .cursorrules devrait contenir des headers markdown');
      }
    },
    'claude-code': () => {
      if (filePath.endsWith('CLAUDE.md') && !content.includes('#')) {
        errors.push('CLAUDE.md devrait contenir des headers markdown');
      }
    },
    roocode: () => {
      if (filePath.endsWith('.roomodes') && !content.includes('{')) {
        errors.push('.roomodes devrait être au format JSON');
      }
    }
  };

  if (platformChecks[platform]) {
    platformChecks[platform]();
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Valide toute la sortie d'une génération
 * @param {string} outputDir - Répertoire de sortie
 * @param {string[]} platforms - Plateformes ciblées
 * @returns {{ valid: boolean, results: object }}
 */
function validateOutput(outputDir, platforms) {
  const results = {};
  let allValid = true;

  for (const platform of platforms) {
    const platformDir = path.join(outputDir, platform);
    if (!fs.existsSync(platformDir)) {
      results[platform] = { valid: false, errors: ['Répertoire non trouvé'] };
      allValid = false;
      continue;
    }

    const files = getAllFiles(platformDir);
    results[platform] = {
      valid: true,
      files: files.length,
      errors: []
    };

    for (const file of files) {
      const validation = validateAgent(file, platform);
      if (!validation.valid) {
        results[platform].valid = false;
        results[platform].errors.push(...validation.errors.map(e => `${path.basename(file)}: ${e}`));
        allValid = false;
      }
    }
  }

  return { valid: allValid, results };
}

/**
 * Récupère récursivement tous les fichiers d'un répertoire
 */
function getAllFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

module.exports = {
  validateAgent,
  validateOutput,
  getAllFiles
};
