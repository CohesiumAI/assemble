# Board Execution Guide

> **Board Execution** is the Kanban execution engine used by Assemble during Phase 4 (**IMPLEMENT**) of **COMPLEX** Spec-Driven workflows. It turns structured tickets into an operational board so multiple implementation threads can move in parallel without losing quality gates, dependency order, or traceability.

---

## Introduction

Board Execution is the execution layer that sits between planning and delivery. Instead of treating implementation as a single linear block, Assemble breaks the work into explicit tickets, tracks each one in `_board.yaml`, and moves them through a controlled lifecycle.

This matters when a workflow becomes too large for one straight sequence: independent tickets can run in parallel, blockers stay visible, reviews remain mandatory, and testing is tied directly to acceptance criteria.

---

## Board Format

`_board.yaml` is the single source of truth for execution state. It contains board metadata, visible columns, WIP limits, and the full list of tickets.

### Example `_board.yaml`

```yaml
meta:
  workflow: feature-development
  created_at: 2026-03-29T16:00:00Z
  sprint_goal: "User management API + admin dashboard"
  source_files:
    - spec.md
    - plan.md
    - tasks.md
columns:
  - todo
  - in_progress
  - review
  - test
  - done
wip_limits:
  in_progress: 3
  review: 2
  test: 2
tickets:
  - id: T-001
    title: "Create POST /users endpoint"
    type: story
    story: "As an admin, I want to create a user through the API so that onboarding can be automated."
    points: 5
    priority: 1
    acceptance_criteria:
      - id: AC-001
        given: "valid user payload"
        when: "POST /users is called"
        then: "the API returns 201 and the created user object"
      - id: AC-002
        given: "an email that already exists"
        when: "POST /users is called"
        then: "the API returns 409 with DUPLICATE_EMAIL"
    depends_on: []
    pipeline:
      implement: [dev-backend]
      review: [dev-fullstack]
      test: [qa]
    status: in_progress
    assigned_to:
      - dev-backend
    started_at: 2026-03-29T16:10:00Z
    completed_at: null
    artifacts:
      - path: src/api/users.ts
        type: code
      - path: tests/users.spec.ts
        type: test
    feedback:
      review: null
      test: null

  - id: T-002
    title: "Build users table on admin dashboard"
    type: story
    story: "As an admin, I want to see all users in a dashboard table so that I can manage accounts quickly."
    points: 3
    priority: 2
    acceptance_criteria:
      - id: AC-003
        given: "existing users in the system"
        when: "the admin dashboard loads"
        then: "the table displays user name, email, and status"
    depends_on:
      - T-001
    pipeline:
      implement: [dev-frontend]
      review: [dev-fullstack]
      test: [qa]
    status: todo
    assigned_to: null
    started_at: null
    completed_at: null
    artifacts: []
    feedback:
      review: null
      test: null
```

### Field overview

- **`meta`**: workflow-level metadata and provenance
- **`columns`**: visible board stages
- **`wip_limits`**: maximum number of tickets allowed in constrained columns
- **`tickets`**: execution units with ownership, status, dependencies, artifacts, and feedback
- **`acceptance_criteria`**: explicit Given/When/Then checks used during test
- **`pipeline`**: role assignment for implement, review, and test stages

---

## Ticket Lifecycle

Every ticket follows the same lifecycle:

```
todo → in_progress → review → test → done
```

### Transition rules

#### `todo` → `in_progress`

Allowed only when:
- all `depends_on` tickets are already `done`
- the `in_progress` WIP limit is not exceeded
- implementation ownership is assigned via `pipeline.implement`

On transition, the engine sets `assigned_to` and `started_at`.

#### `in_progress` → `review`

Allowed only after implementation artifacts exist. The ticket keeps its implementation history and is reassigned to the review agent(s) listed in `pipeline.review`.

#### `review` → `in_progress`

