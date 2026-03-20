# Design Document : Mode YOLO pour Assemble

**Auteur :** Tony Stark (@tony-stark) -- Architecte Systeme Senior
**Date :** 2026-03-20
**Statut :** Propose
**Complexite :** MODERATE -- systeme de configuration + generation de prompts, pas de runtime a modifier

---

## 1. Contexte

Assemble est un generateur multi-agent qui produit des fichiers de configuration pour 20+ plateformes (IDE et CLI). Le systeme actuel impose des **points de validation utilisateur** a plusieurs niveaux : methodologie spec-driven, governance gates, risk assessment, et verification de livrables entre chaque etape de workflow.

L'utilisateur demande un **"mode YOLO"**, en reference au mode `--dangerously-skip-permissions` de Claude Code. L'idee : permettre aux agents d'agir de maniere autonome sans demander de validation a chaque etape, pour les utilisateurs qui font confiance au systeme et veulent de la vitesse.

---

## 2. Inventaire complet des points de validation dans le systeme actuel

J'ai identifie **7 categories de points de validation** repartis dans 5 fichiers structurants.

### 2.1 Methodologie Spec-Driven (ORCHESTRATOR.md, routing.md, template-engine.js)

C'est le mecanisme central. Pour les taches COMPLEX, 3 phases requierent une validation explicite :

| Phase | Livrable | Validation |
|-------|----------|------------|
| SPECIFY | `spec.md` | "User validation required before continuing." |
| PLAN | `plan.md` | "User validation required before continuing." |
| TASKS | `tasks.md` | "User validation required before continuing." |
| IMPLEMENT | code + tests | Pas de validation pre-execution |
| CLOSE | `_quality.md` | Automatique, pas de validation |

**Fichiers concernes :**
- `src/orchestrator/ORCHESTRATOR.md` lignes 56-77
- `generator/lib/template-engine.js` lignes 282-291 (`renderCommandRegistry`)
- `generator/lib/template-engine.js` lignes 365-373 (`renderRoutingRules`)

### 2.2 Governance Decision Gates (template-engine.js `renderGovernanceRules`)

Quand `governance != 'none'`, des gates supplementaires s'appliquent :

| Complexite | Gate | Controle |
|------------|------|----------|
| TRIVIAL | Aucun | Agent agit seul |
| MODERATE | Deliverable review | "user validates before next step" |
| COMPLEX | Phased approval | "each phase requires explicit user approval" |

**Fichier :** `template-engine.js` lignes 530-621

### 2.3 Risk Assessment (template-engine.js `renderGovernanceRules`)

Classification des workflows par niveau de risque :

| Risque | Workflows | Controle |
|--------|-----------|----------|
| LOW | /bugfix, /review, /docs | Agit, resume apres |
| MEDIUM | /feature, /sprint, /refactor | Plan requis avant action |
| HIGH | /release, /hotfix, /mvp, /upgrade | Risk assessment + rollback plan + approval gate |

**Impact YOLO :** Les workflows HIGH risk exigent actuellement `risk-assessment.md` + rollback plan + approbation explicite.

### 2.4 RBAC en mode strict (template-engine.js `renderGovernanceRules`)

En `governance: strict`, les agents sensibles necessitent une autorisation explicite :
- @punisher, @she-hulk (security, legal)
- @thor (deployments)
- @iron-fist (finance)

**Impact YOLO :** Ce RBAC est le mecanisme le plus sensible du systeme.

### 2.5 Validation inter-etapes du workflow (ORCHESTRATOR.md)

Apres chaque agent dans un workflow, Jarvis :
1. Verifie que les outputs attendus existent
2. Alerte l'utilisateur si un output manque
3. Met a jour `_manifest.yaml`

**Fichier :** `src/orchestrator/ORCHESTRATOR.md` lignes 153-158

### 2.6 Validation pre-execution (ORCHESTRATOR.md)

