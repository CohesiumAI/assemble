---
name: ad-campaign-setup
description: Configuration complète de campagne publicitaire multi-plateforme avec ciblage, créatives et suivi de performance
agents: [ads, marketing, growth]
trigger: /ad-setup
---

# Skill : Ad Campaign Setup

## Objectif
Configurer et lancer une campagne publicitaire complète sur les plateformes de diffusion (Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads). Définir la stratégie de ciblage, créer les ensembles d'annonces, configurer le tracking de conversion et mettre en place les tableaux de bord de suivi de performance.

## Quand l'utiliser
- Lors du lancement d'un nouveau produit ou service nécessitant de la visibilité payante
- Pour une campagne d'acquisition d'utilisateurs ou de génération de leads
- Quand une campagne existante doit être restructurée ou optimisée
- Pour un lancement sur une nouvelle plateforme publicitaire
- Lors de la mise en place d'une campagne de retargeting ou de remarketing

## Étapes
1. **Définir les objectifs de la campagne** — Identifier l'objectif principal (awareness, trafic, conversions, leads, app installs), le KPI principal, le budget global et la durée de la campagne.
2. **Configurer le ciblage** — Définir les audiences cibles : demographics (âge, genre, localisation), intérêts, comportements, audiences similaires (lookalike), listes de remarketing et exclusions.
3. **Structurer les campagnes et ad sets** — Organiser les campagnes par objectif, les ad sets par audience ou placement, avec une nomenclature claire pour le reporting (convention de nommage standardisée).
4. **Créer les créatives** — Préparer les variantes d'annonces : textes (titres, descriptions, CTA), visuels (images, vidéos, carrousels) en respectant les spécifications de chaque plateforme.
5. **Configurer le tracking** — Installer les pixels de suivi (Meta Pixel, Google Tag, LinkedIn Insight Tag), définir les événements de conversion, configurer les paramètres UTM et vérifier le tracking server-side si applicable.
6. **Définir la stratégie d'enchères** — Choisir la stratégie d'enchères adaptée à l'objectif (CPA cible, ROAS cible, maximiser les conversions), définir les plafonds de budget quotidien et les règles d'optimisation automatique.
7. **Mettre en place les tests A/B** — Configurer les tests de créatives, d'audiences et de placements pour identifier les combinaisons les plus performantes avec une méthodologie statistiquement significative.
8. **Créer le tableau de bord de suivi** — Mettre en place le dashboard de reporting avec les métriques clés (CPC, CPM, CTR, CPA, ROAS, taux de conversion) et les alertes de performance.

## Checklist de sortie
- [ ] Les objectifs et KPIs sont clairement définis et mesurables
- [ ] Les audiences sont configurées avec les exclusions appropriées
- [ ] La nomenclature des campagnes suit la convention de nommage établie
- [ ] Les créatives respectent les spécifications de chaque plateforme (taille, format, poids)
- [ ] Le tracking de conversion est installé et vérifié (événements de test fires)
- [ ] La stratégie d'enchères est alignée avec les objectifs de la campagne
- [ ] Les tests A/B sont configurés avec un minimum de 2 variantes par ad set
- [ ] Le tableau de bord de suivi est opérationnel avec les alertes configurées

## Format de sortie
```
Configuration de Campagne Publicitaire

Campagne : [nom de la campagne]
Plateforme(s) : [Google Ads / Meta Ads / LinkedIn Ads / TikTok Ads]
Objectif : [awareness / trafic / conversions / leads]
Budget : [montant] / [jour / semaine / mois]
Durée : [date de début] - [date de fin]

Structure :
  Campagne : [NOM_CAMPAGNE]_[OBJECTIF]_[DATE]
  ├── Ad Set 1 : [AUDIENCE]_[PLACEMENT]_[CIBLAGE]
  │   ├── Ad 1 : [FORMAT]_[VARIANTE_A]
  │   ├── Ad 2 : [FORMAT]_[VARIANTE_B]
  │   └── Ad 3 : [FORMAT]_[VARIANTE_C]
  └── Ad Set 2 : [AUDIENCE]_[PLACEMENT]_[CIBLAGE]
      ├── Ad 1 : [FORMAT]_[VARIANTE_A]
      └── Ad 2 : [FORMAT]_[VARIANTE_B]

Ciblage principal :
  - Âge : [tranche]
  - Localisation : [pays / régions / villes]
  - Intérêts : [liste]
  - Audience lookalike : [source, pourcentage]

Tracking configuré :
  - Pixel : [installé et vérifié]
  - Événements : [PageView, AddToCart, Purchase, Lead, etc.]
  - UTM : utm_source=[source]&utm_medium=[medium]&utm_campaign=[campaign]

KPIs cibles :
  - CPA cible : [montant]
  - ROAS cible : [ratio]
  - CTR attendu : [pourcentage]
  - Budget quotidien : [montant]
```
