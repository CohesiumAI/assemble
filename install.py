#!/usr/bin/env python3
"""
Assemble — Interactive Installer (Python)
Configures and deploys the agent system in your project
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()

# ─── Available platforms ───────────────────────────────────────────

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
    print(colored("   🦸 Assemble — AI Agent Orchestrator", "blue"))
    print(colored("   Installation & Configuration", "cyan"))
    print(colored("═" * 55, "cyan"))
    print()


def step(label):
    print(f"\n{colored(f'▸ {label}', 'blue')}\n")


def prompt(question, default=""):
    suffix = f" [{default}]" if default else ""
    answer = input(f"{question}{suffix} : ").strip()
    return answer if answer else default


def run_update(project_dir="."):
    """Update an existing installation while preserving user preferences."""
    config_path = Path(project_dir) / ".assemble.yaml"
    if not config_path.exists():
        print(colored("  ✗ No installation found (.assemble.yaml missing)", "red"))
        sys.exit(1)

    print(colored("\n🔄 Updating...\n", "bold"))
    print("Preserved preferences from .assemble.yaml:")

    for line in config_path.read_text(encoding="utf-8").splitlines():
        for key in ("langue_equipe", "langue_output", "platforms", "output_dir", "installed_at"):
            if line.startswith(f"{key}:"):
                print(colored(f"  {key}: {line.split(':', 1)[1].strip()}", "green"))

    print()
    confirm = prompt("Confirm update?", "Y")
    if confirm.lower() not in ("y", "o"):
        print("Update cancelled.")
        sys.exit(0)

    step("Regenerating...")

    abs_project = str(Path(project_dir).resolve())
    generator_js = SCRIPT_DIR / "generator" / "generate.js"
    generator_py = SCRIPT_DIR / "generator" / "generate.py"

    if generator_py.exists():
        subprocess.run([sys.executable, str(generator_py), "--update", "--project", abs_project])
    elif generator_js.exists() and shutil.which("node"):
        subprocess.run(["node", str(generator_js), "--update", "--project", abs_project])
    else:
        print(colored("  ✗ No generator available.", "red"))
        sys.exit(1)

    print()
    print(colored("═" * 55, "cyan"))
    print(colored("   ✅ Update complete!", "green"))
    print(colored("═" * 55, "cyan"))
    print()
    print("Your preferences have been preserved.")
    print("Configuration files have been regenerated with the latest version.")
    print()


def main():
    banner()

    # Detect --update flag or existing installation
    if "--update" in sys.argv or "-u" in sys.argv:
        project_dir = "."
        for i, arg in enumerate(sys.argv):
            if arg in ("--project", "-p") and i + 1 < len(sys.argv):
                project_dir = sys.argv[i + 1]
        run_update(project_dir)
        sys.exit(0)

    config_path = Path(".assemble.yaml")
    if config_path.exists():
        print("📄 Existing installation detected: .assemble.yaml\n")
        print("  1) Update existing installation (keeps your preferences)")
        print("  2) New installation (overwrites configuration)\n")
        choice = prompt("Your choice", "1")
        if choice == "1":
            run_update(".")
            sys.exit(0)

    print("Welcome to the Assemble by Cohesium AI installer.")
    print("This script will configure the agent system for your project.")
    input("\nPress Enter to continue...")

    # 1. Team language
    step("1/8 — Team language")
    print("In which language should the agent team communicate?")
    print("(e.g.: français, english, deutsch, español, italiano, português...)")
    langue_equipe = prompt("Team language", "français")
    print(colored(f"  ✓ Team language: {langue_equipe}", "green"))

    # 2. Output language
    step("2/8 — Deliverable language")
    print("In which language should deliverables be written?")
    langue_output = prompt("Deliverable language", langue_equipe)
    print(colored(f"  ✓ Deliverable language: {langue_output}", "green"))

    # 3. Platform selection
    step("3/8 — IDE/CLI selection")
    print("Select the IDE/CLI tools you use:\n")
    all_options = []
    print("  IDE:")
    for i, (slug, name) in enumerate(PLATFORMS["IDE"], 1):
        print(f"  {i:2d}) {name}")
        all_options.append((slug, name))
    print("\n  CLI:")
    for i, (slug, name) in enumerate(PLATFORMS["CLI"], len(PLATFORMS["IDE"]) + 1):
        print(f"  {i:2d}) {name}")
        all_options.append((slug, name))
    print(f"\n   0) Select all\n")

    platform_choice = prompt("Your choice", "0")
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
    print(colored(f"  ✓ {len(selected_platforms)} platforms selected", "green"))

    # 4. Project directory
    step("4/8 — Target project directory")
    print("Where is your project located?")
    project_dir = prompt("Project directory", ".")
    project_dir = os.path.abspath(project_dir)
    os.makedirs(project_dir, exist_ok=True)
    print(colored(f"  ✓ Project: {project_dir}", "green"))

    # 5. Output directory
    step("5/8 — Deliverable output directory")
    print("Where should agents write their deliverables?")
    output_dir = prompt("Output directory", "./assemble-output")
    print(colored(f"  ✓ Output: {project_dir}/{output_dir}", "green"))

    # 6. Agents
    step("6/8 — Agents to install")
    agent_choice = prompt("Install all 31 agents? [Y/n]", "Y")
    selected_agents = "all" if agent_choice.lower() in ("y", "o", "") else "custom"
    print(colored(f"  ✓ Agents: {selected_agents}", "green"))

    # 7. Workflows
    step("7/8 — Workflows to enable")
    wf_choice = prompt("Enable all 15 workflows? [Y/n]", "Y")
    selected_workflows = "all" if wf_choice.lower() in ("y", "o", "") else "custom"
    print(colored(f"  ✓ Workflows: {selected_workflows}", "green"))

    # 8. Confirmation
    step("8/8 — Confirmation")
    print("Summary:\n")
    print(f"  Team language  : {colored(langue_equipe, 'bold')}")
    print(f"  Output language: {colored(langue_output, 'bold')}")
    print(f"  Platforms      : {colored(', '.join(selected_platforms), 'bold')}")
    print(f"  Project        : {colored(project_dir, 'bold')}")
    print(f"  Output         : {colored(output_dir, 'bold')}")
    print(f"  Agents         : {colored(selected_agents, 'bold')}")
    print(f"  Workflows      : {colored(selected_workflows, 'bold')}")
    print()

    confirm = prompt("Start installation?", "Y")
    if confirm.lower() not in ("y", "o"):
        print("Installation cancelled.")
        sys.exit(0)

    # Generation
    step("Generating...")

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
        subprocess.run(cmd)
    elif generator_js.exists() and shutil.which("node"):
        cmd = [
            "node", str(generator_js),
            "--project", project_dir,
            "--platforms", platforms_str,
            "--lang-team", langue_equipe,
            "--lang-output", langue_output,
            "--output-dir", output_dir,
        ]
        subprocess.run(cmd)
    else:
        print(colored("  ✗ No generator available.", "red"))
        sys.exit(1)

    print()
    print(colored("═" * 55, "cyan"))
    print(colored("   ✅ Installation complete!", "green"))
    print(colored("═" * 55, "cyan"))
    print()
    print("Next steps:")
    print("  1. Open your project in your IDE")
    print("  2. Agents are ready to use")
    print("  3. Type /help to see available commands")
    print()
    print("To reconfigure: python3 install.py")
    print("To update:      python3 install.py --update")
    print()


if __name__ == "__main__":
    main()
