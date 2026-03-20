---
name: reporting
description: Report and dashboard generation — data collection, analysis, visualization, insights, and recommendations for decision-making
agents: [data, analyst, pm, scrum, marketing, customer-success, finance]
trigger: /report
---

# Skill : Reporting & Dashboards

## Objective

Design and produce structured reports and dashboards that transform raw data into actionable insights for decision-making. This skill covers data collection, analysis, visualization, and formulation of recommendations based on key metrics.

## When to use

- When creating a periodic report (weekly, monthly, quarterly)
- To build a KPI tracking dashboard
- When a data-driven presentation is needed for stakeholders
- During a sprint retrospective or marketing campaign review
- To analyze the results of an A/B test or feature launch
- When management requests a status report on a specific topic

## Steps

1. **Clarify objective and audience** — Identify the business question the report must answer. Define the audience (C-level, product, marketing, technical) and adapt the level of detail, vocabulary, and format accordingly. A technical report and an executive report are not presented the same way.
2. **Identify and collect data sources** — List necessary sources: database, analytics (GA4, Mixpanel, Amplitude), business tools (CRM, Stripe, ad platforms), APIs, CSV exports. Verify data reliability and freshness. Document known limitations.
3. **Define KPIs and metrics** — Select relevant indicators (no more than 7-10 main KPIs). For each KPI: precise definition, calculation formula, data source, update frequency, thresholds (green/orange/red). Distinguish vanity metrics from actionable metrics.
4. **Analyze the data** — Calculate metrics, identify trends (growth, decline, plateau), anomalies, and correlations. Compare with previous periods (MoM, YoY), set objectives, and industry benchmarks. Segment data to reveal hidden insights.
5. **Visualize results** — Choose appropriate chart types: line charts for time trends, bar charts for comparisons, pie charts for distributions (sparingly), heatmaps for distributions, tables for details. Follow data visualization principles (Tufte).
6. **Formulate insights and recommendations** — Translate each finding into an actionable insight: what do the data reveal? What are the probable causes? What actions are recommended? Prioritize recommendations by estimated business impact.
7. **Structure the deliverable** — Organize the report with an executive summary at the top (key conclusions and recommendations), followed by detailed thematic sections. Each section follows the pattern: finding → analysis → recommendation.
8. **Define follow-up** — Propose the report update frequency, automatic alerts to configure on critical KPIs, and next questions to investigate.

## Exit Checklist

- [ ] Report objective and audience are defined
- [ ] Data sources are identified, reliable, and documented
- [ ] KPIs are relevant, well-defined, and limited in number (≤ 10)
- [ ] Analysis includes time comparisons and key segmentations
- [ ] Visualizations are clear, appropriate for the data type, and not misleading
- [ ] Each finding is accompanied by an insight and a recommendation
- [ ] The executive summary conveys the essentials in 2 minutes
- [ ] Update frequency and next steps are defined

## Output Format

```markdown
## Rapport [Type]

**Title :** [Descriptive report title]
**Period :** [start date — end date]
**Audience :** [C-level | Product | Marketing | Technical]
**Author :** [agent]
**Production date :** [date]
**Next update :** [date]

---

### Executive Summary

**In brief :** [2-3 sentences summarizing the main conclusions]

**Key KPIs :**

| KPI | Value | Variation | Objective | Status |
|-----|--------|-----------|----------|--------|
| [KPI 1] | [valeur] | [+X% / -X% vs N-1] | [objectif] | ✅/⚠️/❌ |
| [KPI 2] | [valeur] | [+X% / -X% vs N-1] | [objectif] | ✅/⚠️/❌ |
| [KPI 3] | [valeur] | [+X% / -X% vs N-1] | [objectif] | ✅/⚠️/❌ |

**Recommended actions :**
1. 🔴 [Priority action — high impact]
2. 🟠 [Important action — to schedule]
3. 🟡 [Optimization action — nice to have]

---

### Section 1 : [Theme — e.g.: Acquisition]

#### Metrics

| Metric | This month | Previous month | Variation | YoY |
|--------|-----------|---------------|-----------|-----|
| [metric 1] | [value] | [value] | [%] | [%] |
| [metric 2] | [value] | [value] | [%] | [%] |

#### Analysis

**Finding :** [factual description of what the data shows]

**Probable cause :** [hypothesis based on data and context]

**Recommendation :** [concrete action with expected result]

#### Segmentation

| Segment | Value | Share | Trend |
|---------|-------|-------|-------|
| [segment A] | [valeur] | [%] | ↗️/➡️/↘️ |
| [segment B] | [valeur] | [%] | ↗️/➡️/↘️ |
| [segment C] | [valeur] | [%] | ↗️/➡️/↘️ |

---

### Section 2 : [Theme — e.g.: Engagement]

[Same structure: Metrics → Analysis → Segmentation]

---

### Section 3 : [Theme — e.g.: Conversion / Revenue]

[Same structure: Metrics → Analysis → Segmentation]

---

### Appendix

**Data sources :** [list of sources with last extraction date]
**Known limitations :** [biases, missing data, approximations]
**Glossary :** [definition of terms and metrics used]

### Next steps

- [ ] [Additional analysis to conduct]
- [ ] [Alert to configure on critical KPI]
- [ ] [Question to investigate in the next report]
- [ ] [Decision to be made by [owner] before [date]]
```
