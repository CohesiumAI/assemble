# Workflow Guide — 15 Pre-configured Workflows

> **15 workflows**: pre-configured production chains that automatically orchestrate a sequence of agents to accomplish a complete objective end to end.

---

## Overview

| # | Workflow | Trigger | Agent Sequence | Description |
|---|----------|---------|----------------|-------------|
| 1 | MVP Launch | `/mvp` | PM → Architect → UX → Brand → DB → Backend → Frontend → QA → DevOps | Launch an MVP from vision to deployment (9 steps) |
| 2 | Feature Development | `/feature` | PM → Analyst → Architect → Backend → Frontend → QA | Develop a new feature from spec to validation |
| 3 | Bug Fix | `/bugfix` | QA → Fullstack → QA | Structured bug fix from analysis to verification |
| 4 | Code Review Pipeline | `/review` | Fullstack → QA → Security → Red Team → Contrarian | Multi-perspective code review with offensive testing |
| 5 | Security Audit | `/security` | Security → Red Team → Backend → DevOps → Legal | Full security audit with red team pentest |
| 6 | SEO Content Pipeline | `/seo-pipeline` | SEO → Content-SEO → Copywriter → GEO/AIO | Create SEO-optimized content end to end |
| 7 | Marketing Campaign | `/campaign` | Marketing → Finance → Brand → Copywriter → Ads + Social + PR → Growth | Multi-channel marketing campaign (8 steps) |
| 8 | Sprint Cycle | `/sprint` | Scrum → PM → Fullstack → QA → DevOps | Complete agile sprint cycle |
| 9 | Tech Debt Reduction | `/tech-debt` | Architect → Fullstack → QA → DevOps | Identify and reduce technical debt |
| 10 | Onboarding Project | `/onboard` | PM → Analyst → Architect → Scrum | New project kickoff and team setup |
| 11 | Release Cycle | `/release` | Scrum → QA → Security → Legal → DevOps → Marketing → PR → CS | Full release cycle from validation to communication (8 steps) |
| 12 | Hotfix | `/hotfix` | QA → Security → Fullstack → QA → DevOps | Emergency production fix with security check (NEW) |
| 13 | Dependency Upgrade | `/upgrade-deps` | Architect → Security → Fullstack → QA → DevOps | Safe dependency upgrade pipeline (NEW) |
| 14 | Doc Sprint | `/doc-sprint` | Analyst → Architect + Fullstack → Copywriter → DevOps | Focused documentation sprint (NEW) |
| 15 | Experimentation | `/experiment-cycle` | PM → Data → Fullstack → QA → Growth | Design, build, and analyze experiments (NEW) |

---

## Chaining Concept

Each workflow is an **ordered sequence of agents** where every step:

1. **Receives inputs** — deliverables produced by previous agents
2. **Executes an action** — the agent's specific work
3. **Produces outputs** — deliverables consumed by subsequent agents
4. **Declares dependencies** — `depends_on` defines which steps must complete first

### Spec-Driven implementation note

For **COMPLEX** workflows, Phase 4 (**IMPLEMENT**) uses **Board Execution** instead of a purely linear handoff. Captain America generates a Kanban board in `_board.yaml`, then Jarvis executes dependency-ready tickets through **implement → review → test → done**. WIP limits and dependency resolution are enforced automatically so multiple tickets can progress in parallel without losing control.

For simple workflows, execution remains linear — especially when there are fewer than 3 tickets and no meaningful dependencies.

The Jarvis orchestrator manages this chaining automatically:
- It injects context (inputs) before each agent starts
- It verifies that expected outputs are produced
- It updates the `_manifest.yaml` after each step
- It alerts if a deliverable is missing

---

## Workflow Details

### 1. MVP Launch (`/mvp`)

**Description:** Launch an MVP from start to finish — from product vision to deployment. Covers the full stack: product definition, architecture, design, database, backend, frontend, testing, and deployment.

