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
const ROOT = path.resolve(__dirname, '..');
const GENERATOR = path.join(ROOT, 'generator', 'generate.js');

const config = `version: "1.0.0-beta.1"
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
installed_at: "2026-03-19"
`;

fs.writeFileSync(path.join(dir, '.assemble.yaml'), config);

try {
  execFileSync(process.execPath, [GENERATOR, '--update', '--project', dir], { stdio: 'pipe', timeout: 60000 });
  console.log('=== GENERATION: OK (exit 0) ===\n');
} catch (e) {
  console.log('=== GENERATION: FAILED ===');
  console.log(e.stderr ? e.stderr.toString() : e.message);
  process.exit(1);
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

// Codex — AGENTS.md contains governance (but shared with Pi — need to check actual codex content)
// Codex and Pi both write AGENTS.md, last one wins. Let's check the combined AGENTS.md
check('Codex/Pi: AGENTS.md exists', fs.existsSync(path.join(dir, 'AGENTS.md')));
check('Codex/Pi: AGENTS.md has Governance', fileContains(path.join(dir, 'AGENTS.md'), 'Governance'));

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

fs.rmSync(dir, { recursive: true, force: true });
process.exit(failed > 0 ? 1 : 0);
