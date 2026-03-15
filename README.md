# Cohesium AI -- Agent Workflow System

> **28 agents IA specialises + 1 orchestrateur**, inspires de l'univers Marvel, deployables sur **20 plateformes** (15 IDE + 5 CLI).

Cohesium AI transforme votre IDE ou CLI en equipe pluridisciplinaire complete. Chaque agent est un expert senior dans son domaine, capable de collaborer avec les autres via des workflows orchestres automatiquement.

---

## Demarrage rapide

### Methode 1 -- Bash (recommandee)

```bash
curl -fsSL https://raw.githubusercontent.com/cohesium-ai/agents/main/install.sh | bash
```

### Methode 2 -- Python

```bash
python3 install.py
```

### Methode 3 -- npx

```bash
npx create-cohesium-agents
```

L'installateur interactif vous guide pour :
1. Choisir vos **plateformes cibles** (Cursor, Claude Code, Copilot, etc.)
2. Selectionner les **agents** a activer
3. Configurer les **langues** (equipe et livrables)
4. Definir le **repertoire de sortie** des livrables

---

## Fonctionnalites principales

| Fonctionnalite | Description |
|----------------|-------------|
| **29 Agents** | 28 agents specialises + Jarvis (orchestrateur), chacun avec une identite Marvel unique |
| **27 Skills** | 14 skills partagees + 13 skills specifiques, invocables par commande |
| **11 Workflows** | Chaines de production pre-configurees (MVP, feature, bugfix, SEO, marketing, etc.) |
| **60+ Commandes** | Commandes d'agents, de workflows, de skills et meta-commandes |
| **Orchestrateur Jarvis** | Point d'entree unique qui analyse, classifie et delegue automatiquement |
| **20 Plateformes** | Support natif pour 15 IDE et 5 CLI |
| **Multi-langues** | Communication d'equipe et livrables dans la langue de votre choix |

---

## Les 8 equipes

| Equipe | Lead | Agents | Domaine |
|--------|------|--------|---------|
| **Dev** | Tony Stark | 6 agents | Architecture, Backend, Frontend, Fullstack, Mobile, BDD |
| **Ops** | Thor | 4 agents | DevOps, QA, Securite, Automation |
| **Product** | Professor X | 4 agents | PM, Analyst, Scrum, Legal |
| **Marketing** | Star-Lord | 6 agents | Marketing, Growth, Ads, SEO, Content SEO, GEO/AIO |
| **Content** | Black Panther | 4 agents | Copywriter, Brand, Storytelling, Social |
| **Data** | Vision | 2 agents | Data Analyst, AI Engineer |
| **Design** | Invisible Woman | 1 agent | UX/UI Design |
| **Meta** | -- | 2 agents | Contrarian (Deadpool), Orchestrateur (Jarvis) |

> Voir le catalogue complet : [docs/AGENTS.md](docs/AGENTS.md)

---

## Plateformes supportees

### IDE (15)

| Plateforme | Fichiers de configuration |
|------------|--------------------------|
| Cursor | `.cursorrules`, `.cursor/agents/` |
| Windsurf | `.windsurfrules`, `.windsurf/workflows/` |
| Cline | `.clinerules`, `.cline/` |
| Roo Code | `.roo/rules-*`, `.roomodes` |
| GitHub Copilot | `.github/copilot-instructions.md`, `.github/copilot/agents/` |
| Kiro | `.kiro/agents/`, `.kiro/skills/` |
| Trae | `.trae/rules/`, `.trae/agents/` |
| Google Antigravity | `.antigravity/agents/` |
| CodeBuddy | `.codebuddy/agents/` |
| Crush | `.crush/agents/` |
| iFlow | `.iflow/agents/` |
| KiloCoder | `.kilocoder/agents/` |
| OpenCode | `opencode.yaml`, `.opencode/agents/` |
| QwenCoder | `.qwencoder/agents/` |
| Rovo Dev | `.rovo/agents/` |

### CLI (5)

| Plateforme | Fichiers de configuration |
|------------|--------------------------|
| Claude Code | `CLAUDE.md`, `.claude/commands/`, `.claude/agents/` |
| Codex (OpenAI) | `codex.md`, `AGENTS.md` |
| Gemini CLI | `GEMINI.md` |
| Auggie | `.auggie/agents/` |
| Pi | `.pi/agents/` |

> Voir le guide detaille : [docs/PLATFORMS.md](docs/PLATFORMS.md)

---

## Architecture du systeme

```
cohesium-ai/
  src/
    agents/           # 28 fichiers AGENT-*.md (instructions des agents)
    skills/
      shared/         # 14 skills partagees entre agents
      specific/       # 13 skills specifiques a un agent
    workflows/        # 11 workflows pre-configures (YAML)
    orchestrator/     # ORCHESTRATOR.md (Jarvis)
    config/
      defaults.yaml   # Configuration par defaut
      teams.yaml      # Definition des equipes
    commands/
      commands.yaml   # Registre de toutes les commandes
  generator/          # Generateur de fichiers par plateforme
  bin/                # CLI (npx create-cohesium-agents)
  install.sh          # Installateur Bash
  install.py          # Installateur Python
```

### Flux d'execution d'un workflow

```
Demande utilisateur
      |
      v
  Jarvis (Orchestrateur)
      |
      +-- Classifier la demande
      +-- Matcher un workflow (ou composer un ad-hoc)
      +-- Initialiser le workspace (cohesium-output/)
      +-- Creer _manifest.yaml
      |
      v
  Execution sequentielle
      |
      +-- Agent 1 --> livrables --> _manifest.yaml mis a jour
      +-- Agent 2 --> livrables --> _manifest.yaml mis a jour
      +-- ...
      +-- Agent N --> livrables --> _manifest.yaml mis a jour
      |
      v
  Consolidation
      |
      +-- _summary.md (synthese du workflow)
      +-- Rapport a l'utilisateur
```

---

## Configuration (.cohesium.yaml)

Apres installation, un fichier `.cohesium.yaml` est cree a la racine de votre projet :

```yaml
version: "1.0.0"

i18n:
  langue_equipe: "francais"     # Langue de communication entre agents
  langue_output: "francais"     # Langue des livrables produits

output:
  dir: "./cohesium-output"      # Repertoire de sortie
  structure: "{workflow_name}_{timestamp}"

agents:
  default: all                  # Agents actives (all ou liste)

workflows:
  default: all                  # Workflows actives (all ou liste)
```

### Commandes de gestion

| Commande | Description |
|----------|-------------|
| `/update` | Regenerer les fichiers depuis `.cohesium.yaml` |
| `/reconfigure` | Relancer l'assistant de configuration |

---

## Documentation detaillee

| Document | Contenu |
|----------|---------|
| [docs/AGENTS.md](docs/AGENTS.md) | Catalogue complet des 29 agents |
| [docs/SKILLS.md](docs/SKILLS.md) | 27 skills (14 partagees + 13 specifiques) |
| [docs/WORKFLOWS.md](docs/WORKFLOWS.md) | 11 workflows avec sequences d'agents |
| [docs/COMMANDS.md](docs/COMMANDS.md) | Reference de toutes les commandes |
| [docs/PLATFORMS.md](docs/PLATFORMS.md) | Guide par plateforme |

---

## Licence

MIT -- [CohesiumAI](mailto:renald@cohesium.ai)