**Output directory:** `{assemble_output}/mvp_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `pm` | Define product vision, user stories, and MVP scope | — | `product-brief.md`, `user-stories.md` |
| 2 | `architect` | Design the technical architecture for the MVP | product-brief | `architecture-decision.md`, `tech-stack.md` |
| 3 | `ux` | Create wireframes for key screens | product-brief, user-stories | `wireframes.md`, `user-flows.md` |
| 4 | `brand` | Establish brand guidelines and visual identity for the MVP | product-brief, wireframes | `brand-guidelines.md`, `visual-identity.md` |
| 5 | `db` | Design the data schema | architecture-decision, user-stories | `schema.md`, `migrations.md` |
| 6 | `dev-backend` | Develop the API and business logic | architecture-decision, tech-stack, schema | `api-spec.md`, `endpoints.md` |
| 7 | `dev-frontend` | Develop the user interface | wireframes, user-flows, api-spec, brand-guidelines | `components.md`, `pages.md` |
| 8 | `qa` | Test the MVP end to end | api-spec, components, user-stories | `test-plan.md`, `test-report.md` |
| 9 | `devops` | Set up CI/CD and deployment | tech-stack, test-report | `deployment-guide.md`, `ci-cd-config.md` |

**Dependency graph:**
```
PM(1) → Architect(2) → DB(5) → Backend(6) → Frontend(7) → QA(8) → DevOps(9)
PM(1) → UX(3) → Brand(4) ────────────────────↗
```

**Key deliverables:** Product brief, architecture decision, wireframes, brand guidelines, database schema, API spec, UI components, test report, deployment guide.

---

### 2. Feature Development (`/feature`)

**Description:** Develop a new feature from specification to validation. Covers functional specification, requirements analysis, technical design, implementation, and QA.

**Output directory:** `{assemble_output}/feature_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `pm` | Write the functional specification | — | `feature-spec.md`, `acceptance-criteria.md` |
| 2 | `analyst` | Analyze technical and business requirements | feature-spec, acceptance-criteria | `requirements.md`, `impact-analysis.md` |
| 3 | `architect` | Design the technical solution | requirements, feature-spec | `technical-design.md`, `integration-plan.md` |
| 4 | `dev-backend` | Implement business logic and endpoints | technical-design, requirements | `implementation-notes.md`, `api-changes.md` |
| 5 | `dev-frontend` | Implement the user interface | technical-design, api-changes, feature-spec | `ui-implementation.md`, `component-list.md` |
| 6 | `qa` | Validate with functional and regression tests | implementation-notes, ui-implementation, acceptance-criteria | `test-report.md`, `validation-summary.md` |

**Key deliverables:** Feature spec, impact analysis, technical design, integration plan, implementation notes, validation report.

---

### 3. Bug Fix (`/bugfix`)

**Description:** Structured bug fix from analysis to verification. QA analyzes and reproduces the bug, the fullstack developer fixes it, and QA validates the fix with regression tests.

**Output directory:** `{assemble_output}/bugfix_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `qa` | Analyze the bug and reproduce the problem | — | `bug-analysis.md`, `reproduction-steps.md` |
| 2 | `dev-fullstack` | Propose and implement the fix | bug-analysis, reproduction-steps | `fix-proposal.md`, `fix-implementation.md` |
| 3 | `qa` | Run regression tests and validate the fix | fix-proposal, fix-implementation, bug-analysis | `regression-test.md`, `validation-report.md` |

**Key deliverables:** Bug analysis, reproduction steps, fix proposal, regression test results, validation report.

---

### 4. Code Review Pipeline (`/review`)

**Description:** Multi-perspective code review pipeline with offensive security testing. Fullstack summarizes, QA evaluates quality, Security audits, Red Team attempts exploitation, and Contrarian challenges.

**Output directory:** `{assemble_output}/code-review_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `dev-fullstack` | Summarize changes and document decisions | — | `code-summary.md`, `change-rationale.md` |
| 2 | `qa` | Evaluate code quality and test coverage | code-summary, change-rationale | `quality-report.md`, `recommendations.md` |
| 3 | `security` | Audit the code for vulnerabilities | code-summary, quality-report | `security-findings.md`, `risk-assessment.md` |
| 4 | `redteam` | Attempt exploitation of findings and find missed vulnerabilities | code-summary, security-findings | `exploit-report.md`, `attack-vectors.md` |
| 5 | `contrarian` | Challenge technical choices and propose alternatives | code-summary, quality-report, security-findings, exploit-report | `devil-advocate-report.md`, `alternative-approaches.md` |

**Key deliverables:** Code summary, quality report, security findings, exploit report, Devil's Advocate report.

---

