Lance le workflow défini dans le fichier suivant :

```yaml
name: dependency-upgrade
description: "Mise à jour des dépendances — analyse des breaking changes, upgrade, tests de compatibilité"
trigger: /upgrade-deps
output_dir: "{cohesium_output}/upgrade-deps_{timestamp}"
steps:
  - step: 1
    agent: architect
    action: "Analyser les dépendances à mettre à jour, identifier les breaking changes et évaluer les risques"
    outputs: [dependency-audit.md, breaking-changes.md, risk-assessment.md]
  - step: 2
    agent: security
    action: "Vérifier les CVE connues sur les versions actuelles et valider les versions cibles"
    inputs: [01-architect/dependency-audit.md]
    outputs: [cve-report.md, version-recommendations.md]
    depends_on: [1]
  # Steps 3 can start after both 1 and 2
  - step: 3
    agent: dev-fullstack
    action: "Appliquer les mises à jour et corriger les breaking changes"
    inputs: [01-architect/dependency-audit.md, 01-architect/breaking-changes.md, 02-security/version-recommendations.md]
    outputs: [upgrade-log.md, migration-notes.md]
    depends_on: [1, 2]
  - step: 4
    agent: qa
    action: "Exécuter les tests de compatibilité et valider l'absence de régressions"
    inputs: [03-dev-fullstack/upgrade-log.md, 03-dev-fullstack/migration-notes.md]
    outputs: [compatibility-report.md, regression-results.md]
    depends_on: [3]
  - step: 5
    agent: devops
    action: "Déployer progressivement avec monitoring des métriques de performance"
    inputs: [03-dev-fullstack/upgrade-log.md, 04-qa/compatibility-report.md, 04-qa/regression-results.md]
    outputs: [rollout-plan.md, monitoring-dashboard.md]
    depends_on: [4]

```

Suis les étapes dans l'ordre, en respectant les dépendances et le chaînage des livrables.
