# Command Reference — 85+ Commands

> **Complete reference** for all commands available in the Cohesium AI system. Organized by category: agent commands, workflow commands, shared skill commands, specific skill commands, and meta commands.

---

## Quick Summary

| Category | Count | Pattern |
|----------|-------|---------|
| Agent Commands | 31 | `/agent-*` |
| Workflow Commands | 15 | `/mvp`, `/feature`, `/bugfix`, etc. |
| Shared Skill Commands | 14 | `/review`, `/test`, `/doc`, etc. |
| Specific Skill Commands | 13 | `/scaffold-api`, `/component`, etc. |
| Meta Commands | 17 | `/team`, `/status`, `/help`, etc. |
| **Total** | **90** | |

---

## Agent Commands (31)

Direct invocation of a specialized agent. The agent takes control and works according to its role-specific instructions.

### Dev Team

| Command | Agent | Codename | Description |
|---------|-------|----------|-------------|
| `/agent-architect` | `architect` | Tony Stark | Invoke the Senior System Architect |
| `/agent-backend` | `dev-backend` | Bruce Banner | Invoke the Senior Backend Developer |
| `/agent-frontend` | `dev-frontend` | Spider-Man | Invoke the Senior Frontend Developer |
| `/agent-fullstack` | `dev-fullstack` | Mr. Fantastic | Invoke the Senior Fullstack Developer |
| `/agent-mobile` | `dev-mobile` | Ant-Man | Invoke the Senior Mobile Developer |
| `/agent-db` | `db` | Doctor Strange | Invoke the Senior Database Architect |

### Ops Team

| Command | Agent | Codename | Description |
|---------|-------|----------|-------------|
| `/agent-devops` | `devops` | Thor | Invoke the Senior DevOps / SRE |
| `/agent-qa` | `qa` | Hawkeye | Invoke the Senior QA / Testing Engineer |
| `/agent-security` | `security` | Punisher | Invoke the Senior Security Expert |
| `/agent-automation` | `automation` | Quicksilver | Invoke the Senior Automation Expert |

### Product Team

| Command | Agent | Codename | Description |
|---------|-------|----------|-------------|
| `/agent-pm` | `pm` | Professor X | Invoke the Senior Product Manager |
| `/agent-analyst` | `analyst` | Nick Fury | Invoke the Senior Business Analyst |
| `/agent-scrum` | `scrum` | Captain America | Invoke the Senior Scrum Master |
| `/agent-legal` | `legal` | She-Hulk | Invoke the Legal / Compliance Expert |

### Marketing Team

| Command | Agent | Codename | Description |
|---------|-------|----------|-------------|
| `/agent-marketing` | `marketing` | Star-Lord | Invoke the Senior Marketing Manager |
| `/agent-ads` | `ads` | Gamora | Invoke the Senior Paid Media Expert |
| `/agent-growth` | `growth` | Rocket Raccoon | Invoke the Senior Growth Hacker |
| `/agent-seo` | `seo` | Black Widow | Invoke the Senior Technical SEO Expert |
| `/agent-content-seo` | `content-seo` | Storm | Invoke the Senior Content SEO Expert |
| `/agent-geo` | `geo-aio` | Jean Grey | Invoke the Senior GEO/AIO Expert |

### Content Team

| Command | Agent | Codename | Description |
|---------|-------|----------|-------------|
| `/agent-copywriter` | `copywriter` | Loki | Invoke the Senior Copywriter |
| `/agent-brand` | `brand` | Black Panther | Invoke the Senior Brand Strategist |
| `/agent-storytelling` | `storytelling` | Silver Surfer | Invoke the Senior Storytelling Expert |
| `/agent-social` | `social` | Ms. Marvel | Invoke the Senior Social Media Manager |

### Data Team

| Command | Agent | Codename | Description |
|---------|-------|----------|-------------|
| `/agent-ai` | `ai-engineer` | Vision | Invoke the Senior AI Engineer |
| `/agent-data` | `data` | Beast | Invoke the Senior Data Analyst |

### Design Team