### 5. Security Audit (`/security`)

**Description:** Full security audit with red team pentest, remediation, infrastructure hardening, and regulatory compliance.

**Output directory:** `{assemble_output}/security-audit_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `security` | Scan and identify vulnerabilities (blue team audit) | — | `vulnerability-report.md`, `threat-model.md` |
| 2 | `redteam` | Offensive pentest: exploit findings + find missed vulnerabilities | vulnerability-report, threat-model | `pentest-report.md`, `exploit-chains.md` |
| 3 | `dev-backend` | Develop the remediation plan for all findings | vulnerability-report, pentest-report, exploit-chains | `remediation-plan.md`, `patching-schedule.md` |
| 4 | `devops` | Harden infrastructure security | vulnerability-report, remediation-plan | `infrastructure-hardening.md`, `security-config.md` |
| 5 | `legal` | Verify regulatory compliance | vulnerability-report, pentest-report, infrastructure-hardening, remediation-plan | `compliance-check.md`, `regulatory-summary.md` |

**Key deliverables:** Vulnerability report, pentest report, exploit chains, remediation plan, infrastructure hardening, compliance check.

---

### 6. SEO Content Pipeline (`/seo-pipeline`)

**Description:** End-to-end SEO content creation pipeline from keyword research to GEO/AIO optimization. Produces fully optimized content ready for publication.

**Output directory:** `{assemble_output}/seo-content_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `seo` | Perform keyword research and define content strategy | — | `keyword-research.md`, `content-strategy.md` |
| 2 | `content-seo` | Write the content brief and semantic structure | keyword-research, content-strategy | `content-brief.md`, `semantic-structure.md` |
| 3 | `copywriter` | Write the SEO-optimized article | content-brief, semantic-structure, keyword-research | `article-draft.md`, `meta-tags.md` |
| 4 | `geo-aio` | Optimize for geolocated search and generative AI | article-draft, keyword-research, semantic-structure | `geo-optimization.md`, `aio-recommendations.md` |

**Key deliverables:** Keyword research, content brief, SEO-optimized article, GEO/AIO optimization recommendations.

---

### 7. Marketing Campaign (`/campaign`)

**Description:** Launch a multi-channel marketing campaign from strategy through execution. Covers strategy, budgeting, branding, copywriting, paid media, social media, PR, and growth tracking.

**Output directory:** `{assemble_output}/marketing_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `marketing` | Define campaign strategy and target audience | — | `campaign-strategy.md`, `target-audience.md` |
| 2 | `finance` | Plan the budget and allocate resources | campaign-strategy, target-audience | `budget-plan.md`, `resource-allocation.md` |
| 3 | `brand` | Establish brand guidelines and positioning | campaign-strategy, target-audience | `brand-guidelines.md`, `messaging.md` |
| 4 | `copywriter` | Write text assets for all channels | brand-guidelines, messaging, target-audience | `copy-assets.md`, `tone-of-voice.md` |
| 5 | `ads` | Configure advertising campaigns | campaign-strategy, target-audience, copy-assets, budget-plan | `ad-setup.md`, `media-plan.md` |
| 5 | `social` | Plan the editorial calendar and social content | copy-assets, brand-guidelines, campaign-strategy | `social-calendar.md`, `content-plan.md` |
| 5 | `pr` | Prepare press outreach and media relations | campaign-strategy, messaging, copy-assets | `press-kit.md`, `media-outreach.md` |
| 6 | `growth` | Define growth metrics and experiments | ad-setup, social-calendar, press-kit, campaign-strategy | `growth-metrics.md`, `experiment-plan.md` |

> Steps 5 (Ads, Social, PR) run in parallel.

**Key deliverables:** Campaign strategy, budget plan, brand guidelines, copy assets, ad setup, social calendar, press kit, growth metrics.

---

### 8. Sprint Cycle (`/sprint`)

**Description:** Complete agile sprint cycle from planning to delivery. Covers backlog preparation, goal setting, implementation, testing, and release.

**Output directory:** `{assemble_output}/sprint_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `scrum` | Prepare the sprint backlog and plan ceremonies | — | `sprint-backlog.md`, `ceremony-plan.md` |
| 2 | `pm` | Define sprint goals and prioritize user stories | sprint-backlog, ceremony-plan | `sprint-goals.md`, `prioritized-stories.md` |
| 3 | `dev-fullstack` | Implement user stories and document progress | sprint-goals, prioritized-stories, sprint-backlog | `implementation-log.md`, `technical-notes.md` |
| 4 | `qa` | Test implementations and report results | implementation-log, prioritized-stories, sprint-goals | `test-results.md`, `defects-log.md` |
| 5 | `devops` | Prepare the release and write release notes | implementation-log, test-results, defects-log | `release-notes.md`, `deployment-summary.md` |

