---
name: growth-experiment
description: Growth experiment design and launch with hypothesis, metrics, implementation, and results analysis
agents: [growth, marketing, data]
trigger: /experiment
---

# Skill : Growth Experiment

## Objective
Design, launch, and analyze a structured growth experiment following scientific methodology. Formulate a testable hypothesis, define success metrics, implement the test (A/B test, feature flag, cohort), collect data, and analyze results to make a data-driven decision.

## When to use
- To test a new feature before full deployment (feature flag / A/B test)
- When a conversion improvement hypothesis needs to be validated by data
- To optimize a user journey (onboarding, checkout, activation, retention)
- When prioritizing growth initiatives via an ICE/RICE framework
- To measure the impact of a pricing, messaging, or design change

## Steps
1. **Formulate the hypothesis** — Write a structured hypothesis: "If we [action], then [metric] will increase by [X%] because [reason]." Identify the impacted north star metric.
2. **Define metrics and success threshold** — Choose the primary metric and guardrail metrics. Define the minimum detectable effect (MDE) and required statistical significance (p < 0.05).
3. **Calculate sample size** — Estimate the sample size needed to reach desired statistical power (80% minimum). Define the minimum experiment duration based on traffic.
4. **Design the experiment** — Design variants (control vs. treatment), define the allocated traffic percentage, segmentation rules, and exclusion criteria.
5. **Implement the test** — Configure the test via the experimentation tool (LaunchDarkly, Optimizely, GrowthBook, custom feature flag). Integrate event tracking and verify instrumentation.
6. **Launch and monitor** — Activate the experiment, verify traffic distribution (sample ratio mismatch check), monitor guardrail metrics and anomalies in real-time.
7. **Analyze results** — At the end of the test period, analyze statistical results: confidence interval, p-value, observed effect vs. expected effect. Segment results by cohort if relevant.
8. **Make the decision and document** — Decide to deploy (ship), iterate, or abandon (kill) the experiment. Document learnings in the growth team's knowledge base.

## Exit Checklist
- [ ] The hypothesis is formulated in a testable way with a quantitative prediction
- [ ] Primary and guardrail metrics are defined and instrumented
- [ ] Sample size is calculated and minimum duration is respected
- [ ] Variants are correctly implemented and visually verified
- [ ] Event tracking is functional (verified via QA)
- [ ] Traffic distribution is balanced (no sample ratio mismatch)
- [ ] Results are statistically significant before any decision
- [ ] The experiment is documented with learnings in the growth register

## Output Format
```
Growth Experiment Sheet

Name : [EXP-XXX] [descriptive title]
Hypothesis : If we [action], then [metric] will increase by [X%] because [reason].
Author : [agent growth]
Date : [start date] - [end date]
Status : [Draft / In progress / Completed / Deployed / Abandoned]

Metrics :
  - Primary : [metric name] (baseline : [current value])
  - Guardrail 1 : [metric] (threshold : do not degrade more than [X%])
  - Guardrail 2 : [metric] (threshold : do not degrade more than [X%])

Test configuration :
  - Type : A/B test / Multi-variant / Feature flag
  - Distribution : Control [X%] / Variant [X%]
  - Required sample size : [N] users per variant
  - Minimum duration : [X] days
  - Tool : [LaunchDarkly / GrowthBook / Optimizely]

Results :
  | Variant   | Primary metric      | Delta   | p-value | Significant |
  |-----------|---------------------|---------|---------|-------------|
  | Control   | [value]             | -       | -       | -           |
  | Variant A | [value]             | [+X%]   | [0.0X]  | [Yes/No]    |

Decision : [Ship / Iterate / Kill]
Learnings : [summary of key takeaways]
Next steps : [actions to take following this experiment]
```
