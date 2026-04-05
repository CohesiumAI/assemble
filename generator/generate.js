#!/usr/bin/env node

/**
 * Assemble — Main Generator
 * Transforms source agents/skills/workflows into native files per platform
 *
 * Usage:
 *   node generate.js --config .assemble.yaml --project /path/to/project
 *   node generate.js --platforms cursor,claude-code --lang-team english --lang-output english
 */

const fs = require('fs');
const path = require('path');
const { loadAgents, loadSkills, loadWorkflows, loadCommands, loadOrchestrator, parseFlatYaml, normalizeLineEndings } = require('./lib/parser');
const { prepareAgent } = require('./lib/template-engine');

const PKG_VERSION = require('../package.json').version;
const { validateOutput } = require('./lib/validator');
const { resolveProfile } = require('./lib/profiles');
const { generateMCPServer } = require('./lib/mcp-generator');
const { generateUniversalAgentsMd } = require('./lib/agents-md-generator');
const { loadConfig: _loadConfig, DEFAULTS: _DEFAULTS } = require('./lib/config-loader');
const { validateAll } = require('./lib/schema-validator');

// ─── Default configuration ──────────────────────────────────────────────────

const DEFAULTS = _DEFAULTS;

// ─── Path resolution ────────────────────────────────────────────────────────

const SRC_DIR = path.resolve(__dirname, '..', 'src');
const AGENTS_DIR = path.join(SRC_DIR, 'agents');
const SKILLS_DIR = path.join(SRC_DIR, 'skills');
const WORKFLOWS_DIR = path.join(SRC_DIR, 'workflows');
const COMMANDS_FILE = path.join(SRC_DIR, 'commands', 'commands.yaml');
const ORCHESTRATOR_DIR = path.join(SRC_DIR, 'orchestrator');
const ADAPTERS_DIR = path.join(__dirname, 'adapters');

// ─── Adapter loading ────────────────────────────────────────────────────────

