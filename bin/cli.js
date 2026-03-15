#!/usr/bin/env node

/**
 * Cohesium AI — CLI Installer (npx create-cohesium-agents)
 * Interactive installer for the Agent Workflow System
 */

const readline = require('readline');
const path = require('path');
const { execSync } = require('child_process');

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

async function main() {
  print('');
  print('\x1b[36m═══════════════════════════════════════════════════════\x1b[0m');
  print('\x1b[1m\x1b[34m   🦸 Cohesium AI — Agent Workflow System\x1b[0m');
  print('\x1b[36m   Installation et configuration (npx)\x1b[0m');
  print('\x1b[36m═══════════════════════════════════════════════════════\x1b[0m');
  print('');

  // 1. Langue équipe
  print('\n\x1b[1m\x1b[34m▸ 1/6 — Langue de l\'équipe\x1b[0m\n');
  const langTeam = await ask('Langue de l\'équipe (français, english, deutsch...)', 'français');

  // 2. Langue output
  print('\n\x1b[1m\x1b[34m▸ 2/6 — Langue des livrables\x1b[0m\n');
  const langOutput = await ask('Langue des livrables', langTeam);

  // 3. Plateformes
  print('\n\x1b[1m\x1b[34m▸ 3/6 — Sélection des IDE/CLI\x1b[0m\n');
  print('  IDE :');
  PLATFORMS.ide.forEach(([, name], i) => print(`  ${String(i + 1).padStart(2)}) ${name}`));
  print('\n  CLI :');
  PLATFORMS.cli.forEach(([, name], i) => print(`  ${String(i + PLATFORMS.ide.length + 1).padStart(2)}) ${name}`));
  print('\n   0) Tout sélectionner\n');

  const platformChoice = await ask('Votre choix (numéros séparés par des espaces)', '0');
  let selectedPlatforms;
  if (platformChoice === '0') {
    selectedPlatforms = ALL_PLATFORMS.map(p => p[0]);
  } else {
    selectedPlatforms = platformChoice.split(/\s+/).map(n => {
      const idx = parseInt(n) - 1;
      return idx >= 0 && idx < ALL_PLATFORMS.length ? ALL_PLATFORMS[idx][0] : null;
    }).filter(Boolean);
  }
  print(`\x1b[32m  ✓ ${selectedPlatforms.length} plateformes sélectionnées\x1b[0m`);

  // 4. Répertoire
  print('\n\x1b[1m\x1b[34m▸ 4/6 — Répertoire du projet\x1b[0m\n');
  const projectDir = path.resolve(await ask('Répertoire du projet', '.'));

  // 5. Output
  print('\n\x1b[1m\x1b[34m▸ 5/6 — Répertoire de sortie\x1b[0m\n');
  const outputDir = await ask('Répertoire de sortie des livrables', './cohesium-output');

  // 6. Confirmation
  print('\n\x1b[1m\x1b[34m▸ 6/6 — Confirmation\x1b[0m\n');
  print(`  Langue équipe  : \x1b[1m${langTeam}\x1b[0m`);
  print(`  Langue output  : \x1b[1m${langOutput}\x1b[0m`);
  print(`  Plateformes    : \x1b[1m${selectedPlatforms.join(', ')}\x1b[0m`);
  print(`  Projet         : \x1b[1m${projectDir}\x1b[0m`);
  print(`  Output         : \x1b[1m${outputDir}\x1b[0m`);
  print('');

  const confirm = await ask('Lancer l\'installation ?', 'O');
  if (!['o', 'y'].includes(confirm.toLowerCase())) {
    print('Installation annulée.');
    rl.close();
    process.exit(0);
  }

  // Génération
  print('\n\x1b[1m\x1b[34m▸ Génération en cours...\x1b[0m\n');

  const generatorPath = path.join(__dirname, '..', 'generator', 'generate.js');
  const cmd = [
    'node', generatorPath,
    '--project', projectDir,
    '--platforms', selectedPlatforms.join(','),
    '--lang-team', langTeam,
    '--lang-output', langOutput,
    '--output-dir', outputDir
  ].join(' ');

  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    print('\x1b[31m  ✗ Erreur lors de la génération\x1b[0m');
    rl.close();
    process.exit(1);
  }

  print('');
  print('\x1b[36m═══════════════════════════════════════════════════════\x1b[0m');
  print('\x1b[32m\x1b[1m   ✅ Installation terminée !\x1b[0m');
  print('\x1b[36m═══════════════════════════════════════════════════════\x1b[0m');
  print('');

  rl.close();
}

main().catch(err => {
  console.error(err);
  rl.close();
  process.exit(1);
});
