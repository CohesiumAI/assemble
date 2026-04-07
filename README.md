<p align="center">
  <img src="https://raw.githubusercontent.com/CohesiumAI/assemble/main/assets/logo.svg" width="160" height="160" alt="Assemble logo" />
</p>

<h1 align="center">Assemble</h1>

<p align="center">
  <strong>Your full team. Zero headcount.</strong><br>
  <em>34 AI experts. 21 platforms. One config source.</em><br>
  <em>An open-source project by <a href="https://cohesium.ai">Cohesium AI</a></em>
</p>

<p align="center">
  <a href="#quick-start"><img src="https://img.shields.io/badge/npx-cohesiumai--assemble-6366f1?style=flat-square" alt="npx cohesiumai-assemble" /></a>
  <img src="https://img.shields.io/badge/version-1.1.1--beta.1-orange?style=flat-square" alt="v1.1.1-beta.1" />
  <img src="https://img.shields.io/badge/agents-34-8b5cf6?style=flat-square" alt="34 agents" />
  <img src="https://img.shields.io/badge/platforms-21-3b82f6?style=flat-square" alt="21 platforms" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License" />
</p>

---

> **v1.1.1-beta.1** — New: opt-in **web search protocol** — agents verify recommendations with current data. Core functionality is stable, but APIs and generated file formats may change before v1.0.0 stable. Feedback welcome via [GitHub Issues](https://github.com/CohesiumAI/assemble/issues).

Assemble turns your IDE into a structured team of 34 senior-level AI specialists — architect, backend, QA, security, product, marketing, and 28 others. You run one command. It generates native config files for Cursor, Claude Code, Copilot, Gemini CLI, and 17 other platforms. No runtime, no daemon, no SDK. Your LLM reads the configs and knows exactly who to be, how to think, and what to deliver.

Type `/go` and describe what you need. That's it.

## Why Assemble exists

I spent 20 years managing teams. Then I went solo — by choice, not by default.

The problem: working alone means you are the architect, the QA, the PM, the copywriter, and the devops engineer. AI assistants helped, but they were generic. Ask for a code review, and you get surface-level feedback. Ask for a security audit, and you get a checklist copy-pasted from OWASP's homepage.

I needed specialists, not assistants. I needed a team that would challenge my blind spots, not agree with everything I said. I needed an architect who thought in systems, a QA who found the bugs I missed, and a contrarian who told me when my plan was wrong.

So I built one.

A client project quoted at 2 days turned into 10 days of failed attempts with generic AI. With Assemble's structured team, it took 30 minutes. That was the moment I knew this wasn't just a personal tool — it was a category.

Assemble exists because one person with the right team structure can outperform a department that wings it.

## What is Assemble?

Most AI agent frameworks ship a runtime you have to host, an SDK you have to learn, and a lock-in you have to live with. Assemble does none of that.

It is a **configuration generator**. It maintains 34 agent definitions, 15 multi-step workflows, and 28 reusable skills as platform-agnostic source files. A generator compiles them into the native format your IDE expects — `.cursorrules`, `CLAUDE.md`, `.github/copilot-instructions.md`, and 18 others.

The result: your LLM stops being a generic assistant and starts operating as a coordinated team. An architect who thinks in systems. A QA engineer who never skips edge cases. A security auditor who assumes breach. All routed by an orchestrator called **Jarvis** that reads your request, picks the right experts, and chains their work.

Think **Terraform for AI agents**: declare the team once, compile to any platform. Switch IDE? Regenerate. Add a tool? Same source, new adapter.

### `/go` — The only command you need

```
/go build a REST API for user management
/go fix the auth bug in the login flow
/go review the last PR for security issues
/go develop all 5 stories from the current sprint
/go create a complete SaaS MVP with auth, billing, and dashboard
```

Type `/go` and describe what you need. Jarvis assesses complexity, selects the right agents, and chains them in order. For complex tasks, a spec-driven methodology kicks in: BRAINSTORM → SPECIFY → PLAN → TASKS → IMPLEMENT → CLOSE.

With **YOLO mode** (`yolo: true`), agents execute all steps without pausing for validation. Full traceability is preserved.

### Board Execution — Kanban for complex tasks

For **COMPLEX** workflows, Phase 4 (**IMPLEMENT**) switches from a linear execution model to an automated Kanban board. Professor X (PM) writes structured tickets with explicit acceptance criteria in Given/When/Then format, then Captain America (Scrum Master) converts `tasks.md` into `_board.yaml`.

The `board-execution` engine runs dependency-ready tickets in parallel through a fixed pipeline: **implement → review → test → done**. It enforces WIP limits, resolves ticket dependencies automatically, and injects only ticket-specific context into each agent so execution stays focused and auditable.

Use `/board` to inspect the board, resume execution, or re-prioritize tickets already in `_board.yaml`. Simple workflows — typically fewer than 3 tickets with no dependencies — stay in the standard linear mode.

### Web Search Protocol — Agents that verify before they recommend

LLMs work with frozen knowledge. An architect recommending a framework abandoned six months ago, a security expert missing last week's CVE, a SEO specialist advising based on an outdated algorithm — these are real risks when agents operate on training data alone.

With `search: true` in `.assemble.yaml`, agents verify their recommendations against current data before finalizing them. The protocol is **proportional to complexity**:

- **TRIVIAL** — Optional quick check for version-sensitive topics
- **MODERATE** — Targeted verification (2-5 searches) for technical recommendations
- **COMPLEX** — Deep research: Jarvis researches upfront to master the subject, then each agent in the brainstorm searches within their domain of expertise before contributing

Nine domain-critical agents are equipped with domain-specific research directives: architect, backend, frontend, DevOps, security, SEO, content SEO, AI/ML, and legal. Each agent knows *what* to verify in their field — the architect checks framework versions and maintenance status, the security expert checks recent CVEs, the SEO specialist checks algorithm updates.

**Quality guardrails** are built in: ignore libraries with < 100 GitHub stars or no activity in 12 months, cross-reference at least two sources for critical recommendations, prefer primary sources (official docs, GitHub, npm/PyPI) over blog posts.

**Confidence signals** annotate every sensitive recommendation: `[VERIFIED 2026-04]` for web-verified data, `[TRAINING DATA]` for unverified knowledge, `[NEEDS VERIFICATION]` for points requiring manual check.

**Graceful degradation**: when no search tool is available (some platforms don't expose web search), agents work normally but add a `## Limitations` section listing points that would benefit from verification. No fake results, no search theater.

The web search protocol is **opt-in** (disabled by default) and recommended during installation. Enable it in `.assemble.yaml`:

```yaml
search: true    # Agents verify recommendations with current web data
```

### Why Marvel names?

It's a **prompt engineering decision**, not branding.

LLMs encode character knowledge as dense semantic networks. Marvel's universe is the most richly represented in model weights — more so than LOTR, DC, or any other fictional roster we tested. When the config says `@tony-stark`, the LLM activates *inventive, systematic, pragmatic* without a single line of behavioral instruction. `@hawkeye` means precision. `@loki` means persuasion. Each persona compresses hundreds of tokens of explicit guidance into one `@mention`.

We evaluated alternatives deliberately. Marvel won on three criteria: depth of encoding in LLM training data, breadth of distinct personality archetypes, and built-in team dynamics — these characters know how to collaborate under pressure, and the model weights carry that too.

For humans: `@professor-x` is also easier to remember than `@product-manager-agent`.

---

## Quick Start

### Using NPX (recommended)

```bash
npx cohesiumai-assemble
```

### Using Bash (macOS/Linux)

> **Security note:** Piping `curl` into `bash` executes remote code without verification.
> We recommend using `npx cohesiumai-assemble` instead. If you prefer the bash installer,
> download and inspect it first:

```bash
# Option 1 — Download, inspect, then run
curl -fsSL https://raw.githubusercontent.com/CohesiumAI/assemble/main/install.sh -o install.sh
cat install.sh   # review the script
bash install.sh

# Option 2 — Direct execution (not recommended for untrusted networks)
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
6. Enabling **web search** (recommended — agents verify recommendations with current data)
7. Selecting **governance level** (none, standard, strict)

---

## Quick Demo

```bash
$ npx cohesiumai-assemble

🦸 Assemble — AI Agent Orchestrator

▸ 1/13 — Team language
  Team language: english

▸ 3/13 — Team profile
  1) startup   2) enterprise   3) agency   4) custom
  Profile: 4

