# Workflows Cohesium AI

> **11 workflows pre-configures** : chaines de production qui orchestrent automatiquement une sequence d'agents pour accomplir un objectif complet.

---

## Vue d'ensemble

| # | Workflow | Commande | Agents impliques | Description |
|---|----------|----------|------------------|-------------|
| 1 | MVP Launch | `/mvp` | PM, Architect, UX, DB, Backend, Frontend, QA, DevOps | Lancement d'un MVP de A a Z |
| 2 | Feature Development | `/feature` | PM, Analyst, Architect, Backend, Frontend, QA | Developpement d'une nouvelle fonctionnalite |
| 3 | Bug Fix | `/bugfix` | QA, Dev, QA | Correction de bug structuree |
| 4 | Code Review Pipeline | `/review-pipeline` | Dev, QA, Security, Contrarian | Revue de code multi-perspectives |
| 5 | Security Audit | `/audit-security` | Security, Backend, DevOps, Legal | Audit de securite complet |
| 6 | SEO Content Pipeline | `/seo-pipeline` | SEO, Content-SEO, Copywriter, GEO/AIO | Creation de contenu optimise SEO |
| 7 | Marketing Campaign | `/campaign` | Marketing, Brand, Copywriter, Ads, Social, Growth | Campagne marketing multi-canal |
| 8 | Sprint Cycle | `/sprint` | Scrum, PM, Dev, QA, DevOps | Cycle de sprint Agile complet |
| 9 | Tech Debt Reduction | `/tech-debt` | Architect, Dev, QA, DevOps | Reduction de la dette technique |
| 10 | Onboarding Project | `/onboard` | PM, Analyst, Architect, Scrum | Cadrage d'un nouveau projet |
| 11 | Release Cycle | `/release` | Scrum, QA, Security, DevOps, Marketing | Mise en production |

---

## Concept de chainage (chaining)

Chaque workflow est une **sequence ordonnee d'agents** ou chaque etape :

1. **Recoit des inputs** -- livrables produits par les agents precedents
2. **Execute une action** -- travail specifique de l'agent
3. **Produit des outputs** -- livrables consommes par les agents suivants
4. **Declare des dependances** -- `depends_on` definit quelles etapes doivent etre terminees avant

L'orchestrateur Jarvis gere ce chainage automatiquement :
- Il injecte le contexte (inputs) avant chaque agent
- Il verifie que les outputs attendus sont produits
- Il met a jour le `_manifest.yaml` apres chaque etape
- Il alerte si un livrable manque

---

## Detail des workflows

### 1. MVP Launch (`/mvp`)

**Description :** Lancement d'un MVP de A a Z -- de la vision produit au deploiement.

**Repertoire de sortie :** `{cohesium_output}/mvp_{timestamp}/`

| Etape | Agent | Action | Inputs | Outputs |
|-------|-------|--------|--------|---------|
| 1 | `pm` | Definir la vision produit, les user stories et le scope MVP | -- | `product-brief.md`, `user-stories.md` |
| 2 | `architect` | Concevoir l'architecture technique du MVP | product-brief | `architecture-decision.md`, `tech-stack.md` |
| 3 | `ux` | Creer les wireframes des ecrans cles | product-brief, user-stories | `wireframes.md`, `user-flows.md` |
| 4 | `db` | Concevoir le schema de donnees | architecture-decision, user-stories | `schema.md`, `migrations.md` |
| 5 | `dev-backend` | Developper l'API et la logique metier | architecture-decision, tech-stack, schema | `api-spec.md`, `endpoints.md` |
| 6 | `dev-frontend` | Developper l'interface utilisateur | wireframes, user-flows, api-spec, endpoints | `components.md`, `pages.md` |
| 7 | `qa` | Tester le MVP end-to-end | api-spec, components, user-stories | `test-plan.md`, `test-report.md` |
| 8 | `devops` | Mettre en place le CI/CD et le deploiement | tech-stack, test-report | `deployment-guide.md`, `ci-cd-config.md` |

