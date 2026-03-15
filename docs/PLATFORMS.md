# Plateformes supportees -- Cohesium AI

> **20 plateformes** supportees : 15 IDE et 5 CLI. Le generateur adapte automatiquement les fichiers d'agents, de skills et de workflows au format natif de chaque plateforme.

---

## Vue d'ensemble

| # | Plateforme | Type | Fichiers de configuration |
|---|------------|------|--------------------------|
| 1 | Cursor | IDE | `.cursorrules`, `.cursor/agents/` |
| 2 | Windsurf | IDE | `.windsurfrules`, `.windsurf/workflows/` |
| 3 | Cline | IDE | `.clinerules`, `.cline/` |
| 4 | Roo Code | IDE | `.roo/rules-*`, `.roomodes` |
| 5 | GitHub Copilot | IDE | `.github/copilot-instructions.md`, `.github/copilot/agents/` |
| 6 | Kiro | IDE | `.kiro/agents/`, `.kiro/skills/` |
| 7 | Trae | IDE | `.trae/rules/`, `.trae/agents/` |
| 8 | Google Antigravity | IDE | `.antigravity/agents/` |
| 9 | CodeBuddy | IDE | `.codebuddy/agents/` |
| 10 | Crush | IDE | `.crush/agents/` |
| 11 | iFlow | IDE | `.iflow/agents/` |
| 12 | KiloCoder | IDE | `.kilocoder/agents/` |
| 13 | OpenCode | IDE | `opencode.yaml`, `.opencode/agents/` |
| 14 | QwenCoder | IDE | `.qwencoder/agents/` |
| 15 | Rovo Dev | IDE | `.rovo/agents/` |
| 16 | Claude Code | CLI | `CLAUDE.md`, `.claude/commands/`, `.claude/agents/` |
| 17 | Codex (OpenAI) | CLI | `codex.md`, `AGENTS.md` |
| 18 | Gemini CLI | CLI | `GEMINI.md` |
| 19 | Auggie | CLI | `.auggie/agents/` |
| 20 | Pi | CLI | `.pi/agents/` |

---

## IDE (15)

### Cursor

