# ADR-002 : 4 patterns d'integration complementaires pour Doctor Doom

Date : 2026-03-20 | Statut : Propose

## Contexte

Doctor Doom est un agent circuit-breaker (cf. ADR-001). La question est : comment et quand est-il invoque ? Un seul mecanisme ne suffit pas car Doom doit intervenir dans des contextes differents (workflow automatique, demande manuelle, escalation).

## Decision

Implementer 4 patterns complementaires et non exclusifs :

1. **Gate Keeper** -- injection automatique dans les workflows HIGH risk, avant les etapes de deploy/release. Mecanisme porte par l'orchestrateur et la governance, pas par les workflows YAML.

2. **Second Opinion (`/doom`)** -- commande manuelle. Nouveau skill (`doom-verdict.md`), nouveau slot dans le command registry, nouveau skill directory dans l'adapter Claude Code.

3. **Audit Final** -- injection automatique en Phase 5 CLOSE de tout workflow COMPLEX. Doom review les livrables et produit `_doom-audit.md` avant `_quality.md`.

4. **Escalation** -- quand Deadpool flag YELLOW ou RED, Jarvis suggere `/doom` ou `add @doctor-doom`. Si les deux flagguent RED, la decision est marquee BLOCKED.

## Consequences

### Positives
- 4 canaux d'invocation couvrent tous les cas d'usage
- Aucun workflow YAML modifie -- les patterns sont dans l'orchestrateur et la governance
- L'escalation cree une synergie Deadpool/Doom au lieu d'une redondance
- Le Gate Keeper renforce la governance existante (s'active naturellement avec `governance: standard`)

### Negatives
- 4 patterns = complexite de documentation et d'onboarding
- Le Gate Keeper ajoute de la latence sur les workflows HIGH risk
- L'Audit Final peut sembler redondant avec les QA/security steps existants (mais son scope est holistique, pas technique)
- L'escalation depend de la presence de Deadpool (qui n'est garanti qu'en `/party`)

## Alternatives rejetees

### Un seul pattern (Second Opinion uniquement)
Plus simple, mais Doom serait sous-utilise. Les utilisateurs oublient d'invoquer manuellement. Le Gate Keeper et l'Audit Final compensent en automatisant les cas critiques.

### Doom comme etape explicite dans chaque workflow HIGH risk
Modifier les YAML de release, hotfix, mvp pour ajouter une etape Doom. Rejete car : maintenance couteuse (15 fichiers YAML a maintenir), rigidite (ne fonctionne pas pour les workflows ad-hoc), et violation du principe DRY.

### Doom remplace Deadpool
Non. Leurs roles sont differents. Deadpool detecte et challenge (rapide, systematique, toujours present). Doom juge et tranche (profond, rare, decisif). Les deux se completent.
