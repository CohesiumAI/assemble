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

// ─── schema-validator ───────────────────────────────────────────────────

const { validateAgent, validateWorkflow, validateSkill, validateConfig, validateAll } = require('../generator/lib/schema-validator');

console.log('\nvalidateAgent()');

test('valid agent passes validation', () => {
  const agent = {
    meta: { name: 'tony-stark', description: 'Architect', marvel: 'Tony Stark' },
    content: 'A'.repeat(60),
    sections: { 'Identity': 'I am Tony Stark' },
    fileName: 'AGENT-architect.md',
  };
  const result = validateAgent(agent);
  assert(result.valid, `expected valid, got errors: ${result.errors.join(', ')}`);
});

test('agent missing required fields fails', () => {
  const agent = { meta: { name: 'test' }, content: 'short', sections: {}, fileName: 'AGENT-test.md' };
  const result = validateAgent(agent);
  assert(!result.valid, 'should fail');
  assert(result.errors.some(e => e.includes('description')), 'should mention description');
  assert(result.errors.some(e => e.includes('marvel')), 'should mention marvel');
});

console.log('\nvalidateWorkflow()');

test('valid workflow passes validation', () => {
  const wf = {
    raw: 'name: test-wf\ndescription: "Test workflow"\ntrigger: /test\nsteps:\n  - step: 1\n    agent: pm\n    action: "Do something"\n    outputs: [spec.md]\n',
    fileName: 'test-wf.yaml',
  };
  const result = validateWorkflow(wf, ['pm', 'architect']);
  assert(result.valid, `expected valid, got errors: ${result.errors.join(', ')}`);
});

test('workflow with unknown agent produces warning', () => {
  const wf = {
    raw: 'name: test-wf\ndescription: "Test"\ntrigger: /test\nsteps:\n  - step: 1\n    agent: nonexistent\n    action: "Do"\n    outputs: [out.md]\n',
    fileName: 'test-wf.yaml',
  };
  const result = validateWorkflow(wf, ['pm', 'architect']);
  assert(result.valid, 'should be valid (unknown agent is a warning, not error)');
  assert(result.warnings.some(w => w.includes('nonexistent')), 'should warn about unknown agent');
});

test('workflow with invalid YAML fails', () => {
  const wf = { raw: '{{invalid yaml', fileName: 'bad.yaml' };
  const result = validateWorkflow(wf);
  assert(!result.valid, 'should fail');
});

console.log('\nvalidateConfig()');

test('valid config passes', () => {
  const config = { governance: 'standard', profile: 'startup', platforms: ['cursor', 'claude-code'] };
  const result = validateConfig(config);
  assert(result.valid, `expected valid, got errors: ${result.errors.join(', ')}`);
});

test('invalid governance enum fails', () => {
  const config = { governance: 'ultra', profile: 'custom' };
  const result = validateConfig(config);
  assert(!result.valid, 'should fail');
  assert(result.errors.some(e => e.includes('governance')), 'should mention governance');
});

test('unknown platform produces warning', () => {
  const config = { platforms: ['cursor', 'unknown-ide'] };
  const result = validateConfig(config);
  assert(result.warnings.some(w => w.includes('unknown-ide')), 'should warn about unknown platform');
});

console.log('\nvalidateAll()');

test('validates full source set', () => {
  const agents = [{
    meta: { name: 'pm', description: 'Product Manager', marvel: 'Professor X' },
    content: 'A'.repeat(60),
    sections: { 'Identity': 'I am PM' },
    fileName: 'AGENT-pm.md',
  }];
  const skills = { shared: [], specific: [] };
  const workflows = [{
    raw: 'name: test\ndescription: "Test"\ntrigger: /test\nsteps:\n  - step: 1\n    agent: pm\n    action: "Plan"\n    outputs: [plan.md]\n',
    fileName: 'test.yaml',
  }];
  const config = { governance: 'none', profile: 'custom', platforms: ['cursor'] };
  const result = validateAll({ agents, skills, workflows, config });
  assert(result.valid, `expected valid, got errors: ${result.errors.join(', ')}`);
});

