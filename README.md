<p align="center">
  <img src="assets/logo.svg" width="160" height="160" alt="Assemble logo" />
</p>

<h1 align="center">Assemble</h1>

<p align="center">
  <strong>Terraform for AI agents</strong><br>
  <em>34 experts. 21 platforms. One config source.</em><br>
  <em>An open-source project by <a href="https://cohesium.ai">Cohesium AI</a></em>
</p>

<p align="center">
  <a href="#quick-start"><img src="https://img.shields.io/badge/npx-create--assemble-6366f1?style=flat-square" alt="npx create-assemble" /></a>
  <img src="https://img.shields.io/badge/agents-34-8b5cf6?style=flat-square" alt="34 agents" />
  <img src="https://img.shields.io/badge/platforms-21-3b82f6?style=flat-square" alt="21 platforms" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License" />
</p>

---

> **34 agent definitions. 15 workflows. 21 platforms. Zero runtime.** Assemble generates native configuration files that turn your IDE or CLI into a structured AI team. No daemon, no vendor lock-in, no dependencies. Just `npx create-assemble` and your LLM knows its job.

## What is Assemble?

Assemble is a **prompt orchestration and platform generation system** — not a proprietary agentic runtime.

It defines 34 specialized AI agent personas, 15 automated workflows, routing intelligence, governance rules, and delivery conventions. Then it **generates native configuration files** for your target platform — Cursor rules, Claude Code agents, GitHub Copilot instructions, and 18 others.

The LLM in your IDE or CLI does the actual execution. Assemble provides the playbook.

### How it works

```
You define what you need → Assemble generates platform-native configs → Your LLM reads them and behaves accordingly
```

Think of it like **Terraform for AI agents**: you declare the team structure once, and it compiles to whatever format your platform expects. Switch IDE? Regenerate. Add a platform? Same source, new adapter.

### `/go` — The only command you need

```
/go build a REST API for user management
/go fix the auth bug in the login flow
/go review the last PR for security issues
/go develop all 5 stories from the current sprint
/go create a complete SaaS MVP with auth, billing, and dashboard
```

Type `/go` and describe what you need. The generated routing instructions tell Jarvis (the orchestrator) to assess complexity, select the right agents, and chain them in order. For complex tasks, a spec-driven methodology kicks in: SPECIFY → PLAN → TASKS → IMPLEMENT → CLOSE.

With **YOLO mode** (`yolo: true`), the generated instructions tell the LLM to execute all workflow steps without pausing for validation. It only stops for destructive production actions or when it needs information only you can provide. Full traceability is preserved.

### Why Marvel names?

It's a **prompt engineering trick**, not branding.

LLMs have deep knowledge of Marvel characters. When the config says `@tony-stark` for architecture, the LLM activates a semantic network: inventive, systematic, pragmatic. `@hawkeye` in QA means precision, never misses. `@loki` in copywriting means language manipulation, persuasion.

Each persona compresses hundreds of tokens of behavioral instructions into a single `@mention`. And the characters are teammates who know how to work together and always find a way to succeed — the LLM's weights know this too.

For humans: `@professor-x` is easier to remember than `@product-manager-agent`.

---

## Quick Start

### Using NPX (recommended)

```bash
npx create-assemble
```

### Using Bash (macOS/Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/CohesiumAI/assemble/main/install.sh | bash
```

### Using Python

```bash
python3 install.py
```

### Using PowerShell (Windows)

```powershell
.\install.ps1
```

### Using Batch (Windows)

```cmd
install.bat
```

The interactive installer guides you through:

1. Choosing your **team language** and **deliverable language**
2. Selecting a **team profile** (startup, enterprise, agency, or custom)
3. Choosing your **target platforms** (Cursor, Claude Code, Copilot, etc.)
4. Setting the **project** and **output directories**
5. Enabling **MCP server** (opt-in)
6. Selecting **governance level** (none, standard, strict)

---

## Quick Demo

```bash
$ npx create-assemble

🦸 Assemble — AI Agent Orchestrator

▸ 1/12 — Team language
  Team language: english

▸ 3/12 — Team profile
  1) startup   2) enterprise   3) agency   4) custom
  Profile: 4

▸ 4/12 — IDE/CLI selection
  Your choice: 0    # → all 21 platforms

✅ Installation complete!
  149+ tests passing | 21 platforms | 34 agents
