/**
 * Assemble — Path confinement helpers
 * Security utilities to keep every filesystem operation inside the project
 * directory. Zero external dependencies.
 *
 * These guard against path traversal via user-controlled inputs such as
 * .assemble-manifest.json entries, config.output_dir, and imported skill names.
 * Mutating callers must use assertSafePath() immediately before the filesystem
 * operation: lexical containment alone is not sufficient when an ancestor can
 * be a symbolic link or Windows junction.
 */

const fs = require('fs');
const path = require('path');

/**
 * Resolve `target` relative to `projectDir` and check it stays inside it.
 * NOTE: this is a purely LEXICAL check — it does not resolve symlinks or
 * Windows junctions. It is suitable for comparisons only. Filesystem mutations
 * must use {@link assertSafePath}.
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
 * Boolean compatibility wrapper around {@link assertSafePath}.
 * @param {string} target
 * @param {string} projectDir
 * @returns {boolean}
 */
function isRealPathInside(target, projectDir) {
  try {
    assertSafePath(target, projectDir);
    return true;
  } catch {
    return false;
  }
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
 * Resolve a target inside a trusted root and reject every existing symbolic
 * link or Windows junction from the first child of the root through the final
 * target. The nearest existing ancestors are also realpath-checked so unusual
 * reparse/mount behaviour fails closed.
 *
 * Non-existent descendants are accepted: mkdir/write callers need to create
 * them. The confinement root itself must already exist and is treated as the
 * trust boundary selected by the caller.
 *
 * @param {string} target - Relative or absolute target path
 * @param {string} projectDir - Existing confinement root
 * @param {string} [label='Path'] - Human-readable operation label
 * @returns {string} resolved target path
 */
function assertSafePath(target, projectDir, label = 'Path') {
  const root = path.resolve(projectDir);
  const resolved = assertInsideProject(target, root, label);

  let rootStat;
  try {
    rootStat = fs.statSync(root);
  } catch (error) {
    throw new Error(`${label} cannot be validated because the confinement root is unavailable: ${error.message}`);
  }
  if (!rootStat.isDirectory()) {
    throw new Error(`${label} cannot be validated because the confinement root is not a directory: ${root}`);
  }

  let realRoot;
  try {
    realRoot = fs.realpathSync(root);
  } catch (error) {
    throw new Error(`${label} cannot resolve the confinement root: ${error.message}`);
  }

  const relative = path.relative(root, resolved);
  if (!relative) return resolved;

  const segments = relative.split(path.sep).filter(Boolean);
  let current = root;
  for (let index = 0; index < segments.length; index++) {
    current = path.join(current, segments[index]);

    let stat;
    try {
      stat = fs.lstatSync(current);
    } catch (error) {
      if (error && error.code === 'ENOENT') break;
      throw new Error(`${label} cannot inspect "${path.relative(root, current)}": ${error.message}`);
    }

    if (stat.isSymbolicLink()) {
      throw new Error(`${label} is unsafe: symbolic link or junction detected at "${path.relative(root, current)}"`);
    }

    if (index < segments.length - 1 && !stat.isDirectory()) {
      throw new Error(`${label} is unsafe: non-directory ancestor at "${path.relative(root, current)}"`);
    }

    let realCurrent;
    try {
      realCurrent = fs.realpathSync(current);
    } catch (error) {
      throw new Error(`${label} cannot resolve "${path.relative(root, current)}": ${error.message}`);
    }
    if (realCurrent !== realRoot && !realCurrent.startsWith(realRoot + path.sep)) {
      throw new Error(`${label} escapes the confinement root after filesystem resolution: ${target}`);
    }
  }

  return resolved;
}

/** Validate a complete mutation plan before its first filesystem change. */
function assertSafePaths(targets, projectDir, label = 'Path') {
  if (!Array.isArray(targets)) {
    throw new Error(`${label} plan must be an array of output paths`);
  }
  return targets.map((target, index) => assertSafePath(target, projectDir, `${label} #${index + 1}`));
}

/** Remove one regular file after revalidating the exact target. */
function safeUnlinkSync(target, projectDir, label = 'File') {
  const resolved = assertSafePath(target, projectDir, label);
  let stat;
  try {
    stat = fs.lstatSync(resolved);
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw error;
  }
  if (!stat.isFile()) throw new Error(`${label} is not a regular file: ${target}`);
  assertSafePath(resolved, projectDir, label);
  fs.unlinkSync(resolved);
  return true;
}

/** Remove one directory only when empty, after revalidating the exact target. */
function safeRemoveEmptyDirSync(target, projectDir, label = 'Directory') {
  const resolved = assertSafePath(target, projectDir, label);
  let stat;
  try {
    stat = fs.lstatSync(resolved);
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw error;
  }
  if (!stat.isDirectory()) throw new Error(`${label} is not a directory: ${target}`);
  if (fs.readdirSync(resolved).length !== 0) return false;
  assertSafePath(resolved, projectDir, label);
  fs.rmdirSync(resolved);
  return true;
}

/** Remove one confined tree after revalidating its root. */
function safeRemoveTreeSync(target, projectDir, label = 'Directory tree') {
  const resolved = assertSafePath(target, projectDir, label);
  try {
    fs.lstatSync(resolved);
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw error;
  }
  assertSafePath(resolved, projectDir, label);
  fs.rmSync(resolved, { recursive: true, force: true });
  return true;
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

module.exports = {
  isInsideProject,
  isRealPathInside,
  assertInsideProject,
  assertSafePath,
  assertSafePaths,
  safeUnlinkSync,
  safeRemoveEmptyDirSync,
  safeRemoveTreeSync,
  safeSlug,
};