**Key deliverables:** Sprint backlog, sprint goals, implementation log, test results, release notes.

---

### 9. Tech Debt Reduction (`/tech-debt`)

**Description:** Identify and reduce technical debt systematically. Covers debt inventory, impact analysis, refactoring planning, regression validation, and deployment.

**Output directory:** `{assemble_output}/tech-debt_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `architect` | Inventory technical debt and analyze impact | — | `debt-inventory.md`, `impact-analysis.md` |
| 2 | `dev-fullstack` | Create the refactoring plan and migration guide | debt-inventory, impact-analysis | `refactoring-plan.md`, `migration-guide.md` |
| 3 | `qa` | Verify test coverage and validate regressions | refactoring-plan, migration-guide, debt-inventory | `test-coverage.md`, `regression-report.md` |
| 4 | `devops` | Plan deployment of changes | refactoring-plan, test-coverage, regression-report | `deployment-plan.md`, `rollback-strategy.md` |

**Key deliverables:** Debt inventory, refactoring plan, migration guide, rollback strategy.

---

### 10. Onboarding Project (`/onboard`)

**Description:** Onboard a new project with structured kickoff. Covers project chartering, requirements gathering, stakeholder mapping, architecture definition, and team setup.

**Output directory:** `{assemble_output}/onboarding_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `pm` | Write the project charter and define product vision | — | `project-charter.md`, `product-vision.md` |
| 2 | `analyst` | Document requirements and map stakeholders | project-charter, product-vision | `requirements-doc.md`, `stakeholder-map.md` |
| 3 | `architect` | Define the overall architecture and recommend the tech stack | requirements-doc, product-vision, project-charter | `architecture-overview.md`, `tech-stack-recommendation.md` |
| 4 | `scrum` | Set up the team and define processes | project-charter, stakeholder-map, architecture-overview | `team-setup.md`, `process-guide.md` |

**Key deliverables:** Project charter, product vision, requirements, stakeholder map, architecture overview, process guide.

---

### 11. Release Cycle (`/release`)

**Description:** Full release cycle from validation to communication. Covers release preparation, QA sign-off, security clearance, legal review, deployment, marketing announcement, PR outreach, and customer support preparation.

**Output directory:** `{assemble_output}/release_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `scrum` | Prepare the release checklist and validate scope | — | `release-checklist.md`, `scope-validation.md` |
| 2 | `qa` | Final validation and regression testing | release-checklist, scope-validation | `qa-sign-off.md`, `regression-results.md` |
| 3 | `security` | Validate security compliance | qa-sign-off, regression-results, release-checklist | `security-clearance.md`, `final-audit.md` |
| 4 | `legal` | Review legal and regulatory compliance | security-clearance, release-checklist | `legal-sign-off.md`, `compliance-notes.md` |
| 5 | `devops` | Prepare the deployment runbook and rollback plan | security-clearance, legal-sign-off, qa-sign-off, release-checklist | `deploy-runbook.md`, `rollback-plan.md` |
| 6 | `marketing` | Write the release announcement and public changelog | deploy-runbook, release-checklist, scope-validation | `announcement.md`, `changelog.md` |
| 7 | `pr` | Prepare press outreach and media materials | announcement, changelog, scope-validation | `press-release.md`, `media-kit.md` |
| 8 | `cs` | Prepare customer support materials and FAQ | announcement, changelog, release-checklist | `support-guide.md`, `faq.md` |

**Key deliverables:** Release checklist, QA sign-off, security clearance, legal sign-off, deployment runbook, announcement, press release, support guide.

---

### 12. Hotfix (`/hotfix`) — NEW

**Description:** Emergency production fix with built-in security verification. QA reproduces the issue, Security assesses the risk, the fullstack developer implements the fix, QA validates, and DevOps deploys.

**Output directory:** `{assemble_output}/hotfix_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `qa` | Reproduce the production issue and assess impact | — | `incident-analysis.md`, `reproduction-steps.md` |
| 2 | `security` | Evaluate whether the issue has security implications | incident-analysis, reproduction-steps | `security-assessment.md`, `risk-level.md` |
| 3 | `dev-fullstack` | Implement the hotfix with minimal change scope | incident-analysis, reproduction-steps, security-assessment | `hotfix-implementation.md`, `change-scope.md` |
| 4 | `qa` | Validate the fix with targeted and regression tests | hotfix-implementation, change-scope, incident-analysis | `validation-report.md`, `regression-results.md` |
| 5 | `devops` | Deploy the hotfix to production with rollback plan | hotfix-implementation, validation-report, regression-results | `deployment-log.md`, `rollback-plan.md` |