```

---

## Update an Existing Installation

If you already have Assemble by Cohesium AI installed, you can update to the latest version while preserving your preferences:

```bash
npx create-assemble --update
```

The `--update` flag re-generates all platform configuration files from your existing `.assemble.yaml` without re-running the interactive setup. Your agent selection, language settings, and output directory are preserved.

You can also use `/go update my config` to trigger regeneration from within a session.

---

## The Team (34 Agents)

### Dev Team (6 agents)

| Agent ID | Marvel Name | Role | @mention |
|----------|-------------|------|----------|
| `architect` | Tony Stark | System Architect | `@tony-stark` |
| `dev-backend` | Bruce Banner | Backend Developer | `@bruce-banner` |
| `dev-frontend` | Spider-Man | Frontend Developer | `@spider-man` |
| `dev-fullstack` | Mr. Fantastic | Fullstack Developer | `@mr-fantastic` |
| `dev-mobile` | Ant-Man | Mobile Developer | `@ant-man` |
| `db` | Doctor Strange | Database Architect | `@doctor-strange` |

### Ops & Quality Team (5 agents)

| Agent ID | Marvel Name | Role | @mention |
|----------|-------------|------|----------|
| `devops` | Thor | DevOps / SRE | `@thor` |
| `qa` | Hawkeye | QA / Testing | `@hawkeye` |
| `security` | Punisher | Security / InfoSec (Blue Team) | `@punisher` |
| `redteam` | Microchip | Offensive Security (Red Team) | `@microchip` |
| `automation` | Quicksilver | Automation | `@quicksilver` |

### Product & Strategy Team (4 agents)

| Agent ID | Marvel Name | Role | @mention |
|----------|-------------|------|----------|
| `pm` | Professor X | Product Manager | `@professor-x` |
| `analyst` | Nick Fury | Business Analyst | `@nick-fury` |
| `scrum` | Captain America | Scrum Master | `@captain-america` |
| `legal` | She-Hulk | Legal / Compliance | `@she-hulk` |

### Marketing & Growth Team (6 agents)

| Agent ID | Marvel Name | Role | @mention |
|----------|-------------|------|----------|
| `marketing` | Star-Lord | Marketing Manager | `@star-lord` |
| `growth` | Rocket Raccoon | Growth Hacker | `@rocket-raccoon` |
| `ads` | Gamora | Paid Media | `@gamora` |
| `seo` | Black Widow | Technical SEO | `@black-widow` |
| `content-seo` | Storm | Content SEO | `@storm` |
| `geo-aio` | Jean Grey | GEO / AIO | `@jean-grey` |

### Content & Communication Team (4 agents)

| Agent ID | Marvel Name | Role | @mention |
|----------|-------------|------|----------|
| `copywriter` | Loki | Copywriter | `@loki` |
| `brand` | Black Panther | Brand Strategist | `@black-panther` |
| `storytelling` | Silver Surfer | Storytelling | `@silver-surfer` |
| `social` | Ms. Marvel | Social Media Manager | `@ms-marvel` |

### Data & AI Team (2 agents)

| Agent ID | Marvel Name | Role | @mention |
|----------|-------------|------|----------|
| `data` | Beast | Data Analyst | `@beast` |
| `ai-engineer` | Vision | AI Engineer | `@vision` |

### Design Team (1 agent)

| Agent ID | Marvel Name | Role | @mention |
|----------|-------------|------|----------|
| `ux` | Invisible Woman | UX/UI Designer | `@invisible-woman` |

### Business & Operations Team (3 agents)

| Agent ID | Marvel Name | Role | @mention |
|----------|-------------|------|----------|
| `customer-success` | Pepper Potts | Customer Success Manager | `@pepper-potts` |
| `finance` | Iron Fist | CFO / Finance Director | `@iron-fist` |
| `pr-comms` | Phil Coulson | PR / Communications Director | `@phil-coulson` |

### Meta (3 agents)

| Agent ID | Marvel Name | Role | @mention |
|----------|-------------|------|----------|
| `contrarian` | Deadpool | Devil's Advocate (permanent) | `@deadpool` |
| `doom` | Doctor Doom | Strategic Stress-Tester (on-demand) | `@doctor-doom` |
| `jarvis` | Jarvis | Orchestrator | `@jarvis` |

---

## Workflows (15)

Workflows are pre-configured agent chains that orchestrate a sequence of specialists to accomplish a complete objective. Each step receives inputs from previous agents and produces outputs consumed by downstream agents. Jarvis manages the chaining automatically.

| # | Workflow | Trigger | Agent Chain | Description |
|---|----------|---------|-------------|-------------|
| 1 | MVP Launch | `/mvp` | PM, Architect, UX, DB, Backend, Frontend, QA, DevOps | Full MVP from product vision to deployment |
| 2 | Feature Development | `/feature` | PM, Analyst, Architect, Backend, Frontend, QA | End-to-end feature from spec to validation |
| 3 | Bug Fix | `/bugfix` | QA, Dev, QA | Structured bug analysis, fix, and regression test |
| 4 | Code Review Pipeline | `/review` | Fullstack, QA, Security, Red Team, Contrarian | Multi-perspective code review with offensive testing |
| 5 | Security Audit | `/security` | Security, Red Team, Backend, DevOps, Legal | Full security audit with red team pentest |
| 6 | SEO Content Pipeline | `/seo` | SEO, Content-SEO, Copywriter, GEO/AIO | SEO-optimized content from keyword research to GEO |
| 7 | Marketing Campaign | `/campaign` | Marketing, Finance, Brand, Copywriter, Ads + Social + PR, Growth | Multi-channel campaign with budget validation and PR |
| 8 | Sprint Cycle | `/sprint` | Scrum, PM, Fullstack, QA, DevOps | Complete agile sprint from planning to release |
| 9 | Tech Debt Reduction | `/refactor` | Architect, Fullstack, QA, DevOps | Debt inventory, refactoring, and rollback strategy |
| 10 | Project Onboarding | `/onboard` | PM, Analyst, Architect, Scrum | New project scoping and team setup |
| 11 | Release Cycle | `/release` | Scrum, QA, Security, Legal, DevOps, Marketing, PR, CS | Full release with legal, PR, and customer communication |
| 12 | Hotfix Release | `/hotfix` | QA, Security, Fullstack, QA, DevOps | Emergency production fix with minimal validation |
| 13 | Dependency Upgrade | `/upgrade` | Architect, Security, Fullstack, QA, DevOps | Dependency updates with CVE check and compatibility tests |
| 14 | Documentation Sprint | `/docs` | Analyst, Architect, Fullstack, Copywriter, DevOps | Documentation inventory, writing, editing, and publishing |
| 15 | Experimentation | `/experiment` | PM, Data, Fullstack, QA, Growth | A/B experiment from hypothesis to statistical decision |

---

## Skills (28)

Skills are reusable capabilities that agents can invoke via commands. They provide structured, step-by-step processes for specific tasks.

### Shared Skills (14)

Available to multiple agents across teams.

| # | Skill | Trigger | Description |
|---|-------|---------|-------------|
| 1 | Code Review | `/review` | Structured code review with quality checklist |
| 2 | Git Workflow | `/git` | Git branching, commits, PRs, and merge management |
| 3 | Documentation | `/doc` | Technical and functional documentation generation |
| 4 | Testing | `/test` | Test strategy and execution (unit, integration, e2e) |
| 5 | Security Check | `/sec-check` | OWASP vulnerability scan and hardening audit |
| 6 | Performance Audit | `/perf` | Core Web Vitals, query optimization, load analysis |
| 7 | API Design | `/api` | REST/GraphQL API design, versioning, pagination |
| 8 | Database Query | `/db` | Database query optimization and schema design |
| 9 | CI/CD | `/cicd` | CI/CD pipeline configuration and optimization |
| 10 | Monitoring | `/monitor` | Observability setup: metrics, logs, traces, alerting |
| 11 | SEO Audit | `/seo` | Technical and on-page SEO audit |
| 12 | Content Brief | `/brief` | Structured content brief with keyword research |
| 13 | Competitive Analysis | `/benchmark` | Competitive analysis and market benchmarking |
| 14 | Reporting | `/report` | Report and dashboard generation |

### Specific Skills (14)

Specialized capabilities tied to a primary agent.

| # | Skill | Trigger | Primary Agent | Description |
|---|-------|---------|---------------|-------------|
| 1 | Backend API Scaffold | `/scaffold-api` | dev-backend | Full API scaffolding with routes, controllers, docs |
| 2 | Frontend Component | `/component` | dev-frontend | React/Next.js component with design system integration |
| 3 | Mobile Screen | `/screen` | dev-mobile | React Native/Flutter screen with navigation and state |
| 4 | DB Migration | `/migrate` | db | Database migration creation with rollback and validation |
| 5 | DevOps Pipeline | `/pipeline` | devops | Complete CI/CD pipeline with build, test, and deploy |
| 6 | Pentest Scan | `/pentest` | security | Automated penetration test with vulnerability report |
| 7 | Legal Compliance Check | `/compliance` | legal | GDPR, AI Act, and nLPD regulatory compliance check |
| 8 | Ad Campaign Setup | `/ad-setup` | ads | Multi-platform ad campaign configuration |
| 9 | Growth Experiment | `/experiment` | growth | Growth experiment design with hypothesis and metrics |
| 10 | UX Wireframe | `/wireframe` | ux | Wireframes and interactive prototypes |
| 11 | Sprint Planning | `/sprint-plan` | scrum | Agile sprint planning with estimation and prioritization |
| 12 | QA Test Plan | `/test-plan` | qa | Complete test plan with coverage matrices and criteria |
| 13 | Automation Workflow | `/automate` | automation | Multi-tool automation workflow with triggers and monitoring |
| 14 | Party Mode | `/party` | all | Persistent collaborative multi-agent session |

---

## Supported Platforms (21)

### IDE Platforms (16)

| Platform | Configuration Files |
|----------|--------------------|
| Cursor | `.cursorrules`, `.cursor/agents/`, `.cursor/skills/`, `.cursor/workflows/` |
| Windsurf | `.windsurfrules`, `.windsurf/rules/`, `.windsurf/workflows/` |
| Cline | `.clinerules`, `.cline/agents/`, `.cline/skills/`, `.cline/workflows/` |
| Roo Code | `.roomodes`, `.roo/rules-*` |
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/instructions/` |
| Kiro | `.kiro/agents/*.json`, `.kiro/steering/` |
| Trae | `.trae/rules/`, `.trae/agents/`, `.trae/skills/`, `.trae/workflows/` |
| Google Antigravity | `.antigravity/agents/`, `.antigravity/skills/`, `.antigravity/workflows/` |
| CodeBuddy | `.codebuddy/agents/`, `.codebuddy/skills/`, `.codebuddy/workflows/` |
| Crush | `.crush/agents/`, `.crush/skills/`, `.crush/workflows/` |
| iFlow | `.iflow/agents/`, `.iflow/skills/`, `.iflow/flows/` |
| KiloCoder | `.kilocoder/agents/`, `.kilocoder/skills/`, `.kilocoder/workflows/` |
| OpenCode | `.opencode/agents/`, `.opencode/skills/`, `.opencode/workflows/` |
| QwenCoder | `.qwencoder/agents/`, `.qwencoder/skills/`, `.qwencoder/workflows/` |
| Rovo Dev | `.rovo/agents/`, `.rovo/skills/`, `.rovo/workflows/` |
| Claude Code Desktop | `CLAUDE.md` (self-contained), `.claude/skills/*/SKILL.md` (43 — agents as `/skills`) |

