---
name: mobile-screen
description: Mobile screen creation for React Native/Flutter with navigation, state, and animations
agents: [dev-mobile, dev-fullstack]
trigger: /screen
---

# Skill : Mobile Screen

## Objective
Create a complete mobile screen for a React Native or Flutter application, including layout, navigation, state management, animations, and adaptation to different screen sizes and platforms (iOS/Android).

## When to use
- When adding a new screen to the mobile application
- To implement a multi-screen user flow (onboarding, checkout, etc.)
- When a feature requires a dedicated mobile interface
- When porting a web screen to mobile

## Steps
1. **Analyze the user flow** — Understand the user journey, previous/next screens, required data, and available actions.
2. **Configure navigation** — Integrate the screen into the navigation system (React Navigation / GoRouter) with route parameters and transitions.
3. **Structure the layout** — Create the layout with ScrollView/FlatList, manage SafeAreaView, keyboard, and different screen sizes.
4. **Implement state management** — Connect the screen to state management (Redux, Zustand, Riverpod) and handle loading, error, and empty states.
5. **Integrate API calls** — Connect backend services with cache management, retry, and offline state handling.
6. **Add animations** — Implement enter/exit animations, state transitions, and micro-interactions (Reanimated / AnimationController).
7. **Adapt to platforms** — Adjust iOS-specific behaviors (haptic feedback, swipe back) and Android (back button, material design).
8. **Test on devices** — Verify rendering on different screen sizes, with and without notch, in portrait and landscape mode.

## Exit Checklist
- [ ] The screen displays correctly on iOS and Android
- [ ] Navigation (push, pop, deep link) works without errors
- [ ] Loading, error, and empty states are handled visually
- [ ] The keyboard does not hide input fields
- [ ] The screen adapts to different sizes (iPhone SE to iPad / small Android to tablet)
- [ ] Animations are smooth (60 fps) and respect reduced motion preferences
- [ ] Unit and integration tests are in place
- [ ] The screen follows platform guidelines (HIG / Material Design)

## Output Format
```
📁 src/screens/<ScreenName>/
├── <ScreenName>Screen.tsx       — Main screen component
├── <ScreenName>.viewmodel.ts    — Logic and state management
├── <ScreenName>.styles.ts       — Styles (StyleSheet)
├── <ScreenName>.types.ts        — Types et interfaces
├── <ScreenName>.test.tsx        — Tests unitaires
├── components/                  — Screen-specific sub-components
│   ├── <Widget1>.tsx
│   └── <Widget2>.tsx
└── hooks/                       — Screen-specific hooks
    └── use<ScreenName>.ts

Navigation :
  Stack.Screen name="<ScreenName>"
  Params: { id: string, mode: 'create' | 'edit' }
  Transitions: slide_from_right (iOS) / fade (Android)

Managed states :
  - loading: Skeleton/Shimmer placeholder
  - error: Error message with retry button
  - empty: Illustration + message + CTA
  - success: Main content
```
