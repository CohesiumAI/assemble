# Skills Cohesium AI

> **27 skills** : 14 partagees (multi-agents) + 13 specifiques (rattachees a un agent principal).

---

## Skills partagees (14)

Skills transversales utilisables par plusieurs agents. Chaque agent qui possede une skill peut l'executer via la commande correspondante.

### Tableau recapitulatif

| # | Skill | Commande | Agents | Description |
|---|-------|----------|--------|-------------|
| 1 | `code-review` | `/review` | dev-backend, dev-frontend, dev-fullstack, qa, security | Revue de code structuree avec checklist qualite |
| 2 | `git-workflow` | `/git` | dev-backend, dev-frontend, dev-fullstack, dev-mobile, devops, scrum | Gestion du workflow Git (branching, commits, PRs) |
| 3 | `documentation` | `/doc` | tous les agents (28) | Generation de documentation technique et fonctionnelle |
| 4 | `testing` | `/test` | dev-backend, dev-frontend, dev-fullstack, dev-mobile, qa | Strategie et execution de tests (unit, integration, e2e) |
| 5 | `security-check` | `/sec-check` | security, dev-backend, devops, architect | Verification de securite OWASP, vulnerabilites, hardening |
| 6 | `performance-audit` | `/perf` | dev-frontend, dev-backend, devops, data | Audit de performance (Core Web Vitals, requetes, charge) |
| 7 | `api-design` | `/api` | dev-backend, dev-fullstack, architect, dev-mobile | Conception d'API REST/GraphQL, versioning, pagination |
| 8 | `database-query` | `/db` | db, dev-backend, dev-fullstack, data | Optimisation et conception de requetes/schemas de BDD |
| 9 | `ci-cd` | `/cicd` | devops, dev-backend, dev-fullstack | Configuration et optimisation des pipelines CI/CD |
| 10 | `monitoring` | `/monitor` | devops, data, dev-backend | Mise en place du monitoring et de l'observabilite |
| 11 | `seo-audit` | `/seo` | seo, content-seo, geo-aio, dev-frontend | Audit SEO technique et on-page |
| 12 | `content-brief` | `/brief` | content-seo, copywriter, storytelling, social | Creation de briefs de contenu structures |
| 13 | `competitive-analysis` | `/benchmark` | analyst, marketing, growth, pm | Analyse concurrentielle et benchmark |
| 14 | `reporting` | `/report` | data, analyst, pm, scrum, marketing | Generation de rapports et tableaux de bord |

---

### Detail des skills partagees

#### 1. Code Review (`/review`)

**Description :** Revue de code structuree avec checklist qualite -- analyse statique, bonnes pratiques, securite, performance et maintenabilite.

**Agents :** dev-backend, dev-frontend, dev-fullstack, qa, security

**Quand l'utiliser :**
- Avant chaque merge request / pull request
- Lors d'un audit qualite du code existant
- Apres un refactoring majeur

**Etapes :**
1. Identifier le perimetre (fichiers modifies, contexte fonctionnel)
2. Verifier la structure et l'architecture
3. Analyser la lisibilite et les conventions
4. Evaluer la logique metier et les cas limites
5. Verifier la securite (injections, validation des entrees)
6. Evaluer la performance (complexite, requetes N+1)
7. Verifier la couverture de tests
8. Rediger le rapport (classe par severite : bloquant, majeur, mineur, suggestion)

---

#### 2. Git Workflow (`/git`)

**Description :** Gestion du workflow Git -- strategie de branching, conventions de commits, creation de PRs, resolution de conflits et processus de merge.

**Agents :** dev-backend, dev-frontend, dev-fullstack, dev-mobile, devops, scrum

**Quand l'utiliser :**
- Au demarrage d'une nouvelle fonctionnalite ou correction
- Lors de la creation d'une pull request
- Pour resoudre des conflits de merge
- Lors d'un release ou hotfix

