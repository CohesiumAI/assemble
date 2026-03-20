---
name: db-migration
description: Database migration creation and management with rollback and validation
agents: [db, dev-backend, dev-fullstack]
trigger: /migrate
---

# Skill : Database Migration

## Objective
Create, validate, and apply database migrations in a secure and reversible manner. Manage schema changes (tables, columns, indexes, constraints) with versioned migration scripts and rollback strategies.

## When to use
- When adding, modifying, or deleting tables or columns
- When a schema change is needed for a new feature
- To add or modify indexes, constraints, or relationships
- During existing data migration (data migration)
- To synchronize schema between environments (dev, staging, production)

## Steps
1. **Analyze the required change** — Identify necessary schema modifications, impacted tables, dependencies, and existing data to preserve.
2. **Create the migration file** — Generate a timestamped migration file with a descriptive name via the migration tool (Prisma, Knex, TypeORM, Alembic, Flyway).
3. **Write the UP migration** — Implement schema changes in the forward direction with appropriate data types, default values, and constraints.
4. **Write the DOWN migration** — Implement complete rollback to allow returning to the previous state without data loss.
5. **Handle data migration** — If necessary, write transformation scripts for existing data with large volume handling (batching).
6. **Validate in test environment** — Run the migration and rollback on a copy of the production database to verify integrity.
7. **Document the changes** — Update the reference schema, ERD diagrams, and migration changelog.

## Exit Checklist
- [ ] UP migration executes without errors on a clean database
- [ ] DOWN migration restores exactly the previous state
- [ ] Required indexes are created for performance
- [ ] Integrity constraints (FK, UNIQUE, NOT NULL, CHECK) are in place
- [ ] Data migration preserves all existing data
- [ ] Execution time is acceptable for production (no prolonged locks)
- [ ] Migration is idempotent or protected against double execution
- [ ] Migration file follows the project naming convention

## Output Format
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

Summary of changes :
  - Modified tables : <list>
  - Added columns : <list with types>
  - Created indexes : <list>
  - Estimated execution time : <duration>
  - Impact on existing data : <description>
  - Rollback validated : yes/no
```
