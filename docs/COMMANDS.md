# Command Reference — 10 Commands

> **10 primary commands** that expose the full power of 31 agents, 15 workflows, and 28 skills. Jarvis smart routing handles complexity assessment and agent selection.

---

## Quick Summary

| Category | Count | Description |
|----------|-------|-------------|
| System Commands | 4 | `/go`, `/party`, `/dismiss`, `/help` |
| Workflow Shortcuts | 6 | `/review`, `/bugfix`, `/feature`, `/sprint`, `/release`, `/mvp` |
| Hidden Shortcuts | 9 | Work if typed, not in autocomplete |
| Agent Access | 31 | Via `@marvel-name` mentions |
| **Total visible** | **10** | |

---

## Primary Commands (10)

### System Commands

| # | Command | Action |
|---|---------|--------|
| 1 | `/go <request>` | Jarvis routes — assesses complexity (trivial/moderate/complex), selects agents, applies methodology |
| 2 | `/party <request>` | Persistent multi-agent collaborative session |
| 3 | `/dismiss` | End the current agent or party session |
| 4 | `/help` | Show catalog (agents, workflows, examples) |

### Workflow Shortcuts

| # | Command | Workflow | Agent Chain |
|---|---------|----------|-------------|
| 5 | `/review` | Code Review Pipeline | Fullstack → QA → Security → Contrarian |
| 6 | `/bugfix` | Bug Fix | QA → Fullstack → QA |
| 7 | `/feature` | Feature Development | PM → Analyst → Architect → Dev → QA |
| 8 | `/sprint` | Sprint Cycle | Scrum → PM → Fullstack → QA → DevOps |
| 9 | `/release` | Release Cycle | Scrum → QA → Security → Legal → DevOps → Marketing → PR → CS |
| 10 | `/mvp` | MVP Launch | PM → Architect → UX → Brand → DB → Backend → Frontend → QA → DevOps |

---

## Hidden Shortcuts (9)

These commands work if typed directly but don't appear in autocomplete. They are also accessible via `/go`.

| Command | Workflow | Description |
|---------|----------|-------------|
| `/refactor` | Tech Debt Reduction | Architect → Fullstack → QA → DevOps |
| `/hotfix` | Hotfix Release | QA → Security → Fullstack → QA → DevOps |
| `/upgrade` | Dependency Upgrade | Architect → Security → Fullstack → QA → DevOps |
| `/campaign` | Marketing Campaign | Marketing → Finance → Brand → Copy → Ads + Social + PR → Growth |
| `/seo` | SEO Content Pipeline | SEO → Content-SEO → Copywriter → GEO |
| `/experiment` | Experimentation | PM → Data → Fullstack → QA → Growth |
| `/onboard` | Project Onboarding | PM → Analyst → Architect → Scrum |
| `/docs` | Documentation Sprint | Analyst → Architect → Fullstack → Copywriter → DevOps |
| `/security` | Security Audit | Security → Backend → DevOps → Legal |

---

## Agent Access (31)

All agents are accessible via `@marvel-name` mentions. Use `@tony-stark`, `@professor-x`, etc. directly in your prompt.

See [docs/AGENTS.md](AGENTS.md) for the complete catalog.

---

## /go Behavior

When you type `/go <request>`, Jarvis:

1. **Assesses complexity:**
   - **TRIVIAL** — Simple question → single agent, direct answer
   - **MODERATE** — Clear task → 2-3 agents, sequential execution
   - **COMPLEX** — Multi-domain → Spec-Driven Methodology

2. **For COMPLEX tasks, applies 4 gated phases:**
   - **SPECIFY** (Professor X) → produces `spec.md` → user validates
   - **PLAN** (Tony Stark) → produces `plan.md` → user validates
   - **TASKS** (Captain America) → produces `tasks.md` → user validates
   - **IMPLEMENT** (Dev agents) → code + tests

3. **Selects and chains agents** from the 31-agent roster based on domain matching.

---

## Party Mode

`/party <request>` opens a persistent multi-agent session:

- Jarvis auto-selects 3-8 relevant agents + Deadpool (always)
- Agents stay active across all subsequent messages
- Say **"add [agent]"** to add an agent mid-session
- Say **"who's here?"** to see the current roster
- `/dismiss <agent>` removes one agent; `/dismiss` ends the session

---

## Source File

Commands are defined in `src/commands/commands.yaml` with structure: `primary_commands` (10), `hidden_shortcuts` (9), `internal_skills` (28), and `agents` (31 via @mention).