**Graphe de dependances :**
```
PM(1) --> Architect(2) --> DB(4) --> Backend(5) --> Frontend(6) --> QA(7) --> DevOps(8)
PM(1) --> UX(3) ----------------------------------------^
```

**Livrables cles :** Brief produit, architecture, wireframes, schema BDD, spec API, composants UI, rapport de tests, guide de deploiement.

---

### 2. Feature Development (`/feature`)

**Description :** Developpement d'une nouvelle fonctionnalite -- de la specification a la validation.

**Repertoire de sortie :** `{cohesium_output}/feature_{timestamp}/`

| Etape | Agent | Action | Inputs | Outputs |
|-------|-------|--------|--------|---------|
| 1 | `pm` | Rediger la specification fonctionnelle | -- | `feature-spec.md`, `acceptance-criteria.md` |
| 2 | `analyst` | Analyser les exigences techniques et metier | feature-spec, acceptance-criteria | `requirements.md`, `impact-analysis.md` |
| 3 | `architect` | Concevoir la solution technique | requirements, feature-spec | `technical-design.md`, `integration-plan.md` |
| 4 | `dev-backend` | Implementer la logique metier et les endpoints | technical-design, requirements | `implementation-notes.md`, `api-changes.md` |
| 5 | `dev-frontend` | Implementer l'interface utilisateur | technical-design, api-changes, feature-spec | `ui-implementation.md`, `component-list.md` |
| 6 | `qa` | Valider avec tests fonctionnels et de non-regression | implementation-notes, ui-implementation, acceptance-criteria | `test-report.md`, `validation-summary.md` |

**Livrables cles :** Spec fonctionnelle, analyse d'impact, design technique, plan d'integration, notes d'implementation, rapport de validation.

---

### 3. Bug Fix (`/bugfix`)

**Description :** Correction de bug structuree -- de l'analyse a la validation.

**Repertoire de sortie :** `{cohesium_output}/bugfix_{timestamp}/`

| Etape | Agent | Action | Inputs | Outputs |
|-------|-------|--------|--------|---------|
| 1 | `qa` | Analyser le bug, reproduire le probleme | -- | `bug-analysis.md`, `reproduction-steps.md` |
| 2 | `dev` | Proposer et implementer la correction | bug-analysis, reproduction-steps | `fix-proposal.md`, `fix-implementation.md` |
| 3 | `qa` | Executer les tests de non-regression et valider | fix-proposal, fix-implementation, bug-analysis | `regression-test.md`, `validation-report.md` |

**Livrables cles :** Analyse du bug, etapes de reproduction, proposition de correction, rapport de regression.

---

### 4. Code Review Pipeline (`/review-pipeline`)

**Description :** Pipeline de revue de code complete -- analyse qualite, securite et regard critique.

**Repertoire de sortie :** `{cohesium_output}/code-review_{timestamp}/`

| Etape | Agent | Action | Inputs | Outputs |
|-------|-------|--------|--------|---------|
| 1 | `dev` | Resumer les changements et documenter les decisions | -- | `code-summary.md`, `change-rationale.md` |
| 2 | `qa` | Evaluer la qualite du code et la couverture de tests | code-summary, change-rationale | `quality-report.md`, `recommendations.md` |
| 3 | `security` | Auditer le code pour detecter les vulnerabilites | code-summary, quality-report | `security-findings.md`, `risk-assessment.md` |
| 4 | `contrarian` | Challenger les choix techniques et proposer des alternatives | code-summary, quality-report, security-findings | `devil-advocate-report.md`, `alternative-approaches.md` |

**Livrables cles :** Resume du code, rapport qualite, constats de securite, rapport Devil's Advocate avec alternatives.

---

### 5. Security Audit (`/audit-security`)

**Description :** Audit de securite complet -- detection des vulnerabilites, remediation et conformite.

**Repertoire de sortie :** `{cohesium_output}/security-audit_{timestamp}/`

