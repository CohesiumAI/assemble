---
name: performance-audit
description: Performance audit — Core Web Vitals, query optimization, load analysis, profiling, and improvement recommendations
agents: [dev-frontend, dev-backend, devops, data]
trigger: /perf
---

# Skill : Performance Audit

## Objective

Perform a comprehensive performance audit covering key metrics (Core Web Vitals, API response times, throughput, resource utilization), identify bottlenecks, and produce a prioritized optimization plan with estimated gains.

## When to use

- When application performance degrades (user complaints, monitoring)
- Before a launch or anticipated load increase (marketing campaign, seasonality)
- During a periodic audit of the product's technical health
- After a deployment that impacted response times
- To establish performance baselines on a new project
- When Lighthouse or Web Vitals scores are below acceptable thresholds

## Steps

1. **Establish baselines** — Measure current metrics: Core Web Vitals (LCP, FID/INP, CLS) for frontend, P50/P95/P99 response times for APIs, CPU/memory/disk utilization for infrastructure. Document measurement conditions.
2. **Profile the frontend** — Analyze initial loading (bundle size, code splitting, lazy loading), rendering (unnecessary re-renders, layout thrashing, unoptimized images), network requests (waterfall, blocking requests, cache strategy). Use Lighthouse, Chrome DevTools Performance, WebPageTest.
3. **Profile the backend** — Identify slow endpoints (APM, slow query logs), analyze N+1 queries, serialized calls that could be parallelized, blocking computations on the main thread, memory leaks. Profile with appropriate tools (pprof, py-spy, clinic.js).
4. **Analyze database queries** — Examine execution plans (`EXPLAIN ANALYZE`), identify missing indexes, full table scans, expensive joins, non-paginated queries. Check connection pooling configuration.
5. **Evaluate cache strategy** — Audit cache layers (CDN, reverse proxy, application, database). Check hit ratios, appropriate TTLs, correct invalidation. Identify hot data that is not cached.
6. **Load test** — Simulate realistic load scenarios (k6, Artillery, Locust): normal load, traffic spike, progressive ramp-up. Identify the breaking point and limiting resources.
7. **Prioritize optimizations** — Rank issues by impact (estimated gain) and effort (fix complexity). Apply the 80/20 rule: the simplest optimizations that bring the most gain.
8. **Write the report** — Produce a report with before/after metrics (when corrections have been applied), identified bottlenecks, and a prioritized action plan.

## Exit Checklist

- [ ] Performance baselines are measured and documented
- [ ] Core Web Vitals are analyzed (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Slow API endpoints are identified with their causes
- [ ] Problematic database queries are listed with execution plans
- [ ] Cache strategy is audited and gaps identified
- [ ] A load test has been performed with breaking point identification
- [ ] Optimizations are prioritized by impact/effort ratio
- [ ] The report contains concrete metrics and an action plan

## Output Format

```markdown
## Performance Audit Report

**Application :** [application / service name]
**Environment :** [production | staging | development]
**Date :** [date]
**Auditor :** [agent]

### Executive summary

| Metric | Current value | Target threshold | Status |
|----------|----------------|-------------|--------|
| LCP (Largest Contentful Paint) | X.Xs | < 2.5s | ✅/⚠️/❌ |
| INP (Interaction to Next Paint) | Xms | < 200ms | ✅/⚠️/❌ |
| CLS (Cumulative Layout Shift) | X.XX | < 0.1 | ✅/⚠️/❌ |
| API P50 | Xms | < 200ms | ✅/⚠️/❌ |
| API P95 | Xms | < 1000ms | ✅/⚠️/❌ |
| API P99 | Xms | < 3000ms | ✅/⚠️/❌ |

**Overall score :** [Excellent | Good | Needs improvement | Critical]

### Identified bottlenecks

#### [PERF-01] Issue title — Severity : [Critical | High | Medium]

- **Component :** [frontend | backend | database | infrastructure]
- **Description :** Technical explanation of the problem
- **Measured impact :** Affected metric and observed degradation
- **Root cause :** Detailed analysis
- **Recommendation :** Technical solution with estimated gain
- **Effort :** [Low | Medium | High]

### DB query analysis

| Query | Average time | Calls/min | Missing index | Recommendation |
|-------|-------------|-----------|---------------|----------------|
| [description] | Xms | X | Yes/No | [action] |

### Load test

| Scenario | Concurrent users | RPS | P95 latency | Error rate |
|----------|-----------------|-----|-------------|------------|
| Normal load | X | X | Xms | X% |
| Traffic spike | X | X | Xms | X% |
| Breaking point | X | X | Xms | X% |

### Prioritized optimization plan

| Priority | Action | Estimated gain | Effort | Owner |
|----------|--------|---------------|--------|-------|
| P0 | [immediate action] | [gain] | [effort] | [team] |
| P1 | [short-term action] | [gain] | [effort] | [team] |
| P2 | [medium-term action] | [gain] | [effort] | [team] |

### Next steps

- [ ] Implement P0 optimizations
- [ ] Re-measure baselines after corrections
- [ ] Schedule P1 optimizations in the next sprint
- [ ] Configure automatic performance alerts
```
