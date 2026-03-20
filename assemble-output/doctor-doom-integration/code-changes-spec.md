# Specification des modifications de code

**Date :** 2026-03-20
**Auteur :** Tony Stark (@tony-stark)

Ce document decrit chaque modification de code necessaire, fichier par fichier, avec le diff conceptuel.

---

## 1. `generator/lib/template-engine.js`

### 1a. `renderCommandRegistry()` -- ajouter `/doom`

**Localisation :** Apres la ligne `/mvp` dans les primary commands (ligne ~267)

```javascript
// AVANT
out += '| `/mvp` | MVP launch (9 agents) |\n';
out += '\n';

// APRES
out += '| `/mvp` | MVP launch (9 agents) |\n';
out += '| `/doom <subject>` | Doctor Doom strategic verdict — critical decision analysis |\n';
out += '\n';
```

### 1b. `renderCompactHelp()` -- ajouter Doom dans commands et teams

**Localisation 1 :** Apres la ligne `/mvp` dans les commandes (ligne ~517)

```javascript
// AVANT
out += '| `/mvp` | MVP launch |\n';
out += '\n';

// APRES
out += '| `/mvp` | MVP launch |\n';
out += '| `/doom <subject>` | Doctor Doom strategic verdict |\n';
out += '\n';
```

**Localisation 2 :** Dans l'objet `teams` (ligne ~533)

```javascript
// AVANT
'Meta': ['contrarian'],

// APRES
'Meta': ['contrarian', 'doom'],
```

### 1c. `renderRoutingRules()` -- ajouter Escalation Protocol

**Localisation :** Apres la section "Persistence Behavior" (ligne ~486), avant le rendering de memory/metrics

```javascript
// AJOUTER
out += '\n## Escalation Protocol\n\n';
out += 'When @deadpool produces a YELLOW or RED verdict during a workflow or party session:\n';
out += '1. Suggest to the user: "Would you like Doctor Doom\'s strategic verdict? (`/doom` or `add @doctor-doom`)"\n';
out += '2. If user accepts → launch @doctor-doom with Deadpool\'s report + all relevant deliverables\n';
out += '3. If both @deadpool AND @doctor-doom flag the same decision as critical → mark as BLOCKED\n';
out += '4. A BLOCKED decision requires explicit user override to proceed\n\n';
```

**IMPORTANT :** NE PAS ajouter Doom dans le bloc "Domain -> Agent Mapping" (lignes 398-430). Doom ne doit pas etre auto-selectionne.

### 1d. `renderGovernanceRules()` -- ajouter Gate Keeper (section 4)

**Localisation :** Apres la section "3. Quality Checkpoints" (ligne ~609), avant les sections standard/strict

```javascript
// AJOUTER
out += '## 4. Gate Keeper — Doctor Doom\n\n';
out += 'For HIGH risk workflows (/release, /hotfix, /mvp, /upgrade):\n\n';
out += '**Before production-facing steps** (deployment, release, data migration):\n';
out += '1. Jarvis automatically invokes @doctor-doom as a sub-agent\n';
out += '2. Doom receives all deliverables produced so far in the workflow\n';
out += '3. Doom produces `doom-verdict.md` with GO / CONDITIONAL / NO-GO verdict\n';
out += '4. If NO-GO → workflow halts, user is informed with blocking issues\n';
out += '5. If CONDITIONAL → mitigations are injected into the next step\'s context\n';
out += '6. If GO → workflow proceeds normally\n\n';
out += 'The Gate Keeper step is inserted by the orchestrator dynamically — it does NOT appear in workflow YAML files.\n\n';
```

---

## 2. `generator/adapters/cli/claude-code.js`

### 2a. Ajouter 'doom' dans skillSlugs

**Localisation :** Ligne 76

```javascript
// AVANT
const skillSlugs = ['go', 'party', 'dismiss', 'help', 'review', 'bugfix', 'feature', 'sprint', 'release', 'mvp'];

// APRES
const skillSlugs = ['go', 'party', 'dismiss', 'help', 'review', 'bugfix', 'feature', 'sprint', 'release', 'mvp', 'doom'];
```

### 2b. Generer le skill `/doom`

**Localisation :** Apres le bloc `/help` (ligne ~199), ajouter un nouveau bloc avant les workflow shortcuts

```javascript
// 2e. /doom — Doctor Doom verdict
{
  const doomSkill = (skills.specific || []).find(s =>
    s.meta.name === 'doom-verdict' || (s.meta.trigger || '').includes('doom')
  );
  const dir = path.join(skillsDir, 'doom');
  fs.mkdirSync(dir, { recursive: true });
  let content = '---\n';
  content += 'name: doom\n';
  content += 'description: "Doctor Doom strategic verdict — critical decision analysis"\n';
  content += 'user-invocable: true\n';
  content += '---\n\n';
  if (doomSkill) {
    const prepared = prepareAgent(doomSkill, config);
    content += prepared.content;
  } else {
    content += '# /doom — Doctor Doom Strategic Verdict\n\n';
    content += 'Invoke Doctor Doom for a multi-dimensional analysis of a critical decision.\n\n';
    content += 'Read and apply the agent definition from `.claude/agents/doctor-doom/AGENT.md`.\n\n';
    content += '1. Gather all available context (deliverables, reports, previous agent outputs)\n';
    content += '2. Analyze across 6 dimensions: technical risk, business risk, security risk, irreversibility, blast radius, operational cost\n';
    content += '3. Render verdict: GO / CONDITIONAL / NO-GO\n';
    content += '4. If CONDITIONAL: list specific mitigations\n';
    content += '5. If NO-GO: provide alternative path\n\n';
    content += 'Subject: $ARGUMENTS\n';
  }
  fs.writeFileSync(path.join(dir, 'SKILL.md'), content, 'utf-8');
}
```

