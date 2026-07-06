#!/usr/bin/env node
/**
 * Assemble — Coherence tests
 * Guards against the "hand-maintained counters drift from reality" class of bugs:
 * every advertised count (agents/workflows/skills/platforms) and the platform
 * registry must be derivable from the source tree, not copied by hand.
 * Also smoke-tests that the generated MCP server is syntactically valid.
 * Zero external dependencies.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
let passed = 0, failed = 0;
function assert(cond, msg) {
  if (cond) { console.log(`  ✅ ${msg}`); passed++; }
  else { console.log(`  ❌ ${msg}`); failed++; }
}

// ── Real counts from the source tree ─────────────────────────────────────────
const agentCount = fs.readdirSync(path.join(ROOT, 'src', 'agents')).filter(f => /^AGENT-.*\.md$/.test(f)).length;
const workflowCount = fs.readdirSync(path.join(ROOT, 'src', 'workflows')).filter(f => /\.ya?ml$/.test(f)).length;
const sharedSkills = fs.readdirSync(path.join(ROOT, 'src', 'skills', 'shared')).filter(f => f.endsWith('.md'));
const specificSkills = fs.readdirSync(path.join(ROOT, 'src', 'skills', 'specific')).filter(f => f.endsWith('.md'));
const skillCount = sharedSkills.length + specificSkills.length;

const ideAdapters = fs.readdirSync(path.join(ROOT, 'generator', 'adapters', 'ide')).filter(f => f.endsWith('.js'));
const cliAdapters = fs.readdirSync(path.join(ROOT, 'generator', 'adapters', 'cli')).filter(f => f.endsWith('.js'));
const platformCount = ideAdapters.length + cliAdapters.length;

// ── Test 1: package.json description matches reality ─────────────────────────
console.log('\nTest 1: package.json advertised counts match the source tree');
{
  const desc = require(path.join(ROOT, 'package.json')).description;
  assert(desc.includes(`${agentCount} specialized AI agents`), `description states ${agentCount} agents`);
  assert(desc.includes(`${workflowCount} workflows`), `description states ${workflowCount} workflows`);
  assert(desc.includes(`${skillCount} skills`), `description states ${skillCount} skills`);
  assert(desc.includes(`${platformCount} platforms`), `description states ${platformCount} platforms`);
}

// ── Test 2: platform registry matches the adapter files on disk ──────────────
console.log('\nTest 2: VALID_PLATFORMS matches the adapters actually shipped');
{
  const { VALID_PLATFORMS } = require(path.join(ROOT, 'generator', 'lib', 'schema-validator'));
  const adapterNames = [];
  for (const [sub, files] of [['ide', ideAdapters], ['cli', cliAdapters]]) {
    for (const f of files) {
      const mod = require(path.join(ROOT, 'generator', 'adapters', sub, f));
      if (mod && mod.name) adapterNames.push(mod.name);
    }
  }
  assert(VALID_PLATFORMS.length === adapterNames.length,
    `VALID_PLATFORMS has ${VALID_PLATFORMS.length} entries, ${adapterNames.length} adapter files`);
  const missing = adapterNames.filter(n => !VALID_PLATFORMS.includes(n));
  const extra = VALID_PLATFORMS.filter(n => !adapterNames.includes(n));
  assert(missing.length === 0, `every adapter is in VALID_PLATFORMS${missing.length ? ' (missing: ' + missing.join(', ') + ')' : ''}`);
  assert(extra.length === 0, `no VALID_PLATFORMS entry without an adapter${extra.length ? ' (extra: ' + extra.join(', ') + ')' : ''}`);
}

// ── Test 3: workflow triggers are all declared in commands.yaml ──────────────
console.log('\nTest 3: every workflow trigger is registered in commands.yaml');
{
  const commandsYaml = fs.readFileSync(path.join(ROOT, 'src', 'commands', 'commands.yaml'), 'utf-8');
  const wfDir = path.join(ROOT, 'src', 'workflows');
  for (const f of fs.readdirSync(wfDir).filter(f => /\.ya?ml$/.test(f))) {
    const raw = fs.readFileSync(path.join(wfDir, f), 'utf-8');
    const m = raw.match(/^trigger:\s*"?(\/[a-z0-9-]+)"?/m);
    assert(m && commandsYaml.includes(m[1]), `${f}: trigger ${m ? m[1] : '(none)'} declared in commands.yaml`);
  }
}

// ── Test 4: generated MCP server is syntactically valid ──────────────────────
console.log('\nTest 4: generated MCP server passes node --check');
{
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-coherence-'));
  try {
    const cfg = `version: "0.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code]\nagents: all\nworkflows: all\ngovernance: "none"\nmcp: true\ninstalled_at: "2026-01-01"\n`;
    fs.writeFileSync(path.join(tmp, '.assemble.yaml'), cfg);
    execFileSync('node', [path.join(ROOT, 'generator', 'generate.js'), '--project', tmp, '--update'], { stdio: 'pipe' });
    const serverPath = path.join(tmp, '.assemble', 'mcp-server.js');
    assert(fs.existsSync(serverPath), 'mcp-server.js was generated');
    if (fs.existsSync(serverPath)) {
      let ok = true;
      try { execFileSync('node', ['--check', serverPath], { stdio: 'pipe' }); }
      catch (e) { ok = false; console.log(`     ${e.stderr ? e.stderr.toString().split('\n')[0] : e.message}`); }
      assert(ok, 'mcp-server.js is syntactically valid JavaScript');
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(55)}`);
console.log(`  Coherence tests: ${passed} passed, ${failed} failed`);
console.log(`${'═'.repeat(55)}`);
process.exit(failed > 0 ? 1 : 0);
