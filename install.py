#!/usr/bin/env python3
"""
Cohesium AI — Installateur interactif (Python)
Configure et déploie le système d'agents dans votre projet
"""

import os
import sys
import subprocess
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()

# ─── Plateformes disponibles ─────────────────────────────────────────

PLATFORMS = {
    "IDE": [
        ("cursor", "Cursor"),
        ("windsurf", "Windsurf"),
        ("cline", "Cline"),
        ("roocode", "Roo Code"),
        ("copilot", "GitHub Copilot"),
        ("kiro", "Kiro"),
        ("trae", "Trae"),
        ("antigravity", "Google Antigravity"),
        ("codebuddy", "CodeBuddy"),
        ("crush", "Crush"),
        ("iflow", "iFlow"),
        ("kilocoder", "KiloCoder"),
        ("opencode", "OpenCode"),
        ("qwencoder", "QwenCoder"),
        ("rovodev", "Rovo Dev"),
    ],
    "CLI": [
        ("claude-code", "Claude Code"),
        ("codex", "Codex"),
        ("gemini-cli", "Gemini CLI"),
        ("auggie", "Auggie"),
        ("pi", "Pi"),
    ]
}

ALL_PLATFORMS = [p[0] for group in PLATFORMS.values() for p in group]


def colored(text, color):
    colors = {
        "red": "\033[0;31m", "green": "\033[0;32m", "yellow": "\033[1;33m",
        "blue": "\033[0;34m", "cyan": "\033[0;36m", "bold": "\033[1m",
    }
    return f"{colors.get(color, '')}{text}\033[0m"


def banner():
    print()
    print(colored("═" * 55, "cyan"))
    print(colored("   🦸 Cohesium AI — Agent Workflow System", "blue"))
    print(colored("   Installation et configuration", "cyan"))
    print(colored("═" * 55, "cyan"))
    print()


def step(label):
    print(f"\n{colored(f'▸ {label}', 'blue')}\n")


def prompt(question, default=""):
    suffix = f" [{default}]" if default else ""
    answer = input(f"{question}{suffix} : ").strip()
    return answer if answer else default


def select_multiple(options, label="Votre choix"):
    for i, (_, display) in enumerate(options, 1):
        print(f"  {i:2d}) {display}")
    print(f"   0) Tout sélectionner")
    print()
    choice = prompt(label, "0")

    if choice == "0":
        return [o[0] for o in options]

    selected = []
    for num_str in choice.split():
        try:
            num = int(num_str)
            if 1 <= num <= len(options):
                selected.append(options[num - 1][0])
        except ValueError:
            pass
    return selected


