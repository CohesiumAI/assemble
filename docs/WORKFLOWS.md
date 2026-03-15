# Workflows Cohesium AI

## Principe : chaînage par livrables

Chaque agent dans un workflow **produit des livrables** et **consomme les livrables** des agents précédents. C'est le mécanisme central de collaboration.

### Structure de sortie

```
cohesium-output/
└── {workflow}_{timestamp}/
    ├── _manifest.yaml          # Registre de traçabilité
    ├── _summary.md             # Synthèse finale
    ├── 01-{agent}/
    │   └── livrable-1.md
    ├── 02-{agent}/
    │   └── livrable-2.md       # S'appuie sur livrable-1.md
    └── ...
```

### _manifest.yaml

```yaml
workflow: mvp-launch
started_at: "2026-03-15T10:00:00"
steps:
  - step: 1
    agent: pm
    status: completed
    outputs:
      - path: 01-pm/product-brief.md
        type: product-brief
    inputs_consumed: []
  - step: 2
    agent: architect
    status: completed
    inputs_consumed: [01-pm/product-brief.md]
    outputs:
      - path: 02-architect/architecture-decision.md
```

---

## Les 11 workflows

### 1. MVP Launch (`/mvp`)

Lancement d'un MVP de A à Z.

| Étape | Agent | Inputs | Outputs |
|---|---|---|---|
| 1 | PM | — | product-brief.md, user-stories.md |
| 2 | Architect | product-brief | architecture-decision.md, tech-stack.md |
| 3 | UX | product-brief, user-stories | wireframes.md, user-flows.md |
| 4 | DB | architecture-decision | schema.md, migrations.md |
| 5 | Backend | architecture-decision, tech-stack, schema | api-spec.md, endpoints.md |
| 6 | Frontend | wireframes, user-flows, api-spec | components.md, pages.md |
| 7 | QA | api-spec, components, user-stories | test-plan.md, test-report.md |
| 8 | DevOps | tech-stack, test-report | deployment-guide.md, ci-cd-config.md |

### 2. Feature Development (`/feature`)

| Étape | Agent | Inputs | Outputs |
|---|---|---|---|
| 1 | PM | — | feature-spec.md |
| 2 | Analyst | feature-spec | requirements.md |
| 3 | Architect | feature-spec, requirements | technical-design.md |
| 4 | Dev(s) | technical-design, requirements | implementation-notes.md |
| 5 | QA | implementation-notes, requirements | test-report.md |

### 3. Bug Fix (`/bugfix`)

| Étape | Agent | Inputs | Outputs |
|---|---|---|---|
| 1 | QA | — | bug-analysis.md |
| 2 | Dev(s) | bug-analysis | fix-proposal.md, fix-implementation.md |
| 3 | QA | fix-implementation | regression-test.md |

### 4. Code Review Pipeline (`/review-pipeline`)

| Étape | Agent | Inputs | Outputs |
|---|---|---|---|
| 1 | Dev | — | code-summary.md |
| 2 | QA | code-summary | quality-report.md |
| 3 | Security | code-summary, quality-report | security-findings.md |
| 4 | Contrarian | tous les rapports précédents | devil-advocate-report.md |

### 5. Security Audit (`/audit-security`)

| Étape | Agent | Inputs | Outputs |
|---|---|---|---|
| 1 | Security | — | vulnerability-report.md |
| 2 | Backend | vulnerability-report | remediation-plan.md |
| 3 | DevOps | vulnerability-report, remediation-plan | infrastructure-hardening.md |
| 4 | Legal | tous les rapports | compliance-check.md |

### 6. SEO Content Pipeline (`/seo-pipeline`)

| Étape | Agent | Inputs | Outputs |
|---|---|---|---|
| 1 | SEO | — | keyword-research.md, content-strategy.md |
| 2 | Content-SEO | keyword-research, content-strategy | content-brief.md, semantic-structure.md |
| 3 | Copywriter | content-brief, semantic-structure | article-draft.md |
| 4 | GEO/AIO | article-draft, keyword-research | geo-optimization.md |

### 7. Marketing Campaign (`/campaign`)

| Étape | Agent | Inputs | Outputs |
|---|---|---|---|
| 1 | Marketing | — | campaign-strategy.md, target-audience.md |
| 2 | Brand | campaign-strategy | brand-guidelines.md, messaging.md |
| 3 | Copywriter | campaign-strategy, brand-guidelines, messaging | copy-assets.md |
| 4 | Ads | campaign-strategy, target-audience, copy-assets | ad-setup.md, budget-plan.md |
| 5 | Social | campaign-strategy, copy-assets, brand-guidelines | social-calendar.md, content-plan.md |
| 6 | Growth | tous les livrables | growth-metrics.md, experiment-plan.md |

### 8. Sprint Cycle (`/sprint`)

| Étape | Agent | Inputs | Outputs |
|---|---|---|---|
| 1 | Scrum | — | sprint-backlog.md, ceremony-plan.md |
| 2 | PM | sprint-backlog | sprint-goals.md, prioritized-stories.md |
| 3 | Dev(s) | prioritized-stories | implementation-log.md |
| 4 | QA | implementation-log, prioritized-stories | test-results.md |
| 5 | DevOps | test-results | release-notes.md |

### 9. Tech Debt Reduction (`/tech-debt`)

| Étape | Agent | Inputs | Outputs |
|---|---|---|---|
| 1 | Architect | — | debt-inventory.md, impact-analysis.md |
| 2 | Dev(s) | debt-inventory, impact-analysis | refactoring-plan.md, migration-guide.md |
| 3 | QA | refactoring-plan | test-coverage.md |
| 4 | DevOps | migration-guide, test-coverage | deployment-plan.md |

### 10. Onboarding Project (`/onboard`)

| Étape | Agent | Inputs | Outputs |
|---|---|---|---|
| 1 | PM | — | project-charter.md, product-vision.md |
| 2 | Analyst | project-charter, product-vision | requirements-doc.md, stakeholder-map.md |
| 3 | Architect | requirements-doc | architecture-overview.md, tech-stack-recommendation.md |
| 4 | Scrum | project-charter, architecture-overview | team-setup.md, process-guide.md |

### 11. Release Cycle (`/release`)

| Étape | Agent | Inputs | Outputs |
|---|---|---|---|
| 1 | Scrum | — | release-checklist.md |
| 2 | QA | release-checklist | qa-sign-off.md, regression-results.md |
| 3 | Security | qa-sign-off | security-clearance.md |
| 4 | DevOps | release-checklist, qa-sign-off, security-clearance | deploy-runbook.md, rollback-plan.md |
| 5 | Marketing | deploy-runbook | announcement.md, changelog.md |
