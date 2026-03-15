---
name: database-query
description: Optimisation et conception de requêtes et schémas de base de données — modélisation, indexation, plans d'exécution, migrations et bonnes pratiques
agents: [db, dev-backend, dev-fullstack, data]
trigger: /db
---

# Skill : Requêtes & Schémas de Base de Données

## Objectif

Concevoir des schémas de données robustes, écrire des requêtes performantes et optimiser les accès à la base de données. Cette skill couvre la modélisation relationnelle et NoSQL, l'indexation stratégique, l'analyse des plans d'exécution, les migrations et les bonnes pratiques de gestion des données.

## Quand l'utiliser

- Lors de la conception d'un nouveau schéma de base de données ou d'une nouvelle table
- Pour optimiser des requêtes lentes identifiées par le monitoring ou les logs
- Lors de la création de migrations (ajout de colonnes, refactoring de schéma)
- Quand un index doit être ajouté, modifié ou supprimé
- Pour résoudre des problèmes de performances liés aux requêtes N+1, full scans ou locks
- Lors d'un audit de la structure de la base de données existante

## Étapes

1. **Analyser le besoin métier** — Identifier les entités, leurs attributs et leurs relations. Comprendre les patterns d'accès dominants (lecture intensive, écriture intensive, analytique). Définir les contraintes métier (unicité, intégrité référentielle, soft delete).
2. **Concevoir le schéma** — Modéliser les tables, les types de colonnes, les contraintes (NOT NULL, UNIQUE, CHECK, FK), les valeurs par défaut. Appliquer la normalisation appropriée (3NF pour l'OLTP, dénormalisation ciblée pour la performance). Documenter les choix de modélisation.
3. **Définir la stratégie d'indexation** — Créer les index en fonction des patterns de requêtes : index simples pour les filtres fréquents, index composites pour les requêtes multi-colonnes (respecter l'ordre des colonnes), index partiels pour les sous-ensembles de données, index GIN pour JSONB/full-text.
4. **Rédiger et optimiser les requêtes** — Écrire les requêtes SQL en privilégiant la lisibilité. Utiliser `EXPLAIN ANALYZE` pour valider les plans d'exécution. Éliminer les sequential scans non désirés, les nested loops coûteux et les sorts en mémoire excessifs.
5. **Gérer les migrations** — Rédiger des migrations idempotentes et réversibles. Séparer les migrations de schéma (rapides) des migrations de données (potentiellement longues). Prévoir les migrations zero-downtime pour les environnements de production.
6. **Implémenter les contraintes de sécurité** — Configurer le Row-Level Security (RLS) pour l'isolation multi-tenant. Définir les rôles et permissions au niveau de la base. Chiffrer les colonnes sensibles si nécessaire.
7. **Optimiser les performances globales** — Configurer le connection pooling (PgBouncer, Prisma pool), ajuster les paramètres du serveur (`work_mem`, `shared_buffers`, `effective_cache_size`), planifier le VACUUM et l'analyse des statistiques.

## Checklist de sortie

- [ ] Le schéma est modélisé avec les types, contraintes et relations appropriés
- [ ] La normalisation est adaptée au cas d'usage (OLTP vs analytique)
- [ ] Les index sont définis en fonction des patterns de requêtes réels
- [ ] Les requêtes critiques sont validées avec `EXPLAIN ANALYZE`
- [ ] Aucun sequential scan non désiré sur les tables volumineuses
- [ ] Les migrations sont idempotentes, réversibles et zero-downtime
- [ ] La sécurité au niveau données (RLS, permissions) est configurée
- [ ] La documentation du schéma est à jour (diagramme ER, dictionnaire de données)

## Format de sortie

```markdown
## Conception / Optimisation Base de Données

**Base :** [PostgreSQL | MySQL | MongoDB | ...]
**Schéma :** [nom du schéma]
**Contexte :** [nouvelle table | optimisation | migration | audit]
**Date :** [date]

### Schéma proposé

```sql
CREATE TABLE orders (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      VARCHAR(20) NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status) WHERE status NOT IN ('delivered', 'cancelled');
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

### Analyse des requêtes

#### Requête : [description fonctionnelle]

**SQL :**
```sql
SELECT o.*, u.email
FROM orders o
JOIN users u ON u.id = o.user_id
WHERE o.status = 'pending'
  AND o.created_at > now() - INTERVAL '7 days'
ORDER BY o.created_at DESC
LIMIT 50;
```

**Plan d'exécution :**
```
Index Scan using idx_orders_status on orders o (cost=0.42..12.56 rows=50)
  Filter: (created_at > ...)
  -> Index Scan using users_pkey on users u
```

**Temps d'exécution :** X.XXms
**Verdict :** ✅ Optimal | ⚠️ Acceptable | ❌ À optimiser

### Migration

```sql
-- Migration : [description]
-- Direction : UP

ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_cents INTEGER DEFAULT 0;
CREATE INDEX CONCURRENTLY idx_orders_discount ON orders(discount_cents) WHERE discount_cents > 0;

-- Direction : DOWN

DROP INDEX IF EXISTS idx_orders_discount;
ALTER TABLE orders DROP COLUMN IF EXISTS discount_cents;
```

**Zero-downtime :** ✅ Oui — utilisation de `CONCURRENTLY` et colonnes nullable/default

### Recommandations

| Priorité | Action | Impact | Complexité |
|----------|--------|--------|------------|
| P0 | [action critique] | [gain attendu] | [effort] |
| P1 | [optimisation recommandée] | [gain attendu] | [effort] |
| P2 | [amélioration future] | [gain attendu] | [effort] |
```
