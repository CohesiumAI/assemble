# Cohesium AI — Agent Workflow System

> Transform any IDE or CLI into a full interdisciplinary team of **31 specialized AI agents**, organized in **9 teams**, with **15 automated workflows**, **27 skills**, and **85+ commands** — deployable across **20 platforms** (15 IDE + 5 CLI).

## What is Cohesium AI?

Cohesium AI is a multi-agent orchestration system that turns your development environment into a complete, cross-functional team. Each agent is a senior-level expert in its domain, inspired by the Marvel universe, and capable of collaborating with others through automatically orchestrated workflows.

The system uses an **adapter pattern**: agent definitions, skills, and workflows are maintained as platform-agnostic source files, then a generator produces the correct configuration files for each target platform — Cursor rules, Claude Code commands, GitHub Copilot agents, and 17 others.

An orchestrator named **Jarvis** serves as the single entry point. It analyzes incoming requests, classifies them, matches or composes workflows, and delegates work to the appropriate agents in sequence.

---

## Quick Start

### Using NPX (recommended)

```bash
npx create-cohesium-agents
```

### Using Bash (macOS/Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/CohesiumAI/Agents/main/install.sh | bash
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

1. Choosing your **target platforms** (Cursor, Claude Code, Copilot, etc.)
2. Selecting which **agents** to activate
3. Configuring **languages** (team communication and deliverables)
4. Setting the **output directory** for deliverables

---

## Update an Existing Installation

If you already have Cohesium AI installed, you can update to the latest version while preserving your preferences:

```bash
npx create-cohesium-agents --update
```

The `--update` flag re-generates all platform configuration files from your existing `.cohesium.yaml` without re-running the interactive setup. Your agent selection, language settings, and output directory are preserved.

You can also use the in-session commands:

| Command | Description |
|---------|-------------|
| `/update` | Regenerate files from the existing `.cohesium.yaml` |
| `/reconfigure` | Relaunch the interactive configuration assistant |

---

## The Team (31 Agents)

### Dev Team (6 agents)

| Agent ID | Marvel Name | Role | Command |
|----------|-------------|------|---------|
| `architect` | Tony Stark | System Architect | `/agent-architect` |
| `dev-backend` | Bruce Banner | Backend Developer | `/agent-backend` |
| `dev-frontend` | Spider-Man | Frontend Developer | `/agent-frontend` |
| `dev-fullstack` | Mr. Fantastic | Fullstack Developer | `/agent-fullstack` |
| `dev-mobile` | Ant-Man | Mobile Developer | `/agent-mobile` |
| `db` | Doctor Strange | Database Architect | `/agent-db` |

### Ops & Quality Team (4 agents)

| Agent ID | Marvel Name | Role | Command |
|----------|-------------|------|---------|
| `devops` | Thor | DevOps / SRE | `/agent-devops` |
| `qa` | Hawkeye | QA / Testing | `/agent-qa` |
| `security` | Punisher | Security / InfoSec | `/agent-security` |
| `automation` | Quicksilver | Automation | `/agent-automation` |

### Product & Strategy Team (4 agents)

| Agent ID | Marvel Name | Role | Command |
|----------|-------------|------|---------|
| `pm` | Professor X | Product Manager | `/agent-pm` |
| `analyst` | Nick Fury | Business Analyst | `/agent-analyst` |
| `scrum` | Captain America | Scrum Master | `/agent-scrum` |
| `legal` | She-Hulk | Legal / Compliance | `/agent-legal` |

### Marketing & Growth Team (6 agents)

| Agent ID | Marvel Name | Role | Command |
|----------|-------------|------|---------|
| `marketing` | Star-Lord | Marketing Manager | `/agent-marketing` |
| `growth` | Rocket Raccoon | Growth Hacker | `/agent-growth` |
| `ads` | Gamora | Paid Media | `/agent-ads` |
| `seo` | Black Widow | Technical SEO | `/agent-seo` |
| `content-seo` | Storm | Content SEO | `/agent-content-seo` |
| `geo-aio` | Jean Grey | GEO / AIO | `/agent-geo` |