Avant de lancer un workflow, Jarvis DOIT valider :
1. Que chaque agent du workflow existe
2. Que chaque input reference un output d'une etape precedente
3. Que `depends_on` ne reference pas une etape inexistante

**Impact YOLO :** Cette validation est **structurelle**, pas humaine. Elle ne doit JAMAIS etre skippee.

### 2.7 Anti-pattern "Do not skip a workflow step" (ORCHESTRATOR.md)

L'orchestrateur a un anti-pattern explicite : "Do not skip a workflow step without explicit user agreement."

**Impact YOLO :** En mode YOLO, cet anti-pattern est inverse -- les etapes s'enchainent sans pause.

---

## 3. Que signifie "YOLO mode" concretement ?

### 3.1 Definition

Le mode YOLO transforme le comportement de l'orchestrateur : au lieu de s'arreter pour demander validation a chaque gate, Jarvis **enchaine les phases automatiquement** en se fiant au jugement des agents.

### 3.2 Comparaison des comportements

| Aspect | Mode Normal | Mode YOLO |
|--------|-------------|-----------|
| Spec-Driven phases 1-3 | Pause + validation utilisateur entre chaque | Enchainement automatique, pas de pause |
| Governance gates MODERATE | Livrable soumis avant prochaine etape | Livrable produit, enchainement direct |
| Governance gates COMPLEX | Approbation explicite a chaque phase | Enchainement automatique |
| Risk assessment HIGH | Risk-assessment.md + approval gate | Risk-assessment.md produit mais pas de gate |
| RBAC strict | Autorisation explicite pour agents sensibles | Agents agissent sans autorisation prealable |
| Output verification | Alerte + attente si output manquant | Alerte dans le log, continue quand meme |
| Workflow step skip | Interdit sans accord utilisateur | Jarvis peut decider de skip si non bloquant |
| `_quality.md` | Produit en fin de workflow COMPLEX | **Toujours produit** (garde-fou) |
| `_manifest.yaml` | Toujours a jour | **Toujours a jour** (garde-fou) |
| `_summary.md` | Produit en fin de workflow | **Toujours produit** (garde-fou) |

### 3.3 Ce qui NE change PAS en YOLO

Certains mecanismes sont **structurels** (pas de validation humaine, juste de la coherence interne). Ils ne doivent jamais etre desactives :

1. **Validation pre-execution** -- verifier que les agents existent, que les inputs/outputs chained correctement, que les dependances sont valides. C'est du type-checking, pas de la gouvernance.
2. **`_manifest.yaml`** -- source de verite du workflow. Sans elle, pas de tracabilite.
3. **`_summary.md`** -- synthese de fin de workflow. En YOLO, c'est encore plus important car l'utilisateur n'a pas vu les etapes intermediaires.
4. **`_quality.md`** -- bilan qualite. En YOLO, c'est le seul moment ou l'utilisateur voit ce qui s'est passe.
5. **Injection de contexte inter-agents** -- chaque agent recoit les livrables des agents precedents. C'est la chaine de dependance, pas un gate.

---

## 4. Options d'implementation

### Option A : Flag de configuration dans `.assemble.yaml`

```yaml
yolo: true
```

**Avantages :**
- Coherent avec les flags existants (`memory`, `metrics`, `mcp`, `governance`)
- Persiste entre les sessions
- Le generateur peut adapter les prompts en amont

**Inconvenients :**
- Pas de granularite par session ou par workflow
- Necessite une regeneration pour changer

**Cout :** Faible -- 4-5 fichiers a modifier dans le generateur

### Option B : Commande slash `/yolo`

```
/yolo <request>    -- execute en mode YOLO
/go <request>      -- execute en mode normal (defaut)
```

**Avantages :**
- Granularite par requete
- Pas besoin de regenerer
- L'utilisateur choisit au cas par cas

**Inconvenients :**
- Necessite un skill supplementaire
- Le prompt de l'orchestrateur doit gerer les deux modes dynamiquement

**Cout :** Moyen -- nouveau skill + modification du routing

### Option C : Combinaison config + override par commande (recommandee)

