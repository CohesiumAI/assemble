---
name: security-check
description: Security check — OWASP Top 10 audit, vulnerability analysis, configuration hardening, secrets management, and dependency compliance
agents: [security, dev-backend, devops, architect]
trigger: /sec-check
---

# Skill : Security Check

## Objective

Perform a structured security audit covering application vulnerabilities (OWASP Top 10), service configuration, secrets management, third-party dependencies, and infrastructure hardening. This skill produces a prioritized report with concrete remediations.

## When to use

- Before deploying an application or service to production
- After adding an authentication or authorization mechanism
- During a periodic security audit or following an incident
- When new third-party dependencies are introduced in the project
- During an infrastructure configuration change (network, firewall, IAM)
- Before a pentest to identify and fix obvious flaws

## Steps

1. **Define the audit scope** — Identify components to analyze: web application, API, infrastructure, CI/CD pipeline, cloud configuration. Clearly delineate what is included and excluded. Collect existing documentation (architecture, data flows).
2. **Analyze application vulnerabilities (OWASP Top 10)** — Review each category: injection (SQL, NoSQL, LDAP, OS command), broken authentication, sensitive data exposure, XXE, broken access control, security misconfiguration, XSS, insecure deserialization, using components with known vulnerabilities, insufficient logging & monitoring.
3. **Audit secrets management** — Verify that no secret is hardcoded in source code, configuration files, or Docker images. Validate the use of a secrets manager (Vault, AWS Secrets Manager, GCP Secret Manager). Verify key and token rotation.
4. **Analyze dependencies** — Scan dependencies with `npm audit`, `pip-audit`, `trivy`, `snyk`, or `grype`. Identify known CVEs, evaluate their severity (CVSS) and exploitability in the project context.
5. **Verify configuration hardening** — HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options), TLS configuration (versions, cipher suites), CORS policy, rate limiting, timeouts, maximum request size.
6. **Audit authentication and authorization** — Validate password policy, session management (expiration, rotation), MFA mechanisms, access controls (RBAC/ABAC), tenant isolation in multi-tenant.
7. **Verify logging and detection** — Ensure security events are logged (failed login attempts, denied access, permission changes), that logs do not contain sensitive data, and that alerts are configured.
8. **Write the security report** — Classify each finding by severity (critical, high, medium, low, informational) with impact description, proof of concept, and recommended remediation.

## Exit Checklist

- [ ] Audit scope is defined and documented
- [ ] Each OWASP Top 10 category has been analyzed
- [ ] No secret is exposed in source code or configurations
- [ ] Dependencies are scanned and critical CVEs identified
- [ ] Security headers and TLS configuration are compliant
- [ ] Authentication and authorization are robust and tested
- [ ] Security logging is in place without sensitive data leaks
- [ ] Report is classified by severity with actionable remediations

## Output Format

```markdown
## Security Report

**Scope :** [audited components]
**Reference framework :** OWASP Top 10 2021 + best practices
**Date :** [date]
**Auditor :** [agent]

### Executive summary

| Severity           | Count  |
|--------------------|--------|
| 🔴 Critical        | X      |
| 🟠 High            | X      |
| 🟡 Medium          | X      |
| 🔵 Low             | X      |
| ⚪ Informational   | X      |

**Overall risk score :** [Critical | High | Moderate | Low]

### Detailed findings

#### 🔴 [SEC-01] Vulnerability title

- **OWASP category :** [A01:2021 - Broken Access Control | ...]
- **Affected component :** [service/file/endpoint]
- **Description :** Technical explanation of the vulnerability
- **Impact :** Consequence if exploited (confidentiality, integrity, availability)
- **Proof of concept :** Reproduction command or scenario
- **Remediation :** Detailed technical solution with code example
- **Fix priority :** [Immediate | Current sprint | Next sprint]

### Dependency analysis

| Package | Current version | CVE | CVSS | Fixed version |
|---------|----------------|-----|------|--------------|
| [package] | [version] | [CVE-XXXX-XXXXX] | [score] | [version] |

### Priority recommendations

1. [Immediate action #1 — description and owner]
2. [Immediate action #2 — description and owner]
3. [Improvement to plan — description]

### Security header compliance

| Header | Status | Expected value | Current value |
|--------|--------|----------------|---------------|
| Content-Security-Policy | ✅/❌ | [valeur] | [valeur] |
| Strict-Transport-Security | ✅/❌ | max-age=31536000 | [valeur] |
| X-Content-Type-Options | ✅/❌ | nosniff | [valeur] |
| X-Frame-Options | ✅/❌ | DENY | [valeur] |

### Next steps

- [ ] Fix critical and high vulnerabilities
- [ ] Schedule a re-test after corrections
- [ ] Update vulnerable dependencies
- [ ] Configure security monitoring
```
