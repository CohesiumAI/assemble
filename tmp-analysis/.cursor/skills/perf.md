---
name: performance-audit
description: Audit de performance — Core Web Vitals, optimisation des requêtes, analyse de charge, profiling et recommandations d'amélioration
agents: [dev-frontend, dev-backend, devops, data]
trigger: /perf
---

# Skill : Audit de Performance

## Objectif

Réaliser un audit de performance complet couvrant les métriques clés (Core Web Vitals, temps de réponse API, throughput, utilisation des ressources), identifier les goulots d'étranglement et produire un plan d'optimisation priorisé avec des gains estimés.

## Quand l'utiliser

- Quand les performances de l'application se dégradent (plaintes utilisateurs, monitoring)
- Avant un lancement ou une montée en charge anticipée (campagne marketing, saisonnalité)
- Lors d'un audit périodique de la santé technique du produit
- Après un déploiement ayant impacté les temps de réponse
- Pour établir des baselines de performance sur un nouveau projet
- Quand les scores Lighthouse ou Web Vitals sont en dessous des seuils acceptables

## Étapes

1. **Établir les baselines** — Mesurer les métriques actuelles : Core Web Vitals (LCP, FID/INP, CLS) pour le frontend, temps de réponse P50/P95/P99 pour les APIs, utilisation CPU/mémoire/disque pour l'infrastructure. Documenter les conditions de mesure.
2. **Profiler le frontend** — Analyser le chargement initial (bundle size, code splitting, lazy loading), le rendu (re-renders inutiles, layout thrashing, images non optimisées), les requêtes réseau (waterfall, requêtes bloquantes, cache strategy). Utiliser Lighthouse, Chrome DevTools Performance, WebPageTest.
3. **Profiler le backend** — Identifier les endpoints lents (APM, slow query logs), analyser les requêtes N+1, les appels sérialisés qui pourraient être parallélisés, les calculs bloquants sur le thread principal, les fuites mémoire. Profiler avec les outils adaptés (pprof, py-spy, clinic.js).
4. **Analyser les requêtes de base de données** — Examiner les plans d'exécution (`EXPLAIN ANALYZE`), identifier les index manquants, les full table scans, les jointures coûteuses, les requêtes non paginées. Vérifier la configuration du connection pooling.
5. **Évaluer la stratégie de cache** — Auditer les couches de cache (CDN, reverse proxy, application, base de données). Vérifier les hit ratios, les TTL appropriés, l'invalidation correcte. Identifier les données chaudes non cachées.
6. **Tester la charge** — Simuler des scénarios de charge réalistes (k6, Artillery, Locust) : charge normale, pic de trafic, montée progressive. Identifier le point de rupture et les ressources limitantes.
7. **Prioriser les optimisations** — Classer les problèmes par impact (gain estimé) et effort (complexité de correction). Appliquer la règle 80/20 : les optimisations les plus simples qui apportent le plus de gain.
8. **Rédiger le rapport** — Produire un rapport avec les métriques avant/après (quand des corrections ont été appliquées), les goulots identifiés et le plan d'action priorisé.

## Checklist de sortie

- [ ] Les baselines de performance sont mesurées et documentées
- [ ] Les Core Web Vitals sont analysés (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Les endpoints API lents sont identifiés avec leurs causes
- [ ] Les requêtes de base de données problématiques sont listées avec plans d'exécution
- [ ] La stratégie de cache est auditée et les lacunes identifiées
- [ ] Un test de charge a été réalisé avec identification du point de rupture
- [ ] Les optimisations sont priorisées par rapport impact/effort
- [ ] Le rapport contient des métriques concrètes et un plan d'action

## Format de sortie

```markdown
## Rapport d'Audit de Performance

**Application :** [nom de l'application / service]
**Environnement :** [production | staging | développement]
**Date :** [date]
**Auditeur :** [agent]

### Résumé exécutif

| Métrique | Valeur actuelle | Seuil cible | Statut |
|----------|----------------|-------------|--------|
| LCP (Largest Contentful Paint) | X.Xs | < 2.5s | ✅/⚠️/❌ |
| INP (Interaction to Next Paint) | Xms | < 200ms | ✅/⚠️/❌ |
| CLS (Cumulative Layout Shift) | X.XX | < 0.1 | ✅/⚠️/❌ |
| API P50 | Xms | < 200ms | ✅/⚠️/❌ |
| API P95 | Xms | < 1000ms | ✅/⚠️/❌ |
| API P99 | Xms | < 3000ms | ✅/⚠️/❌ |

**Score global :** [Excellent | Bon | À améliorer | Critique]

### Goulots d'étranglement identifiés

#### [PERF-01] Titre du problème — Sévérité : [Critique | Haute | Moyenne]

- **Composant :** [frontend | backend | database | infrastructure]
- **Description :** Explication technique du problème
- **Impact mesuré :** Métrique affectée et dégradation observée
- **Cause racine :** Analyse détaillée
- **Recommandation :** Solution technique avec estimation du gain
- **Effort :** [Faible | Moyen | Élevé]

### Analyse des requêtes DB

| Requête | Temps moyen | Appels/min | Index manquant | Recommandation |
|---------|------------|------------|----------------|----------------|
| [description] | Xms | X | Oui/Non | [action] |

### Test de charge

| Scénario | Utilisateurs simultanés | RPS | P95 latence | Taux d'erreur |
|----------|------------------------|-----|-------------|---------------|
| Charge normale | X | X | Xms | X% |
| Pic de trafic | X | X | Xms | X% |
| Point de rupture | X | X | Xms | X% |

### Plan d'optimisation priorisé

| Priorité | Action | Gain estimé | Effort | Responsable |
|----------|--------|-------------|--------|-------------|
| P0 | [action immédiate] | [gain] | [effort] | [équipe] |
| P1 | [action court terme] | [gain] | [effort] | [équipe] |
| P2 | [action moyen terme] | [gain] | [effort] | [équipe] |

### Prochaines étapes

- [ ] Implémenter les optimisations P0
- [ ] Re-mesurer les baselines après corrections
- [ ] Planifier les optimisations P1 dans le prochain sprint
- [ ] Configurer des alertes de performance automatiques
```

## Langue de travail

Tu communiques et rédiges tous tes échanges en **français**.
Les fichiers et livrables que tu produis sont rédigés en **english**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.

## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : `.\deliverables`
Respecte la structure de dossiers définie par le workflow en cours.
