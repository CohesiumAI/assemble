# Workflow : mvp-launch

Lancement d'un MVP de A à Z — de la vision produit au déploiement

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Professor X (professor-x)

**Action :** Définir la vision produit, les user stories et le scope MVP

**Livrables :**
- `product-brief.md`
- `user-stories.md`

### Étape 2 — Tony Stark (tony-stark)

**Action :** Concevoir l'architecture technique du MVP

**Inputs :** `01-pm/product-brief.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `architecture-decision.md`
- `tech-stack.md`

### Étape 3 — Invisible Woman (invisible-woman)

**Action :** Créer les wireframes des écrans clés

**Inputs :** `01-pm/product-brief.md`, `01-pm/user-stories.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `wireframes.md`
- `user-flows.md`

### Étape 4 — Black Panther (black-panther)

**Action :** Définir le positionnement de marque, le ton et les guidelines visuelles

**Inputs :** `01-pm/product-brief.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `brand-positioning.md`
- `voice-and-tone.md`

### Étape 5 — Doctor Strange (doctor-strange)

**Action :** Concevoir le schéma de données

**Inputs :** `02-architect/architecture-decision.md`, `01-pm/user-stories.md`

**Dépend de :** étape(s) 2

**Livrables :**
- `schema.md`
- `migrations.md`

### Étape 6 — Bruce Banner (bruce-banner)

**Action :** Développer l'API et la logique métier

**Inputs :** `02-architect/architecture-decision.md`, `02-architect/tech-stack.md`, `05-db/schema.md`

**Dépend de :** étape(s) 2, 5

**Livrables :**
- `api-spec.md`
- `endpoints.md`

### Étape 7 — Spider-Man (spider-man)

**Action :** Développer l'interface utilisateur

**Inputs :** `03-ux/wireframes.md`, `03-ux/user-flows.md`, `04-brand/voice-and-tone.md`, `06-dev-backend/api-spec.md`, `06-dev-backend/endpoints.md`

**Dépend de :** étape(s) 3, 4, 6

**Livrables :**
- `components.md`
- `pages.md`

### Étape 8 — Hawkeye (hawkeye)

**Action :** Tester le MVP end-to-end

**Inputs :** `06-dev-backend/api-spec.md`, `07-dev-frontend/components.md`, `01-pm/user-stories.md`

**Dépend de :** étape(s) 6, 7

**Livrables :**
- `test-plan.md`
- `test-report.md`

### Étape 9 — Thor (thor)

**Action :** Mettre en place le CI/CD et le déploiement

**Inputs :** `02-architect/tech-stack.md`, `08-qa/test-report.md`

**Dépend de :** étape(s) 8

**Livrables :**
- `deployment-guide.md`
- `ci-cd-config.md`