```yaml
# .assemble.yaml
yolo: false          # defaut : mode normal
```

```
/yolo <request>    -- force YOLO pour cette requete (meme si yolo: false dans config)
/go <request>      -- utilise le mode defini dans la config
```

**Avantages :**
- Flexibilite maximale : defaut dans la config, override par commande
- Coherent avec la philosophie du systeme (config = defaults, commandes = runtime)
- Le generateur precompile les instructions YOLO dans les prompts si `yolo: true`
- La commande `/yolo` permet de l'utiliser meme si le defaut est `false`

**Inconvenients :**
- Legerement plus complexe a implementer (2 chemins)
- Le prompt doit gerer le mode dynamique via `/yolo`

**Cout :** Moyen -- config + skill + modification du template engine

---

## 5. Recommandation : Option C

Je recommande l'Option C. Voici pourquoi :

1. **L'analogie Claude Code est exacte** : `--dangerously-skip-permissions` est un flag CLI, pas une config permanente. Notre `/yolo` est l'equivalent runtime. Mais pouvoir le mettre en config pour les power users qui veulent que ca soit le defaut est un vrai gain.

2. **Le systeme de profils est deja la** : `profiles.js` definit des presets (`startup`, `enterprise`, `agency`). Le profil `startup` devrait naturellement avoir `yolo: true` (shipping fast), et `enterprise` devrait avoir `yolo: false` (governance).

3. **La mecanique d'injection est deja rodee** : `renderCommandRegistry`, `renderRoutingRules` et `renderGovernanceRules` savent deja conditionner leur output sur `governance`. Ajouter un flag `yolo` suit le meme pattern.

---

## 6. Architecture d'implementation -- Impact par composant

### 6.1 `generator/lib/config-loader.js`

Ajouter `yolo` aux `DEFAULTS` :

```javascript
const DEFAULTS = {
  // ... existants ...
  yolo: false,     // Mode YOLO : agents autonomes, pas de validation gates
};
```

Le parser gere deja les booleens (`true`/`false`), aucune modification du parsing necessaire.

### 6.2 `generator/lib/profiles.js`

Ajouter `yolo` aux profils :

```javascript
startup: {
  // ... existant ...
  governance: 'none',
  yolo: true,        // Startup = ship fast, validate later
},
enterprise: {
  // ... existant ...
  governance: 'strict',
  yolo: false,       // Enterprise = every gate matters
},
agency: {
  // ... existant ...
  governance: 'none',
  yolo: false,       // Agency = client deliverables need review
},
```

Ajouter la resolution du profil dans `resolveProfile` :

```javascript
if (!explicit.has('yolo')) {
  resolved.yolo = profile.yolo || false;
}
```

### 6.3 `generator/lib/template-engine.js`

C'est le fichier central. Quatre fonctions a modifier :

#### `renderCommandRegistry(agents, skills, workflows, governance, yolo)`

Ajouter un parametre `yolo` et modifier la section "Complexity & Methodology" :

```javascript
// Si yolo est actif, remplacer les instructions de validation
if (yolo) {
  out += '### YOLO Mode (Active)\n\n';
  out += 'Autonomous execution is enabled. For `/go` requests:\n';
  out += '- **TRIVIAL**: single agent, direct answer (unchanged)\n';
  out += '- **MODERATE**: 2-3 agents, execute ALL steps without pausing for approval\n';
  out += '- **COMPLEX**: Spec-Driven Methodology runs automatically:\n';
  out += '  1. SPECIFY -> spec.md (produced, no user validation pause)\n';
  out += '  2. PLAN -> plan.md (produced, no user validation pause)\n';
  out += '  3. TASKS -> tasks.md (produced, no user validation pause)\n';
  out += '  4. IMPLEMENT -> code + tests\n';
  out += '  5. CLOSE -> `_quality.md` with full audit of what was decided\n\n';
  out += 'IMPORTANT: At the END of the workflow, present a consolidated summary.\n';
  out += 'The user sees results, not intermediate approvals.\n';
} else {
  // ... code actuel pour les phases avec validation ...
}
```

