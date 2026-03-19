/**
 * Assemble — Output Validator
 * Validates generated files by delegating to each adapter's own validate() method.
 */

const fs = require('fs');
const path = require('path');

/**
 * Load all adapters dynamically (same logic as generate.js).
 */
function loadAdapters() {
  const adapters = {};
  const adaptersDir = path.resolve(__dirname, '..', 'adapters');

  for (const subdir of ['ide', 'cli']) {
    const dir = path.join(adaptersDir, subdir);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.js'))) {
      try {
        const adapter = require(path.join(dir, file));
        adapters[adapter.name] = adapter;
      } catch (err) {
        // Skip adapters that fail to load
      }
    }
  }

  return adapters;
}

/**
 * Validate the output of a generation run for the given platforms.
 * Delegates to each adapter's validate() method.
 *
 * @param {string} projectDir - The project directory that was generated into
 * @param {string[]} platforms - List of platform names to validate
 * @returns {{ valid: boolean, results: object }}
 */
function validateOutput(projectDir, platforms) {
  const adapters = loadAdapters();
  const results = {};
  let allValid = true;

  for (const platformName of platforms) {
    const adapter = adapters[platformName];

    if (!adapter) {
      results[platformName] = { valid: false, errors: [`Unknown adapter: ${platformName}`] };
      allValid = false;
      continue;
    }

    if (typeof adapter.validate !== 'function') {
      results[platformName] = { valid: true, errors: [], warnings: ['No validate() method — skipped'] };
      continue;
    }

    try {
      const result = adapter.validate(projectDir);
      results[platformName] = result;
      if (!result.valid) {
        allValid = false;
      }
    } catch (err) {
      results[platformName] = { valid: false, errors: [`Validation error: ${err.message}`] };
      allValid = false;
    }
  }

  return { valid: allValid, results };
}

/**
 * Recursively get all files in a directory.
 */
function getAllFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

module.exports = {
  validateOutput,
  getAllFiles,
};
