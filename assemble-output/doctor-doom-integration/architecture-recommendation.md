# Doctor Doom -- Patterns d'integration dans Assemble

**Date :** 2026-03-20
**Auteur :** Tony Stark (@tony-stark) -- Architecte Systeme Senior
**Statut :** Proposition

---

## Contexte

L'equipe veut ajouter Doctor Doom comme 34e agent dans Assemble. La contrainte fondamentale : Doom n'est PAS un agent ordinaire. Il ne doit pas apparaitre dans tous les workflows, ni etre auto-selectionne en `/party`. C'est un **circuit-breaker** -- un agent de derniere instance convoque rarement, mais dont l'intervention est decisive quand elle a lieu.

Doom se distingue des agents existants par sa posture :
- **Deadpool** (contrarian) challenge les idees -- il dit "ca va casser". Toujours present en `/party`.
- **Punisher** (security) audite la securite -- blue team, compliance.
- **Microchip** (redteam) attaque -- red team, exploits offensifs.
- **Doom** est un **arbitre strategique**. Il ne challenge pas pour challenger. Il ne pentest pas. Il rend un **verdict final** sur des decisions a fort impact, avec une analyse multi-dimensionnelle (technique, business, risque, cout, irreversibilite).

## Contraintes identifiees

| Contrainte | Impact |
|------------|--------|
| Doom ne doit PAS etre dans le mapping Domain -> Agent de `renderRoutingRules()` | Empeche l'invocation automatique par Jarvis |
| Doom ne doit PAS etre auto-selectionne en `/party` | Absent de la classification matrix de `party-mode.md` |
| Doom DOIT etre invocable manuellement (`@doctor-doom`, `/doom`) | Necessite un skill dedie |
| Doom DOIT pouvoir etre injecte dans des workflows existants sans les modifier | Pattern de hook/middleware |
| La generation multi-plateforme (20+ adapters) doit rester coherente | Modifications dans `template-engine.js` uniquement |
| Le pipeline de generation (`parser.js` -> `template-engine.js` -> adapters) ne doit pas etre restructure | Contrainte de stabilite |

## Analyse du systeme existant

### Points d'extension identifies

1. **`src/agents/AGENT-*.md`** -- Ajouter `AGENT-doom.md`. Le parser `loadAgents()` le charge automatiquement. Aucune modification du parser necessaire.

