/**
 * Assemble — Configuration Loader
 * Parses .assemble.yaml files with boolean support and explicit key tracking.
 */

const fs = require('fs');

const DEFAULTS = {
  langue_equipe: 'français',
  langue_output: 'français',
  output_dir: './assemble-output',
  platforms: [],
  agents: 'all',
  workflows: 'all'
};

/**
 * Load and parse an .assemble.yaml config file.
 * @param {string} configPath - Path to the config file
 * @returns {object} - Parsed config with _explicitKeys Set
 */
function loadConfig(configPath) {
  if (!configPath || !fs.existsSync(configPath)) {
    return { ...DEFAULTS };
  }

  const raw = fs.readFileSync(configPath, 'utf-8');
  const config = { ...DEFAULTS };
  const explicitKeys = new Set();

  for (const line of raw.split('\n')) {
    const match = line.match(/^(\w[\w_]*):\s*(.+)$/);
    if (!match) continue;

    const [, key, value] = match;
    explicitKeys.add(key);
    if (value.startsWith('[')) {
      config[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/["']/g, ''));
    } else if (value === 'all') {
      config[key] = 'all';
    } else {
      const cleaned = value.replace(/["']/g, '').trim();
      if (cleaned === 'true') config[key] = true;
      else if (cleaned === 'false') config[key] = false;
      else config[key] = cleaned;
    }
  }

  config._explicitKeys = explicitKeys;
  return config;
}

module.exports = { loadConfig, DEFAULTS };