def main():
    banner()

    print("Bienvenue dans l'installateur Cohesium AI.")
    print("Ce script va configurer le système d'agents pour votre projet.")
    input("\nAppuyez sur Entrée pour continuer...")

    # 1. Langue de l'équipe
    step("1/8 — Langue de l'équipe")
    print("Dans quelle langue l'équipe d'agents doit-elle communiquer ?")
    print("(ex: français, english, deutsch, español, italiano, português...)")
    langue_equipe = prompt("Langue de l'équipe", "français")
    print(colored(f"  ✓ Langue de l'équipe : {langue_equipe}", "green"))

    # 2. Langue des livrables
    step("2/8 — Langue des fichiers produits")
    print("Dans quelle langue les livrables doivent-ils être rédigés ?")
    langue_output = prompt("Langue des livrables", langue_equipe)
    print(colored(f"  ✓ Langue des livrables : {langue_output}", "green"))

    # 3. Sélection des IDE/CLI
    step("3/8 — Sélection des IDE/CLI")
    print("Sélectionnez les IDE/CLI que vous utilisez :\n")
    all_options = []
    print("  IDE :")
    for i, (slug, name) in enumerate(PLATFORMS["IDE"], 1):
        print(f"  {i:2d}) {name}")
        all_options.append((slug, name))
    print("\n  CLI :")
    for i, (slug, name) in enumerate(PLATFORMS["CLI"], len(PLATFORMS["IDE"]) + 1):
        print(f"  {i:2d}) {name}")
        all_options.append((slug, name))
    print(f"\n   0) Tout sélectionner\n")

    platform_choice = prompt("Votre choix", "0")
    if platform_choice == "0":
        selected_platforms = ALL_PLATFORMS[:]
    else:
        selected_platforms = []
        for num_str in platform_choice.split():
            try:
                num = int(num_str)
                if 1 <= num <= len(all_options):
                    selected_platforms.append(all_options[num - 1][0])
            except ValueError:
                pass
    print(colored(f"  ✓ {len(selected_platforms)} plateformes sélectionnées", "green"))

    # 4. Répertoire du projet
    step("4/8 — Répertoire du projet cible")
    print("Où se trouve votre projet ?")
    project_dir = prompt("Répertoire du projet", ".")
    project_dir = os.path.abspath(project_dir)
    os.makedirs(project_dir, exist_ok=True)
    print(colored(f"  ✓ Projet : {project_dir}", "green"))

    # 5. Répertoire de sortie
    step("5/8 — Répertoire de sortie des livrables")
    print("Où les agents doivent-ils écrire leurs livrables ?")
    output_dir = prompt("Répertoire de sortie", "./cohesium-output")
    print(colored(f"  ✓ Output : {project_dir}/{output_dir}", "green"))

    # 6. Agents
    step("6/8 — Agents à installer")
    agent_choice = prompt("Installer tous les 28 agents ? [O/n]", "O")
    selected_agents = "all" if agent_choice.lower() in ("o", "y", "") else "custom"
    print(colored(f"  ✓ Agents : {selected_agents}", "green"))

    # 7. Workflows
    step("7/8 — Workflows à activer")
    wf_choice = prompt("Activer tous les 11 workflows ? [O/n]", "O")
    selected_workflows = "all" if wf_choice.lower() in ("o", "y", "") else "custom"
    print(colored(f"  ✓ Workflows : {selected_workflows}", "green"))

    # 8. Confirmation
    step("8/8 — Confirmation")
    print("Récapitulatif :\n")
    print(f"  Langue équipe  : {colored(langue_equipe, 'bold')}")
    print(f"  Langue output  : {colored(langue_output, 'bold')}")
    print(f"  Plateformes    : {colored(', '.join(selected_platforms), 'bold')}")
    print(f"  Projet         : {colored(project_dir, 'bold')}")
    print(f"  Output         : {colored(output_dir, 'bold')}")
    print(f"  Agents         : {colored(selected_agents, 'bold')}")
    print(f"  Workflows      : {colored(selected_workflows, 'bold')}")
    print()

    confirm = prompt("Lancer l'installation ?", "O")
    if confirm.lower() not in ("o", "y"):
        print("Installation annulée.")
        sys.exit(0)

    # Génération
    step("Génération en cours...")

    generator_py = SCRIPT_DIR / "generator" / "generate.py"
    generator_js = SCRIPT_DIR / "generator" / "generate.js"

    platforms_str = ",".join(selected_platforms)

    if generator_py.exists():
        cmd = [
            sys.executable, str(generator_py),
            "--project", project_dir,
            "--platforms", platforms_str,
            "--lang-team", langue_equipe,
            "--lang-output", langue_output,
            "--output-dir", output_dir,
        ]
        result = subprocess.run(cmd)
    elif generator_js.exists() and shutil.which("node"):
        cmd = [
            "node", str(generator_js),
            "--project", project_dir,
            "--platforms", platforms_str,
            "--lang-team", langue_equipe,
            "--lang-output", langue_output,
            "--output-dir", output_dir,
        ]
        result = subprocess.run(cmd)
    else:
        print(colored("  ✗ Aucun générateur disponible.", "red"))
        sys.exit(1)

    print()
    print(colored("═" * 55, "cyan"))
    print(colored("   ✅ Installation terminée !", "green"))
    print(colored("═" * 55, "cyan"))
    print()
    print("Prochaines étapes :")
    print("  1. Ouvrez votre projet dans votre IDE")
    print("  2. Les agents sont prêts à être utilisés")
    print("  3. Tapez /help pour voir les commandes disponibles")
    print()


if __name__ == "__main__":
    import shutil
    main()