2. **`template-engine.js::renderRoutingRules()`** -- Le domain mapping est en dur dans la fonction (lignes 398-430). Doom ne doit PAS y apparaitre. Mais il doit etre dans `teams.md` (genere par les adapters depuis la liste d'agents).

3. **`template-engine.js::renderCompactHelp()`** -- Les equipes sont hardcodees (`teams` objet, lignes 523-533). Doom necessite une nouvelle categorie (ou un ajout dans `Meta` a cote de `contrarian`).

4. **`template-engine.js::renderCommandRegistry()`** -- C'est ici qu'on peut ajouter `/doom` comme commande. Pattern identique a `/go`, `/party`, etc.

5. **`claude-code.js` adapter** -- Les skills sont hardcodes dans `workflowShortcuts` (lignes 203-209) et `skillSlugs` (ligne 76). Ajouter `doom` aux deux.

6. **Workflows YAML** -- Les workflows existants (release, hotfix, mvp) peuvent etre enrichis avec des etapes optionnelles. Mais c'est le pattern le moins flexible -- on prefere un mecanisme de hook.

7. **Governance (`renderGovernanceRules()`)** -- Le systeme de risk assessment (LOW/MEDIUM/HIGH) est le point d'ancrage naturel pour le Gate Keeper pattern.

8. **Party mode (`party-mode.md`)** -- Deadpool a `ALWAYS ADD` dans la classification matrix. Doom ne doit PAS avoir cet attribut. Il est convocable uniquement via `add @doctor-doom`.

---

## 4 Patterns d'integration

---

### Pattern 1 -- Gate Keeper

**Concept :** Doom intervient automatiquement avant les etapes a risque eleve (deploy prod, release, decisions architecturales irreversibles).

**Quand :** Avant toute etape marquee HIGH risk dans un workflow avec `governance: standard` ou `strict`.

#### Implementation technique

**Fichier 1 : `template-engine.js::renderGovernanceRules()`**

Ajouter une section "Gate Keeper" dans les regles de governance. Quand le risk level est HIGH, injecter une etape Doom avant l'execution :

```javascript
// Dans renderGovernanceRules(), apres la section "Change Risk Assessment"
out += '## 4. Gate Keeper — Doctor Doom\n\n';
out += 'For HIGH risk workflows (/release, /hotfix, /mvp, /upgrade), ';
out += 'Doctor Doom (@doctor-doom) is **automatically convoked** before execution.\n\n';
out += '**Trigger conditions:**\n';
out += '- Any workflow step that involves production deployment\n';
out += '- Any architecture decision marked as irreversible in plan.md\n';
out += '- Any step that depends on security-clearance.md or compliance-sign-off.md\n\n';
out += '**Doom produces:** `doom-verdict.md` with GO / NO-GO / CONDITIONAL verdict.\n';
out += '- GO: proceed without changes\n';
out += '- CONDITIONAL: proceed with specified mitigations\n';
out += '- NO-GO: halt workflow, produce blocking-issues.md\n\n';
out += 'The workflow CANNOT proceed past a HIGH risk step without Doom\'s verdict.\n';
```

**Fichier 2 : `src/orchestrator/ORCHESTRATOR.md`**

Ajouter dans la section "Intervention Sequence", etape 6 (Execute sequentially) :

```markdown
### Gate Keeper Rule
Before executing any step that matches these conditions:
- The step involves `devops` agent with deployment action
- The workflow is classified HIGH risk (/release, /hotfix, /mvp)
- The step depends on security-clearance.md or compliance-sign-off.md

Insert a Gate Keeper sub-step:
1. Launch @doctor-doom as sub-agent
2. Provide all available deliverables from previous steps
3. Doom produces `doom-verdict.md`
4. If verdict is NO-GO → halt and report to user
5. If verdict is CONDITIONAL → inject mitigations into next step's context
6. If verdict is GO → proceed normally
```

**Fichier 3 : Workflows YAML (optionnel)**

On ne modifie PAS les workflows existants. Le Gate Keeper est un mecanisme de l'orchestrateur, pas du workflow. L'orchestrateur injecte l'etape Doom dynamiquement. C'est la bonne approche car :
- Ca evite de dupliquer la logique dans 15 fichiers YAML
- Ca centralise la regle dans l'orchestrateur
- Ca fonctionne aussi pour les workflows ad-hoc

#### Trade-offs

| Avantage | Inconvenient |
|----------|--------------|
| Automatique -- pas d'oubli possible | Ajoute de la latence aux workflows HIGH risk |
| Centralise dans l'orchestrateur | Necessite que l'orchestrateur comprenne le concept de "risk level" |
| Fonctionne pour les workflows ad-hoc | Doom peut devenir un goulot d'etranglement si trop de workflows sont HIGH |
| Compatible avec la governance existante | Le verdict NO-GO peut frustrer l'utilisateur (mitigation : toujours expliquer) |

---

### Pattern 2 -- Second Opinion (`/doom`)

**Concept :** L'utilisateur invoque manuellement Doom pour obtenir un verdict approfondi quand Deadpool ne suffit pas. Deadpool dit "ca sent mauvais" ; Doom dit "voici exactement pourquoi et voici ce qui va se passer si on continue".

**Quand :** Invocation manuelle via `/doom <sujet>` ou `@doctor-doom`.

#### Implementation technique

**Fichier 1 : Nouveau skill `src/skills/specific/doom-verdict.md`**

```markdown
---
name: doom-verdict
description: Doctor Doom's strategic verdict — deep multi-dimensional analysis for critical decisions
agents: [doom]
trigger: /doom
---

# Skill : Doctor Doom — Strategic Verdict

## Objective
Invoke Doctor Doom for a deep, multi-dimensional analysis of a critical decision.
Unlike Deadpool (who challenges), Doom **judges** with authority and produces a binding verdict.

## When to use
- When Deadpool flags a risk but the analysis is insufficiently deep
- Before irreversible decisions (architecture, tech stack, data model, pricing)
- When consensus exists but confidence is low
- When the stakes are too high for a standard challenge

## Doom produces
doom-verdict.md containing:

### Verdict Format
- **Subject:** the decision under review
- **Multi-dimensional analysis:**
  - Technical risk (scalability, maintainability, performance)
  - Business risk (cost, time-to-market, competitive impact)
  - Security risk (attack surface, data exposure, compliance)
  - Irreversibility score (1-5) — how hard is it to undo?
  - Blast radius (1-5) — how many systems are affected?
- **Historical precedents:** similar decisions in the industry, outcomes
- **Verdict:** GO / NO-GO / CONDITIONAL
- **Conditions (if CONDITIONAL):** specific mitigations required
- **Alternative path (if NO-GO):** what to do instead
```

**Fichier 2 : `template-engine.js::renderCommandRegistry()`**

Ajouter `/doom` dans les primary commands :

```javascript
// Apres la ligne /mvp
out += '| `/doom <subject>` | Doctor Doom strategic verdict — deep analysis for critical decisions |\n';
```

**Fichier 3 : `template-engine.js::renderCompactHelp()`**

Ajouter dans la section Commands :

```javascript
out += '| `/doom <subject>` | Doctor Doom strategic verdict |\n';
```

Et dans la section teams, ajouter Doom dans `Meta` :

```javascript
'Meta': ['contrarian', 'doom'],
```

**Fichier 4 : `claude-code.js` adapter**

Ajouter `'doom'` dans `skillSlugs` (ligne 76) :

```javascript
const skillSlugs = ['go', 'party', 'dismiss', 'help', 'review', 'bugfix', 'feature', 'sprint', 'release', 'mvp', 'doom'];
```

Et generer le skill correspondant dans la section skills generation.

#### Trade-offs

| Avantage | Inconvenient |
|----------|--------------|
| Invocation explicite -- l'utilisateur controle | Necessite que l'utilisateur sache quand convoquer Doom |
| Pas de bruit dans les workflows standards | Peut etre sous-utilise si les utilisateurs ne pensent pas a l'invoquer |
| Complementaire a Deadpool sans le remplacer | Ajoute une 11e commande (complexite du catalogue) |
| Fonctionne hors workflow (question libre) | Le verdict n'a de valeur que si Doom a acces au contexte |

---

### Pattern 3 -- Audit Final

**Concept :** En fin de workflow COMPLEX, apres le `_summary.md`, Doom review l'ensemble des livrables et produit un verdict final. C'est le "stamp of approval" avant que le workflow soit considere comme termine.

**Quand :** Automatiquement a la fin de tout workflow COMPLEX (4+ etapes).

#### Implementation technique

**Fichier 1 : `src/orchestrator/ORCHESTRATOR.md`**

Modifier la Phase 5 -- CLOSE pour inclure Doom :

```markdown
### Phase 5 — CLOSE (Jarvis + Doctor Doom)

For COMPLEX workflows (4+ steps):

1. Jarvis produces `_summary.md` (unchanged)
2. Jarvis launches @doctor-doom as sub-agent with:
   - All deliverables from all steps
   - The `_summary.md`
   - The original request/spec.md
3. Doom produces `_doom-audit.md` containing:
   - Overall coherence assessment (do the deliverables answer the original request?)
   - Risk inventory (what risks remain unaddressed?)
   - Quality gaps (what deliverables are weak or incomplete?)
   - Irreversibility check (what decisions are hard to undo?)
   - Final verdict: APPROVED / APPROVED WITH RESERVES / REJECTED
   - If REJECTED: specific items to rework before closure
4. Jarvis produces `_quality.md` incorporating Doom's findings
```

**Fichier 2 : `template-engine.js::renderCommandRegistry()`**

Modifier la section Complexity & Methodology, Phase 5 :

```javascript
out += '  5. CLOSE → `_quality.md` + `_doom-audit.md` (Doctor Doom reviews all deliverables)\n\n';
out += 'Phase 5 CLOSE is automatic for all COMPLEX workflows (4+ steps). ';
out += 'Doctor Doom produces a final audit verdict (APPROVED / APPROVED WITH RESERVES / REJECTED).\n';
```

**Fichier 3 : Pas de modification des workflows YAML**

Comme pour le Gate Keeper, c'est un mecanisme de l'orchestrateur, pas du workflow. L'orchestrateur sait que pour tout workflow COMPLEX, il doit inserer l'audit Doom en phase CLOSE.

#### Trade-offs

| Avantage | Inconvenient |
|----------|--------------|
| Automatique pour tout workflow COMPLEX | Ajoute une etape en fin de workflow (latence) |
| Review holistique (pas juste un step, tout le workflow) | Peut sembler redondant si le workflow a deja un contrarian step |
| Catch les incoherences entre livrables | Le verdict REJECTED peut forcer une iteration supplementaire |
| Integre naturellement avec `_quality.md` | Necessite que Doom lise TOUS les livrables (contexte large) |

---

### Pattern 4 -- Escalation (Deadpool -> Doom)

**Concept :** Deadpool flag un risque (verdict YELLOW ou RED). L'utilisateur peut demander "approfondir" ou "escalade", et Doom prend le relais pour une analyse plus profonde. C'est une chaine : Deadpool detecte, Doom analyse.

**Quand :** Apres un flag Deadpool, sur demande manuelle de l'utilisateur.

#### Implementation technique

**Fichier 1 : `src/agents/AGENT-contrarian.md` (Deadpool)**

Ajouter dans le format de sortie de Deadpool, apres le verdict :

```markdown
## Escalation Recommendation

If this verdict is YELLOW or RED and requires deeper analysis:
→ Recommend: `/doom [subject]` for Doctor Doom's strategic verdict
→ Or in party mode: "add @doctor-doom" for immediate deep analysis

Deadpool detects. Doom judges. Use both when the stakes are high.
```

**Fichier 2 : `src/orchestrator/ORCHESTRATOR.md`**

Ajouter dans la section Request Classification :

```markdown
## Escalation Protocol

When a Deadpool verdict is YELLOW or RED during a workflow or party session:
1. Jarvis suggests: "Deadpool has flagged critical concerns.
   Would you like Doctor Doom's strategic verdict? (`/doom` or `add @doctor-doom`)"
2. If user accepts → launch @doctor-doom with:
   - Deadpool's devil-advocate-report.md
   - All relevant deliverables from the current workflow
   - The original decision under review
3. Doom produces doom-verdict.md with his own independent analysis
4. If both Deadpool AND Doom flag RED → Jarvis marks the decision as BLOCKED
   and requires explicit user override to proceed
```

**Fichier 3 : `template-engine.js::renderRoutingRules()`**

Ajouter apres la section Persistence Behavior :

```javascript
out += '\n## Escalation Protocol\n\n';
out += 'When @deadpool produces a YELLOW or RED verdict:\n';
out += '- Suggest `/doom` or "add @doctor-doom" for deeper analysis\n';
out += '- If both @deadpool AND @doctor-doom flag RED → mark decision as BLOCKED\n';
out += '- A BLOCKED decision requires explicit user override to proceed\n\n';
```

**Fichier 4 : `src/skills/specific/party-mode.md`**

Dans la section Agent Classification Matrix, Doom n'a PAS de `ALWAYS ADD`. Mais ajouter une note :

```markdown
## Escalation to Doctor Doom

Doctor Doom is NOT auto-selected for party sessions. He is available via:
- "add @doctor-doom" during an active session
- Jarvis suggests him when Deadpool flags YELLOW or RED

Doom speaks AFTER Deadpool. His role is not to challenge — it is to JUDGE.
```

#### Trade-offs

| Avantage | Inconvenient |
|----------|--------------|
| Escalation naturelle (detection -> analyse) | Depend de Deadpool pour declencher l'escalation |
| L'utilisateur garde le controle (doit accepter l'escalation) | Ajoute un echange conversationnel supplementaire |
| Le double RED (Deadpool + Doom) est un signal extremement fort | Si l'utilisateur ignore l'escalation, Doom n'intervient jamais |
| Compatible avec tous les modes (workflow, party, `/doom`) | Necessite que Deadpool soit present (ce qui est le cas en /party) |

