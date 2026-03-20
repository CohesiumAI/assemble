---
name: qa-test-plan
description: Complete test plan creation with strategies, test cases, coverage matrices, and acceptance criteria
agents: [qa, dev-backend, dev-frontend, dev-fullstack]
trigger: /test-plan
---

# Skill : QA Test Plan

## Objective
Create a complete and structured test plan covering all functional and non-functional requirements of a feature or release. Define test strategies, write detailed test cases, establish coverage matrices, and set acceptance criteria to ensure quality before production deployment.

## When to use
- Before starting tests on a new feature or epic
- When preparing a major release requiring a structured test plan
- When a critical regression requires strengthening test coverage
- For a quality audit or certification requiring formal test documentation
- When setting up a test strategy for a new project

## Steps
1. **Analyze requirements** — Study functional specifications, user stories, acceptance criteria, and mockups. Identify business rules, edge cases, and non-functional constraints (performance, security, accessibility).
2. **Define the test strategy** — Choose the types of tests to perform (unit, integration, functional, E2E, performance, security, accessibility) and approaches (black box, white box, exploratory).
3. **Identify test scenarios** — List scenarios covering the happy path, alternative cases, error cases, and edge cases. Organize scenarios by functional module and priority.
4. **Write test cases** — For each scenario, write detailed test cases with preconditions, execution steps, test data, expected results, and postconditions. Use a standardized format.
5. **Create the coverage matrix** — Establish the traceability matrix linking each requirement to corresponding test cases. Identify uncovered areas and add missing cases.
6. **Configure the test environment** — Define environment prerequisites (test data, configuration, external services, mocks) and prepare necessary data sets.
7. **Define acceptance criteria** — Set exit criteria: minimum pass rate, required coverage, zero blocking/critical defects, performance within defined thresholds.
8. **Plan execution** — Estimate test effort, define execution schedule, assign testers, and plan regression cycles.

## Exit Checklist
- [ ] All functional requirements are covered by at least one test case
- [ ] Edge cases and error scenarios are documented and tested
- [ ] Traceability matrix is complete (requirements vs. test cases)
- [ ] Test data is prepared and reproducible
- [ ] Acceptance criteria are defined and measurable
- [ ] Performance tests have quantified thresholds (response time, load)
- [ ] WCAG 2.1 AA accessibility tests are included
- [ ] Execution schedule is realistic and validated by the team

## Output Format
```
Test Plan

Project : [project / feature name]
Version : [test plan version]
Author : [agent qa]
Date : [date]
Sprint / Release : [reference]

Test scope :
  - Covered features : [list]
  - Out-of-scope features : [list]
  - Target environment : [staging / pre-prod / browsers / devices]

Test strategy :
  | Test type          | Approach         | Tool            | Automated |
  |--------------------|------------------|-----------------|-----------|
  | Unit tests         | White box        | Jest / Vitest   | Yes       |
  | Integration tests  | API / Service    | Supertest       | Yes       |
  | Functional tests   | Black box        | Cypress / PWTW  | Partial   |
  | E2E tests          | Full journey     | Playwright      | Yes       |
  | Performance tests  | Load / Stress    | k6 / Artillery  | Yes       |
  | Accessibility tests| WCAG 2.1 AA      | axe / Lighthouse| Partial   |

Test cases :

[TC-001] Test case title
  - Priority : High
  - Preconditions : [required initial state]
  - Steps :
    1. [user action]
    2. [user action]
    3. [verification]
  - Test data : [required data]
  - Expected result : [expected behavior]
  - Postconditions : [final state]

Coverage matrix :
  | Requirement | TC-001 | TC-002 | TC-003 | TC-004 | Coverage |
  |-------------|--------|--------|--------|--------|----------|
  | REQ-01      |   X    |   X    |        |        | 100%     |
  | REQ-02      |        |        |   X    |   X    | 100%     |
  | REQ-03      |        |   X    |        |        | 50%      |

Acceptance criteria :
  - Pass rate : >= 95% of test cases passed
  - Zero open blocking or critical defects
  - Code coverage : >= 80%
  - API response time : < 200ms (P95)
  - Lighthouse accessibility score : >= 90

Schedule :
  - Preparation : [start date] - [end date]
  - Execution cycle 1 : [start date] - [end date]
  - Fix and retest : [start date] - [end date]
  - Final regression : [start date] - [end date]
```
