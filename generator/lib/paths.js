/**
 * Assemble — Path confinement helpers
 * Security utilities to keep every filesystem operation inside the project
 * directory. Zero external dependencies.
 *
 * These guard against path traversal via user-controlled inputs such as
 * .assemble-manifest.json entries, config.output_dir, and imported skill names.
 */

const path = require('path');

/**
 * Resolve `target` relative to `projectDir` and check it stays inside it.
 * @param {string} target - Path to resolve (relative or absolute)
 * @param {string} projectDir - Confinement root
 * @returns {boolean} true if the resolved path is inside (or equal to) projectDir
 */
function isInsideProject(target, projectDir) {
  const root = path.resolve(projectDir);
  const resolved = path.resolve(root, target);
  return resolved === root || resolved.startsWith(root + path.sep);
}

/**
 * Like {@link isInsideProject} but throws a descriptive error when the path
 * escapes the project directory.
 * @param {string} target
 * @param {string} projectDir
 * @param {string} [label='Path']
 * @returns {string} the resolved, confined path
 */
function assertInsideProject(target, projectDir, label = 'Path') {
  if (!isInsideProject(target, projectDir)) {
    throw new Error(`${label} escapes the project directory: ${target}`);
  }
  return path.resolve(projectDir, target);
}

/**
 * Reduce an arbitrary, possibly hostile string to a safe single path segment.
 * Strips directory separators and traversal, keeping only the basename.
 * @param {string} name
 * @returns {string} a safe slug with no separators or ".."
 */
function safeSlug(name) {
  // basename removes any directory component, then strip residual separators/dots-only
  const base = path.basename(String(name).trim());
  const slug = base
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[/\\]/g, '')
    .replace(/^\.+/, ''); // no leading dots (e.g. "..", ".hidden")
  return slug;
}

module.exports = { isInsideProject, assertInsideProject, safeSlug };
