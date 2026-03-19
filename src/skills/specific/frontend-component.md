---
name: frontend-component
description: Création de composant React/Next.js intégré au design system avec accessibilité et tests
agents: [dev-frontend, dev-fullstack]
trigger: /component
---

# Skill : Frontend Component

## Objectif
Créer un composant React/Next.js complet, réutilisable et accessible, intégré au design system du projet. Le composant inclut les variantes, les états, la documentation Storybook et les tests.

## Quand l'utiliser
- Lors de la création d'un nouveau composant UI pour l'application
- Quand un composant existant doit être refactorisé en composant réutilisable
- Pour ajouter un élément d'interface respectant le design system
- Lors de l'implémentation d'une maquette Figma en code

## Étapes
1. **Analyser les spécifications visuelles** — Étudier la maquette, identifier les variantes (taille, couleur, état), les props requises et les comportements interactifs.
2. **Définir l'interface TypeScript** — Créer les types pour les props du composant avec les valeurs par défaut et les props optionnelles.
3. **Implémenter le composant** — Coder le composant avec les bonnes pratiques React (composition, forwarding refs, slots) en utilisant les tokens du design system.
4. **Appliquer les styles** — Utiliser le système de styling du projet (Tailwind CSS, CSS Modules, styled-components) avec les tokens de design (couleurs, espacements, typographie).
5. **Assurer l'accessibilité** — Ajouter les attributs ARIA, gérer la navigation clavier, vérifier les contrastes et tester avec un lecteur d'écran.
6. **Créer les stories Storybook** — Documenter toutes les variantes, états et cas d'utilisation dans Storybook avec les contrôles interactifs.
7. **Écrire les tests** — Rédiger les tests unitaires (React Testing Library) et les tests visuels (snapshot ou visual regression).

## Checklist de sortie
- [ ] Le composant accepte toutes les variantes définies dans le design system
- [ ] Les props TypeScript sont correctement typées avec JSDoc
- [ ] L'accessibilité est conforme WCAG 2.1 AA (rôles ARIA, clavier, contraste)
- [ ] Les styles utilisent exclusivement les tokens du design system
- [ ] Les stories Storybook couvrent toutes les variantes et états
- [ ] Les tests unitaires couvrent les interactions et le rendu conditionnel
- [ ] Le composant est responsive et fonctionne sur mobile
- [ ] Le composant est exporté dans le barrel file (index.ts)

## Format de sortie
```
📁 src/components/<ComponentName>/
├── <ComponentName>.tsx          — Composant principal
├── <ComponentName>.types.ts     — Interfaces et types des props
├── <ComponentName>.styles.ts    — Styles (ou .module.css)
├── <ComponentName>.test.tsx     — Tests unitaires
├── <ComponentName>.stories.tsx  — Stories Storybook
└── index.ts                     — Export barrel

Props principales :
  - variant: 'primary' | 'secondary' | 'outline'
  - size: 'sm' | 'md' | 'lg'
  - disabled: boolean
  - className: string (override styles)
  - children: ReactNode

Exemple d'utilisation :
  <ComponentName variant="primary" size="md">
    Contenu
  </ComponentName>
```
