---
name: sprint-planning
description: Planification et facilitation de sprint agile avec estimation, priorisation et définition des objectifs
agents: [scrum, pm]
trigger: /sprint-plan
---

# Skill : Sprint Planning

## Objectif
Planifier et faciliter une session de sprint planning structurée qui aboutit à un sprint backlog clair, des objectifs de sprint définis et un engagement réaliste de l'équipe. Assurer que les user stories sont correctement estimées, priorisées et comprises par tous les membres de l'équipe.

## Quand l'utiliser
- Au début de chaque nouveau sprint (cérémonie de sprint planning)
- Lors de la replanification d'un sprint suite à un changement de priorités majeur
- Pour préparer un PI Planning (SAFe) ou une planification à plus grande échelle
- Quand l'équipe démarre un nouveau projet et doit structurer son premier sprint
- Lors d'un refinement avancé nécessitant une décomposition détaillée des stories

## Étapes
1. **Préparer le backlog produit** — Vérifier que le backlog est raffiné : les stories du haut du backlog ont des critères d'acceptation clairs, des maquettes associées et les dépendances identifiées. Retirer les stories obsolètes.
2. **Définir l'objectif du sprint** — En collaboration avec le Product Owner, formuler un objectif de sprint clair et mesurable qui donne une direction et un sens au travail de l'équipe.
3. **Évaluer la capacité de l'équipe** — Calculer la vélocité disponible en tenant compte des congés, des jours fériés, des cérémonies, du support et de la dette technique planifiée. Ajuster selon l'historique des sprints précédents.
4. **Estimer les stories** — Faciliter la session d'estimation (Planning Poker, T-shirt sizing, dot voting) pour attribuer des story points à chaque user story. Décomposer les stories trop volumineuses (> 8 points).
5. **Prioriser et sélectionner** — Avec le Product Owner, sélectionner les stories qui entrent dans le sprint en respectant la capacité. S'assurer que les dépendances sont résolues et que l'objectif de sprint est atteignable.
6. **Décomposer en tâches techniques** — Pour chaque story sélectionnée, identifier les tâches techniques nécessaires (front, back, tests, infra), estimer les heures et assigner les responsables.
7. **Identifier les risques et dépendances** — Lister les risques potentiels du sprint (dépendance externe, dette technique, complexité inconnue) et définir les actions de mitigation pour chaque risque.
8. **Formaliser le sprint backlog** — Documenter le sprint backlog final avec l'objectif, les stories, les estimations, les assignations et les critères de Definition of Done. Obtenir l'engagement de l'équipe.

## Checklist de sortie
- [ ] L'objectif du sprint est formulé, clair et accepté par l'équipe
- [ ] La capacité de l'équipe est calculée et documentée (en story points ou heures)
- [ ] Toutes les stories sélectionnées ont des critères d'acceptation définis
- [ ] Les estimations sont complètes pour chaque story (story points attribués)
- [ ] Les stories volumineuses sont décomposées (aucune story > 8 points)
- [ ] Les dépendances externes sont identifiées et les actions de déblocage planifiées
- [ ] Les tâches techniques sont créées pour chaque story avec les responsables
- [ ] L'équipe a confirmé son engagement sur le sprint backlog

## Format de sortie
```
Sprint Planning - Sprint [numéro]

Objectif du sprint : [description claire et mesurable de l'objectif]
Période : [date de début] - [date de fin] ([X] jours ouvrables)
Équipe : [X] développeurs, capacité [Y] story points

Capacité de l'équipe :
  - Vélocité moyenne (3 derniers sprints) : [X] SP
  - Capacité ajustée (congés, support) : [Y] SP
  - Engagement du sprint : [Z] SP

Sprint Backlog :

| ID       | Story                              | Points | Priorité | Assigné     |
|----------|------------------------------------|--------|----------|-------------|
| US-101   | [titre de la story]                | 5      | Haute    | [nom]       |
| US-102   | [titre de la story]                | 3      | Haute    | [nom]       |
| US-103   | [titre de la story]                | 8      | Moyenne  | [nom]       |
| TECH-042 | [dette technique]                  | 3      | Moyenne  | [nom]       |
| BUG-015  | [correction de bug]                | 2      | Haute    | [nom]       |
| Total    |                                    | 21 SP  |          |             |

Risques identifiés :
  - [R1] [description du risque] — Mitigation : [action]
  - [R2] [description du risque] — Mitigation : [action]

Dépendances externes :
  - [D1] [équipe / service] — [description] — Statut : [résolu / en attente]

Definition of Done :
  - Code revu par un pair
  - Tests unitaires et d'intégration passés
  - Documentation mise à jour
  - Déployé en staging et validé par le PO
```