| Command | Agent | Codename | Description |
|---------|-------|----------|-------------|
| `/agent-ux` | `ux` | Invisible Woman | Invoke the Senior UX/UI Designer |

### Cross-functional Agent

| Command | Agent | Codename | Description |
|---------|-------|----------|-------------|
| `/agent-contrarian` | `contrarian` | Deadpool | Invoke the Devil's Advocate |

### Business Team (NEW)

| Command | Agent | Codename | Description |
|---------|-------|----------|-------------|
| `/agent-cs` | `cs` | — | Invoke the Customer Support Expert |
| `/agent-finance` | `finance` | — | Invoke the Finance Expert |
| `/agent-pr` | `pr` | — | Invoke the Public Relations Expert |

---

## Workflow Commands (15)

Launch a complete workflow with automatic orchestration by Jarvis. Each workflow chains multiple agents in a defined sequence.

| Command | Workflow | Agent Sequence | Description |
|---------|----------|----------------|-------------|
| `/mvp` | MVP Launch | PM → Architect → UX → Brand → DB → Backend → Frontend → QA → DevOps | Launch a complete MVP from vision to deployment |
| `/feature` | Feature Development | PM → Analyst → Architect → Backend → Frontend → QA | Develop a new feature from spec to validation |
| `/bugfix` | Bug Fix | QA → Fullstack → QA | Fix a bug with structured analysis and verification |
| `/review-pipeline` | Code Review Pipeline | Fullstack → QA → Security → Contrarian | Run a multi-perspective code review |
| `/audit-security` | Security Audit | Security → Backend → DevOps → Legal | Run a comprehensive security audit |
| `/seo-pipeline` | SEO Content Pipeline | SEO → Content-SEO → Copywriter → GEO/AIO | Create SEO-optimized content end to end |
| `/campaign` | Marketing Campaign | Marketing → Finance → Brand → Copywriter → Ads + Social + PR → Growth | Launch a multi-channel marketing campaign |
| `/sprint` | Sprint Cycle | Scrum → PM → Fullstack → QA → DevOps | Execute a complete agile sprint cycle |
| `/tech-debt` | Tech Debt Reduction | Architect → Fullstack → QA → DevOps | Identify and reduce technical debt |
| `/onboard` | Onboarding Project | PM → Analyst → Architect → Scrum | Kick off a new project with structured onboarding |
| `/release` | Release Cycle | Scrum → QA → Security → Legal → DevOps → Marketing → PR → CS | Execute a full release from validation to communication |
| `/hotfix` | Hotfix | QA → Security → Fullstack → QA → DevOps | Deploy an emergency production fix (NEW) |
| `/upgrade-deps` | Dependency Upgrade | Architect → Security → Fullstack → QA → DevOps | Safely upgrade project dependencies (NEW) |
| `/doc-sprint` | Doc Sprint | Analyst → Architect + Fullstack → Copywriter → DevOps | Run a focused documentation sprint (NEW) |
| `/experiment-cycle` | Experimentation | PM → Data → Fullstack → QA → Growth | Design, build, and analyze a product experiment (NEW) |

> See [docs/WORKFLOWS.md](WORKFLOWS.md) for detailed step descriptions, inputs/outputs, and deliverables.

---

## Shared Skill Commands (14)

Cross-functional skills available to multiple agents. The command activates the skill on the current agent or the most relevant agent.

