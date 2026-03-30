# Skills Reference — 29 Reusable Skills

> **29 skills**: 14 shared (multi-agent) + 15 specific (role-focused). Each skill provides a structured, repeatable process that agents can execute via its trigger command.

---

## Shared Skills (14)

Cross-functional skills available to multiple agents. Any agent that owns a skill can execute it through the corresponding trigger command.

### Summary Table

| # | Trigger | Name | Description | Agents |
|---|---------|------|-------------|--------|
| 1 | `/api` | API Design | Design REST/GraphQL APIs with contracts, versioning, pagination, and error handling | dev-backend, dev-fullstack, architect, dev-mobile |
| 2 | `/cicd` | CI/CD | Configure and optimize CI/CD pipelines with build, test, deploy, and quality gates | devops, dev-backend, dev-fullstack |
| 3 | `/review` | Code Review | Structured code review with quality checklist covering security, performance, and maintainability | dev-backend, dev-frontend, dev-fullstack, qa, security |
| 4 | `/benchmark` | Competitive Analysis | Competitive benchmarking with positioning analysis, strengths/weaknesses, and strategic recommendations | analyst, marketing, growth, pm |
| 5 | `/brief` | Content Brief | Create structured content briefs with keyword research, search intent, and editorial guidelines | content-seo, copywriter, storytelling, social |
| 6 | `/db` | Database Query | Optimize and design database queries and schemas with indexing, execution plans, and migrations | db, dev-backend, dev-fullstack, data |
| 7 | `/doc` | Documentation | Generate technical and functional documentation including READMEs, ADRs, API docs, and user guides | all agents (31) |
| 8 | `/git` | Git Workflow | Manage Git workflows including branching strategy, commit conventions, PRs, and merge processes | dev-backend, dev-frontend, dev-fullstack, dev-mobile, devops, scrum |
| 9 | `/monitor` | Monitoring | Set up monitoring and observability with metrics, logs, traces, alerting, and dashboards | devops, data, dev-backend |
| 10 | `/perf` | Performance Audit | Performance audit covering Core Web Vitals, query optimization, load analysis, and profiling | dev-frontend, dev-backend, devops, data |
| 11 | `/report` | Reporting | Generate reports and dashboards with data collection, analysis, visualization, and actionable insights | data, analyst, pm, scrum, marketing |
| 12 | `/sec-check` | Security Check | Security verification against OWASP Top 10, vulnerability analysis, hardening, and secrets management | security, dev-backend, devops, architect |
| 13 | `/seo` | SEO Audit | Technical and on-page SEO audit covering crawlability, Core Web Vitals, structured data, and internal linking | seo, content-seo, geo-aio, dev-frontend |
| 14 | `/test` | Testing | Test strategy and execution for unit, integration, and e2e tests with coverage analysis | dev-backend, dev-frontend, dev-fullstack, dev-mobile, qa |

---

### Shared Skill Details

#### 1. API Design (`/api`)

**Description:** Design REST and GraphQL APIs with interface contracts, versioning, pagination, error handling, OpenAPI documentation, and best practices.

**Agents:** dev-backend, dev-fullstack, architect, dev-mobile

**When to use:**
- Designing a new API from scratch
- Adding endpoints to an existing API
- Documenting or standardizing API contracts
- Migrating between API versions

---

#### 2. CI/CD (`/cicd`)

**Description:** Configure and optimize CI/CD pipelines including build steps, automated testing, deployment stages, quality gates, caching strategies, and DevOps best practices.

**Agents:** devops, dev-backend, dev-fullstack

**When to use:**
- Setting up a new CI/CD pipeline
- Optimizing build and deployment times
- Adding quality gates or security scanning stages
- Migrating to a new CI/CD platform

---

#### 3. Code Review (`/review`)

**Description:** Structured code review with a quality checklist covering static analysis, best practices, security, performance, and maintainability. Produces findings classified by severity (blocking, major, minor, suggestion).

**Agents:** dev-backend, dev-frontend, dev-fullstack, qa, security

**When to use:**
- Before every merge request or pull request
- During a quality audit of existing code
- After a major refactoring effort

**Steps:**
1. Identify scope (modified files, functional context)
2. Verify structure and architecture
3. Analyze readability and coding conventions
4. Evaluate business logic and edge cases
5. Check security (injections, input validation)
6. Assess performance (complexity, N+1 queries)
7. Verify test coverage
8. Write the report (classified by severity: blocking, major, minor, suggestion)

---

#### 4. Competitive Analysis (`/benchmark`)

**Description:** Competitive benchmarking and analysis covering market positioning, strengths and weaknesses, competitor strategies, market opportunities, and strategic recommendations.

**Agents:** analyst, marketing, growth, pm

