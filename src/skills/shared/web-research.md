---
name: web-research
description: Web research protocol — guidelines for using web search tools to verify and update agent recommendations with current data.
agents: [all]
trigger: /research
---

# Skill : Web Research

## Objective

Verify and update agent recommendations with current data. When a web search tool is available, agents use it to ground their advice in the latest versions, CVEs, API changes, market data, and legal evolutions — rather than relying solely on training data that may be outdated.

## When to search

- **Technology and library recommendations** — versions, compatibility, maintenance status, community adoption
- **Obsolescence-sensitive information** — CVEs, security advisories, deprecated APIs, breaking changes in recent releases
- **Evolving market, legal, and SEO data** — regulations (GDPR updates, AI Act), search algorithm changes, market share shifts, pricing changes
- **Third-party service status** — API availability, rate limit changes, new endpoints, sunset announcements
- **Competitive intelligence** — competitor feature launches, funding rounds, pivots

## How to search

If a web search tool is available, follow these guidelines:

1. **Formulate targeted queries** — One specific question per search. Prefer `"fastify 5 breaking changes 2025"` over `"fastify news"`.
2. **Limit search volume** — 2 to 5 searches per subject maximum. Each search must have a clear purpose.
3. **Prioritize authoritative sources** — In order of preference:
   - Official documentation (docs sites, GitHub repos, changelogs)
   - Package registries (npm, PyPI, crates.io) for version and maintenance data
   - Reference databases (MDN, OWASP, CVE databases, Can I Use)
   - Established technical publications (official blogs, RFCs)
   - Community sources (Stack Overflow, GitHub Discussions) as secondary confirmation only
4. **Synthesize concisely** — Maximum 300 tokens per search result synthesized. Extract the actionable fact, discard the noise.
5. **Always use conditional formulation** — "If a web search tool is available, verify..." — never issue an imperative instruction that assumes the tool exists.

## Quality guardrails

### Libraries and dependencies

Ignore a library recommendation if ANY of the following applies:
- Fewer than 100 GitHub stars
- Last commit older than 12 months
- License incompatible with the project (check against project license)

Always verify:
- Date of the latest release (stable, not pre-release)
- Open issue count on critical bugs
- Whether the maintainer is active or the project is archived

### Source validation

- **Prefer primary sources** over blog posts and tutorials — a changelog entry beats a Medium article
- **Cross-reference critical recommendations** with at least 2 independent sources before presenting them as reliable
- **Check publication dates** — discard information older than 12 months for fast-moving domains (JavaScript ecosystem, AI/ML, cloud services)

## Confidence signals

Annotate every obsolescence-sensitive recommendation with one of the following signals:

- `[VERIFIED <date>]` — The information was verified via web search on the specified date. Include the source.
- `[TRAINING DATA]` — Based on training knowledge, not verified against current data. May be outdated.
- `[NEEDS VERIFICATION]` — A critical point that requires manual verification before acting on it.

Place the signal inline, immediately after the recommendation:

```
Use Fastify v5.x for the API layer [VERIFIED 2026-04-05 — fastify.dev/changelog].
Consider using Bun as the runtime [TRAINING DATA].
The Meta API v19.0 deprecation timeline [NEEDS VERIFICATION].
```

## Anti-search-theater

These rules are non-negotiable:

- **DO NOT simulate search results** if no web search tool is available. Never fabricate a search interaction.
- **DO NOT invent URLs, dates, version numbers, or statistics.** If you do not know the current version, say so.
- **DO NOT present training data as verified information.** Use the `[TRAINING DATA]` signal honestly.
- **DO NOT perform searches for the sake of appearing thorough.** Each search must answer a specific question that impacts the deliverable.

If no web search tool is available, work normally with training data and annotate accordingly.

## Graceful degradation

When no web search tool is available:

1. Work normally using training knowledge
2. Apply the `[TRAINING DATA]` signal to obsolescence-sensitive recommendations
3. Add a `## Limitations` section at the end of the deliverable listing points where verification would be valuable:

```markdown
## Limitations

The following points are based on training data and could not be verified with current sources:
- [ ] Fastify v5 stable release status and migration guide
- [ ] Current OWASP Top 10 2025 revisions (if any)
- [ ] Meta Business API v19.0 deprecation date
```

This section gives the user a clear checklist of what to verify manually.

## Budget

- **Maximum 300 tokens** per individual search result synthesis
- **2 to 5 searches** per subject — no more unless the subject is exceptionally broad
- **Total research phase** should not exceed 15% of the agent's total work time on the deliverable