### CLI Platforms (5)

| Platform | Configuration Files |
|----------|--------------------|
| Claude Code (CLI) | `CLAUDE.md` (@imports), `.claude/agents/*/AGENT.md`, `.claude/skills/*/SKILL.md` (10), `.claude/rules/` |
| Codex (OpenAI) | `AGENTS.md` |
| Gemini CLI | `GEMINI.md`, `.gemini/agents/`, `.gemini/skills/`, `.gemini/workflows/` |
| Auggie | `.augment/commands/*.md` |
| Pi | `AGENTS.md`, `SYSTEM.md` |

---

## Architecture

```
assemble/
  src/
    agents/             # 34 agent definition files (AGENT-*.md)
    skills/
      shared/           # 14 shared skills (multi-agent)
      specific/         # 14 agent-specific skills
    workflows/          # 15 workflow definitions (YAML)
    orchestrator/       # ORCHESTRATOR.md (Jarvis)
    config/
      defaults.yaml     # Default configuration (profiles, MCP, memory, metrics)
      teams.yaml        # Team definitions (9 teams)
    commands/
      commands.yaml     # Registry of 10 primary commands + hidden shortcuts + internal skills
  generator/
    generate.js         # Main generator (profiles, custom agents/skills, MCP, memory, metrics)
    lib/
      profiles.js       # Team profiles (startup, enterprise, agency)
      mcp-generator.js  # MCP server + config generator
      agents-md-generator.js  # Universal AGENTS.md generator
      template-engine.js      # Template rendering (memory, metrics, governance strict)
    adapters/           # 20 platform adapters (IDE + CLI)
  bin/
    cli.js              # Interactive installer (12-step wizard)
    doctor.js           # Health check (npx create-assemble doctor)
    diff.js             # Dry run diff (npx create-assemble diff)
    ls.js               # List active config (npx create-assemble ls)
    import.js           # Import skills (npx create-assemble import)
  tests/
    unit.test.js        # Unit tests for core functions
    snapshot.test.js    # Snapshot + qualitative tests
    integration-full.js # Full 20-platform integration tests
  .assemble/            # User extensibility (auto-detected)
    agents/             # Custom agents (AGENT-*.md)
    skills/             # Imported skills
```