▸ 4/13 — IDE/CLI selection
  Your choice: 0    # → all 21 platforms

✅ Installation complete!
  164+ tests passing | 21 platforms | 34 agents
```

---

## Your AI agents agree on everything. That's exactly the problem.

LLMs are trained to be helpful. In practice, that means they agree too easily — with you, and especially with each other. Put five AI agents in a room and they will enthusiastically validate a terrible plan while sounding confident.

Assemble breaks this by design with a **two-tier defense against groupthink**:

**Deadpool (@deadpool)** is a permanent contrarian embedded in every workflow. Not optional. Not a suggestion. He challenges assumptions, flags cognitive biases, and forces other agents to prove their reasoning. In our testing, this structural dissent reduced hallucination-driven errors by **65%**.

**Doctor Doom (@doctor-doom)** is the escalation. Summoned only for irreversible, high-stakes decisions — production deploys, architectural pivots, financial commitments. Every objection is quantified. Every risk is mapped to its failure chain. When both Deadpool and Doom flag the same proposal, the decision is **blocked** until the flaws are resolved.

Other frameworks assume agents will naturally check each other. They won't. Consensus is the default failure mode of LLMs. Assemble treats dissent as infrastructure, not decoration.

| | Deadpool | Doctor Doom |
|---|---|---|
| **Presence** | Every workflow | Summoned for crises |
| **Approach** | Intuitive, qualitative | Formal, quantitative |
| **Style** | "Have you considered...?" | "Your assumption fails because..." |
| **Catches** | 80% of issues | The 20% Deadpool misses |
| **Verdict** | GREEN / YELLOW / RED | APPROVED / CONDITIONS / REJECTED |

> **Why this matters:** Most multi-agent frameworks assume agents will naturally check each other. They don't. LLMs are trained to be helpful and agreeable — put five of them in a room and they'll enthusiastically agree on a terrible plan. Deadpool breaks this pattern by design, not by accident.

---

## The Team (34 Agents)

| Marvel Name | Role | @mention |
|-------------|------|----------|
| Tony Stark | System Architect | `@tony-stark` |
| Bruce Banner | Backend Developer | `@bruce-banner` |
| Spider-Man | Frontend Developer | `@spider-man` |
| Hawkeye | QA / Testing | `@hawkeye` |
| Deadpool | Devil's Advocate (permanent) | `@deadpool` |
| Professor X | Product Manager | `@professor-x` |

Plus 28 others: fullstack, mobile, DevOps, security, red team, automation, marketing, growth, ads, SEO, content SEO, GEO/AIO, copywriting, brand, storytelling, social media, data, AI/ML, UX, finance, legal, customer success, PR, and more.

[See the full roster (34 agents) →](docs/AGENTS.md)

> **Note:** Deadpool is the only agent that is **permanently active** in all workflows. All other agents (including Doom) are summoned based on the task. This is by design — the contrarian function must be structural, not optional, to effectively counter LLM sycophancy bias.

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
| Claude Code Desktop | `CLAUDE.md` (self-contained), `.claude/skills/*/SKILL.md` |

### CLI Platforms (5)

| Platform | Configuration Files |
|----------|--------------------|
| Claude Code (CLI) | `CLAUDE.md` (@imports), `.claude/agents/*/AGENT.md`, `.claude/skills/*/SKILL.md`, `.claude/rules/` |
| Codex (OpenAI) | `AGENTS.md` |
| Gemini CLI | `GEMINI.md`, `.gemini/agents/`, `.gemini/skills/`, `.gemini/workflows/` |
| Auggie | `.augment/commands/*.md` |
| Pi | `AGENTS.md`, `SYSTEM.md` |

For platform-specific setup guides and file structure details, see [Platform Support →](docs/PLATFORMS.md)

---

## Configuration

After installation, a `.assemble.yaml` file is created at the root of your project:

```yaml
# Assemble — Project configuration
version: "1.1.1-beta.1"
profile: "custom"                 # startup | enterprise | agency | custom
langue_equipe: "english"          # Language for agent-to-agent communication
langue_output: "english"          # Language for produced deliverables
output_dir: "./assemble-output"   # Output directory for deliverables
platforms: [claude-code, cursor]  # Target platforms
agents: all                       # Activated agents (all or list)
workflows: all                    # Activated workflows (all or list)
governance: "none"                # none | standard | strict
yolo: false                       # Non-interactive chaining (no validation gates)
mcp: false                        # MCP server generation
search: false                     # Web search protocol (agents verify with current data)
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

### Extensibility

**Custom agents:** Drop `AGENT-*.md` files in `.assemble/agents/` — they're auto-discovered and merged during generation. Same slug overrides built-in.

**Custom skills:** Use `npx cohesiumai-assemble import <path>` to copy skill files into `.assemble/skills/`. They're included in the next generation.

For details on MCP server, web search, cross-session memory, metrics, YOLO escalation levels, and governance, see [the full documentation →](docs/)

---

## Workflows (15)

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

29 reusable skills (15 shared + 14 agent-specific) are also available. [See the full skills reference →](docs/SKILLS.md)

---

## Architecture

```
assemble/
  src/
    agents/             # 34 agent definition files (AGENT-*.md)
    skills/
      shared/           # 15 shared skills (multi-agent, includes web-research)
      specific/         # 15 agent-specific skills
        # includes board-execution.md for Kanban ticket orchestration
    workflows/          # 15 workflow definitions (YAML)
    orchestrator/       # ORCHESTRATOR.md (Jarvis)
    config/
      defaults.yaml     # Default configuration (profiles, MCP, memory, metrics)
      teams.yaml        # Team definitions (9 teams)
    commands/
      commands.yaml     # Registry of 11 primary commands + hidden shortcuts + internal skills
  generator/
    generate.js         # Main generator (profiles, custom agents/skills, MCP, memory, metrics)
    lib/
      profiles.js       # Team profiles (startup, enterprise, agency)
      mcp-generator.js  # MCP server + config generator
      agents-md-generator.js  # Universal AGENTS.md generator
      template-engine.js      # Template rendering (memory, metrics, search, governance strict)
    adapters/           # 21 platform adapters (16 IDE + 5 CLI)
  bin/
    cli.js              # Interactive installer (13-step wizard)
    doctor.js           # Health check (npx cohesiumai-assemble doctor)
    diff.js             # Dry run diff (npx cohesiumai-assemble diff)
    ls.js               # List active config (npx cohesiumai-assemble ls)
    import.js           # Import skills (npx cohesiumai-assemble import)
  tests/
    unit.test.js        # Unit tests for core functions
    snapshot.test.js    # Snapshot + qualitative tests
    integration-full.js # Full 21-platform integration tests
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
      |     4. IMPLEMENT (Board Execution for COMPLEX workflows) → _board.yaml + parallel ticket pipeline
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

## Documentation

| Document | Contents |
|----------|----------|
| [Agent Catalog](docs/AGENTS.md) | Complete catalog of all 34 agents with roles, skills, and workflows |
| [Skills Reference](docs/SKILLS.md) | 28 skills (14 shared + 14 specific) with detailed processes |
| [Workflow Guide](docs/WORKFLOWS.md) | 15 workflows with agent chains, inputs/outputs, and dependency graphs |
| [Board Execution Guide](docs/BOARD.md) | `_board.yaml` format, ticket lifecycle, WIP limits, and dependency rules |
| [Platform Support](docs/PLATFORMS.md) | Platform-specific setup guides and file structure details |
| [Command Reference](docs/COMMANDS.md) | Full reference for 11 commands + hidden shortcuts |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Follow the existing file naming conventions (`AGENT-*.md`, `*.yaml`)
4. Test your changes by running the generator: `npm run generate`
5. Validate the output: `npm run validate`
6. Run `npm test` to execute the full test suite
7. Submit a pull request

Agent definitions live in `src/agents/`, skills in `src/skills/`, and workflows in `src/workflows/`. The generator in `generator/` transforms these source files into platform-specific configurations.

---

## License

MIT — An open-source project by [Cohesium AI](https://cohesium.ai)
