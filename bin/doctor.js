#!/usr/bin/env node

/**
 * Assemble — Doctor
 * Health check for an Assemble installation.
 *
 * Usage: assemble doctor [--project <path>]
 *        node bin/doctor.js [--project <path>]
 */

const fs = require('fs');
const path = require('path');

function doctor(projectDir) {
  const checks = [];
  let ok = 0;
  let warn = 0;
  let fail = 0;

  function check(name, fn) {
    try {
      const result = fn();
      if (result === true) {
        checks.push({ name, status: 'ok' });
        ok++;
      } else if (result === 'warn') {
        checks.push({ name, status: 'warn' });
        warn++;
      } else {
        checks.push({ name, status: 'fail', detail: result || 'Check failed' });
        fail++;
      }
    } catch (e) {
      checks.push({ name, status: 'fail', detail: e.message });
      fail++;
    }
  }

  // 1. Node.js version
  check('Node.js >= 18', () => {
    const major = parseInt(process.versions.node.split('.')[0], 10);
    return major >= 18 ? true : `Found v${process.versions.node}`;
  });

  // 2. .assemble.yaml exists
  check('.assemble.yaml exists', () => {
    return fs.existsSync(path.join(projectDir, '.assemble.yaml')) ? true : 'Missing — run npx create-assemble';
  });

  // 3. Config is valid YAML-ish
  check('.assemble.yaml is parseable', () => {
    const configPath = path.join(projectDir, '.assemble.yaml');
    if (!fs.existsSync(configPath)) return 'warn';
    const content = fs.readFileSync(configPath, 'utf-8');
    const hasVersion = content.includes('version:');
    const hasPlatforms = content.includes('platforms:');
    return hasVersion && hasPlatforms ? true : 'Missing required fields (version, platforms)';
  });

  // 4. Output directory exists
  check('Output directory exists', () => {
    const configPath = path.join(projectDir, '.assemble.yaml');
    if (!fs.existsSync(configPath)) return 'warn';
    const content = fs.readFileSync(configPath, 'utf-8');
    const match = content.match(/output_dir:\s*"?([^"\n]+)"?/);
    const outputDir = match ? match[1].trim() : './assemble-output';
    return fs.existsSync(path.resolve(projectDir, outputDir)) ? true : 'warn';
  });

  // 5. Platform files generated
  check('Generated files exist', () => {
    const candidates = [
      'CLAUDE.md', '.cursorrules', '.windsurfrules', '.clinerules',
      'AGENTS.md', 'GEMINI.md', 'SYSTEM.md', '.roomodes',
    ];
    const found = candidates.filter(f => fs.existsSync(path.join(projectDir, f)));
    const dirs = ['.claude', '.cursor', '.kiro', '.augment', '.gemini'];
    const foundDirs = dirs.filter(d => fs.existsSync(path.join(projectDir, d)));
    return (found.length > 0 || foundDirs.length > 0) ? true : 'No generated platform files found';
  });

  // 6. Custom agents directory
  check('Custom agents (.assemble/agents/)', () => {
    const dir = path.join(projectDir, '.assemble', 'agents');
    if (!fs.existsSync(dir)) return 'warn';
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    return files.length > 0 ? true : 'warn';
  });

  // 7. Custom skills directory
  check('Custom skills (.assemble/skills/)', () => {
    const dir = path.join(projectDir, '.assemble', 'skills');
    if (!fs.existsSync(dir)) return 'warn';
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    return files.length > 0 ? true : 'warn';
  });

  // Print results
  console.log('');
  console.log('🩺 Assemble Doctor\n');

  for (const c of checks) {
    const icon = c.status === 'ok' ? '✅' : c.status === 'warn' ? '⚠️ ' : '❌';
    const suffix = c.detail ? ` — ${c.detail}` : '';
    console.log(`  ${icon} ${c.name}${suffix}`);
  }

  console.log(`\n  ${ok} passed, ${warn} warnings, ${fail} failures\n`);

  process.exit(fail > 0 ? 1 : 0);
}

// Parse args
const args = process.argv.slice(2);
let projectDir = process.cwd();
const projIdx = args.indexOf('--project');
if (projIdx >= 0 && args[projIdx + 1]) {
  projectDir = path.resolve(args[projIdx + 1]);
}

doctor(projectDir);
