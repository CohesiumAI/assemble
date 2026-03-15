---
name: testing
description: Stratégie et exécution de tests — tests unitaires, d'intégration, end-to-end, avec génération de cas de test et analyse de couverture
agents: [dev-backend, dev-frontend, dev-fullstack, dev-mobile, qa]
trigger: /test
---

# Skill : Testing

## Objectif

Définir et exécuter une stratégie de test adaptée au contexte : identifier les cas de test pertinents, rédiger des tests unitaires, d'intégration et/ou end-to-end, analyser la couverture et produire un rapport de résultats exploitable.

## Quand l'utiliser

- Lors de l'implémentation d'une nouvelle fonctionnalité nécessitant des tests
- Pour augmenter la couverture de tests d'un module existant
- Avant un refactoring pour sécuriser le comportement actuel
- Lors d'un bug report pour créer un test de régression
- Pour auditer la qualité et la pertinence de la suite de tests existante

## Étapes

1. **Analyser le périmètre à tester** — Identifier le module, la fonction ou le flux concerné. Comprendre le comportement attendu, les entrées/sorties, les dépendances et les effets de bord.
2. **Choisir le niveau de test** — Déterminer le type de test approprié selon la pyramide de tests : unitaire (logique isolée), intégration (interactions entre composants), end-to-end (flux utilisateur complet). Justifier le choix.
3. **Identifier les cas de test** — Lister les scénarios : cas nominal (happy path), cas limites (edge cases), cas d'erreur (entrées invalides, timeouts, permissions refusées), cas de concurrence si applicable.
4. **Préparer l'environnement de test** — Identifier les mocks, stubs et fixtures nécessaires. Configurer les données de test. S'assurer que les tests sont isolés et reproductibles (pas de dépendance à l'ordre d'exécution).
5. **Rédiger les tests** — Suivre le pattern AAA (Arrange, Act, Assert). Un test = un comportement vérifié. Nommer les tests de manière descriptive (`should_return_404_when_user_not_found`). Utiliser les matchers adaptés.
6. **Exécuter et analyser** — Lancer la suite de tests, vérifier que tous passent. Analyser le rapport de couverture (lignes, branches, fonctions). Identifier les zones non couvertes critiques.
7. **Documenter les résultats** — Produire un rapport synthétique avec le taux de couverture, les cas testés, les éventuels tests ignorés (avec justification) et les recommandations.

## Checklist de sortie

- [ ] Le périmètre de test est clairement défini
- [ ] Le niveau de test (unitaire / intégration / e2e) est justifié
- [ ] Les cas nominaux, limites et d'erreur sont couverts
- [ ] Les tests sont isolés, reproductibles et indépendants
- [ ] Le pattern AAA est respecté (Arrange, Act, Assert)
- [ ] Les noms de tests décrivent le comportement vérifié
- [ ] La couverture de code atteint le seuil cible du projet
- [ ] Le rapport de résultats est produit et exploitable

## Format de sortie

```markdown
## Rapport de Tests

**Module :** [nom du module / composant]
**Type :** [Unitaire | Intégration | E2E | Mixte]
**Framework :** [Jest | Vitest | Pytest | Cypress | Playwright | autre]
**Date :** [date]

### Cas de test identifiés

| # | Scénario | Type | Priorité |
|---|----------|------|----------|
| T-01 | [Description du cas nominal] | Nominal | Haute |
| T-02 | [Description du cas limite] | Edge case | Haute |
| T-03 | [Description du cas d'erreur] | Erreur | Moyenne |
| T-04 | [Description] | [Type] | [Priorité] |

### Résultats d'exécution

| Métrique | Valeur |
|----------|--------|
| Tests total | XX |
| Passés ✅ | XX |
| Échoués ❌ | XX |
| Ignorés ⏭️ | XX |
| Couverture lignes | XX% |
| Couverture branches | XX% |

### Tests rédigés

```typescript
// Exemple de test généré
describe('NomDuModule', () => {
  it('should [comportement attendu] when [condition]', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Recommandations

- [Zone non couverte critique à adresser]
- [Test flaky à stabiliser]
- [Refactoring suggéré pour améliorer la testabilité]
```