**When to use:**
- Before launching a new product or feature
- During strategic planning sessions
- When evaluating market positioning
- Before a pricing or go-to-market decision

---

#### 5. Content Brief (`/brief`)

**Description:** Create structured content briefs with keyword research, search intent analysis, editorial structure, writing guidelines, and performance criteria.

**Agents:** content-seo, copywriter, storytelling, social

**When to use:**
- Before writing any content piece (article, landing page, etc.)
- When aligning content with SEO strategy
- When onboarding external writers
- For editorial calendar planning

---

#### 6. Database Query (`/db`)

**Description:** Optimize and design database queries and schemas including data modeling, indexing strategies, execution plan analysis, migrations, and best practices.

**Agents:** db, dev-backend, dev-fullstack, data

**When to use:**
- Designing a new data model
- Optimizing slow queries
- Planning database migrations
- Reviewing schema changes before deployment

---

#### 7. Documentation (`/doc`)

**Description:** Generate technical and functional documentation including README files, Architecture Decision Records (ADRs), architecture guides, OpenAPI documentation, user guides, operational runbooks, and changelogs.

**Agents:** all agents (34 agents)

**When to use:**
- At the start of a new project
- After significant architectural decisions
- Before a release (changelog, user guides)
- When onboarding new team members

---

#### 8. Git Workflow (`/git`)

**Description:** Manage Git workflows including branching strategy, Conventional Commits conventions, pull request creation, conflict resolution, and merge processes.

**Agents:** dev-backend, dev-frontend, dev-fullstack, dev-mobile, devops, scrum

**When to use:**
- Starting a new feature or fix
- Creating a pull request
- Resolving merge conflicts
- During a release or hotfix

**Steps:**
1. Identify the type of change (feature, fix, hotfix, refactor, docs, chore, release)
2. Create a branch following the `type/ID-short-description` convention
3. Write commits using Conventional Commits
4. Prepare the pull request (title, structured body, ticket link)
5. Handle conflicts (rebase onto target branch)
6. Facilitate review
7. Merge and clean up (squash-merge or standard merge)

---

#### 9. Monitoring (`/monitor`)

**Description:** Set up and analyze monitoring and observability including metrics, logs, traces, alerting, and operational dashboards.

**Agents:** devops, data, dev-backend

**When to use:**
- Setting up observability for a new service
- Configuring alerting rules
- Investigating production incidents
- Building operational dashboards

---

#### 10. Performance Audit (`/perf`)

**Description:** Performance audit covering Core Web Vitals, query optimization, load analysis, profiling, and improvement recommendations.

**Agents:** dev-frontend, dev-backend, devops, data

**When to use:**
- When page load times exceed targets
- Before and after optimization sprints
- During capacity planning
- When investigating performance regressions

---

#### 11. Reporting (`/report`)

**Description:** Generate reports and dashboards with data collection, analysis, visualization, insights, and recommendations for decision-making.

**Agents:** data, analyst, pm, scrum, marketing

**When to use:**
- At the end of a sprint or project phase
- For executive or stakeholder updates
- When tracking KPIs and metrics
- For quarterly business reviews

---

#### 12. Security Check (`/sec-check`)

**Description:** Security verification covering OWASP Top 10, vulnerability analysis, configuration hardening (HTTP headers, TLS, CORS), secrets management, authentication/authorization auditing, and compliance checking.

**Agents:** security, dev-backend, devops, architect

**When to use:**
- Before deploying to production
- After adding authentication or authorization logic
- During dependency updates
- As part of a periodic security review

**Steps:**
1. Define audit scope
2. Analyze application vulnerabilities (OWASP Top 10)
3. Audit secrets management
4. Analyze dependencies (CVE, CVSS)
5. Verify configuration hardening (HTTP headers, TLS, CORS)
6. Audit authentication and authorization
7. Verify logging and detection
8. Write the security report (classified by severity)

---

#### 13. SEO Audit (`/seo`)

**Description:** Technical and on-page SEO audit covering crawlability, Core Web Vitals, meta tags, structured data, internal linking, and optimization opportunities.

**Agents:** seo, content-seo, geo-aio, dev-frontend

**When to use:**
- After launching a new site or major redesign
- When organic traffic drops
- During periodic SEO health checks
- Before a content migration

---

#### 14. Testing (`/test`)

**Description:** Test strategy and execution covering unit, integration, and end-to-end tests with test case generation and coverage analysis.

**Agents:** dev-backend, dev-frontend, dev-fullstack, dev-mobile, qa

**When to use:**
- When implementing a new feature
- After a refactoring effort
- Before a release (regression tests)
- When improving test coverage