### Execution Flow

```
You type /go <request>
      |
      v
  Your LLM reads the generated Jarvis instructions
      |
      +-- Assesses complexity (TRIVIAL / MODERATE / COMPLEX)
      +-- Selects agents from generated configs
      |
      +── TRIVIAL → routes to single agent definition
      +── MODERATE → chains 2-3 agent definitions sequentially
      +── COMPLEX → follows Spec-Driven Methodology:
      |     1. SPECIFY (@professor-x) → spec.md
      |     2. PLAN (@tony-stark) → plan.md
      |     3. TASKS (@captain-america) → tasks.md
      |     4. IMPLEMENT (Dev agents) → code + tests
      |     5. CLOSE (Jarvis) → _quality.md
      |
      v
  LLM executes using generated agent personas
      |
      +-- Reads agent definition → produces deliverables
      +-- Reads next agent definition → continues
      |
      v
  Consolidation → _summary.md + _quality.md
```

> **Note:** Assemble generates the configuration. Your IDE/CLI and its LLM handle the runtime execution. Assemble has no daemon, no server, no process running.

---

## Configuration

After installation, a `.assemble.yaml` file is created at the root of your project:

```yaml
# Assemble — Project configuration
version: "1.0.0"
profile: "custom"                 # startup | enterprise | agency | custom
langue_equipe: "english"          # Language for agent-to-agent communication
langue_output: "english"          # Language for produced deliverables
output_dir: "./assemble-output"   # Output directory for deliverables
platforms: [claude-code, cursor]  # Target platforms
agents: all                       # Activated agents (all or list)
workflows: all                    # Activated workflows (all or list)
governance: "none"                # none | standard | strict
yolo: false                       # Autonomous execution (no validation gates)
mcp: false                        # MCP server generation
memory: false                     # Cross-session _memory.md
metrics: false                    # Workflow _metrics.md
installed_at: "2026-03-19"
```

