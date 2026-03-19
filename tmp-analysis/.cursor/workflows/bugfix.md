# Workflow : bug-fix

Correction de bug structurée — de l'analyse à la validation de la correction

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Hawkeye (hawkeye)

**Action :** Analyser le bug, reproduire le problème et documenter les conditions

**Livrables :**
- `bug-analysis.md`
- `reproduction-steps.md`

### Étape 2 — Mr. Fantastic (mr-fantastic)

**Action :** Proposer et implémenter la correction du bug

**Inputs :** `01-qa/bug-analysis.md`, `01-qa/reproduction-steps.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `fix-proposal.md`
- `fix-implementation.md`

### Étape 3 — Hawkeye (hawkeye)

**Action :** Exécuter les tests de non-régression et valider la correction

**Inputs :** `02-dev-fullstack/fix-proposal.md`, `02-dev-fullstack/fix-implementation.md`, `01-qa/bug-analysis.md`

**Dépend de :** étape(s) 2

**Livrables :**
- `regression-test.md`
- `validation-report.md`

