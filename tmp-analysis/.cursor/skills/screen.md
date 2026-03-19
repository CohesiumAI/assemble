---
name: mobile-screen
description: Création d'écran mobile React Native/Flutter avec navigation, état et animations
agents: [dev-mobile, dev-fullstack]
trigger: /screen
---

# Skill : Mobile Screen

## Objectif
Créer un écran mobile complet pour une application React Native ou Flutter, incluant la mise en page, la navigation, la gestion d'état, les animations et l'adaptation aux différentes tailles d'écran et plateformes (iOS/Android).

## Quand l'utiliser
- Lors de l'ajout d'un nouvel écran dans l'application mobile
- Pour implémenter un flux utilisateur multi-écrans (onboarding, checkout, etc.)
- Quand une fonctionnalité nécessite une interface mobile dédiée
- Lors du portage d'un écran web vers mobile

## Étapes
1. **Analyser le flux utilisateur** — Comprendre le parcours utilisateur, les écrans précédents/suivants, les données nécessaires et les actions disponibles.
2. **Configurer la navigation** — Intégrer l'écran dans le système de navigation (React Navigation / GoRouter) avec les paramètres de route et les transitions.
3. **Structurer le layout** — Créer la mise en page avec ScrollView/FlatList, gérer le SafeAreaView, le clavier et les différentes tailles d'écran.
4. **Implémenter la gestion d'état** — Connecter l'écran au state management (Redux, Zustand, Riverpod) et gérer les états de chargement, erreur et vide.
5. **Intégrer les appels API** — Connecter les services backend avec gestion du cache, du retry et des états offline.
6. **Ajouter les animations** — Implémenter les animations d'entrée/sortie, les transitions entre états et les micro-interactions (Reanimated / AnimationController).
7. **Adapter aux plateformes** — Ajuster les comportements spécifiques iOS (haptic feedback, swipe back) et Android (back button, material design).
8. **Tester sur les appareils** — Vérifier le rendu sur différentes tailles d'écran, avec et sans encoche (notch), en mode portrait et paysage.

## Checklist de sortie
- [ ] L'écran s'affiche correctement sur iOS et Android
- [ ] La navigation (push, pop, deep link) fonctionne sans erreur
- [ ] Les états de chargement, erreur et vide sont gérés visuellement
- [ ] Le clavier ne masque pas les champs de saisie
- [ ] L'écran s'adapte aux différentes tailles (iPhone SE à iPad / petit Android à tablette)
- [ ] Les animations sont fluides (60 fps) et respectent les préférences de réduction de mouvement
- [ ] Les tests unitaires et d'intégration sont en place
- [ ] L'écran respecte les guidelines de la plateforme (HIG / Material Design)

## Format de sortie
```
📁 src/screens/<ScreenName>/
├── <ScreenName>Screen.tsx       — Composant écran principal
├── <ScreenName>.viewmodel.ts    — Logique et gestion d'état
├── <ScreenName>.styles.ts       — Styles (StyleSheet)
├── <ScreenName>.types.ts        — Types et interfaces
├── <ScreenName>.test.tsx        — Tests unitaires
├── components/                  — Sous-composants spécifiques
│   ├── <Widget1>.tsx
│   └── <Widget2>.tsx
└── hooks/                       — Hooks spécifiques à l'écran
    └── use<ScreenName>.ts

Navigation :
  Stack.Screen name="<ScreenName>"
  Params: { id: string, mode: 'create' | 'edit' }
  Transitions: slide_from_right (iOS) / fade (Android)

États gérés :
  - loading: Skeleton/Shimmer placeholder
  - error: Message d'erreur avec bouton retry
  - empty: Illustration + message + CTA
  - success: Contenu principal
```

## Langue de travail

Tu communiques et rédiges tous tes échanges en **français**.
Les fichiers et livrables que tu produis sont rédigés en **english**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.

## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : `.\deliverables`
Respecte la structure de dossiers définie par le workflow en cours.