| Etape | Agent | Action | Inputs | Outputs |
|-------|-------|--------|--------|---------|
| 1 | `security` | Scanner et identifier les vulnerabilites | -- | `vulnerability-report.md`, `threat-model.md` |
| 2 | `dev-backend` | Elaborer le plan de remediation | vulnerability-report, threat-model | `remediation-plan.md`, `patching-schedule.md` |
| 3 | `devops` | Renforcer la securite de l'infrastructure | vulnerability-report, remediation-plan | `infrastructure-hardening.md`, `security-config.md` |
| 4 | `legal` | Verifier la conformite reglementaire | vulnerability-report, infrastructure-hardening, remediation-plan | `compliance-check.md`, `regulatory-summary.md` |

**Livrables cles :** Rapport de vulnerabilites, modele de menaces, plan de remediation, hardening infra, verification de conformite.

---

### 6. SEO Content Pipeline (`/seo-pipeline`)

**Description :** Pipeline de creation de contenu SEO -- de la recherche de mots-cles a l'optimisation GEO/AIO.

**Repertoire de sortie :** `{cohesium_output}/seo-content_{timestamp}/`

| Etape | Agent | Action | Inputs | Outputs |
|-------|-------|--------|--------|---------|
| 1 | `seo` | Recherche de mots-cles et strategie de contenu | -- | `keyword-research.md`, `content-strategy.md` |
| 2 | `content-seo` | Rediger le brief et structurer la semantique | keyword-research, content-strategy | `content-brief.md`, `semantic-structure.md` |
| 3 | `copywriter` | Rediger l'article optimise SEO | content-brief, semantic-structure, keyword-research | `article-draft.md`, `meta-tags.md` |
| 4 | `geo-aio` | Optimiser pour la recherche geolocalisee et l'IA generative | article-draft, keyword-research, semantic-structure | `geo-optimization.md`, `aio-recommendations.md` |

**Livrables cles :** Recherche de mots-cles, brief de contenu, article redige, optimisation GEO/AIO.

---

### 7. Marketing Campaign (`/campaign`)

**Description :** Lancement de campagne marketing -- de la strategie a l'execution multi-canal.

**Repertoire de sortie :** `{cohesium_output}/marketing_{timestamp}/`

| Etape | Agent | Action | Inputs | Outputs |
|-------|-------|--------|--------|---------|
| 1 | `marketing` | Definir la strategie et identifier l'audience cible | -- | `campaign-strategy.md`, `target-audience.md` |
| 2 | `brand` | Etablir les directives de marque et le positionnement | campaign-strategy, target-audience | `brand-guidelines.md`, `messaging.md` |
| 3 | `copywriter` | Rediger les assets textuels pour tous les canaux | brand-guidelines, messaging, target-audience | `copy-assets.md`, `tone-of-voice.md` |
| 4 | `ads` | Configurer les campagnes publicitaires et le budget | campaign-strategy, target-audience, copy-assets | `ad-setup.md`, `budget-plan.md` |
| 5 | `social` | Planifier le calendrier editorial et le contenu social | copy-assets, brand-guidelines, campaign-strategy | `social-calendar.md`, `content-plan.md` |
| 6 | `growth` | Definir les metriques de croissance et experimentations | ad-setup, budget-plan, social-calendar, campaign-strategy | `growth-metrics.md`, `experiment-plan.md` |

**Livrables cles :** Strategie de campagne, guidelines de marque, assets textuels, configuration ads, calendrier social, plan d'experimentations growth.

---

### 8. Sprint Cycle (`/sprint`)

**Description :** Cycle de sprint Agile complet -- de la planification a la livraison.

**Repertoire de sortie :** `{cohesium_output}/sprint_{timestamp}/`

