#!/usr/bin/env node

/**
 * Cohesium AI — Générateur principal
 * Transforme les agents/skills/workflows source en fichiers natifs par plateforme
 *
 * Usage:
 *   node generate.js --config .cohesium.yaml --project /path/to/project
 *   node generate.js --platforms cursor,claude-code --lang-team français --lang-output english
 */

const fs = require('fs');
const path = require('path');
const { loadAgents, loadSkills, loadWorkflows, loadCommands, loadOrchestrator } = require('./lib/parser');
const { prepareAgent } = require('./lib/template-engine');
const { validateOutput } = require('./lib/validator');

// ─── Configuration par défaut ───────────────────────────────────────────────

const DEFAULTS = {
  langue_equipe: 'français',
  langue_output: 'français',
  output_dir: './cohesium-output',
  platforms: [],
  agents: 'all',
  workflows: 'all'
};

// ─── Résolution des chemins ──────────────────────────────────────────────────

const SRC_DIR = path.resolve(__dirname, '..', 'src');
const AGENTS_DIR = path.join(SRC_DIR, 'agents');
const SKILLS_DIR = path.join(SRC_DIR, 'skills');
const WORKFLOWS_DIR = path.join(SRC_DIR, 'workflows');
const COMMANDS_FILE = path.join(SRC_DIR, 'commands', 'commands.yaml');
const ORCHESTRATOR_DIR = path.join(SRC_DIR, 'orchestrator');
const ADAPTERS_DIR = path.join(__dirname, 'adapters');

// ─── Chargement des adaptateurs ──────────────────────────────────────────────

function loadAdapters() {
  const adapters = {};

  for (const subdir of ['ide', 'cli']) {
    const dir = path.join(ADAPTERS_DIR, subdir);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
      try {
        const adapter = require(path.join(dir, file));
        adapters[adapter.name] = adapter;
      } catch (err) {
        console.warn(`⚠️  Impossible de charger l'adaptateur ${file}: ${err.message}`);
      }
    }
  }

  return adapters;
}

// ─── Chargement de la configuration ──────────────────────────────────────────

