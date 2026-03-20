---
name: database-query
description: Database query and schema design and optimization — modeling, indexing, execution plans, migrations, and best practices
agents: [db, dev-backend, dev-fullstack, data]
trigger: /db
---

# Skill : Database Queries & Schemas

## Objective

Design robust data schemas, write performant queries, and optimize database access. This skill covers relational and NoSQL modeling, strategic indexing, execution plan analysis, migrations, and data management best practices.

## When to use

- When designing a new database schema or table
- To optimize slow queries identified by monitoring or logs
- When creating migrations (adding columns, schema refactoring)
- When an index needs to be added, modified, or removed
- To resolve performance issues related to N+1 queries, full scans, or locks
- During an audit of the existing database structure

## Steps

1. **Analyze business needs** — Identify entities, their attributes, and relationships. Understand dominant access patterns (read-intensive, write-intensive, analytical). Define business constraints (uniqueness, referential integrity, soft delete).
2. **Design the schema** — Model tables, column types, constraints (NOT NULL, UNIQUE, CHECK, FK), default values. Apply appropriate normalization (3NF for OLTP, targeted denormalization for performance). Document modeling choices.
3. **Define the indexing strategy** — Create indexes based on query patterns: simple indexes for frequent filters, composite indexes for multi-column queries (respect column order), partial indexes for data subsets, GIN indexes for JSONB/full-text.
4. **Write and optimize queries** — Write SQL queries prioritizing readability. Use `EXPLAIN ANALYZE` to validate execution plans. Eliminate unwanted sequential scans, costly nested loops, and excessive in-memory sorts.
5. **Manage migrations** — Write idempotent and reversible migrations. Separate schema migrations (fast) from data migrations (potentially long). Plan zero-downtime migrations for production environments.
6. **Implement security constraints** — Configure Row-Level Security (RLS) for multi-tenant isolation. Define roles and permissions at the database level. Encrypt sensitive columns if necessary.
7. **Optimize overall performance** — Configure connection pooling (PgBouncer, Prisma pool), adjust server parameters (`work_mem`, `shared_buffers`, `effective_cache_size`), schedule VACUUM and statistics analysis.

## Exit Checklist

- [ ] Schema is modeled with appropriate types, constraints, and relationships
- [ ] Normalization is adapted to the use case (OLTP vs analytical)
- [ ] Indexes are defined based on actual query patterns
- [ ] Critical queries are validated with `EXPLAIN ANALYZE`
- [ ] No unwanted sequential scan on large tables
- [ ] Migrations are idempotent, reversible, and zero-downtime
- [ ] Data-level security (RLS, permissions) is configured
- [ ] Schema documentation is up to date (ER diagram, data dictionary)

## Output Format

```markdown
## Database Design / Optimization

**Database :** [PostgreSQL | MySQL | MongoDB | ...]
**Schema :** [schema name]
**Context :** [new table | optimization | migration | audit]
**Date :** [date]

### Proposed schema

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

-- Indexes for frequent queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status) WHERE status NOT IN ('delivered', 'cancelled');
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

### Query analysis

#### Query : [functional description]

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

**Execution plan :**
```
Index Scan using idx_orders_status on orders o (cost=0.42..12.56 rows=50)
  Filter: (created_at > ...)
  -> Index Scan using users_pkey on users u
```

**Execution time :** X.XXms
**Verdict :** ✅ Optimal | ⚠️ Acceptable | ❌ Needs optimization

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

**Zero-downtime :** ✅ Yes — using `CONCURRENTLY` and nullable/default columns

### Recommendations

| Priority | Action | Impact | Complexity |
|----------|--------|--------|------------|
| P0 | [critical action] | [expected gain] | [effort] |
| P1 | [recommended optimization] | [expected gain] | [effort] |
| P2 | [future improvement] | [expected gain] | [effort] |
```
