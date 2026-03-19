---
name: competitive-analysis
description: Analyse concurrentielle et benchmark — positionnement, forces et faiblesses, stratégies, opportunités de marché et recommandations stratégiques
agents: [analyst, marketing, growth, pm, customer-success, finance]
trigger: /benchmark
---

# Skill : Analyse Concurrentielle

## Objectif

Réaliser une analyse concurrentielle structurée et approfondie pour identifier le positionnement des concurrents, leurs forces et faiblesses, les tendances du marché et les opportunités stratégiques. Cette skill produit un benchmark actionnable qui guide les décisions produit, marketing et commerciales.

## Quand l'utiliser

- Lors du lancement d'un nouveau produit ou d'une nouvelle fonctionnalité
- Pour une révision stratégique périodique (trimestrielle ou semestrielle)
- Quand un nouveau concurrent émerge ou qu'un concurrent existant pivote
- Lors de la définition du pricing ou du repositionnement d'une offre
- Pour alimenter un pitch investisseur ou un business plan
- Quand l'équipe produit doit prioriser les fonctionnalités du roadmap

## Étapes

1. **Définir le périmètre et les objectifs** — Identifier les questions stratégiques à adresser : positionnement, pricing, fonctionnalités, go-to-market, satisfaction client. Définir les critères de sélection des concurrents (directs, indirects, substituts). Limiter l'analyse à 5-8 concurrents pour rester actionnable.
2. **Cartographier les concurrents** — Pour chaque concurrent, collecter les informations clés : proposition de valeur, cible client, modèle économique, taille (équipe, levée de fonds, CA estimé), historique et trajectoire de croissance. Classifier en concurrents directs, indirects et potentiels.
3. **Analyser les produits et fonctionnalités** — Comparer feature par feature sur les axes critiques pour le marché. Identifier les fonctionnalités différenciantes de chaque concurrent, les lacunes communes, les innovations récentes. Évaluer l'expérience utilisateur et la qualité perçue.
4. **Analyser le pricing et le business model** — Comparer les grilles tarifaires (freemium, abonnement, usage-based, licence), les niveaux d'offre, les conditions commerciales. Identifier les stratégies de pricing (pénétration, écrémage, value-based). Estimer le revenu moyen par utilisateur (ARPU) quand possible.
5. **Analyser les stratégies marketing et acquisition** — Étudier les canaux d'acquisition (SEO, paid, social, content, partenariats), le positionnement de marque, la communication, la présence sur les réseaux sociaux, les avis clients (G2, Trustpilot, Capterra). Identifier les messages clés et les arguments de vente.
6. **Identifier les forces, faiblesses et opportunités** — Pour chaque concurrent, synthétiser les forces et faiblesses. Croiser avec les attentes du marché pour identifier les opportunités non adressées (blue ocean), les menaces concurrentielles et les axes de différenciation exploitables.
7. **Formuler les recommandations stratégiques** — Traduire l'analyse en actions concrètes : fonctionnalités à développer en priorité, ajustements de pricing, messages marketing à adopter, segments de marché à cibler, partenariats à explorer. Prioriser par impact et faisabilité.

## Checklist de sortie

- [ ] Le périmètre d'analyse et les concurrents sont définis et justifiés
- [ ] Chaque concurrent est profilé (proposition de valeur, cible, modèle)
- [ ] La comparaison produit est réalisée feature par feature
- [ ] Le pricing et le business model sont analysés et comparés
- [ ] Les stratégies marketing et d'acquisition sont identifiées
- [ ] Les forces, faiblesses et opportunités sont synthétisées
- [ ] Les recommandations sont concrètes, priorisées et actionnables
- [ ] Le rapport est structuré pour être partageable avec les stakeholders

## Format de sortie

```markdown
## Analyse Concurrentielle

**Marché :** [secteur / segment analysé]
**Nombre de concurrents analysés :** [X]
**Période d'analyse :** [dates]
**Analyste :** [agent]
**Date :** [date]

### Vue d'ensemble du marché

**Taille du marché :** [estimation TAM/SAM/SOM]
**Croissance annuelle :** [X%]
**Tendances clés :**
1. [Tendance 1 et son impact]
2. [Tendance 2 et son impact]
3. [Tendance 3 et son impact]

### Cartographie des concurrents

| Concurrent | Type | Proposition de valeur | Cible | Taille | Levée / CA |
|------------|------|----------------------|-------|--------|------------|
| [Concurrent A] | Direct | [proposition] | [cible] | [équipe] | [montant] |
| [Concurrent B] | Direct | [proposition] | [cible] | [équipe] | [montant] |
| [Concurrent C] | Indirect | [proposition] | [cible] | [équipe] | [montant] |
| **Notre produit** | — | [proposition] | [cible] | [équipe] | [montant] |

### Comparaison fonctionnelle

| Fonctionnalité | Notre produit | Concurrent A | Concurrent B | Concurrent C |
|----------------|---------------|-------------|-------------|-------------|
| [Feature 1] | ✅ Complet | ✅ Complet | ⚠️ Partiel | ❌ Absent |
| [Feature 2] | ⚠️ Partiel | ✅ Complet | ✅ Complet | ✅ Complet |
| [Feature 3] | ❌ Absent | ❌ Absent | ✅ Complet | ❌ Absent |
| [Feature 4] | ✅ Complet | ⚠️ Partiel | ❌ Absent | ✅ Complet |

**Avantage concurrentiel clé de chaque acteur :**
- **Concurrent A :** [avantage distinctif]
- **Concurrent B :** [avantage distinctif]
- **Concurrent C :** [avantage distinctif]
- **Notre produit :** [avantage distinctif]

### Analyse du pricing

| Offre | Notre produit | Concurrent A | Concurrent B | Concurrent C |
|-------|---------------|-------------|-------------|-------------|
| Gratuit / Freemium | [détails] | [détails] | [détails] | [détails] |
| Entrée de gamme | [prix/mois] | [prix/mois] | [prix/mois] | [prix/mois] |
| Pro / Business | [prix/mois] | [prix/mois] | [prix/mois] | [prix/mois] |
| Enterprise | [prix/mois] | [prix/mois] | [prix/mois] | [prix/mois] |

**Positionnement prix :** [Premium | Aligné | Agressif | Value-based]

### Matrice SWOT par concurrent

#### Concurrent A
| Forces | Faiblesses |
|--------|------------|
| [force 1] | [faiblesse 1] |
| [force 2] | [faiblesse 2] |

| Opportunités | Menaces |
|-------------|---------|
| [opportunité 1] | [menace 1] |
| [opportunité 2] | [menace 2] |

### Opportunités identifiées

| # | Opportunité | Source | Impact potentiel | Faisabilité |
|---|-------------|--------|-----------------|-------------|
| 1 | [opportunité non adressée par le marché] | [analyse] | Élevé | [effort] |
| 2 | [segment sous-servi] | [analyse] | Moyen | [effort] |
| 3 | [fonctionnalité différenciante] | [analyse] | Élevé | [effort] |

### Recommandations stratégiques

| Priorité | Recommandation | Justification | Horizon |
|----------|---------------|---------------|---------|
| P0 | [action stratégique immédiate] | [basée sur l'analyse] | Court terme |
| P1 | [action à planifier] | [basée sur l'analyse] | Moyen terme |
| P2 | [action à explorer] | [basée sur l'analyse] | Long terme |

### Conclusion

**Position concurrentielle actuelle :** [Leader | Challenger | Suiveur | Niche]
**Principaux axes de différenciation :** [liste]
**Risques majeurs à surveiller :** [liste]
**Prochaine mise à jour recommandée :** [date]
```
