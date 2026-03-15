# Commandes Cohesium AI

> **Reference complete** de toutes les commandes disponibles dans le systeme Cohesium AI. Organisees par categorie : agents, workflows, skills et meta-commandes.

---

## Resume rapide

| Categorie | Nombre | Prefixe / Pattern |
|-----------|--------|-------------------|
| Commandes d'agents | 28 | `/agent-*` |
| Commandes de workflows | 11 | `/mvp`, `/feature`, `/bugfix`, etc. |
| Skills partagees | 14 | `/review`, `/test`, `/doc`, etc. |
| Skills specifiques | 13 | `/scaffold-api`, `/component`, etc. |
| Meta-commandes | 16 | `/team`, `/status`, `/help`, etc. |
| **Total** | **82** | |

---

## Commandes d'agents (28)

Invocation directe d'un agent specialise. L'agent prend le controle et travaille selon ses instructions.

### Equipe Dev

| Commande | Agent | Marvel | Description |
|----------|-------|--------|-------------|
| `/agent-architect` | `architect` | Tony Stark | Invoquer l'Architecte Systeme Senior |
| `/agent-backend` | `dev-backend` | Bruce Banner | Invoquer le Developpeur Backend Senior |
| `/agent-frontend` | `dev-frontend` | Spider-Man | Invoquer le Developpeur Frontend Senior |
| `/agent-fullstack` | `dev-fullstack` | Mr. Fantastic | Invoquer le Developpeur Fullstack Senior |
| `/agent-mobile` | `dev-mobile` | Ant-Man | Invoquer le Developpeur Mobile Senior |
| `/agent-db` | `db` | Doctor Strange | Invoquer l'Architecte BDD Senior |

### Equipe Ops

| Commande | Agent | Marvel | Description |
|----------|-------|--------|-------------|
| `/agent-devops` | `devops` | Thor | Invoquer le DevOps / SRE Senior |
| `/agent-qa` | `qa` | Hawkeye | Invoquer le QA / Testing Senior |
| `/agent-security` | `security` | Punisher | Invoquer l'Expert Securite Senior |
| `/agent-automation` | `automation` | Quicksilver | Invoquer l'Expert Automation Senior |

### Equipe Product

| Commande | Agent | Marvel | Description |
|----------|-------|--------|-------------|
| `/agent-pm` | `pm` | Professor X | Invoquer le Product Manager Senior |
| `/agent-analyst` | `analyst` | Nick Fury | Invoquer le Business Analyst Senior |
| `/agent-scrum` | `scrum` | Captain America | Invoquer le Scrum Master Senior |
| `/agent-legal` | `legal` | She-Hulk | Invoquer l'Expert Legal/Compliance |

### Equipe Marketing

| Commande | Agent | Marvel | Description |
|----------|-------|--------|-------------|
| `/agent-marketing` | `marketing` | Star-Lord | Invoquer le Marketing Manager Senior |
| `/agent-ads` | `ads` | Gamora | Invoquer l'Expert Paid Media Senior |
| `/agent-growth` | `growth` | Rocket Raccoon | Invoquer le Growth Hacker Senior |
| `/agent-seo` | `seo` | Black Widow | Invoquer l'Expert SEO Technique Senior |
| `/agent-content-seo` | `content-seo` | Storm | Invoquer l'Expert Content SEO Senior |
| `/agent-geo` | `geo-aio` | Jean Grey | Invoquer l'Expert GEO/AIO Senior |

### Equipe Content

| Commande | Agent | Marvel | Description |
|----------|-------|--------|-------------|
| `/agent-copywriter` | `copywriter` | Loki | Invoquer le Copywriter Senior |
| `/agent-brand` | `brand` | Black Panther | Invoquer le Brand Strategist Senior |
| `/agent-storytelling` | `storytelling` | Silver Surfer | Invoquer l'Expert Storytelling Senior |
| `/agent-social` | `social` | Ms. Marvel | Invoquer le Social Media Manager Senior |

### Equipe Data

| Commande | Agent | Marvel | Description |
|----------|-------|--------|-------------|
| `/agent-ai` | `ai-engineer` | Vision | Invoquer l'AI Engineer Senior |
| `/agent-data` | `data` | Beast | Invoquer le Data Analyst Senior |

### Equipe Design

| Commande | Agent | Marvel | Description |
|----------|-------|--------|-------------|
| `/agent-ux` | `ux` | Invisible Woman | Invoquer l'UX/UI Designer Senior |

### Agent Transversal

| Commande | Agent | Marvel | Description |
|----------|-------|--------|-------------|
| `/agent-contrarian` | `contrarian` | Deadpool | Invoquer le Devil's Advocate |

---

## Commandes de workflows (11)

Lancent un workflow complet avec orchestration automatique par Jarvis. Chaque workflow enchaine plusieurs agents dans un ordre precis.

| Commande | Workflow | Sequence d'agents | Description |
|----------|----------|-------------------|-------------|
| `/mvp` | MVP Launch | PM, Architect, UX, DB, Backend, Frontend, QA, DevOps | Lancer le workflow MVP complet |
| `/feature` | Feature Development | PM, Analyst, Architect, Dev(s), QA | Developper une nouvelle fonctionnalite |
| `/bugfix` | Bug Fix | QA, Dev, QA | Corriger un bug de maniere structuree |
| `/review-pipeline` | Code Review Pipeline | Dev, QA, Security, Contrarian | Lancer une revue de code multi-perspectives |
| `/audit-security` | Security Audit | Security, Backend, DevOps, Legal | Lancer un audit de securite complet |
| `/seo-pipeline` | SEO Content Pipeline | SEO, Content-SEO, Copywriter, GEO/AIO | Creer du contenu optimise SEO |
| `/campaign` | Marketing Campaign | Marketing, Brand, Copywriter, Ads, Social, Growth | Lancer une campagne marketing multi-canal |
| `/sprint` | Sprint Cycle | Scrum, PM, Dev, QA, DevOps | Executer un cycle de sprint Agile |
| `/tech-debt` | Tech Debt Reduction | Architect, Dev, QA, DevOps | Reduire la dette technique |
| `/onboard` | Onboarding Project | PM, Analyst, Architect, Scrum | Demarrer un nouveau projet |
| `/release` | Release Cycle | Scrum, QA, Security, DevOps, Marketing | Mettre en production |

