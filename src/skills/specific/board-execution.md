---
name: board-execution
description: Kanban board execution engine — manages ticket lifecycle through implement → review → test → done pipeline with parallel execution and dependency resolution
agents: [all]
trigger: /board
---

<!-- Note: parser.js auto-loads skills from src/skills/specific/, but the Claude Code adapter required a patch to emit this skill as .claude/skills/board/SKILL.md. See generator/adapters/cli/claude-code.js. -->

# Skill : Board Execution

## Objective

Execute a Spec-Driven implementation phase through a Kanban board instead of a linear checklist. The board engine coordinates ticket flow across `todo` → `in_progress` → `review` → `test` → `done`, respects dependencies and WIP limits, and keeps `_board.yaml` as the single source of truth.

## When to use

Use this skill during **Phase 4 — IMPLEMENT** for **COMPLEX** Spec-Driven workflows. It may also be used to resume execution, inspect board status, or re-prioritize tickets when a `_board.yaml` file already exists.

## Steps

1. **Read `_board.yaml`** — Load the current board state, metadata, WIP limits, columns, ticket status, assignments, timestamps, dependencies, and artifacts.
2. **Identify ready tickets** — Select tickets in `todo` whose `depends_on` tickets are all `done`.
3. **Respect WIP limits** — Only move as many tickets into a column as allowed by its `wip_limits` entry (e.g. `in_progress`, `review`, or any other column with a defined limit) after accounting for tickets already in that column.
4. **Execute implement** — For each ready ticket, spawn the agent(s) listed in `pipeline.implement`. Inject only the ticket context: `id`, `title`, `story`, `acceptance_criteria`, `depends_on`, and artifacts from dependency tickets. The implementation agent produces code or deliverables, appends implementation artifacts, and the ticket moves to `review`.
5. **Execute review** — Spawn the agent(s) listed in `pipeline.review`. They receive the ticket context plus implementation artifacts and perform a review aligned with the `code-review` skill. If blocking issues are found, the ticket returns to `in_progress` with explicit review feedback. If approved, the ticket moves to `test`.
6. **Execute test** — Spawn the agent(s) listed in `pipeline.test`. They verify **each acceptance criterion individually** using the Given/When/Then structure. If any acceptance criterion fails, the ticket returns to `in_progress` with exact failure details by acceptance criterion. If all pass, the ticket moves to `done`.
7. **Update `_board.yaml`** — After every transition, persist the new `status`, `assigned_to`, relevant timestamps (`started_at`, review/test timestamps if present), feedback, and artifacts.
8. **Loop** — Continue selecting newly ready tickets until every ticket is `done` or a blocker requires explicit user intervention.

## Context Injection per Ticket

When delegating a ticket, provide only the minimum complete execution context:
- Ticket identity: `id`, `title`, `type`, `priority`, `story`
- Acceptance contract: full `acceptance_criteria`
- Dependency context: list of `depends_on` ticket IDs and their completed artifacts
- Current execution state: `status`, `assigned_to`, timestamps, known feedback
- Required pipeline role for the current stage (`implement`, `review`, or `test`)

Do **not** inject unrelated tickets, the full board, or hidden global context that the ticket does not need.

## Transition Rules

- `todo` → `in_progress`
  - Allowed only if all dependencies are `done`
  - Allowed only if `wip_limits.in_progress` is not exceeded
  - Set `assigned_to` to the implementing agent(s)
  - Set `started_at` when work begins

- `in_progress` → `review`
  - Requires implementation artifacts to be attached
  - Update `assigned_to` to the review agent(s)

- `review` → `in_progress`
  - Use when blocking review feedback exists
  - Preserve artifacts and append review feedback

- `review` → `test`
  - Allowed only after explicit review approval
  - Update `assigned_to` to the testing agent(s)

- `test` → `in_progress`
  - Use when one or more acceptance criteria fail
  - Record exactly which AC failed and why

- `test` → `done`
  - Allowed only when every acceptance criterion passes
  - Set `completed_at` timestamp
  - Preserve final artifacts

## Exit Checklist

- [ ] `_board.yaml` was read before execution began
- [ ] Only dependency-ready tickets were executed
- [ ] WIP limits were respected throughout execution
- [ ] Every ticket passed through implement, review, and test
- [ ] Every acceptance criterion was verified individually during test
- [ ] `_board.yaml` was updated after every status transition
- [ ] Blockers or failed checks were recorded with actionable feedback
- [ ] Execution stopped only when all tickets were `done` or a user decision was required

## Output Format

Use `_board.yaml` as the canonical state file. Status updates should persist concrete changes such as:

```yaml
meta:
  workflow: feature-development
columns: [todo, in_progress, review, test, done]
wip_limits:
  in_progress: 3
tickets:
  - id: T-001
    status: review
    assigned_to:
      - dev-fullstack
    started_at: 2026-03-29T16:10:00Z
    completed_at: null
    artifacts:
      - path: src/api/users.ts
        type: code
      - path: test/users.spec.ts
        type: test
    feedback:
      review: null
      test: null
```

When reporting progress, summarize ticket transitions explicitly, for example:
- `T-001: todo → in_progress → review`
- `T-002: review → in_progress (blocking feedback recorded)`
- `T-003: test → done (all acceptance criteria passed)`

## Anti-patterns

- Never execute a ticket whose dependencies aren't done
- Never exceed WIP limits
- Never skip review or test
- Never send the entire board to an agent (send only the ticket context)
- Never modify a ticket's acceptance criteria during execution
- Never mark a ticket `done` without verifying every acceptance criterion
- Never lose prior artifacts or feedback when a ticket loops back to `in_progress`