Used when review finds blocking issues. The ticket does **not** restart from scratch: previous artifacts stay attached and blocking feedback is appended so the implementing agent can address it directly.

#### `review` → `test`

Allowed only after explicit review approval. The ticket is then handed to the testing agent(s) in `pipeline.test`.

#### `test` → `in_progress`

Used when one or more acceptance criteria fail. Failure feedback must reference the exact acceptance criterion and why it did not pass.

#### `test` → `done`

Allowed only when **every** acceptance criterion passes. The engine sets `completed_at` and preserves the final artifacts and feedback trail.

---

## WIP Limits

WIP limits prevent the board from flooding a stage faster than the team can process it. They are defined per column in `wip_limits`.

Example:

```yaml
wip_limits:
  in_progress: 3
  review: 2
  test: 2
```

Rules:
- If `in_progress` is full, additional ready tickets stay in `todo`
- If `review` is full, completed implementation waits before moving forward
- If `test` is full, approved tickets queue at review output until a slot opens
- Columns without an explicit WIP limit are unconstrained

This keeps throughput stable and avoids creating hidden queues that overwhelm reviewers or QA.

---

## Dependency Resolution

A ticket can start only when **all** tickets listed in `depends_on` are already `done`. Dependencies are resolved automatically by the board engine; agents do not manually override them.

Implications:
- Independent tickets can run in parallel
- Blocked tickets remain visible in `todo`
- Downstream work starts only when upstream artifacts are complete and validated

This is what allows parallelism without sacrificing execution order.

---

## Context Injection

Board Execution injects **only ticket-specific context** into each agent invocation. It does **not** send the full board unless the current task is explicitly about board management.

Typical injected context per ticket:
- ticket identity: `id`, `title`, `type`, `priority`, `story`
- acceptance contract: full `acceptance_criteria`
- dependency context: IDs plus completed artifacts from dependency tickets
- current state: `status`, `assigned_to`, timestamps, known feedback
- current stage role: implement, review, or test

This keeps execution focused, reduces noise, and prevents unrelated tickets from leaking into an agent's working context.

---

## Agent Roles

Board Execution depends on clear role boundaries:

- **PM (Professor X)**: creates structured tickets with explicit acceptance criteria in Given/When/Then form
- **Scrum Master (Captain America)**: transforms `tasks.md` into `_board.yaml`, defines flow, and manages execution rules
- **Dev agents**: implement ticket work during the `in_progress` stage
- **Fullstack / QA**: review and test tickets before completion
- **Jarvis**: orchestrates transitions, checks dependencies, and keeps state synchronized

The board is operational only if each role stays inside its responsibility boundary.

---

## Integration with the Spec-Driven Methodology

Board Execution is used during **Phase 4 — IMPLEMENT** of the Spec-Driven methodology. The flow becomes:

1. **BRAINSTORM** → multi-agent exploration
2. **SPECIFY** → PM writes `spec.md`
3. **PLAN** → Architect writes `plan.md`
4. **TASKS** → Scrum writes `tasks.md`
5. **IMPLEMENT** → Scrum generates `_board.yaml`, then the board engine runs tickets
6. **CLOSE** → Jarvis consolidates quality output

For simple work — especially fewer than 3 tickets with no dependencies — Assemble can keep a linear implementation path instead of creating a board.

---

## Anti-patterns

Never do the following:

- Execute a ticket whose dependencies are not `done`
- Exceed a declared WIP limit
- Skip review or test to move faster
- Inject the entire board into every ticket execution
- Rewrite acceptance criteria during execution
- Mark a ticket `done` without validating every Given/When/Then criterion
- Drop artifacts or feedback when a ticket loops back from review or test
- Use the board for trivial work that does not justify Kanban overhead

---

## Source Files

Board Execution behavior is defined and informed by:

- `src/skills/specific/board-execution.md`
- `src/agents/AGENT-pm.md`
- `src/agents/AGENT-scrum.md`
