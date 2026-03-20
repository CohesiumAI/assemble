---
name: api-design
description: REST/GraphQL API design — interface contracts, versioning, pagination, error handling, OpenAPI documentation and best practices
agents: [dev-backend, dev-fullstack, architect, dev-mobile]
trigger: /api
---

# Skill : API Design

## Objective

Design robust, consistent, and well-documented REST or GraphQL APIs following industry standards. This skill covers contract definition, versioning, pagination, error handling, authentication, and OpenAPI/GraphQL SDL documentation generation.

## When to use

- When designing a new API or a new API module
- To standardize conventions of an existing API
- When an interface contract must be defined between frontend and backend
- When adding versioning or pagination to an existing API
- To generate or update OpenAPI / GraphQL SDL documentation
- When a third-party API needs to be encapsulated in a clean abstraction

## Steps

1. **Identify resources and operations** — List the business entities involved and CRUD operations + specific actions. For GraphQL, identify queries, mutations, and subscriptions. Define relationships between resources (1:1, 1:N, N:N).
2. **Define endpoints and naming** — Apply REST conventions: plural resource names, correct HTTP verbs (GET, POST, PUT, PATCH, DELETE), logical hierarchy (`/users/{id}/orders`). For GraphQL, structure the schema with clear types and explicit field names.
3. **Design data schemas** — Define request body and response structures for each endpoint. Use a validation system (Zod, JSON Schema, Pydantic). Document each field with its type, cardinality, and constraints.
4. **Implement pagination and filtering** — Choose the pagination strategy: offset-based (simple, suited for stable lists), cursor-based (performant, suited for streams). Define standardized filtering, sorting, and search parameters.
5. **Define error handling** — Standardize the error format with a machine code, a human-readable message, and contextual details. Map appropriate HTTP codes (400, 401, 403, 404, 409, 422, 429, 500). Implement Problem Details (RFC 7807) if relevant.
6. **Configure authentication and rate limiting** — Document the auth mechanism (JWT Bearer, API Key, OAuth2 scopes), per-endpoint permissions, quotas, and rate limiting. Define associated response headers (`X-RateLimit-*`).
7. **Define the versioning strategy** — Choose between URL versioning (`/v1/`), header versioning (`Accept: application/vnd.api.v1+json`), or query parameter. Define the deprecation policy and support for legacy versions.
8. **Generate documentation** — Produce the complete OpenAPI 3.x (REST) or SDL (GraphQL) specification with descriptions, examples, and response codes. Include curl/httpie request examples.

## Exit Checklist

- [ ] Resources and operations are identified and named following conventions
- [ ] Request and response schemas are defined with validation
- [ ] Pagination is implemented (offset or cursor) with configured limits
- [ ] Error format is standardized with appropriate HTTP codes
- [ ] Authentication and permissions are documented per endpoint
- [ ] Versioning strategy is defined and applied
- [ ] OpenAPI/SDL documentation is complete and up to date
- [ ] Working request examples are provided (curl/httpie)

## Output Format

```markdown
## API Design

**Project :** [project / service name]
**Type :** [REST | GraphQL | gRPC]
**Version :** [v1 | v2 | ...]
**Base URL :** [https://api.example.com/v1]
**Date :** [date]

### Resources

| Resource | Description | Operations |
|----------|-------------|------------|
| /users | User management | GET, POST, GET/:id, PATCH/:id, DELETE/:id |
| /users/:id/orders | User orders | GET, POST |

### Detailed Contract

#### `POST /resource`

**Description :** Create a new resource
**Auth :** Bearer JWT — Scope `resource:write`
**Rate limit :** 100 req/min

**Request Body :**
```json
{
  "field_1": "string (required) — description",
  "field_2": 42,
  "nested": {
    "sub_field": "string (optional)"
  }
}
```

**Responses :**

| Code | Description | Body |
|------|-------------|------|
| 201 | Resource created | `{ "id": "uuid", "field_1": "...", "created_at": "ISO8601" }` |
| 400 | Invalid data | `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }` |
| 401 | Not authenticated | `{ "error": { "code": "UNAUTHORIZED", "message": "..." } }` |
| 409 | Conflict | `{ "error": { "code": "DUPLICATE_RESOURCE", "message": "..." } }` |

**curl example :**
```bash
curl -X POST https://api.example.com/v1/resource \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"field_1": "value", "field_2": 42}'
```

### Pagination

**Strategy :** [Offset | Cursor]

```json
{
  "data": [...],
  "pagination": {
    "total": 142,
    "page": 2,
    "per_page": 20,
    "next_cursor": "eyJpZCI6MTIzfQ=="
  }
}
```

### Standardized error format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [
      { "field": "email", "issue": "Invalid format" }
    ],
    "request_id": "req_abc123"
  }
}
```

### Versioning

**Strategy :** URL prefix (`/v1/`, `/v2/`)
**Deprecation policy :** 6 months of support after deprecation announcement
**Deprecation header :** `Deprecation: true`, `Sunset: <date>`
```
