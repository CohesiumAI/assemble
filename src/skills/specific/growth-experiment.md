---
name: growth-experiment
description: Design et lancement d'experience growth avec hypothese, metriques, implementation et analyse des resultats
agent: growth
trigger: /experiment
---

# Skill : Growth Experiment

## Objectif
Concevoir, lancer et analyser une experience growth structuree selon la methodologie scientifique. Formuler une hypothese testable, definir les metriques de succes, implementer le test (A/B test, feature flag, cohorte), collecter les donnees et analyser les resultats pour prendre une decision data-driven.

## Quand l'utiliser
- Pour tester une nouvelle fonctionnalite avant un deploiement complet (feature flag / A/B test)
- Quand une hypothese d'amelioration de conversion doit etre validee par les donnees
- Pour optimiser un parcours utilisateur (onboarding, checkout, activation, retention)
- Lors de la priorisation des initiatives growth via un framework ICE/RICE
- Pour mesurer l'impact d'un changement de pricing, de messaging ou de design

## Etapes
1. **Formuler l'hypothese** — Rediger une hypothese structuree : "Si nous [action], alors [metrique] augmentera de [X%] parce que [raison]." Identifier la metrique nord star impactee.
2. **Definir les metriques et le seuil de succes** — Choisir la metrique principale (primary metric) et les metriques de garde (guardrail metrics). Definir le seuil minimum de detection (MDE) et la signification statistique requise (p < 0.05).
3. **Calculer la taille d'echantillon** — Estimer la taille d'echantillon necessaire pour atteindre la puissance statistique souhaitee (80% minimum). Definir la duree minimale de l'experience en fonction du trafic.
4. **Designer l'experience** — Concevoir les variantes (controle vs. traitement), definir le pourcentage de trafic alloue, les regles de segmentation et les criteres d'exclusion.
5. **Implementer le test** — Configurer le test via l'outil d'experimentation (LaunchDarkly, Optimizely, GrowthBook, feature flag maison). Integrer le tracking des evenements et verifier l'instrumentation.
6. **Lancer et monitorer** — Activer l'experience, verifier la repartition du trafic (sample ratio mismatch check), monitorer les metriques de garde et les anomalies en temps reel.
7. **Analyser les resultats** — A la fin de la periode de test, analyser les resultats statistiques : intervalle de confiance, p-value, effet observe vs. effet attendu. Segmenter les resultats par cohorte si pertinent.
8. **Prendre la decision et documenter** — Decider de deployer (ship), iterer (iterate) ou abandonner (kill) l'experience. Documenter les apprentissages dans le knowledge base de l'equipe growth.

## Checklist de sortie
- [ ] L'hypothese est formulee de maniere testable avec une prediction quantitative
- [ ] Les metriques principales et de garde sont definies et instrumentees
- [ ] La taille d'echantillon est calculee et la duree minimale est respectee
- [ ] Les variantes sont correctement implementees et visuellement verifiees
- [ ] Le tracking des evenements est fonctionnel (verifie via QA)
- [ ] La repartition du trafic est equilibree (pas de sample ratio mismatch)
- [ ] Les resultats sont statistiquement significatifs avant toute decision
- [ ] L'experience est documentee avec les apprentissages dans le registre growth

## Format de sortie
```
Fiche d'Experience Growth

Nom : [EXP-XXX] [titre descriptif]
Hypothese : Si nous [action], alors [metrique] augmentera de [X%] parce que [raison].
Auteur : [agent growth]
Date : [date de debut] - [date de fin]
Statut : [Draft / En cours / Termine / Deploye / Abandonne]

Metriques :
  - Principale : [nom de la metrique] (baseline : [valeur actuelle])
  - Garde 1 : [metrique] (seuil : ne pas degrader de plus de [X%])
  - Garde 2 : [metrique] (seuil : ne pas degrader de plus de [X%])

Configuration du test :
  - Type : A/B test / Multi-variante / Feature flag
  - Repartition : Controle [X%] / Variante [X%]
  - Taille d'echantillon requise : [N] utilisateurs par variante
  - Duree minimale : [X] jours
  - Outil : [LaunchDarkly / GrowthBook / Optimizely]

Resultats :
  | Variante  | Metrique principale | Delta   | p-value | Significatif |
  |-----------|---------------------|---------|---------|-------------|
  | Controle  | [valeur]            | -       | -       | -           |
  | Variante A| [valeur]            | [+X%]   | [0.0X]  | [Oui/Non]   |

Decision : [Ship / Iterate / Kill]
Apprentissages : [resume des enseignements cles]
Prochaines etapes : [actions a mener suite a cette experience]
```
