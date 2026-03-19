# Platform Support — 20 Supported Platforms

> **20 platforms** supported: 15 IDE and 5 CLI. The generator automatically adapts agent, skill, and workflow files to the native format of each platform.

---

## Overview

| # | Platform | Type | Configuration Files |
|---|----------|------|---------------------|
| 1 | Cursor | IDE | `.cursorrules` + `.cursor/` |
| 2 | Windsurf | IDE | `.windsurfrules` + `.windsurf/` |
| 3 | Cline | IDE | `.clinerules` + `.cline/` |
| 4 | Roo Code | IDE | `.roomodes` + `.roo/` |
| 5 | GitHub Copilot | IDE | `.github/copilot-instructions.md` + `.github/instructions/` |
| 6 | Kiro | IDE | `.kiro/agents/*.json` + `.kiro/steering/` |
| 7 | Trae | IDE | `.trae/` |
| 8 | Antigravity | IDE | `.antigravity/` |
| 9 | CodeBuddy | IDE | `.codebuddy/` |
| 10 | Crush | IDE | `.crush/` |
| 11 | iFlow | IDE | `.iflow/` |
| 12 | KiloCoder | IDE | `.kilocoder/` |
| 13 | OpenCode | IDE | `.opencode/` |
| 14 | QwenCoder | IDE | `.qwencoder/` |
| 15 | Rovo Dev | IDE | `.rovo/` |
| 16 | Claude Code | CLI | `CLAUDE.md` + `.claude/agents/*/AGENT.md` + `.claude/skills/*/SKILL.md` (10) + `.claude/rules/` (routing, orchestrator, teams) |
| 17 | Codex | CLI | `AGENTS.md` |
| 18 | Gemini CLI | CLI | `GEMINI.md` + `.gemini/` |
| 19 | Auggie | CLI | `.augment/commands/*.md` |
| 20 | Pi | CLI | `AGENTS.md` + `SYSTEM.md` |

---

## IDE Platforms (15)

### 1. Cursor