---

## 3. `src/orchestrator/ORCHESTRATOR.md`

### 3a. Gate Keeper rule dans Intervention Sequence

**Localisation :** Dans la section "Intervention Sequence", enrichir le point 6 (Execute sequentially)

Ajouter apres le point 6e :

```markdown
   f. **Gate Keeper check** — Before any step that matches ALL of these:
      - The workflow is HIGH risk (/release, /hotfix, /mvp, /upgrade)
      - The step involves production deployment, data migration, or public release
      Insert a sub-step: launch @doctor-doom with all available deliverables.
      Doom produces `doom-verdict.md`. If NO-GO, halt and report to user.
```

### 3b. Phase 5 CLOSE enrichie

**Localisation :** Remplacer la Phase 5

```markdown
### Phase 5 — CLOSE (Jarvis + Doctor Doom)
Produce `_summary.md`: what was delivered, validated, remaining risks, lessons learned.
For COMPLEX workflows (4+ steps), also:
1. Launch @doctor-doom with all deliverables + _summary.md
2. Doom produces `_doom-audit.md` (coherence, risks, quality gaps, final verdict)
3. Produce `_quality.md` incorporating Doom's findings
→ Automatic for workflows with 4+ steps. No validation required.
```

### 3c. Escalation Protocol

**Localisation :** Nouvelle section apres "Request Classification"

```markdown
## Escalation Protocol

When @deadpool produces a YELLOW or RED verdict:
1. Suggest: "Deadpool has flagged critical concerns. `/doom` or `add @doctor-doom` for deeper analysis?"
2. If accepted → launch @doctor-doom with Deadpool's report + all deliverables
3. If both Deadpool AND Doom flag RED → mark decision as BLOCKED
4. BLOCKED requires explicit user override to proceed
```

---

## 4. `src/agents/AGENT-contrarian.md` (Deadpool)

### 4a. Ajouter recommendation d'escalation dans le format de sortie

**Localisation :** Apres le bloc "Verdict" dans le format de sortie par defaut

Ajouter a la fin du format :

```markdown
## Escalation
If this verdict is YELLOW or RED:
→ Recommend `/doom [subject]` for Doctor Doom's strategic analysis
→ In party mode: "add @doctor-doom"
```

---

## 5. `src/skills/specific/party-mode.md`

### 5a. Note sur Doctor Doom

**Localisation :** Apres la section "Agent Classification Matrix"

```markdown
## Doctor Doom — Special Rules

Doctor Doom is NOT auto-selected for party sessions. He is a circuit-breaker agent:
- Available via "add @doctor-doom" during an active session
- Jarvis suggests him when Deadpool flags YELLOW or RED (Escalation Protocol)
- When present, Doom speaks AFTER all other agents — his word is the final verdict
- Doom does NOT challenge ideas — he judges them. His format is different from other agents.
```

---

## 6. Nouveaux fichiers

### 6a. `src/agents/AGENT-doom.md`
Contenu : voir `AGENT-doom-prototype.md` dans ce meme dossier.

### 6b. `src/skills/specific/doom-verdict.md`
Contenu :

```markdown
---
name: doom-verdict
description: Doctor Doom's strategic verdict — deep multi-dimensional analysis for critical decisions. Circuit-breaker agent, not auto-selected.
agents: [doom]
trigger: /doom
---

# Skill : Doctor Doom — Strategic Verdict

## Objective
Invoke Doctor Doom for a binding, multi-dimensional verdict on a critical decision.

## When to use
- Before irreversible decisions (architecture, tech stack, data model, pricing)
- When Deadpool flags YELLOW/RED but deeper analysis is needed
- When consensus exists but confidence is low
- When the stakes are too high for a standard challenge

## Execution
1. Read the agent definition from `.claude/agents/doctor-doom/AGENT.md`
2. Gather all available context (current workflow deliverables, conversation history)
3. Apply the 6-dimension analysis framework
4. Render verdict: GO / CONDITIONAL / NO-GO
5. If CONDITIONAL: list specific, verifiable mitigations
6. If NO-GO: propose an alternative path with trade-offs

## Output
Produce `doom-verdict.md` in the current workflow output directory (or display inline if no workflow is active).
```

---

## Resume des modifications

| Fichier | Type | Lignes impactees (approx) |
|---------|------|---------------------------|
| `src/agents/AGENT-doom.md` | Nouveau | ~180 lignes |
| `src/skills/specific/doom-verdict.md` | Nouveau | ~35 lignes |
| `generator/lib/template-engine.js` | Modification | ~30 lignes ajoutees, 0 supprimees |
| `generator/adapters/cli/claude-code.js` | Modification | ~25 lignes ajoutees, 1 modifiee |
| `src/orchestrator/ORCHESTRATOR.md` | Modification | ~25 lignes ajoutees/modifiees |
| `src/agents/AGENT-contrarian.md` | Modification | ~5 lignes ajoutees |
| `src/skills/specific/party-mode.md` | Modification | ~8 lignes ajoutees |

**Total : ~310 lignes ajoutees, 1 ligne modifiee, 0 lignes supprimees.**

Aucun fichier de workflow YAML modifie. Aucune modification du parser. Aucune modification du config-loader. Les 19 autres adapters heritent automatiquement via le template engine.
