#!/usr/bin/env python3
"""
Cohesium AI — Générateur principal (Python)
Transforme les agents/skills/workflows source en fichiers natifs par plateforme

Usage:
    python generate.py --platforms cursor,claude-code --lang-team français
    python generate.py --config .cohesium.yaml --project /path/to/project
"""

import os
import sys
import re
import json
import shutil
import argparse
from datetime import datetime
from pathlib import Path


# ─── Chemins ──────────────────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent.resolve()
SRC_DIR = SCRIPT_DIR.parent / "src"
AGENTS_DIR = SRC_DIR / "agents"
SKILLS_DIR = SRC_DIR / "skills"
WORKFLOWS_DIR = SRC_DIR / "workflows"
COMMANDS_FILE = SRC_DIR / "commands" / "commands.yaml"
ORCHESTRATOR_DIR = SRC_DIR / "orchestrator"


# ─── Parser ───────────────────────────────────────────────────────────────────

def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Parse YAML frontmatter from markdown content."""
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if not match:
        return {}, content

    meta = {}
    for line in match.group(1).split('\n'):
        m = re.match(r'^([\w-]+):\s*(.+)$', line)
        if m:
            key, value = m.group(1), m.group(2).strip()
            if value.startswith('[') and value.endswith(']'):
                value = [v.strip().strip("\"'") for v in value[1:-1].split(',')]
            else:
                value = value.strip("\"'")
            meta[key] = value

    return meta, match.group(2).strip()


def load_agents(agents_dir: Path) -> list[dict]:
    """Load all agent .md files."""
    agents = []
    if not agents_dir.exists():
        return agents
    for f in sorted(agents_dir.glob("*.md")):
        meta, content = parse_frontmatter(f.read_text(encoding='utf-8'))
        agents.append({"meta": meta, "content": content, "fileName": f.name})
    return agents


def load_skills(skills_dir: Path) -> dict:
    """Load shared and specific skills."""
    result = {"shared": [], "specific": []}
    for category in ("shared", "specific"):
        d = skills_dir / category
        if not d.exists():
            continue
        for f in sorted(d.glob("*.md")):
            meta, content = parse_frontmatter(f.read_text(encoding='utf-8'))
            result[category].append({"meta": meta, "content": content, "fileName": f.name})
    return result


def load_workflows(workflows_dir: Path) -> list[dict]:
    """Load all workflow YAML files."""
    workflows = []
    if not workflows_dir.exists():
        return workflows
    for f in sorted(workflows_dir.glob("*.yaml")) + sorted(workflows_dir.glob("*.yml")):
        workflows.append({"raw": f.read_text(encoding='utf-8'), "fileName": f.name})
    return workflows


def load_commands(commands_file: Path) -> str:
    """Load commands registry."""
    if not commands_file.exists():
        return ""
    return commands_file.read_text(encoding='utf-8')


def load_orchestrator(orchestrator_dir: Path) -> dict | None:
    """Load orchestrator."""
    f = orchestrator_dir / "ORCHESTRATOR.md"
    if not f.exists():
        return None
    meta, content = parse_frontmatter(f.read_text(encoding='utf-8'))
    return {"meta": meta, "content": content}


# ─── i18n ─────────────────────────────────────────────────────────────────────

def inject_language(content: str, lang_team: str, lang_output: str) -> str:
    """Inject language instructions into agent content."""
    lang_block = f"""## Langue de travail

Tu communiques et rédiges tous tes échanges en **{lang_team}**.
Les fichiers et livrables que tu produis sont rédigés en **{lang_output}**.
Les termes techniques, le code source, les noms de variables et les commandes restent en **anglais**.
"""
    # Replace existing language mentions
    content = re.sub(
        r'- Tu travailles toujours en français.*\n',
        f'- Tu travailles en {lang_team} pour les échanges et en {lang_output} pour les livrables.\n',
        content
    )

    if '## Langue de travail' not in content:
        content = content.strip() + '\n\n' + lang_block

    return content


def prepare_agent(agent: dict, config: dict) -> dict:
    """Prepare an agent by injecting language and output config."""
    content = agent["content"]
    content = inject_language(content, config["langue_equipe"], config["langue_output"])

    output_block = f"""## Répertoire de sortie