function loadConfig(configPath) {
  if (!configPath || !fs.existsSync(configPath)) {
    return { ...DEFAULTS };
  }

  const raw = fs.readFileSync(configPath, 'utf-8');
  const config = { ...DEFAULTS };

  // Parse simple du YAML de config
  for (const line of raw.split('\n')) {
    const match = line.match(/^(\w[\w_]*):\s*(.+)$/);
    if (!match) continue;

    const [, key, value] = match;
    if (value.startsWith('[')) {
      config[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/["']/g, ''));
    } else if (value === 'all') {
      config[key] = 'all';
    } else {
      config[key] = value.replace(/["']/g, '').trim();
    }
  }

  return config;
}

// ─── Parsing des arguments CLI ───────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--config':
      case '-c':
        parsed.configPath = args[++i];
        break;
      case '--project':
      case '-p':
        parsed.projectDir = args[++i];
        break;
      case '--platforms':
        parsed.platforms = args[++i].split(',');
        break;
      case '--lang-team':
        parsed.langue_equipe = args[++i];
        break;
      case '--lang-output':
        parsed.langue_output = args[++i];
        break;
      case '--output-dir':
      case '-o':
        parsed.output_dir = args[++i];
        break;
      case '--validate':
        parsed.validateOnly = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
      default:
        if (!args[i].startsWith('-')) {
          parsed.projectDir = parsed.projectDir || args[i];
        }
    }
  }

  return parsed;
}

function printHelp() {
  console.log(`
Cohesium AI — Générateur de configurations

Usage:
  node generate.js [options]

Options:
  --config, -c <path>     Chemin vers le fichier .cohesium.yaml
  --project, -p <path>    Répertoire du projet cible (défaut: .)
  --platforms <list>       Plateformes cibles, séparées par des virgules
  --lang-team <lang>       Langue de l'équipe (défaut: français)
  --lang-output <lang>     Langue des livrables (défaut: français)
  --output-dir, -o <path>  Répertoire de sortie des livrables
  --validate               Valider les fichiers générés sans régénérer
  --help, -h               Afficher cette aide

Plateformes supportées:
  IDE: cursor, windsurf, cline, roocode, copilot, kiro, trae, antigravity,
       codebuddy, crush, iflow, kilocoder, opencode, qwencoder, rovodev
  CLI: claude-code, codex, gemini-cli, auggie, pi

Exemples:
  node generate.js --platforms cursor,claude-code --lang-team français
  node generate.js --config .cohesium.yaml --project /my/project
  node generate.js --validate --project /my/project
`);
}

// ─── Génération principale ───────────────────────────────────────────────────

function generate() {
  const args = parseArgs();

  // Charger la config
  const configPath = args.configPath || path.join(args.projectDir || '.', '.cohesium.yaml');
  const config = loadConfig(configPath);

  // Surcharger avec les arguments CLI
  if (args.platforms) config.platforms = args.platforms;
  if (args.langue_equipe) config.langue_equipe = args.langue_equipe;
  if (args.langue_output) config.langue_output = args.langue_output;
  if (args.output_dir) config.output_dir = args.output_dir;

  const projectDir = path.resolve(args.projectDir || '.');

  console.log('🚀 Cohesium AI — Générateur de configurations');
  console.log(`📁 Projet : ${projectDir}`);
  console.log(`🌍 Langue équipe : ${config.langue_equipe}`);
  console.log(`📝 Langue output : ${config.langue_output}`);
  console.log(`📂 Output dir : ${config.output_dir}`);
  console.log(`🎯 Plateformes : ${config.platforms.join(', ') || 'aucune sélectionnée'}`);
  console.log('');

  // Mode validation uniquement
  if (args.validateOnly) {
    console.log('🔍 Validation des fichiers générés...');
    const validation = validateOutput(projectDir, config.platforms);
    if (validation.valid) {
      console.log('✅ Tous les fichiers sont valides');
    } else {
      console.log('❌ Des erreurs ont été trouvées :');
      for (const [platform, result] of Object.entries(validation.results)) {
        if (!result.valid) {
          console.log(`  ${platform}: ${result.errors.join(', ')}`);
        }
      }
    }
    process.exit(validation.valid ? 0 : 1);
  }

  // Vérifier qu'il y a des plateformes
  if (!config.platforms || config.platforms.length === 0) {
    console.error('❌ Aucune plateforme sélectionnée. Utilisez --platforms ou configurez .cohesium.yaml');
    process.exit(1);
  }

  // Charger les sources
  console.log('📖 Chargement des sources...');

  const agents = loadAgents(AGENTS_DIR);
  console.log(`  ✓ ${agents.length} agents chargés`);

  const skills = loadSkills(SKILLS_DIR);
  console.log(`  ✓ ${skills.shared.length} skills partagées, ${skills.specific.length} skills spécifiques`);

  const workflows = loadWorkflows(WORKFLOWS_DIR);
  console.log(`  ✓ ${workflows.length} workflows chargés`);

  const commands = loadCommands(COMMANDS_FILE);
  console.log(`  ✓ Registre de commandes chargé`);

  const orchestrator = loadOrchestrator(ORCHESTRATOR_DIR);
  console.log(`  ✓ Orchestrateur chargé`);

  // Préparer les agents (injection langue + output)
  const preparedAgents = agents.map(a => prepareAgent(a, config));

  // Charger les adaptateurs
  const adapters = loadAdapters();
  console.log(`  ✓ ${Object.keys(adapters).length} adaptateurs disponibles`);
  console.log('');

  // Générer pour chaque plateforme
  let successCount = 0;
  let errorCount = 0;

  for (const platformName of config.platforms) {
    const adapter = adapters[platformName];
    if (!adapter) {
      console.warn(`⚠️  Adaptateur inconnu : ${platformName} — ignoré`);
      errorCount++;
      continue;
    }

    console.log(`🔧 Génération pour ${adapter.displayName || platformName}...`);

    try {
      adapter.generate(projectDir, {
        agents: preparedAgents,
        skills,
        workflows,
        commands,
        orchestrator: orchestrator ? prepareAgent(orchestrator, config) : null,
        config
      });

      const validation = adapter.validate(projectDir);
      if (validation.valid) {
        console.log(`  ✅ ${adapter.displayName || platformName} — OK`);
        successCount++;
      } else {
        console.log(`  ⚠️  ${adapter.displayName || platformName} — généré avec avertissements :`);
        validation.errors.forEach(e => console.log(`     - ${e}`));
        successCount++;
      }
    } catch (err) {
      console.error(`  ❌ ${adapter.displayName || platformName} — Erreur : ${err.message}`);
      errorCount++;
    }
  }

  // Créer le répertoire output pour les livrables
  const outputPath = path.resolve(projectDir, config.output_dir);
  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(
    path.join(outputPath, '.gitkeep'),
    '# Ce dossier contient les livrables produits par les agents Cohesium AI\n'
  );

  // Générer le .cohesium.yaml si pas déjà présent
  const cohesiumConfigPath = path.join(projectDir, '.cohesium.yaml');
  if (!fs.existsSync(cohesiumConfigPath)) {
    const cohesiumConfig = `# Cohesium AI — Configuration du projet
# Généré le ${new Date().toISOString().split('T')[0]}
# Relancer la génération : node generate.js --config .cohesium.yaml

version: "1.0.0"
langue_equipe: "${config.langue_equipe}"
langue_output: "${config.langue_output}"
output_dir: "${config.output_dir}"
platforms: [${config.platforms.join(', ')}]
agents: all
workflows: all
installed_at: "${new Date().toISOString().split('T')[0]}"
`;
    fs.writeFileSync(cohesiumConfigPath, cohesiumConfig);
    console.log(`\n📄 Fichier .cohesium.yaml créé`);
  }

  // Résumé
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`✅ Génération terminée : ${successCount} plateformes OK, ${errorCount} erreurs`);
  console.log(`📂 Livrables → ${outputPath}`);
  console.log(`${'═'.repeat(50)}`);

  process.exit(errorCount > 0 ? 1 : 0);
}

// ─── Point d'entrée ──────────────────────────────────────────────────────────

generate();
