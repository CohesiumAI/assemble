#!/usr/bin/env node

/**
 * Assemble — Générateur principal
 * Transforme les agents/skills/workflows source en fichiers natifs par plateforme
 *
 * Usage:
 *   node generate.js --config .assemble.yaml --project /path/to/project
 *   node generate.js --platforms cursor,claude-code --lang-team français --lang-output english
 */

const fs = require('fs');
const path = require('path');
const { loadAgents, loadSkills, loadWorkflows, loadCommands, loadOrchestrator } = require('./lib/parser');
const { prepareAgent } = require('./lib/template-engine');
const { validateOutput } = require('./lib/validator');
const { resolveProfile } = require('./lib/profiles');
const { generateMCPServer } = require('./lib/mcp-generator');
const { generateUniversalAgentsMd } = require('./lib/agents-md-generator');

// ─── Configuration par défaut ───────────────────────────────────────────────

const DEFAULTS = {
  langue_equipe: 'français',
  langue_output: 'français',
  output_dir: './assemble-output',
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

function loadAdapters(projectDir) {
  const adapters = {};

  // Built-in adapters
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

  // Plugin adapters from .assemble/adapters/ (user-provided, override built-in if same name)
  if (projectDir) {
    const pluginDir = path.join(projectDir, '.assemble', 'adapters');
    if (fs.existsSync(pluginDir)) {
      for (const file of fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'))) {
        try {
          const adapter = require(path.resolve(pluginDir, file));
          if (adapter.name && typeof adapter.generate === 'function') {
            adapters[adapter.name] = adapter;
          } else {
            console.warn(`⚠️  Plugin adapter ${file}: missing name or generate() — skipped`);
          }
        } catch (err) {
          console.warn(`⚠️  Plugin adapter ${file}: ${err.message}`);
        }
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
  const explicitKeys = new Set();

  // Parse simple du YAML de config
  for (const line of raw.split('\n')) {
    const match = line.match(/^(\w[\w_]*):\s*(.+)$/);
    if (!match) continue;

    const [, key, value] = match;
    explicitKeys.add(key);
    if (value.startsWith('[')) {
      config[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/["']/g, ''));
    } else if (value === 'all') {
      config[key] = 'all';
    } else {
      const cleaned = value.replace(/["']/g, '').trim();
      // Parse booleans
      if (cleaned === 'true') config[key] = true;
      else if (cleaned === 'false') config[key] = false;
      else config[key] = cleaned;
    }
  }

  // Track which keys were explicitly set (used by resolveProfile)
  config._explicitKeys = explicitKeys;

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
      case '--update':
      case '-u':
        parsed.update = true;
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
Assemble — Générateur de configurations

Usage:
  node generate.js [options]

Options:
  --config, -c <path>     Chemin vers le fichier .assemble.yaml
  --project, -p <path>    Répertoire du projet cible (défaut: .)
  --platforms <list>       Plateformes cibles, séparées par des virgules
  --lang-team <lang>       Langue de l'équipe (défaut: français)
  --lang-output <lang>     Langue des livrables (défaut: français)
  --output-dir, -o <path>  Répertoire de sortie des livrables
  --update, -u             Mettre à jour une installation existante (lit .assemble.yaml)
  --validate               Valider les fichiers générés sans régénérer
  --help, -h               Afficher cette aide

Plateformes supportées:
  IDE: cursor, windsurf, cline, roocode, copilot, kiro, trae, antigravity,
       codebuddy, crush, iflow, kilocoder, opencode, qwencoder, rovodev
  CLI: claude-code, codex, gemini-cli, auggie, pi

Exemples:
  node generate.js --platforms cursor,claude-code --lang-team français
  node generate.js --config .assemble.yaml --project /my/project
  node generate.js --update --project /my/project
  node generate.js --validate --project /my/project
`);
}

// ─── Génération principale ───────────────────────────────────────────────────

function generate() {
  const args = parseArgs();

  const projectDir = path.resolve(args.projectDir || '.');
  const configPath = args.configPath || path.join(projectDir, '.assemble.yaml');

  // ─── Mode update : lire .assemble.yaml existant ─────────────────────────
  if (args.update) {
    // Migration: rename old .cohesium.yaml → .assemble.yaml if needed
    const legacyConfigPath = path.join(projectDir, '.cohesium.yaml');
    if (!fs.existsSync(configPath) && fs.existsSync(legacyConfigPath)) {
      console.log('🔄 Migrating .cohesium.yaml → .assemble.yaml');
      let legacyContent = fs.readFileSync(legacyConfigPath, 'utf-8');
      legacyContent = legacyContent
        .replace(/cohesium-output/g, 'assemble-output')
        .replace(/Cohesium AI/g, 'Assemble')
        .replace(/cohesium\.yaml/g, 'assemble.yaml');
      fs.writeFileSync(configPath, legacyContent, 'utf-8');
      fs.unlinkSync(legacyConfigPath);
      console.log('  ✓ Config migrated successfully');
    }

    if (!fs.existsSync(configPath)) {
      console.error('❌ No installation found (.assemble.yaml missing).');
      console.error('   Run an installation first: npx create-assemble');
      process.exit(1);
    }
    console.log('🔄 Assemble — Update');
    console.log(`📄 Config loaded: ${configPath}`);
  }

  // Charger la config
  let config = loadConfig(configPath);

  // Résoudre le profil (les valeurs du profil sont des defaults, config explicite gagne)
  config = resolveProfile(config);

  // Surcharger avec les arguments CLI (sauf en mode update pur)
  if (args.platforms) config.platforms = args.platforms;
  if (args.langue_equipe) config.langue_equipe = args.langue_equipe;
  if (args.langue_output) config.langue_output = args.langue_output;
  if (args.output_dir) config.output_dir = args.output_dir;
  if (!config.governance) config.governance = 'none';

  // Normalize booleans once (in case they came as strings from YAML or CLI)
  config.mcp = config.mcp === true || config.mcp === 'true';
  config.memory = config.memory === true || config.memory === 'true';
  config.metrics = config.metrics === true || config.metrics === 'true';

  console.log('🚀 Assemble — Générateur de configurations');
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
    console.error('❌ Aucune plateforme sélectionnée. Utilisez --platforms ou configurez .assemble.yaml');
    process.exit(1);
  }

  // Charger les sources
  console.log('📖 Chargement des sources...');

  let agents = loadAgents(AGENTS_DIR);
  // Filter agents if config specifies a subset (not "all")
  if (config.agents && config.agents !== 'all' && typeof config.agents === 'string') {
    const selectedIds = config.agents.split(/[\s,]+/).filter(Boolean);
    if (selectedIds.length > 0) {
      agents = agents.filter(a => {
        const id = (a.fileName || '').replace(/^AGENT-/, '').replace(/\.md$/, '');
        return selectedIds.includes(id);
      });
    }
  }
  console.log(`  ✓ ${agents.length} agents chargés`);

  // Charger les custom agents depuis .assemble/agents/
  const customAgentsDir = path.join(projectDir, '.assemble', 'agents');
  if (fs.existsSync(customAgentsDir)) {
    const customAgents = loadAgents(customAgentsDir);
    for (const ca of customAgents) {
      const caId = (ca.fileName || '').replace(/^AGENT-/, '').replace(/\.md$/, '');
      const existingIdx = agents.findIndex(a => {
        const id = (a.fileName || '').replace(/^AGENT-/, '').replace(/\.md$/, '');
        return id === caId;
      });
      if (existingIdx >= 0) {
        agents[existingIdx] = ca; // Custom overrides built-in
      } else {
        agents.push(ca);
      }
    }
    if (customAgents.length > 0) {
      console.log(`  ✓ ${customAgents.length} custom agents chargés depuis .assemble/agents/`);
    }
  }

  const skills = loadSkills(SKILLS_DIR);
  console.log(`  ✓ ${skills.shared.length} skills partagées, ${skills.specific.length} skills spécifiques`);

  // Charger les custom skills depuis .assemble/skills/
  const customSkillsDir = path.join(projectDir, '.assemble', 'skills');
  if (fs.existsSync(customSkillsDir)) {
    const customSkillFiles = fs.readdirSync(customSkillsDir).filter(f => f.endsWith('.md'));
    for (const file of customSkillFiles) {
      const content = fs.readFileSync(path.join(customSkillsDir, file), 'utf-8');
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      const meta = {};
      if (fmMatch) {
        for (const line of fmMatch[1].split('\n')) {
          const m = line.match(/^(\w+):\s*"?([^"\n]+)"?/);
          if (m) meta[m[1]] = m[2].trim();
        }
      }
      skills.specific.push({ fileName: file, meta, content, raw: content, sections: {} });
    }
    if (customSkillFiles.length > 0) {
      console.log(`  ✓ ${customSkillFiles.length} custom skills chargées depuis .assemble/skills/`);
    }
  }

  let workflows = loadWorkflows(WORKFLOWS_DIR);
  // Filter workflows if config specifies a subset (not "all")
  if (config.workflows && config.workflows !== 'all' && typeof config.workflows === 'string') {
    const selectedWfs = config.workflows.split(/[\s,]+/).filter(Boolean);
    if (selectedWfs.length > 0) {
      workflows = workflows.filter(w => {
        const id = (w.fileName || '').replace(/\.(yaml|yml)$/, '');
        return selectedWfs.includes(id);
      });
    }
  }
  console.log(`  ✓ ${workflows.length} workflows chargés`);

  // Charger les custom workflows depuis .assemble/workflows/
  const customWorkflowsDir = path.join(projectDir, '.assemble', 'workflows');
  if (fs.existsSync(customWorkflowsDir)) {
    const customWfFiles = fs.readdirSync(customWorkflowsDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    for (const file of customWfFiles) {
      const raw = fs.readFileSync(path.join(customWorkflowsDir, file), 'utf-8');
      const wfId = file.replace(/\.(yaml|yml)$/, '');
      const existingIdx = workflows.findIndex(w => {
        return (w.fileName || '').replace(/\.(yaml|yml)$/, '') === wfId;
      });
      const wf = { fileName: file, raw, meta: {} };
      if (existingIdx >= 0) {
        workflows[existingIdx] = wf;
      } else {
        workflows.push(wf);
      }
    }
    if (customWfFiles.length > 0) {
      console.log(`  ✓ ${customWfFiles.length} custom workflows chargés depuis .assemble/workflows/`);
    }
  }

  const commands = loadCommands(COMMANDS_FILE);
  console.log(`  ✓ Registre de commandes chargé`);

  const orchestrator = loadOrchestrator(ORCHESTRATOR_DIR);
  console.log(`  ✓ Orchestrateur chargé`);

  // Préparer les agents (injection langue + output)
  const preparedAgents = agents.map(a => prepareAgent(a, config));

  // Charger les adaptateurs (built-in + plugins from .assemble/adapters/)
  const adapters = loadAdapters(projectDir);
  console.log(`  ✓ ${Object.keys(adapters).length} adaptateurs disponibles`);
  console.log('');

  // ─── Clean up old generated files before regeneration ────────────────────
  if (args.update) {
    console.log('🧹 Cleaning old generated files...');
    // Directories that adapters generate — clean them but NEVER touch output or .assemble.yaml
    const platformDirs = [
      '.cursor', '.windsurf', '.cline', '.roo', '.github',
      '.kiro', '.trae', '.antigravity', '.codebuddy', '.crush',
      '.iflow', '.kilocoder', '.opencode', '.qwencoder', '.rovo',
      '.claude', '.gemini', '.augment', '.pi',
    ];
    const platformFiles = [
      '.cursorrules', '.windsurfrules', '.clinerules', '.roomodes',
      'CLAUDE.md', 'GEMINI.md', 'AGENTS.md', 'SYSTEM.md',
    ];

    for (const dir of platformDirs) {
      const fullPath = path.join(projectDir, dir);
      if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
      }
    }
    for (const file of platformFiles) {
      const fullPath = path.join(projectDir, file);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    console.log('  ✓ Old files removed');
    console.log('');
  }

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

  // ─── Créer le répertoire output pour les livrables ──────────────────────
  const outputPath = path.resolve(projectDir, config.output_dir);
  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(
    path.join(outputPath, '.gitkeep'),
    '# Ce dossier contient les livrables produits par les agents Assemble by Cohesium AI\n'
  );

  // ─── MCP Server generation (opt-in) ──────────────────────────────────────
  if (config.mcp) {
    console.log('🔌 Generating MCP server...');
    try {
      generateMCPServer(projectDir, { agents: preparedAgents, workflows, config });
      console.log('  ✅ MCP server generated in .assemble/');
    } catch (err) {
      console.warn(`  ⚠️  MCP generation failed: ${err.message}`);
    }
  }

  // ─── Cross-session memory template (opt-in) ────────────────────────────────
  if (config.memory) {
    const memoryContent = `# Assemble — Cross-Session Memory

## Purpose
This file persists context across sessions. Jarvis and agents can read/write here.

## Session Log
<!-- Agents append key decisions, blockers, and outcomes here -->

## Active Context
<!-- Current project state, recent decisions, open threads -->

## Key Decisions
<!-- Important decisions with rationale — survives across sessions -->
`;
    const memoryPath = path.join(projectDir, config.output_dir || './assemble-output', '_memory.md');
    fs.mkdirSync(path.dirname(memoryPath), { recursive: true });
    if (!fs.existsSync(memoryPath)) {
      fs.writeFileSync(memoryPath, memoryContent, 'utf-8');
      console.log('🧠 Cross-session _memory.md created');
    }
  }

  // ─── Metrics template (opt-in) ─────────────────────────────────────────────
  if (config.metrics) {
    const metricsContent = `# Assemble — Workflow Metrics

## Purpose
Track workflow execution metrics for observability and continuous improvement.

## Metrics Format
| Workflow | Started | Completed | Duration | Steps | Agents | Status |
|----------|---------|-----------|----------|-------|--------|--------|
<!-- Jarvis appends a row after each workflow completion -->

## Agent Performance
| Agent | Invocations | Avg Output Quality | Common Issues |
|-------|-------------|-------------------|---------------|
<!-- Updated periodically based on workflow outcomes -->

## Trends
<!-- Weekly/monthly summaries appended by Jarvis -->
`;
    const metricsPath = path.join(projectDir, config.output_dir || './assemble-output', '_metrics.md');
    fs.mkdirSync(path.dirname(metricsPath), { recursive: true });
    if (!fs.existsSync(metricsPath)) {
      fs.writeFileSync(metricsPath, metricsContent, 'utf-8');
      console.log('📊 Workflow _metrics.md created');
    }
  }

  // ─── Audit trail template (governance: strict) ──────────────────────────────
  if (config.governance === 'strict') {
    const auditContent = `# Assemble — Audit Trail

## Purpose
Log of all agent actions for governance compliance. Required by \`governance: strict\`.

## Format
| Timestamp | Agent | Action | Inputs | Outputs | Approved By |
|-----------|-------|--------|--------|---------|-------------|
<!-- Jarvis appends a row for every agent action -->

## Approval Log
| Timestamp | Phase | Decision | User |
|-----------|-------|----------|------|
<!-- Logged at each governance gate -->
`;
    const auditPath = path.join(outputPath, '_audit.md');
    if (!fs.existsSync(auditPath)) {
      fs.writeFileSync(auditPath, auditContent, 'utf-8');
      console.log('📋 Audit trail _audit.md created (governance: strict)');
    }
  }

  // ─── AGENTS.md universal (for all platforms except those that generate their own) ─
  {
    const agentsMdContent = generateUniversalAgentsMd(preparedAgents, workflows, config);
    const agentsMdPath = path.join(projectDir, config.output_dir || './assemble-output', 'AGENTS.md');
    fs.mkdirSync(path.dirname(agentsMdPath), { recursive: true });
    fs.writeFileSync(agentsMdPath, agentsMdContent, 'utf-8');
  }

  // Mettre à jour ou créer .assemble.yaml
  const assembleConfigPath = path.join(projectDir, '.assemble.yaml');
  const existingConfig = fs.existsSync(assembleConfigPath) ? loadConfig(assembleConfigPath) : {};
  const today = new Date().toISOString().split('T')[0];
  const assembleConfig = `# Assemble — Configuration du projet
# Mettre à jour : node generate.js --update --project .
# Régénérer :     node generate.js --config .assemble.yaml

version: "1.0.0"
profile: "${config.profile || 'custom'}"
langue_equipe: "${config.langue_equipe}"
langue_output: "${config.langue_output}"
output_dir: "${config.output_dir}"
platforms: [${config.platforms.join(', ')}]
agents: ${config.agents || 'all'}
workflows: ${config.workflows || 'all'}
governance: "${config.governance || 'none'}"
mcp: ${config.mcp ? 'true' : 'false'}
memory: ${config.memory ? 'true' : 'false'}
metrics: ${config.metrics ? 'true' : 'false'}
installed_at: "${existingConfig.installed_at || today}"
updated_at: "${today}"
`;
  fs.writeFileSync(assembleConfigPath, assembleConfig);
  if (args.update) {
    console.log(`\n📄 .assemble.yaml mis à jour (${today})`);
  } else if (!existingConfig.installed_at) {
    console.log(`\n📄 Fichier .assemble.yaml créé`);
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