### Team Profiles

Profiles provide sensible defaults that can be overridden by explicit config:

| Profile | Agents | Governance | Best for |
|---------|--------|------------|----------|
| `startup` | 12 core agents | none | Early-stage, ship fast |
| `enterprise` | all 34 agents | strict | Regulated environments |
| `agency` | 16 marketing/content agents | none | Agencies, consultancies |
| `custom` | your choice | your choice | Full control |

**Impact example — `profile: startup` vs `profile: custom` (all agents):**

```diff
  # .assemble.yaml
- profile: "custom"
- agents: all                    # 34 agents, 15 workflows
+ profile: "startup"
+                                # 12 agents: pm, architect, dev-backend,
+                                #   dev-frontend, dev-fullstack, qa, devops,
+                                #   growth, copywriter, data, ux, contrarian
+                                # 6 workflows: mvp-launch, feature-development,
+                                #   bug-fix, sprint-cycle, hotfix-release, experimentation
```

The startup profile generates **60% fewer config files** while keeping the core dev+ship loop. Add `agents: all` to override and get the full roster back.

### Extensibility

**Custom agents:** Drop `AGENT-*.md` files in `.assemble/agents/` — they're auto-discovered and merged during generation. Same slug overrides built-in.

**Custom skills:** Use `npx create-assemble import <path>` to copy skill files into `.assemble/skills/`. They're included in the next generation.

### MCP Server (opt-in)

Set `mcp: true` to generate an MCP bridge that exposes agent definitions and routing as MCP tools:

```bash
# Generated in .assemble/
mcp-server.js        # Bridge server — exposes agents as MCP tools (stdio transport)
mcp.json             # Config for Claude Desktop / VS Code
package.json         # Install deps: cd .assemble && npm install
```

### Cross-Session Memory (opt-in)

Set `memory: true` to enable persistent context across sessions. Generates `_memory.md` with sections for session log, active context, and key decisions.

