Lance le workflow défini dans le fichier suivant :

```yaml
name: bug-fix
description: "Correction de bug structurée — de l'analyse à la validation de la correction"
trigger: /bugfix
output_dir: "{cohesium_output}/bugfix_{timestamp}"
steps:
  - step: 1
    agent: qa
    action: "Analyser le bug, reproduire le problème et documenter les conditions"
    outputs: [bug-analysis.md, reproduction-steps.md]
  - step: 2
    agent: dev-fullstack
    action: "Proposer et implémenter la correction du bug"
    inputs: [01-qa/bug-analysis.md, 01-qa/reproduction-steps.md]
    outputs: [fix-proposal.md, fix-implementation.md]
    depends_on: [1]
  - step: 3
    agent: qa
    action: "Exécuter les tests de non-régression et valider la correction"
    inputs: [02-dev-fullstack/fix-proposal.md, 02-dev-fullstack/fix-implementation.md, 01-qa/bug-analysis.md]
    outputs: [regression-test.md, validation-report.md]
    depends_on: [2]

```

Suis les étapes dans l'ordre, en respectant les dépendances et le chaînage des livrables.