| Command | Skill | Description | Available Agents |
|---------|-------|-------------|------------------|
| `/api` | API Design | Design REST/GraphQL APIs with contracts, versioning, and documentation | dev-backend, dev-fullstack, architect, dev-mobile |
| `/cicd` | CI/CD | Configure and optimize CI/CD pipelines | devops, dev-backend, dev-fullstack |
| `/review` | Code Review | Run a structured code review with quality checklist | dev-backend, dev-frontend, dev-fullstack, qa, security |
| `/benchmark` | Competitive Analysis | Perform competitive benchmarking and analysis | analyst, marketing, growth, pm |
| `/brief` | Content Brief | Create a structured content brief | content-seo, copywriter, storytelling, social |
| `/db` | Database Query | Optimize database queries and schema design | db, dev-backend, dev-fullstack, data |
| `/doc` | Documentation | Generate technical or functional documentation | all agents |
| `/git` | Git Workflow | Manage Git workflows, branching, and PRs | dev-backend, dev-frontend, dev-fullstack, dev-mobile, devops, scrum |
| `/monitor` | Monitoring | Set up monitoring and observability | devops, data, dev-backend |
| `/perf` | Performance Audit | Run a performance audit | dev-frontend, dev-backend, devops, data |
| `/report` | Reporting | Generate reports and dashboards | data, analyst, pm, scrum, marketing |
| `/sec-check` | Security Check | Run a quick security verification | security, dev-backend, devops, architect |
| `/seo` | SEO Audit | Run a technical SEO audit | seo, content-seo, geo-aio, dev-frontend |
| `/test` | Testing | Define and execute a test strategy | dev-backend, dev-frontend, dev-fullstack, dev-mobile, qa |

> See [docs/SKILLS.md](SKILLS.md) for detailed skill descriptions and step-by-step processes.

---

## Specific Skill Commands (13)

Role-focused skills tied to a primary agent. The command directly invokes the agent's specialized skill.

| Command | Skill | Primary Agent | Description |
|---------|-------|---------------|-------------|
| `/ad-setup` | Ad Campaign Setup | ads | Configure a multi-platform advertising campaign |
| `/automate` | Automation Workflow | automation | Design a multi-tool automation workflow |
| `/scaffold-api` | Backend API Scaffold | dev-backend | Scaffold a complete backend API |
| `/migrate` | DB Migration | db | Create a database migration with rollback |
| `/pipeline` | DevOps Pipeline | devops | Create a CI/CD pipeline |
| `/component` | Frontend Component | dev-frontend | Create a React/Next.js component |
| `/experiment` | Growth Experiment | growth | Design a growth experiment |
| `/compliance` | Legal Compliance Check | legal | Check GDPR/AI Act/nDPA compliance |
| `/screen` | Mobile Screen | dev-mobile | Create a mobile screen |
| `/pentest` | Pentest Scan | security | Run a security scan and penetration test |
| `/test-plan` | QA Test Plan | qa | Create a comprehensive test plan |
| `/sprint-plan` | Sprint Planning | scrum | Plan an agile sprint |
| `/wireframe` | UX Wireframe | ux | Create wireframes and prototypes |

> See [docs/SKILLS.md](SKILLS.md) for detailed skill descriptions and when to use each one.

---

## Meta Commands (17)

System management, information, and navigation commands.

### Team Commands

| Command | Description |
|---------|-------------|
| `/team` | Display the full team with roles and statuses |
| `/team-dev` | Display the Development team (6 agents) |
| `/team-ops` | Display the Ops & Quality team (4 agents) |
| `/team-product` | Display the Product & Strategy team (4 agents) |
| `/team-marketing` | Display the Marketing & Growth team (6 agents) |
| `/team-content` | Display the Content & Communication team (4 agents) |
| `/team-data` | Display the Data & AI team (2 agents) |
| `/team-design` | Display the Design team (1 agent) |
| `/team-business` | Display the Business team (3 agents: CS, Finance, PR) |

### Information Commands

| Command | Description |
|---------|-------------|
| `/agents` | List all available agents |
| `/skills` | List all available skills |
| `/workflows` | List all available workflows |
| `/help` | Display help and the command catalog |

### Control Commands

| Command | Usage | Description |
|---------|-------|-------------|
| `/status` | `/status` | Display the current workflow state |
| `/handoff` | `/handoff <agent-name>` | Manually hand off control to a specific agent |

### Configuration Commands

| Command | Description |
|---------|-------------|
| `/update` | Regenerate files from the existing `.cohesium.yaml` configuration |
| `/reconfigure` | Relaunch the configuration wizard |

---

## Source File

All commands are defined in `src/commands/commands.yaml`. Each command contains:
- `name`: the command (with `/` prefix)
- `type`: `agent`, `workflow`, `skill`, or `meta`
- `description`: command description
- `category`: category for grouping
- Depending on type: `agent`, `workflow`, `skill`, or `team` reference