---

## Recommandation

**Implementer les 4 patterns simultanement.** Ils ne sont pas mutuellement exclusifs -- ils couvrent des cas differents :

| Pattern | Declencheur | Contexte |
|---------|------------|----------|
| Gate Keeper | Automatique | Workflows HIGH risk, avant deploy/release |
| Second Opinion | Manuel | `/doom <sujet>` hors workflow ou pendant |
| Audit Final | Automatique | Fin de workflow COMPLEX (4+ etapes) |
| Escalation | Semi-auto | Apres flag Deadpool YELLOW/RED |

**Ordre d'implementation recommande :**

1. **D'abord** : Creer `AGENT-doom.md` (le fondement)
2. **Ensuite** : Pattern 2 (Second Opinion / `/doom`) -- le plus simple, valeur immediate
3. **Puis** : Pattern 4 (Escalation) -- enrichit Deadpool, cout marginal
4. **Puis** : Pattern 3 (Audit Final) -- enrichit le CLOSE, cout marginal
5. **Enfin** : Pattern 1 (Gate Keeper) -- le plus complexe, necessite la governance

## Architecture cible

```
                        Utilisateur
                            |
                    [/go  /party  /doom]
                            |
                        [ Jarvis ]
                            |
            +-------+-------+-------+--------+
            |       |       |       |        |
        Workflow  Party   /doom  Escalation  Ad-hoc
            |       |       |       |
            v       v       v       v
    +---[Gate Keeper]---+  [Doom    [Deadpool
    |   (avant deploy)  |  Verdict]  flag]
    |                   |       |       |
    v                   v       v       v
  [Agents      [Audit Final]  doom-   "/doom"
   standards]   (apres CLOSE)  verdict  ou
                    |          .md     "add doom"
                    v                     |
              _doom-audit.md              v
                                    doom-verdict.md


Legende :
  [xxx]           = composant du systeme
  ---automatique  = declenchement sans action utilisateur
  .md             = livrable produit par Doom
```

