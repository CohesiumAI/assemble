#!/usr/bin/env node

/**
 * Assemble — Import Skills
 * Copies a skill file into .assemble/skills/ for use during generation.
 *
 * Usage: npx cohesiumai-assemble import <path-to-skill.md>
 *        node bin/import.js <path-to-skill.md>
 */

const fs = require('fs');
const path = require('path');
const { assertSafePath, assertSafePaths, safeSlug } = require('../generator/lib/paths');

// Exported for direct invocation from cli.js
module.exports = { importSkill };

function importSkill(filePath) {
  // Resolve the path
  const resolved = path.resolve(filePath);

  if (!fs.existsSync(resolved)) {
    console.error(`❌ File not found: ${resolved}`);
    process.exit(1);
  }

  // Read and validate frontmatter
  const content = fs.readFileSync(resolved, 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!fmMatch) {
    console.error('❌ Invalid skill file: missing YAML frontmatter (---)');
    console.error('   Expected format:');
    console.error('   ---');
    console.error('   name: my-skill');
    console.error('   description: "What this skill does"');
    console.error('   ---');
    process.exit(1);
  }

  // Extract name from frontmatter
  const nameMatch = fmMatch[1].match(/name:\s*"?([^"\n]+)"?/);
  if (!nameMatch) {
    console.error('❌ Invalid skill file: frontmatter must contain a "name" field');
    process.exit(1);
  }

  // SECURITY: the frontmatter "name" is attacker-controlled when importing a
  // third-party skill. safeSlug() strips any directory component and traversal
  // ("../../../x") so the write can only land inside .assemble/skills/.
  const skillName = safeSlug(nameMatch[1]);
  if (!skillName) {
    console.error('❌ Invalid skill "name": produces an empty file name after sanitization.');
    process.exit(1);
  }

  // Create .assemble/skills/ directory
  const projectDir = process.cwd();
  const skillsDir = path.join(projectDir, '.assemble', 'skills');
  const destPath = path.join(skillsDir, `${skillName}.md`);
  try {
    assertSafePaths([skillsDir, destPath], projectDir, 'Imported skill output');
  } catch (error) {
    throw new Error(`Skill import refused: ${error.message}`);
  }
  fs.mkdirSync(skillsDir, { recursive: true });

  // Copy the file
  assertSafePath(destPath, projectDir, 'Imported skill output');
  fs.writeFileSync(destPath, content, 'utf-8');

  console.log(`✅ Skill "${skillName}" imported to .assemble/skills/${skillName}.md`);
  console.log('   Run `npx cohesiumai-assemble --update` to include it in generation.');
}

// CLI entry point (only runs when executed directly, not when required)
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: npx cohesiumai-assemble import <path-to-skill.md>');
    console.log('');
    console.log('Imports a skill file into .assemble/skills/ for inclusion during generation.');
    console.log('The skill file must have YAML frontmatter with at least a "name" field.');
    process.exit(0);
  }
  importSkill(args[0]);
}
