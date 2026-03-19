---
name: ux-wireframe
description: Création de wireframes et prototypes interactifs avec architecture d'information, flux utilisateur et spécifications de design
agents: [ux, pm, dev-frontend]
trigger: /wireframe
---

# Skill : UX Wireframe

## Objectif
Créer des wireframes et prototypes interactifs qui définissent la structure, la hiérarchie d'information et les interactions d'une interface utilisateur. Produire des livrables de design exploitables par les développeurs, incluant les flux utilisateur, les spécifications d'interaction et les annotations d'accessibilité.

## Quand l'utiliser
- Lors de la conception d'une nouvelle fonctionnalité ou d'un nouvel écran
- Pour valider un flux utilisateur avant le développement (test de concept)
- Quand une refonte UX est nécessaire sur un parcours existant
- Pour aligner les parties prenantes sur la structure d'une interface avant le design visuel
- Lors de tests utilisateurs nécessitant un prototype cliquable rapide

## Étapes
1. **Recueillir les besoins** — Identifier les objectifs utilisateur, les contraintes techniques, les personas concernés et les user stories associées. Analyser les parcours existants et les pain points identifiés.
2. **Définir l'architecture d'information** — Structurer le contenu et la hiérarchie de l'interface : arborescence des pages, organisation des blocs de contenu, système de navigation et taxonomie.
3. **Concevoir les flux utilisateur** — Cartographier les parcours utilisateur de bout en bout : points d'entrée, étapes, décisions, chemins alternatifs, états d'erreur et sorties. Identifier les happy path et les edge cases.
4. **Créer les wireframes basse fidélité** — Dessiner les wireframes lo-fi pour chaque écran du flux : disposition des éléments, hiérarchie visuelle, zones d'interaction, contenu placeholder et annotations.
5. **Itérer vers la moyenne fidélité** — Affiner les wireframes avec les composants du design system, les vrais contenus (ou contenus représentatifs), les états interactifs (hover, focus, active, disabled) et les breakpoints responsive.
6. **Prototyper les interactions** — Créer un prototype interactif en liant les écrans avec les transitions, les micro-interactions, les états de chargement et les animations clés pour tester le flux complet.
7. **Annoter les spécifications** — Ajouter les annotations détaillées pour les développeurs : espacements, comportements au scroll, règles de responsive, gestion du contenu dynamique, cas limites et accessibilité.
8. **Valider avec les parties prenantes** — Présenter les wireframes aux parties prenantes (PO, développeurs, design) pour collecte de feedback, itérer selon les retours et archiver la version validée.

## Checklist de sortie
- [ ] Les objectifs utilisateur et les contraintes sont documentés
- [ ] L'architecture d'information est définie et validée
- [ ] Les flux utilisateur couvrent le happy path et les cas d'erreur
- [ ] Les wireframes sont disponibles pour tous les écrans du flux
- [ ] Les breakpoints responsive sont définis (mobile, tablette, desktop)
- [ ] Le prototype interactif est fonctionnel et testable
- [ ] Les annotations de spécifications sont complètes pour le handoff développeur
- [ ] Les critères d'accessibilité sont intégrés (ordre de tabulation, zones tactiles, contrastes)

## Format de sortie
```
Livrable UX Wireframe

Projet : [nom du projet / fonctionnalité]
Designer : [agent ux]
Date : [date]
Version : [v1.0 / v1.1 / v2.0]
Outil : [Figma / Whimsical / Balsamiq / Excalidraw]

Architecture d'information :
  Page principale
  ├── Section hero / en-tête
  ├── Section contenu principal
  │   ├── Bloc filtres / recherche
  │   ├── Bloc liste / grille de résultats
  │   └── Bloc pagination
  ├── Section contenu secondaire
  │   └── Bloc sidebar / widgets
  └── Section pied de page

Flux utilisateur :
  [Entrée] → Écran A → Décision → Écran B1 (succès) → [Sortie]
                                 → Écran B2 (erreur) → Retry → Écran A

Wireframes :
  - Écran 1 : [nom] — [lien Figma / image]
  - Écran 2 : [nom] — [lien Figma / image]
  - Écran 3 : [nom] — [lien Figma / image]

Spécifications responsive :
  - Mobile (< 768px) : Layout single column, navigation burger
  - Tablette (768-1024px) : Layout 2 colonnes, sidebar collapsable
  - Desktop (> 1024px) : Layout complet avec sidebar visible

Annotations d'accessibilité :
  - Ordre de tabulation : [séquence définie]
  - Zones tactiles minimales : 44x44px
  - Landmarks ARIA : header, nav, main, footer
  - Textes alternatifs : [décrits pour chaque image]

Prototype interactif : [lien vers le prototype]
```

## Langue de travail

Tu communiques et rédiges tous tes échanges en **français**.
Les fichiers et livrables que tu produis sont rédigés en **english**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.

## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : `.\deliverables`
Respecte la structure de dossiers définie par le workflow en cours.