| Etape | Agent | Action | Inputs | Outputs |
|-------|-------|--------|--------|---------|
| 1 | `scrum` | Preparer le backlog du sprint et planifier les ceremonies | -- | `sprint-backlog.md`, `ceremony-plan.md` |
| 2 | `pm` | Definir les objectifs et prioriser les user stories | sprint-backlog, ceremony-plan | `sprint-goals.md`, `prioritized-stories.md` |
| 3 | `dev` | Implementer les user stories et documenter | sprint-goals, prioritized-stories, sprint-backlog | `implementation-log.md`, `technical-notes.md` |
| 4 | `qa` | Tester les developpements et rapporter les resultats | implementation-log, prioritized-stories, sprint-goals | `test-results.md`, `defects-log.md` |
| 5 | `devops` | Preparer la release et rediger les notes de version | implementation-log, test-results, defects-log | `release-notes.md`, `deployment-summary.md` |

**Livrables cles :** Backlog de sprint, objectifs, log d'implementation, resultats de tests, notes de release.

---

### 9. Tech Debt Reduction (`/tech-debt`)

**Description :** Reduction de la dette technique -- inventaire, refactoring et validation.

**Repertoire de sortie :** `{cohesium_output}/tech-debt_{timestamp}/`

| Etape | Agent | Action | Inputs | Outputs |
|-------|-------|--------|--------|---------|
| 1 | `architect` | Inventorier la dette technique et analyser l'impact | -- | `debt-inventory.md`, `impact-analysis.md` |
| 2 | `dev` | Elaborer le plan de refactoring et le guide de migration | debt-inventory, impact-analysis | `refactoring-plan.md`, `migration-guide.md` |
| 3 | `qa` | Verifier la couverture de tests et valider les regressions | refactoring-plan, migration-guide, debt-inventory | `test-coverage.md`, `regression-report.md` |
| 4 | `devops` | Planifier le deploiement des changements | refactoring-plan, test-coverage, regression-report | `deployment-plan.md`, `rollback-strategy.md` |

**Livrables cles :** Inventaire de la dette, plan de refactoring, guide de migration, strategie de rollback.

---

### 10. Onboarding Project (`/onboard`)

**Description :** Onboarding d'un nouveau projet -- cadrage, analyse et mise en place de l'equipe.

**Repertoire de sortie :** `{cohesium_output}/onboarding_{timestamp}/`

| Etape | Agent | Action | Inputs | Outputs |
|-------|-------|--------|--------|---------|
| 1 | `pm` | Rediger la charte du projet et definir la vision produit | -- | `project-charter.md`, `product-vision.md` |
| 2 | `analyst` | Documenter les exigences et cartographier les parties prenantes | project-charter, product-vision | `requirements-doc.md`, `stakeholder-map.md` |
| 3 | `architect` | Definir l'architecture globale et recommander la stack | requirements-doc, product-vision, project-charter | `architecture-overview.md`, `tech-stack-recommendation.md` |
| 4 | `scrum` | Mettre en place l'equipe et definir les processus | project-charter, stakeholder-map, architecture-overview | `team-setup.md`, `process-guide.md` |

**Livrables cles :** Charte projet, vision produit, exigences, cartographie parties prenantes, architecture, guide des processus.

---

### 11. Release Cycle (`/release`)

**Description :** Cycle de mise en production -- validation, deploiement et communication.

**Repertoire de sortie :** `{cohesium_output}/release_{timestamp}/`

| Etape | Agent | Action | Inputs | Outputs |
|-------|-------|--------|--------|---------|
| 1 | `scrum` | Preparer la checklist de release et valider le scope | -- | `release-checklist.md`, `scope-validation.md` |
| 2 | `qa` | Validation finale et tests de non-regression | release-checklist, scope-validation | `qa-sign-off.md`, `regression-results.md` |
| 3 | `security` | Valider la conformite securitaire | qa-sign-off, regression-results, release-checklist | `security-clearance.md`, `final-audit.md` |
| 4 | `devops` | Preparer le runbook de deploiement et le plan de rollback | security-clearance, qa-sign-off, release-checklist | `deploy-runbook.md`, `rollback-plan.md` |
| 5 | `marketing` | Rediger l'annonce de la release et le changelog public | deploy-runbook, release-checklist, scope-validation | `announcement.md`, `changelog.md` |

**Livrables cles :** Checklist de release, sign-off QA, clearance securite, runbook de deploiement, annonce et changelog.

---

## Format du _manifest.yaml