#### `renderGovernanceRules(level, yolo)`

Ajouter le parametre `yolo`. Si `yolo === true` :
- Les decision gates passent en mode "log-only" : les livrables sont produits et loggues dans le manifest, mais pas de pause.
- Le risk assessment est toujours produit (c'est un document, pas un gate).
- Le RBAC strict est **maintenu meme en YOLO** (voir section garde-fous).

```javascript
if (yolo) {
  out += '## YOLO Mode Override\n\n';
  out += 'YOLO mode is active. Decision gates are advisory, not blocking:\n';
  out += '- Deliverables are still produced at each phase\n';
  out += '- `_manifest.yaml` tracks all decisions\n';
  out += '- Workflow proceeds without user approval pauses\n';
  out += '- Risk assessments are still produced for HIGH risk workflows\n';
  if (level === 'strict') {
    out += '- **EXCEPTION: RBAC authorization is still required for sensitive agents**\n';
  }
  out += '\n';
}
```

#### `renderRoutingRules(agents, workflows, config)`

Cette fonction recoit deja `config`. Ajouter une section conditionnelle :

```javascript
if (config && config.yolo) {
  out += '## YOLO Mode\n\n';
  out += 'Autonomous execution enabled. When routing a request:\n';
  out += '- Execute all workflow steps sequentially without pausing for user approval\n';
  out += '- Still produce all deliverables (spec.md, plan.md, tasks.md)\n';
  out += '- Still update _manifest.yaml after each step\n';
  out += '- Present a consolidated _summary.md at the end\n';
  out += '- If a step fails or produces unexpected output, log it and continue\n\n';
}
```

#### `renderCompactHelp(agents, workflows)`

Ajouter `/yolo` dans la table des commandes si le mode est disponible. Cette fonction ne recoit pas `config` actuellement -- il faudra l'ajouter en parametre.

### 6.4 `generator/adapters/cli/claude-code.js`

Modifications dans la methode `generate()` :

#### Nouveau skill `/yolo`

Ajouter un 11eme skill dans le repertoire `.claude/skills/yolo/SKILL.md` :

```markdown
---
name: yolo
description: "Execute in YOLO mode -- agents act autonomously without validation pauses"
user-invocable: true
---

# /yolo -- Autonomous Execution

Execute a request in YOLO mode. Same routing as `/go` but:
- All Spec-Driven phases execute without pausing for user validation
- Governance gates are advisory (deliverables produced but no blocking approval)
- Risk assessments are still produced
- `_manifest.yaml` and `_summary.md` are always generated

This is the Assemble equivalent of `--dangerously-skip-permissions`.

Read and apply the routing rules from `.claude/rules/routing.md`.
Apply YOLO overrides: no approval pauses, autonomous execution.

User request: $ARGUMENTS
```

#### Propagation du flag `yolo` dans `renderCommandRegistry`

L'appel a `renderCommandRegistry` dans le generate principal (via `generate.js`) devra passer `config.yolo`. Le `claude-code.js` lui-meme n'appelle pas directement cette fonction -- c'est `renderRoutingRules` et `renderGovernanceRules` qui sont appelees dans `generate()`. Les deux recoivent deja `config`.

#### Mise a jour de `getOutputPaths`

Ajouter le chemin du skill YOLO :

```javascript
const skillSlugs = ['go', 'party', 'dismiss', 'help', 'review', 'bugfix',
                    'feature', 'sprint', 'release', 'mvp', 'yolo'];
```

### 6.5 `src/orchestrator/ORCHESTRATOR.md`

Ajouter une section YOLO apres la section "Spec-Driven Methodology" :

```markdown
## YOLO Mode

If the project defines `yolo: true` in `.assemble.yaml`, or if the user invokes `/yolo`:
- Execute all Spec-Driven phases (SPECIFY, PLAN, TASKS, IMPLEMENT, CLOSE)
  WITHOUT pausing for user validation between phases
- Produce all deliverables normally (spec.md, plan.md, tasks.md, code, tests)
- Update `_manifest.yaml` after each step
- Present a consolidated `_summary.md` at the end
- The `_quality.md` becomes CRITICAL: it is the user's only audit point

### What is maintained in YOLO mode
- Pre-execution validation (agents exist, inputs chain correctly, dependencies valid)
- `_manifest.yaml` tracking
- `_summary.md` at workflow end
- `_quality.md` for COMPLEX workflows
- Cross-session memory updates
- Risk assessment documents (produced but not blocking)

### What is skipped in YOLO mode
- User validation pauses between Spec-Driven phases
- Governance approval gates (MODERATE and COMPLEX)
- RBAC authorization prompts (EXCEPT in governance: strict)
- "Output missing" blocking alerts (downgraded to warnings in the log)
```

### 6.6 `generator/generate.js`

Ajouter la normalisation du flag `yolo` comme pour les autres booleens :

```javascript
config.yolo = config.yolo === true || config.yolo === 'true';
```

Et le log :

```javascript
if (config.yolo) console.log('YOLO mode: enabled (autonomous execution)');
```

Passer `config.yolo` dans les appels a `renderCommandRegistry` :

```javascript
// Actuellement :
renderCommandRegistry(agents, skills, workflows, governance)
// Devient :
renderCommandRegistry(agents, skills, workflows, governance, config.yolo)
```

### 6.7 Impact sur les autres adapters (20 adapters)

Les autres adapters (`cursor.js`, `windsurf.js`, `codex.js`, etc.) utilisent tous `renderCommandRegistry` et `renderRoutingRules` de `template-engine.js`. **Le flag YOLO se propage automatiquement** via ces fonctions partagees.

Seul `claude-code.js` necessite l'ajout du skill `/yolo` car c'est le seul adapter qui genere des skills. Les autres adapters n'ont pas de mecanisme de commande slash natif -- ils utilisent les regles injectees dans leurs fichiers de config.

Cela signifie que pour les adapters IDE (Cursor, Windsurf, etc.), le mode YOLO sera pilote par la config `.assemble.yaml` uniquement (pas de commande `/yolo` runtime). C'est acceptable car ces IDE n'ont pas de concept de skill invocable.

---

## 7. Garde-fous : ce qui ne doit JAMAIS etre skippe

Meme en YOLO mode, certains invariants sont sacres :

### 7.1 Invariants structurels (jamais desactivables)

| Invariant | Raison |
|-----------|--------|
| Validation pre-execution des workflows | C'est du type-checking. Un workflow mal chaine produira des erreurs en cascade. |
| `_manifest.yaml` mise a jour apres chaque step | Source de verite. Sans elle, impossible de savoir ou en est le workflow. |
| `_summary.md` en fin de workflow | En YOLO, l'utilisateur n'a pas vu les intermediaires. Le summary est son seul point de controle. |
| `_quality.md` pour les workflows COMPLEX | Bilan de ce qui a ete decide sans validation humaine. Point d'audit critique. |
| Injection de contexte inter-agents | La chaine de dependance entre agents n'est pas un gate -- c'est la coherence du systeme. |
| Cross-session memory (`_memory.md`) | Persistence entre sessions. Pas un gate, un mecanisme de continuite. |

### 7.2 Garde-fou conditionnel

| Garde-fou | Condition | Raison |
|-----------|-----------|--------|
| RBAC pour agents sensibles | `governance: strict` | En mode strict, meme YOLO ne bypass pas l'autorisation pour securite/devops/finance/legal. Le risque est trop eleve. |
| Audit trail (`_audit.md`) | `governance: strict` | En strict, tout doit etre logue. YOLO change le flux, pas la tracabilite. |

### 7.3 Justification du maintien du RBAC strict

L'analogie avec Claude Code est eclairante. Meme avec `--dangerously-skip-permissions`, Claude Code a des protections internes (pas de `rm -rf /`, pas d'envoi de donnees sensibles). Notre equivalent :

