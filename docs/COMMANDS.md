# Commandes Cohesium AI

## Commandes d'agents (28)

Invocation directe d'un agent spécialisé.

| Commande | Agent | Marvel | Équipe |
|---|---|---|---|
| `/agent-pm` | Product Manager | Professor X | product |
| `/agent-architect` | Architecte Système | Tony Stark | dev |
| `/agent-analyst` | Business Analyst | Nick Fury | product |
| `/agent-backend` | Développeur Backend | Bruce Banner | dev |
| `/agent-frontend` | Développeur Frontend | Spider-Man | dev |
| `/agent-fullstack` | Développeur Fullstack | Mr. Fantastic | dev |
| `/agent-mobile` | Développeur Mobile | Ant-Man | dev |
| `/agent-db` | Architecte BDD | Doctor Strange | dev |
| `/agent-devops` | DevOps / SRE | Thor | ops |
| `/agent-qa` | QA / Testing | Hawkeye | ops |
| `/agent-security` | Expert Sécurité | Punisher | ops |
| `/agent-automation` | Automation | Quicksilver | ops |
| `/agent-ai` | AI Engineer | Vision | data |
| `/agent-data` | Data Analyst | Beast | data |
| `/agent-ux` | UX/UI Designer | Invisible Woman | design |
| `/agent-scrum` | Scrum Master | Captain America | product |
| `/agent-legal` | Legal / Compliance | She-Hulk | product |
| `/agent-marketing` | Marketing Manager | Star-Lord | marketing |
| `/agent-ads` | Paid Media | Gamora | marketing |
| `/agent-growth` | Growth Hacker | Rocket Raccoon | marketing |
| `/agent-seo` | SEO Technique | Black Widow | marketing |
| `/agent-content-seo` | Content SEO | Storm | marketing |
| `/agent-geo` | GEO / AIO | Jean Grey | marketing |
| `/agent-copywriter` | Copywriter | Loki | content |
| `/agent-brand` | Brand Strategist | Black Panther | content |
| `/agent-storytelling` | Storytelling | Silver Surfer | content |
| `/agent-social` | Social Media | Ms. Marvel | content |
| `/agent-contrarian` | Devil's Advocate | Deadpool | meta |

## Commandes de workflows (11)

Lancent un workflow complet avec orchestration automatique.

| Commande | Workflow | Agents impliqués |
|---|---|---|
| `/mvp` | MVP Launch | PM → Architect → UX → DB → Backend → Frontend → QA → DevOps |
| `/feature` | Feature Development | PM → Analyst → Architect → Dev(s) → QA |
| `/bugfix` | Bug Fix | QA → Dev(s) → QA |
| `/review-pipeline` | Code Review Pipeline | Dev → QA → Security → Contrarian |
| `/audit-security` | Security Audit | Security → Backend → DevOps → Legal |
| `/seo-pipeline` | SEO Content Pipeline | SEO → Content-SEO → Copywriter → GEO |
| `/campaign` | Marketing Campaign | Marketing → Brand → Copy → Ads → Social → Growth |
| `/sprint` | Sprint Cycle | Scrum → PM → Dev(s) → QA → DevOps |
| `/tech-debt` | Tech Debt Reduction | Architect → Dev(s) → QA → DevOps |
| `/onboard` | Onboarding Project | PM → Analyst → Architect → Scrum |
| `/release` | Release Cycle | Scrum → QA → Security → DevOps → Marketing |

## Commandes de skills partagées (14)

| Commande | Skill | Agents concernés |
|---|---|---|
| `/review` | Code Review | backend, frontend, fullstack, qa, security |
| `/git` | Git Workflow | tous les dev, devops, scrum |
| `/doc` | Documentation | tous |
| `/test` | Testing | backend, frontend, fullstack, mobile, qa |
| `/sec-check` | Security Check | security, backend, devops, architect |
| `/perf` | Performance Audit | frontend, backend, devops, data |
| `/api` | API Design | backend, fullstack, architect, mobile |
| `/db` | Database Query | db, backend, fullstack, data |
| `/cicd` | CI/CD | devops, backend, fullstack |
| `/monitor` | Monitoring | devops, data, backend |
| `/seo` | SEO Audit | seo, content-seo, geo-aio, frontend |
| `/brief` | Content Brief | content-seo, copywriter, storytelling, social |
| `/benchmark` | Competitive Analysis | analyst, marketing, growth, pm |
| `/report` | Reporting | data, analyst, pm, scrum, marketing |

## Commandes de skills spécifiques (13)

| Commande | Skill | Agent principal |
|---|---|---|
| `/scaffold-api` | Backend API Scaffold | dev-backend |
| `/component` | Frontend Component | dev-frontend |
| `/screen` | Mobile Screen | dev-mobile |
| `/migrate` | DB Migration | db |
| `/pipeline` | DevOps Pipeline | devops |
| `/pentest` | Pentest Scan | security |
| `/compliance` | Legal Compliance | legal |
| `/ad-setup` | Ad Campaign Setup | ads |
| `/experiment` | Growth Experiment | growth |
| `/wireframe` | UX Wireframe | ux |
| `/sprint-plan` | Sprint Planning | scrum |
| `/test-plan` | QA Test Plan | qa |
| `/automate` | Automation Workflow | automation |

## Commandes méta (12)

| Commande | Description |
|---|---|
| `/team` | Afficher l'équipe complète |
| `/team-dev` | Afficher l'équipe Développement |
| `/team-ops` | Afficher l'équipe Ops & Qualité |
| `/team-product` | Afficher l'équipe Produit |
| `/team-marketing` | Afficher l'équipe Marketing |
| `/team-content` | Afficher l'équipe Contenu |
| `/team-data` | Afficher l'équipe Data & IA |
| `/team-design` | Afficher l'équipe Design |
| `/status` | État du workflow en cours |
| `/handoff <agent>` | Passer le relais à un agent |
| `/agents` | Lister tous les agents |
| `/skills` | Lister toutes les skills |
| `/workflows` | Lister tous les workflows |
| `/help` | Aide générale |
| `/update` | Régénérer depuis .cohesium.yaml |
| `/reconfigure` | Relancer la configuration |
