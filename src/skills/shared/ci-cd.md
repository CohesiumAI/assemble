---
name: ci-cd
description: Configuration et optimisation des pipelines CI/CD — build, tests, déploiement, quality gates, caching et bonnes pratiques DevOps
agents: [devops, dev-backend, dev-fullstack]
trigger: /cicd
---

# Skill : Pipeline CI/CD

## Objectif

Concevoir, configurer et optimiser des pipelines d'intégration continue et de déploiement continu fiables, rapides et sécurisés. Cette skill couvre la structure des pipelines, les quality gates, le caching, les stratégies de déploiement et le monitoring des builds.

## Quand l'utiliser

- Lors de la mise en place d'un pipeline CI/CD pour un nouveau projet
- Pour optimiser un pipeline existant (durée de build, fiabilité, coûts)
- Quand de nouvelles étapes doivent être ajoutées (tests, sécurité, déploiement)
- Lors d'un changement de plateforme CI/CD (GitHub Actions, GitLab CI, CircleCI, Jenkins)
- Pour implémenter une stratégie de déploiement (blue-green, canary, rolling)
- Quand les builds sont instables (flaky tests, timeouts, ressources insuffisantes)

## Étapes

1. **Analyser le projet et ses besoins** — Identifier le langage, le framework, les dépendances, les environnements cibles (staging, production), les contraintes de déploiement. Évaluer la maturité CI/CD actuelle et les points de douleur.
2. **Structurer le pipeline** — Définir les stages dans l'ordre logique : checkout → install → lint → build → test (unit → integration → e2e) → security scan → deploy. Paralléliser les étapes indépendantes pour réduire le temps total.
3. **Configurer le caching** — Mettre en cache les dépendances (`node_modules`, `.pip-cache`, images Docker layers), les artefacts de build et les résultats de tests. Utiliser des clés de cache basées sur les lockfiles (`package-lock.json`, `poetry.lock`).
4. **Implémenter les quality gates** — Définir les conditions de passage : couverture de tests minimale, zéro vulnérabilité critique (SAST/DAST), lint sans erreur, build sans warning. Bloquer le merge si un gate échoue.
5. **Configurer les déploiements** — Implémenter la stratégie de déploiement adaptée : blue-green (zero-downtime, rollback instantané), canary (déploiement progressif avec monitoring), rolling update (mise à jour progressive des instances). Configurer les health checks et les rollback automatiques.
6. **Sécuriser le pipeline** — Stocker les secrets dans le gestionnaire de la plateforme CI (jamais en clair dans le YAML). Scanner les images Docker avec Trivy/Grype. Restreindre les permissions des tokens CI. Signer les artefacts de build.
7. **Optimiser les performances** — Réduire le temps de build : parallélisation des jobs, self-hosted runners pour les builds lourds, builds incrémentaux, matrix strategy pour les tests multi-version. Cibler un pipeline complet en moins de 10 minutes.
8. **Monitorer et maintenir** — Tracker les métriques du pipeline : durée moyenne, taux de succès, temps de recovery après échec. Alerter sur les dégradations. Documenter les runbooks pour les échecs courants.

## Checklist de sortie

- [ ] Le pipeline couvre les étapes lint → build → test → security → deploy
- [ ] Les étapes indépendantes sont parallélisées
- [ ] Le caching est configuré pour les dépendances et artefacts
- [ ] Les quality gates bloquent le merge en cas d'échec
- [ ] Les secrets sont gérés via le gestionnaire de la plateforme CI
- [ ] La stratégie de déploiement est définie avec rollback automatique
- [ ] Le temps de pipeline total est inférieur à 10 minutes (cible)
- [ ] Les métriques du pipeline sont monitorées et alertées

## Format de sortie

```markdown
## Configuration CI/CD

**Plateforme :** [GitHub Actions | GitLab CI | CircleCI | Jenkins | ...]
**Projet :** [nom du projet]
**Environnements :** [staging, production]
**Date :** [date]

### Architecture du pipeline

```
┌─────────┐   ┌──────┐   ┌───────┐   ┌──────────┐   ┌────────┐   ┌────────┐
│ Checkout │──▶│ Lint │──▶│ Build │──▶│ Tests    │──▶│ Scan   │──▶│ Deploy │
└─────────┘   └──────┘   └───────┘   │ Unit     │   │ SAST   │   │ Staging│
                                      │ Integ    │   │ Docker │   │ Prod   │
                                      │ E2E (∥)  │   └────────┘   └────────┘
                                      └──────────┘
```

### Fichier de configuration

```yaml
# .github/workflows/ci.yml (exemple GitHub Actions)
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
| Couverture de tests | ≥ 80% | ✅ |
| Lint (erreurs) | 0 | ✅ |
| Vulnérabilités critiques | 0 | ✅ |
| Build size (delta) | < +10% | ⚠️ Avertissement |

### Stratégie de déploiement

**Type :** [Blue-Green | Canary | Rolling]
**Rollback :** Automatique si health check échoue après X minutes
**Health check :** `GET /health` — réponse 200 en < 5s

### Métriques cibles

| Métrique | Valeur actuelle | Cible |
|----------|----------------|-------|
| Durée du pipeline | Xmin | < 10min |
| Taux de succès | X% | > 95% |
| MTTR (Mean Time To Recovery) | Xmin | < 15min |
| Fréquence de déploiement | X/semaine | [cible] |
```
