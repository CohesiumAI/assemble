---
name: automation-workflow
description: Conception de workflow d'automatisation multi-outils avec declencheurs, actions, gestion d'erreurs et monitoring
agent: automation
trigger: /automate
---

# Skill : Automation Workflow

## Objectif
Concevoir et implementer un workflow d'automatisation complet en utilisant les outils no-code/low-code (n8n, Make, Zapier) ou des scripts personnalises. Definir les declencheurs, les etapes de transformation, les integrations tierces, la gestion des erreurs et le monitoring pour automatiser des processus metier repetitifs de maniere fiable.

## Quand l'utiliser
- Pour automatiser un processus metier repetitif impliquant plusieurs outils ou services
- Lors de la creation d'une integration entre deux systemes qui ne communiquent pas nativement
- Quand un flux de donnees doit etre automatise entre des applications (CRM, ERP, outil de ticketing, etc.)
- Pour mettre en place des notifications automatiques basees sur des evenements
- Lors de l'automatisation de taches de reporting, de synchronisation de donnees ou de provisioning

## Etapes
1. **Cartographier le processus actuel** — Documenter le processus manuel existant : etapes, acteurs, outils utilises, frequence d'execution, volume de donnees et temps passe. Identifier les points de douleur et les erreurs frequentes.
2. **Definir le workflow cible** — Concevoir le workflow automatise : declencheur (webhook, schedule, evenement), etapes de traitement, conditions de branchement, boucles et points de sortie. Produire un diagramme de flux.
3. **Selectionner les outils et connecteurs** — Choisir la plateforme d'automatisation adaptee (n8n pour le self-hosted, Make pour la flexibilite, Zapier pour la simplicite) et verifier la disponibilite des connecteurs pour chaque service implique.
4. **Configurer le declencheur** — Implementer le declencheur du workflow : webhook entrant, polling schedule (cron), evenement applicatif, file d'attente de messages ou declenchement manuel avec parametres.
5. **Implementer les etapes de traitement** — Configurer chaque noeud du workflow : appels API, transformations de donnees (mapping, filtrage, agregation), conditions logiques (if/else, switch) et boucles (for each).
6. **Gerer les erreurs et les retries** — Implementer la gestion des erreurs a chaque etape critique : retries avec backoff exponentiel, chemins d'erreur alternatifs, notifications d'echec et file de messages morts (dead letter queue).
7. **Tester le workflow de bout en bout** — Executer le workflow avec des donnees de test representatives, verifier chaque etape, valider les transformations de donnees et simuler les cas d'erreur pour verifier la resilience.
8. **Deployer et monitorer** — Activer le workflow en production, configurer les alertes de monitoring (echecs, latence, volume anormal), mettre en place les logs et definir les procedures de maintenance.

## Checklist de sortie
- [ ] Le processus actuel est documente et les gains de l'automatisation sont chiffres
- [ ] Le diagramme de flux du workflow est clair et valide par les parties prenantes
- [ ] Tous les connecteurs et API sont configures avec les authentifications appropriees
- [ ] Le declencheur fonctionne de maniere fiable (webhook verifie, schedule correct)
- [ ] Les transformations de donnees sont correctes et les mappings sont valides
- [ ] La gestion des erreurs est implementee avec retries et notifications d'echec
- [ ] Le workflow est teste avec des donnees representatives (cas nominal et cas d'erreur)
- [ ] Le monitoring et les alertes sont en place pour la supervision en production

## Format de sortie
```
Specification de Workflow d'Automatisation

Nom : [nom descriptif du workflow]
Plateforme : [n8n / Make / Zapier / script custom]
Concepteur : [agent automation]
Date : [date]
Frequence : [temps reel / toutes les X minutes / quotidien / hebdomadaire]

Processus automatise :
  - Description : [ce que fait le workflow en une phrase]
  - Declencheur : [webhook / schedule / evenement]
  - Volume estime : [X executions par jour/semaine]
  - Temps economise : [X heures par semaine]

Diagramme de flux :
  [Declencheur] → [Etape 1 : Recuperation donnees]
                 → [Etape 2 : Transformation / Filtrage]
                 → [Condition : validation]
                    → OUI → [Etape 3A : Action principale]
                           → [Etape 4 : Notification succes]
                    → NON → [Etape 3B : Gestion rejet]
                           → [Etape 4B : Alerte equipe]

Services integres :
  | Service        | Connecteur | Action                   | Authentification |
  |----------------|-----------|--------------------------|-----------------|
  | [Service 1]    | API REST  | Recuperer donnees        | API Key         |
  | [Service 2]    | Webhook   | Envoyer notification     | OAuth 2.0       |
  | [Service 3]    | SDK natif | Creer enregistrement     | Token           |

Gestion des erreurs :
  - Retry : 3 tentatives avec backoff exponentiel (1s, 5s, 30s)
  - Notification d'echec : [Slack / email / PagerDuty]
  - Dead letter queue : [activee / desactivee]
  - Fallback : [action alternative en cas d'echec definitif]

Monitoring :
  - Dashboard : [lien vers le tableau de bord]
  - Alertes : [conditions de declenchement des alertes]
  - Logs : [retention et niveau de detail]
  - SLA : [temps de reponse attendu, taux de succes cible]
```
