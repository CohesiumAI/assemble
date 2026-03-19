#!/usr/bin/env node

/**
 * Assemble — Diff (Dry Run)
 * Shows what files would be created/modified without actually generating.
 * Loads the full config and source data to accurately predict output paths.
 *
 * Usage: npx create-assemble diff [--project <path>]
 *        node bin/diff.js [--project <path>]
 */

const fs = require('fs');
const path = require('path');

function diff(projectDir) {
  // Load config using the generator's own loadConfig
  const configPath = path.join(projectDir, '.assemble.yaml');
  if (!fs.existsSync(configPath)) {
    console.error('❌ No .assemble.yaml found. Run npx create-assemble first.');
    process.exit(1);
  }

  // Reuse the generator's loader and parser for accurate results
  const generatorDir = path.join(__dirname, '..', 'generator');
  const { loadAgents, loadSkills, loadWorkflows } = require(path.join(generatorDir, 'lib', 'parser'));
  const srcDir = path.join(__dirname, '..', 'src');

  // Parse config
  const raw = fs.readFileSync(configPath, 'utf-8');
  const config = {};
  for (const line of raw.split('\n')) {
    const match = line.match(/^(\w[\w_]*):\s*(.+)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (value.startsWith('[')) {
      config[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/["']/g, ''));
    } else {
      config[key] = value.replace(/["']/g, '').trim();
    }
  }

  const platforms = config.platforms || [];
  if (platforms.length === 0) {
    console.error('❌ No platforms in .assemble.yaml');
    process.exit(1);
  }

  // Load real source data
  let agents, skills, workflows;
  try {
    agents = loadAgents(path.join(srcDir, 'agents'));
    skills = loadSkills(path.join(srcDir, 'skills'));
    workflows = loadWorkflows(path.join(srcDir, 'workflows'));
  } catch (e) {
    console.warn(`  ⚠️  Could not load source data: ${e.message}`);
    agents = []; skills = { shared: [], specific: [] }; workflows = [];
  }

  // Load adapters and query output paths with full context
  const adaptersDir = path.join(generatorDir, 'adapters');
  const added = [];
  const modified = [];

  for (const platform of platforms) {
    let adapter;
    for (const subdir of ['ide', 'cli']) {
      const adapterPath = path.join(adaptersDir, subdir, `${platform}.js`);
      if (fs.existsSync(adapterPath)) {
        try { adapter = require(adapterPath); } catch (e) { console.warn(`  ⚠️  Could not load adapter ${platform}: ${e.message}`); }
        break;
      }
    }
    if (!adapter || !adapter.getOutputPaths) continue;

    // Pass real data so adapters can enumerate all output paths
    const paths = adapter.getOutputPaths(projectDir, { agents, skills, workflows, config });
    for (const p of paths) {
      const rel = path.relative(projectDir, p);
      if (fs.existsSync(p)) {
        modified.push(`[${platform}] ${rel}`);
      } else {
        added.push(`[${platform}] ${rel}`);
      }
    }
  }

  // Also check cross-platform files
  const crossPlatform = [
    [config.output_dir || './assemble-output', 'AGENTS.md'],
  ];
  if (config.mcp === 'true') {
    crossPlatform.push(['.assemble', 'mcp-server.js'], ['.assemble', 'mcp.json'], ['.assemble', 'mcp-package.json']);
  }
  if (config.memory === 'true') {
    crossPlatform.push([config.output_dir || './assemble-output', '_memory.md']);
  }
  if (config.metrics === 'true') {
    crossPlatform.push([config.output_dir || './assemble-output', '_metrics.md']);
  }
  for (const parts of crossPlatform) {
    const p = path.join(projectDir, ...parts);
    const rel = path.relative(projectDir, p);
    if (fs.existsSync(p)) {
      modified.push(`[cross-platform] ${rel}`);
    } else {
      added.push(`[cross-platform] ${rel}`);
    }
  }

  // Report
  console.log('');
  console.log('📋 Assemble Diff (dry run)\n');

  if (added.length > 0) {
    console.log(`  ➕ New files (${added.length}):`);
    added.forEach(f => console.log(`     ${f}`));
  }

  if (modified.length > 0) {
    console.log(`  ✏️  Modified files (${modified.length}):`);
    modified.forEach(f => console.log(`     ${f}`));
  }

  if (added.length === 0 && modified.length === 0) {
    console.log('  ✅ No changes detected');
  }

  console.log('');
}

// Parse args
const args = process.argv.slice(2);
let projectDir = process.cwd();
const projIdx = args.indexOf('--project');
if (projIdx >= 0 && args[projIdx + 1]) {
  projectDir = path.resolve(args[projIdx + 1]);
}

diff(projectDir);
