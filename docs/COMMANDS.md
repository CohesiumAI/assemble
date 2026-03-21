# Command Reference — 10 Commands

> **10 primary commands** that expose the full power of 34 agents, 15 workflows, and 28 skills. Jarvis smart routing handles complexity assessment and agent selection.

---

## Quick Summary

| Category | Count | Description |
|----------|-------|-------------|
| System Commands | 4 | `/go`, `/party`, `/dismiss`, `/help` |
| Workflow Shortcuts | 6 | `/review`, `/bugfix`, `/feature`, `/sprint`, `/release`, `/mvp` |
| Hidden Shortcuts | 9 | Work if typed, not in autocomplete |
| Agent Access | 33 | Via `@marvel-name` mentions |
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
| 5 | `/review` | Code Review Pipeline | Fullstack → QA → Security → Red Team → Contrarian |
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
| `/security` | Security Audit | Security → Red Team → Backend → DevOps → Legal |

---

## Agent Access (33)

All agents are accessible via `@marvel-name` mentions. Use `@tony-stark`, `@professor-x`, etc. directly in your prompt.

See [docs/AGENTS.md](AGENTS.md) for the complete catalog.

---

## /go Behavior

When you type `/go <request>`, Jarvis:

1. **Assesses complexity:**
   - **TRIVIAL** — Simple question → single agent, direct answer
   - **MODERATE** — Clear task → 2-3 agents, sequential execution
   - **COMPLEX** — Multi-domain → Spec-Driven Methodology

2. **For COMPLEX tasks, applies 5 gated phases:**
   - **SPECIFY** (Professor X) → produces `spec.md` → user validates
   - **PLAN** (Tony Stark) → produces `plan.md` → user validates
   - **TASKS** (Captain America) → produces `tasks.md` → user validates
   - **IMPLEMENT** (Dev agents) → code + tests
   - **CLOSE** (Jarvis) → produces `_quality.md` (automatic)

3. **Selects and chains agents** from the 34-agent roster based on domain matching.

4. **If YOLO mode is enabled** (`yolo: true` in `.assemble.yaml`):
   - Executes all steps autonomously without pausing for validation
   - Chains agents end-to-end — you get the finished result
   - Only stops for: destructive prod actions, missing human info, external side effects
   - Full traceability preserved (`_manifest.yaml`, `_summary.md`, `_quality.md`)

5. **If governance is enabled** (`governance: "standard"` in `.assemble.yaml`):
   - Applies change risk assessment (LOW/MEDIUM/HIGH) per workflow
   - Enforces decision gates before phase transitions
   - Produces quality checkpoints for workflows with 4+ steps

---

## YOLO Escalation (runtime-only)

Two escalation levels beyond standard YOLO, activated **only by human command** — never by agents, never by config.

| Command | Level | Confirmation phrase | Stops for |
|---------|-------|--------------------|-----------|
| `/yolo-hardcore` | Hardcore | "I understand the risks, activate hardcore mode" | Production only |
| `/yolo-full` | Full | "I accept all risks including production data loss, activate full autonomy mode" | Nothing |

**Agents MUST refuse** to activate these modes. If asked, they explain the manual procedure.

See the [README YOLO section](../README.md#yolo-mode--3-escalation-levels) for full details and risk matrix.

---

## Party Mode

`/party <request>` opens a persistent multi-agent session:

- Jarvis auto-selects 3-8 relevant agents + Deadpool (always)
- Agents stay active across all subsequent messages
- Say **"add [agent]"** to add an agent mid-session
- Say **"who's here?"** to see the current roster
- `/dismiss <agent>` removes one agent; `/dismiss` ends the session

---

---

## CLI Subcommands

In addition to the in-session commands above, Assemble provides CLI utilities:

| Command | Description |
|---------|-------------|
| `npx create-assemble doctor` | Health check: verifies config, generated files, Node.js version |
| `npx create-assemble diff` | Dry run: shows what files would be created/modified without generating |
| `npx create-assemble ls` | List active agents, workflows, skills, and configuration |
| `npx create-assemble import <path>` | Import a skill file into `.assemble/skills/` for next generation |

### Doctor

```bash
npx create-assemble doctor
# or
node bin/doctor.js --project /path/to/project
```

Checks: Node.js version, `.assemble.yaml` validity, output directory, generated platform files, custom agents/skills.

### Diff

```bash
npx create-assemble diff
```

Shows what files would be created (new) or modified (existing) without actually regenerating. Useful for previewing changes before `--update`.

### Ls

```bash
npx create-assemble ls
```

Lists the current active configuration: profile, platforms, agents, workflows, governance, and any custom agents/skills.

### Import

```bash
npx create-assemble import ./my-custom-skill.md
```

Copies a skill file into `.assemble/skills/`. The skill must have YAML frontmatter with at least a `name` field. Run `--update` after importing.

---

## Source File

Commands are defined in `src/commands/commands.yaml` with structure: `primary_commands` (10), `hidden_shortcuts` (9), `internal_skills` (28), and `agents` (31 via @mention).
