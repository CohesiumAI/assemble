# Workflow : tech-debt-reduction

Réduction de la dette technique — inventaire, refactoring et validation

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Tony Stark (tony-stark)

**Action :** Inventorier la dette technique et analyser son impact sur le système

**Livrables :**
- `debt-inventory.md`
- `impact-analysis.md`

### Étape 2 — Mr. Fantastic (mr-fantastic)

**Action :** Élaborer le plan de refactoring et le guide de migration

**Inputs :** `01-architect/debt-inventory.md`, `01-architect/impact-analysis.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `refactoring-plan.md`
- `migration-guide.md`

### Étape 3 — Hawkeye (hawkeye)

**Action :** Vérifier la couverture de tests et valider les régressions post-refactoring

**Inputs :** `02-dev-fullstack/refactoring-plan.md`, `02-dev-fullstack/migration-guide.md`, `01-architect/debt-inventory.md`

**Dépend de :** étape(s) 2

**Livrables :**
- `test-coverage.md`
- `regression-report.md`

### Étape 4 — Thor (thor)

**Action :** Planifier le déploiement des changements de refactoring

**Inputs :** `02-dev-fullstack/refactoring-plan.md`, `03-qa/test-coverage.md`, `03-qa/regression-report.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `deployment-plan.md`
- `rollback-strategy.md`

