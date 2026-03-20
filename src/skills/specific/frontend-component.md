---
name: frontend-component
description: React/Next.js component creation integrated with design system, accessibility, and tests
agents: [dev-frontend, dev-fullstack]
trigger: /component
---

# Skill : Frontend Component

## Objective
Create a complete, reusable, and accessible React/Next.js component integrated with the project's design system. The component includes variants, states, Storybook documentation, and tests.

## When to use
- When creating a new UI component for the application
- When an existing component needs to be refactored into a reusable component
- To add an interface element following the design system
- When implementing a Figma mockup in code

## Steps
1. **Analyze visual specifications** — Study the mockup, identify variants (size, color, state), required props, and interactive behaviors.
2. **Define the TypeScript interface** — Create types for the component props with default values and optional props.
3. **Implement the component** — Code the component with React best practices (composition, forwarding refs, slots) using design system tokens.
4. **Apply styles** — Use the project's styling system (Tailwind CSS, CSS Modules, styled-components) with design tokens (colors, spacing, typography).
5. **Ensure accessibility** — Add ARIA attributes, handle keyboard navigation, verify contrasts, and test with a screen reader.
6. **Create Storybook stories** — Document all variants, states, and use cases in Storybook with interactive controls.
7. **Write tests** — Write unit tests (React Testing Library) and visual tests (snapshot or visual regression).

## Exit Checklist
- [ ] The component accepts all variants defined in the design system
- [ ] TypeScript props are correctly typed with JSDoc
- [ ] Accessibility is WCAG 2.1 AA compliant (ARIA roles, keyboard, contrast)
- [ ] Styles exclusively use design system tokens
- [ ] Storybook stories cover all variants and states
- [ ] Unit tests cover interactions and conditional rendering
- [ ] The component is responsive and works on mobile
- [ ] The component is exported in the barrel file (index.ts)

## Output Format
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
    Content
  </ComponentName>
```
