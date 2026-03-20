#!/usr/bin/env node

/**
 * Assemble — Unit Tests
 * Tests individual functions in isolation.
 */

const path = require('path');
const fs = require('fs');
const os = require('os');

let passed = 0;
let failed = 0;

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

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log('  Assemble — Unit Tests');
console.log('═══════════════════════════════════════════════════════');
console.log('');

// ─── resolveProfile ──────────────────────────────────────────────────────

const { PROFILES, resolveProfile } = require('../generator/lib/profiles');

console.log('resolveProfile()');

test('custom profile returns config unchanged', () => {
  const config = { profile: 'custom', agents: 'all', workflows: 'all' };
  const result = resolveProfile(config);
  assert(result.agents === 'all', 'agents should stay all');
});

test('startup profile applies agent filter when agents key is absent', () => {
  const config = { profile: 'startup', _explicitKeys: new Set(['profile']) };
  const result = resolveProfile(config);
  assert(result.agents !== 'all', `agents should not be 'all', got: ${result.agents}`);
  assert(result.agents.includes('pm'), 'startup should include pm');
  assert(!result.agents.includes('legal'), 'startup should not include legal');
});

test('startup profile does NOT override explicit agents: all', () => {
  const config = { profile: 'startup', agents: 'all', _explicitKeys: new Set(['profile', 'agents']) };
  const result = resolveProfile(config);
  assert(result.agents === 'all', `explicit agents: all should win, got: ${result.agents}`);
});

test('enterprise profile sets governance to strict by default', () => {
  const config = { profile: 'enterprise', _explicitKeys: new Set(['profile']) };
  const result = resolveProfile(config);
  assert(result.governance === 'strict', `expected strict, got: ${result.governance}`);
});

test('agency profile selects marketing-focused agents', () => {
  const config = { profile: 'agency', _explicitKeys: new Set(['profile']) };
  const result = resolveProfile(config);
  assert(result.agents.includes('marketing'), 'agency should include marketing');
  assert(result.agents.includes('seo'), 'agency should include seo');
});

test('enterprise profile governance can be overridden to none via explicit key', () => {
  // Simulates: user picks enterprise, then forces governance: none in wizard
  // The yaml will have governance: "none" explicitly → _explicitKeys has it → profile doesn't override
  const config = { profile: 'enterprise', governance: 'none', _explicitKeys: new Set(['profile', 'governance']) };
  const result = resolveProfile(config);
  assert(result.governance === 'none', `explicit governance: none should win over enterprise default strict, got: ${result.governance}`);
});

test('unknown profile returns config unchanged', () => {
  const config = { profile: 'nonexistent', agents: 'all' };
  const result = resolveProfile(config);
  assert(result.agents === 'all', 'unknown profile should not change agents');
});

// ─── renderGovernanceRules ───────────────────────────────────────────────

const { renderGovernanceRules } = require('../generator/lib/template-engine');

console.log('\nrenderGovernanceRules()');

test('standard level has Decision Gates and Risk Assessment', () => {
  const out = renderGovernanceRules('standard');
  assert(out.includes('Decision Gates'), 'missing Decision Gates');
  assert(out.includes('Risk Assessment'), 'missing Risk Assessment');
  assert(out.includes('Quality Checkpoints'), 'missing Quality Checkpoints');
  assert(out.includes('Standard Level Behavior'), 'missing Standard Level');
  assert(!out.includes('Audit Trail'), 'standard should NOT have Audit Trail');
});

test('strict level has Audit Trail, RBAC, and NIST', () => {
  const out = renderGovernanceRules('strict');
  assert(out.includes('Audit Trail'), 'missing Audit Trail');
  assert(out.includes('RBAC'), 'missing RBAC');
  assert(out.includes('NIST'), 'missing NIST');
  assert(out.includes('Strict Level Behavior'), 'missing Strict Level');
  assert(out.includes('includes everything from Standard'), 'should mention Standard');
});

test('strict level still has Decision Gates (inherited from common)', () => {
  const out = renderGovernanceRules('strict');
  assert(out.includes('Decision Gates'), 'strict should inherit Decision Gates');
  assert(out.includes('Risk Assessment'), 'strict should inherit Risk Assessment');
});

// ─── renderCommandRegistry ──────────────────────────────────────────────

const { renderCommandRegistry } = require('../generator/lib/template-engine');

console.log('\nrenderCommandRegistry()');

test('governance none produces no Governance section', () => {
  const out = renderCommandRegistry([], {}, [], 'none');
  assert(!out.includes('### Governance'), 'none should have no Governance section');
});

test('governance standard produces Governance section', () => {
  const out = renderCommandRegistry([], {}, [], 'standard');
  assert(out.includes('### Governance (standard)'), 'missing Governance header');
  assert(out.includes('Decision Gates'), 'missing Decision Gates');
});

test('governance strict produces RBAC Notice', () => {
  const out = renderCommandRegistry([], {}, [], 'strict');
  assert(out.includes('RBAC Notice'), 'missing RBAC Notice');
});

// ─── renderMemoryInstructions / renderMetricsTemplate ────────────────────

const { renderMemoryInstructions, renderMetricsTemplate } = require('../generator/lib/template-engine');

console.log('\nrenderMemoryInstructions() / renderMetricsTemplate()');

