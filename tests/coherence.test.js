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
    execFileSync(process.execPath, [path.join(ROOT, 'generator', 'generate.js'), '--project', tmp, '--update'], { stdio: 'pipe' });
    const serverPath = path.join(tmp, '.assemble', 'mcp-server.js');
    assert(fs.existsSync(serverPath), 'mcp-server.js was generated');
    if (fs.existsSync(serverPath)) {
      let ok = true;
      try { execFileSync(process.execPath, ['--check', serverPath], { stdio: 'pipe' }); }
      catch (e) { ok = false; console.log(`     ${e.stderr ? e.stderr.toString().split('\n')[0] : e.message}`); }
      assert(ok, 'mcp-server.js is syntactically valid JavaScript');
      const mcpPackage = JSON.parse(fs.readFileSync(path.join(tmp, '.assemble', 'package.json'), 'utf-8'));
      assert(mcpPackage.version === require(path.join(ROOT, 'package.json')).version, 'generated MCP package uses the canonical package version');
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// ── Test 5: canonical MCP file name across tracked files ─────────────────────
console.log('\nTest 5: MCP package file name is canonical');
{
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT }).toString().split('\0').filter(Boolean);
  const legacyName = ['mcp', 'package.json'].join('-');
  const offenders = [];
  for (const relative of tracked) {
    const full = path.join(ROOT, relative);
    if (!fs.statSync(full).isFile()) continue;
    if (fs.readFileSync(full).toString().includes(legacyName)) offenders.push(relative);
  }
  assert(offenders.length === 0, `no tracked file references the legacy MCP name${offenders.length ? ': ' + offenders.join(', ') : ''}`);
}

// ── Test 6: release version stays coherent across artifacts ─────────────────
console.log('\nTest 6: release version is coherent');
{
  const pkgVersion = require(path.join(ROOT, 'package.json')).version;
  const expectedVersion = ['1.1.2', 'beta.6'].join('-');
  const previousVersion = ['1.1.2', 'beta.5'].join('-');
  const versionFiles = [
    'README.md',
    path.join('src', 'config', 'defaults.yaml'),
    path.join('examples', 'startup', '.assemble.yaml'),
    'CHANGELOG.md',
  ];
  assert(pkgVersion === expectedVersion, `package version is ${expectedVersion}`);
  const pkg = require(path.join(ROOT, 'package.json'));
  assert(pkg.repository && pkg.repository.url === 'https://github.com/CohesiumAI/assemble', 'package repository URL matches the provenance repository');
  for (const relative of versionFiles) {
    assert(fs.readFileSync(path.join(ROOT, relative), 'utf-8').includes(expectedVersion), `${relative} contains ${expectedVersion}`);
  }

  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT }).toString().split('\0').filter(Boolean);
  const stale = tracked.filter(relative => {
    if (relative === 'CHANGELOG.md') return false;
    return fs.readFileSync(path.join(ROOT, relative)).toString().includes(previousVersion);
  });
  assert(stale.length === 0, `previous release appears only in CHANGELOG.md${stale.length ? ' (also in: ' + stale.join(', ') + ')' : ''}`);
}

// ── Test 7: community documents and startup example are actionable ──────────
console.log('\nTest 7: community documents and example are coherent');
{
  for (const relative of ['CHANGELOG.md', 'SECURITY.md', 'CONTRIBUTING.md', path.join('docs', 'RELEASING.md'), path.join('examples', 'README.md'), path.join('examples', 'startup', '.assemble.yaml')]) {
    assert(fs.existsSync(path.join(ROOT, relative)), `${relative} exists`);
  }
  const security = fs.readFileSync(path.join(ROOT, 'SECURITY.md'), 'utf-8');
  assert(security.includes('/security/advisories/new'), 'SECURITY.md provides GitHub private vulnerability reporting');
  assert(!security.includes('@'), 'SECURITY.md does not invent an email reporting channel');
  const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf-8');
  assert(changelog.includes('symbolic links') && changelog.includes('Windsurf') && changelog.includes('.assemble/package.json'), 'CHANGELOG.md covers confinement, Windsurf ordering, and the canonical MCP package');
  const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf-8');
  assert(readme.includes('--allow-plugins') && readme.includes('--register-windsurf-mcp'), 'README documents explicit plugin and Windsurf consent flags');

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-example-'));
  try {
    fs.copyFileSync(path.join(ROOT, 'examples', 'startup', '.assemble.yaml'), path.join(tmp, '.assemble.yaml'));
    execFileSync(process.execPath, [path.join(ROOT, 'generator', 'generate.js'), '--project', tmp, '--update'], { stdio: 'pipe' });
    assert(fs.existsSync(path.join(tmp, '.cursorrules')), 'startup example generates Cursor output in isolation');
    assert(fs.existsSync(path.join(tmp, '.agents', 'skills', 'go', 'SKILL.md')), 'startup example generates Codex skills in isolation');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

// ── Test 8: release workflow is tag-driven and manual runs are dry ───────────
console.log('\nTest 8: release workflow has defensive publication gates');
{
  const workflow = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'publish.yml'), 'utf-8');
  assert(/tags:\r?\n\s+- 'v\*'/.test(workflow), 'release workflow triggers from v* tags');
  assert(workflow.includes('workflow_dispatch:') && workflow.includes("github.event_name == 'push'"), 'manual dispatch cannot reach the publish job');
  assert(workflow.includes('TAG_VERSION') && workflow.includes('package version'), 'tag version is checked against package.json');
  assert(workflow.indexOf('npm test') < workflow.indexOf('npm pack'), 'tests run before npm pack');
  assert(workflow.indexOf('npm pack') < workflow.indexOf('npm publish'), 'npm pack runs before npm publish');
  assert(workflow.includes('--tag beta'), 'npm publication uses the beta dist-tag');
  assert(workflow.includes('npm publish "./$PACKAGE_FILE"'), 'npm publication treats the generated archive as a local path');
  assert(workflow.includes('gh release view') && workflow.includes('gh release create') && workflow.includes('--clobber'), 'GitHub Release creation is idempotent');
  assert(workflow.includes('contents: read') && workflow.includes('contents: write') && workflow.includes('id-token: write'), 'workflow permissions are explicit per job');
}

// ── Test 9: every GitHub Action is immutably pinned ─────────────────────────
console.log('\nTest 9: GitHub Actions are pinned to full commit SHAs');
{
  const workflowsDir = path.join(ROOT, '.github', 'workflows');
  const workflowFiles = fs.readdirSync(workflowsDir).filter(file => /\.ya?ml$/.test(file));
  const usesLines = [];
  for (const file of workflowFiles) {
    const lines = fs.readFileSync(path.join(workflowsDir, file), 'utf-8').split('\n');
    for (const line of lines) {
      if (/^\s*-?\s*uses:\s*/.test(line)) usesLines.push({ file, line });
    }
  }
  assert(usesLines.length > 0, 'workflows contain Actions to validate');
  for (const { file, line } of usesLines) {
    const match = line.match(/uses:\s*[^@\s]+@([A-Za-z0-9]+)/);
    assert(Boolean(match) && /^[a-f0-9]{40}$/.test(match[1]), `${file}: uses reference is a full SHA`);
    assert(/#\s*v\d/.test(line), `${file}: pinned Action has a version comment`);
  }
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(55)}`);
console.log(`  Coherence tests: ${passed} passed, ${failed} failed`);
console.log(`${'═'.repeat(55)}`);
process.exit(failed > 0 ? 1 : 0);
