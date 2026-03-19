#!/usr/bin/env node

/**
 * Assemble — Import Skills
 * Copies a skill file into .assemble/skills/ for use during generation.
 *
 * Usage: npx create-assemble import <path-to-skill.md>
 *        node bin/import.js <path-to-skill.md>
 */

const fs = require('fs');
const path = require('path');

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

  const skillName = nameMatch[1].trim().toLowerCase().replace(/\s+/g, '-');

  // Create .assemble/skills/ directory
  const skillsDir = path.join(process.cwd(), '.assemble', 'skills');
  fs.mkdirSync(skillsDir, { recursive: true });

  // Copy the file
  const destPath = path.join(skillsDir, `${skillName}.md`);
  fs.writeFileSync(destPath, content, 'utf-8');

  console.log(`✅ Skill "${skillName}" imported to .assemble/skills/${skillName}.md`);
  console.log('   Run `npx create-assemble --update` to include it in generation.');
}

// CLI entry point (only runs when executed directly, not when required)
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: npx create-assemble import <path-to-skill.md>');
    console.log('');
    console.log('Imports a skill file into .assemble/skills/ for inclusion during generation.');
    console.log('The skill file must have YAML frontmatter with at least a "name" field.');
    process.exit(0);
  }
  importSkill(args[0]);
}
