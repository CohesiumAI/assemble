/**
 * Assemble — Path confinement helpers
 * Security utilities to keep every filesystem operation inside the project
 * directory. Zero external dependencies.
 *
 * These guard against path traversal via user-controlled inputs such as
 * .assemble-manifest.json entries, config.output_dir, and imported skill names.
 */

const fs = require('fs');
const path = require('path');

/**
 * Resolve `target` relative to `projectDir` and check it stays inside it.
 * NOTE: this is a purely LEXICAL check — it does not resolve symlinks or
 * Windows junctions. Use it where the operation cannot follow a link out of
 * the project (e.g. deleting a manifest entry: unlink removes the link itself,
 * not its target). For operations that WRITE through a path — where a junction
 * could redirect the write outside the project — use {@link isRealPathInside}.
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
 * Like {@link isInsideProject} but resolves symlinks / Windows junctions so a
 * link inside the project pointing outside cannot smuggle a write out. The
 * target may not exist yet, so we realpath the nearest existing ancestor and
 * re-attach the remaining segments. Falls back to the lexical check when the
 * project directory itself does not exist (nothing to bypass yet).
 * @param {string} target
 * @param {string} projectDir
 * @returns {boolean}
 */
function isRealPathInside(target, projectDir) {
  let realRoot;
  try { realRoot = fs.realpathSync(path.resolve(projectDir)); }
  catch (e) { return isInsideProject(target, projectDir); }

  const resolved = path.resolve(realRoot, target);
  let existing = resolved;
  while (!fs.existsSync(existing)) {
    const parent = path.dirname(existing);
    if (parent === existing) break;
    existing = parent;
  }
  let realExisting;
  try { realExisting = fs.realpathSync(existing); } catch (e) { realExisting = existing; }
  const rest = path.relative(existing, resolved);
  const realFull = rest ? path.resolve(realExisting, rest) : realExisting;
  return realFull === realRoot || realFull.startsWith(realRoot + path.sep);
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

module.exports = { isInsideProject, isRealPathInside, assertInsideProject, safeSlug };
