# Workflow : marketing-campaign

Lancement de campagne marketing — de la stratégie à l'exécution multi-canal

## Instructions d'exécution

Répertoire de sortie : `.\deliverables`

### Étape 1 — Star-Lord (star-lord)

**Action :** Définir la stratégie de campagne et identifier l'audience cible

**Livrables :**
- `campaign-strategy.md`
- `target-audience.md`

### Étape 2 — Iron Fist (iron-fist)

**Action :** Valider le budget de la campagne et définir les KPIs financiers (CAC cible, ROAS)

**Inputs :** `01-marketing/campaign-strategy.md`, `01-marketing/target-audience.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `campaign-budget.md`
- `financial-kpis.md`

### Étape 3 — Black Panther (black-panther)

**Action :** Établir les directives de marque et le positionnement du message

**Inputs :** `01-marketing/campaign-strategy.md`, `01-marketing/target-audience.md`

**Dépend de :** étape(s) 1

**Livrables :**
- `brand-guidelines.md`
- `messaging.md`

### Étape 4 — Loki (loki)

**Action :** Rédiger les assets textuels pour tous les canaux de la campagne

**Inputs :** `03-brand/brand-guidelines.md`, `03-brand/messaging.md`, `01-marketing/target-audience.md`

**Dépend de :** étape(s) 3

**Livrables :**
- `copy-assets.md`
- `tone-of-voice.md`

### Étape 5 — Gamora (gamora)

**Action :** Configurer les campagnes publicitaires et allouer le budget

**Inputs :** `01-marketing/campaign-strategy.md`, `01-marketing/target-audience.md`, `04-copywriter/copy-assets.md`, `02-finance/campaign-budget.md`

**Dépend de :** étape(s) 4, 2

**Livrables :**
- `ad-setup.md`
- `budget-allocation.md`

### Étape 6 — Ms. Marvel (ms-marvel)

**Action :** Planifier le calendrier éditorial et le contenu des réseaux sociaux

**Inputs :** `04-copywriter/copy-assets.md`, `03-brand/brand-guidelines.md`, `01-marketing/campaign-strategy.md`

**Dépend de :** étape(s) 4

**Livrables :**
- `social-calendar.md`
- `content-plan.md`

### Étape 7 — Phil Coulson (phil-coulson)

**Action :** Préparer le communiqué de presse et la stratégie earned media de la campagne

**Inputs :** `04-copywriter/copy-assets.md`, `03-brand/messaging.md`, `01-marketing/campaign-strategy.md`

**Dépend de :** étape(s) 4

**Livrables :**
- `press-release.md`
- `media-plan.md`

### Étape 8 — Rocket Raccoon (rocket-raccoon)

**Action :** Définir les métriques de croissance et les expérimentations

**Inputs :** `05-ads/ad-setup.md`, `05-ads/budget-allocation.md`, `06-social/social-calendar.md`, `02-finance/financial-kpis.md`

**Dépend de :** étape(s) 5, 6

**Livrables :**
- `growth-metrics.md`
- `experiment-plan.md`

