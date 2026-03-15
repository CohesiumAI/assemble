# Catalogue des Agents Cohesium AI

> **29 agents** (28 specialistes + 1 orchestrateur) organises en **8 equipes**.

---

## Vue d'ensemble

| # | Agent | Marvel | Role | Commande | Equipe |
|---|-------|--------|------|----------|--------|
| 1 | `architect` | Tony Stark | Architecte Systeme Senior | `/agent-architect` | dev |
| 2 | `dev-backend` | Bruce Banner | Developpeur Backend Senior | `/agent-backend` | dev |
| 3 | `dev-frontend` | Spider-Man | Developpeur Frontend Senior | `/agent-frontend` | dev |
| 4 | `dev-fullstack` | Mr. Fantastic | Developpeur Fullstack Senior | `/agent-fullstack` | dev |
| 5 | `dev-mobile` | Ant-Man | Developpeur Mobile Senior | `/agent-mobile` | dev |
| 6 | `db` | Doctor Strange | Architecte Base de Donnees Senior | `/agent-db` | dev |
| 7 | `devops` | Thor | DevOps / SRE Senior | `/agent-devops` | ops |
| 8 | `qa` | Hawkeye | QA / Testing Senior | `/agent-qa` | ops |
| 9 | `security` | Punisher | Expert Securite / Pentester Senior | `/agent-security` | ops |
| 10 | `automation` | Quicksilver | Expert Automatisation Senior | `/agent-automation` | ops |
| 11 | `pm` | Professor X | Product Manager Senior | `/agent-pm` | product |
| 12 | `analyst` | Nick Fury | Business Analyst Senior | `/agent-analyst` | product |
| 13 | `scrum` | Captain America | Scrum Master / Agile Coach Senior | `/agent-scrum` | product |
| 14 | `legal` | She-Hulk | Juriste IA / Digital Senior | `/agent-legal` | product |
| 15 | `marketing` | Star-Lord | Directeur Marketing Senior / CMO | `/agent-marketing` | marketing |
| 16 | `growth` | Rocket Raccoon | Growth Hacker Senior | `/agent-growth` | marketing |
| 17 | `ads` | Gamora | Expert Paid Media / Ads Senior | `/agent-ads` | marketing |
| 18 | `seo` | Black Widow | Expert SEO Technique Senior | `/agent-seo` | marketing |
| 19 | `content-seo` | Storm | Expert Content SEO Senior | `/agent-content-seo` | marketing |
| 20 | `geo-aio` | Jean Grey | Expert GEO / AIO Senior | `/agent-geo` | marketing |
| 21 | `copywriter` | Loki | Copywriter / Concepteur-Redacteur Senior | `/agent-copywriter` | content |
| 22 | `brand` | Black Panther | Brand Strategist Senior | `/agent-brand` | content |
| 23 | `storytelling` | Silver Surfer | Expert Storytelling / Narratif Senior | `/agent-storytelling` | content |
| 24 | `social` | Ms. Marvel | Social Media Manager Senior | `/agent-social` | content |
| 25 | `data` | Beast | Data Analyst Senior | `/agent-data` | data |
| 26 | `ai-engineer` | Vision | Ingenieur IA Senior | `/agent-ai` | data |
| 27 | `ux` | Invisible Woman | UX Designer Senior | `/agent-ux` | design |
| 28 | `contrarian` | Deadpool | Devil's Advocate | `/agent-contrarian` | meta |
| 29 | `jarvis` | Jarvis (J.A.R.V.I.S.) | Orchestrateur en Chef | *(automatique)* | meta |

---

## Detail par equipe

### Equipe Dev -- Developpement

**Lead :** Tony Stark (Architect) | **Commande :** `/team-dev`