**Key deliverables:** Incident analysis, security assessment, hotfix implementation, validation report, deployment log.

---

### 13. Dependency Upgrade (`/upgrade-deps`) — NEW

**Description:** Safe and structured dependency upgrade pipeline. The architect evaluates impact, Security checks for vulnerabilities, the fullstack developer applies updates, QA validates compatibility, and DevOps deploys.

**Output directory:** `{assemble_output}/upgrade-deps_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `architect` | Analyze current dependencies and evaluate upgrade impact | — | `dependency-audit.md`, `upgrade-plan.md` |
| 2 | `security` | Scan for CVEs and assess security risk of changes | dependency-audit, upgrade-plan | `cve-report.md`, `security-risk.md` |
| 3 | `dev-fullstack` | Apply dependency upgrades and fix breaking changes | upgrade-plan, cve-report, security-risk | `upgrade-log.md`, `breaking-changes.md` |
| 4 | `qa` | Run full test suite and validate compatibility | upgrade-log, breaking-changes | `test-results.md`, `compatibility-report.md` |
| 5 | `devops` | Deploy upgraded dependencies with monitoring | upgrade-log, test-results, compatibility-report | `deployment-plan.md`, `monitoring-config.md` |

**Key deliverables:** Dependency audit, CVE report, upgrade log, compatibility report, deployment plan.

---

### 14. Doc Sprint (`/doc-sprint`) — NEW

**Description:** Focused documentation sprint to bring project documentation up to date. The analyst inventories existing docs, the architect and fullstack developer write technical content in parallel, the copywriter polishes and standardizes, and DevOps publishes.

**Output directory:** `{assemble_output}/doc-sprint_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `analyst` | Inventory existing documentation and identify gaps | — | `doc-inventory.md`, `gap-analysis.md` |
| 2a | `architect` | Write architecture and design documentation | doc-inventory, gap-analysis | `architecture-docs.md`, `adr-updates.md` |
| 2b | `dev-fullstack` | Write API and implementation documentation | doc-inventory, gap-analysis | `api-docs.md`, `implementation-guides.md` |
| 3 | `copywriter` | Edit, polish, and standardize all documentation | architecture-docs, api-docs, adr-updates, implementation-guides | `final-docs.md`, `style-guide.md` |
| 4 | `devops` | Publish documentation and set up doc site | final-docs, style-guide | `published-docs.md`, `doc-site-config.md` |

> Steps 2a and 2b (Architect + Fullstack) run in parallel.

**Key deliverables:** Documentation inventory, gap analysis, architecture docs, API docs, polished final docs, doc site configuration.

---

### 15. Experimentation (`/experiment-cycle`) — NEW

**Description:** Design, build, and analyze product experiments. The PM defines the hypothesis, Data designs the measurement framework, the fullstack developer implements the experiment, QA validates the setup, and Growth analyzes results.

**Output directory:** `{assemble_output}/experiment_{timestamp}/`

| Step | Agent | Action | Inputs | Outputs |
|------|-------|--------|--------|---------|
| 1 | `pm` | Define the experiment hypothesis and success criteria | — | `experiment-brief.md`, `success-criteria.md` |
| 2 | `data` | Design the measurement framework and analytics plan | experiment-brief, success-criteria | `measurement-plan.md`, `analytics-setup.md` |
| 3 | `dev-fullstack` | Implement the experiment (feature flags, A/B setup) | experiment-brief, measurement-plan | `experiment-implementation.md`, `feature-flags.md` |
| 4 | `qa` | Validate experiment setup and tracking accuracy | experiment-implementation, feature-flags, measurement-plan | `validation-report.md`, `tracking-audit.md` |
| 5 | `growth` | Analyze results and recommend next steps | validation-report, measurement-plan, success-criteria | `results-analysis.md`, `recommendations.md` |