function loadAdapters(projectDir) {
  const adapters = {};

  // Built-in adapters (from generator/adapters/{ide,cli}/)
  for (const subdir of ['ide', 'cli']) {
    const dir = path.resolve(ADAPTERS_DIR, subdir);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
      const resolvedPath = path.resolve(dir, file);
      // Ensure the file is inside the expected directory
      if (!resolvedPath.startsWith(dir + path.sep) && resolvedPath !== dir) continue;
      try {
        const adapter = require(resolvedPath);
        adapters[adapter.name] = adapter;
      } catch (err) {
        console.warn(`⚠️  Could not load adapter ${file}: ${err.message}`);
      }
    }
  }

  // Plugin adapters from .assemble/adapters/ (user-provided, override built-in if same name)
  // Security: only .js files directly inside the plugin dir are loaded (no traversal).
  if (projectDir) {
    const pluginDir = path.resolve(projectDir, '.assemble', 'adapters');
    if (fs.existsSync(pluginDir)) {
      for (const file of fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'))) {
        // Path traversal guard: reject filenames containing path separators or ..
        if (file.includes('/') || file.includes('\\') || file.includes('..')) {
          console.warn(`⚠️  Plugin adapter ${file}: rejected (path traversal attempt)`);
          continue;
        }
        const resolvedPath = path.resolve(pluginDir, file);
        // Ensure the resolved path is actually inside the plugin directory
        if (!resolvedPath.startsWith(pluginDir + path.sep) && resolvedPath !== pluginDir) {
          console.warn(`⚠️  Plugin adapter ${file}: rejected (resolves outside plugin dir)`);
          continue;
        }
        try {
          const adapter = require(resolvedPath);
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

// ─── Configuration loading ──────────────────────────────────────────────────

const loadConfig = _loadConfig;

// ─── CLI argument parsing ───────────────────────────────────────────────────

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
Assemble — Configuration Generator

Usage:
  node generate.js [options]

Options:
  --config, -c <path>     Path to the .assemble.yaml file
  --project, -p <path>    Target project directory (default: .)
  --platforms <list>       Target platforms, comma-separated
  --lang-team <lang>       Team language (default: english)
  --lang-output <lang>     Deliverable language (default: english)
  --output-dir, -o <path>  Deliverable output directory
  --update, -u             Update an existing installation (reads .assemble.yaml)
  --validate               Validate generated files without regenerating
  --help, -h               Show this help

Supported platforms (21):
  IDE: cursor, windsurf, cline, roocode, copilot, kiro, trae, antigravity,
       codebuddy, crush, iflow, kilocoder, opencode, qwencoder, rovodev,
       claude-code-desktop
  CLI: claude-code, codex, gemini-cli, auggie, pi

Examples:
  node generate.js --platforms cursor,claude-code --lang-team english
  node generate.js --config .assemble.yaml --project /my/project
  node generate.js --update --project /my/project
  node generate.js --validate --project /my/project
`);
}

// ─── Main generation ────────────────────────────────────────────────────────

function generate() {
  const args = parseArgs();

  const projectDir = path.resolve(args.projectDir || '.');
  const configPath = args.configPath || path.join(projectDir, '.assemble.yaml');

  // ─── Update mode: read existing .assemble.yaml ─────────────────────────
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
      console.error('   Run an installation first: npx cohesiumai-assemble');
      process.exit(1);
    }
    console.log('🔄 Assemble — Update');
    console.log(`📄 Config loaded: ${configPath}`);
  }

  // Load config
  let config = loadConfig(configPath);

  // Resolve profile (profile values are defaults, explicit config wins)
  config = resolveProfile(config);

  // Override with CLI arguments (except in pure update mode)
  if (args.platforms) config.platforms = args.platforms;
  if (args.langue_equipe) config.langue_equipe = args.langue_equipe;
  if (args.langue_output) config.langue_output = args.langue_output;
  if (args.output_dir) config.output_dir = args.output_dir;
  if (!config.governance) config.governance = 'none';

  // Normalize booleans once (in case they came as strings from YAML or CLI)
  config.mcp = config.mcp === true || config.mcp === 'true';
  config.memory = config.memory === true || config.memory === 'true';
  config.metrics = config.metrics === true || config.metrics === 'true';
  config.yolo = config.yolo === true || config.yolo === 'true';
  config.search = config.search === true || config.search === 'true';

  console.log('🚀 Assemble — Configuration Generator');
  console.log(`📁 Project: ${projectDir}`);
  console.log(`🌍 Team language: ${config.langue_equipe}`);
  console.log(`📝 Output language: ${config.langue_output}`);
  console.log(`📂 Output dir: ${config.output_dir}`);
  console.log(`🎯 Platforms: ${config.platforms.join(', ') || 'none selected'}`);
  console.log('');

  // Validation-only mode
  if (args.validateOnly) {
    console.log('🔍 Validating generated files...');
    const validation = validateOutput(projectDir, config.platforms);
    if (validation.valid) {
      console.log('✅ All files are valid');
    } else {
      console.log('❌ Errors found:');
      for (const [platform, result] of Object.entries(validation.results)) {
        if (!result.valid) {
          console.log(`  ${platform}: ${result.errors.join(', ')}`);
        }
      }
    }
    process.exit(validation.valid ? 0 : 1);
  }

  // Check that platforms are selected
  if (!config.platforms || config.platforms.length === 0) {
    console.error('❌ No platform selected. Use --platforms or configure .assemble.yaml');
    process.exit(1);
  }

  // Load sources
  console.log('📖 Loading sources...');

  let agents = loadAgents(AGENTS_DIR);
  // Filter agents if config specifies a subset (not "all")
  if (config.agents && config.agents !== 'all') {
    const selectedIds = Array.isArray(config.agents)
      ? config.agents
      : String(config.agents).split(/[\s,]+/).filter(Boolean);
    if (selectedIds.length > 0) {
      agents = agents.filter(a => {
        const id = (a.fileName || '').replace(/^AGENT-/, '').replace(/\.md$/, '');
        return selectedIds.includes(id);
      });
    }
  }
  console.log(`  ✓ ${agents.length} agents loaded`);

  // Load custom agents from .assemble/agents/
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
      console.log(`  ✓ ${customAgents.length} custom agents loaded from .assemble/agents/`);
    }
  }

  const skills = loadSkills(SKILLS_DIR);
  console.log(`  ✓ ${skills.shared.length} shared skills, ${skills.specific.length} specific skills`);

  // Load custom skills from .assemble/skills/
  const customSkillsDir = path.join(projectDir, '.assemble', 'skills');
  if (fs.existsSync(customSkillsDir)) {
    const customSkillFiles = fs.readdirSync(customSkillsDir).filter(f => f.endsWith('.md'));
    for (const file of customSkillFiles) {
      const rawContent = normalizeLineEndings(
        fs.readFileSync(path.join(customSkillsDir, file), 'utf-8').replace(/^\uFEFF/, '')
      );
      const fmMatch = rawContent.match(/^---\n([\s\S]*?)\n---/);
      let meta = {};
      if (fmMatch) {
        meta = parseFlatYaml(fmMatch[1]);
      }
      skills.specific.push({ fileName: file, meta, content: rawContent, raw: rawContent, sections: {} });
    }
    if (customSkillFiles.length > 0) {
      console.log(`  ✓ ${customSkillFiles.length} custom skills loaded from .assemble/skills/`);
    }
  }

  let workflows = loadWorkflows(WORKFLOWS_DIR);
  // Filter workflows if config specifies a subset (not "all")
  if (config.workflows && config.workflows !== 'all') {
    const selectedWfs = Array.isArray(config.workflows)
      ? config.workflows
      : String(config.workflows).split(/[\s,]+/).filter(Boolean);
    if (selectedWfs.length > 0) {
      workflows = workflows.filter(w => {
        const id = (w.fileName || '').replace(/\.(yaml|yml)$/, '');
        return selectedWfs.includes(id);
      });
    }
  }
  console.log(`  ✓ ${workflows.length} workflows loaded`);

  // Load custom workflows from .assemble/workflows/
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
      console.log(`  ✓ ${customWfFiles.length} custom workflows loaded from .assemble/workflows/`);
    }
  }

  const commands = loadCommands(COMMANDS_FILE);
  console.log(`  ✓ Command registry loaded`);

  const orchestrator = loadOrchestrator(ORCHESTRATOR_DIR);
  console.log(`  ✓ Orchestrator loaded`);

  // ─── Schema validation ──────────────────────────────────────────────────
  console.log('🔍 Validating sources...');
  const validation = validateAll({ agents, skills, workflows, config });
  if (validation.warnings.length > 0) {
    for (const w of validation.warnings) {
      console.log(`  ⚠️  ${w}`);
    }
  }
  if (!validation.valid) {
    console.error('❌ Schema validation failed:');
    for (const e of validation.errors) {
      console.error(`  - ${e}`);
    }
    process.exit(1);
  }
  console.log(`  ✓ All sources valid (${agents.length} agents, ${workflows.length} workflows, ${(skills.shared || []).length + (skills.specific || []).length} skills)`);
  console.log('');

  // Prepare agents (language + output injection)
  const preparedAgents = agents.map(a => prepareAgent(a, config));

  // Load adapters (built-in + plugins from .assemble/adapters/)
  const adapters = loadAdapters(projectDir);
  console.log(`  ✓ ${Object.keys(adapters).length} adapters available`);
  console.log('');

  // ─── Clean up old generated files before regeneration ────────────────────
  // Uses manifest-based cleanup: only removes files Assemble previously generated.
  // This prevents destroying user files like .github/workflows/, CODEOWNERS, etc.
  if (args.update) {
    console.log('🧹 Cleaning old generated files...');
    const manifestPath = path.join(projectDir, '.assemble-manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        const removedDirs = new Set();
        // Remove individual files first
        for (const file of (manifest.files || [])) {
          const fullPath = path.join(projectDir, file);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
        // Remove directories that are now empty
        for (const dir of (manifest.directories || [])) {
          const fullPath = path.join(projectDir, dir);
          if (fs.existsSync(fullPath)) {
            try {
              const entries = fs.readdirSync(fullPath);
              if (entries.length === 0) {
                fs.rmdirSync(fullPath);
                removedDirs.add(dir);
              }
            } catch (e) { /* skip */ }
          }
        }
        console.log(`  ✓ ${(manifest.files || []).length} old files cleaned (manifest-based)`);
      } catch (e) {
        console.warn(`  ⚠️  Could not read manifest, falling back to targeted cleanup`);
        // Fallback: only clean Assemble-specific dirs, NEVER .github or user dirs
        const safeDirs = [
          '.cursor/agents', '.cursor/skills', '.cursor/workflows',
          '.windsurf/rules', '.windsurf/workflows',
          '.cline/agents', '.cline/skills', '.cline/workflows',
          '.roo',
          '.kiro/agents', '.kiro/steering',
          '.trae/rules', '.trae/agents', '.trae/skills', '.trae/workflows',
          '.antigravity', '.codebuddy', '.crush', '.iflow',
          '.kilocoder', '.opencode', '.qwencoder', '.rovo',
          '.claude/agents', '.claude/skills', '.claude/rules',
          '.gemini/agents', '.gemini/skills', '.gemini/workflows',
          '.augment/commands',
        ];
        const safeFiles = [
          '.cursorrules', '.windsurfrules', '.clinerules', '.roomodes',
          'CLAUDE.md', 'GEMINI.md', 'SYSTEM.md',
        ];
        // Note: AGENTS.md is NOT in safe list because Codex/Pi share it with user content
        for (const dir of safeDirs) {
          const fullPath = path.join(projectDir, dir);
          if (fs.existsSync(fullPath)) {
            fs.rmSync(fullPath, { recursive: true, force: true });
          }
        }
        for (const file of safeFiles) {
          const fullPath = path.join(projectDir, file);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        console.log('  ✓ Old files removed (targeted fallback)');
      }
    } else {
      console.log('  ℹ No manifest found (first-time update), skipping cleanup');
    }
    console.log('');
  }

  // Generate for each platform
  let successCount = 0;
  let errorCount = 0;

  for (const platformName of config.platforms) {
    const adapter = adapters[platformName];
    if (!adapter) {
      console.warn(`⚠️  Unknown adapter: ${platformName} — skipped`);
      errorCount++;
      continue;
    }

    console.log(`🔧 Generating for ${adapter.displayName || platformName}...`);

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
        console.log(`  ⚠️  ${adapter.displayName || platformName} — generated with warnings:`);
        validation.errors.forEach(e => console.log(`     - ${e}`));
        successCount++;
      }
    } catch (err) {
      console.error(`  ❌ ${adapter.displayName || platformName} — Error: ${err.message}`);
      errorCount++;
    }
  }

  // ─── Create output directory for deliverables ──────────────────────────
  const outputPath = path.resolve(projectDir, config.output_dir);
  fs.mkdirSync(outputPath, { recursive: true });
  fs.writeFileSync(
    path.join(outputPath, '.gitkeep'),
    '# This folder contains deliverables produced by Assemble by Cohesium AI agents\n'
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

  // ─── Write manifest of generated files (for safe cleanup on next update) ──
  {
    const manifestFiles = [];
    const manifestDirs = new Set();
    for (const platformName of config.platforms) {
      const adapter = adapters[platformName];
      if (!adapter || !adapter.getOutputPaths) continue;
      const paths = adapter.getOutputPaths(projectDir, { agents: preparedAgents, skills, workflows, config });
      for (const p of paths) {
        // Normalize to forward slashes for cross-platform manifest consistency
        const rel = path.relative(projectDir, p).replace(/\\/g, '/');
        manifestFiles.push(rel);
        // Track parent directories
        let dir = path.dirname(rel);
        while (dir && dir !== '.') {
          manifestDirs.add(dir);
          dir = path.dirname(dir);
        }
      }
    }
    const manifest = {
      generated_at: new Date().toISOString(),
      generator_version: PKG_VERSION,
      platforms: config.platforms,
      files: manifestFiles,
      directories: [...manifestDirs].sort(),
    };
    fs.writeFileSync(
      path.join(projectDir, '.assemble-manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );
  }

  // Update or create .assemble.yaml
  const assembleConfigPath = path.join(projectDir, '.assemble.yaml');
  const existingConfig = fs.existsSync(assembleConfigPath) ? loadConfig(assembleConfigPath) : {};
  const today = new Date().toISOString().split('T')[0];
  const assembleConfig = `# Assemble — Project configuration
# Update:     npx cohesiumai-assemble --update
# Regenerate: node generate.js --config .assemble.yaml

version: "${PKG_VERSION}"
profile: "${config.profile || 'custom'}"
langue_equipe: "${config.langue_equipe}"
langue_output: "${config.langue_output}"
output_dir: "${config.output_dir}"
platforms: [${config.platforms.join(', ')}]
agents: ${Array.isArray(config.agents) ? config.agents.join(', ') : (config.agents || 'all')}
workflows: ${Array.isArray(config.workflows) ? config.workflows.join(', ') : (config.workflows || 'all')}
governance: "${config.governance || 'none'}"
yolo: ${config.yolo ? 'true' : 'false'}
mcp: ${config.mcp ? 'true' : 'false'}
memory: ${config.memory ? 'true' : 'false'}
metrics: ${config.metrics ? 'true' : 'false'}
search: ${config.search ? 'true' : 'false'}
installed_at: "${existingConfig.installed_at || today}"
updated_at: "${today}"
`;
  fs.writeFileSync(assembleConfigPath, assembleConfig);
  if (args.update) {
    console.log(`\n📄 .assemble.yaml updated (${today})`);
  } else if (!existingConfig.installed_at) {
    console.log(`\n📄 .assemble.yaml created`);
  }

  // Summary
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`✅ Generation complete: ${successCount} platforms OK, ${errorCount} errors`);
  console.log(`📂 Deliverables → ${outputPath}`);
  console.log(`${'═'.repeat(50)}`);

  process.exit(errorCount > 0 ? 1 : 0);
}

// ─── Entry point ────────────────────────────────────────────────────────────

generate();
