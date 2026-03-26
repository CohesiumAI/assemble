#!/usr/bin/env node

/**
 * Assemble — List
 * Lists active agents, workflows, and skills from current configuration.
 *
 * Usage: npx cohesiumai-assemble ls [--project <path>]
 *        node bin/ls.js [--project <path>]
 */

const fs = require('fs');
const path = require('path');

function ls(projectDir) {
  const configPath = path.join(projectDir, '.assemble.yaml');
  if (!fs.existsSync(configPath)) {
    console.error('❌ No .assemble.yaml found. Run npx cohesiumai-assemble first.');
    process.exit(1);
  }

  // Use shared config loader with inline fallback
  let config;
  try {
    const { loadConfig } = require(path.join(__dirname, '..', 'generator', 'lib', 'config-loader'));
    config = loadConfig(configPath);
  } catch {
    // Fallback: minimal line-based parser
    const content = fs.readFileSync(configPath, 'utf-8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    config = {};
    for (const line of content.split('\n')) {
      if (line.startsWith('#') || !line.includes(':')) continue;
      const idx = line.indexOf(':');
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/["']/g, '');
      if (val.startsWith('[')) {
        config[key] = val.slice(1, -1).split(',').map(v => v.trim());
      } else {
        config[key] = val;
      }
    }
  }

  const platforms = config.platforms || [];
  const agents = config.agents || 'all';
  const workflows = config.workflows || 'all';
  const governance = config.governance || 'none';
  const profile = config.profile || 'custom';

  console.log('');
  console.log('📦 Assemble — Active Configuration\n');
  console.log(`  Profile:    ${profile}`);
  console.log(`  Platforms:  ${Array.isArray(platforms) ? platforms.join(', ') : platforms}`);
  console.log(`  Agents:     ${agents}`);
  console.log(`  Workflows:  ${workflows}`);
  console.log(`  Governance: ${governance}`);

  // Custom agents
  const customAgentsDir = path.join(projectDir, '.assemble', 'agents');
  if (fs.existsSync(customAgentsDir)) {
    const files = fs.readdirSync(customAgentsDir).filter(f => f.endsWith('.md'));
    if (files.length > 0) {
      console.log(`\n  Custom agents (${files.length}):`);
      files.forEach(f => console.log(`    - ${f}`));
    }
  }

  // Custom skills
  const customSkillsDir = path.join(projectDir, '.assemble', 'skills');
  if (fs.existsSync(customSkillsDir)) {
    const files = fs.readdirSync(customSkillsDir).filter(f => f.endsWith('.md'));
    if (files.length > 0) {
      console.log(`\n  Imported skills (${files.length}):`);
      files.forEach(f => console.log(`    - ${f}`));
    }
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

ls(projectDir);
