# Security Policy

## Supported versions

Security fixes are applied to the latest published beta. Older beta releases are not maintained once a replacement is available.

| Version | Supported |
|---|---|
| 1.1.2-beta.6 | Yes |
| Earlier betas | No |

## Report a vulnerability privately

Please use [GitHub private vulnerability reporting](https://github.com/CohesiumAI/assemble/security/advisories/new). Do not open a public issue for an undisclosed vulnerability.

Include the affected version, operating system, impact, minimal reproduction conditions, and any suggested mitigation. Do not include secrets or data from systems you do not own.

We aim to acknowledge reports within five business days and will share status as investigation progresses. Timelines for a fix depend on severity and reproducibility.

For non-security bugs, use [GitHub Issues](https://github.com/CohesiumAI/assemble/issues).

Project configuration cannot grant permission to execute local JavaScript adapters or modify a Windsurf user profile. Those actions require the per-run `--allow-plugins` and `--register-windsurf-mcp` flags respectively; use them only for projects you trust.
