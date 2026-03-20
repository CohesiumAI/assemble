---
name: legal-compliance-check
description: GDPR, AI Act, and nLPD regulatory compliance check with gap analysis and compliance plan
agents: [legal, pm, architect, security]
trigger: /compliance
---

# Skill : Legal Compliance Check

## Objective
Perform an exhaustive compliance check of a product, service, or data processing against applicable regulations (GDPR, AI Act, nLPD). Identify compliance gaps, assess legal risks, and produce a prioritized compliance plan with necessary corrective actions.

## When to use
- Before launching a new product or service processing personal data
- When integrating an artificial intelligence system into an existing product
- For a periodic compliance audit (annual or semi-annual)
- When new regulation comes into force or is modified
- During a significant change in data processing (new sub-processor, transfer outside EU, new purpose)

## Steps
1. **Map data processing activities** — Identify all personal data processing involved: purposes, legal bases, data categories, retention periods, sub-processors, and international transfers.
2. **Identify applicable regulations** — Determine which regulations apply based on user location, data nature, and system type (GDPR for EU, nLPD for Switzerland, AI Act for AI systems).
3. **Analyze GDPR compliance** — Check fundamental principles: lawfulness of processing, data minimization, data subject rights, processing records, DPIA if necessary, designated DPO.
4. **Evaluate AI Act compliance** — If applicable, classify the AI system by risk level (unacceptable, high, limited, minimal), check transparency obligations, technical documentation, and human oversight.
5. **Verify nLPD compliance** — For processing concerning Switzerland, check the duty to inform, impact assessments, cross-border transfers, and technical and organizational measures.
6. **Analyze gaps** — Document each identified compliance gap with legal risk level (fine, sanction, litigation), probability, and potential impact.
7. **Develop the remediation plan** — Define prioritized corrective actions with owners, deadlines, and resources needed for each identified gap.
8. **Write the compliance report** — Produce the final report with analysis summary, detailed findings, action plan, and recommendations to maintain compliance over time.

## Exit Checklist
- [ ] Processing records are complete and up to date
- [ ] Legal bases are identified and documented for each processing activity
- [ ] Data subject rights are implemented (access, rectification, deletion, portability)
- [ ] Legal notices and privacy policies are compliant and up to date
- [ ] DPIAs are performed for high-risk processing activities
- [ ] International transfers are governed (standard contractual clauses, adequacy decisions)
- [ ] AI systems are classified and corresponding obligations are met
- [ ] Remediation plan is prioritized with realistic deadlines

## Output Format
```
Regulatory Compliance Report

Subject : [product / service / processing name]
Regulations analyzed : GDPR, AI Act, nLPD
Analysis date : [date]
Analyst : [agent legal]

Compliance summary :
  - GDPR : [Compliant / Partially compliant / Non-compliant]
  - AI Act : [Compliant / Partially compliant / Non-compliant / Not applicable]
  - nLPD : [Compliant / Partially compliant / Non-compliant / Not applicable]
  - Overall risk level : [critical / high / moderate / low]

Identified gaps :

[GAP-001] Gap title
  - Regulation : GDPR - Article 13
  - Finding : Description of the non-compliance
  - Risk : Fine up to 4% of global revenue / CHF 250,000
  - Priority : Critical
  - Corrective action : Description of the correction to apply
  - Owner : [role / team]
  - Deadline : [target date]

Compliance plan :
  Phase 1 (0-30 days) — Critical actions
    - [GAP-001] Privacy policy update
    - [GAP-003] Consent mechanism implementation
  Phase 2 (30-90 days) — Important actions
    - [GAP-005] DPIA completion
    - [GAP-007] Processing records setup
  Phase 3 (90-180 days) — Continuous improvements
    - [GAP-009] Team training
    - [GAP-010] Sub-processor audit
```
