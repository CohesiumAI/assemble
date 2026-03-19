---
name: growth-experiment
description: Design et lancement d'expérience growth avec hypothèse, métriques, implémentation et analyse des résultats
agents: [growth, marketing, data]
trigger: /experiment
---

# Skill : Growth Experiment

## Objectif
Concevoir, lancer et analyser une expérience growth structurée selon la méthodologie scientifique. Formuler une hypothèse testable, définir les métriques de succès, implémenter le test (A/B test, feature flag, cohorte), collecter les données et analyser les résultats pour prendre une décision data-driven.

## Quand l'utiliser
- Pour tester une nouvelle fonctionnalité avant un déploiement complet (feature flag / A/B test)
- Quand une hypothèse d'amélioration de conversion doit être validée par les données
- Pour optimiser un parcours utilisateur (onboarding, checkout, activation, rétention)
- Lors de la priorisation des initiatives growth via un framework ICE/RICE
- Pour mesurer l'impact d'un changement de pricing, de messaging ou de design

## Étapes
1. **Formuler l'hypothèse** — Rédiger une hypothèse structurée : "Si nous [action], alors [métrique] augmentera de [X%] parce que [raison]." Identifier la métrique north star impactée.
2. **Définir les métriques et le seuil de succès** — Choisir la métrique principale (primary metric) et les métriques de garde (guardrail metrics). Définir le seuil minimum de détection (MDE) et la signification statistique requise (p < 0.05).
3. **Calculer la taille d'échantillon** — Estimer la taille d'échantillon nécessaire pour atteindre la puissance statistique souhaitée (80% minimum). Définir la durée minimale de l'expérience en fonction du trafic.
4. **Designer l'expérience** — Concevoir les variantes (contrôle vs. traitement), définir le pourcentage de trafic alloué, les règles de segmentation et les critères d'exclusion.
5. **Implémenter le test** — Configurer le test via l'outil d'expérimentation (LaunchDarkly, Optimizely, GrowthBook, feature flag maison). Intégrer le tracking des événements et vérifier l'instrumentation.
6. **Lancer et monitorer** — Activer l'expérience, vérifier la répartition du trafic (sample ratio mismatch check), monitorer les métriques de garde et les anomalies en temps réel.
7. **Analyser les résultats** — À la fin de la période de test, analyser les résultats statistiques : intervalle de confiance, p-value, effet observé vs. effet attendu. Segmenter les résultats par cohorte si pertinent.
8. **Prendre la décision et documenter** — Décider de déployer (ship), itérer (iterate) ou abandonner (kill) l'expérience. Documenter les apprentissages dans le knowledge base de l'équipe growth.

## Checklist de sortie
- [ ] L'hypothèse est formulée de manière testable avec une prédiction quantitative
- [ ] Les métriques principales et de garde sont définies et instrumentées
- [ ] La taille d'échantillon est calculée et la durée minimale est respectée
- [ ] Les variantes sont correctement implémentées et visuellement vérifiées
- [ ] Le tracking des événements est fonctionnel (vérifié via QA)
- [ ] La répartition du trafic est équilibrée (pas de sample ratio mismatch)
- [ ] Les résultats sont statistiquement significatifs avant toute décision
- [ ] L'expérience est documentée avec les apprentissages dans le registre growth

## Format de sortie
```
Fiche d'Expérience Growth

Nom : [EXP-XXX] [titre descriptif]
Hypothèse : Si nous [action], alors [métrique] augmentera de [X%] parce que [raison].
Auteur : [agent growth]
Date : [date de début] - [date de fin]
Statut : [Draft / En cours / Terminé / Déployé / Abandonné]

Métriques :
  - Principale : [nom de la métrique] (baseline : [valeur actuelle])
  - Garde 1 : [métrique] (seuil : ne pas dégrader de plus de [X%])
  - Garde 2 : [métrique] (seuil : ne pas dégrader de plus de [X%])

Configuration du test :
  - Type : A/B test / Multi-variante / Feature flag
  - Répartition : Contrôle [X%] / Variante [X%]
  - Taille d'échantillon requise : [N] utilisateurs par variante
  - Durée minimale : [X] jours
  - Outil : [LaunchDarkly / GrowthBook / Optimizely]

Résultats :
  | Variante  | Métrique principale | Delta   | p-value | Significatif |
  |-----------|---------------------|---------|---------|-------------|
  | Contrôle  | [valeur]            | -       | -       | -           |
  | Variante A| [valeur]            | [+X%]   | [0.0X]  | [Oui/Non]   |

Décision : [Ship / Iterate / Kill]
Apprentissages : [résumé des enseignements clés]
Prochaines étapes : [actions à mener suite à cette expérience]
```