**Description:** Cursor AI IDE — AI-first code editor with built-in agent and rules support.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.cursorrules` | Global rules: Jarvis orchestrator, command catalog, general instructions |
| `.cursor/agents/*.md` | One Markdown file per agent with YAML front matter |

**Format:** Markdown with YAML front matter

**Notes:** Each agent is a `.md` file in `.cursor/agents/`. Global rules and orchestrator configuration go in `.cursorrules`. Workflows and skills are embedded in agent instructions.

---

### 2. Windsurf

**Description:** Windsurf AI IDE — IDE with native workflow support and AI-powered coding.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.windsurfrules` | Global rules: orchestrator, catalog, commands |
| `.windsurf/workflows/` | Workflow files in native Windsurf format |

**Format:** Markdown rules + YAML workflows

**Notes:** The orchestrator and commands are embedded in `.windsurfrules`. Native Windsurf workflows are leveraged for pipeline execution.

---

### 3. Cline

**Description:** Cline — VS Code extension for AI-assisted development.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.clinerules` | Global rules and orchestrator |
| `.cline/agents/*.md` | One file per agent |

**Format:** Markdown

**Notes:** Structure similar to Cursor. Agents reside in `.cline/agents/`.

---

### 4. Roo Code

**Description:** Roo Code — IDE with a mode-based agent system.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.roomodes` | JSON file defining each agent as a "mode" with `roleDefinition` and `customInstructions` |
| `.roo/rules-*.md` | Agent-specific rules in Markdown format |

**Format:** JSON for modes, Markdown for rules

**Notes:** Each agent becomes a "mode" in `.roomodes`. Roo Code uses a unique mode system where each mode has its own context and instructions.

---

### 5. GitHub Copilot

**Description:** GitHub Copilot — AI pair programming tool integrated into VS Code and JetBrains IDEs.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.github/copilot-instructions.md` | Global instructions: orchestrator, catalog, rules |
| `.github/instructions/*.md` | Instruction files for specific agents and contexts |

**Format:** Markdown

**Notes:** Global instructions in `copilot-instructions.md`, agent-specific and contextual instructions in the `instructions/` directory.

---

### 6. Kiro

**Description:** Kiro IDE — IDE with native support for agents, steering, and structured specifications.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.kiro/agents/*.json` | One JSON file per agent with configuration and capabilities |
| `.kiro/steering/*.md` | Steering documents that guide agent behavior |

**Format:** JSON for agents, Markdown for steering

**Notes:** Kiro natively supports agents and steering documents. Agent definitions are JSON-based, while steering provides behavioral guidance in Markdown.

---

### 7. Trae

**Description:** Trae IDE — AI-powered code editor with rules and agent support.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.trae/rules/*.md` | Per-agent rules (concise directives) |
| `.trae/agents/*.md` | Full agent instruction files |

**Format:** Markdown

**Notes:** Separation between rules (short directives) and agents (complete instructions).

---

### 8. Antigravity

**Description:** Google Antigravity — Google's AI-powered development environment.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.antigravity/agents/*.md` | One file per agent |

**Format:** Markdown (Gemini-compatible)

**Notes:** Uses Gemini-compatible Markdown format for agent definitions.

---

### 9. CodeBuddy

**Description:** CodeBuddy — AI coding assistant with agent support.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.codebuddy/agents/*.md` | One file per agent |

**Format:** Markdown

---

### 10. Crush

**Description:** Crush IDE — AI code editor with agent-based workflows.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.crush/agents/*.md` | One file per agent |

**Format:** Markdown

---

### 11. iFlow

**Description:** iFlow IDE — AI development environment with agent integration.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.iflow/agents/*.md` | One file per agent |

**Format:** Markdown

---

### 12. KiloCoder

**Description:** KiloCoder — AI-powered coding tool with multi-agent support.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.kilocoder/agents/*.md` | One file per agent |

**Format:** Markdown

---

### 13. OpenCode

**Description:** OpenCode — Open-source AI coding assistant.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `opencode.yaml` | Main configuration file |
| `.opencode/agents/*.md` | One file per agent |

**Format:** YAML + Markdown

**Notes:** OpenCode uses a root-level YAML configuration file alongside Markdown agent files.

---

### 14. QwenCoder

**Description:** QwenCoder — AI coding assistant powered by the Qwen model family.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.qwencoder/agents/*.md` | One file per agent |

**Format:** Markdown

---

### 15. Rovo Dev

**Description:** Rovo Dev — Atlassian's AI development agent platform.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.rovo/agents/*.md` | One file per agent |

**Format:** Markdown

---

## CLI Platforms (5)

### 16. Claude Code

**Description:** Claude Code CLI (Anthropic) — The **reference platform** with the most complete adapter. Uses a Jarvis-first architecture with 10 commands, 33 agents via @mention, and spec-driven methodology.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `CLAUDE.md` | Compact entry point (< 30 lines) with @imports to rules |
| `.claude/agents/*/AGENT.md` | One directory per agent (31), each containing an `AGENT.md` file |
| `.claude/skills/*/SKILL.md` | 10 skill directories: go, party, dismiss, help, review, bugfix, feature, sprint, release, mvp |
| `.claude/rules/routing.md` | Jarvis routing intelligence: complexity assessment, domain→agent mapping, methodology |
| `.claude/rules/orchestrator.md` | Full orchestrator instructions |
| `.claude/rules/teams.md` | Agent roster with @mentions |
| `.claude/rules/governance/governance.md` | *(optional)* Decision gates, risk assessment, quality checkpoints — generated only when `governance: "standard"` |

**Format:** Markdown

**Notes:** `CLAUDE.md` is kept under 30 lines to minimize permanent context token usage (~400 tokens/turn instead of ~1500). Agents are accessed via `@marvel-name` mentions. The 10 SKILL.md files cover: 4 system commands (`/go`, `/party`, `/dismiss`, `/help`) and 6 workflow shortcuts (`/review`, `/bugfix`, `/feature`, `/sprint`, `/release`, `/mvp`). Hidden shortcuts like `/refactor`, `/hotfix`, `/upgrade` also work. Governance rules are loaded on-demand when enabled.

---

### 17. Codex

**Description:** Codex CLI (OpenAI) — OpenAI's command-line coding agent.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `AGENTS.md` | Consolidated file: orchestrator, agent catalog, commands |

**Format:** Compact Markdown

**Notes:** Everything is consolidated into `AGENTS.md` which contains the orchestrator, all agent definitions, and command references.

---

### 18. Gemini CLI

**Description:** Gemini CLI (Google) — Google's command-line AI coding tool.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `GEMINI.md` | Main consolidated file: orchestrator, agents, commands |
| `.gemini/` | Additional configuration and settings |

**Format:** Markdown

**Notes:** The main instructions go in `GEMINI.md`. The `.gemini/` directory can hold additional configuration files and context.

---

### 19. Auggie

**Description:** Auggie CLI (Augment Code) — Augment's command-line AI assistant.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `.augment/commands/*.md` | One Markdown file per command (agents, workflows, skills) |

**Format:** Markdown

**Notes:** Each command is a separate `.md` file in `.augment/commands/`, allowing direct invocation through the CLI.

---

### 20. Pi

**Description:** Pi CLI — AI coding assistant with multi-agent and system-level configuration.

**Generated files:**

| File / Directory | Content |
|------------------|---------|
| `AGENTS.md` | Agent catalog with all agent definitions |
| `SYSTEM.md` | System-level instructions including orchestrator and global rules |

**Format:** Markdown

**Notes:** Pi splits configuration between `AGENTS.md` (agent definitions) and `SYSTEM.md` (orchestrator and system instructions).

---

## Cross-Platform Features

### AGENTS.md Universal

Every generation produces an `AGENTS.md` in the output directory (`assemble-output/AGENTS.md`) with:
- Build commands reference
- Complete agent table (ID, Marvel name, domain, @mention)
- Workflow table with triggers
- Usage conventions

### MCP Server (opt-in)

When `mcp: true` in `.assemble.yaml`, generates an MCP (Model Context Protocol) server in `.assemble/`:

| File | Purpose |
|------|---------|
| `mcp-server.js` | Standalone Node.js server with 31+ tools (one per agent + jarvis-route) |
| `mcp.json` | Configuration for Claude Desktop / VS Code MCP integration |
| `mcp-package.json` | Dependencies — run `cd .assemble && npm install` to set up |

The MCP server uses stdio transport and exposes each agent as an `invoke-{slug}` tool.

### Cross-Session Memory (opt-in)

When `memory: true`, generates `_memory.md` in the output directory. Routing rules instruct Jarvis and agents to:
- Read memory at session start
- Append key decisions and outcomes after each workflow
- Maintain active context across sessions

### Metrics & Observability (opt-in)

When `metrics: true`, generates `_metrics.md` in the output directory with tables for:
- Workflow execution tracking (name, timestamps, duration, steps, status)
- Agent performance metrics
- Trend summaries

---

## Technical Notes

### File Regeneration

To regenerate files after modifying the configuration:

```bash
# Via Node.js
node generator/generate.js --config .assemble.yaml

# Via Python
python3 generator/generate.py --config .assemble.yaml

# Via CLI
npx create-assemble --update    # Regenerate from .assemble.yaml
```

### Multi-Platform Support

You can generate files for **multiple platforms simultaneously**. The installer lets you select one or more targets. Files are generated at each platform's native locations without conflicts.

### Adding a New Platform

To add support for a new platform:
1. Create a new adapter file in `generator/adapters/ide/` or `generator/adapters/cli/`
2. Implement the standard interface (use existing adapters as a reference)
3. Add the platform to `src/config/defaults.yaml` under `platforms.ide` or `platforms.cli`

### File Location Summary

| Platform | Main File | Agent Directory | Other |
|----------|-----------|-----------------|-------|
| Cursor | `.cursorrules` | `.cursor/agents/` | — |
| Windsurf | `.windsurfrules` | — | `.windsurf/workflows/` |
| Cline | `.clinerules` | `.cline/agents/` | — |
| Roo Code | `.roomodes` | — | `.roo/rules-*` |
| GitHub Copilot | `.github/copilot-instructions.md` | `.github/instructions/` | — |
| Kiro | — | `.kiro/agents/` | `.kiro/steering/` |
| Trae | — | `.trae/agents/` | `.trae/rules/` |
| Antigravity | — | `.antigravity/agents/` | — |
| CodeBuddy | — | `.codebuddy/agents/` | — |
| Crush | — | `.crush/agents/` | — |
| iFlow | — | `.iflow/agents/` | — |
| KiloCoder | — | `.kilocoder/agents/` | — |
| OpenCode | `opencode.yaml` | `.opencode/agents/` | — |
| QwenCoder | — | `.qwencoder/agents/` | — |
| Rovo Dev | — | `.rovo/agents/` | — |
| Claude Code | `CLAUDE.md` | `.claude/agents/*/AGENT.md` | `.claude/skills/*/SKILL.md`, `.claude/rules/` |
| Codex | `AGENTS.md` | — | — |
| Gemini CLI | `GEMINI.md` | — | `.gemini/` |
| Auggie | — | — | `.augment/commands/*.md` |
| Pi | `AGENTS.md` + `SYSTEM.md` | — | — |
