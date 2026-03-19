# Workflow : seo-content-pipeline

Pipeline de création de contenu SEO — de la recherche de mots-clés à l'optimisation GEO/AIO

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Black Widow (black-widow)

**Action :** Effectuer la recherche de mots-clés et définir la stratégie de contenu

**Livrables :**
- `keyword-research.md`
- `content-strategy.md`

### Étape 2 — Storm (storm)

**Action :** Rédiger le brief de contenu et structurer la sémantique

**Inputs :** `01-seo/keyword-research.md`, `01-seo/content-strategy.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `content-brief.md`
- `semantic-structure.md`

### Étape 3 — Loki (loki)

**Action :** Rédiger le brouillon de l'article optimisé pour le SEO

**Inputs :** `02-content-seo/content-brief.md`, `02-content-seo/semantic-structure.md`, `01-seo/keyword-research.md`

**Dépend de :** étape(s) 2

**Livrables :**
- `article-draft.md`
- `meta-tags.md`

### Étape 4 — Jean Grey (jean-grey)

**Action :** Optimiser le contenu pour la recherche géolocalisée et l'IA générative

**Inputs :** `03-copywriter/article-draft.md`, `01-seo/keyword-research.md`, `02-content-seo/semantic-structure.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `geo-optimization.md`
- `aio-recommendations.md`

