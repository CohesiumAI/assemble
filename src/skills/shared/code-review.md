---
name: code-review
description: Structured code review with quality checklist — static analysis, best practices, security, performance, and maintainability
agents: [dev-backend, dev-frontend, dev-fullstack, qa, security]
trigger: /review
---

# Skill : Code Review

## Objective

Perform a systematic and structured code review that ensures the quality, security, readability, and maintainability of the submitted code. This skill produces an actionable report with concrete suggestions classified by priority.

## When to use

- Before every merge request / pull request
- During a quality audit of existing code
- When a developer requests an outside perspective on their implementation
- After a major refactoring to validate consistency
- During onboarding of a new contributor to verify alignment with standards

## Steps

1. **Identify the scope** — List modified files, understand the functional context of the change (ticket, user story, bug fix). Ask for context if missing.
2. **Verify structure and architecture** — Ensure the code respects the existing architecture (layers, patterns, separation of concerns). Verify that no abstraction is broken.
3. **Analyze readability and conventions** — Variable/function naming, formatting, consistency with project style. Check for unused imports, dead code, orphaned TODOs.
4. **Evaluate business logic** — Validate algorithmic correctness, edge cases, error handling, null/undefined values, race conditions.
5. **Check security** — Injections (SQL, XSS, SSRF), input validation, secrets management, permissions and authorizations, vulnerable dependencies.
6. **Evaluate performance** — Algorithmic complexity, N+1 queries, potential memory leaks, unnecessary rendering (frontend), missing indexes (backend).
7. **Verify test coverage** — Presence of unit and/or integration tests for new code, relevance of assertions, edge cases covered.
8. **Write the report** — Synthesize findings classified by severity (blocking, major, minor, suggestion) with concrete recommendations.

## Exit Checklist

<!-- COMPLETENESS: ALL items must be checked. Report must include file:line references, severity classification, and verdict. Missing any = incomplete review. -->
- [ ] All modified files have been reviewed
- [ ] Project architecture and patterns are respected
- [ ] Naming and code conventions are consistent
- [ ] Edge cases and error handling are covered
- [ ] No security vulnerability detected (or flagged)
- [ ] No performance issue identified (or flagged)
- [ ] Tests cover new code in a relevant way
- [ ] Final report is classified by severity with concrete actions

## Output Format

```markdown
## Code Review Report

**Scope :** [description of the change]
**Files analyzed :** [number] files
**Date :** [date]
**Reviewer :** [agent]

### Summary

| Severity    | Count  |
|-------------|--------|
| 🔴 Blocking | X      |
| 🟠 Major    | X      |
| 🟡 Minor    | X      |
| 🔵 Suggestion | X   |

### Detailed Findings

#### 🔴 Blocking

**[B-01] Finding title**
- **File :** `path/to/file.ts:42`
- **Issue :** Precise description of the problem
- **Impact :** Consequence if not fixed
- **Recommendation :** Proposed solution with code example if relevant

#### 🟠 Major

**[M-01] Finding title**
- **File :** `path/to/file.ts:78`
- **Issue :** Precise description
- **Recommendation :** Proposed solution

#### 🟡 Minor

**[m-01] Finding title**
- **File :** `path/to/file.ts:15`
- **Observation :** Description
- **Suggestion :** Proposed improvement

#### 🔵 Suggestions

- [S-01] Description of the improvement suggestion
- [S-02] Description of the improvement suggestion

### Verdict

**Status :** ✅ Approved | ⚠️ Approved with reservations | ❌ Changes required

**Comment :** [summary in 2-3 sentences]
```
