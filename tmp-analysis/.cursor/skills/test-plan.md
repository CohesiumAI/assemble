---
name: qa-test-plan
description: Création de plan de test complet avec stratégies, cas de test, matrices de couverture et critères d'acceptation
agents: [qa, dev-backend, dev-frontend, dev-fullstack]
trigger: /test-plan
---

# Skill : QA Test Plan

## Objectif
Créer un plan de test complet et structuré qui couvre l'ensemble des exigences fonctionnelles et non fonctionnelles d'une fonctionnalité ou d'une release. Définir les stratégies de test, rédiger les cas de test détaillés, établir les matrices de couverture et fixer les critères d'acceptation pour garantir la qualité avant mise en production.

## Quand l'utiliser
- Avant le début des tests d'une nouvelle fonctionnalité ou d'un epic
- Lors de la préparation d'une release majeure nécessitant un plan de test structuré
- Quand une régression critique impose de renforcer la couverture de test
- Pour un audit qualité ou une certification nécessitant une documentation de test formelle
- Lors de la mise en place d'une stratégie de test pour un nouveau projet

## Étapes
1. **Analyser les exigences** — Étudier les spécifications fonctionnelles, les user stories, les critères d'acceptation et les maquettes. Identifier les règles métier, les cas limites et les contraintes non fonctionnelles (performance, sécurité, accessibilité).
2. **Définir la stratégie de test** — Choisir les types de tests à réaliser (unitaire, intégration, fonctionnel, E2E, performance, sécurité, accessibilité) et les approches (boîte noire, boîte blanche, exploratoire).
3. **Identifier les scénarios de test** — Lister les scénarios couvrant le happy path, les cas alternatifs, les cas d'erreur et les cas limites. Organiser les scénarios par module fonctionnel et par priorité.
4. **Rédiger les cas de test** — Pour chaque scénario, écrire les cas de test détaillés avec préconditions, étapes d'exécution, données de test, résultats attendus et postconditions. Utiliser un format standardisé.
5. **Créer la matrice de couverture** — Établir la matrice de traçabilité reliant chaque exigence aux cas de test correspondants. Identifier les zones non couvertes et ajouter les cas manquants.
6. **Configurer l'environnement de test** — Définir les prérequis d'environnement (données de test, configuration, services externes, mocks) et préparer les jeux de données nécessaires.
7. **Définir les critères d'acceptation** — Fixer les critères de sortie : taux de réussite minimum, couverture requise, zéro défaut bloquant/critique, performance dans les seuils définis.
8. **Planifier l'exécution** — Estimer l'effort de test, définir le calendrier d'exécution, assigner les testeurs et planifier les cycles de régression.

## Checklist de sortie
- [ ] Toutes les exigences fonctionnelles sont couvertes par au moins un cas de test
- [ ] Les cas limites et les scénarios d'erreur sont documentés et testés
- [ ] La matrice de traçabilité est complète (exigences vs. cas de test)
- [ ] Les données de test sont préparées et reproductibles
- [ ] Les critères d'acceptation sont définis et mesurables
- [ ] Les tests de performance ont des seuils chiffrés (temps de réponse, charge)
- [ ] Les tests d'accessibilité WCAG 2.1 AA sont inclus
- [ ] Le calendrier d'exécution est réaliste et validé par l'équipe

## Format de sortie
```
Plan de Test

Projet : [nom du projet / fonctionnalité]
Version : [version du plan de test]
Rédacteur : [agent qa]
Date : [date]
Sprint / Release : [référence]

Périmètre de test :
  - Fonctionnalités couvertes : [liste]
  - Fonctionnalités hors périmètre : [liste]
  - Environnement cible : [staging / préprod / navigateurs / devices]

Stratégie de test :
  | Type de test       | Approche         | Outil           | Automatisé |
  |--------------------|------------------|-----------------|-----------|
  | Tests unitaires    | Boîte blanche    | Jest / Vitest   | Oui       |
  | Tests intégration  | API / Service    | Supertest       | Oui       |
  | Tests fonctionnels | Boîte noire      | Cypress / PWTW  | Partiel   |
  | Tests E2E          | Parcours complet | Playwright      | Oui       |
  | Tests performance  | Charge / Stress  | k6 / Artillery  | Oui       |
  | Tests accessibilité| WCAG 2.1 AA      | axe / Lighthouse| Partiel   |

Cas de test :

[TC-001] Titre du cas de test
  - Priorité : Haute
  - Préconditions : [état initial requis]
  - Étapes :
    1. [action utilisateur]
    2. [action utilisateur]
    3. [vérification]
  - Données de test : [données nécessaires]
  - Résultat attendu : [comportement attendu]
  - Postconditions : [état final]

Matrice de couverture :
  | Exigence | TC-001 | TC-002 | TC-003 | TC-004 | Couverture |
  |----------|--------|--------|--------|--------|-----------|
  | REQ-01   |   X    |   X    |        |        | 100%      |
  | REQ-02   |        |        |   X    |   X    | 100%      |
  | REQ-03   |        |   X    |        |        | 50%       |

Critères d'acceptation :
  - Taux de réussite : >= 95% des cas de test passés
  - Zéro défaut bloquant ou critique ouvert
  - Couverture de code : >= 80%
  - Temps de réponse API : < 200ms (P95)
  - Score accessibilité Lighthouse : >= 90

Calendrier :
  - Préparation : [date début] - [date fin]
  - Exécution cycle 1 : [date début] - [date fin]
  - Correction et retest : [date début] - [date fin]
  - Régression finale : [date début] - [date fin]
```

## Langue de travail

Tu communiques et rédiges tous tes échanges en **français**.
Les fichiers et livrables que tu produis sont rédigés en **english**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.

## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : `.\deliverables`
Respecte la structure de dossiers définie par le workflow en cours.
