---
name: ci-cd
description: CI/CD pipeline configuration and optimization — build, tests, deployment, quality gates, caching, and DevOps best practices
agents: [devops, dev-backend, dev-fullstack]
trigger: /cicd
---

# Skill : CI/CD Pipeline

## Objective

Design, configure, and optimize reliable, fast, and secure continuous integration and continuous deployment pipelines. This skill covers pipeline structure, quality gates, caching, deployment strategies, and build monitoring.

## When to use

- When setting up a CI/CD pipeline for a new project
- To optimize an existing pipeline (build duration, reliability, costs)
- When new stages need to be added (tests, security, deployment)
- When changing CI/CD platform (GitHub Actions, GitLab CI, CircleCI, Jenkins)
- To implement a deployment strategy (blue-green, canary, rolling)
- When builds are unstable (flaky tests, timeouts, insufficient resources)

## Steps

1. **Analyze the project and its needs** — Identify the language, framework, dependencies, target environments (staging, production), deployment constraints. Evaluate current CI/CD maturity and pain points.
2. **Structure the pipeline** — Define stages in logical order: checkout → install → lint → build → test (unit → integration → e2e) → security scan → deploy. Parallelize independent stages to reduce total time.
3. **Configure caching** — Cache dependencies (`node_modules`, `.pip-cache`, Docker image layers), build artifacts, and test results. Use cache keys based on lockfiles (`package-lock.json`, `poetry.lock`).
4. **Implement quality gates** — Define pass conditions: minimum test coverage, zero critical vulnerabilities (SAST/DAST), lint with no errors, build with no warnings. Block merge if a gate fails.
5. **Configure deployments** — Implement the appropriate deployment strategy: blue-green (zero-downtime, instant rollback), canary (progressive deployment with monitoring), rolling update (progressive instance updates). Configure health checks and automatic rollbacks.
6. **Secure the pipeline** — Store secrets in the CI platform's secret manager (never in plaintext in YAML). Scan Docker images with Trivy/Grype. Restrict CI token permissions. Sign build artifacts.
7. **Optimize performance** — Reduce build time: job parallelization, self-hosted runners for heavy builds, incremental builds, matrix strategy for multi-version tests. Target a complete pipeline under 10 minutes.
8. **Monitor and maintain** — Track pipeline metrics: average duration, success rate, recovery time after failure. Alert on degradations. Document runbooks for common failures.

## Exit Checklist

- [ ] The pipeline covers lint → build → test → security → deploy stages
- [ ] Independent stages are parallelized
- [ ] Caching is configured for dependencies and artifacts
- [ ] Quality gates block merge on failure
- [ ] Secrets are managed via the CI platform's secret manager
- [ ] Deployment strategy is defined with automatic rollback
- [ ] Total pipeline time is under 10 minutes (target)
- [ ] Pipeline metrics are monitored and alerted

## Output Format

```markdown
## Configuration CI/CD

**Plateforme :** [GitHub Actions | GitLab CI | CircleCI | Jenkins | ...]
**Projet :** [nom du projet]
**Environnements :** [staging, production]
**Date :** [date]

### Pipeline architecture

```
┌─────────┐   ┌──────┐   ┌───────┐   ┌──────────┐   ┌────────┐   ┌────────┐
│ Checkout │──▶│ Lint │──▶│ Build │──▶│ Tests    │──▶│ Scan   │──▶│ Deploy │
└─────────┘   └──────┘   └───────┘   │ Unit     │   │ SAST   │   │ Staging│
                                      │ Integ    │   │ Docker │   │ Prod   │
                                      │ E2E (∥)  │   └────────┘   └────────┘
                                      └──────────┘
```

### Configuration file

```yaml
# .github/workflows/ci.yml (GitHub Actions example)
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  test:
    needs: lint-and-build
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3]
    steps:
      - run: npm run test -- --shard=${{ matrix.shard }}/3

  deploy-staging:
    needs: [test]
    if: github.ref == 'refs/heads/develop'
    # ...

  deploy-production:
    needs: [test]
    if: github.ref == 'refs/heads/main'
    environment: production
    # ...
```

### Quality gates

| Gate | Seuil | Bloquant |
|------|-------|----------|
| Test coverage | ≥ 80% | ✅ |
| Lint (errors) | 0 | ✅ |
| Critical vulnerabilities | 0 | ✅ |
| Build size (delta) | < +10% | ⚠️ Warning |

### Deployment strategy

**Type :** [Blue-Green | Canary | Rolling]
**Rollback :** Automatic if health check fails after X minutes
**Health check :** `GET /health` — 200 response in < 5s

### Target metrics

| Metric | Current value | Target |
|--------|--------------|--------|
| Pipeline duration | Xmin | < 10min |
| Success rate | X% | > 95% |
| MTTR (Mean Time To Recovery) | Xmin | < 15min |
| Deployment frequency | X/week | [target] |
```
