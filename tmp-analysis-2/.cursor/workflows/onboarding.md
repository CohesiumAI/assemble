# Workflow : onboarding-project

Onboarding d'un nouveau projet — cadrage, analyse et mise en place de l'équipe

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Professor X (professor-x)

**Action :** Rédiger la charte du projet et définir la vision produit

**Livrables :**
- `project-charter.md`
- `product-vision.md`

### Étape 2 — Nick Fury (nick-fury)

**Action :** Documenter les exigences et cartographier les parties prenantes

**Inputs :** `01-pm/project-charter.md`, `01-pm/product-vision.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `requirements-doc.md`
- `stakeholder-map.md`

### Étape 3 — Tony Stark (tony-stark)

**Action :** Définir l'architecture globale et recommander la stack technique

**Inputs :** `02-analyst/requirements-doc.md`, `01-pm/product-vision.md`, `01-pm/project-charter.md`

**Dépend de :** étape(s) 2

**Livrables :**
- `architecture-overview.md`
- `tech-stack-recommendation.md`

### Étape 4 — Captain America (captain-america)

**Action :** Mettre en place l'équipe et définir les processus de travail

**Inputs :** `01-pm/project-charter.md`, `02-analyst/stakeholder-map.md`, `03-architect/architecture-overview.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `team-setup.md`
- `process-guide.md`