**Description :** Cursor AI IDE

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.cursorrules` | Regles globales : orchestrateur Jarvis, catalogue des commandes, instructions generales |
| `.cursor/agents/*.md` | Un fichier Markdown par agent (28 fichiers) avec frontmatter YAML |

**Format :** Markdown avec frontmatter YAML

**Notes :** Chaque agent est un fichier `.md` dans `.cursor/agents/`. Les regles globales et l'orchestrateur sont dans `.cursorrules`. Les workflows et skills sont integres dans les instructions des agents.

---

### Windsurf

**Description :** Windsurf AI IDE

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.windsurfrules` | Regles globales : orchestrateur, catalogue, commandes |
| `.windsurf/workflows/` | Fichiers de workflows au format natif Windsurf |

**Format :** Regles Markdown + workflows YAML

**Notes :** L'orchestrateur et les commandes sont integres dans `.windsurfrules`. Les workflows natifs de Windsurf sont exploites.

---

### Cline

**Description :** Cline (extension VS Code)

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.clinerules` | Regles globales et orchestrateur |
| `.cline/agents/*.md` | Un fichier par agent |

**Format :** Markdown

**Notes :** Structure similaire a Cursor. Agents dans `.cline/agents/`.

---

### Roo Code

**Description :** Roo Code

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.roomodes` | Fichier JSON definissant chaque agent comme un "mode" avec `roleDefinition` et `customInstructions` |
| `.roo/rules-*.md` | Regles specifiques par agent au format Markdown |

**Format :** JSON pour les modes, Markdown pour les regles

**Notes :** Chaque agent devient un "mode" dans `.roomodes`. Roo Code utilise un systeme de modes specifique ou chaque mode a son propre contexte et ses propres instructions.

---

### GitHub Copilot

**Description :** GitHub Copilot

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.github/copilot-instructions.md` | Instructions globales : orchestrateur, catalogue, regles |
| `.github/copilot/agents/*.md` | Un fichier par agent |

**Format :** Markdown

**Notes :** Instructions globales dans `copilot-instructions.md`, agents individuels dans le dossier `agents/`.

---

### Kiro

**Description :** Kiro IDE

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.kiro/agents/*.md` | Un fichier par agent |
| `.kiro/skills/*.md` | Un fichier par skill |
| `.kiro/workflows/` | Workflows au format natif |

**Format :** Markdown + YAML

**Notes :** Support natif des agents, skills et workflows. C'est la structure la plus riche car Kiro prend en charge nativement les trois concepts.

---

### Trae

**Description :** Trae IDE

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.trae/rules/*.md` | Regles par agent |
| `.trae/agents/*.md` | Fichiers agents complets |

**Format :** Markdown

**Notes :** Separation entre rules (regles courtes) et agents (instructions completes).

---

### Google Antigravity

**Description :** Google Antigravity

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.antigravity/agents/*.md` | Un fichier par agent |

**Format :** Markdown compatible Gemini

---

### CodeBuddy

**Description :** CodeBuddy

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.codebuddy/agents/*.md` | Un fichier par agent |

**Format :** Markdown

---

### Crush

**Description :** Crush IDE

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.crush/agents/*.md` | Un fichier par agent |

**Format :** Markdown

---

### iFlow

**Description :** iFlow IDE

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.iflow/agents/*.md` | Un fichier par agent |

**Format :** Markdown

---

### KiloCoder

**Description :** KiloCoder

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.kilocoder/agents/*.md` | Un fichier par agent |

**Format :** Markdown

---

### OpenCode

**Description :** OpenCode

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `opencode.yaml` | Configuration principale |
| `.opencode/agents/*.md` | Un fichier par agent |

**Format :** YAML + Markdown

**Notes :** OpenCode utilise un fichier YAML de configuration a la racine en plus des fichiers d'agents Markdown.

---

### QwenCoder

**Description :** QwenCoder

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.qwencoder/agents/*.md` | Un fichier par agent |

**Format :** Markdown

---

### Rovo Dev

**Description :** Rovo Dev

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.rovo/agents/*.md` | Un fichier par agent |

**Format :** Markdown

---

## CLI (5)

### Claude Code

**Description :** Claude Code CLI (Anthropic)

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `CLAUDE.md` | Fichier principal : orchestrateur Jarvis, catalogue des agents, regles globales |
| `.claude/commands/*.md` | Un fichier par commande (`/agent-*`, workflows, skills) |
| `.claude/agents/*.md` | Un fichier par agent |

**Format :** Markdown

**Notes :** C'est la **plateforme de reference** avec l'adaptateur le plus complet. `CLAUDE.md` contient l'orchestrateur et le catalogue. Chaque commande a son propre fichier `.md` dans `.claude/commands/`, ce qui permet l'invocation directe via `/commande`.

---

### Codex (OpenAI)

**Description :** Codex CLI (OpenAI)

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `codex.md` | Fichier unique consolide : orchestrateur, agents, commandes |
| `AGENTS.md` | Catalogue des agents |

**Format :** Markdown compact

**Notes :** Tout est consolide dans un seul fichier `codex.md` avec l'orchestrateur et les commandes. `AGENTS.md` sert de reference pour le catalogue.

---

### Gemini CLI

**Description :** Gemini CLI (Google)

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `GEMINI.md` | Fichier unique consolide : orchestrateur, agents, commandes |

**Format :** Markdown

**Notes :** Format similaire a Codex, fichier unique `GEMINI.md` avec toutes les instructions.

---

### Auggie

**Description :** Auggie CLI

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.auggie/agents/*.md` | Un fichier par agent |

**Format :** Markdown

---

### Pi

**Description :** Pi CLI

**Fichiers generes :**

| Fichier / Dossier | Contenu |
|-------------------|---------|
| `.pi/agents/*.md` | Un fichier par agent |

**Format :** Markdown

---

## Notes techniques

### Regeneration des fichiers

Pour regenerer les fichiers apres modification de la configuration :

```bash
# Via Node.js
node generator/generate.js --config .cohesium.yaml

# Via Python
python3 generator/generate.py --config .cohesium.yaml

# Via les commandes integrees
/update         # Regenerer depuis .cohesium.yaml
/reconfigure    # Relancer l'assistant de configuration
```

### Multi-plateforme

Il est possible de generer les fichiers pour **plusieurs plateformes simultanement**. L'installateur permet de selectionner une ou plusieurs cibles. Les fichiers sont generes dans les emplacements natifs de chaque plateforme sans conflit.

### Ajout d'une plateforme

Pour ajouter le support d'une nouvelle plateforme :
1. Creer un nouveau fichier adaptateur dans `generator/adapters/ide/` ou `generator/adapters/cli/`
2. Implementer l'interface standard (voir les adaptateurs existants comme modele)
3. Ajouter la plateforme dans `src/config/defaults.yaml` sous `platforms.ide` ou `platforms.cli`

### Tableau recapitulatif des emplacements

| Plateforme | Fichier principal | Dossier agents | Autres |
|------------|-------------------|----------------|--------|
| Cursor | `.cursorrules` | `.cursor/agents/` | -- |
| Windsurf | `.windsurfrules` | -- | `.windsurf/workflows/` |
| Cline | `.clinerules` | `.cline/agents/` | -- |
| Roo Code | `.roomodes` | -- | `.roo/rules-*` |
| Copilot | `.github/copilot-instructions.md` | `.github/copilot/agents/` | -- |
| Kiro | -- | `.kiro/agents/` | `.kiro/skills/`, `.kiro/workflows/` |
| Trae | -- | `.trae/agents/` | `.trae/rules/` |
| Antigravity | -- | `.antigravity/agents/` | -- |
| CodeBuddy | -- | `.codebuddy/agents/` | -- |
| Crush | -- | `.crush/agents/` | -- |
| iFlow | -- | `.iflow/agents/` | -- |
| KiloCoder | -- | `.kilocoder/agents/` | -- |
| OpenCode | `opencode.yaml` | `.opencode/agents/` | -- |
| QwenCoder | -- | `.qwencoder/agents/` | -- |
| Rovo Dev | -- | `.rovo/agents/` | -- |
| Claude Code | `CLAUDE.md` | `.claude/agents/` | `.claude/commands/` |
| Codex | `codex.md` | -- | `AGENTS.md` |
| Gemini CLI | `GEMINI.md` | -- | -- |
| Auggie | -- | `.auggie/agents/` | -- |
| Pi | -- | `.pi/agents/` | -- |
