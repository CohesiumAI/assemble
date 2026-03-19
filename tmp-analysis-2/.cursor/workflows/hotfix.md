# Workflow : hotfix-release

Correction d'urgence en production — diagnostic rapide, patch, validation minimale et déploiement

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Hawkeye (hawkeye)

**Action :** Diagnostiquer l'incident en production et documenter les conditions de reproduction

**Livrables :**
- `incident-report.md`
- `reproduction-steps.md`

### Étape 2 — Punisher (punisher)

**Action :** Évaluer l'impact sécurité de l'incident et prioriser la correction

**Inputs :** `01-qa/incident-report.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `security-assessment.md`
- `priority-level.md`

### Étape 3 — Mr. Fantastic (mr-fantastic)

**Action :** Implémenter le patch correctif minimal

**Inputs :** `01-qa/incident-report.md`, `01-qa/reproduction-steps.md`, `02-security/priority-level.md`

**Dépend de :** étape(s) 1, 2

**Livrables :**
- `hotfix-patch.md`
- `rollback-plan.md`

### Étape 4 — Hawkeye (hawkeye)

**Action :** Valider le patch avec un sous-ensemble de tests de non-régression critiques

**Inputs :** `03-dev-fullstack/hotfix-patch.md`, `01-qa/reproduction-steps.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `minimal-test-report.md`
- `validation-status.md`

### Étape 5 — Thor (thor)

**Action :** Déployer le hotfix en production avec rollback prêt et monitoring renforcé

**Inputs :** `03-dev-fullstack/hotfix-patch.md`, `03-dev-fullstack/rollback-plan.md`, `04-qa/validation-status.md`

**Dépend de :** étape(s) 4

**Livrables :**
- `deployment-log.md`
- `monitoring-checklist.md`

