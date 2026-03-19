Lance le workflow défini dans le fichier suivant :

```yaml
name: mvp-launch
description: "Lancement d'un MVP de A à Z — de la vision produit au déploiement"
trigger: /mvp
output_dir: "{cohesium_output}/mvp_{timestamp}"
steps:
  - step: 1
    agent: pm
    action: "Définir la vision produit, les user stories et le scope MVP"
    outputs: [product-brief.md, user-stories.md]
  # Steps 2, 3 & 4 can run in parallel (all depend on step 1)
  - step: 2
    agent: architect
    action: "Concevoir l'architecture technique du MVP"
    inputs: [01-pm/product-brief.md]
    outputs: [architecture-decision.md, tech-stack.md]
    depends_on: [1]
  - step: 3
    agent: ux
    action: "Créer les wireframes des écrans clés"
    inputs: [01-pm/product-brief.md, 01-pm/user-stories.md]
    outputs: [wireframes.md, user-flows.md]
    depends_on: [1]
  - step: 4
    agent: brand
    action: "Définir le positionnement de marque, le ton et les guidelines visuelles"
    inputs: [01-pm/product-brief.md]
    outputs: [brand-positioning.md, voice-and-tone.md]
    depends_on: [1]
  - step: 5
    agent: db
    action: "Concevoir le schéma de données"
    inputs: [02-architect/architecture-decision.md, 01-pm/user-stories.md]
    outputs: [schema.md, migrations.md]
    depends_on: [2]
  - step: 6
    agent: dev-backend
    action: "Développer l'API et la logique métier"
    inputs: [02-architect/architecture-decision.md, 02-architect/tech-stack.md, 05-db/schema.md]
    outputs: [api-spec.md, endpoints.md]
    depends_on: [2, 5]
  - step: 7
    agent: dev-frontend
    action: "Développer l'interface utilisateur"
    inputs: [03-ux/wireframes.md, 03-ux/user-flows.md, 04-brand/voice-and-tone.md, 06-dev-backend/api-spec.md, 06-dev-backend/endpoints.md]
    outputs: [components.md, pages.md]
    depends_on: [3, 4, 6]
  - step: 8
    agent: qa
    action: "Tester le MVP end-to-end"
    inputs: [06-dev-backend/api-spec.md, 07-dev-frontend/components.md, 01-pm/user-stories.md]
    outputs: [test-plan.md, test-report.md]
    depends_on: [6, 7]
  - step: 9
    agent: devops
    action: "Mettre en place le CI/CD et le déploiement"
    inputs: [02-architect/tech-stack.md, 08-qa/test-report.md]
    outputs: [deployment-guide.md, ci-cd-config.md]
    depends_on: [8]

```

Suis les étapes dans l'ordre, en respectant les dépendances et le chaînage des livrables.
