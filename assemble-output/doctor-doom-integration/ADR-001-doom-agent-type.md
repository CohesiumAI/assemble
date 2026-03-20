# ADR-001 : Doctor Doom comme agent "circuit-breaker" et non agent standard

Date : 2026-03-20 | Statut : Propose

## Contexte

L'equipe Assemble comporte 33 agents repartis en equipes (Dev, Ops, Product, Marketing, etc.). Tous les agents suivent le meme cycle de vie : ils sont references dans le domain mapping, auto-selectionnables par Jarvis, et disponibles en party mode.

Doctor Doom doit etre ajoute comme 34e agent, mais avec une contrainte forte : il ne doit PAS etre traite comme un agent ordinaire. Son role est celui d'un "circuit-breaker" -- convoque rarement mais de maniere decisive.

## Decision

Introduire une nouvelle categorie d'agent dans Assemble : **agent de type "circuit-breaker"**.

Un circuit-breaker :
- **N'apparait PAS** dans le domain mapping de `renderRoutingRules()` (pas d'invocation automatique par Jarvis sur matching de mots-cles)
- **N'est PAS** auto-selectionne en `/party` (absent de la classification matrix)
- **EST** dans `teams.md` (visible dans le catalogue)
- **EST** invocable manuellement (`@doctor-doom`, `/doom`)
- **EST** injectable par l'orchestrateur dans des conditions specifiques (Gate Keeper, Audit Final)
- **EST** suggeré par l'orchestrateur dans des conditions specifiques (Escalation depuis Deadpool)

Cette distinction est purement au niveau du routing et de la generation. Le fichier `AGENT-doom.md` est un fichier agent standard -- c'est le template engine qui traite Doom differemment.

## Consequences

### Positives
- Doom ne genere pas de bruit dans les workflows standards
- L'intervention de Doom a plus de poids car elle est rare et deliberee
- Le systeme reste extensible -- d'autres circuit-breakers pourraient etre ajoutes (ex: un agent "legal emergency" ou "cost guardian")
- Aucune modification du parser ni du format des agents

### Negatives
- La distinction "agent standard vs circuit-breaker" n'est pas formalisee dans un schema -- c'est implicite dans le code du template engine
- Les futurs developpeurs doivent savoir que Doom est intentionnellement absent du domain mapping
- Si on ajoute d'autres circuit-breakers, il faudra formaliser le concept (metadata dans le frontmatter, ex: `type: circuit-breaker`)

## Alternatives rejetees

### Alternative A : Agent standard avec filtre
Ajouter Doom comme agent standard dans le domain mapping et filtrer dans les workflows. Rejete car : ca inverse la logique. Doom serait selectionne par defaut puis filtre, au lieu d'etre absent par defaut et invoque explicitement.

### Alternative B : Agent externe (pas dans `src/agents/`)
Mettre Doom dans un dossier separe (`src/circuit-breakers/`). Rejete car : ca necessite une modification du parser et de toute la chaine de generation. Sur-ingenierie pour un seul agent.

### Alternative C : Metadata `type: circuit-breaker` dans le frontmatter
Ajouter un champ `type` au frontmatter des agents et adapter le template engine pour exclure les circuit-breakers du domain mapping automatiquement. Bonne idee a terme, mais premature pour un seul agent. A reconsiderer si on ajoute un 2e circuit-breaker.
