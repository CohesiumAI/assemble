---
name: sprint-planning
description: Planification et facilitation de sprint agile avec estimation, priorisation et definition des objectifs
agent: scrum
trigger: /sprint-plan
---

# Skill : Sprint Planning

## Objectif
Planifier et faciliter une session de sprint planning structuree qui aboutit a un sprint backlog clair, des objectifs de sprint definis et un engagement realiste de l'equipe. Assurer que les user stories sont correctement estimees, priorisees et comprises par tous les membres de l'equipe.

## Quand l'utiliser
- Au debut de chaque nouveau sprint (ceremonie de sprint planning)
- Lors de la replanification d'un sprint suite a un changement de priorites majeur
- Pour preparer un PI Planning (SAFe) ou une planification a plus grande echelle
- Quand l'equipe demarre un nouveau projet et doit structurer son premier sprint
- Lors d'un refinement avance necessitant une decomposition detaillee des stories

## Etapes
1. **Preparer le backlog produit** — Verifier que le backlog est raffine : les stories du haut du backlog ont des criteres d'acceptation clairs, des maquettes associees et les dependances identifiees. Retirer les stories obsoletes.
2. **Definir l'objectif du sprint** — En collaboration avec le Product Owner, formuler un objectif de sprint clair et mesurable qui donne une direction et un sens au travail de l'equipe.
3. **Evaluer la capacite de l'equipe** — Calculer la velocite disponible en tenant compte des conges, des jours feries, des ceremonies, du support et de la dette technique planifiee. Ajuster selon l'historique des sprints precedents.
4. **Estimer les stories** — Faciliter la session d'estimation (Planning Poker, T-shirt sizing, dot voting) pour attribuer des story points a chaque user story. Decomposer les stories trop volumineuses (> 8 points).
5. **Prioriser et selectionner** — Avec le Product Owner, selectionner les stories qui entrent dans le sprint en respectant la capacite. S'assurer que les dependances sont resolues et que l'objectif de sprint est atteignable.
6. **Decomposer en taches techniques** — Pour chaque story selectionnee, identifier les taches techniques necessaires (front, back, tests, infra), estimer les heures et assigner les responsables.
7. **Identifier les risques et dependances** — Lister les risques potentiels du sprint (dependance externe, dette technique, complexite inconnue) et definir les actions de mitigation pour chaque risque.
8. **Formaliser le sprint backlog** — Documenter le sprint backlog final avec l'objectif, les stories, les estimations, les assignations et les criteres de Definition of Done. Obtenir l'engagement de l'equipe.

## Checklist de sortie
- [ ] L'objectif du sprint est formule, clair et accepte par l'equipe
- [ ] La capacite de l'equipe est calculee et documentee (en story points ou heures)
- [ ] Toutes les stories selectionnees ont des criteres d'acceptation definis
- [ ] Les estimations sont completes pour chaque story (story points attribues)
- [ ] Les stories volumineuses sont decomposees (aucune story > 8 points)
- [ ] Les dependances externes sont identifiees et les actions de deblocage planifiees
- [ ] Les taches techniques sont creees pour chaque story avec les responsables
- [ ] L'equipe a confirme son engagement sur le sprint backlog

## Format de sortie
```
Sprint Planning - Sprint [numero]

Objectif du sprint : [description claire et mesurable de l'objectif]
Periode : [date de debut] - [date de fin] ([X] jours ouvrables)
Equipe : [X] developpeurs, capacite [Y] story points

Capacite de l'equipe :
  - Velocite moyenne (3 derniers sprints) : [X] SP
  - Capacite ajustee (conges, support) : [Y] SP
  - Engagement du sprint : [Z] SP

Sprint Backlog :

| ID       | Story                              | Points | Priorite | Assignee     |
|----------|------------------------------------|--------|----------|-------------|
| US-101   | [titre de la story]                | 5      | Haute    | [nom]       |
| US-102   | [titre de la story]                | 3      | Haute    | [nom]       |
| US-103   | [titre de la story]                | 8      | Moyenne  | [nom]       |
| TECH-042 | [dette technique]                  | 3      | Moyenne  | [nom]       |
| BUG-015  | [correction de bug]                | 2      | Haute    | [nom]       |
| Total    |                                    | 21 SP  |          |             |

Risques identifies :
  - [R1] [description du risque] — Mitigation : [action]
  - [R2] [description du risque] — Mitigation : [action]

Dependances externes :
  - [D1] [equipe / service] — [description] — Statut : [resolu / en attente]

Definition of Done :
  - Code revue par un pair
  - Tests unitaires et d'integration passes
  - Documentation mise a jour
  - Deploye en staging et valide par le PO
```
