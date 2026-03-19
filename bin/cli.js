#!/usr/bin/env node

/**
 * Assemble — CLI Installer (npx create-assemble)
 * Interactive installer for the Agent Workflow System
 */

const readline = require('readline');
const path = require('path');
const { execFileSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const PLATFORMS = {
  ide: [
    ['cursor', 'Cursor'],
    ['windsurf', 'Windsurf'],
    ['cline', 'Cline'],
    ['roocode', 'Roo Code'],
    ['copilot', 'GitHub Copilot'],
    ['kiro', 'Kiro'],
    ['trae', 'Trae'],
    ['antigravity', 'Google Antigravity'],
    ['codebuddy', 'CodeBuddy'],
    ['crush', 'Crush'],
    ['iflow', 'iFlow'],
    ['kilocoder', 'KiloCoder'],
    ['opencode', 'OpenCode'],
    ['qwencoder', 'QwenCoder'],
    ['rovodev', 'Rovo Dev'],
  ],
  cli: [
    ['claude-code', 'Claude Code'],
    ['codex', 'Codex'],
    ['gemini-cli', 'Gemini CLI'],
    ['auggie', 'Auggie'],
    ['pi', 'Pi'],
  ]
};

const ALL_PLATFORMS = [...PLATFORMS.ide, ...PLATFORMS.cli];

function ask(question, defaultVal = '') {
  const suffix = defaultVal ? ` [${defaultVal}]` : '';
  return new Promise(resolve => {
    rl.question(`${question}${suffix} : `, answer => {
      resolve(answer.trim() || defaultVal);
    });
  });
}

function print(msg) {
  console.log(msg);
}

async function runUpdate(projectDir) {
  const fs = require('fs');
  const configPath = path.join(projectDir, '.assemble.yaml');
  const legacyPath = path.join(projectDir, '.cohesium.yaml');

  // Migration: rename old .cohesium.yaml → .assemble.yaml
  if (!fs.existsSync(configPath) && fs.existsSync(legacyPath)) {
    print('\x1b[33m  🔄 Migrating .cohesium.yaml → .assemble.yaml\x1b[0m');
    let content = fs.readFileSync(legacyPath, 'utf-8');
    content = content
      .replace(/cohesium-output/g, 'assemble-output')
      .replace(/Cohesium AI/g, 'Assemble')
      .replace(/cohesium\.yaml/g, 'assemble.yaml');
    fs.writeFileSync(configPath, content, 'utf-8');
    fs.unlinkSync(legacyPath);
    print('\x1b[32m  ✓ Config migrated\x1b[0m');
  }

  if (!fs.existsSync(configPath)) {
    print('\x1b[31m  ✗ No installation found (.assemble.yaml missing)\x1b[0m');
    rl.close();
    process.exit(1);
  }

  print('\n\x1b[1m🔄 Updating...\x1b[0m\n');
  print('Preserved preferences from .assemble.yaml:');

  const content = fs.readFileSync(configPath, 'utf-8');
  for (const line of content.split('\n')) {
    for (const key of ['langue_equipe', 'langue_output', 'platforms', 'output_dir', 'installed_at']) {
      if (line.startsWith(`${key}:`)) {
        print(`\x1b[32m  ${line.trim()}\x1b[0m`);
      }
    }
  }
  print('');

  const confirm = await ask('Confirm update?', 'Y');
  if (!['y', 'o'].includes(confirm.toLowerCase())) {
    print('Update cancelled.');
    rl.close();
    process.exit(0);
  }

  print('\n\x1b[1m\x1b[34m▸ Regenerating...\x1b[0m\n');

  const generatorPath = path.join(__dirname, '..', 'generator', 'generate.js');
  try {
    execFileSync(process.execPath, [generatorPath, '--update', '--project', projectDir], { stdio: 'inherit' });
  } catch (err) {
    print('\x1b[31m  ✗ Error during update\x1b[0m');
    rl.close();
    process.exit(1);
  }

  print('');
  print('\x1b[36m═══════════════════════════════════════════════════════\x1b[0m');
  print('\x1b[32m\x1b[1m   ✅ Update complete!\x1b[0m');
  print('\x1b[36m═══════════════════════════════════════════════════════\x1b[0m');
  print('');
  print('Your preferences have been preserved.');
  print('Configuration files have been regenerated with the latest version.');
  print('');
  rl.close();
}

async function main() {
  const fs = require('fs');

  // ─── Subcommand routing (before --update check to avoid conflicts) ───────
  const subcommand = process.argv[2];
  if (subcommand && !subcommand.startsWith('-')) {
    if (subcommand === 'doctor') {
      require('./doctor.js');
      return;
    }
    if (subcommand === 'diff') {
      require('./diff.js');
      return;
    }
    if (subcommand === 'ls') {
      require('./ls.js');
      return;
    }
    if (subcommand === 'import') {
      const importPath = process.argv[3];
      if (!importPath) {
        print('Usage: npx create-assemble import <path-to-skill.md>');
        rl.close();
        process.exit(0);
      }
      const { importSkill } = require('./import.js');
      importSkill(importPath);
      rl.close();
      return;
    }
  }

  print('');
  print('\x1b[36m═══════════════════════════════════════════════════════\x1b[0m');
  print('\x1b[1m\x1b[34m   🦸 Assemble — AI Agent Orchestrator\x1b[0m');
  print('\x1b[36m   Installation & Configuration (npx)\x1b[0m');
  print('\x1b[36m═══════════════════════════════════════════════════════\x1b[0m');
  print('');

  // Detect --update flag or existing installation
  if (process.argv.includes('--update') || process.argv.includes('-u')) {
    const projIdx = process.argv.indexOf('--project');
    const dir = projIdx >= 0 ? path.resolve(process.argv[projIdx + 1]) : path.resolve('.');
    await runUpdate(dir);
    return;
  }

  if (fs.existsSync('.assemble.yaml') || fs.existsSync('.cohesium.yaml')) {
    print('📄 Existing installation detected\n');
    print('  1) Update (keeps your preferences)');
    print('  2) New installation\n');
    const choice = await ask('Your choice', '1');
    if (choice === '1') {
      await runUpdate(path.resolve('.'));
      return;
    }
  }

  // 1. Team language
  print('\n\x1b[1m\x1b[34m▸ 1/11 — Team language\x1b[0m\n');
  const langTeam = await ask('Team language (français, english, deutsch...)', 'français');

  // 2. Output language
  print('\n\x1b[1m\x1b[34m▸ 2/11 — Deliverable language\x1b[0m\n');
  const langOutput = await ask('Deliverable language', langTeam);

  // 3. Profile
  print('\n\x1b[1m\x1b[34m▸ 3/11 — Team profile\x1b[0m\n');
  print('  1) startup   — Lean team, ship fast');
  print('  2) enterprise — Full team with strict governance');
  print('  3) agency     — Marketing & content focus');
  print('  4) custom     — Choose everything manually\n');
  const profileChoice = await ask('Profile', '4');
  const profileMap = { '1': 'startup', '2': 'enterprise', '3': 'agency', '4': 'custom' };
  const profile = profileMap[profileChoice] || 'custom';

  // 4. Platforms
  print('\n\x1b[1m\x1b[34m▸ 4/11 — IDE/CLI selection\x1b[0m\n');
  print('  IDE:');
  PLATFORMS.ide.forEach(([, name], i) => print(`  ${String(i + 1).padStart(2)}) ${name}`));
  print('\n  CLI:');
  PLATFORMS.cli.forEach(([, name], i) => print(`  ${String(i + PLATFORMS.ide.length + 1).padStart(2)}) ${name}`));
  print('\n   0) Select all\n');

  const platformChoice = await ask('Your choice (space-separated numbers)', '0');
  let selectedPlatforms;
  if (platformChoice === '0') {
    selectedPlatforms = ALL_PLATFORMS.map(p => p[0]);
  } else {
    selectedPlatforms = platformChoice.split(/\s+/).map(n => {
      const idx = parseInt(n) - 1;
      return idx >= 0 && idx < ALL_PLATFORMS.length ? ALL_PLATFORMS[idx][0] : null;
    }).filter(Boolean);
  }
  print(`\x1b[32m  ✓ ${selectedPlatforms.length} platforms selected\x1b[0m`);

  // 5. Directory
  print('\n\x1b[1m\x1b[34m▸ 5/11 — Project directory\x1b[0m\n');
  const projectDir = path.resolve(await ask('Project directory', '.'));

  // 6. Output
  print('\n\x1b[1m\x1b[34m▸ 6/11 — Output directory\x1b[0m\n');
  const outputDir = await ask('Deliverable output directory', './assemble-output');

  // 7. MCP Server
  print('\n\x1b[1m\x1b[34m▸ 7/11 — MCP server\x1b[0m\n');
  const mcpChoice = await ask('Enable MCP server? (y/n)', 'n');
  const mcp = ['y', 'o'].includes(mcpChoice.toLowerCase());

  // 8. Governance
  print('\n\x1b[1m\x1b[34m▸ 8/11 — Governance level\x1b[0m\n');
  print('  1) none     — No governance overhead (default)');
  print('  2) standard — Decision gates + risk assessment');
  print('  3) strict   — Full audit trail + RBAC + NIST mapping\n');
  const govDefault = profile === 'enterprise' ? '3' : '1';
  const govChoice = await ask('Governance', govDefault);
  const govMap = { '1': 'none', '2': 'standard', '3': 'strict' };
  const governance = govMap[govChoice] || 'none';

  // 9. Cross-session memory
  print('\n\x1b[1m\x1b[34m▸ 9/11 — Cross-session memory\x1b[0m\n');
  const memoryChoice = await ask('Enable cross-session memory? (y/n)', 'n');
  const memory = ['y', 'o'].includes(memoryChoice.toLowerCase());

  // 10. Metrics
  print('\n\x1b[1m\x1b[34m▸ 10/11 — Workflow metrics\x1b[0m\n');
  const metricsChoice = await ask('Enable workflow metrics? (y/n)', 'n');
  const metrics = ['y', 'o'].includes(metricsChoice.toLowerCase());

  // 11. Confirmation
  print('\n\x1b[1m\x1b[34m▸ 11/11 — Confirmation\x1b[0m\n');
  print(`  Profile        : \x1b[1m${profile}\x1b[0m`);
  print(`  Team language  : \x1b[1m${langTeam}\x1b[0m`);
  print(`  Output language: \x1b[1m${langOutput}\x1b[0m`);
  print(`  Platforms      : \x1b[1m${selectedPlatforms.join(', ')}\x1b[0m`);
  print(`  Project        : \x1b[1m${projectDir}\x1b[0m`);
  print(`  Output         : \x1b[1m${outputDir}\x1b[0m`);
  print(`  MCP server     : \x1b[1m${mcp ? 'yes' : 'no'}\x1b[0m`);
  print(`  Governance     : \x1b[1m${governance}\x1b[0m`);
  print(`  Memory         : \x1b[1m${memory ? 'yes' : 'no'}\x1b[0m`);
  print(`  Metrics        : \x1b[1m${metrics ? 'yes' : 'no'}\x1b[0m`);
  print('');

  const confirm = await ask('Start installation?', 'Y');
  if (!['y', 'o'].includes(confirm.toLowerCase())) {
    print('Installation cancelled.');
    rl.close();
    process.exit(0);
  }

  // Write .assemble.yaml with all wizard choices, then generate via --update
  print('\n\x1b[1m\x1b[34m▸ Generating...\x1b[0m\n');

  const today = new Date().toISOString().split('T')[0];
  // When a profile is selected (not custom), omit agents/workflows/governance
  // so that resolveProfile() in the generator applies the profile defaults.
  // When custom, write explicit values so the user has full control.
  const lines = [
    '# Assemble — Configuration du projet',
    '# Mettre à jour : npx create-assemble --update',
    '',
    'version: "1.0.0"',
    `profile: "${profile}"`,
    `langue_equipe: "${langTeam}"`,
    `langue_output: "${langOutput}"`,
    `output_dir: "${outputDir}"`,
    `platforms: [${selectedPlatforms.join(', ')}]`,
  ];
  if (profile === 'custom') {
    lines.push('agents: all');
    lines.push('workflows: all');
    lines.push(`governance: "${governance}"`);
  }
  // If a non-custom profile is selected but governance was explicitly changed, write it
  if (profile !== 'custom' && governance !== 'none') {
    lines.push(`governance: "${governance}"`);
  }
  lines.push(`mcp: ${mcp ? 'true' : 'false'}`);
  lines.push(`memory: ${memory ? 'true' : 'false'}`);
  lines.push(`metrics: ${metrics ? 'true' : 'false'}`);
  lines.push(`installed_at: "${today}"`);
  lines.push(`updated_at: "${today}"`);
  lines.push('');
  const configContent = lines.join('\n');
  fs.writeFileSync(path.join(projectDir, '.assemble.yaml'), configContent, 'utf-8');

  const generatorPath = path.join(__dirname, '..', 'generator', 'generate.js');

  try {
    execFileSync(process.execPath, [
      generatorPath,
      '--update',
      '--project', projectDir,
    ], { stdio: 'inherit' });
  } catch (err) {
    print('\x1b[31m  ✗ Error during generation\x1b[0m');
    rl.close();
    process.exit(1);
  }

  print('');
  print('\x1b[36m═══════════════════════════════════════════════════════\x1b[0m');
  print('\x1b[32m\x1b[1m   ✅ Installation complete!\x1b[0m');
  print('\x1b[36m═══════════════════════════════════════════════════════\x1b[0m');
  print('');
  print('To update: npx create-assemble --update');
  print('');

  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});
