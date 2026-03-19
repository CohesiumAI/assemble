# Workflow : documentation-sprint

Sprint de documentation — inventaire, rédaction, revue et publication

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Nick Fury (nick-fury)

**Action :** Inventorier la documentation existante, identifier les manques et prioriser

**Livrables :**
- `doc-inventory.md`
- `gap-analysis.md`
- `doc-plan.md`

### Étape 2 — Tony Stark (tony-stark)

**Action :** Rédiger ou mettre à jour la documentation d'architecture (ADR, diagrammes, stack)

**Inputs :** `01-analyst/doc-plan.md`, `01-analyst/gap-analysis.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `architecture-docs.md`
- `adr-index.md`

### Étape 3 — Mr. Fantastic (mr-fantastic)

**Action :** Rédiger ou mettre à jour la documentation technique (API, README, guides de contribution)

**Inputs :** `01-analyst/doc-plan.md`, `01-analyst/gap-analysis.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `api-docs.md`
- `readme-update.md`
- `contributing-guide.md`

### Étape 4 — Loki (loki)

**Action :** Relire, clarifier et harmoniser le style de toute la documentation produite

**Inputs :** `02-architect/architecture-docs.md`, `03-dev-fullstack/api-docs.md`, `03-dev-fullstack/readme-update.md`

**Dépend de :** étape(s) 2, 3

**Livrables :**
- `edited-docs.md`
- `style-notes.md`

### Étape 5 — Thor (thor)

**Action :** Publier la documentation sur le site de docs et configurer la CI/CD docs

**Inputs :** `04-copywriter/edited-docs.md`, `03-dev-fullstack/api-docs.md`

**Dépend de :** étape(s) 4

**Livrables :**
- `docs-deployment.md`
- `ci-docs-config.md`