**Steps:**
1. Analyze the scope to test
2. Choose the test level (unit, integration, e2e)
3. Identify test cases (nominal, boundary, error)
4. Prepare the test environment (mocks, fixtures)
5. Write tests (AAA pattern: Arrange, Act, Assert)
6. Execute and analyze coverage
7. Document results

---

## Specific Skills (15)

Role-focused skills tied to a primary agent. Each provides a specialized process for a specific domain.

### Summary Table

| # | Trigger | Name | Description | Agent |
|---|---------|------|-------------|-------|
| 1 | `/ad-setup` | Ad Campaign Setup | Configure a complete multi-platform advertising campaign with targeting, budgets, and creatives | ads |
| 2 | `/automate` | Automation Workflow | Design multi-tool automation workflows with triggers, actions, and monitoring | automation |
| 3 | `/scaffold-api` | Backend API Scaffold | Scaffold a complete backend API with project structure, routes, controllers, and documentation | dev-backend |
| 4 | `/migrate` | DB Migration | Create and manage database migrations with rollback support and validation | db |
| 5 | `/pipeline` | DevOps Pipeline | Create a complete CI/CD pipeline with build, test, security, and deployment stages | devops |
| 6 | `/component` | Frontend Component | Create a React/Next.js component integrated with the design system, including accessibility and tests | dev-frontend |
| 7 | `/experiment` | Growth Experiment | Design and launch a growth experiment with hypothesis, metrics, and analysis framework | growth |
| 8 | `/compliance` | Legal Compliance Check | Verify regulatory compliance for GDPR, AI Act, and nDPA (Swiss Data Protection Act) | legal |
| 9 | `/screen` | Mobile Screen | Create a mobile screen for React Native/Flutter with navigation, state management, and animations | dev-mobile |
| 10 | `/pentest` | Pentest Scan | Automated security scan and penetration test with vulnerability report | security |
| 11 | `/test-plan` | QA Test Plan | Create a comprehensive test plan with strategies, coverage matrices, and acceptance criteria | qa |
| 12 | `/sprint-plan` | Sprint Planning | Facilitate agile sprint planning with estimation, prioritization, and ceremony setup | scrum |
| 13 | `/wireframe` | UX Wireframe | Create wireframes and interactive prototypes with information architecture | ux |
| 14 | `/party` | Party Mode | Persistent collaborative multi-agent session with Jarvis facilitation | all |
| 15 | `/board` | Board Execution | Kanban board execution engine — manages ticket lifecycle through implement → review → test → done pipeline with parallel execution and dependency resolution | scrum (primary), all dev agents |

---

### Specific Skill Details

#### 1. Ad Campaign Setup (`/ad-setup`)

**Primary agent:** ads

**Description:** Configure a complete multi-platform advertising campaign including audience targeting, budget allocation, creative assets, bidding strategies, and performance tracking setup.

**When to use:**
- Launching a new paid media campaign
- Expanding to a new advertising platform
- Restructuring an underperforming campaign

---

#### 2. Automation Workflow (`/automate`)

**Primary agent:** automation

**Description:** Design multi-tool automation workflows with triggers, conditions, actions, error handling, and monitoring. Covers tools like n8n, Zapier, Make, and custom integrations.

**When to use:**
- Automating repetitive business processes
- Connecting multiple tools and services
- Building notification and alerting pipelines
- Creating data synchronization workflows

---

#### 3. Backend API Scaffold (`/scaffold-api`)

**Primary agent:** dev-backend

**Description:** Scaffold a complete backend API with project structure, routes, controllers, middleware, validation, error handling, and auto-generated documentation.

**When to use:**
- Starting a new backend project
- Adding a new microservice
- Migrating from a monolith to services

---

#### 4. DB Migration (`/migrate`)

**Primary agent:** db

**Description:** Create and manage database migrations with schema changes, data transformations, rollback procedures, and validation checks.

**When to use:**
- Adding or modifying database tables
- Migrating data between schemas
- Deploying schema changes to production
- Rolling back a failed migration

---

#### 5. DevOps Pipeline (`/pipeline`)

**Primary agent:** devops

**Description:** Create a complete CI/CD pipeline with build configuration, test automation, security scanning, deployment stages, and rollback mechanisms.

**When to use:**
- Setting up CI/CD for a new project
- Adding deployment stages (staging, production)
- Integrating security scanning into the pipeline

---

#### 6. Frontend Component (`/component`)

**Primary agent:** dev-frontend

**Description:** Create a React/Next.js component integrated with the design system, including accessibility (WCAG), responsive behavior, unit tests, and Storybook stories.

**When to use:**
- Building a new UI component
- Refactoring a component for reusability
- Adding accessibility to existing components

---

#### 7. Growth Experiment (`/experiment`)

**Primary agent:** growth

**Description:** Design and launch a growth experiment with a clear hypothesis, success metrics, test setup (A/B, multivariate), statistical analysis plan, and results interpretation.