test('memory: false returns empty string', () => {
  assert(renderMemoryInstructions({ memory: false }) === '', 'should be empty');
});

test('memory: true returns instructions with _memory.md and validation', () => {
  const out = renderMemoryInstructions({ memory: true, output_dir: './out' });
  assert(out.includes('Cross-Session Memory'), 'missing header');
  assert(out.includes('./out/_memory.md'), 'missing path');
  assert(out.includes('Validation'), 'missing validation instruction');
});

test('metrics: false returns empty string', () => {
  assert(renderMetricsTemplate({ metrics: false }) === '', 'should be empty');
});

test('metrics: true returns instructions with _metrics.md and validation', () => {
  const out = renderMetricsTemplate({ metrics: true, output_dir: './out' });
  assert(out.includes('Metrics & Observability'), 'missing header');
  assert(out.includes('./out/_metrics.md'), 'missing path');
  assert(out.includes('Validation'), 'missing validation instruction');
});

// ─── renderRoutingRules ─────────────────────────────────────────────────

const { renderRoutingRules } = require('../generator/lib/template-engine');

console.log('\nrenderRoutingRules()');

test('includes Sub-Agent Delegation section', () => {
  const out = renderRoutingRules([], []);
  assert(out.includes('Sub-Agent Delegation'), 'missing Sub-Agent Delegation');
});

test('with config.memory appends memory section', () => {
  const out = renderRoutingRules([], [], { memory: true, output_dir: './out' });
  assert(out.includes('Cross-Session Memory'), 'missing memory section');
});

test('without config does not append memory/metrics', () => {
  const out = renderRoutingRules([], []);
  assert(!out.includes('Cross-Session Memory'), 'should not have memory');
  assert(!out.includes('Metrics & Observability'), 'should not have metrics');
});

// ─── loadConfig ─────────────────────────────────────────────────────────

// ─── loadConfig (real function, not inline copy) ────────────────────────────

const { loadConfig } = require('../generator/lib/config-loader');

console.log('\nloadConfig()');

test('loadConfig parses booleans correctly', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-unit-'));
  const configPath = path.join(tmpDir, 'test.yaml');
  fs.writeFileSync(configPath, 'mcp: true\nmemory: false\nmetrics: true\n');

  const config = loadConfig(configPath);

  assert(config.mcp === true, `mcp should be true, got: ${config.mcp}`);
  assert(config.memory === false, `memory should be false, got: ${config.memory}`);
  assert(config.metrics === true, `metrics should be true, got: ${config.metrics}`);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('loadConfig tracks explicit keys via _explicitKeys', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-unit-'));
  const configPath = path.join(tmpDir, 'test.yaml');
  fs.writeFileSync(configPath, 'agents: all\nprofile: startup\n');

  const config = loadConfig(configPath);

  assert(config._explicitKeys instanceof Set, '_explicitKeys should be a Set');
  assert(config._explicitKeys.has('agents'), 'should track agents');
  assert(config._explicitKeys.has('profile'), 'should track profile');
  assert(!config._explicitKeys.has('workflows'), 'should not track absent workflows');
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('loadConfig returns DEFAULTS when file does not exist', () => {
  const config = loadConfig('/nonexistent/path.yaml');
  assert(config.langue_equipe === 'english', 'should have default langue_equipe');
  assert(config.agents === 'all', 'should have default agents');
  assert(Array.isArray(config.platforms), 'platforms should be array');
});

test('loadConfig parses arrays correctly', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-unit-'));
  const configPath = path.join(tmpDir, 'test.yaml');
  fs.writeFileSync(configPath, 'platforms: [claude-code, cursor, kiro]\n');

  const config = loadConfig(configPath);

  assert(Array.isArray(config.platforms), 'platforms should be array');
  assert(config.platforms.length === 3, `expected 3 platforms, got ${config.platforms.length}`);
  assert(config.platforms[0] === 'claude-code', `first platform should be claude-code, got ${config.platforms[0]}`);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ─── parseWorkflowSteps ─────────────────────────────────────────────────

const { parseWorkflowSteps } = require('../generator/lib/template-engine');

console.log('\nparseWorkflowSteps()');

test('parses steps from YAML', () => {
  const yaml = `- step: 1\n  agent: pm\n  action: "Define scope"\n  outputs: [spec.md]\n- step: 2\n  agent: architect\n  action: "Design"\n  inputs: [spec.md]\n  depends_on: [1]\n  outputs: [plan.md]`;
  const steps = parseWorkflowSteps(yaml);
  assert(steps.length === 2, `expected 2 steps, got ${steps.length}`);
  assert(steps[0].agent === 'pm', `step 1 agent should be pm, got ${steps[0].agent}`);
  assert(steps[1].inputs.length === 1, 'step 2 should have 1 input');
  assert(steps[1].depends_on[0] === '1', 'step 2 should depend on 1');
});

test('returns empty array for empty input', () => {
  assert(parseWorkflowSteps('').length === 0, 'should be empty');
  assert(parseWorkflowSteps(null).length === 0, 'null should be empty');
});

// ─── Summary ─────────────────────────────────────────────────────────────

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════════════════');
console.log('');

process.exit(failed > 0 ? 1 : 0);