Tes livrables doivent être produits dans le répertoire : `{config.get('output_dir', './cohesium-output')}`
Respecte la structure de dossiers définie par le workflow en cours.
"""
    if '## Répertoire de sortie' not in content:
        content = content.strip() + '\n\n' + output_block

    return {**agent, "content": content}


# ─── Adaptateurs génériques ──────────────────────────────────────────────────

def generate_markdown_agents(target_dir: Path, agents: list[dict], orchestrator: dict | None):
    """Generate agent files as markdown in a target directory."""
    target_dir.mkdir(parents=True, exist_ok=True)
    for agent in agents:
        filename = agent["fileName"]
        content = render_agent_md(agent)
        (target_dir / filename).write_text(content, encoding='utf-8')

    if orchestrator:
        content = render_agent_md(orchestrator)
        (target_dir / "ORCHESTRATOR.md").write_text(content, encoding='utf-8')


def render_agent_md(agent: dict) -> str:
    """Render agent as markdown with frontmatter."""
    meta = agent.get("meta", {})
    content = agent.get("content", "")

    output = ""
    if meta:
        output += "---\n"
        for k, v in meta.items():
            if isinstance(v, list):
                output += f"{k}: [{', '.join(v)}]\n"
            else:
                output += f"{k}: {v}\n"
        output += "---\n\n"
    output += content
    return output


def generate_skills(target_dir: Path, skills: dict):
    """Generate skill files in target directory."""
    for category in ("shared", "specific"):
        d = target_dir / category
        d.mkdir(parents=True, exist_ok=True)
        for skill in skills.get(category, []):
            (d / skill["fileName"]).write_text(render_agent_md(skill), encoding='utf-8')


def generate_workflows(target_dir: Path, workflows: list[dict]):
    """Generate workflow files in target directory."""
    target_dir.mkdir(parents=True, exist_ok=True)
    for wf in workflows:
        (target_dir / wf["fileName"]).write_text(wf["raw"], encoding='utf-8')


def generate_commands_md(target_dir: Path, commands: str):
    """Generate command files."""
    target_dir.mkdir(parents=True, exist_ok=True)
    (target_dir / "commands.yaml").write_text(commands, encoding='utf-8')


# ─── Plateformes ──────────────────────────────────────────────────────────────

PLATFORM_GENERATORS = {}


def platform(name, display_name, ptype):
    """Decorator to register a platform generator."""
    def decorator(func):
        PLATFORM_GENERATORS[name] = {
            "name": name,
            "displayName": display_name,
            "type": ptype,
            "generate": func
        }
        return func
    return decorator


# --- IDE Platforms ---

@platform("cursor", "Cursor", "ide")
def gen_cursor(project_dir, agents, skills, workflows, commands, orchestrator, config):
    p = Path(project_dir)
    agents_dir = p / ".cursor" / "agents"
    generate_markdown_agents(agents_dir, agents, orchestrator)

    # .cursorrules
    rules = "# Cohesium AI — Cursor Rules\n\n"
    rules += "## Équipe disponible\n\n"
    rules += "Utilise les agents dans `.cursor/agents/` pour invoquer des experts spécialisés.\n\n"
    rules += "## Commandes\n\n"
    rules += "Consulte `.cursor/agents/ORCHESTRATOR.md` pour l'orchestration.\n\n"
    rules += commands
    (p / ".cursorrules").write_text(rules, encoding='utf-8')


@platform("windsurf", "Windsurf", "ide")
def gen_windsurf(project_dir, agents, skills, workflows, commands, orchestrator, config):
    p = Path(project_dir)
    wf_dir = p / ".windsurf" / "workflows"
    generate_workflows(wf_dir, workflows)

    rules = "# Cohesium AI — Windsurf Rules\n\n"
    if orchestrator:
        rules += orchestrator["content"] + "\n\n"
    rules += commands
    (p / ".windsurfrules").write_text(rules, encoding='utf-8')


@platform("cline", "Cline", "ide")
def gen_cline(project_dir, agents, skills, workflows, commands, orchestrator, config):
    p = Path(project_dir)
    generate_markdown_agents(p / ".cline" / "agents", agents, orchestrator)

    rules = "# Cohesium AI — Cline Rules\n\n"
    rules += "Agents disponibles dans `.cline/agents/`.\n\n"
    rules += commands
    (p / ".clinerules").write_text(rules, encoding='utf-8')


@platform("roocode", "Roo Code", "ide")
def gen_roocode(project_dir, agents, skills, workflows, commands, orchestrator, config):
    p = Path(project_dir)
    roo_dir = p / ".roo"
    roo_dir.mkdir(parents=True, exist_ok=True)

    # Rules files per agent
    for agent in agents:
        name = agent["meta"].get("name", agent["fileName"].replace(".md", ""))
        (roo_dir / f"rules-{name}.md").write_text(agent["content"], encoding='utf-8')

    if orchestrator:
        (roo_dir / "rules-orchestrator.md").write_text(orchestrator["content"], encoding='utf-8')

    # .roomodes JSON
    modes = []
    for agent in agents:
        name = agent["meta"].get("name", "")
        desc = agent["meta"].get("description", "")
        modes.append({
            "slug": name,
            "name": desc[:50] if desc else name,
            "roleDefinition": desc,
            "customInstructions": f"Consulte .roo/rules-{name}.md pour tes instructions complètes.",
            "groups": ["read", "edit", "command"]
        })
    (p / ".roomodes").write_text(json.dumps(modes, indent=2, ensure_ascii=False), encoding='utf-8')


@platform("copilot", "GitHub Copilot", "ide")
def gen_copilot(project_dir, agents, skills, workflows, commands, orchestrator, config):
    p = Path(project_dir)
    copilot_dir = p / ".github" / "copilot" / "agents"
    generate_markdown_agents(copilot_dir, agents, orchestrator)

    instructions = "# Cohesium AI — GitHub Copilot Instructions\n\n"
    if orchestrator:
        instructions += orchestrator["content"] + "\n\n"
    instructions += "## Agents\n\nVoir `.github/copilot/agents/` pour les agents spécialisés.\n\n"
    instructions += commands
    gh_dir = p / ".github"
    gh_dir.mkdir(parents=True, exist_ok=True)
    (gh_dir / "copilot-instructions.md").write_text(instructions, encoding='utf-8')


@platform("kiro", "Kiro", "ide")
def gen_kiro(project_dir, agents, skills, workflows, commands, orchestrator, config):
    p = Path(project_dir)
    generate_markdown_agents(p / ".kiro" / "agents", agents, orchestrator)
    generate_skills(p / ".kiro" / "skills", skills)
    generate_workflows(p / ".kiro" / "workflows", workflows)


@platform("trae", "Trae", "ide")
def gen_trae(project_dir, agents, skills, workflows, commands, orchestrator, config):
    p = Path(project_dir)
    generate_markdown_agents(p / ".trae" / "agents", agents, orchestrator)
    rules_dir = p / ".trae" / "rules"
    rules_dir.mkdir(parents=True, exist_ok=True)
    for agent in agents:
        name = agent["meta"].get("name", agent["fileName"].replace(".md", ""))
        (rules_dir / f"{name}.md").write_text(agent["content"], encoding='utf-8')


@platform("antigravity", "Google Antigravity", "ide")
def gen_antigravity(project_dir, agents, skills, workflows, commands, orchestrator, config):
    generate_markdown_agents(Path(project_dir) / ".antigravity" / "agents", agents, orchestrator)


@platform("codebuddy", "CodeBuddy", "ide")
def gen_codebuddy(project_dir, agents, skills, workflows, commands, orchestrator, config):
    generate_markdown_agents(Path(project_dir) / ".codebuddy" / "agents", agents, orchestrator)


@platform("crush", "Crush", "ide")
def gen_crush(project_dir, agents, skills, workflows, commands, orchestrator, config):
    generate_markdown_agents(Path(project_dir) / ".crush" / "agents", agents, orchestrator)


@platform("iflow", "iFlow", "ide")
def gen_iflow(project_dir, agents, skills, workflows, commands, orchestrator, config):
    p = Path(project_dir)
    generate_markdown_agents(p / ".iflow" / "agents", agents, orchestrator)
    generate_workflows(p / ".iflow" / "flows", workflows)


@platform("kilocoder", "KiloCoder", "ide")
def gen_kilocoder(project_dir, agents, skills, workflows, commands, orchestrator, config):
    generate_markdown_agents(Path(project_dir) / ".kilocoder" / "agents", agents, orchestrator)


@platform("opencode", "OpenCode", "ide")
def gen_opencode(project_dir, agents, skills, workflows, commands, orchestrator, config):
    generate_markdown_agents(Path(project_dir) / ".opencode" / "agents", agents, orchestrator)


@platform("qwencoder", "QwenCoder", "ide")
def gen_qwencoder(project_dir, agents, skills, workflows, commands, orchestrator, config):
    generate_markdown_agents(Path(project_dir) / ".qwencoder" / "agents", agents, orchestrator)


@platform("rovodev", "Rovo Dev", "ide")
def gen_rovodev(project_dir, agents, skills, workflows, commands, orchestrator, config):
    generate_markdown_agents(Path(project_dir) / ".rovo" / "agents", agents, orchestrator)


# --- CLI Platforms ---

@platform("claude-code", "Claude Code", "cli")
def gen_claude_code(project_dir, agents, skills, workflows, commands, orchestrator, config):
    p = Path(project_dir)

    # Agents
    agents_dir = p / ".claude" / "agents"
    generate_markdown_agents(agents_dir, agents, orchestrator)

    # Commands
    cmd_dir = p / ".claude" / "commands"
    cmd_dir.mkdir(parents=True, exist_ok=True)

    # Create command files for each agent
    for agent in agents:
        name = agent["meta"].get("name", agent["fileName"].replace("AGENT-", "").replace(".md", ""))
        cmd_content = f"Adopte le rôle défini dans `.claude/agents/{agent['fileName']}` et réponds en tant que cet expert.\n\n"
        cmd_content += f"Lis le fichier `.claude/agents/{agent['fileName']}` pour tes instructions complètes.\n"
        (cmd_dir / f"agent-{name}.md").write_text(cmd_content, encoding='utf-8')

    # Workflow commands
    for wf in workflows:
        name = wf["fileName"].replace(".yaml", "").replace(".yml", "")
        cmd_content = f"Lance le workflow défini dans le fichier suivant :\n\n"
        cmd_content += f"```yaml\n{wf['raw']}\n```\n\n"
        cmd_content += "Suis les étapes dans l'ordre, en respectant les dépendances et le chaînage des livrables.\n"
        (cmd_dir / f"{name}.md").write_text(cmd_content, encoding='utf-8')

    # CLAUDE.md
    claude_md = "# Cohesium AI — Agent Workflow System\n\n"
    claude_md += "## Système d'orchestration\n\n"
    claude_md += "Ce projet utilise le système Cohesium AI avec 28 agents spécialisés, "
    claude_md += "des skills partagées, et des workflows prédéfinis.\n\n"

    if orchestrator:
        claude_md += "## Orchestrateur\n\n"
        claude_md += "L'orchestrateur Jarvis est disponible dans `.claude/agents/ORCHESTRATOR.md`.\n"
        claude_md += "Il analyse les demandes et séquence automatiquement les agents.\n\n"

    claude_md += "## Commandes disponibles\n\n"
    claude_md += "Les commandes sont définies dans `.claude/commands/`.\n\n"
    claude_md += "### Agents\n"
    for agent in agents:
        name = agent["meta"].get("name", "")
        desc = agent["meta"].get("description", "")[:60]
        claude_md += f"- `/agent-{name}` — {desc}\n"

    claude_md += "\n### Workflows\n"
    for wf in workflows:
        name = wf["fileName"].replace(".yaml", "").replace(".yml", "")
        claude_md += f"- `/{name}` — Workflow {name.replace('-', ' ').title()}\n"

    claude_md += f"\n## Configuration\n\n"
    claude_md += f"- Langue équipe : {config['langue_equipe']}\n"
    claude_md += f"- Langue output : {config['langue_output']}\n"
    claude_md += f"- Output dir : {config.get('output_dir', './cohesium-output')}\n"

    (p / "CLAUDE.md").write_text(claude_md, encoding='utf-8')


@platform("codex", "Codex", "cli")
def gen_codex(project_dir, agents, skills, workflows, commands, orchestrator, config):
    p = Path(project_dir)
    content = "# Cohesium AI — Codex Instructions\n\n"
    if orchestrator:
        content += orchestrator["content"] + "\n\n"
    content += commands
    (p / "codex.md").write_text(content, encoding='utf-8')


@platform("gemini-cli", "Gemini CLI", "cli")
def gen_gemini_cli(project_dir, agents, skills, workflows, commands, orchestrator, config):
    p = Path(project_dir)
    content = "# Cohesium AI — Gemini CLI Instructions\n\n"
    if orchestrator:
        content += orchestrator["content"] + "\n\n"
    content += commands
    (p / "GEMINI.md").write_text(content, encoding='utf-8')


@platform("auggie", "Auggie", "cli")
def gen_auggie(project_dir, agents, skills, workflows, commands, orchestrator, config):
    generate_markdown_agents(Path(project_dir) / ".auggie" / "agents", agents, orchestrator)


@platform("pi", "Pi", "cli")
def gen_pi(project_dir, agents, skills, workflows, commands, orchestrator, config):
    generate_markdown_agents(Path(project_dir) / ".pi" / "agents", agents, orchestrator)


# ─── Main ─────────────────────────────────────────────────────────────────────

def load_config(config_path: str) -> dict:
    """Load configuration from .cohesium.yaml."""
    config = {
        "langue_equipe": "français",
        "langue_output": "français",
        "output_dir": "./cohesium-output",
        "platforms": [],
        "agents": "all",
        "workflows": "all"
    }

    if not config_path or not os.path.exists(config_path):
        return config

    with open(config_path, 'r', encoding='utf-8') as f:
        for line in f:
            m = re.match(r'^(\w[\w_]*):\s*(.+)$', line.strip())
            if not m:
                continue
            key, value = m.group(1), m.group(2).strip()
            if value.startswith('[') and value.endswith(']'):
                config[key] = [v.strip().strip("\"'") for v in value[1:-1].split(',')]
            elif value == 'all':
                config[key] = 'all'
            else:
                config[key] = value.strip("\"'")

    return config


def main():
    parser = argparse.ArgumentParser(description="Cohesium AI — Générateur de configurations")
    parser.add_argument("--config", "-c", help="Chemin vers .cohesium.yaml")
    parser.add_argument("--project", "-p", default=".", help="Répertoire du projet cible")
    parser.add_argument("--platforms", help="Plateformes cibles (séparées par des virgules)")
    parser.add_argument("--lang-team", help="Langue de l'équipe")
    parser.add_argument("--lang-output", help="Langue des livrables")
    parser.add_argument("--output-dir", "-o", help="Répertoire de sortie des livrables")

    args = parser.parse_args()

    # Load config
    config_path = args.config or os.path.join(args.project, ".cohesium.yaml")
    config = load_config(config_path)

    # Override with CLI args
    if args.platforms:
        config["platforms"] = args.platforms.split(",")
    if args.lang_team:
        config["langue_equipe"] = args.lang_team
    if args.lang_output:
        config["langue_output"] = args.lang_output
    if args.output_dir:
        config["output_dir"] = args.output_dir

    project_dir = os.path.abspath(args.project)

    print("🚀 Cohesium AI — Générateur de configurations (Python)")
    print(f"📁 Projet : {project_dir}")
    print(f"🌍 Langue équipe : {config['langue_equipe']}")
    print(f"📝 Langue output : {config['langue_output']}")
    print(f"📂 Output dir : {config['output_dir']}")
    print(f"🎯 Plateformes : {', '.join(config['platforms']) if config['platforms'] else 'aucune'}")
    print()

    if not config["platforms"]:
        print("❌ Aucune plateforme sélectionnée.")
        sys.exit(1)

    # Load sources
    print("📖 Chargement des sources...")
    agents = load_agents(AGENTS_DIR)
    print(f"  ✓ {len(agents)} agents chargés")

    skills = load_skills(SKILLS_DIR)
    print(f"  ✓ {len(skills['shared'])} skills partagées, {len(skills['specific'])} spécifiques")

    workflows = load_workflows(WORKFLOWS_DIR)
    print(f"  ✓ {len(workflows)} workflows chargés")

    commands = load_commands(COMMANDS_FILE)
    print(f"  ✓ Registre de commandes chargé")

    orch = load_orchestrator(ORCHESTRATOR_DIR)
    print(f"  ✓ Orchestrateur chargé")
    print()

    # Prepare agents
    prepared = [prepare_agent(a, config) for a in agents]
    prepared_orch = prepare_agent(orch, config) if orch else None

    # Generate
    success = 0
    errors = 0

    for pname in config["platforms"]:
        pinfo = PLATFORM_GENERATORS.get(pname)
        if not pinfo:
            print(f"⚠️  Plateforme inconnue : {pname}")
            errors += 1
            continue

        print(f"🔧 Génération pour {pinfo['displayName']}...")
        try:
            pinfo["generate"](
                project_dir, prepared, skills, workflows,
                commands, prepared_orch, config
            )
            print(f"  ✅ {pinfo['displayName']} — OK")
            success += 1
        except Exception as e:
            print(f"  ❌ {pinfo['displayName']} — Erreur : {e}")
            errors += 1

    # Create output dir
    output_path = os.path.join(project_dir, config["output_dir"])
    os.makedirs(output_path, exist_ok=True)

    # Generate .cohesium.yaml
    cohesium_path = os.path.join(project_dir, ".cohesium.yaml")
    if not os.path.exists(cohesium_path):
        with open(cohesium_path, 'w', encoding='utf-8') as f:
            f.write(f"""# Cohesium AI — Configuration du projet
version: "1.0.0"
langue_equipe: "{config['langue_equipe']}"
langue_output: "{config['langue_output']}"
output_dir: "{config['output_dir']}"
platforms: [{', '.join(config['platforms'])}]
agents: all
workflows: all
installed_at: "{datetime.now().strftime('%Y-%m-%d')}"
""")
        print(f"\n📄 .cohesium.yaml créé")

    print(f"\n{'═' * 50}")
    print(f"✅ Génération terminée : {success} OK, {errors} erreurs")
    print(f"📂 Livrables → {output_path}")
    print(f"{'═' * 50}")

    sys.exit(1 if errors > 0 else 0)


if __name__ == "__main__":
    main()
