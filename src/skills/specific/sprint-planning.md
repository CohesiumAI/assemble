---
name: sprint-planning
description: Agile sprint planning and facilitation with estimation, prioritization, and goal definition
agents: [scrum, pm]
trigger: /sprint-plan
---

# Skill : Sprint Planning

## Objective
Plan and facilitate a structured sprint planning session that results in a clear sprint backlog, defined sprint goals, and a realistic team commitment. Ensure user stories are correctly estimated, prioritized, and understood by all team members.

## When to use
- At the start of each new sprint (sprint planning ceremony)
- When replanning a sprint following a major priority change
- To prepare a PI Planning (SAFe) or larger-scale planning
- When the team starts a new project and needs to structure its first sprint
- During advanced refinement requiring detailed story decomposition

## Steps
1. **Prepare the product backlog** — Verify the backlog is refined: top stories have clear acceptance criteria, associated mockups, and identified dependencies. Remove obsolete stories.
2. **Define the sprint goal** — In collaboration with the Product Owner, formulate a clear and measurable sprint goal that gives direction and meaning to the team's work.
3. **Evaluate team capacity** — Calculate available velocity accounting for vacations, holidays, ceremonies, support, and planned technical debt. Adjust based on previous sprint history.
4. **Estimate stories** — Facilitate the estimation session (Planning Poker, T-shirt sizing, dot voting) to assign story points to each user story. Decompose stories that are too large (> 8 points).
5. **Prioritize and select** — With the Product Owner, select stories that fit in the sprint while respecting capacity. Ensure dependencies are resolved and the sprint goal is achievable.
6. **Decompose into technical tasks** — For each selected story, identify necessary technical tasks (front, back, tests, infra), estimate hours, and assign owners.
7. **Identify risks and dependencies** — List potential sprint risks (external dependency, technical debt, unknown complexity) and define mitigation actions for each risk.
8. **Formalize the sprint backlog** — Document the final sprint backlog with the goal, stories, estimates, assignments, and Definition of Done criteria. Obtain team commitment.

## Exit Checklist
- [ ] Sprint goal is formulated, clear, and accepted by the team
- [ ] Team capacity is calculated and documented (in story points or hours)
- [ ] All selected stories have defined acceptance criteria
- [ ] Estimates are complete for each story (story points assigned)
- [ ] Large stories are decomposed (no story > 8 points)
- [ ] External dependencies are identified and unblocking actions are planned
- [ ] Technical tasks are created for each story with owners
- [ ] The team has confirmed its commitment to the sprint backlog

## Output Format
```
Sprint Planning - Sprint [number]

Sprint goal : [clear and measurable goal description]
Period : [start date] - [end date] ([X] business days)
Team : [X] developers, capacity [Y] story points

Team capacity :
  - Average velocity (last 3 sprints) : [X] SP
  - Adjusted capacity (vacations, support) : [Y] SP
  - Sprint commitment : [Z] SP

Sprint Backlog :

| ID       | Story                              | Points | Priority | Assigned    |
|----------|------------------------------------|--------|----------|-------------|
| US-101   | [story title]                      | 5      | High     | [name]      |
| US-102   | [story title]                      | 3      | High     | [name]      |
| US-103   | [story title]                      | 8      | Medium   | [name]      |
| TECH-042 | [technical debt]                   | 3      | Medium   | [name]      |
| BUG-015  | [bug fix]                          | 2      | High     | [name]      |
| Total    |                                    | 21 SP  |          |             |

Identified risks :
  - [R1] [risk description] — Mitigation : [action]
  - [R2] [risk description] — Mitigation : [action]

External dependencies :
  - [D1] [team / service] — [description] — Status : [resolved / pending]

Definition of Done :
  - Code reviewed by a peer
  - Unit and integration tests passed
  - Documentation updated
  - Deployed to staging and validated by the PO
```
