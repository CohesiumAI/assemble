---
name: qa-test-plan
description: Creation de plan de test complet avec strategies, cas de test, matrices de couverture et criteres d'acceptation
agent: qa
trigger: /test-plan
---

# Skill : QA Test Plan

## Objectif
Creer un plan de test complet et structure qui couvre l'ensemble des exigences fonctionnelles et non fonctionnelles d'une fonctionnalite ou d'une release. Definir les strategies de test, rediger les cas de test detailles, etablir les matrices de couverture et fixer les criteres d'acceptation pour garantir la qualite avant mise en production.

## Quand l'utiliser
- Avant le debut des tests d'une nouvelle fonctionnalite ou d'un epic
- Lors de la preparation d'une release majeure necessitant un plan de test structure
- Quand une regression critique impose de renforcer la couverture de test
- Pour un audit qualite ou une certification necessitant une documentation de test formelle
- Lors de la mise en place d'une strategie de test pour un nouveau projet

## Etapes
1. **Analyser les exigences** — Etudier les specifications fonctionnelles, les user stories, les criteres d'acceptation et les maquettes. Identifier les regles metier, les cas limites et les contraintes non fonctionnelles (performance, securite, accessibilite).
2. **Definir la strategie de test** — Choisir les types de tests a realiser (unitaire, integration, fonctionnel, E2E, performance, securite, accessibilite) et les approches (boite noire, boite blanche, exploratoire).
3. **Identifier les scenarios de test** — Lister les scenarios couvrant le happy path, les cas alternatifs, les cas d'erreur et les cas limites. Organiser les scenarios par module fonctionnel et par priorite.
4. **Rediger les cas de test** — Pour chaque scenario, ecrire les cas de test detailles avec preconditions, etapes d'execution, donnees de test, resultats attendus et postconditions. Utiliser un format standardise.
5. **Creer la matrice de couverture** — Etablir la matrice de tracabilite reliant chaque exigence aux cas de test correspondants. Identifier les zones non couvertes et ajouter les cas manquants.
6. **Configurer l'environnement de test** — Definir les prerequis d'environnement (donnees de test, configuration, services externes, mocks) et preparer les jeux de donnees necessaires.
7. **Definir les criteres d'acceptation** — Fixer les criteres de sortie : taux de reussite minimum, couverture requise, zero defaut bloquant/critique, performance dans les seuils definis.
8. **Planifier l'execution** — Estimer l'effort de test, definir le calendrier d'execution, assigner les testeurs et planifier les cycles de regression.

## Checklist de sortie
- [ ] Toutes les exigences fonctionnelles sont couvertes par au moins un cas de test
- [ ] Les cas limites et les scenarios d'erreur sont documentes et testes
- [ ] La matrice de tracabilite est complete (exigences vs. cas de test)
- [ ] Les donnees de test sont preparees et reproductibles
- [ ] Les criteres d'acceptation sont definis et mesurables
- [ ] Les tests de performance ont des seuils chiffres (temps de reponse, charge)
- [ ] Les tests d'accessibilite WCAG 2.1 AA sont inclus
- [ ] Le calendrier d'execution est realiste et valide par l'equipe

## Format de sortie
```
Plan de Test

Projet : [nom du projet / fonctionnalite]
Version : [version du plan de test]
Redacteur : [agent qa]
Date : [date]
Sprint / Release : [reference]

Perimetre de test :
  - Fonctionnalites couvertes : [liste]
  - Fonctionnalites hors perimetre : [liste]
  - Environnement cible : [staging / preprod / navigateurs / devices]

Strategie de test :
  | Type de test       | Approche         | Outil           | Automatise |
  |--------------------|------------------|-----------------|-----------|
  | Tests unitaires    | Boite blanche    | Jest / Vitest   | Oui       |
  | Tests integration  | API / Service    | Supertest       | Oui       |
  | Tests fonctionnels | Boite noire      | Cypress / PWTW  | Partiel   |
  | Tests E2E          | Parcours complet | Playwright      | Oui       |
  | Tests performance  | Charge / Stress  | k6 / Artillery  | Oui       |
  | Tests accessibilite| WCAG 2.1 AA      | axe / Lighthouse| Partiel   |

Cas de test :

[TC-001] Titre du cas de test
  - Priorite : Haute
  - Preconditions : [etat initial requis]
  - Etapes :
    1. [action utilisateur]
    2. [action utilisateur]
    3. [verification]
  - Donnees de test : [donnees necessaires]
  - Resultat attendu : [comportement attendu]
  - Postconditions : [etat final]

Matrice de couverture :
  | Exigence | TC-001 | TC-002 | TC-003 | TC-004 | Couverture |
  |----------|--------|--------|--------|--------|-----------|
  | REQ-01   |   X    |   X    |        |        | 100%      |
  | REQ-02   |        |        |   X    |   X    | 100%      |
  | REQ-03   |        |   X    |        |        | 50%       |

Criteres d'acceptation :
  - Taux de reussite : >= 95% des cas de test passes
  - Zero defaut bloquant ou critique ouvert
  - Couverture de code : >= 80%
  - Temps de reponse API : < 200ms (P95)
  - Score accessibilite Lighthouse : >= 90

Calendrier :
  - Preparation : [date debut] - [date fin]
  - Execution cycle 1 : [date debut] - [date fin]
  - Correction et retest : [date debut] - [date fin]
  - Regression finale : [date debut] - [date fin]
```
