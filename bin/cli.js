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
  print('\n\x1b[1m\x1b[34m▸ 1/6 — Team language\x1b[0m\n');
  const langTeam = await ask('Team language (français, english, deutsch...)', 'français');

  // 2. Output language
  print('\n\x1b[1m\x1b[34m▸ 2/6 — Deliverable language\x1b[0m\n');
  const langOutput = await ask('Deliverable language', langTeam);

  // 3. Platforms
  print('\n\x1b[1m\x1b[34m▸ 3/6 — IDE/CLI selection\x1b[0m\n');
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

  // 4. Directory
  print('\n\x1b[1m\x1b[34m▸ 4/6 — Project directory\x1b[0m\n');
  const projectDir = path.resolve(await ask('Project directory', '.'));

  // 5. Output
  print('\n\x1b[1m\x1b[34m▸ 5/6 — Output directory\x1b[0m\n');
  const outputDir = await ask('Deliverable output directory', './assemble-output');

  // 6. Confirmation
  print('\n\x1b[1m\x1b[34m▸ 6/6 — Confirmation\x1b[0m\n');
  print(`  Team language  : \x1b[1m${langTeam}\x1b[0m`);
  print(`  Output language: \x1b[1m${langOutput}\x1b[0m`);
  print(`  Platforms      : \x1b[1m${selectedPlatforms.join(', ')}\x1b[0m`);
  print(`  Project        : \x1b[1m${projectDir}\x1b[0m`);
  print(`  Output         : \x1b[1m${outputDir}\x1b[0m`);
  print('');

  const confirm = await ask('Start installation?', 'Y');
  if (!['y', 'o'].includes(confirm.toLowerCase())) {
    print('Installation cancelled.');
    rl.close();
    process.exit(0);
  }

  // Generation
  print('\n\x1b[1m\x1b[34m▸ Generating...\x1b[0m\n');

  const generatorPath = path.join(__dirname, '..', 'generator', 'generate.js');

  try {
    execFileSync(process.execPath, [
      generatorPath,
      '--project', projectDir,
      '--platforms', selectedPlatforms.join(','),
      '--lang-team', langTeam,
      '--lang-output', langOutput,
      '--output-dir', outputDir
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
