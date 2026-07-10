#!/usr/bin/env node
/**
 * Full integration test: 21 platforms + all features enabled
 * (governance:strict, mcp:true, memory:true, metrics:true)
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-full-'));
const userProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-profile-'));
const windsurfProfileDir = path.join(userProfileDir, '.codeium', 'windsurf');
const windsurfGlobalConfig = path.join(windsurfProfileDir, 'mcp_config.json');
const isolatedEnv = {
  ...process.env,
  HOME: userProfileDir,
  USERPROFILE: userProfileDir,
};
const ROOT = path.resolve(__dirname, '..');
const GENERATOR = path.join(ROOT, 'generator', 'generate.js');

const config = `version: "1.1.0-beta.3"
profile: "custom"
langue_equipe: "english"
langue_output: "english"
output_dir: "./assemble-output"
platforms: [cursor, windsurf, cline, roocode, copilot, kiro, trae, antigravity, codebuddy, crush, iflow, kilocoder, opencode, qwencoder, rovodev, claude-code, claude-code-desktop, codex, gemini-cli, auggie, pi]
agents: all
workflows: all
governance: "strict"
mcp: true
memory: true
metrics: true
register_windsurf_mcp: true
installed_at: "2026-03-19"
`;

function listFiles(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(full));
    else files.push(full);
  }
  return files;
}

try {
  fs.mkdirSync(windsurfProfileDir, { recursive: true });
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), config);

  function runGenerator(extraArgs = []) {
    execFileSync(process.execPath, [GENERATOR, '--update', '--project', dir, ...extraArgs], {
      stdio: 'pipe',
      timeout: 60000,
      env: isolatedEnv,
    });
  }

  let localMcpWithoutRegistration = false;
  let globalConfigWithoutRegistration = false;
  let registrationSettingPersisted = true;
  try {
    runGenerator();
    localMcpWithoutRegistration = fs.existsSync(path.join(dir, '.assemble', 'mcp-server.js'));
    globalConfigWithoutRegistration = fs.existsSync(windsurfGlobalConfig);
    registrationSettingPersisted = fs.readFileSync(path.join(dir, '.assemble.yaml'), 'utf-8').includes('register_windsurf_mcp');
    runGenerator(['--register-windsurf-mcp']);
    console.log('=== GENERATION: OK (exit 0) ===\n');
  } catch (e) {
    console.log('=== GENERATION: FAILED ===');
    console.log(e.stderr ? e.stderr.toString() : e.message);
    throw e;
  }

  let passed = 0, failed = 0;
  function check(name, ok, detail) {
    console.log((ok ? '  ✅' : '  ❌') + ' ' + name + (detail ? ' — ' + detail : ''));
    if (ok) passed++; else failed++;
  }

  function fileContains(filePath, text) {
    if (!fs.existsSync(filePath)) return false;
    return fs.readFileSync(filePath, 'utf-8').includes(text);
  }

// ═══ MCP ═══
console.log('--- MCP ---');
check('mcp-server.js exists', fs.existsSync(path.join(dir, '.assemble', 'mcp-server.js')));
check('mcp.json exists', fs.existsSync(path.join(dir, '.assemble', 'mcp.json')));
check('package.json exists', fs.existsSync(path.join(dir, '.assemble', 'package.json')));
check('mcp.json uses forward slashes', (() => {
  const j = JSON.parse(fs.readFileSync(path.join(dir, '.assemble', 'mcp.json'), 'utf-8'));
  return !j.mcpServers.assemble.args[0].includes('\\');
})());
check('mcp-server.js has invoke- tools', fileContains(path.join(dir, '.assemble', 'mcp-server.js'), 'invoke-'));
check('mcp-server.js has jarvis-route', fileContains(path.join(dir, '.assemble', 'mcp-server.js'), 'jarvis-route'));
check('MCP local files are generated without the registration flag', localMcpWithoutRegistration);
check('Windsurf: no global config is written without the registration flag', !globalConfigWithoutRegistration);
check('Windsurf registration setting is not persisted in .assemble.yaml', !registrationSettingPersisted);
check('Windsurf: isolated global config exists', fs.existsSync(windsurfGlobalConfig));
check('Windsurf: HOME and USERPROFILE use the temporary fixture', isolatedEnv.HOME === userProfileDir && isolatedEnv.USERPROFILE === userProfileDir);
check('Windsurf: global config points to the temporary project MCP server', (() => {
  const globalConfig = JSON.parse(fs.readFileSync(windsurfGlobalConfig, 'utf-8'));
  return globalConfig.mcpServers
    && globalConfig.mcpServers.assemble
    && globalConfig.mcpServers.assemble.args[0] === path.join(dir, '.assemble', 'mcp-server.js');
})());
check('Windsurf: fixture contains the only global config created', (() => {
  const files = listFiles(userProfileDir).map(file => path.relative(userProfileDir, file).replace(/\\/g, '/'));
  return files.length === 1 && files[0] === '.codeium/windsurf/mcp_config.json';
})());

// ═══ Memory & Metrics & AGENTS.md ═══
console.log('\n--- Memory / Metrics / AGENTS.md ---');
check('_memory.md exists', fs.existsSync(path.join(dir, 'assemble-output', '_memory.md')));
check('_metrics.md exists', fs.existsSync(path.join(dir, 'assemble-output', '_metrics.md')));
check('AGENTS.md universal exists', fs.existsSync(path.join(dir, 'assemble-output', 'AGENTS.md')));
check('AGENTS.md has agent table', fileContains(path.join(dir, 'assemble-output', 'AGENTS.md'), 'Agent ID'));

// ═══ Claude Code (reference platform) ═══
console.log('\n--- Claude Code ---');
check('CLAUDE.md exists', fs.existsSync(path.join(dir, 'CLAUDE.md')));
check('routing.md: Cross-Session Memory', fileContains(path.join(dir, '.claude', 'rules', 'routing.md'), 'Cross-Session Memory'));
check('routing.md: Metrics & Observability', fileContains(path.join(dir, '.claude', 'rules', 'routing.md'), 'Metrics & Observability'));
check('routing.md: Sub-Agent Delegation', fileContains(path.join(dir, '.claude', 'rules', 'routing.md'), 'Sub-Agent Delegation'));
check('routing.md: governance mentions strict', fileContains(path.join(dir, '.claude', 'rules', 'routing.md'), 'strict'));
check('governance.md exists', fs.existsSync(path.join(dir, '.claude', 'rules', 'governance', 'governance.md')));
check('governance.md: RBAC', fileContains(path.join(dir, '.claude', 'rules', 'governance', 'governance.md'), 'RBAC'));
check('governance.md: Audit Trail', fileContains(path.join(dir, '.claude', 'rules', 'governance', 'governance.md'), 'Audit Trail'));
check('governance.md: NIST', fileContains(path.join(dir, '.claude', 'rules', 'governance', 'governance.md'), 'NIST'));
check('/go SKILL: Agent tool', fileContains(path.join(dir, '.claude', 'skills', 'go', 'SKILL.md'), 'Agent tool'));

// ═══ 15 IDE Platforms — governance strict via renderCommandRegistry ═══
console.log('\n--- IDE Platforms (governance strict propagation) ---');
const ideChecks = [
  ['.cursorrules', 'Cursor'],
  ['.clinerules', 'Cline'],
];
for (const [file, name] of ideChecks) {
  const p = path.join(dir, file);
  check(name + ': file exists', fs.existsSync(p));
  check(name + ': Governance (strict)', fileContains(p, '### Governance (strict)'));
  check(name + ': RBAC Notice', fileContains(p, 'RBAC Notice'));
  check(name + ': Decision Gates', fileContains(p, 'Decision Gates'));
  check(name + ': Change Risk Assessment', fileContains(p, 'Change Risk Assessment'));
}

// Windsurf — governance is in .windsurf/rules/commands.md (not .windsurfrules which is a compact index)
check('Windsurf: .windsurfrules exists', fs.existsSync(path.join(dir, '.windsurfrules')));
check('Windsurf: .windsurfrules under 6000 chars', (() => {
  const c = fs.readFileSync(path.join(dir, '.windsurfrules'), 'utf-8');
  return c.length <= 6000;
})());
check('Windsurf: Governance (strict) in commands.md', fileContains(path.join(dir, '.windsurf', 'rules', 'commands.md'), '### Governance (strict)'));
check('Windsurf: RBAC Notice', fileContains(path.join(dir, '.windsurf', 'rules', 'commands.md'), 'RBAC Notice'));

// Copilot
check('Copilot: instructions exist', fs.existsSync(path.join(dir, '.github', 'copilot-instructions.md')));
check('Copilot: Governance (strict)', fileContains(path.join(dir, '.github', 'copilot-instructions.md'), 'Governance (strict)'));
check('Copilot: RBAC Notice', fileContains(path.join(dir, '.github', 'copilot-instructions.md'), 'RBAC Notice'));

// Kiro
const kiroSteering = path.join(dir, '.kiro', 'steering');
if (fs.existsSync(kiroSteering)) {
  const files = fs.readdirSync(kiroSteering);
  const hasGov = files.some(f => fs.readFileSync(path.join(kiroSteering, f), 'utf-8').includes('Governance'));
  check('Kiro: steering has Governance', hasGov);
}

// Roo Code — governance is in .roo/rules-commands.md, NOT in .roomodes (which is JSON modes)
check('Roo Code: .roomodes exists', fs.existsSync(path.join(dir, '.roomodes')));
check('Roo Code: rules-commands.md has Governance', fileContains(path.join(dir, '.roo', 'rules-commands.md'), 'Governance'));
check('Roo Code: rules-commands.md has RBAC Notice', fileContains(path.join(dir, '.roo', 'rules-commands.md'), 'RBAC Notice'));

// Remaining IDEs that use directory structures
const dirBasedIDEs = [
  ['.trae', 'Trae'],
  ['.antigravity', 'Antigravity'],
  ['.codebuddy', 'CodeBuddy'],
  ['.crush', 'Crush'],
  ['.iflow', 'iFlow'],
  ['.kilocoder', 'KiloCoder'],
  ['.opencode', 'OpenCode'],
  ['.qwencoder', 'QwenCoder'],
  ['.rovo', 'Rovo Dev'],
];
for (const [dirName, name] of dirBasedIDEs) {
  const dirPath = path.join(dir, dirName);
  check(name + ': directory exists', fs.existsSync(dirPath));
}

// ═══ Other CLI Platforms ═══
console.log('\n--- Other CLI Platforms ---');

// Codex — native files must exist even though AGENTS.md is shared with Pi
check('Codex: AGENTS.md exists', fs.existsSync(path.join(dir, 'AGENTS.md')));
check('Codex: .agents/skills/go/SKILL.md exists', fs.existsSync(path.join(dir, '.agents', 'skills', 'go', 'SKILL.md')));
check('Codex: .codex/agents directory exists', fs.existsSync(path.join(dir, '.codex', 'agents')));
check('Codex: tony-stark custom agent exists', fs.existsSync(path.join(dir, '.codex', 'agents', 'tony-stark.toml')));

// Auggie
check('Auggie: _commands.md exists', fs.existsSync(path.join(dir, '.augment', 'commands', '_commands.md')));
check('Auggie: Governance', fileContains(path.join(dir, '.augment', 'commands', '_commands.md'), 'Governance'));
check('Auggie: RBAC Notice', fileContains(path.join(dir, '.augment', 'commands', '_commands.md'), 'RBAC Notice'));

// Gemini CLI
check('Gemini: GEMINI.md exists', fs.existsSync(path.join(dir, 'GEMINI.md')));
check('Gemini: Governance', fileContains(path.join(dir, 'GEMINI.md'), 'Governance'));

// Pi — governance is in AGENTS.md (via renderCommandRegistry), NOT in SYSTEM.md (orchestrator only)
check('Pi: SYSTEM.md exists', fs.existsSync(path.join(dir, 'SYSTEM.md')));
check('Pi: AGENTS.md has Governance', fileContains(path.join(dir, 'AGENTS.md'), 'Governance'));
check('Pi: AGENTS.md has RBAC Notice', fileContains(path.join(dir, 'AGENTS.md'), 'RBAC Notice'));

// ═══ Summary ═══
console.log('\n═══════════════════════════════════════════════════════');
console.log(`  Integration test: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════════════════\n');

  process.exitCode = failed > 0 ? 1 : 0;
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.rmSync(userProfileDir, { recursive: true, force: true });
}
