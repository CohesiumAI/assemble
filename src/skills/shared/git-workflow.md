---
name: git-workflow
description: Gestion du workflow Git — stratégie de branching, conventions de commits, création de PRs, résolution de conflits et processus de merge
agents: [dev-backend, dev-frontend, dev-fullstack, dev-mobile, devops, scrum]
trigger: /git
---

# Skill : Workflow Git

## Objectif

Appliquer un workflow Git rigoureux et cohérent pour garantir un historique propre, une collaboration fluide et des déploiements fiables. Cette skill couvre le cycle complet : création de branche, commits conventionnels, pull requests, revue et merge.

## Quand l'utiliser

- Au démarrage d'une nouvelle fonctionnalité, correction ou tâche technique
- Lors de la création d'une pull request
- Pour résoudre des conflits de merge
- Pour définir ou rappeler la stratégie de branching d'un projet
- Lors d'un release ou hotfix nécessitant une gestion de branches spécifique

## Étapes

1. **Identifier le type de changement** — Classifier le travail : `feature`, `fix`, `hotfix`, `refactor`, `docs`, `chore`, `release`. Cela détermine le préfixe de branche et le type de commit.
2. **Créer la branche** — Depuis la branche de base appropriée (`main`, `develop`, `release/*`), créer une branche nommée selon la convention : `type/ID-description-courte` (ex: `feature/PROJ-123-user-authentication`).
3. **Rédiger les commits** — Suivre la convention Conventional Commits : `type(scope): description`. Chaque commit doit être atomique (un seul changement logique). Le message doit expliquer le **pourquoi**, pas le **quoi**.
4. **Préparer la pull request** — Rédiger un titre clair et un corps structuré : contexte, changements effectués, impacts, instructions de test. Lier le ticket/issue correspondant.
5. **Gérer les conflits** — En cas de conflit, rebaser sur la branche cible plutôt que merger. Résoudre fichier par fichier en comprenant les deux versions. Tester après résolution.
6. **Faciliter la revue** — Répondre aux commentaires de revue, appliquer les corrections demandées dans des commits séparés (facilite le re-review). Ne pas force-push pendant une revue active.
7. **Merger et nettoyer** — Après approbation, squash-merge si l'historique de la branche est bruyant, merge classique si les commits sont propres. Supprimer la branche distante après merge. Vérifier que le CI passe.

## Checklist de sortie

- [ ] La branche suit la convention de nommage du projet
- [ ] Les commits respectent le format Conventional Commits
- [ ] Chaque commit est atomique et le message explique le pourquoi
- [ ] La PR a un titre clair, une description structurée et un lien vers le ticket
- [ ] Les conflits éventuels sont résolus proprement (rebase)
- [ ] Le CI/CD passe sur la branche avant merge
- [ ] La branche distante est supprimée après merge
- [ ] L'historique Git reste lisible et navigable

## Format de sortie

```markdown
## Action Git

**Type :** [feature | fix | hotfix | refactor | docs | chore | release]
**Ticket :** [ID du ticket ou N/A]

### Branche

```bash
git checkout -b type/ID-description-courte origin/develop
```

### Commits proposés

```
type(scope): description concise du changement

Corps optionnel expliquant le contexte et le pourquoi.

Refs: #ID-ticket
```

### Template de Pull Request

**Titre :** type(scope): description courte

**Description :**

#### Contexte
Pourquoi ce changement est nécessaire.

#### Changements
- Liste des modifications principales
- Avec impact sur les composants existants

#### Comment tester
1. Étape 1 pour reproduire/vérifier
2. Étape 2

#### Checklist
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Pas de breaking change (ou documenté)
- [ ] CI passe

### Stratégie de merge

**Recommandation :** [squash-merge | merge commit | rebase-merge]
**Raison :** [justification]
```
