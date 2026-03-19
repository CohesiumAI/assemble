---
name: monitoring
description: Mise en place et analyse du monitoring et de l'observabilité — métriques, logs, traces, alerting et tableaux de bord opérationnels
agents: [devops, data, dev-backend]
trigger: /monitor
---

# Skill : Monitoring & Observabilité

## Objectif

Mettre en place une stratégie d'observabilité complète couvrant les trois piliers (métriques, logs, traces), configurer des alertes pertinentes et créer des tableaux de bord opérationnels. Cette skill permet de détecter, diagnostiquer et résoudre rapidement les incidents en production.

## Quand l'utiliser

- Lors de la mise en production d'un nouveau service ou microservice
- Pour diagnostiquer un incident ou une dégradation de performance en production
- Quand le système d'alerting génère trop de bruit (false positives) ou est insuffisant
- Lors de la migration vers une nouvelle stack d'observabilité
- Pour créer ou améliorer les dashboards opérationnels d'un service existant
- Quand les SLO/SLI doivent être définis ou révisés

## Étapes

1. **Identifier les signaux critiques** — Appliquer la méthode RED (Rate, Errors, Duration) pour les services et USE (Utilization, Saturation, Errors) pour les ressources. Définir les métriques métier clés (taux de conversion, commandes/minute, latence de traitement). Cartographier les dépendances du service.
2. **Instrumenter l'application** — Ajouter les métriques custom (compteurs, histogrammes, jauges) avec Prometheus/OpenTelemetry. Configurer le structured logging (JSON) avec les champs standards (request_id, user_id, service, level, timestamp). Implémenter le distributed tracing avec les spans appropriés.
3. **Configurer la collecte et le stockage** — Déployer les agents de collecte (Prometheus scraper, Fluentd/Vector, OpenTelemetry Collector). Configurer la rétention des données par niveau : métriques haute résolution (15 jours), agrégées (90 jours), logs (30 jours), traces (7 jours).
4. **Définir les SLO et les error budgets** — Établir les Service Level Objectives en accord avec les besoins métier : disponibilité (99.9% = 43min de downtime/mois), latence (P95 < 500ms), taux d'erreur (< 0.1%). Calculer les error budgets et définir les actions quand ils sont consommés.
5. **Configurer les alertes** — Créer des alertes basées sur les symptômes (pas les causes) avec des seuils appropriés. Implémenter des alertes multi-niveaux : warning (notification Slack), critical (page PagerDuty/OpsGenie). Éviter l'alert fatigue en regroupant et en dédupliquant.
6. **Créer les dashboards** — Construire des tableaux de bord par audience : overview opérationnel (SRE), détail service (développeurs), métriques métier (product). Suivre le principe des 4 Golden Signals : latence, trafic, erreurs, saturation.
7. **Documenter les runbooks** — Pour chaque alerte critique, rédiger un runbook : description de l'alerte, diagnostic étape par étape, actions correctives, critères d'escalade. Lier chaque alerte à son runbook dans le système de notification.
8. **Valider et itérer** — Tester les alertes avec des incidents simulés (chaos engineering). Revoir mensuellement les alertes déclenchées : supprimer celles non actionnables, ajuster les seuils, ajouter les alertes manquantes identifiées lors d'incidents réels.

## Checklist de sortie

- [ ] Les métriques RED/USE sont collectées pour chaque service et ressource
- [ ] Le structured logging est implémenté avec les champs standards
- [ ] Le distributed tracing est opérationnel avec corrélation logs-traces
- [ ] Les SLO sont définis et les error budgets calculés
- [ ] Les alertes couvrent les symptômes critiques sans alert fatigue
- [ ] Les dashboards sont créés par audience (ops, dev, product)
- [ ] Un runbook existe pour chaque alerte critique
- [ ] Le système a été testé avec un incident simulé

## Format de sortie

```markdown
## Plan de Monitoring & Observabilité

**Service :** [nom du service]
**Stack :** [Prometheus + Grafana | Datadog | New Relic | ELK | ...]
**Environnement :** [production | staging]
**Date :** [date]

### SLO définis

| SLI | Objectif (SLO) | Fenêtre | Error budget |
|-----|----------------|---------|--------------|
| Disponibilité | 99.9% | 30 jours | 43 min |
| Latence P95 | < 500ms | 30 jours | 0.1% requêtes |
| Taux d'erreur (5xx) | < 0.1% | 30 jours | [budget] |

### Métriques instrumentées

#### Métriques applicatives (RED)
| Métrique | Type | Labels | Description |
|----------|------|--------|-------------|
| `http_requests_total` | Counter | method, path, status | Nombre total de requêtes HTTP |
| `http_request_duration_seconds` | Histogram | method, path | Durée des requêtes |
| `http_errors_total` | Counter | method, path, error_code | Nombre d'erreurs |

#### Métriques infrastructure (USE)
| Ressource | Utilization | Saturation | Errors |
|-----------|-------------|------------|--------|
| CPU | `cpu_usage_percent` | `cpu_throttled_seconds` | — |
| Mémoire | `memory_usage_bytes` | `memory_oom_kills` | — |
| Disque | `disk_usage_percent` | `disk_io_queue_length` | `disk_errors` |
| Réseau | `network_bytes_total` | `network_drops_total` | `network_errors` |

### Alertes configurées

| Alerte | Condition | Sévérité | Canal | Runbook |
|--------|-----------|----------|-------|---------|
| Service indisponible | `up == 0` pendant 2min | Critical | PagerDuty | [lien] |
| Latence élevée | `P95 > 1s` pendant 5min | Warning | Slack #ops | [lien] |
| Taux d'erreur élevé | `5xx > 1%` pendant 5min | Critical | PagerDuty | [lien] |
| Error budget < 20% | Budget mensuel consommé à 80% | Warning | Slack #ops | [lien] |

### Dashboard principal

**Panels recommandés :**
1. Trafic — requêtes/seconde par endpoint (graphe temporel)
2. Latence — P50/P95/P99 par endpoint (graphe temporel)
3. Taux d'erreur — pourcentage 4xx/5xx (graphe temporel + seuil)
4. Saturation — CPU, mémoire, connexions DB (jauges)
5. SLO burn rate — consommation de l'error budget (indicateur)
6. Dépendances — latence et disponibilité des services externes (tableau)

### Template de runbook

#### Alerte : [Nom de l'alerte]
1. **Vérifier** — Confirmer l'alerte via le dashboard [lien]
2. **Diagnostiquer** — Consulter les logs : `kubectl logs -l app=service --since=10m`
3. **Corréler** — Vérifier les traces associées dans [outil de tracing]
4. **Agir** — [Action corrective spécifique]
5. **Escalader** — Si non résolu en 15min, contacter [équipe/personne]
6. **Post-mortem** — Documenter l'incident dans [outil]
```

## Langue de travail

Tu communiques et rédiges tous tes échanges en **français**.
Les fichiers et livrables que tu produis sont rédigés en **english**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.

## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : `.\deliverables`
Respecte la structure de dossiers définie par le workflow en cours.
