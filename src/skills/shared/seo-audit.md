---
name: seo-audit
description: Technical and on-page SEO audit — crawlability, Core Web Vitals, tags, structured data, internal linking, and optimization opportunities
agents: [seo, content-seo, geo-aio, dev-frontend]
trigger: /seo
---

# Skill : SEO Audit

## Objective

Perform a comprehensive SEO audit covering technical aspects (crawlability, indexability, performance), on-page (tags, content, structured data), and structural aspects (internal linking, information architecture). This skill produces an actionable report with recommendations prioritized by SEO impact.

## When to use

- When launching a new site or redesign
- When organic traffic drops or stagnates without obvious explanation
- During a periodic SEO health audit (quarterly recommended)
- After a domain, CMS, or URL structure migration
- To identify quick optimization opportunities (quick wins)
- Before a content campaign to ensure the technical foundation is solid

## Steps

1. **Analyze crawlability and indexability** — Check `robots.txt`, `sitemap.xml`, meta robots directives, and X-Robots-Tag headers. Identify unintentionally blocked pages, redirect loops, 4xx/5xx errors. Analyze crawl budget (server logs).
2. **Audit technical performance** — Measure Core Web Vitals (LCP, INP, CLS) on strategic pages. Check load time, TTFB, compression (gzip/brotli), resource minification, image lazy loading, browser cache.
3. **Analyze on-page SEO tags** — Check the presence and uniqueness of `<title>`, `<meta description>`, `<h1>` tags, heading hierarchy (H1→H6), image `alt` attributes, canonical URLs, hreflang tags for multilingual.
4. **Verify structured data** — Audit Schema.org markup (JSON-LD): validity (Google Rich Results Test), relevance to page type (Article, Product, FAQPage, LocalBusiness, BreadcrumbList), completeness of recommended fields.
5. **Audit internal linking** — Analyze crawl depth (pages more than 3 clicks from homepage), internal PageRank distribution, orphan pages, optimized link anchors, broken internal links.
6. **Analyze content** — Check for duplicate content (internal and external), thin content (pages < 300 words with no added value), keyword cannibalization (multiple pages targeting the same term), optimization of existing content vs search intent.
7. **Evaluate mobile experience** — Test mobile compatibility (responsive design), touch target size, text readability without zoom, absence of intrusive interstitials. Check rendering on major devices.
8. **Produce the report and action plan** — Classify recommendations by SEO impact (high, medium, low) and technical effort. Identify quick wins (high impact, low effort). Propose a realistic implementation timeline.

## Exit Checklist

- [ ] robots.txt and sitemap.xml are compliant and up to date
- [ ] No strategic page is blocked from indexation
- [ ] Core Web Vitals meet Google thresholds (green)
- [ ] Each page has a unique title, meta description, and H1
- [ ] Structured data is valid and relevant
- [ ] Internal linking ensures crawl depth ≤ 3 clicks
- [ ] No critical duplicate content or cannibalization identified
- [ ] Report contains a prioritized action plan with quick wins

## Output Format

```markdown
## SEO Audit Report

**Site :** [site URL]
**Pages analyzed :** [number]
**Date :** [date]
**Auditor :** [agent]

### Overall score

| Category | Score | Status |
|----------|-------|--------|
| Technical | XX/100 | ✅/⚠️/❌ |
| On-page | XX/100 | ✅/⚠️/❌ |
| Content | XX/100 | ✅/⚠️/❌ |
| Internal linking | XX/100 | ✅/⚠️/❌ |
| Mobile | XX/100 | ✅/⚠️/❌ |

**Overall SEO score :** XX/100

### Technical findings

#### 🔴 Critical issues

**[SEO-01] Issue title**
- **Affected pages :** [number] pages — [URL examples]
- **SEO impact :** [description of the ranking impact]
- **Recommendation :** [detailed technical solution]
- **Priority :** Immediate

#### 🟠 Important issues

**[SEO-02] Issue title**
- **Affected pages :** [number] pages
- **SEO impact :** [description]
- **Recommendation :** [solution]

#### 🟡 Recommended improvements

**[SEO-03] Improvement title**
- **Opportunity :** [potential gain]
- **Recommendation :** [solution]

### Core Web Vitals analysis

| Page | LCP | INP | CLS | Mobile score | Desktop score |
|------|-----|-----|-----|-------------|---------------|
| Homepage | X.Xs | Xms | X.XX | XX | XX |
| Category page | X.Xs | Xms | X.XX | XX | XX |
| Product page | X.Xs | Xms | X.XX | XX | XX |

### Tag analysis

| Issue | Affected pages | Examples |
|-------|---------------|----------|
| Missing title | X | [URLs] |
| Duplicate title | X | [URLs] |
| Missing meta description | X | [URLs] |
| Missing or multiple H1 | X | [URLs] |
| Images without alt | X | [URLs] |

### Structured data

| Type | Pages | Validation status | Errors |
|------|-------|-------------------|--------|
| [BreadcrumbList] | X | ✅/❌ | [details] |
| [Product] | X | ✅/❌ | [details] |
| [FAQPage] | X | ✅/❌ | [details] |

### Quick wins — High impact / low effort actions

| # | Action | Estimated impact | Effort | Timeline |
|---|--------|-----------------|--------|----------|
| 1 | [action] | [traffic impact] | [person-days] | [timeline] |
| 2 | [action] | [traffic impact] | [person-days] | [timeline] |
| 3 | [action] | [traffic impact] | [person-days] | [timeline] |

### Complete action plan

| Phase | Actions | Timeline | Owner |
|-------|---------|----------|-------|
| Immediate (W1-W2) | [critical actions] | 2 weeks | [team] |
| Short term (M1) | [important actions] | 1 month | [team] |
| Medium term (M2-M3) | [improvements] | 2-3 months | [team] |
```
