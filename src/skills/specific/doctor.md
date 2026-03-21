---
name: doctor
description: Health check and auto-repair — diagnose and fix Assemble installation issues
agents: [jarvis]
trigger: /doctor
---

# Skill : Doctor — Health Check & Auto-Repair

## Objective

Diagnose the health of the current Assemble installation and optionally repair issues. This skill runs as Jarvis (orchestrator) since it needs to check the entire system.

## Checks

### Configuration
- `.assemble.yaml` exists and is parseable
- Required fields present: `version`, `platforms`
- Platform list is valid (matches known 21 platforms)

### Structure
- Output directory exists
- Agent definitions exist for all configured agents
- Skill definitions exist for all configured skills
- Rule files exist (routing, orchestrator, teams)
- Platform-specific generated files exist

### Integrity
- Governance files present if governance != "none"
- `_memory.md` exists if `memory: true`
- `_metrics.md` exists if `metrics: true`
- No orphaned directories (in filesystem but not in config)
- Config version consistent

### Cross-Platform
All 21 platforms should be checked if configured:
- **IDE (16)**: cursor, windsurf, cline, roocode, copilot, kiro, trae, antigravity, codebuddy, crush, iflow, kilocoder, opencode, qwencoder, rovodev, claude-code-desktop
- **CLI (5)**: claude-code, codex, gemini-cli, auggie, pi

## Report Format

```
Assemble Doctor

  [PASS] Check passed
  [WARN] Warning (non-blocking)
  [FAIL] Failure (blocking)
  [FIXED] Fixed (when --fix is active)

  Summary: X passed, Y warnings, Z failures, W fixed
```

## Auto-Repair

When `/doctor fix` or `/doctor --fix` is invoked:
1. Create missing directories (output, .assemble/agents, .assemble/skills)
2. Create missing governance structure
3. Create missing _memory.md / _metrics.md templates
4. For missing platform files -> suggest regeneration via `npx create-assemble --update`
5. Report what was fixed

## Anti-patterns
- Never delete existing files — doctor repairs, never destroys
- Never modify .assemble.yaml — that's the user's config
- Never regenerate platform files silently — always ask or suggest the CLI command
