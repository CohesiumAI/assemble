---
name: code-review
description: Revue de code structurée avec checklist qualité — analyse statique, bonnes pratiques, sécurité, performance et maintenabilité
agents: [dev-backend, dev-frontend, dev-fullstack, qa, security]
trigger: /review
---

# Skill : Revue de Code

## Objectif

Réaliser une revue de code systématique et structurée qui garantit la qualité, la sécurité, la lisibilité et la maintenabilité du code soumis. Cette skill produit un rapport actionnable avec des suggestions concrètes classées par priorité.

## Quand l'utiliser

- Avant chaque merge request / pull request
- Lors d'un audit qualité du code existant
- Quand un développeur demande un regard extérieur sur son implémentation
- Après un refactoring majeur pour valider la cohérence
- Lors de l'onboarding d'un nouveau contributeur pour vérifier l'alignement avec les standards

## Étapes

1. **Identifier le périmètre** — Lister les fichiers modifiés, comprendre le contexte fonctionnel du changement (ticket, user story, bug fix). Demander le contexte si absent.
2. **Vérifier la structure et l'architecture** — S'assurer que le code respecte l'architecture existante (layers, patterns, séparation des responsabilités). Vérifier qu'aucune abstraction n'est cassée.
3. **Analyser la lisibilité et les conventions** — Nommage des variables/fonctions, formatage, cohérence avec le style du projet. Vérifier les imports inutiles, le code mort, les TODO orphelins.
4. **Évaluer la logique métier** — Valider la correction algorithmique, les cas limites (edge cases), la gestion des erreurs, les valeurs nulles/undefined, les conditions de course.
5. **Vérifier la sécurité** — Injections (SQL, XSS, SSRF), validation des entrées, gestion des secrets, permissions et autorisations, dépendances vulnérables.
6. **Évaluer la performance** — Complexité algorithmique, requêtes N+1, fuites mémoire potentielles, rendu inutile (frontend), indexation manquante (backend).
7. **Vérifier la couverture de tests** — Présence de tests unitaires et/ou d'intégration pour le nouveau code, pertinence des assertions, cas limites couverts.
8. **Rédiger le rapport** — Synthétiser les constats en les classant par sévérité (bloquant, majeur, mineur, suggestion) avec des recommandations concrètes.

## Checklist de sortie

- [ ] Tous les fichiers modifiés ont été examinés
- [ ] L'architecture et les patterns du projet sont respectés
- [ ] Le nommage et les conventions de code sont cohérents
- [ ] Les cas limites et la gestion d'erreurs sont couverts
- [ ] Aucune vulnérabilité de sécurité détectée (ou signalée)
- [ ] Aucun problème de performance identifié (ou signalé)
- [ ] Les tests couvrent le nouveau code de manière pertinente
- [ ] Le rapport final est classé par sévérité avec des actions concrètes

## Format de sortie

```markdown
## Rapport de Revue de Code

**Périmètre :** [description du changement]
**Fichiers analysés :** [nombre] fichiers
**Date :** [date]
**Revieweur :** [agent]

### Résumé

| Sévérité    | Nombre |
|-------------|--------|
| 🔴 Bloquant | X      |
| 🟠 Majeur   | X      |
| 🟡 Mineur   | X      |
| 🔵 Suggestion | X    |

### Constats détaillés

#### 🔴 Bloquants

**[B-01] Titre du constat**
- **Fichier :** `path/to/file.ts:42`
- **Problème :** Description précise du problème
- **Impact :** Conséquence si non corrigé
- **Recommandation :** Solution proposée avec exemple de code si pertinent

#### 🟠 Majeurs

**[M-01] Titre du constat**
- **Fichier :** `path/to/file.ts:78`
- **Problème :** Description précise
- **Recommandation :** Solution proposée

#### 🟡 Mineurs

**[m-01] Titre du constat**
- **Fichier :** `path/to/file.ts:15`
- **Observation :** Description
- **Suggestion :** Amélioration proposée

#### 🔵 Suggestions

- [S-01] Description de la suggestion d'amélioration
- [S-02] Description de la suggestion d'amélioration

### Verdict

**Statut :** ✅ Approuvé | ⚠️ Approuvé avec réserves | ❌ Changements requis

**Commentaire :** [synthèse en 2-3 phrases]
```