Chaque workflow genere un fichier `_manifest.yaml` qui sert de **source de verite** pour l'etat du workflow :

```yaml
workflow: mvp-launch
description: "Lancement d'un MVP de A a Z"
started_at: "2025-01-15T10:30:00Z"
config:
  langue_equipe: "francais"
  langue_output: "francais"
  output_dir: "./cohesium-output/mvp_20250115_103000"
steps:
  - step: 1
    agent: pm
    action: "Definir la vision produit, les user stories et le scope MVP"
    status: completed          # completed | in_progress | pending | failed
    started_at: "2025-01-15T10:30:00Z"
    completed_at: "2025-01-15T10:45:00Z"
    inputs_consumed: []
    outputs:
      - path: "01-pm/product-brief.md"
        type: "document"
        description: "Brief produit avec vision et scope MVP"
        status: produced       # produced | missing
      - path: "01-pm/user-stories.md"
        type: "document"
        description: "User stories du MVP"
        status: produced
  - step: 2
    agent: architect
    action: "Concevoir l'architecture technique du MVP"
    status: in_progress
    started_at: "2025-01-15T10:46:00Z"
    inputs_consumed:
      - "01-pm/product-brief.md"
    outputs:
      - path: "02-architect/architecture-decision.md"
        type: "document"
        description: "ADR avec choix d'architecture"
        status: pending
```

### Champs du manifest

| Champ | Description |
|-------|-------------|
| `workflow` | Identifiant du workflow |
| `description` | Description du workflow |
| `started_at` | Timestamp ISO de demarrage |
| `config` | Langues et repertoire de sortie |
| `steps[].step` | Numero d'etape |
| `steps[].agent` | Agent responsable |
| `steps[].action` | Description de l'action |
| `steps[].status` | `completed`, `in_progress`, `pending` ou `failed` |
| `steps[].inputs_consumed` | Liste des fichiers lus par l'agent |
| `steps[].outputs[].path` | Chemin relatif du livrable |
| `steps[].outputs[].status` | `produced` ou `missing` |

---

## Structure du repertoire de sortie

Chaque workflow cree un repertoire structure :

```
cohesium-output/
  mvp_20250115_103000/
    _manifest.yaml                # Source de verite du workflow
    _summary.md                   # Synthese generee en fin de workflow
    01-pm/
      product-brief.md
      user-stories.md
    02-architect/
      architecture-decision.md
      tech-stack.md
    03-ux/
      wireframes.md
      user-flows.md
    04-db/
      schema.md
      migrations.md
    05-dev-backend/
      api-spec.md
      endpoints.md
    06-dev-frontend/
      components.md
      pages.md
    07-qa/
      test-plan.md
      test-report.md
    08-devops/
      deployment-guide.md
      ci-cd-config.md
```

**Convention de nommage des dossiers :** `{numero_etape_2chiffres}-{nom_agent}/`

---

## Format du _summary.md

En fin de workflow, Jarvis genere un fichier de synthese :

```markdown
# Resume du workflow : MVP Launch

## Date : 2025-01-15
## Duree : 2h30

## Objectif
Lancement d'un MVP de A a Z -- de la vision produit au deploiement.

## Etapes executees

| # | Agent | Statut | Livrables produits |
|---|-------|--------|-------------------|
| 1 | pm | Complete | product-brief.md, user-stories.md |
| 2 | architect | Complete | architecture-decision.md, tech-stack.md |
| ... | ... | ... | ... |

## Livrables produits
[liste complete avec chemins]

## Points d'attention
[observations, risques identifies, recommandations]

## Prochaines etapes recommandees
[suggestions d'actions suivantes]
```

---

## Fichiers source

Les workflows sont definis dans `src/workflows/{workflow-name}.yaml`. Chaque fichier YAML contient :
- `name` : identifiant du workflow
- `description` : description du workflow
- `trigger` : commande declencheuse
- `output_dir` : template du repertoire de sortie
- `steps` : liste ordonnee des etapes avec agent, action, inputs, outputs et dependances
