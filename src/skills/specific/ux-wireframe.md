---
name: ux-wireframe
description: Wireframe and interactive prototype creation with information architecture, user flows, and design specifications
agents: [ux, pm, dev-frontend]
trigger: /wireframe
---

# Skill : UX Wireframe

## Objective
Create wireframes and interactive prototypes that define the structure, information hierarchy, and interactions of a user interface. Produce design deliverables usable by developers, including user flows, interaction specifications, and accessibility annotations.

## When to use
- When designing a new feature or screen
- To validate a user flow before development (concept testing)
- When a UX redesign is needed on an existing journey
- To align stakeholders on an interface's structure before visual design
- During user testing requiring a quick clickable prototype

## Steps
1. **Gather requirements** — Identify user goals, technical constraints, relevant personas, and associated user stories. Analyze existing journeys and identified pain points.
2. **Define information architecture** — Structure the content and interface hierarchy: page tree, content block organization, navigation system, and taxonomy.
3. **Design user flows** — Map end-to-end user journeys: entry points, steps, decisions, alternative paths, error states, and exits. Identify happy paths and edge cases.
4. **Create low-fidelity wireframes** — Draw lo-fi wireframes for each flow screen: element layout, visual hierarchy, interaction zones, placeholder content, and annotations.
5. **Iterate toward medium fidelity** — Refine wireframes with design system components, real content (or representative content), interactive states (hover, focus, active, disabled), and responsive breakpoints.
6. **Prototype interactions** — Create an interactive prototype by linking screens with transitions, micro-interactions, loading states, and key animations to test the complete flow.
7. **Annotate specifications** — Add detailed annotations for developers: spacing, scroll behaviors, responsive rules, dynamic content management, edge cases, and accessibility.
8. **Validate with stakeholders** — Present wireframes to stakeholders (PO, developers, design) for feedback collection, iterate based on feedback, and archive the validated version.

## Exit Checklist
- [ ] User goals and constraints are documented
- [ ] Information architecture is defined and validated
- [ ] User flows cover the happy path and error cases
- [ ] Wireframes are available for all flow screens
- [ ] Responsive breakpoints are defined (mobile, tablet, desktop)
- [ ] Interactive prototype is functional and testable
- [ ] Specification annotations are complete for developer handoff
- [ ] Accessibility criteria are integrated (tab order, touch targets, contrasts)

## Output Format
```
UX Wireframe Deliverable

Project : [project / feature name]
Designer : [agent ux]
Date : [date]
Version : [v1.0 / v1.1 / v2.0]
Tool : [Figma / Whimsical / Balsamiq / Excalidraw]

Information architecture :
  Main page
  ├── Hero / header section
  ├── Main content section
  │   ├── Filters / search block
  │   ├── List / results grid block
  │   └── Pagination block
  ├── Secondary content section
  │   └── Sidebar / widgets block
  └── Footer section

User flow :
  [Entry] → Screen A → Decision → Screen B1 (success) → [Exit]
                                 → Screen B2 (error) → Retry → Screen A

Wireframes :
  - Screen 1 : [name] — [Figma link / image]
  - Screen 2 : [name] — [Figma link / image]
  - Screen 3 : [name] — [Figma link / image]

Responsive specifications :
  - Mobile (< 768px) : Single column layout, burger navigation
  - Tablet (768-1024px) : 2 column layout, collapsible sidebar
  - Desktop (> 1024px) : Full layout with visible sidebar

Accessibility annotations :
  - Tab order : [defined sequence]
  - Minimum touch targets : 44x44px
  - ARIA landmarks : header, nav, main, footer
  - Alt text : [described for each image]

Interactive prototype : [link to prototype]
```
