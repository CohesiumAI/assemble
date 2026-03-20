---
name: devops-pipeline
description: Complete CI/CD pipeline creation with build, tests, security, and deployment
agents: [devops, dev-backend, dev-fullstack]
trigger: /pipeline
---

# Skill : DevOps Pipeline

## Objective
Design and implement a complete CI/CD pipeline that automates the build, tests, security analysis, packaging, and deployment of an application. The pipeline ensures delivery quality and reproducibility.

## When to use
- When setting up initial CI/CD for a new project
- To add quality stages (tests, linting, security) to an existing pipeline
- When a new deployment type is needed (new cloud, new region)
- To migrate a pipeline from one tool to another (Jenkins to GitHub Actions, etc.)

## Steps
1. **Define pipeline stages** — Identify necessary stages (lint, test, build, scan, deploy) and their dependencies, based on project type and target environment.
2. **Configure triggers** — Define triggering events (push, PR, tag, schedule, manual) and branch filters (main, develop, release/*).
3. **Implement the build stage** — Configure compilation, dependency resolution, cache management, and artifact creation (Docker image, bundle, binary).
4. **Configure automated tests** — Integrate unit, integration, and end-to-end tests with code coverage collection and results reporting.
5. **Add security scans** — Integrate static analysis (SAST), dependency analysis (SCA), Docker image scanning, and secret detection.
6. **Implement deployment** — Configure deployment to target environments (staging, production) with deployment strategy (blue-green, canary, rolling).
7. **Configure notifications** — Set up failure alerts (Slack, email, webhook) and deployment reports.
8. **Document the pipeline** — Create pipeline documentation with environment variables, required secrets, and rollback procedures.

## Exit Checklist
- [ ] Pipeline executes successfully on a test branch
- [ ] Tests pass and coverage is collected
- [ ] Security scans are integrated and blocking if critical
- [ ] Dependency caching is configured to speed up builds
- [ ] Secrets are stored securely (vault, secrets manager)
- [ ] Staging deployment is automatic, production requires approval
- [ ] Failure and success notifications work
- [ ] Rollback procedure is documented and tested

## Output Format
```
📄 .github/workflows/<pipeline-name>.yml (ou .gitlab-ci.yml / Jenkinsfile)

Pipeline : <nom-du-pipeline>
Triggers : push (main, develop), pull_request, tag (v*)

Stages :
  1. 🔍 Lint & Format     — ESLint, Prettier, commitlint     (~1 min)
  2. 🧪 Tests             — Unit + Integration + Coverage     (~5 min)
  3. 🔒 Security Scan     — SAST + SCA + Secret detection    (~3 min)
  4. 🏗️ Build             — Docker build + push registry      (~4 min)
  5. 🚀 Deploy Staging    — Auto-deploy to staging             (~2 min)
  6. ✅ Smoke Tests       — Post-deployment health tests       (~1 min)
  7. 🚀 Deploy Production — Deployment with approval           (~2 min)

Required environment variables :
  - REGISTRY_URL, REGISTRY_USER, REGISTRY_PASSWORD
  - KUBE_CONFIG ou AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY
  - SONAR_TOKEN, SNYK_TOKEN

Estimated total time : ~18 minutes
```