// ─── loadConfig — robust YAML parsing ───────────────────────────────────

console.log('\nloadConfig() — robust YAML parsing');

test('loadConfig handles YAML with colons in values', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-unit-'));
  const configPath = path.join(tmpDir, 'test.yaml');
  fs.writeFileSync(configPath, 'output_dir: "./my-output"\ndescription: "A tool: for agents"\n');

  const config = loadConfig(configPath);

  assert(config.output_dir === './my-output', `output_dir should be ./my-output, got: ${config.output_dir}`);
  assert(config.description === 'A tool: for agents', `description should handle colons, got: ${config.description}`);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('loadConfig handles Windows-style line endings', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-unit-'));
  const configPath = path.join(tmpDir, 'test.yaml');
  fs.writeFileSync(configPath, 'mcp: true\r\nmemory: false\r\nplatforms: [cursor, cline]\r\n');

  const config = loadConfig(configPath);

  assert(config.mcp === true, `mcp should be true, got: ${config.mcp}`);
  assert(config.memory === false, `memory should be false, got: ${config.memory}`);
  assert(Array.isArray(config.platforms), 'platforms should be array');
  assert(config.platforms.length === 2, `expected 2 platforms, got ${config.platforms.length}`);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ─── loadConfig: YAML list format for agents/workflows ──────────────────

console.log('\nloadConfig() — YAML list format');

test('loadConfig returns arrays for YAML sequence agents', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-unit-'));
  const configPath = path.join(tmpDir, 'test.yaml');
  fs.writeFileSync(configPath, 'agents:\n  - pm\n  - architect\n  - qa\n');

  const config = loadConfig(configPath);

  assert(Array.isArray(config.agents), `agents should be array, got: ${typeof config.agents}`);
  assert(config.agents.length === 3, `expected 3 agents, got ${config.agents.length}`);
  assert(config.agents[0] === 'pm', `first agent should be pm, got ${config.agents[0]}`);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('loadConfig returns arrays for YAML sequence workflows', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'assemble-unit-'));
  const configPath = path.join(tmpDir, 'test.yaml');
  fs.writeFileSync(configPath, 'workflows:\n  - bug-fix\n  - feature-development\n');

  const config = loadConfig(configPath);

  assert(Array.isArray(config.workflows), `workflows should be array, got: ${typeof config.workflows}`);
  assert(config.workflows.length === 2, `expected 2 workflows, got ${config.workflows.length}`);
  assert(config.workflows.includes('bug-fix'), 'should include bug-fix');
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ─── resolveProfile: arrays preserved ───────────────────────────────────

console.log('\nresolveProfile() — array preservation');

test('startup profile returns agents as array', () => {
  const config = { profile: 'startup', _explicitKeys: new Set(['profile']) };
  const result = resolveProfile(config);
  assert(Array.isArray(result.agents), `agents should be array, got: ${typeof result.agents}`);
  assert(result.agents.includes('pm'), 'startup agents should include pm');
});

// ─── parseFlatYaml ──────────────────────────────────────────────────────

const { parseFlatYaml, normalizeLineEndings } = require('../generator/lib/parser');

console.log('\nparseFlatYaml()');

test('handles frontmatter with unquoted colons', () => {
  const input = 'name: my-skill\ndescription: A tool: for agents: everywhere';
  const result = parseFlatYaml(input);
  assert(result.name === 'my-skill', `name should be my-skill, got: ${result.name}`);
  assert(result.description.includes('A tool'), `description should start with A tool, got: ${result.description}`);
});

test('handles CRLF line endings', () => {
  const input = 'name: test\r\ndescription: hello world\r\n';
  const result = parseFlatYaml(normalizeLineEndings(input));
  assert(result.name === 'test', `name should be test, got: ${result.name}`);
  assert(result.description === 'hello world', `description should be hello world, got: ${result.description}`);
});

test('handles YAML sequence format', () => {
  const input = 'agents:\n  - pm\n  - architect\n  - qa\n';
  const result = parseFlatYaml(input);
  assert(Array.isArray(result.agents), `agents should be array, got: ${typeof result.agents}`);
  assert(result.agents.length === 3, `expected 3 agents, got ${result.agents.length}`);
  assert(result.agents[0] === 'pm', `first should be pm, got ${result.agents[0]}`);
});

// ─── renderSearchInstructions ───────────────────────────────────────────

const { renderSearchInstructions } = require('../generator/lib/template-engine');

console.log('\nrenderSearchInstructions()');

test('search: false returns empty string', () => {
  const out = renderSearchInstructions({ search: false });
  assert(out === '', `should be empty, got: "${out}"`);
});

test('search: true returns non-empty string containing Web Search', () => {
  const out = renderSearchInstructions({ search: true });
  assert(out.length > 0, 'should be non-empty');
  assert(out.includes('Web Search'), `should contain "Web Search", got: "${out.substring(0, 80)}..."`);
});

// ─── prepareAgent: search strip ─────────────────────────────────────────

const { prepareAgent } = require('../generator/lib/template-engine');

console.log('\nprepareAgent() — search strip');

test('search: false strips content between SEARCH markers', () => {
  const agent = {
    meta: { name: 'test-agent', description: 'Test', marvel: 'Test' },
    content: 'Before\n\n<!-- SEARCH:START -->\n## Research Protocol\n\nSearch stuff here.\n<!-- SEARCH:END -->\n\nAfter',
    sections: {},
    fileName: 'AGENT-test.md',
  };
  const config = { search: false, langue_equipe: 'english', output_dir: './assemble-output' };
  const result = prepareAgent(agent, config);
  assert(!result.content.includes('SEARCH:START'), 'should not contain SEARCH:START');
  assert(!result.content.includes('Research Protocol'), 'should not contain Research Protocol');
  assert(result.content.includes('Before'), 'should preserve content before markers');
  assert(result.content.includes('After'), 'should preserve content after markers');
});

test('search: true preserves content between SEARCH markers', () => {
  const agent = {
    meta: { name: 'test-agent', description: 'Test', marvel: 'Test' },
    content: 'Before\n\n<!-- SEARCH:START -->\n## Research Protocol\n\nSearch stuff here.\n<!-- SEARCH:END -->\n\nAfter',
    sections: {},
    fileName: 'AGENT-test.md',
  };
  const config = { search: true, langue_equipe: 'english', output_dir: './assemble-output' };
  const result = prepareAgent(agent, config);
  assert(result.content.includes('SEARCH:START'), 'should contain SEARCH:START');
  assert(result.content.includes('Research Protocol'), 'should contain Research Protocol');
  assert(result.content.includes('SEARCH:END'), 'should contain SEARCH:END');
});

// ─── renderRoutingRules: search section ─────────────────────────────────

console.log('\nrenderRoutingRules() — search section');

test('search: true includes Web Search Policy in routing rules', () => {
  const out = renderRoutingRules([], [], { search: true });
  assert(out.includes('Web Search'), 'should contain Web Search when search is true');
});

test('search: false does not include Web Search Policy in routing rules', () => {
  const out = renderRoutingRules([], [], { search: false });
  assert(!out.includes('Web Search Policy'), 'should not contain Web Search Policy when search is false');
});

test('no config.search does not include Web Search Policy', () => {
  const out = renderRoutingRules([], [], {});
  assert(!out.includes('Web Search Policy'), 'should not contain Web Search Policy when search is absent');
});

// ─── Summary ─────────────────────────────────────────────────────────────

console.log('');
console.log('═══════════════════════════════════════════════════════');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════════════════════');
console.log('');

process.exit(failed > 0 ? 1 : 0);
