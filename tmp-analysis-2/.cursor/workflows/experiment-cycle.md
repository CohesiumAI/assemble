# Workflow : experimentation

Cycle d'expérimentation A/B — hypothèse, implémentation, mesure et décision

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Professor X (professor-x)

**Action :** Définir l'hypothèse, les métriques de succès et les critères de décision

**Livrables :**
- `hypothesis.md`
- `success-metrics.md`
- `decision-criteria.md`

### Étape 2 — Beast (beast)

**Action :** Calculer la taille d'échantillon requise et configurer le tracking analytique

**Inputs :** `01-pm/hypothesis.md`, `01-pm/success-metrics.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `sample-size.md`
- `tracking-plan.md`

### Étape 3 — Mr. Fantastic (mr-fantastic)

**Action :** Implémenter les variantes via feature flags et instrumenter le code

**Inputs :** `01-pm/hypothesis.md`, `02-data/tracking-plan.md`

**Dépend de :** étape(s) 1, 2

**Livrables :**
- `implementation-spec.md`
- `feature-flags.md`

### Étape 4 — Hawkeye (hawkeye)

**Action :** Valider que les variantes fonctionnent correctement et que le tracking est précis

**Inputs :** `03-dev-fullstack/implementation-spec.md`, `03-dev-fullstack/feature-flags.md`, `02-data/tracking-plan.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `variant-test-report.md`
- `tracking-validation.md`

### Étape 5 — Rocket Raccoon (rocket-raccoon)

**Action :** Analyser les résultats, évaluer la significativité statistique et recommander la décision

**Inputs :** `01-pm/hypothesis.md`, `01-pm/decision-criteria.md`, `02-data/sample-size.md`, `04-qa/tracking-validation.md`

**Dépend de :** étape(s) 4

**Livrables :**
- `experiment-results.md`
- `decision-recommendation.md`

