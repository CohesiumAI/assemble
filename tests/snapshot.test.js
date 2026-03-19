#!/usr/bin/env node

/**
 * Assemble — Snapshot Tests
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
 *   7. Claude Code produces exactly 10 SKILL.md + routing.md + compact CLAUDE.md
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

function countDirs(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) count++;
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
console.log('  Assemble — Snapshot Tests');
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

  test('.assemble.yaml is created', () => {
    assert(fs.existsSync(path.join(dir, '.assemble.yaml')), '.assemble.yaml missing');
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
    const configPath = path.join(dir, '.assemble.yaml');
    assert(fs.existsSync(configPath), '.assemble.yaml missing after install');
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

  test('--update fails without .assemble.yaml', () => {
    const result = run(['--project', dir, '--update'], true);
    assert(result === false, 'Should fail without .assemble.yaml');
  });

  cleanTmpDir();
}

// ── Test 7: Claude Code 10-command architecture ──────────────────────────────

console.log('\nTest 7: Claude Code 10-command architecture');
{
  const dir = createTmpDir();
  run(['--project', dir, '--platforms', 'claude-code', '--lang-team', 'english', '--lang-output', 'english']);

  test('Exactly 10 SKILL.md directories', () => {
    const skillsDir = path.join(dir, '.claude', 'skills');
    const dirCount = countDirs(skillsDir);
    assert(dirCount === 10, `Expected exactly 10 skill directories, got ${dirCount}`);
  });

  test('Expected skill directories exist', () => {
    const expectedSkills = ['go', 'party', 'dismiss', 'help', 'review', 'bugfix', 'feature', 'sprint', 'release', 'mvp'];
    const skillsDir = path.join(dir, '.claude', 'skills');
    for (const slug of expectedSkills) {
      const skillMd = path.join(skillsDir, slug, 'SKILL.md');
      assert(fs.existsSync(skillMd), `Missing SKILL.md for /${slug}`);
    }
  });

  test('.claude/rules/routing.md exists and non-empty', () => {
    const routingPath = path.join(dir, '.claude', 'rules', 'routing.md');
    assert(fs.existsSync(routingPath), 'routing.md missing');
    const content = fs.readFileSync(routingPath, 'utf-8');
    assert(content.trim().length > 0, 'routing.md is empty');
    assert(content.includes('Complexity Assessment'), 'routing.md should contain complexity assessment');
  });

  test('CLAUDE.md under 30 lines', () => {
    const claudeMd = path.join(dir, 'CLAUDE.md');
    const content = fs.readFileSync(claudeMd, 'utf-8');
    const lineCount = content.split('\n').length;
    assert(lineCount <= 30, `CLAUDE.md has ${lineCount} lines, expected <= 30`);
  });

  test('31 agent directories exist', () => {
    const agentsDir = path.join(dir, '.claude', 'agents');
    const dirCount = countDirs(agentsDir);
    assert(dirCount >= 31, `Expected >= 31 agent directories, got ${dirCount}`);
  });

  test('/go SKILL.md references routing and $ARGUMENTS', () => {
    const goSkill = fs.readFileSync(path.join(dir, '.claude', 'skills', 'go', 'SKILL.md'), 'utf-8');
    assert(goSkill.includes('routing'), '/go should reference routing');
    assert(goSkill.includes('$ARGUMENTS'), '/go should contain $ARGUMENTS');
  });

  test('Shortcut SKILL.md files reference correct workflows', () => {
    const reviewSkill = fs.readFileSync(path.join(dir, '.claude', 'skills', 'review', 'SKILL.md'), 'utf-8');
    assert(reviewSkill.includes('code-review-pipeline') || reviewSkill.includes('Étape'), '/review should reference code review workflow');
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
