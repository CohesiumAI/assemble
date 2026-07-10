# Contributing to Assemble

## Local setup

Use Node.js 18 or newer. The project has no runtime dependencies.

```bash
git clone https://github.com/CohesiumAI/assemble.git
cd assemble
npm test
```

## Make a change

1. Create a focused branch.
2. Update sources in `src/`, generator code in `generator/`, or adapters in `generator/adapters/`.
3. Add regression coverage in the existing `tests/*.js` suites.
4. Run `npm test` and `npm pack --dry-run`.
5. Open a pull request that explains the problem, solution, tests, and compatibility impact.

Keep generated formats cross-platform and avoid new dependencies unless the trade-off is documented. Do not modify real user profiles in tests; use isolated directories under the operating system temporary directory.

JavaScript adapters and Windsurf user-profile registration require the per-run flags `--allow-plugins` and `--register-windsurf-mcp`. Tests must prove their absence is safe by default and must isolate any opted-in profile under the temporary directory.

Report vulnerabilities through the private process in [SECURITY.md](SECURITY.md), not a public issue.