> Voir [docs/WORKFLOWS.md](WORKFLOWS.md) pour le detail des etapes, inputs/outputs et livrables.

---

## Commandes de skills partagees (14)

Skills transversales utilisables par plusieurs agents. La commande active la skill sur l'agent en cours ou l'agent le plus pertinent.

| Commande | Skill | Description | Agents concernes |
|----------|-------|-------------|------------------|
| `/review` | Code Review | Lancer une revue de code structuree | dev-backend, dev-frontend, dev-fullstack, qa, security |
| `/git` | Git Workflow | Gestion du workflow Git | dev-backend, dev-frontend, dev-fullstack, dev-mobile, devops, scrum |
| `/doc` | Documentation | Generer de la documentation | tous les agents |
| `/test` | Testing | Lancer une strategie de tests | dev-backend, dev-frontend, dev-fullstack, dev-mobile, qa |
| `/sec-check` | Security Check | Verification de securite rapide | security, dev-backend, devops, architect |
| `/perf` | Performance Audit | Audit de performance | dev-frontend, dev-backend, devops, data |
| `/api` | API Design | Conception d'API | dev-backend, dev-fullstack, architect, dev-mobile |
| `/db` | Database Query | Optimisation base de donnees | db, dev-backend, dev-fullstack, data |
| `/cicd` | CI/CD | Configuration CI/CD | devops, dev-backend, dev-fullstack |
| `/monitor` | Monitoring | Mise en place du monitoring | devops, data, dev-backend |
| `/seo` | SEO Audit | Audit SEO technique | seo, content-seo, geo-aio, dev-frontend |
| `/brief` | Content Brief | Creer un brief de contenu | content-seo, copywriter, storytelling, social |
| `/benchmark` | Competitive Analysis | Analyse concurrentielle | analyst, marketing, growth, pm |
| `/report` | Reporting | Generer un rapport | data, analyst, pm, scrum, marketing |

---

## Commandes de skills specifiques (13)

Skills rattachees a un agent principal. La commande invoque directement la skill specialisee de l'agent.

| Commande | Skill | Agent principal | Description |
|----------|-------|-----------------|-------------|
| `/scaffold-api` | Backend API Scaffold | dev-backend | Scaffolder une API backend complete |
| `/component` | Frontend Component | dev-frontend | Creer un composant React/Next.js |
| `/screen` | Mobile Screen | dev-mobile | Creer un ecran mobile |
| `/migrate` | DB Migration | db | Creer une migration de base de donnees |
| `/pipeline` | DevOps Pipeline | devops | Creer un pipeline CI/CD |
| `/pentest` | Pentest Scan | security | Lancer un scan de securite |
| `/compliance` | Legal Compliance Check | legal | Verification conformite RGPD/AI Act |
| `/ad-setup` | Ad Campaign Setup | ads | Configurer une campagne publicitaire |
| `/experiment` | Growth Experiment | growth | Designer une experience growth |
| `/wireframe` | UX Wireframe | ux | Creer des wireframes |
| `/sprint-plan` | Sprint Planning | scrum | Planifier un sprint |
| `/test-plan` | QA Test Plan | qa | Creer un plan de test |
| `/automate` | Automation Workflow | automation | Concevoir un workflow d'automatisation |

---

## Meta-commandes (16)

Commandes de gestion du systeme, d'information et de navigation.

### Commandes d'equipe

| Commande | Description |
|----------|-------------|
| `/team` | Afficher l'equipe complete avec roles et statuts |
| `/team-dev` | Afficher l'equipe Developpement (6 agents) |
| `/team-ops` | Afficher l'equipe Ops & Qualite (4 agents) |
| `/team-product` | Afficher l'equipe Produit & Strategie (4 agents) |
| `/team-marketing` | Afficher l'equipe Marketing & Growth (6 agents) |
| `/team-content` | Afficher l'equipe Contenu & Communication (4 agents) |
| `/team-data` | Afficher l'equipe Data & IA (2 agents) |
| `/team-design` | Afficher l'equipe Design (1 agent) |

### Commandes d'information

| Commande | Description |
|----------|-------------|
| `/agents` | Lister tous les agents disponibles |
| `/skills` | Lister toutes les skills disponibles |
| `/workflows` | Lister tous les workflows disponibles |
| `/help` | Afficher l'aide et le catalogue des commandes |

### Commandes de controle

| Commande | Usage | Description |
|----------|-------|-------------|
| `/status` | `/status` | Afficher l'etat du workflow en cours |
| `/handoff` | `/handoff <agent-name>` | Passer le relais manuellement a un agent specifique |

### Commandes de configuration

| Commande | Description |
|----------|-------------|
| `/update` | Regenerer les fichiers a partir de la config `.cohesium.yaml` existante |
| `/reconfigure` | Relancer l'assistant de configuration |

---

## Fichier source

Toutes les commandes sont definies dans `src/commands/commands.yaml`. Chaque commande contient :
- `name` : la commande (avec le prefixe `/`)
- `type` : `agent`, `workflow`, `skill` ou `meta`
- `description` : description en francais
- `category` : categorie pour le regroupement
- Selon le type : `agent`, `workflow`, `skill` ou `team` reference
