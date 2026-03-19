---
name: legal-compliance-check
description: Vérification de conformité réglementaire RGPD, AI Act et nLPD avec analyse des écarts et plan de mise en conformité
agents: [legal, pm, architect, security]
trigger: /compliance
---

# Skill : Legal Compliance Check

## Objectif
Réaliser une vérification exhaustive de la conformité d'un produit, service ou traitement de données vis-à-vis des réglementations applicables (RGPD, AI Act, nLPD). Identifier les écarts de conformité, évaluer les risques juridiques et produire un plan de mise en conformité priorisé avec les actions correctives nécessaires.

## Quand l'utiliser
- Avant le lancement d'un nouveau produit ou service traitant des données personnelles
- Lors de l'intégration d'un système d'intelligence artificielle dans un produit existant
- Pour un audit périodique de conformité (annuel ou semestriel)
- Quand une nouvelle réglementation entre en vigueur ou est modifiée
- Lors d'un changement significatif dans le traitement des données (nouveau sous-traitant, transfert hors UE, nouvelle finalité)

## Étapes
1. **Cartographier les traitements** — Identifier tous les traitements de données personnelles concernés : finalités, bases légales, catégories de données, durées de conservation, sous-traitants et transferts internationaux.
2. **Identifier les réglementations applicables** — Déterminer quelles réglementations s'appliquent selon la localisation des utilisateurs, la nature des données et le type de système (RGPD pour l'UE, nLPD pour la Suisse, AI Act pour les systèmes IA).
3. **Analyser la conformité RGPD** — Vérifier les principes fondamentaux : licéité du traitement, minimisation des données, droits des personnes concernées, registre des traitements, AIPD si nécessaire, DPO désigné.
4. **Évaluer la conformité AI Act** — Si applicable, classifier le système IA selon le niveau de risque (inacceptable, haut, limité, minimal), vérifier les obligations de transparence, documentation technique et supervision humaine.
5. **Vérifier la conformité nLPD** — Pour les traitements concernant la Suisse, vérifier le devoir d'informer, les analyses d'impact, les transferts transfrontaliers et les mesures techniques et organisationnelles.
6. **Analyser les écarts** — Documenter chaque écart de conformité identifié avec le niveau de risque juridique (amende, sanction, litige), la probabilité et l'impact potentiel.
7. **Élaborer le plan de remédiation** — Définir les actions correctives priorisées avec responsables, délais et ressources nécessaires pour chaque écart identifié.
8. **Rédiger le rapport de conformité** — Produire le rapport final avec la synthèse de l'analyse, les constats détaillés, le plan d'action et les recommandations pour maintenir la conformité dans le temps.

## Checklist de sortie
- [ ] Le registre des traitements est complet et à jour
- [ ] Les bases légales sont identifiées et documentées pour chaque traitement
- [ ] Les droits des personnes concernées sont implémentés (accès, rectification, suppression, portabilité)
- [ ] Les mentions légales et politiques de confidentialité sont conformes et à jour
- [ ] Les AIPD sont réalisées pour les traitements à haut risque
- [ ] Les transferts internationaux sont encadrés (clauses contractuelles types, décisions d'adéquation)
- [ ] Les systèmes IA sont classifiés et les obligations correspondantes sont respectées
- [ ] Le plan de remédiation est priorisé avec des délais réalistes

## Format de sortie
```
Rapport de Conformité Réglementaire

Objet : [nom du produit / service / traitement]
Réglementations analysées : RGPD, AI Act, nLPD
Date de l'analyse : [date]
Analyste : [agent legal]

Synthèse de conformité :
  - RGPD : [Conforme / Partiellement conforme / Non conforme]
  - AI Act : [Conforme / Partiellement conforme / Non conforme / Non applicable]
  - nLPD : [Conforme / Partiellement conforme / Non conforme / Non applicable]
  - Niveau de risque global : [critique / élevé / modéré / faible]

Écarts identifiés :

[EC-001] Titre de l'écart
  - Réglementation : RGPD - Article 13
  - Constat : Description de la non-conformité
  - Risque : Amende jusqu'à 4% du CA mondial / CHF 250'000
  - Priorité : Critique
  - Action corrective : Description de la correction à apporter
  - Responsable : [rôle / équipe]
  - Délai : [date cible]

Plan de mise en conformité :
  Phase 1 (0-30 jours) — Actions critiques
    - [EC-001] Mise à jour de la politique de confidentialité
    - [EC-003] Implémentation du mécanisme de consentement
  Phase 2 (30-90 jours) — Actions importantes
    - [EC-005] Réalisation de l'AIPD
    - [EC-007] Mise en place du registre des traitements
  Phase 3 (90-180 jours) — Améliorations continues
    - [EC-009] Formation des équipes
    - [EC-010] Audit des sous-traitants
```

## Langue de travail

Tu communiques et rédiges tous tes échanges en **français**.
Les fichiers et livrables que tu produis sont rédigés en **english**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.

## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : `.\deliverables`
Respecte la structure de dossiers définie par le workflow en cours.