- En `governance: none` ou `standard` : YOLO desactive tous les gates humains. L'utilisateur est un power user qui sait ce qu'il fait.
- En `governance: strict` : YOLO desactive les phases spec-driven et les decision gates, MAIS maintient le RBAC car `strict` a ete choisi explicitement pour un contexte reglementaire. Bypasser le RBAC en strict serait contradictoire avec l'intention declaree de l'utilisateur.

---

## 8. Schema d'architecture -- flux de decision

```
Utilisateur
    |
    |-- /go <request>    -- verifie config.yolo
    |-- /yolo <request>  -- force yolo=true pour cette requete
    |
    v
[Jarvis -- Routing Intelligence]
    |
    |-- Evaluer complexite (TRIVIAL / MODERATE / COMPLEX)
    |
    |-- YOLO actif ?
    |   |
    |   |-- OUI ─────────────────────────────────────────┐
    |   |   Executer toutes les phases sans pause         |
    |   |   Produire tous les livrables                   |
    |   |   Logger dans _manifest.yaml                    |
    |   |   governance: strict ?                          |
    |   |   |-- OUI : maintenir RBAC + audit trail        |
    |   |   |-- NON : tout est autonome                   |
    |   |   Produire _summary.md + _quality.md a la fin   |
    |   |                                                 |
    |   |-- NON ─────────────────────────────────────────┐
    |       Mode normal : validation entre chaque phase   |
    |       Governance gates appliques selon le niveau     |
    |       Risk assessment bloquant pour HIGH risk        |
    |
    v
[_summary.md -- point de controle final]
```

