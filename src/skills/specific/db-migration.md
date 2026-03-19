---
name: db-migration
description: Création et gestion de migrations de base de données avec rollback et validation
agents: [db, dev-backend, dev-fullstack]
trigger: /migrate
---

# Skill : Database Migration

## Objectif
Créer, valider et appliquer des migrations de base de données de manière sécurisée et réversible. Gérer les changements de schéma (tables, colonnes, index, contraintes) avec des scripts de migration versionnés et des stratégies de rollback.

## Quand l'utiliser
- Lors de l'ajout, modification ou suppression de tables ou colonnes
- Quand un changement de schéma est nécessaire pour une nouvelle fonctionnalité
- Pour ajouter ou modifier des index, contraintes ou relations
- Lors de la migration de données existantes (data migration)
- Pour synchroniser le schéma entre environnements (dev, staging, production)

## Étapes
1. **Analyser le changement requis** — Identifier les modifications de schéma nécessaires, les tables impactées, les dépendances et les données existantes à préserver.
2. **Créer le fichier de migration** — Générer un fichier de migration horodaté avec un nom descriptif via l'outil de migration (Prisma, Knex, TypeORM, Alembic, Flyway).
3. **Écrire la migration UP** — Implémenter les changements de schéma dans la direction forward avec les types de données appropriés, les valeurs par défaut et les contraintes.
4. **Écrire la migration DOWN** — Implémenter le rollback complet pour permettre de revenir à l'état précédent sans perte de données.
5. **Gérer la migration de données** — Si nécessaire, écrire les scripts de transformation des données existantes avec gestion des volumes importants (batching).
6. **Valider en environnement de test** — Exécuter la migration et le rollback sur une copie de la base de données de production pour vérifier l'intégrité.
7. **Documenter les changements** — Mettre à jour le schéma de référence, les diagrammes ERD et le changelog des migrations.

## Checklist de sortie
- [ ] La migration UP s'exécute sans erreur sur une base de données propre
- [ ] La migration DOWN restaure exactement l'état précédent
- [ ] Les index nécessaires sont créés pour les performances
- [ ] Les contraintes d'intégrité (FK, UNIQUE, NOT NULL, CHECK) sont en place
- [ ] La migration de données préserve toutes les données existantes
- [ ] Le temps d'exécution est acceptable pour la production (pas de lock prolongé)
- [ ] La migration est idempotente ou protégée contre la double exécution
- [ ] Le fichier de migration suit la convention de nommage du projet

## Format de sortie
```
📄 Migration : <YYYYMMDDHHMMSS>_<description>.sql (ou .ts/.py)

-- UP Migration
ALTER TABLE <table>
  ADD COLUMN <column> <type> <constraints>;
CREATE INDEX idx_<table>_<column> ON <table>(<column>);

-- DOWN Migration
DROP INDEX idx_<table>_<column>;
ALTER TABLE <table>
  DROP COLUMN <column>;

Résumé des changements :
  - Tables modifiées : <liste>
  - Colonnes ajoutées : <liste avec types>
  - Index créés : <liste>
  - Temps estimé d'exécution : <durée>
  - Impact sur les données existantes : <description>
  - Rollback validé : oui/non
```
