# Workflow : code-review-pipeline

Pipeline de revue de code complète — analyse qualité, sécurité et regard critique

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Mr. Fantastic (mr-fantastic)

**Action :** Résumer les changements de code et documenter les décisions techniques

**Livrables :**
- `code-summary.md`
- `change-rationale.md`

### Étape 2 — Hawkeye (hawkeye)

**Action :** Évaluer la qualité du code, la couverture de tests et les bonnes pratiques

**Inputs :** `01-dev-fullstack/code-summary.md`, `01-dev-fullstack/change-rationale.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `quality-report.md`
- `recommendations.md`

### Étape 3 — Punisher (punisher)

**Action :** Auditer le code pour détecter les vulnérabilités et failles de sécurité

**Inputs :** `01-dev-fullstack/code-summary.md`, `02-qa/quality-report.md`

**Dépend de :** étape(s) 2

**Livrables :**
- `security-findings.md`
- `risk-assessment.md`

### Étape 4 — Deadpool (deadpool)

**Action :** Challenger les choix techniques et proposer des alternatives

**Inputs :** `01-dev-fullstack/code-summary.md`, `02-qa/quality-report.md`, `03-security/security-findings.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `devil-advocate-report.md`
- `alternative-approaches.md`

