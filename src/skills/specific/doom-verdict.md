---
name: doom-verdict
description: Doctor Doom's strategic verdict — deep multi-dimensional analysis for critical decisions. Circuit-breaker agent, not auto-selected.
agents: [doom]
trigger: /doom
---

# Skill : Doctor Doom — Strategic Verdict

## Objective
Invoke Doctor Doom for a binding, multi-dimensional verdict on a critical decision.

## When to use
- Before irreversible decisions (architecture, tech stack, data model, pricing)
- When Deadpool flags YELLOW/RED but deeper analysis is needed
- When consensus exists but confidence is low
- When the stakes are too high for a standard challenge

## Execution
1. Read the agent definition from `.claude/agents/doctor-doom/AGENT.md`
2. Gather all available context (current workflow deliverables, conversation history)
3. Apply the 6-dimension analysis framework:
   - Technical risk
   - Business risk
   - Security risk
   - Irreversibility
   - Blast radius
   - Operational cost
4. Render verdict: GO / CONDITIONAL / NO-GO
5. If CONDITIONAL: list specific, verifiable mitigations
6. If NO-GO: propose an alternative path with trade-offs

## Output
Produce `doom-verdict.md` in the current workflow output directory (or display inline if no workflow is active).
