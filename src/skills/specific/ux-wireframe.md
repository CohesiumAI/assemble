---
name: ux-wireframe
description: Creation de wireframes et prototypes interactifs avec architecture d'information, flux utilisateur et specifications de design
agent: ux
trigger: /wireframe
---

# Skill : UX Wireframe

## Objectif
Creer des wireframes et prototypes interactifs qui definissent la structure, la hierarchie d'information et les interactions d'une interface utilisateur. Produire des livrables de design exploitables par les developpeurs, incluant les flux utilisateur, les specifications d'interaction et les annotations d'accessibilite.

## Quand l'utiliser
- Lors de la conception d'une nouvelle fonctionnalite ou d'un nouvel ecran
- Pour valider un flux utilisateur avant le developpement (test de concept)
- Quand une refonte UX est necessaire sur un parcours existant
- Pour aligner les parties prenantes sur la structure d'une interface avant le design visuel
- Lors de tests utilisateurs necessitant un prototype cliquable rapide

## Etapes
1. **Recueillir les besoins** — Identifier les objectifs utilisateur, les contraintes techniques, les personas concernes et les user stories associees. Analyser les parcours existants et les pain points identifies.
2. **Definir l'architecture d'information** — Structurer le contenu et la hierarchie de l'interface : arborescence des pages, organisation des blocs de contenu, systeme de navigation et taxonomie.
3. **Concevoir les flux utilisateur** — Cartographier les parcours utilisateur de bout en bout : points d'entree, etapes, decisions, chemins alternatifs, etats d'erreur et sorties. Identifier les happy path et les edge cases.
4. **Creer les wireframes basse fidelite** — Dessiner les wireframes lo-fi pour chaque ecran du flux : disposition des elements, hierarchie visuelle, zones d'interaction, contenu placeholder et annotations.
5. **Iterer vers la moyenne fidelite** — Affiner les wireframes avec les composants du design system, les vrais contenus (ou contenus representatifs), les etats interactifs (hover, focus, active, disabled) et les breakpoints responsive.
6. **Prototyper les interactions** — Creer un prototype interactif en liant les ecrans avec les transitions, les micro-interactions, les etats de chargement et les animations cles pour tester le flux complet.
7. **Annoter les specifications** — Ajouter les annotations detaillees pour les developpeurs : espacements, comportements au scroll, regles de responsive, gestion du contenu dynamique, cas limites et accessibilite.
8. **Valider avec les parties prenantes** — Presenter les wireframes aux parties prenantes (PO, developpeurs, design) pour collecte de feedback, iterer selon les retours et archiver la version validee.

## Checklist de sortie
- [ ] Les objectifs utilisateur et les contraintes sont documentes
- [ ] L'architecture d'information est definie et validee
- [ ] Les flux utilisateur couvrent le happy path et les cas d'erreur
- [ ] Les wireframes sont disponibles pour tous les ecrans du flux
- [ ] Les breakpoints responsive sont definis (mobile, tablette, desktop)
- [ ] Le prototype interactif est fonctionnel et testable
- [ ] Les annotations de specifications sont completes pour le handoff developpeur
- [ ] Les criteres d'accessibilite sont integres (ordre de tabulation, zones tactiles, contrastes)

## Format de sortie
```
Livrable UX Wireframe

Projet : [nom du projet / fonctionnalite]
Designer : [agent ux]
Date : [date]
Version : [v1.0 / v1.1 / v2.0]
Outil : [Figma / Whimsical / Balsamiq / Excalidraw]

Architecture d'information :
  Page principale
  ├── Section hero / en-tete
  ├── Section contenu principal
  │   ├── Bloc filtres / recherche
  │   ├── Bloc liste / grille de resultats
  │   └── Bloc pagination
  ├── Section contenu secondaire
  │   └── Bloc sidebar / widgets
  └── Section pied de page

Flux utilisateur :
  [Entree] → Ecran A → Decision → Ecran B1 (succes) → [Sortie]
                                 → Ecran B2 (erreur) → Retry → Ecran A

Wireframes :
  - Ecran 1 : [nom] — [lien Figma / image]
  - Ecran 2 : [nom] — [lien Figma / image]
  - Ecran 3 : [nom] — [lien Figma / image]

Specifications responsive :
  - Mobile (< 768px) : Layout single column, navigation burger
  - Tablette (768-1024px) : Layout 2 colonnes, sidebar collapsable
  - Desktop (> 1024px) : Layout complet avec sidebar visible

Annotations d'accessibilite :
  - Ordre de tabulation : [sequence definie]
  - Zones tactiles minimales : 44x44px
  - Landmarks ARIA : header, nav, main, footer
  - Textes alternatifs : [decrits pour chaque image]

Prototype interactif : [lien vers le prototype]
```
