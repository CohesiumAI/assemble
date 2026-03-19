#!/usr/bin/env node

/**
 * Assemble — Diff (Dry Run)
 * Shows what files would be created/modified without actually generating.
 *
 * Usage: assemble diff [--project <path>]
 *        node bin/diff.js [--project <path>]
 */

const fs = require('fs');
const path = require('path');

function diff(projectDir) {
  // Load config
  const configPath = path.join(projectDir, '.assemble.yaml');
  if (!fs.existsSync(configPath)) {
    console.error('❌ No .assemble.yaml found. Run npx create-assemble first.');
    process.exit(1);
  }

  // Parse minimal config to get platforms
  const content = fs.readFileSync(configPath, 'utf-8');
  const platformMatch = content.match(/platforms:\s*\[([^\]]+)\]/);
  if (!platformMatch) {
    console.error('❌ Could not parse platforms from .assemble.yaml');
    process.exit(1);
  }

  const platforms = platformMatch[1].split(',').map(p => p.trim().replace(/["']/g, ''));

  // Load adapters to get expected output paths
  const adaptersDir = path.join(__dirname, '..', 'generator', 'adapters');
  const added = [];
  const modified = [];

  for (const platform of platforms) {
    // Find adapter
    let adapter;
    for (const subdir of ['ide', 'cli']) {
      const adapterPath = path.join(adaptersDir, subdir, `${platform}.js`);
      if (fs.existsSync(adapterPath)) {
        try { adapter = require(adapterPath); } catch (e) { console.warn(`  ⚠️  Could not load adapter ${platform}: ${e.message}`); }
        break;
      }
    }
    if (!adapter || !adapter.getOutputPaths) continue;

    const paths = adapter.getOutputPaths(projectDir, {});
    for (const p of paths) {
      const rel = path.relative(projectDir, p);
      if (fs.existsSync(p)) {
        modified.push(rel);
      } else {
        added.push(rel);
      }
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
