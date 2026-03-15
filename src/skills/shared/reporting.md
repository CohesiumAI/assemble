---
name: reporting
description: Génération de rapports et tableaux de bord — collecte de données, analyse, visualisation, insights et recommandations pour le pilotage décisionnel
agents: [data, analyst, pm, scrum, marketing]
trigger: /report
---

# Skill : Reporting & Tableaux de Bord

## Objectif

Concevoir et produire des rapports structurés et des tableaux de bord qui transforment les données brutes en insights actionnables pour le pilotage décisionnel. Cette skill couvre la collecte, l'analyse, la visualisation des données et la formulation de recommandations basées sur les métriques clés.

## Quand l'utiliser

- Lors de la création d'un rapport périodique (hebdomadaire, mensuel, trimestriel)
- Pour construire un tableau de bord de suivi de KPIs
- Quand une présentation data-driven est nécessaire pour les stakeholders
- Lors d'une rétrospective sprint ou d'un bilan de campagne marketing
- Pour analyser les résultats d'un A/B test ou d'un lancement de fonctionnalité
- Quand la direction demande un état des lieux sur un sujet spécifique

## Étapes

1. **Clarifier l'objectif et l'audience** — Identifier la question métier à laquelle le rapport doit répondre. Définir l'audience (C-level, product, marketing, technique) et adapter le niveau de détail, le vocabulaire et le format en conséquence. Un rapport technique et un rapport exécutif ne se présentent pas de la même manière.
2. **Identifier et collecter les sources de données** — Lister les sources nécessaires : base de données, analytics (GA4, Mixpanel, Amplitude), outils métier (CRM, Stripe, ad platforms), APIs, exports CSV. Vérifier la fiabilité et la fraîcheur des données. Documenter les limitations connues.
3. **Définir les KPIs et métriques** — Sélectionner les indicateurs pertinents (pas plus de 7-10 KPIs principaux). Pour chaque KPI : définition précise, formule de calcul, source de données, fréquence de mise à jour, seuils (vert/orange/rouge). Distinguer les vanity metrics des métriques actionnables.
4. **Analyser les données** — Calculer les métriques, identifier les tendances (croissance, décroissance, plateau), les anomalies et les corrélations. Comparer avec les périodes précédentes (MoM, YoY), les objectifs fixés et les benchmarks du secteur. Segmenter les données pour révéler les insights cachés.
5. **Visualiser les résultats** — Choisir les types de graphiques adaptés : line charts pour les tendances temporelles, bar charts pour les comparaisons, pie charts pour les répartitions (avec parcimonie), heatmaps pour les distributions, tables pour les détails. Respecter les principes de data visualization (Tufte).
6. **Formuler les insights et recommandations** — Traduire chaque constat en insight actionnable : qu'est-ce que les données révèlent ? Quelles sont les causes probables ? Quelles actions sont recommandées ? Prioriser les recommandations par impact métier estimé.
7. **Structurer le livrable** — Organiser le rapport avec un executive summary en début (conclusions et recommandations clés), suivi du détail par section thématique. Chaque section suit le pattern : constat → analyse → recommandation.
8. **Définir le suivi** — Proposer la fréquence de mise à jour du rapport, les alertes automatiques à configurer sur les KPIs critiques, et les prochaines questions à investiguer.

## Checklist de sortie

- [ ] L'objectif du rapport et l'audience sont définis
- [ ] Les sources de données sont identifiées, fiables et documentées
- [ ] Les KPIs sont pertinents, bien définis et limités en nombre (≤ 10)
- [ ] L'analyse inclut les comparaisons temporelles et les segmentations clés
- [ ] Les visualisations sont claires, adaptées au type de données et non trompeuses
- [ ] Chaque constat est accompagné d'un insight et d'une recommandation
- [ ] L'executive summary permet de comprendre l'essentiel en 2 minutes
- [ ] La fréquence de mise à jour et les prochaines étapes sont définies

## Format de sortie

```markdown
## Rapport [Type]

**Titre :** [Titre descriptif du rapport]
**Période :** [date début — date fin]
**Audience :** [C-level | Product | Marketing | Technique]
**Auteur :** [agent]
**Date de production :** [date]
**Prochaine mise à jour :** [date]

---

### Executive Summary

**En bref :** [2-3 phrases résumant les conclusions principales]

**KPIs clés :**

| KPI | Valeur | Variation | Objectif | Statut |
|-----|--------|-----------|----------|--------|
| [KPI 1] | [valeur] | [+X% / -X% vs N-1] | [objectif] | ✅/⚠️/❌ |
| [KPI 2] | [valeur] | [+X% / -X% vs N-1] | [objectif] | ✅/⚠️/❌ |
| [KPI 3] | [valeur] | [+X% / -X% vs N-1] | [objectif] | ✅/⚠️/❌ |

**Actions recommandées :**
1. 🔴 [Action prioritaire — impact élevé]
2. 🟠 [Action importante — à planifier]
3. 🟡 [Action d'optimisation — nice to have]

---

### Section 1 : [Thématique — ex: Acquisition]

#### Métriques

| Métrique | Ce mois | Mois précédent | Variation | YoY |
|----------|---------|---------------|-----------|-----|
| [métrique 1] | [valeur] | [valeur] | [%] | [%] |
| [métrique 2] | [valeur] | [valeur] | [%] | [%] |

#### Analyse

**Constat :** [description factuelle de ce que montrent les données]

**Cause probable :** [hypothèse basée sur les données et le contexte]

**Recommandation :** [action concrète avec résultat attendu]

#### Segmentation

| Segment | Valeur | Part | Tendance |
|---------|--------|------|----------|
| [segment A] | [valeur] | [%] | ↗️/➡️/↘️ |
| [segment B] | [valeur] | [%] | ↗️/➡️/↘️ |
| [segment C] | [valeur] | [%] | ↗️/➡️/↘️ |

---

### Section 2 : [Thématique — ex: Engagement]

[Même structure : Métriques → Analyse → Segmentation]

---

### Section 3 : [Thématique — ex: Conversion / Revenus]

[Même structure : Métriques → Analyse → Segmentation]

---

### Annexes

**Sources de données :** [liste des sources avec date de dernière extraction]
**Limitations connues :** [biais, données manquantes, approximations]
**Glossaire :** [définition des termes et métriques utilisés]

### Prochaines étapes

- [ ] [Analyse complémentaire à mener]
- [ ] [Alerte à configurer sur KPI critique]
- [ ] [Question à investiguer dans le prochain rapport]
- [ ] [Décision à prendre par [responsable] avant [date]]
```
