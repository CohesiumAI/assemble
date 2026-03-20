---
name: documentation
description: Technical and functional documentation generation — README, architecture guides, ADR, API documentation, and user guides
agents: [dev-backend, dev-frontend, dev-fullstack, dev-mobile, devops, architect, qa, security, db, data, pm, scrum, ai-engineer, automation, seo, geo-aio, content-seo, marketing, copywriter, ads, growth, social, storytelling, ux, brand, contrarian, analyst, legal, pr-comms]
trigger: /doc
---

# Skill : Documentation

## Objective

Produce clear, structured, and maintainable documentation that addresses the identified need: technical documentation (README, ADR, guides), API documentation, functional documentation, or user guide. Each document must be self-contained, up to date, and actionable.

## When to use

- When creating a new project, module, or service
- After a significant architectural decision (ADR)
- When publishing or modifying an API
- When a business process needs to be documented for the team
- When onboarding new members to the project
- When existing documentation is outdated or missing

## Steps

1. **Identify the document type** — Classify the need: project README, architecture guide, ADR (Architecture Decision Record), API documentation, user guide, operational runbook, changelog.
2. **Define the audience** — Who will read this document? Developer, ops, product owner, end user? Adapt the level of detail and vocabulary accordingly.
3. **Collect source information** — Analyze code, configuration files, existing comments, tickets, relevant conversations. Do not invent — document what exists.
4. **Structure the document** — Apply the appropriate template for the document type. Use hierarchical headings, lists, tables, and code blocks to maximize readability.
5. **Write the content** — Write concisely and directly. Each section should answer a specific question. Include concrete examples (commands, queries, snippets) when relevant.
6. **Add visual elements** — Architecture diagrams (Mermaid), flow charts, reference tables. A good diagram often replaces three paragraphs.
7. **Validate consistency** — Verify that file paths, commands, and code examples are correct and functional. Remove empty or placeholder sections.
8. **Define maintenance** — Indicate the last update date, document owner, and revision conditions (e.g., at each release, at each architecture change).

## Exit Checklist

- [ ] Document type and audience are clearly identified
- [ ] Structure follows the appropriate template
- [ ] Content is factual, concise, and actionable
- [ ] Code examples and commands are verified and functional
- [ ] Diagrams and charts are included when necessary
- [ ] No empty or placeholder sections are present
- [ ] Update date and owner are indicated
- [ ] The document is self-contained (understandable without verbal context)

## Output Format

```markdown
## Generated Documentation

**Type :** [README | ADR | Architecture guide | API doc | User guide | Runbook]
**Audience :** [Developers | Ops | Product | End users]
**Last updated :** [date]
**Owner :** [name/role]

---

### [Document title]

#### Context
[Why this document exists, what problem it solves]

#### Main content
[Document body structured according to the chosen type template]

##### For a README :
- Project description
- Prerequisites and installation
- Configuration
- Usage / Available commands
- Architecture (diagram)
- Contributing
- License

##### For an ADR :
- Status : [Proposed | Accepted | Deprecated | Superseded by ADR-XXX]
- Context
- Decision
- Alternatives considered
- Consequences

##### For a Runbook :
- Scenario / Triggering alert
- Step-by-step diagnosis
- Corrective actions
- Escalation

---

**Next scheduled review :** [date or condition]
```
