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
    ['claude-code-desktop', 'Claude Code (Desktop/VS Code)'],
  ],
  cli: [
    ['claude-code', 'Claude Code (CLI)'],
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

/**
 * Interactive multi-select: arrow keys to navigate, space to toggle, enter to confirm.
 * Selected items are highlighted in green. Returns array of selected [id, name] pairs.
 * @param {Array} items - Array of [id, displayName] pairs
 * @param {string} groupLabel - Optional group separator labels (object { index: label })
 * @param {Set} preselected - Indices to preselect
 */
/**
 * Interactive multi-select with improved UX:
 * - Arrow keys to navigate, Space to toggle (green = selected)
 * - A = select all, N = select none, Enter = confirm
 * - Shows selected count in real-time
 * - Rejects empty selection (shows warning, stays in selector)
 */
function multiSelect(items, groupLabels = {}, preselected = new Set()) {
  return new Promise((resolve) => {
    const selected = new Set(preselected);
    let cursor = 0;
    let warning = '';

    function render() {
      const totalLines = items.length + Object.keys(groupLabels).length + 3;
      process.stdout.write(`\x1b[${totalLines}A`);

      for (let i = 0; i < items.length; i++) {
        if (groupLabels[i] !== undefined) {
          process.stdout.write(`\x1b[2K  \x1b[1;4m${groupLabels[i]}\x1b[0m\n`);
        }
        const isSelected = selected.has(i);
        const isCursor = cursor === i;
        const check = isSelected ? '\x1b[32m✔\x1b[0m' : '\x1b[2m○\x1b[0m';
        const name = isSelected ? `\x1b[32;1m${items[i][1]}\x1b[0m` : items[i][1];
        const pointer = isCursor ? '\x1b[36m❯\x1b[0m ' : '  ';
        process.stdout.write(`\x1b[2K  ${pointer}${check} ${name}\n`);
      }
      const count = selected.size;
      const countText = count === 0 ? '\x1b[33m0 selected\x1b[0m' : `\x1b[32m${count} selected\x1b[0m`;
      process.stdout.write(`\x1b[2K\n`);
      process.stdout.write(`\x1b[2K  ${countText}  \x1b[2m│  ↑↓=move  Space=toggle  A=all  N=none  Enter=confirm\x1b[0m\n`);
      if (warning) {
        process.stdout.write(`\x1b[2K  \x1b[33m⚠  ${warning}\x1b[0m`);
      } else {
        process.stdout.write(`\x1b[2K`);
      }
    }

    // Print initial blank lines
    for (let i = 0; i < items.length; i++) {
      if (groupLabels[i] !== undefined) process.stdout.write('\n');
      process.stdout.write('\n');
    }
    process.stdout.write('\n\n\n');
    render();

    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();

    function onKeypress(chunk) {
      const key = chunk.toString();
      warning = '';

      if (key === '\x1b[A') {
        cursor = (cursor - 1 + items.length) % items.length;
        render();
      } else if (key === '\x1b[B') {
        cursor = (cursor + 1) % items.length;
        render();
      } else if (key === ' ') {
        if (selected.has(cursor)) selected.delete(cursor);
        else selected.add(cursor);
        render();
      } else if (key === 'a' || key === 'A') {
        for (let i = 0; i < items.length; i++) selected.add(i);
        render();
      } else if (key === 'n' || key === 'N') {
        selected.clear();
        render();
      } else if (key === '\r' || key === '\n') {
        if (selected.size === 0) {
          warning = 'Select at least one platform to continue';
          render();
          return;
        }
        stdin.setRawMode(false);
        stdin.removeListener('data', onKeypress);
        process.stdout.write('\n');
        const result = [...selected].sort((a, b) => a - b).map(i => items[i]);
        resolve(result);
      } else if (key === '\x03') {
        stdin.setRawMode(false);
        process.exit(0);
      }
    }

    stdin.on('data', onKeypress);
  });
}

function printLogo() {
  const P  = "\x1b[34m";
  const C  = "\x1b[36m";
  const M  = "\x1b[35m";
  const CB = "\x1b[1;36m";
  const R  = "\x1b[0m";
  const D  = "\x1b[2m";
  print("");
  print(P + "           " + C + "\u00b7  " + P + "\u00b7" + R);
  print(P + "         " + C + "\u00b7" + P + "      " + C + "\u00b7" + R);
  print(P + "        \u256d\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256e" + R);
  print(P + "    " + M + "\u00b7" + P + "   \u2502    " + CB + "/\\" + R + P + "    \u2502   " + M + "\u00b7" + R);
  print(P + "        \u2502   " + CB + "/  \\" + R + P + "   \u2502" + R);
  print(P + "    " + M + "\u00b7" + P + "   \u2502  " + CB + "/\u2500\u2500\u2500\u2500\\" + R + P + "  \u2502   " + M + "\u00b7" + R);
  print(P + "        \u2502 " + CB + "/      \\" + R + P + " \u2502" + R);
  print(P + "        \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256f" + R);
  print(P + "         " + C + "\u00b7" + P + "      " + C + "\u00b7" + R);
  print("");
  print(CB + "    Assemble" + R + " " + D + "by Cohesium AI" + R);
  print(D + "    Your 34-agent AI team" + R);
  print("");
}

async function runUpdate(projectDir) {
  const fs = require('fs');
  printLogo();
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

  printLogo();

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
  print('\n\x1b[1m\x1b[34m▸ 1/12 — Team language\x1b[0m\n');
  const langTeam = await ask('Team language (english, français, deutsch...)', 'english');

  // 2. Output language
  print('\n\x1b[1m\x1b[34m▸ 2/12 — Deliverable language\x1b[0m\n');
  const langOutput = await ask('Deliverable language', langTeam);

  // 3. Profile
  print('\n\x1b[1m\x1b[34m▸ 3/12 — Team profile\x1b[0m\n');
  print('  1) startup   — Lean team, ship fast');
  print('  2) enterprise — Full team with strict governance');
  print('  3) agency     — Marketing & content focus');
  print('  4) custom     — Choose everything manually\n');
  const profileChoice = await ask('Profile', '4');
  const profileMap = { '1': 'startup', '2': 'enterprise', '3': 'agency', '4': 'custom' };
  const profile = profileMap[profileChoice] || 'custom';

  // 4. Platforms (interactive multi-select or fallback for non-TTY)
  let selectedPlatforms;
  let platformSelections;

  async function selectPlatforms() {
    print('\n\x1b[1m\x1b[34m▸ 4/12 — IDE/CLI selection\x1b[0m\n');

    if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
      rl.pause();
      const groupLabels = { 0: 'IDE (16):', [PLATFORMS.ide.length]: 'CLI (5):' };
      // Start with nothing selected — user must actively choose
      platformSelections = await multiSelect(ALL_PLATFORMS, groupLabels, new Set());
      selectedPlatforms = platformSelections.map(p => p[0]);
      rl.resume();
    } else {
      // Fallback for non-TTY
      print('  IDE:');
      PLATFORMS.ide.forEach(([, name], i) => print(`  ${String(i + 1).padStart(2)}) ${name}`));
      print('\n  CLI:');
      PLATFORMS.cli.forEach(([, name], i) => print(`  ${String(i + PLATFORMS.ide.length + 1).padStart(2)}) ${name}`));
      print('\n   0) Select all\n');

      const platformChoice = await ask('Your choice (space-separated numbers)');
      if (platformChoice === '0') {
        selectedPlatforms = ALL_PLATFORMS.map(p => p[0]);
        platformSelections = ALL_PLATFORMS;
      } else {
        platformSelections = platformChoice.split(/\s+/).map(n => {
          const idx = parseInt(n) - 1;
          return idx >= 0 && idx < ALL_PLATFORMS.length ? ALL_PLATFORMS[idx] : null;
        }).filter(Boolean);
        selectedPlatforms = platformSelections.map(p => p[0]);
      }
      if (selectedPlatforms.length === 0) {
        print('\x1b[33m  ⚠  No valid selection. Please try again.\x1b[0m');
        return selectPlatforms();
      }
    }

    print(`\x1b[32m  ✓ ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''} selected: ${platformSelections.map(p => p[1]).join(', ')}\x1b[0m`);
  }

  await selectPlatforms();

  // 5. Directory
  print('\n\x1b[1m\x1b[34m▸ 5/12 — Project directory\x1b[0m\n');
  const projectDir = path.resolve(await ask('Project directory', '.'));

  // 6. Output
  print('\n\x1b[1m\x1b[34m▸ 6/12 — Output directory\x1b[0m\n');
  const outputDir = await ask('Deliverable output directory', './assemble-output');

  // 7. MCP Server
  print('\n\x1b[1m\x1b[34m▸ 7/12 — MCP server\x1b[0m\n');
  const mcpChoice = await ask('Enable MCP server? (y/n)', 'n');
  const mcp = ['y', 'o'].includes(mcpChoice.toLowerCase());

  // 8. Governance
  print('\n\x1b[1m\x1b[34m▸ 8/12 — Governance level\x1b[0m\n');
  print('  1) none     — No governance overhead (default)');
  print('  2) standard — Decision gates + risk assessment');
  print('  3) strict   — Full audit trail + RBAC + NIST mapping\n');
  const govDefault = profile === 'enterprise' ? '3' : '1';
  const govChoice = await ask('Governance', govDefault);
  const govMap = { '1': 'none', '2': 'standard', '3': 'strict' };
  const governance = govMap[govChoice] || 'none';

  // 9. YOLO mode
  print('\n\x1b[1m\x1b[34m▸ 9/12 — YOLO mode (autonomous execution)\x1b[0m\n');
  print('  When enabled, Jarvis executes workflows end-to-end without pausing.');
  print('  Stops only for: destructive prod actions, missing info, external side effects.\n');
  const yoloChoice = await ask('Enable YOLO mode? (y/n)', 'n');
  const yolo = ['y', 'o'].includes(yoloChoice.toLowerCase());

  // 10. Cross-session memory
  print('\n\x1b[1m\x1b[34m▸ 10/12 — Cross-session memory\x1b[0m\n');
  const memoryChoice = await ask('Enable cross-session memory? (y/n)', 'n');
  const memory = ['y', 'o'].includes(memoryChoice.toLowerCase());

  // 11. Metrics
  print('\n\x1b[1m\x1b[34m▸ 11/12 — Workflow metrics\x1b[0m\n');
  const metricsChoice = await ask('Enable workflow metrics? (y/n)', 'n');
  const metrics = ['y', 'o'].includes(metricsChoice.toLowerCase());

  // 12. Confirmation with edit loop
  let confirmed = false;
  while (!confirmed) {
    print('\n\x1b[1m\x1b[34m▸ 12/12 — Confirmation\x1b[0m\n');
    print(`  Profile        : \x1b[1m${profile}\x1b[0m`);
    print(`  Team language  : \x1b[1m${langTeam}\x1b[0m`);
    print(`  Output language: \x1b[1m${langOutput}\x1b[0m`);
    print(`  Platforms (${selectedPlatforms.length})  : \x1b[1m${platformSelections.map(p => p[1]).join(', ')}\x1b[0m`);
    print(`  Project        : \x1b[1m${projectDir}\x1b[0m`);
    print(`  Output         : \x1b[1m${outputDir}\x1b[0m`);
    print(`  YOLO mode      : \x1b[1m${yolo ? '\x1b[33myes — autonomous\x1b[0m' : 'no'}\x1b[0m`);
    print(`  MCP server     : \x1b[1m${mcp ? 'yes' : 'no'}\x1b[0m`);
    print(`  Governance     : \x1b[1m${governance}\x1b[0m`);
    print(`  Memory         : \x1b[1m${memory ? 'yes' : 'no'}\x1b[0m`);
    print(`  Metrics        : \x1b[1m${metrics ? 'yes' : 'no'}\x1b[0m`);
    print('');

    const confirmChoice = await ask('Y=install  E=edit platforms  N=cancel', 'Y');
    const c = confirmChoice.toLowerCase();
    if (c === 'e') {
      await selectPlatforms();
      continue;
    }
    if (!['y', 'o'].includes(c)) {
      print('Installation cancelled.');
      rl.close();
      process.exit(0);
    }
    confirmed = true;
  }

  // Write .assemble.yaml with all wizard choices, then generate via --update
  print('\n\x1b[1m\x1b[34m▸ Generating...\x1b[0m\n');

  const today = new Date().toISOString().split('T')[0];
  // When a profile is selected (not custom), omit agents/workflows/governance
  // so that resolveProfile() in the generator applies the profile defaults.
  // When custom, write explicit values so the user has full control.
  const lines = [
    '# Assemble — Project configuration',
    '# Update: npx create-assemble --update',
    '',
    'version: "1.0.0-beta.1"',
    `profile: "${profile}"`,
    `langue_equipe: "${langTeam}"`,
    `langue_output: "${langOutput}"`,
    `output_dir: "${outputDir}"`,
    `platforms: [${selectedPlatforms.join(', ')}]`,
  ];
  if (profile === 'custom') {
    lines.push('agents: all');
    lines.push('workflows: all');
  }
  // Always write governance — it's an explicit user choice from the wizard,
  // even for non-custom profiles (e.g. enterprise user forcing none)
  lines.push(`governance: "${governance}"`);
  lines.push(`yolo: ${yolo ? 'true' : 'false'}`);
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
