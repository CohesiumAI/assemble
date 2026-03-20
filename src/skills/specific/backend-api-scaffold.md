---
name: backend-api-scaffold
description: Complete backend API scaffolding with structure, routes, controllers, and documentation
agents: [dev-backend, dev-fullstack, architect]
trigger: /scaffold-api
---

# Skill : Backend API Scaffold

## Objective
Generate the complete structure of a backend API including routes, controllers, models, middlewares, validators, and OpenAPI documentation. The scaffolding produces ready-to-use code following REST best practices and project conventions.

## When to use
- When creating a new backend service or microservice
- When a new API resource needs to be exposed with CRUD operations
- To initialize a backend module with all layers (route, controller, service, repository)
- When adding a new business domain requiring dedicated endpoints

## Steps
1. **Analyze specifications** — Identify the resource, its attributes, relationships, and required operations (GET, POST, PUT, PATCH, DELETE).
2. **Define the data model** — Create the schema/model with types, validations, default values, and required indexes.
3. **Generate routes** — Create the routes file with RESTful endpoints, authentication and validation middlewares.
4. **Implement controllers** — Write controller functions for each endpoint with standardized error handling.
5. **Create the service layer** — Implement business logic in a service layer decoupled from controllers.
6. **Add validators** — Define input validation schemas (body, query, params) with Zod, Joi, or class-validator.
7. **Write unit tests** — Create test files for controllers and services with nominal and error cases.
8. **Generate OpenAPI documentation** — Add Swagger/OpenAPI annotations for each endpoint with request and response examples.

## Exit Checklist
- [ ] All CRUD endpoints are defined and functional
- [ ] Input validations are in place for each route
- [ ] Error handling is standardized (HTTP codes, response format)
- [ ] Authentication and authorization middlewares are applied
- [ ] Unit tests cover nominal and edge cases
- [ ] OpenAPI documentation is complete and up to date
- [ ] Code follows the project naming conventions
- [ ] Required environment variables are documented

## Output Format
```
📁 src/modules/<resource>/
├── <resource>.controller.ts    — Endpoint controllers
├── <resource>.service.ts       — Business logic
├── <resource>.repository.ts    — Data access
├── <resource>.model.ts         — Model/schema definition
├── <resource>.routes.ts        — Route definitions
├── <resource>.validator.ts     — Validation schemas
├── <resource>.types.ts         — TypeScript interfaces and types
├── <resource>.test.ts          — Unit tests
└── <resource>.docs.ts          — OpenAPI documentation

Created routes :
  GET    /api/v1/<resources>        — List with pagination and filters
  GET    /api/v1/<resources>/:id    — Resource detail
  POST   /api/v1/<resources>        — Create a resource
  PUT    /api/v1/<resources>/:id    — Full update
  PATCH  /api/v1/<resources>/:id    — Partial update
  DELETE /api/v1/<resources>/:id    — Delete a resource
```
