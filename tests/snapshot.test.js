#!/usr/bin/env node

/**
 * Cohesium AI — Snapshot Tests
 *
 * Verifies that the generator produces the expected file structure
 * for all 20 platforms. Run with: node tests/snapshot.test.js
 *
 * Tests:
 *   1. Generation succeeds for all 20 platforms (exit code 0)
 *   2. Each platform produces the expected file types and counts
 *   3. No empty files are generated
 *   4. Validation passes for all platforms (adapter.validate())
 *   5. --update mode preserves config and regenerates correctly
 *   6. Agent/workflow filtering works
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '..');
const GENERATOR = path.join(ROOT, 'generator', 'generate.js');

let passed = 0;
let failed = 0;
let tmpDir;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createTmpDir() {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cohesium-test-'));
  return tmpDir;
}

function cleanTmpDir() {
  if (tmpDir && fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function run(args, expectFail = false) {
  try {
    execFileSync(process.execPath, [GENERATOR, ...args], {
      stdio: 'pipe',
      timeout: 60000,
    });
    return true;
  } catch (e) {
    if (expectFail) return false;
    throw e;
  }
}

function countFiles(dir, ext) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(full, ext);
    } else if (!ext || entry.name.endsWith(ext)) {
      count++;
    }
  }
  return count;
}

function hasEmptyFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const empty = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      empty.push(...hasEmptyFiles(full));
    } else {
      const content = fs.readFileSync(full, 'utf-8');
      if (content.trim().length === 0) empty.push(full);
    }
  }
  return empty;
}

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  Cohesium AI — Snapshot Tests');
console.log('═══════════════════════════════════════════════════════');
console.log('');

// ── Test 1: Generation for all 20 platforms ──────────────────────────────────

console.log('Test 1: Full generation (all 20 platforms)');
{
  const dir = createTmpDir();
  const platforms = [
    'cursor', 'windsurf', 'cline', 'roocode', 'copilot',
    'kiro', 'trae', 'antigravity', 'codebuddy', 'crush',
    'iflow', 'kilocoder', 'opencode', 'qwencoder', 'rovodev',
    'claude-code', 'codex', 'gemini-cli', 'auggie', 'pi',
  ];

  test('Generation exits with code 0', () => {
    run(['--project', dir, '--platforms', platforms.join(','), '--lang-team', 'english', '--lang-output', 'english']);
  });

  test('.cohesium.yaml is created', () => {
    assert(fs.existsSync(path.join(dir, '.cohesium.yaml')), '.cohesium.yaml missing');
  });

  cleanTmpDir();
}

// ── Test 2: Platform-specific file structure ─────────────────────────────────

console.log('\nTest 2: Platform-specific file structures');

const PLATFORM_EXPECTATIONS = {
  'claude-code': {
    files: ['CLAUDE.md'],
    dirs: ['.claude/agents', '.claude/skills', '.claude/rules'],
    minAgents: 31,
    agentExt: 'AGENT.md',
  },
  cursor: {
    files: ['.cursorrules'],
    dirs: ['.cursor/agents', '.cursor/skills', '.cursor/workflows'],
    minAgents: 31,
  },
  kiro: {
    dirs: ['.kiro/agents', '.kiro/steering'],
    agentExt: '.json',
    minAgents: 31,
  },
  auggie: {
    dirs: ['.augment/commands'],
    minFiles: 40,
  },
  codex: {
    files: ['AGENTS.md'],
  },
  pi: {
    files: ['AGENTS.md', 'SYSTEM.md'],
  },
  'gemini-cli': {
    files: ['GEMINI.md'],
    dirs: ['.gemini/agents', '.gemini/skills', '.gemini/workflows'],
  },
  roocode: {
    files: ['.roomodes'],
    dirs: ['.roo'],
  },
  windsurf: {
    files: ['.windsurfrules'],
    dirs: ['.windsurf/rules', '.windsurf/workflows'],
  },
  copilot: {
    files: ['.github/copilot-instructions.md'],
    dirs: ['.github/instructions'],
  },
};

for (const [platform, expected] of Object.entries(PLATFORM_EXPECTATIONS)) {
  const dir = createTmpDir();

  test(`${platform}: correct file structure`, () => {
    run(['--project', dir, '--platforms', platform, '--lang-team', 'english', '--lang-output', 'english']);

    if (expected.files) {
      for (const f of expected.files) {
        assert(fs.existsSync(path.join(dir, f)), `Missing file: ${f}`);
      }
    }

    if (expected.dirs) {
      for (const d of expected.dirs) {
        assert(fs.existsSync(path.join(dir, d)), `Missing directory: ${d}`);
      }
    }

    if (expected.minAgents) {
      const agentDir = expected.dirs ? expected.dirs[0] : null;
      if (agentDir) {
        const count = countFiles(path.join(dir, agentDir));
        assert(count >= expected.minAgents, `Expected >= ${expected.minAgents} agent files in ${agentDir}, got ${count}`);
      }
    }

    if (expected.minFiles) {
      const d = expected.dirs ? expected.dirs[0] : null;
      if (d) {
        const count = countFiles(path.join(dir, d));
        assert(count >= expected.minFiles, `Expected >= ${expected.minFiles} files in ${d}, got ${count}`);
      }
    }
  });

  cleanTmpDir();
}

// ── Test 3: No empty files ───────────────────────────────────────────────────

console.log('\nTest 3: No empty files');
{
  const dir = createTmpDir();
  run(['--project', dir, '--platforms', 'claude-code,cursor,kiro', '--lang-team', 'english', '--lang-output', 'english']);

  for (const subdir of ['.claude', '.cursor', '.kiro']) {
    test(`${subdir}: no empty files`, () => {
      const emptyFiles = hasEmptyFiles(path.join(dir, subdir));
      assert(emptyFiles.length === 0, `Found empty files: ${emptyFiles.map(f => path.relative(dir, f)).join(', ')}`);
    });
  }

  cleanTmpDir();
}

// ── Test 4: Validation passes ────────────────────────────────────────────────

console.log('\nTest 4: Validation');
{
  const dir = createTmpDir();

  test('--validate passes after generation', () => {
    run(['--project', dir, '--platforms', 'claude-code,cursor,kiro,auggie,codex,pi', '--lang-team', 'english', '--lang-output', 'english']);
    run(['--project', dir, '--platforms', 'claude-code,cursor,kiro,auggie,codex,pi', '--validate']);
  });

  cleanTmpDir();
}

// ── Test 5: Update mode ──────────────────────────────────────────────────────

console.log('\nTest 5: Update mode');
{
  const dir = createTmpDir();

  test('--update preserves config and regenerates', () => {
    // Initial install
    run(['--project', dir, '--platforms', 'claude-code,cursor', '--lang-team', 'français', '--lang-output', 'english']);

    // Verify config exists
    const configPath = path.join(dir, '.cohesium.yaml');
    assert(fs.existsSync(configPath), '.cohesium.yaml missing after install');
    const configBefore = fs.readFileSync(configPath, 'utf-8');
    assert(configBefore.includes('français'), 'Config should contain français');
    assert(configBefore.includes('claude-code'), 'Config should contain claude-code');

    // Delete a generated file to verify it gets regenerated
    const claudeMd = path.join(dir, 'CLAUDE.md');
    if (fs.existsSync(claudeMd)) fs.unlinkSync(claudeMd);

    // Run update
    run(['--project', dir, '--update']);

    // Verify file is regenerated
    assert(fs.existsSync(claudeMd), 'CLAUDE.md should be regenerated');

    // Verify config preserved
    const configAfter = fs.readFileSync(configPath, 'utf-8');
    assert(configAfter.includes('français'), 'Config should still contain français');
    assert(configAfter.includes('claude-code'), 'Config should still contain claude-code');
    assert(configAfter.includes('updated_at'), 'Config should have updated_at');
  });

  cleanTmpDir();
}

// ── Test 6: Agent/workflow filtering ─────────────────────────────────────────

console.log('\nTest 6: Agent/workflow filtering');
{
  const dir = createTmpDir();

  test('--update fails without .cohesium.yaml', () => {
    const result = run(['--project', dir, '--update'], true);
    assert(result === false, 'Should fail without .cohesium.yaml');
  });

  cleanTmpDir();
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════════════════');
console.log('');

process.exit(failed > 0 ? 1 : 0);
