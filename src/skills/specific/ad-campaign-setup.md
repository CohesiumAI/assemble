---
name: ad-campaign-setup
description: Configuration complete de campagne publicitaire multi-plateforme avec ciblage, creatives et suivi de performance
agent: ads
trigger: /ad-setup
---

# Skill : Ad Campaign Setup

## Objectif
Configurer et lancer une campagne publicitaire complete sur les plateformes de diffusion (Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads). Definir la strategie de ciblage, creer les ensembles d'annonces, configurer le tracking de conversion et mettre en place les tableaux de bord de suivi de performance.

## Quand l'utiliser
- Lors du lancement d'un nouveau produit ou service necessitant de la visibilite payante
- Pour une campagne d'acquisition d'utilisateurs ou de generation de leads
- Quand une campagne existante doit etre restructuree ou optimisee
- Pour un lancement sur une nouvelle plateforme publicitaire
- Lors de la mise en place d'une campagne de retargeting ou de remarketing

## Etapes
1. **Definir les objectifs de la campagne** — Identifier l'objectif principal (awareness, trafic, conversions, leads, app installs), le KPI principal, le budget global et la duree de la campagne.
2. **Configurer le ciblage** — Definir les audiences cibles : demographics (age, genre, localisation), interets, comportements, audiences similaires (lookalike), listes de remarketing et exclusions.
3. **Structurer les campagnes et ad sets** — Organiser les campagnes par objectif, les ad sets par audience ou placement, avec une nomenclature claire pour le reporting (convention de nommage standardisee).
4. **Creer les creatives** — Preparer les variantes d'annonces : textes (titres, descriptions, CTA), visuels (images, videos, carrousels) en respectant les specifications de chaque plateforme.
5. **Configurer le tracking** — Installer les pixels de suivi (Meta Pixel, Google Tag, LinkedIn Insight Tag), definir les evenements de conversion, configurer les parametres UTM et verifier le tracking server-side si applicable.
6. **Definir la strategie d'encheres** — Choisir la strategie d'encheres adaptee a l'objectif (CPA cible, ROAS cible, maximiser les conversions), definir les plafonds de budget quotidien et les regles d'optimisation automatique.
7. **Mettre en place les tests A/B** — Configurer les tests de creatives, d'audiences et de placements pour identifier les combinaisons les plus performantes avec une methodologie statistiquement significative.
8. **Creer le tableau de bord de suivi** — Mettre en place le dashboard de reporting avec les metriques cles (CPC, CPM, CTR, CPA, ROAS, taux de conversion) et les alertes de performance.

## Checklist de sortie
- [ ] Les objectifs et KPIs sont clairement definis et mesurables
- [ ] Les audiences sont configurees avec les exclusions appropriees
- [ ] La nomenclature des campagnes suit la convention de nommage etablie
- [ ] Les creatives respectent les specifications de chaque plateforme (taille, format, poids)
- [ ] Le tracking de conversion est installe et verifie (evenements de test fires)
- [ ] La strategie d'encheres est alignee avec les objectifs de la campagne
- [ ] Les tests A/B sont configures avec un minimum de 2 variantes par ad set
- [ ] Le tableau de bord de suivi est operationnel avec les alertes configurees

## Format de sortie
```
Configuration de Campagne Publicitaire

Campagne : [nom de la campagne]
Plateforme(s) : [Google Ads / Meta Ads / LinkedIn Ads / TikTok Ads]
Objectif : [awareness / trafic / conversions / leads]
Budget : [montant] / [jour / semaine / mois]
Duree : [date de debut] - [date de fin]

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
  - Age : [tranche]
  - Localisation : [pays / regions / villes]
  - Interets : [liste]
  - Audience lookalike : [source, pourcentage]

Tracking configure :
  - Pixel : [installe et verifie]
  - Evenements : [PageView, AddToCart, Purchase, Lead, etc.]
  - UTM : utm_source=[source]&utm_medium=[medium]&utm_campaign=[campaign]

KPIs cibles :
  - CPA cible : [montant]
  - ROAS cible : [ratio]
  - CTR attendu : [pourcentage]
  - Budget quotidien : [montant]
```