---

## 9. Plan d'implementation -- fichiers a modifier

| # | Fichier | Modification | Effort |
|---|---------|-------------|--------|
| 1 | `generator/lib/config-loader.js` | Ajouter `yolo: false` aux DEFAULTS | Trivial |
| 2 | `generator/lib/profiles.js` | Ajouter `yolo` aux profils + resolution | Trivial |
| 3 | `generator/lib/template-engine.js` | Modifier `renderCommandRegistry`, `renderGovernanceRules`, `renderRoutingRules`, `renderCompactHelp` | Moyen |
| 4 | `generator/adapters/cli/claude-code.js` | Ajouter skill `/yolo`, mettre a jour `getOutputPaths` et `skillSlugs` | Moyen |
| 5 | `src/orchestrator/ORCHESTRATOR.md` | Ajouter section "YOLO Mode" | Faible |
| 6 | `generator/generate.js` | Normaliser `config.yolo`, passer aux renderers | Trivial |
| 7 | `src/agents/AGENT-jarvis.md` | Mentionner `/yolo` dans les capacites | Trivial |

**Estimation totale :** 2-3 heures de developpement pour un developpeur familier du codebase.

---

## 10. Risques et mitigation

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| L'utilisateur active YOLO + strict et ne comprend pas pourquoi le RBAC bloque encore | Moyenne | Faible | Message explicite dans le prompt : "YOLO mode is active but governance: strict maintains RBAC" |
| Un workflow YOLO produit un livrable incoherent car un output intermediaire etait manquant | Moyenne | Moyen | Downgrader l'alerte en warning MAIS l'inclure dans `_quality.md` avec un flag visible |
| L'utilisateur oublie qu'il est en YOLO et est surpris par l'absence de validation | Faible | Faible | `/go` affiche un indicateur "[YOLO]" dans l'en-tete de reponse quand le mode est actif |
| Les 20 adapters non-Claude Code ne supportent pas `/yolo` comme commande runtime | Certaine | Faible | Acceptable : pour ces adapters, YOLO = config only. Documenter cette limitation. |

---

## 11. ADR -- Decisions structurantes

### ADR-001 : Introduction du mode YOLO comme flag de configuration + commande

**Date :** 2026-03-20 | **Statut :** Propose