**Etapes :**
1. Identifier le type de changement (feature, fix, hotfix, refactor, docs, chore, release)
2. Creer la branche selon la convention `type/ID-description-courte`
3. Rediger les commits en Conventional Commits
4. Preparer la pull request (titre, corps structure, lien ticket)
5. Gerer les conflits (rebase sur la branche cible)
6. Faciliter la revue
7. Merger et nettoyer (squash-merge ou merge classique)

---

#### 3. Documentation (`/doc`)

**Description :** Generation de documentation technique et fonctionnelle -- README, guides d'architecture, ADR, documentation d'API et guides utilisateur.

**Agents :** tous les agents (28 agents)

**Types de documents :**
- README projet
- ADR (Architecture Decision Record)
- Guide d'architecture
- Documentation d'API (OpenAPI)
- Guide utilisateur
- Runbook operationnel
- Changelog

---

#### 4. Testing (`/test`)

**Description :** Strategie et execution de tests -- tests unitaires, d'integration, end-to-end, avec generation de cas de test et analyse de couverture.

**Agents :** dev-backend, dev-frontend, dev-fullstack, dev-mobile, qa

**Etapes :**
1. Analyser le perimetre a tester
2. Choisir le niveau de test (unitaire, integration, e2e)
3. Identifier les cas de test (nominal, limites, erreur)
4. Preparer l'environnement de test (mocks, fixtures)
5. Rediger les tests (pattern AAA : Arrange, Act, Assert)
6. Executer et analyser la couverture
7. Documenter les resultats

---

#### 5. Security Check (`/sec-check`)

**Description :** Verification de securite -- audit OWASP Top 10, analyse de vulnerabilites, hardening des configurations, gestion des secrets et conformite des dependances.

**Agents :** security, dev-backend, devops, architect

**Etapes :**
1. Definir le perimetre d'audit
2. Analyser les vulnerabilites applicatives (OWASP Top 10)
3. Auditer la gestion des secrets
4. Analyser les dependances (CVE, CVSS)
5. Verifier le hardening des configurations (headers HTTP, TLS, CORS)
6. Auditer l'authentification et l'autorisation
7. Verifier le logging et la detection
8. Rediger le rapport de securite (classe par severite)

---

#### 6. Performance Audit (`/perf`)

**Description :** Audit de performance -- Core Web Vitals, optimisation des requetes, analyse de charge, profiling et recommandations d'amelioration.

**Agents :** dev-frontend, dev-backend, devops, data

---

#### 7. API Design (`/api`)

**Description :** Conception d'API REST/GraphQL -- contrats d'interface, versioning, pagination, gestion d'erreurs, documentation OpenAPI et bonnes pratiques.

**Agents :** dev-backend, dev-fullstack, architect, dev-mobile

---

#### 8. Database Query (`/db`)

**Description :** Optimisation et conception de requetes et schemas de base de donnees -- modelisation, indexation, plans d'execution, migrations et bonnes pratiques.

**Agents :** db, dev-backend, dev-fullstack, data

---

#### 9. CI/CD (`/cicd`)

**Description :** Configuration et optimisation des pipelines CI/CD -- build, tests, deploiement, quality gates, caching et bonnes pratiques DevOps.

**Agents :** devops, dev-backend, dev-fullstack

---

#### 10. Monitoring (`/monitor`)

**Description :** Mise en place et analyse du monitoring et de l'observabilite -- metriques, logs, traces, alerting et tableaux de bord operationnels.

**Agents :** devops, data, dev-backend

---

#### 11. SEO Audit (`/seo`)

**Description :** Audit SEO technique et on-page -- crawlabilite, Core Web Vitals, balises, donnees structurees, maillage interne et opportunites d'optimisation.

**Agents :** seo, content-seo, geo-aio, dev-frontend

---

#### 12. Content Brief (`/brief`)

