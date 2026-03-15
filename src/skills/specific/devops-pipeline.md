---
name: devops-pipeline
description: Création de pipeline CI/CD complet avec build, tests, sécurité et déploiement
agent: devops
trigger: /pipeline
---

# Skill : DevOps Pipeline

## Objectif
Concevoir et implémenter un pipeline CI/CD complet qui automatise le build, les tests, l'analyse de sécurité, le packaging et le déploiement d'une application. Le pipeline garantit la qualité et la reproductibilité des livraisons.

## Quand l'utiliser
- Lors de la mise en place initiale du CI/CD pour un nouveau projet
- Pour ajouter des étapes de qualité (tests, linting, sécurité) à un pipeline existant
- Quand un nouveau type de déploiement est nécessaire (nouveau cloud, nouvelle région)
- Pour migrer un pipeline d'un outil à un autre (Jenkins vers GitHub Actions, etc.)

## Étapes
1. **Définir les étapes du pipeline** — Identifier les stages nécessaires (lint, test, build, scan, deploy) et leurs dépendances, en fonction du type de projet et de l'environnement cible.
2. **Configurer le déclenchement** — Définir les événements déclencheurs (push, PR, tag, schedule, manual) et les filtres de branches (main, develop, release/*).
3. **Implémenter le stage de build** — Configurer la compilation, la résolution des dépendances, la gestion du cache et la création des artefacts (Docker image, bundle, binaire).
4. **Configurer les tests automatisés** — Intégrer les tests unitaires, d'intégration et end-to-end avec collecte de la couverture de code et rapport de résultats.
5. **Ajouter les scans de sécurité** — Intégrer l'analyse statique (SAST), l'analyse des dépendances (SCA), le scan d'images Docker et la détection de secrets.
6. **Implémenter le déploiement** — Configurer le déploiement vers les environnements cibles (staging, production) avec stratégie de déploiement (blue-green, canary, rolling).
7. **Configurer les notifications** — Mettre en place les alertes en cas d'échec (Slack, email, webhook) et les rapports de déploiement.
8. **Documenter le pipeline** — Créer la documentation du pipeline avec les variables d'environnement, les secrets nécessaires et les procédures de rollback.

## Checklist de sortie
- [ ] Le pipeline s'exécute avec succès sur une branche de test
- [ ] Les tests passent et la couverture est collectée
- [ ] Les scans de sécurité sont intégrés et bloquants si critique
- [ ] Le cache des dépendances est configuré pour accélérer les builds
- [ ] Les secrets sont stockés de manière sécurisée (vault, secrets manager)
- [ ] Le déploiement staging est automatique, la production nécessite une approbation
- [ ] Les notifications d'échec et de succès fonctionnent
- [ ] La procédure de rollback est documentée et testée

## Format de sortie
```
📄 .github/workflows/<pipeline-name>.yml (ou .gitlab-ci.yml / Jenkinsfile)

Pipeline : <nom-du-pipeline>
Déclencheurs : push (main, develop), pull_request, tag (v*)

Stages :
  1. 🔍 Lint & Format     — ESLint, Prettier, commitlint     (~1 min)
  2. 🧪 Tests             — Unit + Integration + Coverage     (~5 min)
  3. 🔒 Security Scan     — SAST + SCA + Secret detection    (~3 min)
  4. 🏗️ Build             — Docker build + push registry      (~4 min)
  5. 🚀 Deploy Staging    — Auto-deploy vers staging          (~2 min)
  6. ✅ Smoke Tests       — Tests de santé post-déploiement   (~1 min)
  7. 🚀 Deploy Production — Déploiement avec approbation      (~2 min)

Variables d'environnement requises :
  - REGISTRY_URL, REGISTRY_USER, REGISTRY_PASSWORD
  - KUBE_CONFIG ou AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY
  - SONAR_TOKEN, SNYK_TOKEN

Temps total estimé : ~18 minutes
```
