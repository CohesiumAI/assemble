# Skills Cohesium AI

## Skills partagées (14)

Skills transversales utilisables par plusieurs agents.

| Skill | Commande | Description | Agents |
|---|---|---|---|
| code-review | `/review` | Revue de code structurée avec checklist qualité | backend, frontend, fullstack, qa, security |
| git-workflow | `/git` | Gestion du workflow Git (branching, commits, PRs) | tous les dev, devops, scrum |
| documentation | `/doc` | Génération de documentation technique et fonctionnelle | tous les agents |
| testing | `/test` | Stratégie et exécution de tests (unit, intégration, e2e) | backend, frontend, fullstack, mobile, qa |
| security-check | `/sec-check` | Vérification de sécurité OWASP, vulnérabilités | security, backend, devops, architect |
| performance-audit | `/perf` | Audit de performance (Web Vitals, requêtes, charge) | frontend, backend, devops, data |
| api-design | `/api` | Conception d'API REST/GraphQL | backend, fullstack, architect, mobile |
| database-query | `/db` | Optimisation et conception de requêtes/schémas DB | db, backend, fullstack, data |
| ci-cd | `/cicd` | Configuration et optimisation des pipelines CI/CD | devops, backend, fullstack |
| monitoring | `/monitor` | Mise en place du monitoring/observabilité | devops, data, backend |
| seo-audit | `/seo` | Audit SEO technique et on-page | seo, content-seo, geo-aio, frontend |
| content-brief | `/brief` | Création de briefs de contenu structurés | content-seo, copywriter, storytelling, social |
| competitive-analysis | `/benchmark` | Analyse concurrentielle et benchmark | analyst, marketing, growth, pm |
| reporting | `/report` | Génération de rapports et tableaux de bord | data, analyst, pm, scrum, marketing |

## Skills spécifiques (13)

Skills rattachées à un agent principal.

| Skill | Commande | Description | Agent principal |
|---|---|---|---|
| backend-api-scaffold | `/scaffold-api` | Scaffolding complet d'une API backend | dev-backend |
| frontend-component | `/component` | Création de composant React/Next.js | dev-frontend |
| mobile-screen | `/screen` | Création d'écran mobile React Native/Flutter | dev-mobile |
| db-migration | `/migrate` | Création et gestion de migrations DB | db |
| devops-pipeline | `/pipeline` | Création de pipeline CI/CD complet | devops |
| pentest-scan | `/pentest` | Scan de sécurité et test de pénétration | security |
| legal-compliance-check | `/compliance` | Vérification conformité RGPD/AI Act/nLPD | legal |
| ad-campaign-setup | `/ad-setup` | Configuration de campagne publicitaire | ads |
| growth-experiment | `/experiment` | Design et lancement d'expérience growth | growth |
| ux-wireframe | `/wireframe` | Création de wireframes et prototypes | ux |
| sprint-planning | `/sprint-plan` | Planification et facilitation de sprint | scrum |
| qa-test-plan | `/test-plan` | Création de plan de test complet | qa |
| automation-workflow | `/automate` | Conception de workflow d'automatisation | automation |

## Structure des fichiers

```
src/skills/
├── shared/           # 14 skills partagées
│   ├── code-review.md
│   ├── git-workflow.md
│   └── ...
└── specific/         # 13 skills spécifiques
    ├── backend-api-scaffold.md
    ├── frontend-component.md
    └── ...
```

Chaque skill contient : objectif, étapes, checklist de sortie, format de sortie.