| Agent | Marvel | Specialites | Description |
|-------|--------|-------------|-------------|
| `architect` | Tony Stark | Architecture, stack, scalabilite, ADR, C4 Model | Conception d'architecture logicielle, choix de stack, securite, trade-offs techniques. A appeler pour tout choix structurant : stack, infra, patterns, migration, decoupage de services. |
| `dev-backend` | Bruce Banner | Node.js, Python/FastAPI, PostgreSQL, APIs REST/GraphQL | APIs, authentification, integrations tierces. A appeler pour tout ce qui touche au serveur, a la base de donnees et aux APIs. |
| `dev-frontend` | Spider-Man | React, Next.js, TypeScript, Tailwind, accessibilite | UI/UX implementation, performance, accessibilite. A appeler pour tout ce qui est visible par l'utilisateur. |
| `dev-fullstack` | Mr. Fantastic | MVP rapide, integration end-to-end, glue code | Generaliste front+back, integrations, prototypage rapide. A appeler quand il faut aller vite de bout en bout. |
| `dev-mobile` | Ant-Man | React Native, Flutter, Expo, offline-first | iOS/Android natif ou cross-platform. A appeler pour tout ce qui touche aux applications mobiles. |
| `db` | Doctor Strange | PostgreSQL, multi-tenancy, migrations, RLS, pgvector | Schemas, optimisation requetes, sauvegardes. A appeler pour la structure, la performance et l'integrite des donnees. |

---

### Equipe Ops -- Ops & Qualite

**Lead :** Thor (DevOps) | **Commande :** `/team-ops`

| Agent | Marvel | Specialites | Description |
|-------|--------|-------------|-------------|
| `devops` | Thor | CI/CD, Docker, Kubernetes, Terraform, monitoring | Infrastructure cloud, securite infra. A appeler pour tout ce qui touche au deploiement et a la fiabilite. |
| `qa` | Hawkeye | Playwright, Cypress, Jest, pytest, plans de test | Tests fonctionnels, automatisation, detection de bugs. A appeler pour valider un livrable ou construire une strategie de test. |
| `security` | Punisher | OWASP, pentest, hardening, PTES | Audit securite, securite applicative. A appeler pour tout ce qui touche a la securite d'une application ou d'un systeme. |
| `automation` | Quicksilver | n8n, Make, Zapier, RPA, workflow automation | Integrations API, automatisation de processus metier. A appeler pour eliminer des taches manuelles repetitives. |

---

### Equipe Product -- Produit & Strategie

**Lead :** Professor X (PM) | **Commande :** `/team-product`

| Agent | Marvel | Specialites | Description |
|-------|--------|-------------|-------------|
| `pm` | Professor X | Vision, roadmap, RICE, OKRs, PRD, go-to-market | Priorisation, backlog. A appeler pour definir ce qu'on construit, pourquoi, et dans quel ordre. |
| `analyst` | Nick Fury | Requirements, specs, BABOK, user stories, Gherkin | Recueil de besoins, specifications fonctionnelles, analyse metier, benchmark concurrentiel. |
| `scrum` | Captain America | Sprint, velocity, ceremonies, Kanban, SAFe | Facilitation, suppression des blocages, amelioration continue. A appeler pour structurer le travail d'equipe. |
| `legal` | She-Hulk | RGPD, AI Act, nLPD, CGU/CGV, compliance | Protection des donnees, conformite reglementaire. A appeler pour tout sujet juridique lie au numerique et a l'IA. |

---

### Equipe Marketing -- Marketing & Growth

**Lead :** Star-Lord (Marketing) | **Commande :** `/team-marketing`

| Agent | Marvel | Specialites | Description |
|-------|--------|-------------|-------------|
| `marketing` | Star-Lord | Positionnement, ICP, pricing, AARRR | Go-to-market, strategie de croissance. A appeler pour definir comment une offre va au marche. |
| `growth` | Rocket Raccoon | Acquisition, retention, A/B testing, PLG | Funnel, viral loops. A appeler pour trouver les leviers de croissance rapide et scalable. |
| `ads` | Gamora | Google Ads, Meta Ads, LinkedIn Ads, ROAS | Strategie budget, ciblage. A appeler pour la publicite payante en ligne. |
| `seo` | Black Widow | Audit technique, Core Web Vitals, schema.org | Maillage interne, positionnement. A appeler pour la visibilite organique sur les moteurs de recherche. |
| `content-seo` | Storm | Strategie editoriale, clustering semantique | Briefs de contenu, articles optimises SEO. A appeler pour produire du contenu qui ranke durablement. |
| `geo-aio` | Jean Grey | Generative Engine Optimization, visibilite IA | Answer Engine Optimization, presence dans ChatGPT/Perplexity/Gemini/Copilot. |

---

### Equipe Content -- Contenu & Communication

**Lead :** Black Panther (Brand) | **Commande :** `/team-content`