**Key deliverables:** Experiment brief, measurement plan, implementation details, tracking audit, results analysis and recommendations.

---

## Manifest Format (`_manifest.yaml`)

Each workflow generates a `_manifest.yaml` file that serves as the **single source of truth** for the workflow state:

```yaml
workflow: mvp-launch
description: "Launch an MVP from start to finish"
started_at: "2025-01-15T10:30:00Z"
config:
  team_language: "english"
  output_language: "english"
  output_dir: "./assemble-output/mvp_20250115_103000"
steps:
  - step: 1
    agent: pm
    action: "Define product vision, user stories, and MVP scope"
    status: completed          # completed | in_progress | pending | failed
    started_at: "2025-01-15T10:30:00Z"
    completed_at: "2025-01-15T10:45:00Z"
    inputs_consumed: []
    outputs:
      - path: "01-pm/product-brief.md"
        type: "document"
        description: "Product brief with MVP vision and scope"
        status: produced       # produced | missing
      - path: "01-pm/user-stories.md"
        type: "document"
        description: "MVP user stories"
        status: produced
  - step: 2
    agent: architect
    action: "Design the technical architecture for the MVP"
    status: in_progress
    started_at: "2025-01-15T10:46:00Z"
    inputs_consumed:
      - "01-pm/product-brief.md"
    outputs:
      - path: "02-architect/architecture-decision.md"
        type: "document"
        description: "ADR with architecture choices"
        status: pending
```

### Manifest Fields

| Field | Description |
|-------|-------------|
| `workflow` | Workflow identifier |
| `description` | Workflow description |
| `started_at` | ISO timestamp of workflow start |
| `config` | Languages and output directory |
| `steps[].step` | Step number |
| `steps[].agent` | Responsible agent |
| `steps[].action` | Description of the action |
| `steps[].status` | `completed`, `in_progress`, `pending`, or `failed` |
| `steps[].inputs_consumed` | List of files read by the agent |
| `steps[].outputs[].path` | Relative path of the deliverable |
| `steps[].outputs[].status` | `produced` or `missing` |

---

## Output Directory Structure

Each workflow creates a structured directory:

```
assemble-output/
  mvp_20250115_103000/
    _manifest.yaml                # Single source of truth for the workflow
    _summary.md                   # Summary generated at the end of the workflow
    01-pm/
      product-brief.md
      user-stories.md
    02-architect/
      architecture-decision.md
      tech-stack.md
    03-ux/
      wireframes.md
      user-flows.md
    04-brand/
      brand-guidelines.md
      visual-identity.md
    05-db/
      schema.md
      migrations.md
    06-dev-backend/
      api-spec.md
      endpoints.md
    07-dev-frontend/
      components.md
      pages.md
    08-qa/
      test-plan.md
      test-report.md
    09-devops/
      deployment-guide.md
      ci-cd-config.md
```

**Directory naming convention:** `{step_number_2digits}-{agent_name}/`

---

## Summary File Format (`_summary.md`)

At the end of a workflow, Jarvis generates a summary file:

```markdown
# Workflow Summary: MVP Launch

## Date: 2025-01-15
## Duration: 2h30

## Objective
Launch an MVP from start to finish — from product vision to deployment.

## Steps Executed

| # | Agent | Status | Deliverables Produced |
|---|-------|--------|----------------------|
| 1 | pm | Completed | product-brief.md, user-stories.md |
| 2 | architect | Completed | architecture-decision.md, tech-stack.md |
| ... | ... | ... | ... |

## Deliverables Produced
[complete list with paths]

## Points of Attention
[observations, identified risks, recommendations]

## Recommended Next Steps
[suggested follow-up actions]
```

---

## Source Files

Workflows are defined in `src/workflows/{workflow-name}.yaml`. Each YAML file contains:
- `name`: workflow identifier
- `description`: workflow description
- `trigger`: trigger command
- `output_dir`: output directory template
- `steps`: ordered list of steps with agent, action, inputs, outputs, and dependencies
