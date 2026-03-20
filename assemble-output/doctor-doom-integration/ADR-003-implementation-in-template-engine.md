# ADR-003 : Implementation dans le template engine sans modification des workflows YAML

Date : 2026-03-20 | Statut : Propose

## Contexte

Le systeme Assemble a une architecture en pipeline : `parser.js` -> `template-engine.js` -> adapters (20+). Le template engine genere le routing, le command registry, la governance, et le help. Les adapters consomment ces fonctions pour produire les fichiers specifiques a chaque plateforme (Claude Code, Cursor, Copilot, etc.).

La question : ou implementer les 4 patterns Doom pour que les 20+ adapters en beneficient automatiquement ?

## Decision

Toutes les modifications Doom sont concentrees dans 3 couches :

### Couche 1 : Source (`src/`)
- `src/agents/AGENT-doom.md` -- nouveau fichier agent
- `src/skills/specific/doom-verdict.md` -- nouveau skill pour `/doom`
- `src/agents/AGENT-contrarian.md` -- ajout de la recommendation d'escalation
- `src/orchestrator/ORCHESTRATOR.md` -- Gate Keeper + Audit Final + Escalation
- `src/skills/specific/party-mode.md` -- note d'escalation

### Couche 2 : Template Engine (`generator/lib/template-engine.js`)
- `renderRoutingRules()` : ajouter section Escalation Protocol. NE PAS ajouter Doom dans le domain mapping.
- `renderCommandRegistry()` : ajouter `/doom` dans les primary commands.
- `renderCompactHelp()` : ajouter Doom dans la categorie `Meta` et dans les commandes.
- `renderGovernanceRules()` : ajouter section Gate Keeper (section 4).

### Couche 3 : Adapter Claude Code (`generator/adapters/cli/claude-code.js`)
- `skillSlugs` : ajouter `'doom'`
- Section skills generation : ajouter un bloc pour generer `.claude/skills/doom/SKILL.md`

### Ce qu'on NE modifie PAS
- `parser.js` -- Doom est un agent standard pour le parser
- `config-loader.js` -- pas de nouvelle option de configuration
- Les 15 fichiers de workflow YAML -- les patterns sont dans l'orchestrateur
- Les 19 autres adapters -- ils consomment le template engine, donc ils heritent

## Consequences

### Positives
- Une seule source de verite (template engine) pour tous les adapters
- Les 20+ adapters beneficient automatiquement de `/doom` sans modification individuelle
- Le parser reste generique -- il charge `AGENT-doom.md` comme n'importe quel agent
- Aucun workflow YAML touche -- maintenance zero sur les 15 workflows

### Negatives
- L'adapter Claude Code est le seul a necessiter une modification specifique (pour `skillSlugs`). Les autres adapters qui gerent les skills differemment devront etre verifies.
- La logique "Doom n'est pas dans le domain mapping" est implicite dans le code de `renderRoutingRules()` -- il faudrait un commentaire explicatif.
- Si un adapter ne consomme pas `renderCommandRegistry()`, il n'aura pas `/doom` (mais c'est deja le cas pour toutes les commandes).

## Alternatives rejetees

### Modifier chaque adapter individuellement
Ajouter la logique Doom dans chacun des 20+ adapters. Rejete car : violation flagrante de DRY, maintenance impossible, risque d'incoherence entre plateformes.

### Ajouter un systeme de "plugins" au template engine
Creer un mecanisme de hooks dans le template engine pour que Doom soit un plugin enregistrable. Elegant mais sur-ingenierie pour un seul agent. A reconsiderer si d'autres circuit-breakers sont ajoutes.

### Nouvelle fonction dediee `renderDoomIntegration()`
Creer une fonction separee dans le template engine. Rejete car : ca fragmente la logique. Mieux vaut enrichir les fonctions existantes (`renderGovernanceRules`, `renderCommandRegistry`, etc.) qui sont deja les points d'extension naturels.
