# Changelog

All notable changes to Assemble are documented here. The project is currently in beta; generated formats may still change between beta releases.

## [1.1.2-beta.4] - 2026-07-10

### Security

- Reject symbolic links and Windows junctions in generated output and cleanup paths.
- Preflight every adapter output plan before generation and confine MCP, imported skills, manifests, configuration, and fallback cleanup.
- Require the per-run `--allow-plugins` flag for third-party JavaScript adapters; repository configuration is ignored.
- Generate Windsurf MCP files locally by default; require `--register-windsurf-mcp` for a user-profile registration.

### Fixed

- Create the complete local MCP package before optional Windsurf global registration.
- Use `.assemble/package.json` consistently as the MCP dependency manifest.
- Make Windsurf global registration best-effort so local MCP files remain usable when the global profile is unavailable.

### Release

- Publish only from a matching `v1.1.2-beta.4` tag after tests and `npm pack` succeed.
- Manual workflow runs validate and pack without publishing.

### Upgrade notes

- Run `npx cohesiumai-assemble --update` in each trusted project to regenerate protected outputs.
- If local tooling referenced the former MCP dependency filename, update it to `.assemble/package.json`.
- No intentional agent, workflow, or platform support has been removed in this beta.

## [1.1.2-beta.3] - 2026-04-11

- Added native Codex generation with `AGENTS.md`, project skills, and custom agents.

[1.1.2-beta.4]: https://github.com/CohesiumAI/assemble/compare/b1a8ef009f493127fb78b212781da04ec9a69650...v1.1.2-beta.4
[1.1.2-beta.3]: https://github.com/CohesiumAI/assemble/commit/b1a8ef009f493127fb78b212781da04ec9a69650
