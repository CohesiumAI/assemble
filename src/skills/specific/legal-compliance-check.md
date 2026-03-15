---
name: legal-compliance-check
description: Verification de conformite reglementaire RGPD, AI Act et nLPD avec analyse des ecarts et plan de mise en conformite
agent: legal
trigger: /compliance
---

# Skill : Legal Compliance Check

## Objectif
Realiser une verification exhaustive de la conformite d'un produit, service ou traitement de donnees vis-a-vis des reglementations applicables (RGPD, AI Act, nLPD). Identifier les ecarts de conformite, evaluer les risques juridiques et produire un plan de mise en conformite priorise avec les actions correctives necessaires.

## Quand l'utiliser
- Avant le lancement d'un nouveau produit ou service traitant des donnees personnelles
- Lors de l'integration d'un systeme d'intelligence artificielle dans un produit existant
- Pour un audit periodique de conformite (annuel ou semestriel)
- Quand une nouvelle reglementation entre en vigueur ou est modifiee
- Lors d'un changement significatif dans le traitement des donnees (nouveau sous-traitant, transfert hors UE, nouvelle finalite)

## Etapes
1. **Cartographier les traitements** — Identifier tous les traitements de donnees personnelles concernes : finalites, bases legales, categories de donnees, durees de conservation, sous-traitants et transferts internationaux.
2. **Identifier les reglementations applicables** — Determiner quelles reglementations s'appliquent selon la localisation des utilisateurs, la nature des donnees et le type de systeme (RGPD pour l'UE, nLPD pour la Suisse, AI Act pour les systemes IA).
3. **Analyser la conformite RGPD** — Verifier les principes fondamentaux : liceit du traitement, minimisation des donnees, droits des personnes concernees, registre des traitements, AIPD si necessaire, DPO designe.
4. **Evaluer la conformite AI Act** — Si applicable, classifier le systeme IA selon le niveau de risque (inacceptable, haut, limite, minimal), verifier les obligations de transparence, documentation technique et supervision humaine.
5. **Verifier la conformite nLPD** — Pour les traitements concernant la Suisse, verifier le devoir d'informer, les analyses d'impact, les transferts transfrontieres et les mesures techniques et organisationnelles.
6. **Analyser les ecarts** — Documenter chaque ecart de conformite identifie avec le niveau de risque juridique (amende, sanction, litige), la probabilite et l'impact potentiel.
7. **Elaborer le plan de remediation** — Definir les actions correctives priorisees avec responsables, delais et ressources necessaires pour chaque ecart identifie.
8. **Rediger le rapport de conformite** — Produire le rapport final avec la synthese de l'analyse, les constats detailles, le plan d'action et les recommandations pour maintenir la conformite dans le temps.

## Checklist de sortie
- [ ] Le registre des traitements est complet et a jour
- [ ] Les bases legales sont identifiees et documentees pour chaque traitement
- [ ] Les droits des personnes concernees sont implementes (acces, rectification, suppression, portabilite)
- [ ] Les mentions legales et politiques de confidentialite sont conformes et a jour
- [ ] Les AIPD sont realisees pour les traitements a haut risque
- [ ] Les transferts internationaux sont encadres (clauses contractuelles types, decisions d'adequation)
- [ ] Les systemes IA sont classifies et les obligations correspondantes sont respectees
- [ ] Le plan de remediation est priorise avec des delais realistes

## Format de sortie
```
Rapport de Conformite Reglementaire

Objet : [nom du produit / service / traitement]
Reglementations analysees : RGPD, AI Act, nLPD
Date de l'analyse : [date]
Analyste : [agent legal]

Synthese de conformite :
  - RGPD : [Conforme / Partiellement conforme / Non conforme]
  - AI Act : [Conforme / Partiellement conforme / Non conforme / Non applicable]
  - nLPD : [Conforme / Partiellement conforme / Non conforme / Non applicable]
  - Niveau de risque global : [critique / eleve / modere / faible]

Ecarts identifies :

[EC-001] Titre de l'ecart
  - Reglementation : RGPD - Article 13
  - Constat : Description de la non-conformite
  - Risque : Amende jusqu'a 4% du CA mondial / CHF 250'000
  - Priorite : Critique
  - Action corrective : Description de la correction a apporter
  - Responsable : [role / equipe]
  - Delai : [date cible]

Plan de mise en conformite :
  Phase 1 (0-30 jours) — Actions critiques
    - [EC-001] Mise a jour de la politique de confidentialite
    - [EC-003] Implementation du mecanisme de consentement
  Phase 2 (30-90 jours) — Actions importantes
    - [EC-005] Realisation de l'AIPD
    - [EC-007] Mise en place du registre des traitements
  Phase 3 (90-180 jours) — Ameliorations continues
    - [EC-009] Formation des equipes
    - [EC-010] Audit des sous-traitants
```
