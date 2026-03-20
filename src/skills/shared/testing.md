---
name: testing
description: Test strategy and execution — unit, integration, end-to-end tests, with test case generation and coverage analysis
agents: [dev-backend, dev-frontend, dev-fullstack, dev-mobile, qa]
trigger: /test
---

# Skill : Testing

## Objective

Define and execute a test strategy adapted to the context: identify relevant test cases, write unit, integration, and/or end-to-end tests, analyze coverage, and produce a usable results report.

## When to use

- When implementing a new feature requiring tests
- To increase test coverage of an existing module
- Before a refactoring to secure current behavior
- When a bug report requires creating a regression test
- To audit the quality and relevance of the existing test suite

## Steps

1. **Analyze the scope to test** — Identify the module, function, or flow involved. Understand the expected behavior, inputs/outputs, dependencies, and side effects.
2. **Choose the test level** — Determine the appropriate test type according to the test pyramid: unit (isolated logic), integration (interactions between components), end-to-end (complete user flow). Justify the choice.
3. **Identify test cases** — List scenarios: nominal case (happy path), edge cases, error cases (invalid inputs, timeouts, denied permissions), concurrency cases if applicable.
4. **Prepare the test environment** — Identify required mocks, stubs, and fixtures. Configure test data. Ensure tests are isolated and reproducible (no dependency on execution order).
5. **Write the tests** — Follow the AAA pattern (Arrange, Act, Assert). One test = one verified behavior. Name tests descriptively (`should_return_404_when_user_not_found`). Use appropriate matchers.
6. **Execute and analyze** — Run the test suite, verify all pass. Analyze the coverage report (lines, branches, functions). Identify critical uncovered areas.
7. **Document the results** — Produce a summary report with coverage rate, tested cases, any skipped tests (with justification), and recommendations.

## Exit Checklist

- [ ] The test scope is clearly defined
- [ ] The test level (unit / integration / e2e) is justified
- [ ] Nominal, edge, and error cases are covered
- [ ] Tests are isolated, reproducible, and independent
- [ ] The AAA pattern is followed (Arrange, Act, Assert)
- [ ] Test names describe the verified behavior
- [ ] Code coverage meets the project's target threshold
- [ ] The results report is produced and actionable

## Output Format

```markdown
## Test Report

**Module :** [module / component name]
**Type :** [Unit | Integration | E2E | Mixed]
**Framework :** [Jest | Vitest | Pytest | Cypress | Playwright | other]
**Date :** [date]

### Identified test cases

| # | Scenario | Type | Priority |
|---|----------|------|----------|
| T-01 | [Nominal case description] | Nominal | High |
| T-02 | [Edge case description] | Edge case | High |
| T-03 | [Error case description] | Error | Medium |
| T-04 | [Description] | [Type] | [Priority] |

### Execution results

| Metric | Value |
|--------|-------|
| Total tests | XX |
| Passed ✅ | XX |
| Failed ❌ | XX |
| Skipped ⏭️ | XX |
| Line coverage | XX% |
| Branch coverage | XX% |

### Written tests

```typescript
// Example of generated test
describe('ModuleName', () => {
  it('should [expected behavior] when [condition]', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Recommendations

- [Critical uncovered area to address]
- [Flaky test to stabilize]
- [Suggested refactoring to improve testability]
```