| Agent | Marvel | Specialites | Description |
|-------|--------|-------------|-------------|
| `copywriter` | Loki | Landing pages, emails, ads, AIDA, PAS | CTA, storytelling de conversion. A appeler pour tout contenu qui doit convaincre ou convertir. |
| `brand` | Black Panther | Identite, positionnement, tone of voice, naming | Charte editoriale. A appeler pour definir ou redefinir l'identite d'une marque. |
| `storytelling` | Silver Surfer | Narratives, pitch, Hero's Journey, StoryBrand | Structures narratives, emotions. A appeler pour construire une histoire qui marque les esprits. |
| `social` | Ms. Marvel | LinkedIn, Instagram, X, calendrier editorial | Engagement, communaute. A appeler pour gerer la presence sociale d'une marque. |

---

### Equipe Data -- Data & IA

**Lead :** Vision (AI Engineer) | **Commande :** `/team-data`

| Agent | Marvel | Specialites | Description |
|-------|--------|-------------|-------------|
| `data` | Beast | Analytics, KPIs, SQL, dashboards, Metabase | Interpretation des donnees, data-driven decisions. A appeler pour analyser des donnees ou valider des hypotheses. |
| `ai-engineer` | Vision | LLMs, RAG, agents, fine-tuning, LangChain | Evaluation de modeles, integrations IA. A appeler pour concevoir et implementer tout systeme IA. |

---

### Equipe Design

**Lead :** Invisible Woman (UX) | **Commande :** `/team-design`

| Agent | Marvel | Specialites | Description |
|-------|--------|-------------|-------------|
| `ux` | Invisible Woman | Wireframes, usability, design systems, Figma | Parcours utilisateur, tests usabilite. A appeler pour concevoir des experiences utilisateur intuitives. |

---

### Agents Transversaux (Meta)

| Agent | Marvel | Specialites | Description |
|-------|--------|-------------|-------------|
| `contrarian` | Deadpool | Red teaming, biais, pre-mortem, 5 Whys | Challenge systematiquement les decisions et les consensus. A appeler pour eviter le groupthink. |
| `jarvis` | Jarvis (J.A.R.V.I.S.) | Classification, sequencage, chainage, manifest | Orchestrateur en chef. Analyse les demandes, selectionne et sequence les agents, gere les handoffs et consolide les livrables. |

---

## L'orchestrateur Jarvis

Jarvis est le **point d'entree unique** du systeme. Il ne fait pas le travail lui-meme mais coordonne les agents :

1. **Recoit** la demande utilisateur
2. **Classifie** le domaine (dev, marketing, seo, product, security, ops...)
3. **Matche** un workflow predefini ou compose un workflow ad-hoc
4. **Initialise** le workspace et le `_manifest.yaml`
5. **Execute** les agents sequentiellement avec injection de contexte
6. **Consolide** les livrables en un `_summary.md`

### Logique de classification

| Mots-cles detectes | Workflow declenche |
|---------------------|--------------------|
| "MVP", "nouveau produit", "lancer" | `/mvp` |
| "feature", "fonctionnalite", "ajouter" | `/feature` |
| "bug", "erreur", "fix", "corriger" | `/bugfix` |
| "review", "relire", "revue de code" | `/review-pipeline` |
| "securite", "audit", "vulnerabilite" | `/audit-security` |
| "SEO", "contenu", "article", "blog" | `/seo-pipeline` |
| "campagne", "marketing", "publicite" | `/campaign` |
| "sprint", "iteration", "planning" | `/sprint` |
| "dette technique", "refactoring" | `/tech-debt` |
| "onboarding", "nouveau projet" | `/onboard` |
| "release", "deploiement", "mise en prod" | `/release` |
| Autre | Workflow ad-hoc compose automatiquement |

### Anti-patterns de Jarvis

- Ne fait jamais le travail d'un agent specialise
- Ne saute jamais une etape sans accord explicite
- Ne lance jamais un agent sans lui fournir les inputs necessaires
- Alerte toujours si un livrable manque
- Ne modifie jamais les livrables d'un autre agent
- Ne lance pas les agents en parallele sans respecter les dependances

---

## Fichiers source

Chaque agent est defini dans `src/agents/AGENT-{name}.md` avec :
- **Identite** : nom, description, persona Marvel
- **Posture** : principes de fonctionnement
- **Sequence d'intervention** : etapes de travail
- **Skills** : competences invocables
- **Format de sortie** : templates de livrables
- **Anti-patterns** : ce que l'agent ne fait jamais
