---
name: ad-campaign-setup
description: Complete multi-platform ad campaign configuration with targeting, creatives, and performance tracking
agents: [ads, marketing, growth]
trigger: /ad-setup
---

# Skill : Ad Campaign Setup

## Objective
Configure and launch a complete ad campaign on distribution platforms (Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads). Define the targeting strategy, create ad sets, configure conversion tracking, and set up performance tracking dashboards.

## When to use
- When launching a new product or service requiring paid visibility
- For a user acquisition or lead generation campaign
- When an existing campaign needs to be restructured or optimized
- For a launch on a new advertising platform
- When setting up a retargeting or remarketing campaign

## Steps
1. **Define campaign objectives** — Identify the primary objective (awareness, traffic, conversions, leads, app installs), the primary KPI, the overall budget, and the campaign duration.
2. **Configure targeting** — Define target audiences: demographics (age, gender, location), interests, behaviors, lookalike audiences, remarketing lists, and exclusions.
3. **Structure campaigns and ad sets** — Organize campaigns by objective, ad sets by audience or placement, with clear nomenclature for reporting (standardized naming convention).
4. **Create creatives** — Prepare ad variants: copy (headlines, descriptions, CTA), visuals (images, videos, carousels) following each platform's specifications.
5. **Configure tracking** — Install tracking pixels (Meta Pixel, Google Tag, LinkedIn Insight Tag), define conversion events, configure UTM parameters, and verify server-side tracking if applicable.
6. **Define bidding strategy** — Choose the bidding strategy suited to the objective (target CPA, target ROAS, maximize conversions), set daily budget caps and automatic optimization rules.
7. **Set up A/B tests** — Configure creative, audience, and placement tests to identify the best-performing combinations with statistically significant methodology.
8. **Create the tracking dashboard** — Set up the reporting dashboard with key metrics (CPC, CPM, CTR, CPA, ROAS, conversion rate) and performance alerts.

## Exit Checklist
- [ ] Objectives and KPIs are clearly defined and measurable
- [ ] Audiences are configured with appropriate exclusions
- [ ] Campaign nomenclature follows the established naming convention
- [ ] Creatives meet each platform's specifications (size, format, weight)
- [ ] Conversion tracking is installed and verified (test event fires)
- [ ] Bidding strategy is aligned with campaign objectives
- [ ] A/B tests are configured with a minimum of 2 variants per ad set
- [ ] Tracking dashboard is operational with alerts configured

## Output Format
```
Ad Campaign Configuration

Campaign : [campaign name]
Platform(s) : [Google Ads / Meta Ads / LinkedIn Ads / TikTok Ads]
Objective : [awareness / traffic / conversions / leads]
Budget : [amount] / [day / week / month]
Duration : [start date] - [end date]

Structure :
  Campagne : [NOM_CAMPAGNE]_[OBJECTIF]_[DATE]
  ├── Ad Set 1 : [AUDIENCE]_[PLACEMENT]_[CIBLAGE]
  │   ├── Ad 1 : [FORMAT]_[VARIANTE_A]
  │   ├── Ad 2 : [FORMAT]_[VARIANTE_B]
  │   └── Ad 3 : [FORMAT]_[VARIANTE_C]
  └── Ad Set 2 : [AUDIENCE]_[PLACEMENT]_[CIBLAGE]
      ├── Ad 1 : [FORMAT]_[VARIANTE_A]
      └── Ad 2 : [FORMAT]_[VARIANTE_B]

Primary targeting :
  - Age : [range]
  - Location : [countries / regions / cities]
  - Interests : [list]
  - Lookalike audience : [source, percentage]

Configured tracking :
  - Pixel : [installed and verified]
  - Events : [PageView, AddToCart, Purchase, Lead, etc.]
  - UTM : utm_source=[source]&utm_medium=[medium]&utm_campaign=[campaign]

Target KPIs :
  - Target CPA : [amount]
  - Target ROAS : [ratio]
  - Expected CTR : [percentage]
  - Daily budget : [amount]
```
