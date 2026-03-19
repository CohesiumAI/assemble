# Workflow : dependency-upgrade

Mise à jour des dépendances — analyse des breaking changes, upgrade, tests de compatibilité

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Tony Stark (tony-stark)

**Action :** Analyser les dépendances à mettre à jour, identifier les breaking changes et évaluer les risques

**Livrables :**
- `dependency-audit.md`
- `breaking-changes.md`
- `risk-assessment.md`

### Étape 2 — Punisher (punisher)

**Action :** Vérifier les CVE connues sur les versions actuelles et valider les versions cibles

**Inputs :** `01-architect/dependency-audit.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `cve-report.md`
- `version-recommendations.md`

### Étape 3 — Mr. Fantastic (mr-fantastic)

**Action :** Appliquer les mises à jour et corriger les breaking changes

**Inputs :** `01-architect/dependency-audit.md`, `01-architect/breaking-changes.md`, `02-security/version-recommendations.md`

**Dépend de :** étape(s) 1, 2

**Livrables :**
- `upgrade-log.md`
- `migration-notes.md`

### Étape 4 — Hawkeye (hawkeye)

**Action :** Exécuter les tests de compatibilité et valider l'absence de régressions

**Inputs :** `03-dev-fullstack/upgrade-log.md`, `03-dev-fullstack/migration-notes.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `compatibility-report.md`
- `regression-results.md`

### Étape 5 — Thor (thor)

**Action :** Déployer progressivement avec monitoring des métriques de performance

**Inputs :** `03-dev-fullstack/upgrade-log.md`, `04-qa/compatibility-report.md`, `04-qa/regression-results.md`

**Dépend de :** étape(s) 4

**Livrables :**
- `rollout-plan.md`
- `monitoring-dashboard.md`