**When to use:**
- Testing a new growth lever
- Optimizing conversion funnels
- Validating pricing or messaging changes

---

#### 8. Legal Compliance Check (`/compliance`)

**Primary agent:** legal

**Description:** Verify regulatory compliance covering GDPR, AI Act, and nDPA (Swiss Data Protection Act), including data processing audits, consent mechanisms, and documentation requirements.

**When to use:**
- Before launching a product in the EU or Switzerland
- When handling personal data or AI features
- During periodic compliance reviews
- After regulatory changes

---

#### 9. Mobile Screen (`/screen`)

**Primary agent:** dev-mobile

**Description:** Create a mobile screen for React Native or Flutter with navigation integration, state management, animations, and platform-specific adaptations.

**When to use:**
- Building a new mobile screen
- Integrating navigation flows
- Adding platform-specific features (iOS/Android)

---

#### 10. Pentest Scan (`/pentest`)

**Primary agent:** security

**Description:** Automated security scan and penetration test covering network, application, and API layers with a prioritized vulnerability report and remediation guidance.

**When to use:**
- Before a production release
- During periodic security assessments
- After major infrastructure changes
- When responding to a security incident

---

#### 11. QA Test Plan (`/test-plan`)

**Primary agent:** qa

**Description:** Create a comprehensive test plan with test strategies, coverage matrices, environment requirements, data preparation, acceptance criteria, and risk assessment.

**When to use:**
- At the start of a new project or feature
- Before a major release
- When establishing QA processes for a team

---

#### 12. Sprint Planning (`/sprint-plan`)

**Primary agent:** scrum

**Description:** Facilitate agile sprint planning including backlog refinement, story estimation (story points), capacity planning, sprint goal definition, and ceremony scheduling.

**When to use:**
- At the beginning of each sprint
- During backlog grooming sessions
- When onboarding a new agile team

---

#### 13. UX Wireframe (`/wireframe`)

**Primary agent:** ux

**Description:** Create wireframes and interactive prototypes with information architecture, user flow mapping, component specifications, and usability guidelines.

**When to use:**
- At the start of a new product or feature
- When redesigning an existing interface
- For user testing preparation

---

#### 14. Party Mode (`/party`)

**Primary agent:** all

**Description:** Persistent collaborative multi-agent session with Jarvis facilitation. Keeps a selected roster of agents active across multiple turns so the team can iterate continuously on the same objective.

**When to use:**
- Working through a complex topic over several exchanges
- Keeping the same set of specialists active during an investigation
- Iterating on a deliverable without re-routing every message

---

#### 15. Board Execution (`/board`)

**Primary agent:** scrum (primary), all dev agents

**Description:** Kanban board execution engine that manages ticket lifecycle through an automated **implement → review → test → done** pipeline with parallel execution, WIP limits, dependency resolution, and per-ticket context injection.

**When to use:**
- During Phase 4 (**IMPLEMENT**) of a **COMPLEX** Spec-Driven workflow
- When `_board.yaml` already exists and execution needs to be resumed
- When inspecting board status or re-prioritizing structured tickets

**Steps:**
1. Read `_board.yaml` and load board metadata, WIP limits, tickets, dependencies, and current statuses
2. Select only tickets whose dependencies are already `done`
3. Move ready tickets through `in_progress` while respecting WIP limits
4. Run implementation with the ticket's assigned dev agent(s)
5. Send the ticket to review, then to test, and loop back if blocking feedback appears
6. Mark the ticket `done` only after every acceptance criterion passes
7. Persist every transition, artifact, assignment, and feedback entry back to `_board.yaml`

---

## File Structure

```
src/skills/
  shared/               # 14 shared skills
    api-design.md
    ci-cd.md
    code-review.md
    competitive-analysis.md
    content-brief.md
    database-query.md
    documentation.md
    git-workflow.md
    monitoring.md
    performance-audit.md
    reporting.md
    security-check.md
    seo-audit.md
    testing.md
  specific/             # 15 specific skills
    ad-campaign-setup.md
    automation-workflow.md
    backend-api-scaffold.md
    db-migration.md
    devops-pipeline.md
    frontend-component.md
    growth-experiment.md
    legal-compliance-check.md
    mobile-screen.md
    pentest-scan.md
    qa-test-plan.md
    sprint-planning.md
    ux-wireframe.md
    board-execution.md
```

## Skill File Structure

Each skill file contains:
- **YAML front matter**: name, description, agents (or agent), trigger command
- **Objective**: what the skill accomplishes
- **When to use**: typical use cases
- **Steps**: detailed step-by-step process
- **Exit checklist**: validation criteria before considering the skill complete
- **Output format**: markdown template for the deliverable produced
