---
name: api-design
description: Conception d'API REST/GraphQL — contrats d'interface, versioning, pagination, gestion d'erreurs, documentation OpenAPI et bonnes pratiques
agents: [dev-backend, dev-fullstack, architect, dev-mobile]
trigger: /api
---

# Skill : Conception d'API

## Objectif

Concevoir des APIs REST ou GraphQL robustes, cohérentes et bien documentées en suivant les standards de l'industrie. Cette skill couvre la définition des contrats, le versioning, la pagination, la gestion d'erreurs, l'authentification et la génération de la documentation OpenAPI/GraphQL SDL.

## Quand l'utiliser

- Lors de la conception d'une nouvelle API ou d'un nouveau module d'API
- Pour standardiser les conventions d'une API existante
- Quand un contrat d'interface doit être défini entre le frontend et le backend
- Lors de l'ajout de versioning ou de pagination à une API existante
- Pour générer ou mettre à jour la documentation OpenAPI / GraphQL SDL
- Quand une API tierce doit être encapsulée dans une abstraction propre

## Étapes

1. **Identifier les ressources et les opérations** — Lister les entités métier concernées et les opérations CRUD + actions spécifiques. Pour GraphQL, identifier les queries, mutations et subscriptions. Définir les relations entre ressources (1:1, 1:N, N:N).
2. **Définir les endpoints et le nommage** — Appliquer les conventions REST : noms de ressources au pluriel, verbes HTTP corrects (GET, POST, PUT, PATCH, DELETE), hiérarchie logique (`/users/{id}/orders`). Pour GraphQL, structurer le schema avec des types clairs et des noms de champs explicites.
3. **Concevoir les schémas de données** — Définir les structures de requête (request body) et de réponse pour chaque endpoint. Utiliser un système de validation (Zod, JSON Schema, Pydantic). Documenter chaque champ avec son type, sa cardinalité et ses contraintes.
4. **Implémenter la pagination et le filtrage** — Choisir la stratégie de pagination : offset-based (simple, adaptée aux listes stables), cursor-based (performante, adaptée aux flux). Définir les paramètres de filtrage, de tri et de recherche standardisés.
5. **Définir la gestion d'erreurs** — Standardiser le format des erreurs avec un code machine, un message humain et des détails contextuels. Mapper les codes HTTP appropriés (400, 401, 403, 404, 409, 422, 429, 500). Implémenter le Problem Details (RFC 7807) si pertinent.
6. **Configurer l'authentification et le rate limiting** — Documenter le mécanisme d'auth (JWT Bearer, API Key, OAuth2 scopes), les permissions par endpoint, les quotas et le rate limiting. Définir les headers de réponse associés (`X-RateLimit-*`).
7. **Définir la stratégie de versioning** — Choisir entre URL versioning (`/v1/`), header versioning (`Accept: application/vnd.api.v1+json`), ou query parameter. Définir la politique de dépréciation et de support des anciennes versions.
8. **Générer la documentation** — Produire la spécification OpenAPI 3.x (REST) ou le SDL (GraphQL) complète avec descriptions, exemples, et codes de réponse. Inclure des exemples de requêtes curl/httpie.

## Checklist de sortie

- [ ] Les ressources et opérations sont identifiées et nommées selon les conventions
- [ ] Les schémas de requête et réponse sont définis avec validation
- [ ] La pagination est implémentée (offset ou cursor) avec des limites configurées
- [ ] Le format d'erreur est standardisé avec les codes HTTP appropriés
- [ ] L'authentification et les permissions sont documentées par endpoint
- [ ] La stratégie de versioning est définie et appliquée
- [ ] La documentation OpenAPI/SDL est complète et à jour
- [ ] Des exemples de requêtes fonctionnels sont fournis (curl/httpie)

## Format de sortie

```markdown
## Conception d'API

**Projet :** [nom du projet / service]
**Type :** [REST | GraphQL | gRPC]
**Version :** [v1 | v2 | ...]
**Base URL :** [https://api.example.com/v1]
**Date :** [date]

### Ressources

| Ressource | Description | Opérations |
|-----------|-------------|------------|
| /users | Gestion des utilisateurs | GET, POST, GET/:id, PATCH/:id, DELETE/:id |
| /users/:id/orders | Commandes d'un utilisateur | GET, POST |

### Contrat détaillé

#### `POST /resource`

**Description :** Créer une nouvelle ressource
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

**Réponses :**

| Code | Description | Body |
|------|-------------|------|
| 201 | Ressource créée | `{ "id": "uuid", "field_1": "...", "created_at": "ISO8601" }` |
| 400 | Données invalides | `{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }` |
| 401 | Non authentifié | `{ "error": { "code": "UNAUTHORIZED", "message": "..." } }` |
| 409 | Conflit | `{ "error": { "code": "DUPLICATE_RESOURCE", "message": "..." } }` |

**Exemple curl :**
```bash
curl -X POST https://api.example.com/v1/resource \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"field_1": "valeur", "field_2": 42}'
```

### Pagination

**Stratégie :** [Offset | Cursor]

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

### Format d'erreur standardisé

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Message lisible pour l'humain",
    "details": [
      { "field": "email", "issue": "Format invalide" }
    ],
    "request_id": "req_abc123"
  }
}
```

### Versioning

**Stratégie :** URL prefix (`/v1/`, `/v2/`)
**Politique de dépréciation :** 6 mois de support après l'annonce de dépréciation
**Header de dépréciation :** `Deprecation: true`, `Sunset: <date>`
```

## Langue de travail

Tu communiques et rédiges tous tes échanges en **français**.
Les fichiers et livrables que tu produis sont rédigés en **english**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.

## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : `.\deliverables`
Respecte la structure de dossiers définie par le workflow en cours.