### Metrics (opt-in)

Set `metrics: true` to track workflow execution metrics. Generates `_metrics.md` with tables for workflow performance and agent statistics.

### YOLO Mode — Autonomous Execution (opt-in)

Set `yolo: true` to generate instructions that tell the LLM to execute all workflow steps without pausing for validation. This is a behavioral instruction, not a separate runtime — the LLM chains agents end-to-end within its own context.

```yaml
yolo: true   # Jarvis runs autonomously
```

**What changes:**
- All workflow steps execute sequentially without "do you want to continue?" prompts
- COMPLEX tasks: spec → plan → tasks → implement in one continuous flow
- Agents chain automatically, each reading the previous agent's outputs
- If a step produces incomplete output, Jarvis iterates and self-corrects

**Mandatory stops (Jarvis ALWAYS pauses for these):**
- Destructive production actions (deploy to prod, migrate live DB, irreversible deletes)
- Missing information only a human can provide (credentials, business decisions)
- External side effects with real-world impact (sending emails, creating cloud resources)

**What stays active:** `_manifest.yaml`, `_summary.md`, `_quality.md`, pre-execution validation, agent context injection, cross-session memory. Full traceability — you review the result, not every step.

---

## Governance (optional)

Assemble includes an opt-in governance layer that adds **decision gates** and **change risk assessment** to workflows. Governance rules are injected into the command registry generated for all 21 platforms. **Disabled by default** — zero overhead when not needed.

> **Note:** `_quality.md` (deliverables, validations, remaining risks, lessons learned) is always produced at the end of COMPLEX workflows (4+ steps) as part of Phase 5 CLOSE — this is baseline behavior, not governance-specific. Governance adds the **gates** and **risk controls** that govern _how_ you get there.

### Enabling governance

Set `governance: "standard"` or `governance: "strict"` in `.assemble.yaml`:

```yaml
governance: "standard"   # Decision gates + risk assessment
# or
governance: "strict"     # Full audit trail + RBAC + NIST AI RMF mapping
```

Then regenerate: `npx create-assemble --update`

### What it adds

| Level | Decision Gates | Risk Assessment | Extras |
|-------|---------------|-----------------|--------|
| `none` | — | — | Zero overhead |
| `standard` | MODERATE + COMPLEX tasks | HIGH risk workflows | _quality.md |
| `strict` | ALL tasks (incl. TRIVIAL) | ALL workflows | Audit trail (`_audit.md`), RBAC, NIST AI RMF mapping |

### Token impact

| Mode | Permanent cost | On-demand cost |
|------|---------------|----------------|
| `governance: "none"` (default) | 0 extra tokens | 0 |
| `governance: "standard"` | ~20 tokens (routing reference) | ~200 tokens (governance.md loaded when relevant) |
| `governance: "strict"` | ~20 tokens (routing reference) | ~400 tokens (governance.md with RBAC + audit) |

### How it works across platforms

- **19 platforms** (Cursor, Copilot, Cline, Windsurf, Kiro, Roo Code, Codex, Gemini CLI, Pi, Auggie, and all IDE adapters): Governance rules are injected into the command registry.
- **Claude Code:** Uses a dedicated `.claude/rules/governance/governance.md` file loaded on-demand by Jarvis.
- **Platforms with orchestrator**: Governance behavior is also embedded in the orchestrator instructions.

---

## Documentation

| Document | Contents |
|----------|----------|
| [Agent Catalog](docs/AGENTS.md) | Complete catalog of all 34 agents with roles, skills, and workflows |
| [Skills Reference](docs/SKILLS.md) | 28 skills (14 shared + 14 specific) with detailed processes |
| [Workflow Guide](docs/WORKFLOWS.md) | 15 workflows with agent chains, inputs/outputs, and dependency graphs |
| [Platform Support](docs/PLATFORMS.md) | Platform-specific setup guides and file structure details |
| [Command Reference](docs/COMMANDS.md) | Full reference for 10 commands + hidden shortcuts |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Follow the existing file naming conventions (`AGENT-*.md`, `*.yaml`)
4. Test your changes by running the generator: `npm run generate`
5. Validate the output: `npm run validate`
6. Submit a pull request

Agent definitions live in `src/agents/`, skills in `src/skills/`, and workflows in `src/workflows/`. The generator in `generator/` transforms these source files into platform-specific configurations.

---

## License

MIT — An open-source project by [Cohesium AI](https://cohesium.ai)
