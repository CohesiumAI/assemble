#!/usr/bin/env python3
"""
Cohesium AI — Python wrapper for generate.js

This script delegates all generation work to the Node.js generator (generate.js).
It exists as a fallback entry point for environments where Python is available
but the user invoked install.py instead of the Node.js installer.

All platform adapters, agent definitions, skills, workflows, and orchestrator
logic live in the Node.js generator. This wrapper simply forwards CLI arguments.
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
GENERATOR_JS = SCRIPT_DIR / "generate.js"


def find_node():
    """Find Node.js executable."""
    for cmd in ("node", "node.exe"):
        if shutil.which(cmd):
            return cmd
    return None


def main():
    node = find_node()
    if not node:
        print("Error: Node.js >= 18.0.0 is required but not found.")
        print("Install it from: https://nodejs.org/")
        print("")
        print("The Python generator has been replaced by the Node.js generator")
        print("to ensure consistent output across all 20 platforms.")
        sys.exit(1)

    if not GENERATOR_JS.exists():
        print(f"Error: Generator not found at {GENERATOR_JS}")
        sys.exit(1)

    # Forward all CLI arguments to generate.js
    cmd = [node, str(GENERATOR_JS)] + sys.argv[1:]

    try:
        result = subprocess.run(cmd)
        sys.exit(result.returncode)
    except KeyboardInterrupt:
        sys.exit(130)
    except Exception as e:
        print(f"Error running generator: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
