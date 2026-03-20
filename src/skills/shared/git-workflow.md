---
name: git-workflow
description: Git workflow management — branching strategy, commit conventions, PR creation, conflict resolution, and merge process
agents: [dev-backend, dev-frontend, dev-fullstack, dev-mobile, devops, scrum]
trigger: /git
---

# Skill : Git Workflow

## Objective

Apply a rigorous and consistent Git workflow to ensure a clean history, smooth collaboration, and reliable deployments. This skill covers the full cycle: branch creation, conventional commits, pull requests, review, and merge.

## When to use

- When starting a new feature, fix, or technical task
- When creating a pull request
- To resolve merge conflicts
- To define or recall the branching strategy of a project
- During a release or hotfix requiring specific branch management

## Steps

1. **Identify the type of change** — Classify the work: `feature`, `fix`, `hotfix`, `refactor`, `docs`, `chore`, `release`. This determines the branch prefix and commit type.
2. **Create the branch** — From the appropriate base branch (`main`, `develop`, `release/*`), create a branch named following the convention: `type/ID-short-description` (e.g., `feature/PROJ-123-user-authentication`).
3. **Write commits** — Follow the Conventional Commits convention: `type(scope): description`. Each commit must be atomic (a single logical change). The message must explain the **why**, not the **what**.
4. **Prepare the pull request** — Write a clear title and a structured body: context, changes made, impacts, test instructions. Link the corresponding ticket/issue.
5. **Handle conflicts** — In case of conflict, rebase onto the target branch rather than merging. Resolve file by file, understanding both versions. Test after resolution.
6. **Facilitate the review** — Respond to review comments, apply requested corrections in separate commits (makes re-review easier). Do not force-push during an active review.
7. **Merge and clean up** — After approval, squash-merge if the branch history is noisy, regular merge if commits are clean. Delete the remote branch after merge. Verify that CI passes.

## Exit Checklist

- [ ] The branch follows the project naming convention
- [ ] Commits follow the Conventional Commits format
- [ ] Each commit is atomic and the message explains the why
- [ ] The PR has a clear title, structured description, and link to the ticket
- [ ] Any conflicts are cleanly resolved (rebase)
- [ ] CI/CD passes on the branch before merge
- [ ] The remote branch is deleted after merge
- [ ] Git history remains readable and navigable

## Output Format

```markdown
## Action Git

**Type :** [feature | fix | hotfix | refactor | docs | chore | release]
**Ticket :** [ID du ticket ou N/A]

### Branch

```bash
git checkout -b type/ID-short-description origin/develop
```

### Proposed commits

```
type(scope): concise description of the change

Optional body explaining the context and the why.

Refs: #ticket-ID
```

### Pull Request Template

**Title :** type(scope): short description

**Description :**

#### Context
Why this change is necessary.

#### Changes
- List of main modifications
- With impact on existing components

#### How to test
1. Step 1 to reproduce/verify
2. Step 2

#### Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking change (or documented)
- [ ] CI passes

### Merge strategy

**Recommendation :** [squash-merge | merge commit | rebase-merge]
**Reason :** [justification]
```