## Fichiers a modifier

| Fichier | Modifications |
|---------|---------------|
| `src/agents/AGENT-doom.md` | **CREER** -- definition complete de l'agent |
| `src/skills/specific/doom-verdict.md` | **CREER** -- skill `/doom` |
| `src/agents/AGENT-contrarian.md` | Ajouter recommendation d'escalation |
| `src/orchestrator/ORCHESTRATOR.md` | Gate Keeper rule + Phase 5 CLOSE + Escalation protocol |
| `generator/lib/template-engine.js` | `renderCommandRegistry()` : ajouter `/doom` |
|  | `renderCompactHelp()` : ajouter Doom dans Meta + commande |
|  | `renderRoutingRules()` : ajouter Escalation Protocol (PAS de domain mapping) |
|  | `renderGovernanceRules()` : ajouter section Gate Keeper |
| `generator/adapters/cli/claude-code.js` | `skillSlugs` : ajouter 'doom' |
| `src/skills/specific/party-mode.md` | Note d'escalation (PAS d'auto-selection) |

**Fichiers NON modifies :**
- Aucun workflow YAML -- les patterns sont des mecanismes de l'orchestrateur
- `parser.js` -- aucune modification, Doom est un agent standard pour le parser
- `config-loader.js` -- aucune modification necessaire
- Les 20 autres adapters -- ils consomment `renderCommandRegistry()` et `renderRoutingRules()`, donc ils heritent automatiquement

## Risques et mitigation

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| Doom surcharge les workflows avec des verdicts NO-GO | Moyenne | Haut | Calibrer l'agent pour etre exigeant mais pas bloquant par defaut. Favoriser CONDITIONAL over NO-GO. |
| Les utilisateurs oublient que Doom existe | Haute | Moyen | L'escalation automatique depuis Deadpool et le Gate Keeper compensent |
| Le contexte est trop large pour Doom en Audit Final | Basse | Moyen | Doom recoit `_summary.md` + les livrables cles, pas tout le workflow |
| Doom et Deadpool se contredisent | Basse | Bas | C'est une feature, pas un bug. Deux perspectives independantes = meilleure decision |
| Les 20 adapters ne sont pas tous mis a jour | Basse | Haut | Les adapters consomment le template-engine -- une seule source de verite |

## Prochaines etapes

1. Valider cette proposition avec l'equipe
2. Creer `AGENT-doom.md` avec la personnalite et le framework d'analyse
3. Implementer `/doom` skill + adapter changes
4. Enrichir `AGENT-contrarian.md` avec la recommendation d'escalation
5. Modifier l'orchestrateur pour Gate Keeper + Audit Final
6. Tester sur un workflow `/release` complet
7. Documenter dans `/help`
