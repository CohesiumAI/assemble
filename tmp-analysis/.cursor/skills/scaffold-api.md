---
name: backend-api-scaffold
description: Scaffolding complet d'une API backend avec structure, routes, contrôleurs et documentation
agents: [dev-backend, dev-fullstack, architect]
trigger: /scaffold-api
---

# Skill : Backend API Scaffold

## Objectif
Générer la structure complète d'une API backend incluant les routes, contrôleurs, modèles, middlewares, validateurs et documentation OpenAPI. Le scaffolding produit un code prêt à l'emploi respectant les bonnes pratiques REST et les conventions du projet.

## Quand l'utiliser
- Lors de la création d'un nouveau service ou microservice backend
- Quand une nouvelle ressource API doit être exposée avec les opérations CRUD
- Pour initialiser un module backend avec toutes les couches (route, contrôleur, service, repository)
- Lors de l'ajout d'un nouveau domaine métier nécessitant des endpoints dédiés

## Étapes
1. **Analyser les spécifications** — Identifier la ressource, ses attributs, ses relations et les opérations requises (GET, POST, PUT, PATCH, DELETE).
2. **Définir le modèle de données** — Créer le schéma/modèle avec les types, validations, valeurs par défaut et index nécessaires.
3. **Générer les routes** — Créer le fichier de routes avec les endpoints RESTful, les middlewares d'authentification et de validation.
4. **Implémenter les contrôleurs** — Écrire les fonctions de contrôleur pour chaque endpoint avec gestion des erreurs standardisée.
5. **Créer la couche service** — Implémenter la logique métier dans une couche service découplée des contrôleurs.
6. **Ajouter les validateurs** — Définir les schémas de validation des entrées (body, query, params) avec Zod, Joi ou class-validator.
7. **Écrire les tests unitaires** — Créer les fichiers de test pour les contrôleurs et services avec les cas nominaux et les cas d'erreur.
8. **Générer la documentation OpenAPI** — Ajouter les annotations Swagger/OpenAPI pour chaque endpoint avec exemples de requêtes et réponses.

## Checklist de sortie
- [ ] Tous les endpoints CRUD sont définis et fonctionnels
- [ ] Les validations d'entrée sont en place pour chaque route
- [ ] La gestion des erreurs est standardisée (codes HTTP, format de réponse)
- [ ] Les middlewares d'authentification et d'autorisation sont appliqués
- [ ] Les tests unitaires couvrent les cas nominaux et les cas limites
- [ ] La documentation OpenAPI est complète et à jour
- [ ] Le code respecte les conventions de nommage du projet
- [ ] Les variables d'environnement nécessaires sont documentées

## Format de sortie
```
📁 src/modules/<resource>/
├── <resource>.controller.ts    — Contrôleurs des endpoints
├── <resource>.service.ts       — Logique métier
├── <resource>.repository.ts    — Accès aux données
├── <resource>.model.ts         — Définition du modèle/schéma
├── <resource>.routes.ts        — Définition des routes
├── <resource>.validator.ts     — Schémas de validation
├── <resource>.types.ts         — Interfaces et types TypeScript
├── <resource>.test.ts          — Tests unitaires
└── <resource>.docs.ts          — Documentation OpenAPI

Routes créées :
  GET    /api/v1/<resources>        — Liste avec pagination et filtres
  GET    /api/v1/<resources>/:id    — Détail d'une ressource
  POST   /api/v1/<resources>        — Création d'une ressource
  PUT    /api/v1/<resources>/:id    — Mise à jour complète
  PATCH  /api/v1/<resources>/:id    — Mise à jour partielle
  DELETE /api/v1/<resources>/:id    — Suppression d'une ressource
```

## Langue de travail

Tu communiques et rédiges tous tes échanges en **français**.
Les fichiers et livrables que tu produis sont rédigés en **english**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.

## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : `.\deliverables`
Respecte la structure de dossiers définie par le workflow en cours.
