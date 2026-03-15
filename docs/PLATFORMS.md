# Plateformes supportées — Guide détaillé

## IDE (15)

### Cursor
- **Fichiers** : `.cursorrules` + `.cursor/agents/*.md`
- **Format** : Markdown avec frontmatter YAML
- **Notes** : Chaque agent est un fichier .md dans `.cursor/agents/`. Les règles globales et l'orchestrateur sont dans `.cursorrules`.

### Windsurf
- **Fichiers** : `.windsurfrules` + `.windsurf/workflows/`
- **Format** : Règles Markdown + workflows YAML
- **Notes** : L'orchestrateur et les commandes sont intégrés dans `.windsurfrules`.

### Cline
- **Fichiers** : `.clinerules` + `.cline/agents/*.md`
- **Format** : Markdown
- **Notes** : Structure similaire à Cursor. Agents dans `.cline/agents/`.

### Roo Code
- **Fichiers** : `.roomodes` (JSON) + `.roo/rules-*.md`
- **Format** : JSON pour les modes, Markdown pour les règles
- **Notes** : Chaque agent devient un "mode" dans `.roomodes` avec `roleDefinition` et `customInstructions`.

### GitHub Copilot
- **Fichiers** : `.github/copilot-instructions.md` + `.github/copilot/agents/*.md`
- **Format** : Markdown
- **Notes** : Instructions globales dans `copilot-instructions.md`, agents individuels dans le dossier `agents/`.

### Kiro
- **Fichiers** : `.kiro/agents/*.md` + `.kiro/skills/*.md` + `.kiro/workflows/`
- **Format** : Markdown + YAML
- **Notes** : Support natif des agents, skills et workflows. Structure la plus riche.

### Trae
- **Fichiers** : `.trae/rules/*.md` + `.trae/agents/*.md`
- **Format** : Markdown
- **Notes** : Rules par agent + fichiers agents complets.

### Google Antigravity
- **Fichiers** : `.antigravity/agents/*.md`
- **Format** : Markdown compatible Gemini

### CodeBuddy
- **Fichiers** : `.codebuddy/agents/*.md`
- **Format** : Markdown

### Crush
- **Fichiers** : `.crush/agents/*.md`
- **Format** : Markdown

### iFlow
- **Fichiers** : `.iflow/agents/*.md` + `.iflow/flows/*.yaml`
- **Format** : Markdown + YAML (workflows natifs)

### KiloCoder
- **Fichiers** : `.kilocoder/agents/*.md`
- **Format** : Markdown

### OpenCode
- **Fichiers** : `.opencode/agents/*.md`
- **Format** : Markdown

### QwenCoder
- **Fichiers** : `.qwencoder/agents/*.md`
- **Format** : Markdown

### Rovo Dev
- **Fichiers** : `.rovo/agents/*.md`
- **Format** : Markdown

---

## CLI (5)

### Claude Code
- **Fichiers** : `CLAUDE.md` + `.claude/commands/*.md` + `.claude/agents/*.md`
- **Format** : Markdown
- **Notes** : L'adaptateur le plus complet. `CLAUDE.md` contient l'orchestrateur et le catalogue. Chaque commande (`/agent-*`, workflows, skills) a son propre fichier `.md` dans `.claude/commands/`. C'est la plateforme de référence.

### Codex (OpenAI)
- **Fichiers** : `codex.md`
- **Format** : Markdown compact
- **Notes** : Tout est consolidé dans un seul fichier `codex.md` avec l'orchestrateur et les commandes.

### Gemini CLI
- **Fichiers** : `GEMINI.md`
- **Format** : Markdown
- **Notes** : Format similaire à Codex, fichier unique `GEMINI.md`.

### Auggie
- **Fichiers** : `.auggie/agents/*.md`
- **Format** : Markdown

### Pi
- **Fichiers** : `.pi/agents/*.md`
- **Format** : Markdown

---

## Notes techniques

### Régénération
Pour régénérer les fichiers après modification de la config :
```bash
node generator/generate.js --config .cohesium.yaml
# ou
python3 generator/generate.py --config .cohesium.yaml
```

### Ajout d'une plateforme
Créer un nouveau fichier dans `generator/adapters/ide/` ou `generator/adapters/cli/` en suivant l'interface standard (voir les adaptateurs existants comme modèle).