**Description :** Creation de briefs de contenu structures -- recherche de mots-cles, analyse du search intent, structure editoriale, guidelines de redaction et criteres de performance.

**Agents :** content-seo, copywriter, storytelling, social

---

#### 13. Competitive Analysis (`/benchmark`)

**Description :** Analyse concurrentielle et benchmark -- positionnement, forces et faiblesses, strategies, opportunites de marche et recommandations strategiques.

**Agents :** analyst, marketing, growth, pm

---

#### 14. Reporting (`/report`)

**Description :** Generation de rapports et tableaux de bord -- collecte de donnees, analyse, visualisation, insights et recommandations pour le pilotage decisionnel.

**Agents :** data, analyst, pm, scrum, marketing

---

## Skills specifiques (13)

Skills rattachees a un agent principal. Chacune fournit un processus specialise propre a un domaine precis.

### Tableau recapitulatif

| # | Skill | Commande | Agent principal | Description |
|---|-------|----------|-----------------|-------------|
| 1 | `backend-api-scaffold` | `/scaffold-api` | dev-backend | Scaffolding complet d'une API backend avec structure, routes, controleurs et documentation |
| 2 | `frontend-component` | `/component` | dev-frontend | Creation de composant React/Next.js integre au design system avec accessibilite et tests |
| 3 | `mobile-screen` | `/screen` | dev-mobile | Creation d'ecran mobile React Native/Flutter avec navigation, etat et animations |
| 4 | `db-migration` | `/migrate` | db | Creation et gestion de migrations de base de donnees avec rollback et validation |
| 5 | `devops-pipeline` | `/pipeline` | devops | Creation de pipeline CI/CD complet avec build, tests, securite et deploiement |
| 6 | `pentest-scan` | `/pentest` | security | Scan de securite et test de penetration automatise avec rapport de vulnerabilites |
| 7 | `legal-compliance-check` | `/compliance` | legal | Verification de conformite reglementaire RGPD, AI Act et nLPD |
| 8 | `ad-campaign-setup` | `/ad-setup` | ads | Configuration complete de campagne publicitaire multi-plateforme |
| 9 | `growth-experiment` | `/experiment` | growth | Design et lancement d'experience growth avec hypothese, metriques et analyse |
| 10 | `ux-wireframe` | `/wireframe` | ux | Creation de wireframes et prototypes interactifs avec architecture d'information |
| 11 | `sprint-planning` | `/sprint-plan` | scrum | Planification et facilitation de sprint agile avec estimation et priorisation |
| 12 | `qa-test-plan` | `/test-plan` | qa | Creation de plan de test complet avec strategies, matrices de couverture et criteres |
| 13 | `automation-workflow` | `/automate` | automation | Conception de workflow d'automatisation multi-outils avec declencheurs et monitoring |

---

## Structure des fichiers

```
src/skills/
  shared/               # 14 skills partagees
    code-review.md
    git-workflow.md
    documentation.md
    testing.md
    security-check.md
    performance-audit.md
    api-design.md
    database-query.md
    ci-cd.md
    monitoring.md
    seo-audit.md
    content-brief.md
    competitive-analysis.md
    reporting.md
  specific/             # 13 skills specifiques
    backend-api-scaffold.md
    frontend-component.md
    mobile-screen.md
    db-migration.md
    devops-pipeline.md
    pentest-scan.md
    legal-compliance-check.md
    ad-campaign-setup.md
    growth-experiment.md
    ux-wireframe.md
    sprint-planning.md
    qa-test-plan.md
    automation-workflow.md
```

## Structure d'un fichier skill

Chaque fichier skill contient :
- **Front matter YAML** : nom, description, agents (ou agent), commande trigger
- **Objectif** : ce que la skill accomplit
- **Quand l'utiliser** : cas d'usage typiques
- **Etapes** : processus detaille etape par etape
- **Checklist de sortie** : criteres de validation avant de considerer la skill terminee
- **Format de sortie** : template markdown du livrable produit
