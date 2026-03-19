# Workflow : feature-development

Développement d'une nouvelle fonctionnalité — de la spécification à la validation

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Professor X (professor-x)

**Action :** Rédiger la spécification fonctionnelle de la nouvelle fonctionnalité

**Livrables :**
- `feature-spec.md`
- `acceptance-criteria.md`

### Étape 2 — Nick Fury (nick-fury)

**Action :** Analyser les exigences techniques et métier

**Inputs :** `01-pm/feature-spec.md`, `01-pm/acceptance-criteria.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `requirements.md`
- `impact-analysis.md`

### Étape 3 — Tony Stark (tony-stark)

**Action :** Concevoir la solution technique et les choix d'architecture

**Inputs :** `02-analyst/requirements.md`, `01-pm/feature-spec.md`

**Dépend de :** étape(s) 2

**Livrables :**
- `technical-design.md`
- `integration-plan.md`

### Étape 4 — Bruce Banner (bruce-banner)

**Action :** Implémenter la logique métier et les endpoints API

**Inputs :** `03-architect/technical-design.md`, `02-analyst/requirements.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `implementation-notes.md`
- `api-changes.md`

### Étape 5 — Spider-Man (spider-man)

**Action :** Implémenter l'interface utilisateur de la fonctionnalité

**Inputs :** `03-architect/technical-design.md`, `04-dev-backend/api-changes.md`, `01-pm/feature-spec.md`

**Dépend de :** étape(s) 3, 4

**Livrables :**
- `ui-implementation.md`
- `component-list.md`

### Étape 6 — Hawkeye (hawkeye)

**Action :** Valider la fonctionnalité avec des tests fonctionnels et de non-régression

**Inputs :** `04-dev-backend/implementation-notes.md`, `05-dev-frontend/ui-implementation.md`, `01-pm/acceptance-criteria.md`

**Dépend de :** étape(s) 4, 5

**Livrables :**
- `test-report.md`
- `validation-summary.md`