**Contexte :**
Le systeme impose des validations humaines a chaque phase de la methodologie spec-driven et a chaque governance gate. Certains utilisateurs (solopreneurs, power users, sessions de prototypage rapide) veulent un mode autonome ou les agents enchainent sans pause.

**Decision :**
Implementer un mode YOLO accessible via :
- `yolo: true/false` dans `.assemble.yaml` (persistant, defaut par profil)
- `/yolo <request>` comme commande runtime (override ponctuel)

Le flag est propage par le generateur dans les prompts via `renderCommandRegistry`, `renderRoutingRules` et `renderGovernanceRules`.

**Consequences positives :**
- Vitesse d'execution considerablement augmentee pour les workflows COMPLEX
- Alignement avec les pratiques du marche (Claude Code `--dangerously-skip-permissions`, Cursor YOLO mode)
- Pas de modification du runtime -- tout est dans la generation de prompts

**Consequences negatives :**
- Risque de livrables incoherents si un step produit un output manquant
- L'utilisateur perd la visibilite intermediaire sur les decisions des agents
- Le `_quality.md` devient le seul filet de securite post-execution

**Alternatives rejetees :**
- **Option A (config only)** : Rejetee car pas assez flexible. L'utilisateur doit pouvoir choisir YOLO par requete.
- **Option B (commande only)** : Rejetee car les adapters IDE n'ont pas de skills. La config est necessaire pour eux.

---

### ADR-002 : Le RBAC strict est maintenu meme en YOLO

**Date :** 2026-03-20 | **Statut :** Propose

**Contexte :**
En `governance: strict`, des agents sensibles (securite, devops, finance, legal) necessitent une autorisation explicite avant d'agir (RBAC). La question est : YOLO doit-il bypasser ce RBAC ?

**Decision :**
Non. En `governance: strict`, le RBAC est maintenu meme en mode YOLO. La raison : `strict` est un choix delibere pour un contexte reglementaire. Si l'utilisateur veut un YOLO total, il doit passer en `governance: standard` ou `none`.

**Consequences positives :**
- Pas de contradiction entre `strict` et `yolo`
- Protection des actions a risque irreversible (deploiement, audit securite, modifications financieres)

**Consequences negatives :**
- Friction residuelle en mode YOLO + strict (mais c'est voulu)
- Necessite un message clair pour expliquer pourquoi certains gates persistent

**Alternatives rejetees :**
- **YOLO bypass tout y compris RBAC** : Trop dangereux. Un agent devops pourrait deployer en prod sans validation.
- **Nouveau flag `yolo_override_rbac`** : Surarchitecture. Si l'utilisateur veut ca, il passe en `governance: none`.

---

### ADR-003 : Le `_quality.md` est obligatoire en YOLO pour tous les workflows (pas seulement 4+ steps)

**Date :** 2026-03-20 | **Statut :** Propose

**Contexte :**
Actuellement, `_quality.md` est produit uniquement pour les workflows COMPLEX (4+ steps). En mode YOLO, l'utilisateur ne voit aucune etape intermediaire.

**Decision :**
En mode YOLO, `_quality.md` est produit pour TOUT workflow de 2+ steps (MODERATE et COMPLEX), pas seulement 4+. C'est le filet de securite minimal.

**Consequences positives :**
- L'utilisateur a toujours un point de controle post-execution
- Les decisions prises par les agents sont documentees

**Consequences negatives :**
- Leger overhead de generation pour les workflows courts (MODERATE)
- Mais cet overhead est negligeable compare au gain de ne pas attendre entre les phases

---

## 12. Prochaines etapes

1. **Valider ce design** avec l'utilisateur
2. **Implementer** dans l'ordre : config-loader -> profiles -> template-engine -> claude-code adapter -> orchestrator.md -> generate.js -> AGENT-jarvis.md
3. **Tester** en regenerant pour la plateforme `claude-code` avec `yolo: true` et verifier que les prompts generes sont corrects
4. **Documenter** dans le README et le `/help`
5. **Propager** aux 20 autres adapters (automatique via template-engine)