### Content & Communication Team (4 agents)

| Agent ID | Marvel Name | Role | Command |
|----------|-------------|------|---------|
| `copywriter` | Loki | Copywriter | `/agent-copywriter` |
| `brand` | Black Panther | Brand Strategist | `/agent-brand` |
| `storytelling` | Silver Surfer | Storytelling | `/agent-storytelling` |
| `social` | Ms. Marvel | Social Media Manager | `/agent-social` |

### Data & AI Team (2 agents)

| Agent ID | Marvel Name | Role | Command |
|----------|-------------|------|---------|
| `data` | Beast | Data Analyst | `/agent-data` |
| `ai-engineer` | Vision | AI Engineer | `/agent-ai` |

### Design Team (1 agent)

| Agent ID | Marvel Name | Role | Command |
|----------|-------------|------|---------|
| `ux` | Invisible Woman | UX/UI Designer | `/agent-ux` |

### Business & Operations Team (3 agents)

| Agent ID | Marvel Name | Role | Command |
|----------|-------------|------|---------|
| `customer-success` | Pepper Potts | Customer Success Manager | `/agent-cs` |
| `finance` | Iron Fist | CFO / Finance Director | `/agent-finance` |
| `pr-comms` | Phil Coulson | PR / Communications Director | `/agent-pr` |

### Meta (2 agents)

| Agent ID | Marvel Name | Role | Command |
|----------|-------------|------|---------|
| `contrarian` | Deadpool | Devil's Advocate | `/agent-contrarian` |
| `jarvis` | Jarvis | Orchestrator | *(automatic)* |

---

## Workflows (15)

Workflows are pre-configured agent chains that orchestrate a sequence of specialists to accomplish a complete objective. Each step receives inputs from previous agents and produces outputs consumed by downstream agents. Jarvis manages the chaining automatically.

| # | Workflow | Trigger | Agent Chain | Description |
|---|----------|---------|-------------|-------------|
| 1 | MVP Launch | `/mvp` | PM, Architect, UX, DB, Backend, Frontend, QA, DevOps | Full MVP from product vision to deployment |
| 2 | Feature Development | `/feature` | PM, Analyst, Architect, Backend, Frontend, QA | End-to-end feature from spec to validation |
| 3 | Bug Fix | `/bugfix` | QA, Dev, QA | Structured bug analysis, fix, and regression test |
| 4 | Code Review Pipeline | `/review-pipeline` | Fullstack, QA, Security, Contrarian | Multi-perspective code review with devil's advocate |
| 5 | Security Audit | `/audit-security` | Security, Backend, DevOps, Legal | Full security audit with remediation and compliance |
| 6 | SEO Content Pipeline | `/seo-pipeline` | SEO, Content-SEO, Copywriter, GEO/AIO | SEO-optimized content from keyword research to GEO |
| 7 | Marketing Campaign | `/campaign` | Marketing, Finance, Brand, Copywriter, Ads + Social + PR, Growth | Multi-channel campaign with budget validation and PR |
| 8 | Sprint Cycle | `/sprint` | Scrum, PM, Fullstack, QA, DevOps | Complete agile sprint from planning to release |
| 9 | Tech Debt Reduction | `/tech-debt` | Architect, Fullstack, QA, DevOps | Debt inventory, refactoring, and rollback strategy |
| 10 | Project Onboarding | `/onboard` | PM, Analyst, Architect, Scrum | New project scoping and team setup |
| 11 | Release Cycle | `/release` | Scrum, QA, Security, Legal, DevOps, Marketing, PR, CS | Full release with legal, PR, and customer communication |
| 12 | Hotfix Release | `/hotfix` | QA, Security, Fullstack, QA, DevOps | Emergency production fix with minimal validation |
| 13 | Dependency Upgrade | `/upgrade-deps` | Architect, Security, Fullstack, QA, DevOps | Dependency updates with CVE check and compatibility tests |
| 14 | Documentation Sprint | `/doc-sprint` | Analyst, Architect, Fullstack, Copywriter, DevOps | Documentation inventory, writing, editing, and publishing |
| 15 | Experimentation | `/experiment-cycle` | PM, Data, Fullstack, QA, Growth | A/B experiment from hypothesis to statistical decision |

