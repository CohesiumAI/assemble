---
name: automation-workflow
description: Conception de workflow d'automatisation multi-outils avec déclencheurs, actions, gestion d'erreurs et monitoring
agents: [automation, devops, dev-backend]
trigger: /automate
---

# Skill : Automation Workflow

## Objectif
Concevoir et implémenter un workflow d'automatisation complet en utilisant les outils no-code/low-code (n8n, Make, Zapier) ou des scripts personnalisés. Définir les déclencheurs, les étapes de transformation, les intégrations tierces, la gestion des erreurs et le monitoring pour automatiser des processus métier répétitifs de manière fiable.

## Quand l'utiliser
- Pour automatiser un processus métier répétitif impliquant plusieurs outils ou services
- Lors de la création d'une intégration entre deux systèmes qui ne communiquent pas nativement
- Quand un flux de données doit être automatisé entre des applications (CRM, ERP, outil de ticketing, etc.)
- Pour mettre en place des notifications automatiques basées sur des événements
- Lors de l'automatisation de tâches de reporting, de synchronisation de données ou de provisioning

## Étapes
1. **Cartographier le processus actuel** — Documenter le processus manuel existant : étapes, acteurs, outils utilisés, fréquence d'exécution, volume de données et temps passé. Identifier les points de douleur et les erreurs fréquentes.
2. **Définir le workflow cible** — Concevoir le workflow automatisé : déclencheur (webhook, schedule, événement), étapes de traitement, conditions de branchement, boucles et points de sortie. Produire un diagramme de flux.
3. **Sélectionner les outils et connecteurs** — Choisir la plateforme d'automatisation adaptée (n8n pour le self-hosted, Make pour la flexibilité, Zapier pour la simplicité) et vérifier la disponibilité des connecteurs pour chaque service impliqué.
4. **Configurer le déclencheur** — Implémenter le déclencheur du workflow : webhook entrant, polling schedule (cron), événement applicatif, file d'attente de messages ou déclenchement manuel avec paramètres.
5. **Implémenter les étapes de traitement** — Configurer chaque noeud du workflow : appels API, transformations de données (mapping, filtrage, agrégation), conditions logiques (if/else, switch) et boucles (for each).
6. **Gérer les erreurs et les retries** — Implémenter la gestion des erreurs à chaque étape critique : retries avec backoff exponentiel, chemins d'erreur alternatifs, notifications d'échec et file de messages morts (dead letter queue).
7. **Tester le workflow de bout en bout** — Exécuter le workflow avec des données de test représentatives, vérifier chaque étape, valider les transformations de données et simuler les cas d'erreur pour vérifier la résilience.
8. **Déployer et monitorer** — Activer le workflow en production, configurer les alertes de monitoring (échecs, latence, volume anormal), mettre en place les logs et définir les procédures de maintenance.

## Checklist de sortie
- [ ] Le processus actuel est documenté et les gains de l'automatisation sont chiffrés
- [ ] Le diagramme de flux du workflow est clair et validé par les parties prenantes
- [ ] Tous les connecteurs et API sont configurés avec les authentifications appropriées
- [ ] Le déclencheur fonctionne de manière fiable (webhook vérifié, schedule correct)
- [ ] Les transformations de données sont correctes et les mappings sont validés
- [ ] La gestion des erreurs est implémentée avec retries et notifications d'échec
- [ ] Le workflow est testé avec des données représentatives (cas nominal et cas d'erreur)
- [ ] Le monitoring et les alertes sont en place pour la supervision en production

## Format de sortie
```
Spécification de Workflow d'Automatisation

Nom : [nom descriptif du workflow]
Plateforme : [n8n / Make / Zapier / script custom]
Concepteur : [agent automation]
Date : [date]
Fréquence : [temps réel / toutes les X minutes / quotidien / hebdomadaire]

Processus automatisé :
  - Description : [ce que fait le workflow en une phrase]
  - Déclencheur : [webhook / schedule / événement]
  - Volume estimé : [X exécutions par jour/semaine]
  - Temps économisé : [X heures par semaine]

Diagramme de flux :
  [Déclencheur] → [Étape 1 : Récupération données]
                 → [Étape 2 : Transformation / Filtrage]
                 → [Condition : validation]
                    → OUI → [Étape 3A : Action principale]
                           → [Étape 4 : Notification succès]
                    → NON → [Étape 3B : Gestion rejet]
                           → [Étape 4B : Alerte équipe]

Services intégrés :
  | Service        | Connecteur | Action                   | Authentification |
  |----------------|-----------|--------------------------|-----------------|
  | [Service 1]    | API REST  | Récupérer données        | API Key         |
  | [Service 2]    | Webhook   | Envoyer notification     | OAuth 2.0       |
  | [Service 3]    | SDK natif | Créer enregistrement     | Token           |

Gestion des erreurs :
  - Retry : 3 tentatives avec backoff exponentiel (1s, 5s, 30s)
  - Notification d'échec : [Slack / email / PagerDuty]
  - Dead letter queue : [activée / désactivée]
  - Fallback : [action alternative en cas d'échec définitif]

Monitoring :
  - Dashboard : [lien vers le tableau de bord]
  - Alertes : [conditions de déclenchement des alertes]
  - Logs : [rétention et niveau de détail]
  - SLA : [temps de réponse attendu, taux de succès cible]
```

## Langue de travail

Tu communiques et rédiges tous tes échanges en **français**.
Les fichiers et livrables que tu produis sont rédigés en **english**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.

## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : `.\deliverables`
Respecte la structure de dossiers définie par le workflow en cours.
