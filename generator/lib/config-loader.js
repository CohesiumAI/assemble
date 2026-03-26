/**
 * Assemble — Configuration Loader
 * Parses .assemble.yaml files with boolean support and explicit key tracking.
 * Zero external dependencies.
 */

const fs = require('fs');
const { parseFlatYaml, normalizeLineEndings } = require('./parser');

const DEFAULTS = {
  langue_equipe: 'english',
  langue_output: 'english',
  output_dir: './assemble-output',
  platforms: [],
  agents: 'all',
  workflows: 'all',
  yolo: false
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

  const raw = normalizeLineEndings(fs.readFileSync(configPath, 'utf-8'));
  const config = { ...DEFAULTS };
  const explicitKeys = new Set();

  const parsed = parseFlatYaml(raw);

  for (const [key, value] of Object.entries(parsed)) {
    if (key.startsWith('_')) continue;
    explicitKeys.add(key);
    config[key] = value;
  }

  config._explicitKeys = explicitKeys;
  return config;
}

module.exports = { loadConfig, DEFAULTS };