---

## Skills (27)

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

### Specific Skills (13)

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

---

## Supported Platforms (20)

### IDE Platforms (15)

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

### CLI Platforms (5)

| Platform | Configuration Files |
|----------|--------------------|
| Claude Code | `CLAUDE.md`, `.claude/agents/*/AGENT.md`, `.claude/skills/*/SKILL.md`, `.claude/rules/` |
| Codex (OpenAI) | `AGENTS.md` |
| Gemini CLI | `GEMINI.md`, `.gemini/agents/`, `.gemini/skills/`, `.gemini/workflows/` |
| Auggie | `.augment/commands/*.md` |
| Pi | `AGENTS.md`, `SYSTEM.md` |

---

## Architecture

```
cohesium-ai/
  src/
    agents/             # 31 agent definition files (AGENT-*.md)
    skills/
      shared/           # 14 shared skills (multi-agent)
      specific/         # 13 agent-specific skills
    workflows/          # 15 workflow definitions (YAML)
    orchestrator/       # ORCHESTRATOR.md (Jarvis)
    config/
      defaults.yaml     # Default configuration
      teams.yaml        # Team definitions (9 teams)
    commands/
      commands.yaml     # Registry of all 85+ commands
  generator/            # Platform-specific file generator
  bin/                  # CLI entry point (npx create-cohesium-agents)
  install.sh            # Bash installer
  install.py            # Python installer
  install.ps1           # PowerShell installer (Windows)
  install.bat           # Batch installer (Windows)
```

### Execution Flow

```
User Request
      |
      v
  Jarvis (Orchestrator)
      |
      +-- Classify the request
      +-- Match a workflow (or compose an ad-hoc chain)
      +-- Initialize workspace (cohesium-output/)
      +-- Create _manifest.yaml
      |
      v
  Sequential Execution
      |
      +-- Agent 1 --> deliverables --> _manifest.yaml updated
      +-- Agent 2 --> deliverables --> _manifest.yaml updated
      +-- ...
      +-- Agent N --> deliverables --> _manifest.yaml updated
      |
      v
  Consolidation
      |
      +-- _summary.md (workflow summary)
      +-- Report to user
```

---

## Configuration

After installation, a `.cohesium.yaml` file is created at the root of your project:

```yaml
version: "1.0.0"

i18n:
  team_language: "english"        # Language for agent-to-agent communication
  output_language: "english"      # Language for produced deliverables

output:
  dir: "./cohesium-output"        # Output directory
  structure: "{workflow_name}_{timestamp}"

agents:
  default: all                    # Activated agents (all or list)

workflows:
  default: all                    # Activated workflows (all or list)
```

---

## Documentation

| Document | Contents |
|----------|----------|
| [Agent Catalog](docs/AGENTS.md) | Complete catalog of all 31 agents with roles, skills, and workflows |
| [Skills Reference](docs/SKILLS.md) | 27 skills (14 shared + 13 specific) with detailed processes |
| [Workflow Guide](docs/WORKFLOWS.md) | 15 workflows with agent chains, inputs/outputs, and dependency graphs |
| [Platform Support](docs/PLATFORMS.md) | Platform-specific setup guides and file structure details |
| [Command Reference](docs/COMMANDS.md) | Full reference for all 85+ commands |

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

MIT — [CohesiumAI](mailto:renald@cohesium.ai)
