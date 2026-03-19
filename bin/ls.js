#!/usr/bin/env node

/**
 * Assemble — List
 * Lists active agents, workflows, and skills from current configuration.
 *
 * Usage: npx create-assemble ls [--project <path>]
 *        node bin/ls.js [--project <path>]
 */

const fs = require('fs');
const path = require('path');

function ls(projectDir) {
  const configPath = path.join(projectDir, '.assemble.yaml');
  if (!fs.existsSync(configPath)) {
    console.error('❌ No .assemble.yaml found. Run npx create-assemble first.');
    process.exit(1);
  }

  const content = fs.readFileSync(configPath, 'utf-8');

  // Parse config fields (uses string search to avoid regex injection)
  const parse = (key) => {
    for (const line of content.split('\n')) {
      if (line.startsWith(key + ':')) {
        const val = line.slice(key.length + 1).trim().replace(/["']/g, '');
        if (val.startsWith('[')) return val.slice(1, -1).split(',').map(v => v.trim());
        return val;
      }
    }
    return null;
  };

  const platforms = parse('platforms') || [];
  const agents = parse('agents') || 'all';
  const workflows = parse('workflows') || 'all';
  const governance = parse('governance') || 'none';
  const profile = parse('profile') || 'custom';

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
