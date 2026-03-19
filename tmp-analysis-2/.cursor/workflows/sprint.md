# Workflow : sprint-cycle

Cycle de sprint Agile complet — de la planification à la livraison

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Captain America (captain-america)

**Action :** Préparer le backlog du sprint et planifier les cérémonies

**Livrables :**
- `sprint-backlog.md`
- `ceremony-plan.md`

### Étape 2 — Professor X (professor-x)

**Action :** Définir les objectifs du sprint et prioriser les user stories

**Inputs :** `01-scrum/sprint-backlog.md`, `01-scrum/ceremony-plan.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `sprint-goals.md`
- `prioritized-stories.md`

### Étape 3 — Mr. Fantastic (mr-fantastic)

**Action :** Implémenter les user stories et documenter les développements

**Inputs :** `02-pm/sprint-goals.md`, `02-pm/prioritized-stories.md`, `01-scrum/sprint-backlog.md`

**Dépend de :** étape(s) 2

**Livrables :**
- `implementation-log.md`
- `technical-notes.md`

### Étape 4 — Hawkeye (hawkeye)

**Action :** Tester les développements du sprint et rapporter les résultats

**Inputs :** `03-dev-fullstack/implementation-log.md`, `02-pm/prioritized-stories.md`, `02-pm/sprint-goals.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `test-results.md`
- `defects-log.md`

### Étape 5 — Thor (thor)

**Action :** Préparer la release et rédiger les notes de version

**Inputs :** `03-dev-fullstack/implementation-log.md`, `04-qa/test-results.md`, `04-qa/defects-log.md`

**Dépend de :** étape(s) 4

**Livrables :**
- `release-notes.md`
- `deployment-summary.md`

