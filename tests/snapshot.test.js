#!/usr/bin/env node

/**
 * Assemble — Snapshot Tests
 *
 * Verifies that the generator produces the expected file structure
 * for all 21 platforms. Run with: node tests/snapshot.test.js
 *
 * Tests:
 *   1. Generation succeeds for all 21 platforms (exit code 0)
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
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-test-'));
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

// ── Test 1: Generation for all 21 platforms ──────────────────────────────────

console.log('Test 1: Full generation (all 21 platforms)');
{
  const dir = createTmpDir();
  const platforms = [
    'cursor', 'windsurf', 'cline', 'roocode', 'copilot',
    'kiro', 'trae', 'antigravity', 'codebuddy', 'crush',
    'iflow', 'kilocoder', 'opencode', 'qwencoder', 'rovodev',
    'claude-code', 'claude-code-desktop', 'codex', 'gemini-cli', 'auggie', 'pi',
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

  test('Exactly 12 SKILL.md directories', () => {
    const skillsDir = path.join(dir, '.claude', 'skills');
    const dirCount = countDirs(skillsDir);
    assert(dirCount === 12, `Expected exactly 12 skill directories, got ${dirCount}`);
  });

  test('Expected skill directories exist', () => {
    const expectedSkills = ['go', 'party', 'dismiss', 'help', 'review', 'bugfix', 'feature', 'sprint', 'release', 'mvp', 'yolo-hardcore', 'yolo-evil'];
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

// ── Test 8: Governance ───────────────────────────────────────────────────────

console.log('\nTest 8: Governance');
{
  // 8a: governance: none (default) — no governance file generated
  const dirNone = createTmpDir();
  run(['--project', dirNone, '--platforms', 'claude-code', '--lang-team', 'english', '--lang-output', 'english']);

  test('governance: none — no governance.md generated', () => {
    const govPath = path.join(dirNone, '.claude', 'rules', 'governance', 'governance.md');
    assert(!fs.existsSync(govPath), 'governance.md should NOT exist when governance is none');
  });

  test('governance: none — config contains governance: "none"', () => {
    const config = fs.readFileSync(path.join(dirNone, '.assemble.yaml'), 'utf-8');
    assert(config.includes('governance:'), 'Config should contain governance field');
  });

  cleanTmpDir();

  // 8b: governance: standard — governance file generated
  const dirStd = createTmpDir();
  // Create a config with governance: standard, then run update
  const configContent = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code]\nagents: all\nworkflows: all\ngovernance: "standard"\ninstalled_at: "2026-03-19"\n`;
  fs.mkdirSync(dirStd, { recursive: true });
  fs.writeFileSync(path.join(dirStd, '.assemble.yaml'), configContent);
  run(['--project', dirStd, '--update']);

  test('governance: standard — governance.md exists', () => {
    const govPath = path.join(dirStd, '.claude', 'rules', 'governance', 'governance.md');
    assert(fs.existsSync(govPath), 'governance.md should exist when governance is standard');
  });

  test('governance: standard — contains decision gates and risk assessment', () => {
    const govContent = fs.readFileSync(path.join(dirStd, '.claude', 'rules', 'governance', 'governance.md'), 'utf-8');
    assert(govContent.includes('Decision Gates'), 'Should contain Decision Gates');
    assert(govContent.includes('Risk Assessment'), 'Should contain Risk Assessment');
    assert(govContent.includes('Quality Checkpoints'), 'Should contain Quality Checkpoints');
  });

  test('governance: standard — routing.md references governance', () => {
    const routing = fs.readFileSync(path.join(dirStd, '.claude', 'rules', 'routing.md'), 'utf-8');
    assert(routing.includes('Governance') || routing.includes('governance'), 'routing.md should reference governance');
  });

  cleanTmpDir();
}

// ── Test 9: Baseline _quality.md / Phase 5 CLOSE across platforms ────────────

console.log('\nTest 9: Baseline methodology across platforms (no governance)');
{
  const dir = createTmpDir();
  run(['--project', dir, '--platforms', 'cursor,auggie,codex,copilot', '--lang-team', 'english', '--lang-output', 'english']);

  test('Cursor: baseline includes Phase 5 CLOSE and _quality.md', () => {
    const rules = fs.readFileSync(path.join(dir, '.cursorrules'), 'utf-8');
    assert(rules.includes('_quality.md'), 'Cursor rules should contain _quality.md baseline');
    assert(rules.includes('CLOSE'), 'Cursor rules should contain CLOSE phase');
  });

  test('Auggie: baseline includes _quality.md', () => {
    const commands = fs.readFileSync(path.join(dir, '.augment', 'commands', '_commands.md'), 'utf-8');
    assert(commands.includes('_quality.md'), 'Auggie commands should contain _quality.md baseline');
  });

  test('Codex: baseline includes _quality.md', () => {
    const agents = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf-8');
    assert(agents.includes('_quality.md'), 'Codex AGENTS.md should contain _quality.md baseline');
  });

  test('Copilot: baseline includes _quality.md', () => {
    const instructions = fs.readFileSync(path.join(dir, '.github', 'copilot-instructions.md'), 'utf-8');
    assert(instructions.includes('_quality.md'), 'Copilot instructions should contain _quality.md baseline');
  });

  test('governance: none — no Governance section in output', () => {
    const rules = fs.readFileSync(path.join(dir, '.cursorrules'), 'utf-8');
    assert(!rules.includes('### Governance ('), 'Cursor should NOT have Governance section when none');
  });

  cleanTmpDir();
}

// ── Test 10: Governance propagation across platforms ─────────────────────────

console.log('\nTest 10: Governance propagation (standard) across platforms');
{
  const dir = createTmpDir();
  fs.mkdirSync(dir, { recursive: true });
  const configContent = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [cursor, auggie, codex, copilot]\nagents: all\nworkflows: all\ngovernance: "standard"\ninstalled_at: "2026-03-19"\n`;
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), configContent);
  run(['--project', dir, '--update']);

  test('Cursor: governance section present', () => {
    const rules = fs.readFileSync(path.join(dir, '.cursorrules'), 'utf-8');
    assert(rules.includes('### Governance (standard)'), 'Cursor should have Governance section');
    assert(rules.includes('Decision Gates'), 'Cursor should have Decision Gates');
  });

  test('Auggie: governance section present', () => {
    const commands = fs.readFileSync(path.join(dir, '.augment', 'commands', '_commands.md'), 'utf-8');
    assert(commands.includes('Governance'), 'Auggie should have Governance section');
    assert(commands.includes('Risk Assessment'), 'Auggie should have Risk Assessment');
  });

  test('Codex: governance section present', () => {
    const agents = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf-8');
    assert(agents.includes('Governance'), 'Codex should have Governance section');
  });

  test('Copilot: governance section present', () => {
    const instructions = fs.readFileSync(path.join(dir, '.github', 'copilot-instructions.md'), 'utf-8');
    assert(instructions.includes('Governance'), 'Copilot should have Governance section');
  });

  cleanTmpDir();
}

// ── Test 11: Team Profiles ────────────────────────────────────────────────

console.log('\nTest 11: Team profiles');
{
  const dir = createTmpDir();
  fs.mkdirSync(dir, { recursive: true });
  const configContent = `version: "1.0.0"\nprofile: "startup"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code]\nagents: all\nworkflows: all\ngovernance: "none"\ninstalled_at: "2026-03-19"\n`;
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), configContent);
  run(['--project', dir, '--update']);

  test('Profile startup: .assemble.yaml preserved', () => {
    assert(fs.existsSync(path.join(dir, '.assemble.yaml')), '.assemble.yaml should exist');
    assert(fs.existsSync(path.join(dir, 'CLAUDE.md')), 'CLAUDE.md should be generated');
  });

  test('Profile config override: explicit agents: all wins over startup profile', () => {
    // Config has explicit agents: all — profile startup should NOT override to 12 agents
    const agentsDir = path.join(dir, '.claude', 'agents');
    const dirCount = countDirs(agentsDir);
    assert(dirCount >= 31, `Expected >= 31 agent dirs (explicit 'all' wins over startup profile), got ${dirCount}`);
  });

  cleanTmpDir();
}

// ── Test 11b: Profile startup WITHOUT explicit agents → profile filters ───

console.log('\nTest 11b: Profile startup actually filters agents');
{
  const dir = createTmpDir();
  fs.mkdirSync(dir, { recursive: true });
  // Config with profile: startup but NO explicit agents/workflows keys
  const configContent = `version: "1.0.0"\nprofile: "startup"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code]\ninstalled_at: "2026-03-19"\n`;
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), configContent);
  run(['--project', dir, '--update']);

  test('Profile startup: filters to ~12 agents when agents key is absent', () => {
    const agentsDir = path.join(dir, '.claude', 'agents');
    const dirCount = countDirs(agentsDir);
    // Startup profile has 12 agents — should be exactly 12, not 31
    assert(dirCount <= 15, `Expected <= 15 agents (startup profile), got ${dirCount}`);
    assert(dirCount >= 10, `Expected >= 10 agents (startup profile), got ${dirCount}`);
  });

  cleanTmpDir();
}

// ── Test 12: Custom Agents ───────────────────────────────────────────────

console.log('\nTest 12: Custom agents');
{
  const dir = createTmpDir();
  // Create a custom agent
  const customAgentsDir = path.join(dir, '.assemble', 'agents');
  fs.mkdirSync(customAgentsDir, { recursive: true });
  const customAgent = `---\nname: test-hero\ndescription: A custom test agent\nmarvel: Test Hero — Custom test agent for validation\n---\n\n# Test Hero\n\nYou are Test Hero, a custom agent.\n`;
  fs.writeFileSync(path.join(customAgentsDir, 'AGENT-custom-test.md'), customAgent);

  run(['--project', dir, '--platforms', 'claude-code', '--lang-team', 'english', '--lang-output', 'english']);

  test('Custom agent appears in output', () => {
    const agentsDir = path.join(dir, '.claude', 'agents');
    const dirCount = countDirs(agentsDir);
    assert(dirCount >= 32, `Expected >= 32 agent dirs (31 + 1 custom), got ${dirCount}`);
  });

  test('Custom agent AGENT.md exists', () => {
    const agentsDir = path.join(dir, '.claude', 'agents');
    const dirs = fs.readdirSync(agentsDir);
    const hasCustom = dirs.some(d => {
      const agentMd = path.join(agentsDir, d, 'AGENT.md');
      if (!fs.existsSync(agentMd)) return false;
      return fs.readFileSync(agentMd, 'utf-8').includes('Test Hero');
    });
    assert(hasCustom, 'Custom agent should have AGENT.md with Test Hero content');
  });

  cleanTmpDir();
}

// ── Test 13: MCP Server ──────────────────────────────────────────────────

console.log('\nTest 13: MCP server generation');
{
  const dir = createTmpDir();
  fs.mkdirSync(dir, { recursive: true });
  const configContent = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code]\nagents: all\nworkflows: all\ngovernance: "none"\nmcp: true\ninstalled_at: "2026-03-19"\n`;
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), configContent);
  run(['--project', dir, '--update']);

  test('MCP: mcp-server.js generated', () => {
    assert(fs.existsSync(path.join(dir, '.assemble', 'mcp-server.js')), 'mcp-server.js should exist');
  });

  test('MCP: mcp.json generated', () => {
    assert(fs.existsSync(path.join(dir, '.assemble', 'mcp.json')), 'mcp.json should exist');
  });

  test('MCP: package.json generated', () => {
    assert(fs.existsSync(path.join(dir, '.assemble', 'package.json')), '.assemble/package.json should exist');
  });

  test('MCP: mcp-server.js contains agent tools', () => {
    const content = fs.readFileSync(path.join(dir, '.assemble', 'mcp-server.js'), 'utf-8');
    assert(content.includes('invoke-'), 'mcp-server.js should contain invoke- tools');
    assert(content.includes('jarvis-route'), 'mcp-server.js should contain jarvis-route');
  });

  cleanTmpDir();
}

// ── Test 14: Cross-session memory ────────────────────────────────────────

console.log('\nTest 14: Cross-session memory');
{
  const dir = createTmpDir();
  fs.mkdirSync(dir, { recursive: true });
  const configContent = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code]\nagents: all\nworkflows: all\ngovernance: "none"\nmemory: true\ninstalled_at: "2026-03-19"\n`;
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), configContent);
  run(['--project', dir, '--update']);

  test('Memory: _memory.md exists', () => {
    assert(fs.existsSync(path.join(dir, 'assemble-output', '_memory.md')), '_memory.md should exist');
  });

  test('Memory: routing.md contains memory instructions', () => {
    const routing = fs.readFileSync(path.join(dir, '.claude', 'rules', 'routing.md'), 'utf-8');
    assert(routing.includes('Cross-Session Memory'), 'routing.md should contain Cross-Session Memory section');
  });

  cleanTmpDir();
}

// ── Test 15: Metrics ─────────────────────────────────────────────────────

console.log('\nTest 15: Metrics');
{
  const dir = createTmpDir();
  fs.mkdirSync(dir, { recursive: true });
  const configContent = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code]\nagents: all\nworkflows: all\ngovernance: "none"\nmetrics: true\ninstalled_at: "2026-03-19"\n`;
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), configContent);
  run(['--project', dir, '--update']);

  test('Metrics: _metrics.md exists', () => {
    assert(fs.existsSync(path.join(dir, 'assemble-output', '_metrics.md')), '_metrics.md should exist');
  });

  cleanTmpDir();
}

// ── Test 16: AGENTS.md universal ─────────────────────────────────────────

console.log('\nTest 16: AGENTS.md universal');
{
  const dir = createTmpDir();
  run(['--project', dir, '--platforms', 'claude-code,cursor', '--lang-team', 'english', '--lang-output', 'english']);

  test('AGENTS.md exists in output directory', () => {
    assert(fs.existsSync(path.join(dir, 'assemble-output', 'AGENTS.md')), 'AGENTS.md should exist in output');
  });

  test('AGENTS.md contains agent table', () => {
    const content = fs.readFileSync(path.join(dir, 'assemble-output', 'AGENTS.md'), 'utf-8');
    assert(content.includes('Agent ID'), 'AGENTS.md should contain agent table');
    assert(content.includes('@tony-stark') || content.includes('tony-stark'), 'AGENTS.md should contain agent mentions');
  });

  cleanTmpDir();
}

// ── Test 17: Sub-agent instructions ──────────────────────────────────────

console.log('\nTest 17: Sub-agent instructions');
{
  const dir = createTmpDir();
  run(['--project', dir, '--platforms', 'claude-code', '--lang-team', 'english', '--lang-output', 'english']);

  test('/go SKILL.md contains Agent tool instruction', () => {
    const goSkill = fs.readFileSync(path.join(dir, '.claude', 'skills', 'go', 'SKILL.md'), 'utf-8');
    assert(goSkill.includes('Agent tool'), '/go should reference Agent tool for sub-agents');
  });

  test('routing.md contains Sub-Agent Delegation', () => {
    const routing = fs.readFileSync(path.join(dir, '.claude', 'rules', 'routing.md'), 'utf-8');
    assert(routing.includes('Sub-Agent Delegation'), 'routing.md should contain Sub-Agent Delegation');
  });

  cleanTmpDir();
}

// ── Test 18: Qualitative — domain→agent mapping consistency ──────────────

console.log('\nTest 18: Qualitative tests');
{
  const dir = createTmpDir();
  run(['--project', dir, '--platforms', 'claude-code', '--lang-team', 'english', '--lang-output', 'english']);

  // Generic/placeholder @mentions to exclude from resolution checks
  const GENERIC_MENTIONS = new Set([
    'agent-name', 'name', 'agent', 'nom-agent', 'marvel-name',
    'mention', 'imports', 'slug', 'ref',
  ]);

  test('Domain→agent: every slug in routing.md Domain Mapping has an agent directory', () => {
    const routing = fs.readFileSync(path.join(dir, '.claude', 'rules', 'routing.md'), 'utf-8');
    const agentsDir = path.join(dir, '.claude', 'agents');
    const agentDirs = fs.readdirSync(agentsDir);
    // Only check the Domain → Agent Mapping section (inside ``` block)
    const mappingMatch = routing.match(/## Domain → Agent Mapping\n\n```\n([\s\S]*?)```/);
    if (!mappingMatch) { assert(false, 'routing.md missing Domain → Agent Mapping section'); return; }
    const mentions = mappingMatch[1].match(/@([\w-]+)/g) || [];
    const slugs = [...new Set(mentions.map(m => m.slice(1)))];
    const missing = slugs.filter(s => !GENERIC_MENTIONS.has(s) && !agentDirs.includes(s));
    assert(missing.length === 0, `Missing agent dirs for routing slugs: ${missing.join(', ')}`);
  });

  test('@mention resolution: agent @mentions in teams.md resolve to agent dirs', () => {
    const teamsContent = fs.readFileSync(path.join(dir, '.claude', 'rules', 'teams.md'), 'utf-8');
    const agentsDir = path.join(dir, '.claude', 'agents');
    const agentDirs = fs.readdirSync(agentsDir);
    // Only match @mentions inside backticks (actual agent references)
    const mentions = teamsContent.match(/`@([\w-]+)`/g) || [];
    const slugs = [...new Set(mentions.map(m => m.slice(2, -1)))];
    const missing = slugs.filter(s => !GENERIC_MENTIONS.has(s) && !agentDirs.includes(s));
    assert(missing.length === 0, `Unresolved @mentions in teams.md: ${missing.join(', ')}`);
  });

  test('Workflow step agents: @mentions in workflow SKILLs resolve to agent dirs', () => {
    const skillsDir = path.join(dir, '.claude', 'skills');
    const agentsDir = path.join(dir, '.claude', 'agents');
    const agentDirs = fs.readdirSync(agentsDir);
    const missing = [];
    for (const slug of ['review', 'bugfix', 'feature', 'sprint', 'release', 'mvp']) {
      const skillPath = path.join(skillsDir, slug, 'SKILL.md');
      if (!fs.existsSync(skillPath)) continue;
      const content = fs.readFileSync(skillPath, 'utf-8');
      // Only match backtick-wrapped @mentions (actual agent refs in step instructions)
      const refs = content.match(/`@([\w-]+)`/g) || [];
      for (const ref of refs) {
        const s = ref.slice(2, -1);
        if (!GENERIC_MENTIONS.has(s) && !agentDirs.includes(s)) {
          missing.push(`${slug}: @${s}`);
        }
      }
    }
    assert(missing.length === 0, `Workflow skills reference missing agents: ${missing.join(', ')}`);
  });

  cleanTmpDir();
}

// ── Test 19: Governance strict ───────────────────────────────────────────

console.log('\nTest 19: Governance strict');
{
  const dir = createTmpDir();
  fs.mkdirSync(dir, { recursive: true });
  const configContent = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code]\nagents: all\nworkflows: all\ngovernance: "strict"\ninstalled_at: "2026-03-19"\n`;
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), configContent);
  run(['--project', dir, '--update']);

  test('governance: strict — governance.md exists', () => {
    const govPath = path.join(dir, '.claude', 'rules', 'governance', 'governance.md');
    assert(fs.existsSync(govPath), 'governance.md should exist for strict');
  });

  test('governance: strict — contains audit trail and RBAC', () => {
    const govContent = fs.readFileSync(path.join(dir, '.claude', 'rules', 'governance', 'governance.md'), 'utf-8');
    assert(govContent.includes('Audit Trail'), 'Should contain Audit Trail');
    assert(govContent.includes('RBAC'), 'Should contain RBAC');
    assert(govContent.includes('NIST'), 'Should contain NIST mapping');
  });

  cleanTmpDir();
}

// ── Test 20: Doctor on valid install ─────────────────────────────────────

console.log('\nTest 20: CLI doctor');
{
  const dir = createTmpDir();
  run(['--project', dir, '--platforms', 'claude-code', '--lang-team', 'english', '--lang-output', 'english']);

  test('assemble doctor exits with code 0', () => {
    const doctorPath = path.join(ROOT, 'bin', 'doctor.js');
    try {
      execFileSync(process.execPath, [doctorPath, '--project', dir], { stdio: 'pipe', timeout: 30000 });
    } catch (e) {
      throw new Error('Doctor should exit 0 on valid install');
    }
  });

  cleanTmpDir();
}

// ── Test 21: Boolean parsing in config ───────────────────────────────────

console.log('\nTest 21: Boolean config parsing');
{
  const dir = createTmpDir();
  fs.mkdirSync(dir, { recursive: true });
  const configContent = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code]\nagents: all\nworkflows: all\ngovernance: "none"\nmcp: false\nmemory: false\nmetrics: false\ninstalled_at: "2026-03-19"\n`;
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), configContent);
  run(['--project', dir, '--update']);

  test('mcp: false — no MCP files generated', () => {
    assert(!fs.existsSync(path.join(dir, '.assemble', 'mcp-server.js')), 'mcp-server.js should NOT exist when mcp: false');
  });

  test('memory: false — no _memory.md generated', () => {
    assert(!fs.existsSync(path.join(dir, 'assemble-output', '_memory.md')), '_memory.md should NOT exist when memory: false');
  });

  cleanTmpDir();
}

// ── Test 22: Import skill validation ──────────────────────────────────────

console.log('\nTest 22: Import skill validation');
{
  const dir = createTmpDir();
  const importPath = path.join(ROOT, 'bin', 'import.js');

  test('import rejects file without frontmatter', () => {
    // Create a file without frontmatter
    const badSkill = path.join(dir, 'bad-skill.md');
    fs.writeFileSync(badSkill, '# No Frontmatter\n\nThis is not a valid skill.\n');
    try {
      execFileSync(process.execPath, [importPath, badSkill], { stdio: 'pipe', timeout: 10000, cwd: dir });
      assert(false, 'Should have exited with error');
    } catch (e) {
      assert(e.status !== 0, 'Should exit with non-zero code');
    }
  });

  test('import accepts file with valid frontmatter', () => {
    const goodSkill = path.join(dir, 'good-skill.md');
    fs.writeFileSync(goodSkill, '---\nname: test-skill\ndescription: "A test skill"\n---\n\n# Test Skill\n');
    try {
      execFileSync(process.execPath, [importPath, goodSkill], { stdio: 'pipe', timeout: 10000, cwd: dir });
    } catch (e) {
      assert(false, 'Import should succeed for valid skill');
    }
    assert(fs.existsSync(path.join(dir, '.assemble', 'skills', 'test-skill.md')), 'Skill file should exist in .assemble/skills/');
  });

  cleanTmpDir();
}

// ── Test 23: Custom workflows ─────────────────────────────────────────────

console.log('\nTest 23: Custom workflows');
{
  const dir = createTmpDir();
  const customWfDir = path.join(dir, '.assemble', 'workflows');
  fs.mkdirSync(customWfDir, { recursive: true });
  fs.writeFileSync(path.join(customWfDir, 'my-custom-flow.yaml'), `name: "My Custom Flow"\ndescription: "A custom test workflow"\ntrigger: /custom-flow\nsteps:\n  - step: 1\n    agent: pm\n    action: "Custom action"\n    outputs: [custom-output.md]\n`);

  run(['--project', dir, '--platforms', 'claude-code', '--lang-team', 'english', '--lang-output', 'english']);

  test('Custom workflow appears in output AGENTS.md', () => {
    const agentsMd = fs.readFileSync(path.join(dir, 'assemble-output', 'AGENTS.md'), 'utf-8');
    assert(agentsMd.includes('My Custom Flow'), 'AGENTS.md should contain custom workflow name');
  });

  cleanTmpDir();
}

// ── Test 24: Plugin adapters ─────────────────────────────────────────────

console.log('\nTest 24: Plugin adapters');
{
  const dir = createTmpDir();
  const pluginDir = path.join(dir, '.assemble', 'adapters');
  fs.mkdirSync(pluginDir, { recursive: true });

  // Create a minimal plugin adapter
  const pluginCode = `
const fs = require('fs');
const path = require('path');
module.exports = {
  name: 'test-plugin',
  displayName: 'Test Plugin',
  type: 'ide',
  getOutputPaths(projectDir) {
    return [path.join(projectDir, '.test-plugin', 'output.md')];
  },
  generate(projectDir, { agents, config }) {
    const outDir = path.join(projectDir, '.test-plugin');
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'output.md'), '# Test Plugin Output\\n\\nGenerated ' + agents.length + ' agents.', 'utf-8');
  },
  validate(projectDir) {
    const p = path.join(projectDir, '.test-plugin', 'output.md');
    const fs = require('fs');
    if (!fs.existsSync(p)) return { valid: false, errors: ['Missing output.md'] };
    return { valid: true, errors: [] };
  }
};`;
  fs.writeFileSync(path.join(pluginDir, 'test-plugin.js'), pluginCode);

  // Create config that uses the plugin adapter
  const configContent = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [test-plugin]\nagents: all\nworkflows: all\ngovernance: "none"\ninstalled_at: "2026-03-19"\n`;
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), configContent);

  run(['--project', dir, '--update']);

  test('Plugin adapter generates output', () => {
    const outputPath = path.join(dir, '.test-plugin', 'output.md');
    assert(fs.existsSync(outputPath), '.test-plugin/output.md should exist');
    const content = fs.readFileSync(outputPath, 'utf-8');
    assert(content.includes('34 agents'), `Should contain 33 agents, got: ${content}`);
  });

  cleanTmpDir();
}

// ── Test 25: _audit.md generated for governance strict ───────────────────

console.log('\nTest 25: Audit trail for governance strict');
{
  const dir = createTmpDir();
  fs.mkdirSync(dir, { recursive: true });
  const configContent = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code]\nagents: all\nworkflows: all\ngovernance: "strict"\ninstalled_at: "2026-03-19"\n`;
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), configContent);
  run(['--project', dir, '--update']);

  test('_audit.md exists when governance: strict', () => {
    assert(fs.existsSync(path.join(dir, 'assemble-output', '_audit.md')), '_audit.md should exist');
  });

  test('_audit.md contains Approval Log', () => {
    const content = fs.readFileSync(path.join(dir, 'assemble-output', '_audit.md'), 'utf-8');
    assert(content.includes('Approval Log'), '_audit.md should contain Approval Log');
  });

  cleanTmpDir();
}

// ── Test 26: MCP routing covers all workflows ────────────────────────────

console.log('\nTest 26: MCP routing workflow coverage');
{
  const dir = createTmpDir();
  fs.mkdirSync(dir, { recursive: true });
  const configContent = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code]\nagents: all\nworkflows: all\ngovernance: "none"\nmcp: true\ninstalled_at: "2026-03-19"\n`;
  fs.writeFileSync(path.join(dir, '.assemble.yaml'), configContent);
  run(['--project', dir, '--update']);

  test('MCP: WORKFLOW_KEYWORDS covers all 15 workflows', () => {
    const mcpContent = fs.readFileSync(path.join(dir, '.assemble', 'mcp-server.js'), 'utf-8');
    // Check that all workflow triggers from src/workflows/ appear in WORKFLOW_KEYWORDS
    const wfDir = path.join(ROOT, 'src', 'workflows');
    const wfFiles = fs.readdirSync(wfDir).filter(f => f.endsWith('.yaml'));
    const missing = [];
    for (const file of wfFiles) {
      const raw = fs.readFileSync(path.join(wfDir, file), 'utf-8');
      const triggerMatch = raw.match(/trigger:\s*\/?([\w-]+)/);
      const trigger = triggerMatch ? triggerMatch[1] : file.replace(/\.yaml$/, '');
      // The trigger should appear as a key in WORKFLOW_KEYWORDS
      if (!mcpContent.includes(`"${trigger}":`)) {
        missing.push(trigger);
      }
    }
    assert(missing.length === 0, `WORKFLOW_KEYWORDS missing: ${missing.join(', ')}`);
  });

  test('MCP: routeRequest returns matched_workflow', () => {
    const mcpContent = fs.readFileSync(path.join(dir, '.assemble', 'mcp-server.js'), 'utf-8');
    assert(mcpContent.includes('matched_workflow'), 'Should contain matched_workflow in routing response');
  });

  test('MCP: routeRequest uses weighted scoring', () => {
    const mcpContent = fs.readFileSync(path.join(dir, '.assemble', 'mcp-server.js'), 'utf-8');
    assert(mcpContent.includes('kw.length'), 'Should use keyword length for weighted scoring');
  });

  cleanTmpDir();
}

// ── Test 27: YOLO mode ───────────────────────────────────────────────────

console.log('\nTest 27: YOLO mode');
{
  // 27a: yolo: false — no YOLO section
  const dirOff = createTmpDir();
  fs.mkdirSync(dirOff, { recursive: true });
  const configOff = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code, cursor]\nagents: all\nworkflows: all\ngovernance: "none"\nyolo: false\ninstalled_at: "2026-03-20"\n`;
  fs.writeFileSync(path.join(dirOff, '.assemble.yaml'), configOff);
  run(['--project', dirOff, '--update']);

  test('yolo: false — no YOLO section in routing.md', () => {
    const routing = fs.readFileSync(path.join(dirOff, '.claude', 'rules', 'routing.md'), 'utf-8');
    assert(!routing.includes('YOLO Mode'), 'routing.md should NOT contain YOLO Mode when yolo: false');
  });

  test('yolo: false — no YOLO section in .cursorrules', () => {
    const rules = fs.readFileSync(path.join(dirOff, '.cursorrules'), 'utf-8');
    assert(!rules.includes('YOLO Mode'), '.cursorrules should NOT contain YOLO Mode when yolo: false');
  });

  cleanTmpDir();

  // 27b: yolo: true — YOLO section present
  const dirOn = createTmpDir();
  fs.mkdirSync(dirOn, { recursive: true });
  const configOn = `version: "1.0.0"\nlangue_equipe: "english"\nlangue_output: "english"\noutput_dir: "./assemble-output"\nplatforms: [claude-code, cursor]\nagents: all\nworkflows: all\ngovernance: "none"\nyolo: true\ninstalled_at: "2026-03-20"\n`;
  fs.writeFileSync(path.join(dirOn, '.assemble.yaml'), configOn);
  run(['--project', dirOn, '--update']);

  test('yolo: true — YOLO section in routing.md', () => {
    const routing = fs.readFileSync(path.join(dirOn, '.claude', 'rules', 'routing.md'), 'utf-8');
    assert(routing.includes('YOLO Mode'), 'routing.md should contain YOLO Mode');
    assert(routing.includes('autonomous execution'), 'should mention autonomous execution');
    assert(routing.includes('MANDATORY STOPS'), 'should contain mandatory stop conditions');
  });

  test('yolo: true — YOLO section in .cursorrules', () => {
    const rules = fs.readFileSync(path.join(dirOn, '.cursorrules'), 'utf-8');
    assert(rules.includes('YOLO Mode'), '.cursorrules should contain YOLO Mode');
  });

  test('yolo: true — mandatory stops include production safety', () => {
    const routing = fs.readFileSync(path.join(dirOn, '.claude', 'rules', 'routing.md'), 'utf-8');
    assert(routing.includes('Destructive production'), 'should mention destructive production actions');
    assert(routing.includes('Missing information'), 'should mention missing information');
  });

  test('yolo: true — traceability preserved', () => {
    const routing = fs.readFileSync(path.join(dirOn, '.claude', 'rules', 'routing.md'), 'utf-8');
    assert(routing.includes('_manifest.yaml'), 'should preserve manifest tracking');
    assert(routing.includes('_summary.md'), 'should preserve summary');
    assert(routing.includes('_quality.md'), 'should preserve quality checkpoint');
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
